import { NextRequest } from "next/server";

const encoder = new TextEncoder();

declare global {
  // Dzięki temu TypeScript wie o naszym polu w globalThis
  // i nie będzie krzyczał o "no index signature"
  // eslint-disable-next-line no-var
  var __CHAT_CONTROLLERS: Map<string, ReadableStreamDefaultController> | undefined;
}

function getControllersMap() {
  if (!globalThis.__CHAT_CONTROLLERS) {
    globalThis.__CHAT_CONTROLLERS = new Map();
  }
  return globalThis.__CHAT_CONTROLLERS;
}

export async function GET(req: NextRequest) {
  const controllers = getControllersMap();
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const stream = new ReadableStream({
    start(controller) {
      controllers.set(id, controller);

      controller.enqueue(encoder.encode(`event: connected\ndata: ${JSON.stringify({ id })}\n\n`));

      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`:\n\n`));
        } catch {
          // ignore
        }
      }, 15000);

      req.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        controllers.delete(id);
        try {
          controller.close();
        } catch {}
      });
    },
    cancel() {
      const ctrl = controllers.get(id);
      if (ctrl) {
        try {
          ctrl.close();
        } catch {}
      }
      controllers.delete(id);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export function broadcastChatMessage(payload: any) {
  const controllers = getControllersMap();
  const data = `data: ${JSON.stringify(payload)}\n\n`;
  for (const [, controller] of controllers) {
    try {
      controller.enqueue(encoder.encode(data));
    } catch {
      // ignore
    }
  }
}
