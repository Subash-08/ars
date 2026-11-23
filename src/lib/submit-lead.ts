export async function submitLead(body: Record<string, unknown>) {
    const params = new URLSearchParams(window.location.search);
    const attribution: Record<string, string> = {};
    for (const [param, key] of [["utm_source", "utmSource"], ["utm_medium", "utmMedium"], ["utm_campaign", "utmCampaign"]]) {
        let value = params.get(param);
        try {
            value = value || sessionStorage.getItem(param);
        }
        catch { }
        if (value)
            attribution[key] = value.slice(0, 200);
    }
    const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, ...attribution }) });
    const data = await res.json();
    if (!res.ok || !data.success || !data.reference)
        throw new Error(data.error || "Your request could not be saved. Please try again or call the showroom.");
    return data.reference as string;
}
