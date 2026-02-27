import { Calendar, MessageSquare, CheckSquare } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { CardMetaProps } from '../types/TaskCard.types';
import { getDueDateClasses } from '../utils/TaskCardUtils';

export function TaskCardCardMeta({ card, isOverdue, checklistProgress }: CardMetaProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Due date */}
        {card.dueDate && (
          <div className={getDueDateClasses(card.completed, isOverdue)}>
            <Calendar className="h-3 w-3" />
            <span>{formatDate(card.dueDate)}</span>
          </div>
        )}

        {/* Checklist progress */}
        {card.checklist.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <CheckSquare className="h-3 w-3" />
            <span>{checklistProgress}%</span>
          </div>
        )}

        {/* Description indicator */}
        {card.description && (
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <MessageSquare className="h-3 w-3" />
          </div>
        )}
      </div>
    </div>
  );
}
