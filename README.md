# GhostProtocol

Frontend + backend implementation for the GhostProtocol terminal assignment.

## Stack

- Backend: Bun (`backend/src/server.ts`)
- Frontend: Vite + React + TypeScript + MUI (`frontend/`)

## Quick Start

1. Install dependencies (root + workspaces):

```bash
bun install
```

2. Start backend and frontend with one command:

```bash
bun run dev
```

3. Open frontend:

- `http://localhost:5173`

Backend stream endpoint:

- `http://localhost:3001/stream`

## Sanitization Approach (Zero-Flicker)

Implementation file: `frontend/src/shared/lib/sanitizer/streamingSanitizer.ts`.

Rules:

- Blacklisted words (exact): `CompetitorX`, `ProjectApollo`, `lazy-dev`
- API keys: `sk-` tokens with minimum payload length (short values like `sk-8899` are ignored)
- Credit cards: card-like `XXXX-XXXX-XXXX-XXXX` (line-aware; skips transaction range rows)
- Secure lines: `XXXX-XXXX-XXXX` with negative lookahead to avoid partial card matches

Zero-flicker policy:

- Incoming stream is processed incrementally.
- The sanitizer keeps a fixed safety tail and flushes only safe completed segments before that tail, so potentially sensitive fragments are never rendered before replacement.
- Sensitive matches are replaced with `[REDACTED]` before text is appended to UI state.

## Audit Log

Real-time counters are accumulated during sanitization and rendered in UI as:

- `API Key`
- `Credit Card`
- `Phone Number`
- `Banned Word`

Format in code:

```ts
{ type: "API Key" | "Credit Card" | "Phone Number" | "Banned Word", count: number }
```

## Notes

- Frontend auto-scrolls to latest streamed content.
- `[REDACTED]` entries are visually highlighted in red with a lightweight glitch animation.
- Vite dev server proxies `/stream` to backend (`frontend/vite.config.ts`).
