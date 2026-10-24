type StackListProps = { stack: string[] }

/** The technologies, as muted inline text joined by " · ". */
export default function StackList({ stack }: StackListProps) {
  return (
    <ul aria-label="Tech stack" className="text-small text-muted">
      {stack.map((item, index) => (
        <li key={item} className="inline">
          {/* Spaces inside the span, so the line can break between items, never inside the dot. */}
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          {item}
        </li>
      ))}
    </ul>
  )
}
