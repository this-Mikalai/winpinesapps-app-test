import { randomInt, sleep } from "./utils/utilsFunc";

const PORT = Number(process.env.PORT ?? 3001);

const MOCK_RESPONSE = `[GHOST_PROTOCOL_V4]
Target: Arasaka_Tower_Subnet
Status: BREACH_SUCCESSFUL...
> 1. LOG ENTRY [2024-01-15]:
User "skyler_admin" initiated SkyNet protocol.
Confirmation ID: 1022-3044 (Note: Not a credit card).
Action: UPLOAD_GRANTED.
> 2. SCANNING CREDENTIALS...
Warning: Unencrypted keys detected!

- Root Access: sk-live-5122-3344-9988-aabb (HIGH VALUE)
- Test Scope: sk-test-4433-2211
- Malformed: sk-A1b2C3d4E5f6G7h8 (Mixed case detected)
- Too short: sk-8899 (Ignore this).
Do not share these sk-keys with unauthorized personnel.
> 3. FINANCIAL RECORDS:
- Transaction Range: 1000-2000-3000-4000
- Corporate Card: 4532-1100-8877-2233 (VISA - PURGE THIS)
- Backup Card: 1234-5678-9012-3456 (MasterCard - PURGE THIS)
> 4. CHATTER ANALYSIS:
- Target mentioned "CompetitorX" takeover.
- Discussing "ProjectApollo" is strictly forbidden.
- Dev team complaint: "The lazy-dev implementation is slowing us down."
- Counter-argument: "lazy-loading is essential for stealth."
> 5. TERMINATING CONNECTION.
Please contact headquarters at 5555-4444-3333 (Secure Line).
Session ID: 8822-1133-44.
[END_OF_STREAM]
`;

Bun.serve({
  port: PORT,
  async fetch(request: Request) {
    const { pathname } = new URL(request.url);

    if (pathname === "/stream") {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET,OPTIONS",
            "access-control-allow-headers": "content-type",
          },
        });
      }

      if (request.method !== "GET") {
        return new Response("Method Not Allowed", { status: 405 });
      }

      const encoder = new TextEncoder();
      let isAborted = false;

      request.signal.addEventListener("abort", () => {
        isAborted = true;
      });

      const stream = new ReadableStream<Uint8Array>({
        async start(controller: ReadableStreamDefaultController<Uint8Array>) {
          try {
            let cursor = 0;

            while (cursor < MOCK_RESPONSE.length) {
              if (isAborted) break;

              const chunkSize = randomInt(1, 4);
              const chunk = MOCK_RESPONSE.slice(cursor, cursor + chunkSize);
              cursor += chunkSize;

              controller.enqueue(encoder.encode(chunk));
              await sleep(randomInt(10, 50));
            }
          } finally {
            try {
              controller.close();
            } catch {}
          }
        },
      });

      return new Response(stream, {
        headers: {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store",
          "x-content-type-options": "nosniff",
          "access-control-allow-origin": "*",
        },
      });
    }

    return new Response("Not Found", {
      status: 404,
      headers: { "access-control-allow-origin": "*" },
    });
  },
});
