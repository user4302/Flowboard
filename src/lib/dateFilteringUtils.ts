import { startOfDay, endOfDay } from 'date-fns';

export const isCardInRange = (cardDate: Date, rangeStart: Date, rangeEnd: Date): boolean => {
  // Use timestamps to compare. Note: startOfDay and endOfDay operate on local time,
  // which is exactly what we want for "local calendar boundary" checks.
  // The test failure might be due to the test input being UTC strings parsed locally.
  const cardTime = cardDate.getTime();
  const start = startOfDay(rangeStart).getTime();
  const end = endOfDay(rangeEnd).getTime();
  
  return cardTime >= start && cardTime <= end;
};