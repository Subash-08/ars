"use client";

import { useState } from "react";
import {
  Activity, AlertTriangle, Anchor, ArrowDownRight, CircleDot, Disc, Gauge, Layers,
  Lock, PackageCheck, Shield, ShieldAlert, ShieldCheck, SmartphoneCharging, SunMedium, Users,
} from "lucide-react";
import { Copy, useCopy } from "./site-language";
import { Reveal } from "./reveal";

const features = [
  {
    id: 1,
    icon: ShieldCheck,
    title: "Sturdy Tubular Steel Chassis",
    category: "Chassis & Frame",
    spec: "150 kg Payload Capacity",
    desc: "All-metal heavy-duty tubular steel frame engineered to carry up to 150 kg payload across rugged Indian roads with anti-corrosion coating.",
  },
  {
    id: 2,
    icon: SunMedium,
    title: "High-Focus LED Headlamp",
    category: "Electrical & Tech",
    spec: "Long-Throw Projector Beam",
    desc: "High-intensity LED projector headlight providing superior night road visibility with ultra-low battery consumption and daytime running light.",
  },
  {
    id: 3,
    icon: Gauge,
    title: "Digital LCD Instrument Cluster",
    category: "Electrical & Tech",
    spec: "Speed • Battery SoC • Odometer",
    desc: "High-contrast digital instrument cluster showing real-time speed, battery state-of-charge percentage, trip meter, and diagnostic indicators.",
  },
  {
    id: 4,
    icon: AlertTriangle,
    title: "Side Stand Cut-Off Sensor",
    category: "Safety & Security",
    spec: "Smart Motor Inhibitor",
    desc: "Intelligent electronic safety inhibitor that prevents accidental throttle activation while the parking side stand is engaged.",
  },
  {
    id: 5,
    icon: PackageCheck,
    title: "Spacious Front Luggage Deck",
    category: "Utility & Cargo",
    spec: "Flat Cargo Reinforced Deck",
    desc: "Reinforced flat floorboard for suitable delivery cartons and grocery loads. Verify permitted cargo and how to secure it.",
  },
  {
    id: 6,
    icon: Shield,
    title: "Protective Rear Saree Guard",
    category: "Safety & Security",
    spec: "Factory-Fitted Steel Barrier",
    desc: "Steel barrier that helps keep loose clothing away from the rear wheel.",
  },
  {
    id: 7,
    icon: Lock,
    title: "Anti-Theft Wheel Safety Lock",
    category: "Safety & Security",
    spec: "Mechanical Drive Wheel Lock",
    desc: "Integrated mechanical security lock providing physical tamper protection and parking peace of mind in busy market and street locations.",
  },
  {
    id: 8,
    icon: Disc,
    title: "Combi Braking System (CBS)",
    category: "Safety & Security",
    spec: "Dual-Wheel Synchronized",
    desc: "Linked braking balances front and rear braking force. Ride to the conditions and leave extra stopping distance on wet roads.",
  },
  {
    id: 9,
    icon: Anchor,
    title: "Dual Utility Frame Hooks",
    category: "Utility & Cargo",
    spec: "Reinforced Grocery Clamps",
    desc: "Sturdy central frame hooks engineered to hold heavy grocery bags, milk can handles, and everyday personal shopping securely.",
  },
  {
    id: 10,
    icon: Users,
    title: "Ergonomic Pillion Grab Rail",
    category: "Chassis & Frame",
    spec: "High-Tensile Passenger Bar",
    desc: "Heavy-gauge tubular pillion grab bar offering a solid, comfortable grip and enhanced safety for rear passengers across bumps.",
  },
  {
    id: 11,
    icon: Layers,
    title: "Detachable Split Rear Cargo Seat",
    category: "Utility & Cargo",
    spec: "Listed 60-second release",
    desc: "A removable rear seat exposes the flat carrier on compatible versions. Ask the showroom to demonstrate the release and safe loading.",
  },
  {
    id: 12,
    icon: Activity,
    title: "Telescopic Front Suspension",
    category: "Chassis & Frame",
    spec: "Twin Hydraulic Damper Forks",
    desc: "Heavy-duty twin telescopic hydraulic front forks designed to absorb speed breakers and potholes smoothly across urban and rural Salem roads.",
  },
  {
    id: 13,
    icon: CircleDot,
    title: "Large 16-Inch Multi-Spoke Wheels",
    category: "Chassis & Frame",
    spec: "170 mm High Ground Clearance",
    desc: "The dealership lists 16-inch spoked wheels and 170 mm ground clearance on the referenced configuration. Wheel construction varies by variant.",
  },
  {
    id: 14,
    icon: ShieldAlert,
    title: "Heavy-Duty Front Crash Guard",
    category: "Safety & Security",
    spec: "Tubular Steel Leg Shield",
    desc: "Tubular front guard around the frame and footboard. Check availability and fitting for the selected model.",
  },
  {
    id: 15,
    icon: SmartphoneCharging,
    title: "Weatherproof 5V USB Charging Port",
    category: "Electrical & Tech",
    spec: "5V / 2A Fast Smartphone Charge",
    desc: "A rubber-covered USB port for compatible phones and portable devices on equipped versions. Confirm the output and weather rating.",
  },
];

const categories = ["All", "Chassis & Frame", "Safety & Security", "Utility & Cargo", "Electrical & Tech"];

export function FeaturesGrid() {
  const copy = useCopy();
  const [category, setCategory] = useState("All");
  const filtered = category === "All" ? features : features.filter(feature => feature.category === category);

  return (
    <section id="features" aria-labelledby="engineering-title" className="border-y border-[#dce7df] bg-[#f4f7f2] py-16 text-[#14251d] sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="grid overflow-hidden rounded-[2rem] bg-[#15352b] text-white md:grid-cols-[1fr_0.8fr]">
            <div className="self-center p-7 sm:p-12">
              <p className="text-xs font-bold uppercase tracking-widest text-[#b4d5be]"><Copy>{"Engineering Highlights"}</Copy></p>
              <h2 id="engineering-title" className="mt-3 max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl"><Copy>{"15 Purpose-Built Engineering Features"}</Copy></h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#dbe9df] sm:text-base"><Copy>{"Explore the frame, controls and cargo details that shape the E-Luna. Confirm equipment and capabilities for the exact variant at the showroom."}</Copy></p>
              <a href="#technical-specifications" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d7eadd] px-4 py-2.5 text-sm font-bold text-[#15352b] hover:bg-white">
                <Copy>{"Technical Specifications"}</Copy><ArrowDownRight size={17} aria-hidden="true"/>
              </a>
            </div>
            <img src="/assets/bikes/cargo-heavy-hd.jpg" alt="Kinetic E-Luna Commercial Cargo" loading="lazy" decoding="async" width={720} height={600}
              className="aspect-[16/9] h-full w-full object-cover md:aspect-auto"/>
          </div>
        </Reveal>
        <div role="group" aria-label={copy("Filter engineering features")} className="mb-5 mt-8 flex flex-wrap gap-2">
          {categories.map(label => (
            <button key={label} type="button" aria-pressed={category === label} aria-controls="engineering-feature-list"
              onClick={() => setCategory(label)}
              className="rounded-full border border-[#bfcdc0] bg-white px-3.5 py-2 text-sm font-semibold hover:border-[#17372b] aria-pressed:border-[#17372b] aria-pressed:bg-[#17372b] aria-pressed:text-white">
              <Copy>{label}</Copy>
            </button>
          ))}
        </div>
        <p className="sr-only" role="status">{copy("{count} features").replace("{count}", String(filtered.length))}</p>
        <ul id="engineering-feature-list" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(({ id, icon: Icon, title, spec, desc, category: group }, index) => (
            <li key={id}>
              <Reveal delay={index % 3 * 65} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-[#dbe6db] bg-white p-5 transition-colors hover:border-[#a7c2ae] sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#edf4ed] text-[#24523d]"><Icon size={20} aria-hidden="true"/></span>
                    <span className="text-xs font-bold text-[#52685b]">#{String(id).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-extrabold"><Copy>{title}</Copy></h3>
                  <p className="mt-1 text-sm font-semibold text-[#23523b]"><Copy>{spec}</Copy></p>
                  <p className="mb-4 mt-3 text-sm leading-relaxed text-[#435249]"><Copy>{desc}</Copy></p>
                  <p className="mt-auto border-t border-[#e6eee7] pt-3 text-xs font-semibold text-[#52685b]"><Copy>{group}</Copy></p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
