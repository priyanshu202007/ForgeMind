const { hindsight, bankId } = require("./client");

const incidentReflectionSchema = {
  type: "object",
  properties: {
    summary: {
      type: "string"
    },
    likelyCauses: {
      type: "array",
      items: {
        type: "string"
      }
    },
    successfulActions: {
      type: "array",
      items: {
        type: "string"
      }
    },
    unsuccessfulActions: {
      type: "array",
      items: {
        type: "string"
      }
    },
    investigationSteps: {
      type: "array",
      items: {
        type: "string"
      }
    },
    lessonsLearned: {
      type: "array",
      items: {
        type: "string"
      }
    }
  },
  required: [
    "summary",
    "likelyCauses",
    "successfulActions",
    "unsuccessfulActions",
    "investigationSteps",
    "lessonsLearned"
  ]
};

async function reflectOnIncident(incident) {
  if (!incident) {
    throw new Error("Incident is required for reflection.");
  }

  const prompt = [
    "Analyze the current factory incident using relevant historical memory.",
    "",
    `Machine: ${incident.machineId || "unknown"}`,
    `Title: ${incident.title || ""}`,
    `Description: ${incident.description || ""}`,
    `Symptoms: ${(incident.symptoms || []).join(", ")}`,
    "",
    "Rules:",
    "- Use historical evidence when relevant.",
    "- Do not invent previous incidents or actions.",
    "- Clearly distinguish unavailable history from known history.",
    "- Prefer evidence-backed causes and actions.",
    "- Return a practical investigation sequence."
  ].join("\n");

  return hindsight.reflect(bankId, prompt, {
    response_schema: incidentReflectionSchema
  });
}

module.exports = {
  reflectOnIncident,
  incidentReflectionSchema
};