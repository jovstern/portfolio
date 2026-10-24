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
  role: 'Frontend engineer',
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
    greeting: "Hi, I'm Yoav",
    headline: 'I build fast, accessible web apps with React and Next.js.',
    lead: "I turn designs into interfaces that load quickly, work with a keyboard and hold up under real content. Here are a few things I've built.",
  },
  projectsIntro: "Things I've designed, built and shipped, each with its code.",
  projectsEmpty: 'Projects are on their way. Meanwhile, my code is on GitHub.',
  notFound: 'The link may be out of date, or the address has a typo.',
  about: {
    paragraphs: [
      "I'm a frontend engineer working mostly in React, Next.js and TypeScript. I like the part of the job where a design becomes something people use every day: the layout holds at every width, the focus order makes sense and nothing jumps while the page loads.",
      'I reach for the platform before a library, keep components small and let types catch mistakes early. Tests come with the code, not after it.',
      'This site is one of my projects too: statically rendered, accessible and measured against a performance budget on every change. Its code is on GitHub.',
    ],
  },
  skills: [
    { group: 'Languages', items: ['TypeScript', 'JavaScript', 'HTML', 'CSS'] },
    { group: 'Frameworks', items: ['React', 'Next.js'] },
    { group: 'Styling', items: ['Tailwind CSS', 'Responsive design', 'Accessibility'] },
    { group: 'Testing', items: ['Vitest', 'Testing Library', 'Playwright'] },
    { group: 'Tooling', items: ['Git', 'ESLint', 'Prettier', 'Vercel'] },
  ],
})
