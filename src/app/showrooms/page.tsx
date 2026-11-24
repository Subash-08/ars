import { Copy } from "@/components/site-language";
import type { Metadata } from "next";
import { SiteShell, PageIntro } from "@/components/site-shell";
import { ShowroomContent } from "@/components/showroom-content";
export const metadata: Metadata = { title: "Salem Showrooms & Contact | ARS Motors", description: "Addresses, opening hours and contact details for ARS Motors at Seelanaickenpatti and Madathur.", alternates: { canonical: "/showrooms" }, openGraph: { title: "Salem Showrooms | ARS Motors", url: "/showrooms" } };
export default function ShowroomPage() { return <SiteShell><PageIntro eyebrow="Showrooms" title="Come by. Take a closer look."><Copy>{"Find ARS Motors at Seelanaickenpatti Bypass and Madathur. Speak with our team about your next ride."}</Copy></PageIntro><ShowroomContent /></SiteShell>; }
