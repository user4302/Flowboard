import { useState, forwardRef } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { cn } from '@/lib/utils';

export interface InlineInputProps {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Text for the add button */
  addText?: string;
  /** Text for the trigger button */
  triggerText?: string;
  /** Whether to show the trigger button */
  showTrigger?: boolean;
  /** Callback when add is clicked */
  onAdd: (value: string) => void;
  /** Callback when cancel is clicked */
  onCancel?: () => void;
  /** Initial value for the input */
  initialValue?: string;
  /** Custom trigger icon */
  triggerIcon?: React.ReactNode;
  /** Container width */
  containerWidth?: string;
  /** Additional CSS classes */
  className?: string;
  /** Additional props for the trigger button */
  triggerProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  /** Additional props for the input container */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

/**
 * InlineInput component - A reusable inline input with add/cancel functionality
 * Common pattern used throughout the app for adding cards, lists, etc.
 */
export const InlineInput = forwardRef<HTMLButtonElement, InlineInputProps>(
  ({
    className,
    placeholder = "Enter text...",
    addText = "Add",
    triggerText = "Add item",
    showTrigger = true,
    onAdd,
    onCancel,
    initialValue = "",
    triggerIcon = <Plus className="h-4 w-4" />,
    containerWidth = "auto",
    triggerProps = {},
    containerProps = {},
  }, ref) => {
    const [showInput, setShowInput] = useState(false);
    const [value, setValue] = useState(initialValue);

    const handleAdd = () => {
      if (value.trim()) {
        onAdd(value.trim());
        setValue('');
        setShowInput(false);
      }
    };

    const handleCancel = () => {
      setShowInput(false);
      setValue('');
      onCancel?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAdd();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    };

    const handleBlur = () => {
      setTimeout(() => {
        handleCancel();
      }, 200);
    };

    const handleTriggerClick = () => {
      setShowInput(true);
    };

    if (showInput) {
      return (
        <div
          className={cn(
            "rounded-xl border border-slate-200 p-3 dark:border-slate-700",
            className
          )}
          style={{ width: containerWidth === "auto" ? "auto" : containerWidth }}
          {...containerProps}
        >
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd}>
              {addText}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    if (!showTrigger) return null;

    return (
      <button
        ref={ref}
        className={cn(
          "flex items-center gap-2 rounded-xl p-3 text-left text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300",
          className
        )}
        style={{ width: containerWidth === "auto" ? "auto" : containerWidth }}
        onClick={handleTriggerClick}
        {...triggerProps}
      >
        {triggerIcon}
        <span>{triggerText}</span>
      </button>
    );
  }
);

InlineInput.displayName = 'InlineInput';
