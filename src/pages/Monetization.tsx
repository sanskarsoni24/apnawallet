
import React, { useState } from "react";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { CreditCard, CheckCircle, DollarSign, Zap, Crown } from "lucide-react";
import BlurContainer from "@/components/ui/BlurContainer";
import { toast } from "@/hooks/use-toast";

const Monetization = () => {
  const { isLoggedIn } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handlePurchase = () => {
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "Choose a pricing plan before proceeding",
      });
      return;
    }

    // This would connect to a payment processor in production
    toast({
      title: "Purchase initiated",
      description: `Processing your ${selectedPlan} plan subscription`,
      variant: "default",
    });
    
    // Simulate a successful purchase after a delay
    setTimeout(() => {
      toast({
        title: "Purchase successful!",
        description: `Thank you for subscribing to the ${selectedPlan} plan!`,
        variant: "default",
      });
    }, 2000);
  };

  return (
    <Container>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Pricing Plans</h1>
          <p className="text-muted-foreground">
            Choose the perfect plan for managing your documents
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Free Plan */}
          <BlurContainer 
            className={`p-6 ${selectedPlan === 'Free' ? 'ring-2 ring-indigo-500' : ''} transition-all cursor-pointer hover:shadow-md`}
            onClick={() => handlePlanSelect('Free')}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              {selectedPlan === 'Free' && <CheckCircle className="h-6 w-6 text-green-500" />}
            </div>
            <h2 className="text-xl font-medium mb-2">Free Plan</h2>
            <p className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>5 document uploads</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Basic reminders</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Email support</span>
              </li>
            </ul>
            <Button 
              variant={selectedPlan === 'Free' ? "default" : "outline"} 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handlePlanSelect('Free');
              }}
            >
              Current Plan
            </Button>
          </BlurContainer>

          {/* Pro Plan */}
          <BlurContainer 
            className={`p-6 ${selectedPlan === 'Pro' ? 'ring-2 ring-indigo-500' : ''} transition-all cursor-pointer hover:shadow-md relative bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30`}
            onClick={() => handlePlanSelect('Pro')}
          >
            <div className="absolute -top-3 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              POPULAR
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              {selectedPlan === 'Pro' && <CheckCircle className="h-6 w-6 text-green-500" />}
            </div>
            <h2 className="text-xl font-medium mb-2">Pro Plan</h2>
            <p className="text-3xl font-bold mb-4">$9.99<span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>50 document uploads</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Advanced notifications</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Document analytics</span>
              </li>
            </ul>
            <Button 
              variant={selectedPlan === 'Pro' ? "default" : "outline"} 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handlePlanSelect('Pro');
              }}
            >
              Select Plan
            </Button>
          </BlurContainer>

          {/* Enterprise Plan */}
          <BlurContainer 
            className={`p-6 ${selectedPlan === 'Enterprise' ? 'ring-2 ring-indigo-500' : ''} transition-all cursor-pointer hover:shadow-md bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-950/30 dark:to-indigo-950/30`}
            onClick={() => handlePlanSelect('Enterprise')}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Crown className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              {selectedPlan === 'Enterprise' && <CheckCircle className="h-6 w-6 text-green-500" />}
            </div>
            <h2 className="text-xl font-medium mb-2">Enterprise</h2>
            <p className="text-3xl font-bold mb-4">$29.99<span className="text-sm font-normal text-gray-500">/month</span></p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Unlimited documents</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>All Pro features</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>API access</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Dedicated support</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Custom integrations</span>
              </li>
            </ul>
            <Button 
              variant={selectedPlan === 'Enterprise' ? "default" : "outline"} 
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handlePlanSelect('Enterprise');
              }}
            >
              Select Plan
            </Button>
          </BlurContainer>
        </div>

        <div className="mt-8">
          {isLoggedIn ? (
            <Button 
              onClick={handlePurchase} 
              disabled={!selectedPlan}
              className="px-8 py-6 text-lg flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              <CreditCard className="h-5 w-5" />
              Subscribe Now
            </Button>
          ) : (
            <div className="p-6 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/30">
              <h3 className="text-lg font-medium mb-2">Sign in required</h3>
              <p className="mb-4">Please sign in to subscribe to a plan.</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/sign-in'}
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default Monetization;
