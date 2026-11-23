import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: Request) {
    const denied = requireAdmin(req);
    if (denied)
        return denied;
    try {
        const offers = await prisma.offer.findMany({
            orderBy: { order: "asc" },
        });
        return NextResponse.json({ success: true, offers });
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
        const { title, badge, discount, validTill, description, terms, isActive, order } = body;
        const newOffer = await prisma.offer.create({
            data: {
                title,
                badge: badge || "Special Offer",
                discount: discount || "",
                validTill: validTill || "Limited Period",
                description: description || "",
                terms: terms || "T&C Apply",
                isActive: isActive !== undefined ? isActive : true,
                order: order || 0,
            },
        });
        return NextResponse.json({ success: true, offer: newOffer });
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
            return NextResponse.json({ success: false, error: "Offer ID required" }, { status: 400 });
        }
        const updated = await prisma.offer.update({
            where: { id },
            data,
        });
        return NextResponse.json({ success: true, offer: updated });
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
            return NextResponse.json({ success: false, error: "Offer ID required" }, { status: 400 });
        }
        await prisma.offer.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    }
    catch (err: any) {
        return NextResponse.json({ success: false, error: "The operation could not be completed." }, { status: 500 });
    }
}
