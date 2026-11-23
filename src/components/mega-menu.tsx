"use client";

import React from "react";
import { translations, Language } from "@/lib/translations";
import { X, ChevronRight, MapPin, Zap, ExternalLink, ShieldCheck, Phone, Sparkles } from "lucide-react";

interface MegaMenuProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export function MegaMenu({ lang, isOpen, onClose, onNavigate }: MegaMenuProps) {
  const t = translations[lang];

  if (!isOpen) return null;

  const handleLinkClick = (sectionId: string) => {
    onClose();
    onNavigate(sectionId);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0c0e12]/95 backdrop-blur-2xl text-white overflow-y-auto animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen flex flex-col justify-between">
        {/* Top Header Bar matching Screenshot 3 */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
          <div className="flex items-center space-x-6">
            {/* Brand Logo */}
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-black tracking-widest text-white uppercase font-sans">
                ARS MOTORS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Kinetic
              </span>
            </div>

            {/* Quick Model Links in Header */}
            <div className="hidden md:flex items-center space-x-4 text-xs font-bold text-slate-300">
              <button
                onClick={() => handleLinkClick("electric-family")}
                className="hover:text-white flex items-center space-x-1"
              >
                <span>E-Luna PRO X3</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-sky-500 text-black font-extrabold">
                  New
                </span>
              </button>
              <button
                onClick={() => handleLinkClick("electric-family")}
                className="hover:text-white"
              >
                Commercial Cargo
              </button>
              <button
                onClick={() => handleLinkClick("electric-family")}
                className="hover:text-white"
              >
                City Commuter
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.locationPill}</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white transition-colors"
              title="Close Menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 4 Categorized Columns matching Screenshot 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
          {/* Column 1: Buy Electric Scooters */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              {t.buyElectricScooters}
            </h4>
            <ul className="space-y-3 text-sm font-semibold text-slate-200">
              <li>
                <button
                  onClick={() => handleLinkClick("electric-family")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.exploreModels}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("showrooms")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.locateDealers}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("specs-matrix")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.compareModels}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("get-in-touch")}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1 text-left"
                >
                  <span>{t.bookProX3}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-extrabold">
                    New
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("get-in-touch")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.bookCargo}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("get-in-touch")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.bookCity}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("emi-calculator")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.flexipay}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: ARS Ecosystem */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              {t.arsEcosystem}
            </h4>
            <ul className="space-y-3 text-sm font-semibold text-slate-200">
              <li>
                <button
                  onClick={() => handleLinkClick("showrooms")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.vehicleService}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("features")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.batteryWarranty}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("charging-guide")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.chargingEco}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("offers")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  Special Offers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              {t.resources}
            </h4>
            <ul className="space-y-3 text-sm font-semibold text-slate-200">
              <li>
                <button
                  onClick={() => handleLinkClick("savings-calculator")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.savingsCalcNav}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("emi-calculator")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.emiCalcNav}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("exchange-estimator")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.exchangeNav}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("features")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.blogsNav}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("faq-section")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.faqNav}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: More */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              {t.more}
            </h4>
            <ul className="space-y-3 text-sm font-semibold text-slate-200">
              <li>
                <button
                  onClick={() => handleLinkClick("showrooms")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.timingsNav}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("showrooms")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.seelanaickenpattiNav}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("showrooms")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  {t.madathurNav}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("offers")}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 text-left text-emerald-400 font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Exclusive Salem Offers</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("about-ars")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  About ARS Motors
                </button>
              </li>
              <li>
                <a
                  href="tel:9025380626"
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 text-left text-slate-200"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.supportNav}</span>
                </a>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <span className="text-xs text-slate-400 flex items-center space-x-2 font-medium">
                <span>🇮🇳 India (Tamil Nadu)</span>
                <span>•</span>
                <span className="text-emerald-400">Salem Dealership</span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Model Cards Showcase Row matching Screenshot 3 with REAL photo thumbnails */}
        <div className="pt-6 pb-2 border-t border-white/[0.08]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Model Card 1 */}
            <div
              onClick={() => handleLinkClick("electric-family")}
              className="cursor-pointer group relative rounded-2xl p-4 bg-gradient-to-b from-[#181d26] to-[#0f1218] border border-white/[0.08] hover:border-white/30 transition-all flex items-center space-x-4"
            >
              <div className="w-24 h-18 rounded-xl bg-neutral-900 overflow-hidden flex items-center justify-center border border-white/10">
                <img
                  src="/assets/bikes/studio-yellow-hd.jpg"
                  alt="E-Luna PRO X3"
                  className="w-full h-full object-cover p-0.5 group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h5 className="font-extrabold text-sm text-white group-hover:text-neutral-200 transition-colors">
                    E-Luna PRO X3
                  </h5>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500 text-white font-extrabold">
                    New
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">2.3 kWh • 110 km Range</p>
                <span className="text-xs font-bold text-white mt-1 block">
                  ₹69,990*
                </span>
              </div>
            </div>

            {/* Model Card 2 */}
            <div
              onClick={() => handleLinkClick("electric-family")}
              className="cursor-pointer group relative rounded-2xl p-4 bg-gradient-to-b from-[#181d26] to-[#0f1218] border border-white/[0.08] hover:border-white/30 transition-all flex items-center space-x-4"
            >
              <div className="w-24 h-18 rounded-xl bg-neutral-900 overflow-hidden flex items-center justify-center border border-white/10">
                <img
                  src="/assets/bikes/cargo-heavy-hd.jpg"
                  alt="Commercial Cargo"
                  className="w-full h-full object-cover p-0.5 group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h5 className="font-extrabold text-sm text-white group-hover:text-neutral-200 transition-colors">
                  Commercial Cargo
                </h5>
                <p className="text-xs text-neutral-400 mt-0.5">150 kg Payload • Detachable Seat</p>
                <span className="text-xs font-bold text-white mt-1 block">
                  ₹74,990*
                </span>
              </div>
            </div>

            {/* Model Card 3 */}
            <div
              onClick={() => handleLinkClick("electric-family")}
              className="cursor-pointer group relative rounded-2xl p-4 bg-gradient-to-b from-[#181d26] to-[#0f1218] border border-white/[0.08] hover:border-white/30 transition-all flex items-center space-x-4"
            >
              <div className="w-24 h-18 rounded-xl bg-neutral-900 overflow-hidden flex items-center justify-center border border-white/10">
                <img
                  src="/assets/bikes/commuter-family-hd.jpg"
                  alt="City Commuter"
                  className="w-full h-full object-cover p-0.5 group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h5 className="font-extrabold text-sm text-white group-hover:text-neutral-200 transition-colors">
                  City Commuter
                </h5>
                <p className="text-xs text-neutral-400 mt-0.5">Family Ride • Dual Split Seats</p>
                <span className="text-xs font-bold text-white mt-1 block">
                  ₹64,990*
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
