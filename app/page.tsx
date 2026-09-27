import HeroSection from "@/components/HeroSection";
import DeviceSelectorSection from "@/components/DeviceSelectorSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import Grainient from "@/components/Grainient";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0908] text-[#faf7f2] font-sans antialiased selection:bg-[#FCAD38] selection:text-[#0a0908]">
      {/* Hero Section (with HeroBeams background) */}
      <HeroSection />

      {/* Website Body below Hero with Grainient as the overall background */}
      <div className="relative w-full min-h-screen overflow-hidden">
        {/* Grainient Animated Background */}
        <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
          <Grainient
            color1="#000000"
            color2="#fcad38"
            color3="#000000"
            timeSpeed={0.7}
            colorBalance={-0.01}
            warpStrength={1}
            warpFrequency={5.3}
            warpSpeed={2.4}
            warpAmplitude={49}
            blendAngle={116}
            blendSoftness={0.05}
            rotationAmount={830}
            noiseScale={2.55}
            grainAmount={0.32}
            grainScale={2}
            grainAnimated={false}
            contrast={1.2}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
        </div>

        {/* Non-Hero Content Sections */}
        <div className="relative z-10">
          <DeviceSelectorSection />
          <HowItWorksSection />
          <CtaSection />
          <Footer />
        </div>
      </div>
    </main>
  );
}
