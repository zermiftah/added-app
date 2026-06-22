const STATS = [
  { value: "3170+", label: "students guided across 12 countries" },
  { value: "20%", label: "Ivy acceptance rate, 5x the global average of 4%" },
  { value: "812", label: "Offers from top-20 universities" },
  { value: "3:1", label: "Each student admitted to at least 3 of their top 3 choices" },
]

export default function StatsSection() {
  return (
    <section className="w-full bg-cream py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className={`text-center lg:text-left ${i < 3 ? "lg:border-r lg:border-black/8 lg:pr-8" : ""}`}
            >
              <div
                className="font-fraunces font-400 text-accent leading-none mb-3"
                style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
              >
                {stat.value}
              </div>
              <p
                className="font-inter text-stone leading-snug"
                style={{ fontSize: 13, fontWeight: 400 }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
