"use client";
import { Copy, useCopy, useSiteLanguage } from "@/components/site-language";


import React, { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { MapPin, ChevronDown } from "lucide-react";
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
  const translate = useCopy();
  const t = translations[lang];
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [showTamilNotice, setShowTamilNotice] = useState(false);
  const { language, selectLanguage } = useSiteLanguage();
  const copy = useCopy();
  const languageButton = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-100 transition-all text-neutral-900 h-16 sm:h-18">
        <div className="max-w-7xl mx-auto px-2 min-[380px]:px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Left: Pure Ather Brand & Vehicle Links */}
          <div className="flex items-center space-x-8 lg:space-x-12">
            <a
              href="/"
              className="flex items-center space-x-2 group cursor-pointer"
            >
              <span className="whitespace-nowrap text-base min-[380px]:text-lg sm:text-2xl font-black tracking-[0.08em] min-[380px]:tracking-widest text-neutral-950 uppercase font-sans">
                ARS MOTORS
              </span>
            </a>

            {/* Model Links matching Ather: Konarc [New] | Rizta | Ather 450 */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs font-semibold text-neutral-800">
              <button
                onClick={() => onNavigate("/e-luna/kinetic-e-luna-pro-x3")}
                className="hover:text-black flex items-center space-x-1.5 transition-colors font-bold"
              >
                <span>PRO X3</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#1b2533] text-white font-extrabold uppercase">
                  <Copy>{"New"}</Copy>
                </span>
              </button>
              <button
                onClick={() => onNavigate("/e-luna/e-luna-commercial-cargo")}
                className="hover:text-black transition-colors"
              >
                <Copy>{"Cargo"}</Copy>
              </button>
              <button
                onClick={() => onNavigate("/e-luna/e-luna-city-commuter")}
                className="hover:text-black transition-colors"
              >
                <Copy>{"City Commuter"}</Copy>
              </button>
            </nav>
          </div>

          {/* Right Action Stack matching Ather Reference exactly */}
          <div className="flex items-center gap-1.5 min-[380px]:gap-2 sm:gap-4 lg:gap-6 text-xs font-semibold text-neutral-700">
            {/* Showrooms Dropdown */}
            <button
              onClick={() => onNavigate("showrooms")}
              className="hidden lg:flex items-center space-x-1 hover:text-black transition-colors"
            >
              <span><Copy>{"Salem Showrooms"}</Copy></span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {/* Ecosystem Dropdown */}
            <button
              onClick={() => setIsMegaMenuOpen(true)}
              className="hidden sm:flex items-center space-x-1 hover:text-black transition-colors"
            >
              <span><Copy>{"Ecosystem"}</Copy></span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {/* Location */}
            <div className="relative">
              <button
                onClick={() => onNavigate("showrooms")}
                className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-50 border border-neutral-300 px-2.5 min-[380px]:px-3.5 py-1.5 rounded-full transition-colors shadow-2xs"
              >
                <span className="sr-only min-[380px]:not-sr-only"><Copy>{"Salem"}</Copy></span>
                <MapPin className="w-3 h-3 text-neutral-600" />
              </button>

            </div>

            <div className="relative" onKeyDown={event => {
              if (event.key === "Escape" && showTamilNotice) {
                setShowTamilNotice(false);
                languageButton.current?.focus();
              }
            }}>
              <button
                type="button"
                ref={languageButton}
                aria-label={language === "ta" ? "மொழியைத் தேர்ந்தெடுக்கவும், தமிழ் செயலில் உள்ளது" : "Language options, English active"}
                aria-expanded={showTamilNotice}
                aria-controls="tamil-language-notice" data-language-picker
                onClick={() => {
                  setShowTamilNotice(open => !open);
                }}
                className="whitespace-nowrap rounded-full border border-neutral-300 bg-white px-2.5 py-1.5 hover:bg-neutral-50"
              >
                <span className={language === "en" ? "font-extrabold" : "text-neutral-500"} lang="en">EN</span><span aria-hidden="true" className="mx-1 text-neutral-400">/</span><span className={language === "ta" ? "font-extrabold" : "text-neutral-500"} lang="ta">தமிழ்</span>
              </button>
              <div id="tamil-language-notice" hidden={!showTamilNotice}
                className="absolute right-0 top-10 z-50 w-44 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg">
                {([["en", "English"], ["ta", "தமிழ்"]] as const).map(([value, label]) => (
                  <button type="button" key={value} aria-pressed={language === value}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left hover:bg-neutral-100 aria-pressed:bg-emerald-50"
                    onClick={() => {
                      selectLanguage(value);
                      setShowTamilNotice(false);
                      languageButton.current?.focus();
                    }}>
                    <span lang={value}>{label}</span>
                    {language === value && <span className="text-[10px] text-emerald-900">{copy("Active")}</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimalist 2-Bar Hamburger Menu Button matching Ather */}
            <button
              onClick={() => setIsMegaMenuOpen(true)}
              className="w-9 h-9 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-colors flex flex-col justify-center items-center space-y-1.5 p-2"
              title={translate("Open Navigation Menu")}
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
