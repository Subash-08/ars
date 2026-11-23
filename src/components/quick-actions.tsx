"use client";

import React from "react";
import { translations, Language } from "@/lib/translations";
import { Bike, GitCompare, MapPin, Calculator, CreditCard, Sparkles } from "lucide-react";

interface QuickActionsProps {
  lang: Language;
  onNavigate: (sectionId: string) => void;
}

export function QuickActions({ lang, onNavigate }: QuickActionsProps) {
  const t = translations[lang];

  const actions = [
    {
      id: "get-in-touch",
      icon: Bike,
      title: "Test Ride",
      badge: "Free",
    },
    {
      id: "specs-matrix",
      icon: GitCompare,
      title: "Specifications",
      badge: null,
    },
    {
      id: "showrooms",
      icon: MapPin,
      title: "Salem Showrooms",
      badge: "2 Locations",
    },
    {
      id: "savings-calculator",
      icon: Calculator,
      title: "Fuel Savings",
      badge: "Save ₹56k/yr",
    },
    {
      id: "emi-calculator",
      icon: CreditCard,
      title: "EMI Calculator",
      badge: "₹2,199/m",
    },
  ];

  return (
    <div className="relative z-20 py-4 sm:py-6 bg-white border-b border-neutral-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating Minimalist Automotive Dock */}
        <div className="bg-[#f7f8fa] rounded-2xl p-2 sm:p-2.5 border border-neutral-200/80 shadow-xs max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {actions.map((act) => {
              const Icon = act.icon;
              return (
                <button
                  key={act.id}
                  onClick={() => onNavigate(act.id)}
                  className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200/70 hover:border-neutral-300 transition-all duration-200 text-left group active:scale-95 shadow-2xs"
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800 group-hover:bg-neutral-900 group-hover:text-white transition-colors flex-shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-800 group-hover:text-neutral-950 truncate">
                      {act.title}
                    </span>
                  </div>
                  {act.badge && (
                    <span className="hidden xl:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-mono">
                      {act.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
