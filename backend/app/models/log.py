from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database.connection import Base

class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    level = Column(String, nullable=False)  # e.g., INFO, WARNING, ERROR
    message = Column(Text, nullable=False)
    project = Column(String, nullable=False)
    source = Column(String, nullable=False)  # e.g., carbon_tracker, system_monitor