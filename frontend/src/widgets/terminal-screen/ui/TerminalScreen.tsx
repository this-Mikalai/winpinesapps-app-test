import type { RefObject } from "react";
import { Paper, Typography } from "@mui/material";
import { TERMINAL_COLORS } from "@/shared/config/terminal";
import { renderSanitizedText } from "@/shared/lib/ui/renderSanitizedText";

type TerminalScreenProps = {
  text: string;
  tailRef: RefObject<HTMLDivElement | null>;
};

export const TerminalScreen = ({ text, tailRef }: TerminalScreenProps) => (
  <Paper
    className="terminal-scroll"
    elevation={0}
    sx={{
      border: `1px solid ${TERMINAL_COLORS.streamBorder}`,
      background: TERMINAL_COLORS.streamBackground,
      borderRadius: 1.5,
      boxShadow: `${TERMINAL_COLORS.panelShadow}, ${TERMINAL_COLORS.terminalGlow}`,
      backdropFilter: "blur(6px)",
      p: 2.5,
      color: TERMINAL_COLORS.baseText,
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      position: "relative",
      "&::before": {
        content: '""',
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        borderRadius: 1.5,
        background: "linear-gradient(180deg, #A0FFD60E 0%, #00000000 24%)",
      },
    }}
  >
    <Typography
      component="pre"
      sx={{
        margin: 0,
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: 1.45,
        fontSize: "0.92rem",
        fontFamily: '"JetBrains Mono", monospace',
        color: TERMINAL_COLORS.baseText,
      }}
    >
      {renderSanitizedText(text)}
    </Typography>
    <div ref={tailRef} />
  </Paper>
);
