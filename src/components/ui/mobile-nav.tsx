
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

// Navigation links for the sidebar
const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/locker", label: "My Locker" },
  { href: "/documents", label: "Documents" },
  { href: "/settings", label: "Settings" },
  { href: "/mobile-app", label: "Mobile App" },
  { href: "/help", label: "Help" },
];

interface MobileNavProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

const MobileNav: React.FC<MobileNavProps> = ({ 
  open, 
  onOpenChange,
  children 
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Use controlled or uncontrolled state based on props
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const isSheetOpen = isControlled ? open : isOpen;
  const setIsSheetOpen = isControlled ? onOpenChange : setIsOpen;

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <nav className="flex flex-col gap-4 mt-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors",
                  isActive && "bg-secondary font-medium"
                )
              }
              onClick={() => setIsSheetOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
