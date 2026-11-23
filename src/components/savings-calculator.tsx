"use client";

import React, { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { TrendingUp, Fuel, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

interface SavingsCalculatorProps {
  lang: Language;
  onBookNow: () => void;
}

export function SavingsCalculator({ lang, onBookNow }: SavingsCalculatorProps) {
  const t = translations[lang];

  // Daily km slider (10 to 150 km)
  const [dailyKm, setDailyKm] = useState(100);

  // Exact math from official ARS Motors specification:
  // Petrol Bike: Mileage 55 km/L @ ₹105/L => ₹1.909 per km.
  // E-Luna PRO X3: 100 km consumes 1.82 units of electricity @ ₹5.25/unit => ₹9.555 (~₹0.096 per km).
  const petrolPerKm = 105 / 55; // ₹1.909
  const elunaPerKm = (1.82 * 5.25) / 100; // ₹0.09555

  const dailyPetrolCost = Math.round(dailyKm * petrolPerKm);
  const dailyElunaCost = Math.round(dailyKm * elunaPerKm * 10) / 10;
  const dailySavings = Math.round(dailyPetrolCost - dailyElunaCost);

  // 26 working days in a month
  const monthlyPetrolCost = Math.round(dailyPetrolCost * 26);
  const monthlyElunaCost = Math.round(dailyElunaCost * 26);
  const monthlySavings = Math.round(dailySavings * 26);

  // Annual savings (12 months)
  const annualSavings = Math.round(monthlySavings * 12);

  return (
    <section id="savings-calculator" className="py-20 md:py-28 bg-[#fafafa] text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-2">
            Economics & Efficiency
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-neutral-950 tracking-tight">
            Fuel Savings Calculator
          </h2>
          <p className="mt-2 text-neutral-600 text-sm sm:text-base leading-relaxed">
            See how much you save every single year compared to a standard petrol two-wheeler.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          {/* Left Column: Interactive Slider & Breakdown */}
          <div className="lg:col-span-7 rounded-2xl p-6 sm:p-8 border border-neutral-200/90 bg-white shadow-2xs flex flex-col justify-between">
            {/* Daily Distance Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                  Daily Commute Distance
                </span>
                <span className="text-lg font-bold text-neutral-950 font-mono bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                  {dailyKm} km / day
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="5"
                value={dailyKm}
                onChange={(e) => setDailyKm(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-950"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 mt-2 font-medium">
                <span>10 km</span>
                <span>50 km (City Avg)</span>
                <span>100 km (Full Charge)</span>
                <span>150 km</span>
              </div>
            </div>

            {/* Side-by-side Cost Comparison */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {/* Petrol Column */}
              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 mb-2">
                  <Fuel className="w-4 h-4 text-neutral-500" />
                  <span>Petrol 2-Wheeler</span>
                </div>
                <div className="text-2xl font-bold text-neutral-950 font-mono">
                  ₹{dailyPetrolCost}
                </div>
                <span className="text-[11px] text-neutral-500 block">Daily (55 km/L @ ₹105)</span>

                <div className="mt-4 pt-3 border-t border-neutral-200">
                  <span className="text-xs text-neutral-500 block">Monthly (26 Days)</span>
                  <span className="text-base font-bold text-neutral-900 font-mono">
                    ₹{monthlyPetrolCost.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* E-Luna Column */}
              <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 mb-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>E-Luna PRO X3</span>
                </div>
                <div className="text-2xl font-bold text-emerald-700 font-mono">
                  ₹{dailyElunaCost}
                </div>
                <span className="text-[11px] text-emerald-700/80 block">Daily (~10 paise/km)</span>

                <div className="mt-4 pt-3 border-t border-emerald-200">
                  <span className="text-xs text-emerald-800/80 block">Monthly (26 Days)</span>
                  <span className="text-base font-bold text-emerald-900 font-mono">
                    ₹{monthlyElunaCost.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-150 flex items-center space-x-2 text-xs text-neutral-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Electricity calculated at standard Tamil Nadu domestic tariff (₹5.25/unit).</span>
            </div>
          </div>

          {/* Right Column: Total Annual Savings Hero Box */}
          <div className="lg:col-span-5 rounded-2xl p-8 bg-neutral-950 text-white shadow-md flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest block mb-1">
                Annual Fuel Savings
              </span>
              <div className="text-4xl sm:text-5xl font-semibold text-white font-mono tracking-tight mt-1">
                ₹{annualSavings.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-neutral-400 mt-3 leading-relaxed">
                Direct fuel savings compared to a conventional petrol moped. The vehicle fully pays for itself in less than 16 months!
              </p>

              <div className="mt-6 p-4 rounded-xl bg-white/10 border border-white/10">
                <span className="text-xs text-neutral-300 block">
                  Monthly Direct Cash Savings:
                </span>
                <span className="text-2xl font-semibold text-emerald-400 font-mono mt-0.5 block">
                  ₹{monthlySavings.toLocaleString("en-IN")}/mo
                </span>
              </div>
            </div>

            <button
              onClick={onBookNow}
              className="mt-8 w-full py-3.5 px-6 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-xs transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95 shadow-sm"
            >
              <span>Book E-Luna & Start Saving</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-neutral-500 mt-8 max-w-2xl mx-auto">
          {t.savingsFootnote}
        </p>
      </div>
    </section>
  );
}
