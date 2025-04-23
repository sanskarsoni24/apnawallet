
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, FileText, Shield, Settings, Calendar } from "lucide-react";

const MobileNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: FileText, label: "Documents", path: "/documents" },
    { icon: Shield, label: "Vault", path: "/locker" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavBar;
