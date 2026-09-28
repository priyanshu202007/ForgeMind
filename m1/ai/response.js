function buildAnalysisResponse({
  incidentId,
  reflection,
  historicalEvidence
}) {
  const text = reflection?.text || "";

  const recommendations = extractInvestigationSteps(text);

  return {
    incidentId,

    summary: extractSummary(text),

    recommendations,

    historicalEvidence,

    memory: {
      used: historicalEvidence.length > 0,
      retrievedCount: historicalEvidence.length
    },

    source: {
      type: "hindsight_reflection"
    }
  };
}

function extractSummary(text) {
  if (!text) {
    return "No historical analysis was returned.";
  }

  const paragraphs = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return paragraphs[0] || "No historical analysis was returned.";
}

function extractInvestigationSteps(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const steps = [];

  for (const line of lines) {
    const match = line.match(/^(?:\d+\.|-)\s+\*\*(.+?)\*\*:?\s*(.*)$/);

    if (!match) {
      continue;
    }

    steps.push({
      step: steps.length + 1,
      action: match[1].trim(),
      reason: match[2].trim() || "Derived from historical analysis."
    });
  }

  return steps;
}

module.exports = {
  buildAnalysisResponse
};