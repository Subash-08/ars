import { createHmac, timingSafeEqual, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
export const SESSION_COOKIE = "ars_staff_session";
const duration = 8 * 60 * 60;
function secret() { const value = process.env.AUTH_SECRET; return value && value.length >= 32 ? value : null; }
export function authConfigured() { return !!secret() && !!process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 12; }
export function safeEqual(a: string, b: string) { const aa = Buffer.from(a); const bb = Buffer.from(b); return aa.length === bb.length && timingSafeEqual(aa, bb); }
export function createSession() { const key = secret(); if (!key)
    throw new Error("Staff authentication is not configured"); const payload = Buffer.from(JSON.stringify({ expires: Date.now() + duration * 1000, nonce: randomBytes(24).toString("hex") })).toString("base64url"); return `${payload}.${createHmac("sha256", key).update(payload).digest("base64url")}`; }
export function validSession(token?: string) { const key = secret(); if (!key || !token || !authConfigured())
    return false; try {
    const parts = token.split(".");
    if (parts.length !== 2)
        return false;
    const [payload, signature] = parts;
    if (!safeEqual(signature, createHmac("sha256", key).update(payload).digest("base64url")))
        return false;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof data.expires === "number" && data.expires > Date.now() && data.expires <= Date.now() + duration * 1000;
}
catch {
    return false;
} }
export function sameOrigin(req: Request) { const origin = req.headers.get("origin"); return !!origin && origin === new URL(req.url).origin; }
export function requireAdmin(req: Request) { const raw = req.headers.get("cookie")?.split(";").map(v => v.trim()).find(v => v.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1); if (!validSession(raw))
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 }); if (!["GET", "HEAD"].includes(req.method) && !sameOrigin(req))
    return NextResponse.json({ success: false, error: "Invalid request origin" }, { status: 403 }); return null; }
export const sessionOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/", maxAge: duration };
