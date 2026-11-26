"use client";

import Link from "next/link";
import { ArrowDown, ArrowDownRight, ArrowUpRight, CircleDot, Lamp, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import { Reveal } from "./reveal";
import { useSiteLanguage } from "./site-language";
import styles from "./home-bike-tour.module.css";

const chapters = [
  {
    id: "meet-e-luna", yaw: 90, mobileYaw: 90, offset: .20,
    label: { en: "Overview", ta: "அறிமுகம்" },
    title: { en: "Meet the E‑Luna.", ta: "E-Luna-வை அறிமுகம் செய்துகொள்ளுங்கள்." },
    text: { en: "An electric two-wheeler for commutes, errands and short trips around town.", ta: "வேலைக்குச் செல்லவும், அன்றாடத் தேவைகளுக்கும், நகரத்தின் குறுகிய பயணங்களுக்கும் ஏற்ற மின்சார இருசக்கர வாகனம்." },
    view: { en: "Full side view of the E-Luna", ta: "E-Luna-வின் முழுப் பக்கவாட்டுக் காட்சி" },
    link: { href: "/e-luna", en: "Explore the E-Luna range", ta: "E-Luna மாடல்களைப் பாருங்கள்" },
  },
  {
    id: "space-for-your-day", yaw: 90, mobileYaw: 90, offset: .11,
    label: { en: "Rider space", ta: "இடவசதி" },
    title: { en: "Space for your day.", ta: "அன்றாடத் தேவைகளுக்கான இடவசதி." },
    text: { en: "Two details to look for when you try the bike in person.", ta: "வாகனத்தை நேரில் பார்த்து ஓட்டும்போது இந்த இரண்டு அம்சங்களையும் கவனியுங்கள்." },
    view: { en: "Side profile of the E-Luna", ta: "E-Luna-வின் பக்கவாட்டுக் காட்சி" },
    details: [
      { title: { en: "Step-through frame", ta: "திறந்த கால் இடம்" }, text: { en: "An open space between the seat and handlebars.", ta: "இருக்கைக்கும் கைப்பிடிக்கும் இடையில் திறந்த இடம்." } },
      { title: { en: "Split seat", ta: "தனித்தனி இருக்கைகள்" }, text: { en: "Separate seat pads for the rider and passenger.", ta: "ஓட்டுநருக்கும் பின்பயணிக்கும் தனித்தனி இருக்கைகள்." } },
    ],
  },
  {
    id: "a-closer-look", yaw: 104, mobileYaw: 97, offset: -.20,
    label: { en: "Bike details", ta: "வாகன விவரங்கள்" },
    title: { en: "A closer look.", ta: "இன்னும் அருகிலிருந்து." },
    text: { en: "A slight turn shows how the headlamp and rear wheel sit in the bike’s frame.", ta: "சிறிய கோண மாற்றத்தில், முகப்பு விளக்கும் பின்சக்கரமும் சட்டகத்தில் எப்படி அமைந்துள்ளன என்று பாருங்கள்." },
    view: { en: "Side view of the E-Luna turned slightly toward the rear", ta: "பின்புறம் சற்றுத் திரும்பிய E-Luna-வின் பக்கவாட்டுக் காட்சி" },
    parts: [
      { icon: Lamp, en: "Headlamp", ta: "முகப்பு விளக்கு" },
      { icon: CircleDot, en: "Rear wheel", ta: "பின்சக்கரம்" },
    ],
    link: { href: "/e-luna#technical-specifications", en: "View specifications", ta: "விவரக்குறிப்புகளைப் பாருங்கள்" },
  },
  {
    id: "see-it-in-salem", yaw: 90, mobileYaw: 90, offset: 0,
    label: { en: "Test ride", ta: "சோதனை ஓட்டம்" },
    title: { en: "See it in Salem.", ta: "சேலத்தில் நேரில் பாருங்கள்." },
    text: { en: "Try the seating and handling for yourself at an ARS Motors showroom.", ta: "ARS Motors விற்பனை நிலையத்தில் இருக்கை வசதியையும் ஓட்டும் அனுபவத்தையும் நேரில் உணருங்கள்." },
    view: { en: "E-Luna in its final showroom pose", ta: "இறுதி விற்பனை நிலையக் காட்சியில் E-Luna" },
    link: { href: "/book-test-ride", en: "Book a test ride", ta: "சோதனை ஓட்டத்தைப் பதிவு செய்யுங்கள்" },
  },
];

type InteractiveScene = Awaited<ReturnType<typeof import("./home-bike-tour-scene").createBikeTourScene>>;
const lastChapter = chapters.length - 1;

export function HomeBikeTour() {
  const { language } = useSiteLanguage();
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const markers = markerRef.current;
    if (!track || !stage || !canvas || !markers || !window.IntersectionObserver || !window.ResizeObserver) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 58rem)");
    const panels = Array.from(track.querySelectorAll<HTMLElement>("[data-tour-panel]"));
    const dots = Array.from(track.querySelectorAll<HTMLElement>("[data-tour-dot]"));
    const controller = new AbortController();
    let scene: InteractiveScene | undefined;
    let visible = false;
    let starting = false;
    let frame = 0;
    let active = -1;

    const paint = () => {
      frame = 0;
      if (!visible || document.hidden || motion.matches) return;
      const stageBounds = stage.getBoundingClientRect();
      const trackBounds = track.getBoundingClientRect();
      if (!stageBounds.height || stageBounds.bottom < 0 || stageBounds.top > window.innerHeight) return;
      const progress = Math.max(0, Math.min(lastChapter, (stageBounds.top - trackBounds.top) / stageBounds.height));
      const index = Math.min(lastChapter - 1, Math.floor(progress));
      const from = chapters[index];
      const to = chapters[index + 1];
      const phase = progress - index;
      const ease = phase * phase * (3 - 2 * phase);
      const nearest = Math.round(progress);
      const offset = from.offset + (to.offset - from.offset) * ease;
      const mobile = compact.matches;
      const shift = mobile ? offset * .13 : offset * Math.min(1, 1500 / stageBounds.width);
      stage.style.setProperty("--bike-shift", `${shift * 100}%`);
      if (nearest !== active) {
        active = nearest;
        stage.dataset.chapter = String(active + 1);
        dots.forEach((dot, i) => dot.toggleAttribute("data-current", i === active));
      }
      panels.forEach((panel, i) => {
        const distance = progress - i;
        const current = Math.abs(distance) < .5;
        const fade = Math.max(0, Math.min(1, (.5 - Math.abs(distance)) / .38));
        const align = current ? stageBounds.top - panel.getBoundingClientRect().top : 0;
        panel.style.setProperty("--copy-opacity", String(fade * fade * (3 - 2 * fade)));
        panel.style.setProperty("--copy-travel", `${align + (current ? distance * -16 : 0)}px`);
        panel.toggleAttribute("data-tour-visible", current);
      });

      const initialYaw = mobile ? from.mobileYaw : from.yaw;
      const nextYaw = mobile ? to.mobileYaw : to.yaw;
      const yaw = initialYaw + (nextYaw - initialYaw) * ease;
      const markerOpacity = Math.max(0, 1 - Math.abs(progress - 1) * 4);
      markers.style.opacity = String(markerOpacity);
      scene?.draw(yaw, shift, mobile, markerOpacity > 0);
    };

    const schedule = () => {
      if (visible && !document.hidden && !motion.matches && !frame) frame = requestAnimationFrame(paint);
    };

    const resetCopy = () => {
      for (const panel of panels) {
        panel.style.removeProperty("--copy-opacity");
        panel.style.removeProperty("--copy-travel");
        panel.removeAttribute("data-tour-visible");
      }
    };

    const fail = () => {
      delete track.dataset.live;
      markers.style.opacity = "0";
      resetCopy();
    };

    const start = async () => {
      if (starting || scene || motion.matches || controller.signal.aborted) return;
      starting = true;
      try {
        const { createBikeTourScene } = await import("./home-bike-tour-scene");
        if (controller.signal.aborted || motion.matches) return;
        const result = await createBikeTourScene(canvas, markers, controller.signal, fail);
        if (controller.signal.aborted) {
          result.dispose();
          return;
        }
        scene = result;
        if (!motion.matches) {
          track.dataset.live = "";
          schedule();
        }
      } catch {
        if (!controller.signal.aborted) fail();
      } finally {
        starting = false;
      }
    };

    const nearing = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void start();
    }, { rootMargin: "400px 0px" });
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) void start();
      schedule();
    });
    const resize = new ResizeObserver(schedule);

    const motionChange = () => {
      if (motion.matches) {
        delete track.dataset.live;
        resetCopy();
      } else if (scene?.available()) {
        track.dataset.live = "";
        schedule();
      } else if (visible) void start();
    };

    nearing.observe(track);
    visibility.observe(track);
    resize.observe(stage);
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", motionChange);
    return () => {
      controller.abort();
      nearing.disconnect();
      visibility.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", schedule);
      motion.removeEventListener("change", motionChange);
      cancelAnimationFrame(frame);
      scene?.dispose();
      delete track.dataset.live;
      resetCopy();
    };
  }, []);

  const tamil = language === "ta";

  return (
    <section id="360-studio" aria-labelledby="bike-tour-title" className={styles.tour}>
      <Reveal className={styles.intro}>
        <div>
          <p className={styles.eyebrow}>{tamil ? "360° காட்சியகம்" : "The 360° studio"}</p>
          <h2 id="bike-tour-title">{tamil ? "இயக்கத்தில் E‑Luna" : "E‑Luna in Motion"}</h2>
          <p>{tamil ? "அன்றாடப் பயணத்துக்கான வாகனத்தைப் பல கோணங்களில் பாருங்கள்." : "Take a closer look at your everyday ride."}</p>
        </div>
        <a href="#after-bike-tour" className={styles.skip}>
          {tamil ? "3D காட்சியைத் தவிர்க்கவும்" : "Skip 3D tour"}<ArrowDown size={15} aria-hidden="true"/>
        </a>
      </Reveal>

      <nav className={styles.chapterNav} aria-label={tamil ? "3D காட்சிப் பகுதிகள்" : "3D tour chapters"}>
        {chapters.map(chapter => <a key={chapter.id} href={`#bike-tour-${chapter.id}`}>{chapter.label[language]}</a>)}
      </nav>

      <div ref={trackRef} className={styles.track}>
        <div ref={stageRef} className={styles.stage} aria-hidden="true">
          <div className={styles.glow}/>
          <div className={styles.art}>
            <div className={styles.floor} />
            <div ref={canvasRef} className={styles.canvas} />
            <div ref={markerRef} className={styles.markers}>
              <span>1</span><span>2</span>
            </div>
          </div>
          <div className={styles.progress}>
            {chapters.map((chapter, i) => <span key={chapter.title.en} data-tour-dot data-current={i === 0 ? "" : undefined}/>)}
          </div>
        </div>

        <div className={styles.chapters}>
          {chapters.map((chapter, i) => (
            <article key={chapter.id} id={`bike-tour-${chapter.id}`} data-tour-panel className={styles.panel}>
              <div className={styles.still}>
                <img src={chapter.parts ? "/3d/tour-detail.webp" : "/3d/tour-side.webp"} alt={chapter.view[language]} width={900} height={660} loading="lazy"/>
              </div>
              <div className={styles.copy}>
                <h3>{chapter.title[language]}</h3>
                <p>{chapter.text[language]}</p>
                {chapter.details && (
                  <ol className={styles.features}>
                    {chapter.details.map((detail, index) => (
                      <li key={detail.title.en}>
                        <span aria-hidden="true">{index + 1}</span>
                        <div><strong>{detail.title[language]}</strong><small>{detail.text[language]}</small></div>
                      </li>
                    ))}
                  </ol>
                )}
                {chapter.parts && (
                  <ul className={styles.parts}>
                    {chapter.parts.map(({ icon: Icon, ...part }) => <li key={part.en}><Icon size={16} aria-hidden="true"/>{part[language]}</li>)}
                  </ul>
                )}
                {chapter.link && (
                  <div className={styles.actions}>
                    <Link href={chapter.link.href} className={i === lastChapter ? styles.primary : styles.secondary}>
                      {chapter.link[language]}
                      {i === lastChapter ? <ArrowDownRight size={18} aria-hidden="true"/> : <ArrowUpRight size={17} aria-hidden="true"/>}
                    </Link>
                    {i === lastChapter && (
                      <Link href="/showrooms" className={styles.showrooms}>
                        <MapPin size={15} aria-hidden="true"/>
                        {tamil ? "சேலம் விற்பனை நிலையங்களைப் பாருங்கள்" : "See Salem showrooms"}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
      <div id="after-bike-tour" tabIndex={-1} className={styles.end} aria-label={tamil ? "3D காட்சியின் முடிவு" : "End of 3D tour"} />
    </section>
  );
}
