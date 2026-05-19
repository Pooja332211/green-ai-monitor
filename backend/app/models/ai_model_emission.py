from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database.connection import Base


class AIModelEmission(Base):
    __tablename__ = "ai_model_emissions"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    model_name = Column(String, nullable=False)  # e.g., "ResNet-18", "BERT", "LSTM", "YOLO"
    model_type = Column(String, nullable=False)  # e.g., "Training", "Fine-Tuning", "Inference"
    hardware = Column(String, nullable=False)  # e.g., "CPU", "GPU", "CPU/GPU"
    runtime_minutes = Column(Float, nullable=False)  # Runtime in minutes
    energy_kwh = Column(Float, nullable=False)  # Energy consumed in kWh
    co2_kg = Column(Float, nullable=False)  # CO2 emissions in kg
    remarks = Column(String)  # Additional remarks/notes
