
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Container from "@/components/layout/Container";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Mail, ArrowLeft } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

const ForgotPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would call a backend API
      console.log("Password reset requested for:", values.email);
      
      setIsSubmitted(true);
      
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions to reset your password",
      });
    } catch (error) {
      toast({
        title: "Request failed",
        description: "There was an error sending the password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="flex items-center justify-center min-h-[calc(100vh-120px)] py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <BlurContainer>
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl">Reset your password</CardTitle>
                <CardDescription>
                  We'll email you instructions to reset your password
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {!isSubmitted ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </form>
                  </Form>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Email sent successfully
                          </p>
                          <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                            Please check your inbox for the password reset link. If you don't see it, check your spam folder.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setIsSubmitted(false);
                        form.reset();
                      }}
                    >
                      Send another email
                    </Button>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-center">
                <Button variant="link" asChild>
                  <Link to="/sign-in" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sign In
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </BlurContainer>
        </div>
      </div>
    </Container>
  );
};

export default ForgotPassword;
