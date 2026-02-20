import { Box, Stack } from "@mui/material";
import { useTerminalStream } from "@/features/terminal-stream/model/useTerminalStream";
import { TERMINAL_COLORS, TERMINAL_LAYOUT } from "@/shared/config/terminal";
import { AuditLog } from "@/widgets/audit-log/ui/AuditLog";
import { SecurityPanel } from "@/widgets/security-panel/ui/SecurityPanel";
import { TerminalHeader } from "@/widgets/terminal-header/ui/TerminalHeader";
import { TerminalScreen } from "@/widgets/terminal-screen/ui/TerminalScreen";

export const TerminalPage = () => {
  const { text, status, audit, security, tailRef } = useTerminalStream();

  return (
    <Box
      sx={{
        height: "100dvh",
        overflow: "hidden",
        boxSizing: "border-box",
        color: TERMINAL_COLORS.baseText,
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Stack
        spacing={2.5}
        sx={{
          maxWidth: TERMINAL_LAYOUT.maxWidth,
          mx: "auto",
          height: "100%",
          minHeight: 0,
        }}
      >
        <TerminalHeader status={status} />
        <SecurityPanel
          isSafe={security.isSafe}
          visibleLeaks={security.visibleLeaks}
          blocked={security.blocked}
        />
        <TerminalScreen text={text} tailRef={tailRef} />
        <AuditLog audit={audit} />
      </Stack>
    </Box>
  );
};
