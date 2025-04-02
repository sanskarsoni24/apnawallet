
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Bell, Files, Settings, LogOut, User, FileText, MessageSquare, Filter, LogIn, UserPlus } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = React.useState(3);
  const [showUserDialog, setShowUserDialog] = React.useState(false);
  
  // Get user data from context
  const { isLoggedIn, displayName, email, logout } = useUser();
  
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

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  const handleFilterClick = (filter) => {
    navigate(`/documents?filter=${filter}`);
    toast({
      title: `Filtered by ${filter}`,
      description: `Showing ${filter.toLowerCase()} documents`
    });
  };
  
  const getInitials = () => {
    if (!displayName) return "?";
    return displayName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full animate-fade-in">
      <BlurContainer className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Files className="h-5 w-5 text-primary" />
          </div>
          <Link to="/" className="font-medium text-lg hover:text-primary transition-colors">DocuNinja</Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
              {location.pathname === item.href ? (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              ) : (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/0 group-hover:bg-primary/40 rounded-full transition-all" />
              )}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            // Authenticated user UI
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Filter className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter Documents</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleFilterClick("All")}>
                    All Documents
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterClick("Invoice")}>
                    Invoices
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterClick("Warranty")}>
                    Warranties
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterClick("Subscription")}>
                    Subscriptions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleFilterClick("upcoming")}>
                    Upcoming Deadlines
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
                    )}
                  </Button>
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
                  <div className="h-9 w-9 rounded-full bg-accent flex items-center justify-center cursor-pointer hover:bg-accent/70 transition-colors">
                    <span className="text-xs font-medium text-primary">
                      {getInitials()}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowUserDialog(true)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
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
                    onClick={handleSignOut}
                    className="text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Non-authenticated user UI
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/sign-in" className="flex items-center gap-1.5">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/sign-up" className="flex items-center gap-1.5">
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </BlurContainer>
      
      {/* User Profile Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              Your account information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-medium text-primary">
                  {getInitials()}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Display Name</h3>
                <p className="text-base">{displayName || "Not set"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="text-base">{email || "Not set"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Account Status</h3>
                <p className="text-base">Active</p>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                Close
              </Button>
              <Button onClick={() => {
                navigate("/settings");
                setShowUserDialog(false);
              }}>
                Edit Profile
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
