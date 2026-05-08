import math
import pytest
from app.services.geo import haversine, bearing, dest_point


def test_haversine_same_point():
    assert haversine(0, 0, 0, 0) == pytest.approx(0.0)


def test_haversine_sf_to_la():
    d = haversine(37.7749, -122.4194, 34.0522, -118.2437)
    assert 550_000 < d < 570_000


def test_bearing_east():
    assert bearing(0, 0, 0, 1) == pytest.approx(90.0, abs=0.5)


def test_bearing_north():
    assert bearing(0, 0, 1, 0) == pytest.approx(0.0, abs=0.5)


def test_bearing_south():
    assert bearing(1, 0, 0, 0) == pytest.approx(180.0, abs=0.5)


def test_dest_point_north():
    lat, lon = dest_point(0.0, 0.0, 0.0, 111_320)  # ~1 degree north
    assert lat == pytest.approx(1.0, abs=0.02)
    assert lon == pytest.approx(0.0, abs=0.01)


def test_dest_point_east():
    _, lon = dest_point(0.0, 0.0, 90.0, 111_320)
    assert lon == pytest.approx(1.0, abs=0.02)


def test_roundtrip():
    lat, lon = dest_point(37.7749, -122.4194, 45.0, 1000.0)
    d = haversine(37.7749, -122.4194, lat, lon)
    assert d == pytest.approx(1000.0, abs=1.0)
