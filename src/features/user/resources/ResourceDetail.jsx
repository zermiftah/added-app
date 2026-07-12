import { useState, useEffect, useRef } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "../../../components/Navbar"

const API_BASE = "https://zmiftah.tech/addedapi"
const LIST_PATH = "/resources"

/* ══════════════════════════════════
   MAIN
   ══════════════════════════════════ */
export default function ResourceDetail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [article, setArticle] = useState(null)
  const [images, setImages] = useState([])
  const [related, setRelated] = useState([])
  const [moreArticles, setMoreArticles] = useState([])
  const [authorArticles, setAuthorArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Full-bleed calculation
  const rootRef = useRef(null)
  const [bleed, setBleed] = useState({ ml: 0, w: "100%" })
  useEffect(() => {
    function calc() {
      if (!rootRef.current) return
      const rect = rootRef.current.getBoundingClientRect()
      setBleed({ ml: -rect.left, w: `${window.innerWidth}px` })
    }
    calc()
    window.addEventListener("resize", calc)
    return () => window.removeEventListener("resize", calc)
  }, [])

  useEffect(() => {
    const slug = searchParams.get("slug")
    if (!slug) { setError("Article not found."); setLoading(false); return }
    fetchArticle(slug)
  }, [searchParams])

  async function fetchArticle(slug) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/blog/public/articles/${encodeURIComponent(slug)}`)
      if (!res.ok) throw new Error(res.status === 404 ? "Article not found" : `Error ${res.status}`)
      const data = await res.json()
      if (!data.article?.id) throw new Error("Invalid data")
      setArticle(data.article)
      setImages(data.images || [])
      setRelated(data.related || [])

      // Track view
      fetch(`${API_BASE}/blog/public/articles/${encodeURIComponent(slug)}/view`, { method: "POST" }).catch(() => {})

      // More articles
      const moreRes = await fetch(`${API_BASE}/blog/public/articles?limit=6`)
      const moreData = await moreRes.json()
      setMoreArticles((moreData.articles || []).filter((a) => a.slug !== slug).slice(0, 5))

      // Author articles
      const authorRes = await fetch(`${API_BASE}/blog/public/articles?limit=10`)
      const authorData = await authorRes.json()
      setAuthorArticles(
        (authorData.articles || [])
          .filter((a) => a.slug !== slug && a.author_name === data.article.author_name)
          .slice(0, 2)
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }

  function imgUrl(p) { return `${API_BASE}/uploads/${p}` }
  function smImgUrl(p) {
    if (!p) return null
    return `${API_BASE}/uploads/${p.replace(/\.webp$/i, "_sm.webp")}`
  }
  function formatDate(d) {
    if (!d) return ""
    return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }
  function sanitizeContent(html) {
    if (!html) return ""
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) return bodyMatch[1]
    return html.replace(/<style[\s\S]*?<\/style>/gi, "")
  }

  return (
    <>
      <style>{CSS}</style>
      <Navbar />
      <div ref={rootRef} style={{ minHeight: "100vh" }}>
        <div style={{ width: bleed.w, marginLeft: bleed.ml, position: "relative" }}>

          {/* Loading */}
          {loading && (
            <div className="rd-state">
              <div className="rd-spinner" />
              <p className="rd-state-sub">Loading article…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rd-state">
              <div className="rd-state-code">404</div>
              <h2 className="rd-state-title">Article Not Found</h2>
              <p className="rd-state-sub">{error}</p>
              <button onClick={() => navigate(LIST_PATH)} className="rd-btn-outline">← Back to Resources</button>
            </div>
          )}

          {/* Content */}
          {!loading && article && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>

              {/* ══ HERO ══ */}
              <section className="rd-hero">
                <div className="rd-hero-glow" />
                <div className="rd-hero-grid" />
                <div className="rd-hero-inner">
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Link to={LIST_PATH} className="rd-back-link">← All Resources</Link>
                    <div className="rd-eyebrow">
                      <span className="rd-dot" />
                      {article.topic_name}
                    </div>
                    <h1 className="rd-title">{article.title}</h1>
                    <div className="rd-meta">
                      {article.author_photo ? (
                        <img src={imgUrl(article.author_photo)} alt="" className="rd-author-img"  loading="lazy" decoding="async"/>
                      ) : (
                        <div className="rd-author-initial">{(article.author_name || "A")[0]}</div>
                      )}
                      <div className="rd-meta-text">
                        <span className="rd-author-name">{article.author_name}</span>
                        <span className="rd-meta-sep">·</span>
                        <span className="rd-meta-date">{formatDate(article.created_at)}</span>
                      </div>
                    </div>
                  </motion.div>

                  {article.thumbnail && (
                    <motion.div
                      className="rd-hero-img-wrap"
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.7, delay: 0.15 }}
                    >
                      <img
                        src={imgUrl(article.thumbnail)}
                        srcSet={`${smImgUrl(article.thumbnail)} 480w, ${imgUrl(article.thumbnail)} 800w`}
                        sizes="(max-width: 640px) 100vw, 860px"
                        alt={article.title}
                        className="rd-hero-img"
                        fetchpriority="high"
                        decoding="async"
                       loading="lazy"/>
                    </motion.div>
                  )}
                </div>
              </section>

              {/* ══ BODY ══ */}
              <section className="rd-body">
                <div className="rd-body-inner">
                  {/* Main content */}
                  <div className="rd-main">
                    {images.filter((img) => img.position === "top").map((img) => (
                      <figure key={img.id} className="rd-figure">
                        <img src={imgUrl(img.image_path)} alt={img.caption || ""} className="rd-content-img"  loading="lazy" decoding="async"/>
                        {img.caption && <figcaption className="rd-caption">{img.caption}</figcaption>}
                      </figure>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <div
                        className="rich-content"
                        dangerouslySetInnerHTML={{ __html: sanitizeContent(article.content) }}
                      />
                    </motion.div>
                    {images.filter((img) => img.position === "bottom").map((img) => (
                      <figure key={img.id} className="rd-figure">
                        <img src={imgUrl(img.image_path)} alt={img.caption || ""} className="rd-content-img"  loading="lazy" decoding="async"/>
                        {img.caption && <figcaption className="rd-caption">{img.caption}</figcaption>}
                      </figure>
                    ))}
                  </div>

                  {/* Sidebar */}
                  <aside className="rd-sidebar">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25, duration: 0.5 }}
                      style={{ display: "flex", flexDirection: "column", gap: 16 }}
                    >
                      {/* Author card */}
                      <div className="rd-card">
                        <p className="rd-card-label">About the Author</p>
                        <div className="rd-author-card">
                          {article.author_photo ? (
                            <img src={imgUrl(article.author_photo)} alt="" className="rd-author-card-img"  loading="lazy" decoding="async"/>
                          ) : (
                            <div className="rd-author-card-initial">{(article.author_name || "A")[0]}</div>
                          )}
                          <div>
                            <div className="rd-author-card-name">{article.author_name}</div>
                            {article.author_title && (
                              <div className="rd-author-card-title">{article.author_title}</div>
                            )}
                          </div>
                        </div>
                        {article.author_description && (
                          <p className="rd-author-card-bio"
                            dangerouslySetInnerHTML={{ __html: article.author_description }}
                          />
                        )}
                      </div>

                      {/* Article details */}
                      <div className="rd-card">
                        <p className="rd-card-label">Article Details</p>
                        {[
                          { k: "Topic", v: article.topic_name },
                          { k: "Published", v: formatDate(article.created_at) },
                        ].map(({ k, v }) => (
                          <div key={k} className="rd-card-row">
                            <span className="rd-card-key">{k}</span>
                            <span className="rd-card-val">{v}</span>
                          </div>
                        ))}
                      </div>

                      {/* More from author */}
                      {authorArticles.length > 0 && (
                        <div className="rd-card">
                          <p className="rd-card-label">More from {article.author_name}</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                            {authorArticles.map((a, i) => (
                              <Link
                                key={a.id}
                                to={`${LIST_PATH}/detail?slug=${a.slug}`}
                                className="rd-author-article"
                                style={{ borderBottom: i < authorArticles.length - 1 ? "1px solid #F0EFEA" : "none" }}
                              >
                                <div className="rd-author-article-thumb">
                                  {a.thumbnail ? (
                                    <img
                                      src={smImgUrl(a.thumbnail) || imgUrl(a.thumbnail)}
                                      alt=""
                                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                      loading="lazy"
                                      decoding="async"
                                    />
                                  ) : (
                                    <div className="rd-author-article-empty">{a.title?.[0]}</div>
                                  )}
                                </div>
                                <div>
                                  <div className="rd-author-article-topic">{a.topic_name}</div>
                                  <div className="rd-author-article-title">{a.title}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </aside>
                </div>
              </section>

              {/* ══ RELATED ARTICLES ══ */}
              {related.length > 0 && (
                <section className="rd-related">
                  <div className="rd-related-inner">
                    <div className="rd-related-header">
                      <p className="rd-section-tag">Related Articles</p>
                      <h2 className="rd-section-title">
                        More in <em>{article.topic_name}.</em>
                      </h2>
                    </div>
                    <div className="rd-related-grid">
                      {related.map((r, i) => (
                        <motion.div key={r.id}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.08, duration: 0.5 }}
                        >
                          <Link to={`${LIST_PATH}/detail?slug=${r.slug}`} className="rd-related-card">
                            <div className="rd-related-thumb">
                              {r.thumbnail ? (
                                <img
                                src={smImgUrl(r.thumbnail) || imgUrl(r.thumbnail)}
                                alt=""
                                className="rd-related-img"
                                loading="lazy"
                                decoding="async"
                              />
                              ) : (
                                <div className="rd-related-empty">{r.title.charAt(0)}</div>
                              )}
                            </div>
                            <div className="rd-related-body">
                              <span className="rd-related-topic">{r.topic_name}</span>
                              <h3 className="rd-related-title">{r.title}</h3>
                              <div className="rd-related-meta">
                                {r.author_name} · {formatDate(r.created_at).split(",")[0]}
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* ══ KEEP EXPLORING ══ */}
              {moreArticles.length > 0 && (
                <section className="rd-explore-section">
                  <div className="rd-explore-inner">
                    <div className="rd-related-header">
                      <p className="rd-section-tag">Keep exploring</p>
                      <h2 className="rd-section-title">Discover more <em>insights.</em></h2>
                    </div>
                    <div className="rd-explore-grid">
                      {moreArticles.map((a, i) => (
                        <motion.div key={a.id}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.07, duration: 0.5 }}
                        >
                          <Link to={`${LIST_PATH}/detail?slug=${a.slug}`} className="rd-related-card">
                            <div className="rd-related-thumb">
                              {a.thumbnail ? (
                                <img
                                src={smImgUrl(a.thumbnail) || imgUrl(a.thumbnail)}
                                alt=""
                                className="rd-related-img"
                                loading="lazy"
                                decoding="async"
                              />
                              ) : (
                                <div className="rd-related-empty">{a.title.charAt(0)}</div>
                              )}
                            </div>
                            <div className="rd-related-body">
                              <span className="rd-related-topic">{a.topic_name}</span>
                              <h3 className="rd-related-title">{a.title}</h3>
                              <div className="rd-related-meta">{a.author_name}</div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    <div style={{ marginTop: 40, textAlign: "center" }}>
                      <button onClick={() => navigate(LIST_PATH)} className="rd-btn-outline">
                        ← Browse all articles
                      </button>
                    </div>
                  </div>
                </section>
              )}

            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════════
   CSS
   ══════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,600&family=Inter:wght@350;400;450;500&family=JetBrains+Mono:wght@400;500&display=swap');

@keyframes rd-spin { to { transform: rotate(360deg); } }
@keyframes rd-pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.4;transform:scale(.7);} }

/* ── STATE ── */
.rd-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;min-height:70vh;text-align:center;padding:40px 24px;background:#F5F5F7;}
.rd-spinner{width:28px;height:28px;border-radius:50%;border:2px solid #F0EFEA;border-top-color:#0E0E0E;animation:rd-spin .75s linear infinite;}
.rd-state-code{font-size:80px;font-weight:400;color:#F0EFEA;font-family:'Fraunces',serif;line-height:1;}
.rd-state-title{font-family:'Fraunces',serif;font-size:28px;font-weight:400;color:#0E0E0E;font-style:italic;}
.rd-state-sub{font-family:'Inter',sans-serif;font-size:15px;color:#A6A39E;line-height:1.7;max-width:320px;}
.rd-btn-outline{display:inline-flex;align-items:center;gap:8px;background:transparent;color:#6B6863;padding:12px 24px;border-radius:999px;font-family:'Inter',sans-serif;font-size:14px;border:1.5px solid #F0EFEA;cursor:pointer;transition:all .2s;}
.rd-btn-outline:hover{border-color:#A6A39E;color:#0E0E0E;}

/* ── HERO ── */
.rd-hero{position:relative;overflow:hidden;background:#0E0E0E;color:#fff;padding-bottom:64px;}
.rd-hero-glow{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(200,53,75,.10) 0%,transparent 65%);top:-120px;right:-80px;pointer-events:none;}
.rd-hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:72px 72px;pointer-events:none;mask-image:linear-gradient(to bottom,transparent,black 20%,black 80%,transparent);-webkit-mask-image:linear-gradient(to bottom,transparent,black 20%,black 80%,transparent);}
.rd-hero-inner{position:relative;z-index:2;padding:140px clamp(24px,6vw,80px) 0;}
.rd-back-link{display:inline-flex;align-items:center;gap:6px;font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,.4);text-decoration:none;margin-bottom:32px;transition:color .2s;}
.rd-back-link:hover{color:rgba(255,255,255,.7);}
.rd-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#C8354B;margin-bottom:24px;}
.rd-dot{width:6px;height:6px;border-radius:50%;background:#C8354B;flex-shrink:0;animation:rd-pulse 2s ease-in-out infinite;}
.rd-title{font-family:'Fraunces',serif;font-size:clamp(32px,5vw,52px);font-weight:400;line-height:1.05;letter-spacing:-.02em;color:#fff;margin-bottom:28px;font-style:italic;}
.rd-meta{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
.rd-author-img{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,.1);}
.rd-author-initial{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#6B1818,#C8354B);display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:500;color:#fff;}
.rd-meta-text{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.rd-author-name{font-family:'Inter',sans-serif;font-size:14px;font-weight:450;color:#fff;}
.rd-meta-sep{color:rgba(255,255,255,.2);}
.rd-meta-date{font-family:'Inter',sans-serif;font-size:13px;color:rgba(255,255,255,.4);}
.rd-hero-img-wrap{margin-top:48px;border-radius:18px;overflow:hidden;aspect-ratio:2/1;}
.rd-hero-img{width:100%;height:100%;object-fit:cover;display:block;}

/* ── BODY ── */
.rd-body{background:#FBFBFD;padding:64px clamp(24px,6vw,80px) 80px;}
.rd-body-inner{display:grid;grid-template-columns:1fr 280px;gap:64px;align-items:start;}
.rd-figure{margin:24px 0;}
.rd-content-img{width:100%;border-radius:14px;display:block;}
.rd-caption{font-family:'Inter',sans-serif;font-size:12px;color:#A6A39E;margin-top:8px;text-align:center;font-style:italic;}

/* ── RICH CONTENT ── */
.rich-content{font-family:'Inter',-apple-system,sans-serif;font-size:15px;line-height:1.8;color:#6B6863;}
.rich-content h1,.rich-content h2{font-family:'Fraunces',serif;font-size:22px;font-weight:400;font-style:italic;color:#0E0E0E;line-height:1.2;letter-spacing:-.01em;margin:32px 0 12px;padding-bottom:10px;border-bottom:1px solid #F0EFEA;}
.rich-content h1:first-child,.rich-content h2:first-child{margin-top:0;}
.rich-content h3{font-family:'Inter',sans-serif;font-size:16px;font-weight:500;color:#0E0E0E;line-height:1.5;margin:24px 0 8px;}
.rich-content h4{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:#A6A39E;letter-spacing:.16em;text-transform:uppercase;margin:20px 0 6px;}
.rich-content p{margin:0 0 12px;color:#6B6863;font-size:15px;line-height:1.8;}
.rich-content p:last-child{margin-bottom:0;}
.rich-content strong,.rich-content b{font-weight:500;color:#0E0E0E;}
.rich-content em,.rich-content i{font-style:italic;}
.rich-content u{text-decoration:underline;text-decoration-color:#C8354B;}
.rich-content a{color:#C8354B;text-decoration:underline;text-decoration-color:rgba(200,53,75,.3);transition:text-decoration-color .2s;}
.rich-content a:hover{text-decoration-color:#C8354B;}
.rich-content blockquote{border-left:3px solid #C8354B;padding:16px 24px;margin:20px 0;background:#F5F5F7;border-radius:0 10px 10px 0;font-style:italic;color:#6B6863;}
.rich-content pre{background:#1A1A1A;color:#d4d4d4;padding:18px 20px;border-radius:10px;font-family:'JetBrains Mono',monospace;font-size:13px;overflow-x:auto;margin:16px 0;line-height:1.6;}
.rich-content code{font-family:'JetBrains Mono',monospace;font-size:13px;background:#F0EFEA;padding:2px 6px;border-radius:4px;color:#6B1818;}
.rich-content pre code{background:none;padding:0;color:inherit;}
.rich-content img{max-width:100%;border-radius:14px;margin:16px 0;display:block;}
.rich-content table{width:100%;border-collapse:collapse;margin:16px 0;}
.rich-content td,.rich-content th{border:1px solid #F0EFEA;padding:10px 14px;font-size:14px;text-align:left;}
.rich-content th{background:#F5F5F7;font-weight:500;color:#0E0E0E;}
.rich-content ul{list-style:none;padding:0;margin:8px 0 16px;}
.rich-content ul li{display:flex;align-items:flex-start;gap:12px;padding:7px 0;border-bottom:1px solid #F5F5F7;font-size:15px;line-height:1.7;color:#6B6863;}
.rich-content ul li:last-child{border-bottom:none;}
.rich-content ul li::before{content:"";flex-shrink:0;width:6px;height:6px;border-radius:50%;background:#C8354B;margin-top:9px;}
.rich-content ol{list-style:none;padding:0;margin:8px 0 16px;counter-reset:rc-ol;}
.rich-content ol li{display:flex;align-items:flex-start;gap:12px;padding:7px 0;border-bottom:1px solid #F5F5F7;font-size:15px;line-height:1.7;color:#6B6863;counter-increment:rc-ol;}
.rich-content ol li:last-child{border-bottom:none;}
.rich-content ol li::before{content:counter(rc-ol) ".";flex-shrink:0;font-weight:500;color:#0E0E0E;font-size:14px;min-width:20px;margin-top:1px;}
.rich-content hr{border:none;height:1px;background:#F0EFEA;margin:24px 0;}

/* ── SIDEBAR ── */
.rd-sidebar{position:sticky;top:88px;}
.rd-card{background:#F5F5F7;border:1px solid #F0EFEA;border-radius:14px;padding:24px;}
.rd-card-label{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#A6A39E;padding-bottom:16px;margin-bottom:12px;border-bottom:1px solid #F0EFEA;}
.rd-author-card{display:flex;align-items:center;gap:14px;margin-bottom:14px;}
.rd-author-card-img{width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid #F0EFEA;}
.rd-author-card-initial{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#0E0E0E,#374151);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:500;color:#fff;}
.rd-author-card-name{font-family:'Inter',sans-serif;font-size:14px;font-weight:500;color:#0E0E0E;}
.rd-author-card-title{font-family:'Inter',sans-serif;font-size:12px;color:#A6A39E;margin-top:2px;}
.rd-author-card-bio{font-family:'Inter',sans-serif;font-size:13px;color:#6B6863;line-height:1.6;}
.rd-card-row{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid #F0EFEA;}
.rd-card-row:last-of-type{border-bottom:none;}
.rd-card-key{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:#A6A39E;text-transform:uppercase;letter-spacing:.14em;}
.rd-card-val{font-family:'Inter',sans-serif;font-size:13px;font-weight:500;color:#0E0E0E;text-align:right;}
.rd-author-article{text-decoration:none;display:flex;gap:12px;padding:12px 0;transition:opacity .2s;}
.rd-author-article:hover{opacity:.7;}
.rd-author-article-thumb{width:52px;height:40px;border-radius:6px;overflow:hidden;background:#F5F5F7;flex-shrink:0;}
.rd-author-article-empty{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:16px;font-style:italic;color:rgba(200,53,75,.2);}
.rd-author-article-topic{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;color:#C8354B;text-transform:uppercase;letter-spacing:.12em;margin-bottom:3px;}
.rd-author-article-title{font-family:'Inter',sans-serif;font-size:12px;font-weight:450;color:#0E0E0E;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}

/* ── RELATED & EXPLORE ── */
.rd-related{background:#FBFBFD;padding:0 clamp(24px,6vw,80px) 80px;}
.rd-related-inner{border-top:1px solid #F0EFEA;padding-top:64px;}
.rd-related-header{margin-bottom:40px;}
.rd-section-tag{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#C8354B;display:flex;align-items:center;gap:10px;margin-bottom:14px;}
.rd-section-tag::before{content:'';display:block;width:24px;height:1.5px;background:#C8354B;}
.rd-section-title{font-family:'Fraunces',serif;font-size:clamp(24px,3vw,32px);font-weight:400;line-height:1.1;color:#0E0E0E;}
.rd-section-title em{font-style:italic;color:#C8354B;}
.rd-related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.rd-related-card{background:#fff;border:1.5px solid #F0EFEA;border-radius:14px;overflow:hidden;text-decoration:none;display:flex;flex-direction:column;transition:all .25s;}
.rd-related-card:hover{border-color:#A6A39E;box-shadow:0 8px 24px rgba(0,0,0,.05);transform:translateY(-3px);}
.rd-related-thumb{aspect-ratio:16/10;overflow:hidden;background:#F5F5F7;}
.rd-related-img{width:100%;height:100%;object-fit:cover;transition:transform .4s;}
.rd-related-card:hover .rd-related-img{transform:scale(1.04);}
.rd-related-empty{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:42px;font-style:italic;color:rgba(200,53,75,.08);}
.rd-related-body{padding:18px 20px;flex:1;}
.rd-related-topic{font-family:'Inter',sans-serif;font-size:11px;font-weight:450;color:#C8354B;text-transform:uppercase;letter-spacing:.04em;}
.rd-related-title{font-family:'Fraunces',serif;font-size:17px;font-weight:400;color:#0E0E0E;line-height:1.25;margin-top:6px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.rd-related-meta{font-family:'Inter',sans-serif;font-size:12px;color:#A6A39E;margin-top:10px;}
.rd-explore-section{background:#FBFBFD;padding:0 clamp(24px,6vw,80px) 80px;}
.rd-explore-inner{border-top:1px solid #F0EFEA;padding-top:64px;}
.rd-explore-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .rd-body-inner{grid-template-columns:1fr;}
  .rd-sidebar{position:static;}
  .rd-related-grid,.rd-explore-grid{grid-template-columns:1fr 1fr;}
}
@media(max-width:600px){
  .rd-hero{padding-bottom:56px;}
  .rd-hero-inner{padding-top:100px;}
  .rd-title{font-size:clamp(26px,7vw,40px);}
  .rd-body{padding-top:56px;padding-bottom:72px;}
  .rd-related-grid,.rd-explore-grid{grid-template-columns:1fr;}
}
`
