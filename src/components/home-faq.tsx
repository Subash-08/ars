import { Copy } from "@/components/site-language";

import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Reveal } from "./reveal";

const questions = [
  ["How do I arrange a test ride?", "Choose a showroom and your preferred time in the test ride form. Our Salem team will get in touch to confirm the vehicle, branch, and time. The form does not collect payment."],
  ["Which E-Luna should I try?", "Compare the PRO X3, Commercial Cargo, and City Commuter on the E-Luna page. Tell the showroom how far you travel, whether you carry a passenger or cargo, and where you can charge."],
  ["How much will it cost on the road?", "The website shows indicative prices. Ask the showroom for a written quote for your chosen bike that lists insurance, registration where applicable, accessories, and other charges."],
  ["Can I charge at home?", "Ask about the approved charger and electrical requirements for your chosen vehicle. Our team can walk you through the setup before delivery."],
  ["Can I ask about finance or exchange?", "Use Finance & Offers to see illustrative repayment and running cost estimates, or request an exchange valuation. A lender confirms final terms, and the showroom confirms exchange value after inspection."],
  ["Where can I ask about service and warranty?", "Contact your preferred Salem branch for service availability and spare parts. Ask for written warranty details for the exact bike and its components, including coverage limits and exclusions."],
  ["What should I bring to the showroom?", "Check with the branch when it confirms your test ride. Ask about any documents you need to bring and whether your preferred model will be there."],
];

export function HomeFaq() {
  return (
    <section id="test-ride-faq" aria-labelledby="test-ride-faq-title" className="border-t border-neutral-200 bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.35fr] lg:gap-16">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.19em] text-emerald-900"><Copy>{"Before your first ride"}</Copy></p>
          <h2 id="test-ride-faq-title" className="mt-4 max-w-md text-4xl font-medium tracking-tight sm:text-5xl"><Copy>{"Questions before you visit?"}</Copy></h2>
          <div className="mt-7 max-w-sm rounded-2xl border border-[#d8e4dc] bg-[#f2f7f3] p-5 sm:p-6">
            <p className="font-semibold"><Copy>{"Speak to the Salem team"}</Copy></p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600"><Copy>{"Ask about a specific model, test ride, or on-road quote."}</Copy></p>
            <Link href="/showrooms" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-950 underline underline-offset-4">
              <Copy>{"Find your showroom"}</Copy>{" "}<ArrowUpRight size={15} aria-hidden="true"/>
            </Link>
          </div>
        </Reveal>
        <Reveal delay={90}>
          <div className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200">
            {questions.map(([question, answer]) => (
              <details key={question} className="group open:bg-[#f4f8f5]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium hover:bg-[#f4f8f5] sm:px-6 [&::-webkit-details-marker]:hidden">
                  <Copy>{question}</Copy>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[#d8e4dc] bg-white text-emerald-900">
                    <Plus size={16} aria-hidden="true" className="group-open:rotate-45 motion-safe:transition-transform"/>
                  </span>
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-700 sm:px-6"><Copy>{answer}</Copy></p>
              </details>
            ))}
          </div>
          <Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-950 underline underline-offset-4" href="/ownership#faq-section">
            <Copy>{"More about ownership"}</Copy>{" "}<ArrowUpRight size={15} aria-hidden="true"/>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
