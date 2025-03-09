import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        twitter: "border-transparent bg-black text-white hover:bg-black/80 dark:bg-neutral-800 dark:hover:bg-neutral-700",
        telegram: "border-transparent bg-[#0088cc] text-white hover:bg-[#0088cc]/80 dark:bg-[#0088cc]/80 dark:hover:bg-[#0088cc]",
        instagram: "border-transparent bg-[#e95950] text-white hover:bg-[#e95950]/80 dark:bg-[#e95950]/80 dark:hover:bg-[#e95950]",
        blue: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        green: "border-transparent bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        yellow: "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        red: "border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        purple: "border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        indigo: "border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
