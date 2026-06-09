# Research: Mobile Responsive Viewport Specification

## Unknowns/Clarifications
- None identified; requirements are clearly mapped to responsive design patterns.

## Best Practices Findings

### Responsive Utility Breakpoints
- **Hierarchy:** Use standard Tailwind breakpoints (sm: 640px, md: 768px). Target `< md` for mobile responsiveness.
- **Collapsible Panels:** Use `hidden` to `flex` / `block` swaps for panel visibility on small viewports.
- **Scroll-snapping:** Apply `scroll-snap-type: x mandatory` on the container track, and `scroll-snap-align: start` on column/card children.
- **Drawers/Accordions:** Utilize existing `Radix UI` primitives (Dialog, Accordion) to stack secondary info (metadata, filters) when `md` breakpoint is inactive.
- **Global State Data Models:** Responsive UI changes must be strictly visual/CSS. State-level data models (`boardStore`, `sharingStore`) remain identical across all viewport modes. UI state (drawer open/closed) belongs in local UI state (`uiStore`).

## Decisions
- Decision: Use Tailwind breakpoint `md` (768px) for all responsive switches.
- Rationale: Aligns with project requirements and Tailwind defaults.
- Alternatives considered: Custom breakpoints (rejected as redundant).
