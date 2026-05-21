"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export default function GlobeMinimal() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [globeConfig, setGlobeConfig] = useState<any>(null);

  useEffect(() => {
    setGlobeConfig({
      pointOfView: { lat: 19.7008, lng: -101.186 },
      globeImageUrl:
        "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
      backgroundColor: "#ffffff00",
      showAtmosphere: true,
      atmosphereColor: "#17cf17",
      atmosphereAltitude: 0.08,
      markers: [
        {
          lat: 19.7008,
          lng: -101.186,
          size: 0.12,
          color: "#17cf17",
        },
      ],
    });
  }, []);

  if (!globeConfig) return null;

  return (
    <div className="w-full h-[260px] flex justify-center items-center">
      <Globe
        width={300}
        height={260}
        showGlobe={true}
        showGraticules={false}
        {...globeConfig}
        markerAltitude={0.08}
        markerResolution={12}
      />
    </div>
  );
}
