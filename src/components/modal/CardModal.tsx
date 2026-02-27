'use client';

import { Button, Modal as UIModal, ModalBody, ModalFooter } from '@/components/ui';
import { useCardModalData } from './hooks';
import { useCardModalHandlers } from './hooks/useCardModalHandlers';
import { ModalHeader, ModalFormSection, ModalLabelSection, ModalChecklistSection } from './components';

export function CardModal() {
  const {
    currentBoard,
    foundCard,
    boardLabels,
    form,
    checklist,
    currentBoardId,
    cardModalOpen
  } = useCardModalData();

  const { handleSave, handleToggleCompleted, closeCardModal } = useCardModalHandlers(
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
      <ModalHeader onClose={closeCardModal} />

      <form onSubmit={form.handleSubmit(handleSave)}>
        <ModalBody className="space-y-6">
          <ModalFormSection
            card={foundCard}
            form={form}
            errors={form.formState.errors}
            register={form.register}
            onToggleCompleted={handleToggleCompleted}
          />

          {/* Labels */}
          <ModalLabelSection
            boardId={currentBoardId}
            cardId={foundCard.id}
            labelIds={foundCard.labelIds || []}
            labels={boardLabels}
          />

          {/* Checklist */}
          <ModalChecklistSection
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
