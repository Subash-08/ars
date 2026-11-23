import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, sameOrigin } from "@/lib/auth";
import { rateLimit, readJson, unavailable } from "@/lib/request";
import { validateLead } from "@/lib/lead-validation";
export const dynamic = "force-dynamic";
export async function GET(req: Request) { const denied = requireAdmin(req); if (denied)
    return denied; try {
    return NextResponse.json({ success: true, leads: await prisma.lead.findMany({ orderBy: { createdAt: "desc" } }) }, { headers: { "Cache-Control": "no-store" } });
}
catch {
    return unavailable();
} }
export async function POST(req: Request) {
    if (!sameOrigin(req))
        return NextResponse.json({ success: false, error: "Invalid request origin" }, { status: 403 });
    if (rateLimit("leads-global", 60, 60000))
        return NextResponse.json({ success: false, error: "Too many requests. Please wait a minute." }, { status: 429 });
    let data;
    try {
        const body = await readJson(req);
        if (body.consent !== true)
            throw new Error("Please agree to contact about your request.");
        if (body.website)
            throw new Error("Invalid request.");
        data = validateLead(body);
    }
    catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Invalid request" }, { status: 400 });
    }
    try {
        const recent = await prisma.lead.findFirst({ where: { ...data, useCase: data.useCase || "Personal", cityArea: data.cityArea || "Salem", source: data.source || "Website Direct", ...Object.fromEntries(["email", "preferredColor", "exchangeBrand", "preferredDate", "preferredTime", "message", "utmSource", "utmMedium", "utmCampaign"].map(key => [key, data[key] || null])), createdAt: { gte: new Date(Date.now() - 60000) } } });
        if (recent)
            return NextResponse.json({ success: true, reference: recent.id }, { headers: { "Cache-Control": "no-store" } });
        const lead = await prisma.lead.create({ data: { ...data, status: "NEW", notes: `Contact permission recorded ${new Date().toISOString()}` } });
        return NextResponse.json({ success: true, reference: lead.id }, { status: 201, headers: { "Cache-Control": "no-store" } });
    }
    catch {
        return unavailable();
    }
}
