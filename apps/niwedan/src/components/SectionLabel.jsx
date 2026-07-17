/**
 * Small legal/document-style label with a gradient tick mark.
 * e.g.  ——  SECTION I · THE CASE
 */
export default function SectionLabel({ children }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px w-8 bg-gradient-to-r from-romance-rose to-sky" />
      <span className="doc-label">{children}</span>
      <span className="h-1.5 w-1.5 rounded-full bg-sky-cyan/70 shadow-glow-sky" />
    </div>
  )
}
