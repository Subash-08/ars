"use client";

import React, { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { MapPin, ChevronDown, X } from "lucide-react";
import { MegaMenu } from "./mega-menu";

interface NavbarProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  onOpenCallback: () => void;
  onOpenBooking: () => void;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({
  lang,
  onToggleLang,
  onOpenCallback,
  onOpenBooking,
  onNavigate,
}: NavbarProps) {
  const t = translations[lang];
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [showLocationTooltip, setShowLocationTooltip] = useState(true);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all text-neutral-900 h-16 sm:h-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Left: Pure Ather Brand & Vehicle Links */}
          <div className="flex items-center space-x-8 lg:space-x-12">
            <a
              href="/"
              className="flex items-center space-x-2 group cursor-pointer"
            >
              <span className="text-xl sm:text-2xl font-black tracking-widest text-neutral-950 uppercase font-sans">
                ARS MOTORS
              </span>
            </a>

            {/* Model Links matching Ather: Konarc [New] | Rizta | Ather 450 */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs font-semibold text-neutral-800">
              <button
                onClick={() => onNavigate("/e-luna#kinetic-e-luna-pro-x3")}
                className="hover:text-black flex items-center space-x-1.5 transition-colors font-bold"
              >
                <span>PRO X3</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#1b2533] text-white font-extrabold uppercase">
                  New
                </span>
              </button>
              <button
                onClick={() => onNavigate("/e-luna#e-luna-commercial-cargo")}
                className="hover:text-black transition-colors"
              >
                Cargo
              </button>
              <button
                onClick={() => onNavigate("/e-luna#e-luna-city-commuter")}
                className="hover:text-black transition-colors"
              >
                City Commuter
              </button>
            </nav>
          </div>

          {/* Right Action Stack matching Ather Reference exactly */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-xs font-semibold text-neutral-700">
            {/* Showrooms Dropdown */}
            <button
              onClick={() => onNavigate("showrooms")}
              className="hidden lg:flex items-center space-x-1 hover:text-black transition-colors"
            >
              <span>Salem Showrooms</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {/* Ecosystem Dropdown */}
            <button
              onClick={() => setIsMegaMenuOpen(true)}
              className="hidden sm:flex items-center space-x-1 hover:text-black transition-colors"
            >
              <span>Ecosystem</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {/* Location Pill with dismissible tooltip */}
            <div className="relative">
              <button
                onClick={() => onNavigate("showrooms")}
                className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-300 px-3.5 py-1.5 rounded-full transition-colors shadow-2xs"
              >
                <span>Salem</span>
                <MapPin className="w-3 h-3 text-neutral-600" />
              </button>

              {/* Ather Signature Tooltip */}
              {showLocationTooltip && (
                <div className="absolute right-0 top-11 z-50 bg-white border border-neutral-200 rounded-xl px-3 py-2 shadow-xl flex items-center space-x-2 whitespace-nowrap text-[11px] animate-fadeIn">
                  <span className="text-neutral-600">
                    Prices & offers shown for{" "}
                    <strong className="text-neutral-900 underline font-bold">
                      Salem
                    </strong>
                  </span>
                  <button
                    onClick={() => setShowLocationTooltip(false)}
                    className="text-neutral-400 hover:text-neutral-700 p-0.5 ml-1"
                    title="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Minimalist 2-Bar Hamburger Menu Button matching Ather */}
            <button
              onClick={() => setIsMegaMenuOpen(true)}
              className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors flex flex-col justify-center items-center space-y-1.5 p-2"
              title="Open Navigation Menu"
            >
              <span className="w-4 h-[2px] bg-neutral-900 rounded-full" />
              <span className="w-4 h-[2px] bg-neutral-900 rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Mega Menu Overlay Drawer */}
      <MegaMenu
        lang={lang}
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
        onNavigate={onNavigate}
      />
    </>
  );
}
