"use client";

import { CircleMarker, Polyline, Tooltip } from "react-leaflet";
import type { DraftWaypoint } from "@/types/mission.d";

interface Props {
  waypoints: DraftWaypoint[];
  robotPosition?: [number, number];
}

export default function RouteLine({ waypoints, robotPosition }: Props) {
  if (waypoints.length === 0) return null;

  const positions: [number, number][] = [
    ...(robotPosition ? [robotPosition] : []),
    ...waypoints.map((w): [number, number] => [w.lat, w.lon]),
  ];

  return (
    <>
      <Polyline
        positions={positions}
        color="#3b82f6"
        weight={2}
        dashArray="8 6"
        opacity={0.7}
      />
      {waypoints.map((wp, i) => (
        <CircleMarker
          key={i}
          center={[wp.lat, wp.lon]}
          radius={6}
          pathOptions={{ color: "#3b82f6", fillColor: "#1d4ed8", fillOpacity: 1 }}
        >
          <Tooltip permanent direction="top" offset={[0, -10]}>
            WP {i + 1}
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}
