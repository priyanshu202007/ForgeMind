from fastapi import APIRouter, HTTPException

from app.schemas.factory import HistoricalIncident
from factory_data import load_incidents
from factory_rules import assess_incident

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.get("", response_model=list[HistoricalIncident])
def get_incidents():
    return load_incidents()


@router.post("/assess")
def assess_historical_incident(incident_id: str):
    incidents = load_incidents()

    for incident in incidents:
        if incident["incident_id"] == incident_id:
            return assess_incident(incident)

    raise HTTPException(
        status_code=404,
        detail=f"Incident not found: {incident_id}",
    )