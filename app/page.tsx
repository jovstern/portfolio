import { site } from '@/app/lib/site'
import Container from '@/app/ui/container'

export default function Page() {
  return (
    <Container className="py-section">
      <h1 className="text-display">{site.hero.headline}</h1>
    </Container>
  )
}
