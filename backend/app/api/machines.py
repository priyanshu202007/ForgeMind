from fastapi import APIRouter

from app.schemas.factory import Machine
from factory_data import load_machines

router = APIRouter(prefix="/api/machines", tags=["machines"])


@router.get("", response_model=list[Machine])
def get_machines():
    return load_machines()