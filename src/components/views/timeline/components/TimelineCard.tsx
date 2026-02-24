import { cn } from '@/lib/utils';
import { addDays } from 'date-fns';

interface TimelineCardProps {
  card: any;
  allCards: any[];
  cardIndex: number;
  dateRange: Date[];
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year';
  onOpenCardModal: (cardId: string) => void;
  getCardPosition: (card: any, allCards: any[], cardIndex: number) => any;
  getCardColor: (card: any) => string;
}

export function TimelineCard({
  card,
  allCards,
  cardIndex,
  dateRange,
  zoomLevel,
  onOpenCardModal,
  getCardPosition,
  getCardColor
}: TimelineCardProps) {
  // Only render cards that are at least partially visible in the timeline
  const cardStart = card.startDate || new Date();
  const cardEnd = card.dueDate || addDays(cardStart, 7);
  const rangeStart = dateRange[0];
  const rangeEnd = dateRange[dateRange.length - 1];

  // Skip cards that are completely outside the visible range
  if (cardEnd < rangeStart || cardStart > rangeEnd) {
    return null;
  }

  const position = getCardPosition(card, allCards, cardIndex);
  const color = getCardColor(card);

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
