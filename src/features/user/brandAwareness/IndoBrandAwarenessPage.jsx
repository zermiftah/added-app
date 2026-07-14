import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import { Reveal } from "../../../hooks/useReveal"
import { HERO_IMAGE } from "./sharedContent"
import { StatStrip, PillarsSection, TeamSection, CasesSection, StepsSection, CtaSection, C, serifFont, sansFont, monoFont } from "./SharedSections"

const BOOKING_URL = "https://www.addededucation.com/contact-us"

export default function IndoBrandAwarenessPage() {
  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* Full-bleed dark hero with background image + glow */}
      <section style={{ position: "relative", minHeight: "72vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src={HERO_IMAGE} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} fetchpriority="high" loading="eager" decoding="async" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,14,14,0.55) 0%, rgba(14,14,14,0.88) 100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 50% at 50% 20%, rgba(200,53,75,0.22), transparent)` }} />
        </div>
        <div style={{ position: "relative", zIndex: 1, maxWidth: 780, margin: "0 auto", padding: "clamp(110px,13vw,150px) clamp(20px,5vw,64px) 72px", textAlign: "center" }}>
          <Reveal>
            <p style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accentRose, marginBottom: 20 }}>From Indonesia to Top US and UK Universities</p>
            <h1 style={{ fontFamily: serifFont, fontWeight: 500, fontSize: "clamp(30px,5vw,50px)", lineHeight: 1.15, color: "#fff", marginBottom: 22 }}>
              Your child has one shot at this application. <em style={{ fontStyle: "italic", color: C.accentRose }}>Make it count.</em>
            </h1>
            <p style={{ fontFamily: sansFont, fontSize: 17, color: "rgba(255,255,255,0.75)", marginBottom: 12, fontWeight: 350 }}>
              Two students. Same school. Same predicted grades. Very different offers.
            </p>
            <p style={{ fontFamily: sansFont, fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 32, lineHeight: 1.65, fontWeight: 350, maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>
              It's not about the grades. It's the story shaped around each applicant, the strategy behind it, and the team that shaped both.
            </p>
            <a href={BOOKING_URL} style={{ display: "inline-block", background: C.accent, color: "#fff", borderRadius: 999, padding: "14px 34px", fontFamily: sansFont, fontSize: 14.5, fontWeight: 600, textDecoration: "none" }}>
              Book a free 30-minute call →
            </a>
          </Reveal>
        </div>
      </section>

      <StatStrip variant="light" />
      <PillarsSection variant="light" />
      <TeamSection variant="dark" />
      <CasesSection variant="light" />
      <StepsSection variant="dark" />
      <CtaSection headline="Find out where your child stands — for free." bookingUrl={BOOKING_URL} />

      <Footer />
    </div>
  )
}
