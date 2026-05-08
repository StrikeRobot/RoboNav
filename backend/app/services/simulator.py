import asyncio
from datetime import datetime
from sqlmodel import Session, select
from ..config import settings
from ..db import engine
from ..models import Mission, Robot, Waypoint, TelemetryLog
from .geo import haversine, bearing, dest_point
from .telemetry_hub import hub


async def simulation_loop() -> None:
    tick = 1.0 / settings.sim_tick_hz
    while True:
        await asyncio.sleep(tick)
        try:
            await _tick()
        except Exception:
            pass  # keep running on transient errors


async def _tick() -> None:
    with Session(engine) as session:
        active_missions = session.exec(
            select(Mission).where(Mission.status == "active")
        ).all()

        for mission in active_missions:
            robot = session.get(Robot, mission.robot_id)
            if robot is None:
                continue

            waypoints = session.exec(
                select(Waypoint)
                .where(Waypoint.mission_id == mission.id)
                .order_by(Waypoint.sequence)
            ).all()

            if not waypoints:
                _complete_mission(session, mission, robot)
                await hub.publish(robot.id, _make_frame(robot))
                continue

            target = waypoints[0]
            dist = haversine(robot.lat, robot.lon, target.lat, target.lon)
            step = settings.sim_speed_ms / settings.sim_tick_hz

            if dist <= step + 5:
                remaining = [w for w in waypoints if w.sequence > target.sequence]
                if not remaining:
                    robot.lat, robot.lon = target.lat, target.lon
                    _complete_mission(session, mission, robot)
                    await hub.publish(robot.id, _make_frame(robot))
                    continue
                target = remaining[0]
                dist = haversine(robot.lat, robot.lon, target.lat, target.lon)

            brg = bearing(robot.lat, robot.lon, target.lat, target.lon)
            new_lat, new_lon = dest_point(robot.lat, robot.lon, brg, min(step, dist))

            robot.lat = new_lat
            robot.lon = new_lon
            robot.heading = brg
            robot.speed = settings.sim_speed_ms
            robot.status = "moving"
            robot.battery = max(0.0, robot.battery - 0.01)
            robot.updated_at = datetime.utcnow()

            log = TelemetryLog(
                robot_id=robot.id,
                lat=robot.lat,
                lon=robot.lon,
                heading=robot.heading,
                speed=robot.speed,
                battery=robot.battery,
                ts=robot.updated_at,
            )
            session.add(robot)
            session.add(log)
            session.commit()

            await hub.publish(robot.id, _make_frame(robot))


def _complete_mission(session: Session, mission: Mission, robot: Robot) -> None:
    mission.status = "completed"
    mission.completed_at = datetime.utcnow()
    robot.status = "idle"
    robot.speed = 0.0
    robot.updated_at = datetime.utcnow()
    session.add(mission)
    session.add(robot)
    session.commit()


def _make_frame(robot: Robot) -> dict:
    return {
        "robot_id": robot.id,
        "lat": robot.lat,
        "lon": robot.lon,
        "heading": robot.heading,
        "speed": robot.speed,
        "battery": robot.battery,
        "ts": robot.updated_at.isoformat(),
    }
