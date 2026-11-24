import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://arsmotors.in").replace(/\/$/, "");
  const { products } = await getCatalog();
  const pages = ["", "/e-luna", "/finance-offers", "/ownership", "/showrooms", "/about", "/privacy", "/booking-terms", "/offer-terms"];
  return [...pages, ...products.map(product => `/e-luna/${product.slug}`)]
    .map(path => ({ url: base + path, changeFrequency: "monthly", priority: path ? 0.7 : 1 }));
}
