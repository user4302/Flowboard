import { cn } from '@/lib/utils';
import { addDays } from 'date-fns';
import { useTimelinePositioning } from '../hooks/useTimelinePositioning';

interface TimelineCardProps {
  card: any;
  allCards: any[];
  cardIndex: number;
  dateRange: Date[];
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year';
  onOpenCardModal: (cardId: string) => void;
  getCardColor: (card: any) => string;
}

export function TimelineCard({
  card,
  allCards,
  cardIndex,
  dateRange,
  zoomLevel,
  onOpenCardModal,
  getCardColor
}: TimelineCardProps) {
  // Use the useTimelinePositioning hook to get position
  const position = useTimelinePositioning(card, allCards, cardIndex, dateRange, zoomLevel);
  const color = getCardColor(card);

  // Only render cards that are at least partially visible in the timeline
  const cardStart = card.startDate || new Date();
  const cardEnd = card.dueDate || addDays(cardStart, 7);
  const rangeStart = dateRange[0];
  const rangeEnd = dateRange[dateRange.length - 1];

  // Skip cards that are completely outside the visible range
  if (cardEnd < rangeStart || cardStart > rangeEnd) {
    return null;
  }

  return (
    <div
      key={card.id}
      className={cn(
        'absolute h-8 rounded-md px-2 py-1 text-xs font-medium text-white shadow-sm cursor-pointer transition-all hover:shadow-md hover:z-10',
        `bg-${color}-500`
      )}
      style={position}
      title={card.title}
      onClick={() => onOpenCardModal(card.id)}
    >
      <div className="truncate">{card.title}</div>
    </div>
  );
}
