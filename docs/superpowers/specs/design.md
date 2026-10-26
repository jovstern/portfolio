# Portfolio: design spec

- Date: 2026-10-24 · Owner: Yoav (jovstern) · Repo: `jovstern/portfolio` (public)
- Decisions: [ADR 0001](../../adr/0001-architecture.md) · Plan: [plan.md](../plans/plan.md)

## 1. Goal and audience

Yoav's calling card as a full-stack engineer (TypeScript; React and Next.js, Node.js, SQL and MongoDB). Visitors are
**recruiters, hiring managers and engineers**. Within about five seconds they should know
what Yoav does and builds, and every project, its code, Yoav's LinkedIn (which stands in
for a CV) and email should be **one click away**. The site is itself a work sample: stable,
fast, accessible, clean code, a sharp and calm UI.

**Success:** a recruiter on a phone reaches "contact" or "LinkedIn" from the first screen; an
engineer opens a project's live site or repo in one click from the home page; adding a
project means adding one folder with one MDX file and its cover image, with no UI code;
every `metrics` budget is green; link previews look right on LinkedIn, Slack and X.

**Anti-goals:** Kinde look-alike (no Kinde logo, wording or assets); decorative animation,
photography or illustration beyond the portrait; anything that makes the projects harder
to reach (intros, carousels, modals).

## 2. Requirements checklist

- [ ] R1 Home page: hero (name, role, availability, headline, lead, CTAs, portrait), projects
  grid, about + skills, footer with contact links.
- [ ] R2 Hero portrait: transparent PNG cut-out standing in front of an arch, laid out like
  the Dribbble reference; placeholder until the real PNG arrives.
- [ ] R3 One page per project, `/projects/<slug>`: summary, stack, live and repo links, cover
  or demo media, MDX case study, previous/next project.
- [ ] R4 Adding a project = one folder `content/projects/<slug>/` (an `index.mdx` exporting
  `meta`, plus its cover image). A malformed entry fails the build.
- [ ] R5 Contact one click away from every page: email, LinkedIn and GitHub in the header
  (icon links on every width) and in the footer (with a copy-email button). "CV" links to
  LinkedIn.
- [ ] R6 "Open to new roles" status in the hero, switched by one setting.
- [ ] R7 Light and dark themes: follow the system, header toggle that remembers the choice,
  no flash on load.
- [ ] R8 Design direction from kinde.com (palette, type, grid, whitespace), one accent,
  motion limited to subtle hover and focus.
- [ ] R9 Fully responsive (360–1440 px+) and accessible (WCAG 2.2 AA, 0 axe violations,
  keyboard-only use).
- [ ] R10 Every budget in §9 met on every route.
- [ ] R11 Open Graph image per page (also used by X through `summary_large_image`);
  correct titles and descriptions.
- [ ] R12 SEO: metadata, canonical URLs, `sitemap.xml`, `robots.txt`, JSON-LD (`Person`,
  `CreativeWork` per project), semantic HTML.
- [ ] R13 Analytics and real-user vitals after launch (Vercel Web Analytics + Speed
  Insights).
- [ ] R14 404 and error pages that help the visitor back.
- [ ] R15 Hosted on Vercel with a preview per PR; production from `master`.
- [ ] R16 README: what it is, live URL, how to run and test, how to add a project,
  architecture and ADRs, metrics, demo GIFs.

## 3. Assumptions (decided in discovery or by default; correct any in review)

- Copy is English only, in a confident, plain first-person voice. I draft it; Yoav edits.
- Public email `jovstern@gmail.com`; GitHub `github.com/jovstern`. The LinkedIn URL and
  location are placeholders in `app/lib/site.ts` until Yoav supplies them (needed before
  M3 ships).
- Projects: Yoav provides the list (titles, repo and live links). This portfolio is project
  #1. Entries flagged `draft: true` render in development and preview builds and are hidden
  in production. Test-only fixture entries live in `content/fixtures/` and are read only
  when `CONTENT_FIXTURES=1` (set by the e2e web server, unset for demo recordings), so
  they never reach a preview, production or a demo GIF.
- Cards show a static cover image. A demo GIF is converted locally (ffmpeg, `npm run
  media <slug>`) to MP4 + WebM with a poster frame. The project page shows it as a native
  `<video>` with controls, no autoplay: zero JS, and no motion the visitor didn't start.
- Theme without a library. M1: the `prefers-color-scheme` CSS alone gives the system
  theme. M2: an inline `<head>` script (through the guide's `InlineScript` helper) sets
  `data-theme` from `localStorage` before first paint, and follows live system changes while
  no choice is stored, as the installed guide "preventing flash before hydration" shows.
- Analytics are page views and Web Vitals only. Vercel **custom events need a Pro plan**,
  so there's no click tracking on Hobby; adding it later means a small `TrackedLink` client
  component.
- Markdown image syntax (`![]()`) is not supported in case studies: images are imported
  in the MDX file and rendered with `<Image>`, so every image has its size and gets
  AVIF/WebP. GitHub-flavoured Markdown (tables, autolinks) is on through `remark-gfm`.
- No contact form, no CV file, no blog, no CMS (§11).
- Domain: `portfolio-jovstern.vercel.app` (or whatever Vercel assigns) until a custom domain
  is bought. The site URL lives in one place, `site.url`, resolved as `NEXT_PUBLIC_SITE_URL`
  → `https://${VERCEL_PROJECT_PRODUCTION_URL}` → `http://localhost:3100`, so the domain
  switch is a one-line change.

## 4. Stack

Next.js **16.4** App Router (Cache Components on, all routes static), React **19.3** with the
React Compiler, TypeScript strict, **Tailwind CSS 4.3**, Zod 4, `@next/mdx` 16.4 (+ `remark-gfm`), Inter through
`next/font`, `next/image`, `next/og`. Vitest + Testing Library, Playwright +
`@axe-core/playwright`. Hosting on Vercel; `@vercel/analytics` 2 and
`@vercel/speed-insights` 2. Node 24 LTS.

Applicable `stack-conventions` files: `SKILL.md`, **`nextjs.md`**, **`styling.md`**
(Tailwind section), plus `ui-craft`, `metrics`, `quality-gates`. There is no database
(content lives in the repo), so `mongodb.md` and `sql.md` do not apply, and there is no API
(`node-api.md` does not apply).

## 5. Data model

All content is in the repo and validated with Zod in `app/lib/definitions.ts`; types are
`z.infer` of the schemas.

**`ProjectMeta`**, exported as `meta` from `content/projects/<slug>/index.mdx`:

| Field | Type | Rule |
|---|---|---|
| `title` | string | 1–60 chars |
| `summary` | string | 1–160 chars, one sentence (card + meta description) |
| `stack` | string[] | 1–8 items, each 1–24 chars |
| `cover` | static image import (`{ src, width, height, blurDataURL? }`) | required; imported from the same folder, so a missing file fails the build |
| `coverAlt` | string | 1–200 chars; says what the image shows |
| `repoUrl` | URL | required, `https` |
| `liveUrl` | URL | optional, `https` |
| `date` | `YYYY-MM` | sort key, newest first |
| `demo` | `{ mp4: string, webm: string, poster: static image }` | optional (M2) |
| `draft` | boolean | default `false`; hidden when `VERCEL_ENV === 'production'` |

`site.url` is the only URL allowed to be `http` (the local fallback); every link in the
content must be `https`.

The slug is the folder name and must match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`. **`Project`** =
`ProjectMeta & { slug }`.

**`Site`** in `app/lib/site.ts` (one object, Zod-validated): `name`, `role`, `location`,
`url`, `email`, `links { github, linkedin }`, `openToWork: boolean`, `hero { greeting,
headline, lead }`, `about { paragraphs: string[] }`, `skills: { group, items: string[] }[]`.

**Read path:** `app/lib/data.ts` is the only reader of content:
- `getProjects(): Promise<Project[]>` lists the folders under `content/projects` (and
  `content/fixtures` when `CONTENT_FIXTURES=1`), imports
  each `index.mdx`, parses `meta`, drops drafts in production and sorts by `date` desc then
  `title`. It is cached with `'use cache'` (+ `cacheLife('max')`), which makes the result
  part of the static build under Cache Components. An invalid entry throws with the slug and
  the Zod issue, failing the build.
- `getProject(slug)` returns `Project | null`.
- `getAdjacentProjects(slug)` returns `{ previous: Project | null, next: Project | null }`
  (wraps around when there are 3+ projects; with fewer, no wrapping).
- The MDX component is imported in the page itself (``import(`@/content/projects/${slug}/index.mdx`)``),
  because components are not serialisable in a cache.
- `next.config.ts` has `outputFileTracingIncludes` for `content/**`, so a request-time
  render (an unknown slug, a cold cache) can still read the folder on Vercel.
There is no write path (no forms, actions or API).

## 6. Routes and screens

Shared shell (`app/layout.tsx`): skip link → `#main`; **header** (sticky, `--color-bg` with a
1 px bottom hairline; no scroll listener. Contents: wordmark `site.name` followed by an
`aria-hidden` period ("Yoav."; the period is header-only, so titles and alt text read "Yoav") ·
nav: Projects, About, Skills · right: icon links GitHub ↗ and LinkedIn ↗ and the theme toggle
(M2). Email lives in the hero and the footer (Yoav's change after M1 review)); `<main id="main" tabIndex={-1}>`, with `scroll-padding-top` equal to the
header height so anchored headings are never hidden under it; **footer** `#contact` (h2
"Let's talk", the email as a large link with a copy button (M2), LinkedIn, GitHub; no
year, because `new Date()` needs `io()` under Cache Components and isn't worth it). On
phones the nav (Projects, About, Skills) moves to a second row (no hamburger: only 3 items).

### `/` Home

- **Job:** in five seconds, what Yoav does and builds; then the projects.
- **Primary action:** "View projects" (hero). Secondary: "Email me". LinkedIn (the CV) is the header
  icon and the footer link, with no separate CV label (Yoav's choice).
- **Sees first:** the headline (the focal point), then the portrait.
- **Sections:**
  1. **Hero:** status pill ("● Open to new roles", `--color-success` dot + text, hidden when
     `openToWork` is false) → greeting ("Hi, I'm Yoav, a Full-Stack Engineer", lead size, muted) → `h1`
     headline, e.g. "I build fast, accessible web apps, end to end." → lead
     (one or two sentences) → CTAs (primary "View projects" → `#projects`; secondary "Email me",
     `mailto:`, same tab). **Portrait:** an arch (rounded top
     elliptical top radii `50% / 45.83%` (a true semicircle on the 11:12 box) and a
     `--radius-lg` foot, `aspect-ratio: 11/12` (M1 ruling: with the 0.93:1 asset at 108% width,
     4/5 could not give the overflow),
     fill `--color-accent-tint`) with the cut-out PNG bottom-aligned inside it, 108% of the
     arch's width, rising above its top edge by about 6%. The arch clips the figure at its sides and
     foot (`clip-path` with a 15% allowance above), so only the head breaks the outline; re-judge
     against the real asset in M2 T3 (the open hand must not be cut). The open hand points toward the
     text. Placeholder: a neutral silhouette (an inline SVG component filled with
     `--color-border-strong`, so it follows the theme) in the same box and aspect, with
     `role="img"` and a label.
  2. **Projects** `#projects`: `h2` "Projects" + one-line intro; a grid of `ProjectCard`s.
     The card is Kinde-style: a 24 px (`--radius-lg`) outer frame with 8 px padding around
     the cover in a `--color-surface` panel (radius 16, concentric; aspect 16/10,
     `object-fit: cover`), then the title (`h3`, and the card's main link to the project page,
     stretched over the card with `::after`), summary, stack as muted text joined by " · ",
     and icon links "Live ↗" and "Code ↗" above the stretched link (`relative z-10`). Hover:
     the border goes from `--color-border` to `--color-border-strong`, the title gets an
     underline, the cover dims 4% (no movement). In the dark theme covers sit about 10% dimmer so
     light screenshots don't glare. Draft entries (previews only) show a small muted "Draft" pill
     on the card and the project header. Focus: when the *title link* has
     `:focus-visible`, the `--shadow-focus` ring goes around the whole card; Live and
     Code get their own rings.
  3. **About** `#about`: `h2` "About" in the left column; right column: bio paragraphs
     (max 65ch).
  4. **Skills** `#skills`: `h2` "Skills" in the left column; right column: a 2–3 column grid
     of plain groups (Languages, Frontend, Backend, Testing, Tooling; group name 14 px/500
     muted, items as a list), no boxes.
- **States:** content is static, so there is no loading or network-error state. *Empty*
  (no published projects): the grid is replaced by "Projects are on their way. Meanwhile,
  my code is on GitHub." with a GitHub link. *One project*: a single card at half width
  (md+), left-aligned, so the grid does not look broken. *Odd count*: the last card stays
  half-width. *Missing `liveUrl`*: only "Code ↗" shows.
- **Layout:** container `max-w-[72rem]`, gutters 20 px (phone) / 32 px (md) / 40 px (lg).
  Phone: hero stacked: text, then the portrait at `min(100%, 22rem)` centred; projects in
  1 column; about stacked. **lg+**: hero in a 12-column grid, text in columns 1–7 and the
  portrait in 8–12, vertically centred; projects in 2 columns from `md` and 3 from `xl` (owner decision after previewing 9 projects),
  gap 40 px; about with the
  heading in columns 1–4 and the content in 5–12. Section padding
  `clamp(4rem, 2rem + 8vw, 7.5rem)` block, with a hairline between sections.

### `/projects/[slug]` Project

- **Job:** show what the project is, how it was built, and get the visitor to the live site
  or the code.
- **Primary action:** "Visit live site ↗" (primary button; when there is no `liveUrl`,
  "View code ↗" becomes the primary).
- **Sees first:** title and summary, then the actions, then the media.
- **Content:** back link "← All projects" (`/#projects`) → `h1` title → summary (lead) →
  actions (primary Live, secondary Code) + stack list → media (`demo` video with poster and
  controls if present, otherwise the cover; radius 16, aspect from the image) → MDX case
  study in the prose column (suggested headings in the template: *Overview*, *What I built*,
  *Decisions*, *What I'd do next*; the template is `docs/project-template.mdx`) →
  previous/next project links (compact: label + title, not full cards).
- **States:** the page exports `ensureStatic = 'navigation'` and `generateStaticParams`
  (`dynamicParams` doesn't exist under Cache Components). An unknown slug renders on
  request, `getProject` returns `null`, and `notFound()` serves the 404 with status 404.
  No adjacent projects hides the nav; a draft is a 404 in production.
- **Layout:** header and prose `max-w-narrow` (`--container-narrow: 44rem`); media up to `72rem`. Phone: actions stack
  full-width; prev/next stacked. lg: prev/next side by side.

### `not-found` (404) and `error`

A 404 says "This page doesn't exist", with links to Home and Projects. The root `error.tsx`
(client) says "Something went wrong", with a **Try again** button (the `retry` prop that
Next 16.3+ names) and a link Home; the error is logged with context. Both use the shell.
`global-error.tsx` catches failures in the root layout itself, with its own minimal
`<html>`.

### Metadata routes

`opengraph-image.tsx` for `/` and for `/projects/[slug]` (1200×630, `next/og`, Inter from
a local font file: name/role, or project title/summary/stack, on the light palette with the
accent rule); X uses the OG image through `twitter.card: 'summary_large_image'`.
`sitemap.ts` (`lastModified` from each project's `date`, never `new Date()`),
`robots.ts`, `icon.svg`, `apple-icon.png`, `manifest.ts`.

## 7. Design tokens

Measured on kinde.com on 2026-10-24 (computed styles), then made our own: the same
restraint, our own accent and values. Defined once as CSS variables in `app/globals.css`
and exposed through Tailwind `@theme inline`; components use semantic tokens only.

**Colour.** Light is the default; dark applies under `[data-theme='dark']`. Before the
script runs, a `prefers-color-scheme` media query applies the system theme. All pairs were
checked (WCAG ratio in brackets).

| Token | Light | Dark | Used for |
|---|---|---|---|
| `--color-bg` | `#FFFFFF` | `#0B0B0C` | page |
| `--color-surface` | `#F5F5F5` | `#161618` | card media panels, secondary button |
| `--color-border` | `#EBEBEB` | `#262629` | hairlines, card borders |
| `--color-border-strong` | `#D4D4D4` | `#3A3A3E` | hover borders |
| `--color-text` | `#0F0F0F` (19.2) | `#F5F5F5` (18.1) | headings, strong text |
| `--color-text-body` | `#2B2B2B` (14.2) | `#D4D4D4` (13.3) | body copy |
| `--color-text-muted` | `#636363` (6.0; 5.5 on surface) | `#A1A1A1` (7.6; 7.0 on surface) | meta, captions |
| `--color-accent` | `#2457F5` (5.6; 5.1 on surface) | `#7C9CFF` (7.6; 6.9 on surface) | links in prose, focus ring |
| `--color-accent-hover` | `#1F4AD6` (7.0) | `#A3BBFF` | link hover |
| `--color-accent-tint` | `#E9EEFE` | `#141A2C` | the portrait's arch |
| `--color-primary` / `--color-on-primary` | `#0F0F0F` / `#FFFFFF` (19.2) | `#F5F5F5` / `#0F0F0F` (17.6) | primary button |
| `--color-success` | `#0B7A3E` (5.4) | `#4ADE80` (11.3) | the availability dot (always with text) |

**Type.** Inter (variable, `next/font`, `display: swap`, latin subset), the one family; a
monospace stack for code in MDX (`ui-monospace, SFMono-Regular, Menlo, monospace`).
Headings are weight 500 with negative tracking, as on Kinde; body is 400.

| Token | Size | Line height | Tracking |
|---|---|---|---|
| `display` (hero h1, phones) | `clamp(2.75rem, 1.6rem + 5.2vw, 6rem)` | 0.95 | -0.03em |
| `display-hero` (hero h1, lg+; M1 ruling) | `clamp(3rem, 1.5rem + 3.2vw, 4.75rem)` | 0.95 | -0.03em |
| `h2` | `clamp(2rem, 1.4rem + 2.6vw, 3.5rem)` | 1.05 | -0.025em |
| `subhead` (MDX h2) | `1.5rem` | 1.25 | -0.02em |
| `h3` | `1.25rem` | 1.3 | -0.015em |
| `lead` | `clamp(1.125rem, 1rem + 0.5vw, 1.5rem)` | 1.35 | -0.01em |
| `body` | `1rem` | 1.5 | -0.005em |
| `small` | `0.875rem` | 1.43 | 0 |
| `caption` | `0.75rem` | 1.33 | 0 |

`text-wrap: balance` on headings, `pretty` on paragraphs; prose `max-width: 65ch`.

**Space and shape.** A 4 px grid (Tailwind's default spacing). Section padding
`clamp(4rem, 2rem + 8vw, 7.5rem)`. Container `72rem`. Radii: `--radius-sm` 8 px (buttons,
chips, inputs), `--radius-md` 16 px (media, covers), `--radius-lg` 24 px (card frames, the arch's foot),
`--radius-full`. No shadows except `--shadow-focus: 0 0 0 2px var(--color-bg), 0 0 0 4px
var(--color-accent)`. Buttons are 44 px tall (touch), `px-4`, 14–15 px/500; primary =
`--color-primary` fill, secondary = `--color-surface` fill. Breakpoints are Tailwind's
defaults (sm 640, md 768, lg 1024, xl 1280).

**Motion.** `--duration-fast: 150ms`, `--ease-out: cubic-bezier(0.2, 0, 0, 1)`; only
`color`, `background-color`, `border-color`, `opacity`, `text-decoration-color`
transitions on hover and focus. Under `prefers-reduced-motion: reduce`, transitions are 0.
No scroll or entrance animation; `scroll-behavior: smooth` only without reduced motion.

## 8. Portrait asset (for Yoav)

- **Format:** PNG with a real alpha channel (or lossless WebP). The current file is a JPEG
  with the checkerboard painted in, so it has no transparency. Finder → right-click → Quick
  Actions → **Remove Background** produces a proper PNG.
- **Size:** at least 1200 px wide, ideally **1600 × 1715 px** (aspect ≈ 0.93:1, like the
  current pose), whole figure in frame, a little headroom.
- It is shown at up to about 520 CSS px; `next/image` serves AVIF/WebP with alpha at 1×–3×.
  Target ≤ 120 kB for the largest served variant. Saved as `public/portrait.png`; the
  placeholder has the same aspect, so swapping it causes no layout shift.

## 9. Performance and quality budgets

The `metrics` defaults, tightened where a static site should do better:

| Metric | Budget (mobile, production build) |
|---|---|
| Lighthouse Perf / A11y / Best Practices / SEO | **≥ 98** / 100 / 100 / 100 (desktop 100 / 100 / 100 / 100) |
| LCP | ≤ **1.8 s** |
| CLS | ≤ **0.01** |
| TBT | ≤ **100 ms** |
| First-load JS per route | ≤ **180 kB** gzip (approved 2026-10-24, see below) |
| Hero portrait (largest served variant) | ≤ 120 kB |
| axe violations | 0 (light and dark) |
| Browser console errors in e2e | 0 |
| Server errors (5xx) in e2e log | 0 |

API latency does not apply: there is no API and no Server Actions.

**JS budget (approved by Yoav, 2026-10-24).** Next.js 16 no longer prints "First Load JS" in
`next build`, so the observer measures it as the sum of gzipped `<script src>` files a route
loads (a Playwright check, `e2e/js-budget.spec.ts`). Measured on the bare scaffold
(2026-10-24): **≈ 166–172 kB gzip**, almost all of it the Next 16.4 + React 19.3
framework runtime. The kit's 130 kB Next.js budget cannot be met by any Next 16 App Router
page. Proposal: **≤ 180 kB per route**, which is the framework floor plus ≤ 15 kB of this
app's own client code (theme toggle, copy button, analytics, dev-only vitals). The kit's
`metrics` skill gets the same correction, proposed at the end of the project. Lighthouse
Performance ≥ 98, LCP and TBT remain the user-facing guarantees.

**Images:** AVIF is turned on with `images.formats: ['image/avif', 'image/webp']`.
`loading="eager"` + `fetchPriority="high"` go on the portrait only if Lighthouse names it as
the LCP element (`preload` would apply at every viewport, and `priority` is deprecated).

## 10. Observability in production

- **Vercel Web Analytics** (cookieless, so no consent banner): page views, referrers,
  countries, devices. No custom events (they need Vercel Pro). `<Analytics />` and
  `<SpeedInsights />` render only when `process.env.VERCEL === '1'`, because a local
  production build would request `/_vercel/insights/script.js`, get a 404 and fail the e2e
  console check.
- **Vercel Speed Insights**: real-user LCP, CLS and INP per route.
- **Logs:** `app/lib/logger.ts`, a thin JSON-lines wrapper over `console` (level, msg,
  context, error with stack), used by `data.ts` and `error.tsx`. Vercel runtime and build
  logs show them. `useReportWebVitals` sends vitals to the logger in development only
  (from M1).
- Failed builds (bad content) show in Vercel's build log and on the PR's check.

## 11. Out of scope

Contact form, CV file or `/cv` page, blog or writing, CMS, i18n, entrance or scroll
animations, illustrations, a custom domain (the switch is one setting later), search or
filtering of projects (revisit at 12+ projects: tag filters in the URL).

## 12. Time estimate

From the plan: **about 4 h 40 min of agent time and about 50 min of Yoav's time over 3
milestones (17 tasks)**. Wall-clock is best 4 h / likely 5 h 30 / worst 8 h, plus however
long each PR waits for its merge.

Assumptions: Vercel import is done before M1's PR; Yoav supplies the project list and
LinkedIn URL by M2 and the portrait PNG by M2; the kit's calibration holds.

Biggest risks: `@next/mdx` with Cache Components and Turbopack (dynamic import per slug,
`'use cache'` around file-system reads); hitting LCP ≤ 1.8 s with a large transparent hero
image on mobile; `next/og` font loading for OG images.
