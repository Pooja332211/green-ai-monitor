from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.carbon_emission import CarbonEmission
from app.models.system_metrics import SystemMetrics

router = APIRouter()

@router.get("/")
def get_emission_logs(project: str = None, db: Session = Depends(get_db)):
    """Get emission history logs"""
    query = db.query(CarbonEmission)
    if project:
        query = query.filter(CarbonEmission.project == project)
    
    emissions = query.order_by(CarbonEmission.timestamp.desc()).limit(100).all()
    
    # Format for frontend
    logs = []
    for emission in emissions:
        logs.append({
            "id": emission.id,
            "timestamp": emission.timestamp.isoformat() if emission.timestamp else None,
            "emissions": emission.emissions,
            "project": emission.project,
            "duration": emission.duration
        })
    
    return {"logs": logs}

@router.get("/metrics")
def get_system_metrics_logs(project: str = None, db: Session = Depends(get_db)):
    """Get system metrics history"""
    query = db.query(SystemMetrics)
    if project:
        query = query.filter(SystemMetrics.project == project)
    
    metrics = query.order_by(SystemMetrics.timestamp.desc()).limit(100).all()
    
    return {"metrics": metrics}