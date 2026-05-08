interface Props {
  status: string;
}

const COLOR: Record<string, string> = {
  idle: "bg-slate-500",
  moving: "bg-emerald-500",
  error: "bg-red-500",
  pending: "bg-yellow-500",
  active: "bg-emerald-500",
  completed: "bg-blue-500",
  aborted: "bg-red-500",
  disconnected: "bg-slate-500",
  connected: "bg-emerald-500",
  reconnecting: "bg-yellow-400",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium text-white ${COLOR[status] ?? "bg-slate-500"}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse" />
      {status}
    </span>
  );
}
