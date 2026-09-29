from pydantic import BaseModel, Field


class Recommendation(BaseModel):
    step: int
    action: str
    reason: str

class HistoricalEvidence(BaseModel):
    memoryId: str
    relevance: float
    type: str
    summary: str
    source: str
    tags: list[str] = Field(default_factory=list)


class MemoryInfo(BaseModel):
    used: bool
    retrievedCount: int = Field(ge=0)


class AnalysisResponse(BaseModel):
    incidentId: str
    summary: str
    recommendations: list[Recommendation] = Field(default_factory=list)
    historicalEvidence: list[HistoricalEvidence] = Field(default_factory=list)
    memory: MemoryInfo