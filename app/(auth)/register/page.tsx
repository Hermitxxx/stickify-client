import { Suspense } from "react";
import type { Metadata } from "next";
import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { redirectIfAuthenticated } from "@/lib/services/auth.service";

export const metadata: Metadata = {
  title: "Create Account — Stickify",
  description: "Join Stickify to create precision vinyl skins and customize wraps.",
};

export default async function RegisterPage() {
  await redirectIfAuthenticated("/");

  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md mx-auto h-[480px] rounded-2xl border border-border bg-bg-elevated animate-pulse" />
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
