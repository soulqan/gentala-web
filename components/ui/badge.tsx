import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "yellow";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden",
        {
          "border-transparent bg-brand-teal text-white": variant === "default",
          "border-transparent bg-brand-sage text-white": variant === "secondary",
          "border-transparent bg-brand-yellow text-slate-900": variant === "yellow",
          "border-slate-200 text-slate-800": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
