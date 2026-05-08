import type { TelemetryFrame } from "@/types/telemetry.d";

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000";

type FrameHandler = (frame: TelemetryFrame) => void;

export class TelemetrySocket {
  private ws: WebSocket | null = null;
  private handlers: Set<FrameHandler> = new Set();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private robotId: number;

  constructor(robotId: number) {
    this.robotId = robotId;
  }

  connect(): void {
    if (this.ws) return;
    this.ws = new WebSocket(`${WS_BASE}/ws/telemetry/${this.robotId}`);

    this.ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data as string);
        if (data.ping) return;
        this.handlers.forEach((h) => h(data as TelemetryFrame));
      } catch {
        // ignore malformed frames
      }
    };

    this.ws.onclose = () => {
      this.ws = null;
      this.reconnectTimer = setTimeout(() => this.connect(), 2000);
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  on(handler: FrameHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
    this.handlers.clear();
  }
}
