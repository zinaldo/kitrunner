import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { CandyCard } from "@/components/candy/candy-card";

function LoginFallback() {
  return (
    <CandyCard elevation="lg" className="p-8 sm:p-9">
      <div className="h-6 w-24 animate-pulse rounded-candy bg-candy-outline/20" />
      <div className="mt-4 h-9 w-44 animate-pulse rounded-candy bg-candy-outline/15" />
      <div className="mt-6 h-36 animate-pulse rounded-candy bg-candy-outline/10" />
    </CandyCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
