import type { Site } from '@/app/lib/definitions'
import Container from '@/app/ui/container'

export default function Skills({ site }: { site: Site }) {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="border-t border-border">
      <Container className="grid gap-8 py-section lg:grid-cols-12 lg:gap-10">
        <h2 id="skills-heading" className="text-h2 lg:col-span-4">
          Skills
        </h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:col-span-8">
          {site.skills.map(({ group, items }) => (
            <div key={group}>
              <h3 className="text-small font-medium text-muted">{group}</h3>
              <ul className="mt-3 space-y-1.5">
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
