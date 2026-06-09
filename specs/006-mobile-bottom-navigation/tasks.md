# Implementation Tasks: Mobile Bottom Navigation

**Feature**: Mobile Bottom Navigation Bar
**Branch**: `dev`

## Summary
The goal is to introduce a fixed bottom navigation bar on mobile viewports (< 768px) for persistent access to view switching and a filter trigger. This involves creating the `MobileBottomNav` component, updating the layout, and managing state for active views and the filter sheet.

## Phase 1: Setup
- [ ] T001 Initialize directory structure for mobile components in src/components/mobile/

## Phase 2: Foundational Layout Shells
- [ ] T002 Implement `MobileBottomNav` component in src/components/mobile/MobileBottomNav.tsx
- [ ] T003 Update `BoardPage` layout to include `MobileBottomNav` with conditional responsiveness in src/app/board/[boardId]/page.tsx
- [ ] T004 Add `showFilterSheet` state to `uiStore` in src/store/uiStore.ts

## Phase 3: User Story 1 - Navigation and View Switching
- [ ] T005 [P] [US1] Connect tab buttons in `MobileBottomNav` to `setCurrentView` in src/components/mobile/MobileBottomNav.tsx

## Phase 4: User Story 2 - Filter Sheet Trigger
- [ ] T006 [P] [US2] Implement filter sheet trigger in `MobileBottomNav` in src/components/mobile/MobileBottomNav.tsx
- [ ] T007 [US2] Implement Filter Sheet component using Radix UI in src/components/mobile/FilterSheet.tsx

## Phase 5: Polish & Cross-Cutting Concerns
- [ ] T008 Audit and fix responsive padding in src/app/board/[boardId]/page.tsx to accommodate fixed bottom bar
- [ ] T009 Audit and fix interactive tap targets (min 44x44px) in `MobileBottomNav`

## Dependency Graph
- Phase 1 (Setup) and Phase 2 (Foundational) MUST be completed before User Story Phases.
- User Story Phases are independent.
- Phase 5 (Polish) MUST be completed after all User Story Phases.

## Implementation Strategy
- **MVP Scope**: Complete `MobileBottomNav` with view switching (Phases 1-3).
- **Incremental Delivery**: Following MVP, implement filter sheet integration (Phase 4).
- **Final Step**: Cross-cutting audit of responsive layout padding and touch targets.
