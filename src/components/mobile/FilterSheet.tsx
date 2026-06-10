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
      className="!bg-slate-900/90 !max-h-[90vh] !rounded-2xl !fixed !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !w-[90%] !max-w-md transition-all duration-300 ease-in-out"
    >
      <ModalHeader className="border-slate-800">
        <ModalTitle className="text-white">Filters</ModalTitle>
      </ModalHeader>
      <ModalBody className="p-4 overflow-visible">
        <SearchAndFilter boardId={boardId} inline={true} className="w-full !relative !static" />
      </ModalBody>
    </Modal>
  );
}