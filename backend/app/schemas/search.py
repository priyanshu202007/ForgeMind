from pydantic import BaseModel, Field


class IncidentSearchRequest(BaseModel):
    query: str
    machine_id: str | None = None
    severity: str | None = None
    limit: int = Field(default=5, ge=1, le=20)