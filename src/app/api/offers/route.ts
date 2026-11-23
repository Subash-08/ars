import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const fallbackOffers = [
  {
    id: "off-1",
    title: "Salem Priority Token Booking",
    badge: "Priority Allocation",
    discount: "Book @ ₹1,000 Only",
    validTill: "Valid till Dec 31, 2026",
    description: "Secure your early vehicle delivery slot with priority factory allocation directly from ARS Motors Salem.",
    terms: "100% Refundable prior to invoice. T&C Apply.",
    isActive: true,
    order: 1,
  },
  {
    id: "off-2",
    title: "Two-Wheeler Exchange Bonus",
    badge: "Exchange Special",
    discount: "Up to ₹5,000 Extra Value",
    validTill: "Limited Period",
    description: "Exchange any old petrol moped or motorcycle (TVS XL, Splendor, etc.) for fair valuation plus up to ₹5,000 exchange bonus.",
    terms: "Subject to physical inspection at Salem showroom.",
    isActive: true,
    order: 2,
  },
  {
    id: "off-3",
    title: "Complimentary Safety Kit",
    badge: "Free On Delivery",
    discount: "Free ISI Certified Helmet",
    validTill: "Active for All Bookings",
    description: "Receive a brand-new ISI certified safety helmet and essential roadside maintenance toolkit with every vehicle delivery.",
    terms: "One kit per registered vehicle.",
    isActive: true,
    order: 3,
  },
];

export async function GET() {
  try {
    const offers = await prisma.offer.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    if (offers && offers.length > 0) {
      return NextResponse.json({ success: true, offers });
    }
    return NextResponse.json({ success: true, offers: fallbackOffers });
  } catch {
    return NextResponse.json({ success: true, offers: fallbackOffers });
  }
}
