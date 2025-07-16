/**
 * Label UI Component
 * Form label with semantic theming and accessibility features
 */

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/** Label styling constants */
const LABEL_CONSTANTS = {
  FONT_SIZE: "text-sm",
  FONT_WEIGHT: "font-medium",
  LINE_HEIGHT: "leading-none"
} as const;

const labelVariants = cva(
  "`${LABEL_CONSTANTS.FONT_SIZE} ${LABEL_CONSTANTS.FONT_WEIGHT} ${LABEL_CONSTANTS.LINE_HEIGHT} peer-disabled:cursor-not-allowed peer-disabled:opacity-70`"
)

/**
 * Label component
 * Form label with enhanced accessibility and semantic styling
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
