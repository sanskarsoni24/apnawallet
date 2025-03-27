
import React from "react";
import Header from "./Header";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={cn("flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full", className)}>
        {children}
      </main>
    </div>
  );
};

export default Container;
