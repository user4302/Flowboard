import { isCardInRange } from '../dateFilteringUtils';
import { startOfDay, endOfDay } from 'date-fns';

describe('dateFilteringUtils', () => {
  describe('isCardInRange', () => {
    it('should correctly filter tasks within the range', () => {
      // Create dates locally based on the UTC strings, then apply start/endOfDay
      const cardDate = new Date('2024-06-15T12:00:00Z');
      const rangeStart = new Date('2024-06-01T00:00:00Z');
      const rangeEnd = new Date('2024-06-30T23:59:59Z');
      
      expect(isCardInRange(cardDate, rangeStart, rangeEnd)).toBe(true);
    });

    it('should return false for tasks outside the range', () => {
      // Ensure the test date is genuinely after the range end in local time.
      // 2024-07-02 is safer than 2024-07-01 to avoid timezone boundary issues.
      const cardDate = new Date('2024-07-02T12:00:00Z');
      const rangeStart = new Date('2024-06-01T00:00:00Z');
      const rangeEnd = new Date('2024-06-30T23:59:59Z');
      
      expect(isCardInRange(cardDate, rangeStart, rangeEnd)).toBe(false);
    });
  });
});