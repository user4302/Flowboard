# Implementation Plan: Mobile Bottom Navigation

**Branch**: `dev` | **Date**: 2026-06-09 | **Spec**: [specs/006-mobile-bottom-navigation/spec.md](../specs/006-mobile-bottom-navigation/spec.md)

**Input**: Feature specification from `specs/006-mobile-bottom-navigation/spec.md`

## Summary
Refactor the application layout structure to introduce a fixed bottom navigation bar on mobile viewports (< 768px). The bar will contain interactive tab buttons for switching between Kanban, Timeline, Calendar, and Table views, plus a trigger for the filter interface (bottom sheet).

## Technical Context

**Language/Version**: Next.js 15+ (App Router), React 19

**Primary Dependencies**: Tailwind CSS 4, Radix UI

**Storage**: Local state / UIStore (for active view and filter sheet state)

**Testing**: Jest, React Testing Library

**Target Platform**: Mobile (Web)

**Project Type**: Web Application

**Performance Goals**: < 100ms view switch, < 200ms sheet open.

**Constraints**: Fixed position, no body overflow, min touch target 44x44px.

**Scale/Scope**: Mobile viewports (< 768px)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Mobile-Responsive UI/UX: Layouts collapse to single-column streams.
- [x] Horizontal scrolling restricted to scoped elements.
- [x] Secondary data managed by Radix UI.
- [x] Tailwind utility standard spacing/touch targets.
- [x] No `bun` runtime in workflows.
- [x] React Server Component patterns used.
- [x] Strict TypeScript enforcement.

## Project Structure

### Documentation (this feature)

```text
specs/006-mobile-bottom-navigation/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (to be generated)
```

### Source Code
```text
src/
├── components/
│   ├── boardHeader/
│   └── mobile/           # New directory for mobile components
└── store/
    └── uiStore.ts
```

**Structure Decision**: Add `MobileBottomNav` component in `src/components/mobile/` and update `BoardPage` layout to accommodate the fixed bar.

## Complexity Tracking

> None required for this feature.
