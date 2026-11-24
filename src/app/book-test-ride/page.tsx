import { Copy } from "@/components/site-language";
import { getCatalog } from "@/lib/catalog";
import type { Metadata } from "next";
import { SiteShell, PageIntro } from "@/components/site-shell";
import { LeadSection } from "@/components/lead-section";
export const metadata: Metadata = { title: "Request a Test Ride | ARS Motors Salem", description: "Request an E-Luna test ride or contact the ARS Motors team in Salem.", alternates: { canonical: "/book-test-ride" }, robots: { index: false, follow: true } };
export const dynamic = "force-dynamic";
export default async function BookingPage({ searchParams }: {
    searchParams: Record<string, string | string[] | undefined>;
}) { const catalog = await getCatalog(); const context = Object.fromEntries(Object.entries(searchParams).filter((entry): entry is [
    string,
    string
] => typeof entry[1] === "string")); return <SiteShell><PageIntro eyebrow="Test Ride & Enquiries" title="Your next ride starts here."><Copy>{"Choose your showroom and preferred time. Our team will contact you to confirm availability. No online payment is required."}</Copy></PageIntro><LeadSection key={JSON.stringify(context)} lang="en" initialContext={context} models={catalog.products.map(p => p.name)}/></SiteShell>; }
