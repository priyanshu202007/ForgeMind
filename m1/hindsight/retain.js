const { hindsight, bankId } = require("./client");

function buildIncidentDocumentId(incidentId) {
  return `incident-${incidentId}`;
}

function buildIncidentContent(incident) {
  return [
    `ForgeMind factory incident`,
    `Incident ID: ${incident.incidentId}`,
    `Machine ID: ${incident.machineId || "unknown"}`,
    `Title: ${incident.title || "untitled"}`,
    `Description: ${incident.description || ""}`,
    `Symptoms: ${(incident.symptoms || []).join(", ")}`,
    `Context: ${JSON.stringify(incident.context || {})}`
  ].join("\n");
}

async function retainIncident(incident) {
  if (!incident?.incidentId) {
    throw new Error("A valid incident with incidentId is required.");
  }

  return hindsight.retain(
    bankId,
    buildIncidentContent(incident),
    {
      context: "ForgeMind factory incident",
      timestamp: incident.timestamp || new Date().toISOString(),
      document_id: buildIncidentDocumentId(incident.incidentId),
      tags: [
        `incident:${incident.incidentId}`,
        `machine:${incident.machineId || "unknown"}`,
        "domain:factory"
      ]
    }
  );
}

module.exports = {
  retainIncident,
  buildIncidentDocumentId
};