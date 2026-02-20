import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import type { AuditEntry } from "@/entities/audit/model/types";
import { TERMINAL_COLORS, TERMINAL_TEXT } from "@/shared/config/terminal";

type AuditLogProps = {
  audit: AuditEntry[];
};

const exportAudit = (audit: AuditEntry[]) => {
  const payload = {
    generatedAt: new Date().toISOString(),
    summary: audit,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ghostprotocol-audit.json";
  a.click();
  URL.revokeObjectURL(url);
};

export const AuditLog = ({ audit }: AuditLogProps) => (
  <Paper
    elevation={0}
    sx={{
      border: `1px solid ${TERMINAL_COLORS.auditBorder}`,
      background: TERMINAL_COLORS.auditBackground,
      borderRadius: 1.5,
      boxShadow: `${TERMINAL_COLORS.panelShadow}, 0 0 34px #FFBA6014`,
      backdropFilter: "blur(5px)",
      p: 2.25,
      color: TERMINAL_COLORS.baseText,
    }}
  >
    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.25} sx={{ mb: 1 }}>
      <Typography variant="subtitle2" sx={{ letterSpacing: 0.9, color: TERMINAL_COLORS.auditTitle }}>
        {TERMINAL_TEXT.auditTitle}
      </Typography>
      <Button
        variant="outlined"
        size="small"
        onClick={() => exportAudit(audit)}
        sx={{
          alignSelf: { xs: "flex-start", md: "center" },
          color: TERMINAL_COLORS.auditChipText,
          borderColor: TERMINAL_COLORS.auditChipBorder,
          bgcolor: "#FFFFFF08",
          textTransform: "none",
          fontWeight: 600,
          "&:hover": {
            borderColor: TERMINAL_COLORS.auditChipText,
            bgcolor: "#FFFFFF12",
          },
        }}
      >
        Export JSON
      </Button>
    </Stack>
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {audit.map((entry) => (
        <Chip
          key={entry.type}
          label={`${entry.type}: ${entry.count}`}
          sx={{
            color: TERMINAL_COLORS.auditChipText,
            border: `1px solid ${TERMINAL_COLORS.auditChipBorder}`,
            bgcolor: TERMINAL_COLORS.auditChipBackground,
            fontWeight: 600,
            boxShadow: "0 6px 16px #00000042",
          }}
        />
      ))}
    </Stack>
  </Paper>
);
