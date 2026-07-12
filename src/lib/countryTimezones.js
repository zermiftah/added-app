// Country → primary IANA timezone mapping, used by:
//  - AdminWebinarPages "Place" dropdown (add/edit landing page)
//  - AdminRegistrants "Registered" column (formats each timestamp in the
//    landing page's own place timezone, e.g. "14 Jul 2026, 19:00 SGT")
//
// For countries spanning multiple timezones (US, Russia, Canada, Australia,
// Brazil, etc.) we use the most commonly-referenced zone (usually the
// capital/most populous). "Online" isn't a real country — it's kept as a
// special option that falls back to the visitor's/server's local time with
// no timezone abbreviation forced.

export const COUNTRY_TIMEZONES = [
  { name: "Online", tz: null },
  { name: "Afghanistan", tz: "Asia/Kabul" },
  { name: "Albania", tz: "Europe/Tirane" },
  { name: "Algeria", tz: "Africa/Algiers" },
  { name: "Andorra", tz: "Europe/Andorra" },
  { name: "Angola", tz: "Africa/Luanda" },
  { name: "Argentina", tz: "America/Argentina/Buenos_Aires" },
  { name: "Armenia", tz: "Asia/Yerevan" },
  { name: "Australia", tz: "Australia/Sydney" },
  { name: "Austria", tz: "Europe/Vienna" },
  { name: "Azerbaijan", tz: "Asia/Baku" },
  { name: "Bahamas", tz: "America/Nassau" },
  { name: "Bahrain", tz: "Asia/Bahrain" },
  { name: "Bangladesh", tz: "Asia/Dhaka" },
  { name: "Belarus", tz: "Europe/Minsk" },
  { name: "Belgium", tz: "Europe/Brussels" },
  { name: "Belize", tz: "America/Belize" },
  { name: "Benin", tz: "Africa/Porto-Novo" },
  { name: "Bhutan", tz: "Asia/Thimphu" },
  { name: "Bolivia", tz: "America/La_Paz" },
  { name: "Bosnia and Herzegovina", tz: "Europe/Sarajevo" },
  { name: "Botswana", tz: "Africa/Gaborone" },
  { name: "Brazil", tz: "America/Sao_Paulo" },
  { name: "Brunei", tz: "Asia/Brunei" },
  { name: "Bulgaria", tz: "Europe/Sofia" },
  { name: "Burkina Faso", tz: "Africa/Ouagadougou" },
  { name: "Burundi", tz: "Africa/Bujumbura" },
  { name: "Cambodia", tz: "Asia/Phnom_Penh" },
  { name: "Cameroon", tz: "Africa/Douala" },
  { name: "Canada", tz: "America/Toronto" },
  { name: "Chile", tz: "America/Santiago" },
  { name: "China", tz: "Asia/Shanghai" },
  { name: "Colombia", tz: "America/Bogota" },
  { name: "Costa Rica", tz: "America/Costa_Rica" },
  { name: "Croatia", tz: "Europe/Zagreb" },
  { name: "Cuba", tz: "America/Havana" },
  { name: "Cyprus", tz: "Asia/Nicosia" },
  { name: "Czech Republic", tz: "Europe/Prague" },
  { name: "Denmark", tz: "Europe/Copenhagen" },
  { name: "Dominican Republic", tz: "America/Santo_Domingo" },
  { name: "Ecuador", tz: "America/Guayaquil" },
  { name: "Egypt", tz: "Africa/Cairo" },
  { name: "El Salvador", tz: "America/El_Salvador" },
  { name: "Estonia", tz: "Europe/Tallinn" },
  { name: "Ethiopia", tz: "Africa/Addis_Ababa" },
  { name: "Fiji", tz: "Pacific/Fiji" },
  { name: "Finland", tz: "Europe/Helsinki" },
  { name: "France", tz: "Europe/Paris" },
  { name: "Georgia", tz: "Asia/Tbilisi" },
  { name: "Germany", tz: "Europe/Berlin" },
  { name: "Ghana", tz: "Africa/Accra" },
  { name: "Greece", tz: "Europe/Athens" },
  { name: "Guatemala", tz: "America/Guatemala" },
  { name: "Honduras", tz: "America/Tegucigalpa" },
  { name: "Hong Kong", tz: "Asia/Hong_Kong" },
  { name: "Hungary", tz: "Europe/Budapest" },
  { name: "Iceland", tz: "Atlantic/Reykjavik" },
  { name: "India", tz: "Asia/Kolkata" },
  { name: "Indonesia", tz: "Asia/Jakarta" },
  { name: "Iran", tz: "Asia/Tehran" },
  { name: "Iraq", tz: "Asia/Baghdad" },
  { name: "Ireland", tz: "Europe/Dublin" },
  { name: "Israel", tz: "Asia/Jerusalem" },
  { name: "Italy", tz: "Europe/Rome" },
  { name: "Jamaica", tz: "America/Jamaica" },
  { name: "Japan", tz: "Asia/Tokyo" },
  { name: "Jordan", tz: "Asia/Amman" },
  { name: "Kazakhstan", tz: "Asia/Almaty" },
  { name: "Kenya", tz: "Africa/Nairobi" },
  { name: "Kuwait", tz: "Asia/Kuwait" },
  { name: "Kyrgyzstan", tz: "Asia/Bishkek" },
  { name: "Laos", tz: "Asia/Vientiane" },
  { name: "Latvia", tz: "Europe/Riga" },
  { name: "Lebanon", tz: "Asia/Beirut" },
  { name: "Libya", tz: "Africa/Tripoli" },
  { name: "Liechtenstein", tz: "Europe/Vaduz" },
  { name: "Lithuania", tz: "Europe/Vilnius" },
  { name: "Luxembourg", tz: "Europe/Luxembourg" },
  { name: "Macau", tz: "Asia/Macau" },
  { name: "Madagascar", tz: "Indian/Antananarivo" },
  { name: "Malaysia", tz: "Asia/Kuala_Lumpur" },
  { name: "Maldives", tz: "Indian/Maldives" },
  { name: "Malta", tz: "Europe/Malta" },
  { name: "Mauritius", tz: "Indian/Mauritius" },
  { name: "Mexico", tz: "America/Mexico_City" },
  { name: "Moldova", tz: "Europe/Chisinau" },
  { name: "Monaco", tz: "Europe/Monaco" },
  { name: "Mongolia", tz: "Asia/Ulaanbaatar" },
  { name: "Montenegro", tz: "Europe/Podgorica" },
  { name: "Morocco", tz: "Africa/Casablanca" },
  { name: "Myanmar", tz: "Asia/Yangon" },
  { name: "Namibia", tz: "Africa/Windhoek" },
  { name: "Nepal", tz: "Asia/Kathmandu" },
  { name: "Netherlands", tz: "Europe/Amsterdam" },
  { name: "New Zealand", tz: "Pacific/Auckland" },
  { name: "Nicaragua", tz: "America/Managua" },
  { name: "Nigeria", tz: "Africa/Lagos" },
  { name: "North Macedonia", tz: "Europe/Skopje" },
  { name: "Norway", tz: "Europe/Oslo" },
  { name: "Oman", tz: "Asia/Muscat" },
  { name: "Pakistan", tz: "Asia/Karachi" },
  { name: "Panama", tz: "America/Panama" },
  { name: "Papua New Guinea", tz: "Pacific/Port_Moresby" },
  { name: "Paraguay", tz: "America/Asuncion" },
  { name: "Peru", tz: "America/Lima" },
  { name: "Philippines", tz: "Asia/Manila" },
  { name: "Poland", tz: "Europe/Warsaw" },
  { name: "Portugal", tz: "Europe/Lisbon" },
  { name: "Qatar", tz: "Asia/Qatar" },
  { name: "Romania", tz: "Europe/Bucharest" },
  { name: "Russia", tz: "Europe/Moscow" },
  { name: "Rwanda", tz: "Africa/Kigali" },
  { name: "Saudi Arabia", tz: "Asia/Riyadh" },
  { name: "Senegal", tz: "Africa/Dakar" },
  { name: "Serbia", tz: "Europe/Belgrade" },
  { name: "Singapore", tz: "Asia/Singapore" },
  { name: "Slovakia", tz: "Europe/Bratislava" },
  { name: "Slovenia", tz: "Europe/Ljubljana" },
  { name: "South Africa", tz: "Africa/Johannesburg" },
  { name: "South Korea", tz: "Asia/Seoul" },
  { name: "Spain", tz: "Europe/Madrid" },
  { name: "Sri Lanka", tz: "Asia/Colombo" },
  { name: "Sweden", tz: "Europe/Stockholm" },
  { name: "Switzerland", tz: "Europe/Zurich" },
  { name: "Taiwan", tz: "Asia/Taipei" },
  { name: "Tajikistan", tz: "Asia/Dushanbe" },
  { name: "Tanzania", tz: "Africa/Dar_es_Salaam" },
  { name: "Thailand", tz: "Asia/Bangkok" },
  { name: "Tunisia", tz: "Africa/Tunis" },
  { name: "Turkey", tz: "Europe/Istanbul" },
  { name: "Turkmenistan", tz: "Asia/Ashgabat" },
  { name: "Uganda", tz: "Africa/Kampala" },
  { name: "Ukraine", tz: "Europe/Kyiv" },
  { name: "United Arab Emirates", tz: "Asia/Dubai" },
  { name: "United Kingdom", tz: "Europe/London" },
  { name: "United States", tz: "America/New_York" },
  { name: "Uruguay", tz: "America/Montevideo" },
  { name: "Uzbekistan", tz: "Asia/Tashkent" },
  { name: "Venezuela", tz: "America/Caracas" },
  { name: "Vietnam", tz: "Asia/Ho_Chi_Minh" },
  { name: "Yemen", tz: "Asia/Aden" },
  { name: "Zambia", tz: "Africa/Lusaka" },
  { name: "Zimbabwe", tz: "Africa/Harare" },
]

const TZ_BY_NAME = Object.fromEntries(COUNTRY_TIMEZONES.map(c => [c.name, c.tz]))

// Look up the IANA timezone for a saved `webinar_place` value.
// Handles legacy free-text values gracefully (e.g. "Online via Zoom" still
// matches "Online" via substring check) so old pages don't break.
export function getTimezoneForPlace(place) {
  if (!place) return null
  if (TZ_BY_NAME[place]) return TZ_BY_NAME[place]
  const lower = place.toLowerCase()
  if (lower.includes("online") || lower.includes("zoom") || lower.includes("virtual")) return null
  const match = COUNTRY_TIMEZONES.find(c => c.name && lower.includes(c.name.toLowerCase()))
  return match?.tz || null
}

// Intl only gives friendly abbreviations (EDT, BST, etc.) to zones that
// actually observe DST — fixed-offset zones like Singapore or Jakarta just
// come back as "GMT+8" / "GMT+7", which reads as generic and unfamiliar.
// Override with the commonly-recognized local abbreviation for markets
// AddedEducation actually operates in.
const ABBR_OVERRIDES = {
  "Asia/Singapore": "SGT",
  "Asia/Hong_Kong": "HKT",
  "Asia/Jakarta": "WIB",
  "Asia/Kuala_Lumpur": "MYT",
  "Asia/Manila": "PHT",
  "Asia/Bangkok": "ICT",
  "Asia/Ho_Chi_Minh": "ICT",
  "Asia/Kolkata": "IST",
  "Asia/Shanghai": "CST",
  "Asia/Tokyo": "JST",
  "Asia/Seoul": "KST",
  "Asia/Dubai": "GST",
}

// Short timezone abbreviation for a given IANA zone at a given date
// (DST-aware — e.g. "GMT" vs "BST" for London depending on time of year).
export function getTzAbbr(tz, date = new Date()) {
  if (!tz) return null
  if (ABBR_OVERRIDES[tz]) return ABBR_OVERRIDES[tz]
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(date)
    return parts.find(p => p.type === "timeZoneName")?.value || null
  } catch {
    return null
  }
}

// MySQL returns DATETIME/TIMESTAMP columns as plain strings like
// "2026-07-12 13:29:00" (dateStrings:true, config/db.js), with NO
// timezone marker — even though the value itself IS true UTC
// (config/db.js sets `timezone: "+00:00"` on the connection).
// `new Date("2026-07-12 13:29:00")` would otherwise be parsed as the
// *viewer's own local time*, silently shifting the instant by their
// browser's UTC offset before any real timezone conversion happens.
// Always force explicit UTC interpretation before converting.
function parseUtc(dt) {
  if (!dt) return null
  const iso = String(dt).trim().replace(" ", "T")
  return new Date(iso.endsWith("Z") ? iso : iso + "Z")
}

// Format a UTC datetime string into "14 Jul 2026, 19:00 SGT" using the
// timezone derived from a webinar_place value. Falls back to browser-local
// time (no forced abbreviation) when place is "Online" or unrecognized.
export function formatInPlaceTimezone(dt, place) {
  if (!dt) return "—"
  const date = parseUtc(dt)
  const tz = getTimezoneForPlace(place)
  const opts = { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }
  const formatted = date.toLocaleString("en-GB", tz ? { ...opts, timeZone: tz } : { ...opts, timeZone: "UTC" })
  const abbr = getTzAbbr(tz, date)
  return abbr ? `${formatted} ${abbr}` : `${formatted} UTC`
}
