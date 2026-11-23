import { NextResponse } from "next/server";
import { authConfigured, createSession, safeEqual, sameOrigin, SESSION_COOKIE, sessionOptions } from "@/lib/auth";
import { rateLimit, readJson } from "@/lib/request";
export async function POST(req: Request) {
    if (!sameOrigin(req))
        return NextResponse.json({ success: false, error: "Invalid request origin" }, { status: 403 });
    if (!authConfigured())
        return NextResponse.json({ success: false, error: "Staff access is not configured. Set ADMIN_PASSWORD and AUTH_SECRET on the server." }, { status: 503 });
    if (rateLimit("login-global", 30, 60000))
        return NextResponse.json({ success: false, error: "Too many attempts. Please wait a minute." }, { status: 429 });
    try {
        const body = await readJson(req);
        if (typeof body.password !== "string" || !safeEqual(body.password, process.env.ADMIN_PASSWORD!))
            return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
        const res = NextResponse.json({ success: true });
        res.cookies.set(SESSION_COOKIE, createSession(), sessionOptions);
        res.headers.set("Cache-Control", "no-store");
        return res;
    }
    catch {
        return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
}
