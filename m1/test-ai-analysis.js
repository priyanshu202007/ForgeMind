require("dotenv").config();

const {
  analyzeIncidentWithMemory
} = require("./services/incidentMemoryService");

const incident = {
  incidentId: "INC-003",
  machineId: "CNC-001",
  timestamp: new Date().toISOString(),
  title: "Recurring spindle overheating",
  description:
    "CNC-001 spindle temperature rises after several hours and coolant flow appears reduced.",
  symptoms: [
    "spindle temperature rising",
    "reduced coolant flow"
  ],
  context: {
    operatorNotes:
      "Operator reports that this resembles an earlier overheating event."
  }
};

async function main() {
  console.log("\n=== FORGEMIND AI ANALYSIS ===");

  const result = await analyzeIncidentWithMemory(incident);

  console.dir(result, { depth: 10 });
}

main().catch((error) => {
  console.error("\nForgeMind AI analysis failed.");
  console.error(error);
  process.exit(1);
});