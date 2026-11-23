"use client";

import React, { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { CreditCard, CheckCircle2, ArrowRight } from "lucide-react";

interface EmiCalculatorProps {
  lang: Language;
  onCheckLoan: () => void;
}

export function EmiCalculator({ lang, onCheckLoan }: EmiCalculatorProps) {
  const t = translations[lang];

  // Ex-showroom estimated price for E-Luna PRO X3: ~₹74,990
  const vehiclePrice = 74990;

  const [downPayment, setDownPayment] = useState(10000);
  const [tenureMonths, setTenureMonths] = useState(24);

  // Interest rate ~9.5% p.a.
  const annualInterestRate = 0.095;
  const monthlyRate = annualInterestRate / 12;

  const loanAmount = Math.max(0, vehiclePrice - downPayment);

  // Standard EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );

  return (
    <section id="emi-calculator" className="py-20 md:py-28 bg-white text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-2">
            Flexible Financing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-neutral-950 tracking-tight">
            EMI & Finance Calculator
          </h2>
          <p className="mt-2 text-neutral-600 text-sm sm:text-base leading-relaxed">
            Zero-hassle low interest loan assistance right here in Salem with spot approvals.
          </p>
        </div>

        {/* EMI Engine Grid */}
        <div className="max-w-4xl mx-auto rounded-2xl p-6 sm:p-10 border border-neutral-200/90 bg-[#fafafa] shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders Column */}
            <div className="space-y-6">
              {/* Down Payment */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-neutral-700">
                    Down Payment Amount
                  </span>
                  <span className="text-sm font-bold text-neutral-950 font-mono bg-white px-3 py-1 rounded-full border border-neutral-200">
                    ₹{downPayment.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="35000"
                  step="2500"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-950"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-2 font-medium">
                  <span>Min: ₹5,000</span>
                  <span>Recommended: ₹15,000</span>
                  <span>Max: ₹35,000</span>
                </div>

                {/* Quick Presets */}
                <div className="flex gap-2 mt-3">
                  {[5000, 10000, 15000, 20000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDownPayment(amt)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                        downPayment === amt
                          ? "bg-neutral-900 text-white"
                          : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
                      }`}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenure Selection */}
              <div>
                <span className="text-xs font-semibold text-neutral-700 block mb-2">
                  Loan Tenure (Months)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[12, 24, 36].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenureMonths(m)}
                      className={`py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 text-center ${
                        tenureMonths === m
                          ? "bg-neutral-950 text-white border-neutral-950 shadow-xs"
                          : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              {/* Finance Benefits Checklist */}
              <div className="pt-2 space-y-2 text-xs text-neutral-600 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Spot loan approvals in under 15 minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Aadhaar & PAN card instant paperless verification</span>
                </div>
              </div>
            </div>

            {/* Estimated EMI Result Card */}
            <div className="rounded-xl p-6 sm:p-8 bg-white border border-neutral-200 shadow-sm text-center flex flex-col justify-between h-full">
              <div>
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  Estimated Monthly EMI
                </span>
                <div className="text-4xl sm:text-5xl font-semibold text-neutral-950 font-mono tracking-tight mt-1">
                  ₹{emi.toLocaleString("en-IN")}
                  <span className="text-sm font-normal text-neutral-500 font-sans">/mo</span>
                </div>
                <p className="text-xs text-neutral-500 mt-3 leading-relaxed">
                  Calculated at 9.5% p.a. for {tenureMonths} months tenure with ₹{downPayment.toLocaleString("en-IN")} down payment.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100">
                <button
                  onClick={onCheckLoan}
                  className="w-full py-3.5 px-6 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95 shadow-sm"
                >
                  <span>Check Loan Eligibility</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-neutral-500 mt-8 max-w-xl mx-auto">
          {t.financePartners}
        </p>
      </div>
    </section>
  );
}
