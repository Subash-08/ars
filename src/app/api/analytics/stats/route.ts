import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
    const denied = requireAdmin(req);
    if (denied)
        return denied;
    try {
        const [views, leadsCount] = await Promise.all([prisma.pageView.findMany({ select: { createdAt: true, utmSource: true } }), prisma.lead.count()]);
        const totalVisits = views.length;
        const sourceCounts = new Map<string, number>();
        for (const v of views) {
            const name = v.utmSource || "Direct";
            sourceCounts.set(name, (sourceCounts.get(name) || 0) + 1);
        }
        const sources = Array.from(sourceCounts, ([name, count]) => ({ name, count, pct: totalVisits ? `${(count / totalVisits * 100).toFixed(1)}%` : "0%" }));
        return NextResponse.json({ success: true, stats: { totalVisits, uniqueVisitors: null, leadsCount, conversionRate: null, dailyTrend: [], sources } }, { headers: { "Cache-Control": "no-store" } });
    }
    catch {
        return NextResponse.json({ success: false, error: "Analytics are unavailable" }, { status: 503 });
    }
}
