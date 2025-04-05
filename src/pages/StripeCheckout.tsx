
import React, { useEffect, useState } from 'react';
import Container from '@/components/layout/Container';
import BlurContainer from '@/components/ui/BlurContainer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// This is a mock implementation - in a real app you would connect to Stripe
const StripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get the plan from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    setPlan(planParam || '');
  }, []);

  const handleCheckout = () => {
    setLoading(true);
    
    // This is a mock - in a real app you would call your backend API
    // to create a Stripe checkout session
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Payment processed successfully!",
        description: "Thank you for your purchase. Your account has been upgraded.",
      });
      navigate('/documents');
    }, 2000);
  };

  return (
    <Container>
      <div className="max-w-2xl mx-auto py-8 animate-fade-in">
        <BlurContainer className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Complete Your Purchase</h2>
              <p className="text-muted-foreground">Secure payment via Stripe</p>
            </div>
          </div>

          <div className="space-y-6">
            <BlurContainer className="p-4 border">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">
                    {plan === 'pro' ? 'Professional Plan' : 
                     plan === 'business' ? 'Business Plan' : 'Basic Plan'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plan === 'pro' ? 'Perfect for small teams' : 
                     plan === 'business' ? 'For larger organizations' : 'Great for individuals'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">
                    {plan === 'pro' ? '$14.99' : 
                     plan === 'business' ? '$29.99' : '$9.99'}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Access to all core features</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Document scanning and OCR</span>
                </div>
                {(plan === 'pro' || plan === 'business') && (
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Advanced notifications and alerts</span>
                  </div>
                )}
                {plan === 'business' && (
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Team collaboration features</span>
                  </div>
                )}
              </div>
            </BlurContainer>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-lg">
              <h3 className="font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment Details
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                All payments are securely processed by Stripe. Your card information is never stored on our servers.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="w-1/2"
                onClick={() => navigate('/pricing')}
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button 
                onClick={handleCheckout} 
                disabled={loading} 
                className="w-1/2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-t-2 border-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" /> Pay Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </BlurContainer>
      </div>
    </Container>
  );
};

export default StripeCheckout;
