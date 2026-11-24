"use client";
import { Copy } from "@/components/site-language";
import Link from "next/link";
import { DealershipSection } from "./dealership-section";
import { Reveal } from "./reveal";
export function ShowroomContent() { return <><Reveal><DealershipSection lang="en"/></Reveal><div className="max-w-7xl mx-auto px-5 sm:px-8 pb-16 grid sm:grid-cols-2 gap-5">{["Seelanaickenpatti", "Madathur"].map(branch => <Reveal key={branch}><div className="border border-neutral-200 rounded-2xl p-6"><h2 className="text-xl font-medium"><Copy>{"Plan a visit to"}</Copy>{" "}<Copy>{branch}</Copy></h2><p className="mt-3 text-sm text-neutral-600"><Copy>{"Call ahead for holiday hours, service availability or a specific vehicle."}</Copy></p><Link className="mt-5 inline-block underline text-sm" href={`/book-test-ride?branch=${branch}`}><Copy>{"Request a test ride here ↗"}</Copy></Link></div></Reveal>)}</div><div className="max-w-7xl mx-auto px-5 sm:px-8 pb-16"><Link href="/book-test-ride?inquiry=enquiry" className="underline text-sm"><Copy>{"Have a general question? Send a showroom enquiry ↗"}</Copy></Link></div></>; }
