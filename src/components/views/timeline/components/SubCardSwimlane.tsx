import { TimelineCard } from './TimelineCard';

interface SubCardSwimlaneProps {
  card: any;
  dateRange: Date[];
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year';
  onOpenCardModal: (cardId: string) => void;
  getCardPosition: (card: any, allCards: any[], cardIndex: number) => any;
  getCardColor: (card: any) => string;
  calculateTimelineHeight: (cards: any[], dateRange: Date[]) => number;
}

export function SubCardSwimlane({
  card,
  dateRange,
  zoomLevel,
  onOpenCardModal,
  getCardPosition,
  getCardColor,
  calculateTimelineHeight
}: SubCardSwimlaneProps) {
  return (
    <div className="flex border-b border-slate-50 dark:border-slate-700">
      {/* Empty space for main swimlane alignment */}
      <div className="w-48 flex-shrink-0 p-3">
        {/* This aligns with main swimlane header */}
      </div>

      {/* Timeline area with the card */}
      <div
        className="flex-1 relative"
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
    </div>
  );
}
