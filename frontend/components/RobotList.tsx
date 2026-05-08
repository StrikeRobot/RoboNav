"use client";

import { useNavStore } from "@/lib/store";
import StatusBadge from "./StatusBadge";
import BatteryGauge from "./BatteryGauge";

export default function RobotList() {
  const { robots, selectedRobotId, selectRobot } = useNavStore();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Fleet ({robots.length})
      </h3>
      {robots.length === 0 && (
        <p className="text-xs text-slate-600 italic">Connecting to backend…</p>
      )}
      {robots.map((robot) => (
        <button
          key={robot.id}
          onClick={() => selectRobot(robot.id)}
          className={`w-full text-left p-3 rounded-lg border transition-colors ${
            selectedRobotId === robot.id
              ? "border-blue-500 bg-blue-500/10"
              : "border-slate-700 bg-slate-800 hover:border-slate-600"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-white">{robot.name}</span>
            <StatusBadge status={robot.status} />
          </div>
          <BatteryGauge level={robot.battery} />
          <div className="mt-1.5 text-[10px] text-slate-500 font-mono">
            {robot.lat.toFixed(4)}, {robot.lon.toFixed(4)}
          </div>
        </button>
      ))}
    </div>
  );
}
