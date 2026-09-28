const { recallRelevantIncidents } = require("../hindsight/recall");
const { reflectOnIncident } = require("../hindsight/reflect");
const { hindsight, bankId } = require("../hindsight/client");
const { buildAnalysisResponse } = require("../ai/response");
const { analyzeWithAI } = require("../ai/analyzer");

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

  const normalized = [];

  for (const item of results) {
    const summary = normalizeText(item?.text);

    if (!summary) {
      continue;
    }

    normalized.push({
      memoryId: item.id,
      relevance:
        typeof item.scores?.final === "number"
          ? item.scores.final
          : 0,
      type: inferEvidenceType(summary),
      summary,
      source: "hindsight",
      tags: Array.isArray(item.tags) ? item.tags : []
    });
  }

  normalized.sort((a, b) => b.relevance - a.relevance);

  const groups = [];

  for (const item of normalized) {
    const canonical = item.summary
      .toLowerCase()
      .replace(/\| when:.*$/i, "")
      .replace(
        /which was subsequently replaced to resolve the issue/gi,
        ""
      )
      .replace(
        /which was replaced to resolve the issue/gi,
        ""
      )
      .replace(
        /subsequently replaced/gi,
        ""
      )
      .replace(/\s+/g, " ")
      .trim();

    const duplicateIndex = groups.findIndex(
      (existing) =>
        existing.type === item.type &&
        existing.canonical === canonical
    );

    if (duplicateIndex === -1) {
      groups.push({
        ...item,
        canonical
      });
      continue;
    }

    if (item.relevance > groups[duplicateIndex].relevance) {
      groups[duplicateIndex] = {
        ...item,
        canonical
      };
    }
  }

  return groups
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, MAX_HISTORICAL_EVIDENCE)
    .map(({ canonical, ...item }) => item);
}


async function analyzeIncidentWithMemory(incident) {
  if (!incident?.incidentId) {
    throw new Error("incidentId is required.");
  }

  const recallResult = await recallRelevantIncidents(incident);

  const historicalEvidence = mapHistoricalEvidence(recallResult);

  const reflection = await reflectOnIncident(incident);

  const aiAnalysis = await analyzeWithAI({
  incident,
  historicalEvidence,
  reflection
});

  return {
  incidentId: incident.incidentId,

  summary: aiAnalysis.summary,

  likelyCauses: aiAnalysis.likelyCauses,

  recommendations: aiAnalysis.recommendations,

  warnings: aiAnalysis.warnings,

  lessonsLearned: aiAnalysis.lessonsLearned,

  historicalEvidence,

  memory: {
    used: historicalEvidence.length > 0,
    retrievedCount: historicalEvidence.length
  },

  reflection: {
    rawText: reflection?.text || null
  }
};
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