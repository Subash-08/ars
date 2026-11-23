import Link from "next/link";
import type { Language } from "@/lib/translations";
export function BrochureModal({lang}:{lang:Language}){const url=process.env.NEXT_PUBLIC_BROCHURE_URL;return <div className="flex justify-center py-8">{url?<a href={url} target="_blank" rel="noopener noreferrer" className="rounded-full border border-neutral-300 px-6 py-3 text-sm">Open brochure (PDF)</a>:<Link href="/book-test-ride?inquiry=brochure" className="rounded-full border border-neutral-300 px-6 py-3 text-sm">Request the latest brochure</Link>}</div>;}
