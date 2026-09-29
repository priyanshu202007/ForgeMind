from fastapi import FastAPI
from app.api.search import router as search_router
from app.api.machines import router as machines_router
from app.api.incidents import router as incidents_router
from app.api.analysis import router as analysis_router

app = FastAPI(
    title="ForgeMind API",
    description="Backend API for ForgeMind Factory Memory",
    version="0.1.0",
)

app.include_router(machines_router)
app.include_router(incidents_router)
app.include_router(search_router)
app.include_router(analysis_router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}