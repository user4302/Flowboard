import { cn } from '@/lib/utils';
import { addDays } from 'date-fns';

/**
 * Task Component
 * 
 * A single card component that renders within the timeline.
 * This component handles the visual representation of a card
 * with proper positioning, styling, and interactions.
 * 
 * Features:
 * - Dynamic positioning based on date range
 * - Color coding from card labels
 * - Click to open card modal
 * - Responsive design with hover effects
 * - Truncated text for long titles
 * 
 * @param card - The card data to render
 * @param allCards - Array of all cards for positioning calculations
 * @param cardIndex - Index of this card in the array
 * @param dateRange - Current visible date range
 * @param zoomLevel - Current timeline zoom level
 * @param onOpenTaskModal - Function to open card modal
 * @param getTaskPosition - Function to calculate card positioning
 * @param getTaskColor - Function to get card color from labels
 */
interface SwimmerProps {
  /** The card data to render */
  card: any;
  /** Array of all cards for positioning calculations */
  allCards: any[];
  /** Index of this card in the array */
  cardIndex: number;
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
}

/**
 * Task Component
 * 
 * Renders an individual card within the timeline with proper positioning
 * and styling based on its properties and the current zoom level.
 */
export function Task({
  card,
  allCards,
  cardIndex,
  dateRange,
  zoomLevel,
  onOpenTaskModal,
  getTaskPosition,
  getTaskColor
}: SwimmerProps) {
  // Only render cards that are at least partially visible in the timeline
  // Dates are already Date objects from localStorage conversion
  const cardStart = card.startDate || new Date();
  const cardEnd = card.dueDate || addDays(cardStart, 7);
  const rangeStart = dateRange[0];
  const rangeEnd = dateRange[dateRange.length - 1];

  // Normalize dates to start of day for comparison (to avoid time-based filtering issues)
  const cardStartDay = new Date(cardStart.getFullYear(), cardStart.getMonth(), cardStart.getDate());
  const cardEndDay = new Date(cardEnd.getFullYear(), cardEnd.getMonth(), cardEnd.getDate());
  const rangeStartDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
  const rangeEndDay = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate());

  // Skip cards that are completely outside the visible range
  // REMOVED: Let TimelineView handle filtering to avoid mismatches
  // if (cardEndDay < rangeStartDay || cardStartDay > rangeEndDay) {
  //   return null;
  // }

  const position = getTaskPosition(card, allCards, cardIndex);
  const color = getTaskColor(card);

  return (
    <div
      key={`${card.id}-${position.width}-${position.left}`}
      className={cn(
        'absolute h-8 rounded-md px-2 py-1 text-xs font-medium text-white shadow-sm cursor-pointer transition-all hover:shadow-md hover:z-10',
        `bg-${color}-500`
      )}
      style={position}
      title={card.title}
      onClick={() => onOpenTaskModal(card.id)}
    >
      <div className="truncate">{card.title}</div>
    </div>
  );
}
