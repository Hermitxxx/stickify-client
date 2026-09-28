import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { redirectIfAuthenticated } from "@/lib/services/auth.service";

export const metadata: Metadata = {
  title: "Sign In — Stickify",
  description: "Sign in to access your Stickify skins vault and orders.",
};

export default async function LoginPage() {
  await redirectIfAuthenticated("/");

  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto h-96 rounded-2xl border border-border bg-bg-elevated animate-pulse" />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
