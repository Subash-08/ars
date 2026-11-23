"use client";

import React from "react";
import { translations, Language } from "@/lib/translations";
import {
  Award,
  Wrench,
  Bike,
  CreditCard,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface AboutSectionProps {
  lang: Language;
  onBookTestRide: () => void;
  onExploreDealership: () => void;
}

export function AboutSection({
  lang,
  onBookTestRide,
  onExploreDealership,
}: AboutSectionProps) {
  const t = translations[lang];

  const pillars = [
    {
      icon: Award,
      title: "Authorized 3S Dealership",
      desc: "Full Sales, certified Service, and 100% genuine Spare Parts facility authorized directly by Kinetic Green Energy.",
    },
    {
      icon: Wrench,
      title: "Certified EV Technicians",
      desc: "Factory-trained technicians equipped with advanced battery health scanners, computer diagnostics, and warranty support.",
    },
    {
      icon: Bike,
      title: "Doorstep Test Rides",
      desc: "Experience the strength and agility of E-Luna at your home, farm, or commercial delivery depot anywhere in Salem.",
    },
    {
      icon: CreditCard,
      title: "Instant 15-Minute Finance",
      desc: "Exclusive tie-ups with leading banks offering flexible EMIs from ₹2,199/month with instant spot loan approvals.",
    },
  ];

  return (
    <section id="about-ars" className="py-20 md:py-28 bg-white text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-2">
            Salem Dealership Heritage
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-neutral-950 tracking-tight leading-tight">
            Pioneering Clean & Affordable Mobility in Salem
          </h2>
          <p className="mt-4 text-neutral-600 text-sm sm:text-base leading-relaxed">
            ARS Motors is Salem’s premier authorized Kinetic Green dealership. Built on trust, engineering excellence, and customer-first service, we empower Salem’s daily commuters, families, and commercial delivery businesses to switch seamlessly to high-earning electric mobility.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#fafafa] border border-neutral-200/80 shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-800 mb-5 shadow-2xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-950 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[11px] font-semibold text-neutral-400">
                  <span>Pillar 0{idx + 1}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Dual-Branch Callout Banner */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950 text-white p-8 sm:p-12 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold border border-white/15 mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>Two Salem Showroom Locations</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Visit Seelanaickenpatti Bypass or Madathur Showroom
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Step into our showrooms for live vehicle demonstrations, instant battery range tests, customized commercial cargo trials, and test rides.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
            <button
              onClick={onBookTestRide}
              className="px-7 py-3 rounded-full bg-white text-neutral-950 hover:bg-neutral-100 font-semibold text-xs transition-all shadow-md active:scale-95 flex items-center space-x-2"
            >
              <span>Book Free Test Ride</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreDealership}
              className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-medium text-xs transition-all flex items-center space-x-2"
            >
              <span>Showroom Directions</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
