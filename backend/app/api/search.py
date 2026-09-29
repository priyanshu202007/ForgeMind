from fastapi import APIRouter

from app.schemas.search import IncidentSearchRequest
from incident_search import search_incidents

router = APIRouter(
    prefix="/api/incidents",
    tags=["incidents"],
)


@router.post("/search")
def search_historical_incidents(request: IncidentSearchRequest):
    return search_incidents(
        query=request.query,
        machine_id=request.machine_id,
        severity=request.severity,
        limit=request.limit,
    )