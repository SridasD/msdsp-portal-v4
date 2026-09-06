# MSDSP Portal UI/UX Audit

## Scope

Audit of the current single-route React/Vinext portal across Student, Course Head, Domain Mentor, and Team Mentor workspaces. Existing prototype data, workflows, permissions, and navigation labels remain unchanged.

## Prioritized findings

### Critical

- The evidence modal had no dialog semantics, focus entry/return, focus containment, Escape handling, or background-scroll lock. Keyboard and screen-reader users could lose context.

### High

- Active workspace and role states were conveyed primarily through styling. Navigation now exposes `aria-current`; the role switch exposes pressed state.
- The mobile navigation trigger did not expose its controlled region or whether it was open.
- The visible search shortcut did not work and showed a platform-specific key. It now supports both Ctrl+K and Command+K.
- Notifications were visually presented but not exposed as a polite live region.

### Medium

- Many views use wide table-like button grids. Existing responsive rules retain workflows but require horizontal scrolling on narrow screens; future iterations should replace priority rows with stacked disclosure layouts.
- The page combines all role surfaces in one large client module. This increases regression risk and makes shared interaction behavior difficult to test independently.
- Type sizes below 12px occur in dense progress and status metadata. Essential labels should move to 12-14px as individual screens are revised.
- Several custom popovers lack full menu/listbox keyboard patterns and click-outside dismissal. Escape dismissal is now supported as a baseline.

### Low

- Surface radii and decorative shadows were inconsistent and occasionally read as consumer-style cards. Shared surface/control tokens now reduce that variation.
- Some decorative progress treatments rely heavily on hue. Text values remain present, but future data-visualization work should add explicit accessible summaries for each chart-like group.

## Implementation plan

1. Correct global keyboard, focus, dialog, navigation, and live-region behavior.
2. Normalize shared surface tokens and forced-colour behavior without changing information architecture.
3. Preserve responsive layouts and harden narrow-screen notifications.
4. Verify lint, type compilation, production rendering, reduced-motion rules, and representative route content.

## Remaining recommendations

- Split each role workspace into route-level modules and extract Dialog, Popover, Tabs, Table, Status, EmptyState, and Skeleton primitives.
- Complete the remaining color-contrast remediation surfaced by axe-core, particularly compact status metadata and tinted state labels.
- Extend browser journeys to cycle selection and faculty forms after their interaction contracts are finalised.
- Replace wide mobile tables with stacked row disclosures after validating task frequency with students and faculty.
- Validate real API loading, empty, error, and large-data states when backend responses are connected; the current prototype is static and cannot verify those conditions.

## Implemented reconciliation

- Centralized Learning Cycles, academic components, workspace navigation, the approved cohort, and unresolved rule metadata in `app/portal-config.ts`.
- Linked the proposed programme credit total to open decision `PR-004` instead of presenting it as settled.
- Extracted the evidence dialog into a reusable component with focus containment, focus restoration, specific validation guidance, and constrained prototype file types.
- Added programmatic state to workspace navigation, role controls, profile options, notifications, and Mermaid loading/error output.
- Replaced key Student, Course Head, and Mentor horizontal tables with stacked mobile records while retaining desktop layouts.
- Added a server route boundary in `app/page.tsx` and isolated interactive state in `app/portal.tsx`, preparing role workspaces for incremental code splitting.
- Added Playwright journeys for role switching, mobile navigation, evidence validation and dialog focus return, with automated axe-core coverage for structural WCAG violations.
