
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useUser } from "@/contexts/UserContext";
import SurakshitLogo from "@/components/ui/SurakshitLogo";
import MobileNav from "@/components/ui/mobile-nav";
import { Bell, LogOut, Settings, FileText, Archive, Home, Calendar, HelpCircle, FileIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

// Define props for MobileNav to fix type errors
interface MobileNavProps {
  navigation: {
    name: string;
    href: string;
    icon: React.ComponentType<any>;
    current: boolean;
    disabled?: boolean;
  }[];
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  user?: { email?: string };
}

const Header = () => {
  const { isLoggedIn, logout, userSettings } = useUser();
  const location = useLocation();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Create navigation links
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: pathname === '/dashboard' },
    { name: 'Documents', href: '/documents', icon: FileText, current: pathname === '/documents' },
    { name: 'PDF Tools', href: '/pdf-tools', icon: FileIcon, current: pathname === '/pdf-tools' },
    { name: 'Locker', href: '/locker', icon: Archive, current: pathname === '/locker' },
    { name: 'Calendar', href: '/calendar', icon: Calendar, current: pathname === '/calendar', disabled: true },
    { name: 'Help', href: '/help', icon: HelpCircle, current: pathname === '/help' },
  ];

  // Create user object for MobileNav
  const user = { email: userSettings?.googleEmail || "" };

  return (
    <header className="bg-background sticky top-0 z-50 border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex lg:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                {isMobileMenuOpen ? (
                  <span className="h-5 w-5">✕</span>
                ) : (
                  <span className="h-5 w-5">☰</span>
                )}
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-60">
              <MobileNav
                navigation={navigation}
                isLoggedIn={isLoggedIn}
                logout={handleLogout}
                user={user}
              />
            </SheetContent>
          </Sheet>
        </div>

        <Link to="/" className="flex items-center space-x-2">
          <SurakshitLogo className="h-6 w-6" />
          <span className="hidden sm:inline-block font-bold">
            Apna<span className="font-semibold">Wallet</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center space-x-4">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 ${item.current ? 'text-foreground' : 'text-muted-foreground hover:text-foreground transition-colors'
                  } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={item.disabled}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <ModeToggle />
          {isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
                <span className="sr-only">Notifications</span>
              </Button>
              <Link to="/profile">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userSettings?.googleProfilePicture || ""} />
                  <AvatarFallback>{user?.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link to="/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
