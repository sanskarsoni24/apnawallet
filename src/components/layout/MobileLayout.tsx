
import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell, User, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import SurakshitLogo from "@/components/ui/SurakshitLogo";
import MobileNavBar from "@/components/mobile/MobileNavBar";
import { useMobile } from "@/hooks/use-mobile";

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  showNav?: boolean;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  title = "SurakshitLocker",
  showNav = true,
}) => {
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  
  if (!isMobile) {
    return <>{children}</>;
  }
  
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80%] max-w-sm">
              <div className="flex flex-col space-y-6 pt-4">
                <div className="flex items-center gap-2">
                  <SurakshitLogo />
                  <h2 className="text-lg font-medium">SurakshitLocker</h2>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <button 
                    onClick={() => navigate("/")}
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary"
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </button>
                  <button 
                    onClick={() => navigate("/documents")}
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary"
                  >
                    <FileText className="h-5 w-5" />
                    <span>Documents</span>
                  </button>
                  <button 
                    onClick={() => navigate("/locker")}
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary"
                  >
                    <Shield className="h-5 w-5" />
                    <span>Security Vault</span>
                  </button>
                  <button 
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-secondary"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <div className="flex items-center flex-1 justify-between">
            <div className="flex items-center gap-2">
              <SurakshitLogo size="sm" />
              <h1 className="text-base font-medium">{title}</h1>
            </div>
            
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 pb-16">
        {children}
      </main>
      
      {/* Mobile Navigation Bar */}
      {showNav && <MobileNavBar />}
    </div>
  );
};

export default MobileLayout;
