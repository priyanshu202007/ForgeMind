
from factory_data import load_incidents


def search_incidents(
    query: str,
    machine_id: str | None = None,
    severity: str | None = None,
    limit: int = 5,
) -> list[dict]:
    """
    Search historical incidents using keyword matching.

    This is a baseline search function.
    Hindsight semantic retrieval will be integrated separately.
    """

    if not query or not query.strip():
        return []

    if limit < 1:
        return []

    incidents = load_incidents()

    query_words = set(query.lower().split())
    results = []

    for incident in incidents:
        # Optional machine filter
        if (
            machine_id
            and incident.get("machine_id") != machine_id
        ):
            continue

        # Optional severity filter
        if (
            severity
            and incident.get("severity", "").lower()
            != severity.lower()
        ):
            continue

        # Search relevant incident fields
        searchable_text = " ".join([
            incident.get("defect", ""),
            incident.get("root_cause", ""),
            " ".join(incident.get("symptoms", [])),
            incident.get("resolution", ""),
        ]).lower()

        incident_words = set(searchable_text.split())

        # Count overlapping query keywords
        matched_words = query_words.intersection(
            incident_words
        )

        score = len(matched_words)

        if score > 0:
            result = incident.copy()
            result["match_score"] = score
            results.append(result)

    # Sort by keyword match score
    results.sort(
        key=lambda item: item["match_score"],
        reverse=True,
    )

    return results[:limit]


if __name__ == "__main__":
    query = input("Describe the factory problem: ")

    matches = search_incidents(query)

    if not matches:
        print("\nNo matching historical incidents found.")

    for incident in matches:
        print("\n" + "=" * 40)
        print(f"Incident: {incident['incident_id']}")
        print(f"Defect: {incident['defect']}")
        print(f"Root cause: {incident['root_cause']}")
        print(f"Resolution: {incident['resolution']}")
        print(f"Outcome: {incident['outcome']}")
        print(f"Match score: {incident['match_score']}")