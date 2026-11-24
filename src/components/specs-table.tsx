"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Download, FileText } from "lucide-react";
import { Copy, useCopy } from "./site-language";
import { Reveal } from "./reveal";

const specGroups = [
  {
    category: "Performance & Powertrain",
    items: [
      { label: "Listed range", value: "Up to 110 km / charge (PRO X3)" },
      { label: "Top Speed", value: "50 km/h" },
      { label: "Electric Motor", value: "1.2 kW (Rated) / 2.2 kW (Peak) BLDC Hub Motor" },
      { label: "Gradeability", value: "7 Degrees" },
      { label: "Running Cost", value: "~10 paise per km" },
    ],
  },
  {
    category: "Battery & Charging",
    items: [
      { label: "Battery Pack", value: "2.3 kWh Advanced Lithium-ion (Portable / Removable)" },
      { label: "Charging Time", value: "4 Hours (10 Amp Fast Home Charger Included)" },
      { label: "Charging Port", value: "Standard Domestic 3-Pin (5A / 15A Socket)" },
      { label: "Energy Consumption", value: "1.82 Units per 100 km charge" },
    ],
  },
  {
    category: "Chassis, Suspension & Wheels",
    items: [
      { label: "Chassis & Frame", value: "All-Metal Heavy-Duty High-Tensile Tubular Steel" },
      { label: "Suspension (Front)", value: "Telescopic Twin Hydraulic Damper Forks" },
      { label: "Suspension (Rear)", value: "Dual Hydraulic Spring Coils" },
      { label: "Wheels & Tyres", value: "16-inch Multi-Spoke Wheels (2.50-16 Heavy-Duty Tyres)" },
      { label: "Braking System", value: "Synchronized Combi Braking System (CBS Linked)" },
      { label: "Ground Clearance", value: "170 mm (Rugged speed-breaker clearance)" },
    ],
  },
  {
    category: "Dimensions & Capacity",
    items: [
      { label: "Payload Capacity", value: "150 kg (with Detachable Rear Cargo Bed)" },
      { label: "Kerb Weight", value: "96 kg (Lightweight & Agile Handling)" },
      { label: "Dimensions (L × W × H)", value: "1,985 mm × 735 mm × 1,036 mm" },
      { label: "Wheelbase", value: "1,335 mm (High Stability & Control)" },
    ],
  },
  {
    category: "Electricals & Warranty",
    items: [
      { label: "Headlamp", value: "High-Intensity Projector LED with DRL" },
      { label: "Instrument Cluster", value: "Digital LCD Console (Speed, SoC %, Odometer, Trip)" },
      { label: "Device Charging", value: "Weatherproof 5V / 2A USB Fast Charging Port" },
      { label: "Safety Cut-off", value: "Electronic Side Stand Motor Cut-off Sensor" },
      { label: "Warranty (dealership reference)", value: "3 Years / 40,000 km (Up to 5 Years Extended Option)" },
    ],
  },
];

const action = "inline-flex items-center gap-2 rounded-full bg-[#17372b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#24523d]";
const verificationNotes: Record<string, string> = {
  "Electric Motor": "Kinetic Green’s current E-Luna Pro listing gives a 1.8 kW peak BLDC mid motor with chain drive.",
  "Charging Time": "Kinetic Green’s current E-Luna Pro listing gives 5 hours. Confirm the supplied charger and charging time.",
  "Wheels & Tyres": "Kinetic Green’s current E-Luna Pro listing gives 2.75 × 16-inch tubeless tyres with alloy wheels.",
  "Instrument Cluster": "Kinetic Green’s current E-Luna Pro listing gives a colour digital display.",
  "Warranty (dealership reference)": "Ask for written coverage and the conditions and cost of any extension.",
};

export function SpecsTable({ brochure }: { brochure?: string }) {
  const copy = useCopy();
  const [category, setCategory] = useState("All");
  const groups = category === "All" ? specGroups : specGroups.filter(group => group.category === category);

  return (
    <section id="technical-specifications" aria-labelledby="technical-specifications-title" className="bg-[#fbfcfa] py-16 text-[#14251d] sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="grid gap-6 border-b border-[#d9e5db] pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#24523d]"><Copy>{"Engineering Data"}</Copy></p>
              <h2 id="technical-specifications-title" className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl"><Copy>{"Technical Specifications"}</Copy></h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#435249] sm:text-base"><Copy>{"Use this dealership reference to compare details. Equipment, charging time and warranty vary by configuration. Confirm the written specification for the vehicle you choose."}</Copy></p>
            </div>
            <div className="flex flex-wrap gap-2">
              {brochure
                ? <a href={brochure} target="_blank" rel="noopener noreferrer" className={action}><Download size={16} aria-hidden="true"/><Copy>{"Open the product brochure (PDF) ↗"}</Copy></a>
                : <Link href="/book-test-ride?inquiry=brochure" className={action}><FileText size={16} aria-hidden="true"/><Copy>{"Request the brochure"}</Copy></Link>}
              <a href="https://kineticgreen.com/product/4" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#bfcdc0] px-4 py-2.5 text-sm font-bold hover:bg-[#eaf1ea]">
                <Copy>{"Kinetic Green Pro listing"}</Copy><ArrowUpRight size={16} aria-hidden="true"/>
              </a>
            </div>
          </div>
        </Reveal>
        <div role="group" aria-label={copy("Filter technical specifications")} className="mb-5 mt-7 flex flex-wrap gap-2">
          {["All", ...specGroups.map(group => group.category)].map(label => (
            <button key={label} type="button" aria-pressed={category === label} aria-controls="technical-specification-groups" onClick={() => setCategory(label)}
              className="rounded-full border border-[#bfcdc0] bg-white px-3.5 py-2 text-sm font-semibold hover:border-[#17372b] aria-pressed:border-[#17372b] aria-pressed:bg-[#17372b] aria-pressed:text-white">
              <Copy>{label}</Copy>
            </button>
          ))}
        </div>
        <div id="technical-specification-groups" className={category === "All" ? "grid items-start gap-4 lg:grid-cols-2" : "max-w-3xl"}>
          {groups.map((group, index) => (
            <Reveal key={group.category} delay={index % 2 * 85}>
              <section className="overflow-hidden rounded-2xl border border-[#d9e5db] bg-white">
                <h3 className="bg-[#e9f2e9] px-5 py-4 text-base font-extrabold text-[#17372b] sm:px-6"><Copy>{group.category}</Copy></h3>
                <dl className="divide-y divide-[#e7eee8] px-5 sm:px-6">
                  {group.items.map(({ label, value }) => (
                    <div key={label} className="grid gap-1 py-3.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] sm:gap-4">
                      <dt className="text-sm font-semibold text-[#52685b]"><Copy>{label}</Copy></dt>
                      <dd className="text-sm font-bold"><Copy>{value}</Copy>
                        {verificationNotes[label] && <span className="mt-1 block text-xs font-medium leading-relaxed text-[#52685b]"><Copy>{verificationNotes[label]}</Copy></span>}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-sm text-[#52685b]"><Copy>{"Actual running costs depend on local electricity tariffs, charging losses and riding conditions."}</Copy>{" "}<Link className="font-semibold underline underline-offset-4" href="/finance-offers#savings-calculator"><Copy>{"Fuel Savings Calculator"}</Copy></Link></p>
      </div>
    </section>
  );
}
