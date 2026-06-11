# Specification: Custom DateTime Picker Component

## 1. Overview
A custom, premium dark-themed Popover Date & Time Picker component to replace native browser date input fallbacks. It provides a unified dropdown interface for date and time selection, maintaining Flowboard's aesthetic and ensuring consistent local-day boundary management.

## 2. User Scenarios
- **Scenario 1: Selecting a date without time**: User opens the date picker, selects a date, and saves. The component automatically sets the time to start-of-day (00:00:00.000) for start dates or end-of-day (23:59:59.999) for due dates based on the client's local timezone.
- **Scenario 2: Explicitly setting time**: User opens the date picker, selects a date, then interacts with the time picker to set a specific hour and minute. The component overrides the default boundary settings with the user's specific time.
- **Scenario 3: Aesthetic alignment**: User interacts with the component and it seamlessly blends into the dark-themed Flowboard UI.

## 3. Functional Requirements
- **FR1: Unified Popover UI**: The component shall render as a single dropdown popover.
- **FR2: Calendar Grid**: The component shall display an intuitive calendar grid for date selection.
- **FR3: Time Selection**: The component shall include a time selection sub-component (12h/24h toggle or list).
- **FR4: Automated Boundary Defaults**: When a date is selected without explicit time interaction, start-of-day (00:00) or end-of-day (23:59) shall be applied based on the task field (start/due).
- **FR5: Explicit Time Override**: When a time is explicitly set, the selected time shall override the default boundary defaults.
- **FR6: State Synchronization**: The component shall commit the resulting combined date and time as a single UTC ISO timestamp to the application state (`cardSlice`).
- **FR7: Dark Theming**: The component shall adhere strictly to the project's dark-themed visual design system.

## 4. Success Criteria
- **SC1: Usability**: Users can select both date and time in fewer than 4 clicks on average.
- **SC2: Consistency**: Default date initialization consistently respects the client's local start/end of day boundaries.
- **SC3: Reliability**: All committed timestamps are valid UTC ISO 8601 strings.
- **SC4: Aesthetic**: Component visual styling passes design review for dark theme consistency.

## 5. Assumptions
- The application environment has access to standard browser/runtime time APIs.
- The project will continue to use standard dark theme CSS variables defined in `globals.css`.

## 6. Dependencies
- Native browser `Date` API, `date-fns` for manipulation.
- Flowboard's existing dark theme variable structure.

## 7. Entities
- **Card Date**: Internal state object containing date and time.
- **ISO Timestamp**: Final persisted string format in UTC.
