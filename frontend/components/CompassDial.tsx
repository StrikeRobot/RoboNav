"use client";

import { motion } from "framer-motion";

const LABELS = [
  { text: "N", style: { top: 2, left: "50%", transform: "translateX(-50%)" } },
  { text: "E", style: { right: 4, top: "50%", transform: "translateY(-50%)" } },
  { text: "S", style: { bottom: 2, left: "50%", transform: "translateX(-50%)" } },
  { text: "W", style: { left: 4, top: "50%", transform: "translateY(-50%)" } },
];

export default function CompassDial({ heading }: { heading: number }) {
  return (
    <div className="relative w-16 h-16 rounded-full border-2 border-slate-600 flex items-center justify-center bg-slate-800 shrink-0">
      {LABELS.map(({ text, style }) => (
        <span
          key={text}
          className="absolute text-[9px] font-bold text-slate-400"
          style={style as React.CSSProperties}
        >
          {text}
        </span>
      ))}
      {/* Needle */}
      <motion.div
        className="absolute w-0.5 rounded-full origin-bottom"
        style={{
          height: 24,
          bottom: "50%",
          left: "calc(50% - 1px)",
          background: "linear-gradient(to top, #ef4444, #fca5a5)",
        }}
        animate={{ rotate: heading }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
      />
      <div className="w-2 h-2 rounded-full bg-slate-400 z-10" />
    </div>
  );
}
