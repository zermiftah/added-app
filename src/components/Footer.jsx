const FOOTER_LINKS = {
  "Our Programs": ["Academic Pathways", "Athlete Recruitment", "Essay Guidance", "Interview Prep"],
  "Company": ["About Us", "Our Team", "Careers", "Press"],
  "Resources": ["Blog", "Webinars", "Events", "Student Stories"],
  "Legal": ["Privacy Policy", "Terms of Service", "Cookie Policy"],
}

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/addededucation", icon: "IG" },
  { label: "LinkedIn", href: "https://linkedin.com/company/addededucation", icon: "LI" },
  { label: "YouTube", href: "https://youtube.com/@addededucation", icon: "YT" },
]

export default function Footer() {
  return (
    <footer className="w-full bg-ink border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
      <div className="w-full px-6 lg:px-20 py-16 lg:py-20">
        {/* Top row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <img
              src="https://zmiftah.tech/addedapi/uploads/addededucation-assets/asset_1782570954773_Horizontal___Maroon.webp"
              alt="AddedEducation"
              width={180} height={36}
              className="h-9 object-contain mb-5"
            />
            <p className="font-inter text-stone-light leading-relaxed mb-5" style={{ fontSize: 13, fontWeight: 350 }}>
              Premium university admissions guidance for families worldwide.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-mono text-[10px] font-600 text-stone-light hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="font-mono text-white text-[10px] font-600 uppercase tracking-[0.18em] mb-5">{title}</p>
              <ul className="flex flex-col gap-3">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-inter text-stone-light hover:text-white transition-colors"
                      style={{ fontSize: 13, fontWeight: 350 }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px mb-8" style={{ background: "rgba(255,255,255,0.07)" }} />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-inter text-stone-light" style={{ fontSize: 12, fontWeight: 350 }}>
            © {new Date().getFullYear()} AddedEducation. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="font-mono text-[10px] text-stone-light uppercase tracking-widest">Families in 12+ countries</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
