"use client";
import { Copy } from "@/components/site-language";


import React, { useState, useEffect } from "react";
import { translations, Language } from "@/lib/translations";
import { ArrowRight, ChevronRight, Zap, Shield, Sparkles } from "lucide-react";

interface HeroProps {
  lang: Language;
  onBookTestRide: (model?: string) => void;
  onExplore360: () => void;
  onLearnMore: (model?: string) => void;
  onCalculateSavings?: () => void;
}

export function Hero({
  lang,
  onBookTestRide,
  onExplore360,
  onLearnMore,
  onCalculateSavings,
}: HeroProps) {
  const t = translations[lang];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused,setPaused]=useState(false);
  const [userPaused,setUserPaused]=useState(false);

  const slides = [
    // Variant 1: Kinetic E-Luna PRO X3 (Flagship Golden Studio Reference)
    {
      id: "pro-x3",
      variantName: "Kinetic E-Luna PRO X3",
      pillBadge: "Flagship • 110 km Listed Range*",
      headlineLine1: "Kinetic E-Luna PRO X3",
      headlineLine2: "Make life look easy",
      subhead:
        "110 km Listed Range* • 50 km/h Top Speed • 2.3 kWh Advanced Li-ion Battery • Indicative specifications; confirm at showroom",
      image: "/assets/bikes/hero-pro-x3-golden.jpg",
      specs: [
        { label: "Listed Range*", value: "110 km" },
        { label: "Top Speed", value: "50 km/h" },
        { label: "Battery Pack", value: "2.3 kWh" },
        { label: "Quote", value: "Ask our team" },
      ],
      primaryBtn: "Book PRO X3",
      primaryAction: () => onBookTestRide("Kinetic E-Luna PRO X3"),
      secondaryBtn: "Explore Specifications",
      secondaryAction: () => onLearnMore("Kinetic E-Luna PRO X3"),
    },
    // Variant 2: E-Luna Commercial Cargo (Heavy-Duty Logistics Reference)
    {
      id: "cargo",
      variantName: "E-Luna Commercial Cargo",
      pillBadge: "Heavy-Duty • 150 kg Payload Capacity",
      headlineLine1: "E-Luna Commercial Cargo",
      headlineLine2: "Built for heavy delivery & commercial fleets",
      subhead:
        "150 kg Payload Capacity • Detachable Rear Seat with Flat Steel Cargo Rack • Ask About Exchange Options",
      image: "/assets/bikes/hero-commercial-cargo.jpg",
      specs: [
        { label: "Payload Capacity", value: "150 kg" },
        { label: "Listed Range*", value: "100 km" },
        { label: "Cargo Bed", value: "Flat Steel" },
        { label: "Local Support", value: "Salem" },
      ],
      primaryBtn: "Book Cargo Edition",
      primaryAction: () => onBookTestRide("E-Luna Commercial Cargo"),
      secondaryBtn: "Fleet Inquiries",
      secondaryAction: () => onBookTestRide("E-Luna Commercial Cargo"),
    },
    // Variant 3: E-Luna City Commuter (Family Comfort Reference)
    {
      id: "commuter",
      variantName: "E-Luna City Commuter",
      pillBadge: "Everyday Family Mobility",
      headlineLine1: "E-Luna City Commuter",
      headlineLine2: "Electric comfort for the whole family",
      subhead:
        "Dual Cushioned Split Seating • Protective Saree Guard • Telescopic Front Suspension • Ask About Home Charging",
      image: "/assets/bikes/hero-city-commuter.jpg",
      specs: [
        { label: "Seating", value: "Dual Split" },
        { label: "Charging", value: "Home charging" },
        { label: "Listed Range*", value: "90 km" },
        { label: "Safety", value: "Saree Guard" },
      ],
      primaryBtn: "Book Commuter",
      primaryAction: () => onBookTestRide("E-Luna City Commuter"),
      secondaryBtn: "Calculate Savings",
      secondaryAction: onCalculateSavings || (() => onLearnMore("E-Luna City Commuter")),
    },
  ];

  useEffect(() => {
    if (paused || userPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length,paused,userPaused]);

  const slide = slides[currentSlide];

  return (
    <section onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} className="relative w-full h-[90vh] md:h-[94vh] min-h-[640px] max-h-[980px] overflow-hidden flex flex-col justify-between text-white select-none bg-neutral-950">
      <button className="skip-link" onClick={()=>setUserPaused(!userPaused)}>{userPaused?"Resume hero slides":"Pause hero slides"}</button>
      {/* 1. Full-Bleed Edge-to-Edge Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          key={slide.image}
          src={slide.image}
          alt={slide.variantName}
          className="w-full h-full object-cover object-center transition-all duration-1000 ease-out"
          onError={(e) => {
            e.currentTarget.src = "/assets/bikes/hero-action-hd.jpg";
          }}
        />

        {/* Subtle Cinematic Vignette preserving natural lighting while securing 100% text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 2. Top Headroom / Pill Selector Bar */}
      <div className="relative z-10 pt-6 sm:pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
        {/* Model Tabs for direct manual switching */}
        <div className="inline-flex p-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
          {slides.map((s, index) => (
            <button
              key={s.id}
              onClick={() => {setCurrentSlide(index);setUserPaused(true);}}
              className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                currentSlide === index
                  ? "bg-white text-neutral-950 shadow-md font-bold"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span className="hidden sm:inline">{s.variantName}</span>
              <span className="sm:hidden">{index === 0 ? "PRO X3" : index === 1 ? "Cargo" : "Commuter"}</span>
            </button>
          ))}
        </div>

        {/* Interactive 360 Studio Shortcut Pill */}
        <button
          onClick={onExplore360}
          className="hidden sm:inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-semibold transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span><Copy>{"360° Studio"}</Copy></span>
        </button>
      </div>

      {/* 3. Central Hero Headline & Primary Action */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 sm:pb-12">
        <div className="max-w-2xl sm:max-w-3xl">
          {/* Subtle Category Pill Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium border border-white/20 mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span><Copy>{slide.pillBadge}</Copy></span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight">
            {slide.headlineLine1}
          </h1>
          <p className="mt-1.5 text-xl sm:text-2xl lg:text-3xl font-light text-white/90 tracking-tight">
            <Copy>{slide.headlineLine2}</Copy>
          </p>

          <p className="mt-3 text-xs sm:text-sm text-white/75 max-w-xl leading-relaxed">
            <Copy>{slide.subhead}</Copy>
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={slide.primaryAction}
              className="px-7 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-lg flex items-center space-x-2"
            >
              <span><Copy>{slide.primaryBtn}</Copy></span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={slide.secondaryAction}
              className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/25 font-medium text-xs sm:text-sm transition-all duration-200 active:scale-95"
            >
              <span><Copy>{slide.secondaryBtn}</Copy></span>
            </button>
          </div>
        </div>

        {/* 4. Bottom Horizontal Automotive Telemetry Bar */}
        <div className="mt-8 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
          {slide.specs.map((spec, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-white/60 font-medium">
                <Copy>{spec.label}</Copy>
              </span>
              <span className="text-base sm:text-lg font-semibold text-white tracking-tight font-mono mt-0.5">
                <Copy>{spec.value}</Copy>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
