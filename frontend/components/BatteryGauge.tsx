"use client";

import { motion } from "framer-motion";

export default function BatteryGauge({ level }: { level: number }) {
  const pct = Math.max(0, Math.min(100, level));
  const color = pct > 60 ? "#22c55e" : pct > 20 ? "#eab308" : "#ef4444";

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-10 h-5 rounded border-2 border-slate-400 flex items-center px-0.5">
        <div className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-[5px] h-2.5 bg-slate-400 rounded-r" />
        <motion.div
          className="h-3 rounded-sm"
          style={{ backgroundColor: color }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="text-xs text-slate-300">{Math.round(pct)}%</span>
    </div>
  );
}
