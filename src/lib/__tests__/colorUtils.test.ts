/**
 * Unit Tests for Color Utility Functions
 */

import {
  tailwindToHex,
  isValidHex,
  getContrastColor,
  adjustBrightness,
  lighten,
  darken
} from '../colorUtils';

describe('Color Utilities', () => {
  describe('tailwindToHex', () => {
    it('should convert known Tailwind colors to hex', () => {
      expect(tailwindToHex('bg-red-500')).toBe('#ef4444');
      expect(tailwindToHex('bg-green-500')).toBe('#22c55e');
      expect(tailwindToHex('bg-blue-500')).toBe('#3b82f6');
    });

    it('should return hex codes unchanged', () => {
      expect(tailwindToHex('#ff0000')).toBe('#ff0000');
      expect(tailwindToHex('#00ff00')).toBe('#00ff00');
    });

    it('should handle unknown colors gracefully', () => {
      // Should console.warn and return fallback
      expect(tailwindToHex('bg-unknown-500')).toBe('#64748b');
    });

    it('should convert all 45 Tailwind colors', () => {
      const testColors = [
        'bg-green-100', 'bg-green-300', 'bg-green-500', 'bg-green-600', 'bg-green-800',
        'bg-yellow-100', 'bg-yellow-300', 'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-800',
        'bg-orange-100', 'bg-orange-300', 'bg-orange-500', 'bg-orange-600', 'bg-orange-800',
        'bg-red-100', 'bg-red-300', 'bg-red-500', 'bg-red-600', 'bg-red-800',
        'bg-purple-100', 'bg-purple-300', 'bg-purple-500', 'bg-purple-600', 'bg-purple-800',
        'bg-sky-100', 'bg-sky-300', 'bg-sky-500', 'bg-sky-600', 'bg-sky-800',
        'bg-blue-100', 'bg-blue-300', 'bg-blue-500', 'bg-blue-600', 'bg-blue-800',
        'bg-teal-100', 'bg-teal-300', 'bg-teal-500', 'bg-teal-600', 'bg-teal-800',
        'bg-pink-100', 'bg-pink-300', 'bg-pink-500', 'bg-pink-600', 'bg-pink-800',
        'bg-slate-100', 'bg-slate-300', 'bg-slate-500', 'bg-slate-600', 'bg-slate-800'
      ];

      testColors.forEach(color => {
        const result = tailwindToHex(color);
        expect(result).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(result).not.toBe('#000000'); // Should not return black unless intended
      });
    });
  });

  describe('isValidHex', () => {
    it('should validate correct hex colors', () => {
      expect(isValidHex('#ff0000')).toBe(true);
      expect(isValidHex('#00ff00')).toBe(true);
      expect(isValidHex('#0000ff')).toBe(true);
      expect(isValidHex('#ffffff')).toBe(true);
      expect(isValidHex('#000000')).toBe(true);
    });

    it('should validate 3-digit hex colors', () => {
      expect(isValidHex('#f00')).toBe(true);
      expect(isValidHex('#0f0')).toBe(true);
      expect(isValidHex('#00f')).toBe(true);
    });

    it('should validate hex without #', () => {
      expect(isValidHex('ff0000')).toBe(true);
      expect(isValidHex('00ff00')).toBe(true);
    });

    it('should reject invalid hex colors', () => {
      expect(isValidHex('#gggggg')).toBe(false);
      expect(isValidHex('ff000')).toBe(false);
      expect(isValidHex('#ff00000')).toBe(false);
      expect(isValidHex('')).toBe(false);
      expect(isValidHex(null as any)).toBe(false);
      expect(isValidHex(undefined as any)).toBe(false);
      expect(isValidHex(123 as any)).toBe(false);
    });
  });

  describe('getContrastColor', () => {
    it('should return black for light colors', () => {
      expect(getContrastColor('#ffffff')).toBe('black');
      expect(getContrastColor('#dcfce7')).toBe('black'); // green-100
      expect(getContrastColor('#fef3c7')).toBe('black'); // yellow-100
    });

    it('should return white for dark colors', () => {
      expect(getContrastColor('#000000')).toBe('white');
      expect(getContrastColor('#ef4444')).toBe('white'); // red-500
      expect(getContrastColor('#1e293b')).toBe('white'); // slate-800
    });

    it('should handle edge cases', () => {
      expect(getContrastColor('invalid')).toBe('black'); // fallback
      expect(getContrastColor('')).toBe('black'); // fallback
    });

    it('should handle medium brightness colors appropriately', () => {
      // Test colors around the 0.5 luminance threshold
      expect(getContrastColor('#64748b')).toBe('white'); // slate-500
      expect(getContrastColor('#94a3b8')).toBe('black'); // slate-400
    });
  });

  describe('adjustBrightness', () => {
    it('should lighten colors', () => {
      expect(adjustBrightness('#ff0000', 50)).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(adjustBrightness('#ff0000', 50)).not.toBe('#ff0000');
    });

    it('should darken colors', () => {
      expect(adjustBrightness('#ff0000', -50)).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(adjustBrightness('#ff0000', -50)).not.toBe('#ff0000');
    });

    it('should handle extreme values', () => {
      expect(adjustBrightness('#ff0000', 100)).toBe('#ffffff');
      expect(adjustBrightness('#ff0000', -100)).toBe('#000000');
    });

    it('should return original for invalid colors', () => {
      expect(adjustBrightness('invalid', 50)).toBe('invalid');
      expect(adjustBrightness('', 50)).toBe('');
    });

    it('should clamp values properly', () => {
      const result = adjustBrightness('#808080', 200); // Beyond 100%
      expect(result).toBe('#ffffff');
    });
  });

  describe('lighten', () => {
    it('should lighten colors by default 20%', () => {
      const result = lighten('#ff0000');
      expect(result).not.toBe('#ff0000');
      expect(result).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('should accept custom percentage', () => {
      const result1 = lighten('#ff0000', 10);
      const result2 = lighten('#ff0000', 30);
      expect(result1).not.toBe(result2);
      expect(result1).not.toBe('#ff0000');
      expect(result2).not.toBe('#ff0000');
    });
  });

  describe('darken', () => {
    it('should darken colors by default 20%', () => {
      const result = darken('#ff0000');
      expect(result).not.toBe('#ff0000');
      expect(result).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    it('should accept custom percentage', () => {
      const result1 = darken('#ff0000', 10);
      const result2 = darken('#ff0000', 30);
      expect(result1).not.toBe(result2);
      expect(result1).not.toBe('#ff0000');
      expect(result2).not.toBe('#ff0000');
    });
  });
});
