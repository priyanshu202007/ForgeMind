from typing import Any

from pydantic import BaseModel, Field


class Recommendation(BaseModel):
    step: int
    action: str
    reason: str


class HistoricalEvidence(BaseModel):
    memoryId: str
    relevance: str
    summary: str
    outcome: str
    source: str


class MemoryInfo(BaseModel):
    used: bool
    retrievedCount: int = Field(ge=0)


class AnalysisResponse(BaseModel):
    incidentId: str
    summary: str
    likelyCauses: Any
    recommendations: Any
    warnings: Any
    lessonsLearned: Any
    historicalEvidence: Any
    memory: Any
    reflection: Any