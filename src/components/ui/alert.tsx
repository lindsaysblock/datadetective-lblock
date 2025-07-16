/**
 * Alert UI Component
 * Displays important messages and notifications with semantic theming
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/** Alert styling constants */
const ALERT_CONSTANTS = {
  PADDING: "p-4",
  BORDER_RADIUS: "rounded-lg",
  ICON_POSITION: "left-4 top-4",
  ICON_SPACING: "[&>svg~*]:pl-7",
  TITLE_SPACING: "mb-1"
} as const;

const alertVariants = cva(
  `relative w-full ${ALERT_CONSTANTS.BORDER_RADIUS} border ${ALERT_CONSTANTS.PADDING} ${ALERT_CONSTANTS.ICON_SPACING} [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:${ALERT_CONSTANTS.ICON_POSITION} [&>svg]:text-foreground`,
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Alert component
 * Main alert container with semantic variants
 */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

/**
 * Alert title component
 * Displays the alert heading with proper typography
 */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(`${ALERT_CONSTANTS.TITLE_SPACING} font-medium leading-none tracking-tight`, className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

/**
 * Alert description component
 * Displays the alert content with proper text styling
 */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
