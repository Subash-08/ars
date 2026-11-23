"use client";

import React, { useState } from "react";
import { translations, Language } from "@/lib/translations";
import {
  ShieldCheck,
  SunMedium,
  Gauge,
  AlertTriangle,
  PackageCheck,
  Shield,
  Lock,
  Disc,
  Anchor,
  Users,
  Layers,
  Activity,
  CircleDot,
  ShieldAlert,
  SmartphoneCharging,
  Check,
} from "lucide-react";

interface FeaturesGridProps {
  lang: Language;
}

export function FeaturesGrid({ lang }: FeaturesGridProps) {
  const t = translations[lang];
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // 15 Battle-Tested Engineering Features matching ARS Motors Official Specifications
  const features = [
    {
      id: 1,
      icon: ShieldCheck,
      title: "Sturdy Tubular Steel Chassis",
      category: "Chassis & Frame",
      spec: "150 kg Payload Capacity",
      desc: "All-metal heavy-duty tubular steel frame engineered to carry up to 150 kg payload across rugged Indian roads with anti-corrosion coating.",
    },
    {
      id: 2,
      icon: SunMedium,
      title: "High-Focus LED Headlamp",
      category: "Electrical & Tech",
      spec: "Long-Throw Projector Beam",
      desc: "High-intensity LED projector headlight providing superior night road visibility with ultra-low battery consumption and daytime running light.",
    },
    {
      id: 3,
      icon: Gauge,
      title: "Digital LCD Instrument Cluster",
      category: "Electrical & Tech",
      spec: "Speed • Battery SoC • Odometer",
      desc: "High-contrast digital instrument cluster showing real-time speed, battery state-of-charge percentage, trip meter, and diagnostic indicators.",
    },
    {
      id: 4,
      icon: AlertTriangle,
      title: "Side Stand Cut-Off Sensor",
      category: "Safety & Security",
      spec: "Smart Motor Inhibitor",
      desc: "Intelligent electronic safety inhibitor that prevents accidental throttle activation while the parking side stand is engaged.",
    },
    {
      id: 5,
      icon: PackageCheck,
      title: "Spacious Front Luggage Deck",
      category: "Utility & Cargo",
      spec: "Flat Cargo Reinforced Deck",
      desc: "Extra-wide, reinforced flat floorboard deck specifically designed to easily transport LPG cylinders, delivery cartons, and grocery sacks.",
    },
    {
      id: 6,
      icon: Shield,
      title: "Protective Rear Saree Guard",
      category: "Safety & Security",
      spec: "Factory-Fitted Steel Barrier",
      desc: "All-weather factory-fitted steel safety barrier preventing loose garments and sarees from contacting the rear wheel and hub motor assembly.",
    },
    {
      id: 7,
      icon: Lock,
      title: "Anti-Theft Wheel Safety Lock",
      category: "Safety & Security",
      spec: "Mechanical Drive Wheel Lock",
      desc: "Integrated mechanical security lock providing physical tamper protection and parking peace of mind in busy market and street locations.",
    },
    {
      id: 8,
      icon: Disc,
      title: "Combi Braking System (CBS)",
      category: "Safety & Security",
      spec: "Dual-Wheel Synchronized",
      desc: "Linked dual-wheel braking system that balances front and rear brake force simultaneously to prevent wheel skidding on wet roads.",
    },
    {
      id: 9,
      icon: Anchor,
      title: "Dual Utility Frame Hooks",
      category: "Utility & Cargo",
      spec: "Reinforced Grocery Clamps",
      desc: "Sturdy central frame hooks engineered to hold heavy grocery bags, milk can handles, and everyday personal shopping securely.",
    },
    {
      id: 10,
      icon: Users,
      title: "Ergonomic Pillion Grab Rail",
      category: "Chassis & Frame",
      spec: "High-Tensile Passenger Bar",
      desc: "Heavy-gauge tubular pillion grab bar offering a solid, comfortable grip and enhanced safety for rear passengers across bumps.",
    },
    {
      id: 11,
      icon: Layers,
      title: "Detachable Split Rear Cargo Seat",
      category: "Utility & Cargo",
      spec: "60-Second Quick-Release",
      desc: "Unbolts in under 60 seconds to transform the pillion section into an expansive flat steel carrier bed for delivery boxes and milk cans.",
    },
    {
      id: 12,
      icon: Activity,
      title: "Telescopic Front Suspension",
      category: "Chassis & Frame",
      spec: "Twin Hydraulic Damper Forks",
      desc: "Heavy-duty twin telescopic hydraulic front forks designed to absorb speed breakers and potholes smoothly across urban and rural Salem roads.",
    },
    {
      id: 13,
      icon: CircleDot,
      title: "Large 16-Inch Multi-Spoke Wheels",
      category: "Chassis & Frame",
      spec: "170 mm High Ground Clearance",
      desc: "High-diameter rugged 16-inch multi-spoke wheels delivering superior ground clearance and high stability over rough terrain and flooded roads.",
    },
    {
      id: 14,
      icon: ShieldAlert,
      title: "Heavy-Duty Front Crash Guard",
      category: "Safety & Security",
      spec: "Tubular Steel Leg Shield",
      desc: "Reinforced front tubular steel leg protector shielding both the vehicle frame and rider during heavy commercial delivery operations.",
    },
    {
      id: 15,
      icon: SmartphoneCharging,
      title: "Weatherproof 5V USB Charging Port",
      category: "Electrical & Tech",
      spec: "5V / 2A Fast Smartphone Charge",
      desc: "Weatherproof rubber-sealed fast-charging USB port to keep delivery rider smartphones, POS machines, and GPS navigation powered all day.",
    },
  ];

  const categories = ["All", "Chassis & Frame", "Safety & Security", "Utility & Cargo", "Electrical & Tech"];

  const filtered = activeCategory === "All"
    ? features
    : features.filter((f) => f.category === activeCategory);

  return (
    <section id="features" className="py-20 md:py-28 bg-[#fafafa] text-neutral-900 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-2">
            Engineering Highlights
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-neutral-950 tracking-tight">
            15 Purpose-Built Engineering Features
          </h2>
          <p className="mt-2 text-neutral-600 text-sm sm:text-base leading-relaxed">
            Battle-tested for Indian roads. Genuine certified engineering components built into every Kinetic E-Luna.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-neutral-950 text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:text-black border border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {filtered.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="rounded-2xl bg-white border border-neutral-200/80 p-5 shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 border border-neutral-200 group-hover:bg-neutral-950 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-mono">
                      #{feat.id.toString().padStart(2, "0")}
                    </span>
                  </div>

                  {/* Title & Certified Spec */}
                  <h3 className="text-sm font-semibold text-neutral-950 group-hover:text-black transition-colors leading-snug">
                    {feat.title}
                  </h3>
                  <div className="mt-1 text-[11px] font-mono font-medium text-emerald-700">
                    {feat.spec}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-600 mt-2.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
                    {feat.category}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
