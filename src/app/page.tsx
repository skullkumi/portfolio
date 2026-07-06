import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { CursorParticles } from "@/components/CursorParticles";
import { Footer } from "@/components/Footer";
import { GlobalAmbientBackground } from "@/components/GlobalAmbientBackground";
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { ServicesSection } from "@/components/ServicesSection";
import { ShadersSection } from "@/components/ShadersSection";
import { WorksSection } from "@/components/WorksSection";

export default function Home() {
  return (
    <>
      <GlobalAmbientBackground />
      <CursorParticles />
      <Navigation />
      <main className="relative z-10">
        <Hero />
        <ShadersSection />
        <WorksSection />
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
