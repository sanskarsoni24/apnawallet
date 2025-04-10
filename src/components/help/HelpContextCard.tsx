
import React from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, ArrowRight, PlusCircle, Calendar, Settings, Smartphone, FileText } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const HelpContextCard = () => {
  const location = useLocation();
  const { user } = useUser();
  const path = location.pathname;

  // Determine relevant help based on current route
  const getContextHelp = () => {
    switch (true) {
      case path.includes("/dashboard"):
        return {
          title: "Dashboard Help",
          description: "Get the most out of your dashboard",
          icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
          tips: [
            { 
              text: "Use the calendar view to see upcoming document expirations", 
              icon: <Calendar className="h-4 w-4" /> 
            },
            { 
              text: "Add your most important documents to the Quick Access section", 
              icon: <PlusCircle className="h-4 w-4" /> 
            },
            { 
              text: "Set up reminders for documents that will expire soon", 
              icon: <Calendar className="h-4 w-4" /> 
            }
          ],
          actionText: "View dashboard tutorials",
          actionLink: "/help?tab=faq"
        };
      
      case path.includes("/documents"):
        return {
          title: "Document Management Help",
          description: "Tips for organizing and managing your documents",
          icon: <FileText className="h-5 w-5 text-blue-500" />,
          tips: [
            { 
              text: "Create custom categories to organize similar documents", 
              icon: <PlusCircle className="h-4 w-4" /> 
            },
            { 
              text: "Use tags to make documents easier to find", 
              icon: <FileText className="h-4 w-4" /> 
            },
            { 
              text: "Set expiry reminders for important documents", 
              icon: <Calendar className="h-4 w-4" /> 
            }
          ],
          actionText: "Document management guide",
          actionLink: "/help?tab=faq"
        };
      
      case path.includes("/settings"):
        return {
          title: "Settings Help",
          description: "Configure your account and preferences",
          icon: <Settings className="h-5 w-5 text-gray-500" />,
          tips: [
            { 
              text: "Set up two-factor authentication for extra security", 
              icon: <Settings className="h-4 w-4" /> 
            },
            { 
              text: "Configure notification preferences for document reminders", 
              icon: <Settings className="h-4 w-4" /> 
            },
            { 
              text: "Update your recovery email and phone number", 
              icon: <Settings className="h-4 w-4" /> 
            }
          ],
          actionText: "Settings guide",
          actionLink: "/help?tab=security"
        };
      
      case path.includes("/mobile-app"):
        return {
          title: "Mobile App Help",
          description: "Get the most out of the mobile experience",
          icon: <Smartphone className="h-5 w-5 text-green-500" />,
          tips: [
            { 
              text: "Scan documents with your phone camera", 
              icon: <Smartphone className="h-4 w-4" /> 
            },
            { 
              text: "Mark important documents for offline access", 
              icon: <Smartphone className="h-4 w-4" /> 
            },
            { 
              text: "Use biometric authentication for faster access", 
              icon: <Smartphone className="h-4 w-4" /> 
            }
          ],
          actionText: "Mobile app guide",
          actionLink: "/help?tab=mobile"
        };
      
      default:
        return {
          title: "Help Center",
          description: "Find answers to common questions",
          icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
          tips: [
            { 
              text: "Watch video tutorials for common tasks", 
              icon: <Lightbulb className="h-4 w-4" /> 
            },
            { 
              text: "Learn about our security features", 
              icon: <Lightbulb className="h-4 w-4" /> 
            },
            { 
              text: "Contact support for personalized help", 
              icon: <Lightbulb className="h-4 w-4" /> 
            }
          ],
          actionText: "Browse help topics",
          actionLink: "#"
        };
    }
  };

  const contextHelp = getContextHelp();

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {contextHelp.icon}
          <CardTitle>{contextHelp.title}</CardTitle>
        </div>
        <CardDescription>
          {contextHelp.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {contextHelp.tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-primary">
                {tip.icon}
              </div>
              <p>{tip.text}</p>
            </div>
          ))}
          
          <Button variant="link" className="pl-0 h-auto mt-2" asChild>
            <a href={contextHelp.actionLink}>
              {contextHelp.actionText}
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HelpContextCard;
