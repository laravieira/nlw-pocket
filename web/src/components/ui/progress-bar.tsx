import * as ProgressPrimitive from '@radix-ui/react-progress'
import type { ComponentPropsWithoutRef, ElementRef } from 'react'
import { forwardRef } from 'react'

const Progress = forwardRef<
  ElementRef<typeof ProgressPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Progress
    ref={ref}
    {...props}
    className="bg-zinc-900 rounded-full h-2"
  />
))
Progress.displayName = ProgressPrimitive.Root.displayName

const ProgressIndicator = forwardRef<
  ElementRef<typeof ProgressPrimitive.Indicator>,
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Indicator>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Indicator
    ref={ref}
    {...props}
    className="bg-gradient-to-r from-pink-500 to-violet-500 w-1/2 h-2 rounded-full"
  />
))
ProgressIndicator.displayName = ProgressPrimitive.Indicator.displayName

export { Progress, ProgressIndicator }
