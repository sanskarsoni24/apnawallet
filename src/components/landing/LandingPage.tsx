
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, FileText } from "lucide-react";
import BlurContainer from "../ui/BlurContainer";

const LandingPage = () => {
  return (
    <div className="flex flex-col space-y-12 py-8 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          Manage Your Documents
          <span className="text-primary block mt-2">With Ease</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          DocuNinja helps you organize, track, and manage all your important documents in one secure place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="font-medium">
            <Link to="/sign-up" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/sign-in">Sign In</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6 py-8">
        <BlurContainer className="p-6 flex flex-col items-center text-center space-y-4 animate-fade-in animation-delay-100">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Document Management</h3>
          <p className="text-muted-foreground">
            Easily upload, organize, and access all your important documents in one secure location.
          </p>
        </BlurContainer>

        <BlurContainer className="p-6 flex flex-col items-center text-center space-y-4 animate-fade-in animation-delay-200">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Expiration Reminders</h3>
          <p className="text-muted-foreground">
            Never miss important deadlines with automatic reminders for document expirations and renewals.
          </p>
        </BlurContainer>

        <BlurContainer className="p-6 flex flex-col items-center text-center space-y-4 animate-fade-in animation-delay-300">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Secure Storage</h3>
          <p className="text-muted-foreground">
            Your documents are encrypted and stored securely, accessible only to you whenever you need them.
          </p>
        </BlurContainer>
      </section>

      {/* Testimonial/Call to Action Section */}
      <section className="py-8">
        <BlurContainer className="p-8 md:p-12 rounded-xl relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background z-0"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to get organized?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of users who trust DocuNinja to manage their important documents.
              Sign up today and take control of your document management.
            </p>
            <Button asChild size="lg" className="mt-4">
              <Link to="/sign-up">Create Your Free Account</Link>
            </Button>
          </div>
        </BlurContainer>
      </section>
    </div>
  );
};

export default LandingPage;
