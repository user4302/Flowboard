# Feature Specification: Kanban List Bottom Spacing Fix

**Feature Branch**: `003-kanban-list-bottom-spacing`

**Created**: Tuesday, June 2, 2026

**Status**: Draft

**Input**: User description: "Fix the bottom edge spacing for all Kanban lists. Add a consistent bottom padding (e.g., 16px/1rem) to the list container so that the '+ Add card', '+ Upload card', and '+ Paste card' buttons maintain a safe zone from the bottom of the viewport or list scroll area. Ensure this is applied consistently across all Kanban list variants and does not interfere with the drag-and-drop hit boxes of @dnd-kit/sortable."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visible Safe Zone (Priority: P1)

As a user, when I scroll to the bottom of a Kanban list, I want to see a clear margin between the bottom buttons and the list container edge, so that the interface feels balanced and prevents the buttons from being cut off by the viewport or list borders.

**Why this priority**: Core visual polish and usability requirement. It ensures buttons are easily clickable and distinct from the container boundary.

**Independent Test**: Can be tested by opening a board with a long list of cards, scrolling to the bottom, and verifying a 16px (1rem) gap exists below the "+ Add/Upload/Paste card" button group.

**Acceptance Scenarios**:

1. **Given** a board with a Kanban list containing multiple cards, **When** I scroll to the bottom of the list, **Then** I should see a 16px padding between the bottom of the action buttons and the bottom edge of the list container.
2. **Given** a Kanban list with zero cards, **When** I view the list, **Then** the action buttons should still maintain the 16px bottom padding relative to the list container edge.

---

### User Story 2 - Functional Integrity (Priority: P2)

As a user, when I drag a card to the bottom of a list, I want the drag-and-drop system to accurately detect the end of the list without being confused by the new padding, so that I can reliably reorder tasks.

**Why this priority**: Critical to ensure the visual fix does not break core application functionality (Drag & Drop).

**Independent Test**: Can be tested by dragging a card from the top of the list and dropping it into the last position, ensuring it correctly attaches as the new last item despite the padding.

**Acceptance Scenarios**:

1. **Given** I am dragging a task card, **When** I hover over the 16px bottom padding area of a Kanban list, **Then** the list should correctly identify that I am at the end of the sortable area.
2. **Given** I am dragging a task card, **When** I drop it into the bottom padding zone, **Then** the card should be appended as the last item in the list.

---

### Edge Cases

- **Mobile Viewport**: The safe zone must be maintained even on small screens where the list might take up the full height.
- **Horizontal Scrolling**: If the list container has horizontal scrolling, the bottom padding should remain consistent and not cause layout shifts.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST apply a consistent 16px (1rem) bottom padding to all Kanban list scroll containers.
- **FR-002**: The bottom padding MUST be part of the scrollable content area, ensuring it only appears at the very bottom of the list.
- **FR-003**: The action buttons ("+ Add card", "+ Upload card", "+ Paste card") MUST be positioned above this bottom padding.
- **FR-004**: System MUST ensure that the padding does not expand the hit-box of the last sortable item in the list.
- **FR-005**: The fix MUST be applied to all Kanban list variants used in the application.

### Key Entities

- **Kanban List**: The vertical container representing a status or category of tasks.
- **Action Buttons**: The group of buttons at the bottom of the list used for creating or importing cards.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A minimum of 16px empty space is consistently visible below the last action button in all Kanban lists when scrolled to the bottom.
- **SC-002**: Drag-and-drop success rate for moving cards to the last position remains at 100% (no regressions).
- **SC-003**: Visual consistency check confirms the same padding is applied across Kanban view and any other views using these list components.

## Assumptions

- **Assumption 1**: The safe zone requirement refers to standard internal padding, not necessarily a viewport-fixed footer.
- **Assumption 2**: Existing `@dnd-kit/sortable` implementation allows for styling list containers with padding without breaking its internal coordinate system.
- **Assumption 3**: The 16px/1rem value is the target standard for the whole application's Kanban UI.
