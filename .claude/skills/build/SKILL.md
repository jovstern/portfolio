---
name: build
description: Build a project end to end with the user in the loop - discovery questions until nothing important is unknown, an architecture and tech recommendation the user decides, scaffold, spec and plan with one approval, then milestone by milestone with Superpowers subagents, each ending in a code review, UI review and metrics report, a demo GIF and a PR the user merges. Resumes where it left off.
argument-hint: "[what to build, a file, or a URL]"
disable-model-invocation: true
---

# /build

Quality first: the most stable, best-practice, clean, sharp result. Time and usage are not
constraints. The user stays in control: they answer the questions, decide the architecture,
approve the plan, and merge every milestone's PR.

Read first: `CLAUDE.md`, `.claude/skills/stack-conventions/SKILL.md`,
`.claude/skills/quality-gates/SKILL.md`, `.claude/skills/ui-craft/SKILL.md`,
`.claude/skills/metrics/SKILL.md`.

**Models:** Opus for everything — this session, every implementer, every reviewer, the
milestone review, `ui-reviewer` and `observer`. Set `model: "opus"` explicitly on every
dispatch. Never Sonnet or Haiku.

## 0. Resume check (always first)

If `docs/superpowers/plans/plan.md` exists on any branch (`git log --all --
docs/superpowers/plans/plan.md`), this is a resumed run:
1. Read the spec, the plan (from the newest milestone branch if `main` lacks them),
   `docs/adr/`, `gh pr list --state all`, and the ledger under `.superpowers/sdd/`.
2. Work out where things stand: an open PR (check its state and comments, then wait or fix),
   a merged last milestone (start the next), or a milestone branch with tasks done (continue
   with the first task the ledger does not mark complete).
3. Tell the user in 3 lines where you are resuming, then continue.

## 1. Discovery: ask until nothing important is unknown

Use `superpowers:brainstorming` for the conversation, with these overrides: questions go
through `AskUserQuestion` in batches of up to 4 related questions (recommended option first,
each option with its trade-off), as many rounds as needed; stop asking when no remaining
answer would change what gets built. Never ask what the code, the docs or a sensible
default can answer: decide it and list it as an assumption.

Cover, in this order, skipping what `$ARGUMENTS` already answers:
1. **Product:** who it is for, the one thing they must be able to do, what success looks
   like, the must-haves versus later.
2. **Content and features:** every screen and flow; what data exists and where it comes from.
3. **Design:** the source (Figma through the `figma` MCP — read only the frames you need; a
   reference site; or a direction such as "minimal, editorial, dark") and brand constraints.
   Propose a design direction (type pairing, palette, layout idea) when there is none.
4. **Constraints:** auth, languages, SEO, analytics, accessibility level, devices.
5. **Delivery:** hosting and domain, the GitHub repo name and visibility, preview deploys.

## 2. Architecture and tech: recommend, the user decides

1. Verify before recommending: current stable versions (`npm view <pkg> version`), and the
   docs of anything you are unsure about (context7 MCP, or the package's docs). Prefer what
   `stack-conventions` lists; anything else needs a reason.
2. Present **2–3 coherent options** (not a menu of parts) as a table: stack (framework,
   rendering, data, styling, hosting, observability), why it fits this product, trade-offs,
   risks, and your recommendation with the reason. Then a mermaid diagram of the
   recommended architecture.
3. Ask with `AskUserQuestion`: the option, then any open part choices (styling: Tailwind or
   CSS Modules; database; hosting). Their answer is final; record it as
   `docs/adr/0001-architecture.md` (context, options, decision, consequences). Later
   decisions of the same weight get their own ADR.

## 3. Scaffold and repository

- **Repo** (if there is no remote yet): `gh repo create jovstern/<name> --<visibility>
  --source . --push`, then `bash .claude/skills/pr-demo/protect-main.sh jovstern/<name>`.
  Add `.claude/` and `CLAUDE.md` in the first commit.
- **App** (if there is no `package.json`): from the repo root,
  - Next.js: `bash .claude/starters/nextjs/scaffold.sh <name> <tailwind|css-modules>`
  - React + Vite: `bash .claude/starters/vite-react/scaffold.sh <name> <tailwind|css-modules>`
  - anything else (a `server/` API, a database): the plan's first tasks, following the stack
    files.
  Both scripts end by running the gates; they must pass. Delete the starter's example
  feature in M1 once a real one exists (keep the pattern in `stack-conventions/reference/`).
- **Preview deploys:** if hosting is Vercel, ask the user to import the repo at
  vercel.com/new (one click) so every PR gets a preview URL; the PR body links it.

## 4. Spec and plan: one approval

Use `superpowers:writing-plans`, with these overrides:
- **Spec** `docs/superpowers/specs/design.md`: goal and audience; requirements checklist;
  assumptions; the stack (naming which `stack-conventions` files apply); data model; routes
  and screens — for each screen its job, primary action, states, data read and write path,
  and phone/desktop layout; design tokens; performance budgets (from `metrics`, tightened if
  needed); observability in production; what is out of scope.
- **Plan** `docs/superpowers/plans/plan.md`, split into **milestones**. M1 is the thinnest
  end-to-end slice of the core flow, deployed if hosting is set. Each milestone has at most
  6 tasks, ends with the app working, names its demo flow, and names its acceptance tests.
  The last milestone is launch polish: SEO and social previews, error and 404 pages,
  analytics and monitoring, README.
- **Global Constraints** repeat the rules that matter for this stack. Any `useReducer`,
  Route Handler, context, Zustand, TanStack Query or extra dependency has a line naming
  where and why.
- **Before showing the user:** dispatch a fresh Opus reviewer (general-purpose) on the spec
  and plan against the requirements, `stack-conventions`, `ui-craft`, `metrics` and
  `quality-gates`: gaps, wrong order, risky tasks, missing states or tests. Fix what it
  finds.
- Show the user a summary (requirements → milestones, key decisions, assumptions, budgets)
  and the file paths for the full text. Apply their changes; ask again only if a change is
  large. Then create `m1-<slug>` and commit the spec, plan and ADRs on it.

## 5. Build, one milestone at a time

Use `superpowers:subagent-driven-development`, with these overrides:
- **One milestone per run:** hand it only the current milestone's tasks, on the branch
  `mN-<slug>` created from an up-to-date `main`. No worktrees. One commit per task.
- **Test-driven:** implementers follow `superpowers:test-driven-development` for logic,
  data, validation and server code.
- **Every implementer and reviewer brief carries, verbatim:** "Follow
  `.claude/skills/stack-conventions/SKILL.md` and the stack files the spec names,
  `.claude/skills/ui-craft/SKILL.md` for any UI, and `.claude/skills/quality-gates/SKILL.md`.
  Server data is never copied into client state; view state lives in the URL; data is read
  and written through the layer the spec names. Any `any`, unjustified dependency, missing
  state (loading, empty, error), missing keyboard or focus support, or leftover log or dead
  code is an Important finding."
- **Progress:** after each task, one line: `M<N> task <k>/<total> done — <what>`.

### End of each milestone: three reviews, fix, demo, PR, wait

1. **Reviews, in parallel:**
   - the milestone's whole-diff code review on Opus (`requesting-code-review`'s
     `code-reviewer.md`, on `git merge-base main HEAD..HEAD`, pointed at the ledger's
     deferred minors);
   - the `ui-reviewer` agent on the screens this milestone changed (skip if no UI changed);
   - the `observer` agent on the routes this milestone touched.
2. **Fix wave:** one implementer dispatch for every Critical/Important code finding, every
   Must fix from the UI review and every budget miss; then scoped re-reviews by the same
   reviewers until clean (at most 3 rounds; anything left is reported to the user).
3. **Gates:** `npm run check` and `npm run e2e` green.
4. **Demo:** the `pr-demo` skill with the milestone number.
5. **PR:** push and `gh pr create --base main --title "M<N>: <name>" --body-file <tmp>`:
   ```
   ## What you can do now      <3–5 user-facing bullets; preview URL if any>
   ## Demo                     ![M<N> demo](<URL from make-demo.sh>)
   ## Code review              <verdict; each finding and its fix; minors left>
   ## UI review                <verdict; Must/Should fixes made; ideas left>
   ## Metrics                  <the observer's table; misses and their resolution>
   ## Decisions                <every "Ruling:" and ADR from this milestone>
   ## Checks                   <commands run and results>
   ## Requirements covered     <spec checklist items>
   ```
6. **Stop and wait.** Post: the PR link, what to look at (GIF, preview URL or
   `localhost`), the headline metrics, what is next, and: "Merge it and reply **merged**, or
   leave PR comments. For the cleanest context, you can `/clear` and run `/build` after
   merging; it resumes from the plan." Change nothing while waiting.
7. **On the reply:** `gh pr view <N> --json state,reviews,comments`. Comments → fix on the
   branch, rerun gates, push, answer each comment, wait again. `MERGED` → `git switch main
   && git pull --ff-only` and start the next milestone.

## 6. Launch and finish

The last milestone ships the launch checklist: metadata and Open Graph images per page,
`sitemap` and `robots`, favicon and manifest, 404 and error pages, analytics and error
monitoring live, security headers, final observer report against production if deployed,
and `README.md` (what it is, live URL, how to run and test, architecture and decisions with
links to the ADRs, metrics, demo GIFs, what's next).

After the last merge: the requirements checklist (✅/❌), the decisions, the final metrics,
and the links to the repo, each PR and the live site.
