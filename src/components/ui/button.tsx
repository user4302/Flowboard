import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Button component variants using class-variance-authority
 * Defines consistent styling variants for different button styles and sizes
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        // Primary button style with indigo background
        default: 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]',
        // Secondary button style with subtle background
        secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
        // Ghost button style with transparent background
        ghost: 'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-100',
        // Outline button style with border
        outline: 'border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800',
        // Destructive button style for dangerous actions
        destructive: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        // Small button size
        sm: 'h-8 px-3 text-xs',
        // Medium button size (default)
        md: 'h-10 px-4 py-2',
        // Large button size
        lg: 'h-12 px-6 text-base',
        // Icon-only button size
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

/**
 * Button component props interface
 * Extends standard HTML button attributes with variant props
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  // Whether to render as a child component (for polymorphic components)
  asChild?: boolean;
}

/**
 * Button component - A versatile button component with multiple variants and sizes
 * Built with Tailwind CSS and class-variance-authority for consistent styling
 * Supports all standard HTML button attributes plus custom variants
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

// Set display name for debugging purposes
Button.displayName = 'Button';
