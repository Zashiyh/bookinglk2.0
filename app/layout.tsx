import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookingLK",
  description:
    "Discover and book beautiful stays across Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`
          ${manrope.variable}
          ${inter.variable}
          min-h-screen
          bg-[var(--background)]
          text-[var(--foreground)]
          antialiased
        `}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}