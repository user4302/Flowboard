# AGENTS.md — Project AI Constitution
Last updated: 2026-04-02
Applies to: entire project
Version: 1.0

## AGENTS.md Hierarchy & Sub-Agent Protocol (Nested Context)

You MUST follow this exact discovery and loading order at the start of EVERY task or interaction:

1. Locate the file(s) you are about to work on (or the directory of the current task).
2. Walk UP the directory tree from that location to the project root.
3. Collect ALL agents.md files found along the path, from closest to the file up to root.
4. Merge them with this priority: the closest file has highest precedence and overrides any conflicting rules from parent files.
5. Explicitly acknowledge in your first response using exactly these lines:
   ✓ AGENTS.md hierarchy loaded:
   - [closest/path/agents.md] (highest priority)
   - [parent/agents.md]
   - [root/agents.md] (base)

6. Strictly obey the combined rules. When rules conflict, always prefer the more specific (closer) one. Quote relevant sections from the active agents.md files when explaining decisions.

Creation & Maintenance Rules for Nested agents.md:
- If a directory lacks an agents.md but clearly needs specialized instructions, propose creating one with a minimal, focused template.
- Keep every agents.md concise (under 150 lines ideally). Focus only on what is unique to that folder and its children.
- When suggesting updates, propose changes to the most specific file first. Only touch parent files if the change is truly global.
- After any approved change to any agents.md, re-state the updated hierarchy summary using the exact format from step 5.

## Core Principles
- Write clean, readable, maintainable code.
- Prioritize simplicity and clarity.
- Follow the project's established patterns and architecture.
- Think step-by-step and document major decisions.

## Coding Standards & Conventions
- Follow language and framework style guides and linting rules.
- Use meaningful names and keep functions/components small and focused.

## Forbidden Practices
- Never leave console.log or temporary code in commits.
- Never use `any` in TypeScript.
- Never commit broken builds or failing tests.

## Version History
- v1.0 — Initial creation with hierarchy protocol
