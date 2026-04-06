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
   * Gets the first label for a task
   * @param labelIds - Array of label IDs assigned to the task
   * @returns The label object or null if no labels found
   */
  const getFirstLabel = (labelIds?: string[]) => {
    if (!labelIds?.length) return null;
    return labels.find(l => l.id === labelIds[0]);
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
              const firstLabel = getFirstLabel(task.labelIds);

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
                  {firstLabel && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-3 rounded-l-lg"
                      style={{ backgroundColor: firstLabel.color }}
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
