import { Footer } from "@/components/footer/footer";
import { HeroSection } from "@/components/hero/hero-section";
import { Navbar } from "@/components/navbar/navbar";

export default function HomePage() {
  return (
    <main>
      <Navbar />

      <HeroSection />

      <section className="bg-[var(--background)] py-24">
        <div className="container-booking">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">
              BookingLK
            </p>

            <h2 className="mt-4 font-[var(--font-manrope)] text-3xl font-extrabold tracking-tight sm:text-5xl">
              Your journey starts here.
            </h2>

            <p className="mt-5 text-[var(--muted)]">
              Explore remarkable places, discover beautiful stays
              and book your next Sri Lankan escape with confidence.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}