import json
from pathlib import Path

from incident_search import search_incidents


BASE_DIR = Path(__file__).parent
TEST_CASES_FILE = BASE_DIR / "data" / "test_cases.json"


def run_tests():
    with open(TEST_CASES_FILE, "r", encoding="utf-8") as file:
        test_cases = json.load(file)

    passed = 0
    failed = 0

    print("\nForgeMind Search Evaluation")
    print("-" * 45)

    for test in test_cases:
        test_id = test["test_id"]
        query = test["query"]
        expected_id = test["expected_incident_id"]
        expected_cause = test["expected_root_cause"]

        results = search_incidents(query, limit=5)

        top_result = results[0] if results else None

        actual_id = (
            top_result["incident_id"] if top_result else "No result"
        )

        actual_cause = (
            top_result["root_cause"] if top_result else "No result"
        )

        success = (
            actual_id == expected_id
            and actual_cause == expected_cause
        )

        if success:
            passed += 1
            status = "PASS"
        else:
            failed += 1
            status = "FAIL"

        print(f"\nTest: {test_id} - {status}")
        print(f"Query: {query}")
        print(f"Expected incident: {expected_id}")
        print(f"Retrieved incident: {actual_id}")
        print(f"Expected root cause: {expected_cause}")
        print(f"Retrieved root cause: {actual_cause}")

    print("\n" + "=" * 45)
    print(f"Total tests: {len(test_cases)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")

    accuracy = (passed / len(test_cases)) * 100 if test_cases else 0
    print(f"Top-result accuracy: {accuracy:.1f}%")


if __name__ == "__main__":
    run_tests()