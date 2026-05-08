from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel


class Robot(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    status: str = "idle"  # idle | moving | error
    battery: float = 100.0
    lat: float = 0.0
    lon: float = 0.0
    heading: float = 0.0
    speed: float = 0.0
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Mission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    robot_id: int = Field(foreign_key="robot.id")
    name: str
    status: str = "pending"  # pending | active | completed | aborted
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class Waypoint(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    mission_id: int = Field(foreign_key="mission.id")
    sequence: int
    lat: float
    lon: float
    label: str = ""


class TelemetryLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    robot_id: int = Field(foreign_key="robot.id")
    lat: float
    lon: float
    heading: float
    speed: float
    battery: float
    ts: datetime = Field(default_factory=datetime.utcnow)
