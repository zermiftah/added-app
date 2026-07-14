import { useState } from "react"
import { useNavigate } from "react-router-dom"

const C = {
  cream: "#FBFBFD", creamSoft: "#F5F5F7", creamWarm: "#F0EFEA",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
  stone: "#6B6863", stoneLight: "#A6A39E",
  border: "rgba(14,14,14,0.10)",
  maroon: "#681818", maroonDeep: "#4A1010", maroon600: "#7E2424",
  accent: "#C8354B", accentDeep: "#9E2538",
  gold: "#D4B669", goldDeep: "#B0893E",
}
const serifFont = "'Fraunces',serif"
const sansFont  = "'Inter',sans-serif"
const monoFont  = "'JetBrains Mono',monospace"

// ── Archetypes ──
const ARCHETYPES = {
  builder: {
    label: "The Builder", tagline: "You make ideas real.", icon: "🔨",
    blurb: "You learn by making things break, then work. A built, working, testable thing does more for a file than any description of interest ever could - admissions officers can see the hours in it.",
    move: "Ship one real, functional project this year - and document the failures, not just the win.",
  },
  researcher: {
    label: "The Researcher", tagline: "You chase the question everyone else drops.", icon: "🔬",
    blurb: "You'd rather find out for yourself than take someone's word. That instinct is the raw material of independent research - the single strongest signal a selective reader looks for beyond your grades.",
    move: "Turn one question you can't stop thinking about into a structured research project with a mentor or teacher.",
  },
  creator: {
    label: "The Creator", tagline: "You make what doesn't exist yet.", icon: "🎨",
    blurb: "You build things because the version in your head isn't out there. A body of original work - not a hobby list - is exactly what separates a genuine creative spike from another activity line.",
    move: "Build a portfolio around one clear throughline instead of a scattered set of one-offs.",
  },
  changemaker: {
    label: "The Changemaker", tagline: "You move people toward what's missing.", icon: "📣",
    blurb: "You notice the gap and pull people together to close it. Selective admissions reads leadership as follow-through and measurable impact - not titles, not membership.",
    move: "Attach a number to your impact - people reached, funds raised, outcomes changed.",
  },
  founder: {
    label: "The Founder", tagline: "You'd rather build it than wait for it.", icon: "🚀",
    blurb: "You pitch the idea instead of waiting for permission. This is the instinct behind the ventures, competitions, and initiatives an admissions officer physically cannot ignore.",
    move: "Take the idea past a school club - pitch it, monetize it, or enter it in a real competition.",
  },
  specialist: {
    label: "The Specialist", tagline: "You go deep where others go wide.", icon: "🎯",
    blurb: "You climb instead of dabbling. Depth read consistently over years - an olympiad ladder, a research track, a competitive ranking - is one of the clearest spike signals a file can carry.",
    move: "Commit to one ladder (olympiad, certification, ranked competition) and climb it visibly, year over year.",
  },
}

const SPIKE_ITEMS = [
  { a: "builder", text: "Take something apart just to see how it really works" },
  { a: "researcher", text: "Fall down a rabbit hole reading about one topic for hours" },
  { a: "creator", text: "Write a story, film, or track that no one asked you for" },
  { a: "changemaker", text: "Run a group project so everyone actually pulls their weight" },
  { a: "founder", text: "Pitch an idea to someone who could shut it down" },
  { a: "specialist", text: "Drill the same skill daily until it's second nature" },
  { a: "builder", text: "Build or code something from scratch, even if it's messy" },
  { a: "researcher", text: "Design an experiment just to test a hunch" },
  { a: "creator", text: "Lose hours perfecting one photo, essay, or drawing" },
  { a: "changemaker", text: "Start a club or campaign because something was missing" },
  { a: "founder", text: "Turn a hobby into something that actually makes money" },
  { a: "specialist", text: "Pick going deep on one subject over dabbling in ten" },
]
const SPIKE_OPTIONS = ["Not me", "Sometimes", "That's me"]

const FOUNDATION_ITEMS = [
  { text: "What grade or year are you in?", key: "grade", options: ["Grade 9 or below", "Grade 10", "Grade 11", "Grade 12"] },
  { text: "Where do your grades sit right now?", key: "grades", options: ["Top band (A*/A, 90%+ or equivalent)", "Strong (A/B, 80–89%)", "Mixed (B/C, below 80%)", "Not available yet"], score: [2, 1, 0, 0] },
  { text: "How's standardized testing going?", key: "testing", options: ["Haven't started", "Prepping now", "Taken it once", "Done - happy with the score"], score: [0, 1, 1.5, 2] },
  { text: "Where are you aiming?", key: "destination", options: ["United States", "United Kingdom", "Other / still deciding"] },
]

const TOTAL_SPIKE = 12
const TOTAL = 16

// ── Pixel emblems (12x12 grid, letter-coded to brand palette) ──
const PAL = { M: C.maroon, D: C.maroonDeep, R: C.accent, r: C.accentDeep, G: C.gold, g: C.goldDeep, C: C.cream, W: "#FFFFFF", K: C.ink }
const EMBLEMS = {
  builder: [
    "............", "...GGGGGG...", "..GGGGGGGG..", "..GGGGGGGG..", "...gggggg...",
    ".....MM.....", ".....MM.....", ".....MM.....", ".....MM.....", ".....MM.....",
    "....DDDD....", "............",
  ],
  researcher: [
    "..MMMM......", ".M.GG.M.....", "M.GGGG.M....", "M.GGGG.M....", "M.GGGG.M....",
    ".M.GG.M.....", "..MMM.M.....", "......MM....", ".......MM...", "........MM..",
    ".........DD.", "............",
  ],
  creator: [
    "..........GG", ".........GG.", "........GG..", ".......GG...", "......gg....",
    ".....MM.....", "....MM......", "...RR.......", "..RRR.......", ".RRR........",
    ".rr.........", "............",
  ],
  changemaker: [
    "...M........", "...MRRRRR...", "...MRRRRRR..", "...MRRRRR...", "...MRRR.....",
    "...M........", "...M........", "...M........", "...M........", "...M........",
    "..DDDDD.....", "............",
  ],
  founder: [
    ".....GG.....", "....GGGG....", "....MWWM....", "....MWWM....", "....MRRM....",
    "....MRRM....", "...MMRRMM...", "..M..RR..M..", ".....RR.....", "....RRRR....",
    ".....RR.....", "............",
  ],
  specialist: [
    ".GGGGGGGGG..", ".G.GGGGG.G..", ".G.GGGGG.G..", ".GGGGGGGG...", "..GGGGGG....",
    "...GGGG.....", "....GG......", "....GG......", "...GGGG.....", "..DDDDDD....",
    "..DDDDDD....", "............",
  ],
}
function PixelEmblem({ archetypeKey, size }) {
  const map = EMBLEMS[archetypeKey]
  if (!map) return null
  const rows = map.length, cols = map[0].length
  const cells = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const ch = map[y][x]
      const fill = PAL[ch]
      if (fill) cells.push(<rect key={`${y}_${x}`} x={x} y={y} width={1.03} height={1.03} fill={fill} />)
    }
  }
  return (
    <svg viewBox={`0 0 ${cols} ${rows}`} width={size} height={size}
      style={{ display: "block", shapeRendering: "crispEdges", filter: "drop-shadow(0 2px 0 rgba(74,16,16,0.45))" }}>
      {cells}
    </svg>
  )
}

const EMPTY_SCORES = { builder: 0, researcher: 0, creator: 0, changemaker: 0, founder: 0, specialist: 0 }

export default function DiagnosticTestPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(-1) // -1 = intro, 0..11 = spike, 12 = transition, 13..16 = foundation, 17+ = result
  const [selected, setSelected] = useState(null)
  const [scores, setScores] = useState(EMPTY_SCORES)
  const [foundationScore, setFoundationScore] = useState(0)
  const [foundationAnswers, setFoundationAnswers] = useState({})
  const [saved, setSaved] = useState(false)

  const isIntro = step === -1
  const isTransition = step === TOTAL_SPIKE
  const isSpike = step >= 0 && step < TOTAL_SPIKE
  const isFoundation = step > TOTAL_SPIKE && step < TOTAL + 1
  const isResult = step >= TOTAL + 1
  const isQuestion = isSpike || isFoundation

  const start = () => setStep(0)
  const continueQuiz = () => setStep((s) => s + 1)
  const retake = () => {
    setStep(-1); setSelected(null); setScores(EMPTY_SCORES); setFoundationScore(0); setFoundationAnswers({}); setSaved(false)
    try { sessionStorage.removeItem("ae_diagnostic_pending") } catch { /* noop */ }
  }
  const turnIntoPlan = () => navigate("/contact-us")

  const foundationStage = (f) => (f >= 3 ? "Strong" : f >= 1.5 ? "Developing" : "Emerging")

  // Doesn't hit the backend at all — the diagnostic result only gets saved
  // once the person actually submits the /contact-us form (one sequence,
  // one row, identity comes from that form). This just computes the
  // result and stashes it so /contact-us can pick it up after navigation.
  const stashResult = (finalScores, fAnswers, fScore) => {
    const sorted = Object.entries(finalScores).sort((a, b) => b[1] - a[1])
    const [pKey, pScore] = sorted[0]
    const [sKey, sScore] = sorted[1]
    const hasSecondary = pScore - sScore <= 1 && sScore > 0
    const payload = {
      spike_scores: finalScores,
      primary_archetype: pKey,
      secondary_archetype: hasSecondary ? sKey : null,
      is_hybrid: hasSecondary,
      foundation_grade: fAnswers.grade || null,
      foundation_grades: fAnswers.grades || null,
      foundation_testing: fAnswers.testing || null,
      foundation_destination: fAnswers.destination || null,
      foundation_score: fScore,
      foundation_stage: foundationStage(fScore),
    }
    try { sessionStorage.setItem("ae_diagnostic_pending", JSON.stringify(payload)) } catch { /* storage unavailable — non-fatal */ }
    setSaved(true)
  }

  const answer = (idx) => {
    setSelected(idx)
    let nextScores = scores
    let nextAnswers = foundationAnswers
    let nextFScore = foundationScore

    if (step < TOTAL_SPIKE) {
      const item = SPIKE_ITEMS[step]
      nextScores = { ...scores, [item.a]: scores[item.a] + idx }
      setScores(nextScores)
    } else {
      const fIndex = step - 13
      const item = FOUNDATION_ITEMS[fIndex]
      const ans = item.options[idx]
      nextAnswers = { ...foundationAnswers, [item.key]: ans }
      setFoundationAnswers(nextAnswers)
      if (item.score) {
        nextFScore = foundationScore + item.score[idx]
        setFoundationScore(nextFScore)
      }
    }

    setTimeout(() => {
      const nextStep = step + 1
      setStep(nextStep)
      setSelected(null)
      if (nextStep >= TOTAL + 1 && !saved) stashResult(nextScores, nextAnswers, nextFScore)
    }, 210)
  }

  // ── Derived question view state ──
  let counterText = "", progressPct = 0, questionText = "", options = []
  if (isSpike) {
    counterText = `${step + 1} of ${TOTAL}`
    progressPct = (step / TOTAL) * 100
    questionText = SPIKE_ITEMS[step].text
    options = SPIKE_OPTIONS
  } else if (isFoundation) {
    const fIndex = step - 13
    const item = FOUNDATION_ITEMS[fIndex]
    counterText = `${TOTAL_SPIKE + fIndex + 1} of ${TOTAL}`
    progressPct = ((TOTAL_SPIKE + fIndex) / TOTAL) * 100
    questionText = item.text
    options = item.options
  }

  // ── Derived result view state ──
  let titleText = "", tagline = "", foundationLine = "", blurbs = [], moves = [], primaryKey = "", secondaryKey = "", hasSecondary = false
  if (isResult) {
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
    ;[primaryKey] = sorted[0]
    ;[secondaryKey] = sorted[1]
    const pScore = sorted[0][1], sScore = sorted[1][1]
    hasSecondary = pScore - sScore <= 1 && sScore > 0
    const primary = ARCHETYPES[primaryKey]
    const secondary = ARCHETYPES[secondaryKey]
    titleText = hasSecondary ? `${primary.label.replace("The ", "")} × ${secondary.label.replace("The ", "")}` : primary.label
    tagline = primary.tagline
    const stage = foundationStage(foundationScore)
    foundationLine = `${foundationAnswers.grade || ""} · ${stage} foundation · aiming ${foundationAnswers.destination || "-"}`
    blurbs = hasSecondary ? [primary.blurb, secondary.blurb] : [primary.blurb]
    moves = hasSecondary ? [primary.move, secondary.move] : [primary.move]
  }

  const tabLabel = isResult ? "File assessed" : "Applicant file"
  const optBase = {
    textAlign: "left", background: C.cream, border: `1px solid ${C.border}`,
    borderRadius: 10, padding: "14px 18px", fontSize: 16, fontFamily: sansFont,
    fontWeight: 400, color: C.ink, cursor: "pointer", width: "100%",
    transition: "border-color 0.15s, background 0.15s, transform 0.1s",
  }
  const optSelected = { ...optBase, borderColor: C.accent, background: "#fff" }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px", background: C.cream, fontFamily: sansFont }}>
      <style>{`
        @keyframes ae-fade-up { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }
        @keyframes ae-stamp { 0% { opacity:0; transform:scale(1.7) rotate(-10deg); } 55% { opacity:1; transform:scale(0.94) rotate(2deg); } 75% { transform:scale(1.04) rotate(-1deg); } 100% { opacity:1; transform:scale(1) rotate(-2deg); } }
        @keyframes ae-pop { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        .ae-opt:hover { border-color: ${C.accent} !important; background: #fff !important; }
      `}</style>

      <div style={{ width: "100%", maxWidth: 560, position: "relative" }}>
        {/* file tab */}
        <div style={{
          position: "absolute", top: -17, right: 30, zIndex: 0, background: C.creamWarm,
          border: `1px solid ${C.border}`, borderBottom: "none", borderRadius: "8px 8px 0 0",
          padding: "5px 16px 12px", fontFamily: monoFont, fontSize: 10, fontWeight: 500,
          letterSpacing: "0.16em", textTransform: "uppercase", whiteSpace: "nowrap", color: C.stone,
        }}>
          {tabLabel}
        </div>

        <div style={{ position: "relative", zIndex: 1, background: "#fff", border: `1px solid ${C.border}`, borderRadius: "4px 14px 14px 14px", boxShadow: "0 8px 30px rgba(14,14,14,0.08)", padding: "40px 36px 34px" }}>
          <div key={isResult ? "result" : `s${step}`} style={{ animation: "ae-fade-up 0.34s cubic-bezier(.25,.46,.45,.94) both" }}>

            {isIntro && (
              <div>
                <p style={{ fontFamily: monoFont, fontSize: 11, fontWeight: 500, letterSpacing: "0.16em", textTransform: "uppercase", color: C.stone, margin: "0 0 14px" }}>
                  Admissions readiness · 2 minutes · no typing
                </p>
                <h1 style={{ fontFamily: serifFont, fontWeight: 400, fontSize: "clamp(26px,4vw,32px)", lineHeight: 1.2, letterSpacing: "-0.01em", color: C.ink, margin: "0 0 14px" }}>
                  Every application tells a story. <em style={{ fontStyle: "italic", color: C.maroon }}>What does yours say?</em>
                </h1>
                <p style={{ fontSize: 15.5, lineHeight: 1.65, color: C.stone, margin: "0 0 26px" }}>
                  Sixteen fast taps decode the <b style={{ color: C.ink, fontWeight: 600 }}>spike</b> hidden in your profile - the one signal top-20 admissions officers actually read for. You'll walk away knowing your type and the single move that would sharpen it.
                </p>
                <button onClick={start} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.maroon, color: "#fff", border: "none", borderRadius: 10, padding: "15px 28px", fontFamily: sansFont, fontSize: 15, fontWeight: 600, letterSpacing: "0.01em", cursor: "pointer", boxShadow: "0 2px 8px rgba(104,24,24,0.25)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.maroon600}
                  onMouseLeave={(e) => e.currentTarget.style.background = C.maroon}>
                  Reveal my profile →
                </button>
              </div>
            )}

            {isQuestion && (
              <div>
                <div style={{ fontFamily: monoFont, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: C.stoneLight, textAlign: "right", marginBottom: 10 }}>{counterText}</div>
                <div style={{ height: 3, background: C.border, borderRadius: 2, marginBottom: 28, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: C.maroon, borderRadius: 2, transition: "width 0.3s", width: `${progressPct}%` }} />
                </div>
                <p style={{ fontFamily: serifFont, fontWeight: 400, fontSize: 27, lineHeight: 1.28, letterSpacing: "-0.01em", color: C.ink, margin: "0 0 26px" }}>{questionText}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {options.map((label, idx) => (
                    <button key={label} className="ae-opt" onClick={() => answer(idx)} style={selected === idx ? optSelected : optBase}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isTransition && (
              <div style={{ textAlign: "center", padding: "44px 20px 40px" }}>
                <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.maroon, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontFamily: serifFont, fontSize: 22 }}>✓</div>
                <h2 style={{ fontFamily: serifFont, fontWeight: 400, fontSize: 26, color: C.ink, margin: "0 0 10px" }}>Spike locked in.</h2>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: C.stone, margin: "0 auto 26px", maxWidth: 360 }}>Now the fundamentals - grade, results, targets. Four quick taps and your file is complete.</p>
                <button onClick={continueQuiz} style={{ display: "inline-flex", alignItems: "center", gap: 10, background: C.maroon, color: "#fff", border: "none", borderRadius: 10, padding: "14px 26px", fontFamily: sansFont, fontSize: 15, fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(104,24,24,0.25)" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = C.maroon600}
                  onMouseLeave={(e) => e.currentTarget.style.background = C.maroon}>
                  Continue →
                </button>
              </div>
            )}

            {isResult && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <span style={{ display: "inline-block", fontFamily: monoFont, fontSize: 10, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: C.maroon, border: `1px solid ${C.maroon}`, borderRadius: 4, padding: "5px 11px", whiteSpace: "nowrap", transform: "rotate(-2deg)" }}>
                    Profile unlocked
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 22px" }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 132, height: 132, borderRadius: 18, background: `linear-gradient(160deg, ${C.maroon600}, ${C.maroonDeep})`, border: `1px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px -10px rgba(74,16,16,0.55)", animation: "ae-stamp 0.55s cubic-bezier(.34,1.56,.64,1) both" }}>
                      <PixelEmblem archetypeKey={primaryKey} size={92} />
                    </div>
                    <div style={{ position: "absolute", left: -10, top: -10, width: 34, height: 34, borderRadius: "50%", background: C.cream, border: `2px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, boxShadow: "0 4px 10px rgba(0,0,0,0.2)", animation: "ae-pop 0.5s ease 0.1s both" }}>
                      {ARCHETYPES[primaryKey]?.icon}
                    </div>
                    {hasSecondary && (
                      <div style={{ position: "absolute", right: -14, bottom: -14, width: 60, height: 60, borderRadius: 12, background: `linear-gradient(160deg, ${C.maroon600}, ${C.maroonDeep})`, border: `1px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(0,0,0,0.25)", animation: "ae-stamp 0.55s cubic-bezier(.34,1.56,.64,1) 0.14s both" }}>
                        <PixelEmblem archetypeKey={secondaryKey} size={42} />
                      </div>
                    )}
                  </div>
                </div>

                <h1 style={{ fontFamily: serifFont, fontWeight: 400, fontSize: 34, lineHeight: 1.12, letterSpacing: "-0.02em", color: C.maroonDeep, textAlign: "center", margin: "0 0 8px", animation: "ae-pop 0.5s ease 0.2s both" }}>
                  <span style={{ marginRight: 8 }}>{ARCHETYPES[primaryKey]?.icon}</span>{titleText}{hasSecondary && <span style={{ marginLeft: 8 }}>{ARCHETYPES[secondaryKey]?.icon}</span>}
                </h1>
                <p style={{ fontFamily: serifFont, fontStyle: "italic", fontSize: 18, color: C.accent, textAlign: "center", margin: "0 0 22px", animation: "ae-pop 0.5s ease 0.28s both" }}>{tagline}</p>

                <div style={{ fontFamily: monoFont, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: C.stone, textAlign: "center", margin: "0 0 22px" }}>{foundationLine}</div>

                {blurbs.map((para, i) => (
                  <p key={i} style={{ fontSize: 15.5, lineHeight: 1.6, color: C.ink, margin: "0 0 16px" }}>{para}</p>
                ))}

                <div style={{ background: C.creamSoft, border: `1px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", margin: "6px 0 26px" }}>
                  <h3 style={{ fontFamily: monoFont, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", color: C.maroon, margin: "0 0 12px", fontWeight: 500 }}>Your next power move</h3>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, lineHeight: 1.6, color: C.ink }}>
                    {moves.map((mv, i) => <li key={i} style={{ marginBottom: 6 }}>{mv}</li>)}
                  </ul>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button onClick={turnIntoPlan}
                    style={{ display: "inline-flex", alignItems: "center", gap: 9, background: C.maroon, color: "#fff", border: "none", borderRadius: 10, padding: "14px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: sansFont, boxShadow: "0 2px 8px rgba(104,24,24,0.25)" }}>
                    Turn this into a plan →
                  </button>
                  <button onClick={retake} style={{ display: "inline-flex", alignItems: "center", background: "transparent", color: C.maroon, border: `1px solid ${C.maroon}`, borderRadius: 10, padding: "14px 22px", fontFamily: sansFont, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
                    Retake
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
