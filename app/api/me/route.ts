import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  return NextResponse.json(user);
}
