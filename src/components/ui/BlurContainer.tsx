
import React from "react";
import { cn } from "@/lib/utils";

interface BlurContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  variant?: 'default' | 'dark' | 'light' | 'elevated' | 'subtle';
}

const BlurContainer = ({ 
  children, 
  className, 
  hover = false,
  gradient = false,
  variant = 'default',
  ...props 
}: BlurContainerProps) => {
  const variantClasses = {
    default: "glass-panel bg-white/80 dark:bg-slate-900/70",
    dark: "bg-slate-900/80 text-white backdrop-blur-md border border-slate-700/30",
    light: "bg-white/95 backdrop-blur-md border border-white/30",
    elevated: "bg-white/90 dark:bg-slate-900/80 backdrop-blur-lg border border-white/20 dark:border-slate-700/20 shadow-elevated",
    subtle: "bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm border border-white/10 dark:border-slate-700/10",
  };

  return (
    <div
      className={cn(
        "rounded-xl",
        variantClasses[variant],
        hover && "glass-panel-hover",
        gradient && "gradient-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default BlurContainer;
