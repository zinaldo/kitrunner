import { AuthPageShell } from "@/components/auth/auth-page-shell";

export default function StaffSignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthPageShell variant="signup">{children}</AuthPageShell>;
}
