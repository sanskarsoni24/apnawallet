
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/contexts/UserContext";
import GoogleSignIn from "./GoogleSignIn";

export const SignUpForm: React.FC = () => {
  const { login } = useUser();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup and login functionality
    login({
      displayName: "New User",
      email: "new@example.com",
      userId: "new-user-123",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="Enter your full name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="Enter your email" type="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" placeholder="Create a password" type="password" />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I agree to the terms of service and privacy policy.
        </label>
      </div>
      <Button className="w-full" onClick={handleSubmit}>
        Sign Up
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
