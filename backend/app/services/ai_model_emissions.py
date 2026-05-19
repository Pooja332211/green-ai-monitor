"""Service for managing AI model emissions tracking and storage."""

from typing import Dict, List, Optional
from app.database.connection import SessionLocal
from app.models import AIModelEmission
from datetime import datetime, timedelta


class AIModelEmissionsService:
    """Service to track and retrieve AI model emissions data."""
    
    @staticmethod
    def save_emission(
        model_name: str,
        model_type: str,
        hardware: str,
        runtime_minutes: float,
        energy_kwh: float,
        co2_kg: float,
        remarks: Optional[str] = None
    ) -> Dict:
        """Save emission data for an AI model."""
        try:
            db = SessionLocal()
            emission = AIModelEmission(
                model_name=model_name,
                model_type=model_type,
                hardware=hardware,
                runtime_minutes=runtime_minutes,
                energy_kwh=energy_kwh,
                co2_kg=co2_kg,
                remarks=remarks
            )
            db.add(emission)
            db.commit()
            db.close()
            return {"status": "success", "message": f"Emissions saved for {model_name}"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    @staticmethod
    def get_all_emissions() -> List[Dict]:
        """Get all AI model emissions."""
        try:
            db = SessionLocal()
            emissions = db.query(AIModelEmission).all()
            db.close()
            return [
                {
                    "id": e.id,
                    "timestamp": e.timestamp.isoformat() if e.timestamp else None,
                    "model_name": e.model_name,
                    "model_type": e.model_type,
                    "hardware": e.hardware,
                    "runtime_minutes": e.runtime_minutes,
                    "energy_kwh": e.energy_kwh,
                    "co2_kg": e.co2_kg,
                    "remarks": e.remarks
                }
                for e in emissions
            ]
        except Exception as e:
            return []
    
    @staticmethod
    def get_emissions_by_model(model_name: str) -> List[Dict]:
        """Get emissions for a specific model."""
        try:
            db = SessionLocal()
            emissions = db.query(AIModelEmission).filter(
                AIModelEmission.model_name == model_name
            ).all()
            db.close()
            return [
                {
                    "id": e.id,
                    "timestamp": e.timestamp.isoformat() if e.timestamp else None,
                    "model_name": e.model_name,
                    "model_type": e.model_type,
                    "hardware": e.hardware,
                    "runtime_minutes": e.runtime_minutes,
                    "energy_kwh": e.energy_kwh,
                    "co2_kg": e.co2_kg,
                    "remarks": e.remarks
                }
                for e in emissions
            ]
        except Exception as e:
            return []
    
    @staticmethod
    def get_model_statistics() -> Dict:
        """Get statistics about all AI models."""
        try:
            db = SessionLocal()
            emissions = db.query(AIModelEmission).all()
            db.close()
            
            if not emissions:
                return {
                    "total_models": 0,
                    "total_co2_kg": 0,
                    "total_energy_kwh": 0,
                    "models": []
                }
            
            # Group by model
            models_dict = {}
            for e in emissions:
                if e.model_name not in models_dict:
                    models_dict[e.model_name] = {
                        "count": 0,
                        "total_co2_kg": 0,
                        "total_energy_kwh": 0,
                        "total_runtime_minutes": 0,
                        "hardware": e.hardware,
                        "model_type": e.model_type
                    }
                
                models_dict[e.model_name]["count"] += 1
                models_dict[e.model_name]["total_co2_kg"] += e.co2_kg
                models_dict[e.model_name]["total_energy_kwh"] += e.energy_kwh
                models_dict[e.model_name]["total_runtime_minutes"] += e.runtime_minutes
            
            # Calculate averages
            for model, stats in models_dict.items():
                stats["avg_co2_kg"] = round(stats["total_co2_kg"] / stats["count"], 4)
                stats["avg_energy_kwh"] = round(stats["total_energy_kwh"] / stats["count"], 4)
                stats["avg_runtime_minutes"] = round(stats["total_runtime_minutes"] / stats["count"], 2)
            
            total_co2 = sum(m["total_co2_kg"] for m in models_dict.values())
            total_energy = sum(m["total_energy_kwh"] for m in models_dict.values())
            
            return {
                "total_models": len(models_dict),
                "total_co2_kg": round(total_co2, 4),
                "total_energy_kwh": round(total_energy, 4),
                "models": models_dict
            }
        except Exception as e:
            return {"error": str(e)}
    
    @staticmethod
    def compare_models() -> Dict:
        """Compare CO2 emissions across all models."""
        try:
            db = SessionLocal()
            emissions = db.query(AIModelEmission).all()
            db.close()
            
            if not emissions:
                return {"message": "No emissions data available"}
            
            # Get latest emission for each model
            latest_by_model = {}
            for e in emissions:
                if e.model_name not in latest_by_model:
                    latest_by_model[e.model_name] = e
                elif e.timestamp > latest_by_model[e.model_name].timestamp:
                    latest_by_model[e.model_name] = e
            
            # Convert to comparable format
            comparison = {
                "models": [],
                "highest_co2": None,
                "lowest_co2": None,
                "highest_energy": None,
                "lowest_energy": None
            }
            
            co2_values = []
            energy_values = []
            
            for model_name, emission in latest_by_model.items():
                model_data = {
                    "model_name": model_name,
                    "co2_kg": emission.co2_kg,
                    "energy_kwh": emission.energy_kwh,
                    "runtime_minutes": emission.runtime_minutes,
                    "hardware": emission.hardware,
                    "efficiency_g_per_minute": round((emission.co2_kg * 1000) / emission.runtime_minutes, 2)
                }
                comparison["models"].append(model_data)
                co2_values.append(emission.co2_kg)
                energy_values.append(emission.energy_kwh)
            
            # Sort by CO2 emissions
            comparison["models"].sort(key=lambda x: x["co2_kg"], reverse=True)
            
            if co2_values:
                comparison["highest_co2"] = comparison["models"][0]["model_name"]
                comparison["lowest_co2"] = comparison["models"][-1]["model_name"]
            
            if energy_values:
                comparison["highest_energy"] = max(
                    comparison["models"], 
                    key=lambda x: x["energy_kwh"]
                )["model_name"]
                comparison["lowest_energy"] = min(
                    comparison["models"], 
                    key=lambda x: x["energy_kwh"]
                )["model_name"]
            
            return comparison
        except Exception as e:
            return {"error": str(e)}
    
    @staticmethod
    def get_emissions_trend(days: int = 7) -> List[Dict]:
        """Get emissions trend for the last N days."""
        try:
            db = SessionLocal()
            since = datetime.now() - timedelta(days=days)
            emissions = db.query(AIModelEmission).filter(
                AIModelEmission.timestamp >= since
            ).order_by(AIModelEmission.timestamp).all()
            db.close()
            
            return [
                {
                    "timestamp": e.timestamp.isoformat() if e.timestamp else None,
                    "model_name": e.model_name,
                    "co2_kg": e.co2_kg,
                    "energy_kwh": e.energy_kwh
                }
                for e in emissions
            ]
        except Exception as e:
            return []


# Singleton instance
ai_model_emissions_service = AIModelEmissionsService()
