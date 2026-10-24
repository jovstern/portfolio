import { site } from '@/app/lib/site'
import Container from '@/app/ui/container'
import About from '@/app/ui/home/about'
import Hero from '@/app/ui/home/hero'

export default function Page() {
  return (
    <>
      <Hero site={site} />
      {/* The hero's "View projects" lands here; the project cards fill it. */}
      <section id="projects" aria-labelledby="projects-heading" className="border-t border-border">
        <Container className="py-section">
          <h2 id="projects-heading" className="text-h2">
            Projects
          </h2>
        </Container>
      </section>
      <About site={site} />
    </>
  )
}
