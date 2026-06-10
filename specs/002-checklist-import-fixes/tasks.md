# Tasks: Checklist Data Fixes and Smart Import

**Input**: Design documents from `/specs/002-checklist-import-fixes/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T002 Ensure Zustand store (`src/store/boardStore.ts`) supports robust checklist data handling.
- [ ] T003 Verify `src/components/taskModal/components/TaskModalLabelSection.tsx` structure for label uniqueness logic.

---

## Phase 3: User Story 1 - Maintain Checklist Integrity (Priority: P1) 🎯 MVP

**Goal**: Fix checklist data loss during import.

**Independent Test**: Export board with checklists, import, verify data.

### Implementation for User Story 1

- [ ] T004 [P] [US1] Debug import/export logic in `src/store/boardStore.ts` to identify where checklist data is lost.
- [ ] T005 [US1] Fix checklist persistence during board import process in `src/store/boardStore.ts`.
- [ ] T006 [US1] Verify data integrity by running import/export tests.

---

## Phase 4: User Story 2 - Prevent Label Duplication (Priority: P1)

**Goal**: Prevent duplicate label names within a board.

**Independent Test**: Attempt to create a label with an existing name, ensure it is blocked.

### Implementation for User Story 2

- [ ] T007 [US2] Implement uniqueness validation for label creation in `src/components/taskModal/components/TaskModalLabelSection.tsx` or corresponding store logic.
- [ ] T008 [US2] Update label management UI to show error message on duplicate label.

---

## Phase 5: User Story 3 - Smart Checklist Import (Priority: P2)

**Goal**: Enable multi-line checklist import from a single input.

**Independent Test**: Paste a newline-separated list, verify it creates multiple checklist items.

### Implementation for User Story 3

- [ ] T009 [US3] Implement smart import textarea in `src/components/taskModal/components/TaskModalChecklistSection.tsx`.
- [ ] T010 [US3] Implement parsing logic to split text by newline in `src/components/taskModal/components/TaskModalChecklistSection.tsx`.
- [ ] T011 [US3] Integrate parsing logic with existing checklist creation state in `src/store/boardStore.ts` or local hook.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T012 [P] Documentation updates in docs/
- [ ] T013 Code cleanup and refactoring
- [ ] T014 Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational.
- **User Story 2 (P1)**: Depends on Foundational.
- **User Story 3 (P2)**: Depends on Foundational.

### Parallel Opportunities

- Phase 1 tasks (T001)
- Phase 2 tasks (T002, T003)
- Task T004, T007 can be developed in parallel as independent structural components.
