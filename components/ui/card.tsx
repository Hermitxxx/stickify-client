import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive";
}

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-bg-elevated p-6 text-fg shadow-xl transition-all duration-300",
        variant === "interactive" &&
          "hover:border-border-strong hover:bg-ink-900 cursor-pointer active:scale-[0.99]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
