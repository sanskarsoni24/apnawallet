import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Google } from "lucide-react";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

const GoogleSignIn = () => {
  const { isLoggedIn, updateUserSettings } = useUser();
  const { toast } = useToast();

  const handleGoogleSignInSuccess = async (tokenResponse: any) => {
    try {
      const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          "Authorization": `Bearer ${tokenResponse.access_token}`
        }
      });

      if (!googleResponse.ok) {
        throw new Error(`Failed to fetch user info from Google: ${googleResponse.status}`);
      }

      const user = await googleResponse.json();
      const email = user.email;

      if (updateUserSettings) {
        updateUserSettings({
          displayName: user.displayName || email.split('@')[0],
          email: email,
        });
      }

      toast({
        title: "Signed in with Google",
        description: `Welcome, ${user.name || user.email}!`,
      });
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Google sign-in failed",
        description: error.message || "Could not sign in with Google.",
        variant: "destructive",
      });
    }
  };

  const { login } = useGoogleLogin({
    onSuccess: handleGoogleSignInSuccess,
    onError: (error) => {
      console.error("Google sign-in error:", error);
      toast({
        title: "Google sign-in error",
        description: "Failed to sign in with Google.",
        variant: "destructive",
      });
    },
  });

  const handleDisconnect = () => {
    googleLogout();
    if (updateUserSettings) {
      updateUserSettings({
      });
    }
    toast({
      title: "Google account disconnected",
      description: "You have successfully disconnected your Google account.",
    });
  };

  return (
    <>
      {isLoggedIn ? (
        <Button variant="destructive" onClick={handleDisconnect}>
          Disconnect Google
        </Button>
      ) : (
        <Button onClick={() => login()} variant="outline">
          <Google className="mr-2 h-4 w-4" />
          Sign In with Google
        </Button>
      )}
    </>
  );
};

export default GoogleSignIn;
