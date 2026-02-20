import type { ThreatType } from "@/entities/audit/model/types";

export const STREAM_ENDPOINT = import.meta.env.VITE_STREAM_URL ?? "/stream";

export const REDACTED_TOKEN = "[REDACTED]";

export const TERMINAL_TEXT = {
  title: "GHOSTPROTOCOL INTERFACE",
  subtitle: "Clearance Level: TOP SECRET | Subject: GhostProtocol Terminal",
  auditTitle: "AUDIT LOG"
} as const;

export type StreamStatus = "idle" | "streaming" | "complete" | "error";

export const STATUS_LABELS: Record<StreamStatus, string> = {
  idle: "IDLE",
  streaming: "STREAMING LIVE",
  complete: "STREAM COMPLETE",
  error: "STREAM ERROR"
};

export const STATUS_CHIP_BG: Record<StreamStatus, string> = {
  idle: "#8affad",
  streaming: "#66E6FF",
  complete: "#7CFF9E",
  error: "#ff7676"
};

export const TERMINAL_LAYOUT = {
  maxWidth: 1100,
  streamMinHeight: { xs: 360, md: 520 },
  streamMaxHeight: { xs: "60vh", md: "68vh" }
} as const;

export const TERMINAL_COLORS = {
  baseText: "#cbffd9",
  subtitleText: "#8eb5a0",
  panelEdge: "#60FFB23D",
  headerBorder: "#60FFB24D",
  headerBackground: "linear-gradient(170deg, #0A1411ED 0%, #050D0AE6 100%)",
  streamBorder: "#60FFB242",
  streamBackground: "linear-gradient(180deg, #040B09F0 0%, #010605F2 100%)",
  auditBorder: "#FFBA6057",
  auditBackground: "linear-gradient(180deg, #110C05E6 0%, #0B0804F0 100%)",
  auditTitle: "#ffdca0",
  chipTextDark: "#05110a",
  auditChipText: "#ffcf83",
  auditChipBorder: "#FFBA6057",
  auditChipBackground: "#FFBA601A",
  panelShadow: "0 22px 48px #0000006B",
  terminalGlow: "0 0 0 1px #6BFFB714, 0 0 46px #34FF9C1A"
} as const;

export const BANNED_WORDS = ["CompetitorX", "ProjectApollo", "lazy-dev"] as const;

export const THREAT_LABELS: Record<ThreatType, string> = {
  "API Key": "API Key",
  "Credit Card": "Credit Card",
  "Phone Number": "Phone Number",
  "Banned Word": "Banned Word"
};
