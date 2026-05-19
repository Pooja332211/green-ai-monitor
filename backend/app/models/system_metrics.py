from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database.connection import Base

class SystemMetrics(Base):
    __tablename__ = "system_metrics"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    cpu_usage = Column(Float, nullable=False)  # percentage
    memory_usage = Column(Float, nullable=False)  # percentage
    gpu_usage = Column(Float, nullable=True)  # percentage, if available
    power_consumption = Column(Float, nullable=True)  # watts
    project = Column(String, nullable=False)