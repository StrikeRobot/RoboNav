import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import create_tables
from .events import seed_robots
from .routers import robots, missions, waypoints, telemetry
from .routers import ws as ws_router
from .services.simulator import simulation_loop


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    seed_robots()
    task = asyncio.create_task(simulation_loop())
    yield
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass


app = FastAPI(title="RoboNav API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(robots.router, prefix="/api/robots", tags=["robots"])
app.include_router(missions.router, prefix="/api/missions", tags=["missions"])
app.include_router(waypoints.router, prefix="/api/missions", tags=["waypoints"])
app.include_router(telemetry.router, prefix="/api/telemetry", tags=["telemetry"])
app.include_router(ws_router.router, prefix="/ws", tags=["websocket"])


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
