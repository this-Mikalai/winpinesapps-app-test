import { REDACTED_TOKEN, BANNED_WORDS } from "@/shared/config/terminal";
import type { AuditEntry, ThreatType } from "@/entities/audit/model/types";

const escapeForRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const PATTERNS = {
  bannedWord: new RegExp(`\\b(?:${BANNED_WORDS.map(escapeForRegex).join("|")})\\b`, "g"),
  apiKey: /\bsk-[A-Za-z0-9-]+\b/g,
  creditCard: /\b\d{4}-\d{4}-\d{4}-\d{4}\b/g,
  phone: /(?<![A-Za-z0-9-])\d{4}-\d{4}-\d{4}(?!-\d{4})/g,
  marker: /\[\[REDACTED::(API Key|Credit Card|Phone Number|Banned Word)\]\]/g,
} as const;

const TOKEN_BOUNDARIES = new Set([" ", "\n", "\r", "\t", ".", ",", ":", ";", "!", "?", "(", ")", "[", "]", "{", "}", '"', "'"]);

const buildMarker = (kind: ThreatType) => `[[REDACTED::${kind}]]`;

export const stripRedactionMarkers = (value: string) => value.replaceAll(PATTERNS.marker, REDACTED_TOKEN);

const replaceByPattern = (value: string, pattern: RegExp, kind: ThreatType): { text: string; count: number } => {
  let count = 0;
  const text = value.replace(pattern, () => {
    count += 1;
    return buildMarker(kind);
  });

  return { text, count };
};

const replaceCreditCards = (value: string): { text: string; count: number } => {
  let count = 0;

  const text = value.replace(PATTERNS.creditCard, (match, rawOffset, source) => {
    const offset = Number(rawOffset);
    const lineStart = source.lastIndexOf("\n", offset - 1) + 1;
    const lineEnd = source.indexOf("\n", offset);
    const line = source.slice(lineStart, lineEnd === -1 ? source.length : lineEnd);

    if (/transaction range:/i.test(line)) {
      return match;
    }

    count += 1;
    return buildMarker("Credit Card");
  });

  return { text, count };
};

const createCounters = (): Record<ThreatType, number> => ({
  "API Key": 0,
  "Credit Card": 0,
  "Phone Number": 0,
  "Banned Word": 0,
});

const sanitizeSegment = (value: string) => {
  const counters = createCounters();
  let text = value;

  {
    const out = replaceByPattern(text, PATTERNS.apiKey, "API Key");
    text = out.text;
    counters["API Key"] += out.count;
  }

  {
    const out = replaceCreditCards(text);
    text = out.text;
    counters["Credit Card"] += out.count;
  }

  {
    const out = replaceByPattern(text, PATTERNS.phone, "Phone Number");
    text = out.text;
    counters["Phone Number"] += out.count;
  }

  {
    const out = replaceByPattern(text, PATTERNS.bannedWord, "Banned Word");
    text = out.text;
    counters["Banned Word"] += out.count;
  }

  return { text, counters };
};

const getFlushIndex = (value: string) => {
  for (let i = value.length - 1; i >= 0; i -= 1) {
    if (TOKEN_BOUNDARIES.has(value[i])) {
      return i;
    }
  }

  return -1;
};

export class StreamingSanitizer {
  private buffer = "";

  private counters = createCounters();

  push(chunk: string): string {
    this.buffer += chunk;

    const boundary = getFlushIndex(this.buffer);
    if (boundary < 0) {
      return "";
    }

    const safeToFlush = this.buffer.slice(0, boundary + 1);
    this.buffer = this.buffer.slice(boundary + 1);

    const { text, counters } = sanitizeSegment(safeToFlush);
    this.mergeCounters(counters);

    return text;
  }

  finish(): string {
    if (!this.buffer) {
      return "";
    }

    const { text, counters } = sanitizeSegment(this.buffer);
    this.buffer = "";
    this.mergeCounters(counters);

    return text;
  }

  getAudit(): AuditEntry[] {
    return [
      { type: "API Key", count: this.counters["API Key"] },
      { type: "Credit Card", count: this.counters["Credit Card"] },
      { type: "Phone Number", count: this.counters["Phone Number"] },
      { type: "Banned Word", count: this.counters["Banned Word"] },
    ];
  }

  private mergeCounters(delta: Record<ThreatType, number>) {
    this.counters["API Key"] += delta["API Key"];
    this.counters["Credit Card"] += delta["Credit Card"];
    this.counters["Phone Number"] += delta["Phone Number"];
    this.counters["Banned Word"] += delta["Banned Word"];
  }
}
