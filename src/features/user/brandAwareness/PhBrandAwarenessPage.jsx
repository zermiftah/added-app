import Navbar from "../../../components/Navbar"
import Footer from "../../../components/Footer"
import { Reveal } from "../../../hooks/useReveal"
import { HERO_IMAGE } from "./sharedContent"
import { StatStrip, PillarsSection, TeamSection, CasesSection, StepsSection, CtaSection, C, serifFont, sansFont, monoFont } from "./SharedSections"

const BOOKING_URL = "https://www.addededucation.com/contact-us"

export default function PhBrandAwarenessPage() {
  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <Navbar />

      {/* Card-framed centered hero — image sits inside a rounded card behind the headline */}
      <section style={{ background: C.cream, padding: "clamp(110px,13vw,150px) clamp(20px,5vw,64px) 72px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 380 }}>
            <img src={HERO_IMAGE} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} fetchpriority="high" loading="eager" decoding="async" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(14,14,14,0.15) 0%, rgba(14,14,14,0.82) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "32px clamp(24px,4vw,56px)" }}>
              <Reveal>
                <p style={{ fontFamily: monoFont, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: C.accentRose, marginBottom: 14 }}>From the Philippines to Top US and UK Universities</p>
                <h1 style={{ fontFamily: serifFont, fontWeight: 500, fontSize: "clamp(26px,4.2vw,44px)", lineHeight: 1.18, color: "#fff", margin: 0, maxWidth: 640 }}>
                  Your child has one shot at this application. <em style={{ fontStyle: "italic", color: C.accentRose }}>Make it count.</em>
                </h1>
              </Reveal>
            </div>
          </div>

          <Reveal delay={100}>
            <div style={{ textAlign: "center", marginTop: 36 }}>
              <p style={{ fontFamily: sansFont, fontSize: 17, color: C.stone, marginBottom: 10, fontWeight: 350, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
                Two students. Same school. Same predicted grades. Very different offers.
              </p>
              <p style={{ fontFamily: sansFont, fontSize: 15, color: C.stone, marginBottom: 28, lineHeight: 1.65, fontWeight: 350, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
                It's not about the grades. It's the story shaped around each applicant, the strategy behind it, and the team that shaped both.
              </p>
              <a href={BOOKING_URL} style={{ display: "inline-block", background: C.ink, color: "#fff", borderRadius: 999, padding: "14px 34px", fontFamily: sansFont, fontSize: 14.5, fontWeight: 600, textDecoration: "none" }}>
                Book a free 30-minute call →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <StatStrip variant="dark" />
      <PillarsSection variant="light" />
      <TeamSection variant="light" />
      <CasesSection variant="light" />
      <StepsSection variant="light" />
      <CtaSection headline="Find out where your child stands — for free." bookingUrl={BOOKING_URL} />

      <Footer />
    </div>
  )
}
