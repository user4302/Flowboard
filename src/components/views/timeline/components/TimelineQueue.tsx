import { Card, Label } from '@/lib/types';
import { TimelineTooltip } from './TimelineTooltip';

/**
 * Queue component props interface
 * Defines the props for displaying hidden tasks indicators in timeline view
 */
interface QueueProps {
  // Array of hidden tasks to display
  hiddenTasks: Card[];
  // Function to open task modal for editing
  onOpenTaskModal: (taskId: string) => void;
  // Function to get task color from labels
  getTaskColor: (task: Card, boardLabels?: Label[]) => { background: string; text: string };
  // Labels available on the board
  boardLabels: Label[];
  // Position of this queue in the timeline
  position: 'left' | 'right';
}

/**
 * Queue component - Displays indicators for tasks outside the current timeline view
 * 
 * Renders colored dots for hidden tasks with hover tooltips showing task details.
 * The component is position-agnostic and renders whatever tasks are passed to it.
 * Parent components handle filtering and positioning logic.
 * 
 * @param hiddenTasks - Array of tasks to display as indicators
 * @param onOpenTaskModal - Callback to open task modal when indicator is clicked
 * @param getTaskColor - Function to get task color from labels
 * @param boardLabels - Available labels on the board for color resolution
 * @param position - Position in timeline ('left' or 'right') affects alignment and tooltip positioning
 */
export function TimelineQueue({
  hiddenTasks,
  onOpenTaskModal,
  getTaskColor,
  boardLabels,
  position
}: QueueProps) {
  return (
    <div className={`flex flex-wrap gap-1 ${position === 'left' ? '' : 'justify-end'}`}>
      {hiddenTasks.map((hiddenTask: Card) => (
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
          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[9999]">
            <TimelineTooltip
              task={hiddenTask}
              position={position === 'left' ? 'before' : 'after'}
              boardLabels={boardLabels}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
