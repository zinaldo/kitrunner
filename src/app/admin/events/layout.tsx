import type { ReactNode } from "react";
import { Lexend, Plus_Jakarta_Sans } from "next/font/google";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-uptempo-headline",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-uptempo-body",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/**
 * Page-scoped shell for `/admin/events`: Stitch uptempo tokens + Lexend / Plus Jakarta.
 * Isolates background and typography from the root `body` (DM Sans / default canvas).
 */
export default function AdminEventsStitchLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={`admin-events-stitch ${lexend.variable} ${plusJakarta.variable} min-h-dvh overflow-x-hidden bg-[#fdf8ff] font-uptempo-body text-[#1b1345] antialiased`}
    >
      {children}
    </div>
  );
}
