import { HiddenCardsIndicator } from './HiddenCardsIndicator';
import { TimelineCard } from './TimelineCard';
import { useHiddenCards } from '../hooks/useHiddenCards';

/**
 * TimelineSwimlane component props interface
 * Defines the props for rendering a single timeline swimlane
 */
interface TimelineSwimlaneProps {
  // List object containing list information
  list: any;
  // Array of cards belonging to this list
  listCards: any[];
  // Date range for the current timeline view
  dateRange: Date[];
  // Current zoom level
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year';
  // Function to open card modal for editing
  onOpenCardModal: (cardId: string) => void;
  // Function to calculate card position in timeline
  getCardPosition: (card: any, allCards: any[], cardIndex: number) => any;
  // Function to get card color based on properties
  getCardColor: (card: any) => string;
  // Function to calculate timeline height based on cards and date range
  calculateTimelineHeight: (cards: any[], dateRange: Date[]) => number;
}

/**
 * TimelineSwimlane component - Renders a single swimlane in timeline view
 * Displays list name, cards, and hidden cards indicators
 * Manages card positioning and visibility within the timeline
 */
export function TimelineSwimlane({
  list,
  listCards,
  dateRange,
  zoomLevel,
  onOpenCardModal,
  getCardPosition,
  getCardColor,
  calculateTimelineHeight
}: TimelineSwimlaneProps) {
  // Use the useHiddenCards hook to calculate which cards are hidden
  // before and after the current date range for this specific list
  const { hiddenCardsBefore, hiddenCardsAfter } = useHiddenCards(listCards, dateRange);

  return (
    <div key={list.id} className="flex border-b border-slate-100 dark:border-slate-800">
      {/* List name and card count */}
      <div className="w-48 flex-shrink-0 p-3">
        <h3 className="font-medium text-slate-900 dark:text-slate-100">
          {list.title}
        </h3>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {listCards.length} cards
        </div>
      </div>

      {/* Timeline area with cards and indicators */}
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

        {/* Render all cards in this swimlane */}
        {listCards.map((card, cardIndex) => (
          <TimelineCard
            key={card.id}
            card={card}
            allCards={listCards}
            cardIndex={cardIndex}
            dateRange={dateRange}
            zoomLevel={zoomLevel}
            onOpenCardModal={onOpenCardModal}
            getCardPosition={getCardPosition}
            getCardColor={getCardColor}
          />
        ))}
      </div>
    </div>
  );
}
