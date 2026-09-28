
import json
from pathlib import Path
from typing import Any

# Resolve data directory relative to this file.
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

MACHINES_FILE = DATA_DIR / "machines.json"
INCIDENTS_FILE = DATA_DIR / "incidents.json"
TEST_CASES_FILE = DATA_DIR / "test_cases.json"


def _load_json(file_path: Path) -> Any:
    """Load JSON data and report useful errors."""
    if not file_path.exists():
        raise FileNotFoundError(
            f"Required data file not found: {file_path}"
        )

    try:
        with file_path.open("r", encoding="utf-8") as file:
            return json.load(file)
    except json.JSONDecodeError as exc:
        raise ValueError(
            f"Invalid JSON in {file_path.name}: {exc}"
        ) from exc


def load_machines() -> list[dict]:
    """Load factory machine records."""
    data = _load_json(MACHINES_FILE)

    if not isinstance(data, list):
        raise ValueError("machines.json must contain a JSON list")

    return data


def load_incidents() -> list[dict]:
    """Load historical factory incidents."""
    data = _load_json(INCIDENTS_FILE)

    if not isinstance(data, list):
        raise ValueError("incidents.json must contain a JSON list")

    return data


def load_test_cases() -> list[dict]:
    """Load factory test cases."""
    data = _load_json(TEST_CASES_FILE)

    if not isinstance(data, list):
        raise ValueError("test_cases.json must contain a JSON list")

    return data


def validate_data() -> list[str]:
    """
    Validate required fields and machine references.

    Returns a list of validation errors.
    An empty list means validation passed.
    """
    errors = []

    machines = load_machines()
    incidents = load_incidents()

    machine_fields = {
        "machine_id",
        "name",
        "machine_type",
        "production_line",
        "status",
    }

    incident_fields = {
        "incident_id",
        "machine_id",
        "date",
        "defect",
        "symptoms",
        "root_cause",
        "resolution",
        "outcome",
        "severity",
    }

    machine_ids = set()

    for index, machine in enumerate(machines):
        missing = machine_fields - machine.keys()

        if missing:
            errors.append(
                f"Machine record {index}: missing {sorted(missing)}"
            )
            continue

        machine_id = machine["machine_id"]

        if machine_id in machine_ids:
            errors.append(
                f"Duplicate machine_id: {machine_id}"
            )

        machine_ids.add(machine_id)

    incident_ids = set()

    for index, incident in enumerate(incidents):
        missing = incident_fields - incident.keys()

        if missing:
            errors.append(
                f"Incident record {index}: missing {sorted(missing)}"
            )
            continue

        incident_id = incident["incident_id"]

        if incident_id in incident_ids:
            errors.append(
                f"Duplicate incident_id: {incident_id}"
            )

        incident_ids.add(incident_id)

        if incident["machine_id"] not in machine_ids:
            errors.append(
                f"Incident {incident_id} references "
                f"unknown machine {incident['machine_id']}"
            )

        if not isinstance(incident["symptoms"], list):
            errors.append(
                f"Incident {incident_id}: symptoms must be a list"
            )

        if incident["severity"] not in {
            "low", "medium", "high"
        }:
            errors.append(
                f"Incident {incident_id}: invalid severity"
            )

    return errors


if __name__ == "__main__":
    print("ForgeMind Factory Data Validation")
    print("-" * 40)

    machines = load_machines()
    incidents = load_incidents()
    test_cases = load_test_cases()

    print(f"Machines loaded: {len(machines)}")
    print(f"Incidents loaded: {len(incidents)}")
    print(f"Test cases loaded: {len(test_cases)}")

    errors = validate_data()

    if errors:
        print("\nValidation errors:")
        for error in errors:
            print(f"- {error}")
    else:
        print("\nAll machine and incident validations passed.")