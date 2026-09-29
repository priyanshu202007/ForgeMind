const http = require("node:http");
const path = require("node:path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const {
  analyzeIncidentWithMemory,
  retainIncidentOutcome
} = require("./services/incidentMemoryService");

const PORT = 8101;
const MAX_BODY_SIZE = 1024 * 1024;

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

function getSafeErrorDetails(error) {
  let details = error instanceof Error ? error.message : "Unknown M1 error.";
  const apiKey = process.env.HINDSIGHT_API_KEY;

  if (apiKey) {
    details = details.split(apiKey).join("[redacted]");
  }

  return details;
}

async function readJsonBody(request) {
  let body = "";

  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > MAX_BODY_SIZE) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
  }

  try {
    return JSON.parse(body);
  } catch {
    const error = new Error("Invalid JSON body.");
    error.statusCode = 400;
    throw error;
  }
}

async function analyzeIncident(incident) {
  return analyzeIncidentWithMemory(incident);
}

async function retainOutcome(outcome) {
  await retainIncidentOutcome(outcome);
  return { success: true, incidentId: outcome.incidentId };
}

async function handleRequest(request, response) {
  const routeHandlers = {
    "/api/m1/analyze": analyzeIncident,
    "/api/m1/outcome": retainOutcome,
  };

  const handler = routeHandlers[request.url];

  if (!handler) {
    sendJson(response, 404, { error: "Not found." });
    return;
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendJson(response, 405, { error: "Method not allowed." });
    return;
  }

  try {
    const payload = await readJsonBody(request);

    if (
      !payload ||
      typeof payload !== "object" ||
      Array.isArray(payload) ||
      typeof payload.incidentId !== "string" ||
      !payload.incidentId.trim()
    ) {
      sendJson(response, 400, {
        error: "A non-empty incidentId is required."
      });
      return;
    }

    const result = await handler(payload);
    sendJson(response, 200, result);
  } catch (error) {
    const details = getSafeErrorDetails(error);
    const statusCode = error?.statusCode || 500;

    console.error("M1 request failed:", {
      path: request.url,
      statusCode: error?.statusCode || null,
      details,
    });

    sendJson(response, statusCode, {
      error: details,
      details
    });
  }
}

const server = http.createServer(handleRequest);

server.listen(PORT, "127.0.0.1", () => {
  console.log(`M1 service listening on http://127.0.0.1:${PORT}`);
  console.log(
    "Registered POST routes: /api/m1/analyze, /api/m1/outcome"
  );
});
