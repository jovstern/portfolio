import type { Site } from '@/app/lib/definitions'
import Container from '@/app/ui/container'

export default function About({ site }: { site: Site }) {
  return (
    <section id="about" aria-labelledby="about-heading" className="border-t border-border">
      <Container className="grid gap-8 py-section lg:grid-cols-12 lg:gap-10">
        <h2 id="about-heading" className="text-h2 lg:col-span-4">
          About
        </h2>
        <div className="max-w-prose space-y-4 lg:col-span-8">
          {site.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </section>
  )
}
