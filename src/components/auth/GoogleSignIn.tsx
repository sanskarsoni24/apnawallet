
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Google } from "lucide-react";

type GoogleSignInProps = {
  mode?: "signin" | "signup";
  className?: string;
};

const GoogleSignIn = ({ mode = "signin", className = "" }: GoogleSignInProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useUser();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Simulate Google authentication
      setTimeout(() => {
        // In a real implementation, we would handle the Google OAuth flow
        if (mode === "signup") {
          // For signup, register a new user with Google credentials
          register("demo@example.com", "demo123", "Google User");
          toast({
            title: "Account created with Google",
            description: "Your account has been created and you're now signed in",
          });
        } else {
          // For signin, use the existing login flow with Google credentials
          login("demo@example.com", "demo123");
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
        <Google className="mr-2 h-4 w-4" aria-hidden="true" />
      )}
      {isLoading ? 
        "Processing..." : 
        mode === "signup" ? "Sign up with Google" : "Sign in with Google"
      }
    </Button>
  );
};

export default GoogleSignIn;
