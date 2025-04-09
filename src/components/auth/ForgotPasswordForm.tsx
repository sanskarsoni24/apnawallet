
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, LockKeyhole, Key } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [recoveryKey, setRecoveryKey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showRecoveryKeyDialog, setShowRecoveryKeyDialog] = useState(false);
  const { restoreFromBackupKey } = useUser();
  
  const handleSendResetEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would send an email with a reset link
    toast({
      title: "Recovery email sent",
      description: "Check your inbox for password reset instructions."
    });
    
    // Move to the next step
    setStep(2);
  };
  
  const handleResetWithRecoveryKey = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recoveryKey) {
      toast({
        title: "Recovery key required",
        description: "Please enter your recovery key.",
        variant: "destructive"
      });
      return;
    }
    
    // Try to restore using the recovery key
    const success = restoreFromBackupKey(recoveryKey);
    
    if (success) {
      setStep(3);
    }
  };
  
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 8) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would reset the password
    toast({
      title: "Password reset successful",
      description: "Your password has been reset. You can now log in with your new password."
    });
    
    // Go to the success step
    setStep(4);
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            {step === 1 && "Enter your email to receive password reset instructions."}
            {step === 2 && "Enter the verification code sent to your email."}
            {step === 3 && "Create a new password for your account."}
            {step === 4 && "Your password has been reset successfully."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === 1 && (
            <form onSubmit={handleSendResetEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="pl-10"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>
              
              <Dialog open={showRecoveryKeyDialog} onOpenChange={setShowRecoveryKeyDialog}>
                <DialogTrigger asChild>
                  <Button type="button" variant="link" className="p-0 h-auto">
                    Have a recovery key?
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Restore with Recovery Key</DialogTitle>
                    <DialogDescription>
                      If you have previously set up a recovery key, you can use it to restore access to your account.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="recovery-key">Recovery Key</Label>
                      <Input
                        id="recovery-key"
                        type="password"
                        value={recoveryKey}
                        onChange={(e) => setRecoveryKey(e.target.value)}
                        placeholder="Enter your recovery key"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowRecoveryKeyDialog(false)}>Cancel</Button>
                    <Button onClick={handleResetWithRecoveryKey}>Restore Access</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Button type="submit" className="w-full mt-6">
                Send Reset Instructions
              </Button>
            </form>
          )}
          
          {step === 2 && (
            <form onSubmit={handleResetWithRecoveryKey} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="code"
                    value={recoveryKey}
                    onChange={(e) => setRecoveryKey(e.target.value)}
                    placeholder="Enter verification code"
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter the 6-digit code sent to {email}
                </p>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit">
                  Verify
                </Button>
              </div>
            </form>
          )}
          
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pl-10"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="pl-10"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit">
                  Reset Password
                </Button>
              </div>
            </form>
          )}
          
          {step === 4 && (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Password Reset Successful</h3>
              <p className="text-muted-foreground mb-4">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <Link to="/signin">
                <Button>
                  Go to Login
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Remember your password?{" "}
            <Link to="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
