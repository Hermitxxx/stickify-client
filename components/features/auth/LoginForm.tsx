"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SpotlightCard } from "@/components/motion/react-bits/SpotlightCard";
import { AuthHeader } from "@/components/features/auth/AuthHeader";
import { signIn } from "@/lib/auth/auth-client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
        callbackURL: callbackUrl,
      });

      if (res?.error) {
        setError(res.error.message || "Invalid email or password.");
        setIsSubmitting(false);
        return;
      }

      // Successful sign in
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AuthHeader
        badgeText="SECURE ACCESS"
        title="Sign in to your account"
        subtitle="Manage custom skins, track precision cuts, and access your saved sticker collections."
      />

      <SpotlightCard className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-xl border border-danger/40 bg-danger/10 p-3.5 text-xs text-fg"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-danger mt-0.5" />
              <p className="leading-snug">{error}</p>
            </div>
          )}

          <Input
            id="login-email"
            name="email"
            type="email"
            label="Email address"
            autoComplete="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            leftIcon={<Mail className="h-4 w-4" />}
            required
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-semibold uppercase tracking-wider text-fg-muted">
                Password
              </span>
              <span className="font-sans text-xs text-fg-muted/60">
                Minimum 8 characters
              </span>
            </div>

            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />
          </div>

          <PrimaryButton
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="w-full mt-2"
            icon={
              isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin text-ink-950" />
              ) : (
                <ArrowRight className="h-4 w-4 text-ink-950" />
              )
            }
          >
            {isSubmitting ? "Authenticating..." : "Sign in"}
          </PrimaryButton>
        </form>

        <div className="mt-6 pt-6 border-t border-border flex items-center justify-between text-xs font-sans text-fg-muted">
          <span>Don&apos;t have an account?</span>
          <Link
            href={
              callbackUrl !== "/"
                ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/register"
            }
            className="font-semibold text-accent hover:text-gold transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded"
          >
            Create account
          </Link>
        </div>
      </SpotlightCard>
    </div>
  );
}

export default LoginForm;
