import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sameOrigin } from "@/lib/auth";
import { readJson, rateLimit } from "@/lib/request";
export async function POST(req: Request) { if (!sameOrigin(req))
    return NextResponse.json({ success: false }, { status: 403 }); if (rateLimit("analytics-global", 300, 60000))
    return NextResponse.json({ success: false }, { status: 429 }); try {
    const body = await readJson(req);
    if (body.consent !== true)
        return NextResponse.json({ success: false }, { status: 400 });
    const value = (key: string, max = 500) => typeof body[key] === "string" ? (body[key] as string).slice(0, max) : null;
    await prisma.pageView.create({ data: { path: value("path") || "/", referrer: value("referrer"), userAgent: value("userAgent"), deviceType: value("deviceType", 30), utmSource: value("utmSource", 200), utmCampaign: value("utmCampaign", 200) } });
    return NextResponse.json({ success: true });
}
catch {
    return NextResponse.json({ success: false }, { status: 503 });
} }
