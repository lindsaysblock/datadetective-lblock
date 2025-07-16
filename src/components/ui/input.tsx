/**
 * Input UI Component
 * Form input field with semantic theming and accessibility
 */

import * as React from "react"
import { cn } from "@/lib/utils"

/** Input styling constants */
const INPUT_CONSTANTS = {
  HEIGHT: "h-10",
  PADDING: "px-3 py-2",
  BORDER_RADIUS: "rounded-md",
  FONT_SIZE: "text-base md:text-sm",
  BORDER_STYLE: "border border-input",
  RING_OFFSET: "ring-offset-2"
} as const;

/**
 * Input component
 * Enhanced form input with semantic theming and accessibility features
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `flex ${INPUT_CONSTANTS.HEIGHT} w-full ${INPUT_CONSTANTS.BORDER_RADIUS} ${INPUT_CONSTANTS.BORDER_STYLE} bg-background ${INPUT_CONSTANTS.PADDING} ${INPUT_CONSTANTS.FONT_SIZE} ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:${INPUT_CONSTANTS.RING_OFFSET} disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
