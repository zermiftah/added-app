import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import { Reveal } from "../../../hooks/useReveal"
import { HERO_IMAGE, UK_TEAM } from "./sharedContent"
import { StatStrip, PillarsSection, TeamSection, CasesSection, StepsSection, HubspotLeadForm, CtaSection, C, serifFont, sansFont, monoFont } from "./SharedSections"

const BOOKING_URL = "https://www.addededucation.com/UK_GetStarted"

export default function UkBrandAwarenessPage() {
  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* Split hero — light, image top-right, form inline */}
      <section style={{ background: `linear-gradient(180deg, ${C.creamWarm}, ${C.cream})`, padding: "clamp(110px,13vw,150px) clamp(20px,5vw,64px) 72px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 56, alignItems: "start" }} className="uk-hero-grid">
          <style>{`@media (max-width: 900px) { .uk-hero-grid { grid-template-columns: 1fr !important; } }`}</style>
          <Reveal>
            <div style={{ borderRadius: 16, overflow: "hidden", height: 200, marginBottom: 24 }}>
              <img src={HERO_IMAGE} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} fetchpriority="high" loading="eager" decoding="async" />
            </div>
            <p style={{ fontFamily: monoFont, fontSize: 10.5, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accent, marginBottom: 18 }}>Premium university admission services</p>
            <h1 style={{ fontFamily: serifFont, fontWeight: 500, fontSize: "clamp(32px,4.8vw,50px)", lineHeight: 1.14, letterSpacing: "-0.02em", color: C.ink, marginBottom: 22 }}>
              Your child has one shot at this application. <em style={{ fontStyle: "italic", color: C.maroon }}>Make it count.</em>
            </h1>
            <p style={{ fontFamily: sansFont, fontSize: 17.5, color: C.stone, marginBottom: 12, fontWeight: 350 }}>
              Two students. Same school. Same predicted grades. Very different offers.
            </p>
            <p style={{ fontFamily: sansFont, fontSize: 15, color: C.stone, marginBottom: 0, lineHeight: 1.65, fontWeight: 350 }}>
              It's not about the grades. It's the story shaped around each applicant, the strategy behind it, and the team that shaped both.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 20, padding: "34px 30px", boxShadow: "0 30px 60px -30px rgba(107,24,24,0.15)" }}>
              <p style={{ fontFamily: sansFont, fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Free 30-minute call</p>
              <h3 style={{ fontFamily: serifFont, fontSize: 22, color: C.ink, marginBottom: 20 }}>See where your child stands</h3>
              <HubspotLeadForm formId="8910e208-bf5a-49ce-8eef-0670ea91043e" dark={false} defaultIso="GB" />
              <a href={BOOKING_URL} style={{ display: "block", textAlign: "center", marginTop: 16, fontFamily: sansFont, fontSize: 12.5, color: C.stone, textDecoration: "none" }}>
                Or book directly on our calendar →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <StatStrip variant="dark" />
      <PillarsSection variant="light" />
      <TeamSection team={UK_TEAM} variant="light" />
      <CasesSection variant="light" />
      <StepsSection variant="light" />
      <CtaSection headline="Find out where your child stands — for free." bookingUrl={BOOKING_URL} />

      <Footer />
    </div>
  )
}
