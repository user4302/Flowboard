import { useState, forwardRef, useRef, useEffect } from 'react';
import { CardJSON } from '@/lib/cardJsonUtils';
import { Plus, X, ClipboardPaste } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { cn } from '@/lib/utils';
import { getContrastColor } from '@/lib/colorUtils';
import { useClipboardDetection } from '@/hooks/useClipboardDetection';

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
  /** Enable smart paste button for card JSON */
  enableSmartPaste?: boolean;
  /** Callback when paste is clicked with card JSON data */
  onPasteCardJSON?: (cardJSON: CardJSON) => void;
  /** Show only icon for trigger button */
  iconOnly?: boolean;
  /** Tooltip text for icon-only mode */
  tooltipText?: string;
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
    enableSmartPaste = false,
    onPasteCardJSON,
    iconOnly = false,
    tooltipText,
  }, ref) => {
    const [showInput, setShowInput] = useState(false);
    const [value, setValue] = useState(initialValue);
    const containerRef = useRef<HTMLDivElement>(null);

    // Smart paste detection
    const { hasValidCardJSON, getCardJSONFromClipboard } = useClipboardDetection();

    // Auto-scroll to ensure the full input is visible when shown
    useEffect(() => {
      if (showInput && containerRef.current) {
        const container = containerRef.current;

        // Find the nearest scrollable parent
        let scrollableParent = container.parentElement;
        while (scrollableParent &&
          scrollableParent !== document.body &&
          scrollableParent.scrollWidth <= scrollableParent.clientWidth) {
          scrollableParent = scrollableParent.parentElement;
        }

        if (scrollableParent && scrollableParent.scrollWidth > scrollableParent.clientWidth) {
          // Calculate the right edge of the container relative to the scrollable parent
          const containerRect = container.getBoundingClientRect();
          const parentRect = scrollableParent.getBoundingClientRect();
          const rightEdge = containerRect.right - parentRect.right;

          // If the container is cut off on the right, scroll to make it fully visible
          if (rightEdge > 0) {
            scrollableParent.scrollBy({
              left: rightEdge + 20, // Add some padding
              behavior: 'smooth'
            });
          }
        }
      }
    }, [showInput]);

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

    const handlePasteCard = async () => {
      if (!onPasteCardJSON) return;

      const cardJSON = await getCardJSONFromClipboard();
      if (cardJSON) {
        onPasteCardJSON(cardJSON);
      }
    };

    if (showInput) {
      return (
        <div
          ref={containerRef}
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
      <div className="flex gap-2">
        <div className="relative group inline-block">
          <button
            ref={ref}
            className={cn(
              iconOnly
                ? "flex w-8 h-8 items-center justify-center rounded-xl transition-colors border border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                : "flex items-center gap-2 rounded-xl p-2 text-left text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-300",
              className
            )}
            style={iconOnly ? {} : { width: containerWidth === "auto" ? "auto" : containerWidth }}
            onClick={handleTriggerClick}
            {...triggerProps}
          >
            {triggerIcon}
            {!iconOnly && <span>{triggerText}</span>}
          </button>

          {/* Custom tooltip for icon-only mode */}
          {iconOnly && tooltipText && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              {tooltipText}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                <div className="border-4 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          )}
        </div>

        {/* Smart paste button - only show when enabled and valid JSON detected */}
        {enableSmartPaste && hasValidCardJSON && onPasteCardJSON && (
          <button
            className={cn(
              "flex items-center gap-2 rounded-xl p-2 text-left text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-400",
              "border border-blue-200 dark:border-blue-800"
            )}
            onClick={handlePasteCard}
            title="Paste card from clipboard"
          >
            <ClipboardPaste className="h-4 w-4" />
            <span>Paste Card</span>
          </button>
        )}
      </div>
    );
  }
);

InlineInput.displayName = 'InlineInput';
