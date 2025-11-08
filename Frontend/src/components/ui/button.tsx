import * as React from "react";
import { cn } from "../../utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "secondary" | "success" | "warning";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
          {
            "bg-blue-500 text-white shadow-sm hover:bg-blue-600 hover:shadow-md":
              variant === "default",
            "border border-gray-300 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900":
              variant === "outline",
            "hover:bg-gray-100 hover:text-gray-900": variant === "ghost",
            "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200":
              variant === "secondary",
            "bg-green-500 text-white shadow-sm hover:bg-green-600":
              variant === "success",
            "bg-yellow-500 text-white shadow-sm hover:bg-yellow-600":
              variant === "warning",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-xl px-3": size === "sm",
            "h-12 rounded-2xl px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };