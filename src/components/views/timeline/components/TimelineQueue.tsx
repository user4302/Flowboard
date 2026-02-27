import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Card } from '@/lib/types';

/**
 * Queue component props interface
 * Defines the props for displaying hidden tasks indicators in timeline view
 */
interface QueueProps {
  // ID of the list containing hidden tasks
  listId: string;
  // Array of tasks hidden before the current date range
  hiddenTasksBefore: Card[];
  // Array of tasks hidden after the current date range
  hiddenTasksAfter: Card[];
  // Function to open task modal for editing
  onOpenTaskModal: (taskId: string) => void;
}

/**
 * Queue component - Displays indicators for tasks outside the current timeline view
 * Shows expandable lists of hidden tasks on both sides of the timeline
 * Provides hover interactions to reveal task details
 */
export function TimelineQueue({
  listId,
  hiddenTasksBefore,
  hiddenTasksAfter,
  onOpenTaskModal
}: QueueProps) {
  // Local state for tracking which hidden group is hovered
  const [hoveredHiddenGroup, setHoveredHiddenGroup] = useState<string | null>(null);

  return (
    <>
      {/* Left side indicator for tasks hidden before current date range */}
      {hiddenTasksBefore.length > 0 && (
        <div className="absolute top-2 left-2 z-20">
          <div
            className="relative"
            onMouseEnter={() => setHoveredHiddenGroup(`${listId}-before`)}
            onMouseLeave={() => setHoveredHiddenGroup(null)}
          >
            <div className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-md cursor-pointer shadow-lg">
              ←{hiddenTasksBefore.length} hidden
            </div>

            {/* Expandable hidden tasks list for tasks before current range */}
            {hoveredHiddenGroup === `${listId}-before` && (
              <div
                className="absolute top-0 left-0 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-30"
                onMouseEnter={() => setHoveredHiddenGroup(`${listId}-before`)}
                onMouseLeave={() => setHoveredHiddenGroup(null)}
              >
                <div className="p-3 max-h-48 overflow-y-auto">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 text-sm">
                    ← Before Current View ({hiddenTasksBefore.length})
                  </h4>
                  <div className="space-y-2">
                    {hiddenTasksBefore.map(task => (
                      <div
                        key={task.id}
                        className="p-2 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600"
                        onClick={() => onOpenTaskModal(task.id)}
                      >
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {task.title}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 mt-1">
                          {task.startDate && `${formatDate(task.startDate)} - ${task.dueDate && formatDate(task.dueDate)}`}
                        </div>
                        <div className="text-slate-400 dark:text-slate-500 mt-1">
                          {task.description && task.description.length > 50
                            ? task.description.substring(0, 50) + '...'
                            : task.description}
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

      {/* Right side indicator for tasks hidden after current date range */}
      {hiddenTasksAfter.length > 0 && (
        <div className="absolute top-2 right-2 z-20">
          <div
            className="relative"
            onMouseEnter={() => setHoveredHiddenGroup(`${listId}-after`)}
            onMouseLeave={() => setHoveredHiddenGroup(null)}
          >
            <div className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-md cursor-pointer shadow-lg">
              {hiddenTasksAfter.length} hidden→
            </div>

            {/* Expandable hidden tasks list for tasks after current range */}
            {hoveredHiddenGroup === `${listId}-after` && (
              <div
                className="absolute top-0 right-0 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-30"
                onMouseEnter={() => setHoveredHiddenGroup(`${listId}-after`)}
                onMouseLeave={() => setHoveredHiddenGroup(null)}
              >
                <div className="p-3 max-h-48 overflow-y-auto">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 text-sm">
                    After Current View → ({hiddenTasksAfter.length})
                  </h4>
                  <div className="space-y-2">
                    {hiddenTasksAfter.map(task => (
                      <div
                        key={task.id}
                        className="p-2 bg-slate-50 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600"
                        onClick={() => onOpenTaskModal(task.id)}
                      >
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {task.title}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 mt-1">
                          {task.startDate && `${formatDate(task.startDate)} - ${task.dueDate && formatDate(task.dueDate)}`}
                        </div>
                        <div className="text-slate-400 dark:text-slate-500 mt-1">
                          {task.description && task.description.length > 50
                            ? task.description.substring(0, 50) + '...'
                            : task.description}
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
