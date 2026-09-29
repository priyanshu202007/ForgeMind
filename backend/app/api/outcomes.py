import httpx
from fastapi import APIRouter, HTTPException

from app.schemas.outcome import OutcomeCreate

router = APIRouter(prefix="/api", tags=["outcomes"])
M1_OUTCOME_URL = "http://127.0.0.1:8101/api/m1/outcome"
M1_TIMEOUT_SECONDS = 15.0


@router.post("/outcome")
async def create_outcome(outcome: OutcomeCreate):
	try:
		async with httpx.AsyncClient(timeout=M1_TIMEOUT_SECONDS) as client:
			response = await client.post(
				M1_OUTCOME_URL,
				json=outcome.model_dump(mode="json"),
			)
			response.raise_for_status()
			return response.json()
	except httpx.TimeoutException as exc:
		raise HTTPException(
			status_code=504,
			detail="M1 outcome service timed out.",
		) from exc
	except httpx.HTTPStatusError as exc:
		detail = f"M1 outcome service returned HTTP {exc.response.status_code}."
		try:
			upstream_error = exc.response.json()
			upstream_detail = upstream_error.get("details")
			if isinstance(upstream_detail, str) and upstream_detail:
				detail = f"M1 outcome service failed: {upstream_detail}"
		except (ValueError, AttributeError):
			pass
		raise HTTPException(
			status_code=502,
			detail=detail,
		) from exc
	except httpx.RequestError as exc:
		raise HTTPException(
			status_code=502,
			detail="Could not reach the M1 outcome service.",
		) from exc
	except ValueError as exc:
		raise HTTPException(
			status_code=502,
			detail="M1 outcome service returned invalid JSON.",
		) from exc
