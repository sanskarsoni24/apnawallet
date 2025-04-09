
import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  onDismiss?: () => void; // Adding this optional prop to fix TypeScript error
}

export function MobileNav({ open, onClose, children, onDismiss }: MobileNavProps) {
  // If onDismiss is provided, call it when the sheet is closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      if (onDismiss) {
        onDismiss();
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="left" className="w-[80%] max-w-sm">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
