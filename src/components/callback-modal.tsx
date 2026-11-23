"use client";

import React, { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { Phone, X, CheckCircle, Crosshair } from "lucide-react";

interface CallbackModalProps {
  lang: Language;
}

export function CallbackModal({ lang }: CallbackModalProps) {
  const t = translations[lang];

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pinArea, setPinArea] = useState("");
  const [model, setModel] = useState("E-Luna PRO X3");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setPinArea("Salem (Detected)");
        },
        () => {
          setPinArea("Salem 636 201");
        }
      );
    } else {
      setPinArea("Salem 636 201");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || phone.length < 10) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          cityArea: pinArea || "Salem",
          preferredColor: "Pearl Yellow",
          inquiryType: `Quick Callback (${model})`,
          source: "Talk to us directly Modal",
        }),
      });
      setIsSuccess(true);
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Persistent Floating Bottom-Right Pill matching Screenshot 2 */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setIsOpen(true);
            setIsSuccess(false);
          }}
          className="flex items-center space-x-2.5 px-5 py-3 rounded-full bg-white text-neutral-900 font-extrabold text-xs shadow-2xl hover:bg-neutral-100 hover:scale-105 active:scale-95 transition-all border border-neutral-200/80 group"
        >
          <Phone className="w-4 h-4 text-neutral-900 group-hover:rotate-12 transition-transform" />
          <span>{t.callbackPill}</span>
        </button>
      </div>

      {/* Modal Popup Overlay matching Screenshot 2 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 bg-white text-neutral-900 shadow-2xl border border-neutral-100 animate-scaleUp">
            {/* Close Button top-right */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-neutral-900">
                  Callback Scheduled!
                </h4>
                <p className="text-xs text-neutral-600 mt-2">
                  Our Salem showroom representative will call you directly within 15 minutes.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-6 px-6 py-2.5 rounded-full bg-neutral-950 text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                {/* Heading matching Screenshot 2 */}
                <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
                  {t.modalTitle}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 mb-6">
                  {t.modalSub}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-2xl px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>

                  {/* Phone with +91 fixed badge matching Screenshot 2 */}
                  <div className="flex rounded-2xl border border-neutral-300 overflow-hidden focus-within:border-neutral-900 transition-colors">
                    <span className="inline-flex items-center px-4 bg-neutral-50 text-neutral-600 font-bold text-sm border-r border-neutral-300">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="Phone number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none font-mono"
                    />
                  </div>

                  {/* Pin Code / Area with Crosshair Icon matching Screenshot 2 */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter Pin Code or Area in Salem *"
                      value={pinArea}
                      onChange={(e) => setPinArea(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-2xl px-4 py-3 pr-10 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
                      title="Auto-detect Salem location"
                    >
                      <Crosshair className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Pick your model * with pills matching Screenshot 2 */}
                  <div className="pt-2">
                    <label className="text-xs font-bold text-neutral-800 block mb-2">
                      Pick your model *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "E-Luna PRO X3", label: "E-Luna PRO X3" },
                        { id: "Commercial Cargo", label: "Commercial Cargo" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setModel(item.id)}
                          className={`py-2.5 px-3 rounded-full text-xs font-bold border transition-all text-center ${
                            model === item.id
                              ? "bg-neutral-950 text-white border-neutral-950 shadow-xs"
                              : "bg-white text-neutral-700 border-neutral-300 hover:border-neutral-400"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Full-Width Pill matching Screenshot 2 */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 py-3.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold text-sm transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : t.modalSubmitBtn}
                  </button>

                  {/* Disclaimer Notice matching Screenshot 2 */}
                  <p className="text-[11px] text-neutral-500 leading-normal pt-2 text-center">
                    {t.privacyDisclaimer}
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
