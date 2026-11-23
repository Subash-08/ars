import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
export const dynamic = "force-dynamic";
export async function GET(req: Request) { return requireAdmin(req) || NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } }); }
