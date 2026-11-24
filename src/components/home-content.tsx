"use client";
import { Copy } from "@/components/site-language";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, MapPin, PlugZap } from "lucide-react";
import { Hero } from "./hero";
import { Reveal } from "./reveal";
import { bookingUrl } from "@/lib/navigation";
export function HomeHero() { const router = useRouter(); return <Hero lang="en" onBookTestRide={model => router.push(bookingUrl({ model }))} onExplore360={() => { document.getElementById("360-studio")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }} onLearnMore={() => router.push("/e-luna/kinetic-e-luna-pro-x3#specifications")} onCalculateSavings={() => router.push("/finance-offers#savings-calculator")}/>; }
export function HomeBenefits() {
  const details = [
    {
      icon: PlugZap, tone: "bg-[#e7eee3]", title: "Charging, made familiar",
      description: "Understand home charging, battery care and the setup recommended for your vehicle.",
      href: "/ownership#charging-guide", label: "Explore ownership",
    },
    {
      icon: MapPin, tone: "bg-[#f0eae0]", title: "A local team to turn to",
      description: "Visit our Salem showrooms for a demonstration, product advice and service enquiries.",
      href: "/showrooms", label: "Visit ARS Motors",
    },
  ];
  return (
    <section aria-labelledby="daily-ride-title" className="border-b border-[#dce7df] bg-[#f8f9f6] py-16 text-[#14251d] sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-900"><Copy>{"Built around your day"}</Copy></p>
          <h2 id="daily-ride-title" className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            <Copy>{"Less complexity. More possibility."}</Copy>
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-[1.65fr_1fr] lg:gap-5">
          <Reveal delay={50} className="md:row-span-2">
            <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-[#17372b] text-white">
              <div className="overflow-hidden">
                <img src="/assets/bikes/hero-lifestyle-market.jpg" alt="Kinetic E-Luna"
                  loading="lazy" decoding="async" width={960} height={640}
                  className="aspect-[16/10] w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.035]"/>
              </div>
              <div className="flex grow flex-col items-start p-6 sm:p-8">
                <h3 className="text-2xl font-bold sm:text-3xl"><Copy>{"A practical everyday ride"}</Copy></h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-[#e0ede4] sm:text-base">
                  <Copy>{"Explore options for the daily commute, family errands and business deliveries."}</Copy>
                </p>
                <Link href="/e-luna" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-[#17372b] hover:bg-[#e0ede4]">
                  <Copy>{"Find your fit"}</Copy><ArrowUpRight size={16} aria-hidden="true"/>
                </Link>
              </div>
            </article>
          </Reveal>
          {details.map(({ icon: Icon, tone, title, description, href, label }, index) => (
            <Reveal key={href} delay={130 + index * 85}>
              <article className={`flex h-full flex-col items-start rounded-3xl p-6 sm:p-8 ${tone}`}>
                <span className="grid size-11 place-items-center rounded-xl bg-white/75">
                  <Icon size={22} aria-hidden="true"/>
                </span>
                <h3 className="mt-4 text-xl font-extrabold sm:text-2xl"><Copy>{title}</Copy></h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#334239]"><Copy>{description}</Copy></p>
                <Link href={href} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold underline decoration-current/35 underline-offset-4 hover:decoration-current">
                  <Copy>{label}</Copy><ArrowUpRight size={16} aria-hidden="true"/>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
export function FinanceTeaser() { return <section className="py-16 sm:py-24"><div className="max-w-7xl mx-auto px-5 sm:px-8"><Reveal><div className="rounded-3xl bg-neutral-950 text-white p-8 sm:p-14 grid md:grid-cols-2 gap-10 items-center"><div><p className="text-[11px] uppercase tracking-[0.22em] text-neutral-400"><Copy>{"Make an informed move"}</Copy></p><h2 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tight"><Copy>{"See what electric"}</Copy><br /><Copy>{"could mean for you."}</Copy></h2></div><div><p className="text-neutral-300 leading-relaxed text-sm sm:text-base"><Copy>{"Compare estimated running costs, explore monthly repayments, or ask about exchanging your current two-wheeler. Your inputs. A clearer picture."}</Copy></p><Link href="/finance-offers" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-neutral-200 transition-colors"><Copy>{"Explore finance & savings"}</Copy>{" "}<span className="ml-5" aria-hidden="true">↗</span></Link><p className="mt-4 text-xs text-neutral-400"><Copy>{"Illustrations only. Final quotes and finance are subject to confirmation."}</Copy></p></div></div></Reveal></div></section>; }
export function LocalTeaser() { return <section className="pb-16 sm:pb-24"><div className="max-w-7xl mx-auto px-5 sm:px-8"><Reveal><div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center"><img src="/assets/bikes/commuter-family-hd.jpg" alt="Kinetic E-Luna" loading="lazy" width={800} height={640} className="w-full aspect-[5/4] object-cover rounded-2xl"/><div><p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 font-semibold"><Copy>{"ARS Motors · Salem"}</Copy></p><h2 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tight"><Copy>{"Get to know your next ride."}</Copy><br /><Copy>{"In person."}</Copy></h2><p className="mt-5 text-neutral-600 leading-relaxed"><Copy>{"Speak with our local team, see the vehicle up close and request a test ride at a convenient showroom."}</Copy></p><div className="mt-6 space-y-3 text-sm"><Link className="block border-b border-neutral-200 pb-3" href="/showrooms#seelanaickenpatti"><Copy>{"Seelanaickenpatti Bypass"}</Copy>{" "}<span className="float-right" aria-hidden="true">↗</span></Link><Link className="block border-b border-neutral-200 pb-3" href="/showrooms#madathur"><Copy>{"Madathur Branch"}</Copy>{" "}<span className="float-right" aria-hidden="true">↗</span></Link></div><Link href="/about" className="mt-6 inline-block text-sm underline underline-offset-4"><Copy>{"Meet ARS Motors"}</Copy></Link></div></div></Reveal></div></section>; }
