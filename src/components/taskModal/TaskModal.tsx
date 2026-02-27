'use client';

import { Button, Modal as UIModal, ModalBody, ModalFooter } from '@/components/ui';
import { useTaskModalCardModalData } from './hooks';
import { useTaskModalCardModalHandlers } from './hooks/useTaskModalCardModalHandlers';
import { TaskModalModalHeader, TaskModalModalFormSection, TaskModalModalLabelSection, TaskModalModalChecklistSection } from './components';

export function TaskModal() {
  const {
    currentBoard,
    foundCard,
    boardLabels,
    form,
    checklist,
    currentBoardId,
    cardModalOpen
  } = useTaskModalCardModalData();

  const { handleSave, handleToggleCompleted, closeCardModal } = useTaskModalCardModalHandlers(
    currentBoardId,
    foundCard,
    form
  );

  // Early return if card data is not available
  if (!foundCard || !currentBoard || !currentBoardId) {
    return null;
  }

  return (
    <UIModal open={cardModalOpen} onClose={closeCardModal}>
      <TaskModalModalHeader onClose={closeCardModal} />

      <form onSubmit={form.handleSubmit(handleSave)}>
        <ModalBody className="space-y-6">
          <TaskModalModalFormSection
            card={foundCard}
            form={form}
            errors={form.formState.errors}
            register={form.register}
            onToggleCompleted={handleToggleCompleted}
          />

          {/* Labels */}
          <TaskModalModalLabelSection
            boardId={currentBoardId}
            cardId={foundCard.id}
            labelIds={foundCard.labelIds || []}
            labels={boardLabels}
          />

          {/* Checklist */}
          <TaskModalModalChecklistSection
            cardId={foundCard.id}
            boardId={currentBoardId}
            checklist={foundCard.checklist}
            checklistHook={checklist}
          />
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
