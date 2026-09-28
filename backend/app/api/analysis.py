from fastapi import APIRouter, HTTPException

from app.schemas.analysis import AnalysisResponse
from app.schemas.incident import IncidentCreate
from app.services.m1_client import analyze_with_m1


router = APIRouter(tags=["analysis"])


@router.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_incident(incident: IncidentCreate):
    try:
        result = await analyze_with_m1(
            incident.model_dump(mode="json")
        )
        return result

    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc