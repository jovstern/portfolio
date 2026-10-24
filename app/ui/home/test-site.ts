import type { Site } from '@/app/lib/definitions'

/** Site content for unit tests, so they never depend on the real wording. */
export const testSite: Site = {
  name: 'Ada',
  role: 'Frontend engineer',
  location: 'London',
  url: 'https://example.com',
  email: 'ada@example.com',
  links: { github: 'https://github.com/ada', linkedin: 'https://www.linkedin.com/in/ada' },
  openToWork: true,
  hero: {
    greeting: 'Hello there',
    headline: 'I make test headlines.',
    lead: 'A lead sentence for the test.',
  },
  projectsIntro: 'An intro line for the test.',
  projectsEmpty: 'Nothing here yet. My code is on GitHub.',
  about: { paragraphs: ['The first paragraph.', 'The second paragraph.'] },
  skills: [
    { group: 'Languages', items: ['TypeScript', 'CSS'] },
    { group: 'Testing', items: ['Vitest', 'Playwright', 'Testing Library'] },
  ],
}
