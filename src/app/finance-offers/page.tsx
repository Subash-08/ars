import { Copy } from "@/components/site-language";
import type { Metadata } from "next";
import { SiteShell, PageIntro } from "@/components/site-shell";
import { FinanceTools } from "@/components/finance-tools";
import { OffersContent } from "@/components/offers-content";
import { BookingCta } from "@/components/booking-cta";
export const metadata: Metadata = { title: "Finance, Savings & Offers | ARS Motors", description: "Explore illustrative EMI and running costs, exchange enquiries and dealership offers.", alternates: { canonical: "/finance-offers" }, openGraph: { title: "Finance & Offers | ARS Motors", url: "/finance-offers" } };
export default function FinancePage() { return <SiteShell><PageIntro eyebrow="Finance & Offers" title="A clearer view of the cost."><Copy>{"Explore repayments, compare running costs and discuss your exchange. Practical tools to help you ask the right questions."}</Copy></PageIntro><FinanceTools /><OffersContent /><BookingCta /></SiteShell>; }
