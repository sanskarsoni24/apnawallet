
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Shield, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  recoveryKey: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const PasswordRecovery = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recoveryLinkSent, setRecoveryLinkSent] = useState(false);
  const [showRecoveryKey, setShowRecoveryKey] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      recoveryKey: "",
    },
  });

  const handleRecovery = (values: FormValues) => {
    setIsSubmitting(true);
    
    if (showRecoveryKey) {
      // Simulate recovery key validation
      setTimeout(() => {
        if (values.recoveryKey === "RECOVERY-KEY") {
          toast({
            title: "Recovery successful",
            description: "Your vault has been unlocked using the recovery key",
          });
          setIsOpen(false);
        } else {
          toast({
            title: "Invalid recovery key",
            description: "The recovery key you entered is not valid",
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
      }, 1500);
    } else {
      // Simulate email recovery process
      setTimeout(() => {
        setRecoveryLinkSent(true);
        setIsSubmitting(false);
        
        toast({
          title: "Recovery email sent",
          description: "Check your inbox for instructions to recover your vault",
        });
      }, 1500);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setRecoveryLinkSent(false);
      setShowRecoveryKey(false);
      form.reset();
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start px-2 mb-1 text-left"
        >
          <Key className="mr-2 h-4 w-4" />
          <span>Recover vault</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {showRecoveryKey ? "Use recovery key" : "Recover secure vault"}
          </DialogTitle>
          <DialogDescription>
            {recoveryLinkSent 
              ? "Recovery instructions have been sent to your email."
              : showRecoveryKey 
                ? "Enter your recovery key to unlock your vault data."
                : "We'll send instructions to recover access to your vault."}
          </DialogDescription>
        </DialogHeader>
        
        {!recoveryLinkSent ? (
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(handleRecovery)} 
              className="space-y-4"
            >
              {!showRecoveryKey ? (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="name@example.com" 
                            type="email" 
                            className="pl-10" 
                            {...field} 
                            disabled={isSubmitting}
                          />
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="recoveryKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recovery key</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="XXXX-XXXX-XXXX-XXXX" 
                            className="pl-10 font-mono" 
                            {...field} 
                            disabled={isSubmitting}
                          />
                          <Key className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {!showRecoveryKey && (
                <Button 
                  type="button" 
                  variant="link" 
                  className="px-0 h-auto text-xs"
                  onClick={() => setShowRecoveryKey(true)}
                >
                  Have a recovery key? Use it instead
                </Button>
              )}
              
              {showRecoveryKey && (
                <Button 
                  type="button" 
                  variant="link" 
                  className="px-0 h-auto text-xs"
                  onClick={() => setShowRecoveryKey(false)}
                >
                  Don't have a recovery key? Send email instructions
                </Button>
              )}
              
              <Alert variant="default" className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <AlertTitle>Security note</AlertTitle>
                <AlertDescription className="text-xs">
                  Due to our end-to-end encryption, we cannot recover your data without proper verification.
                  {showRecoveryKey 
                    ? " Your recovery key is the only way to unlock your encrypted data if you lose your password."
                    : " Email recovery requires verification of your identity."}
                </AlertDescription>
              </Alert>
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? "Processing..." 
                    : showRecoveryKey 
                      ? "Unlock Vault" 
                      : "Send Recovery Email"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <AlertTitle>Email sent</AlertTitle>
              <AlertDescription>
                We've sent recovery instructions to your email address.
                Please check your inbox including spam/junk folders.
              </AlertDescription>
            </Alert>
            
            <Alert variant="default" className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <AlertTitle>Important security note</AlertTitle>
              <AlertDescription>
                For security reasons, the recovery link will expire in 24 hours.
              </AlertDescription>
            </Alert>
            
            <DialogFooter>
              <Button 
                type="button" 
                onClick={handleClose}
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PasswordRecovery;
