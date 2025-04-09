
import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileNav({ open, onClose, children }: MobileNavProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[80%] max-w-sm">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
