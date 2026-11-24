import { CustomerSections } from "@/components/customer-stories";
import { publicStories } from "@/lib/customer-stories";
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
  const [catalog, stories] = await Promise.all([getCatalog(), publicStories()]);
  return <SiteShell><HomeHero/><ProductCatalog {...catalog} compact/><HomeBenefits/><ProductStudio/><FinanceTeaser/><OffersContent/><LocalTeaser/><CustomerSections stories={stories}/><HomeFaq/><BookingCta/></SiteShell>;
}
