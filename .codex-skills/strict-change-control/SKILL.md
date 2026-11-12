# Strict Change Control Skill

## When to use
Use this skill for every task before making edits.

## Purpose
Prevent uncontrolled changes and protect the approved Big Mama website design.

## Required process
1. Inspect current files.
2. Compare with `.approved-baseline/` when relevant.
3. Produce a file-level plan.
4. Wait for `APPROVED — PROCEED`.
5. Implement only approved changes.
6. Report exact changes.

## Forbidden behavior
- no broad redesign,
- no layout changes unless approved,
- no silent refactors,
- no dependency additions,
- no speculative improvements.

## Output before coding
Use this structure:

```md
## Inspection
...

## Proposed Change Plan
| File | Exact area | Change | Why | Risk | Rollback |
|---|---|---|---|---|---|

## Approval Required
I will not edit files until you reply: APPROVED — PROCEED
```
