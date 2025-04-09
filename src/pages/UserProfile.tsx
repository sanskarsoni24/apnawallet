import React from "react";
import Container from "@/components/layout/Container";
import { useUser } from "@/contexts/UserContext";
import BlurContainer from "@/components/ui/BlurContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Shield, Mail, Calendar, User, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const UserProfile = () => {
  const { email, displayName, logout } = useUser();
  const navigate = useNavigate();
  
  // Get initial letters for avatar fallback
  const getInitials = () => {
    if (displayName) {
      return displayName
        .split(" ")
        .map(name => name[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return email ? email[0].toUpperCase() : "U";
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    });
    navigate("/");
  };

  return (
    <Container>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account settings
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile Information */}
          <BlurContainer className="p-8 md:col-span-2">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt={displayName || email} />
                <AvatarFallback className="text-xl bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-4 text-center md:text-left">
                <div>
                  <h2 className="text-2xl font-semibold">{displayName || "Test User"}</h2>
                  <p className="text-muted-foreground">{email || "user@example.com"}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs">
                    <Shield className="h-3 w-3" /> Pro Plan
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-xs">
                    <Mail className="h-3 w-3" /> Email Verified
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" asChild>
                    <Link to="/settings">
                      <Settings className="h-4 w-4 mr-2" /> Account Settings
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-100/50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900/30">
                    <LogOut className="h-4 w-4 mr-2" /> Log Out
                  </Button>
                </div>
              </div>
            </div>
          </BlurContainer>

          {/* Account Stats */}
          <div className="space-y-6">
            <BlurContainer className="p-6">
              <h3 className="text-lg font-medium mb-4">Account Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-xs text-muted-foreground">April 2025</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Security Status</p>
                      <p className="text-xs text-muted-foreground">2FA Enabled</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <Link to="/settings" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                  Manage security settings <Settings className="h-3 w-3" />
                </Link>
              </div>
            </BlurContainer>
            
            <Link to="/pricing">
              <BlurContainer 
                className="p-6 relative overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                gradient
              >
                <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-indigo-600/10 dark:bg-indigo-600/5"></div>
                <div className="absolute -left-4 -top-4 w-16 h-16 rounded-full bg-purple-600/10 dark:bg-purple-600/5"></div>
                
                <div className="relative">
                  <h3 className="font-semibold text-lg mb-2">Upgrade Your Plan</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get access to premium features with our Pro or Enterprise plans.
                  </p>
                  <Button variant="default" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    View Plans
                  </Button>
                </div>
              </BlurContainer>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default UserProfile;
