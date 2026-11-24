"use client";
import { Copy, useCopy } from "@/components/site-language";


import React from "react";
import { Dialog } from "./dialog";
import { translations, Language } from "@/lib/translations";
import { X, ChevronRight, MapPin, Zap, ExternalLink, ShieldCheck, Phone, Sparkles } from "lucide-react";

interface MegaMenuProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
}

export function MegaMenu({ lang, isOpen, onClose, onNavigate }: MegaMenuProps) {
  const translate = useCopy();
  const t = translations[lang];

  if (!isOpen) return null;

  const handleLinkClick = (sectionId: string) => {
    onClose();
    onNavigate(sectionId);
  };

  return (
    <Dialog title={translate("Site navigation")} onClose={onClose}><div className="fixed inset-0 z-50 bg-[#0c0e12]/95 backdrop-blur-2xl text-white overflow-y-auto animate-fadeIn">
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
                onClick={() => handleLinkClick("/e-luna/kinetic-e-luna-pro-x3")}
                className="hover:text-white flex items-center space-x-1"
              >
                <span>E-Luna PRO X3</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-sky-500 text-black font-extrabold">
                  <Copy>{"New"}</Copy>
                </span>
              </button>
              <button
                onClick={() => handleLinkClick("/e-luna/e-luna-commercial-cargo")}
                className="hover:text-white"
              >
                <Copy>{"Commercial Cargo"}</Copy>
              </button>
              <button
                onClick={() => handleLinkClick("/e-luna/e-luna-city-commuter")}
                className="hover:text-white"
              >
                <Copy>{"City Commuter"}</Copy>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span><Copy>{t.locationPill}</Copy></span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white transition-colors"
              title={translate("Close Menu")}
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
              <Copy>{"Explore E-Luna"}</Copy>
            </h4>
            <ul className="space-y-3 text-sm font-semibold text-slate-200">
              <li>
                <button
                  onClick={() => handleLinkClick("electric-family")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{t.exploreModels}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("showrooms")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{t.locateDealers}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("specs-matrix")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{t.compareModels}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("/book-test-ride?model=Kinetic%20E-Luna%20PRO%20X3")}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1 text-left"
                >
                  <span><Copy>{"Test Ride the PRO X3"}</Copy></span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500 text-black font-extrabold">
                    <Copy>{"New"}</Copy>
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("/book-test-ride?model=E-Luna%20Commercial%20Cargo")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{"Test Ride Commercial Cargo"}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("/book-test-ride?model=E-Luna%20City%20Commuter")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{"Test Ride City Commuter"}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("/book-test-ride?inquiry=finance")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{"Finance Enquiries"}</Copy>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: ARS Ecosystem */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              <Copy>{"Ownership & Charging"}</Copy>
            </h4>
            <ul className="space-y-3 text-sm font-semibold text-slate-200">
              <li>
                <button
                  onClick={() => handleLinkClick("service")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{"Service Enquiries"}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("warranty")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{"Warranty Guidance"}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("charging-guide")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{"Home Charging Guide"}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("faq-section")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{"Ownership FAQs"}</Copy>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              <Copy>{t.resources}</Copy>
            </h4>
            <ul className="space-y-3 text-sm font-semibold text-slate-200">
              <li>
                <button
                  onClick={() => handleLinkClick("savings-calculator")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{t.savingsCalcNav}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("emi-calculator")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{t.emiCalcNav}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("exchange-estimator")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{"Request an Exchange Valuation"}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("features")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{"Explore E-Luna features"}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("/#customer-stories")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{"Customer Delivery Stories"}</Copy>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: More */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              <Copy>{"Salem Showrooms & Support"}</Copy>
            </h4>
            <ul className="space-y-3 text-sm font-semibold text-slate-200">
              <li>
                <button
                  onClick={() => handleLinkClick("/showrooms#showrooms")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{"Showroom Hours & Directions"}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("/showrooms#seelanaickenpatti")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{t.seelanaickenpattiNav}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("/showrooms#madathur")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{t.madathurNav}</Copy>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("offers")}
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 text-left text-emerald-400 font-bold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span><Copy>{"Exclusive Salem Offers"}</Copy></span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick("about-ars")}
                  className="hover:text-emerald-400 transition-colors text-left"
                >
                  <Copy>{"About ARS Motors"}</Copy>
                </button>
              </li>
              <li>
                <a
                  href="tel:9025380626"
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5 text-left text-slate-200"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span><Copy>{t.supportNav}</Copy></span>
                </a>
              </li>
            </ul>

            <div className="mt-8 pt-6 border-t border-white/[0.08]">
              <span className="text-xs text-slate-400 flex items-center space-x-2 font-medium">
                <span><Copy>{"🇮🇳 India (Tamil Nadu)"}</Copy></span>
                <span>•</span>
                <span className="text-emerald-400"><Copy>{"Salem Dealership"}</Copy></span>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Model Cards Showcase Row matching Screenshot 3 with REAL photo thumbnails */}
        <div className="pt-6 pb-2 border-t border-white/[0.08]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Model Card 1 */}
            <div
              role="button" tabIndex={0} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();handleLinkClick("/e-luna/kinetic-e-luna-pro-x3");}}}
              onClick={() => handleLinkClick("/e-luna/kinetic-e-luna-pro-x3")}
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
                    <Copy>{"New"}</Copy>
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5"><Copy>{"Everyday riding & errands"}</Copy></p>
                <span className="text-xs font-bold text-white mt-1 block">
                  <Copy>{"View bike details"}</Copy>
                </span>
              </div>
            </div>

            {/* Model Card 2 */}
            <div
              role="button" tabIndex={0} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();handleLinkClick("/e-luna/e-luna-commercial-cargo");}}}
              onClick={() => handleLinkClick("/e-luna/e-luna-commercial-cargo")}
              className="cursor-pointer group relative rounded-2xl p-4 bg-gradient-to-b from-[#181d26] to-[#0f1218] border border-white/[0.08] hover:border-white/30 transition-all flex items-center space-x-4"
            >
              <div className="w-24 h-18 rounded-xl bg-neutral-900 overflow-hidden flex items-center justify-center border border-white/10">
                <img
                  src="/assets/bikes/cargo-heavy-hd.jpg"
                  alt={translate("Commercial Cargo")}
                  className="w-full h-full object-cover p-0.5 group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h5 className="font-extrabold text-sm text-white group-hover:text-neutral-200 transition-colors">
                  <Copy>{"Commercial Cargo"}</Copy>
                </h5>
                <p className="text-xs text-neutral-400 mt-0.5"><Copy>{"Delivery & business use"}</Copy></p>
                <span className="text-xs font-bold text-white mt-1 block">
                  <Copy>{"View bike details"}</Copy>
                </span>
              </div>
            </div>

            {/* Model Card 3 */}
            <div
              role="button" tabIndex={0} onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();handleLinkClick("/e-luna/e-luna-city-commuter");}}}
              onClick={() => handleLinkClick("/e-luna/e-luna-city-commuter")}
              className="cursor-pointer group relative rounded-2xl p-4 bg-gradient-to-b from-[#181d26] to-[#0f1218] border border-white/[0.08] hover:border-white/30 transition-all flex items-center space-x-4"
            >
              <div className="w-24 h-18 rounded-xl bg-neutral-900 overflow-hidden flex items-center justify-center border border-white/10">
                <img
                  src="/assets/bikes/commuter-family-hd.jpg"
                  alt={translate("City Commuter")}
                  className="w-full h-full object-cover p-0.5 group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h5 className="font-extrabold text-sm text-white group-hover:text-neutral-200 transition-colors">
                  <Copy>{"City Commuter"}</Copy>
                </h5>
                <p className="text-xs text-neutral-400 mt-0.5"><Copy>{"Local trips & family errands"}</Copy></p>
                <span className="text-xs font-bold text-white mt-1 block">
                  <Copy>{"View bike details"}</Copy>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></Dialog>
  );
}
