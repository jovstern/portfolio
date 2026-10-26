import { SiteSchema, type Site } from '@/app/lib/definitions'

type SiteUrlEnv = { siteUrl?: string; vercelProductionUrl?: string }

// One place for the domain: an explicit URL, then Vercel's production domain, then local.
export function resolveSiteUrl({ siteUrl, vercelProductionUrl }: SiteUrlEnv): string {
  if (siteUrl) return siteUrl
  if (vercelProductionUrl) return `https://${vercelProductionUrl}`
  return 'http://localhost:3100'
}

export const site: Site = SiteSchema.parse({
  name: 'Yoav',
  role: 'Full-Stack Engineer',
  location: 'REPLACE-ME',
  url: resolveSiteUrl({
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    vercelProductionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL,
  }),
  email: 'jovstern@gmail.com',
  links: {
    github: 'https://github.com/jovstern',
    linkedin: 'https://www.linkedin.com/in/REPLACE-ME',
  },
  openToWork: true,
  hero: {
    greeting: "Hi, I'm Yoav, a Full-Stack Engineer",
    headline: 'I build fast, accessible web apps, end to end.',
    lead: "TypeScript across the stack: React and Next.js in the browser, Node.js and SQL or MongoDB behind them. Here are a few things I've built.",
  },
  projectsIntro: "Things I've designed, built and shipped, each with its code.",
  projectsEmpty: 'Projects are on their way. Meanwhile, my code is on GitHub.',
  notFound: 'The link may be out of date, or the address has a typo.',
  about: {
    paragraphs: [
      "I'm a full-stack engineer working mostly in TypeScript: React and Next.js on the front, Node.js, SQL and MongoDB behind them. I like owning a feature end to end, from the data model and the API to an interface that holds at every width, has a sensible focus order and doesn't jump while it loads.",
      'I reach for the platform before a library, keep components small and let types catch mistakes early. Tests come with the code, not after it.',
      'This site is one of my projects too: statically rendered, accessible and measured against a performance budget on every change. Its code is on GitHub.',
    ],
  },
  skills: [
    { group: 'Languages', items: ['TypeScript', 'JavaScript', 'SQL', 'HTML', 'CSS'] },
    { group: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'Accessibility'] },
    { group: 'Backend', items: ['Node.js', 'REST APIs', 'PostgreSQL', 'MongoDB'] },
    { group: 'Testing', items: ['Vitest', 'Testing Library', 'Playwright'] },
    { group: 'Tooling', items: ['Git', 'ESLint', 'Prettier', 'Vercel'] },
  ],
})
