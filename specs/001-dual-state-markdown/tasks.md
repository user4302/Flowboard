# Tasks: Dual-State Markdown Field

**Input**: Design documents from `/specs/001-dual-state-markdown/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Install `react-markdown` dependency
- [ ] T002 Verify Tailwind 4 and Radix UI primitives availability in `src/components/taskModal/components/TaskModalForm.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T003 Ensure `TaskModalForm` has proper state management for the description text

---

## Phase 3: User Story 1 - Edit Markdown Description (Priority: P1) 🎯 MVP

**Goal**: Enable raw Markdown editing when description is focused.

**Independent Test**: Focus the description field and verify it becomes an editable textarea showing raw Markdown.

### Implementation for User Story 1

- [ ] T004 [P] [US1] Refactor `TaskModalForm.tsx` to handle state for "edit" (focused) vs "view" (blurred) modes for description
- [ ] T005 [P] [US1] Implement `onFocus` to switch to textarea for raw Markdown editing
- [ ] T006 [US1] Ensure `onChange` updates both local state and `react-hook-form` state

---

## Phase 4: User Story 2 - View Rendered Description (Priority: P1)

**Goal**: Automatically render Markdown when description is blurred.

**Independent Test**: Blur the description field and verify it renders formatted Markdown.

### Implementation for User Story 2

- [ ] T007 [P] [US2] Implement `onBlur` to switch to rendered view
- [ ] T008 [P] [US2] Integrate `react-markdown` in `TaskModalForm.tsx` to render the description
- [ ] T009 [US2] Apply existing Tailwind styles to the rendered Markdown

---

## Phase 5: User Story 3 - Persist Unsaved Changes (Priority: P2)

**Goal**: Preserve unsaved edits across mode switches until modal is closed/saved.

**Independent Test**: Edit text, blur, focus back, ensure modifications remain.

### Implementation for User Story 3

- [ ] T010 [US3] Ensure `descriptionValue` is maintained in component state across `focus`/`blur` transitions

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T011 [P] Ensure smooth transitions using Tailwind 4 classes
- [ ] T012 Validate responsiveness of dual-state field
- [ ] T013 Verify accessibility (keyboard navigation)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all user stories

### User Story Dependencies

- **User Story 1 (P1)**: Depends on Foundational.
- **User Story 2 (P2)**: Depends on US1 (editing) and Foundational (blur behavior).
- **User Story 3 (P3)**: Depends on US1/US2 state management.

### Parallel Opportunities

- Phase 1 tasks (T001, T002) can run in parallel.
- Task T004, T005, T007, T008 are [P] and can be developed in parallel as independent structural components.
