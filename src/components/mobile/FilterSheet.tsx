'use client';

import { useUIStore } from '@/store';
import { Button, Modal, ModalHeader, ModalTitle, ModalBody } from '@/components/ui';
import { SearchAndFilter } from '@/components/searchAndFilter';

export function FilterSheet({ boardId }: { boardId: string }) {
  const { showFilterSheet, setShowFilterSheet } = useUIStore();

  return (
    <Modal
      open={showFilterSheet}
      onClose={() => setShowFilterSheet(false)}
    >
      <ModalHeader>
        <ModalTitle>Filters</ModalTitle>
      </ModalHeader>
      <ModalBody className="p-4">
        <SearchAndFilter boardId={boardId} />
      </ModalBody>
    </Modal>
  );
}