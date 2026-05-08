from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..db import get_session
from ..models import Mission, Waypoint
from ..schemas import WaypointCreate, WaypointRead

router = APIRouter()


@router.get("/{mission_id}/waypoints", response_model=list[WaypointRead])
def list_waypoints(mission_id: int, session: Session = Depends(get_session)):
    return session.exec(
        select(Waypoint)
        .where(Waypoint.mission_id == mission_id)
        .order_by(Waypoint.sequence)
    ).all()


@router.post("/{mission_id}/waypoints", response_model=WaypointRead, status_code=201)
def add_waypoint(
    mission_id: int, data: WaypointCreate, session: Session = Depends(get_session)
):
    if not session.get(Mission, mission_id):
        raise HTTPException(status_code=404, detail="Mission not found")
    last = session.exec(
        select(Waypoint)
        .where(Waypoint.mission_id == mission_id)
        .order_by(Waypoint.sequence.desc())
    ).first()
    seq = (last.sequence + 1) if last else 1
    wp = Waypoint(mission_id=mission_id, sequence=seq, **data.model_dump())
    session.add(wp)
    session.commit()
    session.refresh(wp)
    return wp


@router.delete("/{mission_id}/waypoints/{waypoint_id}", status_code=204)
def delete_waypoint(
    mission_id: int, waypoint_id: int, session: Session = Depends(get_session)
):
    wp = session.get(Waypoint, waypoint_id)
    if not wp or wp.mission_id != mission_id:
        raise HTTPException(status_code=404, detail="Waypoint not found")
    session.delete(wp)
    session.commit()
