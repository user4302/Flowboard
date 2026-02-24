import { TimelineCard } from './TimelineCard';
import { getCardColor } from '../utils/timelineUtils';

interface IndividualCardSwimlaneProps {
  card: any;
  dateRange: Date[];
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year';
  onOpenCardModal: (cardId: string) => void;
  getCardPosition: (card: any, allCards: any[], cardIndex: number) => any;
  getCardColor: (card: any) => string;
  calculateTimelineHeight: (cards: any[], dateRange: Date[]) => number;
}

export function IndividualCardSwimlane({
  card,
  dateRange,
  zoomLevel,
  onOpenCardModal,
  getCardPosition,
  getCardColor,
  calculateTimelineHeight
}: IndividualCardSwimlaneProps) {
  const position = getCardPosition(card, [card], 0, dateRange, zoomLevel);
  const color = getCardColor(card);

  return (
    <div className="flex border-b border-slate-100 dark:border-slate-800">
      {/* Card title as swimlane header */}
      <div className="w-48 flex-shrink-0 p-3">
        <h3 className="font-medium text-slate-900 dark:text-slate-100">
          {card.title}
        </h3>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          1 card
        </div>
      </div>

      {/* Timeline area for this single card */}
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
