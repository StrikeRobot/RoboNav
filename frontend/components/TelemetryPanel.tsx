"use client";

import { useNavStore } from "@/lib/store";
import { bearingToCardinal } from "@/lib/geo";
import CompassDial from "./CompassDial";
import BatteryGauge from "./BatteryGauge";

export default function TelemetryPanel() {
  const live = useNavStore((s) => s.livePosition);

  if (!live) {
    return (
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Live Telemetry
        </h3>
        <p className="text-xs text-slate-600 italic">Select a robot and start a mission</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Live Telemetry
      </h3>
      <div className="flex items-center gap-4">
        <CompassDial heading={live.heading} />
        <div className="flex flex-col gap-2">
          <div className="text-xs text-slate-400">
            Speed:{" "}
            <span className="text-white font-medium">{live.speed.toFixed(1)} m/s</span>
          </div>
          <div className="text-xs text-slate-400">
            Heading:{" "}
            <span className="text-white font-medium">
              {Math.round(live.heading)}° {bearingToCardinal(live.heading)}
            </span>
          </div>
          <div className="text-xs text-slate-400 mb-0.5">Battery:</div>
          <BatteryGauge level={live.battery} />
        </div>
      </div>
      <div className="text-[10px] text-slate-500 font-mono">
        {live.lat.toFixed(5)}, {live.lon.toFixed(5)}
      </div>
    </div>
  );
}
