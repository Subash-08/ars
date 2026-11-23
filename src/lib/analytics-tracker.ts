// Client-side analytics beacon
export function trackPageView(utmParams?: {
    source?: string;
    campaign?: string;
}) {
    if (typeof window === "undefined")
        return;
    const referrer = document.referrer || "Direct";
    const userAgent = navigator.userAgent;
    const width = window.innerWidth;
    const deviceType = width < 768 ? "Mobile" : width < 1024 ? "Tablet" : "Desktop";
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = utmParams?.source || urlParams.get("utm_source") || "Direct";
    const utmCampaign = utmParams?.campaign || urlParams.get("utm_campaign") || undefined;
    fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            consent: true,
            path: window.location.pathname,
            referrer,
            userAgent,
            deviceType,
            utmSource,
            utmCampaign,
        }),
    }).catch(() => {
        // Silent fail for non-blocking analytics
    });
}
