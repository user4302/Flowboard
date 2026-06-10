# Research: Mobile Bottom Navigation

## Unknowns/Clarifications
- None identified; architectural entry points determined in `BoardPage` layout.

## Best Practices Findings
- **Fixed Positioning**: Use `fixed bottom-0 left-0 w-full z-40` for the navigation bar, ensuring it sits above the viewport boundaries.
- **Viewport Thresholds**: Use Tailwind's `md:hidden` to hide the bar on desktop.
- **View Switching**: Integrate with existing `setCurrentView` function in `useUIStore`.
- **Filter Sheet Trigger**: Reuse existing `SearchAndFilter` logic or wrap in a new `Radix UI` Dialog/Drawer component for bottom-sheet behavior.
- **Safe Areas**: Use `pb-safe` (or similar padding) if safe-area-inset is needed on modern mobile browsers.

## Decisions
- Decision: Place `MobileBottomNav` component in `src/app/board/[boardId]/page.tsx` layout shell.
- Rationale: Ensures persistent presence across all board views without refactoring individual view components.
- Alternatives considered: Inject into individual view components (rejected: redundant and harder to maintain active-state).
