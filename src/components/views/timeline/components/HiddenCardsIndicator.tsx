import { useState } from 'react';
import { formatDate } from '@/lib/utils';

interface HiddenCardsIndicatorProps {
  listId: string;
  hiddenCardsBefore: any[];
  hiddenCardsAfter: any[];
  onOpenCardModal: (cardId: string) => void;
}

export function HiddenCardsIndicator({ 
  listId, 
  hiddenCardsBefore, 
  hiddenCardsAfter, 
  onOpenCardModal 
}: HiddenCardsIndicatorProps) {
  const [hoveredHiddenGroup, setHoveredHiddenGroup] = useState<string | null>(null);

  return (
    <>
      {/* Left side indicator for cards hidden before range */}
      {hiddenCardsBefore.length > 0 && (
        <div className="absolute top-2 left-2 z-20">
          <div
            className="relative"
            onMouseEnter={() => setHoveredHiddenGroup(`${listId}-before`)}
            onMouseLeave={() => setHoveredHiddenGroup(null)}
          >
            <div className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-md cursor-pointer shadow-lg">
              ←{hiddenCardsBefore.length} hidden
            </div>
            
            {/* Expandable hidden cards list for cards before range */}
            {hoveredHiddenGroup === `${listId}-before` && (
              <div 
                className="absolute top-0 left-0 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-30"
                onMouseEnter={() => setHoveredHiddenGroup(`${listId}-before`)}
                onMouseLeave={() => setHoveredHiddenGroup(null)}
              >
                <div className="p-3 max-h-48 overflow-y-auto">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 text-sm">
                    ← Before Current View ({hiddenCardsBefore.length})
                  </h4>
                  <div className="space-y-2">
                    {hiddenCardsBefore.map(card => (
                      <div
                        key={card.id}
                        className="p-2 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600"
                        onClick={() => onOpenCardModal(card.id)}
                      >
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {card.title}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 mt-1">
                          {card.startDate && `${formatDate(card.startDate)} - ${card.dueDate && formatDate(card.dueDate)}`}
                        </div>
                        <div className="text-slate-400 dark:text-slate-500 mt-1">
                          {card.description && card.description.length > 50 
                            ? card.description.substring(0, 50) + '...'
                            : card.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right side indicator for cards hidden after range */}
      {hiddenCardsAfter.length > 0 && (
        <div className="absolute top-2 right-2 z-20">
          <div
            className="relative"
            onMouseEnter={() => setHoveredHiddenGroup(`${listId}-after`)}
            onMouseLeave={() => setHoveredHiddenGroup(null)}
          >
            <div className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-md cursor-pointer shadow-lg">
              {hiddenCardsAfter.length} hidden→
            </div>
            
            {/* Expandable hidden cards list for cards after range */}
            {hoveredHiddenGroup === `${listId}-after` && (
              <div 
                className="absolute top-0 right-0 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-30"
                onMouseEnter={() => setHoveredHiddenGroup(`${listId}-after`)}
                onMouseLeave={() => setHoveredHiddenGroup(null)}
              >
                <div className="p-3 max-h-48 overflow-y-auto">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 text-sm">
                    After Current View → ({hiddenCardsAfter.length})
                  </h4>
                  <div className="space-y-2">
                    {hiddenCardsAfter.map(card => (
                      <div
                        key={card.id}
                        className="p-2 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600"
                        onClick={() => onOpenCardModal(card.id)}
                      >
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {card.title}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 mt-1">
                          {card.startDate && `${formatDate(card.startDate)} - ${card.dueDate && formatDate(card.dueDate)}`}
                        </div>
                        <div className="text-slate-400 dark:text-slate-500 mt-1">
                          {card.description && card.description.length > 50 
                            ? card.description.substring(0, 50) + '...'
                            : card.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
