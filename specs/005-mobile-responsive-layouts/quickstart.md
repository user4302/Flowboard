# Quickstart: Mobile Responsive Viewport Specification

## Goal
Enable responsive layout adaptations for Flowboard on viewports < 768px.

## Core Patterns
1. **Collapsible Layouts**: Swap between column/stack using `md:flex-row` vs `flex-col`.
2. **Drawer Navigation**: Move filters into `Radix UI` Dialog/Drawer component for narrow screens.
3. **Scroll Tracks**: Use CSS `overflow-x: auto` on containers, NOT the window body.
4. **Touch Targets**: Use Tailwind utilities to ensure min 44x44px.

## Implementation Checklist
- [ ] Refactor Kanban board to responsive container.
- [ ] Implement drawer/sheet navigation for filters.
- [ ] Add touch interaction adjustments.
- [ ] Audit all views for body-level horizontal overflow.
