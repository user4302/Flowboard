interface MiniCardTooltipProps {
  card: any;
  position: 'before' | 'after';
}

export function MiniCardTooltip({ card, position }: MiniCardTooltipProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="absolute z-50 bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 min-w-[200px] pointer-events-none">
      <div className="font-medium text-sm mb-1">{card.title}</div>
      {card.description && (
        <div className="text-xs text-slate-300 mb-2 line-clamp-2">
          {card.description.length > 60 ? card.description.substring(0, 60) + '...' : card.description}
        </div>
      )}
      <div className="text-xs text-slate-400 space-y-1">
        {card.startDate && (
          <div>Start: {formatDate(new Date(card.startDate))}</div>
        )}
        {card.dueDate && (
          <div>Due: {formatDate(new Date(card.dueDate))}</div>
        )}
        <div className="text-xs italic text-slate-500">
          {position === 'before' ? 'Before current view' : 'After current view'}
        </div>
      </div>
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {card.labels.map((label: any, index: number) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded-full ${label.color}`}
            >
              {label.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
