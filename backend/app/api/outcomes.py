from fastapi import APIRouter, HTTPException

from app.schemas.outcome import OutcomeCreate
from app.services.m1_client import retain_outcome_with_m1


router = APIRouter(tags=["outcomes"])


@router.post("/api/outcome")
async def record_outcome(outcome: OutcomeCreate):
    try:
        result = await retain_outcome_with_m1(
            outcome.model_dump(mode="json")
        )
        return result

    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=str(exc),
        ) from exc