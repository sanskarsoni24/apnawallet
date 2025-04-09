
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PlanProps {
  title: string;
  price: string;
  description: string;
  features: PlanFeature[];
  highlighted?: boolean;
  buttonText?: string;
  docLimit: string;
  docSize: string;
}

const Plan = ({ 
  title, 
  price, 
  description, 
  features, 
  highlighted = false,
  buttonText = "Choose Plan",
  docLimit,
  docSize
}: PlanProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className={cn(
      "flex flex-col h-full", 
      highlighted && "border-primary shadow-md dark:bg-background/5"
    )}>
      <CardHeader>
        {highlighted && (
          <Badge className="w-fit mb-2">Most Popular</Badge>
        )}
        <CardTitle className="flex items-center justify-between">
          {title}
          {highlighted && <Star className="h-5 w-5 text-primary" />}
        </CardTitle>
        <div>
          <span className="text-2xl font-bold">{price}</span>
          {price !== "Free" && <span className="text-muted-foreground">/month</span>}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Documents</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Limit:</span>
                <span className="font-medium">{docLimit}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Size:</span>
                <span className="font-medium">{docSize}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Features</h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  {feature.included ? (
                    <Check className="h-4 w-4 text-primary mt-0.5" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-muted mt-0.5" />
                  )}
                  <span className={cn(
                    "text-sm", 
                    !feature.included && "text-muted-foreground"
                  )}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          variant={highlighted ? "default" : "outline"}
          onClick={() => navigate("/checkout")}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

import { cn } from "@/lib/utils";

const SubscriptionPlans = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Plan
        title="Free"
        price="Free"
        description="Basic document storage for personal use"
        docLimit="10 documents"
        docSize="5MB each"
        features={[
          { text: "Basic document management", included: true },
          { text: "Password protection", included: true },
          { text: "Mobile app access", included: true },
          { text: "Automatic backups", included: false },
          { text: "Export to cloud storage", included: false },
          { text: "Advanced sharing controls", included: false },
          { text: "Encryption key backup", included: false },
        ]}
        buttonText="Current Plan"
      />
      
      <Plan
        title="Basic"
        price="$4.99"
        description="Enhanced storage for individuals"
        docLimit="50 documents"
        docSize="15MB each"
        features={[
          { text: "Basic document management", included: true },
          { text: "Password protection", included: true },
          { text: "Mobile app access", included: true },
          { text: "Basic sharing options", included: true },
          { text: "Monthly backup", included: true },
          { text: "Export to cloud storage", included: false },
          { text: "Advanced sharing controls", included: false },
          { text: "Encryption key backup", included: false },
        ]}
      />
      
      <Plan
        title="Premium"
        price="$9.99"
        description="Complete solution for all your documents"
        docLimit="Unlimited"
        docSize="25MB each"
        highlighted={true}
        features={[
          { text: "Basic document management", included: true },
          { text: "Password protection", included: true },
          { text: "Mobile app access", included: true },
          { text: "Advanced sharing options", included: true },
          { text: "Automatic weekly backups", included: true },
          { text: "Export to cloud storage", included: true },
          { text: "Permission controls", included: true },
          { text: "Encryption key backup", included: true },
        ]}
      />
      
      <Plan
        title="Enterprise"
        price="$24.99"
        description="For teams and businesses with high demands"
        docLimit="Unlimited"
        docSize="100MB each"
        features={[
          { text: "Basic document management", included: true },
          { text: "Password protection", included: true },
          { text: "Mobile app access", included: true },
          { text: "Advanced sharing options", included: true },
          { text: "Daily automatic backups", included: true },
          { text: "Export to cloud storage", included: true },
          { text: "Team management", included: true },
          { text: "Document analytics", included: true },
          { text: "Priority support", included: true },
          { text: "Custom branding", included: true },
        ]}
      />
    </div>
  );
};

export default SubscriptionPlans;
