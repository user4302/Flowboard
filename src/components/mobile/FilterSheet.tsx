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
      className="!bg-slate-900/90 !max-h-[90vh] !h-auto !min-h-[200px] !rounded-t-2xl !rounded-b-none !fixed !bottom-0 !top-auto !w-full !max-w-full transition-all duration-300 ease-in-out"
    >
      <ModalHeader className="border-slate-800">
        <ModalTitle className="text-white">Filters</ModalTitle>
      </ModalHeader>
      <ModalBody className="p-4 h-full">
        <SearchAndFilter boardId={boardId} inline={true} className="w-full !relative !static" />
      </ModalBody>
    </Modal>
  );
}