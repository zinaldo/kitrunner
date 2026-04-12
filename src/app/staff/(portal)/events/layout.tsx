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

export default function StaffPortalStitchLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={`staff-events-stitch ${lexend.variable} ${plusJakarta.variable} min-h-dvh overflow-x-hidden bg-[#fdf8ff] font-uptempo-body text-[#1b1345] antialiased`}
    >
      {children}
    </div>
  );
}
