type PortraitPlaceholderProps = { label: string; className?: string }

/**
 * A seated figure in the theme's strong border colour, at the real cut-out's 1600×1715
 * aspect, so swapping in the photo moves nothing.
 */
export default function PortraitPlaceholder({ label, className }: PortraitPlaceholderProps) {
  return (
    <svg
      role="img"
      aria-label={label}
      viewBox="0 0 1600 1715"
      fill="var(--color-border-strong)"
      className={className}
    >
      <circle cx="800" cy="420" r="175" />
      <rect x="730" y="540" width="140" height="200" rx="48" />
      <path d="M560 760c80-45 160-55 240-55s160 10 240 55c90 52 120 140 110 240l-60 380H510l-60-380c-10-100 20-188 110-240Z" />
      <path d="M220 1715c0-195 160-365 400-415 80-15 280-15 360 0 240 50 400 220 400 415Z" />
    </svg>
  )
}
