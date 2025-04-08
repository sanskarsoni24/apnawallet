
import React from "react";
import { Shield, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface SurakshitLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'simple' | 'text' | 'full';
  className?: string;
}

const SurakshitLogo: React.FC<SurakshitLogoProps> = ({
  size = 'md',
  variant = 'default',
  className
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  };

  // Icon only
  if (variant === 'simple') {
    return (
      <div className={cn(
        "relative flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white",
        sizeClasses[size],
        className
      )}>
        <Shield className="absolute h-[60%] w-[60%] opacity-50" />
        <Lock className="h-[40%] w-[40%] z-10" />
      </div>
    );
  }

  // Text only
  if (variant === 'text') {
    return (
      <span className={cn(
        "font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
        textSizeClasses[size],
        className
      )}>
        SurakshitLocker
      </span>
    );
  }

  // Full logo with text and icon
  if (variant === 'full') {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <div className={cn(
          "relative flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white",
          sizeClasses[size]
        )}>
          <Shield className="absolute h-[60%] w-[60%] opacity-50" />
          <Lock className="h-[40%] w-[40%] z-10" />
        </div>
        <span className={cn(
          "font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent",
          textSizeClasses[size]
        )}>
          SurakshitLocker
        </span>
      </div>
    );
  }

  // Default - icon with shield design
  return (
    <div className={cn(
      "relative flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600",
      sizeClasses[size],
      className
    )}>
      <Shield className="absolute h-[60%] w-[60%] text-white opacity-50" />
      <Lock className="h-[40%] w-[40%] text-white z-10" />
    </div>
  );
};

export default SurakshitLogo;
