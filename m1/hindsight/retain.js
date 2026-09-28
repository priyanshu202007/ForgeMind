const { hindsight, bankId } = require("./client");

async function retainIncident(incident) {
  if (!incident || !incident.incidentId) {
    throw new Error("A valid incident with incidentId is required.");
  }

  const content = [
    `Incident ID: ${incident.incidentId}`,
    `Machine ID: ${incident.machineId || "unknown"}`,
    `Title: ${incident.title || "untitled"}`,
    `Description: ${incident.description || ""}`,
    `Symptoms: ${(incident.symptoms || []).join(", ")}`,
    `Context: ${JSON.stringify(incident.context || {})}`
  ].join("\n");

  return hindsight.retain(bankId, content, {
    context: "ForgeMind factory incident",
    timestamp: incident.timestamp || new Date().toISOString(),
    tags: [
      `incident:${incident.incidentId}`,
      `machine:${incident.machineId || "unknown"}`,
      "domain:factory"
    ]
  });
}

module.exports = {
  retainIncident
};