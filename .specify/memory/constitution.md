<!-- Sync Impact Report:
Version change: 1.0.0 (assumed) -> 1.1.0
Modified principles: Mobile-First UI/UX added, Build Discipline added (No Bun)
Added sections: Mobile-First UI/UX, Build Discipline
Removed sections: None
Templates requiring updates: ✅ constitution-template.md, ⚠ plan-template.md (check for rules), ⚠ tasks-template.md (check for task categorization), ⚠ spec-template.md (check for requirements)
Follow-up TODOs: Manual review of plan/tasks/spec templates for compliance with new rules.
-->

# Flowboard Constitution

## Core Principles

### I. Mobile-First UI/UX (NON-NEGOTIABLE)
- Multi-column layouts MUST collapse to single-column streams on viewports < 768px.
- Horizontal scrolling MUST be restricted purely to scoped elements (e.g., Kanban boards); NEVER on the window viewport body.
- Secondary data (metadata, filters) MUST use Radix UI drawers, accordions, or sheets.
- Follow Tailwind 4 utility standard spacing; touch targets MUST be minimum 44x44px.

### II. Build Discipline (NON-NEGOTIABLE)
- Strictly prohibited: 'bun' runtime in any build, run, or script workflow.
- All dependencies must be managed via standard npm/yarn workflows as approved by project setup.

### III. Test-First (NON-NEGOTIABLE)
- TDD mandatory: Tests written → User approved → Tests fail → Then implement; Red-Green-Refactor cycle strictly enforced.

### IV. Integration Testing
- Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas.

### V. Observability & Simplicity
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

**Version**: 1.1.0 | **Ratified**: 2026-06-09 | **Last Amended**: 2026-06-09
