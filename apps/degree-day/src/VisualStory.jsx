import { useEffect, useRef, useState } from 'react'
import { storyIntro, storyScenes } from './storyContent.js'

function Scenery({ id }) {
  const common = <><circle className="sky-glow" cx="932" cy="156" r="128"/><path className="far-hill" d="M0 503 Q202 429 417 501 T833 479 T1200 483 V800 H0Z"/><path className="near-hill" d="M0 604 Q251 535 487 603 T1200 569 V800 H0Z"/><path className="travel-path" d="M0 782 Q268 604 586 678 T1200 622 V800 H0Z"/></>
  const scenes = {
    campus: <><path className="building-shadow" d="M120 222h476v360H120z"/><path className="building-front" d="M155 236h402v348H155z"/><path className="building-roof" d="M116 240 356 141l244 99z"/><path className="building-trim" d="M144 277h424v23H144zM170 549h370v23H170z"/><path className="campus-door" d="M318 443h78v140h-78z"/><path className="campus-window" d="M199 333h67v76h-67zm247 0h67v76h-67zm-247 111h67v76h-67zm247 0h67v76h-67z"/><path className="tree-trunk" d="M880 366h26v241h-26z"/><circle className="tree-crown" cx="893" cy="351" r="91"/><circle className="tree-crown" cx="832" cy="395" r="56"/><circle className="tree-crown" cx="956" cy="390" r="56"/><text className="scene-sign" x="355" y="270" textAnchor="middle">SHANKAR DEV</text><path className="book-pages" d="M716 637q50-25 101 0v69q-50-22-101 0zm101 0q50-25 101 0v69q-50-22-101 0z"/><path className="book-line" d="M817 639v66m-77-46h48m57 0h47"/><g className="campus-students"><g transform="translate(636 482)"><circle cx="0" cy="0" r="15"/><path className="student-face" d="M-7-3h2m6 0h2m-9 9q4 3 8-1"/><path d="M-19 23q19-9 38 0l8 89h-54z"/><path d="M-11 110v41m22-41v41"/></g><g transform="translate(704 503)"><circle cx="0" cy="0" r="12"/><path className="student-face" d="M-6-2h2m5 0h2m-7 7q3 2 6-1"/><path d="M-16 20q16-8 32 0l5 70h-42z"/><path d="M-8 88v34m16-34v34"/></g><g transform="translate(775 482)"><circle cx="0" cy="0" r="14"/><path className="student-face" d="M-7-2h2m6 0h2m-8 7q4 3 8-1"/><path d="M-18 22q18-10 36 0l8 86h-52z"/><path d="M-10 108v40m20-40v40"/></g><path className="student-sparkle" d="m613 451 3 8 8 3-8 3-3 8-3-8-8-3 8-3zm133 32 2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></g></>,
    office: <><path className="room-wall" d="M0 145h1200v460H0z"/><path className="office-window" d="M116 196h350v272H116z"/><path className="window-line" d="M291 196v272M116 333h350"/><circle className="window-sun" cx="190" cy="271" r="47"/><path className="city-silhouette" d="M116 437h52V337h35v100h42v-66h59v66h39V309h46v128h77v31H116z"/><path className="office-sign" d="M474 187h333v77H474z"/><text className="office-sign-word" x="640" y="237" textAnchor="middle">OFFICE</text><path className="office-board" d="M822 196h257v181H822z"/><path className="office-board-line" d="M846 232h115m-115 34h177m-177 34h145m-145 34h170"/><path className="office-divider" d="M558 371h19v220h-19zm19 0h473v18H577z"/><path className="office-desk" d="M484 520h585v29H484zM523 549h24v124h-24zm479 0h24v124h-24z"/><path className="office-monitor" d="M666 375h213v139H666zM762 514h22v18h-22zm-52 18h127v12H710z"/><path className="office-screen" d="M682 391h181v106H682z"/><path className="office-screen-line" d="M705 419h95m-95 23h125m-125 23h76"/><path className="office-keyboard" d="M697 551h162l22 19H674z"/><path className="office-mug" d="M915 477h46v47h-46zm46 7q23 0 23 16t-23 16"/><path className="lamp" d="M598 425h75l-33 40h-22zM637 465v55"/><path className="book-stack" d="M975 486h74v14h-74zm-9 15h83v15h-83z"/><text className="prop-word" x="1008" y="480" textAnchor="middle">EXAMS</text><path className="office-paper" d="M607 550h60v28h-60z"/><path className="office-coworker" d="M1104 411q-31 0-33 36v75h67v-75q-2-36-34-36z"/><circle className="office-coworker-face" cx="1104" cy="389" r="26"/><path className="office-coworker-hair" d="M1078 389q-2-32 26-34 30 0 27 35-9-11-20-13-13 11-33 12z"/></>,
    online: <><path className="night-hill" d="M0 453q250-92 506 8t694-44v250H0z"/><circle className="moon" cx="969" cy="169" r="64"/><path className="stars" d="m173 158 9 25 25 9-25 9-9 25-25-9-25-9 25-9zm420 36 6 17 17 6-17 6-6 17-6-17-17-6 17-6z"/><path className="phone" d="M783 351h144q15 0 15 16v217q0 16-15 16H783q-15 0-15-16V367q0-16 15-16z"/><path className="phone-screen" d="M785 381h140v180H785z"/><text className="phone-brand" x="855" y="414" textAnchor="middle">Azmart</text><path className="message-bubble" d="M801 429h106v31H801zm0 49h106v34H801z"/><path className="message-heart" d="M832 534c-29-25 2-42 17-23 15-19 47-2 17 23l-17 15z"/><path className="dotted-connection" d="M634 455q52-118 124-24"/><path className="distance-land" d="M991 550h99v-84h35v84h75v112H991z"/></>,
    thesis: <><path className="desk-top" d="M100 561h1000v34H100z"/><path className="desk-leg" d="M146 595h32v125h-32zm870 0h32v125h-32z"/><g className="thesis-ai"><path className="ai-screen" d="M420 329h138v98H420z"/><path className="ai-screen-line" d="M435 380h105m-105 15h83m-105 15h94"/><text className="ai-screen-title" x="489" y="361" textAnchor="middle">ChatGPT</text><path className="ai-stand" d="M480 427h18v18h-18zm-28 18h73v9h-73z"/></g><path className="book-stack" d="M172 512h169v19H172zm20-24h158v20H192z"/><path className="small-note" d="M377 470h128v65H377z"/><text className="note-word" x="441" y="510" textAnchor="middle">structure ✓</text><path className="paper-shadow" d="M577 245h278v300H577z"/><path className="paper-sheet" d="M555 221h278v300H555z"/><path className="paper-fold" d="M779 221v56h54"/><text className="pdf-label" x="694" y="299" textAnchor="middle">THESIS · PDF</text><path className="paper-rule" d="M603 339h181m-181 30h153m-153 30h176m-176 30h128"/><path className="edit-mark" d="m754 371 12 12 24-29m-39 75 12 12 26-29"/><path className="pencil" d="m869 447 14-9 83 129-14 10z"/></>,
    tea: <><path className="stall-back" d="M334 255h601v341H334z"/><path className="stall-awning" d="M309 228h650l-36 79H345z"/><path className="awning-stripe" d="M381 228h75l-11 79h-89zm151 0h75l-1 79h-88zm151 0h75l9 79h-88zm151 0h75l23 79h-88z"/><text className="tea-shop-sign" x="633" y="352" textAnchor="middle">TEA SHOP · चिया पसल</text><path className="tea-shop-shelf" d="M389 395h493v14H389z"/><path className="tea-shop-jar" d="M431 360h41v35h-41zm70-20h49v55h-49zm275-20h53v75h-53z"/><path className="tea-shop-kettle" d="M691 362h63v33h-63zm63 7q23-3 24 12t-24 13"/><path className="stall-counter" d="M339 477h585v38H339z"/><path className="tea-chair" d="M412 485h20v177h-20zm0 148h125v20H412zm107 15h19v50h-19zm235-163h20v177h-20zm-107 148h127v20H647zm0 15h19v50h-19z"/><g className="tea-seated-companion" transform="translate(-47 -84) scale(1.12)"><path className="tea-seated-leg" d="M473 585q24 4 56 38l-7 18h-66q-18-1-15-18zm47 44h22v61h-22z"/><path className="tea-seated-shoe" d="M514 686h44q13 4 13 13h-57z"/><path className="tea-seated-shirt companion-body" d="M447 480q25-15 52 0l18 119h-85z"/><path className="companion-neck" d="M465 456h20v30h-20z"/><ellipse className="companion-face" cx="475" cy="431" rx="31" ry="38"/><path className="companion-hair" d="M445 432q-8-42 28-45 37 0 34 45-13-13-28-16-14 14-34 16z"/><path className="companion-eye" d="M462 433h3m22 0h3"/><path className="companion-smile" d="M469 448q6 5 12 0"/><path className="companion-arm" d="M496 493q24 17 48 20l34-3 3 17-39 6q-32 0-53-22z"/><path className="companion-hand" d="M575 508q13-4 15 6 1 9-12 12z"/></g><g className="tea-seated-heroine"><path className="tea-seated-leg" d="M715 589q-25 5-57 36l7 18h67q18 0 15-18zm-51 40h-22v61h22z"/><path className="tea-seated-shoe" d="M638 686h-43q-13 4-13 13h56z"/><path className="tea-seated-dress" d="M690 490q25-15 50 0l30 113h-108z"/><path className="tea-seated-neck" d="M705 467h18v30h-18z"/><path className="tea-seated-hair" d="M673 440q-5-52 41-53 45-1 43 53l-3 80h-79z"/><ellipse className="tea-seated-face" cx="714" cy="447" rx="33" ry="40"/><path className="tea-seated-fringe" d="M682 445q-3-47 31-47 38 0 37 47-14-8-24-23-11 18-44 23z"/><path className="tea-seated-eye" d="M701 449h3m20 0h3"/><path className="tea-seated-smile" d="M707 463q7 6 14 0"/><path className="tea-seated-arm" d="M694 501q-19 16-42 18l-32-5-3 17 39 8q31-3 51-21z"/><path className="tea-seated-hand" d="M621 513q-13-3-15 7 0 9 13 11z"/></g><path className="tea-table" d="M555 530h88v21h-88zm35 21h18v128h-18zm-43 128h105v14H547z"/><path className="tea-cup" d="M563 500h31v27q-15 8-31 0zm31 6q13 0 13 10t-13 9zm15-6h31v27q-15 8-31 0zm31 6q13 0 13 10t-13 9z"/><path className="steam" d="M575 494q-7-8 0-16m47 16q-7-8 0-16"/></>,
    result: <><circle className="result-halo" cx="604" cy="325" r="234"/><path className="result-rays" d="M604 39v70m0 431v82M311 325h72m438 0h72M395 116l50 50m320 320 51 51M813 116l-50 50M445 486l-50 51"/><path className="result-paper" d="M813 295h231v223H813z"/><text className="result-word" x="928" y="358" textAnchor="middle">RESULT</text><path className="paper-rule" d="M852 399h140m-140 31h104"/><path className="result-check" d="m876 470 38 35 84-90"/><path className="confetti" d="m173 201 24 31m133-121-19 27m406-32 15 32m352 57-25 22M219 406l34-8m827 98 30 17M342 529l-18 27M645 134l11-32"/></>,
  }
  return <svg className="scenery-art" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{common}{scenes[id]}</svg>
}

function Heroine({ scene }) {
  const holdsPaper = scene === 'thesis' || scene === 'result'
  const isTea = scene === 'tea'
  return <svg className="heroine-art" viewBox="0 0 210 330" aria-hidden="true">
    <ellipse className="heroine-shadow" cx="105" cy="318" rx="55" ry="8"/>
    <path className="heroine-back-hair" d="M62 72q-6-57 42-58 49-2 47 58l-3 88H63z"/>
    <path className="heroine-leg leg-left" d="M78 216h26l-4 88H79z"/>
    <path className="heroine-leg leg-right" d="M110 216h26l-1 88h-23z"/>
    <path className="heroine-shoe" d="M75 299h29v14H70q-4-10 5-14zm36 0h29q10 4 9 14h-38z"/>
    <path className="heroine-neck" d="M95 105h20v24H95z"/>
    {scene === 'campus' && <><path className="heroine-dress campus-dress" d="M76 123q29-20 58 0l24 105H52z"/><path className="heroine-dress-detail" d="M82 130q23 15 46 0m-23 15v68"/><path className="heroine-satchel-strap" d="M85 128q59 18 72 57"/><path className="heroine-satchel" d="M142 181h33v41h-33z"/><path className="heroine-satchel-flap" d="M144 183h29l-14 16z"/></>}
    {scene === 'office' && <><path className="heroine-shirt" d="M78 121q27-18 54 0l8 102H70z"/><path className="heroine-blazer" d="M76 121 57 137l-1 92h40l9-73zm58 0 19 16 1 92h-40l-9-73z"/><path className="heroine-blazer-lapel" d="m79 124 23 32-15-5-13 15m57-42-23 32 15-5 13 15"/></>}
    {scene === 'online' && <><path className="heroine-top casual-top" d="M76 122q29-19 58 0l12 99H65z"/><path className="heroine-top-detail" d="M80 140h50"/></>}
    {scene === 'thesis' && <><path className="heroine-top thesis-top" d="M75 123q30-19 60 0l13 103H62z"/><path className="heroine-top-detail" d="m86 126 19 18 19-18"/></>}
    {isTea && <><path className="heroine-dress tea-dress" d="M78 122q27-17 54 0l22 108H56z"/><path className="heroine-dress-detail" d="M83 129q22 12 44 0"/></>}
    {scene === 'result' && <><path className="heroine-kurta" d="M75 122q30-19 60 0l12 125H63z"/><path className="heroine-kurta-detail" d="m88 124 17 18 17-18m-17 18v47m-29 34h58"/></>}
    <ellipse className="heroine-face" cx="105" cy="75" rx="39" ry="47"/>
    <path className="heroine-fringe" d="M66 73q-3-54 39-55 46 0 44 55-18-6-29-25-12 20-54 25z"/>
    <path className="heroine-eye" d="M85 80h3m34 0h3"/>
    <path className="heroine-smile" d="M97 97q8 7 16 0"/>
    <path className="heroine-arm arm-left" d={isTea ? 'M76 130q-14 3-20 28l-9 23q-3 8 5 11l9 3q6 0 9-7l12-27 10-12z' : 'M76 131q-14 2-20 27l-10 28q-3 9 6 12l9 3q7 0 10-8l13-30 7-14z'}/>
    <path className="heroine-arm arm-right" d={isTea ? 'M134 130q17 0 20 18l6-41q1-8 9-7l5 2q7 3 5 12l-8 47q-2 12-12 12l-10-1q-8-3-10-11l-7-20z' : 'M134 131q15 1 21 24l9 28q3 9-6 12l-9 3q-7-1-10-9l-12-28-8-13z'}/>
    {holdsPaper && <><path className="heroine-paper" d="M74 181h65v43H74z"/><path className="heroine-paper-line" d="M84 193h43m-43 10h38m-38 10h30"/></>}
    {scene === 'online' && <><path className="heroine-phone" d="M140 176h25v40h-25z"/><path className="heroine-phone-line" d="M146 184h13m-13 7h13"/></>}
    {isTea && <><path className="heroine-cup" d="M116 93h35v25q-18 11-35 0zM151 98q16-3 16 9t-16 8z"/><path className="heroine-cup-steam" d="M136 88q-7-9 0-17"/></>}
    <path className="heroine-hand" d={isTea ? 'M45 182q-7 9 1 15 9 7 16-3zm116-81q8-5 13 2 4 7-2 14-5 5-13-2z' : 'M45 188q-5 9 4 14 9 5 14-5zm106-3q-4 9 5 14 9 4 12-5z'}/>
  </svg>
}

export default function VisualStory() {
  const [activeIndex, setActiveIndex] = useState(0)
  const stepsRef = useRef([])
  const active = storyScenes[activeIndex]

  useEffect(() => {
    const observer = new IntersectionObserver(() => {
      const center = window.innerHeight * .5
      const nearest = stepsRef.current
        .map((step, index) => ({ index, rect: step.getBoundingClientRect() }))
        .filter(({ rect }) => rect.top <= center && rect.bottom >= center)
      if (nearest.length) setActiveIndex(nearest[0].index)
    }, { rootMargin: '-43% 0px -43% 0px', threshold: 0 })
    stepsRef.current.forEach(step => { if (step) observer.observe(step) })
    return () => observer.disconnect()
  }, [])

  return <section className="visual-story" aria-label="The route she made">
    <div className={`story-world world-${active.id}`} role="img" aria-label={active.sceneLabel}>
      {storyScenes.map(scene => <div key={scene.id} className={`world-scene world-scene-${scene.id}${active.id === scene.id ? ' is-active' : ''}`}><Scenery id={scene.id}/></div>)}
      <div className="world-grain" aria-hidden="true"/>
      {active.id !== 'tea' && <div className={`heroine-position heroine-${active.id}`}><Heroine scene={active.id}/></div>}
    </div>
    <div className="story-flow">
      {storyScenes.map((scene, index) => <article key={scene.id} className={`story-beat beat-${scene.id}${index === activeIndex ? ' is-active' : ''}`} data-index={index} ref={node => { stepsRef.current[index] = node }} aria-labelledby={index === 0 ? 'hero-title' : `beat-${scene.id}-title`}>
        <div className="beat-copy page-shell">
          {index === 0 && <header className="story-opening">
            <p className="story-kicker">{storyIntro.kickerEn} <span lang="ne">· {storyIntro.kickerNe}</span></p>
            <h1 id="hero-title" tabIndex="-1">मेसी, <em>{storyIntro.titleEn}</em><span lang="ne">{storyIntro.titleNe}</span></h1>
            <p className="story-lead">{storyIntro.leadEn} <span lang="ne">{storyIntro.leadNe}</span></p>
          </header>}
          <div className="beat-text">
            <p className="beat-eyebrow">{scene.eyebrowEn} <span lang="ne">· {scene.eyebrowNe}</span></p>
            <h2 id={index === 0 ? undefined : `beat-${scene.id}-title`}>{scene.titleEn}<span lang="ne">{scene.titleNe}</span></h2>
            <p className="beat-body">{scene.bodyEn}</p>
            <p className="beat-body beat-ne" lang="ne">{scene.bodyNe}</p>
            <p className="beat-note">{scene.noteEn}<span lang="ne">{scene.noteNe}</span></p>
          </div>
          {index === 0 && <p className="scroll-cue" aria-hidden="true">↓ {storyIntro.scrollEn} <span lang="ne">· {storyIntro.scrollNe}</span></p>}
        </div>
      </article>)}
    </div>
  </section>
}
