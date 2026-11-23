"use client";

import React, { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { FileText, X, CheckCircle, Download } from "lucide-react";

interface BrochureModalProps {
  lang: Language;
}

export function BrochureModal({ lang }: BrochureModalProps) {
  const t = translations[lang];

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
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
          inquiryType: "Brochure Download",
          source: "Brochure Modal",
        }),
      });
      setDownloaded(true);
    } catch {
      setDownloaded(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button in Page */}
      <div className="flex justify-center my-8">
        <button
          onClick={() => {
            setIsOpen(true);
            setDownloaded(false);
          }}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 font-bold text-xs border border-neutral-300 shadow-sm transition-all active:scale-95"
        >
          <FileText className="w-4 h-4 text-neutral-800" />
          <span>{t.brochureBtn}</span>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl p-6 sm:p-8 bg-white text-neutral-900 border border-neutral-200 shadow-2xl animate-scaleUp">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {downloaded ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black text-neutral-900">
                  Download Ready!
                </h4>
                <p className="text-xs text-neutral-600 mt-2">
                  The official Kinetic E-Luna specifications and Salem showroom price sheet has been prepared for you.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-6 px-6 py-2.5 rounded-full bg-neutral-950 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
                  {t.brochureModalTitle}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 mb-6">
                  {t.brochureModalSub}
                </p>

                <form onSubmit={handleDownload} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      {t.labelName} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Saravanan K"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-2xl px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">
                      WhatsApp Number *
                    </label>
                    <div className="flex rounded-2xl border border-neutral-300 overflow-hidden focus-within:border-neutral-900 transition-colors">
                      <span className="inline-flex items-center px-4 bg-neutral-50 text-neutral-600 font-bold text-sm border-r border-neutral-300">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-white px-4 py-3 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-3.5 px-6 rounded-full bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-xs transition-all shadow-sm flex items-center justify-center space-x-2 active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isSubmitting ? "Generating..." : "Download PDF Now"}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
