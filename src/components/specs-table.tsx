"use client";

import React, { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { Download, FileText, Check } from "lucide-react";

interface SpecsTableProps {
  lang: Language;
}

export function SpecsTable({ lang }: SpecsTableProps) {
  const t = translations[lang];
  const [activeGroup, setActiveGroup] = useState<string>("All");

  const specGroups = [
    {
      category: "Performance & Powertrain",
      items: [
        { label: "Certified Range", value: "Up to 110 km / charge (PRO X3)" },
        { label: "Top Speed", value: "50 km/h" },
        { label: "Electric Motor", value: "1.2 kW (Rated) / 2.2 kW (Peak) BLDC Hub Motor" },
        { label: "Gradeability", value: "7 Degrees (Effortless flyover climbing with load)" },
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
        { label: "Payload Capacity", value: "150 kg Certified (with Detachable Rear Cargo Bed)" },
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
        { label: "Official Warranty", value: "3 Years / 40,000 km (Up to 5 Years Extended Option)" },
      ],
    },
  ];

  const groupTabs = ["All", ...specGroups.map((g) => g.category)];

  const displayedGroups = activeGroup === "All"
    ? specGroups
    : specGroups.filter((g) => g.category === activeGroup);

  return (
    <section id="specs-matrix" className="py-20 md:py-28 bg-white text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-2">
              Engineering Data
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-neutral-950 tracking-tight">
              Technical Specifications
            </h2>
            <p className="mt-2 text-neutral-600 text-sm sm:text-base leading-relaxed">
              Official certified specifications for Kinetic Green E-Luna variants from ARS Motors Salem.
            </p>
          </div>

          <a
            href="/assets/docs/kinetic-e-luna-brochure.pdf"
            download
            className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs border border-neutral-300 transition-all self-start md:self-auto shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official Brochure (PDF)</span>
          </a>
        </div>

        {/* Group Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-neutral-200 pb-4 overflow-x-auto">
          {groupTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveGroup(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                activeGroup === tab
                  ? "bg-neutral-950 text-white shadow-2xs"
                  : "bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Specs Table Layout */}
        <div className="max-w-5xl mx-auto space-y-8">
          {displayedGroups.map((grp) => (
            <div
              key={grp.category}
              className="rounded-2xl border border-neutral-200/90 bg-[#fafafa] overflow-hidden shadow-2xs"
            >
              <div className="bg-neutral-100 px-6 py-3.5 border-b border-neutral-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  {grp.category}
                </h3>
              </div>
              <div className="divide-y divide-neutral-200/80">
                {grp.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 sm:grid-cols-12 px-6 py-3.5 hover:bg-white transition-colors"
                  >
                    <div className="sm:col-span-5 text-xs font-medium text-neutral-600">
                      {item.label}
                    </div>
                    <div className="sm:col-span-7 text-xs font-semibold text-neutral-950 font-mono mt-0.5 sm:mt-0">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
