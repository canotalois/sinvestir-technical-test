---
name: review
description: Review the current branch against this repo's GUIDELINES.md. Strict mode — every forbidden pattern is a blocker. Outputs a short checklist (one line per issue) so the dev sees what to fix before pushing. Invoke before submitting a PR, or when the user asks to "review" / "check" the current branch.
---

# review — strict guideline check on current branch

You are running as the `/review` skill in the S'investir crypto-simulator monorepo. The user wants a **short, strict checklist** of blockers against `GUIDELINES.md`. Not an essay. A list a dev can act on in 10 seconds.

## What to do

1. **Locate the rules.** Read `GUIDELINES.md` from the repo root. It is the source of truth. If absent, stop and tell the user.

2. **Find the diff.** Run `git rev-parse --abbrev-ref HEAD` for the branch name. Run `git diff --name-only main...HEAD` for changed files (use `origin/main` if `main` is stale). If on `main` itself, scan staged + unstaged diff against HEAD.

3. **Read each changed file in full** (not just the patch). Patches lose context — you need the surrounding code to judge whether a `??` is a real default or a contract-shape band-aid.

4. **Apply the rules in strict mode.** Every `❌ Don't` line in `GUIDELINES.md` is a blocker. No tier system, no "nit vs blocker". If you find one, list it.

5. **Output the checklist.** See the format below. Nothing else. No intro, no closing thoughts, no encouragement.

## Output format (strict — match this exactly)

If there are blockers:

```
✗ <N> blockers · branch <name>

[ ] <relative/path.ts>:<line> — <one-line description of the violation> · <category>
[ ] <relative/path.ts>:<line> — <one-line description of the violation> · <category>
...

Categories: TS, Fallback, Errors, React, Network, Packages, UI, Tests, Hygiene
See GUIDELINES.md for the rule.
```

If clean:

```
✓ 0 blockers · branch <name>
```

That is the entire output. No prose around it.

## Rules for the checklist itself

- **One line per violation.** Keep descriptions to ~80 chars. The category points the dev to the right section of `GUIDELINES.md`.
- **Quote the bad pattern** when it makes the issue obvious: `as Record<string, unknown>`, `?? data['snake_case']`, `'use client'` on page root, `react` in `dependencies` of the lib, hardcoded `#2563EB` in a component.
- **One blocker per location.** If a line violates two rules, pick the worst one.
- **Use relative paths** from the repo root (`packages/crypto-simulator/src/...`).
- **Sort by file path, then line number.** Deterministic.
- **Don't list `✅ Do` items.** Only `❌ Don't` violations count.
- **Don't list pre-existing issues outside the diff.** Scope = what changed on this branch vs main.

## Categories ↔ GUIDELINES sections

| Category   | GUIDELINES section   |
| ---------- | -------------------- |
| `TS`       | TypeScript           |
| `Fallback` | Nullish & fallbacks  |
| `Errors`   | Errors               |
| `React`    | React                |
| `Network`  | Network & contracts  |
| `Packages` | Packages (monorepo)  |
| `UI`       | UI & Design system   |
| `Tests`    | Tests                |
| `Hygiene`  | Commits & PR hygiene |

## Examples of valid blocker lines

```
[ ] packages/crypto-simulator/src/data/client.ts:40 — `as MarketChart` cast instead of zod parse · TS
[ ] packages/crypto-simulator/src/ui/KpiList.tsx:60 — hardcoded `#2563EB` instead of a token · UI
[ ] apps/web/app/page.tsx:1 — `'use client'` on a server-renderable page root · React
[ ] packages/crypto-simulator/package.json:21 — `react` in `dependencies` of a library · Packages
```

## What NOT to do

- Don't summarize the diff.
- Don't suggest fixes inline — point to `GUIDELINES.md` via the category.
- Don't praise good code. The skill finds blockers, not gold stars.
- Don't ask clarifying questions. Read the rules, read the code, output the list.
- Don't run tests, build, or typecheck. That's CI's job. This is a static review.

## Edge cases

- **No diff vs main**: scan staged + unstaged. If both empty, output `✓ 0 blockers · branch <name>`.
- **Binary / generated files** (`pnpm-lock.yaml`, `.next/`, `*.png`): skip silently.
- **Test files** (`*.test.ts`): same rules apply, but test fixtures (mock API payloads, synthetic price series) are not blockers — they're tests.
- **`packages/*` vs `apps/*`**: same severity. No discount for shared code.
