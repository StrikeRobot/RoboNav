import asyncio
import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from ..services.telemetry_hub import hub

router = APIRouter()


@router.websocket("/telemetry/{robot_id}")
async def ws_telemetry(websocket: WebSocket, robot_id: int):
    await websocket.accept()
    q = hub.subscribe(robot_id)
    try:
        while True:
            try:
                frame = await asyncio.wait_for(q.get(), timeout=25.0)
                await websocket.send_text(json.dumps(frame))
            except asyncio.TimeoutError:
                await websocket.send_text(json.dumps({"ping": True}))
    except (WebSocketDisconnect, Exception):
        pass
    finally:
        hub.unsubscribe(robot_id, q)
