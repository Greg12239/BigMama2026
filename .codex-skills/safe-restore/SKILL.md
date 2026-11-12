# Safe Restore Skill

## When to use
Use when layout/menu/brand styling has been damaged or user asks to restore original state.

## Source of truth
Use `.approved-baseline/` first.

## Restore rules
- Restore only damaged sections.
- Prefer copying exact original sections from baseline.
- Do not reinterpret design.
- Do not modernize while restoring.
- Do not touch unrelated files.

## Required inspection
1. Compare current `index.html` with `.approved-baseline/index.html`.
2. Compare current `styles.css` with `.approved-baseline/styles.css`.
3. Compare current `app.js` with `.approved-baseline/app.js`.
4. Identify the minimum diff needed.

## After restore
Report:
- what was restored,
- what stayed unchanged,
- how to test,
- how to rollback.
