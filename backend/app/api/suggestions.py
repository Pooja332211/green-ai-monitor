from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models import CarbonEmission, SystemMetrics

router = APIRouter()

@router.get("/")
def get_optimization_suggestions(project: str, db: Session = Depends(get_db)):
    # Simple logic for suggestions based on data
    suggestions = []

    # Check carbon emissions
    emissions = db.query(CarbonEmission).filter(CarbonEmission.project == project).all()
    if emissions:
        avg_emissions = sum(e.emissions for e in emissions) / len(emissions)
        if avg_emissions > 1.0:  # arbitrary threshold
            suggestions.append("Consider using more energy-efficient hardware or optimizing code for lower carbon footprint.")

    # Check system metrics
    metrics = db.query(SystemMetrics).filter(SystemMetrics.project == project).all()
    if metrics:
        avg_cpu = sum(m.cpu_usage for m in metrics) / len(metrics)
        avg_mem = sum(m.memory_usage for m in metrics) / len(metrics)
        if avg_cpu > 80:
            suggestions.append("High CPU usage detected. Consider optimizing algorithms or using parallel processing.")
        if avg_mem > 80:
            suggestions.append("High memory usage detected. Consider memory optimization techniques.")

    return {"suggestions": suggestions}