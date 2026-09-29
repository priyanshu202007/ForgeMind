from datetime import datetime

from pydantic import BaseModel, Field


class IncidentContext(BaseModel):
    operatorNotes: str | None = None


class IncidentCreate(BaseModel):
    incidentId: str
    machineId: str
    timestamp: datetime
    title: str
    description: str
    symptoms: list[str] = Field(default_factory=list)
    context: IncidentContext | None = None