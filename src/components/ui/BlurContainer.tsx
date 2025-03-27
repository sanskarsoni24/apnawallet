
import React from "react";
import { cn } from "@/lib/utils";

interface BlurContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

const BlurContainer = ({ 
  children, 
  className, 
  hover = false,
  gradient = false,
  ...props 
}: BlurContainerProps) => {
  return (
    <div
      className={cn(
        "glass-panel rounded-xl",
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
