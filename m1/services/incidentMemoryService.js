const { recallRelevantIncidents } = require("../hindsight/recall");
const { reflectOnIncident } = require("../hindsight/reflect");
const { hindsight, bankId } = require("../hindsight/client");
const { buildAnalysisResponse } = require("../ai/response");

const MAX_HISTORICAL_EVIDENCE = 3;

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function inferEvidenceType(text) {
  const lower = normalizeText(text).toLowerCase();

  if (
    lower.includes("caused") ||
    lower.includes("cause") ||
    lower.includes("due to")
  ) {
    return "root_cause";
  }

  if (
    lower.includes("resolved") ||
    lower.includes("replaced") ||
    lower.includes("restored")
  ) {
    return "successful_action";
  }

  if (
    lower.includes("lesson") ||
    lower.includes("inspect") ||
    lower.includes("before")
  ) {
    return "lesson";
  }

  return "historical_context";
}

function buildEvidenceKey(item) {
  const text = normalizeText(item?.text).toLowerCase();

  return text
    .replace(/\| when:.*$/i, "")
    .replace(/\s+/g, " ")
    .replace(/[.,:;]+/g, "")
    .trim();
}

function buildClaimKey(type, summary) {
  const normalized = normalizeText(summary)
    .toLowerCase()
    .replace(/\| when:.*$/i, "")
    .replace(/\s+/g, " ")
    .replace(/[.,:;]+/g, "")
    .trim();

  return `${type}:${normalized}`;
}

function mapHistoricalEvidence(recallResult) {
  const results = Array.isArray(recallResult?.results)
    ? recallResult.results
    : [];

  const seenClaims = new Set();
  const normalized = [];

  for (const item of results) {
    const summary = normalizeText(item?.text);

    if (!summary) {
      continue;
    }

    const type = inferEvidenceType(summary);
    const claimKey = buildClaimKey(type, summary);

    if (seenClaims.has(claimKey)) {
      continue;
    }

    seenClaims.add(claimKey);

    normalized.push({
      memoryId: item.id,
      relevance:
        typeof item.scores?.final === "number"
          ? item.scores.final
          : null,
      type,
      summary,
      source: "hindsight",
      tags: Array.isArray(item.tags) ? item.tags : []
    });
  }

  return normalized
    .sort(
      (a, b) =>
        (b.relevance ?? -Infinity) - (a.relevance ?? -Infinity)
    )
    .slice(0, MAX_HISTORICAL_EVIDENCE);
}

async function analyzeIncidentWithMemory(incident) {
  if (!incident?.incidentId) {
    throw new Error("incidentId is required.");
  }

  const recallResult = await recallRelevantIncidents(incident);

  const historicalEvidence = mapHistoricalEvidence(recallResult);

  const reflection = await reflectOnIncident(incident);

  return buildAnalysisResponse({
  incidentId: incident.incidentId,
  reflection,
  historicalEvidence
});
}
async function retainIncidentOutcome(outcome) {
  if (!outcome?.incidentId) {
    throw new Error("incidentId is required.");
  }

  const content = [
    "ForgeMind factory incident outcome",
    `Incident ID: ${outcome.incidentId}`,
    `Action taken: ${outcome.actionTaken || "unknown"}`,
    `Result: ${outcome.result || "unknown"}`,
    `Resolution status: ${outcome.resolutionStatus || "unknown"}`,
    `Notes: ${outcome.notes || ""}`
  ].join("\n");

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
}

module.exports = {
  analyzeIncidentWithMemory,
  retainIncidentOutcome,
  mapHistoricalEvidence
};