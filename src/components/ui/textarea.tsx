/**
 * Textarea UI Component
 * Multi-line text input with semantic theming and accessibility
 */

import * as React from "react"
import { cn } from "@/lib/utils"

/** Textarea styling constants */
const TEXTAREA_CONSTANTS = {
  MIN_HEIGHT: "min-h-[80px]",
  PADDING: "px-3 py-2",
  BORDER_RADIUS: "rounded-md",
  FONT_SIZE: "text-sm",
  BORDER_STYLE: "border border-input"
} as const;

/** Textarea component props interface */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Textarea component
 * Multi-line text input with enhanced styling and accessibility
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          `flex ${TEXTAREA_CONSTANTS.MIN_HEIGHT} w-full ${TEXTAREA_CONSTANTS.BORDER_RADIUS} ${TEXTAREA_CONSTANTS.BORDER_STYLE} bg-background ${TEXTAREA_CONSTANTS.PADDING} ${TEXTAREA_CONSTANTS.FONT_SIZE} ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
