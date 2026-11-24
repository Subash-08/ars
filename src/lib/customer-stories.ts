import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { CustomerStory } from "./story-types";

type StoryRow = Omit<CustomerStory, "imageUrl"> & { imagePath: string | null; hasImage: number | bigint };

export async function listStories(admin = false): Promise<CustomerStory[]> {
  const published = admin ? Prisma.empty : Prisma.sql`WHERE isActive = true`;
  const rows = await prisma.$queryRaw<StoryRow[]>`
    SELECT id, customerName, location, testimonial, kind, imagePath, "order",
      isActive, isDemo, image IS NOT NULL AS hasImage
    FROM CustomerStory ${published}
    ORDER BY kind, "order", id
  `;
  return rows.map(({ imagePath, hasImage, ...story }) => ({
    ...story,
    isActive: Boolean(story.isActive),
    isDemo: Boolean(story.isDemo),
    imageUrl: hasImage ? `/api/customer-stories/${story.id}/image` : imagePath || "",
  }));
}

export async function publicStories() {
  try {
    return await listStories();
  } catch (error) {
    console.error("Could not load customer stories", error instanceof Error ? error.message : error);
    return [];
  }
}
