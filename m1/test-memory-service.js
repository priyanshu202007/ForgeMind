require("dotenv").config();

const {
  analyzeIncidentWithMemory,
  retainIncidentOutcome
} = require("./services/incidentMemoryService");

const incident = {
  incidentId: "INC-002",
  machineId: "CNC-001",
  timestamp: "2026-09-28T12:00:00Z",
  title: "Spindle overheating again",
  description:
    "CNC-001 spindle temperature rises after several hours of operation.",
  symptoms: [
    "spindle temperature rising",
    "coolant flow reduced"
  ],
  context: {
    operatorNotes:
      "The same machine experienced a similar overheating incident previously."
  }
};

async function main() {
  console.log("\n=== FORGEMIND MEMORY SERVICE ===");

  const analysis = await analyzeIncidentWithMemory(incident);

  console.dir(analysis, { depth: 10 });

  console.log("\n=== RETAINING OUTCOME ===");

  const outcome = {
    incidentId: "INC-002",
    actionTaken: "Replaced coolant filter",
    result: "Overheating stopped",
    resolutionStatus: "resolved",
    notes:
      "The historical recommendation matched the successful resolution."
  };

  const retainedOutcome = await retainIncidentOutcome(outcome);

  console.dir(retainedOutcome, { depth: 5 });
}

main().catch((error) => {
  console.error("\nForgeMind memory service failed.");
  console.error(error);
  process.exit(1);
});