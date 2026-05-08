<div align="center">

```
    ╔══════════════════════╗
    ║  ◉    [GPS]    ◉   ║
    ║   ↖  ───────  ↗    ║
    ║     ↙  NAV  ↘      ║
    ╚══════════════════════╝
```

# RoboNav

**Real-time GPS navigation dashboard for autonomous robot fleets**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![Leaflet](https://img.shields.io/badge/Map-Leaflet-199900?logo=leaflet&logoColor=white)](https://leafletjs.com)

[Features](#features) &nbsp;•&nbsp; [Quick Start](#quick-start) &nbsp;•&nbsp; [Architecture](#architecture) &nbsp;•&nbsp; [Configuration](#configuration) &nbsp;•&nbsp; [Development](#development) &nbsp;•&nbsp; [Tech Stack](#tech-stack)

</div>

---

## Demo

<div align="center">

https://github.com/StrikeRobot/RoboNav/blob/master/docs/demo/20260508-0739-36.3436604.mp4

<br>

<img src="docs/demo/robonav-demo.gif" alt="RoboNav Demo" width="100%">
<br><br>
<em>Drop waypoints on the map, dispatch a mission, and watch the robot navigate in real time over WebSockets</em>
</div>

---

## Features

| Feature | Description |
|---------|-------------|
| **Interactive map** | Click anywhere on OpenStreetMap to drop waypoints and plan a route |
| **Live telemetry** | Robot position, heading, speed, and battery streamed at 2 Hz via WebSocket |
| **Fleet management** | Three pre-seeded robots across SF, New York, and London |
| **Mission lifecycle** | Create → start → abort with full status tracking in SQLite |
| **Animated compass** | Framer Motion compass dial follows the robot's real-time heading |
| **Trail rendering** | Amber polyline traces the robot's path as it moves |
| **Battery gauge** | Animated SVG gauge drains realistically during missions |
| **One-command setup** | `docker compose up --build` brings the full stack up |

---

## Quick Start

### Prerequisites

- [Docker Desktop](https://docker.com/products/docker-desktop) or Docker Engine + Compose v2

### Run

```bash
git clone https://github.com/expertdicer/robonav.git
cd robonav

cp .env.example .env

docker compose up --build
```

Open **[http://localhost:3000](http://localhost:3000)** — RoboNav is ready.

1. Select a robot from the left sidebar
2. Click anywhere on the map to drop waypoints (blue dots)
3. Click **Start Mission** — the robot begins navigating in real time
4. Watch the compass, speed, and battery update live

---

## Architecture

```
┌──────────────────────┐         ┌───────────────────────────┐
│  frontend            │         │  backend                   │
│  Next.js 14 + TS     │ ◄─WS──► │  FastAPI + Python 3.12    │
│  Tailwind CSS        │  REST   │  SQLModel + SQLite         │
│  Zustand + Framer    │         │  Simulator (asyncio task)  │
│  Leaflet OSM         │         │  TelemetryHub (pub/sub)    │
└──────────────────────┘         └───────────────────────────┘
        :3000                              :8000
```

**Data flow for a navigation mission:**

1. User selects a robot, clicks map waypoints → drafts are held in Zustand store
2. "Start Mission" POSTs `/api/missions` + `/api/missions/{id}/waypoints` + `/api/missions/{id}/start`
3. The simulator's asyncio loop picks up the active mission and advances the robot along the great-circle route every 500 ms
4. Each tick publishes a telemetry frame to `TelemetryHub` and persists a `TelemetryLog` row
5. The frontend's `TelemetrySocket` WebSocket subscriber receives frames at ~2 Hz, updates the map marker, trail, and sidebar panels via Zustand
6. When the robot reaches the final waypoint, the mission is marked `completed` and the robot returns to `idle`

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_PATH` | `/data/robonav.db` | SQLite database path (inside backend container) |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS allowed origins |
| `SIM_TICK_HZ` | `2.0` | Simulator tick rate (frames per second) |
| `SIM_SPEED_MS` | `10.0` | Simulated robot speed in metres per second |

Frontend env (set in `frontend/.env.local` for local dev):

| Variable | Default |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` |
| `NEXT_PUBLIC_WS_URL` | `ws://localhost:8000` |

---

## Development

### Backend

```bash
cd backend
pip install uv
uv pip install --system -e ".[dev]"
cp ../.env.example ../.env
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

### Tests

```bash
cd backend
pytest -v
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | [TypeScript 5](https://typescriptlang.org) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) |
| State management | [Zustand 4](https://github.com/pmndrs/zustand) |
| Animation | [Framer Motion 11](https://framer-motion.com) |
| Map | [Leaflet](https://leafletjs.com) + [OpenStreetMap](https://openstreetmap.org) |
| Backend framework | [FastAPI](https://fastapi.tiangolo.com) |
| Backend language | [Python 3.12](https://python.org) |
| ORM / DB | [SQLModel](https://sqlmodel.tiangolo.com) + SQLite |
| Realtime | WebSockets (FastAPI native) |
| Geo math | Custom haversine / great-circle lib |
| Container | Docker + Docker Compose |

---

## License

MIT © 2025 — see [LICENSE](LICENSE) for details.
