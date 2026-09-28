import os

import httpx


M1_BASE_URL = os.getenv("M1_BASE_URL", "http://localhost:8101")
M1_TIMEOUT = float(os.getenv("M1_TIMEOUT", "30.0"))


async def analyze_with_m1(incident: dict) -> dict:
    """Send an incident to the M1 AI/Hindsight service."""
    try:
        async with httpx.AsyncClient(timeout=M1_TIMEOUT) as client:
            response = await client.post(
                f"{M1_BASE_URL}/api/m1/analyze",
                json=incident,
            )
            response.raise_for_status()
            return response.json()

    except httpx.TimeoutException as exc:
        raise RuntimeError("M1 analysis service timed out.") from exc

    except httpx.HTTPStatusError as exc:
        raise RuntimeError(
            f"M1 analysis service returned HTTP {exc.response.status_code}."
        ) from exc

    except httpx.RequestError as exc:
        raise RuntimeError(
            "M1 analysis service is unavailable."
        ) from exc


async def retain_outcome_with_m1(outcome: dict) -> dict:
    """Send an incident outcome to the M1 memory service."""
    try:
        async with httpx.AsyncClient(timeout=M1_TIMEOUT) as client:
            response = await client.post(
                f"{M1_BASE_URL}/api/m1/outcome",
                json=outcome,
            )
            response.raise_for_status()
            return response.json()

    except httpx.TimeoutException as exc:
        raise RuntimeError("M1 outcome service timed out.") from exc

    except httpx.HTTPStatusError as exc:
        raise RuntimeError(
            f"M1 outcome service returned HTTP {exc.response.status_code}."
        ) from exc

    except httpx.RequestError as exc:
        raise RuntimeError(
            "M1 outcome service is unavailable."
        ) from exc