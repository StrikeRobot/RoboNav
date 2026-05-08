"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useNavStore } from "@/lib/store";
import { TelemetrySocket } from "@/lib/ws";
import HeaderBar from "@/components/HeaderBar";
import RobotList from "@/components/RobotList";
import TelemetryPanel from "@/components/TelemetryPanel";
import MissionControls from "@/components/MissionControls";
import MissionLog from "@/components/MissionLog";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const {
    setRobots,
    selectedRobotId,
    updateLivePosition,
    setConnectionStatus,
    appendLog,
  } = useNavStore();

  const wsRef = useRef<TelemetrySocket | null>(null);

  // Fetch robot list on mount and poll every 10 s
  useEffect(() => {
    api.robots.list().then(setRobots).catch(() => {});
    const interval = setInterval(
      () => api.robots.list().then(setRobots).catch(() => {}),
      10_000
    );
    return () => clearInterval(interval);
  }, [setRobots]);

  // Open/switch WebSocket when selected robot changes
  useEffect(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
    }
    if (!selectedRobotId) return;

    const sock = new TelemetrySocket(selectedRobotId);
    wsRef.current = sock;
    setConnectionStatus("reconnecting");

    const off = sock.on((frame) => {
      setConnectionStatus("connected");
      updateLivePosition(frame);
      appendLog(
        `[${new Date(frame.ts).toLocaleTimeString()}] ` +
          `${frame.lat.toFixed(4)}, ${frame.lon.toFixed(4)} ` +
          `hdg:${Math.round(frame.heading)}° spd:${frame.speed.toFixed(1)}m/s`
      );
    });

    sock.connect();

    return () => {
      off();
      sock.disconnect();
      setConnectionStatus("disconnected");
    };
  }, [selectedRobotId, setConnectionStatus, updateLivePosition, appendLog]);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      <HeaderBar />
      <div className="flex flex-1 min-h-0">
        <aside className="w-72 flex flex-col gap-4 p-4 bg-slate-900 border-r border-slate-700 overflow-y-auto shrink-0">
          <RobotList />
          <div className="border-t border-slate-700" />
          <MissionControls />
          <div className="border-t border-slate-700" />
          <TelemetryPanel />
          <div className="border-t border-slate-700" />
          <MissionLog />
        </aside>
        <main className="flex-1 min-h-0">
          <MapView />
        </main>
      </div>
    </div>
  );
}
