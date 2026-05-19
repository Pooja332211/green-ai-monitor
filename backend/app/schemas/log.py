from pydantic import BaseModel
from datetime import datetime

class LogBase(BaseModel):
    level: str
    message: str
    project: str
    source: str

class LogCreate(LogBase):
    pass

class Log(LogBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True