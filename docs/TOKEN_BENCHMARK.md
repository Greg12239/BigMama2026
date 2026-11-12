# Token Benchmark Protocol (specification only)

Status: **not executed.** Running it needs separate approval because it is token-intensive. No savings are claimed from this document.

## Question
Does `/lean-web-dev` (arm B) reduce total tokens per **correct, regression-free** outcome versus the same task without it (arm A)?

## Preserve the exact starting state (including uncommitted work)
Never touch the user's working tree. Build each run from a snapshot:
1. Record `git rev-parse HEAD`.
2. Tracked changes: `git diff HEAD --binary > snapshot.patch` (read-only).
3. Untracked files: list with `git ls-files -o --exclude-standard`, copy them into the snapshot folder, keeping paths.
4. Hash the snapshot (`Get-FileHash` over patch + untracked list) and store the hash with the results.
5. Per run: `git worktree add ../bench-<arm>-<task>-<n> <HEAD>`, apply `snapshot.patch`, copy untracked files, run `npm ci` (or copy `node_modules` identically for every run).
6. Confirm each worktree starts identical: same hash, clean `git status` apart from the snapshot.
7. Remove with `git worktree remove` afterwards. The main checkout is never edited.

## Controls
- Same model, effort, and Claude Code version in every run; record all three.
- Fresh session per run (no carried context). Same prompt text; arm B prefixes `/lean-web-dev`.
- Run order randomized; 3 repeats per arm per task to expose variance (4 tasks x 2 arms x 3 = 24 runs, only after approval).
- `AGENTS.md` approval gate applies: pre-authorize the exact task in the prompt ("APPROVED — PROCEED for <task>") identically in both arms.

## Tasks (written in advance, identical for both arms)
1. Simple CSS/UI change (one selector, defined acceptance).
2. React component modification (e.g. `Hero.tsx` prop or text behavior).
3. Multi-file debugging task (seeded fault in a throwaway worktree copy).
4. Animation/state issue (reveal or hero motion defect, seeded).
Define each task's acceptance test before any run.

## Token accounting (from transcripts, not estimates)
Source: `~\.claude\projects\<project>\<session-id>.jsonl`, field `message.usage`.
Categories (separate, never summed into each other): `input_tokens`, `output_tokens` (includes reasoning), `cache_creation_input_tokens` (cache write), `cache_read_input_tokens`.
Verified quirks:
- The same assistant message appears on **multiple rows** (streaming). **Deduplicate by `message.id`, keeping the row with the largest `output_tokens`.** Do not sum all rows.
- Subagents write separate files: `<session-id>\subagents\agent-*.jsonl`. Sum them as a separate "subagent" column with the same dedupe rule; report main and subagent separately and combined.
- Do not add `cache_read` to `input_tokens` as "input"; report each category and, separately, a raw sum and (if used) a cost estimate with the rate card cited. Context-window size is never a measure.
Also record: tool-call count, number of repeated Reads of the same unchanged path, files read vs files needed, wall time.

## Success criteria (a run counts only if all hold)
- Task acceptance test passes.
- `npm run typecheck`, `npm run lint`, `npm run build` match the baseline result of the untouched snapshot (existing failures are not regressions).
- Diff touches only expected files; protected areas (menu, hero, nav, assets, `.approved-baseline/`) unchanged unless the task targets them.
- Manual check: affected route renders, no new console errors, animations/responsive layout visually unchanged (screenshot compare at mobile and desktop widths).

## Reporting
Per task and arm: median and range of each token category, subagent column, tool calls, repeated reads, pass/fail. Tokens **per successful run** = total tokens of the arm / number of successful runs. Failed runs stay in the denominator of cost. State sample size; no percentage is claimed without all three repeats.

## Rollback
Delete this file; `git worktree remove` any benchmark worktrees; delete the snapshot folder.
