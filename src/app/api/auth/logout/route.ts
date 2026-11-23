import { NextResponse } from "next/server";
import { sameOrigin, SESSION_COOKIE, sessionOptions } from "@/lib/auth";
export async function POST(req: Request) { if (!sameOrigin(req))
    return NextResponse.json({ success: false }, { status: 403 }); const res = NextResponse.json({ success: true }); res.cookies.set(SESSION_COOKIE, "", { ...sessionOptions, maxAge: 0 }); return res; }
