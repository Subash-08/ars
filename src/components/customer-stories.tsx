"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
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
    <section id="customer-stories" className="bg-neutral-950 text-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl sm:text-5xl font-medium tracking-tight">Customer delivery stories</h2>
              <p className="mt-4 text-sm text-neutral-300">Meet the people and everyday journeys behind each showroom handover.</p>
            </div>
            {stories.length > 1 && <div className="flex gap-2">
              <button type="button" aria-label="Previous stories" onClick={() => scroll(-1)} className="rounded-full border border-white/30 p-3 hover:bg-white/15 focus-visible:outline-white"><ArrowLeft size={18}/></button>
              <button type="button" aria-label="Next stories" onClick={() => scroll(1)} className="rounded-full border border-white/30 p-3 hover:bg-white/15 focus-visible:outline-white"><ArrowRight size={18}/></button>
            </div>}
          </div>
        </Reveal>
        <div ref={rail} tabIndex={0} role="region" aria-label="Delivery story gallery" className="mt-8 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
          {stories.map(story => (
            <article key={story.id} className="group snap-start relative isolate aspect-[4/5] w-[min(82vw,350px)] shrink-0 overflow-hidden rounded-3xl border border-white/15 bg-neutral-800">
              <img src={story.imageUrl} alt={story.isDemo ? "Illustrated electric bike showroom handover" : `Showroom handover for ${story.customerName}`}
                width={640} height={800} loading="lazy" className="absolute inset-0 size-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent"/>
              {story.isDemo && <p className="absolute top-4 left-4 rounded-full bg-black/75 px-3 py-1 text-xs">Demo · AI-generated photo</p>}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-sm leading-relaxed text-neutral-100">{story.testimonial}</p>
                <h3 className="mt-3 text-xl font-semibold">{story.customerName}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-200"><MapPin size={14} aria-hidden="true"/>{story.location}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
