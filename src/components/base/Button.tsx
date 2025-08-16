import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-1 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent border border-primary-1 rounded-lg",
        black: "bg-black text-yellow rounded-lg",
      },
      size: {
        default: "p-3 lg:py-4 lg:px-8 text-base leading-none lg:text-3xl lg:leading-[2.875rem]",
        lg: "px-8 py-6 lg:py-4.5 text-base leading-6 lg:text-3xl lg:leading-[2.875rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isFluid?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
	const cursorPoiner = asChild ? "cursor-default" : "cursor-pointer"; // cursor pointer for button, default for slot
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    >
      <span className="z-10 ">{children}</span>
    </Comp>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
