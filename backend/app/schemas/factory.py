from pydantic import BaseModel


class Machine(BaseModel):
    machine_id: str
    name: str
    machine_type: str
    production_line: str
    status: str


class HistoricalIncident(BaseModel):
    incident_id: str
    machine_id: str
    date: str
    defect: str
    symptoms: list[str]
    root_cause: str
    resolution: str
    outcome: str
    severity: str