"use client";

import React from "react";
import { translations, Language } from "@/lib/translations";
import { Phone, Mail, MapPin } from "lucide-react";

interface FooterProps {
  lang: Language;
}

export function Footer({ lang }: FooterProps) {
  const t = translations[lang];

  return (
    <footer className="bg-neutral-950 border-t border-neutral-850 py-16 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-xl font-black tracking-widest text-white uppercase font-sans">
                ARS MOTORS
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-emerald-400 border border-white/10 uppercase tracking-wider">
                Authorized Dealership
              </span>
            </div>
            <p className="text-neutral-400 max-w-md leading-relaxed mb-4">
              Authorized 3S Dealership for Kinetic Green E-Luna in Salem, Tamil Nadu. Delivering certified electric vehicles, authorized spare parts, battery maintenance, and finance enquiries through our Salem team.
            </p>
            <div className="text-[11px] text-neutral-500 font-medium">
              Kinetic Green Energy & Power Solutions • Planet @ Our Heart
            </div>
          </div>

          {/* Col 3: Main Showroom */}
          <div>
            <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-3">
              Main Showroom
            </span>
            <p className="text-neutral-400 leading-relaxed mb-2">
              3/345, Seelanaickenpatti Bypass, Near Dharan Hospital, Salem – 636 201.
            </p>
            <div className="text-neutral-300 font-mono font-medium">
              +91 90 25 38 06 26
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Mon–Sun: 9:00 AM – 8:30 PM
            </div>
          </div>

          {/* Col 4: Branch Showroom */}
          <div>
            <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-3">
              Madathur Branch
            </span>
            <p className="text-neutral-400 leading-relaxed mb-2">
              Elampillai to Chinnappampatti Road, Madathur Bus Stop, Salem District – 636 501.
            </p>
            <div className="text-neutral-300 font-mono font-medium">
              +91 94 43 24 07 52
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Mon–Sun: 9:00 AM – 8:00 PM
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Navigation */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[11px] text-neutral-500">
            © 2026 ARS Motors Salem. All rights reserved. Authorized Kinetic Green Partner.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-neutral-400">
            <a href="/e-luna" className="hover:text-white transition-colors">
              Vehicles
            </a>
            <span>•</span>
            <a href="/finance-offers#savings-calculator" className="hover:text-white transition-colors">
              Savings Calculator
            </a>
            <span>•</span>
            <a href="/finance-offers#emi-calculator" className="hover:text-white transition-colors">
              EMI Finance
            </a>
            <span>•</span>
            <a href="/showrooms" className="hover:text-white transition-colors">
              Showrooms
            </a>
            <span>•</span>
            <a href="/ownership" className="hover:text-white transition-colors">Ownership</a>
            <a href="/about" className="hover:text-white transition-colors">About</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/booking-terms" className="hover:text-white transition-colors">Booking terms</a>
            <a href="/offer-terms" className="hover:text-white transition-colors">Offer terms</a>
            <button type="button" onClick={() => window.dispatchEvent(new Event("ars-preferences"))} className="hover:text-white transition-colors">Analytics preferences</button>
            <a href="/admin/login" className="hover:text-white transition-colors">
              Staff Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
