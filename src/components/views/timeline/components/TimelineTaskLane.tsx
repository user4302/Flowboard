import { Card } from '@/lib/types';
import { TimelineTask } from './TimelineTask';
import { getTaskColor } from '../utils/utils';
import { TimelineTooltip } from './TimelineTooltip';

/**
 * TaskLane Component
 * 
 * A sub-tasklane component that displays a single task within a parent listlane.
 * This component handles the rendering of hidden tasks on both sides (before/after)
 * and the main task in the timeline area.
 * 
 * Features:
 * - Displays hidden tasks as mini indicators on left/right sides (only for first task)
 * - Renders the main task with proper positioning
 * - Handles click interactions for all tasks
 * - Responsive layout with fixed side panels
 * 
 * @param task - The main task to display in the timeline
 * @param dateRange - Current visible date range
 * @param zoomLevel - Current timeline zoom level
 * @param onOpenTaskModal - Function to open task modal
 * @param getTaskPosition - Function to calculate task positioning
 * @param getTaskColor - Function to get task color from labels
 * @param calculateTimelineHeight - Function to calculate timeline height
 * @param hiddenTasksBefore - Array of tasks hidden before the date range (only for first task)
 * @param hiddenTasksAfter - Array of tasks hidden after the date range (only for first task)
 * @param allCards - All cards in the list for proper positioning
 * @param cardIndex - Actual index of this task among all tasks
 */
interface TaskLaneProps {
  /** The main task to display in the timeline */
  task: Card;
  /** Current visible date range */
  dateRange: Date[];
  /** Current timeline zoom level */
  zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year';
  /** Function to open task modal */
  onOpenTaskModal: (taskId: string) => void;
  /** Function to calculate task positioning */
  getTaskPosition: (task: Card, allTasks: Card[], taskIndex: number, dateRange: Date[], zoomLevel: 'day' | 'week' | '2weeks' | 'month' | 'year') => any;
  /** Function to get task color from labels */
  getTaskColor: (task: Card, boardLabels?: any[]) => { background: string; text: string };
  /** Function to calculate timeline height */
  calculateTimelineHeight: (tasks: Card[], dateRange: Date[]) => number;
  /** Array of tasks hidden before the date range (only for first task) */
  hiddenTasksBefore: Card[];
  /** Array of tasks hidden after the date range (only for first task) */
  hiddenTasksAfter: Card[];
  /** Labels available on the board */
  boardLabels: any[];
}

/**
 * TaskLane Component
 * 
 * Renders a single task lane with hidden tasks indicators on both sides.
 * This is used within parent listlanes to display individual tasks with
 * their contextual hidden tasks (only for the first task in each list).
 */
export function TimelineTaskLane({
  task,
  dateRange,
  zoomLevel,
  onOpenTaskModal,
  getTaskPosition,
  getTaskColor,
  calculateTimelineHeight,
  hiddenTasksBefore,
  hiddenTasksAfter,
  boardLabels
}: TaskLaneProps) {
  return (
    <div className="flex">
      {/* Left-side space for past hidden tasks */}
      <div className="w-48 flex-shrink-0 p-3 border-r border-slate-100 dark:border-slate-700 overflow-visible">
        <div className="flex flex-wrap gap-1">
          {hiddenTasksBefore.map((hiddenTask: Card) => (
            <div
              key={hiddenTask.id}
              className="relative group"
            >
              <div
                className="w-6 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: getTaskColor(hiddenTask, boardLabels).background }}
                onClick={() => onOpenTaskModal(hiddenTask.id)}
                title=""  // Remove browser tooltip
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999]">
                <TimelineTooltip task={hiddenTask} position="before" boardLabels={boardLabels} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline area with the main task */}
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
          onOpenTaskModal={onOpenTaskModal}
          getTaskPosition={getTaskPosition}
          getTaskColor={getTaskColor}
          boardLabels={boardLabels}
        />
      </div>

      {/* Right-side space for future hidden tasks */}
      <div className="w-48 flex-shrink-0 p-3 border-l border-slate-100 dark:border-slate-700 overflow-visible">
        <div className="flex flex-wrap gap-1">
          {hiddenTasksAfter.map((hiddenTask: Card) => (
            <div
              key={hiddenTask.id}
              className="relative group"
            >
              <div
                className="w-6 h-6 rounded cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: getTaskColor(hiddenTask, boardLabels).background }}
                onClick={() => onOpenTaskModal(hiddenTask.id)}
                title=""  // Remove browser tooltip
              />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999]">
                <TimelineTooltip task={hiddenTask} position="after" boardLabels={boardLabels} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
