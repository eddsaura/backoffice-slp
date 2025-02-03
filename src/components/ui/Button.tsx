import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500":
              variant === "primary",
            "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500":
              variant === "secondary",
            "border-transparent text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-blue-500":
              variant === "ghost",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
