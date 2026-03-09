'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  className?: string;
}

/**
 * CustomTooltip component - Shows tooltip on hover with custom styling
 * 
 * A lightweight tooltip component that displays text when hovering over child elements.
 * Features custom positioning, styling, and arrow indicator.
 * 
 * @param children - The element(s) that trigger the tooltip on hover
 * @param text - The tooltip text to display
 * @param className - Additional CSS classes for the wrapper container
 * 
 * @example
 * ```tsx
 * <CustomTooltip text="Click to add card">
 *   <button className="icon-button">
 *     <PlusIcon />
 *   </button>
 * </CustomTooltip>
 * ```
 */
export function CustomTooltip({ children, text, className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={cn("relative inline-block", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap z-50">
          {text}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-slate-800"></div>
          </div>
        </div>
      )}
    </div>
  );
}
