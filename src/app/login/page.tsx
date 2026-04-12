import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

function LoginFallback() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-uptempo-outline-variant/10 bg-uptempo-surface-container-lowest p-8 shadow-uptempo-card md:p-12">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-bl-3xl bg-uptempo-primary-container/10 blur-2xl" />
      <div className="relative z-10 space-y-6">
        <div className="mb-10 space-y-3">
          <div className="mb-8 h-8 w-36 animate-pulse rounded-lg bg-uptempo-surface-container-high/80 lg:hidden" />
          <div className="h-9 w-48 animate-pulse rounded-lg bg-uptempo-surface-container-high/80" />
          <div className="h-4 w-full max-w-xs animate-pulse rounded bg-uptempo-surface-container/90" />
        </div>
        <div className="h-14 animate-pulse rounded-lg bg-uptempo-surface-container-low" />
        <div className="h-14 animate-pulse rounded-lg bg-uptempo-surface-container-low" />
        <div className="h-12 animate-pulse rounded-lg bg-uptempo-surface-container-low/80" />
        <div className="h-14 animate-pulse rounded-xl bg-uptempo-surface-container-high/70" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
