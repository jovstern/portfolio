# Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Yoav's static portfolio: a home page (hero with portrait, projects, about), one page per project from one MDX file each, light/dark themes, SEO, OG images and analytics, every budget green.

**Architecture:** Next.js 16 App Router with every route statically generated. Content lives in the repo (`content/projects/<slug>/index.mdx` + `app/lib/site.ts`), validated with Zod and read only through `app/lib/data.ts`. Everything is a Server Component except the theme toggle, the copy-email button, the dev-only Web Vitals reporter and the error boundaries. Hosted on Vercel.

**Tech Stack:** Next.js 16.4 · React 19.3 (Compiler) · TypeScript strict · Tailwind CSS 4.3 · Zod 4 · `@next/mdx` 16.4 + `remark-gfm` · `next/font` (Inter) · `next/image` · `next/og` · Vitest + Testing Library · Playwright + `@axe-core/playwright` · Vercel Web Analytics + Speed Insights.

**Spec:** `docs/superpowers/specs/design.md` (read it in full; §6 screens, §7 tokens and §9 budgets are binding). ADR: `docs/adr/0001-architecture.md`.

## Global Constraints

- Follow `.claude/skills/stack-conventions/SKILL.md`, `nextjs.md`, `styling.md` (Tailwind), `.claude/skills/ui-craft/SKILL.md`, `.claude/skills/metrics/SKILL.md`, `.claude/skills/quality-gates/SKILL.md`.
- **Next.js 16 is newer than your training data:** read the matching guide in `node_modules/next/dist/docs/` before using any API: MDX `01-app/02-guides/mdx.md`; theme `01-app/02-guides/preventing-flash-before-hydration.md`; static routes `01-app/02-guides/keeping-pages-static.md` and `route-segment-config/ensureStatic`; caching `use cache` and `cacheLife`; time `functions/io.md`; images, the `next/image` reference; OG `opengraph-image`; JSON-LD `01-app/02-guides/json-ld.md`; CSP `content-security-policy.md`; error `retry`. When the build names a fix, apply it.
- **Cache Components is on:** no `dynamicParams`, `dynamic` or `revalidate` exports (they don't exist); no `new Date()`, `Date.now()` or `Math.random()` in server rendering outside `'use cache'`. Every route must be static (`○`/`●` in `next build` output, not `◐` or `ƒ`). Anything that would make a route dynamic (cookies, headers, `searchParams`, nonces) is a stop-and-ask.
- TypeScript strict; no `any`, `@ts-ignore` or non-null `!`. Content types are `z.infer` of the schemas in `app/lib/definitions.ts`.
- No `useMemo`, `useCallback`, `memo`, `useReducer`, `useEffect`, context, Zustand, TanStack Query, Route Handlers or Server Actions anywhere in this plan. The only exception is `useReportWebVitals`, which is the framework's hook. The theme toggle uses `useSyncExternalStore`.
- **Client components, the complete list:** `app/ui/theme-toggle.tsx` (M2), `app/ui/copy-email-button.tsx` (M2), `app/ui/web-vitals.tsx` (dev-only), `app/error.tsx` and `app/global-error.tsx` (required by Next). Anything else marked `'use client'` is an Important finding.
- **Dependencies beyond the starter, the complete list:** `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx` (MDX per the official guide), `remark-gfm` (tables and autolinks in case studies; string form for Turbopack), all in M1 T2; `@axe-core/playwright` (dev, M1 T6, the accessibility gate per `metrics`); `@vercel/analytics`, `@vercel/speed-insights` (M3 T4, ADR 0001). `radix-ui` and `use-debounce` from the starter are removed in M1 T1 (no dialogs, menus or search). Nothing else without a ruling.
- **Configuration changes approved with this plan (and no others):**
  - `next.config.ts`:
    - MDX through `createMDX` + `pageExtensions` (M1 T2)
    - `outputFileTracingIncludes` for `content/**` (M1 T2)
    - `images.formats: ['image/avif', 'image/webp']` (M1 T2)
    - `headers()` (M3 T5)
  - `playwright.config.ts`: `webServer.env = { CONTENT_FIXTURES: process.env.DEMO ? '' : '1' }` (M1 T2).
  - `tsconfig.json`: only if the MDX guide requires it.

  Any other lint, TypeScript, framework or test config change is stop-and-ask.
- Components use semantic tokens only (`bg-surface`, `text-muted`, `rounded-md`...), never raw hex or arbitrary values that duplicate a token. Tokens and values: spec §7, verbatim.
- Copy: confident, plain, first person; no buzzwords. Draft copy lives in `app/lib/site.ts` and the MDX files only, never hard-coded in components (except UI labels like "View projects").
- External links: `target="_blank" rel="noopener noreferrer"`, a visible ↗ (`ArrowUpRightIcon`, `aria-hidden`) and a visually hidden " (opens in a new tab)". Icon-only links and buttons have accessible names.
- Every interactive element has hover, `:focus-visible` (`--shadow-focus` ring), active and disabled states, and a 44 px touch target. Motion only per spec §7, off under reduced motion.
- Tests never depend on the real content's wording: unit tests use fixtures; e2e reads titles from the DOM or uses the `portfolio` project (always present) and the fixture `long-content-fixture` (present when `CONTENT_FIXTURES=1`).
- Demo recordings run with `DEMO=1` so fixtures are absent: `DEMO=1 npx playwright test e2e/demo-m<N>.spec.ts`.
- `npm run check` before every commit; one commit per task, Conventional Commits, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Theme storage is unusable** (Safari private mode throws, value is garbage like `"blue"`): the page falls back to the system theme with no error and no flash. Test: M2 T1 (`resolveTheme` + script evaluated in jsdom with a throwing `localStorage`).
2. **Long content at 360 px** (a 60-char title, a 160-char summary, a long single stack word such as `TanStack-Query-Devtools`): no horizontal scroll; text wraps or breaks. Test: M1 T6 `responsive.spec.ts` over `/projects/long-content-fixture` and the home grid.
3. **Draft projects leak to production** (grid, project route, sitemap, prev/next): none show when `VERCEL_ENV=production`. Tests: M1 T2 (`filterPublished`), M3 T2 (sitemap unit test with mocked data).
4. **Clipboard denied or unavailable** (HTTP, permissions, old browser): the copy button says "Couldn't copy. Select the address instead." in its live region, and the email stays a working mailto link. Test: M2 T2.
5. **Unknown or malformed slug** (`/projects/Foo`, `/projects/does-not-exist`, `/projects/portfolio/`): a 404 page with status 404 (or the redirect to the canonical URL for the trailing slash), no 500, no console error. Test: M1 T6.

---

## Milestone 1: The core site, end to end (`m1-core-site`)

**Demo flow** (`e2e/demo-m1.spec.ts`, `DEMO=1`): open `/` → hero with the placeholder portrait → "View projects" → the projects grid → open the Portfolio card → the project page and case study → "← All projects" → back on the grid. A second recording at 390×844 (milestone 1.1). Dark mode follows the system.

**Acceptance tests:** `e2e/smoke.spec.ts`, `e2e/home.spec.ts`, `e2e/project.spec.ts`, `e2e/a11y.spec.ts`, `e2e/responsive.spec.ts`, `e2e/js-budget.spec.ts`; unit tests listed per task.

**Before the PR:** Yoav imports the repo at vercel.com/new, so the PR gets a preview URL.

### Task 1: Tokens, shell and site content

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`, `app/ui/fonts.ts`, `app/page.tsx`, `package.json`
- Create: `app/lib/definitions.ts`, `app/lib/site.ts`, `app/ui/site-header.tsx`, `app/ui/site-footer.tsx`, `app/ui/external-link.tsx`, `app/ui/button-link.tsx`, `app/ui/icons.tsx` (GitHub and LinkedIn marks as inline SVG components, `aria-hidden`; Heroicons has no brand icons)
- Delete: `app/ui/greeting-form.tsx`, `app/lib/actions.ts`, `app/lib/actions.test.ts`, `e2e/greeting.spec.ts` (the pattern stays in `.claude/skills/stack-conventions/reference/`)
- Test: `app/lib/site.test.ts`, `app/ui/site-header.test.tsx`, `app/ui/site-footer.test.tsx`, `e2e/smoke.spec.ts`

**Interfaces:**
- Produces:
  - `SiteSchema` and `type Site` (in `definitions.ts`)
  - `site: Site` from `app/lib/site.ts`, parsed with `SiteSchema.parse` at module load; `url` is resolved per spec §3
  - `<ExternalLink href children className? aria-label?>`
  - `<ButtonLink href variant: 'primary' | 'secondary' external?: boolean>`
  - `<SiteHeader />` and `<SiteFooter />`

- [ ] **Step 1: Failing tests.**
  - `site.test.ts`:
    - `site` parses.
    - `SiteSchema` rejects an `http://` GitHub link and an invalid email.
    - `SiteSchema` accepts `url: 'http://localhost:3100'`.
  - `site-header.test.tsx`:
    - The wordmark links to `/`.
    - The nav has Projects (`/#projects`) and About (`/#about`).
    - GitHub and LinkedIn icon links have accessible names "GitHub (opens in a new tab)" and "LinkedIn (opens in a new tab)".
    - There is an "Email me" link to `mailto:` + the email.
  - `site-footer.test.tsx`:
    - The footer has `id="contact"` and an h2 "Let's talk".
    - It has a `mailto:` link whose name is the email.
    - LinkedIn and GitHub open in a new tab.
- [ ] **Step 2: Run** `npx vitest run app/lib app/ui`. Expected: FAIL (modules missing).
- [ ] **Step 3: Implement.**
  - **`globals.css`:** tokens exactly as spec §7.
    - Selectors: `:root` light; `@media (prefers-color-scheme: dark) { :root:not([data-theme='light']) {...} }`; `[data-theme='dark'] {...}`, ready for M2.
    - `@theme inline` maps colours, `--font-sans: var(--font-inter)`, radii and the text tokens (with line height and tracking) to Tailwind names.
    - Base styles: body `bg-bg text-body`; headings `text-text`, weight 500, `text-wrap: balance`; `p { text-wrap: pretty }`; the `:focus-visible` ring; the reduced-motion reset; `color-scheme` per theme; `html { scroll-padding-top: <header height> }`.
  - **`fonts.ts`:** Inter with `variable: '--font-inter'`, `display: 'swap'`.
  - **Layout:**
    - `<html lang="en">`.
    - Skip link "Skip to content" → `#main`.
    - `SiteHeader`, laid out per spec §6.
    - `<main id="main" tabIndex={-1}>` with no focus outline on the main element itself.
    - `SiteFooter` (no year).
    - Root `metadata.title` template `'%s | ' + site.name`.
  - **`app/page.tsx`:** a placeholder with the `h1` from `site.hero.headline`. Task 3 replaces it.
  - **`site.ts`:** draft copy per spec §3 and §6, with `openToWork: true`, `linkedin: 'https://www.linkedin.com/in/REPLACE-ME'` and `location: 'REPLACE-ME'`.
  - Run `npm uninstall radix-ui use-debounce`.
- [ ] **Step 4: Run** `npx vitest run` (PASS). Add `e2e/smoke.spec.ts`: `/` shows exactly one `h1`; Tab then Enter on the skip link focuses `main`. Run `npm run check`. Expected: all green.
- [ ] **Step 5: Commit** `feat: design tokens, site shell and content`.

### Task 2: Content layer, logger and the MDX route spike

The riskiest piece goes first: prove that MDX + `'use cache'` + Turbopack prerenders before any UI depends on it.

**Files:**
- Modify: `next.config.ts`, `app/lib/definitions.ts`, `playwright.config.ts` (the `webServer.env` line only), `app/layout.tsx` (mount `WebVitals`)
- Create:
  - `mdx-components.tsx`, `app/lib/data.ts`, `app/lib/utils.ts`, `app/lib/logger.ts`, `app/ui/web-vitals.tsx`
  - `app/projects/[slug]/page.tsx` (bare: the `h1` + the MDX body)
  - `content/projects/portfolio/index.mdx` + `cover.png`
  - `content/fixtures/long-content-fixture/index.mdx` + `cover.png`
  - `docs/project-template.mdx`
- Test: `app/lib/definitions.test.ts`, `app/lib/utils.test.ts`, `app/lib/logger.test.ts`

**Interfaces:**
- Produces:
  - In `definitions.ts`: `ProjectMetaSchema`, `type ProjectMeta`, `type Project = ProjectMeta & { slug: string }`, `SLUG_PATTERN`.
  - `parseProject(slug: string, raw: unknown): Project`. It throws an `Error` whose message names the slug and the Zod issues.
  - In `utils.ts` (all pure):
    - `sortProjects(projects: Project[]): Project[]`
    - `filterPublished(projects: Project[], env: string | undefined): Project[]`
    - `adjacentProjects(projects: Project[], slug: string): { previous: Project | null; next: Project | null }`
  - In `data.ts`:
    - `getProjects(): Promise<Project[]>`
    - `getProject(slug: string): Promise<Project | null>`
    - `getAdjacentProjects(slug: string): Promise<{ previous: Project | null; next: Project | null }>`
  - `logger.{info,warn,error}(msg: string, context?: Record<string, unknown>, error?: unknown): void`
  - `<WebVitals />`

- [ ] **Step 1: Failing tests.**
  - `definitions.test.ts`:
    - A valid fixture parses.
    - `parseProject` throws a message containing `'Bad_Slug'` for that slug, and one containing `summary` for a 161-char summary.
    - It rejects an `http://` repo URL, an empty `stack`, 9 stack items, and a `date` of `2026-13`.
    - `liveUrl` and `demo` are optional; `draft` defaults to `false`.
  - `utils.test.ts`:
    - `sortProjects` puts `2026-09` before `2026-03`, and breaks ties by title A→Z.
    - `filterPublished(list, 'production')` drops drafts; `'preview'` and `undefined` keep them.
    - `adjacentProjects`:
      - with 1 project, both are `null`;
      - with 2, A gets `previous: null, next: B` (no wrap);
      - with 3, it wraps (the first project's `previous` is the last);
      - an unknown slug gives both `null`.
  - `logger.test.ts`: `logger.error('boom', { slug: 'x' }, new Error('e'))` writes one JSON line to `console.error` with `level: 'error'`, `msg`, `slug`, `error.message`, `error.stack`, and `time` (ISO; the logger runs at request or build time, outside rendering, so `new Date()` is fine there).
- [ ] **Step 2: Run** `npx vitest run app/lib`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - Install the five MDX packages.
  - **`next.config.ts`**, following the installed MDX guide:
    - `createMDX({ options: { remarkPlugins: ['remark-gfm'] } })`.
    - `pageExtensions` includes `mdx`.
    - Keep the existing settings. Add `outputFileTracingIncludes: { '/projects/[slug]': ['./content/**'] }` and `images.formats`.
  - **`ProjectMetaSchema`** per spec §5. `cover` is `z.object({ src: z.string(), width: z.number(), height: z.number(), blurDataURL: z.string().optional() })`; check the static-import shape in the `next/image` docs.
  - **`data.ts` → `getProjects`:**
    - Mark it `'use cache'` + `cacheLife('max')`.
    - `fs.readdir(path.join(process.cwd(), 'content/projects'), { withFileTypes: true })` for directories, plus `content/fixtures` when `process.env.CONTENT_FIXTURES === '1'`.
    - ``await import(`@/content/${dir}/${slug}/index.mdx`)`` for `meta`. Return plain data only: `meta` is serialisable, the component isn't.
    - Then `parseProject`, `filterPublished(…, process.env.VERCEL_ENV)` and `sortProjects`.
    - Log failures with `logger.error` and rethrow, so a bad entry fails the build.
  - **`getProject` / `getAdjacentProjects`:** derive from `getProjects`.
  - **The page:**
    - It awaits `params` and calls `getProject`; null → `notFound()`.
    - It dynamically imports the MDX by slug (the fixture folder when the project came from fixtures: expose `source: 'projects' | 'fixtures'` on `Project`).
    - It exports `ensureStatic = 'navigation'` and `generateStaticParams`.
  - **`mdx-components.tsx`:**
    - Maps `h2`, `h3`, `p`, `a` (internal → `next/link`, external → `ExternalLink`), `ul`, `ol`, `li`, `code`, `pre`, `blockquote`, `table` (scrolls horizontally inside its own wrapper) and `img` to token-styled elements.
    - `img` throws a clear build error ("Use an imported image with <Image>; see docs/project-template.mdx"), because markdown images have no dimensions.
  - **`portfolio/index.mdx`:** real `meta` for this site (repo `https://github.com/jovstern/portfolio`, no `liveUrl` until deployed, `date: '2026-10'`) and a draft case study under the four template headings.
  - **Covers:** 1600×1000 PNG placeholders made with ffmpeg (a neutral surface with the title in Inter) until M2.
  - **The fixture** uses Review Focus #2's values.
  - **`docs/project-template.mdx`:** the commented template.
  - **`WebVitals`:** `useReportWebVitals` → `logger.info`; the layout renders it only when `process.env.NODE_ENV === 'development'`.
- [ ] **Step 4: Run** `npx vitest run` (PASS), then `npm run check`. The `next build` output must list `/projects/[slug]` with `portfolio` prerendered and `/` static. If the MDX import, `'use cache'` or `ensureStatic` fails to prerender, stop and debug (`superpowers:systematic-debugging`) before Task 3.
- [ ] **Step 5: Commit** `feat: MDX content layer with build-time validation and logger`.

### Task 3: Home hero and about

**Files:**
- Modify: `app/page.tsx`
- Create: `app/ui/home/hero.tsx`, `app/ui/home/status-pill.tsx`, `app/ui/home/portrait.tsx`, `app/ui/home/portrait-placeholder.tsx`, `app/ui/home/about.tsx`
- Test: `app/ui/home/hero.test.tsx`, `app/ui/home/about.test.tsx`

**Interfaces:**
- Consumes: `site`, `ButtonLink`, `ExternalLink` (Task 1).
- Produces: `<Hero site={Site} />`, `<About site={Site} />`, and `<Portrait />`. The portrait renders `public/portrait.png` through `next/image` when the constant `HAS_PORTRAIT` in `portrait.tsx` is true; otherwise it renders `<PortraitPlaceholder />`. The box is the same either way.

- [ ] **Step 1: Failing tests.**
  - `hero.test.tsx`:
    - One `h1` with `site.hero.headline`.
    - The status pill "Open to new roles" is present with `openToWork: true` and absent with `false`.
    - "View projects" links to `#projects`.
    - "LinkedIn / CV" opens `site.links.linkedin` in a new tab.
    - The portrait (placeholder) has `role="img"` and a non-empty accessible name.
  - `about.test.tsx`: an `h2` "About", every paragraph, and each skill group as a heading followed by a list of its items.
- [ ] **Step 2: Run** `npx vitest run app/ui/home`. Expected: FAIL.
- [ ] **Step 3: Implement** per spec §6, Home (1) and (3), and the layout bullet:
  - A 12-column grid at `lg`.
  - The arch with the exact radius, aspect and tint.
  - The image at 108% width, bottom-aligned, rising about 6% above the arch.
  - `next/image` with explicit `width`/`height` (1600×1715) and `sizes="(min-width: 1024px) 32rem, min(100vw - 2.5rem, 22rem)"`. No `priority`/`preload`; LCP tuning happens in M2 T3.
  - The placeholder is an inline SVG silhouette filled with `var(--color-border-strong)`.
  - The page composes `Hero`, a `#projects` section slot (Task 4) and `About`.
- [ ] **Step 4: Run** the tests (PASS) and `npm run check`.
- [ ] **Step 5: Commit** `feat: home hero with portrait arch and about section`.

### Task 4: Projects grid

**Files:**
- Create: `app/ui/projects/project-card.tsx`, `app/ui/projects/project-grid.tsx`, `app/ui/projects/stack-list.tsx`
- Modify: `app/page.tsx`
- Test: `app/ui/projects/project-card.test.tsx`, `app/ui/projects/project-grid.test.tsx`

**Interfaces:**
- Consumes: `Project` and `getProjects` (Task 2); `ExternalLink` (Task 1).
- Produces:
  - `<ProjectCard project={Project} />`
  - `<ProjectGrid projects={Project[]} />`
  - `<StackList stack={string[]} />`: muted, items separated by " · ", rendered as a `<ul>` with inline items.

- [ ] **Step 1: Failing tests.**
  - `project-card.test.tsx`:
    - The title is a link to `/projects/<slug>`.
    - "Live" and "Code" links have accessible names "Live site for <title> (opens in a new tab)" and "Code for <title> (opens in a new tab)".
    - Without `liveUrl`, only Code renders.
    - The cover's alt text is `coverAlt`.
  - `project-grid.test.tsx`:
    - An empty list shows "Projects are on their way." with a GitHub link and no `list`.
    - Three projects render a `list` with three `listitem`s, in the given order.
- [ ] **Step 2: Run** `npx vitest run app/ui/projects`. Expected: FAIL.
- [ ] **Step 3: Implement** per spec §6, Home (2):
  - **Card:** a stretched link (`::after` on the title link, `inset-0`), with Live and Code at `relative z-10`.
  - **Hover and focus** as specified. Mark the title link `data-card-link`; the card ring is `has-[a[data-card-link]:focus-visible]`.
  - **Cover:** `next/image` with `sizes="(min-width: 768px) 34rem, 100vw"`, and `placeholder="blur"` when `blurDataURL` exists.
  - **Grid:** a `<ul>`, 1 column, 2 columns from `md`, gap 40 px. A single project naturally fills one column, which is half width, so it needs no special case.
  - **Page:** the `#projects` section awaits `getProjects()`.
- [ ] **Step 4: Run** the tests (PASS) and `npm run check`.
- [ ] **Step 5: Commit** `feat: projects grid with empty state`.

### Task 5: Project page

**Files:**
- Modify: `app/projects/[slug]/page.tsx`
- Create: `app/ui/projects/project-header.tsx`, `app/ui/projects/project-media.tsx`, `app/ui/projects/project-nav.tsx`, `app/not-found.tsx`
- Test: `app/ui/projects/project-header.test.tsx`, `app/ui/projects/project-nav.test.tsx`

**Interfaces:**
- Consumes: `getProject`, `getProjects` and `getAdjacentProjects` (Task 2); `StackList` (Task 4); `ButtonLink` (Task 1).
- Produces: `generateMetadata` (`title`, `description: summary`); `<ProjectNav previous next />`, which renders its own compact links and does not use `ProjectCard`.

- [ ] **Step 1: Failing tests.**
  - `project-header.test.tsx`:
    - An `h1` with the title, and the summary.
    - When `liveUrl` exists: a primary "Visit live site", with Code as the secondary.
    - Without it: "View code" becomes the primary.
    - A back link "All projects" to `/#projects`.
  - `project-nav.test.tsx`:
    - `previous` and `next` render as links named "Previous project: <title>" and "Next project: <title>".
    - With both null, nothing renders (no empty `nav`).
- [ ] **Step 2: Run** `npx vitest run app/ui/projects`. Expected: FAIL.
- [ ] **Step 3: Implement** per spec §6, Project:
  - The layout widths follow the spec.
  - `ProjectMedia` shows the cover for now; the `demo` branch arrives in M2.
  - `not-found.tsx` follows spec §6 (links to Home and Projects, inside the shell).
- [ ] **Step 4: Run** the tests (PASS) and `npm run check`. The build lists `/projects/[slug]` as prerendered.
- [ ] **Step 5: Commit** `feat: project pages with previous and next navigation`.

### Task 6: End-to-end, accessibility, responsive and JS-budget tests

**Files:**
- Create: `e2e/home.spec.ts`, `e2e/project.spec.ts`, `e2e/a11y.spec.ts`, `e2e/responsive.spec.ts`, `e2e/js-budget.spec.ts`, `e2e/demo-m1.spec.ts`
- Modify: `package.json` (add `@axe-core/playwright` as a dev dependency)

**Interfaces:**
- Consumes: the production build (the `playwright.config.ts` webServer) and `e2e/fixtures.ts` (console errors fail tests).

- [ ] **Step 1: Write the tests.**
  - `home.spec.ts`:
    - Exactly one `h1`.
    - "View projects" updates the URL hash to `#projects`, and the "Projects" heading is in the viewport and not covered by the header (its top ≥ the header's bottom).
    - Clicking the Portfolio card title opens `/projects/portfolio`.
  - `project.spec.ts`:
    - The page `h1` matches the card title.
    - "All projects" returns to `/#projects`.
    - External links have `target=_blank` and a `rel` containing `noopener`.
    - `/projects/does-not-exist` and `/projects/Foo` respond with status **404** and show the 404 heading.
    - `/projects/portfolio/` ends on `/projects/portfolio`.
    - No console errors (Review Focus #5).
  - `a11y.spec.ts`: axe (`wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`) on `/`, `/projects/portfolio` and a 404 page, each under `colorScheme: 'light'` and `'dark'`; expect 0 violations.
  - `responsive.spec.ts`:
    - At 360, 768, 1024 and 1440 px, on `/`, `/projects/portfolio` and `/projects/long-content-fixture`: `document.documentElement.scrollWidth <= window.innerWidth` (Review Focus #2).
    - At 360×740, the hero headline is fully visible above the fold.
  - `js-budget.spec.ts`:
    - For `/` and `/projects/portfolio`, collect every `script[src]` the page loads.
    - Fetch each one with `accept-encoding: gzip`, sum `content-length` (or the gzipped body length), and log the total per route.
    - Assert ≤ the spec §9 budget.
  - `demo-m1.spec.ts`: the demo flow, with `waitForTimeout(1000)` after each visible result, plus a 390×844 variant.
- [ ] **Step 2: Run** `npm run e2e`. Expected: PASS. If one fails, fix the app, never the assertion. Report a genuine conflict with the spec.
- [ ] **Step 3: Run** `npm run check`. Expected: green.
- [ ] **Step 4: Commit** `test: e2e flows, axe in both themes, responsive overflow, JS budget`.

---

## Milestone 2: Theme toggle, contact, real portrait and real projects (`m2-content-and-polish`)

**Demo flow** (`e2e/demo-m2.spec.ts`): toggle dark → reload (stays dark, no flash) → copy the email ("Copied") → the hero with the real portrait → open a real project with its demo video → back.

**Acceptance tests:** `e2e/theme.spec.ts`, `e2e/contact.spec.ts`, `e2e/media.spec.ts`, plus M1's suites.

**Needs from Yoav before it starts:**
- the project list (title, repo URL, live URL, a sentence on each)
- the LinkedIn URL
- the location line
- the portrait PNG (spec §8)

Anything missing stays a placeholder and is listed in the PR.

### Task 1: Theme script and toggle

**Files:**
- Create: `app/lib/theme.ts`, `app/ui/inline-script.tsx`, `app/ui/theme-toggle.tsx`
- Modify: `app/layout.tsx`, `app/ui/site-header.tsx`
- Test: `app/lib/theme.test.ts`, `app/ui/theme-toggle.test.tsx`, `e2e/theme.spec.ts`

**Interfaces:**
- Produces:
  - `resolveTheme(stored: string | null, prefersDark: boolean): 'light' | 'dark'`
  - `themeScript: string`, a self-contained IIFE that also attaches the live `matchMedia` listener while no choice is stored
  - `<InlineScript html={string} />`, the installed guide's helper
  - `<ThemeToggle />`

- [ ] **Step 1: Failing tests.**
  - `theme.test.ts`:
    - `resolveTheme('dark', false) === 'dark'`
    - `resolveTheme('light', true) === 'light'`
    - `resolveTheme('blue', true) === 'dark'`
    - `resolveTheme(null, false) === 'light'`
    - Evaluating `themeScript` in jsdom with a throwing `localStorage.getItem` sets `data-theme` from `matchMedia` without throwing (Review Focus #1).
  - `theme-toggle.test.tsx`:
    - With `html[data-theme="light"]`, the button is named "Switch to dark theme"; clicking it sets `data-theme="dark"` and `localStorage.theme`, and the name becomes "Switch to light theme".
    - When `localStorage.setItem` throws, the theme still switches.
  - `theme.spec.ts`:
    - An init script records `data-theme` mutations from `DOMContentLoaded` onward in `window.__themeChanges` (a `MutationObserver`).
    - After choosing dark and reloading, `data-theme` is `"dark"` at `DOMContentLoaded` and `__themeChanges` is empty after `load`, so there's no flash.
    - With no stored choice, `page.emulateMedia({ colorScheme: 'dark' })` switches the theme live.
- [ ] **Step 2: Run** them. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - **Script:** rendered through `InlineScript` in `<head>`; `<html suppressHydrationWarning>`.
  - **Toggle:**
    - `useSyncExternalStore`, with `subscribe` = a `MutationObserver` on `document.documentElement`'s `data-theme`. The server snapshot is `null`: the button renders with a neutral name ("Toggle theme") until hydration, so the server and client renders match.
    - The sun and moon icons are both in the DOM; CSS shows one by `[data-theme]`, so the icon is right before hydration.
    - Clicking sets the attribute and writes `localStorage` (inside try/catch).
    - A 44 px icon button in the header, before "Email me".
- [ ] **Step 4: Run** the tests and `npm run check`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: theme toggle that follows the system and remembers the choice`.

### Task 2: Copy-email button

**Files:**
- Create: `app/ui/copy-email-button.tsx`
- Modify: `app/ui/site-footer.tsx`, `app/ui/home/hero.tsx`
- Test: `app/ui/copy-email-button.test.tsx`, `e2e/contact.spec.ts`

**Interfaces:**
- Produces: `<CopyEmailButton email={string} />`

- [ ] **Step 1: Failing tests.**
  - Unit:
    - A button named "Copy email address".
    - On success, its `aria-live="polite"` region says "Copied" and resets after 2 s (fake timers).
    - When `navigator.clipboard` is missing or `writeText` rejects, the region says "Couldn't copy. Select the address instead." (Review Focus #4).
  - e2e, with `clipboard-read` and `clipboard-write` granted: a click puts the email on the clipboard.
- [ ] **Step 2: Run** them. Expected: FAIL.
- [ ] **Step 3: Implement:**
  - `useState<'idle' | 'copied' | 'failed'>`; the 2 s reset uses a timeout started in the click handler, not an effect.
  - `CheckIcon` replaces `ClipboardIcon` on success.
  - Place it next to the mailto link in the footer and in the hero icon row.
- [ ] **Step 4: Run** the tests and `npm run check`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: copy-email button with live confirmation and fallback`.

### Task 3: Real portrait

**Files:**
- Add: `public/portrait.png`
- Modify: `app/ui/home/portrait.tsx`
- Test: extend `e2e/home.spec.ts`

- [ ] **Step 1: Check the asset.** `sips -g hasAlpha -g pixelWidth -g pixelHeight public/portrait.png` must show `hasAlpha: yes` and a width ≥ 1200. If it doesn't, stop and report; never ship a fake-transparent image.
- [ ] **Step 2: Test.**
  - The hero image has `naturalWidth > 0`.
  - At a 1440 px viewport, the image response is `image/avif` and ≤ 120 kB.
- [ ] **Step 3: Implement.**
  - Set `HAS_PORTRAIT = true` and use the real file's `width`/`height`.
  - Tune the overflow above the arch (spec §6) by eye at 360, 1024 and 1440 px.
  - Run Lighthouse mobile and desktop on `/`. Only if the portrait is the LCP element, add `loading="eager"` and `fetchPriority="high"`.
- [ ] **Step 4: Run** `npm run check` and `npm run e2e`. Expected: green.
- [ ] **Step 5: Commit** `feat: real portrait in the hero arch`.

### Task 4: Demo media (GIF → video)

**Files:**
- Create: `scripts/convert-media.sh`, `app/ui/projects/demo-video.tsx`
- Modify: `app/lib/definitions.ts` (`demo`), `app/ui/projects/project-media.tsx`, `package.json` (script `media`)
- Test: extend `app/lib/definitions.test.ts`; create `app/ui/projects/demo-video.test.tsx`, `e2e/media.spec.ts`

**Interfaces:**
- Produces:
  - `npm run media -- <slug> <path-to-gif>`, which writes `public/projects/<slug>/demo.mp4`, `public/projects/<slug>/demo.webm` and `content/projects/<slug>/demo-poster.png`
  - `<DemoVideo demo={Demo} title={string} />`

- [ ] **Step 1: Failing tests.**
  - Schema: `demo` is rejected when its mp4 path isn't under `/projects/<slug>/`.
  - Unit: `DemoVideo` renders:
    - `<video controls preload="none" playsInline muted poster=…>` with the WebM `<source>` before the MP4 one
    - an accessible name "Demo of <title>"
    - no `autoplay`
  - e2e: the portfolio project page has a video whose poster URL responds with 200.
- [ ] **Step 2: Run** them. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - **The script (`ffmpeg`):**
    - H.264: `-crf 26 -pix_fmt yuv420p -movflags +faststart`.
    - VP9: `-crf 36 -b:v 0`.
    - Poster: the first frame.
    - Even dimensions, width capped at 1600.
  - **The component:** `ProjectMedia` prefers `demo` over `cover`.
  - **The portfolio's own demo:** M1's GIF, from the `pr-media` branch: `git show origin/pr-media:m01/demo.gif > /tmp-path` in the scratchpad.
- [ ] **Step 4: Run** the tests and `npm run check`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: project demo videos converted from GIFs`.

### Task 5: Real projects, covers and copy

**Files:**
- Create:
  - `scripts/capture-cover.ts` (Playwright; `npm run cover -- <slug> <url>` takes a 1600×1000 light-theme screenshot of the live site after `networkidle` and saves it as `content/projects/<slug>/cover.png`)
  - `content/projects/<slug>/index.mdx` for each project
- Modify: `app/lib/site.ts` (LinkedIn, location, copy pass), `content/projects/portfolio/` (cover from the deployed preview), `e2e/responsive.spec.ts`, `e2e/a11y.spec.ts` (loop over every card link on `/`)

- [ ] **Step 1:** For each project Yoav listed, read its repo README (`gh repo view <repo>`) and draft `meta` plus the four-heading case study. Take `date` from the month of the repo's first commit.
- [ ] **Step 2:** Capture the covers. `coverAlt` describes each screenshot.
- [ ] **Step 3: Run** `npm run check` (every entry passes the schema) and `npm run e2e` (the responsive and axe suites now cover every project page).
- [ ] **Step 4: Commit** `content: real projects, covers and final copy`.

---

## Milestone 3: Launch (`m3-launch`)

**Demo flow** (`e2e/demo-m3.spec.ts`): the OG image for `/` → `/sitemap.xml` → a 404 page and back home → a project page.

**Acceptance tests:** `e2e/seo.spec.ts`, `e2e/errors.spec.ts`, `e2e/headers.spec.ts`, plus every earlier suite. After the merge, the observer runs against production.

### Task 1: Metadata and Open Graph images

**Files:**
- Modify: `app/layout.tsx`, `app/projects/[slug]/page.tsx`
- Create: `app/opengraph-image.tsx`, `app/projects/[slug]/opengraph-image.tsx`, `app/ui/og/og-card.tsx`, `app/ui/og/inter-medium.ttf`
- Test: `e2e/seo.spec.ts`

- [ ] **Step 1: Failing test** `seo.spec.ts`. On `/` and `/projects/portfolio`, check:
  - `<title>`, `meta[name=description]` and `link[rel=canonical]` (absolute)
  - `og:title`, `og:description` and `og:image`. Fetch `new URL(ogImage).pathname` against `baseURL` (the absolute URL points at the production host); expect 200 `image/png`.
  - `twitter:card=summary_large_image`
- [ ] **Step 2: Run** it. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - **Root metadata:**
    - `metadataBase: new URL(site.url)`
    - description from `site.hero.lead`
    - `openGraph` (`type: 'website'`, `siteName`)
    - `twitter: { card: 'summary_large_image' }`
    - `alternates.canonical`
  - **Project metadata:** `generateMetadata` adds `openGraph.type: 'article'`.
  - **OG cards:**
    - 1200×630, light palette.
    - Inter from the bundled TTF, read with `fs` per the installed `opengraph-image` docs.
    - Home: name + role + the accent rule. Projects: title + summary + stack.
    - Generated at build time (static).
- [ ] **Step 4: Run** the test and `npm run check`. Expected: PASS, and routes still static.
- [ ] **Step 5: Commit** `feat: metadata and Open Graph images per page`.

### Task 2: Sitemap, robots, JSON-LD

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/lib/json-ld.ts`, `app/ui/json-ld.tsx`
- Modify: `app/page.tsx`, `app/projects/[slug]/page.tsx`
- Test: `app/lib/json-ld.test.ts`, `app/sitemap.test.ts`, extend `e2e/seo.spec.ts`

**Interfaces:**
- Produces:
  - `personJsonLd(site: Site)` and `projectJsonLd(project: Project, site: Site)`: plain objects with local types; no `schema-dts`.
  - `<JsonLd data={object} />`, which serialises with `JSON.stringify(data).replace(/</g, '\\u003c')` per `json-ld.md`.

- [ ] **Step 1: Failing tests.**
  - `json-ld.test.ts`:
    - `personJsonLd` has `@type: 'Person'`, `name`, `jobTitle`, `url`, and `sameAs` with GitHub and LinkedIn.
    - `projectJsonLd` has `@type: 'CreativeWork'`, `name`, `description`, `url`, `codeRepository` and `author.name`.
    - The serialised output of a value containing `</script>` contains no `<`.
  - `sitemap.test.ts` (with `getProjects` mocked to return a published project and a draft, and `VERCEL_ENV=production` stubbed):
    - The sitemap lists `/` and the published project only (Review Focus #3).
    - `lastModified` comes from `date`.
  - e2e: `/robots.txt` allows all and points to the absolute sitemap URL; `/sitemap.xml` responds with 200 XML.
- [ ] **Step 2: Run** them. Expected: FAIL.
- [ ] **Step 3: Implement** per the installed guides. `data.ts` already filters drafts, so the sitemap reuses `getProjects`.
- [ ] **Step 4: Run** the tests and `npm run check`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: sitemap, robots and JSON-LD`.

### Task 3: Icons, manifest, 404, error and global-error pages

**Files:**
- Create:
  - `app/icon.svg` (a "Y" monogram in the accent on `--color-bg`, readable at 16 px)
  - `app/apple-icon.png` (180×180)
  - `app/manifest.ts`, `app/error.tsx`, `app/global-error.tsx`
- Modify: `app/not-found.tsx` (metadata `title: 'Page not found'`)
- Test: `e2e/errors.spec.ts`, `app/error.test.tsx`

- [ ] **Step 1: Failing tests.**
  - e2e:
    - `/nope` responds with 404 and shows the heading; the Home and Projects links work.
    - `link[rel=icon]` and `link[rel=manifest]` resolve with 200.
  - Unit: `error.tsx` renders "Something went wrong" and a "Try again" button that calls `retry`, and logs once through `logger.error` with the `digest`.
- [ ] **Step 2: Run** them. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - The manifest has `name`, `short_name`, `theme_color` (light theme), `background_color` and the icons.
  - `global-error.tsx` renders its own `<html><body>` with the same message and inline token values.
- [ ] **Step 4: Run** the tests and `npm run check`. Expected: PASS.
- [ ] **Step 5: Commit** `feat: icons, manifest, 404 and error pages`.

### Task 4: Analytics and Speed Insights

**Files:**
- Modify: `app/layout.tsx`, `package.json`
- Test: `e2e/analytics.spec.ts`

- [ ] **Step 1: Failing test.** Locally (no `VERCEL`), no request goes to `/_vercel/insights/` or `/_vercel/speed-insights/` and there are no console errors. Then a unit test of the layout's `VercelInsights` wrapper: it renders both components when `process.env.VERCEL === '1'` and renders nothing otherwise.
- [ ] **Step 2: Run** them. Expected: FAIL (the wrapper is missing).
- [ ] **Step 3: Implement.** Install the two packages. `app/ui/vercel-insights.tsx` is a Server Component that returns `<Analytics /><SpeedInsights />` only on Vercel; the layout mounts it.
- [ ] **Step 4: Run** the tests and `npm run check`, plus `e2e/js-budget.spec.ts` (still within budget).
- [ ] **Step 5: Commit** `feat: Vercel Web Analytics and Speed Insights`.

### Task 5: Security headers

**Files:**
- Modify: `next.config.ts`
- Create: `docs/adr/0002-security-headers.md`
- Test: `e2e/headers.spec.ts`

- [ ] **Step 1: Failing test.** Responses for `/` carry:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
  - `X-Frame-Options: DENY`
  - a `Content-Security-Policy` containing `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'` and `object-src 'none'`
- [ ] **Step 2: Run** it. Expected: FAIL.
- [ ] **Step 3: Implement** with `headers()` in `next.config.ts`. ADR 0002 records why `script-src` is not restricted: a nonce makes every page dynamic (see the installed `content-security-policy.md`), and Next's inline RSC scripts can't be hashed in advance. The CSP limits framing, base, forms and objects instead.
- [ ] **Step 4: Run** the test, `npm run check` and the full `npm run e2e` (nothing breaks under the CSP). Expected: green.
- [ ] **Step 5: Commit** `feat: security headers`.

### Task 6: README and how to add a project

**Files:** Create `README.md` (replacing the starter's) and `docs/adding-a-project.md`.

- [ ] **Step 1:** Write the README per `/build` §6:
  - what it is, the live URL, screenshots and each PR's demo GIF
  - how to run (`npm run dev`) and test (`npm run check`, `npm run e2e`)
  - how to add a project, linking to `docs/adding-a-project.md`: create the folder, copy `docs/project-template.mdx` to `index.mdx`, `npm run cover`, optionally `npm run media`, open a PR
  - the architecture (the spec's diagram) and links to the ADRs
  - the metrics table from `docs/metrics/m03.md`
  - what's next
- [ ] **Step 2:** `npm run check`. Expected: green.
- [ ] **Step 3: Commit** `docs: README and how to add a project`.
- [ ] **After the merge:** the observer runs against the production URL. Its final report goes to `docs/metrics/production.md` in a docs-only PR.

---

## Time estimate

Calibration from the kit: a small task takes 4–6 min, a medium one 8–12, a large or risky one 15–25. Each milestone adds 20–35 min for reviews, fixes, gates and the demo, plus 10–15 min of the user's review. M1 also carries setup (10–15 min; the scaffold and repo are already done).

| Milestone | Tasks (size, min) | Agent time | User time | Wall-clock (excl. waiting to merge) |
|---|---|---|---|---|
| M1 Core site | T1 M 10 · T2 L 22 · T3 M 12 · T4 M 10 · T5 M 10 · T6 M 12 = 76; + reviews/fixes/demo 30; + setup 12 | **≈ 2 h** | 15 min (Vercel import, PR review) | ≈ 2 h 15 |
| M2 Content & polish | T1 M 14 · T2 S 6 · T3 S 6 · T4 L 15 · T5 M 12 = 53; + 28 | **≈ 1 h 20** | 20 min (project list, portrait, LinkedIn; PR review) | ≈ 1 h 40 |
| M3 Launch | T1 M 12 · T2 M 8 · T3 M 8 · T4 S 6 · T5 M 8 · T6 S 6 = 48; + 30 | **≈ 1 h 20** | 15 min | ≈ 1 h 35 |
| **Total** | 17 tasks | **≈ 4 h 40** | **≈ 50 min** | **≈ 5 h 30** |

**Range:** best 4 h · likely 5 h 30 · worst 8 h (wall-clock, excluding the time each PR waits for a merge).

**What pushes it to the worst case:**
- M1 T2: friction between `@next/mdx`, Cache Components and Turbopack (a dynamic MDX import inside `'use cache'`, `ensureStatic` refusing the route, fs reads treated as dynamic).
- An LCP miss caused by the transparent portrait, needing art direction or a second asset.
- Font loading quirks in `next/og`.
- Review rounds hitting the three-round cap.
- Late content (the project list or the portrait) splitting M2.

## Time log

| Milestone | Estimated | Actual | Why it differed |
|---|---|---|---|
| M1 | 2 h agent / 15 min user | | |
| M2 | 1 h 20 agent / 20 min user | | |
| M3 | 1 h 20 agent / 15 min user | | |
