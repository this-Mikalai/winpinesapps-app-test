import type { ReactNode } from "react";
import type { ThreatType } from "@/entities/audit/model/types";
import { REDACTED_TOKEN } from "@/shared/config/terminal";

const REDACTION_MARKER_RE = /\[\[REDACTED::(API Key|Credit Card|Phone Number|Banned Word)\]\]/g;

export const renderSanitizedText = (text: string): ReactNode => {
  const matches = [...text.matchAll(REDACTION_MARKER_RE)];
  if (matches.length === 0) {
    return text;
  }

  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const index = match.index ?? 0;
    const reason = match[1] as ThreatType;

    if (index > cursor) {
      nodes.push(text.slice(cursor, index));
    }

    nodes.push(
      <span className="redacted" title={`Redacted: ${reason}`} key={`rd-${i}`}>
        {REDACTED_TOKEN}
      </span>,
    );

    cursor = index + match[0].length;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
};
