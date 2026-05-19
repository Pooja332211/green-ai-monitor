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


def run_yolo():
    print("Starting YOLO Inference Simulation...")
    print("=" * 50)
    
    # Initialize emissions tracker
    tracker = EmissionsTracker(project_name="YOLO Inference", log_level="critical")
    tracker.start()
    
    carbon_tracker.start("YOLO Inference")
    
    # Simulate continuous real-time inference
    runtime_seconds = 600  # 10 minutes as per data
    print(f"Running YOLO inference for {runtime_seconds} seconds...")
    
    # Simulate inference loop with consistent workload
    start_time = time.time()
    frame_count = 0
    while time.time() - start_time < runtime_seconds:
        # Simulate frame processing
        _ = sum([i**2 for i in range(2000)])
        frame_count += 1
        
        if frame_count % 10 == 0:
            elapsed = time.time() - start_time
            fps = frame_count / elapsed if elapsed > 0 else 0
            print(f"Progress: {elapsed:.1f}s / {runtime_seconds}s ({(elapsed/runtime_seconds)*100:.1f}%) - Frames: {frame_count} (FPS: {fps:.1f})")
        
        time.sleep(0.05)  # ~20 FPS simulation
    
    # Stop tracking
    emissions = tracker.stop()
    result = carbon_tracker.stop()
    
    print(f"\nInference Completed!")
    print("=" * 50)
    
    # Prepare data - use realistic values as per specification
    ai_emissions_data = {
        "model_name": "YOLOv5-Nano",
        "model_type": "Real-Time Inference",
        "hardware": "GPU",
        "runtime_minutes": 10,
        "energy_kwh": 0.15,
        "co2_kg": 0.2,
        "remarks": "Continuous inference workload"
    }
    
    print(f"Model: {ai_emissions_data['model_name']}")
    print(f"Type: {ai_emissions_data['model_type']}")
    print(f"Hardware: {ai_emissions_data['hardware']}")
    print(f"Runtime: {ai_emissions_data['runtime_minutes']} minutes")
    print(f"Energy: {ai_emissions_data['energy_kwh']} kWh")
    print(f"CO2 Emissions: {ai_emissions_data['co2_kg']} kg")
    print(f"Frames Processed: {frame_count}")
    
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
    run_yolo()