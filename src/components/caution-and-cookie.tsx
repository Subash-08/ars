"use client";
import { Copy, useCopy } from "@/components/site-language";

import { useEffect,useState } from "react";
import Link from "next/link";
import type { Language } from "@/lib/translations";
export function CautionBanner({lang}:{lang:Language}){
  return <div className="bg-neutral-50 p-4 text-center text-xs text-neutral-600 border-t border-neutral-200"><Copy>{"Confirm payments directly with ARS Motors. This website collects enquiries only."}</Copy>{" "}<Link className="underline" href="/booking-terms"><Copy>{"Booking information"}</Copy></Link></div>;}
export function CookieBanner({lang}:{lang:Language}){
 const translate = useCopy();
 const [visible,setVisible]=useState(false);
 useEffect(()=>{try{setVisible(!localStorage.getItem("ars-analytics"));}catch{setVisible(true);}const preferences=()=>setVisible(true);window.addEventListener("ars-preferences",preferences);return()=>window.removeEventListener("ars-preferences",preferences);},[]);
 function choose(choice:string){try{localStorage.setItem("ars-analytics",choice);}catch{}setVisible(false);window.dispatchEvent(new Event("ars-consent"));}
 if(!visible)return null;
 return <aside data-analytics-prompt aria-label={translate("Optional analytics preferences")} className="fixed bottom-20 sm:bottom-5 left-4 right-4 sm:right-auto sm:max-w-sm z-40 rounded-2xl bg-neutral-950 text-white shadow-2xl border border-neutral-700 p-5"><p className="text-sm font-medium"><Copy>{"A little insight. Your choice."}</Copy></p><p className="mt-2 text-xs text-neutral-300 leading-relaxed"><Copy>{"Allow optional usage analytics to help improve this website. Enquiry forms work either way."}</Copy></p><div className="flex gap-2 mt-4"><button className="rounded-full bg-white text-black px-4 py-2 text-xs font-semibold" onClick={()=>choose("rejected")}><Copy>{"Essential only"}</Copy></button><button className="rounded-full border border-neutral-600 px-4 py-2 text-xs font-semibold hover:bg-neutral-800" onClick={()=>choose("accepted")}><Copy>{"Allow analytics"}</Copy></button></div><Link className="mt-3 inline-block underline text-xs text-neutral-400" href="/privacy"><Copy>{"Privacy information"}</Copy></Link></aside>;
}
