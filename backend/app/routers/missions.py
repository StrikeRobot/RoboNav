from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..db import get_session
from ..models import Mission, Robot
from ..schemas import MissionCreate, MissionRead

router = APIRouter()


@router.get("", response_model=list[MissionRead])
def list_missions(session: Session = Depends(get_session)):
    return session.exec(select(Mission).order_by(Mission.created_at.desc())).all()


@router.get("/{mission_id}", response_model=MissionRead)
def get_mission(mission_id: int, session: Session = Depends(get_session)):
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return mission


@router.post("", response_model=MissionRead, status_code=201)
def create_mission(data: MissionCreate, session: Session = Depends(get_session)):
    if not session.get(Robot, data.robot_id):
        raise HTTPException(status_code=404, detail="Robot not found")
    mission = Mission(**data.model_dump())
    session.add(mission)
    session.commit()
    session.refresh(mission)
    return mission


@router.post("/{mission_id}/start", response_model=MissionRead)
def start_mission(mission_id: int, session: Session = Depends(get_session)):
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    if mission.status != "pending":
        raise HTTPException(status_code=400, detail=f"Cannot start mission in state '{mission.status}'")
    mission.status = "active"
    mission.started_at = datetime.utcnow()
    session.add(mission)
    session.commit()
    session.refresh(mission)
    return mission


@router.post("/{mission_id}/abort", response_model=MissionRead)
def abort_mission(mission_id: int, session: Session = Depends(get_session)):
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    if mission.status not in ("pending", "active"):
        raise HTTPException(status_code=400, detail=f"Cannot abort mission in state '{mission.status}'")
    mission.status = "aborted"
    mission.completed_at = datetime.utcnow()
    robot = session.get(Robot, mission.robot_id)
    if robot:
        robot.status = "idle"
        robot.speed = 0.0
        session.add(robot)
    session.add(mission)
    session.commit()
    session.refresh(mission)
    return mission
