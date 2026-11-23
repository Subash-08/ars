"use client";

import React, { useState, useEffect } from "react";
import { Language } from "@/lib/translations";
import { trackPageView } from "@/lib/analytics-tracker";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { QuickActions } from "@/components/quick-actions";
import { ElectricFamily } from "@/components/electric-family";
import { OffersSection } from "@/components/offers-section";
import { Viewer360 } from "@/components/viewer-360";
import { SavingsCalculator } from "@/components/savings-calculator";
import { EmiCalculator } from "@/components/emi-calculator";
import { ExchangeEstimator } from "@/components/exchange-estimator";
import { ChargingGuide } from "@/components/charging-guide";
import { FeaturesGrid } from "@/components/features-grid";
import { SpecsTable } from "@/components/specs-table";
import { LeadSection } from "@/components/lead-section";
import { BrochureModal } from "@/components/brochure-modal";
import { AboutSection } from "@/components/about-section";
import { DealershipSection } from "@/components/dealership-section";
import { FaqAccordion } from "@/components/faq-accordion";
import { CautionBanner, CookieBanner } from "@/components/caution-and-cookie";
import { Footer } from "@/components/footer";
import { CallbackModal } from "@/components/callback-modal";

export default function HomePage() {
  const [lang, setLang] = useState<Language>("en");

  // Track pageview on initial mount
  useEffect(() => {
    trackPageView();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-black selection:text-white">
      {/* 1. Frosted Glass Sticky Header matching Ather Navigation & Mega Menu */}
      <Navbar
        lang={lang}
        onToggleLang={(newLang) => setLang(newLang)}
        onOpenCallback={() => scrollToSection("get-in-touch")}
        onOpenBooking={() => scrollToSection("get-in-touch")}
        onNavigate={(sectionId) => scrollToSection(sectionId)}
      />

      <main className="flex-grow">
        {/* 2. Full-Bleed Cinematic Hero Banner matching Screenshot 4 */}
        <Hero
          lang={lang}
          onBookTestRide={() => scrollToSection("get-in-touch")}
          onExplore360={() => scrollToSection("360-studio")}
          onLearnMore={() => scrollToSection("electric-family")}
        />

        {/* 3. Ather-Style Floating Quick Actions Dock matching Screenshot 1 */}
        <QuickActions
          lang={lang}
          onNavigate={(id) => scrollToSection(id)}
        />

        {/* 4. "The E-Luna Electric Family" 3-Card Grid matching Screenshot 1 */}
        <ElectricFamily
          lang={lang}
          onBookModel={(modelName) => {
            scrollToSection("get-in-touch");
          }}
          onExploreModel={(modelName) => {
            scrollToSection("specs-matrix");
          }}
        />

        {/* 5. Exclusive Salem Offers & Limited-Time Promos */}
        <OffersSection
          lang={lang}
          onClaimOffer={(offerTitle) => {
            scrollToSection("get-in-touch");
          }}
        />

        {/* 7. 360° Interactive Studio with Turntable, 5 Colors & Engineering Hotspots */}
        <Viewer360 lang={lang} />

        {/* 8. Fuel Savings Calculator (Save ₹56,652/yr vs. Petrol) */}
        <SavingsCalculator
          lang={lang}
          onBookNow={() => scrollToSection("get-in-touch")}
        />

        {/* 9. EMI & Finance Calculator (Starting @ ₹2,199/month) */}
        <EmiCalculator
          lang={lang}
          onCheckLoan={() => scrollToSection("get-in-touch")}
        />

        {/* 10. Old Petrol Two-Wheeler Exchange Estimator */}
        <ExchangeEstimator
          lang={lang}
          onClaimBonus={(brand) => {
            scrollToSection("get-in-touch");
          }}
        />

        {/* 11. Zero-Hassle Home 3-Pin Charging Guide */}
        <ChargingGuide lang={lang} />

        {/* 12. 14 Special Brochure Features */}
        <FeaturesGrid lang={lang} />

        {/* 13. Technical Specifications Comparison Matrix */}
        <SpecsTable lang={lang} />

        {/* 14. Ather-Style Split "Get in Touch" Form & E-Luna Visual */}
        <LeadSection
          lang={lang}
          onSuccess={(token) => {
            // Success handler
          }}
        />

        {/* 15. Download Official Brochure Lead Magnet */}
        <BrochureModal lang={lang} />

        {/* 16. About ARS Motors & Salem 3S Dealership Heritage */}
        <AboutSection
          lang={lang}
          onBookTestRide={() => scrollToSection("get-in-touch")}
          onExploreDealership={() => scrollToSection("showrooms")}
        />

        {/* 17. Dual Salem Showroom Locations with 1-Click Directions */}
        <DealershipSection lang={lang} />

        {/* 18. FAQ Accordion */}
        <FaqAccordion lang={lang} />

        {/* 19. Ather Caution Notice Banner matching Screenshot 2 */}
        <CautionBanner lang={lang} />
      </main>

      {/* 20. Minimalist Footer */}
      <Footer lang={lang} />

      {/* 21. Persistent Floating "Request a call back" Pill & "Talk to us, directly." Modal matching Screenshot 2 */}
      <CallbackModal lang={lang} />

      {/* 22. Cookie Consent Notice matching Screenshot 2 */}
      <CookieBanner lang={lang} />
    </div>
  );
}
