import { TimelineCard } from './TimelineCard';
import { getCardColor } from '../utils/timelineUtils';

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
      {/* Left-side space for past hidden cards */}
      <div className="w-48 flex-shrink-0 p-3 border-r border-slate-100 dark:border-slate-700">
        <div className="flex flex-wrap gap-1">
          {hiddenCardsBefore.map((hiddenCard) => (
            <div
              key={hiddenCard.id}
              className={`w-6 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity bg-${getCardColor(hiddenCard)}-500`}
              title={`${hiddenCard.title} (Before current view)`}
              onClick={() => onOpenCardModal(hiddenCard.id)}
            />
          ))}
        </div>
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

      {/* Right-side space for future hidden cards */}
      <div className="w-48 flex-shrink-0 p-3 border-l border-slate-100 dark:border-slate-700">
        <div className="flex flex-wrap gap-1">
          {hiddenCardsAfter.map((hiddenCard) => (
            <div
              key={hiddenCard.id}
              className={`w-6 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity bg-${getCardColor(hiddenCard)}-500`}
              title={`${hiddenCard.title} (After current view)`}
              onClick={() => onOpenCardModal(hiddenCard.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
