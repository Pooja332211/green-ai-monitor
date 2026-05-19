from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas import CarbonEmissionCreate, SystemMetricsCreate
from app.services import carbon_tracker, system_monitor
from app.models import CarbonEmission, SystemMetrics

router = APIRouter()

@router.post("")
@router.post("/")
def handle_tracking(data: dict, db: Session = Depends(get_db)):
    action = data.get("action")
    project = data.get("project", "Default Project")
    
    try:
        if action == "start":
            carbon_tracker.start_tracking(project)
            system_monitor.start_monitoring(project)
            return {"message": f"Tracking started for project {project}"}
        elif action == "stop":
            emissions = carbon_tracker.stop_tracking()
            metrics = system_monitor.stop_monitoring()
            
            # Save emissions to DB
            if emissions:
                try:
                    db_emission = CarbonEmission(**emissions)
                    db.add(db_emission)
                except Exception as e:
                    print(f"Error saving emissions: {e}")
            
            # Save system metrics to DB
            if metrics:
                # Filter metrics to match model fields
                allowed_keys = ["cpu_usage", "memory_usage", "gpu_usage", "power_consumption", "project"]
                filtered_metrics = {k: v for k, v in metrics.items() if k in allowed_keys}
                try:
                    db_metric = SystemMetrics(**filtered_metrics)
                    db.add(db_metric)
                except Exception as e:
                    print(f"Error saving metrics: {e}")
                
            db.commit()
            return {
                "message": "Tracking stopped",
                "emissions": emissions,
                "metrics": metrics
            }
    except Exception as e:
        return {"error": f"Failed to handle tracking {action}: {str(e)}"}
    return {"message": "Invalid action"}

@router.get("/current")
def get_current_data():
    carbon = carbon_tracker.get_current_emissions()
    system = system_monitor.get_current_metrics()
    return {"carbon": carbon, "system": system}