import { useState, useEffect, useRef } from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const C = {
  cream: "#FBFBFD", creamSoft: "#F5F5F7", creamWarm: "#F0EFEA",
  ink: "#0E0E0E", inkSoft: "#1A1A1A",
  stone: "#6B6863", stoneLight: "#A6A39E",
  maroon: "#6B1818", maroonSoft: "#7E2424", accentDeep: "#9E2538",
  accent: "#C8354B", accentRose: "#E8B4BD",
  border: "rgba(0,0,0,0.06)", borderLight: "rgba(255,255,255,0.08)",
}

const WEBINARS = [
  {
    id: "uk", region: "United Kingdom", flag: "🇬🇧",
    title: "The founder of AddedEducation",
    subtitle: "is coming to London.",
    description: "Only a few families will sit down with the person who built the company that has helped over 3,000 students get into the world's best universities. Akshay Maliwal is meeting families in person for a short visit to London.",
    date: "20 – 27 June 2026", time: "In Person · London", audience: "Years 9–13",
    link: "/uk-meet-the-founder",
    learns: [
      "An honest read on your child's profile against what top UK and US universities actually look for in 2026.",
      "Whether to build for Oxbridge, the Ivy League, or both, and exactly what each path asks for.",
      "How to develop a genuine academic angle the next high-scorer from the same school can't replicate.",
      "The decisions that matter most between Year 9 and Year 13, and where to start right now.",
    ],
  },
  {
    id: "india", region: "India", flag: "🇮🇳",
    title: "Does your curriculum open the right doors,",
    subtitle: "or quietly close them?",
    description: "ISC, CBSE, IB, A-Levels — top universities don't treat them equally. Most Indian families don't realise their curriculum is already being weighed before a single essay is read.",
    date: "June 27, 2026", time: "4:00 PM IST", audience: "Classes 8–11",
    link: "/india-does-your-curriculum-open-doors",
    learns: [
      "How each curriculum is actually read — ISC, CBSE, IB, and A-Levels — and what it signals before an admissions officer reads a word of the application.",
      "Whether your curriculum is working for or against your child, and what to do if you're mid-curriculum and can't switch.",
      "Live Q&A with Ankan, Shreya, and Tushar — your questions, your child's specific curriculum, answered directly.",
    ],
  },
  {
    id: "hongkong", region: "Hong Kong", flag: "🇭🇰",
    title: "Your child's school is shaping their University results",
    subtitle: "right now.",
    description: "Admissions officers at Harvard, Yale, and Oxford read every Hong Kong application through the lens of the school it comes from. This webinar shows you what that means for your child — and what to do about it.",
    date: "June 28, 2026", time: "7:00 PM HKT", audience: "Years 9–12 & parents",
    link: "/hong-kong-school-university-admissions",
    learns: [
      "How your school is read by admissions officers — why a 7 from one school is not the same as a 7 from another, and how to use that to your advantage.",
      "What you can do about it — the profile decisions that rise above school context, where to start, and when.",
      "Case studies and live Q&A with Ryan and William — real Hong Kong students, real outcomes.",
      "The specific steps families in Years 9–12 should take now to strengthen their child's position.",
    ],
  },
  {
    id: "singapore", region: "Singapore", flag: "🇸🇬",
    title: "How to stand out to top universities",
    subtitle: "as a Singaporean in 2026.",
    description: "Most Singaporean students applying to top US and UK universities have the same profile. Strong IB scores, consistent co-curriculars, polished recommendations — every file says the same thing. Learn how to build an authentic profile that stands out.",
    date: "June 24, 2026", time: "7:00 PM SGT", audience: "Grades 9–11 + Parents",
    link: "/singapore-legacy-admissions",
    learns: [
      "How Harvard, Yale, and Oxford read Singapore applications in context — what that means for your child's profile, and why strong grades alone are not enough.",
      "From Grade 8 through Grade 11: the specific moves that build a genuine application spike, and the order in which they need to happen.",
      "The activities, subject choices, and profile decisions that look strong on paper but actually cost your application.",
      "Live Q&A with Ria and Aldy — your questions, answered directly by a former UChicago admissions reader.",
    ],
  },
]

const HOSTS = [
  { name: "Akshay Maliwal",  role: "Founder & CEO",              webinar: "UK",        initials: "AM", photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/hosts/akshay.jpg",   bio: "A former top-25 ranked junior golfer in Asia, Akshay earned a full athletic scholarship to UC Berkeley before working in investment banking. He left finance to build a consultancy for families who take this decision seriously, and has since guided thousands of students into the most competitive universities in the world." },
  { name: "Tushar Liberhan", role: "India Head · NYU Graduate",  webinar: "India",     initials: "TL", photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/hosts/tushar.jpg",  bio: "A former top-25 ranked junior tennis player and India Grand Slam representative, Tushar holds a Master's from New York University. He has counselled hundreds of students and athletes across Asia and brings a uniquely grounded perspective to the admissions process." },
  { name: "Shreya Kabir",    role: "Senior Lead Counsellor",     webinar: "India",     initials: "SK", photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/hosts/shreya.jpg",  bio: "Shreya is an accomplished international admissions consultant with a track record of guiding students to Stanford, Northwestern, and Oxbridge, across both academic and athletic profiles. She draws on a holistic background in commerce, philosophy, and psychology." },
  { name: "Ankan Barman",    role: "Lead Counsellor",            webinar: "India",     initials: "AB", photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/hosts/ankan.jpg",   bio: "Ankan has over three years of experience as an academic counsellor, supporting students in gaining admission to Stanford, Cornell, UPenn, Carnegie Mellon, NYU, Georgia Tech, Purdue, and UIUC. His background in Economics and Development Studies gives him a rigorous analytical edge." },
  { name: "Ryan Leung",      role: "Senior Principal Consultant",webinar: "Hong Kong", initials: "RL", photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/hosts/ryan.jpg",    bio: "Ryan began his career as an admissions representative at Fay School in Massachusetts. Over the past decade he has placed students into Harvard, Yale, Stanford, Duke, and top boarding schools including Andover and Exeter. Grew up in Hong Kong and Los Angeles; fluent in English, Cantonese, and Mandarin." },
  { name: "William Ho",      role: "Client Relationship Manager",webinar: "Hong Kong", initials: "WH", photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/hosts/william.jpg", bio: "A McGill University graduate and IB diploma holder, William has spent 13 years at the intersection of families, schools, and institutions in Hong Kong. He specialises in helping families understand the difference between local and international curricula — and bridge the gap." },
  { name: "Ria Birowo",      role: "Senior Lead Counsellor",     webinar: "Singapore", initials: "RB", photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/hosts/ria.jpg",    bio: "A University of Chicago graduate who grew up in the US, Ria combines firsthand knowledge of the American education system with over a decade of experience in international admissions. As a former admissions reader at UChicago, she has seen how these decisions get made from the inside." },
  { name: "Aldy Ichwan",     role: "Relationship Manager",       webinar: "Singapore", initials: "AI", photo: "https://addededucation-assets.s3.us-east-1.amazonaws.com/hosts/aldy.jpg",   bio: "A Universitas Indonesia engineering graduate and active member of AE's research team, Aldy works closely with families across Southeast Asia. With a background as a student-athlete, he brings a grounded, strategic perspective to helping students aim higher." },
]

/* ── Reveal ── */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVis(true), delay); obs.unobserve(el) }
    }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [delay])
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
      {children}
    </div>
  )
}

function Label({ children, light = false }) {
  return (
    <div style={{
      display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
      fontWeight: 600, color: light ? C.accentRose : C.ink, textTransform: "uppercase",
      letterSpacing: 2.5, background: light ? "rgba(255,255,255,0.08)" : C.creamWarm,
      border: `1px solid ${light ? "rgba(255,255,255,0.12)" : C.border}`,
      borderRadius: 6, padding: "6px 14px", marginBottom: 20,
    }}>{children}</div>
  )
}

/* ── Hero Card ── */
function HeroCard({ w }) {
  const [hov, setHov] = useState(false)
  const gradients = {
    uk: "linear-gradient(150deg, #1c2e4a 0%, #2d1a1a 100%)",
    india: "linear-gradient(150deg, #7E2424 0%, #1A1A1A 100%)",
    hongkong: "linear-gradient(150deg, #1a2e1a 0%, #1A1A1A 100%)",
    singapore: "linear-gradient(150deg, #1a2442 0%, #2d1a2d 100%)",
  }
  return (
    <a href={w.link} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "block", textDecoration: "none", borderRadius: 14, overflow: "hidden",
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"}`,
        transition: "all 0.4s cubic-bezier(.16,1,.3,1)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? "0 20px 48px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ aspectRatio: "16/10", overflow: "hidden", position: "relative" }}>
        <div style={{ width: "100%", height: "100%", background: gradients[w.id], display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 44, marginBottom: 6, opacity: 0.7 }}>{w.flag}</span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, color: "rgba(255,255,255,0.5)" }}>{w.region}</span>
        </div>
        <div style={{ position: "absolute", bottom: 10, left: 10, background: "rgba(14,14,14,0.72)", backdropFilter: "blur(10px)", borderRadius: 7, padding: "5px 10px", fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: "#fff" }}>
          {w.date} · {w.time}
        </div>
      </div>
      <div style={{ padding: "18px 20px 22px" }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, color: C.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
          {w.region} · {w.audience} · Free
        </div>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 500, color: "#fff", lineHeight: 1.3 }}>{w.title}</div>
        <div style={{ fontFamily: "'Fraunces',serif", fontSize: 17, fontWeight: 400, color: C.accentRose, fontStyle: "italic", lineHeight: 1.3, marginBottom: 12 }}>{w.subtitle}</div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.stoneLight, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {w.description}
        </p>
        <div style={{ marginTop: 16, fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: hov ? 10 : 6, transition: "gap 0.3s" }}>
          Register Free <span>→</span>
        </div>
      </div>
    </a>
  )
}

/* ── Host Card ── */
function HostCard({ h }) {
  const [hov, setHov] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ transition: "transform 0.5s cubic-bezier(.16,1,.3,1)", transform: hov ? "translateY(-4px)" : "translateY(0)" }}
    >
      <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: 14, overflow: "hidden", marginBottom: 18, position: "relative", background: `linear-gradient(145deg, ${C.maroon} 0%, ${C.accentDeep} 50%, ${C.maroonSoft} 100%)`, boxShadow: hov ? "0 20px 44px rgba(107,24,24,0.18)" : "0 6px 20px rgba(107,24,24,0.08)", transition: "box-shadow 0.5s cubic-bezier(.16,1,.3,1)" }}>
        {imgOk
          ? <img src={h.photo} alt={h.name} onError={() => setImgOk(false)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", transition: "transform 0.5s cubic-bezier(.16,1,.3,1)", transform: hov ? "scale(1.03)" : "scale(1)" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 44, color: "rgba(255,255,255,0.15)" }}>{h.initials}</span>
            </div>
        }
        <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(255,255,255,0.14)", backdropFilter: "blur(12px)", borderRadius: 7, padding: "4px 10px", fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, fontWeight: 600, color: "#fff", textTransform: "uppercase", letterSpacing: 0.8 }}>
          {h.webinar}
        </div>
      </div>
      <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 500, color: C.ink, marginBottom: 4 }}>{h.name}</div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: C.accent, marginBottom: 2 }}>{h.role}</div>
      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11.5, color: C.stoneLight, marginBottom: 8 }}>AddedEducation</div>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.stone, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{h.bio}</p>
    </div>
  )
}

/* ── Nav Btn ── */
function NavBtn({ onClick, disabled, dir }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={disabled ? undefined : onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width: 42, height: 42, borderRadius: "50%", border: `1.5px solid ${disabled ? C.stoneLight : C.ink}`, background: disabled ? "transparent" : hov ? C.ink : "transparent", cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: disabled ? C.stoneLight : hov ? "#fff" : C.ink, transition: "all 0.25s ease", opacity: disabled ? 0.35 : 1 }}>
      {dir === "prev" ? "←" : "→"}
    </button>
  )
}

/* ── Host Section ── */
function HostSection() {
  const [page, setPage] = useState(0)
  const [perPage, setPerPage] = useState(3)
  useEffect(() => {
    const update = () => setPerPage(window.innerWidth < 520 ? 1 : window.innerWidth < 900 ? 2 : 3)
    update(); window.addEventListener("resize", update); return () => window.removeEventListener("resize", update)
  }, [])
  const total = Math.ceil(HOSTS.length / perPage)
  useEffect(() => { if (page >= total) setPage(Math.max(0, total - 1)) }, [perPage, total, page])
  const visible = HOSTS.slice(page * perPage, page * perPage + perPage)

  return (
    <section style={{ padding: "88px 0 80px", background: C.creamSoft }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 16 }}>
            <div>
              <Label>Your Hosts</Label>
              <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,3.8vw,40px)", fontWeight: 400, color: C.ink, lineHeight: 1.15 }}>
                People who've been <em style={{ fontStyle: "italic", color: C.maroon }}>in the room.</em>
              </h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: C.stoneLight }}>
                {String(page + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <NavBtn onClick={() => setPage(p => p - 1)} disabled={page === 0} dir="prev" />
                <NavBtn onClick={() => setPage(p => p + 1)} disabled={page === total - 1} dir="next" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Progress bar */}
        <div style={{ width: "100%", height: 2, background: "rgba(0,0,0,0.06)", borderRadius: 1, marginBottom: 36 }}>
          <div style={{ height: "100%", borderRadius: 1, background: C.accent, width: `${((page + 1) / total) * 100}%`, transition: "width 0.5s cubic-bezier(.16,1,.3,1)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${perPage}, 1fr)`, gap: 32 }}>
          {visible.map((h, i) => <HostCard key={`${page}-${i}`} h={h} />)}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 36 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} onClick={() => setPage(i)} style={{ width: i === page ? 24 : 8, height: 8, borderRadius: 4, background: i === page ? C.accent : "rgba(0,0,0,0.1)", cursor: "pointer", transition: "all 0.35s cubic-bezier(.16,1,.3,1)" }} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══ MAIN ══ */
export default function EventsPage() {
  const [learnIdx, setLearnIdx] = useState(0)

  return (
    <div style={{ background: C.cream, overflowX: "hidden" }}>
      <Navbar />

      {/* ── 1. HERO ── */}
      <section style={{ background: C.ink, padding: "120px 0 72px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: `radial-gradient(circle, ${C.maroon}18 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1 }}>
          <Reveal><Label light>Upcoming Events</Label></Reveal>
          <Reveal delay={50}>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(36px,5.5vw,62px)", fontWeight: 400, color: "#fff", lineHeight: 1.08, maxWidth: 600, marginBottom: 16 }}>
              Free webinars. <em style={{ fontStyle: "italic", color: C.accentRose }}>Real answers.</em>
            </h1>
          </Reveal>
          <Reveal delay={80}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: C.stoneLight, lineHeight: 1.75, maxWidth: 460, marginBottom: 56 }}>
              Live sessions with former admissions officers from Cornell, UChicago and more — for families across Asia.
            </p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
            {WEBINARS.map((w, i) => (
              <Reveal key={w.id} delay={120 + i * 70}><HeroCard w={w} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banner ── */}
      <section style={{ background: C.creamWarm, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "18px 32px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: C.ink }}>All sessions are free to attend.</span>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: C.stone }}>Live online · Former admissions officers from Cornell, UChicago and more.</span>
        </div>
      </section>

      {/* ── 2. WHAT YOU'LL LEARN ── */}
      <section style={{ padding: "88px 0 80px", background: C.cream }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px" }}>
          <Reveal>
            <Label>What You'll Learn</Label>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(26px,3.8vw,40px)", fontWeight: 400, color: C.ink, lineHeight: 1.15, marginBottom: 44 }}>
              One hour. Real <em style={{ fontStyle: "italic", color: C.maroon }}>answers.</em>
            </h2>
          </Reveal>
          <Reveal delay={50}>
            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 56, alignItems: "start" }}>
              {/* Tabs */}
              <div style={{ borderRight: `1px solid ${C.border}` }}>
                {WEBINARS.map((w, i) => {
                  const active = i === learnIdx
                  return (
                    <div key={w.id} onClick={() => setLearnIdx(i)} style={{ padding: "18px 24px", borderLeft: `3px solid ${active ? C.accent : "transparent"}`, background: active ? `${C.accent}08` : "transparent", cursor: "pointer", transition: "all 0.3s ease", marginBottom: 2, borderRadius: "0 10px 10px 0" }}>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: active ? C.ink : C.stone, marginBottom: 3 }}>{w.flag} {w.region}</div>
                      <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: C.stoneLight }}>{w.date} · {w.time}</div>
                    </div>
                  )
                })}
              </div>
              {/* Content */}
              <div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 21, fontWeight: 400, color: C.ink, lineHeight: 1.3 }}>{WEBINARS[learnIdx].title}</div>
                <div style={{ fontFamily: "'Fraunces',serif", fontSize: 21, fontWeight: 400, color: C.maroon, fontStyle: "italic", lineHeight: 1.3, marginBottom: 16 }}>{WEBINARS[learnIdx].subtitle}</div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: C.stone, lineHeight: 1.7, marginBottom: 28 }}>{WEBINARS[learnIdx].description}</p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {WEBINARS[learnIdx].learns.map((item, j) => (
                    <div key={j} style={{ display: "flex", gap: 14, padding: "14px 0", borderBottom: `1px solid ${C.border}`, ...(j === 0 ? { borderTop: `1px solid ${C.border}` } : {}) }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, color: C.accent, flexShrink: 0, paddingTop: 2 }}>{String(j + 1).padStart(2, "0")}</span>
                      <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: C.inkSoft, lineHeight: 1.6 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <a href={WEBINARS[learnIdx].link}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", background: C.accent, textDecoration: "none", marginTop: 28, padding: "12px 28px", borderRadius: 10, transition: "all 0.3s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.accentDeep; e.currentTarget.style.transform = "translateY(-1px)" }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.transform = "translateY(0)" }}
                >Register for this webinar <span>→</span></a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 3. HOSTS ── */}
      <HostSection />

      {/* ── 4. BOTTOM CTA ── */}
      <section style={{ background: C.ink, padding: "80px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: `radial-gradient(circle, ${C.maroon}18 0%, transparent 65%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 32px", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <Reveal>
            <Label light>About AddedEducation</Label>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(24px,3.5vw,34px)", fontWeight: 400, color: "#fff", lineHeight: 1.2, marginBottom: 16 }}>
              Premium admissions consultancy across <em style={{ fontStyle: "italic", color: C.accentRose }}>Asia and beyond.</em>
            </h2>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14.5, color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>
              Our team has helped students across Indonesia, India, Hong Kong, Singapore, Dubai and the UK gain admission to Harvard, Oxford, Cornell, LSE, Stanford and the world's most competitive universities.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {WEBINARS.map(w => (
                <a key={w.id} href={w.link}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.borderLight}`, textDecoration: "none", transition: "all 0.3s ease" }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.accent; e.currentTarget.style.borderColor = C.accent }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = C.borderLight }}
                >
                  <div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, color: "#fff" }}>{w.region}</div>
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{w.date} · {w.time}</div>
                  </div>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, color: "#fff" }}>Register →</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  )
}
