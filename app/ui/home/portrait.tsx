import Image from 'next/image'
import PortraitPlaceholder from '@/app/ui/home/portrait-placeholder'

// Flip to true once public/portrait.png (1600×1715, transparent background) is added.
const HAS_PORTRAIT: boolean = false

// The cut-out is 108% of the arch's width, centred and standing on its foot.
const figure = 'absolute bottom-0 left-1/2 h-auto w-[108%] max-w-none -translate-x-1/2'

type PortraitProps = { name: string }

/** The arch (spec §6): a rounded top, a 24 px foot, 4:5, in the accent tint. */
export default function Portrait({ name }: PortraitProps) {
  return (
    <div className="relative mx-auto aspect-4/5 w-full max-w-88 rounded-t-full rounded-b-lg bg-accent-tint lg:max-w-none">
      {HAS_PORTRAIT ? (
        <Image
          src="/portrait.png"
          width={1600}
          height={1715}
          alt={`Portrait of ${name}`}
          sizes="(min-width: 1024px) 32rem, min(100vw - 2.5rem, 22rem)"
          className={figure}
        />
      ) : (
        <PortraitPlaceholder label={`Portrait of ${name} (placeholder)`} className={figure} />
      )}
    </div>
  )
}
