"use client";
import Link from "next/link";
import { DealershipSection } from "./dealership-section";
import { Reveal } from "./reveal";
export function ShowroomContent() { return <><Reveal><DealershipSection lang="en"/></Reveal><div className="max-w-7xl mx-auto px-5 sm:px-8 pb-16 grid sm:grid-cols-2 gap-5">{["Seelanaickenpatti", "Madathur"].map(branch => <Reveal key={branch}><div className="border border-neutral-200 rounded-2xl p-6"><h2 className="text-xl font-medium">Plan a visit to {branch}</h2><p className="mt-3 text-sm text-neutral-600">Call ahead for holiday hours, service availability or a specific vehicle.</p><Link className="mt-5 inline-block underline text-sm" href={`/book-test-ride?branch=${branch}`}>Request a test ride here ↗</Link></div></Reveal>)}</div><div className="max-w-7xl mx-auto px-5 sm:px-8 pb-16"><Link href="/book-test-ride?inquiry=enquiry" className="underline text-sm">Have a general question? Send a showroom enquiry ↗</Link></div></>; }
