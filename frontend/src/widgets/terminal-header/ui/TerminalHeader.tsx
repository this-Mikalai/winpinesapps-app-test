import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import type { StreamStatus } from "@/shared/config/terminal";
import { STATUS_CHIP_BG, STATUS_LABELS, TERMINAL_COLORS, TERMINAL_TEXT } from "@/shared/config/terminal";

type TerminalHeaderProps = {
  status: StreamStatus;
};

export const TerminalHeader = ({ status }: TerminalHeaderProps) => (
  <Paper
    elevation={0}
    sx={{
      border: `1px solid ${TERMINAL_COLORS.headerBorder}`,
      background: TERMINAL_COLORS.headerBackground,
      borderRadius: 1.5,
      boxShadow: `${TERMINAL_COLORS.panelShadow}, ${TERMINAL_COLORS.terminalGlow}`,
      backdropFilter: "blur(8px)",
      p: 2.5,
      color: TERMINAL_COLORS.baseText,
    }}
  >
    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.5}>
      <Box>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            letterSpacing: 2.4,
            textTransform: "uppercase",
            fontWeight: 700,
            color: TERMINAL_COLORS.baseText,
            textShadow: "0 0 20px #78FFBE33",
          }}
        >
          {TERMINAL_TEXT.title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.86, color: TERMINAL_COLORS.subtitleText }}>
          {TERMINAL_TEXT.subtitle}
        </Typography>
      </Box>
      <Chip
        label={STATUS_LABELS[status]}
        sx={{
          alignSelf: { xs: "flex-start", md: "center" },
          letterSpacing: 0.9,
          fontWeight: 700,
          color: TERMINAL_COLORS.chipTextDark,
          bgcolor: STATUS_CHIP_BG[status],
          border: "1px solid #FFFFFF47",
          boxShadow: "0 8px 20px #0000004D",
        }}
      />
    </Stack>
  </Paper>
);
