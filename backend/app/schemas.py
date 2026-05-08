from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class RobotRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    status: str
    battery: float
    lat: float
    lon: float
    heading: float
    speed: float
    updated_at: datetime


class RobotCreate(BaseModel):
    name: str
    lat: float = 0.0
    lon: float = 0.0


class MissionCreate(BaseModel):
    robot_id: int
    name: str


class MissionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    robot_id: int
    name: str
    status: str
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


class WaypointCreate(BaseModel):
    lat: float
    lon: float
    label: str = ""


class WaypointRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mission_id: int
    sequence: int
    lat: float
    lon: float
    label: str


class TelemetryFrame(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    robot_id: int
    lat: float
    lon: float
    heading: float
    speed: float
    battery: float
    ts: datetime
