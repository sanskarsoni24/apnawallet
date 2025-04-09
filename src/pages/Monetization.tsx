
import React from "react";
import Container from "@/components/layout/Container";
import { 
  Trophy, 
  CreditCard, 
  ListChecks, 
  Download, 
  HelpCircle, 
  Upload, 
  Clock, 
  Shield
} from "lucide-react";
import SubscriptionPlans from "@/components/premium/SubscriptionPlans";
import PremiumFeatures from "@/components/premium/PremiumFeatures";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Monetization = () => {
  const navigate = useNavigate();
  
  return (
    <Container>
      <div className="space-y-12">
        <div className="space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Choose the Right Plan
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Select a plan that's right for your document management needs
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-2 mb-8 mx-auto">
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Plans & Pricing</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              <span>Feature Comparison</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="plans" className="space-y-8">
            <SubscriptionPlans />
            
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => navigate("/help")}
                className="gap-2"
              >
                <HelpCircle className="h-4 w-4" />
                <span>Have questions? Visit our help center</span>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-1">
                    <Shield className="h-5 w-5 text-primary" />
                    Security Features
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Keep your documents safe and secure with our advanced security features
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Password Protection</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Available on all plans</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Encryption Key Backup</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-muted"></span>
                        <span className="w-3 h-3 rounded-full bg-muted"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Premium & Enterprise only</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Two-Factor Authentication</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-muted"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Basic, Premium & Enterprise</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-1">
                    <Upload className="h-5 w-5 text-primary" />
                    Storage Features
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Store and manage your documents with ease
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Document Limit</span>
                      <div className="flex items-center gap-1.5">
                        <div className="text-xs font-medium">
                          <span className="text-muted-foreground">Free:</span> 10
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground"></span>
                      <div className="flex items-center gap-1.5">
                        <div className="text-xs font-medium">
                          <span className="text-muted-foreground">Basic:</span> 50
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground"></span>
                      <div className="flex items-center gap-1.5">
                        <div className="text-xs font-medium">
                          <span className="text-muted-foreground">Premium+:</span> Unlimited
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Max Document Size</span>
                      <div className="flex items-center gap-1.5">
                        <div className="text-xs font-medium">
                          <span className="text-muted-foreground">Free:</span> 5MB
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground"></span>
                      <div className="flex items-center gap-1.5">
                        <div className="text-xs font-medium">
                          <span className="text-muted-foreground">Basic:</span> 15MB
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground"></span>
                      <div className="flex items-center gap-1.5">
                        <div className="text-xs font-medium">
                          <span className="text-muted-foreground">Premium:</span> 25MB
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground"></span>
                      <div className="flex items-center gap-1.5">
                        <div className="text-xs font-medium">
                          <span className="text-muted-foreground">Enterprise:</span> 100MB
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-1">
                    <Download className="h-5 w-5 text-primary" />
                    Backup & Export
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Keep your documents safe with automatic backups
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Manual Backup</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Available on all plans</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Automatic Backups</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-muted"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Basic, Premium & Enterprise</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Cloud Export</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-muted"></span>
                        <span className="w-3 h-3 rounded-full bg-muted"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Premium & Enterprise only</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-1">
                    <Clock className="h-5 w-5 text-primary" />
                    Sharing Features
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Share your documents securely with others
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Basic Sharing</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Available on all plans</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Password Protection</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Available on all plans</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Permission Controls</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-muted"></span>
                        <span className="w-3 h-3 rounded-full bg-muted"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Premium & Enterprise only</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Access Tracking</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-muted"></span>
                        <span className="w-3 h-3 rounded-full bg-muted"></span>
                        <span className="w-3 h-3 rounded-full bg-primary"></span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Premium & Enterprise only</p>
                  </div>
                </div>
              </div>
            </div>
            
            <PremiumFeatures showTitle={false} />
          </TabsContent>
        </Tabs>
        
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                How does the document limit work?
              </AccordionTrigger>
              <AccordionContent>
                Each subscription plan has a maximum number of documents you can store:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Free users: Up to 10 documents</li>
                  <li>Basic plan: Up to 50 documents</li>
                  <li>Premium plan: Unlimited documents</li>
                  <li>Enterprise plan: Unlimited documents</li>
                </ul>
                If you reach your limit, you'll need to delete some documents or upgrade your plan.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>
                What happens to my documents if I downgrade?
              </AccordionTrigger>
              <AccordionContent>
                If you downgrade to a plan with a lower document limit, and you have more documents 
                than the new plan allows, you'll be prompted to delete some documents to meet the 
                new limit. We recommend backing up any documents you need to delete before downgrading.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Can I upgrade or downgrade at any time?
              </AccordionTrigger>
              <AccordionContent>
                Yes, you can change your subscription plan at any time. When upgrading, 
                you'll get immediate access to all the features of your new plan. When downgrading, 
                the change will take effect at the end of your current billing cycle.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>
                How do I cancel my subscription?
              </AccordionTrigger>
              <AccordionContent>
                You can cancel your subscription at any time from the Settings → Subscription page. 
                Your subscription will remain active until the end of your current billing cycle, 
                after which you'll be downgraded to the Free plan.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>
                Is my payment information secure?
              </AccordionTrigger>
              <AccordionContent>
                Yes, we use Stripe, a PCI-compliant payment processor, to handle all payments. 
                We never store your complete credit card information on our servers.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Container>
  );
};

export default Monetization;
