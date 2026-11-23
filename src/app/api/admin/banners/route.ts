import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: Request) {
    const denied = requireAdmin(req);
    if (denied)
        return denied;
    try {
        const banners = await prisma.banner.findMany({
            orderBy: { order: "asc" },
        });
        return NextResponse.json({ success: true, banners });
    }
    catch (err: any) {
        return NextResponse.json({ success: false, error: "The operation could not be completed." }, { status: 500 });
    }
}
export async function POST(req: Request) {
    const denied = requireAdmin(req);
    if (denied)
        return denied;
    try {
        const body = await req.json();
        const { headline, subheadline, ctaText, ctaLink, image, tag1, tag2, isActive, order } = body;
        const newBanner = await prisma.banner.create({
            data: {
                headline,
                subheadline,
                ctaText: ctaText || "Book Test Ride",
                ctaLink: ctaLink || "#get-in-touch",
                image,
                tag1: tag1 || null,
                tag2: tag2 || null,
                isActive: isActive !== undefined ? isActive : true,
                order: order || 0,
            },
        });
        return NextResponse.json({ success: true, banner: newBanner });
    }
    catch (err: any) {
        return NextResponse.json({ success: false, error: "The operation could not be completed." }, { status: 500 });
    }
}
export async function PUT(req: Request) {
    const denied = requireAdmin(req);
    if (denied)
        return denied;
    try {
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) {
            return NextResponse.json({ success: false, error: "Banner ID required" }, { status: 400 });
        }
        const updated = await prisma.banner.update({
            where: { id },
            data,
        });
        return NextResponse.json({ success: true, banner: updated });
    }
    catch (err: any) {
        return NextResponse.json({ success: false, error: "The operation could not be completed." }, { status: 500 });
    }
}
export async function DELETE(req: Request) {
    const denied = requireAdmin(req);
    if (denied)
        return denied;
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json({ success: false, error: "Banner ID required" }, { status: 400 });
        }
        await prisma.banner.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    }
    catch (err: any) {
        return NextResponse.json({ success: false, error: "The operation could not be completed." }, { status: 500 });
    }
}
