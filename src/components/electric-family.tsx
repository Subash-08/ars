"use client";

import React from "react";
import { translations, Language } from "@/lib/translations";

interface ElectricFamilyProps {
  lang: Language;
  onBookModel: (modelName: string) => void;
  onExploreModel: (modelName: string) => void;
}

export function ElectricFamily({ lang, onBookModel, onExploreModel }: ElectricFamilyProps) {
  const t = translations[lang];

  return (
    <section id="electric-family" className="py-16 md:py-24 bg-white text-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching Ather Reference */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-neutral-900 tracking-tight">
            The E-Luna Electric Family
          </h2>
        </div>

        {/* 3-Card Bento Grid directly mirroring Ather Reference Screenshot */}
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
          {/* Card 1: Top Featured Wide Card (Ather Konarc Style - Left Aligned) */}
          <div className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden min-h-[400px] sm:min-h-[480px] lg:min-h-[540px] bg-neutral-950 shadow-md group">
            {/* Full-Bleed Photograph */}
            <img
              src="/assets/bikes/family-pro-x3.jpg"
              alt="Kinetic E-Luna PRO X3"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Gradient Overlays for High-Contrast Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/35 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent pointer-events-none" />

            {/* Top-Left: Model Name & Frosted Glass Tag */}
            <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-10 flex flex-col items-start">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
                Kinetic E-Luna PRO X3
              </h3>
              <span className="mt-2.5 inline-flex items-center px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-normal border border-white/20 tracking-wide">
                Make life look easy
              </span>
            </div>

            {/* Bottom-Left: Pricing & Action Buttons */}
            <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 z-10 flex flex-col items-start space-y-3">
              <div>
                <span className="text-xs sm:text-sm text-white/80 block font-normal">
                  Prices starting at
                </span>
                <span className="text-base sm:text-lg lg:text-xl font-medium text-white tracking-tight mt-0.5 block">
                  ₹ 69 990 or ₹ 2 199/m
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => onBookModel("Kinetic E-Luna PRO X3")}
                  className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-sm"
                >
                  Test ride
                </button>
                <button
                  onClick={() => onExploreModel("Kinetic E-Luna PRO X3")}
                  className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/25 font-medium text-xs sm:text-sm transition-all duration-200 active:scale-95"
                >
                  Explore PRO X3
                </button>
              </div>
            </div>
          </div>

          {/* Bottom 2 Split Cards (Ather 450 & Ather Rizta Style - Center Aligned) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Card 2: Bottom-Left Card (E-Luna Commercial Cargo - Ather 450 style) */}
            <div className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] bg-neutral-950 shadow-md group">
              {/* Full-Bleed Photograph */}
              <img
                src="/assets/bikes/family-cargo.jpg"
                alt="E-Luna Commercial Cargo"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay for Centered Content Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40 pointer-events-none" />

              {/* Top-Center: Model Name & Frosted Glass Tag */}
              <div className="absolute top-6 inset-x-6 sm:top-10 sm:inset-x-10 z-10 flex flex-col items-center text-center">
                <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight text-center">
                  E-Luna Commercial Cargo
                </h3>
                <span className="mt-2.5 inline-flex items-center px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-normal border border-white/20 tracking-wide">
                  150 kg Heavy Payload
                </span>
              </div>

              {/* Bottom-Center: Pricing & Action Buttons */}
              <div className="absolute bottom-6 inset-x-6 sm:bottom-10 sm:inset-x-10 z-10 flex flex-col items-center text-center space-y-3">
                <div className="text-center">
                  <span className="text-xs sm:text-sm text-white/80 block font-normal">
                    Prices starting at
                  </span>
                  <span className="text-base sm:text-lg font-medium text-white tracking-tight mt-0.5 block">
                    ₹ 74 990 or ₹ 2 349/m
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => onBookModel("Commercial Cargo")}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    Test Ride
                  </button>
                  <button
                    onClick={() => onExploreModel("Commercial Cargo")}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/25 font-medium text-xs sm:text-sm transition-all duration-200 active:scale-95"
                  >
                    Explore Cargo
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Bottom-Right Card (E-Luna City Commuter - Ather Rizta style) */}
            <div className="relative w-full rounded-[28px] sm:rounded-[36px] overflow-hidden min-h-[440px] sm:min-h-[500px] lg:min-h-[540px] bg-neutral-950 shadow-md group">
              {/* Full-Bleed Photograph */}
              <img
                src="/assets/bikes/family-commuter.jpg"
                alt="E-Luna City Commuter"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay for Centered Content Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40 pointer-events-none" />

              {/* Top-Center: Model Name & Frosted Glass Tag */}
              <div className="absolute top-6 inset-x-6 sm:top-10 sm:inset-x-10 z-10 flex flex-col items-center text-center">
                <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight text-center">
                  E-Luna City Commuter
                </h3>
                <span className="mt-2.5 inline-flex items-center px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-normal border border-white/20 tracking-wide">
                  Made for your family
                </span>
              </div>

              {/* Bottom-Center: Pricing & Action Buttons */}
              <div className="absolute bottom-6 inset-x-6 sm:bottom-10 sm:inset-x-10 z-10 flex flex-col items-center text-center space-y-3">
                <div className="text-center">
                  <span className="text-xs sm:text-sm text-white/80 block font-normal">
                    Prices starting at
                  </span>
                  <span className="text-base sm:text-lg font-medium text-white tracking-tight mt-0.5 block">
                    ₹ 64 990 or ₹ 1 999/m
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => onBookModel("City Commuter")}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-950 font-semibold text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    Test Ride
                  </button>
                  <button
                    onClick={() => onExploreModel("City Commuter")}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/25 font-medium text-xs sm:text-sm transition-all duration-200 active:scale-95"
                  >
                    Explore Commuter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
