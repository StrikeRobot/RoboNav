"use client";

import { useNavStore } from "@/lib/store";
import StatusBadge from "./StatusBadge";

export default function HeaderBar() {
  const status = useNavStore((s) => s.connectionStatus);

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-700 shrink-0">
      <div className="flex items-center gap-3">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <rect x="6" y="10" width="20" height="16" rx="3" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
          <rect x="10" y="2" width="12" height="10" rx="2" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="13" cy="7" r="2" fill="#3b82f6" />
          <circle cx="19" cy="7" r="2" fill="#3b82f6" />
          <rect x="10" y="26" width="3" height="4" rx="1" fill="#475569" />
          <rect x="19" y="26" width="3" height="4" rx="1" fill="#475569" />
          <circle cx="16" cy="18" r="3" fill="#3b82f6" opacity="0.6" />
          <line x1="16" y1="13" x2="16" y2="15" stroke="#3b82f6" strokeWidth="1" />
          <line x1="16" y1="21" x2="16" y2="23" stroke="#3b82f6" strokeWidth="1" />
          <line x1="11" y1="18" x2="13" y2="18" stroke="#3b82f6" strokeWidth="1" />
          <line x1="19" y1="18" x2="21" y2="18" stroke="#3b82f6" strokeWidth="1" />
        </svg>
        <span className="text-lg font-bold text-white tracking-wide">RoboNav</span>
        <span className="text-xs text-slate-500 hidden sm:block">GPS Navigation System</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500">Telemetry</span>
        <StatusBadge status={status} />
      </div>
    </header>
  );
}
