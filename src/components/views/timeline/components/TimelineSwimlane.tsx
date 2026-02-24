import { cn } from '@/lib/utils';
import { HiddenCardsIndicator } from './HiddenCardsIndicator';
import { TimelineCard } from './TimelineCard';

interface TimelineSwimlaneProps {
  list: any;
  listCards: any[];
  dateRange: Date[];
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year';
  onOpenCardModal: (cardId: string) => void;
  getCardColor: (card: any) => string;
  calculateTimelineHeight: (cards: any[], dateRange: Date[]) => number;
  children?: React.ReactNode;
}

export function TimelineSwimlane({
  list,
  listCards,
  dateRange,
  zoomLevel,
  onOpenCardModal,
  getCardColor,
  calculateTimelineHeight,
  children
}: TimelineSwimlaneProps) {
  // Calculate hidden cards for this specific list and determine position
  const rangeStart = dateRange[0];
  const rangeEnd = dateRange[dateRange.length - 1];
  const hiddenCardsBefore = listCards.filter(card => {
    const cardEnd = card.dueDate || require('date-fns').addDays(card.startDate || new Date(), 7);
    return cardEnd < rangeStart;
  });
  const hiddenCardsAfter = listCards.filter(card => {
    const cardStart = card.startDate || new Date();
    return cardStart > rangeEnd;
  });

  return (
    <div key={list.id} className="flex border-b border-slate-100 dark:border-slate-800">
      {/* List name */}
      <div className="w-48 flex-shrink-0 p-3">
        <h3 className="font-medium text-slate-900 dark:text-slate-100">
          {list.title}
        </h3>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {listCards.length} cards
        </div>
      </div>

      {/* Timeline area */}
      <div
        className="flex-1 relative"
        style={{
          minHeight: `${calculateTimelineHeight(listCards, dateRange)}px`
        }}
      >
        {/* Hidden cards indicator for this swimlane */}
        <HiddenCardsIndicator
          listId={list.id}
          hiddenCardsBefore={hiddenCardsBefore}
          hiddenCardsAfter={hiddenCardsAfter}
          onOpenCardModal={onOpenCardModal}
        />

        {/* Cards */}
        {children}
      </div>
    </div>
  );
}
