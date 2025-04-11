
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type GoogleSignInProps = {
  mode?: "signin" | "signup";
  className?: string;
};

const GoogleSignIn = ({ mode = "signin", className = "" }: GoogleSignInProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, register, updateUserSettings } = useUser();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be replaced with actual Google OAuth
      // Here we simulate the Google account selection popup
      
      // Let's display mock Google account selection using browser's native confirm
      const useDefault = window.confirm(
        "Select a Google account to continue:\n\n" +
        "▶ demo@example.com (Default)\n" +
        "▶ Use another account"
      );
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get the Google account info (either default or simulated manual entry)
      const googleEmail = useDefault ? "demo@example.com" : "user.custom@gmail.com";
      const googleProfilePicture = `https://i.pravatar.cc/150?u=${encodeURIComponent(googleEmail)}`;
      const googleId = `google_${Math.random().toString(36).substring(2, 11)}`;
      
      if (mode === "signup") {
        // For signup, register a new user with Google credentials
        register(googleEmail, "demo123", googleEmail.split('@')[0]);
        
        // Update user settings with Google information
        updateUserSettings({
          googleEmail,
          googleProfilePicture,
          googleId,
          lastLoginMethod: "google"
        });
        
        toast({
          title: "Account created with Google",
          description: `Signed up with ${googleEmail}`,
        });
      } else {
        // For signin, use the existing login flow with Google credentials
        login(googleEmail, "demo123");
        
        // Update user settings with Google information
        updateUserSettings({
          googleEmail,
          googleProfilePicture,
          googleId,
          lastLoginMethod: "google"
        });
        
        toast({
          title: "Signed in with Google",
          description: `Successfully signed in as ${googleEmail}`,
        });
      }
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Google sign in failed",
        description: "There was an error signing in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      className={`w-full border-slate-300 flex items-center justify-center ${className}`}
      onClick={handleGoogleSignIn}
    >
      {!isLoading && (
        <div className="bg-white p-0.5 rounded mr-2">
          <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
        </div>
      )}
      {isLoading ? 
        "Processing..." : 
        mode === "signup" ? "Sign up with Google" : "Sign in with Google"
      }
    </Button>
  );
};

export default GoogleSignIn;
