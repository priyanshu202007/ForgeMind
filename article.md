# Why ForgeMind Separates Hindsight Evidence from Model Reasoning

An incident report, a retrieved memory, and a model’s conclusion are three different kinds of information. If an application flattens them into one prompt and one answer, an operator cannot tell whether a proposed cause came from a prior repair, the current symptoms, or the model’s own inference. That ambiguity is especially costly in factory troubleshooting, where a plausible explanation is not the same thing as an observed history.

ForgeMind’s analysis path makes those sources explicit. Hindsight retrieves and reflects on historical experience; a separate reasoning step receives that material alongside the current incident. This structure supports provenance, but does not make hallucination impossible.

![ForgeMind dashboard showing the incident, machine, and Factory Memory areas](screenshots/01-dashboard.png)

The dashboard labels its counters as sample data; they are not operational measurements or evidence of a memory result.

## The problem with treating memory as context

A retrieved paragraph may describe another machine, symptom, or unsuccessful action. Without its identity, a caller cannot distinguish “Hindsight returned this record” from “the model inferred this explanation.”

That is why ForgeMind’s expanded M1 analysis represents a memory with fields such as `memoryId`, `summary`, `source`, `tags`, and `relevance`. The current incident remains a separate input. A recommendation can carry `evidenceMemoryIds`; when a conclusion is based only on the current incident or model reasoning, the prompt calls for an empty list. The response schema also gives warnings a source category: `hindsight`, `current_incident`, or `model_reasoning`.

This uses Hindsight’s [retain, recall, and reflect operations](https://hindsight.vectorize.io/) through the [Hindsight client](https://github.com/vectorize-io/hindsight). [Vectorize’s agent-memory overview](https://vectorize.io/what-is-agent-memory) gives broader context for treating memory as more than a prompt transcript.

## Where Hindsight sits in ForgeMind

The React form collects a machine, issue, error code, severity, and symptoms. Its request sends a generated incident ID, machine ID, timestamp, title, and description to FastAPI, with the error code appended to the description. It omits severity and a separate `symptoms` array, although the backend schema supports one. FastAPI’s `/api/analyze` forwards to M1 on port 8101.

The workspace has two distinct M1 trees. The parent repository’s `m1/` calls Hindsight recall and reflection, then derives a summary and recommendations from reflection text. The separate nested `m1-runtime/` checkout adds Groq analysis after those steps. This article’s discussion of model reasoning refers to that expanded runtime; it is a separate Git checkout and is not included in a parent-repository clone.

In the expanded runtime, the orchestration order is explicit:

```js
const recallResult = await recallRelevantIncidents(incident);
const historicalEvidence = mapHistoricalEvidence(recallResult);
const reflection = await reflectOnIncident(incident);
const aiAnalysis = await analyzeWithAI({
  incident,
  historicalEvidence,
  reflection
});
```

The pipeline maps results into evidence before passing that collection, the current incident, and Hindsight’s reflection separately to Groq.

![Incident reporting screen with machine and symptom fields](screenshots/02-incident-report.png)

## Recall is evidence, not the answer

ForgeMind builds a recall query from machine ID, title, description, and symptoms. The mapper carries each result’s ID, tags, Hindsight source, and final relevance score, removes duplicate summaries, then caps evidence at three records.

This bounded set is evidence, not a diagnosis. A `type` label comes from keyword checks such as “caused,” “replaced,” or “lesson”; it is display metadata, not a verified causal judgment.

![Factory Memory screen with its operational-memory list](screenshots/03-historical-memory.png)

The Factory Memory screenshot is not a view of Hindsight recall: its totals are hard-coded, and search calls `/api/incidents/search` over local JSON data. M1 uses Hindsight recall in the investigation path. The screen’s sample values are not evidence of Hindsight’s contents.

## Reflection and model reasoning are separate steps

After recall, ForgeMind calls `hindsight.reflect` with the current incident and a schema for a summary, likely causes, actions, investigation steps, and lessons. Its prompt says to distinguish unavailable history from known history and not invent previous incidents or actions.

The expanded runtime then builds a second prompt for Groq. It includes named sections for the current incident, Hindsight evidence, and Hindsight reflection. Its instructions say historical claims may reference only supplied memory IDs, and require `evidenceMemoryIds` on causes and recommendations. The strict JSON schema defines the response shape, including source labels for warnings.

These constraints help inspection, but are not a proof system. The schema checks that `evidenceMemoryIds` is an array of strings; the application does not verify after generation that each ID belongs to the evidence set. This supports provenance without guaranteeing every claim is correctly grounded.

There is also an API boundary gap. Expanded M1 returns `likelyCauses`, `warnings`, `lessonsLearned`, and `reflection`, but the parent FastAPI `AnalysisResponse` defines summary, recommendations, historical evidence, memory status, and source. Because `/api/analyze` declares that model, some M1 metadata does not reach the browser. The frontend renders evidence and recommendations, not every M1 field.

![FastAPI OpenAPI page listing ForgeMind analysis and outcome endpoints](screenshots/06-backend-api.png)

## Retaining outcomes changes what can be recalled

The resolution flow asks an operator to record a confirmed cause, action, outcome, and notes. On save, the frontend calls `/api/outcome`; FastAPI forwards that request to M1. The expanded runtime builds a text record from the incident ID, action taken, result, resolution status, and notes, then retains it with a stable document ID and tags:

```js
return hindsight.retain(bankId, content, {
  context: "ForgeMind factory incident outcome",
  timestamp: new Date().toISOString(),
  document_id: `incident-${outcome.incidentId}-outcome`,
  tags: [
    `incident:${outcome.incidentId}`,
    "domain:factory",
    "type:outcome"
  ]
});
```

This is the learning boundary: analysis does not automatically retain each report; an operator outcome is a distinct operation. A later query may recall it if relevant, but the code does not guarantee a particular record will return.

## A concrete incident before and after memory

Local data includes `INC-007` for `COOL-01`: reduced coolant flow, increased machining temperature, a blocked-filter cause, and a resolution that cleaned the filter and verified flow. It lives in `data/incidents.json`; report analysis does not automatically insert it into Hindsight.

Before a relevant outcome is retained, recall can return no records. The runtime maps that to an empty evidence list, and the Groq prompt says no historical Hindsight evidence was retrieved. Reflection and model reasoning can still run against the current incident, but no historical memory ID can support a history-based claim.

After M1 retains an operator outcome, a later similar report may recall it. If returned, the mapper preserves its ID and source so the prompt can associate a recommendation with that record. This is a code-path example, not a live-run result or measured improvement. The retained text omits some original incident fields, so matching depends on the action and notes as well as the later query.

## Reusable engineering lessons

1. **Keep memory inspectable.** Carry IDs, source, tags, and relevance with retrieved records; ForgeMind’s mapper gives later steps traceable evidence.
2. **Separate retrieval from reasoning.** A bounded recall set is evidence, not diagnosis. ForgeMind passes it apart from the incident and reflection before Groq analyzes them.
3. **Enforce provenance in application code.** Prompts and schemas request IDs and source labels, but ForgeMind does not validate generated IDs against the retrieval set.
4. **Retain outcomes, not every report.** ForgeMind makes cause, action, result, status, and notes an operator-retained record. Retention still does not guarantee later recall.
5. **Preserve metadata across API contracts.** M1 produces fields the FastAPI response model omits; each boundary must carry forward the metadata its next consumer needs.

## Limitations

These lessons describe code structure, not correctness guarantees: recall may return nothing, and retained text omits some incident fields. The parent `m1/` differs from the expanded nested `m1-runtime/` checkout discussed here. Also, Factory Memory searches local JSON and displays hard-coded totals; Hindsight recall happens in M1’s investigation path.

## Conclusion

ForgeMind keeps historical evidence, reflection, current incident data, and model reasoning distinct through analysis. That makes a recommendation’s origin more inspectable and shows where provenance can be lost: generated references, response contracts, or the retention-to-recall path. Hindsight supplies memory operations; the application decides what to retain and what claims to carry forward.
