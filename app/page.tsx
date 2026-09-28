import HeroSection from "@/components/HeroSection";
import DeviceSelectorSection from "@/components/DeviceSelectorSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import Grainient from "@/components/Grainient";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0a0908] text-[#faf7f2] font-sans antialiased selection:bg-[#FCAD38] selection:text-[#0a0908]">
      {/* Full-Website Grainient Animated Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <Grainient
          color1="#000000"
          color2="#EAB308"
          color3="#000000"
          timeSpeed={0.25}
          colorBalance={-0.08}
          warpStrength={1}
          warpFrequency={5}
          warpSpeed={2}
          warpAmplitude={50}
          blendAngle={3}
          blendSoftness={0.05}
          rotationAmount={500}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={2}
          grainAnimated={false}
          contrast={1.5}
          gamma={1}
          saturation={1}
          centerX={0}
          centerY={0}
          zoom={0.9}
        />
      </div>

      {/* Website Content Sections */}
      <div className="relative z-10">
        <HeroSection />
        <DeviceSelectorSection />
        <HowItWorksSection />
        <CtaSection />
        <Footer />
      </div>
    </main>
  );
}
