"use client";

import { Dialog } from "./dialog";
import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { translations, Language } from "@/lib/translations";
import {
  RotateCcw,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Compass,
  Check,
  X,
  Layers,
  Sparkles,
  Box,
  Image as ImageIcon,
} from "lucide-react";
import type { VariantType, TimeOfDay } from "./eluna-3d-canvas";

const Eluna3DCanvas = dynamic(
  () => import("./eluna-3d-canvas").then((mod) => mod.Eluna3DCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-3" />
        <span className="text-xs text-neutral-500 font-mono tracking-wider">
          LOADING 3D STUDIO...
        </span>
      </div>
    ),
  }
);

interface Viewer360Props {
  fixedVariant?: VariantType;
  embedded?: boolean;
  lang: Language;
}

type StudioViewMode = "3d_model" | "photo_turntable";

export function Viewer360({ lang, fixedVariant, embedded }: Viewer360Props) {
  const t = translations[lang];

  // Configurator States
  const [viewMode, setViewMode] = useState<StudioViewMode>("3d_model");
  const [variant, setVariant] = useState<VariantType>(fixedVariant ?? "pro_x3");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [resetKey,setResetKey]=useState(0);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // 360 Degree Turntable Angle & Drag
  const [rotationAngle, setRotationAngle] = useState(45); // 0 to 360 degrees
  const [isAutoRotate, setIsAutoRotate] = useState(false);

  // Turntable Drag for Photo Mode
  const [isPhotoDragging, setIsPhotoDragging] = useState(false);
  const [photoStartX, setPhotoStartX] = useState(0);

  // 5 Signature Metallic Finishes for Kinetic E-Luna
  const colors = [
    {
      id: "blue",
      name: "Ocean Blue",
      hex: "#0ea5e9",
      accent: "#38bdf8",
      photo: "/assets/bikes/eluna-official-render.jpg", // User uploaded reference photo!
      tagline: "Signature Ocean Blue Frame",
    },
    {
      id: "yellow",
      name: "Pearl Yellow",
      hex: "#eab308",
      accent: "#facc15",
      photo: "/assets/bikes/google_real/yellow.jpg",
      tagline: "Metallic Pearl Yellow",
    },
    {
      id: "red",
      name: "Mulberry Red",
      hex: "#dc2626",
      accent: "#ef4444",
      photo: "/assets/bikes/google_real/red.jpg",
      tagline: "Sport Mulberry Red",
    },
    {
      id: "black",
      name: "Night Star Black",
      hex: "#18181b",
      accent: "#3f3f46",
      photo: "/assets/bikes/google_real/black.jpg",
      tagline: "Gloss Night Star Black",
    },
    {
      id: "green",
      name: "Sparkling Green",
      hex: "#16a34a",
      accent: "#22c55e",
      photo: "/assets/bikes/google_real/green.jpg",
      tagline: "Eco Sparkling Green",
    },
  ];

  const [selectedColor, setSelectedColor] = useState(colors[0]); // Default to Ocean Blue as in uploaded photo!

  // Variant Data & Specs
  const variantData = {
    pro_x3: {
      id: "pro_x3",
      name: "Kinetic E-Luna PRO X3",
      badge: "Flagship 110 km",
      price: "₹69,990*",
      range: "110 km",
      speed: "50 km/h",
      payload: "150 kg",
      battery: "2.3 kWh Li-ion",
      hasColors: true,
      features: [
        {
          id: "motor",
          name: "1.2 kW BLDC Hub Motor",
          spec: "Instant High Torque • 50 km/h",
          desc: "Weatherproof in-wheel motor engineered for steep flyovers and heavy payload hauling.",
        },
        {
          id: "battery",
          name: "2.3 kWh Li-ion Battery",
          spec: "Battery specification to confirm • Confirm range for configuration",
          desc: "Advanced NMC cell pack with multi-stage smart BMS and standard 3-pin home charging.",
        },
        {
          id: "chassis",
          name: "Signature Continuous Loop Frame",
          spec: "150 kg Certified Commercial Payload",
          desc: "Reinforced all-steel backbone with distinctive wrap-around colored subframe.",
        },
        {
          id: "brakes",
          name: "Combi Braking System (CBS)",
          spec: "Dual Drum CBS with Synchronized Stop",
          desc: "Front & rear balanced braking for maximum control on wet Salem roads.",
        },
        {
          id: "seat_cargo",
          name: "Dual Split Seating with Grab Rail",
          spec: "Comfort Split Saddle with Ergonomic Pillion Rail",
          desc: "Ergonomic memory foam cushion with tool-free detachable rear seat.",
        },
      ],
    },
    cargo: {
      id: "cargo",
      name: "E-Luna Commercial Cargo",
      badge: "Commercial Workhorse",
      price: "₹74,990*",
      range: "100 km",
      speed: "50 km/h",
      payload: "150 kg",
      battery: "2.3 kWh Li-ion",
      hasColors: false,
      features: [
        {
          id: "seat_cargo",
          name: "Flat Steel Cargo Carrier Bed",
          spec: "Mounts Delivery Crates, Parcel Bags & Milk Cans",
          desc: "High-load flatbed rack with tie-down anchor hooks and dual side logistics racks.",
        },
        {
          id: "motor",
          name: "1.2 kW Heavy-Duty BLDC Motor",
          spec: "Hill Assist & Commercial Grade Torque",
          desc: "Tuned for continuous commercial duty cycles across Salem market routes.",
        },
        {
          id: "chassis",
          name: "Reinforced Commercial Frame",
          spec: "150 kg Heavy Payload Rating",
          desc: "Heavy-duty steel chassis engineered for grocery, laundry, and e-commerce logistics.",
        },
        {
          id: "battery",
          name: "2.3 kWh Swappable/Portable Battery",
          spec: "Battery specification to confirm Enclosure",
          desc: "Charge inside your shop or warehouse via regular 15A wall socket.",
        },
        {
          id: "brakes",
          name: "Heavy-Load Combi Brakes",
          spec: "Reinforced Brake Shoes & CBS Lever",
          desc: "Progressive brake bite designed specifically for laden stop-and-go commercial routes.",
        },
      ],
    },
    commuter: {
      id: "commuter",
      name: "E-Luna City Commuter",
      badge: "Family & Daily Commute",
      price: "₹64,990*",
      range: "90 km",
      speed: "50 km/h",
      payload: "150 kg",
      battery: "1.7 kWh / 2.3 kWh",
      hasColors: true,
      features: [
        {
          id: "seat_cargo",
          name: "Comfort Dual Split Long Seats",
          spec: "Dual Padded Cushion & Integrated Saree Guard",
          desc: "Optimized ride ergonomics with safety footrest for pillion family members.",
        },
        {
          id: "motor",
          name: "Silent High-Efficiency Hub Motor",
          spec: "Instant Acceleration & Zero Noise",
          desc: "Smooth power delivery ideal for daily office commutes and school drop-offs.",
        },
        {
          id: "battery",
          name: "Smart Eco Lithium Battery",
          spec: "₹0.10 / km Ultra-Low Running Cost",
          desc: "Save up to ₹56,650 annually compared to petrol scooters.",
        },
        {
          id: "chassis",
          name: "Step-Through Steel Frame",
          spec: "Low Center of Gravity • Easy Step-Through",
          desc: "Effortless mounting for all age groups with spacious flat floorboard.",
        },
        {
          id: "brakes",
          name: "Dual Combi Brakes with Side Stand Cutoff",
          spec: "CBS + Electronic Motor Cutoff Sensor",
          desc: "Prevents accidental throttle input while parked on side stand.",
        },
      ],
    },
  };

  const currentVariant = variantData[variant];

  useEffect(() => { const exit=(event:KeyboardEvent)=>{if(event.key==="Escape")setIsFullscreen(false);}; window.addEventListener("keydown",exit);return()=>window.removeEventListener("keydown",exit); },[]);

  // Reset View to Default Orientation
  const handleResetView = () => {
    setResetKey(key=>key+1);
    setRotationAngle(45);
    setIsAutoRotate(false);
    setActiveHotspot(null);
  };

  const anglePresets = [
    { label: "0° Front", angle: 0 },
    { label: "45° Dynamic", angle: 45 },
    { label: "90° Profile", angle: 90 },
    { label: "135° Cargo", angle: 135 },
    { label: "180° Rear", angle: 180 },
  ];

  const currentHotspot = currentVariant.features.find((f) => f.id === activeHotspot);

  const scrollToBooking = () => {
    window.location.assign(`/book-test-ride?model=${encodeURIComponent(variantData[variant].name)}&color=${encodeURIComponent(selectedColor.name)}`);
  };

  // Get photo for Photo Turntable Mode
  const getPhotoForAngle = () => {
    if (variant === "cargo") {
      return "/assets/bikes/google_real/cargo.jpg";
    }
    if (variant === "commuter") {
      return "/assets/bikes/google_real/commuter.jpg";
    }
    // For PRO X3, return the official studio render of the selected color!
    return selectedColor.photo;
  };

  // Drag handlers for Photo Turntable mode
  const handlePhotoPointerDown = (e: React.PointerEvent) => {
    setIsPhotoDragging(true);
    setPhotoStartX(e.clientX);
    setIsAutoRotate(false);
  };

  const handlePhotoPointerMove = (e: React.PointerEvent) => {
    if (!isPhotoDragging) return;
    const deltaX = e.clientX - photoStartX;
    setPhotoStartX(e.clientX);
    setRotationAngle((prev) => {
      const next = (prev - deltaX * 0.7) % 360;
      return next < 0 ? next + 360 : next;
    });
  };

  const handlePhotoPointerUp = () => {
    setIsPhotoDragging(false);
  };

  const handlePhotoWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setIsAutoRotate(false);
    const delta = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * 0.4;
    setRotationAngle((prev) => {
      const next = (prev + delta) % 360;
      return next < 0 ? next + 360 : next;
    });
  };

  const content = (
    <section
      id="interactive-studio"
      className={`${
        isFullscreen
          ? "fixed inset-0 z-50 w-full h-[100dvh] bg-neutral-950"
          : embedded ? "pb-14 sm:pb-20 text-neutral-900" : "py-16 md:py-24 bg-white text-neutral-900 border-t border-neutral-200"
      }`}
    >
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isFullscreen ? "h-full" : ""}`}>
        {!isFullscreen && !embedded && (
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500 block mb-2">
              Automotive Studio Experience
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-neutral-950 tracking-tight">
              360° Studio Configurator
            </h2>
            <p className="mt-2 text-neutral-600 text-sm sm:text-base leading-relaxed">
              Explore the Kinetic E-Luna in 360°. Drag to rotate the illustrative model, choose colours and explore the details. Product photographs show fixed views.
            </p>
          </div>
        )}

        {/* ======================================================== */}
        {/* MAIN MINIMALIST AUTOMOTIVE STUDIO CYCLORAMA STAGE        */}
        {/* ======================================================== */}
        <div
          className={`relative w-full overflow-hidden select-none transition-colors duration-500 ${
            isFullscreen
              ? "w-full h-full"
              : "h-[620px] sm:h-[700px] md:h-[760px] rounded-3xl border border-neutral-200/90 shadow-sm"
          } ${
            timeOfDay === "day"
              ? "bg-gradient-to-b from-[#f8f9fb] via-[#f1f3f6] to-[#e4e7ec]"
              : "bg-gradient-to-b from-[#14161b] via-[#0d0e12] to-[#07080a] text-white"
          }`}
        >
          {/* Subtle Ambient Radial Lighting for True Automotive Depth */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              timeOfDay === "day"
                ? "bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.9)_0%,_transparent_75%)]"
                : "bg-[radial-gradient(ellipse_at_center,_rgba(30,41,59,0.5)_0%,_transparent_80%)]"
            }`}
          />

          {/* ======================================================== */}
          {/* TOP BAR: View Mode Switcher, Variant Pills, Controls     */}
          {/* ======================================================== */}
          <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex flex-wrap items-center justify-between gap-3 z-30 pointer-events-auto">
            {/* Left: View Mode Toggle (3D Interactive vs HD Studio) */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
              <div
                className={`p-1 rounded-full border shadow-2xs backdrop-blur-md flex items-center space-x-1 shrink-0 ${
                  timeOfDay === "day"
                    ? "bg-white/90 border-neutral-200"
                    : "bg-black/50 border-white/15"
                }`}
              >
                <button
                  onClick={() => setViewMode("3d_model")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    viewMode === "3d_model"
                      ? timeOfDay === "day"
                        ? "bg-neutral-950 text-white shadow-xs"
                        : "bg-white text-neutral-950 shadow-xs"
                      : timeOfDay === "day"
                      ? "text-neutral-600 hover:text-black"
                      : "text-white/70 hover:text-white"
                  }`}
                  title="Interactive illustrative vehicle model"
                >
                  <Box className="w-3.5 h-3.5 text-emerald-500" />
                  <span>3D Model</span>
                </button>

                <button
                  onClick={() => setViewMode("photo_turntable")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    viewMode === "photo_turntable"
                      ? timeOfDay === "day"
                        ? "bg-neutral-950 text-white shadow-xs"
                        : "bg-white text-neutral-950 shadow-xs"
                      : timeOfDay === "day"
                      ? "text-neutral-600 hover:text-black"
                      : "text-white/70 hover:text-white"
                  }`}
                  title="Product photographs, shown from fixed angles"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>Product Photos</span>
                </button>
              </div>

              {/* Model Variant Pills */}
              {!fixedVariant && <div
                className={`flex p-1 rounded-full border shadow-2xs backdrop-blur-md items-center space-x-1 ${
                  timeOfDay === "day"
                    ? "bg-white/90 border-neutral-200"
                    : "bg-black/50 border-white/15"
                }`}
              >
                {[
                  { id: "pro_x3", label: "PRO X3" },
                  { id: "cargo", label: "Cargo" },
                  { id: "commuter", label: "Commuter" },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setVariant(v.id as VariantType);
                      setActiveHotspot(null);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      variant === v.id
                        ? timeOfDay === "day"
                          ? "bg-neutral-950 text-white"
                          : "bg-white text-neutral-950"
                        : timeOfDay === "day"
                        ? "text-neutral-600 hover:text-black"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>}
            </div>

            {/* Center Angle HUD */}
            <div
              className={`hidden md:flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-mono backdrop-blur-md border shadow-2xs ${
                timeOfDay === "day"
                  ? "bg-white/80 border-neutral-200 text-neutral-800"
                  : "bg-black/50 border-white/15 text-white"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-bold">{Math.round(rotationAngle)}° 360°</span>
              <span className="text-neutral-400">•</span>
              <span className="font-sans font-medium truncate max-w-[200px]">
                {currentVariant.name}
              </span>
            </div>

            {/* Right: Studio Utility Controls */}
            <div className="flex items-center space-x-2">
              {/* Day / Night Toggle */}
              <button
                onClick={() => setTimeOfDay(timeOfDay === "day" ? "night" : "day")}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border shadow-2xs ${
                  timeOfDay === "day"
                    ? "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    : "bg-neutral-900 border-neutral-700 text-amber-300 hover:bg-neutral-800"
                }`}
                title={`Switch to ${timeOfDay === "day" ? "Night (Headlight ON)" : "Day"} Studio`}
              >
                {timeOfDay === "day" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              {/* Auto Spin Toggle */}
              <button
                onClick={() => {setViewMode("3d_model");setIsAutoRotate(!isAutoRotate);}}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all shadow-2xs ${
                  isAutoRotate
                    ? "bg-emerald-500 text-black border-emerald-500 font-bold"
                    : timeOfDay === "day"
                    ? "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    : "bg-neutral-900 border-neutral-700 text-white/90 hover:bg-neutral-800"
                }`}
              >
                {isAutoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isAutoRotate ? "Pause" : "Auto Spin 360°"}</span>
              </button>

              {/* Reset Angle */}
              <button
                onClick={handleResetView}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border shadow-2xs ${
                  timeOfDay === "day"
                    ? "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    : "bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800"
                }`}
                title="Reset Camera to 45°"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border shadow-2xs ${
                  timeOfDay === "day"
                    ? "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                    : "bg-neutral-900 border-neutral-700 text-white hover:bg-neutral-800"
                }`}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTER STAGE: 3D WEBGL MODEL OR HD TURNTABLE PHOTO       */}
          {/* ======================================================== */}
          <div className="absolute top-[156px] sm:top-[106px] bottom-[164px] sm:bottom-[116px] inset-x-0 z-10 flex items-center justify-center">
            {/* Turntable Pedestal Base under Vehicle */}
            <div
              className={`absolute bottom-[10%] sm:bottom-[9%] w-[75%] max-w-2xl h-24 sm:h-28 rounded-[100%] transition-all duration-700 pointer-events-none ${
                timeOfDay === "day"
                  ? "bg-gradient-to-t from-neutral-300 via-neutral-200 to-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.12)] border-2 border-white/80"
                  : "bg-gradient-to-t from-neutral-900 via-neutral-850 to-neutral-800 shadow-[0_20px_60px_rgba(0,0,0,0.7)] border-2 border-white/10"
              }`}
            >
              <div
                className={`absolute inset-1 rounded-[100%] border transition-colors ${
                  timeOfDay === "day"
                    ? "border-neutral-300/80"
                    : "border-emerald-500/30"
                }`}
              />
              <div className="absolute inset-x-12 top-6 bottom-4 rounded-[100%] bg-black/35 blur-xl pointer-events-none" />
            </div>

            {/* MODE 1: REAL THREE.JS 3D WEBGL CANVAS */}
            {viewMode === "3d_model" ? (
              <div className="relative w-full h-full">
                <Eluna3DCanvas
                  resetKey={resetKey}
                  variant={variant}
                  colorHex={selectedColor.hex}
                  colorName={selectedColor.name}
                  timeOfDay={timeOfDay}
                  targetAngle={rotationAngle}
                  isAutoRotate={isAutoRotate}
                  onAngleChange={(deg) => setRotationAngle(deg)}
                  activeHotspot={activeHotspot}
                  onHotspotClick={(id) => setActiveHotspot(activeHotspot === id ? null : id)}
                  onInteracted={() => setIsAutoRotate(false)}
                />

                {/* Floating Hint */}
                <div className="absolute top-1 inset-x-0 hidden sm:flex justify-center pointer-events-none z-20">
                  <div
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium backdrop-blur-md border shadow-xs transition-opacity duration-500 flex items-center space-x-1.5 ${
                      timeOfDay === "day"
                        ? "bg-white/80 border-neutral-200 text-neutral-600"
                        : "bg-black/50 border-white/15 text-neutral-300"
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>Drag to rotate · Arrow keys to rotate/zoom · Home to reset</span>
                  </div>
                </div>
              </div>
            ) : (
              /* MODE 2: HD PRODUCT STUDIO TURNTABLE (Matching User Reference Image) */
              <div





                className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
              >
                <div
                  className="relative w-full max-w-2xl h-full flex items-center justify-center transition-transform duration-75"
                  style={{
                    perspective: "1000px",
                    transform: "none",
                  }}
                >
                  <img
                    src={getPhotoForAngle()}
                    alt={`${currentVariant.name} in ${selectedColor.name}`}
                    style={{
                      mixBlendMode: timeOfDay === "day" ? "multiply" : "normal",
                    }}
                    className={`w-full max-h-[64%] sm:max-h-[72%] object-contain filter contrast-105 transition-all duration-300 ${
                      timeOfDay === "night"
                        ? "drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] brightness-95"
                        : "drop-shadow-lg"
                    }`}
                  />
                </div>

                {/* Floating Hint */}
                <div className="absolute top-1 inset-x-0 hidden sm:flex justify-center pointer-events-none z-20">
                  <div
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium backdrop-blur-md border shadow-xs transition-opacity duration-500 flex items-center space-x-1.5 ${
                      timeOfDay === "day"
                        ? "bg-white/80 border-neutral-200 text-neutral-600"
                        : "bg-black/50 border-white/15 text-neutral-300"
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span>Product photograph · Pick a colour below</span>
                  </div>
                </div>
              </div>
            )}

            {/* Active Hotspot Information Callout Card */}
            {currentHotspot && (
              <div
                className="absolute bottom-28 sm:bottom-32 left-4 sm:left-8 z-30 pointer-events-auto animate-fadeIn max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={`rounded-2xl p-4 shadow-xl border backdrop-blur-md ${
                    timeOfDay === "day"
                      ? "bg-white/95 border-neutral-200 text-neutral-900"
                      : "bg-neutral-900/95 border-neutral-700 text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center space-x-1">
                      <Layers className="w-3 h-3" />
                      <span>Component Highlight</span>
                    </span>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      className="text-neutral-400 hover:text-neutral-800 dark:hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="text-sm font-semibold">{currentHotspot.name}</h4>
                  <p className="text-xs font-mono font-medium text-emerald-600 mt-0.5">
                    {currentHotspot.spec}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    {currentHotspot.desc}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* BOTTOM BAR: Colors, Angle Presets, Scrub Slider, CTA     */}
          {/* ======================================================== */}
          <div className="absolute bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-8 z-30 pointer-events-auto">
            <div
              className={`rounded-2xl p-3 sm:p-4 border backdrop-blur-md shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                timeOfDay === "day"
                  ? "bg-white/95 border-neutral-200 text-neutral-900"
                  : "bg-black/60 border-white/15 text-white"
              }`}
            >
              {/* Left: Colorway Selector Pills */}
              <div className="flex items-center space-x-3">
                {currentVariant.hasColors ? (
                  <>
                    <span className="text-xs font-medium text-neutral-500 hidden sm:inline">
                      Color Finish:
                    </span>
                    <div className="flex items-center space-x-2">
                      {colors.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedColor(c)}
                          className={`w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center ${
                            selectedColor.id === c.id
                              ? "scale-110 ring-2 ring-neutral-950 dark:ring-white ring-offset-2"
                              : "opacity-80 hover:opacity-100 hover:scale-105"
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                          aria-pressed={selectedColor.id === c.id}
                        >
                          {selectedColor.id === c.id && (
                            <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                          )}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-semibold truncate max-w-[130px]">
                      {selectedColor.name}
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-neutral-500">
                    {variant === "cargo"
                      ? "Heavy Steel Commercial Cargo Finish"
                      : "Family Comfort Ocean Blue / Dual Tone"}
                  </span>
                )}
              </div>

              {/* Center: Angle Presets & 3D Scrubber Slider */}
              <div className="flex-1 max-w-md mx-auto w-full flex items-center space-x-2">
                <div className="hidden lg:flex items-center space-x-1">
                  {anglePresets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setViewMode("3d_model");setRotationAngle(preset.angle);
                        setIsAutoRotate(false);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                        Math.abs(((rotationAngle - preset.angle + 180) % 360) - 180) < 18
                          ? "bg-neutral-950 text-white dark:bg-white dark:text-black font-bold"
                          : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 flex items-center space-x-2">
                  <span className="text-[10px] font-mono text-neutral-400">0°</span>
                  <input
                    type="range" aria-label="Studio viewing angle"
                    min="0"
                    max="360"
                    value={Math.round(rotationAngle)}
                    onChange={(e) => {
                      setViewMode("3d_model");setRotationAngle(Number(e.target.value));
                      setIsAutoRotate(false);
                    }}
                    className="flex-grow accent-neutral-950 dark:accent-emerald-400 cursor-pointer h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none"
                  />
                  <span className="text-[10px] font-mono text-neutral-400">360°</span>
                </div>
              </div>

              {/* Right: Quick Action Buttons */}
              <div className="flex items-center space-x-2 self-end md:self-auto">
                <button
                  onClick={scrollToBooking}
                  className="px-5 py-2 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs transition-all active:scale-95 shadow-sm"
                >
                  Book Test Ride
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
  return isFullscreen ? <Dialog title="Fullscreen vehicle studio" onClose={()=>setIsFullscreen(false)}>{content}</Dialog> : content;
}
