
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Bell, Files, Settings } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";

const Header = () => {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: Files },
    { name: "Documents", href: "/documents", icon: Files },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full animate-fade-in">
      <BlurContainer className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Files className="h-5 w-5 text-primary" />
          </div>
          <span className="font-medium text-lg">DocuNinja</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
              {location.pathname === item.href && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transform" />
              )}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
          </button>
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center">
            <span className="text-xs font-medium text-primary">JD</span>
          </div>
        </div>
      </BlurContainer>
    </header>
  );
};

export default Header;
