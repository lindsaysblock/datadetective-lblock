/**
 * Badge UI Component
 * Displays status indicators and labels with semantic theming
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/** Badge styling constants */
const BADGE_CONSTANTS = {
  DEFAULT_PADDING: "px-2.5 py-0.5",
  FONT_SIZE: "text-xs",
  FONT_WEIGHT: "font-semibold",
  BORDER_RADIUS: "rounded-full"
} as const;

const badgeVariants = cva(
  `inline-flex items-center ${BADGE_CONSTANTS.BORDER_RADIUS} border ${BADGE_CONSTANTS.DEFAULT_PADDING} ${BADGE_CONSTANTS.FONT_SIZE} ${BADGE_CONSTANTS.FONT_WEIGHT} transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`,
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
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/** Badge component props interface */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge component
 * Renders a styled badge with customizable variants
 */
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
