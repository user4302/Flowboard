# Tasks for Custom DateTime Picker Component

**Feature**: Custom DateTime Picker Component

## Phase 1: Setup
- [x] T001 Initialize DateTimePicker component structure in `src/components/ui/DateTimePicker.tsx`

## Phase 2: Foundational
- [x] T002 Implement date-fns integration for calendar grid and time parsing in `src/components/ui/DateTimePicker.tsx`
- [x] T003 Implement local-boundary default logic (start-of-day/end-of-day) in `src/components/ui/DateTimePicker.tsx`

## Phase 3: User Story 1 (Picker UI & Interaction) - [US1]
- [x] T004 [P] [US1] Build unified popover dropdown UI in `src/components/ui/DateTimePicker.tsx`
- [x] T005 [P] [US1] Implement interactive calendar grid in `src/components/ui/DateTimePicker.tsx`
- [x] T006 [P] [US1] Implement time selection sub-component in `src/components/ui/DateTimePicker.tsx`

## Phase 4: User Story 2 (State Integration & Persistence) - [US2]
- [ ] T007 [US2] Implement date/time state management logic in `src/components/ui/DateTimePicker.tsx`
- [ ] T008 [US2] Integrate DateTimePicker component into TaskModal in `src/components/taskModal/TaskModal.tsx`
- [ ] T009 [US2] Ensure timestamp commitment to `cardSlice` correctly formats ISO UTC strings.

## Phase 5: Polish & Cross-Cutting
- [ ] T010 Apply dark-themed styling matching Flowboard aesthetic.
- [ ] T011 Verify interaction logic: date-only select vs. explicit time select override.

### Dependencies
- Phase 1 -> Phase 2 -> Phase 3 -> Phase 4 -> Phase 5

### Parallel Execution Examples
- T004, T005, T006 (UI components) can be implemented in parallel.

### Implementation Strategy
- MVP scope: Phase 1-4.
- Incremental delivery: Implement UI, then state integration, then polish.
