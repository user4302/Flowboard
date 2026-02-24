import { TimelineCard } from './TimelineCard';

interface SubCardSwimlaneProps {
  card: any;
  dateRange: Date[];
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year';
  onOpenCardModal: (cardId: string) => void;
  getCardPosition: (card: any, allCards: any[], cardIndex: number) => any;
  getCardColor: (card: any) => string;
  calculateTimelineHeight: (cards: any[], dateRange: Date[]) => number;
  hiddenCardsBefore: any[];
  hiddenCardsAfter: any[];
}

export function SubCardSwimlane({
  card,
  dateRange,
  zoomLevel,
  onOpenCardModal,
  getCardPosition,
  getCardColor,
  calculateTimelineHeight,
  hiddenCardsBefore,
  hiddenCardsAfter
}: SubCardSwimlaneProps) {
  return (
    <div className="flex">
      {/* Left-side empty space for hidden cards indicator */}
      <div className="w-48 flex-shrink-0 p-3 border-r border-slate-100 dark:border-slate-700">
        {/* Hidden cards indicator for cards before current range */}
        {hiddenCardsBefore.length > 0 && (
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
            ←{hiddenCardsBefore.length}
          </div>
        )}
      </div>

      {/* Timeline area with the card */}
      <div
        className="flex-1 relative border-b border-slate-50 dark:border-slate-700"
        style={{
          minHeight: `${calculateTimelineHeight([card], dateRange)}px`
        }}
      >
        <TimelineCard
          card={card}
          allCards={[card]}
          cardIndex={0}
          dateRange={dateRange}
          zoomLevel={zoomLevel}
          onOpenCardModal={onOpenCardModal}
          getCardPosition={getCardPosition}
          getCardColor={getCardColor}
        />
      </div>

      {/* Right-side empty space for hidden cards indicator */}
      <div className="w-48 flex-shrink-0 p-3 border-l border-slate-100 dark:border-slate-700">
        {/* Hidden cards indicator for cards after current range */}
        {hiddenCardsAfter.length > 0 && (
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
            +{hiddenCardsAfter.length}
          </div>
        )}
      </div>
    </div>
  );
}
