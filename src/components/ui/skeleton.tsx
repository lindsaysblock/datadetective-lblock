/**
 * Skeleton UI Component
 * Loading placeholder with pulse animation
 */

import { cn } from "@/lib/utils"

/** Skeleton styling constants */
const SKELETON_CONSTANTS = {
  ANIMATION: "animate-pulse",
  BORDER_RADIUS: "rounded-md",
  BACKGROUND: "bg-muted"
} as const;

/**
 * Skeleton component
 * Animated loading placeholder for content
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(`${SKELETON_CONSTANTS.ANIMATION} ${SKELETON_CONSTANTS.BORDER_RADIUS} ${SKELETON_CONSTANTS.BACKGROUND}`, className)}
      {...props}
    />
  )
}

export { Skeleton }
