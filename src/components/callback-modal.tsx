"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Phone, X } from "lucide-react";
import { submitLead } from "@/lib/submit-lead";
import { Copy, useCopy } from "./site-language";

const field = "mt-1.5 w-full rounded-xl border border-neutral-300 bg-white px-3.5 py-2.5 text-base";
const topics = ["Test ride", "Price and availability", "Finance and exchange", "Service and charging"];
const popupDelay = 10_000;
const visitKey = "ars-callback-visit-v2";

function isBikeTourInView() {
  const tour = document.querySelector("[data-bike-tour-track]")?.getBoundingClientRect();
  return !!tour && tour.top < window.innerHeight * .72 && tour.bottom > window.innerHeight * .3;
}

export function CallbackModal({ allowTimed }: { allowTimed: boolean }) {
  const copy = useCopy();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const success = useRef<HTMLHeadingElement>(null);
  const surfaced = useRef(false);
  const source = useRef("Callback modal");
  const [timed, setTimed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  function suppressTimedPrompt() {
    surfaced.current = true;
    try { sessionStorage.setItem(visitKey, "seen"); } catch {}
  }

  useEffect(() => {
    if (!allowTimed || surfaced.current) return;
    let started = Date.now();
    try {
      const previous = sessionStorage.getItem(visitKey);
      if (previous === "seen") return;
      if (previous) started = Number(previous) || started;
      sessionStorage.setItem(visitKey, String(started));
    } catch {}

    const timer = window.setInterval(() => {
      if (surfaced.current) {
        window.clearInterval(timer);
        return;
      }
      if (Date.now() - started < popupDelay || document.visibilityState !== "visible") return;
      if (isBikeTourInView()) return;
      if (document.querySelector('dialog[open], [aria-modal="true"], [data-language-picker][aria-expanded="true"]')) return;
      if (document.activeElement?.closest('input, textarea, select, [contenteditable="true"]')) return;

      window.clearInterval(timer);
      suppressTimedPrompt();
      source.current = "Timed callback";
      dialog.current?.setAttribute("open", "");
      setTimed(true);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [allowTimed]);

  useEffect(() => {
    if (!allowTimed && timed) {
      dialog.current?.removeAttribute("open");
      setTimed(false);
    }
  }, [allowTimed, timed]);

  function dismiss() {
    if (timed) {
      const focusedInside = dialog.current?.contains(document.activeElement);
      dialog.current?.removeAttribute("open");
      if (focusedInside) requestAnimationFrame(() => trigger.current?.focus());
    } else {
      dialog.current?.close();
    }
    setTimed(false);
  }

  useEffect(() => {
    if (!timed) return;
    const clearTourView = () => {
      if (!isBikeTourInView() || dialog.current?.contains(document.activeElement)) return;
      dialog.current?.removeAttribute("open");
      setTimed(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || document.querySelector('[aria-modal="true"], dialog:modal, [data-language-picker][aria-expanded="true"]')) return;
      const focusedInside = dialog.current?.contains(document.activeElement);
      dialog.current?.removeAttribute("open");
      if (focusedInside) requestAnimationFrame(() => trigger.current?.focus());
      setTimed(false);
    };
    document.addEventListener("keydown", escape);
    window.addEventListener("scroll", clearTourView, { passive: true });
    return () => {
      document.removeEventListener("keydown", escape);
      window.removeEventListener("scroll", clearTourView);
    };
  }, [timed]);

  function openModal() {
    suppressTimedPrompt();
    source.current = "Callback modal";
    if (!busy) {
      setError("");
      setReference("");
    }
    dialog.current?.showModal();
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    setError("");
    setBusy(true);
    try {
      const topic = String(fields.get("topic") ?? "");
      const savedReference = await submitLead({
        name: fields.get("name"),
        phone: fields.get("phone"),
        inquiryType: "Callback",
        source: source.current,
        message: topics.includes(topic) ? topic : undefined,
        consent: fields.get("consent") === "on",
        website: fields.get("website"),
      });
      form.reset();
      setReference(savedReference);
      requestAnimationFrame(() => {
        if (dialog.current?.open) success.current?.focus();
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button ref={trigger} type="button" aria-haspopup="dialog" aria-controls="callback-dialog"
        onClick={() => openModal()}
        className={`fixed bottom-5 right-5 z-30 items-center gap-2 rounded-full border border-[#c1d5c6] bg-[#f8fbf8] px-4 py-3 text-xs font-bold text-[#17372b] shadow-lg transition-colors hover:bg-[#e6f0e7] sm:px-5 ${timed ? "hidden" : "flex"}`}>
        <Phone size={15} aria-hidden="true"/><Copy>{"Request a call back"}</Copy>
      </button>
      <dialog id="callback-dialog" ref={dialog} aria-labelledby="callback-title" aria-describedby="callback-description"
        onClose={() => trigger.current?.focus()}
        className={`overflow-y-auto rounded-3xl bg-white p-0 text-[#14251d] shadow-2xl backdrop:bg-[#101b15]/60 ${timed ? "timed-callback fixed inset-auto bottom-4 right-4 z-30 m-0 max-h-[60dvh] w-[min(22rem,calc(100%-2rem))] border border-[#c1d5c6] motion-safe:animate-fadeIn md:max-h-[calc(100dvh-6rem)]" : "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md"}`}>
        <header className={`border-b border-[#dce7df] bg-[#ebf3eb] ${timed ? "sticky top-0 z-10 px-5 pb-3 pt-4" : "relative px-6 pb-5 pt-6 sm:px-8"}`}>
          <button type="button" onClick={dismiss} aria-label={copy("Close callback dialog")}
            className="absolute right-3 top-3 grid size-11 place-items-center rounded-full hover:bg-white">
            <X size={21} aria-hidden="true"/>
          </button>
          {reference && <CheckCircle2 size={25} aria-hidden="true" className="mb-3 text-emerald-800"/>}
          <h2 id="callback-title" ref={success} tabIndex={-1} className={`pr-9 font-extrabold tracking-tight outline-none ${timed ? "text-lg" : "text-2xl"}`}>
            <Copy>{reference ? "Request received." : "Talk to our Salem team"}</Copy>
          </h2>
          <p id="callback-description" className="mt-2 text-sm leading-relaxed text-[#334239]">
            <Copy>{reference ? "Our team will contact you during showroom hours." : "Ask about a test ride, pricing or service. We’ll call during showroom hours."}</Copy>
          </p>
        </header>
        {reference ? (
          <div role="status" className="space-y-4 p-6 sm:px-8">
            <p className="break-all text-sm"><Copy>{"Reference:"}</Copy>{" "}<strong>{reference}</strong></p>
            <button type="button" onClick={dismiss} className="rounded-full bg-[#17372b] px-5 py-2.5 text-sm font-bold text-white"><Copy>{"Done"}</Copy></button>
          </div>
        ) : (
          <form onSubmit={submit} className={timed ? "space-y-3 px-5 py-3" : "space-y-4 p-6 sm:px-8"}>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800"><Copy>{error}</Copy></p>}
            <label className="block text-sm font-semibold" htmlFor="callback-name"><Copy>{"Full name"}</Copy>
              <input id="callback-name" name="name" required minLength={2} maxLength={100} autoComplete="name" className={field}/>
            </label>
            <label className="block text-sm font-semibold" htmlFor="callback-phone"><Copy>{"Mobile (+91)"}</Copy>
              <input id="callback-phone" name="phone" type="tel" inputMode="numeric" required pattern="[6-9][0-9]{9}"
                title={copy("Enter a 10-digit Indian mobile number")} minLength={10} maxLength={10} autoComplete="tel-national" className={field}/>
            </label>
            <label className={`text-sm font-semibold ${timed ? "hidden md:block" : "block"}`} htmlFor="callback-topic"><Copy>{"What can we help with? (optional)"}</Copy>
              <select id="callback-topic" name="topic" className={field}>
                <option value="">{copy("Choose a topic")}</option>
                {topics.map(topic => <option key={topic} value={topic}>{copy(topic)}</option>)}
              </select>
            </label>
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="callback-website"><Copy>{"Leave this field empty"}</Copy></label>
              <input id="callback-website" name="website" tabIndex={-1} autoComplete="off"/>
            </div>
            <div className="flex items-start gap-2.5 text-xs leading-relaxed text-[#334239]">
              <input id="callback-consent" className="mt-1 accent-emerald-900" name="consent" type="checkbox" required/>
              <div>
                <label htmlFor="callback-consent"><Copy>{"I agree to be contacted about this request."}</Copy></label>{" "}
                <Link href="/privacy" className="underline" onClick={dismiss}><Copy>{"Privacy information"}</Copy></Link>
              </div>
            </div>
            <button disabled={busy} className="w-full rounded-full bg-[#17372b] px-5 py-3 text-sm font-bold text-white hover:bg-[#214c3b] disabled:opacity-50">
              <Copy>{busy ? "Saving…" : "Request a callback"}</Copy>
            </button>
          </form>
        )}
      </dialog>
    </>
  );
}
