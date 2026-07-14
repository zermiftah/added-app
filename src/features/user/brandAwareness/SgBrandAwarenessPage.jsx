import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import { Reveal } from "../../../hooks/useReveal"
import { HERO_IMAGE } from "./sharedContent"
import { StatStrip, PillarsSection, TeamSection, CasesSection, StepsSection, CtaSection, C, serifFont, sansFont, monoFont } from "./SharedSections"

const BOOKING_URL = "https://www.addededucation.com/contact-us"

export default function SgBrandAwarenessPage() {
  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* Split hero — image dominant right column, full height */}
      <section style={{ padding: "clamp(110px,13vw,150px) clamp(20px,5vw,64px) 72px", background: C.cream }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 56, alignItems: "center" }} className="sg-hero-grid">
          <style>{`@media (max-width: 900px) { .sg-hero-grid { grid-template-columns: 1fr !important; } }`}</style>
          <Reveal>
            <p style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, marginBottom: 18 }}>Premium university admission services</p>
            <h1 style={{ fontFamily: serifFont, fontWeight: 500, fontSize: "clamp(32px,5vw,52px)", lineHeight: 1.12, letterSpacing: "-0.02em", color: C.ink, marginBottom: 22 }}>
              Your child has one shot at this application. <em style={{ fontStyle: "italic", color: C.maroon }}>Make it count.</em>
            </h1>
            <p style={{ fontFamily: sansFont, fontSize: 17, color: C.stone, marginBottom: 12, fontWeight: 350 }}>
              Two students. Same school. Same predicted grades. Very different offers.
            </p>
            <p style={{ fontFamily: sansFont, fontSize: 15, color: C.stone, marginBottom: 28, lineHeight: 1.65, fontWeight: 350 }}>
              It's not about the grades. It's the story shaped around each applicant, the strategy behind it, and the team that shaped both.
            </p>
            <a href={BOOKING_URL} style={{ display: "inline-block", background: C.accent, color: "#fff", borderRadius: 999, padding: "14px 34px", fontFamily: sansFont, fontSize: 14.5, fontWeight: 600, textDecoration: "none" }}>
              Book a free 30-minute call →
            </a>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ borderRadius: 20, overflow: "hidden", aspectRatio: "4/5" }}>
              <img src={HERO_IMAGE} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} fetchpriority="high" loading="eager" decoding="async" />
            </div>
          </Reveal>
        </div>
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
