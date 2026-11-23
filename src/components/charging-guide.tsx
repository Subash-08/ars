"use client";

import React from "react";
import { translations, Language } from "@/lib/translations";
import { Clock, Home, Zap, BatteryCharging, Check } from "lucide-react";

interface ChargingGuideProps {
  lang: Language;
}

export function ChargingGuide({ lang }: ChargingGuideProps) {
  const t = translations[lang];

  const pillars = [
    {
      icon: Clock,
      title: "4 Hours Full Charge",
      spec: "10 Amp Fast Charger Included",
      desc: "Plug it in overnight or during an afternoon break for a complete 80–110 km daily operational range.",
    },
    {
      icon: Home,
      title: "Standard 3-Pin Domestic Socket",
      spec: "Works on Any 5A / 15A Outlet",
      desc: "No expensive commercial EV charging stations or wallboxes required. Charge anywhere just like a mobile phone.",
    },
    {
      icon: Zap,
      title: "₹9.60 per 100 km Range",
      spec: "1.82 Units of Electricity",
      desc: "A full battery cycle consumes only 1.82 units of electricity, costing less than ₹10 at Salem domestic rates.",
    },
  ];

  return (
    <section id="charging-guide" className="py-20 md:py-28 bg-white text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-2">
            Home Charging Freedom
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-neutral-950 tracking-tight">
            Charges on Any Standard 3-Pin Socket
          </h2>
          <p className="mt-2 text-neutral-600 text-sm sm:text-base leading-relaxed">
            Zero charging infrastructure hassle. Engineered with portable battery technology for seamless everyday charging.
          </p>
        </div>

        {/* 3 Pillars of Charging Simplicity */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-[#fafafa] border border-neutral-200/80 shadow-2xs text-center flex flex-col justify-between group hover:border-neutral-300 transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-neutral-200 flex items-center justify-center mx-auto mb-5 text-neutral-900 shadow-2xs group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-950 mb-1">
                    {pillar.title}
                  </h3>
                  <div className="text-xs font-semibold text-emerald-700 font-mono mb-3">
                    {pillar.spec}
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200/60 flex items-center justify-center space-x-1.5 text-[11px] text-neutral-500 font-medium">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Portable & Safe</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
