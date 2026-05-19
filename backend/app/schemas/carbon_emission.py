from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CarbonEmissionBase(BaseModel):
    emissions: float
    project: str
    duration: float

class CarbonEmissionCreate(CarbonEmissionBase):
    pass

class CarbonEmission(CarbonEmissionBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True