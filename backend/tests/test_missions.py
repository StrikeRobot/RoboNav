import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from app.main import app
from app.db import get_session


@pytest.fixture(name="client")
def client_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    def override_session():
        with Session(engine) as s:
            yield s

    app.dependency_overrides[get_session] = override_session
    client = TestClient(app, raise_server_exceptions=True)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="robot_id")
def robot_fixture(client):
    return client.post("/api/robots", json={"name": "NavBot", "lat": 0.0, "lon": 0.0}).json()["id"]


def test_create_mission(client, robot_id):
    r = client.post("/api/missions", json={"robot_id": robot_id, "name": "Alpha"})
    assert r.status_code == 201
    assert r.json()["status"] == "pending"


def test_start_mission(client, robot_id):
    mid = client.post("/api/missions", json={"robot_id": robot_id, "name": "Beta"}).json()["id"]
    r = client.post(f"/api/missions/{mid}/start")
    assert r.status_code == 200
    assert r.json()["status"] == "active"
    assert r.json()["started_at"] is not None


def test_abort_active_mission(client, robot_id):
    mid = client.post("/api/missions", json={"robot_id": robot_id, "name": "Gamma"}).json()["id"]
    client.post(f"/api/missions/{mid}/start")
    r = client.post(f"/api/missions/{mid}/abort")
    assert r.status_code == 200
    assert r.json()["status"] == "aborted"


def test_abort_pending_mission(client, robot_id):
    mid = client.post("/api/missions", json={"robot_id": robot_id, "name": "Delta"}).json()["id"]
    r = client.post(f"/api/missions/{mid}/abort")
    assert r.status_code == 200
    assert r.json()["status"] == "aborted"


def test_add_waypoints(client, robot_id):
    mid = client.post("/api/missions", json={"robot_id": robot_id, "name": "WP Test"}).json()["id"]
    client.post(f"/api/missions/{mid}/waypoints", json={"lat": 1.0, "lon": 2.0, "label": "A"})
    client.post(f"/api/missions/{mid}/waypoints", json={"lat": 3.0, "lon": 4.0, "label": "B"})
    r = client.get(f"/api/missions/{mid}/waypoints")
    assert r.status_code == 200
    wps = r.json()
    assert len(wps) == 2
    assert wps[0]["sequence"] == 1
    assert wps[1]["sequence"] == 2
