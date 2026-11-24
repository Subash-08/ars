import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const allowDraft = requireAdmin(req) === null;
  try {
    const [story] = await prisma.$queryRaw<{ image: Uint8Array; imageType: string }[]>`
      SELECT image, imageType FROM CustomerStory
      WHERE id = ${params.id} AND image IS NOT NULL AND (isActive = true OR ${allowDraft})
    `;
    if (!story || !["image/jpeg", "image/png", "image/webp"].includes(story.imageType)) {
      return new Response(null, { status: 404 });
    }
    return new Response(new Uint8Array(story.image), { headers: {
      "Content-Type": story.imageType,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    } });
  } catch {
    return new Response(null, { status: 503 });
  }
}
