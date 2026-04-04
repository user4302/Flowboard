'use client';

import { format } from 'date-fns';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface DayTasksModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** The date to show tasks for */
  date: Date;
  /** Array of tasks/cards for the day */
  tasks: Array<{
    id: string;
    title: string;
    labelIds?: string[];
  }>;
  /** Function to handle card click */
  onCardClick: (cardId: string) => void;
  /** Board labels for color coding */
  labels?: Array<{
    id: string;
    color: string;
  }>;
}

/**
 * DayTasksModal component - Shows full list of tasks for a specific day
 * Displays when user clicks on "+N more" in calendar view
 */
export function DayTasksModal({
  open,
  onClose,
  date,
  tasks,
  onCardClick,
  labels = []
}: DayTasksModalProps) {
  /**
   * Gets the color of the first label for a task
   * @param labelIds - Array of label IDs assigned to the task
   * @returns The color string of the first matching label, or null if no labels found
   */
  const getLabelColor = (labelIds?: string[]) => {
    if (!labelIds?.length) return null;
    const label = labels.find(l => l.id === labelIds[0]);
    return label?.color;
  };

  /**
   * Gets Tailwind classes for task cards based on label colors
   * @param labelIds - Array of label IDs assigned to the task
   * @returns Object with background and text color classes
   */
  const getCardClasses = (labelIds?: string[]) => {
    const labelColor = getLabelColor(labelIds);
    if (labelColor) {
      return {
        background: labelColor.replace('-500', '-100'),
        text: labelColor.replace('bg-', '').replace('-500', '-700')
      };
    }
    return {
      background: 'bg-slate-100',
      text: 'text-slate-700'
    };
  };

  /**
   * Gets RGB color value for CSS style from Tailwind color name
   * @param labelColor - Tailwind color class (e.g., 'bg-yellow-500')
   * @returns RGB color string for CSS
   */
  const getRgbColor = (labelColor?: string) => {
    if (!labelColor) return 'rgb(148 163 184)'; // Default slate-400

    const colorMap: Record<string, string> = {
      'bg-red-500': 'rgb(239 68 68)',
      'bg-yellow-500': 'rgb(234 179 8)',
      'bg-green-500': 'rgb(34 197 94)',
      'bg-blue-500': 'rgb(59 130 246)',
      'bg-purple-500': 'rgb(168 85 247)',
      'bg-pink-500': 'rgb(236 72 153)',
      'bg-indigo-500': 'rgb(99 102 241)',
      'bg-orange-500': 'rgb(249 115 22)',
      'bg-teal-500': 'rgb(20 184 166)',
      'bg-cyan-500': 'rgb(6 182 212)',
      'bg-lime-500': 'rgb(132 204 22)',
      'bg-emerald-500': 'rgb(16 185 129)',
      'bg-violet-500': 'rgb(139 92 246)',
      'bg-fuchsia-500': 'rgb(217 70 239)',
      'bg-rose-500': 'rgb(244 63 94)',
      'bg-sky-500': 'rgb(14 165 233)',
      'bg-amber-500': 'rgb(245 158 11)',
      'bg-slate-500': 'rgb(100 116 139)'
    };

    return colorMap[labelColor] || 'rgb(148 163 184)'; // Default to slate-400
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>
          Tasks for {format(date, 'MMMM d, yyyy')}
        </ModalTitle>
      </ModalHeader>

      <ModalBody>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No tasks for this day
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => {
              const classes = getCardClasses(task.labelIds);
              const labelColor = getLabelColor(task.labelIds);

              return (
                <div
                  key={task.id}
                  onClick={() => onCardClick(task.id)}
                  className={cn(
                    'relative rounded-lg cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md',
                    'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  )}
                >
                  {/* Color indicator bar on the left edge */}
                  {labelColor && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-3 rounded-l-lg"
                      style={{ backgroundColor: getRgbColor(labelColor) }}
                    />
                  )}

                  <div className="pl-5 pr-4 py-3">
                    <div className="font-medium text-sm">
                      {task.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button onClick={onClose} variant="secondary">
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}
