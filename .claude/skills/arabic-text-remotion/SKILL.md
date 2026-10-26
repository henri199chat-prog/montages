---
name: arabic-text-remotion
description: Use EVERY time Arabic text appears in a Remotion video (titles, captions, Quran verses, hadith, ads, numbers) - RTL direction and bidi with mixed Latin/numbers, choosing an offline Arabic font, keeping tashkeel (diacritics) intact, no letter-spacing, line breaking, Arabic vs Western numerals, and animating word-by-word without breaking letter joining.
---

# Correct Arabic text in Remotion

Arabic is cursive: letters change shape by position and must stay **joined inside a word**. Most "broken Arabic" bugs
come from splitting a word into separate elements, letter-spacing, a font without the glyphs, or wrong direction.

## 1. Container (always)
```tsx
const arabic: React.CSSProperties = {
  direction: "rtl", unicodeBidi: "isolate", textAlign: "center",
  fontFamily: "Cairo, 'Noto Naskh Arabic', sans-serif", fontWeight: 800,
  letterSpacing: 0,             // NEVER positive letter-spacing on Arabic: it breaks joining
  wordSpacing: "0.05em", lineHeight: 1.5,   // Arabic needs more line-height than Latin (tashkeel above/below)
  fontFeatureSettings: '"liga" 1, "calt" 1', // keep ligatures (لا، لله) — never "liga" 0
  textRendering: "optimizeLegibility",
};
<div dir="rtl" lang="ar" style={arabic}>اجعل ذكر الله رفيقك</div>
```
- `dir="rtl"` + `lang="ar"` on the element. `text-transform`, `font-variant: small-caps`, `text-justify` tricks: never.
- Fonts: load local files from `assets/fonts` (skill `offline-assets`). `@remotion/google-fonts` does not work offline.
  If a glyph is missing Chrome silently falls back to another font → mixed styles. Always set a fallback Arabic font
  that covers everything (Noto Naskh Arabic).

## 2. Font choice
| Use | Fonts |
|---|---|
| Captions / talking head (house style) | **Cairo 900** (Black), Tajawal Black, Almarai ExtraBold |
| Hooks, football, comedy | Lalezar, Changa 800, Marhey (playful) |
| Titles elegant / premium | El Messiri, Reem Kufi, Noto Kufi Arabic |
| Calligraphic titles | Aref Ruqaa |
| HUD / data / UI | IBM Plex Sans Arabic, Readex Pro |
| Hadith, classical quotes with full tashkeel | Amiri, Noto Naskh Arabic, Scheherazade New |
| **Quran verses (Uthmani)** | **Amiri Quran** (or Scheherazade New) — they contain the Quranic marks ۖ ۗ ۚ ۛ ۞ ۩ |
Kufi/geometric display fonts (Lalezar, Reem Kufi, Changa) are weak with full tashkeel: use them for short titles
without diacritics; use Naskh fonts when the text is fully vowelled.

## 3. Tashkeel (diacritics) — keep them intact
- Never split a string between a letter and its harakat; never wrap a single letter in its own span.
- Some display fonts lack harakat → they render from a fallback font and look misplaced. For vowelled text use
  Amiri / Noto Naskh / Scheherazade / Amiri Quran.
- Give room: `lineHeight: 1.6–1.9` for fully vowelled text, and `paddingTop` so shadda/fatha are not clipped by
  `overflow: hidden` parents.
- Normalize copy-pasted Quran text: keep the Uthmani code points (U+06D6–U+06ED marks, U+0670 dagger alif).
  Don't "clean" them with regexes. Verify verses against a trusted mushaf; cite «سورة: آية» small.
- To get a version without tashkeel (e.g. for a Kufi title): `text.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")`.

## 4. Mixed Arabic + Latin + numbers (bidi)
- Wrap each embedded LTR run: `<bdi>` or `<span dir="ltr" style={{unicodeBidi: "isolate"}}>Remotion 4.0</span>`.
- In plain strings use isolates: FSI `\u2068` … PDI `\u2069` around the Latin/number part.
- Punctuation at the end of an RTL line with Latin inside can jump to the wrong side → isolate the Latin part.
- Arabic punctuation: comma «،» (U+060C), question mark «؟» (U+061F), semicolon «؛». Quotes «…».

## 5. Numerals
- Choose one system per video. Maghreb/Tunisian audiences read Western digits (0-9) naturally;
  Eastern Arabic digits (٠١٢٣٤٥٦٧٨٩) give a classical/religious feel.
- `n.toLocaleString("ar-EG")` → ١٢٬٣٤٥ ; `n.toLocaleString("en-US")` → 12,345.
- Counters: use `fontVariantNumeric: "tabular-nums"` (Cairo, IBM Plex, Readex support it) so digits don't jitter.
- Chapter labels: «٠١ / ٠٦ — تأمّل» or «01 / 06».

## 6. Line breaks
- Max 2 lines, ~3–5 words per line for reels. Break by meaning (after a phrase), never inside a word or between
  a word and its attached particle (و، ف، ب، ل are already attached — fine).
- Control breaks yourself with an array of lines rather than relying on auto-wrap:
  `lines.map(l => <div style={{ whiteSpace: "nowrap" }}>{l}</div>)`.
- Width: `maxWidth: 900` (1080 wide comp), `textWrap: "balance"` helps auto breaks.
- Avoid a single orphan word on line 2.

## 7. Word-by-word animation without breaking letters
Split on **spaces only**, animate whole words; the flex container keeps RTL order:
```tsx
const words = "سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ".split(/\s+/);
<div dir="rtl" style={{ ...arabic, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.3em" }}>
  {words.map((w, i) => {
    const p = spring({ frame: frame - i * 5, fps, config: { damping: 14 } });
    return <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>{w}</span>;
  })}
</div>
```
- Highlight the active word with colour/background on the WHOLE word span (not part of it).
- A partial-word reveal (e.g. "writing" effect) must be a mask (`clipPath: inset(0 0 0 X%)` revealing right→left:
  `inset(0 0 0 ${(1 - p) * 100}%)`), not substring slicing — slicing a word changes letter forms mid-animation.
- Typewriter for Arabic = word by word, not character by character.

## 8. Effects on Arabic text
- Strokes: thin (`WebkitTextStroke` 1–3 px, `paintOrder: "stroke fill"`); thick strokes fill the counters of Arabic letters.
- Shadows/glows are fine. Gradients: `background-clip: text` works; keep enough contrast.
- Don't skew/italicise Arabic (no real italics); Cairo has a `slnt` axis if you need slant (`fontVariationSettings: '"slnt" -8'`).
- Uppercase/letter tricks don't exist in Arabic; emphasise by weight, size, colour.

## 9. QA
Render stills of every Arabic text frame (`npx remotion still Comp /tmp/t.png --frame=N`) and check:
letters joined, لا ligature present, tashkeel on the right letters, no tofu boxes (□), correct reading order
with numbers/Latin, nothing clipped at top/bottom.
