"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Mail, Lock, AlertCircle, ArrowRight, Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SpotlightCard } from "@/components/motion/react-bits/SpotlightCard";
import { AuthHeader } from "@/components/features/auth/AuthHeader";
import { signUp } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

interface PasswordStrength {
  score: number;
  label: string;
  colorClass: string;
}

function calculateStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: "Empty", colorClass: "bg-border" };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 1:
      return { score: 1, label: "Weak", colorClass: "bg-danger" };
    case 2:
      return { score: 2, label: "Fair", colorClass: "bg-orange" };
    case 3:
      return { score: 3, label: "Good", colorClass: "bg-gold" };
    case 4:
      return { score: 4, label: "Strong", colorClass: "bg-accent-soft" };
    default:
      return { score: 0, label: "Too short", colorClass: "bg-danger" };
  }
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const strength = React.useMemo(() => calculateStrength(password), [password]);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please provide your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please provide your email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        callbackURL: callbackUrl,
      });

      if (res?.error) {
        setError(res.error.message || "Failed to create account.");
        setIsSubmitting(false);
        return;
      }

      // Successful registration
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
        badgeText="NEW VAULT MEMBER"
        title="Create your account"
        subtitle="Join Stickify to engineer custom vinyl skins, save device templates, and checkout faster."
      />

      <SpotlightCard className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            id="register-name"
            name="name"
            type="text"
            label="Full name"
            autoComplete="name"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            leftIcon={<User className="h-4 w-4" />}
            required
          />

          <Input
            id="register-email"
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

          <div className="space-y-2">
            <Input
              id="register-password"
              name="password"
              type="password"
              label="Create password"
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-sans">
                  <span className="text-fg-muted/70">Strength</span>
                  <span className="font-medium text-fg">{strength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map((tier) => (
                    <div
                      key={tier}
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        strength.score >= tier ? strength.colorClass : "bg-border"
                      )}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              label="Confirm password"
              autoComplete="new-password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isSubmitting}
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />

            {confirmPassword.length > 0 && (
              <p
                className={cn(
                  "font-sans text-xs flex items-center gap-1.5 pt-1",
                  passwordsMatch ? "text-accent-soft" : "text-danger"
                )}
              >
                {passwordsMatch ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Passwords match
                  </>
                ) : (
                  "Passwords do not match yet"
                )}
              </p>
            )}
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
            {isSubmitting ? "Creating account..." : "Create account"}
          </PrimaryButton>
        </form>

        <div className="mt-6 pt-6 border-t border-border flex items-center justify-between text-xs font-sans text-fg-muted">
          <span>Already registered?</span>
          <Link
            href={
              callbackUrl !== "/"
                ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/login"
            }
            className="font-semibold text-accent hover:text-gold transition-colors focus-visible:outline-2 focus-visible:outline-accent rounded"
          >
            Sign in
          </Link>
        </div>
      </SpotlightCard>
    </div>
  );
}

export default RegisterForm;
