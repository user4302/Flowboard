import { useUIStore } from '@/store';
import { Card } from '@/lib/types';
import { TaskLane } from './TaskLane';
import { useHiddenTasks } from '../hooks/useHiddenTasks';
import { getTaskColor } from '../utils/utils';
import { addDays } from 'date-fns';

/**
 * ListLane component props interface
 * Defines the props for rendering a board list within the timeline
 */
interface ListLaneProps {
  // Board ID
  boardId: string;
  // List object containing list information
  list: any;
  // Array of tasks belonging to this list (filtered for date range)
  listTasks: Card[];
  // Date range for the current timeline view
  dateRange: Date[];
  // Current zoom level
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year';
  // UI Actions
  openCardModal: (cardId: string) => void;
  toggleTimelineLane: (boardId: string, listId: string) => void;
  // Logic utilities
  getTaskPosition: (card: Card, allCards: Card[], cardIndex: number) => any;
  calculateTimelineHeight: (cards: Card[], dateRange: Date[]) => number;
  // State
  isCollapsed: boolean;
  // Tooltip tracking
  setHoveredTask: (hovered: { task: Card; position: 'before' | 'after'; x: number; y: number } | null) => void;
}

/**
 * ListLane component - Renders a major lane representing a Board List
 * Handles lane headers, collapsible state, and individual sub-lanes for tasks.
 */
export function ListLane({
  boardId,
  list,
  listTasks,
  dateRange,
  zoomLevel,
  openCardModal,
  toggleTimelineLane,
  getTaskPosition,
  calculateTimelineHeight,
  isCollapsed,
  setHoveredTask
}: ListLaneProps) {
  return (
    <div key={list.id} className="border-2 border-slate-200 dark:border-slate-700 rounded-lg mb-4 overflow-visible">
      {/* ... (rest of the component) */}
      <div
        className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        onClick={() => toggleTimelineLane(boardId, list.id)}
      >
        {/* ... (header content) */}
      </div>

      {/* Sub-lanes for individual tasks */}
      {!isCollapsed && (
        <div className="bg-white dark:bg-slate-900">
          {listTasks.length > 0 ? (
            (() => {
              const allListTasks = list.cards as Card[];
              const visibleTaskIds = new Set(listTasks.map((task: Card) => task.id));
              const trulyHiddenTasks = allListTasks.filter((task: Card) => !visibleTaskIds.has(task.id));
              const { hiddenTasksBefore, hiddenTasksAfter } = useHiddenTasks(trulyHiddenTasks, dateRange);

              return listTasks.map((task: Card, taskIndex: number) => (
                <TaskLane
                  key={task.id}
                  task={task}
                  dateRange={dateRange}
                  zoomLevel={zoomLevel}
                  onOpenTaskModal={openCardModal}
                  getTaskPosition={getTaskPosition}
                  getTaskColor={getTaskColor}
                  calculateTimelineHeight={calculateTimelineHeight}
                  hiddenTasksBefore={taskIndex === 0 ? hiddenTasksBefore : []}
                  hiddenTasksAfter={taskIndex === 0 ? hiddenTasksAfter : []}
                />
              ));
            })()
          ) : (
            list.cards.length > 0 ? (
              <div className="flex border-b border-slate-50 dark:border-slate-700">
                <div className="w-48 flex-shrink-0 p-3 border-r border-slate-100 dark:border-slate-700">
                  <div className="flex flex-wrap gap-1">
                    {list.cards.map((task: Card) => {
                      const taskEnd = task.dueDate || addDays(task.startDate || new Date(), 7);
                      if (taskEnd < dateRange[0]) {
                        return (
                          <div
                            key={task.id}
                            className={`w-6 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity bg-${getTaskColor(task)}-500 relative`}
                            title={`${task.title} (Before current view)`}
                            onClick={() => openCardModal(task.id)}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredTask({
                                task: task,
                                position: 'before',
                                x: rect.left + rect.width / 2,
                                y: rect.bottom + 8
                              });
                            }}
                            onMouseLeave={() => setHoveredTask(null)}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
                <div className="flex-1 relative flex items-center justify-center" style={{ minHeight: '60px' }}>
                  <div className="text-slate-400 dark:text-slate-500 text-sm italic">
                    All tasks are outside current date range
                  </div>
                </div>
                <div className="w-48 flex-shrink-0 p-3 border-l border-slate-100 dark:border-slate-700">
                  <div className="flex flex-wrap gap-1">
                    {list.cards.map((task: Card) => {
                      const taskStart = task.startDate || new Date();
                      if (taskStart > dateRange[dateRange.length - 1]) {
                        return (
                          <div
                            key={task.id}
                            className={`w-6 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity bg-${getTaskColor(task)}-500 relative`}
                            title={`${task.title} (After current view)`}
                            onClick={() => openCardModal(task.id)}
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              setHoveredTask({
                                task: task,
                                position: 'after',
                                x: rect.left + rect.width / 2,
                                y: rect.bottom + 8
                              });
                            }}
                            onMouseLeave={() => setHoveredTask(null)}
                          />
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex border-b border-slate-50 dark:border-slate-700">
                <div className="w-48 flex-shrink-0 p-3 border-r border-slate-100 dark:border-slate-700">
                  <div className="text-xs text-slate-400 dark:text-slate-500 text-center italic">
                    No tasks in list
                  </div>
                </div>
                <div className="flex-1 relative flex items-center justify-center" style={{ minHeight: '60px' }}>
                  <div className="text-slate-400 dark:text-slate-500 text-sm italic">
                    Add tasks to this list to see them here
                  </div>
                </div>
                <div className="w-48 flex-shrink-0 p-3 border-l border-slate-100 dark:border-slate-700" />
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
