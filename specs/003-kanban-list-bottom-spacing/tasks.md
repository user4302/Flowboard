# Tasks: Kanban List Bottom Spacing Fix

**Input**: Design documents from `/specs/003-kanban-list-bottom-spacing/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verification of current state and existing tests

- [x] T001 Verify existing kanban scroll tests pass in `src/components/views/kanban/components/__tests__/KanbanCardsContainer.scroll.test.tsx`
- [x] T002 Verify current visual state of Kanban lists by running the application and scrolling to the bottom

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure prerequisites

- [x] T003 Ensure `.custom-scrollbar` class is properly loaded in `src/app/globals.css` (Context check)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Visible Safe Zone (Priority: P1) 🎯 MVP

**Goal**: Add vertical scrolling and consistent 16px bottom padding to Kanban lists

**Independent Test**: Scroll to the bottom of a list and verify a 16px gap exists below the action buttons.

### Tests for User Story 1

> **NOTE: Update tests to expect vertical scrolling and bottom padding**

- [x] T004 [P] [US1] Update `src/components/views/kanban/components/__tests__/KanbanCardsContainer.scroll.test.tsx` to verify `overflow-y-auto` and `pb-10` (or `pb-6`) classes
- [x] T005 [P] [US1] Update `src/components/views/kanban/components/__tests__/KanbanCardsContainer.test.tsx` to ensure container ref is correctly assigned

### Implementation for User Story 1

- [x] T006 [US1] Add `overflow-y-auto`, `custom-scrollbar`, and `pr-2` classes to `KanbanCardsContainer` in `src/components/views/kanban/components/KanbanCardsContainer.tsx`
- [x] T007 [US1] Ensure `pb-10` (or consistent `pb-6`) is applied to the scrollable container in `src/components/views/kanban/components/KanbanCardsContainer.tsx`
- [x] T008 [US1] Verify that the action buttons are positioned within the scrollable content above the bottom padding in `src/components/views/kanban/components/KanbanCardsContainer.tsx`

**Checkpoint**: User Story 1 is functional; visual gap is visible at the bottom of the list.

---

## Phase 4: User Story 2 - Functional Integrity (Priority: P2)

**Goal**: Ensure drag-and-drop hit boxes are not disrupted by the new padding

**Independent Test**: Drag a card to the bottom-most position and ensure it drops correctly.

### Tests for User Story 2

- [x] T009 [US2] Verify DnD functionality in `src/components/views/kanban/components/__tests__/SortableKanbanList.scroll.test.tsx` remains intact after padding changes

### Implementation for User Story 2

- [x] T010 [US2] Verify that `setNodeRef` in `KanbanCardsContainer.tsx` is still on the main container that includes the padding, ensuring @dnd-kit captures drops correctly
- [x] T011 [US2] Manual verification: Drag card from top of List A to the very bottom (padding area) of List B and confirm it appends as the last item

**Checkpoint**: All user stories are functional and tested.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and documentation

- [x] T012 [P] Visual regression check: Verify padding consistency across different board view modes if they reuse these components
- [x] T013 [P] Update `CHANGELOG.md` with the Kanban spacing fix
- [x] T014 Run `quickstart.md` validation to confirm final success

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all user stories being complete

### Parallel Opportunities

- T004 and T005 can run in parallel
- T012 and T013 can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational checks.
2. Implement US1 padding and overflow in `KanbanCardsContainer.tsx`.
3. Verify visual gap in the browser.

### Incremental Delivery

1. Foundation ready.
2. US1 Implementation → Test visual gap.
3. US2 Implementation → Verify DnD behavior.
4. Polish.
