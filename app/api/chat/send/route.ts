import { NextRequest, NextResponse } from "next/server";
import { broadcastChatMessage } from "../stream/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.message || !body.user) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    broadcastChatMessage({
      user: body.user,
      message: body.message,
      timestamp: Date.now(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}