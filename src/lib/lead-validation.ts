const fields = ["name", "phone", "email", "cityArea", "preferredColor", "inquiryType", "useCase", "exchangeBrand", "assignedBranch", "preferredDate", "preferredTime", "message", "source", "utmSource", "utmMedium", "utmCampaign"] as const;
export function validateLead(body: Record<string, unknown>): Record<string, string> & {
    name: string;
    phone: string;
    assignedBranch: string;
    inquiryType: string;
} {
    const data: Record<string, string> = {};
    for (const key of fields) {
        if (body[key] !== undefined && body[key] !== null) {
            if (typeof body[key] !== "string")
                throw new Error(`Invalid ${key}`);
            const value = (body[key] as string).trim();
            if (value.length > (key === "message" ? 2000 : 200))
                throw new Error(`${key} is too long`);
            if (value)
                data[key] = value;
        }
    }
    if (!data.name || data.name.length < 2 || !data.phone || !/^[6-9]\d{9}$/.test(data.phone))
        throw new Error("Enter your name and a valid 10-digit Indian mobile number.");
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        throw new Error("Enter a valid email address.");
    if (data.assignedBranch && !["Seelanaickenpatti", "Madathur"].includes(data.assignedBranch))
        throw new Error("Choose a valid showroom.");
    if (data.inquiryType && !["Test Drive", "General Enquiry", "Reservation Enquiry", "Finance Enquiry", "Exchange", "Offer Enquiry", "Brochure Request", "Callback"].includes(data.inquiryType))
        throw new Error("Choose a valid enquiry type.");
    if (data.preferredDate) {
        const date = new Date(`${data.preferredDate}T12:00:00+05:30`);
        const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data.preferredDate) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== data.preferredDate || data.preferredDate < today)
            throw new Error("Choose today or a future date.");
    }
    if (data.preferredTime && !["Morning (10:00 AM - 01:00 PM)", "Afternoon (01:00 PM - 04:00 PM)", "Evening (04:00 PM - 07:00 PM)"].includes(data.preferredTime))
        throw new Error("Choose a valid time window.");
    return { ...data, name: data.name, phone: data.phone, assignedBranch: data.assignedBranch || "Seelanaickenpatti", inquiryType: data.inquiryType || "General Enquiry" };
}
