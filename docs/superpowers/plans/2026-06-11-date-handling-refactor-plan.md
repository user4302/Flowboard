# Date Handling Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor date handling to utilize local-day boundaries for task initialization and filtering while maintaining UTC ISO storage.

**Architecture:**
1.  **Utilities (`src/lib/dateUtils.ts`)**: New boundary-aware functions (`getStartOfLocalDay`, `getEndOfLocalDay`).
2.  **State Mutation (`src/store/boards/cardSlice.ts`)**: Update `createCard` to use these utilities.
3.  **Views (Timeline/Calendar)**: Update filtering logic in these views to use boundary calculations.

**Tech Stack:** `date-fns`, TypeScript, Zustand.

---

### Task 1: Add Date Utility Functions

**Files:**
- Modify: `src/lib/dateUtils.ts`
- Test: `src/lib/__tests__/dateUtils.test.ts` (or create if missing)

- [x] **Step 1: Write test for boundary calculations**

```typescript
// src/lib/__tests__/dateUtils.test.ts
import { getStartOfLocalDay, getEndOfLocalDay } from '../dateUtils';

test('getStartOfLocalDay sets time to 00:00:00.000', () => {
    const date = new Date('2026-06-11T14:30:00Z');
    const start = getStartOfLocalDay(date);
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
    expect(start.getSeconds()).toBe(0);
    expect(start.getMilliseconds()).toBe(0);
});

test('getEndOfLocalDay sets time to 23:59:59.999', () => {
    const date = new Date('2026-06-11T14:30:00Z');
    const end = getEndOfLocalDay(date);
    expect(end.getHours()).toBe(23);
    expect(end.getMinutes()).toBe(59);
    expect(end.getSeconds()).toBe(59);
    expect(end.getMilliseconds()).toBe(999);
});
```

- [x] **Step 2: Implement boundary functions in `src/lib/dateUtils.ts`**

```typescript
// src/lib/dateUtils.ts
import { startOfDay, endOfDay } from 'date-fns';

export const getStartOfLocalDay = (date: Date): Date => {
    return startOfDay(date);
};

export const getEndOfLocalDay = (date: Date): Date => {
    return endOfDay(date);
};
```

- [x] **Step 3: Run tests to verify they pass**
- [x] **Step 4: Commit**

---

### Task 2: Update Card Initialization Logic

**Files:**
- Modify: `src/store/boards/cardSlice.ts`
- Test: `src/store/boards/__tests__/cardSlice.test.ts` (assuming exists)

- [x] **Step 1: Modify `createCard` to use boundary utilities for default dates**

```typescript
// src/store/boards/cardSlice.ts
import { getStartOfLocalDay, getEndOfLocalDay } from '../../lib/dateUtils';

// Inside cardSlice.ts
const createCard = (data) => {
    const now = new Date();
    return {
        ...data,
        startDate: data.startDate || getStartOfLocalDay(now),
        dueDate: data.dueDate || getEndOfLocalDay(now),
        createdAt: now,
        updatedAt: now,
    };
};
```

- [x] **Step 2: Update/Create test to verify default dates**
- [x] **Step 3: Run tests**
- [x] **Step 4: Commit**

---

### Task 3: Refactor Timeline & Calendar View Filtering

**Files:**
- Modify: `src/components/views/timeline/TimelineView.tsx` (or relevant)
- Modify: `src/components/views/calendar/CalendarView.tsx` (or relevant)

- [x] **Step 1: Locate filtering logic in Timeline/Calendar views**
- [x] **Step 2: Update range comparison to use boundary calculations**
    - Ensure comparison is `taskDate >= startOfDay(filterStart)` and `taskDate <= endOfDay(filterEnd)`
- [x] **Step 3: Run existing view tests**
- [x] **Step 4: Commit**
