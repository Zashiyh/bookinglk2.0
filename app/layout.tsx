import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";

import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BookingLK — Discover Sri Lanka. Stay Your Way.",
    template: "%s | BookingLK",
  },

  description:
    "Discover hotels, resorts, villas, apartments and unique stays across Sri Lanka with BookingLK.",

  keywords: [
    "Sri Lanka hotels",
    "Sri Lanka hotel booking",
    "Kandy hotels",
    "Colombo hotels",
    "Ella hotels",
    "Galle hotels",
    "BookingLK",
  ],

  applicationName: "BookingLK",

  openGraph: {
    title: "BookingLK — Discover Sri Lanka. Stay Your Way.",
    description:
      "Find your perfect stay anywhere in Sri Lanka.",
    type: "website",
    locale: "en_LK",
    siteName: "BookingLK",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}