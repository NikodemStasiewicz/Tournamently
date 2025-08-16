import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: "token",
    value: "",
    maxAge: 0,
    path: "/",
    expires:new Date(0), // Set expiration date to the past to delete the cookie
  });

  return response;
}
