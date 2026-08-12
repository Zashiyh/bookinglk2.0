import { Navbar } from "@/components/navbar/navbar";

import AboutHero from "@/components/about/AboutHero";
import AboutStats from "@/components/about/AboutStats";
import AboutMission from "@/components/about/AboutMission";
import AboutFeatures from "@/components/about/AboutFeatures";
import AboutValues from "@/components/about/AboutValues";
import AboutCTA from "@/components/about/AboutCTA";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900 dark:bg-[#050505] dark:text-white">
      <Navbar />

      <AboutHero />

      <AboutStats />

      <AboutMission />

      <AboutFeatures />

      <AboutValues />

      <AboutCTA />
    </main>
  );
}