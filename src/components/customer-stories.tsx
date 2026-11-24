"use client";

import { useEffect, useRef, useState } from "react";
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
  const [edges, setEdges] = useState({ previous: false, next: false });

  useEffect(() => {
    const container = rail.current;
    if (!container) return;
    const update = () => {
      const previous = container.scrollLeft > 1;
      const next = container.scrollLeft < container.scrollWidth - container.clientWidth - 1;
      setEdges(current => current.previous === previous && current.next === next ? current : { previous, next });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    container.addEventListener("scroll", update, { passive: true });
    return () => {
      container.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [stories.length]);

  function scroll(direction: -1 | 1) {
    const container = rail.current;
    const first = container?.children[0];
    const second = container?.children[1];
    if (!container || !first || !second) return;
    const step = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    container.scrollBy({
      left: direction * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  const control = "grid size-11 shrink-0 place-items-center rounded-full border border-[#c8d8cc] bg-white text-[#163429] shadow-sm transition-colors hover:border-emerald-900 hover:bg-[#e7f0e9] disabled:cursor-default disabled:opacity-40 disabled:hover:border-[#c8d8cc] disabled:hover:bg-white";

  return (
    <section id="customer-stories" aria-labelledby="delivery-title" className="border-t border-[#dce7df] bg-[#f4f7f3] py-16 text-[#14251d] sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <header className="mx-auto max-w-2xl text-center">
            <h2 id="delivery-title" className="text-4xl font-extrabold leading-tight tracking-[-0.045em] sm:text-5xl">
              Customer <span className="text-emerald-900 underline decoration-[#a3c4ad] decoration-[3px] underline-offset-[7px]">delivery stories</span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-neutral-600 sm:text-base">A look at the moment riders collect their E-Luna.</p>
          </header>
        </Reveal>
        <div className="relative mx-auto mt-8 max-w-[1032px] sm:mt-12">
          <div
            id="delivery-gallery"
            ref={rail}
            tabIndex={0}
            role="region"
            aria-label="Delivery story gallery"
            className={`flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 [scrollbar-width:none] sm:gap-6 [&::-webkit-scrollbar]:hidden ${stories.length <= 3 ? "lg:justify-center" : ""}`}
          >
            {stories.map(story => (
              <article key={story.id} className="group flex w-[min(78vw,320px)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-[#dbe5dc] bg-white shadow-sm transition-shadow hover:shadow-md lg:w-[calc((100%_-_3rem)/3)]">
                <DeliveryPhoto key={story.imageUrl} story={story}/>
                <div className="relative mx-3 -mt-3 flex flex-1 flex-col rounded-t-xl border border-b-0 border-[#e3ebe4] bg-white px-4 pb-5 pt-4 sm:mx-4 sm:px-5">
                  <p className="text-sm leading-relaxed text-neutral-700">{story.testimonial}</p>
                  <div className="mt-auto pt-4">
                    <span aria-hidden="true" className="mb-3 block h-0.5 w-7 rounded-full bg-[#7ead8a] motion-safe:transition-[width] motion-safe:duration-300 motion-safe:group-hover:w-12"/>
                    <h3 className="text-base font-extrabold tracking-tight">{story.customerName}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-900"><MapPin size={14} aria-hidden="true"/>{story.location}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {(edges.previous || edges.next) && (
            <div className="mt-1 flex justify-center gap-2.5">
              <button type="button" aria-controls="delivery-gallery" aria-label="Previous stories" disabled={!edges.previous} onClick={() => scroll(-1)} className={control}><ArrowLeft size={19} aria-hidden="true"/></button>
              <button type="button" aria-controls="delivery-gallery" aria-label="Next stories" disabled={!edges.next} onClick={() => scroll(1)} className={control}><ArrowRight size={19} aria-hidden="true"/></button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DeliveryPhoto({ story }: { story: CustomerStory }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative grid aspect-[4/5] place-items-center bg-[#edf2ed]">
      {story.imageUrl && !failed ? (
        <img
          src={story.imageUrl}
          alt={story.isDemo ? "Illustrated E-Luna showroom handover" : `Showroom handover for ${story.customerName}`}
          width={800}
          height={1000}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-contain"
        />
      ) : (
        <p className="flex items-center gap-2 text-sm text-neutral-600"><ImageOff size={18} aria-hidden="true"/> Photo unavailable</p>
      )}
      {story.isDemo && <p className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#163429] shadow-sm">Demo · AI-generated photo</p>}
    </div>
  );
}
