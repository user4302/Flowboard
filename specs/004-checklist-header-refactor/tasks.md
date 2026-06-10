# Tasks: Checklist Header Progress Refactor

**Input**: Design documents from `/specs/004-checklist-header-refactor/`

**Prerequisites**: plan.md, spec.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup

- [ ] T001 Verify existing task modal functionality in `src/components/taskModal/components/TaskModalMultiChecklistManager.tsx`

---

## Phase 2: Foundational

- [ ] T002 Install/Verify `framer-motion` dependency is available

---

## Phase 3: User Story 1 - Integrated Progress Visual (Priority: P1) 🎯 MVP

**Goal**: Integrate progress bar into header background and remove separate row.

- [ ] T003 [US1] Modify `src/components/taskModal/components/TaskModalMultiChecklistManager.tsx` to remove the standalone progress bar row.
- [ ] T004 [US1] Update checklist header container in `src/components/taskModal/components/TaskModalMultiChecklistManager.tsx` to use `relative` positioning and include the new progress bar `motion.div` as a background element.
- [ ] T005 [US1] Apply `emerald-500/20` background color to progress bar anchor `div`.
- [ ] T006 [US1] Implement Framer Motion `motion.div` to animate progress bar width changes.
- [ ] T007 [US1] Ensure text readability/contrast for header title, completion ratio, and icons.

---

## Phase 4: Polish

- [ ] T008 [P] Visual regression check in the card modal checklist header.
- [ ] T009 [P] Update `CHANGELOG.md` with the refactor.
