
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MobileNav } from "../ui/mobile-nav";
import SurakshitLogo from "../ui/SurakshitLogo";
import { Bell, Menu, User, HelpCircle } from "lucide-react";
import { ModeToggle } from "../ui/mode-toggle";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import MobileBanner from "../ui/MobileBanner";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, displayName, email, userSettings, logout } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  
  // User avatar placeholder (first letter of name or email)
  const avatarFallback = (displayName || email || "U").charAt(0).toUpperCase();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Check if the user is on a mobile device
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    
    // Show mobile banner if user is on mobile and hasn't dismissed it
    if (isMobile) {
      const dismissed = localStorage.getItem("mobile_banner_dismissed") === "true";
      if (!dismissed) {
        setShowBanner(true);
      }
    }
  }, []);

  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem("mobile_banner_dismissed", "true");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Documents", path: "/documents" },
    { name: "Mobile App", path: "/mobile-app" },
    { name: "Pricing", path: "/pricing" },
    { name: "Help", path: "/help" },
  ];

  // Check for unread notifications
  const hasUnreadNotifications = userSettings?.emailNotifications;

  return (
    <>
      {showBanner && <MobileBanner onDismiss={handleDismissBanner} />}
      <header
        className={`fixed top-0 left-0 right-0 z-40 ${
          scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        } transition-all duration-200`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <SurakshitLogo size="sm" />
              <span className="font-semibold text-xl hidden sm:inline-block">
                ApnaWallet
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                               (item.path === "/dashboard" && location.pathname === "/");
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              to="/help" 
              className="md:hidden text-muted-foreground hover:text-primary transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
            </Link>

            <ModeToggle />
            
            {isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => navigate("/settings?tab=notifications")}
                >
                  <Bell className="h-5 w-5" />
                  {hasUnreadNotifications && (
                    <span className="absolute top-1 right-1.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="overflow-hidden rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {avatarFallback}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/documents")}>
                      Documents
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/sign-in">Login</Link>
                </Button>
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <Link to="/sign-up">Sign up free</Link>
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav 
        open={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
      >
        <div className="flex flex-col gap-4 p-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center py-2 text-base font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {!isLoggedIn && (
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t">
              <Link 
                to="/sign-in" 
                className="w-full py-2 text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/sign-up" 
                className="w-full bg-indigo-600 text-white py-2 rounded-md text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign up free
              </Link>
            </div>
          )}
        </div>
      </MobileNav>

      <div className="pb-16"></div>
    </>
  );
};

export default Header;
