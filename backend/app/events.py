from datetime import datetime
from sqlmodel import Session, select
from .db import engine
from .models import Robot

SEED_ROBOTS = [
    {"name": "Atlas-01", "lat": 37.7749, "lon": -122.4194},   # San Francisco
    {"name": "Nexus-02", "lat": 40.7128, "lon": -74.0060},    # New York
    {"name": "Orion-03", "lat": 51.5074, "lon": -0.1278},     # London
]


def seed_robots() -> None:
    with Session(engine) as session:
        if session.exec(select(Robot)).first():
            return
        for r in SEED_ROBOTS:
            session.add(Robot(**r, updated_at=datetime.utcnow()))
        session.commit()
