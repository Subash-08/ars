"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { VariantType } from "./eluna-3d-canvas";

const Studio = dynamic(() => import("./viewer-360").then(m => m.Viewer360), { ssr: false });

export function ProductStudio({ variant, preview = "/assets/bikes/studio-yellow-hd.jpg" }: {
  variant?: VariantType;
  preview?: string;
}) {
  const section = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!section.current || !window.IntersectionObserver) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setReady(true);
        observer.disconnect();
      }
    }, { rootMargin: "320px" });
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={section} id="360-studio" className="border-t border-neutral-200 bg-[#f4f5f3]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-14 pb-7 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">The 360° studio</p>
        <h2 className="mt-4 text-3xl sm:text-4xl font-medium tracking-tight">Every angle. At your own pace.</h2>
        <p className="mt-4 mx-auto max-w-xl text-sm text-neutral-600">
          Rotate the illustrative model, explore finishes and switch lighting. Confirm the exact vehicle and available colours with the showroom.
        </p>
      </div>
      {ready ? <Studio lang="en" fixedVariant={variant} embedded/> : (
        <div className="max-w-7xl mx-auto px-5 sm:px-8 pb-12">
          <img src={preview} alt="Vehicle studio preview" width={900} height={560}
            className="w-full h-[440px] sm:h-[560px] object-contain rounded-3xl bg-white" loading="lazy"/>
        </div>
      )}
    </section>
  );
}
