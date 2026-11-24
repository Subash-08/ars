"use client";

import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";
import type { Language } from "@/lib/translations";

const explore = [
  ["Explore E-Luna", "/e-luna"],
  ["Finance & offers", "/finance-offers"],
  ["Running cost calculator", "/finance-offers#savings-calculator"],
  ["EMI calculator", "/finance-offers#emi-calculator"],
  ["Ownership & service", "/ownership"],
  ["About ARS Motors", "/about"],
];

const branches = [
  {
    name: "Seelanaickenpatti",
    address: "3/345, Seelanaickenpatti Bypass, Near Dharan Hospital, Salem – 636 201.",
    number: "+91 90 25 38 06 26",
    tel: "+919025380626",
    hours: "Daily · 9:00 AM – 8:30 PM",
    href: "/showrooms#seelanaickenpatti",
  },
  {
    name: "Madathur",
    address: "Elampillai to Chinnappampatti Road, Madathur Bus Stop, Salem District – 636 501.",
    number: "+91 94 43 24 07 52",
    tel: "+919443240752",
    hours: "Daily · 9:00 AM – 8:00 PM",
    href: "/showrooms#madathur",
  },
];

const policies = [
  ["Privacy", "/privacy"],
  ["Booking terms", "/booking-terms"],
  ["Offer terms", "/offer-terms"],
  ["Staff portal", "/admin/login"],
];

const textLink = "text-sm text-neutral-700 transition-colors hover:text-emerald-950 hover:underline underline-offset-4";

export function Footer({ lang }: { lang: Language }) {
  return (
    <footer lang={lang} className="border-t border-[#dbe5dd] bg-[#f4f7f3] text-[#14251d]">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-9 py-12 sm:grid-cols-2 lg:grid-cols-[1.15fr_0.85fr_2fr] lg:gap-12 lg:py-16">
          <div>
            <Link href="/" className="inline-block text-2xl font-black tracking-[0.13em]">ARS MOTORS</Link>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-900">Kinetic Green · Salem</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-700">Explore E-Luna, arrange a test ride, or speak to our Salem team about service and spare parts.</p>
            <Link href="/book-test-ride" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#14251d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-950">
              Request a test ride <ArrowUpRight size={15} aria-hidden="true"/>
            </Link>
          </div>
          <nav aria-label="Explore ARS Motors">
            <h2 className="text-sm font-bold">Explore</h2>
            <ul className="mt-4 grid gap-3">
              {explore.map(([label, href]) => <li key={href}><Link href={href} className={textLink}>{label}</Link></li>)}
            </ul>
          </nav>
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-sm font-bold">Visit us in Salem</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {branches.map(branch => (
                <address key={branch.href} className="rounded-2xl border border-[#dbe5dd] bg-white p-4 text-sm not-italic">
                  <Link href={branch.href} className="inline-flex items-center gap-2 font-semibold hover:underline">
                    <MapPin size={15} aria-hidden="true" className="shrink-0 text-emerald-900"/>{branch.name}<ArrowUpRight size={13} aria-hidden="true"/>
                  </Link>
                  <p className="mt-3 text-xs leading-relaxed text-neutral-600">{branch.address}</p>
                  <a className="mt-3 flex items-center gap-2 font-semibold hover:underline" href={`tel:${branch.tel}`}><Phone size={14} aria-hidden="true"/>{branch.number}</a>
                  <p className="mt-2 flex items-center gap-2 text-xs text-neutral-600"><Clock3 size={14} aria-hidden="true"/>{branch.hours}</p>
                </address>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-[#dbe5dd] pb-24 pt-6 text-xs text-neutral-600 sm:pb-8 lg:flex-row lg:justify-between">
          <p>© 2026 ARS Motors Salem. All rights reserved.</p>
          <nav aria-label="Policies and staff access" className="flex flex-wrap gap-x-5 gap-y-3">
            {policies.map(([label, href]) => <Link href={href} key={href} className="hover:underline">{label}</Link>)}
            <button type="button" className="hover:underline" onClick={() => window.dispatchEvent(new Event("ars-preferences"))}>Analytics preferences</button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
