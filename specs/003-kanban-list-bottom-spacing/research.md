# Research: Kanban List Bottom Spacing

## Decision
Add `overflow-y-auto`, `pr-2`, and `custom-scrollbar` classes to the `KanbanCardsContainer` component in `src/components/views/kanban/components/KanbanCardsContainer.tsx`. Retain or adjust the `pb-10` padding to ensure a consistent 16px-40px safe zone at the bottom of the scrollable area.

## Rationale
- **Scrolling Context**: Currently, `KanbanCardsContainer` lacks explicit vertical overflow handling. While it is nested in a container that allows horizontal scrolling (`KanbanView`), individual lists should handle their own vertical scrolling to prevent content from being cut off by the board boundary.
- **Consistent Padding**: The `pb-10` padding on a scrollable container ensures that when the user reaches the bottom, there is a clear visual gap between the last element (the action buttons) and the list container's edge.
- **Safe Zone**: This gap prevents the buttons from being flush with the list boundary or being obscured by horizontal scrollbars if they were to appear at the viewport level.
- **DnD Compatibility**: `@dnd-kit/sortable` calculates droppable areas based on the element's client rect. Standard CSS padding does not interfere with its core logic as long as the padding is inside the element designated as the droppable node (`setNodeRef`).

## Alternatives Considered
- **Applying padding to `KanbanList`**: Rejected because `KanbanList` is the outer container that includes the header. Applying padding there might create unwanted gaps between the header and cards or outside the background-colored area.
- **Using a fixed footer for buttons**: Rejected to maintain the "infinite list" feel where buttons are at the end of the tasks, which is consistent with the current design language.

## Dependencies & Best Practices
- **Tailwind CSS**: Use standard spacing classes (`pb-4`, `pb-6`, `pb-10`).
- **@dnd-kit**: Ensure `setNodeRef` remains on the scrolling container to capture drops accurately.
- **Custom Scrollbar**: Use the `.custom-scrollbar` class defined in `globals.css` for visual consistency.
