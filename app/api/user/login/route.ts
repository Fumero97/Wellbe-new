import { NextResponse } from "next/server";

export async function POST() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Always return success for mock
  return NextResponse.json(
    { message: "Login successful" },
    { status: 200 }
  );
}
