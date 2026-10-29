import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { NavyBackground, TextShield } from "./NavyBackground";
import { HudFrame, ProgressTicks } from "./HudFrame";
import { AyahKaraoke, pageAt } from "./AyahKaraoke";
import { LogoIntro, LogoOutro, worldFade } from "./LogoBrand";
import { InkLayer } from "./InkBoil";
import { useReligiousFonts, FPS } from "./theme";
import type { AyahData } from "./types";

/**
 * TEMPLATE for a Quran recitation reel in Ayman's style. Copy this file per video (e.g. LuqmanReel.tsx)
 * and write the visuals in `scene` (line-art / character / soul layer) keyed to word onsets in `data`.
 * Layer order = 002 reel: background+dust -> scene (camera moves only this) -> text shield -> HUD -> verse -> logo/outro -> grain.
 * Sound: ONE pre-mixed file (clean voice + reverb + −35 dBFS drone, mastered −14 LUFS / −1 dBTP) made with
 * religious/tools/mix_master.py. NO sound effects on Quran recitation.
 */
export type RecitationReelProps = {
  data: AyahData;
  audio?: string; // path inside video/public, e.g. "religious/tawbah/mix.wav"
  hudLeft: (page: number, ayah: number) => string; // e.g. (p, n) => `QURAN · 09:${n}`
  category?: string; // «القرآن الكريم»
  topic: string; // «سورة التوبة»
  title: string; // "AT-TAWBAH · 9 : 102 — 104"
  counter?: (page: number, ayah: number) => string; // e.g. (p, n) => `0${n - 101} / 03`
  scene?: (t: number, page: number) => React.ReactNode; // your visuals (SVG 1080x1920 recommended)
  camera?: (t: number) => { s: number; x: number; y: number }; // slow push/pull, never a cut
  dustBoost?: (t: number) => number;
  cta?: React.ReactNode;
  /** style v2: hand-inked boil + brush grain on the scene layer (default on; false = clean vector lines) */
  ink?: boolean;
};

export const RecitationReel: React.FC<RecitationReelProps> = ({
  data,
  audio,
  hudLeft,
  category = "القرآن الكريم",
  topic,
  title,
  counter,
  scene,
  camera,
  dustBoost,
  cta,
  ink = true,
}) => {
  const ready = useReligiousFonts();
  const t = useCurrentFrame() / FPS;
  if (!ready) return null;
  const k = pageAt(data, t);
  const n = data.pages[k].n;
  const last = data.pages[data.pages.length - 1];
  const outroAt = last.words[last.words.length - 1].off + 0.25;
  const switches = data.pages.slice(0, -1).map((p, i) => Math.min(p.end, data.pages[i + 1].start - 0.25));
  const cam = camera ? camera(t) : { s: 1, x: 540, y: 960 };
  return (
    <AbsoluteFill>
      <NavyBackground dustBoost={dustBoost ? dustBoost(t) : 1}>
        <AbsoluteFill
          style={{
            opacity: worldFade(t, outroAt),
            transform: `translate(${540 - cam.x}px, ${960 - cam.y}px) scale(${cam.s})`,
            transformOrigin: `${cam.x}px ${cam.y}px`,
          }}
        >
          {ink ? <InkLayer>{scene?.(t, k)}</InkLayer> : scene?.(t, k)}
        </AbsoluteFill>
        <TextShield />
        <HudFrame
          left={hudLeft(k, n)}
          category={category}
          topic={topic}
          title={title}
          counter={counter?.(k, n)}
          outAt={outroAt}
          switches={switches}
        />
        <ProgressTicks count={data.pages.length} index={k} opacity={worldFade(t, outroAt) * (t > 2 ? 1 : 0)} />
        <AyahKaraoke data={data} />
        <LogoIntro />
        <LogoOutro outroAt={outroAt} total={data.total} cta={cta} />
      </NavyBackground>
      {audio && <Audio src={staticFile(audio)} />}
    </AbsoluteFill>
  );
};
