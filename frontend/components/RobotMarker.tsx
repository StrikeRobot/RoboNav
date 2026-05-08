"use client";

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Robot } from "@/types/robot.d";

interface Props {
  robot: Robot;
  isSelected: boolean;
}

export default function RobotMarker({ robot, isSelected }: Props) {
  const color = isSelected ? "#3b82f6" : "#22c55e";

  const icon = useMemo(
    () =>
      L.divIcon({
        className: "",
        html: `
          <div style="
            width:36px;height:36px;
            transform:rotate(${robot.heading}deg);
            transition:transform 0.5s ease;
            filter:drop-shadow(0 0 8px ${color});
          ">
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="18,2 30,34 18,26 6,34"
                fill="${color}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
              <circle cx="18" cy="18" r="4" fill="white" opacity="0.7"/>
            </svg>
          </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [robot.heading, isSelected]
  );

  return (
    <Marker position={[robot.lat, robot.lon]} icon={icon}>
      <Popup>
        <div className="text-sm">
          <strong>{robot.name}</strong>
          <br />
          Status: {robot.status}
          <br />
          Battery: {robot.battery.toFixed(0)}%
          <br />
          Speed: {robot.speed.toFixed(1)} m/s
        </div>
      </Popup>
    </Marker>
  );
}
