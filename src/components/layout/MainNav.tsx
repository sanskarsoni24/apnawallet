import React from "react"
import { useTheme } from "next-themes"
import { Link } from "react-router-dom"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUserAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Home, Plus, Settings, User, HelpCircle, LogOut, Scan } from "lucide-react"

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {}

const MainNav = ({ className, ...props }: MainNavProps) => {
  const { theme } = useTheme()
  const { user, logout } = useUserAuth()
  const navigate = useNavigate()

  const navItems = [
    {
      title: "Home",
      href: "/dashboard",
      icon: <Home className="h-[1.2rem] w-[1.2rem]" />,
    },
    {
      title: "New Document",
      href: "/documents/new",
      icon: <Plus className="h-[1.2rem] w-[1.2rem]" />,
    },
    {
      title: "Scan to PDF",
      href: "/scan-to-pdf",
      icon: <Scan className="h-[1.2rem] w-[1.2rem]" />,
    },
  ]

  return (
    <div
      className={cn(
        "flex h-16 shrink-0 items-center space-x-4 pl-6 md:justify-between md:space-x-0",
        className
      )}
      {...props}
    >
      <Link to="/dashboard" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">{siteConfig.name}</span>
      </Link>
      <nav className="flex flex-1 items-center justify-between">
        <ul className="flex flex-1 items-center space-x-6 sm:space-x-8">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link to={item.href} className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground sm:text-base">
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "Avatar"} />
                    <AvatarFallback>{user?.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/help")}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Feedback</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout()
                    navigate("/")
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/sign-in">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}

export default MainNav
