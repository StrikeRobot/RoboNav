"use client";

import { useNavStore } from "@/lib/store";

export default function MissionLog() {
  const log = useNavStore((s) => s.missionLog);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Event Log
      </h3>
      <div className="h-32 overflow-y-auto flex flex-col gap-0.5 pr-1">
        {log.length === 0 ? (
          <span className="text-xs text-slate-600 italic">No events yet</span>
        ) : (
          log.map((msg, i) => (
            <div key={i} className="text-[10px] text-slate-400 font-mono leading-relaxed">
              {msg}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
