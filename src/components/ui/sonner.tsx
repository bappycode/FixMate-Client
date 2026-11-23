"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const TOAST_OFFSET = 80

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      offset={TOAST_OFFSET}
      mobileOffset={TOAST_OFFSET}
      icons={{
        success: <CircleCheckIcon className="size-5 text-primary" />,
        info: <InfoIcon className="size-5 text-chart-2" />,
        warning: <TriangleAlertIcon className="size-5 text-chart-4" />,
        error: <OctagonXIcon className="size-5 text-destructive" />,
        loading: <Loader2Icon className="size-5 animate-spin text-muted-foreground" />,
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!font-sans !text-sm !font-medium !shadow-lg !border-l-4 !gap-3 !px-4 !py-3.5",
          success: "!border-l-primary",
          error: "!border-l-destructive",
          info: "!border-l-chart-2",
          warning: "!border-l-chart-4",
          description: "!font-normal !text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
