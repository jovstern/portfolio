/** A muted pill on draft projects. Drafts never render in production, so it never ships. */
export default function DraftLabel() {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-caption font-medium text-muted">
      Draft
    </span>
  )
}
