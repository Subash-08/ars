import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listStories } from "@/lib/customer-stories";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
const maxImage = 3 * 1024 * 1024;
const response = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  try {
    return NextResponse.json({ stories: await listStories(true) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return response("Customer stories storage is unavailable.", 503);
  }
}

function imageType(bytes: Buffer) {
  if (bytes.length < 12) return "";
  if (bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) return "image/jpeg";
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "image/png";
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return "";
}

export async function POST(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const size = Number(req.headers.get("content-length"));
  if (!size || size > maxImage + 32768) return response("Upload a photo under 3 MB.", 413);
  let fields: FormData;
  try { fields = await req.formData(); } catch { return response("Invalid form.", 400); }
  const value = (name: string) => String(fields.get(name) ?? "").trim();
  const id = value("id");
  const name = value("customerName");
  const location = value("location");
  const quote = value("testimonial");
  const kind = value("kind");
  const active = value("isActive") === "true";
  if (!name || name.length > 100 || !location || location.length > 100 || !quote || quote.length > 220 ||
      !["testimonial", "delivery"].includes(kind)) return response("Check the name, location, quote and section.", 400);
  const upload = fields.get("image");
  let bytes: Buffer | null = null;
  let type: string | null = null;
  if (upload && typeof upload !== "string" && upload.size > 0) {
    if (upload.size > maxImage) return response("Upload a photo under 3 MB.", 413);
    bytes = Buffer.from(await upload.arrayBuffer());
    type = imageType(bytes);
    if (!type || type !== upload.type) return response("Choose a JPEG, PNG or WebP photo.", 400);
  }
  if (!id && !bytes) return response("Choose a photo for the new story.", 400);
  try {
    if (id) {
      const changed = await prisma.$executeRaw`
        UPDATE CustomerStory SET customerName = ${name}, location = ${location}, testimonial = ${quote},
          kind = ${kind}, isActive = ${active}, image = COALESCE(${bytes}, image),
          imageType = COALESCE(${type}, imageType), updatedAt = CURRENT_TIMESTAMP WHERE id = ${id}
      `;
      if (!changed) return response("Story not found.", 404);
    } else {
      await prisma.$executeRaw`
        INSERT INTO CustomerStory (id, customerName, location, testimonial, kind, image, imageType, "order", isActive, updatedAt)
        VALUES (${randomUUID()}, ${name}, ${location}, ${quote}, ${kind}, ${bytes}, ${type},
          (SELECT COALESCE(MAX("order"), -1) + 1 FROM CustomerStory WHERE kind = ${kind}), ${active}, CURRENT_TIMESTAMP)
      `;
    }
    return NextResponse.json({ success: true });
  } catch {
    return response("The story could not be saved.", 503);
  }
}

export async function PATCH(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  if (!body || typeof body.id !== "string") return response("Invalid story.", 400);
  try {
    if (typeof body.isActive === "boolean") {
      const changed = await prisma.$executeRaw`
        UPDATE CustomerStory SET isActive = ${body.isActive}, updatedAt = CURRENT_TIMESTAMP WHERE id = ${body.id}
      `;
      if (!changed) return response("Story not found.", 404);
    } else {
      if (body.move !== -1 && body.move !== 1) return response("Invalid order change.", 400);
      await prisma.$transaction(async tx => {
        const rows = await tx.$queryRaw<{ id: string }[]>`
          SELECT id FROM CustomerStory
          WHERE kind = (SELECT kind FROM CustomerStory WHERE id = ${body.id}) ORDER BY "order", id
        `;
        const index = rows.findIndex(row => row.id === body.id);
        const destination = index + body.move;
        if (index < 0 || destination < 0 || destination >= rows.length) return;
        [rows[index], rows[destination]] = [rows[destination], rows[index]];
        for (const [order, row] of rows.entries()) {
          await tx.$executeRaw`UPDATE CustomerStory SET "order" = ${order} WHERE id = ${row.id}`;
        }
      });
    }
    return NextResponse.json({ success: true });
  } catch {
    return response("The story could not be updated.", 503);
  }
}

export async function DELETE(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return response("Select a story.", 400);
  try {
    const changed = await prisma.$executeRaw`DELETE FROM CustomerStory WHERE id = ${id}`;
    return changed ? NextResponse.json({ success: true }) : response("Story not found.", 404);
  } catch {
    return response("The story could not be deleted.", 503);
  }
}
