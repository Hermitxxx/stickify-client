import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const chipVariants = cva(
  "inline-flex items-center gap-2 rounded-xl font-sans text-xs font-medium transition-all duration-200 cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        filter:
          "border border-border bg-bg-elevated text-fg-muted hover:border-border-strong hover:text-fg hover:bg-ink-800",
        filterActive:
          "border-accent bg-accent/15 text-orange font-semibold shadow-sm shadow-accent/20",
        device:
          "border border-border bg-bg text-fg-muted hover:border-accent hover:text-fg",
        deviceActive:
          "border-gold bg-gold/10 text-gold font-semibold",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-sm",
      },
    },
    defaultVariants: {
      variant: "filter",
      size: "md",
    },
  }
);

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  active?: boolean;
}

export function Chip({
  className,
  variant = "filter",
  active,
  size,
  ...props
}: ChipProps) {
  const resolvedVariant =
    variant === "device"
      ? active
        ? "deviceActive"
        : "device"
      : active
      ? "filterActive"
      : variant;

  return (
    <button
      type="button"
      className={cn(chipVariants({ variant: resolvedVariant, size }), className)}
      {...props}
    />
  );
}

export default Chip;
