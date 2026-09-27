import { useState } from 'react'
import { endingContent } from './endingContent.js'
import './ceremonySurprise.css'

export default function CeremonyScene() {
  const copy = endingContent.ceremony
  const [tossCount, setTossCount] = useState(0)

  return <section className="ceremony-section" aria-labelledby="ceremony-title">
    <div className="page-shell ceremony-layout">
      <div className="ceremony-copy">
        <p className="ceremony-eyebrow">{copy.eyebrowEn} <span lang="ne">· {copy.eyebrowNe}</span></p>
        <h2 id="ceremony-title">{copy.titleEn}<span lang="ne">{copy.titleNe}</span></h2>
        <p>{copy.bodyEn}</p>
        <p lang="ne">{copy.bodyNe}</p>
        <p className="ceremony-note">{copy.noteEn}<span lang="ne">{copy.noteNe}</span></p>
      </div>
      <div className="ceremony-portrait">
        <button
          className="ceremony-surprise-button"
          type="button"
          aria-label="Toss the graduate's cap. स्नातकको टोपी उडाउनुहोस्।"
          onClick={() => setTossCount((count) => count + 1)}
        >
        <svg viewBox="0 0 600 650" role="img" aria-label={copy.artEn} focusable="false">
          <defs>
            <radialGradient id="ceremony-halo"><stop stopColor="#ffe8ae" stopOpacity=".86"/><stop offset="1" stopColor="#ffe8ae" stopOpacity="0"/></radialGradient>
            <linearGradient id="ceremony-gown" x2="1" y2="1"><stop stopColor="#294b61"/><stop offset="1" stopColor="#142b3f"/></linearGradient>
          </defs>
          <circle cx="300" cy="280" r="260" fill="url(#ceremony-halo)"/>
          <path className="ceremony-rays" d="M300 22v55m-184 25 39 39M38 278h58m397 0h69m-77-176-39 39"/>
          <path className="ceremony-arch" d="M62 518V267a238 238 0 0 1 476 0v251"/>
          <path className="ceremony-floor" d="M34 535q266-51 532 0v79H34z"/>
          <ellipse cx="300" cy="574" rx="125" ry="19" fill="#192d3a" opacity=".35"/>
          <g className="ceremony-graduate">
            <path d="M228 428h42v139h-42zm103 0h42v139h-42z" fill="#293a4d"/>
            <path d="M218 558h65v21h-76q-3-16 11-21zm118 0h65q14 5 11 21h-76z" fill="#393741"/>
            <path d="M279 261h43v59h-43z" fill="#dba88b"/>
            <path d="M214 326q86-67 172 0l34 217H180z" fill="url(#ceremony-gown)" stroke="#efcf91" strokeWidth="5"/>
            <path d="m248 302 52 58 52-58-24 122h-56z" fill="#f2d9b6"/>
            <path d="M300 358v188" stroke="#edc886" strokeWidth="5"/>
            <path d="M214 331q-27 2-39 58l-13 55q-2 16 15 20 16 2 21-14l35-91zm172 0q25 6 39 58l12 55q2 15-15 20-16 2-21-14l-35-91z" fill="#244158" stroke="#efcf91" strokeWidth="4"/>
            <g className="ceremony-bouquet">
              <path d="M273 390q18 36 33 76m22-79q-13 48-22 79m-7-57 7 57m-33-50q-11-13-18-7 1 16 31 25m37-23q17-13 24-5-5 16-31 25" fill="none" stroke="#6d845d" strokeWidth="5" strokeLinecap="round"/>
              <path d="m262 419 43 18 40-18-23 65h-35z" fill="#f6dfca" stroke="#c08b85" strokeWidth="3" strokeLinejoin="round"/>
              <path d="m263 419 42 25 40-25m-58 65 18-40 17 40" fill="none" stroke="#ddaea2" strokeWidth="2"/>
              <path d="M292 458q-29-13-31 3 8 16 34 7m20-10q29-13 31 3-8 16-34 7" fill="#d78b94" stroke="#a45c72" strokeWidth="2"/>
              <circle cx="304" cy="464" r="8" fill="#e9acaa"/>
            </g>
            <path d="M179 447q47-2 105 17l5-15q-59-30-102-21zm242 0q-47-2-105 17l-5-15q59-30 102-21z" fill="#244158" stroke="#efcf91" strokeWidth="3"/>
            <path d="M278 447q-14-2-17 10 0 11 20 15l13-13zm44 0q14-2 17 10 0 11-20 15l-13-13z" fill="#e8b598"/>
            <g className="ceremony-flowers">
              <path d="M274 380q-28-18-18-35 15-7 22 16 4-26 19-22 15 11-5 30 25-12 29 4-7 19-31 13-10 17-23 8-10-8 7-14z" fill="#fff0d6" stroke="#dfa9a4" strokeWidth="3" strokeLinejoin="round"/>
              <path d="M278 373q8-12 18 0m-14 1-7-13m11 14 12-14" fill="none" stroke="#ad7659" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="278" cy="373" r="4" fill="#e5b56d"/>
              <path d="M323 365q-10-17-26-11-13 10-3 26-8 17 8 27 17 5 27-8 18-2 19-19-3-14-18-16z" fill="#d88999" stroke="#8f5067" strokeWidth="3"/>
              <path d="M305 373q11-15 27-2 12 13-3 24-10 9-24 0-10-10 0-22zm4 7q11-9 19 2 2 9-7 12-9 1-12-7 1-6 8-6" fill="none" stroke="#f7d0bf" strokeWidth="3" strokeLinecap="round"/>
              <path d="M298 408q-11-10-20-2-5 10 5 17 2 12 16 13 11-1 15-12 10-11-2-19-8-6-14 3z" fill="#e9a3a5" stroke="#a95e72" strokeWidth="3"/>
              <path d="M290 416q10-9 17 1 2 8-6 11-8 1-9-6 1-5 6-5" fill="none" stroke="#fff0da" strokeWidth="3" strokeLinecap="round"/>
              <path d="M254 402q-12-8-18-1m106 7q12-7 19-1" fill="none" stroke="#6d845d" strokeWidth="5" strokeLinecap="round"/>
            </g>
            <path d="M242 226q-14-91 58-94 74-2 58 94l-10 78H251z" fill="#332f3b"/>
            <ellipse cx="300" cy="224" rx="63" ry="74" fill="#edbd9f"/>
            <path d="M238 219q-2-76 62-81 61-2 62 79-20-9-40-40-17 29-84 42z" fill="#332f3b"/>
            <path d="M276 234h7m35 0h7" stroke="#4b3941" strokeWidth="5" strokeLinecap="round"/>
            <path d="M287 262q14 13 28 0" fill="none" stroke="#a56168" strokeWidth="5" strokeLinecap="round"/>
            <g key={tossCount} className={tossCount ? 'ceremony-cap ceremony-cap-toss' : 'ceremony-cap'}>
              <path d="m190 143 110-37 110 37-110 38z" fill="#213a4d" stroke="#f2cf8d" strokeWidth="5" strokeLinejoin="round"/>
              <path d="M259 165v31q41 24 82 0v-31" fill="#213a4d" stroke="#f2cf8d" strokeWidth="4"/>
              <path d="M401 145v91" fill="none" stroke="#f2cf8d" strokeWidth="5" strokeLinecap="round"/>
              <circle cx="401" cy="239" r="10" fill="#f2cf8d"/>
            </g>
          </g>
          <g className="ceremony-confetti">
            <path d="m106 191 13 23m337-31-15 28m-84-115 14-20M88 393l22-11m383 4 22 13M155 86l-13-23"/>
            <circle cx="150" cy="289" r="6"/><circle cx="469" cy="280" r="6"/><circle cx="377" cy="61" r="5"/>
          </g>
        </svg>
        <span className="ceremony-surprise-hint">Tap the graduate <span lang="ne">· स्नातकलाई छुनुहोस्</span></span>
        </button>
      </div>
    </div>
  </section>
}
