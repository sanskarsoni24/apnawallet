
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-indigo-500 to-purple-500 text-primary-foreground hover:shadow-lg hover:from-indigo-600 hover:to-purple-600 hover:-translate-y-0.5 transform transition-all",
        destructive:
          "bg-gradient-to-r from-red-500 to-rose-500 text-destructive-foreground hover:shadow-lg hover:from-red-600 hover:to-rose-600 hover:-translate-y-0.5 transform transition-all",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-md transform transition-all",
        secondary:
          "bg-gradient-to-r from-sky-500 to-cyan-500 text-secondary-foreground hover:shadow-lg hover:from-sky-600 hover:to-cyan-600 hover:-translate-y-0.5 transform transition-all",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:shadow-lg hover:from-violet-600 hover:to-fuchsia-600 hover:-translate-y-0.5 transform transition-all",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
