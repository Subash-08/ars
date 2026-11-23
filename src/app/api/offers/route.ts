import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export async function GET() { try {
    const offers = await prisma.offer.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
    const current = offers.filter(o => { const match = o.validTill.match(/(?:valid till|valid until)\s+(.+)/i); if (!match)
        return true; const date = new Date(match[1]); if (Number.isNaN(date.getTime()))
        return true; return new Date(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T23:59:59+05:30`).getTime() >= Date.now(); });
    return NextResponse.json({ success: true, offers: current }, { headers: { "Cache-Control": "no-store" } });
}
catch {
    return NextResponse.json({ success: false, error: "Offers are temporarily unavailable.", offers: [] }, { status: 503 });
} }
