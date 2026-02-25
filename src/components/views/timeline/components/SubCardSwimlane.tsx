import { TimelineCard } from './TimelineCard';
import { getCardColor } from '../utils/timelineUtils';
import { useHiddenCards } from '../hooks/useHiddenCards';
import { MiniCardTooltip } from './MiniCardTooltip';

/**
 * SubCardSwimlane Component
 * 
 * A sub-swimlane component that displays a single card within a parent swimlane.
 * This component handles the rendering of hidden cards on both sides (before/after)
 * and the main card in the timeline area.
 * 
 * Features:
 * - Displays hidden cards as mini indicators on left/right sides
 * - Renders the main card with proper positioning
 * - Handles click interactions for all cards
 * - Responsive layout with fixed side panels
 * 
 * @param card - The main card to display in the timeline
 * @param dateRange - Current visible date range
 * @param zoomLevel - Current timeline zoom level
 * @param onOpenCardModal - Function to open card modal
 * @param getCardPosition - Function to calculate card positioning
 * @param getCardColor - Function to get card color from labels
 * @param calculateTimelineHeight - Function to calculate timeline height
 * @param allListCards - All cards from the same list for proper hidden cards calculation
 */
interface SubCardSwimlaneProps {
  /** The main card to display in the timeline */
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
  /** Array of cards hidden before the date range */
  hiddenCardsBefore: any[];
  /** Array of cards hidden after the date range */
  hiddenCardsAfter: any[];
}

/**
 * SubCardSwimlane Component
 * 
 * Renders a single card swimlane with hidden cards indicators on both sides.
 * This is used within parent swimlanes to display individual cards with
 * their contextual hidden cards.
 */
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
      <div className="w-48 flex-shrink-0 p-3 border-r border-slate-100 dark:border-slate-700 overflow-visible">
        <div className="flex flex-wrap gap-1">
          {hiddenCardsBefore.map((hiddenCard: any) => (
            <div
              key={hiddenCard.id}
              className="relative group"
            >
              <div
                className={`w-6 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity bg-${getCardColor(hiddenCard)}-500`}
                onClick={() => onOpenCardModal(hiddenCard.id)}
                title=""  // Remove browser tooltip
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999]">
                <MiniCardTooltip card={hiddenCard} position="before" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline area with the main card */}
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
      <div className="w-48 flex-shrink-0 p-3 border-l border-slate-100 dark:border-slate-700 overflow-visible">
        <div className="flex flex-wrap gap-1">
          {hiddenCardsAfter.map((hiddenCard: any) => (
            <div
              key={hiddenCard.id}
              className="relative group"
            >
              <div
                className={`w-6 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity bg-${getCardColor(hiddenCard)}-500`}
                onClick={() => onOpenCardModal(hiddenCard.id)}
                title=""  // Remove browser tooltip
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999]">
                <MiniCardTooltip card={hiddenCard} position="after" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
