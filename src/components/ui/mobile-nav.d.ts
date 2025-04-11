
import { ReactNode } from 'react';

export interface MobileNavProps {
  navigation: {
    name: string;
    href: string;
    icon: React.ComponentType<any>;
    current: boolean;
    disabled?: boolean;
  }[];
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  user?: { email?: string };
}

declare const MobileNav: React.FC<MobileNavProps>;

export default MobileNav;
