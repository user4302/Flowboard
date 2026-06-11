# Date Handling Refactor Design

## Objective
Refactor date initialization and boundary logic to respect local client timezone boundaries for task timestamps while ensuring universal ISO storage compatibility.

## Proposed Changes

### 1. `src/lib/dateUtils.ts`
Add new boundary calculation functions utilizing `date-fns` and native runtime localization.

- `getStartOfLocalDay(date: Date): Date`: Resolves to 00:00:00.000 local.
- `getEndOfLocalDay(date: Date): Date`: Resolves to 23:59:59.999 local.
- `normalizeToUniversal(date: Date): string`: ISO-formatted string in UTC.

### 2. `src/store/boards/cardSlice.ts`
Update `createCard` logic to use the new boundary utilities for default timestamps if none are provided.

- Instantiate `startDate` using `getStartOfLocalDay(new Date())`.
- Instantiate `dueDate` using `getEndOfLocalDay(new Date())`.

### 3. Timeline & Calendar Views
Update filtering/mapping logic:
- Ensure range filters `[start, end]` are computed using `getStartOfLocalDay(min)` and `getEndOfLocalDay(max)` before comparing against task `Date` objects in memory.

## Trade-offs
- **Pros**: Consistent behavior across timezones, cleaner initialization logic, avoids magic offset numbers.
- **Cons**: Slightly increased dependency on runtime timezone context for all client-side boundary calculations (expected behavior per requirements).
