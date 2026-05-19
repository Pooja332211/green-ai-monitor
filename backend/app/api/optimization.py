from fastapi import APIRouter
from pydantic import BaseModel
from app.services.analyzer import analyze_emission
from app.services.optimizer import generate_suggestions

router = APIRouter()

class MetricsInput(BaseModel):
    model_type: str = "ResNet-18"
    runtime_minutes: float
    co2_kg: float
    power_usage_w: float = 0
    gpu_load: float = 0
    epochs: int = 10
    batch_size: int = 64
    grid_factor: float = 450.0

@router.post("/analyze")
async def analyze(metrics: MetricsInput):
    """
    Analyze the provided emission metrics.
    """
    return analyze_emission(metrics.dict())

@router.post("/optimize")
async def optimize(metrics: MetricsInput):
    """
    Generate optimization suggestions based on the metrics.
    """
    return generate_suggestions(metrics.dict())
