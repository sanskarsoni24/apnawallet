
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Google } from "lucide-react";

interface GoogleSignInProps {
  mode: "signin" | "signup";
  onSuccess?: () => void;
}

const GoogleSignIn = ({ mode, onSuccess }: GoogleSignInProps) => {
  const { login, updateUserSettings } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      // Simulate a Google sign-in process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll use a mock Google user
      const mockGoogleUser = {
        email: "demo@example.com",
        name: "Demo User",
        picture: "https://placekitten.com/100/100", // Mock profile picture
        id: "google-123456789"
      };
      
      // Log the user in with their Google email
      login(mockGoogleUser.email, "google-auth-token");
      
      // Update user settings with Google information
      updateUserSettings({
        googleConnected: true,
        displayName: mockGoogleUser.name,
        email: mockGoogleUser.email,
        recoveryEmail: mockGoogleUser.email,
      });
      
      toast({
        title: "Google Sign-In Successful",
        description: `Welcome, ${mockGoogleUser.name}!`,
      });
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Google Sign-In Failed",
        description: "There was an error signing in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = mode === "signin" ? "Sign in with Google" : "Sign up with Google";

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2 py-6"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      <Google className="w-5 h-5 text-blue-500" />
      {isLoading ? "Connecting..." : buttonText}
    </Button>
  );
};

export default GoogleSignIn;
