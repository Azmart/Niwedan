function Rose() {
  return <svg viewBox="0 0 100 112" fill="none" aria-hidden="true">
    <path d="M50 62c-4 15-3 29 1 45M49 81c-11-8-20-9-26-6 8 10 16 13 26 11M51 91c9-10 18-12 25-10-5 10-13 15-23 16" stroke="#6e7650" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M51 69C28 65 19 53 25 37c3-8 10-12 18-11 6-12 22-13 29-3 11 0 18 10 15 21-2 13-13 22-36 25Z" fill="#ad5863" stroke="#743c4f" strokeWidth="2" />
    <path d="M48 61C31 56 29 43 38 36c8-6 15-1 17 4 6-10 17-11 22-2 7 12-5 22-26 28" fill="#d87d82" />
    <path d="M49 62c-10-6-11-17-3-21 5-3 10 0 12 5 5-7 13-6 15 0 3 9-9 17-24 16Z" fill="#ecaa9e" />
    <path d="M45 53c4-7 15-6 18-1 2 5-2 9-9 10-7-1-11-5-9-9Z" fill="#aa4f5e" />
    <path d="M49 54c3-5 10-4 10 1 0 3-3 5-6 5" stroke="#f2c2aa" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M36 30c-8 6-11 14-9 21M73 26c9 6 11 14 9 23" stroke="#f4b1a3" strokeWidth="3" strokeLinecap="round" opacity=".7" />
  </svg>;
}

function Lily() {
  return <svg viewBox="0 0 100 112" fill="none" aria-hidden="true">
    <path d="M50 65c2 13 1 28-3 42M49 84c-9-6-19-7-25-4 7 7 15 10 24 9M50 94c9-9 19-10 26-6-7 8-15 11-25 11" stroke="#71815b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 58C29 53 17 42 18 26c14 1 28 10 32 26C50 34 57 19 69 12c6 18-1 34-14 44 14-14 27-13 36-6-6 15-18 20-37 15-15 13-32 10-41 0 8-12 20-15 37-7Z" fill="#fff4d6" stroke="#cda773" strokeWidth="2" strokeLinejoin="round" />
    <path d="M50 61c-10-8-16-17-18-29M52 58c4-15 8-25 16-36M55 62c13-8 22-12 31-11M47 62c-14-2-22-1-30 4" stroke="#e9c794" strokeWidth="2" strokeLinecap="round" />
    <path d="M51 59 45 37M52 59l6-24M52 59l17-16" stroke="#8a8066" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="44" cy="34" r="2.5" fill="#b77457" /><circle cx="59" cy="32" r="2.5" fill="#b77457" /><circle cx="72" cy="42" r="2.5" fill="#b77457" />
    <circle cx="52" cy="61" r="4" fill="#d9a45f" />
  </svg>;
}

const flowers = [
  ['rose', 'north-west'],
  ['lily', 'north-east'],
  ['lily', 'west'],
  ['rose', 'east'],
  ['rose', 'south-west'],
  ['lily', 'south-east'],
];

export function LetterFlowers() {
  return <div className="letter-flowers" aria-hidden="true">
    {flowers.map(([kind, position], index) => <span className={`letter-flower letter-flower--${position}`} style={{ '--flower-index': index }} key={position}>
      {kind === 'rose' ? <Rose /> : <Lily />}
    </span>)}
  </div>;
}
