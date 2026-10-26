import { getProjects } from '@/app/lib/data'
import { site } from '@/app/lib/site'
import Container from '@/app/ui/container'
import About from '@/app/ui/home/about'
import Skills from '@/app/ui/home/skills'
import Hero from '@/app/ui/home/hero'
import ProjectGrid from '@/app/ui/projects/project-grid'

export default async function Page() {
  const projects = await getProjects()

  return (
    <>
      <Hero site={site} />
      {/* The hero's "View projects" lands here. */}
      <section id="projects" aria-labelledby="projects-heading" className="border-t border-border">
        <Container className="py-section">
          <h2 id="projects-heading" className="text-h2">
            Projects
          </h2>
          <p className="mt-4 max-w-xl text-lead text-muted">{site.projectsIntro}</p>
          <div className="mt-12 md:mt-16">
            <ProjectGrid projects={projects} site={site} />
          </div>
        </Container>
      </section>
      <About site={site} />
      <Skills site={site} />
    </>
  )
}
