"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          className
        )}
        {...props}
      >
        {children}
      </select>
    )
  }
)

Select.displayName = "Select"

export { Select }
