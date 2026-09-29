
"""ForgeMind factory domain rules.

Provides transparent, deterministic risk classification.
This module does not control machines or predict failures.
"""

from typing import Any


VALID_SEVERITIES = {"low", "medium", "high"}

RISK_GUIDANCE = {
    "low": "Routine monitoring and follow-up.",
    "medium": "Review the incident and schedule corrective action.",
    "high": "Escalate to authorized factory personnel for review.",
}


def assess_incident(incident: dict[str, Any]) -> dict[str, Any]:
    """Return a structured risk assessment for one incident."""

    required_fields = {
        "incident_id",
        "machine_id",
        "severity",
        "defect",
        "root_cause",
        "resolution",
        "outcome",
    }

    missing = required_fields - incident.keys()

    if missing:
        raise ValueError(
            f"Incident is missing required fields: {sorted(missing)}"
        )

    severity = str(incident["severity"]).strip().lower()

    if severity not in VALID_SEVERITIES:
        raise ValueError(f"Invalid incident severity: {severity}")

    return {
        "incident_id": incident["incident_id"],
        "machine_id": incident["machine_id"],
        "risk_level": severity,
        "defect": incident["defect"],
        "root_cause": incident["root_cause"],
        "resolution": incident["resolution"],
        "outcome": incident["outcome"],
        "recommended_action": RISK_GUIDANCE[severity],
        "source": "historical_incident",
        "requires_human_review": severity == "high",
    }


if __name__ == "__main__":
    from factory_data import load_incidents

    incidents = load_incidents()

    print("ForgeMind Factory Risk Assessment")
    print("-" * 40)

    for incident in incidents:
        assessment = assess_incident(incident)

        print(
            assessment["incident_id"],
            "| Risk:", assessment["risk_level"],
            "| Human review:", assessment["requires_human_review"],
        )