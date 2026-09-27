"use client";

import dynamic from 'next/dynamic';

const Beams = dynamic(() => import('./Beams'), { ssr: false });

interface HeroBeamsProps {
  className?: string;
}

export default function HeroBeams({ className = "" }: HeroBeamsProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <Beams
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
