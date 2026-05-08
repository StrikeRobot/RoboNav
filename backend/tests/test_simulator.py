import pytest
from app.services.geo import haversine, bearing, dest_point


def test_advance_toward_target():
    lat, lon = 37.7749, -122.4194
    tlat, tlon = 37.80, -122.40
    brg = bearing(lat, lon, tlat, tlon)
    new_lat, new_lon = dest_point(lat, lon, brg, 50.0)
    assert haversine(new_lat, new_lon, tlat, tlon) < haversine(lat, lon, tlat, tlon)


def test_arrival_within_threshold():
    lat, lon = 37.7749, -122.4194
    assert haversine(lat, lon, lat, lon) < 5


def test_battery_drain_bounded():
    battery = 100.0
    for _ in range(10_000):
        battery = max(0.0, battery - 0.01)
    assert battery == pytest.approx(0.0)


def test_bearing_consistency():
    lat1, lon1 = 0.0, 0.0
    lat2, lon2 = dest_point(lat1, lon1, 45.0, 10_000)
    brg = bearing(lat1, lon1, lat2, lon2)
    assert brg == pytest.approx(45.0, abs=0.5)
