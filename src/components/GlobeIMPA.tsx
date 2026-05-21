"use client";

import { useEffect, useRef } from "react";
// @ts-expect-error - three has no types in this setup
import * as THREE from "three";
// @ts-expect-error - vanta has no types
import GLOBE from "vanta/dist/vanta.globe.min";

export default function GlobeIMPA() {
  const ref = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effect = useRef<any>(null);

  useEffect(() => {
    if (!effect.current && ref.current) {
      effect.current = GLOBE({
        el: ref.current,
        THREE,
        color: 0x17cf17,
        color2: 0x11a611,
        backgroundColor: 0xf6f8f6,
        size: 1.05,
        points: 12.0,
        maxDistance: 22.0,
      });
    }
    return () => {
      effect.current?.destroy();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="w-full h-[350px] md:h-[450px] rounded-2xl shadow-impa-md border border-impa-line"
    />
  );
}
