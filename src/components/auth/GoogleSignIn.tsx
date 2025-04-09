
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Google } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const GoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Simulate Google authentication
      setTimeout(() => {
        // In a real implementation, we would handle the Google OAuth flow
        // For now, we'll simulate it with a demo account
        login("demo@example.com", "demo123");
        toast({
          title: "Signed in with Google",
          description: "You have successfully signed in with Google",
        });
        navigate("/");
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
      className="w-full border-slate-300"
      onClick={handleGoogleSignIn}
    >
      {isLoading ? (
        "Signing in..."
      ) : (
        <>
          <Google className="mr-2 h-4 w-4" />
          Sign in with Google
        </>
      )}
    </Button>
  );
};

export default GoogleSignIn;
