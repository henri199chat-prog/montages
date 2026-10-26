import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TasbihAd, TIMING } from "./TasbihAd";

const { PHONE_IN, TAPS, DONE_FRAME, MORNING_TAP, EVENING_TAP, OUTRO, tapFrame } = TIMING;
const LOGO = OUTRO + 12;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sec = (s: number) => Math.round(s * 30);

// One-shot sound placed on its event frame.
const Sfx: React.FC<{ at: number; src: string; volume: number; len?: number }> = ({ at, src, volume, len = 90 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={len} layout="none">
    <Audio src={staticFile(`sfx/${src}.mp3`)} volume={volume} />
  </Sequence>
);

const Soundtrack: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <>
      {/* calm bed under everything, no music */}
      <Audio
        src={staticFile("sfx/drone_calm_low_loop.mp3")}
        loop
        volume={(f) => 0.1 * interpolate(f, [0, 20, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], clamp)}
      />

      {/* intro: star, then the three phrases */}
      <Sfx at={2} src="sparkle_02" volume={0.22} len={50} />
      <Sfx at={10} src="tick_soft_01" volume={0.28} len={15} />
      <Sfx at={30} src="tick_soft_01" volume={0.28} len={15} />
      <Sfx at={50} src="tick_soft_01" volume={0.28} len={15} />

      {/* phone rises: whoosh peaks ~40% in */}
      <Sfx at={PHONE_IN - sec(0.5)} src="whoosh_soft_01" volume={0.35} len={sec(1.36)} />

      {/* a click on every tap, alternating variants */}
      {Array.from({ length: TAPS }, (_, k) => (
        <Sfx key={k} at={tapFrame(k + 1)} src={k % 2 ? "click_02" : "click_01"} volume={0.3} len={6} />
      ))}

      {/* round complete */}
      <Sfx at={DONE_FRAME} src="chime_soft_01" volume={0.35} len={sec(5)} />
      <Sfx at={DONE_FRAME + 2} src="shimmer_01" volume={0.22} len={sec(3)} />

      {/* tabs: tap, screen swipe, and a page turn for the adhkar book */}
      <Sfx at={MORNING_TAP} src="click_01" volume={0.3} len={6} />
      <Sfx at={MORNING_TAP + 4} src="swipe_ui_01" volume={0.3} len={12} />
      <Sfx at={MORNING_TAP + 8} src="page_turn_01" volume={0.3} len={sec(0.8)} />
      <Sfx at={EVENING_TAP} src="click_02" volume={0.3} len={6} />
      <Sfx at={EVENING_TAP + 4} src="swipe_ui_01" volume={0.3} len={12} />

      {/* outro: reverse whoosh lands on the logo, then the gong */}
      <Sfx at={LOGO - sec(1.8)} src="whoosh_reverse_05" volume={0.35} len={sec(1.8)} />
      <Sfx at={LOGO} src="gong_soft_01" volume={0.5} len={durationInFrames - LOGO} />
      <Sfx at={LOGO + 2} src="sparkle_02" volume={0.2} len={sec(1.6)} />
    </>
  );
};

const Overlays: React.FC = () => {
  const f = useCurrentFrame();
  const leak = interpolate(f, [DONE_FRAME, DONE_FRAME + 6, DONE_FRAME + 26], [0, 0.55, 0], clamp)
    + interpolate(f, [LOGO - 4, LOGO + 4, LOGO + 30], [0, 0.45, 0], clamp);
  const gx = Math.floor(random(`gx${f}`) * 512);
  const gy = Math.floor(random(`gy${f}`) * 512);
  return (
    <>
      <AbsoluteFill style={{ opacity: 0.14, transform: `translateY(${-f * 0.6}px)`, mixBlendMode: "screen" }}>
        <Img src={staticFile("overlays/bokeh_gold_01.png")} style={{ width: "100%", height: "120%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: leak }}>
        <Img
          src={staticFile("overlays/light_leak_gold_03.jpg")}
          style={{ width: "100%", height: "100%", transform: `scale(${1.1 + (f % 60) * 0.003})` }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.08, overflow: "hidden" }}>
        <Img
          src={staticFile("overlays/grain_tile_512.png")}
          style={{ position: "absolute", left: -gx, top: -gy, width: 1080 + 512, height: 1920 + 512 }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%)" }} />
    </>
  );
};

export const TasbihAdV2: React.FC = () => (
  <AbsoluteFill>
    <TasbihAd />
    <Overlays />
    <Soundtrack />
  </AbsoluteFill>
);
