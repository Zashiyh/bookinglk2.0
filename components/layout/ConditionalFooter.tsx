"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer/footer";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // footer blocked
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}