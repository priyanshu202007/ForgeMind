require("dotenv").config();

const {
  analyzeIncidentWithMemory,
  retainIncidentOutcome
} = require("./services/incidentMemoryService");

const incidents = [
  {
    incidentId: "LEARN-001",
    machineId: "CNC-002",
    timestamp: new Date().toISOString(),
    title: "Initial spindle overheating",
    description:
      "CNC-002 spindle temperature rises after extended operation and coolant flow is lower than normal.",
    symptoms: [
      "spindle temperature rising",
      "reduced coolant flow"
    ],
    context: {
      operatorNotes:
        "First recorded incident for this learning test."
    }
  },

  {
    incidentId: "LEARN-002",
    machineId: "CNC-002",
    timestamp: new Date().toISOString(),
    title: "Recurring spindle temperature rise",
    description:
      "CNC-002 again shows elevated spindle temperature after several hours with reduced coolant circulation.",
    symptoms: [
      "spindle overheating",
      "reduced coolant circulation"
    ],
    context: {
      operatorNotes:
        "Similar symptoms observed after the previous incident."
    }
  },

  {
    incidentId: "LEARN-003",
    machineId: "CNC-002",
    timestamp: new Date().toISOString(),
    title: "Repeated spindle overheating",
    description:
      "CNC-002 develops spindle temperature rise during extended operation and coolant flow appears restricted.",
    symptoms: [
      "temperature rise",
      "restricted coolant flow"
    ],
    context: {
      operatorNotes:
        "Operator reports that this resembles previous incidents."
    }
  }
];

const outcomes = [
  {
    incidentId: "LEARN-001",
    actionTaken:
      "Inspected and replaced the partially blocked coolant filter.",
    result:
      "Coolant flow returned to normal and spindle temperature stabilized.",
    resolutionStatus: "resolved",
    notes:
      "Filter blockage was confirmed during inspection."
  },

  {
    incidentId: "LEARN-002",
    actionTaken:
      "Inspected coolant flow and replaced the coolant filter.",
    result:
      "Coolant circulation improved and spindle temperature stabilized.",
    resolutionStatus: "resolved",
    notes:
      "The same corrective action resolved the recurring issue."
  }
];

async function analyzeStage(number, incident) {
  console.log("\n========================================");
  console.log(`LEARNING STAGE ${number}: ${incident.incidentId}`);
  console.log("========================================");

  const result = await analyzeIncidentWithMemory(incident);

  console.log("\nMemory used:", result.memory.used);
  console.log("Historical memories:", result.memory.retrievedCount);

  console.log("\nHistorical evidence:");

  for (const evidence of result.historicalEvidence) {
    console.log(
      `- [${evidence.type}] ${evidence.summary}`
    );
  }

  console.log("\nLikely causes:");

  for (const cause of result.likelyCauses) {
    console.log(`- ${cause.cause}`);
    console.log(
      `  Evidence: ${cause.evidenceMemoryIds.join(", ") || "none"}`
    );
  }

  console.log("\nRecommendations:");

  for (const recommendation of result.recommendations) {
    console.log(
      `${recommendation.step}. ${recommendation.action}`
    );
    console.log(`   Reason: ${recommendation.reason}`);
    console.log(
      `   Evidence: ${
        recommendation.evidenceMemoryIds.join(", ") || "none"
      }`
    );
  }

  return result;
}

async function main() {
  console.log("\n========================================");
  console.log("FORGEMIND MEMORY LEARNING TEST");
  console.log("========================================");

  // Stage 1
  await analyzeStage(1, incidents[0]);

  console.log("\n>>> RETAINING OUTCOME FOR LEARN-001");

  const outcome1 = await retainIncidentOutcome(outcomes[0]);

  console.log(
    "Outcome retention:",
    outcome1?.success ?? true
  );

  // Stage 2
  await analyzeStage(2, incidents[1]);

  console.log("\n>>> RETAINING OUTCOME FOR LEARN-002");

  const outcome2 = await retainIncidentOutcome(outcomes[1]);

  console.log(
    "Outcome retention:",
    outcome2?.success ?? true
  );

  // Stage 3
  await analyzeStage(3, incidents[2]);

  console.log("\n========================================");
  console.log("LEARNING TEST COMPLETE");
  console.log("========================================");
}

main().catch((error) => {
  console.error("\nForgeMind learning test failed.");
  console.error(error);
  process.exit(1);
});