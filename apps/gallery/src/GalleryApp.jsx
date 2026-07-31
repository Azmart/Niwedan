import { content } from './content.js'

function entryStatus(entry, now = Date.now()) {
  const available = !entry.unlockAt || now >= Date.parse(entry.unlockAt)
  return {
    en: available ? entry.availableStatusEn || entry.statusEn : entry.statusEn,
    ne: available ? entry.availableStatusNe || entry.statusNe : entry.statusNe,
  }
}

export default function GalleryApp() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#collection">Skip to the collection</a>
      <header className="hero">
        <div className="hero-mark" aria-hidden="true">✦</div>
        <p className="eyebrow">{content.eyebrowEn}<span lang="ne">{content.eyebrowNe}</span></p>
        <h1>{content.titleEn}<span lang="ne">{content.titleNe}</span></h1>
        <p className="intro">{content.introEn}<span lang="ne">{content.introNe}</span></p>
      </header>
      <main id="collection">
        <section className="collection" aria-labelledby="collection-title">
          <div className="section-heading">
            <p id="collection-title">{content.collectionLabelEn}<span lang="ne">{content.collectionLabelNe}</span></p>
            <span aria-hidden="true">{String(content.entries.length).padStart(2, '0')}</span>
          </div>
          {content.entries.map((entry) => {
            const status = entryStatus(entry)
            const art = entry.number === '002' ? 'फूलबारी' : entry.number === '003' ? 'मिसन' : 'निवेदन'
            return <article className="entry-card" key={entry.number}>
              <div className="entry-art" aria-hidden="true"><span>{entry.number}</span><i>{art}</i></div>
              <div className="entry-copy">
                <p className="status"><span className="status-dot" aria-hidden="true" />{status.en} · <span lang="ne">{status.ne}</span></p>
                <h2>{entry.titleEn}<span lang="ne">{entry.titleNe}</span></h2>
                <p>{entry.summaryEn}<span lang="ne">{entry.summaryNe}</span></p>
                <a className="entry-link" href={entry.href}><span>{entry.ctaEn}<small lang="ne">{entry.ctaNe}</small></span><span aria-hidden="true">↗</span></a>
              </div>
            </article>
          })}
        </section>
        <section className="future" aria-labelledby="future-title">
          <span className="future-mark" aria-hidden="true">＋</span>
          <div><h2 id="future-title">{content.futureTitleEn}<span lang="ne">{content.futureTitleNe}</span></h2></div>
        </section>
      </main>
      <footer><span>{content.footerEn}</span><span lang="ne">{content.footerNe}</span></footer>
    </div>
  )
}
