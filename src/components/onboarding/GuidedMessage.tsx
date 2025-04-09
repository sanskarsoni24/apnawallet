
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, ArrowRight, ArrowLeft, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface GuideStep {
  id: string;
  title: string;
  description: string;
  image?: string;
  highlightElement?: string; // CSS selector for element to highlight
  placement?: 'top' | 'right' | 'bottom' | 'left' | 'center';
  action?: () => void;
}

interface GuidedMessageProps {
  steps: GuideStep[];
  onComplete?: () => void;
  startIndex?: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const GuidedMessage = ({
  steps,
  onComplete,
  startIndex = 0,
  isOpen,
  onOpenChange
}: GuidedMessageProps) => {
  const [currentStep, setCurrentStep] = useState(startIndex);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  const step = steps[currentStep];

  useEffect(() => {
    if (isOpen && step?.highlightElement) {
      const element = document.querySelector(step.highlightElement);
      setHighlightedElement(element);
      
      // Add highlight class to element
      if (element) {
        element.classList.add('guided-highlight');
      }
    }

    return () => {
      // Clean up highlight
      if (highlightedElement) {
        highlightedElement.classList.remove('guided-highlight');
      }
    };
  }, [isOpen, currentStep, step]);

  const handleNext = () => {
    // Remove highlight from current element
    if (highlightedElement) {
      highlightedElement.classList.remove('guided-highlight');
      setHighlightedElement(null);
    }

    // Execute step action if present
    if (step?.action) {
      step.action();
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    // Remove highlight from current element
    if (highlightedElement) {
      highlightedElement.classList.remove('guided-highlight');
      setHighlightedElement(null);
    }
    
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Remove highlight from current element
    if (highlightedElement) {
      highlightedElement.classList.remove('guided-highlight');
      setHighlightedElement(null);
    }
    
    // Close the guide
    onOpenChange(false);
    
    // Call onComplete callback
    if (onComplete) {
      onComplete();
    }
  };

  const getPositionClasses = () => {
    if (!step?.placement || step?.placement === 'center') {
      return "fixed inset-0 flex items-center justify-center z-50";
    }

    const positions = {
      top: "fixed top-4 left-1/2 transform -translate-x-1/2 z-50",
      right: "fixed right-4 top-1/2 transform -translate-y-1/2 z-50",
      bottom: "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50",
      left: "fixed left-4 top-1/2 transform -translate-y-1/2 z-50",
    };

    return positions[step.placement];
  };

  // Show as a dialog for better mobile experience
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{step?.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {step?.image && (
            <div className="w-full flex justify-center">
              <img 
                src={step.image} 
                alt={step.title} 
                className="max-h-40 object-contain rounded-md"
              />
            </div>
          )}
          <p className="text-sm">{step?.description}</p>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              size="sm"
              onClick={handleNext}
            >
              {currentStep < steps.length - 1 ? (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                "Finish"
              )}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {currentStep + 1} / {steps.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuidedMessage;
