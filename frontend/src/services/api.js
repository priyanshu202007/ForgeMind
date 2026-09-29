const API_BASE_URL =
	import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
	const response = await fetch(`${API_BASE_URL}${endpoint}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(options.headers || {}),
		},
	});

	if (!response.ok) {
		let message = `API request failed: ${response.status}`;

		try {
			const errorData = await response.json();
			message = errorData.detail || message;
		} catch {
			// Keep default error.
		}

		throw new Error(message);
	}

	if (response.status === 204) {
		return null;
	}

	return response.json();
}
function withJsonBody(payload, options = {}) {
	return {
		...options,
		body: JSON.stringify(payload),
	};
}

export function getHealth() {
	return request("/api/health");
}

export function getMachines() {
	return request("/api/machines");
}

export function getIncidents() {
	return request("/api/incidents");
}

export function searchIncidents(filters) {
	return request("/api/incidents/search", {
		...withJsonBody(filters),
		method: "POST",
	});
}


export function assessIncident(incidentId) {
	return request(
		`/api/incidents/assess?incident_id=${encodeURIComponent(incidentId)}`,
		{
			method: "POST",
		}
	);
}

export function analyzeIncident(payload) {
  return request("/api/analyze", {
    ...withJsonBody(payload),
    method: "POST",
  });
}
export function retainOutcome(payload) {
	return request("/api/outcome", {
		...withJsonBody(payload),
		method: "POST",
	});
}
