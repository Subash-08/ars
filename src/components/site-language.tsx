"use client";

import { createContext, useContext, useState } from "react";
import { languageCookie, type SiteLanguage } from "@/lib/site-language";
import { tamilCopy } from "@/lib/tamil-copy";

const LanguageContext = createContext<{ language: SiteLanguage; selectLanguage: (language: SiteLanguage) => void }>({
  language: "en",
  selectLanguage: () => {},
});

export function SiteLanguageProvider({ initialLanguage, children }: { initialLanguage: SiteLanguage; children: React.ReactNode }) {
  const [language, setLanguage] = useState(initialLanguage);

  function selectLanguage(next: SiteLanguage) {
    document.cookie = `${languageCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    document.documentElement.lang = next;
    setLanguage(next);
  }

  return <LanguageContext.Provider value={{ language, selectLanguage }}>{children}</LanguageContext.Provider>;
}

export function useSiteLanguage() {
  return useContext(LanguageContext);
}

export function useCopy() {
  const { language } = useSiteLanguage();
  return (english: string) => language === "ta" && Object.prototype.hasOwnProperty.call(tamilCopy, english)
    ? tamilCopy[english]
    : english;
}

export function Copy({ children }: { children: string }) {
  return useCopy()(children);
}
