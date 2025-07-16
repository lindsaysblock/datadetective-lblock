
/**
 * Progress UI Component
 * Progress bar with gradient styling and semantic theming
 */

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

/** Progress styling constants */
const PROGRESS_CONSTANTS = {
  HEIGHT: "h-4",
  BACKGROUND_GRADIENT: "bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500",
  BORDER_RADIUS: "rounded-full"
} as const;

/**
 * Progress component
 * Animated progress bar with gradient indicator
 */
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      `relative ${PROGRESS_CONSTANTS.HEIGHT} w-full overflow-hidden ${PROGRESS_CONSTANTS.BORDER_RADIUS} bg-secondary`,
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={`${PROGRESS_CONSTANTS.HEIGHT} w-full flex-1 ${PROGRESS_CONSTANTS.BACKGROUND_GRADIENT} transition-all shadow-sm`}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
