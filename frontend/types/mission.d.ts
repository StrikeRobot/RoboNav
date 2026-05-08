export interface Mission {
  id: number;
  robot_id: number;
  name: string;
  status: "pending" | "active" | "completed" | "aborted";
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

export interface Waypoint {
  id: number;
  mission_id: number;
  sequence: number;
  lat: number;
  lon: number;
  label: string;
}

export interface DraftWaypoint {
  lat: number;
  lon: number;
  label: string;
}
