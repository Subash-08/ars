import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { readJson, unavailable } from "@/lib/request";
export async function PATCH(req: Request, { params }: {
    params: {
        id: string;
    };
}) {
    const denied = requireAdmin(req);
    if (denied)
        return denied;
    let body;
    try {
        body = await readJson(req);
    }
    catch {
        return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
    const { status, notes, assignedBranch } = body;
    if (status !== undefined && !["NEW", "CONTACTED", "TEST_DRIVE_SCHEDULED", "CONVERTED", "LOST"].includes(String(status)))
        return NextResponse.json({ success: false, error: "Invalid status. Payment cannot be confirmed here." }, { status: 400 });
    if (notes !== undefined && (typeof notes !== "string" || notes.length > 4000))
        return NextResponse.json({ success: false, error: "Invalid notes" }, { status: 400 });
    if (assignedBranch !== undefined && !["Seelanaickenpatti", "Madathur"].includes(String(assignedBranch)))
        return NextResponse.json({ success: false, error: "Invalid branch" }, { status: 400 });
    try {
        const lead = await prisma.lead.update({ where: { id: params.id }, data: { ...(status ? { status: String(status) } : {}), ...(notes !== undefined ? { notes: String(notes) } : {}), ...(assignedBranch ? { assignedBranch: String(assignedBranch) } : {}) } });
        return NextResponse.json({ success: true, lead });
    }
    catch {
        return unavailable();
    }
}
export async function DELETE(req: Request, { params }: {
    params: {
        id: string;
    };
}) { const denied = requireAdmin(req); if (denied)
    return denied; try {
    await prisma.lead.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
}
catch {
    return unavailable();
} }
