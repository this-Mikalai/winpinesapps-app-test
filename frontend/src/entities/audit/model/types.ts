export const THREAT_TYPES = ["API Key", "Credit Card", "Phone Number", "Banned Word"] as const;

export type ThreatType = (typeof THREAT_TYPES)[number];

export type AuditEntry = {
  type: ThreatType;
  count: number;
};

export const createEmptyAudit = (): AuditEntry[] => THREAT_TYPES.map((type) => ({ type, count: 0 }));
