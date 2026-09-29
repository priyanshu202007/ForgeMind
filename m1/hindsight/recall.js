const { hindsight, bankId } = require("./client");

async function recallRelevantIncidents(incident) {
  if (!incident) {
    throw new Error("Incident is required for recall.");
  }

  const query = [
    `Machine: ${incident.machineId || "unknown"}`,
    `Title: ${incident.title || ""}`,
    `Description: ${incident.description || ""}`,
    `Symptoms: ${(incident.symptoms || []).join(", ")}`,
    "Find historically relevant incidents, root causes, actions, and outcomes."
  ].join("\n");

  return hindsight.recall(bankId, query);
}

module.exports = {
  recallRelevantIncidents
};