from fastapi import FastAPI

app = FastAPI(
    title="ForgeMind API",
    description="Backend API for ForgeMind Factory Memory",
    version="0.1.0",
)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}