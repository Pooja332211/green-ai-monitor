import os
import sys
import time
import json
from codecarbon import EmissionsTracker

# Add backend to path so we can import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend')))

from app.services.carbon_tracker import carbon_tracker
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models import AIModelEmission


def run_lstm():
    print("Starting LSTM Training Simulation...")
    print("=" * 50)
    
    # Initialize emissions tracker
    tracker = EmissionsTracker(project_name="LSTM Training", log_level="critical")
    tracker.start()
    
    carbon_tracker.start("LSTM Training")
    
    # Simulate LSTM training with realistic workload
    runtime_seconds = 720  # 12 minutes as per data
    print(f"Training LSTM model for {runtime_seconds} seconds...")
    
    # Small simulated work to keep CPU/memory active
    start_time = time.time()
    iteration = 0
    while time.time() - start_time < runtime_seconds:
        # Simulate training loop
        _ = sum([i**2 for i in range(1000)])
        iteration += 1
        if iteration % 100 == 0:
            elapsed = time.time() - start_time
            print(f"Progress: {elapsed:.1f}s / {runtime_seconds}s ({(elapsed/runtime_seconds)*100:.1f}%)")
    
    # Stop tracking
    emissions = tracker.stop()
    result = carbon_tracker.stop()
    
    print(f"\nLSTM Training Completed!")
    print("=" * 50)
    
    # Prepare data - use realistic values as per specification
    ai_emissions_data = {
        "model_name": "LSTM",
        "model_type": "Training",
        "hardware": "CPU/GPU",
        "runtime_minutes": 12,
        "energy_kwh": 0.02,
        "co2_kg": 0.02,
        "remarks": "Moderate ML workload"
    }
    
    print(f"Model: {ai_emissions_data['model_name']}")
    print(f"Type: {ai_emissions_data['model_type']}")
    print(f"Hardware: {ai_emissions_data['hardware']}")
    print(f"Runtime: {ai_emissions_data['runtime_minutes']} minutes")
    print(f"Energy: {ai_emissions_data['energy_kwh']} kWh")
    print(f"CO2 Emissions: {ai_emissions_data['co2_kg']} kg")
    
    # Save to database
    try:
        db = SessionLocal()
        db_emission = AIModelEmission(**ai_emissions_data)
        db.add(db_emission)
        db.commit()
        print("\nEmissions data saved to database!")
        db.close()
    except Exception as e:
        print(f"Error saving to database: {e}")
    
    if result:
        print(f"\nCodeCarbon Tracking:")
        print(f"Project: {result['project']}")
        print(f"Emissions: {result['emissions']} kg CO2")
        print(f"Duration: {result['duration']} seconds")


if __name__ == "__main__":
    run_lstm()
