import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { AuditEntry } from "@/entities/audit/model/types";
import { createEmptyAudit } from "@/entities/audit/model/types";
import { STREAM_ENDPOINT, type StreamStatus } from "@/shared/config/terminal";
import {
  StreamingSanitizer,
  stripRedactionMarkers,
} from "@/shared/lib/sanitizer/streamingSanitizer";

export type TerminalStreamState = {
  text: string;
  status: StreamStatus;
  audit: AuditEntry[];
  security: {
    visibleLeaks: number;
    blocked: number;
    isSafe: boolean;
  };
  tailRef: RefObject<HTMLDivElement | null>;
};

const BANNED_WORD_RE = /(?<![A-Za-z0-9_-])(?:CompetitorX|ProjectApollo|lazy-dev)(?![A-Za-z0-9_-])/g;
const API_KEY_RE = /\bsk-[A-Za-z0-9-]{10,}\b/g;
const CREDIT_CARD_RE = /\b\d{4}-\d{4}-\d{4}-\d{4}\b/g;
const PHONE_RE = /(?<![A-Za-z0-9-])\d{4}-\d{4}-\d{4}(?!-\d{4})/g;

const countMatches = (input: string, regex: RegExp) =>
  (input.match(regex) ?? []).length;

const isAbortError = (error: unknown) =>
  error instanceof DOMException
    ? error.name === "AbortError"
    : error instanceof Error && error.name === "AbortError";

export const useTerminalStream = (): TerminalStreamState => {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<StreamStatus>("idle");
  const [audit, setAudit] = useState<AuditEntry[]>(createEmptyAudit());
  const tailRef = useRef<HTMLDivElement | null>(null);

  const streamUrl = useMemo(() => STREAM_ENDPOINT, []);

  useEffect(() => {
    const abortController = new AbortController();
    const sanitizer = new StreamingSanitizer();
    let isDisposed = false;

    const readStream = async () => {
      setStatus("streaming");
      setText("");
      setAudit(createEmptyAudit());

      try {
        const response = await fetch(streamUrl, {
          signal: abortController.signal,
        });
        if (!response.ok || !response.body) {
          throw new Error(`Stream failed: ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunkText = decoder.decode(value, { stream: true });
          const safeChunk = sanitizer.push(chunkText);

          if (safeChunk) {
            setText((prev) => prev + safeChunk);
          }

          setAudit(sanitizer.getAudit());
        }

        const pendingText = sanitizer.finish();
        if (pendingText) {
          setText((prev) => prev + pendingText);
        }

        setAudit(sanitizer.getAudit());
        if (!isDisposed && !abortController.signal.aborted) {
          setStatus("complete");
        }
      } catch (error) {
        if (
          isDisposed ||
          abortController.signal.aborted ||
          isAbortError(error)
        ) {
          return;
        }
        setStatus("error");
      }
    };

    readStream();

    return () => {
      isDisposed = true;
      abortController.abort();
    };
  }, [streamUrl]);

  useEffect(() => {
    tailRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [text]);

  const security = useMemo(() => {
    const visibleText = stripRedactionMarkers(text);

    const visibleLeaks =
      countMatches(visibleText, API_KEY_RE) +
      countMatches(visibleText, CREDIT_CARD_RE) +
      countMatches(visibleText, PHONE_RE) +
      countMatches(visibleText, BANNED_WORD_RE);

    const blocked = audit.reduce((sum, entry) => sum + entry.count, 0);

    return {
      visibleLeaks,
      blocked,
      isSafe: visibleLeaks === 0,
    };
  }, [audit, text]);

  return { text, status, audit, security, tailRef };
};
