import { Task } from './Task';
import { getTaskColor } from '../utils/utils';
import { Tooltip } from './Tooltip';

/**
 * TaskLane Component
 * 
 * A sub-tasklane component that displays a single card within a parent tasklane.
 * This component handles the rendering of hidden cards on both sides (before/after)
 * and the main card in the timeline area.
 * 
 * Features:
 * - Displays hidden cards as mini indicators on left/right sides (only for first card)
 * - Renders the main card with proper positioning
 * - Handles click interactions for all cards
 * - Responsive layout with fixed side panels
 * 
 * @param card - The main card to display in the timeline
 * @param dateRange - Current visible date range
 * @param zoomLevel - Current timeline zoom level
 * @param onOpenTaskModal - Function to open card modal
 * @param getTaskPosition - Function to calculate card positioning
 * @param getTaskColor - Function to get card color from labels
 * @param calculateTimelineHeight - Function to calculate timeline height
 * @param hiddenTasksBefore - Array of cards hidden before the date range (only for first card)
 * @param hiddenTasksAfter - Array of cards hidden after the date range (only for first card)
 */
interface TaskLane {
  /** The main card to display in the timeline */
  card: any;
  /** Current visible date range */
  dateRange: Date[];
  /** Current timeline zoom level */
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year';
  /** Function to open card modal */
  onOpenTaskModal: (cardId: string) => void;
  /** Function to calculate card positioning */
  getTaskPosition: (card: any, allCards: any[], cardIndex: number) => any;
  /** Function to get card color from labels */
  getTaskColor: (card: any) => string;
  /** Function to calculate timeline height */
  calculateTimelineHeight: (cards: any[], dateRange: Date[]) => number;
  /** Array of cards hidden before the date range (only for first card) */
  hiddenTasksBefore: any[];
  /** Array of cards hidden after the date range (only for first card) */
  hiddenTasksAfter: any[];
  /** All cards in the list for proper positioning */
  allCards: any[];
  /** Actual index of this card among all cards */
  cardIndex: number;
}

/**
 * TaskLane Component
 * 
 * Renders a single card tasklane with hidden cards indicators on both sides.
 * This is used within parent listlanes to display individual cards with
 * their contextual hidden cards (only for the first card in each list).
 */
export function TaskLane({
  card,
  dateRange,
  zoomLevel,
  onOpenTaskModal,
  getTaskPosition,
  getTaskColor,
  calculateTimelineHeight,
  hiddenTasksBefore,
  hiddenTasksAfter,
  allCards,
  cardIndex
}: TaskLane) {
  return (
    <div className="flex">
      {/* Left-side space for past hidden cards */}
      <div className="w-48 flex-shrink-0 p-3 border-r border-slate-100 dark:border-slate-700 overflow-visible">
        <div className="flex flex-wrap gap-1">
          {hiddenTasksBefore.map((hiddenCard: any) => (
            <div
              key={hiddenCard.id}
              className="relative group"
            >
              <div
                className={`w-6 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity bg-${getTaskColor(hiddenCard)}-500`}
                onClick={() => onOpenTaskModal(hiddenCard.id)}
                title=""  // Remove browser tooltip
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999]">
                <Tooltip card={hiddenCard} position="before" />
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
        <Task
          card={card}
          allCards={allCards}
          cardIndex={cardIndex}
          dateRange={dateRange}
          zoomLevel={zoomLevel}
          onOpenTaskModal={onOpenTaskModal}
          getTaskPosition={getTaskPosition}
          getTaskColor={getTaskColor}
        />
      </div>

      {/* Right-side space for future hidden cards */}
      <div className="w-48 flex-shrink-0 p-3 border-l border-slate-100 dark:border-slate-700 overflow-visible">
        <div className="flex flex-wrap gap-1">
          {hiddenTasksAfter.map((hiddenCard: any) => (
            <div
              key={hiddenCard.id}
              className="relative group"
            >
              <div
                className={`w-6 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity bg-${getTaskColor(hiddenCard)}-500`}
                onClick={() => onOpenTaskModal(hiddenCard.id)}
                title=""  // Remove browser tooltip
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999]">
                <Tooltip card={hiddenCard} position="after" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
