"use client";
import { Copy, useCopy } from "@/components/site-language";

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
              <h2 id="testimonials-title"><Copy>{"What riders care about"}</Copy></h2>
              <p><Copy>{testimonials.every(story => story.isDemo) ? "Example stories from everyday E-Luna riders." : "Everyday journeys, in riders’ own words."}</Copy></p>
            </header>
          </Reveal>
          <div className={styles.grid}>
            {testimonials.map((story, index) => <Reveal key={story.id} delay={index % 3 * 85}>
              <figure className={styles.card}>
                <blockquote className={styles.bubble}>
                  <p><Copy>{story.testimonial}</Copy></p>
                </blockquote>
                <figcaption className={styles.caption}>
                  <Avatar story={story}/>
                  <div>
                    <strong>{story.customerName}</strong>
                    <p><Copy>{story.location}</Copy>{story.isDemo && <> · <Copy>{"Demo quote"}</Copy></>}</p>
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
  const copy = useCopy();
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
    const step = second instanceof HTMLElement && first instanceof HTMLElement
      ? second.offsetLeft - first.offsetLeft
      : container.clientWidth;
    container.scrollBy({
      left: direction * step,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  const control = "grid size-11 shrink-0 place-items-center rounded-full border border-[#c8d8cc] bg-white text-[#163429] shadow-sm transition-colors hover:border-emerald-900 hover:bg-[#e7f0e9] disabled:cursor-default disabled:opacity-40 disabled:hover:border-[#c8d8cc] disabled:hover:bg-white";

  return (
    <section id="customer-stories" aria-labelledby="delivery-title" className="border-t border-[#dce7df] bg-gradient-to-b from-[#f1f5f0] to-white py-16 text-[#14251d] sm:py-24">
      <div className="mx-auto max-w-[90rem] px-5 sm:px-12 lg:px-14">
        <Reveal>
          <header className="mx-auto max-w-2xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#ceddd0] bg-[#e6eee6] px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-800"/><Copy>{"Happy riders"}</Copy>
            </p>
            <h2 id="delivery-title" className="text-4xl font-extrabold leading-tight tracking-[-0.045em] sm:text-5xl">
              <span className="decoration-[#a3c4ad] decoration-[3px] underline-offset-[7px] sm:underline"><Copy>{"Customer delivery stories"}</Copy></span>
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-neutral-600 sm:text-base"><Copy>{"A look at the moment riders collect their E-Luna."}</Copy></p>
          </header>
        </Reveal>
        <div className="relative mx-auto mt-8 max-w-[82rem] sm:mt-12">
          <div
            id="delivery-gallery"
            ref={rail}
            tabIndex={0}
            role="region"
            aria-label={copy("Delivery story gallery")}
            className={`relative flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 pt-2 [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden ${stories.length <= 3 ? "xl:justify-center" : ""}`}
          >
            {stories.map((story, index) => (
              <Reveal key={story.id} observeVisible delay={index % 3 * 80}
                className={`w-[min(86vw,350px)] shrink-0 snap-start sm:w-[320px] ${stories.length <= 3 ? "xl:w-[calc((100%_-_2.5rem)/3)] xl:max-w-[370px]" : "lg:w-[max(285px,calc((100%_-_3.75rem)/4))]"}`}>
                <article className="group relative isolate flex h-full min-h-[390px] flex-col justify-end overflow-hidden rounded-xl bg-[#294338] shadow-md ring-1 ring-inset ring-black/10 motion-safe:transition motion-safe:duration-300 motion-safe:hover:-translate-y-1.5 sm:aspect-[3/4] sm:min-h-[420px]">
                  <DeliveryPhoto key={story.imageUrl} story={story}/>
                  <div className="relative z-10 bg-gradient-to-t from-[#091510] via-[#091510]/90 to-transparent px-4 pb-4 pt-12 text-white sm:px-5">
                    <blockquote className="mb-3 text-xs font-medium leading-relaxed sm:text-sm">“<Copy>{story.testimonial}</Copy>”</blockquote>
                    <h3 className="text-lg font-extrabold leading-snug">{story.customerName}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#bbdfc6]"><MapPin size={14} aria-hidden="true"/><Copy>{story.location}</Copy></p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          {(edges.previous || edges.next) && (
            <div className="mt-1 flex justify-center gap-2.5 sm:pointer-events-none sm:absolute sm:inset-x-[-26px] sm:top-1/2 sm:mt-0 sm:-translate-y-1/2 sm:justify-between">
              <button type="button" aria-controls="delivery-gallery" aria-label={copy("Previous stories")} disabled={!edges.previous} onClick={() => scroll(-1)} className={`${control} sm:pointer-events-auto`}><ArrowLeft size={19} aria-hidden="true"/></button>
              <button type="button" aria-controls="delivery-gallery" aria-label={copy("Next stories")} disabled={!edges.next} onClick={() => scroll(1)} className={`${control} sm:pointer-events-auto`}><ArrowRight size={19} aria-hidden="true"/></button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DeliveryPhoto({ story }: { story: CustomerStory }) {
  const copy = useCopy();
  const [failed, setFailed] = useState(false);
  return (
    <div className="absolute inset-0 grid place-items-center">
      {story.imageUrl && !failed ? (
        <img
          src={story.imageUrl}
          alt={story.isDemo ? copy("Illustrated E-Luna showroom handover") : copy("Showroom handover for {name}").replace("{name}", story.customerName)}
          width={800}
          height={1000}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover object-[center_42%] motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.035]"
        />
      ) : (
        <p className="mb-20 flex items-center gap-2 text-sm text-white"><ImageOff size={18} aria-hidden="true"/>{" "}<Copy>{"Photo unavailable"}</Copy></p>
      )}
      {story.isDemo && <p className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#163429] shadow-sm"><Copy>{"Demo · AI-generated photo"}</Copy></p>}
    </div>
  );
}
