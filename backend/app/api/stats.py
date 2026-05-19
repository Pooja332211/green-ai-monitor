from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.connection import get_db
from app.models import CarbonEmission, SystemMetrics, AIModelEmission
from app.services.system_monitor import system_monitor
from app.services import ai_emission_service

router = APIRouter()

@router.get("/carbon/total")
def get_total_carbon_emissions(project: str = None, db: Session = Depends(get_db)):
    query = db.query(func.sum(CarbonEmission.emissions))
    if project:
        query = query.filter(CarbonEmission.project == project)
    total = query.scalar() or 0
    return {"total_emissions": total}

@router.get("/carbon/average")
def get_average_carbon_emissions(project: str = None, db: Session = Depends(get_db)):
    query = db.query(func.avg(CarbonEmission.emissions))
    if project:
        query = query.filter(CarbonEmission.project == project)
    avg = query.scalar() or 0
    return {"average_emissions": avg}

@router.get("/system/average")
def get_average_system_metrics(project: str = None, db: Session = Depends(get_db)):
    query = db.query(
        func.avg(SystemMetrics.cpu_usage),
        func.avg(SystemMetrics.memory_usage),
        func.avg(SystemMetrics.gpu_usage),
        func.avg(SystemMetrics.power_consumption)
    )
    if project:
        query = query.filter(SystemMetrics.project == project)
    avg_cpu, avg_mem, avg_gpu, avg_power = query.first()
    return {
        "average_cpu": avg_cpu or 0,
        "average_memory": avg_mem or 0,
        "average_gpu": avg_gpu or 0,
        "average_power": avg_power or 0
    }

@router.get("/live")
def get_live_metrics():
    return system_monitor.get_current_metrics()

@router.get("/status")
def get_monitoring_status():
    return {"active": system_monitor.monitoring}

@router.get("/projects")
def get_projects(db: Session = Depends(get_db)):
    carbon_projects = db.query(CarbonEmission.project).distinct().all()
    system_projects = db.query(SystemMetrics.project).distinct().all()
    projects = set([p[0] for p in carbon_projects] + [p[0] for p in system_projects])
    return {"projects": list(projects)}

@router.get("/emissions")
def list_ai_emissions(db: Session = Depends(get_db)):
    return ai_emission_service.get_all_emissions(db)

@router.get("/emissions/{model_name}")
def get_ai_emission_detail(model_name: str, db: Session = Depends(get_db)):
    emission = ai_emission_service.get_emission_by_model(model_name, db)
    if not emission:
        return {"error": "Model not found"}, 404
    return emission
