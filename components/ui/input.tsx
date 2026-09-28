"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      error,
      label,
      helperText,
      leftIcon,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === "password";
    const resolvedType = isPasswordType && showPassword ? "text" : type;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block font-sans text-xs font-semibold uppercase tracking-wider transition-colors",
              error ? "text-danger" : "text-fg-muted"
            )}
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3.5 flex items-center justify-center text-fg-muted/70">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={cn(
              "h-12 w-full rounded-xl bg-bg-elevated px-4 font-sans text-sm text-fg transition-all duration-200 outline-none",
              "border border-border hover:border-border-strong",
              "focus-visible:border-accent focus-visible:ring-1 focus-visible:ring-accent",
              "placeholder:text-fg-muted/50",
              "disabled:cursor-not-allowed disabled:opacity-40",
              leftIcon && "pl-11",
              isPasswordType && "pr-11",
              error && "border-danger focus-visible:border-danger focus-visible:ring-danger",
              className
            )}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={disabled}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-lg text-fg-muted/70 transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>

        {error ? (
          <p id={errorId} role="alert" className="font-sans text-xs text-danger">
            {error}
          </p>
        ) : helperText ? (
          <p id={helperId} className="font-sans text-xs text-fg-muted/80">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
