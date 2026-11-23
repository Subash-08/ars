"use client";

import React, { useState } from "react";
import { translations, Language } from "@/lib/translations";
import { Megaphone, ArrowRight, Cookie, X, ShieldCheck, Lock, Check } from "lucide-react";

interface CautionAndCookieProps {
  lang: Language;
}

export function CautionBanner({ lang }: CautionAndCookieProps) {
  const t = translations[lang];

  return (
    <div className="bg-[#fef2f2] border-t border-rose-100 py-3 text-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-rose-900 font-semibold text-center sm:text-left">
          <Megaphone className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>
            <strong className="font-bold">Caution Notice:</strong> Beware of unauthorized brokers. Book your genuine Kinetic E-Luna only through ARS Motors, authorized Salem dealership.
          </span>
        </div>
        <a
          href="tel:9025380626"
          className="inline-flex items-center space-x-1 font-bold text-rose-700 hover:text-rose-900 underline text-xs flex-shrink-0"
        >
          <span>Call Showroom: 90253 80626</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

export function CookieBanner({ lang }: CautionAndCookieProps) {
  const t = translations[lang];
  const [isVisible, setIsVisible] = useState(true);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-6 left-6 z-40 max-w-sm rounded-2xl p-4 bg-[#141822]/95 backdrop-blur-md border border-white/[0.12] text-white shadow-2xl animate-fadeIn">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start space-x-3">
              <div className="text-2xl mt-0.5">🍪</div>
              <div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {t.cookieText}
                </p>
                <div className="mt-3 flex items-center space-x-2">
                  <button
                    onClick={() => setIsVisible(false)}
                    className="px-4 py-1.5 rounded-full bg-white text-black font-extrabold text-[11px] hover:bg-slate-100 transition-colors"
                  >
                    {t.cookieAccept}
                  </button>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 border border-white/[0.1] font-semibold text-[11px] transition-colors"
                  >
                    {t.cookieCustomize}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrivacyModalOpen(true)}
                  className="inline-block mt-2 text-[10px] text-slate-400 hover:text-white underline text-left"
                >
                  {t.cookiePrivacy}
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Comprehensive Customer Data Handling & Privacy Policy Modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-white/[0.1] rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    ARS Motors • Customer Privacy & Data Handling Policy
                  </h3>
                  <span className="text-xs text-slate-400">
                    Salem Showrooms: Seelanaickenpatti & Madathur
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <div>
                <h4 className="text-sm font-bold text-white mb-1 flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>1. Information We Collect</span>
                </h4>
                <p>
                  When you schedule a test ride, submit a booking token, or send an enquiry on arsmotors.in, we collect: customer full name, contact mobile number, location/pincode, vehicle model preference, and preferred test ride schedule slot.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1 flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>2. How Your Data Is Handled</span>
                </h4>
                <p>
                  Customer data is processed exclusively by authorized sales representatives at ARS Motors Salem for test ride coordination, official pre-booking token confirmation, and vehicle invoicing with Kinetic Green. We maintain a zero third-party disclosure policy: your contact numbers are never sold or rented to external marketing brokers.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1 flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>3. Database Storage & Daily Backups</span>
                </h4>
                <p>
                  All lead records, priority tokens, and test ride bookings are stored in encrypted, dedicated database storage with automated snapshots and daily backup schedules to guarantee zero customer record loss.
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1 flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>4. Your Rights & Data Deletion</span>
                </h4>
                <p>
                  You may request a copy of your inquiry record, update your contact details, or request full deletion of your contact data at any time by calling our Salem showroom helpline directly at <strong>+91 90253 80626</strong> or emailing <strong>support@arsmotors.in</strong>.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="px-6 py-2.5 rounded-full bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 transition-colors"
              >
                Understood & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
