import { X } from 'lucide-react';
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowFilterSheet(false)}
          className="text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </ModalHeader>
      <ModalBody className="p-4 !max-h-[50vh] overflow-y-auto">
        <SearchAndFilter boardId={boardId} inline={true} className="w-full !relative !static" />
      </ModalBody>
    </Modal>
  );
}