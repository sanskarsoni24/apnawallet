
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/contexts/UserContext";
import { Link } from "react-router-dom";
import GoogleSignIn from "./GoogleSignIn";

export const SignInForm: React.FC = () => {
  const { login } = useUser();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login functionality
    login({
      displayName: "Demo User",
      email: "demo@example.com",
      userId: "demo-user-123",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="Enter your email" type="email" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input id="password" placeholder="Enter your password" type="password" />
      </div>
      <Button className="w-full" onClick={handleSubmit}>
        Sign In
      </Button>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <GoogleSignIn />
    </div>
  );
};
