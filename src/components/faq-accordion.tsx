"use client";

import React, { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { Plus, Minus } from "lucide-react";

interface FaqAccordionProps {
  lang: Language;
}

export function FaqAccordion({ lang }: FaqAccordionProps) {
  const t = translations[lang];

  const faqs = [
    {
      q: "What is the certified riding range of E-Luna PRO X3 on a single charge?",
      a: "The Kinetic Green E-Luna PRO X3 delivers 80 to 110 km of real-world certified riding range per full charge, which easily covers 2 to 3 days of typical local commuting or delivery operations across Salem.",
    },
    {
      q: "How long does it take to charge, and do I need a special charging station?",
      a: "It takes just 4 hours to reach full charge using the included 10 Amp fast charger. You can plug it directly into any standard 5A or 15A 3-pin household wall socket. Zero special commercial station is required.",
    },
    {
      q: "How much payload can the E-Luna carry for commercial delivery?",
      a: "The E-Luna features a certified payload capacity of 150 kg with a heavy-duty tubular steel frame. The rear passenger seat unbolts in under 60 seconds, converting into an expansive flat metal cargo bed for milk cans, delivery crates, or logistics packages.",
    },
    {
      q: "What is the warranty coverage provided by ARS Motors?",
      a: "You receive a standard comprehensive 3-Year / 40,000 km warranty covering the Vehicle, 2.3 kWh Li-ion Battery, 1.2 kW BLDC Motor, Controller, and Charger, with extended warranty options up to 5 Years.",
    },
    {
      q: "Are there any subsidies or road tax benefits in Tamil Nadu?",
      a: "Yes! Under the Tamil Nadu Electric Vehicle Policy, the E-Luna enjoys 100% Road Tax exemption and zero registration charges, saving you significant money upfront compared to petrol two-wheelers.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq-section" className="py-20 md:py-28 bg-white text-neutral-900 border-t border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-2">
            Ownership & Support
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-neutral-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-neutral-600 text-sm sm:text-base leading-relaxed">
            Everything you need to know about purchasing, charging, and owning the Kinetic E-Luna in Salem.
          </p>
        </div>

        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="py-5">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className="text-base sm:text-lg font-semibold text-neutral-900 group-hover:text-black transition-colors pr-4">
                    {faq.q}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0 text-neutral-800 transition-colors group-hover:bg-neutral-200">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed pr-8 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
