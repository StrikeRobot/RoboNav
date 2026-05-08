from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..db import get_session
from ..models import Robot
from ..schemas import RobotCreate, RobotRead

router = APIRouter()


@router.get("", response_model=list[RobotRead])
def list_robots(session: Session = Depends(get_session)):
    return session.exec(select(Robot)).all()


@router.get("/{robot_id}", response_model=RobotRead)
def get_robot(robot_id: int, session: Session = Depends(get_session)):
    robot = session.get(Robot, robot_id)
    if not robot:
        raise HTTPException(status_code=404, detail="Robot not found")
    return robot


@router.post("", response_model=RobotRead, status_code=201)
def create_robot(data: RobotCreate, session: Session = Depends(get_session)):
    robot = Robot(**data.model_dump())
    session.add(robot)
    session.commit()
    session.refresh(robot)
    return robot
