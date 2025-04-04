import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Bell, Menu, X } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";
import { Badge } from "../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isMobile } = useMobile();
  const { isLoggedIn, logout } = useUser();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<{ title: string; description: string; read: boolean }[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Listen for custom notification events
  useEffect(() => {
    const handleNotification = (event: CustomEvent) => {
      const { title, desc } = event.detail;
      const newNotification = { title, description: desc, read: false };
      setNotifications(prev => [newNotification, ...prev]);
      updateUnreadCount([newNotification, ...notifications]);
    };

    // Create a type assertion for the event listener
    window.addEventListener('app-notification' as any, handleNotification as EventListener);

    return () => {
      window.removeEventListener('app-notification' as any, handleNotification as EventListener);
    };
  }, [notifications]);

  // Update unread count
  const updateUnreadCount = (notifs: any[]) => {
    const count = notifs.filter(n => !n.read).length;
    setUnreadCount(count);
    // Save to localStorage to persist across page loads
    localStorage.setItem('notifications', JSON.stringify(notifs));
    localStorage.setItem('unreadCount', count.toString());
  };

  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        setUnreadCount(parsed.filter((n: any) => !n.read).length);
      } catch (e) {
        console.error('Error parsing saved notifications:', e);
      }
    }
  }, []);

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
  };

  const markAsRead = (index: number) => {
    const updatedNotifications = [...notifications];
    updatedNotifications[index] = { ...updatedNotifications[index], read: true };
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-30">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => handleNavigation("/")}
        >
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold">DN</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline">DocuNinja</span>
        </div>

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            className="p-2 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        )}

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    onClick={() => handleNavigation("/")}
                  >
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {isLoggedIn && (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      onClick={() => handleNavigation("/documents")}
                    >
                      Documents
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
                <NavigationMenuItem>
                  <NavigationMenuLink
                    className={navigationMenuTriggerStyle()}
                    onClick={() => handleNavigation("/pricing")}
                  >
                    Pricing
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {isLoggedIn && (
                  <NavigationMenuItem>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                      onClick={() => handleNavigation("/settings")}
                    >
                      Settings
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Notifications */}
            {isLoggedIn && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-medium">Notifications</h3>
                    {notifications.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                        Mark all as read
                      </Button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification, i) => (
                        <div 
                          key={i}
                          className={`p-3 border-b cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                          onClick={() => markAsRead(i)}
                        >
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <Button variant="outline" onClick={logout}>
                Sign out
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleNavigation("/sign-in")}
                >
                  Sign in
                </Button>
                <Button onClick={() => handleNavigation("/sign-up")}>
                  Sign up
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobile && mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-sm p-4">
            <div className="flex flex-col space-y-4">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigation("/")}
              >
                Home
              </Button>
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigation("/documents")}
                >
                  Documents
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleNavigation("/pricing")}
              >
                Pricing
              </Button>
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigation("/settings")}
                >
                  Settings
                </Button>
              )}

              <div className="border-t pt-4 mt-4">
                {isLoggedIn ? (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign out
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleNavigation("/sign-in")}
                    >
                      Sign in
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => handleNavigation("/sign-up")}
                    >
                      Sign up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
