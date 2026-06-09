# Mobile Bottom Navigation Specification

## Purpose
Introduce a fixed bottom navigation bar on mobile viewports to provide quick, persistent access to view switching (Kanban, Timeline, Calendar, Table) and a trigger for the filter interface.

## User Scenarios
- **Switch Views**: Mobile user taps a tab button on the bottom nav to switch between Kanban, Timeline, Calendar, and Table views.
- **Access Filters**: Mobile user taps the final tab on the bottom nav, triggering a responsive bottom sheet containing all filter options.
- **View Consistency**: Mobile navigation is pinned to the bottom of the viewport; it is not visible on desktop.
- **Active State**: The currently selected view tab is clearly highlighted.

## Functional Requirements
- **Mobile Navigation Bar**:
  - MUST be fixed to the bottom of the viewport.
  - MUST display interactive tab buttons for Kanban, Timeline, Calendar, and Table.
  - MUST include a final trigger tab to slide open the filter interface as a responsive bottom sheet.
- **Responsive Behavior**:
  - Navigation bar MUST hide cleanly on desktop-sized viewports.
- **Design & UX**:
  - Navigation layer MUST stay pinned safely above viewport boundaries (avoiding safe area overlaps).
  - Tabs MUST feature clear active-state styling.

## Success Criteria
- **Measurable Outcomes**:
  - Bottom navigation is only visible on viewports < 768px.
  - Switching views via bottom nav takes < 100ms.
  - Filter sheet opens within 200ms of trigger tap.
  - Tap targets for all bottom nav elements are ≥ 44px x 44px.

## Entities
- Navigation Item (Kanban, Timeline, Calendar, Table, Filters Trigger)
- Filter Sheet (Bottom Sheet UI)
- Bottom Navigation Bar (Persistent Container)

## Assumptions
- View switching logic leverages existing `uiStore` and view state.
- Bottom sheet component uses Radix UI or compatible dialog/drawer primitive.
- Desktop layout remains untouched by this change.
