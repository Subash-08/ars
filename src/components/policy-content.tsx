import Link from "next/link";
import { SiteShell, PageIntro } from "./site-shell";
export function PolicyContent({ title, sections }: {
    title: string;
    sections: [
        string,
        string
    ][];
}) { return <SiteShell><PageIntro eyebrow="Information" title={title}>ARS Motors Salem · Updated 23 November 2026</PageIntro><article className="max-w-3xl mx-auto px-5 sm:px-8 pb-20">{sections.map(([heading, text]) => <section className="py-7 border-t border-neutral-200" key={heading}><h2 className="text-xl font-medium">{heading}</h2><p className="mt-3 text-sm text-neutral-600 leading-relaxed">{text}</p></section>)}<p className="mt-8 text-sm">Questions? <Link className="underline" href="/showrooms">Contact ARS Motors</Link>.</p></article></SiteShell>; }
