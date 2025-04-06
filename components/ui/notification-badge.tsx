import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const notificationBadgeVariants = cva(
  "absolute -top-1 -right-1 flex items-center justify-center rounded-full bg-black dark:bg-white text-[0.65rem] font-medium text-white dark:text-black",
  {
    variants: {
      size: {
        default: "h-5 w-5 min-w-5",
        sm: "h-4 w-4 min-w-4",
        lg: "h-6 w-6 min-w-6",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface NotificationBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof notificationBadgeVariants> {
  count: number;
  maxCount?: number;
}

const NotificationBadge = React.forwardRef<
  HTMLSpanElement,
  NotificationBadgeProps
>(({ className, count, maxCount = 9, size, ...props }, ref) => {
  if (count <= 0) return null;
  
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  
  return (
    <span
      ref={ref}
      className={cn(notificationBadgeVariants({ size }), className)}
      {...props}
    >
      {displayCount}
    </span>
  );
});

NotificationBadge.displayName = "NotificationBadge";

export { NotificationBadge }; 