# Custom DateTime Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium, dark-themed Popover Date & Time Picker component.

**Architecture:**
- Isolate as reusable component in `src/components/ui/DateTimePicker.tsx`.
- Unified dropdown popover.
- Inline calendar grid (via date-fns/native).
- Time selection sub-component (scrollable list or interval-based).
- State integration: Automated local boundary defaults (00:00/23:59), explicit time overrides.
- ISO timestamp commitment to `cardSlice`.

**Tech Stack:** React, TypeScript, date-fns, Tailwind CSS (for styling).

---

### Phase 1: Setup
- [ ] T001 Initialize DateTimePicker component structure in `src/components/ui/DateTimePicker.tsx`

### Phase 2: Foundational
- [ ] T002 Implement date-fns integration for calendar grid and time parsing in `src/components/ui/DateTimePicker.tsx`
- [ ] T003 Implement local-boundary default logic (start-of-day/end-of-day) in `src/components/ui/DateTimePicker.tsx`

### Phase 3: User Story 1 (Picker UI & Interaction) - P1
- [ ] T004 [P] Build unified popover dropdown UI in `src/components/ui/DateTimePicker.tsx`
- [ ] T005 [P] Implement interactive calendar grid in `src/components/ui/DateTimePicker.tsx`
- [ ] T006 [P] Implement time selection sub-component in `src/components/ui/DateTimePicker.tsx`

### Phase 4: User Story 2 (State Integration & Persistence) - P1
- [ ] T007 Implement date/time state management logic in `src/components/ui/DateTimePicker.tsx`
- [ ] T008 Integrate DateTimePicker component into TaskModal in `src/components/taskModal/TaskModal.tsx`
- [ ] T009 Ensure timestamp commitment to `cardSlice` correctly formats ISO UTC strings.

### Phase 5: Polish & Cross-Cutting
- [ ] T010 Apply dark-themed styling matching Flowboard aesthetic.
- [ ] T011 Verify interaction logic: date-only select vs. explicit time select override.

---
### Dependency Graph
- Phase 1 (Setup) -> Phase 2 (Foundational) -> Phase 3 (UI) -> Phase 4 (Integration) -> Phase 5 (Polish)

### Parallel Execution Examples
- T004, T005, T006 (UI components) can be implemented in parallel once setup is complete.
