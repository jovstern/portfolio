/**
 * The accessible name of an external link with a visible label. Browsers keep the space before
 * the notice, but jsdom trims the text of each element (the notice shares a nowrap span with
 * the arrow), so the match allows any whitespace, or none, before the notice.
 */
export function newTabName(label: string): RegExp {
  const escaped = label.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
  return new RegExp(`^${escaped}\\s*\\(opens in a new tab\\)$`)
}
