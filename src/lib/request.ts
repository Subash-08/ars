import { NextResponse } from "next/server";
// Best-effort per-process abuse control. Use shared infrastructure for multiple instances.
const attempts = new Map<string, {
    count: number;
    until: number;
}>();
export function rateLimit(key: string, max: number, windowMs: number) { const now = Date.now(); if (attempts.size > 10000)
    for (const [k, v] of attempts)
        if (v.until < now)
            attempts.delete(k); const entry = attempts.get(key); if (!entry || entry.until < now) {
    attempts.set(key, { count: 1, until: now + windowMs });
    return false;
} entry.count++; return entry.count > max; }
export async function readJson(req: Request) { const text = await req.text(); if (text.length > 16000)
    throw new Error("Request too large"); const body = JSON.parse(text); if (!body || typeof body !== "object" || Array.isArray(body))
    throw new Error("Invalid request"); return body as Record<string, unknown>; }
export function unavailable() { return NextResponse.json({ success: false, error: "We could not save your request. Please try again or call +91 90253 80626." }, { status: 503 }); }
