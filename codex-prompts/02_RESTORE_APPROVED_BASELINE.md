Read `AGENTS.md` and `.codex-skills/safe-restore/SKILL.md`.

Emergency restore task:
Restore the website to the approved baseline from `.approved-baseline/`.

Do not edit yet.

First compare:
- current `index.html` vs `.approved-baseline/index.html`
- current `styles.css` vs `.approved-baseline/styles.css`
- current `app.js` vs `.approved-baseline/app.js`

Then give me:
1. exact diffs found,
2. restore plan,
3. files to copy/patch,
4. what will be preserved,
5. rollback plan.

Wait for:
`APPROVED — PROCEED`
