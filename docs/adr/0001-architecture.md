# 0001. Architecture: static Next.js with one MDX file per project

- Status: accepted
- Date: 2026-10-24
- Decided by: Yoav (options and recommendation prepared in `/build`)

## Context

A personal portfolio for a frontend engineer (React, Next.js, TypeScript). Visitors are
recruiters, hiring managers and engineers, who need to understand within a few seconds what Yoav does and
builds, and reach any project, its code, Yoav's LinkedIn (which stands in for a CV) and email
in one click. The project list grows over time: adding a project must be one entry, not new
UI. Quality bar: every budget in the `metrics` skill, WCAG AA, Open Graph previews, SEO,
analytics after launch. No data changes at runtime: there are no users, writes or auth.

Discovery decisions that shape this: one home page (hero, projects, about + skills) plus a
page per project; contact through email, LinkedIn and GitHub links (no form); light and dark
themes that follow the system, with a toggle; Vercel hosting on `*.vercel.app` until a domain
is bought; Vercel Web Analytics + Speed Insights; public repo `jovstern/portfolio`.

## Options considered

|                  | A. Next.js + MDX per project                                                                                                                   | B. Next.js + one typed content file                            | C. Astro + content collections                                     |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------ |
| Adding a project | One `content/projects/<slug>.mdx`: a typed `meta` export for the card, the body is the case study                                              | One object appended to `app/lib/projects.ts`                   | One `.mdx` with schema-checked frontmatter                         |
| Strengths        | Owner's own stack, so the repo works as a code sample; MDX compiles to Server Components (no client JS); write-ups can include code and images | No extra dependency; completely uniform pages                  | Least JS shipped                                                   |
| Weaknesses       | One dependency (`@next/mdx`) and an `mdx-components.tsx`                                                                                       | Long text in TypeScript; no inline code or images in write-ups | Not the owner's stack; outside the kit's conventions and reviewers |

## Decision

**Option A**, with **Tailwind CSS 4**:

- Next.js 16 App Router, every route statically generated (`generateStaticParams`,
  `ensureStatic = 'navigation'`; `dynamicParams` does not exist under Cache Components); React 19 with the React Compiler; TypeScript strict.
- Content in the repo: `content/projects/<slug>/index.mdx` with its images beside it
  (compiled by `@next/mdx`; each file exports a `meta` object that `app/lib/data.ts` validates with Zod at build time) and
  `app/lib/site.ts` (name, bio, skills, links, `openToWork`). No database, no API.
- Tailwind 4 with design tokens as CSS variables in `@theme`; light and dark tokens; Inter
  through `next/font`.
- Theme: a small inline script in `<head>` applies the stored or system theme before first
  paint. No theme library.
- SEO and sharing: Metadata API, `opengraph-image.tsx` per page with `next/og`, `sitemap.ts`,
  `robots.ts`, JSON-LD.
- Hosting on Vercel (a preview on every PR, production from `master`); Vercel Web Analytics
  and Speed Insights for real-user traffic and Core Web Vitals.

## Consequences

- Dependencies beyond the starter: `@next/mdx` (plus `@mdx-js/loader`, `@mdx-js/react`,
  `@types/mdx` as the docs require) and `remark-gfm`; `@vercel/analytics` and
  `@vercel/speed-insights` at launch.
- A malformed project entry fails the build (Zod), so it never reaches production.
- Content changes need a commit and a deploy. Acceptable for a site updated a few times a
  year; a headless CMS can be added later behind `app/lib/data.ts` without touching the UI.
- Client components are limited to the theme toggle, the copy-email button, the dev-only
  Web Vitals reporter and the required error boundaries; everything else is a Server
  Component. The framework runtime alone is about 166 kB gzip (measured on the bare
  scaffold), so the JS budget is set as the framework floor plus at most 15 kB of app code
  (spec §9).
- Tied to Vercel for analytics. Moving hosts means swapping two components in the root
  layout.
