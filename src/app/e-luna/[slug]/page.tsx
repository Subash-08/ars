import { Copy } from "@/components/site-language";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { SiteShell } from "@/components/site-shell";
import { ProductStudio } from "@/components/product-studio";
import type { VariantType } from "@/components/eluna-3d-canvas";
import { Reveal } from "@/components/reveal";
import { getProduct } from "@/lib/catalog";
import { bookingUrl } from "@/lib/navigation";

export const dynamic = "force-dynamic";
const productBySlug = cache(getProduct);

const modelDetails: Record<string, { studio: VariantType; headline: string; points: string[] }> = {
  "kinetic-e-luna-pro-x3": {
    studio: "pro_x3", headline: "For commutes, errands and everyday utility",
    points: ["Ask about available finishes and seating options.", "Try it on a route similar to your daily commute.", "Confirm battery, charging equipment and component warranty for the quoted vehicle."],
  },
  "e-luna-commercial-cargo": {
    studio: "cargo", headline: "Plan around your delivery route and load",
    points: ["Discuss suitable racks and approved cargo accessories.", "Check how load and stop-start riding affect your daily range.", "Ask the showroom to confirm the permitted load for your setup."],
  },
  "e-luna-city-commuter": {
    studio: "commuter", headline: "A practical option for local trips",
    points: ["Check seating and passenger comfort in person.", "Compare battery and charging options for your regular journeys.", "Try getting on, parking and handling the vehicle at low speed."],
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await productBySlug(params.slug);
  if (!product) return {};
  const title = `${product.name} | ARS Motors Salem`;
  const url = `/e-luna/${product.slug}`;
  return {
    title, description: product.description,
    alternates: { canonical: url },
    openGraph: { title, url, description: product.description, images: [product.image] },
  };
}

export default async function BikePage({ params }: { params: { slug: string } }) {
  const product = await productBySlug(params.slug);
  if (!product) notFound();
  const details = modelDetails[product.slug];
  const spec = [
    ["Category", product.category], ["Listed range", product.range], ["Top speed", product.speed],
    ["Battery", product.battery], ["Motor", product.motor], ["Payload", product.payload], ["Listed warranty", product.warranty],
  ].filter(([, value]) => !!value);
  return (
    <SiteShell>
      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-20">
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-neutral-600">
            <Link href="/" className="underline"><Copy>{"Home"}</Copy></Link> / <Link href="/e-luna" className="underline">E-Luna</Link> / {product.name}
          </nav>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-800"><Copy>{product.category}</Copy></p>
              <h1 className="mt-4 text-4xl sm:text-6xl font-medium tracking-tight">{product.name}</h1>
              <p className="mt-5 text-neutral-600 leading-relaxed"><Copy>{product.description}</Copy></p>
              {product.price && <>
                <p className="mt-6 text-2xl font-semibold">{product.price}</p>
                <p className="mt-1 text-sm text-neutral-500"><Copy>{"Indicative listed price. Ask for an on-road quote."}</Copy></p>
              </>}
              <div className="mt-7 flex flex-wrap items-center gap-4">
                {product.price
                  ? <Link className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white" href={bookingUrl({model: product.name})}><Copy>{"Request a test ride"}</Copy></Link>
                  : <a className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white" href="tel:+919025380626"><Copy>{"Call for a quote or test ride"}</Copy></a>}
                <a className="text-sm underline underline-offset-4" href="#specifications"><Copy>{"See specifications"}</Copy></a>
              </div>
            </div>
            <img src={product.image} alt={product.name} width={900} height={675} className="w-full aspect-[4/3] object-cover rounded-3xl"/>
          </div>
        </div>
      </section>
      <section id="specifications" className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <Reveal>
          <h2 className="text-3xl font-medium tracking-tight"><Copy>{"Specifications"}</Copy></h2>
          <dl className="mt-7 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {spec.map(([label, value]) => <div key={label} className="rounded-2xl border border-neutral-200 p-5">
              <dt className="text-sm text-neutral-500"><Copy>{label}</Copy></dt><dd className="mt-2 font-medium"><Copy>{value}</Copy></dd>
            </div>)}
          </dl>
          <p className="mt-5 text-sm text-neutral-600"><Copy>{"Confirm the manufacturer specification, actual range, permitted load and written warranty for the exact vehicle before purchase."}</Copy></p>
        </Reveal>
      </section>
      {details && <>
        <section className="bg-neutral-950 text-white">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 grid gap-8 md:grid-cols-2">
            <h2 className="text-3xl font-medium tracking-tight"><Copy>{details.headline}</Copy></h2>
            <ul className="list-disc pl-5 space-y-3 text-neutral-200">{details.points.map(point => <li key={point}><Copy>{point}</Copy></li>)}</ul>
          </div>
        </section>
        <ProductStudio variant={details.studio} preview={product.image}/>
      </>}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-14 flex flex-wrap gap-6 text-sm font-semibold">
        <Link className="underline underline-offset-4" href={bookingUrl({model: product.name, inquiry: "brochure"})}><Copy>{"Request the brochure"}</Copy></Link>
        <Link className="underline underline-offset-4" href="/finance-offers"><Copy>{"Finance and exchange"}</Copy></Link>
        <Link className="underline underline-offset-4" href="/showrooms"><Copy>{"Visit a showroom"}</Copy></Link>
        <Link className="underline underline-offset-4" href="/e-luna#features"><Copy>{"Engineering Highlights"}</Copy></Link>
        <Link className="underline underline-offset-4" href="/e-luna#technical-specifications"><Copy>{"Technical Specifications"}</Copy></Link>
        <Link className="underline underline-offset-4" href="/e-luna#specs-matrix"><Copy>{"Compare all bikes"}</Copy></Link>
      </section>
    </SiteShell>
  );
}
