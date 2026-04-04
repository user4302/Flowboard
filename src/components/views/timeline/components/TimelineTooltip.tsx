import { Card, Label } from '@/lib/types';
import { getContrastColor } from '@/lib/colorUtils';

/**
 * Tooltip Component
 * 
 * A tooltip component that displays detailed information about a hidden task
 * when hovering over mini task indicators in the timeline.
 * 
 * Features:
 * - Shows task title and description
 * - Displays date range information
 * - Indicates position (before/after current view)
 * - Styled tooltip with proper positioning
 * - Responsive text truncation
 * 
 * @param task - The task data to display in tooltip
 * @param position - Whether the task is before or after current view
 */
interface TooltipProps {
  /** The task data to display in tooltip */
  task: Card;
  /** Position relative to current view (before/after) */
  position: 'before' | 'after';
  /** Labels available on the board */
  boardLabels: Label[];
}

/**
 * Tooltip Component
 * 
 * Renders a styled tooltip showing task details when hovering
 * over mini task indicators in the timeline.
 */
export function TimelineTooltip({ task, boardLabels }: TooltipProps) {
  // Helper function to format dates consistently
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="absolute z-[9999] bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 min-w-[200px] pointer-events-none">
      {/* Task title */}
      <div className="font-medium text-sm mb-1">{task.title}</div>

      {/* Task description (truncated) */}
      {task.description && (
        <div className="text-xs text-slate-300 mb-2 line-clamp-2">
          {task.description.length > 60 ? task.description.substring(0, 60) + '...' : task.description}
        </div>
      )}
      <div className="text-xs text-slate-400 space-y-1">
        {task.startDate && (
          <div>Start: {formatDate(new Date(task.startDate))}</div>
        )}
        {task.dueDate && (
          <div>Due: {formatDate(new Date(task.dueDate))}</div>
        )}
      </div>
      {task.labelIds?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.labelIds.map((labelId: string) => {
            const label = boardLabels.find(l => l.id === labelId);
            if (!label) return null;
            return (
              <span
                key={label.id}
                className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{
                  backgroundColor: label.color,
                  color: getContrastColor(label.color)
                }}
              >
                {label.text}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
