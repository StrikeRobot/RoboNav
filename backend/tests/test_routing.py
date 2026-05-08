from app.services.routing import interpolate_route
from app.services.geo import haversine


def test_interpolate_returns_endpoint():
    pts = interpolate_route(0, 0, 0, 1, step_m=1000)
    assert pts[-1] == (0, 1)


def test_interpolate_single_segment_close():
    pts = interpolate_route(0, 0, 0, 0.0001, step_m=1000)
    assert len(pts) == 1


def test_interpolate_spacing():
    pts = interpolate_route(37.7749, -122.4194, 37.8, -122.4194, step_m=100)
    for i in range(len(pts) - 1):
        d = haversine(*pts[i], *pts[i + 1])
        assert d < 250  # rough spacing check — last segment can be shorter


def test_interpolate_multiple_points():
    pts = interpolate_route(0, 0, 0, 1, step_m=10_000)
    assert len(pts) >= 2
