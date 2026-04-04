/**
 * Unit Tests for Color Utility Functions
 */

import {
  isValidHex,
  getContrastColor,
  adjustBrightness,
  lighten,
  darken
} from '../colorUtils';

describe('Color Utilities', () => {
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
