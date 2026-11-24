"use client";

import React from "react";
import { translations, Language } from "@/lib/translations";
import { Phone, Mail, Navigation, Clock, MapPin } from "lucide-react";

interface DealershipSectionProps {
  lang: Language;
}

export function DealershipSection({ lang }: DealershipSectionProps) {
  const t = translations[lang];

  return (
    <section id="showrooms" className="py-20 md:py-28 bg-[#fafafa] text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-2">
            Authorized Dealership
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-neutral-950 tracking-tight">
            Visit ARS Motors in Salem
          </h2>
          <p className="mt-2 text-neutral-600 text-sm sm:text-base leading-relaxed">
            Experience and test ride the Kinetic E-Luna in person at our 2 authorized showroom locations.
          </p>
        </div>

        {/* 2 Dealership Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Location 1: Main Showroom (Seelanaickenpatti Bypass) */}
          <div id="seelanaickenpatti" className="rounded-2xl p-6 sm:p-8 border border-neutral-200/90 bg-white shadow-2xs flex flex-col justify-between group hover:border-neutral-300 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-200">
                  Main Showroom & 3S Facility
                </span>
                <div className="flex items-center space-x-1.5 text-xs text-neutral-500 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>9:00 AM – 8:30 PM (Daily)</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-neutral-950 mb-2 tracking-tight">
                ARS Motors — Seelanaickenpatti Bypass
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mb-6 leading-relaxed">
                3/345, Seelanaickenpatti Bypass, Near Dharan Hospital, Salem – 636 201, Tamil Nadu.
              </p>

              <div className="space-y-3 pt-4 border-t border-neutral-100 text-xs">
                <div className="flex items-center space-x-3 text-neutral-700">
                  <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <a href="tel:9025380626" className="font-semibold hover:text-black font-mono">
                    +91 90 25 38 06 26
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-neutral-700">
                  <Mail className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                  <a href="mailto:arsmotors9@gmail.com" className="hover:text-black">
                    arsmotors9@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <a
                href="https://maps.google.com/?q=Seelanaickenpatti+Bypass+Salem"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs flex items-center justify-center space-x-2 transition-all border border-neutral-200"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Maps</span>
              </a>
              <a
                href="tel:9025380626"
                className="flex-1 py-3 px-4 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Showroom</span>
              </a>
            </div>
          </div>

          {/* Location 2: Branch Showroom (Madathur / Elampillai Road) */}
          <div id="madathur" className="rounded-2xl p-6 sm:p-8 border border-neutral-200/90 bg-white shadow-2xs flex flex-col justify-between group hover:border-neutral-300 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-200">
                  Branch Showroom
                </span>
                <div className="flex items-center space-x-1.5 text-xs text-neutral-500 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>9:00 AM – 8:00 PM (Daily)</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-semibold text-neutral-950 mb-2 tracking-tight">
                ARS Motors — Madathur Branch
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mb-6 leading-relaxed">
                Elampillai to Chinnappampatti Road, Madathur Bus Stop, Salem District – 636 501.
              </p>

              <div className="space-y-3 pt-4 border-t border-neutral-100 text-xs">
                <div className="flex items-center space-x-3 text-neutral-700">
                  <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <a href="tel:9443240752" className="font-semibold hover:text-black font-mono">
                    +91 94 43 24 07 52
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-neutral-700">
                  <Mail className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                  <a href="mailto:arsmotors9@gmail.com" className="hover:text-black">
                    arsmotors9@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <a
                href="https://maps.google.com/?q=Madathur+Bus+Stop+Elampillai+Road"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs flex items-center justify-center space-x-2 transition-all border border-neutral-200"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Maps</span>
              </a>
              <a
                href="tel:9443240752"
                className="flex-1 py-3 px-4 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Showroom</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
