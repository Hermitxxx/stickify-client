"use client";

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const Beams = dynamic(() => import('./Beams'), { ssr: false });

interface HeroBeamsProps {
  className?: string;
}

export default function HeroBeams({ className = "" }: HeroBeamsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <Beams
        active={isVisible}
        beamWidth={3}
        beamHeight={30}
        beamNumber={18}
        lightColor="#FCAD38"
        beamColor="#000000"
        backgroundColor="#0a0908"
        speed={1.8}
        noiseIntensity={1.5}
        scale={0.2}
        rotation={30}
      />
    </div>
  );
}
