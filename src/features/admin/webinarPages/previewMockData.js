// Mock "page" data used purely for the admin Theme Preview modal.
// All copy is Lorem Ipsum placeholder text; all photos are real, freely
// licensed Unsplash images related to university admissions/graduation
// (hot-linked directly from images.unsplash.com — no API key needed).
//
// The shape here matches exactly what ThemeHeroFormSide / ThemeHeroCtaStacked /
// ThemeEditorialSplit expect from a real `page` row, so every section
// (hero, why, learn, speakers, about, quote, why-families) always renders.

const unsplash = (id, params = "auto=format&fit=crop&w=1600&q=80") =>
  `https://images.unsplash.com/${id}?${params}`

const avatar = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=facearea&facepad=2.8&w=400&h=400&q=80`

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

const LOREM_MED =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco."

const LOREM_LONG =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."

// Hero image is swapped per theme just for visual variety in the preview.
const HERO_IMAGE_BY_THEME = {
  "hero-form-side":   unsplash("photo-1541339907198-e08756dedf3f"),  // caps thrown in the air
  "hero-cta-stacked": unsplash("photo-1533854775446-95c4609da544"),  // aerial view of graduates
  "editorial-split":  unsplash("photo-1661693758705-4fa65572bced"),  // group in graduation gowns
  "split-portrait":   unsplash("photo-1607013407627-6ee814329547"),  // three grads holding caps up
  "centered-minimal": unsplash("photo-1653945475227-596b295cff01"),  // woman holding diploma
  "bento-grid":       unsplash("photo-1738949537938-bea1011126af"),  // man in cap and gown
}

function buildContentBlock(titlePrefix) {
  return {
    title: `${titlePrefix} — Lorem Ipsum Dolor`,
    subtitle: LOREM_SHORT,
    type: "list",
    body: [
      { title: "Lorem Ipsum Dolor", description: LOREM_MED },
      { title: "Consectetur Adipiscing", description: LOREM_MED },
      { title: "Sed Do Eiusmod Tempor", description: LOREM_SHORT },
    ],
  }
}

export function buildPreviewPage(themeKey) {
  return {
    theme: themeKey,
    webinar_title: "Lorem Ipsum Dolor Sit Amet Consectetur",
    webinar_subtitle: LOREM_MED,
    date_start: new Date(Date.now() + 14 * 86400000).toISOString(),
    date_end: null,
    webinar_date: null,
    webinar_time: "19:00",
    webinar_place: "Online — Zoom",
    grade_years: "Grade 10–12",

    hero_image: HERO_IMAGE_BY_THEME[themeKey] || HERO_IMAGE_BY_THEME["hero-form-side"],

    why_data: buildContentBlock("Why This Matters"),
    learn_data: buildContentBlock("What You'll Learn"),

    speakers: [
      {
        photo: avatar("photo-1689255170275-34db529d1182"),
        name: "Lorem Ipsum",
        title: "Senior Admissions Consultant",
        position: "Ex-Ivy League Admissions Officer",
        description: LOREM_SHORT,
        linkedin: "#",
      },
      {
        photo: avatar("photo-1748542686024-234fc8225ce6"),
        name: "Dolor Sit Amet",
        title: "Head of Curriculum",
        position: "12+ Years in University Counseling",
        description: LOREM_SHORT,
        linkedin: "#",
      },
    ],

    about_data: {
      description: LOREM_LONG,
      universities: ["Oxford", "Cambridge", "Harvard", "MIT", "Stanford", "NUS"],
    },

    quote_data: {
      message: LOREM_MED,
      author: "Lorem Ipsum",
      author_position: "Parent, Class of 2026",
    },

    why_families_data: {
      title: "Lorem Ipsum Dolor Sit Amet",
      description: LOREM_SHORT,
      type: "list",
      body: [
        { title: "Lorem Ipsum", description: LOREM_SHORT },
        { title: "Dolor Sit Amet", description: LOREM_SHORT },
        { title: "Consectetur", description: LOREM_SHORT },
        { title: "Adipiscing Elit", description: LOREM_SHORT },
        { title: "Sed Do Eiusmod", description: LOREM_SHORT },
        { title: "Tempor Incididunt", description: LOREM_SHORT },
      ],
    },
  }
}
