import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchAndFilterPortal } from './SearchAndFilterPortal';
import { useSearchAndFilterDropdownPosition } from '../hooks/useSearchAndFilterDropdownPosition';
import { DROPDOWN_MIN_WIDTH, DROPDOWN_Z_INDEX } from '../constants';

interface SearchAndFilterDropdownProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  selectedItems: string[];
  items: Array<{
    id: string;
    text?: string;
    color?: string;
    name?: string;
  }>;
  onToggle: (id: string) => void;
  itemType: 'label' | 'member';
  onPortalRef?: (ref: React.RefObject<HTMLDivElement | null>) => void;
}

export function SearchAndFilterDropdown({
  label,
  icon: Icon,
  selectedItems,
  items,
  onToggle,
  itemType,
  onPortalRef
}: SearchAndFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const portalDropdownRef = useRef<HTMLDivElement>(null);
  const { triggerRect, triggerRef } = useSearchAndFilterDropdownPosition(isOpen);

  // Register portal ref with parent when dropdown opens
  useEffect(() => {
    if (isOpen && onPortalRef && portalDropdownRef) {
      onPortalRef(portalDropdownRef);
    }
  }, [isOpen, onPortalRef]);

  const renderSelectedItem = (item: { id: string; text?: string; color?: string; name?: string }) => {
    if (itemType === 'label') {
      return (
        <div className={cn("h-3 w-3 rounded-full shrink-0 ring-2 ring-slate-900 group-hover:ring-slate-700 transition-all", item.color)} />
      );
    } else {
      return (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-white ring-2 ring-slate-900">
          {item.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || ''}
        </div>
      );
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-slate-400 mb-1">
        <Icon className="h-4 w-4" />
        <h3 className="text-xs font-bold uppercase tracking-wider">{label}</h3>
      </div>
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-medium transition-all border",
          selectedItems.length > 0
            ? "bg-blue-600/10 border-blue-500/30 text-blue-400"
            : "bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600"
        )}
      >
        <span>{selectedItems.length ? `${selectedItems.length} Selected` : 'Select...'}</span>
        <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && triggerRect && (
        <SearchAndFilterPortal>
          <div
            ref={portalDropdownRef}
            style={{
              position: 'fixed',
              top: `${triggerRect.bottom + 8}px`,
              left: `${triggerRect.left}px`,
              width: `${triggerRect.width}px`,
              minWidth: `${DROPDOWN_MIN_WIDTH}px`,
              zIndex: DROPDOWN_Z_INDEX,
            }}
            className="bg-slate-900 border border-slate-700 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-150"
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onToggle(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left group",
                  selectedItems.includes(item.id) ? "bg-blue-600/20 text-blue-400" : "hover:bg-slate-700 text-slate-400 hover:text-slate-100"
                )}
              >
                {renderSelectedItem(item)}
                <span className="truncate flex-1">{item.text || item.name}</span>
                {selectedItems.includes(item.id) && <Check className="h-3.5 w-3.5" />}
              </button>
            ))}
          </div>
        </SearchAndFilterPortal>
      )}
    </div>
  );
}
