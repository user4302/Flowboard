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
    labelManager,
    currentBoardId,
    cardModalOpen,
    selectedCardId,
    cardJSONData,
    targetListId,
    isJSONImportMode
  } = useTaskModalData();

  const { handleSave, handleToggleCompleted, handleArchive, closeCardModal } = useTaskModalHandlers(
    currentBoardId,
    foundCard,
    form,
    isJSONImportMode,
    cardJSONData,
    targetListId,
    checklist,
    labelManager
  );

  const handleFormSubmit = (data: any) => {
    const cardData = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    };
    handleSave(cardData);
  };

  const handleClose = () => {
    if (form.formState.isDirty || checklist.isDirty || labelManager.isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to close?")) {
        closeCardModal();
      }
    } else {
      closeCardModal();
    }
  };

  // Early return if modal data is not available
  if (!cardModalOpen || (!currentBoard || !currentBoardId)) {
    return null;
  }

  // For JSON import mode, we don't need a foundCard
  if (!isJSONImportMode && !foundCard) {
    // Show loading state while waiting for newly created card
    if (selectedCardId) {
      return (
        <UIModal open={cardModalOpen} onClose={handleClose}>
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading card...</p>
          </div>
        </UIModal>
      );
    }
    return null;
  }

  return (
    <UIModal open={cardModalOpen} onClose={handleClose}>
      <TaskModalHeader onClose={handleClose} />

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
              labelManager={labelManager}
            />
          )}

          {/* Checklist - only show if not in JSON import mode */}
          {!isJSONImportMode && (
            <TaskModalChecklistSection
              cardId={foundCard?.id || ''}
              boardId={currentBoardId}
              checklists={foundCard?.checklists || []}
              checklistHook={checklist}
            />
          )}
        </ModalBody>

        <ModalFooter>
          <Button type="submit">Save changes</Button>
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          {!isJSONImportMode && foundCard && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleArchive}
              className="ml-auto"
            >
              Archive
            </Button>
          )}
        </ModalFooter>
      </form>
    </UIModal>
  );
}
