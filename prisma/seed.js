const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ARS Motors database...");

  // Staff access is configured with ADMIN_PASSWORD and AUTH_SECRET, never a seeded default.

  // 2. Seed Categories
  const categories = [
    {
      name: "Flagship Commuter",
      slug: "flagship-commuter",
      description: "High-performance electric mopeds designed for everyday personal and professional urban mobility.",
      order: 1,
    },
    {
      name: "Commercial Heavy-Duty",
      slug: "commercial-heavy-duty",
      description: "150 kg certified payload cargo workhorses with flatbed carrier for courier, parcel, and delivery fleets.",
      order: 2,
    },
    {
      name: "Family & Daily Commute",
      slug: "family-daily-commute",
      description: "Comfort-tuned electric mobility with cushioned dual split seats and safety saree guard.",
      order: 3,
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log("Categories seeded.");

  // 3. Seed Products
  const products = require("./products.seed.json");

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }
  console.log("Products seeded.");

  // 4. Seed Offers
  const offers = [
    {
      title: "Salem Priority Token Booking",
      badge: "Priority Allocation",
      discount: "Book @ ₹1,000 Only",
      validTill: "Valid till Dec 31, 2026",
      description: "Lock in your early delivery slot with priority factory allocation directly from ARS Motors Salem.",
      terms: "100% Refundable prior to invoice generation. T&C Apply.",
      isActive: true,
      order: 1,
    },
    {
      title: "Two-Wheeler Exchange Bonus",
      badge: "Exchange Special",
      discount: "Up to ₹5,000 Extra Value",
      validTill: "Limited Period",
      description: "Exchange your old petrol moped or motorcycle (TVS XL, Splendor, etc.) for fair market value plus up to ₹5,000 exchange bonus.",
      terms: "Subject to physical inspection at Salem showroom.",
      isActive: true,
      order: 2,
    },
    {
      title: "Complimentary Safety Kit",
      badge: "Free On Delivery",
      discount: "Free ISI Certified Helmet",
      validTill: "Active for All Bookings",
      description: "Receive a brand-new ISI certified safety helmet and essential maintenance toolkit with every vehicle delivery.",
      terms: "One kit per registered vehicle.",
      isActive: true,
      order: 3,
    },
  ];

  for (let i = 0; i < offers.length; i++) {
    const off = offers[i];
    const existing = await prisma.offer.findFirst({ where: { title: off.title } });
    if (!existing) {
      await prisma.offer.create({ data: off });
    }
  }
  console.log("Offers seeded.");

  // 5. Seed Banners
  const banners = [
    {
      headline: "Infinite Cruise. Infinitely better E-Luna PRO X3",
      subheadline: "10 paise/km running cost, 110 km certified range, built for Bharat.",
      ctaText: "Book Test Ride",
      ctaLink: "#get-in-touch",
      image: "/assets/bikes/hero-action-hd.jpg",
      tag1: "110 km Range",
      tag2: "10p / km Running Cost",
      isActive: true,
      order: 1,
    },
    {
      headline: "Infinite Toughness. Heavy-Duty Commercial Cargo",
      subheadline: "150 kg payload capacity. Detachable rear seat converts into an expansive flat steel carrier for crates and logistics.",
      ctaText: "Book Cargo Edition",
      ctaLink: "#get-in-touch",
      image: "/assets/bikes/cargo-heavy-hd.jpg",
      tag1: "150 kg Cargo Bed",
      tag2: "Heavy Steel Frame",
      isActive: true,
      order: 2,
    },
    {
      headline: "Infinite Comfort. Electric Freedom for Families",
      subheadline: "Telescopic front suspension, Combi Braking System (CBS), plush split seating, and effortless 3-pin home charging.",
      ctaText: "Book Test Ride",
      ctaLink: "#get-in-touch",
      image: "/assets/bikes/commuter-family-hd.jpg",
      tag1: "Dual Split Seats",
      tag2: "4-Hr Home Charge",
      isActive: true,
      order: 3,
    },
  ];

  for (let i = 0; i < banners.length; i++) {
    const ban = banners[i];
    const existing = await prisma.banner.findFirst({ where: { headline: ban.headline } });
    if (!existing) {
      await prisma.banner.create({ data: ban });
    }
  }
  console.log("Banners seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
