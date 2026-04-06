import { Card, List, Label } from '@/lib/types';
import { TimelineTaskLane } from './TimelineTaskLane';
import { TimelineTask } from './TimelineTask';
import { TimelineQueue } from './TimelineQueue';
import { useTimelineHiddenTasks } from '../hooks/useTimelineHiddenTasks';
import { getTaskColor, getTaskPosition } from '../utils';
import { addDays } from 'date-fns';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * ListLane component props interface
 * Defines the props for rendering a board list within the timeline
 */
interface ListLaneProps {
  // Board ID
  boardId: string;
  // List object containing list information
  list: List;
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
  getTaskPosition: (card: Card, allCards: Card[], cardIndex: number) => { left: string; width: string; top: string; };
  calculateTimelineHeight: (cards: Card[], dateRange: Date[]) => number;
  // State
  isCollapsed: boolean;
  // Labels available on the board
  boardLabels: Label[];
}

/**
 * ListLane component - Renders a major lane representing a Board List
 * 
 * Handles lane headers, collapsible state, and individual sub-lanes for tasks.
 * Manages queue areas for hidden tasks before/after the current date range.
 * Only renders TimelineQueue on the first task lane to avoid duplication.
 */
export function TimelineListLane({
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
  boardLabels
}: ListLaneProps) {
  // Move hook call to the top level of the component
  const allListTasks = list.cards as Card[];
  const visibleTaskIds = new Set(listTasks.map((task: Card) => task.id));
  const trulyHiddenTasks = allListTasks.filter((task: Card) => !visibleTaskIds.has(task.id));
  const { hiddenTasksBefore, hiddenTasksAfter } = useTimelineHiddenTasks(trulyHiddenTasks, dateRange);

  return (
    <div key={list.id} className="border-2 border-slate-200 dark:border-slate-700 rounded-lg mb-4 overflow-visible">
      {/* ... (rest of the component) */}
      <div
        className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        onClick={() => toggleTimelineLane(boardId, list.id)}
      >
        <div className="flex items-center px-4 py-2">
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5 mr-2 text-slate-400 dark:text-slate-500" />
          ) : (
            <ChevronDown className="h-5 w-5 mr-2 text-slate-400 dark:text-slate-500" />
          )}
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {list.title}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {listTasks.length} {listTasks.length === 1 ? 'task' : 'tasks'}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-lanes for individual tasks */}
      {!isCollapsed && (
        <div className="bg-white dark:bg-slate-900">
          {listTasks.length > 0 ? (
            listTasks.map((task: Card, taskIndex: number) => (
              <div key={task.id} className="flex border-b border-slate-50 dark:border-slate-700">
                {/* Left queue area */}
                <div className="w-48 flex-shrink-0 p-3 border-r border-slate-100 dark:border-slate-700 overflow-visible">
                  {taskIndex === 0 && (
                    <TimelineQueue
                      hiddenTasks={allListTasks.filter((task: Card) => {
                        const taskEnd = task.dueDate || addDays(task.startDate || new Date(), 7);
                        return taskEnd < dateRange[0];
                      })}
                      onOpenTaskModal={openCardModal}
                      getTaskColor={getTaskColor}
                      boardLabels={boardLabels}
                      position="left"
                    />
                  )}
                </div>

                {/* Timeline area with main task */}
                <div
                  className="flex-1 relative border-b border-slate-50 dark:border-slate-700"
                  style={{
                    minHeight: `${calculateTimelineHeight([task], dateRange)}px`
                  }}
                >
                  <TimelineTask
                    task={task}
                    allCards={[task]}
                    cardIndex={0}
                    dateRange={dateRange}
                    zoomLevel={zoomLevel}
                    onOpenTaskModal={openCardModal}
                    getTaskPosition={getTaskPosition}
                    getTaskColor={getTaskColor}
                    boardLabels={boardLabels}
                  />
                </div>

                {/* Right queue area */}
                <div className="w-48 flex-shrink-0 p-3 border-l border-slate-100 dark:border-slate-700 overflow-visible">
                  {taskIndex === 0 && (
                    <TimelineQueue
                      hiddenTasks={allListTasks.filter((task: Card) => {
                        const taskStart = task.startDate || new Date();
                        return taskStart > dateRange[dateRange.length - 1];
                      })}
                      onOpenTaskModal={openCardModal}
                      getTaskColor={getTaskColor}
                      boardLabels={boardLabels}
                      position="right"
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            list.cards.length > 0 ? (
              <div className="flex border-b border-slate-50 dark:border-slate-700">
                {/* Left queue area */}
                <div className="w-48 flex-shrink-0 p-3 border-r border-slate-100 dark:border-slate-700 overflow-visible">
                  <TimelineQueue
                    hiddenTasks={list.cards.filter((task: Card) => {
                      const taskEnd = task.dueDate || addDays(task.startDate || new Date(), 7);
                      return taskEnd < dateRange[0];
                    })}
                    onOpenTaskModal={openCardModal}
                    getTaskColor={getTaskColor}
                    boardLabels={boardLabels}
                    position="left"
                  />
                </div>

                <div className="flex-1 relative flex items-center justify-center" style={{ minHeight: '60px' }}>
                  <div className="text-slate-400 dark:text-slate-500 text-sm italic">
                    All tasks are outside current date range
                  </div>
                </div>

                {/* Right queue area */}
                <div className="w-48 flex-shrink-0 p-3 border-l border-slate-100 dark:border-slate-700 overflow-visible">
                  <TimelineQueue
                    hiddenTasks={list.cards.filter((task: Card) => {
                      const taskStart = task.startDate || new Date();
                      return taskStart > dateRange[dateRange.length - 1];
                    })}
                    onOpenTaskModal={openCardModal}
                    getTaskColor={getTaskColor}
                    boardLabels={boardLabels}
                    position="right"
                  />
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
