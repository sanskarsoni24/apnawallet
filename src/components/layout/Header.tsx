import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useUser } from "@/contexts/UserContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Shield,
  CreditCard,
  User,
} from "lucide-react";
import SurakshitLogo from "../ui/SurakshitLogo";

const Header = () => {
  const { isLoggedIn, logout, displayName, email } = useUser();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  // Get initial letters for avatar
  const getInitials = () => {
    if (displayName) {
      return displayName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return email ? email[0].toUpperCase() : "U";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <SurakshitLogo />
            <span className="hidden font-bold sm:inline-block">
              SurakshitLocker
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/dashboard">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/dashboard" && "bg-accent"
                    )}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/locker">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/locker" && "bg-accent"
                    )}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Secure Vault
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/documents">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/documents" && "bg-accent"
                    )}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/pricing">
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === "/pricing" && "bg-accent"
                    )}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <ModeToggle />

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  data-profile-link="true"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={displayName || email} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {displayName || "Test User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background md:hidden">
          <div className="container py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/dashboard"
                className="flex items-center px-2 py-3 text-lg"
                onClick={closeMobileMenu}
              >
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                to="/locker"
                className="flex items-center px-2 py-3 text-lg"
                onClick={closeMobileMenu}
              >
                <Shield className="mr-2 h-5 w-5" />
                Secure Vault
              </Link>
              <Link
                to="/documents"
                className="flex items-center px-2 py-3 text-lg"
                onClick={closeMobileMenu}
              >
                <FileText className="mr-2 h-5 w-5" />
                Documents
              </Link>
              <Link
                to="/pricing"
                className="flex items-center px-2 py-3 text-lg"
                onClick={closeMobileMenu}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Pricing
              </Link>

              <div className="border-t pt-4">
                {isLoggedIn ? (
                  <>
                    <div className="mb-4 flex items-center gap-3 px-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="" alt={displayName || email} />
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{displayName || "Test User"}</p>
                        <p className="text-sm text-muted-foreground">
                          {email || "user@example.com"}
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center px-2 py-3 text-lg"
                      onClick={closeMobileMenu}
                    >
                      <User className="mr-2 h-5 w-5" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-2 py-3 text-lg"
                      onClick={closeMobileMenu}
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      Settings
                    </Link>
                    <button
                      className="flex w-full items-center px-2 py-3 text-lg text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-5 w-5" />
                      Log out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button asChild size="lg" variant="outline">
                      <Link to="/sign-in" onClick={closeMobileMenu}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild size="lg">
                      <Link to="/sign-up" onClick={closeMobileMenu}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
