# Tasks: Add Checklist Item Rearrangement

**Input**: Design documents from `/specs/004-checklist-header-refactor/` (context)

**Prerequisites**: plan.md, spec.md

**Organization**: Tasks for implementing drag-and-drop rearrangement of checklist items.

## Phase 1: Foundational (State Management)

- [ ] T001 Add `reorderChecklistItems` method to `ChecklistSlice` in `src/store/boards/checklistSlice.ts`
- [ ] T002 Update `ChecklistSlice` interface in `src/store/boards/types.ts` to include `reorderChecklistItems`

---

## Phase 2: Implementation (UI Logic)

**Goal**: Implement drag-and-drop for checklist items in `TaskModalMultiChecklistManager.tsx`.

- [ ] T003 Import `DndContext`, `SortableContext`, `verticalListSortingStrategy`, `useSortable`, `CSS` from `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` in `src/components/taskModal/components/TaskModalMultiChecklistManager.tsx`
- [ ] T004 Create `SortableChecklistItem` component in `src/components/taskModal/components/TaskModalMultiChecklistManager.tsx`
- [ ] T005 Implement `DndContext` and `SortableContext` logic in `TaskModalMultiChecklistManager.tsx`
- [ ] T006 Implement `onDragEnd` handler to call `reorderChecklistItems`
- [ ] T007 Add drag handle or enable dragging on the items themselves.

---

## Phase 3: Polish

- [ ] T008 Visual regression check.
- [ ] T009 Update `CHANGELOG.md` with the new feature.
