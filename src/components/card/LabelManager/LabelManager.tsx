import { ChevronLeft, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLabelManager } from './hooks/useLabelManager';
import { LabelList } from './LabelList';
import { LabelForm } from './LabelForm';
import { LabelManagerProps } from '../types/form.types';

export function LabelManager({ boardId, cardId, selectedLabelIds, onClose }: LabelManagerProps) {
  const {
    view,
    searchTerm,
    labelTitle,
    labelColor,
    filteredLabels,
    setView,
    setSearchTerm,
    setLabelTitle,
    setLabelColor,
    handleToggleLabel,
    handleCreateLabel,
    handleUpdateLabel,
    handleDeleteLabel,
    openEdit,
    openCreate
  } = useLabelManager({ boardId, cardId, selectedLabelIds });

  return (
    <div className="w-80 max-h-[480px] flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
      <div className="mb-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          {view !== 'list' && (
            <button
              type="button"
              onClick={() => setView('list')}
              className="text-slate-500 hover:text-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {view === 'list' ? 'Labels' : view === 'create' ? 'Create label' : 'Edit label'}
          </h3>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {view === 'list' ? (
          <LabelList
            labels={filteredLabels}
            selectedLabelIds={selectedLabelIds}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onToggleLabel={handleToggleLabel}
            onEditLabel={openEdit}
            onCreateLabel={openCreate}
            onClose={onClose}
          />
        ) : (
          <LabelForm
            view={view}
            labelTitle={labelTitle}
            labelColor={labelColor}
            onTitleChange={setLabelTitle}
            onColorChange={setLabelColor}
            onCreate={handleCreateLabel}
            onUpdate={handleUpdateLabel}
            onDelete={() => handleDeleteLabel(labelTitle)}
            onBack={() => setView('list')}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
