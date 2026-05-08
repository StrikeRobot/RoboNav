from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select
from ..db import get_session
from ..models import TelemetryLog
from ..schemas import TelemetryFrame

router = APIRouter()


@router.get("", response_model=list[TelemetryFrame])
def get_telemetry(
    robot_id: int = Query(...),
    since: Optional[datetime] = Query(None),
    limit: int = Query(200, le=1000),
    session: Session = Depends(get_session),
):
    q = select(TelemetryLog).where(TelemetryLog.robot_id == robot_id)
    if since:
        q = q.where(TelemetryLog.ts >= since)
    q = q.order_by(TelemetryLog.ts.desc()).limit(limit)
    return session.exec(q).all()
