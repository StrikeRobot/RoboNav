"use client";

import { useMapEvents } from "react-leaflet";
import { useNavStore } from "@/lib/store";

export default function WaypointEditor() {
  const { activeMission, addDraftWaypoint, appendLog } = useNavStore();

  useMapEvents({
    click(e) {
      if (activeMission?.status === "active") return;
      addDraftWaypoint({ lat: e.latlng.lat, lon: e.latlng.lng, label: "" });
      appendLog(
        `Waypoint added: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`
      );
    },
  });

  return null;
}
