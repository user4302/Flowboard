import { IndividualCardSwimlane } from './IndividualCardSwimlane';

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
      {/* Indent to show this is a sub-card within a main swimlane */}
      <div className="ml-12">
        {/* Individual card swimlane */}
        <IndividualCardSwimlane
          card={card}
          dateRange={dateRange}
          zoomLevel={zoomLevel}
          onOpenCardModal={onOpenCardModal}
          getCardPosition={getCardPosition}
          getCardColor={getCardColor}
          calculateTimelineHeight={calculateTimelineHeight}
        />
      </div>
    </div>
  );
}
