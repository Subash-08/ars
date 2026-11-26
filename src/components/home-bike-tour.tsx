"use client";

import Link from "next/link";
import { ArrowDown, ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import { Reveal } from "./reveal";
import { useSiteLanguage } from "./site-language";
import styles from "./home-bike-tour.module.css";

type Localized = { en: string; ta: string };
type Feature = { value: Localized; label: Localized; description?: Localized; unit?: Localized; pin?: number };
type Chapter = {
  id: string;
  yaw: number;
  shift: number;
  label: Localized;
  title: Localized;
  text: Localized;
  view: Localized;
  features?: Feature[];
  note?: Localized;
  pins?: "frame" | "lights";
  link?: { href: string; en: string; ta: string };
};

const chapters: Chapter[] = [
  {
    id: "meet-e-luna", yaw: 0, shift: .17,
    label: { en: "Front view", ta: "முன்புறம்" },
    title: { en: "Meet the E‑Luna.", ta: "E‑Luna அறிமுகம்" },
    text: { en: "Get a clear look at the headlamp and mirrors, then compare the E‑Luna models for your daily ride.", ta: "முன்புற விளக்கையும் கண்ணாடிகளையும் பாருங்கள். உங்கள் அன்றாடப் பயணத்துக்கு ஏற்ற E‑Luna மாடல்களை ஒப்பிடுங்கள்." },
    view: { en: "Front view of the E-Luna", ta: "E-Luna-வின் முன்புறக் காட்சி" },
    features: [
      { value: { en: "110", ta: "110" }, unit: { en: "km", ta: "கி.மீ." }, label: { en: "Listed range", ta: "பட்டியலிட்ட பயணத் தூரம்" } },
      { value: { en: "50", ta: "50" }, unit: { en: "km/h", ta: "கி.மீ./மணி" }, label: { en: "Listed top speed", ta: "பட்டியலிட்ட அதிகபட்ச வேகம்" } },
    ],
    note: { en: "PRO X3 catalogue figures. Confirm the exact configuration with the showroom.", ta: "இவை PRO X3 பட்டியல் விவரங்கள். சரியான வாகன அமைப்பை விற்பனை நிலையத்தில் உறுதிசெய்யுங்கள்." },
    link: { href: "/e-luna", en: "Compare E-Luna models", ta: "E-Luna மாடல்களை ஒப்பிடுங்கள்" },
  },
  {
    id: "space-for-your-day", yaw: 90, shift: 0,
    label: { en: "First side", ta: "ஒரு பக்கம்" },
    title: { en: "Room to ride.", ta: "வசதியான பயணம்" },
    text: { en: "The full side view shows the space between the seat and handlebars.", ta: "இருக்கைக்கும் கைப்பிடிக்கும் இடையிலான இடத்தைப் பக்கவாட்டில் பார்க்கலாம்." },
    view: { en: "Full side profile of the E-Luna", ta: "E-Luna-வின் முழுப் பக்கவாட்டுக் காட்சி" },
    pins: "frame",
    features: [
      { value: { en: "Open", ta: "திறந்த" }, label: { en: "Step-through frame", ta: "கால் இடம்" }, description: { en: "A low, open space to step through when getting on or off.", ta: "ஏறி இறங்க உதவும் தாழ்வான, திறந்த கால் இடம்." }, pin: 1 },
      { value: { en: "Split", ta: "தனித்தனி" }, label: { en: "Seat layout", ta: "இருக்கைகள்" }, description: { en: "Separate seat pads for the rider and passenger.", ta: "ஓட்டுநருக்கும் பின்பயணிக்கும் தனித்தனி இருக்கைகள்." }, pin: 2 },
    ],
  },
  {
    id: "a-closer-look", yaw: 180, shift: -.17,
    label: { en: "Rear view", ta: "பின்புறம்" },
    title: { en: "See the rear details.", ta: "பின்புற விவரங்கள்" },
    text: { en: "The rear angle brings the tail lamp and wheel assembly into view.", ta: "பின்புறக் கோணத்தில் விளக்கும் சக்கர அமைப்பும் தெளிவாகத் தெரியும்." },
    view: { en: "Rear view of the E-Luna", ta: "E-Luna-வின் பின்புறக் காட்சி" },
    pins: "lights",
    features: [
      { value: { en: "Tail lamp", ta: "பின் விளக்கு" }, label: { en: "Rear lighting", ta: "பின்புற ஒளி" }, description: { en: "The red lamp sits below the rear seat, with indicators on either side.", ta: "சிவப்பு விளக்கு பின் இருக்கைக்குக் கீழே உள்ளது. இருபுறமும் திருப்ப விளக்குகள் உள்ளன." }, pin: 1 },
      { value: { en: "Mudguard", ta: "சேற்றுத் தடுப்பு" }, label: { en: "Rear wheel cover", ta: "பின்சக்கரக் கவசம்" }, description: { en: "The mudguard wraps over the rear wheel below the lights.", ta: "விளக்குகளுக்குக் கீழே, பின்சக்கரத்தின் மேல் சேற்றுத் தடுப்பு உள்ளது." }, pin: 2 },
    ],
    link: { href: "/e-luna#technical-specifications", en: "View specifications", ta: "விவரக்குறிப்புகளைப் பாருங்கள்" },
  },
  {
    id: "see-it-in-salem", yaw: 270, shift: 0,
    label: { en: "Opposite side", ta: "மறுபக்கம்" },
    title: { en: "Try it in Salem.", ta: "சேலத்தில் ஓட்டிப் பாருங்கள்" },
    text: { en: "Try the seating and handling, then ask our team about the configuration and on-road quote.", ta: "இருக்கை வசதியையும் ஓட்டும் அனுபவத்தையும் அறிந்து, மாடல் மற்றும் முழு விலையை எங்கள் குழுவிடம் கேளுங்கள்." },
    view: { en: "Opposite side profile of the E-Luna", ta: "E-Luna-வின் மறுபக்கக் காட்சி" },
    link: { href: "/book-test-ride", en: "Book a test ride", ta: "சோதனை ஓட்டம் பதிவு செய்யுங்கள்" },
  },
];

const showrooms = [
  { id: "seelanaickenpatti", en: "Seelanaickenpatti", ta: "சீலநாயக்கன்பட்டி" },
  { id: "madathur", en: "Madathur", ta: "மாதத்தூர்" },
];
type InteractiveScene = Awaited<ReturnType<typeof import("./home-bike-tour-scene").createBikeTourScene>>;
const lastChapter = chapters.length - 1;

function smoothStep(start: number, end: number, value: number) {
  const phase = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return phase * phase * (3 - 2 * phase);
}

function FeatureStat({ feature, language }: { feature: Feature; language: keyof Localized }) {
  return (
    <dl className={styles.stat} data-feature={feature.pin ? "" : undefined}>
      <dt>{feature.label[language]}</dt>
      <dd className={styles.statValue}>
        {feature.pin && <span className={styles.pinIndex} aria-hidden="true">{feature.pin}</span>}
        <span>{feature.value[language]}</span>
        {feature.unit && <small>{feature.unit[language]}</small>}
      </dd>
      {feature.description && <dd className={styles.statText}>{feature.description[language]}</dd>}
    </dl>
  );
}

function ChapterCopy({ chapter, language }: { chapter: Chapter; language: keyof Localized }) {
  const isFinal = chapter === chapters[lastChapter];
  return (
    <div className={styles.copy}>
      <div className={styles.lead}>
        <h3>{chapter.title[language]}</h3>
        <p>{chapter.text[language]}</p>
        {chapter.link && (
          <Link href={chapter.link.href} className={isFinal ? styles.primary : styles.secondary}>
            {chapter.link[language]}
            {isFinal ? <ArrowDownRight size={18} aria-hidden="true"/> : <ArrowUpRight size={17} aria-hidden="true"/>}
          </Link>
        )}
      </div>
      {chapter.features && (
        <>
          <div className={styles.firstStat}><FeatureStat feature={chapter.features[0]} language={language}/></div>
          <div className={styles.context}><FeatureStat feature={chapter.features[1]} language={language}/></div>
          {chapter.note && <p className={styles.note}>{chapter.note[language]}</p>}
        </>
      )}
      {isFinal && (
        <div className={styles.context}>
          <p className={styles.branchTitle}>{language === "ta" ? "சேலம் விற்பனை நிலையங்கள்" : "Salem showrooms"}</p>
          <ul className={styles.branches}>
            {showrooms.map(branch => (
              <li key={branch.id}>
                <Link href={`/showrooms#${branch.id}`}>
                  <MapPin size={16} aria-hidden="true"/>{branch[language]}<ArrowUpRight size={15} aria-hidden="true"/>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

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
    if (!track || !stage || !canvas || !markers) return;
    if (!window.IntersectionObserver || !window.ResizeObserver) {
      track.dataset.static = "";
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 58rem)");
    const shortScreen = window.matchMedia("(max-width: 58rem) and (max-height: 670px), (max-height: 590px)");
    const useStills = () => motion.matches || shortScreen.matches;
    const cards = Array.from(stage.querySelectorAll<HTMLElement>("[data-tour-card]"));
    const views = Array.from(track.querySelectorAll<HTMLElement>("[data-tour-view]"));
    const controller = new AbortController();
    let scene: InteractiveScene | undefined;
    let visible = false;
    let starting = false;
    let frame = 0;
    let active = -1;

    const paint = () => {
      frame = 0;
      if (!visible || document.hidden || useStills() || !scene?.available()) return;
      const stageBounds = stage.getBoundingClientRect();
      const trackBounds = track.getBoundingClientRect();
      if (!stageBounds.height || stageBounds.bottom < 0 || stageBounds.top > window.innerHeight) return;
      const chapterSpan = (trackBounds.height - stageBounds.height) / lastChapter;
      const progress = Math.min(lastChapter, Math.max(0, stageBounds.top - trackBounds.top) / Math.max(1, chapterSpan));
      const index = Math.min(lastChapter - 1, Math.floor(progress));
      const from = chapters[index];
      const to = chapters[index + 1];
      const phase = progress - index;
      const ease = smoothStep(.14, .86, phase);
      const nearest = Math.round(progress);
      const mobile = compact.matches;
      const travel = mobile ? .18 : Math.min(1, 1600 / stageBounds.width);
      // Give both text rails clearance while the full side profile is visible.
      const slide = from.shift === 0 ? smoothStep(.3, .84, phase) : smoothStep(.16, .7, phase);
      const shift = (from.shift + (to.shift - from.shift) * slide) * travel;
      stage.style.setProperty("--bike-offset", `${shift * 100}%`);
      if (nearest !== active) {
        const previousCard = cards[active];
        if (previousCard) {
          previousCard.removeAttribute("data-tour-visible");
          previousCard.setAttribute("inert", "");
        }
        active = nearest;
        cards[active].setAttribute("data-tour-visible", "");
        stage.dataset.chapter = String(active + 1);
        views.forEach((view, i) => view.toggleAttribute("data-current", i === active));
      }
      const distance = Math.abs(progress - nearest);
      const fade = 1 - smoothStep(.32, .5, distance);
      cards[active].style.setProperty("--copy-opacity", String(fade));
      cards[active].toggleAttribute("inert", fade < .6);

      const yaw = from.yaw + (to.yaw - from.yaw) * ease;
      const pins = chapters[nearest].pins;
      const markerOpacity = pins ? 1 - smoothStep(.14, .31, distance) : 0;
      markers.style.opacity = String(markerOpacity);
      scene.draw(yaw, shift, mobile, markerOpacity > 0 ? pins : undefined);
      if (!track.hasAttribute("data-live")) track.dataset.live = "";
    };

    const schedule = () => {
      if (visible && !document.hidden && !useStills() && !frame) frame = requestAnimationFrame(paint);
    };

    const resetCopy = () => {
      active = -1;
      for (const card of cards) {
        card.style.removeProperty("--copy-opacity");
        card.removeAttribute("data-tour-visible");
        card.setAttribute("inert", "");
      }
    };

    const fail = () => {
      delete track.dataset.live;
      track.dataset.static = "";
      markers.style.opacity = "0";
      resetCopy();
    };

    const start = async () => {
      if (starting || scene || useStills() || controller.signal.aborted || track.hasAttribute("data-static")) return;
      starting = true;
      try {
        const { createBikeTourScene } = await import("./home-bike-tour-scene");
        if (controller.signal.aborted || useStills()) return;
        const result = await createBikeTourScene(canvas, markers, controller.signal, fail);
        if (controller.signal.aborted) {
          result.dispose();
          return;
        }
        scene = result;
        schedule();
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
      if (useStills()) {
        delete track.dataset.live;
        resetCopy();
      } else if (scene?.available()) schedule();
      else if (visible) void start();
    };

    nearing.observe(track);
    visibility.observe(track);
    resize.observe(stage);
    window.addEventListener("scroll", schedule, { passive: true });
    document.addEventListener("visibilitychange", schedule);
    motion.addEventListener("change", motionChange);
    shortScreen.addEventListener("change", motionChange);
    return () => {
      controller.abort();
      nearing.disconnect();
      visibility.disconnect();
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      document.removeEventListener("visibilitychange", schedule);
      motion.removeEventListener("change", motionChange);
      shortScreen.removeEventListener("change", motionChange);
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
          <p>{tamil ? "முன்புறம், பின்புறம், இரு பக்கங்களையும் பார்க்க உருட்டுங்கள் அல்லது ஒரு கோணத்தைத் தேர்வுசெய்யுங்கள்." : "Scroll to turn the bike, or jump to any of the four views."}</p>
        </div>
        <a href="#after-bike-tour" className={styles.skip}>
          {tamil ? "3D காட்சியைத் தவிர்க்கவும்" : "Skip 3D tour"}<ArrowDown size={15} aria-hidden="true"/>
        </a>
      </Reveal>

      <nav className={styles.chapterNav} aria-label={tamil ? "3D காட்சிப் பகுதிகள்" : "3D tour chapters"}>
        {chapters.map(chapter => <a key={chapter.id} href={`#bike-tour-${chapter.id}`}>{chapter.label[language]}</a>)}
      </nav>

      <div ref={trackRef} className={styles.track} data-bike-tour-track>
        <div className={styles.chapters}>
          {chapters.map(chapter => (
            <article key={chapter.id} id={`bike-tour-${chapter.id}`} tabIndex={-1} className={styles.panel}>
              <div className={styles.fallback}>
                <div className={styles.still}>
                  <img src={`/3d/tour-${chapter.id}.webp`} alt={chapter.view[language]} width={900} height={660} loading="lazy"/>
                </div>
                <ChapterCopy chapter={chapter} language={language}/>
              </div>
            </article>
          ))}
        </div>

        <div ref={stageRef} className={styles.stage}>
          <div className={styles.glow} aria-hidden="true"/>
          <div className={styles.art} aria-hidden="true">
            <div className={styles.floor} />
            <div ref={canvasRef} className={styles.canvas} />
            <div ref={markerRef} className={styles.markers}>
              <span>1</span><span>2</span>
            </div>
          </div>
          <div className={styles.progress} aria-hidden="true">
            {chapters.map((chapter, i) => (
              <span key={chapter.id} data-tour-view data-current={i === 0 ? "" : undefined}>{chapter.label[language]}</span>
            ))}
          </div>
          <div className={styles.overlay}>
            {chapters.map(chapter => (
              <article key={chapter.id} className={styles.stageCard} data-tour-card
                data-layout={chapter.shift > 0 ? "bike-right" : chapter.shift < 0 ? "bike-left" : "center"}>
                <ChapterCopy chapter={chapter} language={language}/>
              </article>
            ))}
          </div>
        </div>
      </div>
      <div id="after-bike-tour" tabIndex={-1} className={styles.end} aria-label={tamil ? "3D காட்சியின் முடிவு" : "End of 3D tour"} />
    </section>
  );
}
