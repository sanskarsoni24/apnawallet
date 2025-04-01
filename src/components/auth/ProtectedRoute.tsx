
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useUser();
  const location = useLocation();

  if (!isLoggedIn) {
    // Show toast when redirecting
    React.useEffect(() => {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this page",
        variant: "destructive",
      });
    }, []);

    // Redirect to sign-in page, but remember where they were trying to go
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
