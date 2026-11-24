const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { loadEnvConfig } = require("@next/env");
const { PrismaClient } = require("@prisma/client");

loadEnvConfig(join(__dirname, ".."));
const prisma = new PrismaClient();

async function setup() {
  const statements = readFileSync(join(__dirname, "customer-stories.sql"), "utf8")
    .split(";").map(statement => statement.trim()).filter(Boolean);
  const queries = statements.map(statement => prisma.$executeRawUnsafe(statement));
  if (process.argv.includes("--demo")) {
    const stories = require("./customer-stories.demo.json");
    for (const [order, [id, name, location, quote, kind]] of stories.entries()) {
      const asset = `/assets/customer-stories/${id}.webp`;
      queries.push(prisma.$executeRaw`
        INSERT OR IGNORE INTO CustomerStory
          (id, customerName, location, testimonial, kind, imagePath, "order", isActive, isDemo, updatedAt)
        VALUES (${id}, ${name}, ${location}, ${quote}, ${kind}, ${asset}, ${order}, true, true, CURRENT_TIMESTAMP)
      `);
    }
  }
  await prisma.$transaction(queries);
  console.log("Customer stories storage is ready.");
}

setup().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
