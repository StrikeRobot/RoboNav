export interface TelemetryFrame {
  robot_id: number;
  lat: number;
  lon: number;
  heading: number;
  speed: number;
  battery: number;
  ts: string;
}
