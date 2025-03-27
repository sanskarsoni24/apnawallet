
import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "outline" | "secondary" | "destructive";
type BadgeSize = "default" | "sm" | "lg";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

const Badge = ({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: BadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-medium transition-colors",
        "rounded-full animate-fade-in",
        size === "sm" && "text-xs px-2.5 py-0.5",
        size === "default" && "text-xs px-3 py-1",
        size === "lg" && "text-sm px-3 py-1",
        variant === "default" && "bg-primary/10 text-primary",
        variant === "secondary" && "bg-secondary text-secondary-foreground",
        variant === "outline" && "border border-border text-foreground",
        variant === "destructive" && "bg-destructive/10 text-destructive",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Badge;
