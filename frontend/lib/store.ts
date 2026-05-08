import { create } from "zustand";
import type { Robot } from "@/types/robot.d";
import type { Mission, DraftWaypoint } from "@/types/mission.d";
import type { TelemetryFrame } from "@/types/telemetry.d";

type ConnectionStatus = "disconnected" | "connected" | "reconnecting";

interface NavStore {
  robots: Robot[];
  selectedRobotId: number | null;
  activeMission: Mission | null;
  draftWaypoints: DraftWaypoint[];
  livePosition: TelemetryFrame | null;
  trail: [number, number][];
  connectionStatus: ConnectionStatus;
  missionLog: string[];

  setRobots: (robots: Robot[]) => void;
  selectRobot: (id: number) => void;
  setActiveMission: (m: Mission | null) => void;
  addDraftWaypoint: (wp: DraftWaypoint) => void;
  clearDraftWaypoints: () => void;
  updateLivePosition: (frame: TelemetryFrame) => void;
  setConnectionStatus: (s: ConnectionStatus) => void;
  appendLog: (msg: string) => void;
}

export const useNavStore = create<NavStore>((set) => ({
  robots: [],
  selectedRobotId: null,
  activeMission: null,
  draftWaypoints: [],
  livePosition: null,
  trail: [],
  connectionStatus: "disconnected",
  missionLog: [],

  setRobots: (robots) => set({ robots }),
  selectRobot: (id) => set({ selectedRobotId: id, livePosition: null, trail: [] }),
  setActiveMission: (m) => set({ activeMission: m }),
  addDraftWaypoint: (wp) =>
    set((s) => ({ draftWaypoints: [...s.draftWaypoints, wp] })),
  clearDraftWaypoints: () => set({ draftWaypoints: [] }),
  updateLivePosition: (frame) =>
    set((s) => ({
      livePosition: frame,
      trail: [...s.trail.slice(-500), [frame.lat, frame.lon]],
    })),
  setConnectionStatus: (connectionStatus) => set({ connectionStatus }),
  appendLog: (msg) =>
    set((s) => ({ missionLog: [msg, ...s.missionLog].slice(0, 100) })),
}));
