from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database.connection import Base

class CarbonEmission(Base):
    __tablename__ = "carbon_emissions"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    emissions = Column(Float, nullable=False)  # in kg CO2
    project = Column(String, nullable=False)
    duration = Column(Float, nullable=False)  # in seconds