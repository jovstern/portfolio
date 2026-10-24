/** The availability badge: the dot is decoration, the text carries the meaning. */
export default function StatusPill() {
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-small font-medium text-body">
      <span aria-hidden="true" className="size-2 rounded-full bg-success" />
      Open to new roles
    </p>
  )
}
