import sys
import os

# Add the project root to the python path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.connection import SessionLocal
from app.models.ai_model_emission import AIModelEmission

def seed_data():
    db = SessionLocal()
    try:
        # Data to seed
        models_data = [
            {
                "model_name": "Dummy Workload",
                "model_type": "CPU",
                "runtime_minutes": 5,
                "energy_kwh": 0.002,
                "co2_kg": 0.002,
                "hardware": "CPU",
                "remarks": "Baseline idle workload"
            },
            {
                "model_name": "LSTM",
                "model_type": "Training",
                "runtime_minutes": 12,
                "energy_kwh": 0.02,
                "co2_kg": 0.02,
                "hardware": "CPU/GPU",
                "remarks": "Moderate ML workload"
            },
            {
                "model_name": "ResNet-18",
                "model_type": "Training",
                "runtime_minutes": 30,
                "energy_kwh": 0.35,
                "co2_kg": 0.45,
                "hardware": "GPU",
                "remarks": "Deep CNN training"
            },
            {
                "model_name": "DistilBERT",
                "model_type": "Fine-Tuning",
                "runtime_minutes": 50,
                "energy_kwh": 0.8,
                "co2_kg": 0.9,
                "hardware": "GPU",
                "remarks": "Transformer NLP model"
            },
            {
                "model_name": "YOLOv5-Nano",
                "model_type": "Real-Time Inference",
                "runtime_minutes": 10,
                "energy_kwh": 0.15,
                "co2_kg": 0.2,
                "hardware": "GPU",
                "remarks": "Continuous inference workload"
            }
        ]

        print("Seeding AI model emission data...")
        for data in models_data:
            # Check if already exists
            existing = db.query(AIModelEmission).filter(AIModelEmission.model_name == data["model_name"]).first()
            if not existing:
                new_emission = AIModelEmission(**data)
                db.add(new_emission)
                print(f"Added: {data['model_name']}")
            else:
                print(f"Skipping: {data['model_name']} (already exists)")
        
        db.commit()
        print("Seeding completed successfully!")
    except Exception as e:
        print(f"Error seeding data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
