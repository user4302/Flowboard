'use client';

import { Button, Modal as UIModal, ModalBody, ModalFooter } from '@/components/ui';
import { useTaskModalData } from './hooks';
import { useTaskModalHandlers } from './hooks/useTaskModalHandlers';
import { TaskModalHeader, TaskModalFormSection, TaskModalLabelSection, TaskModalChecklistSection } from './components';

export function TaskModal() {
  const {
    currentBoard,
    foundCard,
    boardLabels,
    form,
    checklist,
    currentBoardId,
    cardModalOpen,
    selectedCardId,
    cardJSONData,
    targetListId,
    isJSONImportMode
  } = useTaskModalData();

  const { handleSave, handleToggleCompleted, closeCardModal } = useTaskModalHandlers(
    currentBoardId,
    foundCard,
    form,
    isJSONImportMode,
    cardJSONData,
    targetListId,
    checklist
  );

  const handleFormSubmit = (data: any) => {
    const cardData = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };
    handleSave(cardData);
  };

  // Early return if modal data is not available
  if (!cardModalOpen || (!currentBoard || !currentBoardId)) {
    return null;
  }

  // For JSON import mode, we don't need a foundCard
  if (!isJSONImportMode && !foundCard) {
    return null;
  }

  return (
    <UIModal open={cardModalOpen} onClose={closeCardModal}>
      <TaskModalHeader onClose={closeCardModal} />

      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <ModalBody className="space-y-6">
          {!isJSONImportMode && (
            <TaskModalFormSection
              card={foundCard || null}
              form={form}
              errors={form.formState.errors}
              register={form.register}
              onToggleCompleted={handleToggleCompleted}
            />
          )}

          {/* In JSON import mode, show simplified form */}
          {isJSONImportMode && (
            <TaskModalFormSection
              card={null}
              form={form}
              errors={form.formState.errors}
              register={form.register}
              onToggleCompleted={undefined}
            />
          )}

          {/* Labels - only show if not in JSON import mode */}
          {!isJSONImportMode && (
            <TaskModalLabelSection
              boardId={currentBoardId}
              cardId={foundCard?.id || ''}
              labelIds={foundCard?.labelIds || []}
              labels={boardLabels}
            />
          )}

          {/* Checklist - only show if not in JSON import mode */}
          {!isJSONImportMode && (
            <TaskModalChecklistSection
              cardId={foundCard?.id || ''}
              boardId={currentBoardId}
              checklist={foundCard?.checklist || []}
              checklistHook={checklist}
            />
          )}
        </ModalBody>

        <ModalFooter>
          <Button type="submit">Save changes</Button>
          <Button type="button" variant="ghost" onClick={closeCardModal}>
            Cancel
          </Button>
        </ModalFooter>
      </form>
    </UIModal>
  );
}
