import { Navbar } from "@/components/navbar/navbar";

import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactFAQ from "@/components/contact/ContactFAQ";
import ContactCTA from "@/components/contact/ContactCTA";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-900 dark:bg-[#050505] dark:text-white">
      <Navbar />

      <ContactHero />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12">
          <ContactInfo />

          <ContactForm />
        </div>
      </section>

      <ContactFAQ />

      <ContactCTA />
    </main>
  );
}