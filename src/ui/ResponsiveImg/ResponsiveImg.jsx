/**
 * ResponsiveImg — auto-uses _sm.webp variant on mobile via srcset.
 * 
 * Usage: <ResponsiveImg src="https://.../asset_xxx.webp" alt="..." style={{...}} />
 * 
 * Browser akan pilih:
 *  - _sm.webp (640px wide) saat viewport ≤ 768px
 *  - .webp original (1000px wide) saat viewport > 768px
 * 
 * Kalau src bukan URL backend yang punya _sm variant, fallback ke regular <img>.
 */
export default function ResponsiveImg({ src, alt = "", srcSm, loading = "lazy", decoding = "async", ...rest }) {
  if (!src) return <img alt={alt} loading={loading} decoding={decoding} {...rest} />

  // Auto-derive _sm URL from main URL if not explicitly passed
  // Matches: .../asset_xxx.webp → .../asset_xxx_sm.webp
  const smUrl = srcSm || (
    typeof src === "string" && src.match(/\.webp$/i)
      ? src.replace(/\.webp$/i, "_sm.webp")
      : null
  )

  if (!smUrl) return <img src={src} alt={alt} loading={loading} decoding={decoding} {...rest} />

  return (
    <img
      src={src}
      srcSet={`${smUrl} 640w, ${src} 1000w`}
      sizes="(max-width: 768px) 100vw, 50vw"
      alt={alt}
      loading={loading}
      decoding={decoding}
      {...rest}
    />
  )
}
