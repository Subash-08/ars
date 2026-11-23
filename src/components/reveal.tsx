"use client";
import { useEffect, useRef } from "react";
export function Reveal({ children, delay = 0, className = "" }: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            return;
        if (el.getBoundingClientRect().top < window.innerHeight)
            return;
        el.dataset.reveal = "pending";
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                el.dataset.reveal = "visible";
                observer.disconnect();
            }
        }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });
        observer.observe(el);
        return () => { observer.disconnect(); delete el.dataset.reveal; };
    }, []);
    return <div ref={ref} className={`reveal ${className}`} style={{ "--reveal-delay": `${Math.min(delay, 300)}ms` } as React.CSSProperties}>{children}</div>;
}
