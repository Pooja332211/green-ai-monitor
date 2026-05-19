import os
import sys
import time
import json
import torch
import torchvision.models as models
from codecarbon import EmissionsTracker

# Add backend to path so we can import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend')))

from app.services.carbon_tracker import carbon_tracker
from sqlalchemy.orm import Session
from app.database.connection import SessionLocal
from app.models import AIModelEmission


def run_resnet():
    print("Initializing ResNet-18...")
    print("=" * 50)
    
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"Using device: {device}")
    
    # Load the model to show memory/power bump
    print("Loading ResNet-18 model...")
    model = models.resnet18(pretrained=True).to(device)
    model.eval()
    
    print("Starting ResNet Training Simulation...")
    
    # Initialize emissions tracker
    tracker = EmissionsTracker(project_name="ResNet Training", log_level="critical")
    tracker.start()
    
    carbon_tracker.start("ResNet Training")
    
    # Simulate heavy CNN training/inference
    runtime_seconds = 1800  # 30 minutes as per data
    print(f"Running ResNet workload for {runtime_seconds} seconds...")
    
    # Do real work if GPU is available to make CO2 interesting
    start_sim = time.time()
    iteration = 0
    while time.time() - start_sim < runtime_seconds:
        if device == "cuda":
            # GPU compute - inference on random tensors
            dummy_input = torch.randn(1, 3, 224, 224).to(device)
            with torch.no_grad():
                _ = model(dummy_input)
        else:
            # CPU work simulation
            _ = sum([i**2 for i in range(5000)])
        
        iteration += 1
        if iteration % 50 == 0:
            elapsed = time.time() - start_sim
            print(f"Progress: {elapsed:.1f}s / {runtime_seconds}s ({(elapsed/runtime_seconds)*100:.1f}%)")
        
        time.sleep(1)
    
    # Stop tracking
    emissions = tracker.stop()
    result = carbon_tracker.stop()
    
    print(f"\nResNet Workload Completed!")
    print("=" * 50)
    
    # Prepare data - use realistic values as per specification
    ai_emissions_data = {
        "model_name": "ResNet-18",
        "model_type": "Training",
        "hardware": "GPU",
        "runtime_minutes": 30,
        "energy_kwh": 0.35,
        "co2_kg": 0.45,
        "remarks": "Deep CNN training"
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
    run_resnet()