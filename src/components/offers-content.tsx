"use client";
import { useRouter } from "next/navigation";
import { OffersSection } from "./offers-section";
import { bookingUrl } from "@/lib/navigation";
export function OffersContent() { const router = useRouter(); return <OffersSection lang="en" onClaimOffer={offer => router.push(bookingUrl({ inquiry: "offer", offer }))}/>; }
