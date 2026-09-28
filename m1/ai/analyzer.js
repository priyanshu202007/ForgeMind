const { groq } = require("./client");
const { buildIncidentAnalysisPrompt } = require("./prompts");

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summary: {
      type: "string"
    },
    likelyCauses: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          cause: {
            type: "string"
          },
          evidenceMemoryIds: {
            type: "array",
            items: {
              type: "string"
            }
          }
        },
        required: ["cause", "evidenceMemoryIds"]
      }
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          step: {
            type: "integer"
          },
          action: {
            type: "string"
          },
          reason: {
            type: "string"
          },
          evidenceMemoryIds: {
            type: "array",
            items: {
              type: "string"
            }
          }
        },
        required: [
          "step",
          "action",
          "reason",
          "evidenceMemoryIds"
        ]
      }
    },
    warnings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          text: {
            type: "string"
          },
          source: {
            type: "string",
            enum: [
              "hindsight",
              "current_incident",
              "model_reasoning"
            ]
          }
        },
        required: ["text", "source"]
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
    "recommendations",
    "warnings",
    "lessonsLearned"
  ]
};

async function analyzeWithAI({
  incident,
  historicalEvidence,
  reflection
}) {
  const prompt = buildIncidentAnalysisPrompt({
    incident,
    historicalEvidence,
    reflection
  });

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
    messages: [
      {
        role: "system",
        content:
          [
            "You are a precise industrial incident-analysis assistant.",
            "Return only JSON matching the supplied schema.",
            "Never invent historical events, previous actions, or machine outcomes.",
            "Use evidenceMemoryIds only for claims grounded in supplied Hindsight evidence.",
            "Warnings based on general engineering reasoning must use source=model_reasoning.",
            "Warnings grounded in supplied Hindsight evidence must use source=hindsight.",
            "Facts directly stated in the current incident must use source=current_incident."
          ].join(" ")
      },
      {
        role: "user",
        content: prompt
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "forgemind_incident_analysis",
        strict: true,
        schema: analysisSchema
      }
    }
  });

  const content = response?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned an empty analysis response.");
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(
      `Groq returned invalid JSON: ${error.message}`
    );
  }
}

module.exports = {
  analyzeWithAI,
  analysisSchema
};