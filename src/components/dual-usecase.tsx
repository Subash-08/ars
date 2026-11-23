"use client";

import React, { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { User, Package, Check, ArrowRight } from "lucide-react";

interface DualUsecaseProps {
  lang: Language;
  onSelectUsecase: (usecase: string) => void;
}

export function DualUsecase({ lang, onSelectUsecase }: DualUsecaseProps) {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<"personal" | "commercial">("personal");

  return (
    <section className="py-16 md:py-24 bg-[#0c0e12] relative overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t.useCaseTitle}
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Effortlessly transforms between a stylish family commuter and an unstoppable 150 kg commercial workhorse.
          </p>

          {/* Toggle Pills */}
          <div className="inline-flex p-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] mt-6">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-extrabold transition-all ${
                activeTab === "personal"
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.useCasePersonal}</span>
            </button>
            <button
              onClick={() => setActiveTab("commercial")}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-full text-xs font-extrabold transition-all ${
                activeTab === "commercial"
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/25"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t.useCaseCommercial}</span>
            </button>
          </div>
        </div>

        {/* Tab Content Cards */}
        <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 border border-white/[0.1] bg-gradient-to-b from-[#141822] to-[#090b0e] shadow-2xl">
          {activeTab === "personal" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeIn">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  Lifestyle & Daily Rides
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                  {t.useCasePersonal}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {t.useCasePersonalDesc}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Comfortable cushioned split seats for rider & pillion</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Telescopic suspension absorbs city speed breakers smoothly</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Saree guard and side stand safety sensor for family security</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectUsecase("Personal")}
                  className="mt-8 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition-all flex items-center space-x-2"
                >
                  <span>Book for Family Ride</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] aspect-video bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 group shadow-2xl flex items-center justify-center p-4">
                <img
                  src="/assets/bikes/commuter-family-hd.jpg"
                  alt="E-Luna Family & Daily Commute"
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-xl"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/90 text-black w-max inline-block mb-1 shadow-sm">
                    Family & Daily Commute Mode
                  </span>
                  <div className="text-xs text-white/90 font-medium">
                    Dual Split Padded Seats • Saree Safety Guard • USB Mobile Charger
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeIn">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  High-Earning Business Machine
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                  {t.useCaseCommercial}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {t.useCaseCommercialDesc}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>150 kg certified payload capacity for crates, sacks & cans</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>Detachable rear seat unbolts in under 60 seconds</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-200">
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>Save over ₹4,721 every single month on petrol delivery runs</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectUsecase("Commercial Cargo")}
                  className="mt-8 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all flex items-center space-x-2"
                >
                  <span>Book for Business Cargo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] aspect-video bg-neutral-900 group shadow-2xl">
                <img
                  src="/assets/bikes/cargo-heavy-hd.jpg"
                  alt="E-Luna Heavy Commercial Cargo"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/90 text-black w-max mb-1.5 shadow-sm">
                    Heavy Commercial Cargo Mode
                  </span>
                  <span className="text-xs text-white/90 font-medium">
                    150 kg Certified Payload • Quick-Release Flatbed Carrier • Milk & Delivery Racks
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
