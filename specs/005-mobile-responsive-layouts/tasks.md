# Implementation Tasks: Mobile Responsive Viewport

**Feature**: Mobile Responsive Viewport Adaptations
**Branch**: `dev`

## Summary
The goal is to ensure the Flowboard interface dynamically conforms to narrow viewports (< 768px) without triggering window-level horizontal overflow. This involves implementing responsive utility breakpoints, collapsible navigation panels, scroll-snapping data tracks, and section accordions.

## Phase 1: Foundational Layout Shells
- [x] T001 Implement responsive wrapper for Sidebar in src/components/boardSidebar/BoardSidebar.tsx
- [x] T002 Implement responsive wrapper for Header in src/components/boardHeader/BoardHeader.tsx
- [x] T003 Implement drawer/sheet navigation for Filters in src/components/searchAndFilter/SearchAndFilter.tsx

## Phase 2: User Story 1 - Kanban Viewport Adaptations
- [ ] T004 [P] [US1] Refactor KanbanView for responsive scroll-snapping tracks in src/components/views/KanbanView.tsx

## Phase 3: User Story 2 - Timeline Viewport Adaptations
- [ ] T005 [P] [US2] Refactor TimelineView for container-scoped horizontal scrolling in src/components/views/TimelineView.tsx

## Phase 4: User Story 3 - Calendar Viewport Adaptations
- [ ] T006 [P] [US3] Refactor CalendarView for responsive day/agenda view modes in src/components/views/CalendarView.tsx

## Phase 5: User Story 4 - Table Viewport Adaptations
- [ ] T007 [P] [US4] Refactor TableView for responsive vertical record stacking in src/components/views/TableView.tsx

## Phase 6: Polish & Cross-Cutting Concerns
- [ ] T008 Audit and disable global body-level horizontal overflow in src/app/globals.css
- [ ] T009 Audit and fix interactive tap targets (min 44x44px) in src/components/ui/button.tsx
- [ ] T010 Audit and fix interactive tap targets (min 44x44px) in src/components/taskCard/TaskCard.tsx

## Dependency Graph
- Phase 1 (Foundational) MUST be completed before User Story Phases (Phases 2-5).
- User Story Phases (Phases 2-5) are independent and can be executed in parallel (as indicated by [P]).
- Phase 6 (Polish) MUST be completed after all User Story Phases.

## Implementation Strategy
- **MVP Scope**: Complete foundational layout shells (Phase 1) and Kanban view (Phase 2).
- **Incremental Delivery**: Following MVP, implement other view modes sequentially (Timeline, Calendar, Table).
- **Final Step**: Cross-cutting audit of overflow and tap targets.
