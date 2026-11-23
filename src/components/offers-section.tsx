"use client";

import React, { useState, useEffect } from "react";
import { translations, Language } from "@/lib/translations";
import { Sparkles, Tag, ArrowRight, ShieldCheck, Gift, Clock, Check } from "lucide-react";

interface OffersSectionProps {
  lang: Language;
  onClaimOffer: (offerTitle: string) => void;
}

interface OfferItem {
  id: string;
  title: string;
  badge: string;
  discount: string;
  validTill: string;
  description: string;
  terms?: string;
  isActive: boolean;
}

export function OffersSection({ lang, onClaimOffer }: OffersSectionProps) {
  const t = translations[lang];

  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/offers", { signal: controller.signal })
      .then(async res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { setOffers(data.offers || []); setState("ready"); })
      .catch(() => { if (!controller.signal.aborted) setState("error"); });
    return () => controller.abort();
  }, []);

  return (
    <section id="offers" className="py-20 md:py-28 bg-white text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-2">
            Exclusive Salem Promotions
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-neutral-950 tracking-tight">
            Special Dealership Offers
          </h2>
          <p className="mt-3 text-neutral-600 text-sm sm:text-base leading-relaxed">
            Ask our team to confirm the eligibility, availability and conditions of any listed offer. An enquiry does not reserve or redeem an offer.
          </p>
        </div>

        {state === "loading" && <p role="status" className="text-center text-sm text-neutral-500 mb-6">Checking current offers…</p>}
        {state === "error" && <p role="status" className="text-center text-sm text-neutral-600 mb-6">We couldn’t load offers. Please contact the showroom for current details.</p>}
        {state === "ready" && offers.length === 0 && <p className="text-center text-sm text-neutral-600 mb-6">No current offers are listed. Contact us for a written quote.</p>}
        <p className="text-center text-xs text-neutral-500 mb-8">No online payment is collected. <a href="/offer-terms" className="underline">Offer information</a> · <a href="/booking-terms" className="underline">Reservation enquiries</a></p>
        {/* Offers Cards Grid - Premium Minimalist Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {offers
            .filter((o) => o.isActive)
            .map((offer, index) => (
              <div
                key={offer.id}
                className={`rounded-2xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between group ${
                  index === 0
                    ? "bg-neutral-950 text-white border-neutral-900 shadow-lg"
                    : "bg-[#fafafa] text-neutral-900 border-neutral-200/80 hover:border-neutral-300 shadow-2xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                        index === 0
                          ? "bg-white/10 text-emerald-400 border-white/15"
                          : "bg-neutral-200/70 text-neutral-700 border-neutral-300"
                      }`}
                    >
                      {offer.badge}
                    </span>
                    <span
                      className={`flex items-center space-x-1 text-[11px] font-medium ${
                        index === 0 ? "text-neutral-400" : "text-neutral-500"
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{offer.validTill}</span>
                    </span>
                  </div>

                  <h3
                    className={`text-xl sm:text-2xl font-semibold tracking-tight mb-1 font-mono ${
                      index === 0 ? "text-white" : "text-neutral-950"
                    }`}
                  >
                    {offer.discount}
                  </h3>
                  <div
                    className={`text-xs font-semibold mb-3 ${
                      index === 0 ? "text-emerald-400" : "text-neutral-700"
                    }`}
                  >
                    {offer.title}
                  </div>

                  <p
                    className={`text-xs leading-relaxed mb-6 ${
                      index === 0 ? "text-neutral-300" : "text-neutral-600"
                    }`}
                  >
                    {offer.description}
                  </p>
                </div>

                <div>
                  {offer.terms && (
                    <p
                      className={`text-[10px] italic mb-4 ${
                        index === 0 ? "text-neutral-500" : "text-neutral-400"
                      }`}
                    >
                      * {offer.terms}
                    </p>
                  )}

                  <button
                    onClick={() => onClaimOffer(offer.title)}
                    className={`w-full py-3 px-4 rounded-full font-semibold text-xs transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center space-x-1.5 ${
                      index === 0
                        ? "bg-white hover:bg-neutral-100 text-neutral-950"
                        : "bg-neutral-950 hover:bg-neutral-800 text-white"
                    }`}
                  >
                    <span>Enquire About Offer</span>
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
