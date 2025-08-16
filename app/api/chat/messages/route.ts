// app/api/chat/messages/route.ts
import { NextResponse } from "next/server";

if (!global.chatMessages) {
  global.chatMessages = [];
}

export async function GET() {
  return NextResponse.json(global.chatMessages);
}
