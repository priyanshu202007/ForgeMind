require("dotenv").config();

const http = require("http");

const {
  analyzeIncidentWithMemory,
  retainIncidentOutcome
} = require("../services/incidentMemoryService");

const HOST = process.env.M1_HOST || "0.0.0.0";
const PORT = Number(process.env.M1_PORT || 8101);

function sendJson(response, statusCode, payload) {
  const body = JSON.stringify(payload);

  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body)
  });

  response.end(body);
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 1024 * 1024) {
        reject(new Error("Request body too large."));
        request.destroy();
      }
    });

    request.on("end", () => {
      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });

    request.on("error", reject);
  });
}

function validateIncident(incident) {
  if (!incident || typeof incident !== "object") {
    return "Incident payload must be an object.";
  }

  const required = [
    "incidentId",
    "machineId",
    "timestamp",
    "title",
    "description"
  ];

  for (const field of required) {
    if (!incident[field]) {
      return `${field} is required.`;
    }
  }

  if (
    incident.symptoms !== undefined &&
    !Array.isArray(incident.symptoms)
  ) {
    return "symptoms must be an array.";
  }

  return null;
}

function validateOutcome(outcome) {
  if (!outcome || typeof outcome !== "object") {
    return "Outcome payload must be an object.";
  }

  if (!outcome.incidentId) {
    return "incidentId is required.";
  }

  return null;
}

const server = http.createServer(async (request, response) => {
  try {
    if (request.method === "GET" && request.url === "/api/m1/health") {
      sendJson(response, 200, {
        service: "forgemind-m1",
        status: "ok"
      });
      return;
    }

    if (
      request.method === "POST" &&
      request.url === "/api/m1/analyze"
    ) {
      const incident = await readJsonBody(request);
      const validationError = validateIncident(incident);

      if (validationError) {
        sendJson(response, 400, {
          error: validationError
        });
        return;
      }

      const result = await analyzeIncidentWithMemory(incident);

      sendJson(response, 200, result);
      return;
    }

    if (
      request.method === "POST" &&
      request.url === "/api/m1/outcome"
    ) {
      const outcome = await readJsonBody(request);
      const validationError = validateOutcome(outcome);

      if (validationError) {
        sendJson(response, 400, {
          error: validationError
        });
        return;
      }

      const result = await retainIncidentOutcome(outcome);

      sendJson(response, 200, {
        success: true,
        incidentId: outcome.incidentId,
        memory: result
      });
      return;
    }

    sendJson(response, 404, {
      error: "Route not found."
    });
  } catch (error) {
    console.error("M1 API error:", error);

    sendJson(response, 500, {
      error: "M1 service failed.",
      message: error.message
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(
    `ForgeMind M1 service listening on http://localhost:${PORT}`
  );
});