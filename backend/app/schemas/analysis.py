from typing import Any

from pydantic import BaseModel, Field


class Recommendation(BaseModel):
    step: int
    action: str
    reason: str


class HistoricalEvidence(BaseModel):
    memoryId: str
    relevance: float | None = None
    type: str | None = None
    summary: str
    source: str
    tags: list[str] = []


class MemoryInfo(BaseModel):
    used: bool
    retrievedCount: int = Field(ge=0)


class AnalysisResponse(BaseModel):
    incidentId: str
    summary: str
    recommendations: list[Recommendation] = []
    historicalEvidence: list[HistoricalEvidence] = []
    memory: MemoryInfo
    source: dict[str, Any] = {}
