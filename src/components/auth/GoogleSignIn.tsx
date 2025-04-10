
import React from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";

const GoogleSignIn: React.FC = () => {
  const { login, updateUserSettings } = useUser();

  const handleGoogleSignIn = async () => {
    try {
      // Simulate Google auth API
      const mockGoogleResponse = {
        user: {
          displayName: "Google User",
          email: "google.user@gmail.com",
          uid: "google-123456789",
          photoURL: "https://lh3.googleusercontent.com/a/default-user=s64-c",
        }
      };

      // Create user object from Google response
      const user = {
        displayName: mockGoogleResponse.user.displayName,
        email: mockGoogleResponse.user.email,
        userId: mockGoogleResponse.user.uid,
        photoURL: mockGoogleResponse.user.photoURL,
      };

      // Log in the user
      login(user);
      
      // Update user settings with Google info
      updateUserSettings({
        googleEmail: mockGoogleResponse.user.email,
        googleProfilePicture: mockGoogleResponse.user.photoURL,
        googleId: mockGoogleResponse.user.uid,
        googleConnected: true,
        lastLoginMethod: "google",
      });

      toast({
        title: "Signed in with Google",
        description: "You have successfully signed in with your Google account.",
      });
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Sign in failed",
        description: "There was a problem signing in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      className="w-full" 
      onClick={handleGoogleSignIn}
    >
      <svg
        className="mr-2 h-4 w-4"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="google"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
      >
        <path
          fill="currentColor"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        ></path>
      </svg>
      Continue with Google
    </Button>
  );
};

export default GoogleSignIn;
