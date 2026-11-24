"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ImageOff, MapPin } from "lucide-react";
import { Reveal } from "./reveal";
import type { CustomerStory } from "@/lib/story-types";
import styles from "./customer-briefs.module.css";

function Avatar({ story }: { story: CustomerStory }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="flex size-[34px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-900 text-xs font-bold text-white">
      {story.imageUrl && !failed
        ? <img src={story.imageUrl} alt="" width={44} height={44} loading="lazy" onError={() => setFailed(true)} className="size-full object-cover"/>
        : story.customerName.split(" ").slice(0, 2).map(word => word[0]).join("")}
    </span>
  );
}

export function CustomerSections({ stories }: { stories: CustomerStory[] }) {
  const testimonials = stories.filter(story => story.kind === "testimonial");
  const deliveries = stories.filter(story => story.kind === "delivery");
  return (
    <>
      {testimonials.length > 0 && <section id="testimonials" aria-labelledby="testimonials-title" className={styles.section}>
        <div className={styles.wrap}>
          <Reveal>
            <header className={styles.heading}>
              <h2 id="testimonials-title">What riders care about</h2>
              <p>{testimonials.every(story => story.isDemo) ? "Example stories from everyday E-Luna riders." : "Everyday journeys, in riders’ own words."}</p>
            </header>
          </Reveal>
          <div className={styles.grid}>
            {testimonials.map((story, index) => <Reveal key={story.id} delay={index % 3 * 85}>
              <figure className={styles.card}>
                <blockquote className={styles.bubble}>
                  <p>{story.testimonial}</p>
                </blockquote>
                <figcaption className={styles.caption}>
                  <Avatar story={story}/>
                  <div>
                    <strong>{story.customerName}</strong>
                    <p>{story.location}{story.isDemo && " · Demo quote"}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>)}
          </div>
        </div>
      </section>}
      {deliveries.length > 0 && <DeliveryStories stories={deliveries}/>}
    </>
  );
}

function DeliveryStories({ stories }: { stories: CustomerStory[] }) {
  const rail = useRef<HTMLDivElement>(null);
  function scroll(direction: -1 | 1) {
    const container = rail.current;
    const first = container?.firstElementChild;
    if (!container || !first) return;
    const step = first.getBoundingClientRect().width + 24;
    container.scrollBy({
      left: direction * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }
  return (
    <section id="customer-stories" aria-labelledby="delivery-title" className="border-t border-neutral-200 bg-[#f4f7f3] py-16 text-neutral-950 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 id="delivery-title" className="text-3xl sm:text-5xl font-medium tracking-tight">Customer delivery stories</h2>
              <p className="mt-4 text-sm text-neutral-600">Meet the people and everyday journeys behind each showroom handover.</p>
            </div>
            {stories.length > 1 && <div className={`flex gap-2 ${stories.length <= 3 ? "lg:hidden" : ""}`}>
              <button type="button" aria-label="Previous stories" onClick={() => scroll(-1)} className="rounded-full border border-emerald-900/20 bg-white p-3 hover:bg-emerald-50"><ArrowLeft size={18}/></button>
              <button type="button" aria-label="Next stories" onClick={() => scroll(1)} className="rounded-full border border-emerald-900/20 bg-white p-3 hover:bg-emerald-50"><ArrowRight size={18}/></button>
            </div>}
          </div>
        </Reveal>
        <div ref={rail} tabIndex={0} role="region" aria-label="Delivery story gallery" className="mt-8 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
          {stories.map(story => (
            <article key={story.id} className="flex w-[min(82vw,350px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white lg:w-[calc((100%_-_3rem)/3)]">
              <DeliveryPhoto key={story.imageUrl} story={story}/>
              <div className="flex flex-1 flex-col border-t border-neutral-100 px-5 py-5 sm:p-6">
                <h3 className="text-lg font-semibold tracking-tight">{story.customerName}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-900"><MapPin size={14} aria-hidden="true"/>{story.location}</p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{story.testimonial}</p>
                {story.isDemo && <p className="mt-auto pt-4 text-xs text-neutral-500">Demo · AI-generated photo</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeliveryPhoto({ story }: { story: CustomerStory }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="grid aspect-[4/5] place-items-center bg-[#edf2ed]">
      {story.imageUrl && !failed ? (
        <img
          src={story.imageUrl}
          alt={story.isDemo ? "Illustrated E-Luna showroom handover" : `Showroom handover for ${story.customerName}`}
          width={800}
          height={1000}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <p className="flex items-center gap-2 text-sm text-neutral-600"><ImageOff size={18} aria-hidden="true"/> Photo unavailable</p>
      )}
    </div>
  );
}
