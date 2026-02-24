import { useMemo } from 'react';
import { addDays } from 'date-fns';

export function useHiddenCards(listCards: any[], dateRange: Date[]) {
  return useMemo(() => {
    if (dateRange.length === 0) {
      return { hiddenCardsBefore: [], hiddenCardsAfter: [] };
    }

    const rangeStart = dateRange[0];
    const rangeEnd = dateRange[dateRange.length - 1];
    
    const hiddenCardsBefore = listCards.filter(card => {
      const cardEnd = card.dueDate || addDays(card.startDate || new Date(), 7);
      return cardEnd < rangeStart;
    });
    
    const hiddenCardsAfter = listCards.filter(card => {
      const cardStart = card.startDate || new Date();
      return cardStart > rangeEnd;
    });

    return { hiddenCardsBefore, hiddenCardsAfter };
  }, [listCards, dateRange]);
}
