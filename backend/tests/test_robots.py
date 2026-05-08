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
    # No context-manager — avoids triggering lifespan simulator against real DB
    client = TestClient(app, raise_server_exceptions=True)
    yield client
    app.dependency_overrides.clear()


def test_list_robots_empty(client):
    r = client.get("/api/robots")
    assert r.status_code == 200
    assert r.json() == []


def test_create_robot(client):
    r = client.post("/api/robots", json={"name": "TestBot", "lat": 10.0, "lon": 20.0})
    assert r.status_code == 201
    body = r.json()
    assert body["name"] == "TestBot"
    assert body["status"] == "idle"
    assert body["battery"] == pytest.approx(100.0)


def test_get_robot(client):
    robot_id = client.post("/api/robots", json={"name": "R2D2", "lat": 0.0, "lon": 0.0}).json()["id"]
    r = client.get(f"/api/robots/{robot_id}")
    assert r.status_code == 200
    assert r.json()["name"] == "R2D2"


def test_get_robot_not_found(client):
    r = client.get("/api/robots/9999")
    assert r.status_code == 404
