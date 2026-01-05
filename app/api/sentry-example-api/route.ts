import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Test route per verificare che Sentry catturi errori server-side
export async function GET() {
  throw new Error("Sentry Server-Side Test Error - This is expected!");
}
