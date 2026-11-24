export const languageCookie = "ars-language";

export type SiteLanguage = "en" | "ta";

export function siteLanguage(value?: string): SiteLanguage {
  return value === "ta" ? "ta" : "en";
}
