"use client";

import React from "react";
import { translations, Language } from "@/lib/translations";
import { Package, Smartphone, Shield, Sparkles, ArrowRight, Check } from "lucide-react";

interface AccessoriesSectionProps {
  lang: Language;
  onSelectAccessory: (accessoryName: string) => void;
}

export function AccessoriesSection({ lang, onSelectAccessory }: AccessoriesSectionProps) {
  const t = translations[lang];

  const items = [
    {
      id: "crate",
      title: "Heavy Delivery Crate & Mount",
      desc: "Reinforced all-steel carrier structure engineered for heavy milk cans, parcel delivery bags, and commercial crates.",
      price: "₹1,499",
      specs: ["150 kg load tested", "Anti-corrosion coating", "Quick bolt-on mount"],
      badge: "Commercial Logistics",
    },
    {
      id: "mount",
      title: "Fast Phone Mount + USB Charger",
      desc: "Vibration-damped handlebar clamp with integrated 5V/2A weatherproof USB fast charger for navigation devices.",
      price: "₹799",
      specs: ["360° ball joint", "Rubber-sealed port", "Anti-vibration silicon"],
      badge: "Daily Utility",
    },
    {
      id: "seat",
      title: "Dual Comfort Split Seats & Backrest",
      desc: "High-density ergonomic memory foam cushion with contoured passenger lumbar support for comfortable family commutes.",
      price: "₹1,199",
      specs: ["Water-resistant vinyl", "Breathable cushioning", "Factory fit brackets"],
      badge: "Family Comfort",
    },
    {
      id: "helmet",
      title: "Smart Rider Safety Helmet",
      desc: "ISI certified high-impact aerodynamic safety helmet with scratch-resistant clear visor and micro-metric chin strap.",
      price: "₹1,999",
      specs: ["ISI certified", "Anti-fog clear visor", "Removable washable liner"],
      badge: "Certified Safety",
    },
  ];

  return (
    <section id="accessories-section" className="py-20 md:py-28 bg-[#fafafa] text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-2">
              Original Accessories
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-neutral-950 tracking-tight">
              Pair your world
            </h2>
            <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
              Factory-engineered accessories designed to enhance your daily commute, family comfort, and commercial operations.
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-xs font-medium text-neutral-500">
            Available at all ARS Motors Salem Showrooms
          </div>
        </div>

        {/* 4 Cards Grid - Automotive Minimalist Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl p-6 bg-white border border-neutral-200/80 hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between group shadow-2xs hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200 uppercase tracking-wider">
                    {item.badge}
                  </span>
                  <span className="text-sm font-semibold text-neutral-950 font-mono">
                    {item.price}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-neutral-900 group-hover:text-black transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                  {item.desc}
                </p>

                <div className="mt-4 pt-3 border-t border-neutral-100 space-y-1.5">
                  {item.specs.map((sp, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-[11px] text-neutral-600">
                      <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span>{sp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-150">
                <button
                  onClick={() => onSelectAccessory(item.title)}
                  className="w-full py-2.5 px-4 rounded-full bg-neutral-100 hover:bg-neutral-900 text-neutral-900 hover:text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <span>Enquire Accessory</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
