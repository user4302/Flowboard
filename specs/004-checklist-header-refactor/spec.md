# Feature Specification: Checklist Header Progress Refactor

**Feature Branch**: `004-checklist-header-refactor`

**Created**: Wednesday, June 3, 2026

**Status**: Draft

**Input**: User description: "Refactor the card modal checklist header to integrate the progress bar directly into its background. Remove the separate standalone progress bar row. The header container should use relative positioning, with a child div acting as the progress bar anchor sliding horizontally behind the text content based on completion percentage. Use a low-opacity green fill (e.g., bg-green-500/15 or bg-emerald-500/20) to preserve text readability and contrast for the header title, completion ratio, and action icons. Ensure smooth framer-motion transitions when checking items off."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Integrated Progress Visual (Priority: P1)

As a user, when I check items off in a checklist, I want to see the progress bar integrate seamlessly into the header background rather than taking up a separate row, so that the modal interface feels cleaner, more compact, and visually responsive to my progress.

**Why this priority**: Enhances UI/UX consistency and maximizes space efficiency within the card modal.

**Independent Test**: Can be tested by opening a task with a checklist, checking/unchecking items, and verifying the background bar animates to the correct percentage without layout shifts in the header row.

**Acceptance Scenarios**:

1. **Given** a task card modal with a checklist, **When** I check off an item, **Then** the header background progress bar should slide smoothly to the new percentage using animation.
2. **Given** a checklist with varied completion percentages, **When** I view the header, **Then** the progress bar should be visible behind the text content without obscuring the title, ratio, or action icons.
3. **Given** a checklist, **When** I view the header, **Then** the separate progress bar row should be removed.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The checklist header container MUST use relative positioning.
- **FR-002**: A child div MUST act as the progress bar anchor, sliding horizontally behind the header text content.
- **FR-003**: The progress bar MUST be integrated into the background of the header, removing any standalone progress bar row.
- **FR-004**: The progress bar background MUST use a low-opacity green fill (e.g., `bg-green-500/15` or `bg-emerald-500/20`).
- **FR-005**: The integration MUST ensure text readability and contrast for the header title, completion ratio, and action icons.
- **FR-006**: The transition of the progress bar MUST be smooth when checking/unchecking items.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: No standalone progress bar row exists in the modal UI.
- **SC-002**: Progress bar fill animation completes within 300ms during item interaction.
- **SC-003**: Header text and icons remain fully legible against the low-opacity progress bar background.

## Assumptions

- **Assumption 1**: Existing completion percentage calculation logic is reused.
- **Assumption 2**: Tailwind CSS classes or equivalent can achieve the required layering and transparency.
- **Assumption 3**: Framer Motion is available or preferred for the requested smooth transitions.
