const { hindsight, bankId } = require("./client");

async function reflectOnIncident(incident) {
  if (!incident) {
    throw new Error("Incident is required for reflection.");
  }

  const prompt = [
    `Analyze this factory incident:`,
    `Machine: ${incident.machineId || "unknown"}`,
    `Title: ${incident.title || ""}`,
    `Description: ${incident.description || ""}`,
    `Symptoms: ${(incident.symptoms || []).join(", ")}`,
    "",
    "Use relevant historical memory to identify:",
    "1. likely causes",
    "2. previously successful actions",
    "3. previously unsuccessful actions",
    "4. recommended investigation sequence",
    "5. lessons that should be retained for future incidents"
  ].join("\n");

  return hindsight.reflect(bankId, prompt);
}

module.exports = {
  reflectOnIncident
};