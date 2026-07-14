import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

const LOGO_URL = "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1782570954773_Horizontal___Maroon.webp"
const API_BASE = "https://addededucation.com/addedapi"

function extractYouTubeId(url) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

function formatExpiry(dt) {
  if (!dt) return ""
  return new Date(dt).toLocaleString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

// YouTube IFrame API Player — full control, no "Watch on YouTube" button visible during play
function YouTubePlayer({ videoId }) {
  const containerRef = useRef(null)
  const playerRef    = useRef(null)
  const [ready, setReady]     = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted]     = useState(false)
  const [volume, setVolume]   = useState(100)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const intervalRef = useRef(null)

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      document.head.appendChild(tag)
    }

    const initPlayer = () => {
      if (!containerRef.current) return
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay:        0,
          controls:        0,   // hide YouTube native controls
          disablekb:       1,   // disable keyboard shortcuts (prevents accidental Y hotkey)
          enablejsapi:     1,
          fs:              0,   // hide fullscreen button (we handle it)
          iv_load_policy:  3,   // hide annotations
          modestbranding:  1,
          rel:             0,   // no related videos
          showinfo:        0,
          playsinline:     1,
          origin:          window.location.origin,
        },
        events: {
          onReady: () => {
            setReady(true)
            setDuration(playerRef.current.getDuration())
          },
          onStateChange: (e) => {
            const YT = window.YT.PlayerState
            if (e.data === YT.PLAYING) {
              setPlaying(true)
              setDuration(playerRef.current.getDuration())
              intervalRef.current = setInterval(() => {
                const t = playerRef.current?.getCurrentTime?.() || 0
                const d = playerRef.current?.getDuration?.() || 1
                setCurrentTime(t)
                setProgress((t / d) * 100)
              }, 500)
            } else {
              setPlaying(false)
              clearInterval(intervalRef.current)
            }
          },
        },
      })
    }

    if (window.YT?.Player) {
      initPlayer()
    } else {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        prev?.()
        initPlayer()
      }
    }

    return () => {
      clearInterval(intervalRef.current)
      playerRef.current?.destroy?.()
    }
  }, [videoId])

  const togglePlay = () => {
    if (!playerRef.current) return
    playing ? playerRef.current.pauseVideo() : playerRef.current.playVideo()
  }

  const toggleMute = () => {
    if (!playerRef.current) return
    if (muted) { playerRef.current.unMute(); setMuted(false) }
    else { playerRef.current.mute(); setMuted(true) }
  }

  const handleVolume = (e) => {
    const v = Number(e.target.value)
    setVolume(v)
    playerRef.current?.setVolume(v)
    if (v === 0) { playerRef.current?.mute(); setMuted(true) }
    else { playerRef.current?.unMute(); setMuted(false) }
  }

  const handleSeek = (e) => {
    const pct = Number(e.target.value)
    const t   = (pct / 100) * duration
    playerRef.current?.seekTo(t, true)
    setProgress(pct)
  }

  const handleFullscreen = () => {
    const iframe = containerRef.current?.querySelector("iframe") || containerRef.current
    const el = iframe?.closest?.(".yt-player-wrap") || iframe
    if (el?.requestFullscreen) el.requestFullscreen()
    else if (el?.webkitRequestFullscreen) el.webkitRequestFullscreen()
  }

  const fmt = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  return (
    <div className="yt-player-wrap" style={{ position: "relative", width: "100%", borderRadius: 12, overflow: "hidden", background: "#000", boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}>
      <style>{`
        .yt-player-wrap .range-input { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 4px; outline: none; cursor: pointer; }
        .yt-player-wrap .range-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #fff; cursor: pointer; }
        .yt-player-wrap .range-input::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #fff; cursor: pointer; border: none; }
      `}</style>

      {/* YouTube iframe — hidden controls via playerVars */}
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        {/* Transparent overlay — blocks right-click, blocks "Watch on YouTube" click zone at bottom-right */}
        <div
          onContextMenu={e => e.preventDefault()}
          onClick={togglePlay}
          style={{
            position: "absolute", inset: 0, zIndex: 2, cursor: "pointer",
            // Slightly clip bottom-right where YouTube logo sits
            clipPath: "inset(0 0 0 0)",
          }}
        />
        {/* Extra cover for bottom-right "Watch on YouTube" badge */}
        <div style={{ position: "absolute", bottom: 0, right: 0, width: 200, height: 42, background: "#000", zIndex: 3 }} />

        <div
          ref={containerRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      </div>

      {/* Custom controls bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10,
        background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
        padding: "24px 16px 14px",
        display: "flex", flexDirection: "column", gap: 8,
        opacity: ready ? 1 : 0, transition: "opacity 0.3s",
      }}>
        {/* Progress bar */}
        <input
          type="range" min={0} max={100} step={0.1}
          value={progress}
          onChange={handleSeek}
          className="range-input"
          style={{ width: "100%", background: `linear-gradient(to right, #C8354B ${progress}%, rgba(255,255,255,0.25) ${progress}%)` }}
        />

        {/* Controls row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Play/Pause */}
          <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "flex", alignItems: "center", flexShrink: 0 }}>
            {playing ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
            )}
          </button>

          {/* Time */}
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "rgba(255,255,255,0.7)", flexShrink: 0 }}>
            {fmt(currentTime)} / {fmt(duration)}
          </span>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Volume */}
          <button onClick={toggleMute} aria-label="Toggle mute" style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "flex", alignItems: "center", flexShrink: 0 }}>
            {muted || volume === 0 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round"/><line x1="17" y1="9" x2="23" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
            )}
          </button>
          <input
            type="range" min={0} max={100} step={1}
            value={muted ? 0 : volume}
            onChange={handleVolume}
            className="range-input"
            style={{ width: 72, background: `linear-gradient(to right, #fff ${muted ? 0 : volume}%, rgba(255,255,255,0.25) ${muted ? 0 : volume}%)` }}
          />

          {/* Fullscreen */}
          <button onClick={handleFullscreen} aria-label="Fullscreen" style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, display: "flex", alignItems: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          </button>
        </div>
      </div>

      {/* Loading spinner */}
      {!ready && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 5, background: "#000" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(200,53,75,0.3)", borderTopColor: "#C8354B", animation: "spin 0.7s linear infinite" }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
    </div>
  )
}

export default function WatchPage() {
  const { token } = useParams()
  const [state, setState] = useState({ loading: true, data: null, error: null })

  useEffect(() => {
    fetch(`${API_BASE}/webinar-registrants/watch/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setState({ loading: false, data: d, error: null })
        else setState({ loading: false, data: null, error: d.message || "Link not found or expired" })
      })
      .catch(() => setState({ loading: false, data: null, error: "Failed to load. Please try again." }))
  }, [token])

  if (state.loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0E0E0E", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(200,53,75,0.3)", borderTopColor: "#C8354B", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  if (state.error) {
    return (
      <div style={{ minHeight: "100vh", background: "#0E0E0E", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <img src={LOGO_URL} alt="AddedEducation" style={{ height: 28, filter: "brightness(0) invert(1)", marginBottom: 32, opacity: 0.6 }}  loading="lazy" decoding="async"/>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 400, color: "#fff", marginBottom: 12 }}>
          {state.error === "This link has expired" ? "Link Expired" : "Link Not Found"}
        </h1>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 400, lineHeight: 1.65 }}>
          {state.error === "This link has expired"
            ? "This recording link has expired. Please contact AddedEducation to request a new link."
            : "This link is invalid or no longer available."}
        </p>
        <a href="mailto:hello@addededucation.com" style={{ marginTop: 24, fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#C8354B", textDecoration: "none", borderBottom: "1px solid #C8354B", paddingBottom: 2 }}>
          Contact us →
        </a>
      </div>
    )
  }

  const { youtube_url, webinar_title, expires_at } = state.data
  const videoId = extractYouTubeId(youtube_url)

  return (
    <div style={{ minHeight: "100vh", background: "#0E0E0E", color: "#fff" }}>
      {/* Header */}
      <header style={{ padding: "18px clamp(20px,4vw,48px)", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <img src={LOGO_URL} alt="AddedEducation" style={{ height: 24, filter: "brightness(0) invert(1)", opacity: 0.85 }}  loading="lazy" decoding="async"/>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>
          Recording
        </span>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "40px clamp(16px,4vw,48px) 64px" }}>
        <div style={{ marginBottom: 24 }}>
          <span style={{ display: "inline-block", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C8354B", border: "1px solid #C8354B", borderRadius: 999, padding: "5px 12px", marginBottom: 14 }}>
            Webinar Recording
          </span>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: 400, fontStyle: "italic", fontSize: "clamp(20px,3vw,32px)", lineHeight: 1.2, color: "#fff", marginBottom: 8 }}>
            {webinar_title}
          </h1>
          {expires_at && new Date(expires_at).getFullYear() < 2099 && (
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              Access expires: {formatExpiry(expires_at)}
            </p>
          )}
        </div>

        {videoId
          ? <YouTubePlayer videoId={videoId} />
          : (
            <div style={{ background: "#1a1a1a", borderRadius: 12, padding: "60px 24px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Video not available. Please contact us.</p>
            </div>
          )
        }

        <p style={{ marginTop: 24, fontFamily: "'Inter',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.2)", textAlign: "center", lineHeight: 1.65 }}>
          This recording is provided exclusively to registered attendees of AddedEducation webinars. Please do not share this link.
        </p>
      </main>
    </div>
  )
}
