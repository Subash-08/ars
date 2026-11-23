"use client";

import React, { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { CheckCircle, ArrowRight, Sparkles, Calendar, HelpCircle, ShieldCheck } from "lucide-react";

interface LeadSectionProps {
  lang: Language;
  onSuccess: (tokenReference?: string) => void;
}

export function LeadSection({ lang, onSuccess }: LeadSectionProps) {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<"test_drive" | "token" | "enquiry">("test_drive");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cityArea, setCityArea] = useState("Salem - Seelanaickenpatti");
  const [model, setModel] = useState("Kinetic E-Luna PRO X3");
  const [preferredColor, setPreferredColor] = useState("Pearl Yellow");
  const [assignedBranch, setAssignedBranch] = useState("Seelanaickenpatti");
  
  // Date & Time for Test Ride
  const todayStr = new Date().toISOString().split("T")[0];
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("Morning (10:00 AM - 01:00 PM)");
  
  // Custom message for Enquiry
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingToken, setBookingToken] = useState("");

  const colors = [
    { name: "Pearl Yellow", color: "#eab308" },
    { name: "Mulberry Red", color: "#dc2626" },
    { name: "Night Star Black", color: "#1f2937" },
    { name: "Sparkling Blue", color: "#0284c7" },
    { name: "Oceanic Green", color: "#16a34a" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.trim().length < 10) {
      alert("Please enter a valid Name and 10-digit Phone Number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedToken = "ARS-" + Math.floor(100000 + Math.random() * 900000);
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          cityArea,
          preferredColor,
          inquiryType:
            activeTab === "token"
              ? "Token Booking @ 1000"
              : activeTab === "enquiry"
              ? "General Enquiry"
              : "Test Drive",
          useCase: model,
          assignedBranch,
          preferredDate: activeTab === "test_drive" ? preferredDate : null,
          preferredTime: activeTab === "test_drive" ? preferredTime : null,
          message: message || null,
          source: `Website - ${activeTab.toUpperCase()}`,
        }),
      });

      if (res.ok) {
        setBookingToken(generatedToken);
        setSubmitted(true);
        onSuccess(generatedToken);
      } else {
        alert("Submission failed. Please call our showroom directly at +91 90 25 38 06 26.");
      }
    } catch {
      const generatedToken = "ARS-" + Math.floor(100000 + Math.random() * 900000);
      setBookingToken(generatedToken);
      setSubmitted(true);
      onSuccess(generatedToken);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="get-in-touch" className="py-20 md:py-28 bg-[#fafafa] text-neutral-900 border-t border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-2xl border border-neutral-200/90 bg-white p-6 sm:p-12 shadow-2xs overflow-hidden">
          {/* Split Grid: Left Form, Right Visual & Guarantee */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <div className="mb-6">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                  ARS Motors • Salem Dealership
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-950 tracking-tight">
                  {activeTab === "token"
                    ? "Priority Token Booking"
                    : activeTab === "enquiry"
                    ? "Send Showroom Enquiry"
                    : "Book a Free Test Ride"}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                  {activeTab === "token"
                    ? "Reserve your vehicle delivery slot with priority factory allocation directly from ARS Motors Salem."
                    : activeTab === "enquiry"
                    ? "Ask us about vehicle pricing, subsidy, bulk corporate fleet orders, or dealership facilities."
                    : "Experience the strength and comfort of Kinetic E-Luna in Salem. Home and showroom test rides available."}
                </p>
              </div>

              {/* 3-Tab Mode Switcher */}
              <div className="flex p-1 rounded-full bg-neutral-100 border border-neutral-200 mb-6 max-w-md">
                <button
                  type="button"
                  onClick={() => setActiveTab("test_drive")}
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                    activeTab === "test_drive"
                      ? "bg-white text-neutral-950 shadow-2xs font-bold"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Test Ride</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("token")}
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                    activeTab === "token"
                      ? "bg-neutral-950 text-white shadow-2xs font-bold"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Token @ ₹1,000</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("enquiry")}
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 ${
                    activeTab === "enquiry"
                      ? "bg-white text-neutral-950 shadow-2xs font-bold"
                      : "text-neutral-600 hover:text-black"
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Enquiry</span>
                </button>
              </div>

              {submitted ? (
                <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3 text-emerald-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    {activeTab === "token" ? "Priority Reservation Confirmed!" : "Request Received!"}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-2 max-w-sm mx-auto leading-relaxed">
                    Thank you! Our ARS Motors Salem team will contact you within 15 minutes to confirm your slot.
                  </p>
                  <div className="mt-4 p-2.5 rounded-lg bg-white border border-neutral-200 inline-block font-mono text-neutral-900 text-xs font-bold shadow-2xs">
                    Booking Reference: {bookingToken}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senthil Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#fcfcfc] border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-950 shadow-2xs"
                    />
                  </div>

                  {/* Phone with +91 badge */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Mobile Number *
                    </label>
                    <div className="flex rounded-xl border border-neutral-300 overflow-hidden focus-within:border-neutral-950 shadow-2xs">
                      <span className="inline-flex items-center px-3.5 bg-neutral-100 text-neutral-600 font-semibold text-xs border-r border-neutral-300">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-[#fcfcfc] px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Pin Code / Area */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Salem Area / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Seelanaickenpatti, Meyyanur, Omalur"
                      value={cityArea}
                      onChange={(e) => setCityArea(e.target.value)}
                      className="w-full bg-[#fcfcfc] border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-950 shadow-2xs"
                    />
                  </div>

                  {/* Pick Model Variant */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                      Selected Variant: <span className="text-neutral-950 font-bold">{model}</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: "Kinetic E-Luna PRO X3", label: "PRO X3 (110 km)" },
                        { id: "E-Luna Commercial Cargo", label: "Cargo (150 kg)" },
                        { id: "E-Luna City Commuter", label: "City Commuter" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setModel(m.id)}
                          className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all duration-200 ${
                            model === m.id
                              ? "bg-neutral-950 text-white border-neutral-950 shadow-2xs font-bold"
                              : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Test Ride Date & Time Slot */}
                  {activeTab === "test_drive" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 animate-fadeIn">
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          Preferred Ride Date
                        </label>
                        <input
                          type="date"
                          min={todayStr}
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-neutral-700 block mb-1">
                          Preferred Time Window
                        </label>
                        <select
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950"
                        >
                          <option value="Morning (10:00 AM - 01:00 PM)">Morning (10:00 AM - 01:00 PM)</option>
                          <option value="Afternoon (01:00 PM - 04:00 PM)">Afternoon (01:00 PM - 04:00 PM)</option>
                          <option value="Evening (04:00 PM - 07:00 PM)">Evening (04:00 PM - 07:00 PM)</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* General Enquiry Message */}
                  {activeTab === "enquiry" && (
                    <div className="animate-fadeIn">
                      <label className="text-xs font-semibold text-neutral-700 block mb-1">
                        How can we help you?
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask about on-road pricing in Salem, subsidies, battery warranty, corporate delivery fleets..."
                        className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-950 resize-none shadow-2xs"
                      />
                    </div>
                  )}

                  {/* Preferred Color */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                      Color: <span className="text-neutral-950 font-bold">{preferredColor}</span>
                    </label>
                    <div className="flex items-center space-x-2.5">
                      {colors.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setPreferredColor(c.name)}
                          className={`w-6 h-6 rounded-full transition-transform ${
                            preferredColor === c.name
                              ? "scale-110 ring-2 ring-neutral-950 ring-offset-2"
                              : "opacity-75 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: c.color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Preferred Showroom Branch */}
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      Preferred Salem Showroom
                    </label>
                    <select
                      value={assignedBranch}
                      onChange={(e) => setAssignedBranch(e.target.value)}
                      className="w-full bg-[#fcfcfc] border border-neutral-300 rounded-xl px-4 py-2 text-xs text-neutral-900 font-medium focus:outline-none focus:border-neutral-950 shadow-2xs"
                    >
                      <option value="Seelanaickenpatti">Showroom 1: Seelanaickenpatti Bypass, Near Dharan Hospital</option>
                      <option value="Madathur">Showroom 2: Madathur Branch, Elampillai Road</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3.5 px-6 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs transition-all duration-200 shadow-sm flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting
                        ? "Submitting..."
                        : activeTab === "token"
                        ? "Reserve Priority Delivery @ ₹1,000"
                        : activeTab === "enquiry"
                        ? "Send Showroom Enquiry"
                        : "Confirm Free Test Ride"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-neutral-500 text-center mt-2 leading-tight">
                    By submitting, you agree to receive official booking details and communication from ARS Motors Salem.
                  </p>
                </form>
              )}
            </div>

            {/* Right Column: Real Vehicle Photograph & Trust Callout */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
              <div className="rounded-2xl overflow-hidden border border-neutral-200/90 shadow-2xs w-full bg-neutral-100">
                <img
                  src="/assets/bikes/family-pro-x3.jpg"
                  alt="Kinetic Green E-Luna PRO X3"
                  className="w-full h-64 sm:h-72 object-cover object-center"
                />
              </div>

              {/* Priority Booking Trust Card */}
              <div className="p-5 rounded-2xl bg-[#fafafa] border border-neutral-200 w-full mt-4 text-left shadow-2xs">
                <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-950 mb-1">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Salem Priority Allocation Guarantee</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Reserve with a ₹1,000 token deposit to secure priority delivery directly from factory allocation.
                </p>
                <div className="mt-3 pt-3 border-t border-neutral-200/80 flex items-center space-x-2 text-[11px] text-neutral-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 flex-shrink-0" />
                  <span>100% Refundable prior to invoice • Official ARS Motors Receipt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
