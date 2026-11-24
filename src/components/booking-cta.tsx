import { Copy } from "@/components/site-language";

import Link from "next/link";
import { ArrowUpRight, Bike, CalendarDays, MapPin, Phone } from "lucide-react";
import { Reveal } from "./reveal";

const visitSteps = [
  { icon: Bike, label: "Choose your E-Luna", copy: "Pick the model you’d like to try." },
  { icon: MapPin, label: "Pick a showroom", copy: "Choose Seelanaickenpatti or Madathur." },
  { icon: CalendarDays, label: "Get a confirmation", copy: "Our team will confirm your visit." },
];

export function BookingCta() {
  return (
    <section aria-labelledby="test-ride-title" className="bg-[#bcd2c4] px-5 py-14 text-[#14251d] sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="text-center">
            <p className="inline-block rounded-full border border-[#14251d]/20 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em]"><Copy>{"Your next step"}</Copy></p>
            <h2 id="test-ride-title" className="mt-7 text-[clamp(2.35rem,7vw,5.75rem)] font-black uppercase leading-[0.98] tracking-[-0.055em]">
              <Copy>{"Experience"}</Copy>{" "}<span className="whitespace-nowrap text-emerald-900">E-Luna</span><br className="hidden sm:block"/>{" "}<Copy>{"for yourself."}</Copy>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed sm:text-lg"><Copy>{"Request a test ride in Salem. Our showroom team will confirm availability."}</Copy></p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/book-test-ride" className="inline-flex items-center gap-3 rounded-full bg-[#14251d] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-950">
                <Copy>{"Book a test ride"}</Copy>{" "}<ArrowUpRight size={16} aria-hidden="true"/>
              </Link>
              <a href="tel:+919025380626" className="inline-flex items-center gap-3 rounded-full border border-[#14251d] px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white/40">
                <Copy>{"Call the showroom"}</Copy>{" "}<Phone size={16} aria-hidden="true"/>
              </a>
            </div>
          </div>
        </Reveal>
        <ul className="mt-9 grid gap-5 border-t border-[#14251d]/20 pt-6 sm:grid-cols-3 sm:gap-4">
          {visitSteps.map(({ icon: Icon, label, copy }) => (
            <li key={label} className="flex items-start gap-3 sm:flex-col sm:items-center sm:text-center">
              <Icon size={23} aria-hidden="true" className="shrink-0"/>
              <div><p className="text-sm font-bold"><Copy>{label}</Copy></p><p className="mt-1 text-sm text-[#263a30]"><Copy>{copy}</Copy></p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
