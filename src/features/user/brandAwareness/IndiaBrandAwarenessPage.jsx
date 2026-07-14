import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import { Reveal } from "../../../hooks/useReveal"
import { HERO_IMAGE } from "./sharedContent"
import { StatStrip, PillarsSection, TeamSection, CasesSection, StepsSection, CtaSection, C, serifFont, sansFont, monoFont } from "./SharedSections"

const BOOKING_URL = "https://www.addededucation.com/contact-us"

export default function IndiaBrandAwarenessPage() {
  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* Centered hero with full-width image banner below headline */}
      <section style={{ background: `linear-gradient(180deg, ${C.creamWarm}, ${C.cream})`, padding: "clamp(110px,13vw,150px) clamp(20px,5vw,64px) 0", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto 56px" }}>
          <Reveal>
            <p style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, marginBottom: 18 }}>From India to Top US and UK Universities</p>
            <h1 style={{ fontFamily: serifFont, fontWeight: 500, fontSize: "clamp(30px,5vw,54px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: C.ink, marginBottom: 22 }}>
              Your child has one shot at this application. <em style={{ fontStyle: "italic", color: C.maroon }}>Don't leave it to chance.</em>
            </h1>
            <p style={{ fontFamily: sansFont, fontSize: 17.5, color: C.stone, maxWidth: 620, margin: "0 auto 12px", fontWeight: 350 }}>
              Two students. Same school. Same predicted grades. Very different offers.
            </p>
            <p style={{ fontFamily: sansFont, fontSize: 15, color: C.stone, maxWidth: 620, margin: "0 auto 32px", lineHeight: 1.65, fontWeight: 350 }}>
              It's not about the grades. It's the story shaped around each applicant, the strategy behind it, and the team that shaped both.
            </p>
            <a href={BOOKING_URL} style={{ display: "inline-block", background: C.accent, color: "#fff", borderRadius: 999, padding: "14px 34px", fontFamily: sansFont, fontSize: 14.5, fontWeight: 600, textDecoration: "none" }}>
              Book a free 30-minute call →
            </a>
          </Reveal>
        </div>
        <Reveal delay={120}>
          <div style={{ maxWidth: 1000, margin: "0 auto", borderRadius: "20px 20px 0 0", overflow: "hidden", height: 320 }}>
            <img src={HERO_IMAGE} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} fetchpriority="high" loading="eager" decoding="async" />
          </div>
        </Reveal>
      </section>

      <StatStrip variant="light" />
      <PillarsSection variant="dark" />
      <TeamSection variant="light" />
      <CasesSection variant="light" />
      <StepsSection variant="light" />
      <CtaSection headline="Find out where your child stands — for free." bookingUrl={BOOKING_URL} />

      <Footer />
    </div>
  )
}
