import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  error?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "block font-sans text-xs font-medium tracking-wide transition-colors",
          error ? "text-danger" : "text-fg-muted",
          className
        )}
        {...props}
      >
        {children}
      </label>
    );
  }
);

Label.displayName = "Label";
export default Label;
