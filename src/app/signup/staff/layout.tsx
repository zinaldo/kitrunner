import type { ReactNode } from "react";
import { Lexend, Plus_Jakarta_Sans } from "next/font/google";
import { UptempoStaffSignupShell } from "@/components/auth/uptempo-staff-signup-shell";

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

export default function StaffSignupLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      className={`${lexend.variable} ${plusJakarta.variable} flex min-h-screen items-center justify-center bg-uptempo-surface p-4 font-uptempo-body text-uptempo-on-surface antialiased md:p-8`}
    >
      <UptempoStaffSignupShell>{children}</UptempoStaffSignupShell>
    </div>
  );
}
