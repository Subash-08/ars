import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, notes, assignedBranch } = body;

    try {
      const updated = await prisma.lead.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(notes !== undefined && { notes }),
          ...(assignedBranch && { assignedBranch }),
        },
      });
      return NextResponse.json({ success: true, lead: updated });
    } catch {
      return NextResponse.json({ success: true, id, status, notes });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    try {
      await prisma.lead.delete({ where: { id } });
    } catch {
      // ignore
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
