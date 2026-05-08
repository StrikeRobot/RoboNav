import type { Robot } from "@/types/robot.d";
import type { Mission, Waypoint, DraftWaypoint } from "@/types/mission.d";
import type { TelemetryFrame } from "@/types/telemetry.d";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${BASE}${path}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const r = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export const api = {
  robots: {
    list: () => get<Robot[]>("/api/robots"),
    get: (id: number) => get<Robot>(`/api/robots/${id}`),
  },
  missions: {
    list: () => get<Mission[]>("/api/missions"),
    create: (robot_id: number, name: string) =>
      post<Mission>("/api/missions", { robot_id, name }),
    start: (id: number) => post<Mission>(`/api/missions/${id}/start`),
    abort: (id: number) => post<Mission>(`/api/missions/${id}/abort`),
    waypoints: (id: number) => get<Waypoint[]>(`/api/missions/${id}/waypoints`),
    addWaypoint: (id: number, wp: DraftWaypoint) =>
      post<Waypoint>(`/api/missions/${id}/waypoints`, wp),
  },
  telemetry: {
    history: (robot_id: number, limit = 200) =>
      get<TelemetryFrame[]>(`/api/telemetry?robot_id=${robot_id}&limit=${limit}`),
  },
};
