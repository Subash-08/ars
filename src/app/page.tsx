import { ProductStudio } from "@/components/product-studio";
import { HomeFaq } from "@/components/home-faq";
import { OffersContent } from "@/components/offers-content";
import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { HomeHero, HomeBenefits, FinanceTeaser, LocalTeaser } from "@/components/home-content";
import { ProductCatalog } from "@/components/product-catalog";
import { BookingCta } from "@/components/booking-cta";
import { getCatalog } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ARS Motors Salem | Explore Kinetic E-Luna", alternates: { canonical: "/" } };
export default async function HomePage() {
  const catalog = await getCatalog();
  return <SiteShell><HomeHero/><ProductCatalog {...catalog} compact/><HomeBenefits/><ProductStudio/><FinanceTeaser/><OffersContent/><LocalTeaser/><HomeFaq/><BookingCta/></SiteShell>;
}
