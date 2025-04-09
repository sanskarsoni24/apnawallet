
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
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
});

type FormValues = z.infer<typeof formSchema>;

interface ForgotPasswordProps {
  onBack?: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleResetPassword = (values: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setResetSent(true);
      setIsSubmitting(false);
      
      // In a real app, we would send a reset email here
      console.log("Password reset requested for:", values.email);
      
      // Show a success message
      toast({
        title: "Reset link sent",
        description: "Please check your email for password reset instructions",
      });
    }, 1500);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setResetSent(false);
      form.reset();
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="px-0" onClick={() => setIsOpen(true)}>
          Forgot password?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            {!resetSent 
              ? "Enter your email address and we'll send you a link to reset your password."
              : "Password reset instructions have been sent to your email."}
          </DialogDescription>
        </DialogHeader>
        
        {!resetSent ? (
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(handleResetPassword)} 
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                {onBack && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      handleClose();
                      onBack();
                    }}
                    className="w-full sm:w-auto"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                )}
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <AlertTitle>Email sent</AlertTitle>
              <AlertDescription>
                We've sent password reset instructions to your email address.
                Please check your inbox including spam/junk folders.
              </AlertDescription>
            </Alert>
            
            <Alert variant="default" className="bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <AlertTitle>Important note about security</AlertTitle>
              <AlertDescription>
                Due to our end-to-end encryption, resetting your password may affect access 
                to previously encrypted documents. New documents will be secured with your new password.
              </AlertDescription>
            </Alert>
            
            <DialogFooter>
              <Button 
                type="button" 
                onClick={handleClose}
                className="w-full sm:w-auto"
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

export default ForgotPassword;
