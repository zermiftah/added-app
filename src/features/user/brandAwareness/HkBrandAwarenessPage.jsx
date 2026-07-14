import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import { Reveal } from "../../../hooks/useReveal"
import { HERO_IMAGE } from "./sharedContent"
import { StatStrip, PillarsSection, TeamSection, CasesSection, StepsSection, HubspotLeadForm, CtaSection, C, serifFont, sansFont, monoFont } from "./SharedSections"

const BOOKING_URL = "https://www.addededucation.com/HK_GetStarted"

export default function HkBrandAwarenessPage() {
  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* Split hero — dark, form inline */}
      <section style={{ background: C.ink, padding: "clamp(110px,13vw,150px) clamp(20px,5vw,64px) 72px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "start" }} className="hk-hero-grid">
          <style>{`@media (max-width: 900px) { .hk-hero-grid { grid-template-columns: 1fr !important; } }`}</style>
          <Reveal>
            <p style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, marginBottom: 18 }}>Premium university admission services</p>
            <h1 style={{ fontFamily: serifFont, fontWeight: 500, fontSize: "clamp(32px,4.8vw,50px)", lineHeight: 1.14, letterSpacing: "-0.02em", color: "#fff", marginBottom: 22 }}>
              Your child has one shot at this application. <em style={{ fontStyle: "italic", color: C.accentRose }}>Don't lose at the starting line.</em>
            </h1>
            <p style={{ fontFamily: sansFont, fontSize: 17.5, color: "rgba(255,255,255,0.75)", marginBottom: 12, fontWeight: 350 }}>
              Two students. Same school. Same predicted grades. Very different offers.
            </p>
            <p style={{ fontFamily: sansFont, fontSize: 15, color: "rgba(255,255,255,0.6)", marginBottom: 22, lineHeight: 1.65, fontWeight: 350 }}>
              It's not about the grades. It's the story shaped around each applicant, the strategy behind it, and the team that shaped both.
            </p>
            <p style={{ fontFamily: sansFont, fontStyle: "italic", color: "rgba(255,255,255,0.85)", fontSize: 14.5, marginBottom: 28, paddingLeft: 16, borderLeft: `3px solid ${C.accent}` }}>
              Top universities read your child's school before they read your child. We know how each Hong Kong education system is seen.
            </p>
            <div style={{ borderRadius: 16, overflow: "hidden", height: 220 }}>
              <img src={HERO_IMAGE} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} fetchpriority="high" loading="eager" decoding="async" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "34px 30px" }}>
              <p style={{ fontFamily: sansFont, fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Free 30-minute call</p>
              <h3 style={{ fontFamily: serifFont, fontSize: 22, color: "#fff", marginBottom: 20 }}>See where your child stands</h3>
              <HubspotLeadForm formId="7316ef72-ce7d-4368-8f03-02bcbd3a0e36" dark defaultIso="HK" />
              <a href={BOOKING_URL} style={{ display: "block", textAlign: "center", marginTop: 16, fontFamily: sansFont, fontSize: 12.5, color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                Or book directly on our calendar →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <StatStrip variant="light" />
      <PillarsSection variant="light" />
      <TeamSection variant="light" />
      <CasesSection variant="light" />
      <StepsSection variant="light" />
      <CtaSection headline="Find out where your child stands — for free." bookingUrl={BOOKING_URL} />

      <Footer />
    </div>
  )
}
