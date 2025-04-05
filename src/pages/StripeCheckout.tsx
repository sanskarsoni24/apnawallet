
import React, { useEffect, useState } from 'react';
import Container from '@/components/layout/Container';
import BlurContainer from '@/components/ui/BlurContainer';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Check, X, CreditCardIcon, Shield, Star, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// This is a mock implementation - in a real app you would connect to Stripe
const StripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get the plan from URL query params
    const urlParams = new URLSearchParams(location.search);
    const planParam = urlParams.get('plan');
    setPlan(planParam || '');
  }, [location]);

  // Get plan details based on plan name
  const getPlanDetails = () => {
    switch(plan) {
      case 'pro':
        return {
          name: 'Pro Plan',
          price: '$9.99',
          description: 'Perfect for small businesses and freelancers',
          features: [
            'Up to 50 document uploads',
            'Advanced notification settings',
            'Priority email support',
            'Document analytics',
            'Custom document categories'
          ]
        };
      case 'enterprise':
        return {
          name: 'Enterprise Plan',
          price: '$29.99',
          description: 'For larger organizations with advanced needs',
          features: [
            'Unlimited document uploads',
            'All Pro features',
            'API access for custom integrations',
            'Dedicated support team',
            'Custom integrations',
            'Multi-user access'
          ]
        };
      default:
        return {
          name: 'Basic Plan',
          price: '$4.99',
          description: 'Great for individuals',
          features: [
            'Up to 20 document uploads',
            'Basic notifications',
            'Email support'
          ]
        };
    }
  };

  const planDetails = getPlanDetails();

  const handleCheckout = () => {
    setLoading(true);
    
    // This is a mock - in a real app you would call your backend API
    // to create a Stripe checkout session
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Payment processed successfully!",
        description: `Thank you for your purchase. Your account has been upgraded to the ${planDetails.name}.`,
      });
      navigate('/documents');
    }, 2000);
  };

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8 animate-fade-in">
        <BlurContainer className="p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100/50 dark:border-indigo-800/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Complete Your Purchase</h2>
              <p className="text-muted-foreground">Secure payment via Stripe</p>
            </div>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-6">
              <BlurContainer className="p-5 border border-indigo-100/50 dark:border-indigo-800/30">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">
                      {planDetails.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {planDetails.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl">
                      {planDetails.price}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Billed monthly</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-indigo-100/50 dark:border-indigo-800/30">
                  <h4 className="font-medium mb-2">Plan Features</h4>
                  <ul className="space-y-2">
                    {planDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </BlurContainer>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-lg">
                <h3 className="font-medium flex items-center gap-2 text-sm text-indigo-800 dark:text-indigo-300">
                  <Shield className="h-4 w-4" /> Secure Payment Processing
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  All payments are securely processed by Stripe. Your card information is never stored on our servers.
                </p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 p-4 rounded-lg">
                <h3 className="font-medium flex items-center gap-2 text-sm text-blue-800 dark:text-blue-300">
                  <Star className="h-4 w-4" /> Subscription Benefits
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  You can cancel your subscription at any time. We'll keep your data safe and you can reactivate whenever you want.
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <BlurContainer className="p-5 border border-indigo-100/50 dark:border-indigo-800/30 bg-white/80 dark:bg-slate-900/80">
                <h3 className="font-medium mb-4">Payment Details</h3>
                
                <div className="space-y-4">
                  <div className="p-3 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md flex items-center justify-center bg-white dark:bg-gray-700">
                      <CreditCardIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Credit / Debit Card</p>
                      <p className="text-xs text-muted-foreground">Powered by Stripe</p>
                    </div>
                    <div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Subtotal</span>
                      <span className="font-medium">{planDetails.price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Taxes</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-100 dark:border-gray-800">
                      <span>Total</span>
                      <span>{planDetails.price}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button 
                    onClick={handleCheckout} 
                    disabled={loading} 
                    className="w-full py-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-t-2 border-white rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" /> Pay {planDetails.price}/month
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/pricing')}
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>
              </BlurContainer>
            </div>
          </div>
        </BlurContainer>
      </div>
    </Container>
  );
};

export default StripeCheckout;
