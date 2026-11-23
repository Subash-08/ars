export function calculateEmi(price: number, deposit: number, annualRate: number, months: number) {
    const principal = Math.max(0, price - deposit);
    const r = annualRate / 1200;
    if (months <= 0 || !Number.isFinite(months))
        return 0;
    return r === 0 ? principal / months : principal * r * (1 + r) ** months / ((1 + r) ** months - 1);
}
export function calculateSavings(km: number, days: number, petrol: number, mileage: number, tariff: number, energy: number) {
    const petrolDaily = km * petrol / mileage;
    const electricDaily = km * energy / 100 * tariff;
    return { petrolDaily, electricDaily, monthly: (petrolDaily - electricDaily) * days, annual: (petrolDaily - electricDaily) * days * 12 };
}
