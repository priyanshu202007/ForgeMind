from pydantic import BaseModel


class OutcomeCreate(BaseModel):
    incidentId: str
    actionTaken: str
    result: str
    resolutionStatus: str
    notes: str | None = None