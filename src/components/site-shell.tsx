"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { CallbackModal } from "./callback-modal";
import { CookieBanner } from "./caution-and-cookie";
import { sectionRoutes } from "@/lib/navigation";
import { trackPageView } from "@/lib/analytics-tracker";
export function SiteShell({ children }: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const path = usePathname();
    useEffect(() => {
        const track = () => { try {
            if (localStorage.getItem("ars-analytics") === "accepted")
                trackPageView();
        }
        catch { } };
        try {
            const q = new URLSearchParams(location.search);
            for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
                const value = q.get(key);
                if (value)
                    sessionStorage.setItem(key, value.slice(0, 200));
            }
        }
        catch { }
        track();
        window.addEventListener("ars-consent", track);
        if (path === "/" && location.hash !== "#360-studio" && sectionRoutes[location.hash.slice(1)])
            router.replace(sectionRoutes[location.hash.slice(1)]);
        return () => window.removeEventListener("ars-consent", track);
    }, [path, router]);
    return <div className="min-h-screen bg-white text-neutral-900 flex flex-col selection:bg-black selection:text-white"><a className="skip-link" href="#main-content">Skip to content</a><Navbar lang="en" onToggleLang={() => { }} onOpenCallback={() => router.push("/book-test-ride?inquiry=callback")} onOpenBooking={() => router.push("/book-test-ride")} onNavigate={id => router.push(sectionRoutes[id] || id)}/><main id="main-content" tabIndex={-1} className="flex-grow" key={path}>{children}</main><Footer lang="en"/><CallbackModal lang="en"/><CookieBanner lang="en"/></div>;
}
export function PageIntro({ eyebrow, title, children }: {
    eyebrow: string;
    title: string;
    children: React.ReactNode;
}) {
    return <div className="page-intro max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-10 sm:pt-20 sm:pb-14"><Link href="/" className="text-xs text-neutral-500 hover:text-black">Home <span aria-hidden="true">/</span> {eyebrow}</Link><p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">ARS Motors · Salem</p><h1 className="mt-4 text-4xl sm:text-6xl font-medium tracking-tight max-w-4xl leading-[1.08]">{title}</h1><div className="mt-5 text-neutral-600 text-base sm:text-lg leading-relaxed max-w-2xl">{children}</div></div>;
}
