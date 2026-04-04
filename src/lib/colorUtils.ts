/**
 * Color Utility Functions
 * 
 * Provides utilities for converting between color formats,
 * calculating contrast, and adjusting color brightness.
 * 
 * Used throughout the application for consistent color handling
 * when migrating from Tailwind CSS classes to hex codes.
 */

/**
 * Maps Tailwind CSS color classes to their hex equivalents
 * Covers all 45 colors used in the original LABEL_COLORS array
 */
const TAILWIND_TO_HEX_MAP: Record<string, string> = {
  // Greens
  'bg-green-100': '#dcfce7',
  'bg-green-300': '#86efac',
  'bg-green-500': '#22c55e',
  'bg-green-600': '#16a34a',
  'bg-green-800': '#166534',

  // Yellows
  'bg-yellow-100': '#fef3c7',
  'bg-yellow-300': '#fde047',
  'bg-yellow-500': '#eab308',
  'bg-yellow-600': '#ca8a04',
  'bg-yellow-800': '#713f12',

  // Oranges
  'bg-orange-100': '#fed7aa',
  'bg-orange-300': '#fdba74',
  'bg-orange-500': '#f97316',
  'bg-orange-600': '#ea580c',
  'bg-orange-800': '#9a3412',

  // Reds
  'bg-red-100': '#fee2e2',
  'bg-red-300': '#fca5a5',
  'bg-red-500': '#ef4444',
  'bg-red-600': '#dc2626',
  'bg-red-800': '#991b1b',

  // Purples
  'bg-purple-100': '#f3e8ff',
  'bg-purple-300': '#d8b4fe',
  'bg-purple-500': '#a855f7',
  'bg-purple-600': '#9333ea',
  'bg-purple-800': '#581c87',

  // Azures/Blues
  'bg-sky-100': '#e0f2fe',
  'bg-sky-300': '#7dd3fc',
  'bg-sky-500': '#06b6d4',
  'bg-sky-600': '#0891b2',
  'bg-sky-800': '#0c4a6e',
  'bg-blue-100': '#dbeafe',
  'bg-blue-300': '#93c5fd',
  'bg-blue-500': '#3b82f6',
  'bg-blue-600': '#2563eb',
  'bg-blue-800': '#1e3a8a',

  // Teals
  'bg-teal-100': '#ccfbf1',
  'bg-teal-300': '#5eead4',
  'bg-teal-500': '#14b8a6',
  'bg-teal-600': '#0d9488',
  'bg-teal-800': '#134e4a',

  // Pinks
  'bg-pink-100': '#fce7f3',
  'bg-pink-300': '#f9a8d4',
  'bg-pink-500': '#ec4899',
  'bg-pink-600': '#db2777',
  'bg-pink-800': '#831843',

  // Slate/Grays
  'bg-slate-100': '#f1f5f9',
  'bg-slate-300': '#cbd5e1',
  'bg-slate-500': '#64748b',
  'bg-slate-600': '#475569',
  'bg-slate-800': '#1e293b',
} as const;

/**
 * Converts Tailwind CSS color class to hex code
 * @param tailwindClass - The Tailwind CSS class (e.g., 'bg-red-500')
 * @returns The equivalent hex color code (e.g., '#ef4444')
 */
export function tailwindToHex(tailwindClass: string): string {
  // If it's already a hex code, return as-is
  if (tailwindClass.startsWith('#')) {
    return tailwindClass;
  }

  // Look up in mapping
  const hex = TAILWIND_TO_HEX_MAP[tailwindClass];
  if (hex) {
    return hex;
  }

  // Fallback to slate-500 if color not found
  console.warn(`Unknown Tailwind color: ${tailwindClass}, falling back to #64748b`);
  return '#64748b';
}

/**
 * Validates if a string is a valid hex color
 * @param color - The color string to validate
 * @returns True if valid hex color, false otherwise
 */
export function isValidHex(color: string): boolean {
  if (!color || typeof color !== 'string') {
    return false;
  }

  // Remove # if present
  const hex = color.startsWith('#') ? color.slice(1) : color;

  // Check if it's 3 or 6 hex characters
  return /^[0-9A-Fa-f]{3}$/.test(hex) || /^[0-9A-Fa-f]{6}$/.test(hex);
}

/**
 * Converts hex color to RGB values
 * @param hex - The hex color code (e.g., '#ef4444')
 * @returns Object with r, g, b values (0-255)
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (!isValidHex(hex)) {
    return null;
  }

  // Remove # if present
  const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;

  // Convert 3-digit hex to 6-digit
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(c => c + c).join('')
    : cleanHex;

  const r = parseInt(fullHex.slice(0, 2), 16);
  const g = parseInt(fullHex.slice(2, 4), 16);
  const b = parseInt(fullHex.slice(4, 6), 16);

  return { r, g, b };
}

/**
 * Calculates the relative luminance of a color
 * Used for determining contrast ratios
 * @param rgb - Object with r, g, b values (0-255)
 * @returns The relative luminance (0-1)
 */
function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const { r, g, b } = rgb;

  // Normalize to 0-1 range
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  // Apply gamma correction
  const rGamma = rNorm <= 0.03928 ? rNorm / 12.92 : Math.pow((rNorm + 0.055) / 1.055, 2.4);
  const gGamma = gNorm <= 0.03928 ? gNorm / 12.92 : Math.pow((gNorm + 0.055) / 1.055, 2.4);
  const bGamma = bNorm <= 0.03928 ? bNorm / 12.92 : Math.pow((bNorm + 0.055) / 1.055, 2.4);

  return 0.2126 * rGamma + 0.7152 * gGamma + 0.0722 * bGamma;
}

/**
 * Determines the optimal text color for a given background color
 * Uses WCAG contrast ratio calculations
 * @param hexColor - The background hex color
 * @returns 'white' for dark backgrounds, 'black' for light backgrounds
 */
export function getContrastColor(hexColor: string): 'white' | 'black' {
  const rgb = hexToRgb(hexColor);
  if (!rgb) {
    return 'black'; // Fallback
  }

  const luminance = getLuminance(rgb);

  // WCAG threshold: if luminance > 0.5, use black text
  return luminance > 0.5 ? 'black' : 'white';
}

/**
 * Adjusts the brightness of a hex color
 * @param hexColor - The original hex color
 * @param percent - Percentage to adjust (-100 to 100, positive = lighter, negative = darker)
 * @returns The adjusted hex color
 */
export function adjustBrightness(hexColor: string, percent: number): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) {
    return hexColor; // Return original if invalid
  }

  const { r, g, b } = rgb;

  // Calculate adjustment factor
  const factor = percent / 100;

  // Adjust each channel
  let newR: number;
  let newG: number;
  let newB: number;

  if (factor > 0) {
    // Lighten: move towards white
    newR = Math.round(r + (255 - r) * factor);
    newG = Math.round(g + (255 - g) * factor);
    newB = Math.round(b + (255 - b) * factor);
  } else {
    // Darken: move towards black
    newR = Math.round(r * (1 + factor)); // factor is negative
    newG = Math.round(g * (1 + factor));
    newB = Math.round(b * (1 + factor));
  }

  // Clamp values to 0-255 range
  newR = Math.max(0, Math.min(255, newR));
  newG = Math.max(0, Math.min(255, newG));
  newB = Math.max(0, Math.min(255, newB));

  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

/**
 * Gets a lighter version of a color (useful for hover states)
 * @param hexColor - The original hex color
 * @param percent - How much lighter (0-100, default 20)
 * @returns The lighter hex color
 */
export function lighten(hexColor: string, percent: number = 20): string {
  return adjustBrightness(hexColor, percent);
}

/**
 * Gets a darker version of a color (useful for active states)
 * @param hexColor - The original hex color
 * @param percent - How much darker (0-100, default 20)
 * @returns The darker hex color
 */
export function darken(hexColor: string, percent: number = 20): string {
  return adjustBrightness(hexColor, -percent);
}
