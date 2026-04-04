'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChromePicker } from 'react-color';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BASIC_LABEL_COLORS } from '@/lib/constants';
import { isValidHex, getContrastColor } from '@/lib/colorUtils';

/**
 * Color Picker Component Props
 */
interface ColorPickerProps {
  /** Currently selected color */
  value: string;
  /** Callback when color is selected */
  onChange: (color: string) => void;
  /** Optional placeholder text */
  placeholder?: string;
  /** Whether to show recent colors */
  showRecentColors?: boolean;
  /** Maximum number of recent colors to show */
  maxRecentColors?: number;
  /** Custom class names */
  className?: string;
}

/**
 * Recent Colors Storage Key
 */
const RECENT_COLORS_KEY = 'flowboard-recent-colors';

/**
 * ColorPicker Component
 * 
 * Provides a hybrid color selection interface:
 * - Basic color grid (10 curated colors)
 * - Custom color picker with Chrome picker
 * - Recent colors history
 * - Hex input field for precise values
 */
export function ColorPicker({
  value,
  onChange,
  placeholder = 'Select a color',
  showRecentColors = true,
  maxRecentColors = 5,
  className
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  // Load recent colors from localStorage
  useEffect(() => {
    if (showRecentColors) {
      try {
        const stored = localStorage.getItem(RECENT_COLORS_KEY);
        if (stored) {
          const colors = JSON.parse(stored);
          if (Array.isArray(colors)) {
            setRecentColors(colors.slice(0, maxRecentColors));
          }
        }
      } catch (error) {
        console.warn('Failed to load recent colors:', error);
      }
    }
  }, [showRecentColors, maxRecentColors]);

  // Update hex input when value changes
  useEffect(() => {
    setHexInput(value);
  }, [value]);

  // Save color to recent colors
  const saveToRecent = useCallback((color: string) => {
    if (!showRecentColors || !isValidHex(color)) return;

    setRecentColors(prev => {
      const filtered = prev.filter(c => c !== color);
      const updated = [color, ...filtered].slice(0, maxRecentColors);
      
      try {
        localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.warn('Failed to save recent colors:', error);
      }
      
      return updated;
    });
  }, [showRecentColors, maxRecentColors]);

  // Handle basic color selection
  const handleBasicColorSelect = useCallback((color: string) => {
    onChange(color);
    saveToRecent(color);
    setIsOpen(false);
  }, [onChange, saveToRecent]);

  // Handle custom color change
  const handleCustomColorChange = useCallback((color: any) => {
    if (color && color.hex) {
      const hex = color.hex;
      setHexInput(hex);
      if (isValidHex(hex)) {
        onChange(hex);
      }
    }
  }, [onChange]);

  // Handle hex input change
  const handleHexInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setHexInput(input);
    
    if (isValidHex(input)) {
      onChange(input);
    }
  }, [onChange]);

  // Handle hex input blur
  const handleHexInputBlur = useCallback(() => {
    if (isValidHex(hexInput)) {
      onChange(hexInput);
      saveToRecent(hexInput);
    }
  }, [hexInput, onChange, saveToRecent]);

  // Handle recent color selection
  const handleRecentColorSelect = useCallback((color: string) => {
    onChange(color);
    saveToRecent(color);
    setIsOpen(false);
  }, [onChange, saveToRecent]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !event.target || !(event.target as Element).closest('.color-picker-dropdown')) {
        setIsOpen(false);
        setShowCustomPicker(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setShowCustomPicker(false);
    } else if (e.key === 'Enter' && isOpen) {
      e.preventDefault();
      if (isValidHex(hexInput)) {
        onChange(hexInput);
        saveToRecent(hexInput);
        setIsOpen(false);
      }
    }
  }, [isOpen, hexInput, onChange, saveToRecent]);

  return (
    <div className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 border rounded-md text-sm font-medium transition-colors',
          'border-slate-300 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
          'dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white'
        )}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Color Preview */}
        <div 
          className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600"
          style={{ backgroundColor: value || '#ffffff' }}
        />
        
        {/* Color Text */}
        <span className="text-slate-700 dark:text-slate-300">
          {value || placeholder}
        </span>
        
        {/* Dropdown Arrow */}
        <ChevronDown className="h-4 w-4 text-slate-400 ml-auto" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="color-picker-dropdown absolute top-full left-0 mt-1 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
          <div className="p-4 space-y-4">
            {/* Basic Colors */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Basic Colors
              </label>
              <div className="grid grid-cols-5 gap-2">
                {BASIC_LABEL_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleBasicColorSelect(color)}
                    className={cn(
                      'w-12 h-12 rounded-md border-2 transition-all hover:scale-105',
                      'border-slate-200 dark:border-slate-600',
                      value === color && 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800'
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Custom Color Picker */}
            <div>
              <button
                type="button"
                onClick={() => setShowCustomPicker(!showCustomPicker)}
                className={cn(
                  'w-full px-3 py-2 text-sm font-medium rounded-md border transition-colors',
                  'border-slate-300 bg-slate-50 hover:bg-slate-100',
                  'dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white'
                )}
              >
                {showCustomPicker ? 'Hide Custom Color' : 'Custom Color'}
              </button>

              {showCustomPicker && (
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
                  <ChromePicker
                    color={value || '#ffffff'}
                    onChange={handleCustomColorChange}
                    disableAlpha
                    styles={{
                      default: {
                        picker: {
                          background: 'transparent',
                          boxShadow: 'none',
                          padding: '0',
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>

            {/* Hex Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Hex Color
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded border border-slate-300 dark:border-slate-600"
                    style={{ backgroundColor: hexInput || '#ffffff' }}
                  />
                  <input
                    type="text"
                    value={hexInput}
                    onChange={handleHexInputChange}
                    onBlur={handleHexInputBlur}
                    placeholder="#000000"
                    className={cn(
                      'w-full pl-10 pr-3 py-2 border rounded-md text-sm',
                      'border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                      'dark:border-slate-600 dark:bg-slate-800 dark:text-white',
                      !isValidHex(hexInput) && 'border-red-300 focus:ring-red-500 dark:border-red-600'
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (isValidHex(hexInput)) {
                      onChange(hexInput);
                      saveToRecent(hexInput);
                      setIsOpen(false);
                    }
                  }}
                  disabled={!isValidHex(hexInput)}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                    'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  Apply
                </button>
              </div>
              {!isValidHex(hexInput) && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  Please enter a valid hex color (e.g., #ff0000)
                </p>
              )}
            </div>

            {/* Recent Colors */}
            {showRecentColors && recentColors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Recent Colors
                </label>
                <div className="flex gap-2 flex-wrap">
                  {recentColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleRecentColorSelect(color)}
                      className={cn(
                        'w-8 h-8 rounded border-2 transition-all hover:scale-105',
                        'border-slate-200 dark:border-slate-600',
                        value === color && 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-800'
                      )}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex justify-end p-2 pt-0">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
