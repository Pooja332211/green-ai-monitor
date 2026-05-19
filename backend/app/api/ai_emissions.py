"""API endpoints for AI model emissions tracking."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models import AIModelEmission
from app.services import ai_model_emissions_service
from typing import Optional

router = APIRouter()


@router.get("/ai-models/all")
def get_all_ai_emissions(db: Session = Depends(get_db)):
    """Get all AI model emissions data."""
    return {
        "status": "success",
        "data": ai_model_emissions_service.get_all_emissions()
    }


@router.get("/ai-models/{model_name}")
def get_model_emissions(model_name: str, db: Session = Depends(get_db)):
    """Get emissions for a specific AI model."""
    emissions = ai_model_emissions_service.get_emissions_by_model(model_name)
    return {
        "status": "success" if emissions else "no_data",
        "model_name": model_name,
        "data": emissions
    }


@router.get("/ai-models/statistics/overview")
def get_ai_statistics(db: Session = Depends(get_db)):
    """Get statistics about AI model emissions."""
    stats = ai_model_emissions_service.get_model_statistics()
    return {
        "status": "success",
        "data": stats
    }


@router.get("/ai-models/comparison/all")
def compare_ai_models(db: Session = Depends(get_db)):
    """Compare CO2 emissions across all AI models."""
    comparison = ai_model_emissions_service.compare_models()
    return {
        "status": "success",
        "data": comparison
    }


@router.get("/ai-models/trend")
def get_emissions_trend(days: int = Query(7, ge=1, le=90)):
    """Get emissions trend for the last N days."""
    trend = ai_model_emissions_service.get_emissions_trend(days)
    return {
        "status": "success",
        "days": days,
        "data": trend
    }


@router.post("/ai-models/save")
def save_ai_emission(emission_data: dict, db: Session = Depends(get_db)):
    """Save new AI model emission data."""
    try:
        result = ai_model_emissions_service.save_emission(
            model_name=emission_data.get("model_name"),
            model_type=emission_data.get("model_type"),
            hardware=emission_data.get("hardware"),
            runtime_minutes=emission_data.get("runtime_minutes"),
            energy_kwh=emission_data.get("energy_kwh"),
            co2_kg=emission_data.get("co2_kg"),
            remarks=emission_data.get("remarks")
        )
        return result
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/ai-models/summary")
def get_ai_summary(db: Session = Depends(get_db)):
    """Get a summary of all AI model emissions."""
    stats = ai_model_emissions_service.get_model_statistics()
    comparison = ai_model_emissions_service.compare_models()
    
    return {
        "status": "success",
        "summary": {
            "total_models_tracked": stats.get("total_models", 0),
            "total_co2_emissions_kg": stats.get("total_co2_kg", 0),
            "total_energy_consumed_kwh": stats.get("total_energy_kwh", 0),
            "highest_emissions_model": comparison.get("highest_co2", "N/A"),
            "lowest_emissions_model": comparison.get("lowest_co2", "N/A"),
            "model_count": len(comparison.get("models", []))
        },
        "detailed_stats": stats,
        "model_comparison": comparison
    }
