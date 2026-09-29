import httpx
from fastapi import APIRouter, HTTPException

from app.schemas.analysis import AnalysisResponse
from app.schemas.incident import IncidentCreate

router = APIRouter(prefix="/api", tags=["analysis"])
M1_ANALYZE_URL = "http://localhost:8101/api/m1/analyze"
M1_TIMEOUT_SECONDS = 15.0


@router.post("/analyze")
async def analyze_incident(incident: IncidentCreate) -> AnalysisResponse:
    try:
        async with httpx.AsyncClient(timeout=M1_TIMEOUT_SECONDS) as client:
            response = await client.post(
                M1_ANALYZE_URL,
                json=incident.model_dump(mode="json"),
            )
            response.raise_for_status()
            return response.json()
    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=504,
            detail="M1 analysis service timed out.",
        ) from exc
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"M1 analysis service returned HTTP {exc.response.status_code}.",
        ) from exc
    except httpx.RequestError as exc:
        raise HTTPException(
            status_code=502,
            detail="Could not reach the M1 analysis service.",
        ) from exc
    except ValueError as exc:
        raise HTTPException(
            status_code=502,
            detail="M1 analysis service returned invalid JSON.",
        ) from exc