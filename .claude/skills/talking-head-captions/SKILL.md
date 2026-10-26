---
name: talking-head-captions
description: Use when adding animated word-by-word captions (subtitles) to a talking-head reel, voiceover video, TTS ad or podcast clip in Remotion - Arabic or Latin - including timing from TTS word files, SRT, or analyze-audio segments, the AG Anime house caption style (Cairo Black, white with active word yellow, dark pill, lower third), chunking rules and safe zones.
---

# Captions for talking-head / VO reels

## Timing sources (best first)
1. TTS word timings: `audio/*_timing.json` (`words` field) or `audio/*_words.srt` — exact.
2. A provided SRT / JSON transcript from the user.
3. Offline estimate: `scripts/analyze-audio vo.mp3 --lines script.txt` → line times; inside a line, distribute words by
   character count (see `audio-analysis`). Mark as estimated; check stills.
(There is no speech-to-text model offline; if no transcript exists, ask the user for the script text.)

Parse an SRT (no packages):
```ts
export const parseSrt = (srt: string) => srt.trim().split(/\r?\n\r?\n/).map((b) => {
  const [, time, ...text] = b.split(/\r?\n/);
  const [a, z] = time.split(" --> ").map((t) => { const [h, m, s] = t.replace(",", ".").split(":"); return +h * 3600 + +m * 60 + +s; });
  return { start: a, end: z, text: text.join(" ") };
});
```
Store the SRT text in a `.ts` file (`export const SRT = \`...\``) or load it with `staticFile` + `fetch` inside
`delayRender`/`continueRender`.

## Chunking rules
- ≤ 4 words (≤ ~22 characters) per chunk, 1 line (2 max), max width 880 px.
- Break at sentence ends, commas, pauses > 0.45 s; keep pairs together (name + title, number + unit); merge orphan single words.
- Chunk start = first word − 0.03 s; end = last word + 0.3 s or next chunk − 0.02 s (no overlap, no flicker gaps < 3 frames).
- Highlight switches exactly at each word onset.

```ts
type W = { text: string; start: number; end: number };
export const chunk = (words: W[], maxWords = 4, maxGap = 0.45) => {
  const out: W[][] = []; let cur: W[] = [];
  words.forEach((w, i) => {
    const gap = i ? w.start - words[i - 1].end : 0;
    const endPunct = i && /[.!?؟،,]$/.test(words[i - 1].text);
    if (cur.length && (cur.length >= maxWords || gap > maxGap || endPunct)) { out.push(cur); cur = []; }
    cur.push(w);
  });
  if (cur.length) out.push(cur);
  // merge a trailing orphan
  for (let i = out.length - 1; i > 0; i--) if (out[i].length === 1 && out[i - 1].length < maxWords) { out[i - 1].push(...out[i]); out.splice(i, 1); }
  return out;
};
```

## House style component (AG Anime: Cairo Black, white, active word yellow, dark pill, lower third)
```tsx
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
export const Captions: React.FC<{ chunks: W[][]; rtl?: boolean }> = ({ chunks, rtl = true }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig(); const t = frame / fps;
  const c = chunks.find((ch) => t >= ch[0].start - 0.03 && t < ch[ch.length - 1].end + 0.3);
  if (!c) return null;
  const inF = Math.round((c[0].start - 0.03) * fps);
  const pop = spring({ frame: frame - inF, fps, config: { damping: 15, stiffness: 220 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 1920 - 1640 - 60 }}>
      <div dir={rtl ? "rtl" : "ltr"} style={{
        direction: rtl ? "rtl" : "ltr", display: "flex", gap: "0 0.3em", flexWrap: "wrap", justifyContent: "center",
        maxWidth: 880, padding: "12px 30px", borderRadius: 26, background: "rgba(10,10,14,0.62)",
        fontFamily: "Cairo", fontWeight: 900, fontSize: 68, lineHeight: 1.35, letterSpacing: 0, color: "#fff",
        textShadow: "0 3px 10px rgba(0,0,0,0.55)", transform: `scale(${0.85 + 0.15 * pop})`,
      }}>
        {c.map((w, i) => {
          const active = t >= w.start && t < (c[i + 1]?.start ?? w.end + 0.3);
          return <span key={i} style={{ color: active ? "#FFE612" : "#fff", display: "inline-block",
            transform: active ? "scale(1.06)" : "none" }}>{w.text}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};
```
Centre exactly (x = 540 of 1080), fixed vertical position (pill centre ≈ y 1640 on 1920; move up to ≈ 1450 when
platform UI or a B-roll lower third would cover it). Special words: red `#F02B3A` (mystery) or gold `#D9B56A`; only keywords.
Load Cairo from `assets/fonts/Cairo/Cairo-Variable.woff2` (skill `offline-assets`).

## Variants
- Karaoke fill: active word gets a background pill `background: "#FFE612", color: "#000", borderRadius: 10, padding: "0 10px"`.
- Bouncy (comedy): each word `spring` from scale 0.5 on its onset, emoji after punchlines.
- Minimal (religious/premium): no pill, IBM Plex Sans Arabic 600, opacity fade 6 frames, gold keyword.
- Bilingual: Arabic main line + small Latin line below at 45 % size, never two translations at once.

## QA
Caption never covers the face/eyes or the platform UI; no frame with two chunks; highlight on the right word
(render stills at 3 word onsets); Arabic shaped correctly (see `arabic-text-remotion`).
