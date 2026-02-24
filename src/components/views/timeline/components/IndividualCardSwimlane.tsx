import { TimelineCard } from './TimelineCard';
import { getCardColor } from '../utils/timelineUtils';

/**
 * IndividualCardSwimlane Component
 * 
 * A swimlane component that displays a single card as its own swimlane.
 * This component is used for individual card visualization within the timeline.
 * 
 * Features:
 * - Displays card title as swimlane header
 * - Renders the card in the timeline area
 * - Responsive layout with fixed left panel
 * - Click interactions for card modal
 * 
 * @param card - The card to display
 * @param dateRange - Current visible date range
 * @param zoomLevel - Current timeline zoom level
 * @param onOpenCardModal - Function to open card modal
 * @param getCardPosition - Function to calculate card positioning
 * @param getCardColor - Function to get card color from labels
 * @param calculateTimelineHeight - Function to calculate timeline height
 */
interface IndividualCardSwimlaneProps {
  /** The card to display */
  card: any;
  /** Current visible date range */
  dateRange: Date[];
  /** Current timeline zoom level */
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year';
  /** Function to open card modal */
  onOpenCardModal: (cardId: string) => void;
  /** Function to calculate card positioning */
  getCardPosition: (card: any, allCards: any[], cardIndex: number) => any;
  /** Function to get card color from labels */
  getCardColor: (card: any) => string;
  /** Function to calculate timeline height */
  calculateTimelineHeight: (cards: any[], dateRange: Date[]) => number;
}

/**
 * IndividualCardSwimlane Component
 * 
 * Renders a single card as its own swimlane with the card title
 * as the header and the card positioned in the timeline area.
 */
export function IndividualCardSwimlane({
  card,
  dateRange,
  zoomLevel,
  onOpenCardModal,
  getCardPosition,
  getCardColor,
  calculateTimelineHeight
}: IndividualCardSwimlaneProps) {
  // Calculate card position and color
  const position = getCardPosition(card, [card], 0);
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
    </div>
  );
}
