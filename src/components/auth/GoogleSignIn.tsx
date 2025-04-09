
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { LifeBuoy } from "lucide-react";

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
      // Simulate Google authentication
      setTimeout(() => {
        // In a real implementation, we would handle the Google OAuth flow
        const googleEmail = "demo@example.com";
        const googleProfilePicture = "https://i.pravatar.cc/150?u=google";
        const googleId = "google_123456789";
        
        if (mode === "signup") {
          // For signup, register a new user with Google credentials
          register(googleEmail, "demo123", "Google User");
          
          // Update user settings with Google information
          updateUserSettings({
            googleConnected: true,
            googleEmail,
            googleProfilePicture,
            googleId,
            lastLoginMethod: "google"
          });
          
          toast({
            title: "Account created with Google",
            description: "Your account has been created and you're now signed in",
          });
        } else {
          // For signin, use the existing login flow with Google credentials
          login(googleEmail, "demo123");
          
          // Update user settings with Google information
          updateUserSettings({
            googleConnected: true,
            googleEmail,
            googleProfilePicture,
            googleId,
            lastLoginMethod: "google"
          });
          
          toast({
            title: "Signed in with Google",
            description: "You have successfully signed in with Google",
          });
        }
        
        navigate("/dashboard");
      }, 1500);
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
