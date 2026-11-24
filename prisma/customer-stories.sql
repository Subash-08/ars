CREATE TABLE IF NOT EXISTS "CustomerStory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "customerName" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "testimonial" TEXT NOT NULL,
  "kind" TEXT NOT NULL DEFAULT 'delivery',
  "imagePath" TEXT,
  "image" BLOB,
  "imageType" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT false,
  "isDemo" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" DATETIME NOT NULL
);
CREATE INDEX IF NOT EXISTS "CustomerStory_kind_isActive_order_idx"
  ON "CustomerStory" ("kind", "isActive", "order");
