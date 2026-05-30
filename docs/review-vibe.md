# Review Vibe

## Spec Compliance

- **Mismatch in UI implementation** — `DateRangeFilter` uses native `<input type="date" />` controls instead of the shared calendar/popover components referenced in `docs/specs/SPEC-filtro-periodo.md`. Severity: MEDIO
  - Suggestion: align the implementation with the spec by reusing `src/components/ui/calendar.tsx` and `src/components/ui/popover.tsx`, or update the spec if the native picker is an acceptable design decision.

- **Potential feature creep** — `src/app/dashboard/page.tsx` includes a `Nova Transação` modal that is not described in the current spec or PRD for the filter feature. Severity: MEDIO
  - Suggestion: remove or isolate the modal if it is unrelated to the filter scope, or document it explicitly as out-of-scope for this ticket.

## Architecture

- **Inconsistent reuse of shared UI modules** — the spec explicitly recommends reusing existing UI primitives, but the new filter component implements its own date selection UI. Severity: MEDIO
  - Suggestion: centralize date picker behavior in the shared UI layer to keep the dashboard consistent with the rest of the app.

- **Repository hygiene issue** — there is an untracked `projetos/` folder present in the repository root. Severity: BAIXO
  - Suggestion: verify whether this folder should be excluded from git or removed before committing.

## Code Quality

- **Date input clearing behavior** — `DateRangeFilter.handleDateChange()` returns early when the input value is empty, so clearing the date field does not propagate a change. Severity: MEDIO
  - Suggestion: handle empty values explicitly or prevent users from clearing the date manually if the component should only accept valid range input.

- **Error state coupling** — `DashboardPage` uses a single `errorMessage` field for both validation and loading failures. Severity: BAIXO
  - Suggestion: keep validation feedback separate from loading/error states if you want clearer UX and easier testing.

## Test Coverage

- **Missing integration/page-level coverage** — there are unit tests for `src/lib/api.ts`, `src/lib/date.ts`, and `DateRangeFilter`, but no tests covering the `DashboardPage` flow with filter validation, metric refresh, and empty-period rendering. Severity: MEDIO
  - Suggestion: add a `DashboardPage` test that covers default state, invalid range handling, and filtered data rendering.

- **Missing invalid/future-date cases in component tests** — `DateRangeFilter.test.tsx` covers happy path and reset button, but does not assert how invalid or future dates are surfaced through the parent validation logic. Severity: BAIXO
  - Suggestion: extend tests to confirm `onChange` is called with normalized dates and that invalid-looking inputs are handled gracefully by the page.

## Positive Notes

- `src/lib/api.ts` correctly applies `startOfDay` and `endOfDay` when filtering transactions by the selected date range.
- `src/lib/date.ts` centralizes date formatting and validation logic in line with project patterns.
- `TransactionsTable` already includes a proper empty state message for zero transactions.
- The new `DateRangeFilter` component is well-structured and uses typed callbacks.

## Recommendation

Focus the next iteration on: 1) aligning the date picker UI with the shared components and spec expectations; 2) removing or clarifying the unrelated transaction modal; 3) adding a dashboard-level integration test for the new filter flow.
