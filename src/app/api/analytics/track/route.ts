import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { path, referrer, userAgent, deviceType, utmSource, utmCampaign } = body;

    try {
      await prisma.pageView.create({
        data: {
          path: path || "/",
          referrer: referrer || null,
          userAgent: userAgent || null,
          deviceType: deviceType || "Desktop",
          utmSource: utmSource || "Direct",
          utmCampaign: utmCampaign || null,
        },
      });
    } catch {
      // Non-blocking telemetry
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
