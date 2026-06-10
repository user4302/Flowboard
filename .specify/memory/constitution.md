<!-- Sync Impact Report:
Version change: 1.1.0 -> 1.2.0
Modified principles: Next.js/React Standards, Tailwind CSS Discipline added
Added sections: Next.js/React Standards, Tailwind CSS Discipline
Removed sections: None
Templates requiring updates: ⚠ plan-template.md, ⚠ tasks-template.md, ⚠ spec-template.md
Follow-up TODOs: Ensure all new components comply with React Server Component patterns and Tailwind utility standards.
-->

# Flowboard Constitution

## Core Principles

### I. Mobile-Responsive UI/UX (NON-NEGOTIABLE)
- Multi-column layouts MUST collapse to single-column streams on viewports < 768px.
- Horizontal scrolling MUST be restricted purely to scoped elements (e.g., Kanban boards); NEVER on the window viewport body.
- Secondary data (metadata, filters) MUST use Radix UI drawers, accordions, or sheets.
- Follow Tailwind 4 utility standard spacing; touch targets MUST be minimum 44x44px.

### II. Build Discipline (NON-NEGOTIABLE)
- Strictly prohibited: 'bun' runtime in any build, run, or script workflow.
- All dependencies must be managed via standard npm/yarn workflows as approved by project setup.

### III. Next.js & React Standards (NON-NEGOTIABLE)
- Use modern React patterns (App Router, Server Components).
- No class components.
- Strict TypeScript enforcement (no `any` without explicit justification).

### IV. Tailwind CSS Discipline (NON-NEGOTIABLE)
- Use utility classes; avoid arbitrary styles.
- Rely on `eslint-plugin-tailwindcss` for class ordering and consistency.

### V. Test-First (NON-NEGOTIABLE)
- TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced.

### VI. Integration Testing
- Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas.

### VII. Observability & Simplicity
- Text I/O ensures debuggability; Structured logging required; Start simple, YAGNI principles.

## UI/UX Standards
- Consistent spacing across all views.
- Component-based architecture leveraging existing UI kit.
- Responsive design validation is part of every PR.

## Development Workflow
- Code review requirements for all PRs.
- Automated testing gates.
- Semantic versioning.

## Governance
- Constitution supersedes all other practices.
- Amendments require documentation, approval, migration plan.
- All PRs/reviews must verify compliance.
- Complexity must be justified.

**Version**: 1.2.0 | **Ratified**: 2026-06-09 | **Last Amended**: 2026-06-09
