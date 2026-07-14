import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import { Reveal } from "../../../hooks/useReveal"
import { HERO_IMAGE } from "./sharedContent"
import { StatStrip, PillarsSection, TeamSection, CasesSection, StepsSection, CtaSection, C, serifFont, sansFont, monoFont } from "./SharedSections"

const BOOKING_URL = "https://www.addededucation.com/contact-us"

export default function UaeBrandAwarenessPage() {
  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* Dark centered hero — thin gold-toned rule framing, image as a wide letterboxed strip */}
      <section style={{ background: C.ink, padding: "clamp(110px,13vw,150px) clamp(20px,5vw,64px) 0" }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
              <span style={{ width: 28, height: 1, background: "rgba(232,180,189,0.5)" }} />
              <p style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: "0.2em", textTransform: "uppercase", color: C.accentRose, margin: 0 }}>From the UAE to Top US and UK Universities</p>
              <span style={{ width: 28, height: 1, background: "rgba(232,180,189,0.5)" }} />
            </div>
            <h1 style={{ fontFamily: serifFont, fontWeight: 500, fontSize: "clamp(32px,5.6vw,58px)", lineHeight: 1.12, color: "#fff", marginBottom: 24 }}>
              Your child has one shot at this application. <em style={{ fontStyle: "italic", color: C.accentRose }}>Make it count.</em>
            </h1>
            <p style={{ fontFamily: sansFont, fontSize: 17, color: "rgba(255,255,255,0.7)", marginBottom: 12, fontWeight: 350, maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>
              Two students. Same school. Same predicted grades. Very different offers.
            </p>
            <p style={{ fontFamily: sansFont, fontSize: 15, color: "rgba(255,255,255,0.55)", marginBottom: 34, lineHeight: 1.65, fontWeight: 350, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
              It's not about the grades. It's the story shaped around each applicant, the strategy behind it, and the team that shaped both.
            </p>
            <a href={BOOKING_URL} style={{ display: "inline-block", background: "transparent", border: `1px solid ${C.accentRose}`, color: "#fff", borderRadius: 999, padding: "13px 32px", fontFamily: sansFont, fontSize: 14, fontWeight: 500, textDecoration: "none", marginBottom: 56 }}>
              Book a free 30-minute call →
            </a>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div style={{ maxWidth: 1180, margin: "0 auto", borderRadius: "20px 20px 0 0", overflow: "hidden", height: 260 }}>
            <img src={HERO_IMAGE} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} fetchpriority="high" loading="eager" decoding="async" />
          </div>
        </Reveal>
      </section>

      <StatStrip variant="light" />
      <PillarsSection variant="dark" />
      <TeamSection variant="light" />
      <CasesSection variant="dark" />
      <StepsSection variant="light" />
      <CtaSection headline="Find out where your child stands — for free." bookingUrl={BOOKING_URL} />

      <Footer />
    </div>
  )
}
