
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, AlertCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PremiumFeatureProps {
  title: string;
  description: string;
  isPremium: boolean;
  isAvailable?: boolean;
}

const PremiumFeature = ({ title, description, isPremium, isAvailable = true }: PremiumFeatureProps) => {
  return (
    <div className="flex items-start gap-3 py-2">
      {isPremium && !isAvailable ? (
        <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
      ) : (
        <Check className="h-5 w-5 text-primary mt-0.5" />
      )}
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{title}</h4>
          {isPremium && (
            <Badge variant="outline" className="bg-primary/5 text-primary text-xs">
              Premium
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

interface PremiumFeaturesProps {
  showTitle?: boolean;
  showUpgradeButton?: boolean;
  isPremium?: boolean;
}

const PremiumFeatures = ({ 
  showTitle = true, 
  showUpgradeButton = true, 
  isPremium = false 
}: PremiumFeaturesProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle>Premium Features</CardTitle>
          <CardDescription>
            Upgrade your plan to access all premium features
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-2">
        <PremiumFeature
          title="Schedule Automatic Backups"
          description="Set up regular automatic backups of all your documents"
          isPremium={true}
          isAvailable={isPremium}
        />
        <PremiumFeature
          title="Export to Cloud Storage"
          description="Export documents to Google Drive, Dropbox, and other cloud providers"
          isPremium={true}
          isAvailable={isPremium}
        />
        <PremiumFeature
          title="Advanced Sharing Controls"
          description="Control permissions and track document access"
          isPremium={true}
          isAvailable={isPremium}
        />
        <PremiumFeature
          title="Encryption Key Backup"
          description="Store a secure backup of your encryption key"
          isPremium={true}
          isAvailable={isPremium}
        />
        <PremiumFeature
          title="Extended Document Limits"
          description="Upload larger and more documents"
          isPremium={true}
          isAvailable={isPremium}
        />
        
        {!isPremium && (
          <Alert className="mt-4 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50">
            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <AlertTitle>Limited Storage</AlertTitle>
            <AlertDescription>
              Free users are limited to 10 documents (max 5MB each). Upgrade to store more and larger documents.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      {showUpgradeButton && !isPremium && (
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={() => navigate("/pricing")}
          >
            Upgrade to Premium
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PremiumFeatures;
