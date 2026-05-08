"use client";

import { useNavStore } from "@/lib/store";
import { api } from "@/lib/api";
import StatusBadge from "./StatusBadge";

export default function MissionControls() {
  const {
    selectedRobotId,
    activeMission,
    draftWaypoints,
    clearDraftWaypoints,
    setActiveMission,
    appendLog,
  } = useNavStore();

  const canStart = !!selectedRobotId && draftWaypoints.length > 0 && !activeMission;

  const handleStart = async () => {
    if (!selectedRobotId || draftWaypoints.length === 0) return;
    try {
      const mission = await api.missions.create(
        selectedRobotId,
        `Mission ${new Date().toLocaleTimeString()}`
      );
      for (const wp of draftWaypoints) {
        await api.missions.addWaypoint(mission.id, wp);
      }
      const started = await api.missions.start(mission.id);
      setActiveMission(started);
      clearDraftWaypoints();
      appendLog(`Mission #${started.id} started — ${draftWaypoints.length} waypoints`);
    } catch (e) {
      appendLog(`Error starting mission: ${e}`);
    }
  };

  const handleAbort = async () => {
    if (!activeMission) return;
    try {
      const aborted = await api.missions.abort(activeMission.id);
      setActiveMission(null);
      appendLog(`Mission #${aborted.id} aborted`);
    } catch (e) {
      appendLog(`Error aborting mission: ${e}`);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mission</h3>

      {activeMission ? (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 truncate mr-2">{activeMission.name}</span>
          <StatusBadge status={activeMission.status} />
        </div>
      ) : (
        <p className="text-xs text-slate-500">
          {!selectedRobotId
            ? "Select a robot first"
            : draftWaypoints.length === 0
            ? "Click the map to add waypoints"
            : `${draftWaypoints.length} waypoint${draftWaypoints.length > 1 ? "s" : ""} queued`}
        </p>
      )}

      {!activeMission && (
        <button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white"
        >
          ▶ Start Mission
        </button>
      )}

      {activeMission?.status === "active" && (
        <button
          onClick={handleAbort}
          className="w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-red-700 hover:bg-red-600 text-white"
        >
          ✕ Abort Mission
        </button>
      )}

      {draftWaypoints.length > 0 && !activeMission && (
        <button
          onClick={clearDraftWaypoints}
          className="w-full py-1.5 px-4 rounded-lg text-xs font-medium transition-colors border border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300"
        >
          Clear waypoints
        </button>
      )}
    </div>
  );
}
