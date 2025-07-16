
/**
 * Tabs UI Component
 * Tab navigation with semantic theming and accessibility
 */

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cn } from "@/lib/utils"

/** Tabs styling constants */
const TABS_CONSTANTS = {
  LIST_HEIGHT: "h-10",
  LIST_PADDING: "p-1",
  TRIGGER_PADDING: "px-3 py-1.5",
  TRIGGER_FONT_SIZE: "text-sm",
  CONTENT_MARGIN: "mt-2"
} as const;

/** Tabs root component */
const Tabs = TabsPrimitive.Root

/**
 * Tabs list component
 * Container for tab triggers with enhanced styling
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      `inline-flex ${TABS_CONSTANTS.LIST_HEIGHT} items-center justify-center rounded-md bg-muted ${TABS_CONSTANTS.LIST_PADDING} text-muted-foreground`,
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

/**
 * Tabs trigger component
 * Individual tab button with active state styling
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      `inline-flex items-center justify-center whitespace-nowrap rounded-sm ${TABS_CONSTANTS.TRIGGER_PADDING} ${TABS_CONSTANTS.TRIGGER_FONT_SIZE} font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm`,
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

/**
 * Tabs content component
 * Content panel for each tab with focus styling
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      `${TABS_CONSTANTS.CONTENT_MARGIN} ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`,
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
