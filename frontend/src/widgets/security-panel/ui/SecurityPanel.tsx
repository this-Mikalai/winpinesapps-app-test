import { Chip, Paper, Stack, Typography } from "@mui/material";
import { TERMINAL_COLORS } from "@/shared/config/terminal";

type SecurityPanelProps = {
  isSafe: boolean;
  visibleLeaks: number;
  blocked: number;
};

export const SecurityPanel = ({ isSafe, visibleLeaks, blocked }: SecurityPanelProps) => (
  <Paper
    elevation={0}
    sx={{
      border: `1px solid ${TERMINAL_COLORS.streamBorder}`,
      background: TERMINAL_COLORS.headerBackground,
      borderRadius: 1.5,
      boxShadow: `${TERMINAL_COLORS.panelShadow}, ${TERMINAL_COLORS.terminalGlow}`,
      p: 1.5,
      color: TERMINAL_COLORS.baseText,
    }}
  >
    <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ xs: "flex-start", md: "center" }}>
      <Typography variant="subtitle2" sx={{ letterSpacing: 0.8, color: TERMINAL_COLORS.subtitleText }}>
        SECURITY CHECK
      </Typography>
      <Chip
        label={`Zero-Flicker: ${isSafe ? "PASS" : "FAIL"}`}
        sx={{
          color: isSafe ? "#05200E" : "#2A0508",
          bgcolor: isSafe ? "#7CFF9E" : "#FF8B8B",
          fontWeight: 700,
        }}
      />
      <Chip
        label={`Visible Leaks: ${visibleLeaks}`}
        sx={{
          color: TERMINAL_COLORS.baseText,
          border: "1px solid #FFFFFF24",
          bgcolor: "#FFFFFF0A",
          fontWeight: 600,
        }}
      />
      <Chip
        label={`Blocked: ${blocked}`}
        sx={{
          color: TERMINAL_COLORS.baseText,
          border: "1px solid #FFFFFF24",
          bgcolor: "#FFFFFF0A",
          fontWeight: 600,
        }}
      />
    </Stack>
  </Paper>
);
