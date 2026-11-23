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

  const defaultOffers: OfferItem[] = [
    {
      id: "off-1",
      title: "Salem Priority Token Booking",
      badge: "Priority Allocation",
      discount: "Book @ ₹1,000 Only",
      validTill: "Valid till Dec 31, 2026",
      description: "Secure your vehicle delivery slot with direct factory priority allocation from ARS Motors Salem. 100% refundable prior to invoice.",
      terms: "100% Refundable prior to vehicle invoice. T&C Apply.",
      isActive: true,
    },
    {
      id: "off-2",
      title: "Two-Wheeler Exchange Bonus",
      badge: "Exchange Special",
      discount: "Up to ₹5,000 Extra Value",
      validTill: "Limited Period Offer",
      description: "Exchange any old petrol moped or motorcycle (TVS XL, Splendor, Activa, etc.) for fair market valuation plus up to ₹5,000 bonus.",
      terms: "Subject to physical evaluation at Salem showroom.",
      isActive: true,
    },
    {
      id: "off-3",
      title: "Complimentary Safety Delivery Kit",
      badge: "Free On Delivery",
      discount: "Free ISI Helmet & Toolkit",
      validTill: "Active for All Bookings",
      description: "Receive a brand-new ISI certified safety helmet and essential roadside maintenance toolkit with every vehicle delivery.",
      terms: "One complimentary kit per registered vehicle.",
      isActive: true,
    },
  ];

  const [offers, setOffers] = useState<OfferItem[]>(defaultOffers);

  useEffect(() => {
    fetch("/api/offers")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.offers && data.offers.length > 0) {
          setOffers(data.offers);
        }
      })
      .catch(() => {
        // Fallback to default offers
      });
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
            Take advantage of exclusive incentives, priority token allocations, and exchange bonuses available directly at ARS Motors.
          </p>
        </div>

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
                    <span>Claim Offer</span>
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
