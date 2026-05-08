"use client";

import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavStore } from "@/lib/store";
import RobotMarker from "./RobotMarker";
import RouteLine from "./RouteLine";
import WaypointEditor from "./WaypointEditor";

export default function MapView() {
  const { robots, selectedRobotId, draftWaypoints, livePosition, trail } =
    useNavStore();

  const selectedRobot = robots.find((r) => r.id === selectedRobotId);
  const robotPos: [number, number] | undefined = livePosition
    ? [livePosition.lat, livePosition.lon]
    : selectedRobot
    ? [selectedRobot.lat, selectedRobot.lon]
    : undefined;

  return (
    <MapContainer
      center={[30, -10]}
      zoom={3}
      className="w-full h-full"
      style={{ background: "#0f172a" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Robot trail */}
      {trail.length > 1 && (
        <Polyline
          positions={trail as [number, number][]}
          color="#f59e0b"
          weight={2}
          opacity={0.6}
        />
      )}

      {/* All robots */}
      {robots.map((robot) => (
        <RobotMarker
          key={robot.id}
          robot={
            livePosition && robot.id === selectedRobotId
              ? {
                  ...robot,
                  lat: livePosition.lat,
                  lon: livePosition.lon,
                  heading: livePosition.heading,
                  speed: livePosition.speed,
                  battery: livePosition.battery,
                }
              : robot
          }
          isSelected={robot.id === selectedRobotId}
        />
      ))}

      {/* Planned route */}
      <RouteLine waypoints={draftWaypoints} robotPosition={robotPos} />

      {/* Click-to-add waypoints */}
      <WaypointEditor />
    </MapContainer>
  );
}
