import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../../../components/Navbar"

const API_BASE = "https://zmiftah.tech/addedapi"

/* ── Palette ── */
const C = {
  cream: "#FBFBFD",
  creamSoft: "#F5F5F7",
  creamWarm: "#F0EFEA",
  ink: "#0E0E0E",
  inkSoft: "#1A1A1A",
  stone: "#6B6863",
  stoneLight: "#A6A39E",
  maroon: "#6B1818",
  maroonSoft: "#7E2424",
  accent: "#C8354B",
  accentDeep: "#9E2538",
  accentRose: "#E8B4BD",
}

/* ── Reveal animation ── */
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVis(true), delay)
          obs.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.8s cubic-bezier(.16,1,.3,1), transform 0.8s cubic-bezier(.16,1,.3,1)`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function formatDate(d) {
  if (!d) return ""
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

/* ── Article Card ── */
function ArticleCard({ article, index, apiBase }) {
  const thumbUrl = (p) => (p ? `${apiBase}/uploads/${p}` : null)
  return (
    <Reveal delay={index * 60}>
      <Link to={`/resources/detail?slug=${article.slug}`} style={{ textDecoration: "none" }}>
        <div className="rp-card">
          <div className="rp-card-img-wrap">
            {article.thumbnail ? (
              <img src={thumbUrl(article.thumbnail)} alt={article.title} className="rp-card-img" />
            ) : (
              <div className="rp-card-img-placeholder">
                <span>{article.title?.charAt(0) || "A"}</span>
              </div>
            )}
            <div className="rp-card-badge">{article.topic_name}</div>
          </div>
          <div className="rp-card-body">
            <h3 className="rp-card-title">{article.title}</h3>
            <div className="rp-card-footer">
              <div className="rp-card-author">
                {article.author_photo ? (
                  <img src={thumbUrl(article.author_photo)} alt="" className="rp-card-avatar" />
                ) : (
                  <div className="rp-card-avatar-init">{(article.author_name || "A")[0]}</div>
                )}
                <div>
                  <div className="rp-card-author-name">{article.author_name}</div>
                </div>
              </div>
              <div className="rp-card-meta-right">
                <span className="rp-card-date">
                  {formatDate(article.created_at).split(",")[0]}
                </span>
                {article.view_count != null && (
                  <span className="rp-card-views">👁 {article.view_count}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

/* ══════════════════════════════════
   MAIN
   ══════════════════════════════════ */
export default function ResourcePage() {
  const [articles, setArticles] = useState([])
  const [topics, setTopics] = useState([])
  const [activeTopic, setActiveTopic] = useState(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [featured, setFeatured] = useState(null)
  const [trending, setTrending] = useState([])

  useEffect(() => { fetchTopics(); fetchTrending() }, [])
  useEffect(() => { fetchArticles() }, [activeTopic, search, page])

  async function fetchTopics() {
    try {
      const res = await fetch(`${API_BASE}/blog/public/topics`)
      const data = await res.json()
      setTopics(data.topics || [])
    } catch {}
  }

  async function fetchTrending() {
    try {
      const res = await fetch(`${API_BASE}/blog/public/trending?limit=5`)
      const data = await res.json()
      setTrending(data.trending || [])
    } catch {}
  }

  async function fetchArticles() {
    setLoading(true)
    try {
      let url = `${API_BASE}/blog/public/articles?page=${page}&limit=9`
      if (activeTopic) url += `&topic=${activeTopic}`
      if (search) url += `&search=${encodeURIComponent(search)}`
      const res = await fetch(url)
      const data = await res.json()
      const all = data.articles || []
      if (page === 1 && !activeTopic && !search && all.length > 0) {
        setFeatured(all[0])
        setArticles(all.slice(1))
      } else {
        setFeatured(null)
        setArticles(all)
      }
      setTotalPages(data.totalPages || 1)
    } catch {
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  function thumbUrl(p) {
    return p ? `${API_BASE}/uploads/${p}` : null
  }

  function handleTopicClick(slug) {
    setActiveTopic(activeTopic === slug ? null : slug)
    setPage(1)
  }

  const paginationItems = () => {
    const items = []
    const range = 2
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - range && i <= page + range)) {
        items.push(i)
      } else if (items[items.length - 1] !== "…") {
        items.push("…")
      }
    }
    return items
  }

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <style>{CSS}</style>
      <Navbar />

      {/* ══ 1 · HERO ══ */}
      <section className="rp-hero">
        <div className="rp-hero-bg" />
        <div className="rp-hero-overlay" />
        <div className="rp-hero-glow rp-hero-glow-1" />
        <div className="rp-hero-glow rp-hero-glow-2" />
        <div className="rp-hero-grid" />
        <div className="rw rp-hero-inner">
          <Reveal>
            <div className="rp-eyebrow-tag">Resources &amp; Insights</div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="rp-hero-title">
              Knowledge that{" "}
              <em style={{ fontStyle: "italic", color: C.accent }}>opens doors.</em>
            </h1>
          </Reveal>
          <Reveal delay={100}>
            <p className="rp-hero-sub">
              Expert guidance on admissions, university life, scholarships and career
              planning — from people who've been inside the room.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══ 2 · FEATURED ══ */}
      {featured && (
        <section style={{ padding: "64px 0 0" }}>
          <div className="rw">
            <Reveal>
              <Link to={`/resources/detail?slug=${featured.slug}`} style={{ textDecoration: "none" }}>
                <div className="rp-featured">
                  <div className="rp-featured-img-wrap">
                    {featured.thumbnail ? (
                      <img src={thumbUrl(featured.thumbnail)} alt={featured.title} className="rp-featured-img" />
                    ) : (
                      <div className="rp-featured-placeholder">
                        <span>AE</span>
                      </div>
                    )}
                    <div className="rp-featured-badge">Featured</div>
                  </div>
                  <div className="rp-featured-body">
                    <div className="rp-featured-topic">{featured.topic_name}</div>
                    <h2 className="rp-featured-title">{featured.title}</h2>
                    <div className="rp-featured-author">
                      {featured.author_photo ? (
                        <img src={thumbUrl(featured.author_photo)} alt="" className="rp-featured-avatar" />
                      ) : (
                        <div className="rp-featured-avatar-init">{(featured.author_name || "A")[0]}</div>
                      )}
                      <div>
                        <div className="rp-featured-author-name">{featured.author_name}</div>
                        <div className="rp-featured-author-date">{formatDate(featured.created_at)}</div>
                      </div>
                    </div>
                    <div className="rp-featured-cta">Read Article <span>→</span></div>
                  </div>
                </div>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ══ 3 · TRENDING LIST ══ */}
      {trending.length > 0 && (
        <section style={{ padding: "64px 0 0" }}>
          <div className="rw">
            <Reveal>
              <div className="rp-section-head">
                <div className="rp-section-tag">Trending This Month</div>
                <h2 className="rp-section-title">
                  Most <em style={{ fontStyle: "italic", color: C.maroon }}>read</em> articles.
                </h2>
              </div>
            </Reveal>
            <div className="rp-trending-list">
              {trending.map((a, i) => (
                <Reveal key={a.id} delay={i * 40}>
                  <Link
                    to={`/resources/detail?slug=${a.slug}`}
                    className="rp-trending-row"
                    style={{ textDecoration: "none" }}
                  >
                    <div className="rp-trending-num">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {a.thumbnail ? (
                      <img src={thumbUrl(a.thumbnail)} alt={a.title} className="rp-trending-thumb" />
                    ) : (
                      <div className="rp-trending-thumb-empty">
                        <span>{a.title?.[0] || "A"}</span>
                      </div>
                    )}
                    <div className="rp-trending-info">
                      <div className="rp-trending-topic">{a.topic_name}</div>
                      <div className="rp-trending-title">{a.title}</div>
                      <div className="rp-trending-meta">
                        {a.author_name} · {formatDate(a.created_at).split(",")[0]?.trim()}
                      </div>
                    </div>
                    <div className="rp-trending-views">
                      <div className="rp-trending-view-count">{a.view_count}</div>
                      <div className="rp-trending-view-label">views</div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ 4 · ARTICLE GRID ══ */}
      <section style={{ padding: "64px 0 80px" }}>
        <div className="rw">
          <Reveal>
            <div className="rp-section-head" style={{ marginBottom: 28 }}>
              <div className="rp-section-tag">
                {activeTopic
                  ? topics.find((t) => t.slug === activeTopic)?.name || "Articles"
                  : search
                  ? `Results for "${search}"`
                  : "All Articles"}
              </div>
              <h2 className="rp-section-title">
                {activeTopic || search ? (
                  "Explore articles."
                ) : (
                  <>
                    Browse all <em style={{ fontStyle: "italic", color: C.maroon }}>insights.</em>
                  </>
                )}
              </h2>
            </div>
          </Reveal>

          {/* Search + filter */}
          <div className="rp-filter-inline">
            <div className="rp-search-wrap">
              <svg className="rp-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="rp-search-input"
                placeholder="Search articles…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <div className="rp-topics">
              {topics.map((t) => (
                <button
                  key={t.slug}
                  className={`rp-pill${activeTopic === t.slug ? " rp-pill-active" : ""}`}
                  onClick={() => handleTopicClick(t.slug)}
                >
                  {t.name}
                  {t.article_count > 0 && (
                    <span style={{ marginLeft: 6, opacity: 0.55, fontSize: 11 }}>{t.article_count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="rp-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rp-skeleton-card">
                  <div className="rp-skeleton" style={{ aspectRatio: "16/10", borderRadius: "12px 12px 0 0" }} />
                  <div style={{ padding: "20px 20px 24px" }}>
                    <div className="rp-skeleton" style={{ height: 14, width: "60%", marginBottom: 10 }} />
                    <div className="rp-skeleton" style={{ height: 18, width: "90%", marginBottom: 6 }} />
                    <div className="rp-skeleton" style={{ height: 18, width: "70%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <Reveal>
              <div className="rp-empty">
                <div className="rp-empty-title">No articles found</div>
                <div className="rp-empty-sub">Try a different search or topic.</div>
              </div>
            </Reveal>
          ) : (
            <div className="rp-grid">
              {articles.map((a, i) => (
                <ArticleCard key={a.id} article={a} index={i} apiBase={API_BASE} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="rp-pagination" style={{ marginTop: 48 }}>
              <button
                className="rp-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ←
              </button>
              {paginationItems().map((item, i) =>
                item === "…" ? (
                  <span key={`dot-${i}`} className="rp-page-dots">…</span>
                ) : (
                  <button
                    key={item}
                    className={`rp-page-btn${page === item ? " rp-page-active" : ""}`}
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </button>
                )
              )}
              <button
                className="rp-page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══ 5 · NEWSLETTER ══ */}
      <section className="rp-newsletter">
        <div className="rp-nl-glow" />
        <div className="rw rp-nl-inner">
          <Reveal>
            <div>
              <div className="rp-eyebrow-tag" style={{ marginBottom: 14 }}>Stay Informed</div>
              <h2 className="rp-nl-title">
                Subscribe to our{" "}
                <em style={{ fontStyle: "italic", color: C.accentRose }}>newsletter.</em>
              </h2>
              <p className="rp-nl-sub">
                Get the latest insights, tips and admissions advice delivered straight
                to your inbox. No spam — just knowledge.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div>
              <div className="rp-nl-row">
                <input className="rp-nl-input" placeholder="Enter your email" type="email" />
                <button className="rp-nl-btn">Subscribe →</button>
              </div>
              <p className="rp-nl-disclaimer">
                By subscribing, you agree to our privacy policy. Unsubscribe anytime.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

/* ══════════════════════════════════
   CSS
   ══════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
*{box-sizing:border-box;}

.rw{width:100%;padding:0 clamp(24px,6vw,80px);}

/* ── HERO ── */
.rp-hero{
  background:#0E0E0E;padding-bottom:96px;position:relative;overflow:hidden;
}
.rp-hero-bg{position:absolute;inset:0;background-image:url('https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782567170150_Stand_Out.webp');background-size:cover;background-position:center 30%;background-repeat:no-repeat;}
.rp-hero-overlay{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(14,14,14,0.6) 0%,rgba(14,14,14,0.75) 50%,rgba(14,14,14,0.96) 100%);}

/* ── FILTER INLINE (inside article section) ── */
.rp-filter-inline{
  display:flex;flex-direction:column;gap:14px;
  margin-bottom:36px;padding-bottom:28px;
  border-bottom:1px solid #F0EFEA;
}
.rp-hero-inner{position:relative;z-index:1;padding-top:140px;padding-bottom:0;}.rp-hero-glow{position:absolute;border-radius:50%;pointer-events:none;}
.rp-hero-glow-1{top:-200px;left:-100px;width:500px;height:500px;background:radial-gradient(circle,rgba(107,24,24,.18) 0%,transparent 65%);}
.rp-hero-glow-2{bottom:-150px;right:-80px;width:400px;height:400px;background:radial-gradient(circle,rgba(200,53,75,.1) 0%,transparent 65%);}
.rp-hero-grid{
  position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px);
  background-size:80px 80px;
  mask-image:linear-gradient(to bottom,transparent 0%,black 25%,black 75%,transparent 100%);
  -webkit-mask-image:linear-gradient(to bottom,transparent 0%,black 25%,black 75%,transparent 100%);
}
.rp-eyebrow-tag{
  font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;
  color:#C8354B;text-transform:uppercase;letter-spacing:3px;margin-bottom:24px;
  display:inline-block;background:rgba(200,53,75,0.12);
  border:1px solid rgba(200,53,75,0.25);border-radius:6px;padding:6px 14px;
}
.rp-hero-title{
  font-family:'Fraunces',serif;font-size:clamp(36px,4.5vw,58px);font-weight:400;
  color:#fff;line-height:1.05;max-width:700px;margin-bottom:20px;letter-spacing:-.02em;
}
.rp-hero-sub{
  font-family:'DM Sans',sans-serif;font-size:15px;color:rgba(255,255,255,.45);
  line-height:1.7;max-width:480px;margin-bottom:0;font-weight:350;
}
.rp-search-wrap{position:relative;max-width:460px;}
.rp-search-input{
  width:100%;padding:13px 18px 13px 46px;background:#fff;
  border:1.5px solid #e8e7e3;border-radius:12px;
  font-family:'DM Sans',sans-serif;font-size:14px;color:#111;
  outline:none;transition:border-color .2s,box-shadow .2s;
}
.rp-search-input:focus{border-color:#C8354B;box-shadow:0 0 0 3px rgba(200,53,75,.06);}
.rp-search-input::placeholder{color:#A6A39E;}
.rp-search-icon{position:absolute;left:16px;top:50%;transform:translateY(-50%);color:#A6A39E;pointer-events:none;}
.rp-topics{display:flex;gap:8px;flex-wrap:wrap;}
.rp-pill{
  padding:8px 20px;border-radius:100px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;
  border:1.5px solid #e8e7e3;background:#fff;color:#6B6863;cursor:pointer;transition:all .25s;white-space:nowrap;
}
.rp-pill:hover{border-color:#C8354B;color:#C8354B;}
.rp-pill-active{background:#0E0E0E !important;color:#fff !important;border-color:#0E0E0E !important;}

/* ── FEATURED ── */
.rp-featured{
  display:grid;grid-template-columns:1.2fr 1fr;
  background:#fff;border-radius:20px;overflow:hidden;
  border:1px solid rgba(0,0,0,.05);transition:box-shadow .4s;
}
.rp-featured:hover{box-shadow:0 20px 60px rgba(0,0,0,.08);}
@media(max-width:768px){.rp-featured{grid-template-columns:1fr;}}
.rp-featured-img-wrap{aspect-ratio:4/3;overflow:hidden;position:relative;background:linear-gradient(160deg,rgba(107,24,24,.2),#F5F5F7);}
.rp-featured-img{width:100%;height:100%;object-fit:cover;}
.rp-featured-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;}
.rp-featured-placeholder span{font-family:'Fraunces',serif;font-size:72px;font-weight:400;color:rgba(107,24,24,.08);font-style:italic;}
.rp-featured-badge{
  position:absolute;top:18px;left:18px;padding:6px 14px;
  background:rgba(14,14,14,.75);backdrop-filter:blur(10px);border-radius:8px;
  font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;
  color:#E8B4BD;text-transform:uppercase;letter-spacing:1px;
}
.rp-featured-body{padding:48px 44px;display:flex;flex-direction:column;justify-content:center;}
@media(max-width:768px){.rp-featured-body{padding:28px 24px;}}
.rp-featured-topic{font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:#C8354B;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px;}
.rp-featured-title{font-family:'Fraunces',serif;font-size:clamp(24px,3vw,34px);font-weight:500;color:#0E0E0E;line-height:1.2;margin-bottom:16px;}
.rp-featured-author{display:flex;align-items:center;gap:12px;margin-bottom:20px;}
.rp-featured-avatar{width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid #F5F5F7;}
.rp-featured-avatar-init{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6B1818,#C8354B);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;}
.rp-featured-author-name{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:#0E0E0E;}
.rp-featured-author-date{font-family:'DM Sans',sans-serif;font-size:12px;color:#A6A39E;}
.rp-featured-cta{font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:#C8354B;display:flex;align-items:center;gap:6px;}

/* ── SECTION HEADER ── */
.rp-section-head{margin-bottom:32px;}
.rp-section-tag{font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:500;color:#C8354B;text-transform:uppercase;letter-spacing:2.5px;margin-bottom:8px;}
.rp-section-title{font-family:'Fraunces',serif;font-size:clamp(26px,3.5vw,38px);font-weight:400;color:#0E0E0E;line-height:1.15;}

/* ── TRENDING LIST ── */
.rp-trending-list{display:flex;flex-direction:column;border:1px solid #F0EFEA;border-radius:16px;overflow:hidden;background:#fff;}
.rp-trending-row{
  display:flex;align-items:center;gap:20px;padding:18px 24px;
  border-bottom:1px solid #F0EFEA;transition:background .2s;
}
.rp-trending-row:last-child{border-bottom:none;}
.rp-trending-row:hover{background:#F5F5F7;}
.rp-trending-num{font-family:'Fraunces',serif;font-size:28px;font-weight:400;color:#F0EFEA;line-height:1;min-width:40px;text-align:center;}
.rp-trending-thumb{width:64px;height:48px;border-radius:8px;object-fit:cover;flex-shrink:0;}
.rp-trending-thumb-empty{width:64px;height:48px;border-radius:8px;background:linear-gradient(135deg,rgba(107,24,24,.2),#F5F5F7);flex-shrink:0;display:flex;align-items:center;justify-content:center;}
.rp-trending-thumb-empty span{font-family:'Fraunces',serif;font-size:18px;color:rgba(107,24,24,.4);font-style:italic;}
.rp-trending-info{flex:1;min-width:0;}
.rp-trending-topic{font-family:'DM Sans',sans-serif;font-size:11px;font-weight:600;color:#C8354B;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;}
.rp-trending-title{font-family:'Fraunces',serif;font-size:16px;font-weight:500;color:#0E0E0E;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.rp-trending-meta{font-family:'DM Sans',sans-serif;font-size:12px;color:#A6A39E;margin-top:3px;}
.rp-trending-views{flex-shrink:0;text-align:right;}
.rp-trending-view-count{font-family:'Fraunces',serif;font-size:18px;font-weight:500;color:#0E0E0E;}
.rp-trending-view-label{font-family:'JetBrains Mono',monospace;font-size:11px;color:#A6A39E;}

/* ── ARTICLE GRID ── */
.rp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;}
@media(max-width:900px){.rp-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:560px){.rp-grid{grid-template-columns:1fr;}}
.rp-card{
  background:#fff;border-radius:16px;overflow:hidden;
  border:1px solid rgba(0,0,0,.04);transition:all .35s cubic-bezier(.16,1,.3,1);
  display:flex;flex-direction:column;
}
.rp-card:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(107,24,24,.08);border-color:rgba(200,53,75,.12);}
.rp-card-img-wrap{aspect-ratio:16/10;overflow:hidden;position:relative;background:linear-gradient(135deg,rgba(107,24,24,.15),#F5F5F7);}
.rp-card-img{width:100%;height:100%;object-fit:cover;transition:transform .6s cubic-bezier(.16,1,.3,1);}
.rp-card:hover .rp-card-img{transform:scale(1.05);}
.rp-card-img-placeholder{width:100%;height:100%;display:flex;align-items:center;justify-content:center;}
.rp-card-img-placeholder span{font-family:'Fraunces',serif;font-size:42px;font-weight:300;color:rgba(107,24,24,.15);font-style:italic;}
.rp-card-badge{
  position:absolute;top:12px;left:12px;padding:5px 12px;
  background:rgba(14,14,14,.7);backdrop-filter:blur(10px);border-radius:8px;
  font-family:'DM Sans',sans-serif;font-size:10px;font-weight:600;
  color:#fff;text-transform:uppercase;letter-spacing:.8px;
}
.rp-card-body{padding:22px 22px 24px;flex:1;display:flex;flex-direction:column;}
.rp-card-title{
  font-family:'Fraunces',serif;font-size:19px;font-weight:500;color:#0E0E0E;
  line-height:1.3;margin-bottom:14px;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
.rp-card-footer{margin-top:auto;display:flex;align-items:center;justify-content:space-between;}
.rp-card-author{display:flex;align-items:center;gap:10px;}
.rp-card-avatar{width:28px;height:28px;border-radius:50%;object-fit:cover;}
.rp-card-avatar-init{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#6B1818,#C8354B);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;}
.rp-card-author-name{font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;color:#1A1A1A;}
.rp-card-meta-right{display:flex;flex-direction:column;align-items:flex-end;gap:2px;}
.rp-card-date{font-family:'DM Sans',sans-serif;font-size:11px;color:#A6A39E;}
.rp-card-views{font-family:'JetBrains Mono',monospace;font-size:10px;color:#A6A39E;}

/* ── PAGINATION ── */
.rp-pagination{display:flex;align-items:center;justify-content:center;gap:6px;}
.rp-page-btn{
  width:40px;height:40px;border-radius:10px;border:1.5px solid #e8e7e3;background:#fff;
  font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;color:#6B6863;
  cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;
}
.rp-page-btn:hover:not(:disabled){border-color:#C8354B;color:#C8354B;}
.rp-page-btn:disabled{opacity:.3;cursor:not-allowed;}
.rp-page-active{background:#0E0E0E !important;color:#fff !important;border-color:#0E0E0E !important;}
.rp-page-dots{font-family:'DM Sans',sans-serif;font-size:14px;color:#A6A39E;padding:0 4px;}

/* ── SKELETON ── */
@keyframes rp-shimmer{0%{background-position:-400px 0;}100%{background-position:400px 0;}}
.rp-skeleton{background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:800px 100%;animation:rp-shimmer 1.5s infinite;border-radius:8px;}
.rp-skeleton-card{background:#fff;border-radius:16px;overflow:hidden;border:1px solid rgba(0,0,0,.04);}

/* ── EMPTY STATE ── */
.rp-empty{text-align:center;padding:80px 24px;border-radius:16px;border:1.5px dashed rgba(166,163,158,.4);}
.rp-empty-title{font-family:'Fraunces',serif;font-size:28px;font-weight:400;color:#0E0E0E;margin-bottom:10px;}
.rp-empty-sub{font-family:'DM Sans',sans-serif;font-size:15px;color:#6B6863;}

/* ── NEWSLETTER ── */
.rp-newsletter{background:#0E0E0E;padding:80px 0;position:relative;overflow:hidden;}
.rp-nl-glow{position:absolute;top:-80px;right:-80px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(107,24,24,.2) 0%,transparent 70%);pointer-events:none;}
.rp-nl-inner{position:relative;z-index:1;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
@media(max-width:768px){.rp-nl-inner{grid-template-columns:1fr;gap:32px;}}
.rp-nl-title{font-family:'Fraunces',serif;font-size:clamp(26px,3.5vw,38px);font-weight:400;color:#fff;line-height:1.2;margin-bottom:14px;}
.rp-nl-sub{font-family:'DM Sans',sans-serif;font-size:15px;color:rgba(255,255,255,.5);line-height:1.7;}
.rp-nl-row{display:flex;gap:8px;margin-top:20px;}
.rp-nl-input{flex:1;padding:14px 20px;border:1.5px solid rgba(255,255,255,.15);border-radius:12px;background:rgba(255,255,255,.06);color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;outline:none;transition:border-color .2s;}
.rp-nl-input::placeholder{color:rgba(255,255,255,.35);}
.rp-nl-input:focus{border-color:#C8354B;}
.rp-nl-btn{padding:14px 28px;background:#C8354B;color:#fff;border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .25s;white-space:nowrap;}
.rp-nl-btn:hover{background:#9E2538;transform:translateY(-1px);}
.rp-nl-disclaimer{font-family:'DM Sans',sans-serif;font-size:12px;color:rgba(255,255,255,.25);margin-top:12px;line-height:1.5;}
`
