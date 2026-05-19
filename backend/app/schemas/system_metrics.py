from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SystemMetricsBase(BaseModel):
    cpu_usage: float
    memory_usage: float
    gpu_usage: Optional[float] = None
    power_consumption: Optional[float] = None
    project: str

class SystemMetricsCreate(SystemMetricsBase):
    pass

class SystemMetrics(SystemMetricsBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True