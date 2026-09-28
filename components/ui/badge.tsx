import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold tracking-wider uppercase transition-colors",
  {
    variants: {
      variant: {
        default: "border border-border bg-bg-elevated text-fg-muted",
        brand: "bg-accent/15 text-orange border border-accent/30",
        gold: "bg-gold/15 text-gold border border-gold/30",
        new: "bg-accent text-on-accent font-bold",
        bestseller: "bg-gradient-brand text-on-accent font-bold",
        outline: "border border-border-strong text-fg-muted",
      },
      size: {
        sm: "text-[10px] px-2 py-0.5",
        md: "text-xs px-2.5 py-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export default Badge;
