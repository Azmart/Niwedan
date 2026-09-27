import { useEffect, useState } from 'react';
import { letterContent } from './letterContent.js';
import { LetterFlowers } from './LetterFlowers.jsx';

const OPEN_DURATION = 850;
const CLOSE_DURATION = 700;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function WrittenWords({ value, start }) {
  const words = value.split(/\s+/);

  return words.map((word, index) => (
    <span className="letter-word" key={`${start + index}-${word}`} style={{ '--word-index': start + index }} aria-hidden="true">
      {word}{index < words.length - 1 ? ' ' : ''}
    </span>
  ));
}

export function HandwrittenLetter() {
  const [stage, setStage] = useState('closed');

  useEffect(() => {
    if (stage !== 'opening' && stage !== 'closing') return undefined;
    const timer = window.setTimeout(() => setStage(stage === 'opening' ? 'open' : 'closed'), stage === 'opening' ? OPEN_DURATION : CLOSE_DURATION);
    return () => window.clearTimeout(timer);
  }, [stage]);

  let wordIndex = 0;

  return (
    <section className="letter-section page-shell" aria-labelledby="letter-title">
      <header className="letter-heading">
        <p className="letter-kicker">A small pause for the person who did the work <span lang="ne">· मेहनत गर्ने मान्छेका लागि</span></p>
        <h2 className="letter-title" id="letter-title" tabIndex="-1">
          {letterContent.title} <span lang="ne">· {letterContent.titleNe}</span>
        </h2>
      </header>

      <div className={`letter-stage letter-stage--${stage}`}>
        {stage !== 'closed' && <LetterFlowers />}
        {stage === 'closed' ? (
          <button className="letter-envelope letter-envelope--button" type="button" onClick={() => setStage(prefersReducedMotion() ? 'open' : 'opening')}>
            <span className="letter-envelope__back" aria-hidden="true" />
            <span className="letter-envelope__flap" aria-hidden="true" />
            <span className="letter-envelope__front" aria-hidden="true" />
            <span className="letter-envelope__address" aria-hidden="true">For <span lang="ne">मेसी</span><span className="letter-envelope__seal">✿</span></span>
            <span className="letter-envelope__prompt">{letterContent.openEn} <span lang="ne">· {letterContent.openNe}</span></span>
          </button>
        ) : (
          <div className="letter-envelope" aria-hidden="true">
            <span className="letter-envelope__back" />
            <span className="letter-envelope__flap" />
            <span className="letter-envelope__front" />
            <span className="letter-envelope__address">For <span lang="ne">मेसी</span><span className="letter-envelope__seal">✿</span></span>
          </div>
        )}

        {stage !== 'closed' && <div className="letter-page">
          <div className="letter-words">
            {letterContent.lines.map((line) => {
              const enStart = wordIndex;
              wordIndex += line.en.split(/\s+/).length;
              const neStart = wordIndex;
              if (line.ne) wordIndex += line.ne.split(/\s+/).length;
              return <p className="letter-line" key={line.en} aria-label={`${line.en}${line.ne ? ` ${line.ne}` : ''}`}>
                <WrittenWords value={line.en} start={enStart} />
                {line.ne && <span lang="ne"><WrittenWords value={line.ne} start={neStart} /></span>}
              </p>;
            })}
          </div>
        </div>}
      </div>

      {stage === 'open' && <div className="letter-controls"><button className="letter-button" type="button" onClick={() => setStage(prefersReducedMotion() ? 'closed' : 'closing')}>{letterContent.closeEn} <span lang="ne">· {letterContent.closeNe}</span></button></div>}
    </section>
  );
}

export default HandwrittenLetter;
