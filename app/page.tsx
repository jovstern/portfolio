import { site } from '@/app/lib/site'

export default function Page() {
  return (
    <div className="max-w-page py-section mx-auto px-5 md:px-8 lg:px-10">
      <h1 className="text-display">{site.hero.headline}</h1>
    </div>
  )
}
