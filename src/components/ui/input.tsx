"use client"

import * as React from "react"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={
        ("rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20 " +
        (className ?? ""))
      }
      {...props}
    />
  )
}

export { Input }
