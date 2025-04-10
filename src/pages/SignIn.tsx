import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useToast } from "@/components/ui/use-toast";

const SignIn = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative flex h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
        <div className="absolute inset-0 z-0 bg-[url(/dots-dark.png)] bg-repeat opacity-50" />
        <div className="my-auto">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold">Welcome back!</CardTitle>
            <CardDescription className="text-lg">
              Sign in to manage your documents efficiently.
            </CardDescription>
          </CardHeader>
        </div>
      </div>
      <div className="relative flex flex-col justify-center self-stretch px-6 py-10 sm:max-w-md lg:flex-1 lg:px-0">
        <div className="lg:p-8">
          <div className="mx-auto w-full max-w-sm">
            <CardHeader className="flex flex-col space-y-1.5 text-center">
              <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
              <CardDescription>Enter your email and password to sign in</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <GoogleSignIn mode="signin" />
            </CardContent>
            <CardContent className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account? <Link to="/signup" className="text-primary underline underline-offset-4">Sign up</Link>
              </p>
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
