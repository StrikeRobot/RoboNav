import math
from .geo import haversine, bearing, dest_point


def interpolate_route(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
    step_m: float = 50.0,
) -> list[tuple[float, float]]:
    """Return points sampled every *step_m* metres along the great-circle from (lat1,lon1) to (lat2,lon2)."""
    dist = haversine(lat1, lon1, lat2, lon2)
    if dist < step_m:
        return [(lat2, lon2)]
    brg = bearing(lat1, lon1, lat2, lon2)
    steps = math.floor(dist / step_m)
    return [dest_point(lat1, lon1, brg, step_m * i) for i in range(1, steps + 1)] + [(lat2, lon2)]
