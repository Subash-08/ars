export const sectionRoutes: Record<string, string> = {
    "electric-family": "/e-luna", "specs-matrix": "/e-luna#specs-matrix",
    "360-studio": "/e-luna#360-studio", "get-in-touch": "/book-test-ride",
    "savings-calculator": "/finance-offers#savings-calculator",
    "emi-calculator": "/finance-offers#emi-calculator",
    "exchange-estimator": "/finance-offers#exchange-estimator", offers: "/finance-offers#offers",
    "charging-guide": "/ownership#charging-guide", service: "/ownership#service", warranty: "/ownership#warranty",
    features: "/e-luna#features", "faq-section": "/ownership#faq-section", "about-ars": "/about", showrooms: "/showrooms",
};
export function bookingUrl(context: Record<string, string | undefined> = {}) {
    const params = new URLSearchParams();
    Object.entries(context).forEach(([key, value]) => { if (value)
        params.set(key, value); });
    return `/book-test-ride${params.size ? `?${params}` : ""}`;
}
