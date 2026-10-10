"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      expand={false}
      richColors
      closeButton
      icons={{
        success: (
          <div className="flex size-7 items-center justify-center rounded-full bg-primary/10">
            <CircleCheckIcon className="size-4 text-primary" />
          </div>
        ),

        info: (
          <div className="flex size-7 items-center justify-center rounded-full bg-blue-500/10">
            <InfoIcon className="size-4 text-blue-500" />
          </div>
        ),

        warning: (
          <div className="flex size-7 items-center justify-center rounded-full bg-amber-500/10">
            <TriangleAlertIcon className="size-4 text-amber-500" />
          </div>
        ),

        error: (
          <div className="flex size-7 items-center justify-center rounded-full bg-destructive/10">
            <OctagonXIcon className="size-4 text-destructive" />
          </div>
        ),

        loading: (
          <div className="flex size-7 items-center justify-center rounded-full bg-primary/10">
            <Loader2Icon className="size-4 animate-spin text-primary" />
          </div>
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "0.875rem",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: [
            "group",
            "relative",
            "overflow-hidden",
            "border",
            "border-border/80",
            "bg-popover/95",
            "backdrop-blur-xl",
            "shadow-xl",
            "shadow-black/5",
            "dark:shadow-black/20",
            "px-4",
            "py-3",
            "gap-3",
          ].join(" "),

          title: [
            "text-sm",
            "font-semibold",
            "tracking-tight",
            "text-foreground",
          ].join(" "),

          description: [
            "mt-0.5",
            "text-xs",
            "leading-5",
            "text-muted-foreground",
          ].join(" "),

          success: [
            "border-primary/20",
            "before:absolute",
            "before:left-0",
            "before:top-0",
            "before:h-full",
            "before:w-0.5",
            "before:bg-primary",
          ].join(" "),

          info: [
            "border-blue-500/20",
            "before:absolute",
            "before:left-0",
            "before:top-0",
            "before:h-full",
            "before:w-0.5",
            "before:bg-blue-500",
          ].join(" "),

          warning: [
            "border-amber-500/20",
            "before:absolute",
            "before:left-0",
            "before:top-0",
            "before:h-full",
            "before:w-0.5",
            "before:bg-amber-500",
          ].join(" "),

          error: [
            "border-destructive/20",
            "before:absolute",
            "before:left-0",
            "before:top-0",
            "before:h-full",
            "before:w-0.5",
            "before:bg-destructive",
          ].join(" "),

          loading: [
            "border-primary/20",
            "before:absolute",
            "before:left-0",
            "before:top-0",
            "before:h-full",
            "before:w-0.5",
            "before:bg-primary",
          ].join(" "),

          closeButton: [
            "!left-auto",
            "!right-2",
            "!top-2",
            "!translate-x-0",
            "!translate-y-0",
            "!transform-none",
            "size-6",
            "rounded-md",
            "border",
            "border-border/60",
            "bg-background",
            "text-muted-foreground",
            "opacity-100",
            "transition-colors",
            "hover:bg-muted",
            "hover:text-foreground",
          ].join(" "),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
