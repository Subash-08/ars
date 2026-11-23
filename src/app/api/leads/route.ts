import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// In-memory fallback if Prisma database engine is initializing
let fallbackLeads: any[] = [
  {
    id: "lead-demo-1",
    name: "Murugan S",
    phone: "9842712345",
    email: "murugan.salem@gmail.com",
    cityArea: "Seelanaickenpatti, Salem",
    preferredColor: "Pearl Yellow",
    inquiryType: "Token Booking @ 1000",
    useCase: "Commercial Cargo",
    assignedBranch: "Seelanaickenpatti",
    status: "BOOKED_1000",
    notes: "Requires home delivery with detachable rear carrier setup.",
    source: "Flyer QR Code",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "lead-demo-2",
    name: "Kavitha R",
    phone: "9443298765",
    email: null,
    cityArea: "Elampillai, Salem",
    preferredColor: "Mulberry Red",
    inquiryType: "Test Drive",
    useCase: "Personal",
    assignedBranch: "Madathur",
    status: "TEST_DRIVE_SCHEDULED",
    notes: "Wants showroom test drive on Saturday 4 PM.",
    source: "Website Direct",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "lead-demo-3",
    name: "Dhanasekar P",
    phone: "9789012345",
    email: null,
    cityArea: "Suramangalam, Salem",
    preferredColor: "Night Star Black",
    inquiryType: "Exchange",
    useCase: "Personal",
    assignedBranch: "Seelanaickenpatti",
    status: "CONTACTED",
    notes: "Exchanging 2018 TVS XL 100 for extra trade-in bonus.",
    source: "Google Search",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];

export async function GET(req: Request) {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, leads });
  } catch {
    // Return fallback leads if local sqlite hasn't completed prisma generate
    return NextResponse.json({ success: true, leads: fallbackLeads });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      cityArea,
      preferredColor,
      inquiryType,
      useCase,
      exchangeBrand,
      assignedBranch,
      preferredDate,
      preferredTime,
      message,
      source,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Name and phone are required" },
        { status: 400 }
      );
    }

    try {
      const newLead = await prisma.lead.create({
        data: {
          name,
          phone,
          email: email || null,
          cityArea: cityArea || "Salem",
          preferredColor: preferredColor || "Pearl Yellow",
          inquiryType: inquiryType || "Test Drive",
          useCase: useCase || "Personal",
          exchangeBrand: exchangeBrand || null,
          assignedBranch: assignedBranch || "Seelanaickenpatti",
          preferredDate: preferredDate || null,
          preferredTime: preferredTime || null,
          message: message || null,
          source: source || "Website Direct",
          status: inquiryType?.includes("1000") ? "BOOKED_1000" : "NEW",
        },
      });
      return NextResponse.json({ success: true, lead: newLead });
    } catch {
      const fallbackItem = {
        id: "lead-" + Date.now(),
        name,
        phone,
        email: email || null,
        cityArea: cityArea || "Salem",
        preferredColor: preferredColor || "Pearl Yellow",
        inquiryType: inquiryType || "Test Drive",
        useCase: useCase || "Personal",
        exchangeBrand: exchangeBrand || null,
        assignedBranch: assignedBranch || "Seelanaickenpatti",
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        message: message || null,
        source: source || "Website Direct",
        status: inquiryType?.includes("1000") ? "BOOKED_1000" : "NEW",
        createdAt: new Date().toISOString(),
      };
      fallbackLeads.unshift(fallbackItem);
      return NextResponse.json({ success: true, lead: fallbackItem });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
