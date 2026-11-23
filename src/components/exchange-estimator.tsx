"use client";

import React, { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { Repeat, CheckCircle, ArrowRight, Sparkles } from "lucide-react";

interface ExchangeEstimatorProps {
  lang: Language;
  onClaimBonus: (brand: string) => void;
}

export function ExchangeEstimator({ lang, onClaimBonus }: ExchangeEstimatorProps) {
  const t = translations[lang];

  const [selectedBrand, setSelectedBrand] = useState("TVS XL / 50");
  const [vehicleAge, setVehicleAge] = useState("3 - 6 Years");

  const brandOptions = [
    { id: "tvs", name: "TVS XL / 50 / Heavy Duty", bonus: 18500 },
    { id: "hero", name: "Hero Splendor / HF Deluxe", bonus: 22000 },
    { id: "honda", name: "Honda Activa / Dio", bonus: 24500 },
    { id: "bajaj", name: "Bajaj Platina / CT 100", bonus: 19000 },
    { id: "other", name: "Other Petrol Two-Wheeler", bonus: 16000 },
  ];

  const currentSelection = brandOptions.find((b) => b.name === selectedBrand) || brandOptions[0];

  return (
    <section id="exchange-estimator" className="py-20 md:py-28 bg-[#fafafa] text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto rounded-2xl p-6 sm:p-10 border border-neutral-200/90 bg-white shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-1">
                Upgrade & Exchange
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-neutral-950 tracking-tight">
                Exchange Your Petrol Bike for E-Luna
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                Upgrade your old TVS XL, Hero Splendor, or Activa for the all-new E-Luna with an exclusive exchange bonus.
              </p>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-900 text-center flex-shrink-0">
              <span className="text-[11px] font-semibold text-emerald-700">
                + ₹1,000 Salem Exchange Bonus
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Select Existing Two-Wheeler
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-[#fcfcfc] border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 font-medium focus:outline-none focus:border-neutral-950 shadow-2xs"
                >
                  {brandOptions.map((b) => (
                    <option key={b.id} value={b.name} className="bg-white text-neutral-900">
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  Vehicle Age
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["1 - 3 Years", "3 - 6 Years", "6+ Years"].map((age) => (
                    <button
                      key={age}
                      onClick={() => setVehicleAge(age)}
                      className={`py-2 px-2 text-xs font-medium rounded-xl border transition-all duration-200 ${
                        vehicleAge === age
                          ? "bg-neutral-950 text-white border-neutral-950 shadow-xs"
                          : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Trade In Bonus Card */}
            <div className="rounded-xl p-6 bg-[#f7f8fa] border border-neutral-200 text-center shadow-2xs">
              <span className="text-xs font-semibold text-neutral-500 block mb-1 uppercase tracking-wider">
                Estimated Trade-In Value
              </span>
              <div className="text-3xl sm:text-4xl font-semibold text-neutral-950 font-mono my-2 tracking-tight">
                ₹{(currentSelection.bonus).toLocaleString("en-IN")}*
              </div>
              <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
                Directly deducted from the final on-road invoice of your new Kinetic E-Luna.
              </p>

              <button
                onClick={() => onClaimBonus(selectedBrand)}
                className="w-full py-3 px-6 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs transition-all duration-200 shadow-sm flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>Claim Exchange Bonus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
