import { z } from 'zod'

const text = z.string().trim().min(1)

// Every link in the content must be https; only the site's own url may fall back to local http.
const httpsUrl = z.url({ protocol: /^https$/ })

export const SiteSchema = z.object({
  name: text,
  role: text,
  location: text,
  url: z.url({ protocol: /^https?$/ }),
  email: z.email(),
  links: z.object({ github: httpsUrl, linkedin: httpsUrl }),
  openToWork: z.boolean(),
  hero: z.object({ greeting: text, headline: text, lead: text }),
  about: z.object({ paragraphs: z.array(text).min(1) }),
  skills: z.array(z.object({ group: text, items: z.array(text).min(1) })).min(1),
})

export type Site = z.infer<typeof SiteSchema>
