import { Card } from '@/lib/types';
import { cn } from '@/lib/utils';
import { addDays } from 'date-fns';

/**
 * Task Component
 *
 * A single task component that renders within the timeline.
 * This component handles the visual representation of a task
 * with proper positioning, styling, and interactions.
 *
 * Features:
 * - Dynamic positioning based on date range
 * - Color coding from task labels
 * - Click to open task modal
 * - Responsive design with hover effects
 * - Truncated text for long titles
 *
 * @param task - The task data to render
 * @param allCards - Array of all cards for positioning calculations
 * @param cardIndex - Index of this task in the array
 * @param dateRange - Current visible date range
 * @param zoomLevel - Current timeline zoom level
 * @param onOpenTaskModal - Function to open task modal
 * @param getTaskPosition - Function to calculate task positioning
 * @param getTaskColor - Function to get task color from labels
 */
interface TaskProps {
  /** The task data to render */
  task: Card;
  /** Array of all cards for positioning calculations */
  allCards: Card[];
  /** Index of this task in the array */
  cardIndex: number;
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
  /** Labels available on the board */
  boardLabels: any[];
}

/**
 * Task Component
 *
 * Renders an individual task within the timeline with proper positioning
 * and styling based on its properties and the current zoom level.
 */
export function Task({
  task,
  allCards,
  cardIndex,
  dateRange,
  zoomLevel,
  onOpenTaskModal,
  getTaskPosition,
  getTaskColor,
  boardLabels
}: TaskProps) {
  // Only render tasks that are at least partially visible in the timeline
  // Dates are already Date objects from localStorage conversion
  const taskStart = task.startDate || new Date();
  const taskEnd = task.dueDate || addDays(taskStart, 7);
  const rangeStart = dateRange[0];
  const rangeEnd = dateRange[dateRange.length - 1];

  // Normalize dates to start of day for comparison (to avoid time-based filtering issues)
  const cardStartDay = new Date(taskStart.getFullYear(), taskStart.getMonth(), taskStart.getDate());
  const cardEndDay = new Date(taskEnd.getFullYear(), taskEnd.getMonth(), taskEnd.getDate());
  const rangeStartDay = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate());
  const rangeEndDay = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate());

  // Skip cards that are completely outside the visible range
  // REMOVED: Let TimelineView handle filtering to avoid mismatches
  // if (cardEndDay < rangeStartDay || cardStartDay > rangeEndDay) {
  //   return null;
  // }

  const position = getTaskPosition(task, allCards, cardIndex, dateRange, zoomLevel);
  const colors = getTaskColor(task, boardLabels);

  return (
    <div
      key={`${task.id}-${position.width}-${position.left}`}
      className="absolute h-8 rounded-md px-2 py-1 text-xs font-medium shadow-sm cursor-pointer transition-all hover:shadow-md hover:z-10"
      style={{
        ...position,
        backgroundColor: colors.background,
        color: colors.text
      }}
      title={task.title}
      onClick={() => onOpenTaskModal(task.id)}
    >
      <div className="truncate">{task.title}</div>
    </div>
  );
}
