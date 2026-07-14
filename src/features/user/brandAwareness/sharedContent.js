// Shared content across all 7 brand-awareness pages — the counselor team
// and case studies are the same global roster/bank used in every regional
// Framer source file (confirmed identical across hk-ba/india/indo/ph/sg/uae).
// Only UK swaps in a regional specialist (Charan Bansal) in place of Ashni.

export const STATS = [
  { n: "3,170+", l: "students guided across 12 countries" },
  { n: "20%", l: "Ivy acceptance rate — 5x the global average" },
  { n: "812+", l: "offers from top-20 universities" },
  { n: "93%", l: "placed in a top-3 target school" },
]

export const TEAM = [
  {
    name: "Kevin DuPont", role: "Senior Lead Counselor", initials: "KD",
    bio: "A former admissions officer at four US universities — Cornell, UVA, UC Berkeley, and Tufts — Kevin has read applications on both sides of the desk for over 9 years. MA in Law & Diplomacy from Tufts; NCAA tennis coach with specific expertise in athletic recruitment.",
  },
  {
    name: "Ria Birowo", role: "Senior Lead Counselor", initials: "RB",
    bio: "A University of Chicago graduate and former UChicago Admissions Reader, Ria specialises in dual undergraduate-postgraduate strategies, non-standard curricula, and students applying across US, UK and global universities in a single cycle.",
  },
  {
    name: "Andrew Maruca", role: "Senior Lead Counselor & Head of Writing", initials: "AM",
    bio: "A Williams College graduate and former varsity squash captain who attended Phillips Exeter Academy. His students have gained acceptances to Stanford, MIT, Harvard, Columbia, Brown, Dartmouth, UChicago, Cambridge, and LSE.",
  },
  {
    name: "Ashni Kothari", role: "Senior Lead Counselor", initials: "AK",
    bio: "A Psychology and Education graduate from Sarah Lawrence College who worked in the university's admissions office. A certified psychologist running psychometric assessments aligned to aptitude, personality and interests.",
  },
]

export const UK_TEAM = [
  TEAM[0], TEAM[1], TEAM[2],
  {
    name: "Charan Bansal", role: "Senior Lead Counselor, UK", initials: "CB",
    bio: "Charan leads AddedEducation's UK counselling and has worked with British families across a wide range of school types. She understands how the school environment shapes a student's preparation and what it takes to stand out.",
  },
]

export const CASES = [
  {
    name: "Riyana R.", tag: "CMU '28 · Psychology · IB 40/42 · Mumbai, India",
    snapshot: "Quiet, reserved, hesitant to speak in early sessions. Loved dance and psychology but couldn't see how they connected on an application.",
    built: "In our early sessions, we spent weeks helping Riyana find her voice, and identify the single thread her scattered interests had in common: human development, seen through movement. That thread became \"The Dance of Life\", a public performance in India promoting organ donation, which raised over INR 100,000 for the cause.",
    outcome: "Carnegie Mellon University, Psychology.",
  },
  {
    name: "Aditya I.", tag: "Cornell '27 · Statistical Sciences · IB 42/42",
    snapshot: "Strong grades. Torn between Engineering and Applied Math. Interests scattered across Math Olympiads, a rain water harvesting project, and tennis.",
    built: "We settled on one direction: the application of Math to real-world problems. We arranged research with an IIT professor, placed him in the Cambridge CCIR programme, and co-developed a platform profiling tennis ball boys from low socio-economic backgrounds.",
    outcome: "Cornell University, ED1 · IB 42/42.",
  },
  {
    name: "Piper Y.", tag: "UC Berkeley '27 · Economics · Philippines · SAT 1510",
    snapshot: "A long-time interest in the arts running alongside a serious interest in economics. Two passions competing for space on one application.",
    built: "We helped Piper fuse them: Zarabica, a sustainable coffee business sourcing ethical beans and reinvesting proceeds in arts workshops for underprivileged youth. Economics became the vehicle. Art became the mission.",
    outcome: "UC Berkeley, Economics · plus CMU.",
  },
  {
    name: "Ishan V.", tag: "Columbia '30 & Cambridge · Engineering · SAT 1540",
    snapshot: "High academic performer with genuine passion for engineering and sustainability. The grades were there. The application wasn't yet.",
    built: "We positioned engineering as the through-line and sustainability as the applied lens, backing his profile with Gold in the British Physics Olympiad, the Senior Physics Challenge, the Senior Math Challenge, and the Ridsdale Physics Prize.",
    outcome: "Columbia, Cornell, Cambridge, UCL, King's, Warwick.",
  },
]

export const PILLARS = [
  { t: "A spike.", d: "One genuine academic interest, pursued further than school requires. Not ten activities. One direction." },
  { t: "Depth.", d: "Reading, projects, research — proof they went beyond the syllabus." },
  { t: "Initiative.", d: "Something they started, built or led. Universities admit people who make things happen." },
  { t: "Evidence.", d: "It has to be real, and it has to show." },
]

export const STEPS = [
  { t: "Find out where your child stands.", d: "A free 30-minute call. We'll tell you honestly what's strong, what's missing, and 2-3 concrete next steps — whether you work with us or not." },
  { t: "Build the plan.", d: "A roadmap for their spike, subjects and applications, matched to their curriculum and timeline." },
  { t: "Do the work, together.", d: "One lead counselor, regular sessions, real projects. Your family always knows what's next and why." },
]

export const HERO_IMAGE = "https://addededucation.com/addedapi/uploads/addededucation-assets/asset_1784001890903_SztEJ6TjjqSBhSx1XRZ03deUDs__1_.webp"
