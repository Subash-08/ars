import { requireAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: Request) {
    const denied = requireAdmin(req);
    if (denied)
        return denied;
    try {
        const products = await prisma.product.findMany({
            orderBy: { order: "asc" },
        });
        return NextResponse.json({ success: true, products });
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
        const { name, slug, category, price, range, speed, payload, battery, motor, warranty, image, description, isPublished, order, } = body;
        const newProduct = await prisma.product.create({
            data: {
                name,
                slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                category: category || "Personal",
                price: price || "₹69,990*",
                range: range || "110 km",
                speed: speed || "50 km/h",
                payload: payload || "150 kg",
                battery: battery || "2.3 kWh Advanced Li-ion",
                motor: motor || "1.2 kW BLDC",
                warranty: warranty || "Confirm component coverage with showroom",
                image: image || "/assets/bikes/hires-yellow.jpg",
                description: description || "",
                isPublished: isPublished !== undefined ? isPublished : true,
                order: order || 0,
            },
        });
        return NextResponse.json({ success: true, product: newProduct });
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
            return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
        }
        const updated = await prisma.product.update({
            where: { id },
            data,
        });
        return NextResponse.json({ success: true, product: updated });
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
            return NextResponse.json({ success: false, error: "Product ID required" }, { status: 400 });
        }
        await prisma.product.delete({
            where: { id },
        });
        return NextResponse.json({ success: true });
    }
    catch (err: any) {
        return NextResponse.json({ success: false, error: "The operation could not be completed." }, { status: 500 });
    }
}
