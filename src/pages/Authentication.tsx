
import React from "react";
import { Helmet } from "react-helmet";
import Container from "@/components/layout/Container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Authentication: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Sign In or Sign Up - Surakshit Locker</title>
        <meta name="description" content="Sign in to your account or create a new one to access your secure documents." />
      </Helmet>
      <Container className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-md p-6 bg-card rounded-lg shadow-lg">
          <Tabs defaultValue="sign-in" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="sign-in">Sign In</TabsTrigger>
              <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="sign-in">
              <SignInForm />
            </TabsContent>
            <TabsContent value="sign-up">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </>
  );
};

export default Authentication;
