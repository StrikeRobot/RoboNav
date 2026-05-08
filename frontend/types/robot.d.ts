export interface Robot {
  id: number;
  name: string;
  status: "idle" | "moving" | "error";
  battery: number;
  lat: number;
  lon: number;
  heading: number;
  speed: number;
  updated_at: string;
}
