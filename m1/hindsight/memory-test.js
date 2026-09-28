require("dotenv").config();

const { retainIncident } = require("./retain");
const { recallRelevantIncidents } = require("./recall");
const { reflectOnIncident } = require("./reflect");

const incident = {
  incidentId: "INC-001",
  machineId: "CNC-001",
  timestamp: "2026-09-28T10:30:00Z",
  title: "Spindle overheating",
  description:
    "Machine spindle temperature rises after approximately three hours of operation.",
  symptoms: [
    "spindle temperature rising",
    "coolant flow reduced"
  ],
  context: {
    investigation:
      "Coolant filter was partially blocked.",
    actionTaken:
      "Filter replaced.",
    outcome:
      "Overheating stopped and machine returned to normal operation.",
    lesson:
      "For repeated spindle overheating, inspect coolant flow and filter condition before replacing spindle components."
  }
};

async function main() {
  console.log("\n--- 1. RETAIN ---");

  const retained = await retainIncident(incident);

  console.log("Memory retained.");
  console.dir(retained, { depth: 4 });

  console.log("\n--- 2. RECALL ---");

  const recalled = await recallRelevantIncidents({
    machineId: "CNC-001",
    title: "Spindle overheating",
    description:
      "CNC-001 is overheating again after several hours of operation.",
    symptoms: [
      "spindle temperature rising",
      "coolant flow reduced"
    ]
  });

  console.log("Recall result:");
  console.dir(recalled, { depth: 6 });

  console.log("\n--- 3. REFLECT ---");

  const reflection = await reflectOnIncident({
    machineId: "CNC-001",
    title: "Spindle overheating again",
    description:
      "The spindle temperature is rising after several hours of operation.",
    symptoms: [
      "temperature rising",
      "reduced coolant flow"
    ]
  });

  console.log("Reflection result:");
  console.dir(reflection, { depth: 6 });
}

main().catch((error) => {
  console.error("\nM1 Hindsight test failed.");
  console.error(error);
  process.exit(1);
});