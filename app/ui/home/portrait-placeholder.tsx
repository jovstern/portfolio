type PortraitPlaceholderProps = { label: string; className?: string }

/**
 * A head-and-shoulders bust in the theme's strong border colour, at the real cut-out's
 * 1600×1715 aspect, so swapping in the photo moves nothing. The shoulders run past the arch's
 * sides, so the arch crops them as it will crop the cut-out.
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
      <path d="M800 400c-98 0-176 92-176 214s78 226 176 226 176-104 176-226-78-214-176-214Z" />
      <path d="M712 780c4 96-8 168-60 214-74 64-226 80-370 126C120 1172 20 1320 0 1500v215h1600v-215c-20-180-120-328-282-380-144-46-296-62-370-126-52-46-64-118-60-214-38 40-82 60-88 60s-50-20-88-60Z" />
    </svg>
  )
}
