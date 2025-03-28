
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Bell, Files, Settings, LogOut, User, FileText, MessageSquare } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const location = useLocation();
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: Files },
    { name: "Documents", href: "/documents", icon: Files },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const notifications = [
    { id: 1, title: "Car Insurance Expires Soon", description: "Your car insurance expires in 3 days", time: "2 hours ago" },
    { id: 2, title: "New Document Added", description: "Internet Bill has been added to your documents", time: "Yesterday" },
    { id: 3, title: "Document Updated", description: "Netflix Subscription details were updated", time: "2 days ago" },
  ];

  const markAllAsRead = () => {
    setUnreadNotifications(0);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read",
    });
  };

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
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative p-2 rounded-full hover:bg-secondary transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-3 border-b">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Notifications</h4>
                  <button 
                    className="text-xs text-primary hover:underline"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.length > 0 ? (
                  <div>
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className="p-3 border-b hover:bg-muted/50 cursor-pointer"
                        onClick={() => {
                          toast({
                            title: notification.title,
                            description: notification.description
                          });
                          setUnreadNotifications(prev => Math.max(0, prev - 1));
                        }}
                      >
                        <div className="flex gap-3">
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h5 className="text-sm font-medium">{notification.title}</h5>
                            <p className="text-xs text-muted-foreground mt-1">{notification.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="text-sm mt-2">No notifications</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center cursor-pointer">
                <span className="text-xs font-medium text-primary">JD</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/documents" className="flex items-center cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>My Documents</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "Signed out",
                    description: "You have been signed out of your account"
                  });
                }}
                className="text-red-500 focus:text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </BlurContainer>
    </header>
  );
};

export default Header;
