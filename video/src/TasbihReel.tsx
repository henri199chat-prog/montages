import { loadFont } from "@remotion/fonts";
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import VO from "./tasbih-reel-vo.json";
import POINTS from "./tasbih-reel-points.json";

loadFont({ family: "Cairo", url: staticFile("fonts/Cairo-Variable.woff2"), weight: "200 1000" });
loadFont({ family: "Reem Kufi", url: staticFile("fonts/reemkufi-ar.woff2"), weight: "400 700" });
loadFont({ family: "Amiri", url: staticFile("fonts/amiri-700-ar.woff2"), weight: "700" });

const FPS = 30;
const GOLD = "#d4af6a";
const GOLD_LIGHT = "#f0d9a4";
const INK = "#f3ecd9";
const KUFI = "'Reem Kufi', sans-serif";
const CAIRO = "Cairo, sans-serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

type Word = { w: string; start: number; end: number };
type Seg = { id: number; text: string; start: number; end: number; words: Word[] };
const SEGS = VO.segments as Seg[];
const f = (s: number) => Math.round(s * FPS);
const segStart = (i: number) => f(SEGS[i].start);
const segEnd = (i: number) => f(SEGS[i].end);
export const REEL_FRAMES = f(VO.duration) + f(2.6);

// Onset frame of word `i` of VO line `line`.
const word = (line: number, i: number) => f(SEGS[line].words[i].start);

// Event frames, all hung on words of the voiceover (see tasbih-reel-vo.json).
const E = {
  phoneIn: 0,
  hookTapsEnd: segEnd(0),
  chip1: word(2, 0), // «تختار»
  chip2: word(2, 1), // «الذِّكر»
  chip0: word(2, 3), // «تحدّد»
  t33: word(2, 5), // «ثلاثًا»
  t100: word(2, 8), // «مئة»
  tCustom: word(2, 11), // «رقمٍ»
  t33back: segEnd(2) + 4,
  countStart: segStart(3) - 4,
  done: word(3, 3), // round complete lands on «يهتزّ»
  tabMorning: word(4, 1), // «فيها»
  card0: word(5, 0), // «تضغط»
  card1: [word(5, 3), word(5, 4), word(5, 5)], // «فيعدّ عنك، ويتجدّد»
  totalZoom: word(6, 3), // «ويحفظ»
  motive: segStart(7) - 6, // «اجعل لسانك رطبًا بذكر الله»
  profile: segStart(8) - 8, // cut to the creator's profile
  bioZoom: word(8, 4), // «البايو»
  linkTap: word(8, 5), // «اضغط»
  outro: word(8, 8) - 4, // «مباشرةً» -> download end card
};

// The link chip sits where Instagram shows profile links (over the "+ Add" chip in the screenshot).
const LINK_CHIP = { x0: 0.7, x1: 0.855, y0: 0.3005, y1: 0.3295 };
const LINK_TOUCH = { x: (LINK_CHIP.x0 + LINK_CHIP.x1) / 2, y: (LINK_CHIP.y0 + LINK_CHIP.y1) / 2 };

// The 33 counting taps accelerate from countStart to done.
const COUNT_TAPS = 33;
const countTap = (i: number) =>
  Math.round(E.countStart + (E.done - E.countStart) * Math.pow((i - 1) / (COUNT_TAPS - 1), 0.75));
// A few slow taps under the hook and line 2 («تفتحها وتضغط بس»).
const HOOK_TAPS = [8, 16, 23, 29, 34, 39, 44].filter((x) => x < E.hookTapsEnd);
const INTRO_TAPS = [word(1, 4), word(1, 5), word(1, 7)]; // «تفتحه، وتضغط، وهو يعدّ»

type Shot = { src: string; touch?: { x: number; y: number }; tapAt?: number };

// Which screenshot is on screen at a frame, and where the last touch was.
const shotAt = (frame: number): Shot => {
  const s = (name: string) => `reel-shots/${name}.png`;
  const tap = POINTS.tap;
  if (frame >= E.profile) return { src: s("profile"), touch: LINK_TOUCH, tapAt: E.linkTap };
  if (frame >= E.motive) return { src: s("dhikr-0") };
  if (frame >= E.totalZoom) return { src: s("count-33") };
  if (frame >= E.card0) {
    let n = 1;
    E.card1.forEach((c, i) => { if (frame >= c) n = i + 2; });
    const at = n === 1 ? E.card0 : E.card1[n - 2];
    return { src: s(`morning-${n}`), touch: n === 1 ? POINTS.cards[0] : { x: 0.5, y: 0.731 }, tapAt: at };
  }
  if (frame >= E.tabMorning) return { src: s("morning-0"), touch: POINTS.tabs.morning, tapAt: E.tabMorning };
  if (frame >= E.countStart) {
    let n = 0;
    for (let i = 1; i <= COUNT_TAPS; i++) if (frame >= countTap(i)) n = i;
    return { src: s(`count-${String(n).padStart(2, "0")}`), touch: tap, tapAt: n ? countTap(n) : undefined };
  }
  if (frame >= E.t33back) return { src: s("target-33"), touch: POINTS.targets[0], tapAt: E.t33back };
  if (frame >= E.tCustom) return { src: s("target-custom"), touch: POINTS.targets[2], tapAt: E.tCustom };
  if (frame >= E.t100) return { src: s("target-100"), touch: POINTS.targets[1], tapAt: E.t100 };
  if (frame >= E.t33) return { src: s("target-33"), touch: POINTS.targets[0], tapAt: E.t33 };
  if (frame >= E.chip0) return { src: s("dhikr-0"), touch: POINTS.chips[0], tapAt: E.chip0 };
  if (frame >= E.chip2) return { src: s("dhikr-2"), touch: POINTS.chips[2], tapAt: E.chip2 };
  if (frame >= E.chip1) return { src: s("dhikr-1"), touch: POINTS.chips[1], tapAt: E.chip1 };
  // hook + intro: real counting taps 1..10
  const taps = [...HOOK_TAPS, ...INTRO_TAPS];
  let n = 0;
  taps.forEach((t, i) => { if (frame >= t) n = i + 1; });
  return { src: s(`count-${String(n).padStart(2, "0")}`), touch: tap, tapAt: n ? taps[n - 1] : undefined };
};

const PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23d4af6a' stroke-width='1.2'%3E%3Crect x='22' y='22' width='36' height='36'/%3E%3Crect x='22' y='22' width='36' height='36' transform='rotate(45 40 40)'/%3E%3Cpath d='M0 0L22 22M80 0L58 22M0 80L22 58M80 80L58 58'/%3E%3C/g%3E%3C/svg%3E\")";

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(120% 70% at 50% 0%, #1b5444 0%, #0b2a22 50%, #061a15 100%)" }}>
      <AbsoluteFill
        style={{ backgroundImage: PATTERN, backgroundSize: "160px 160px", backgroundPosition: `0px ${frame * 0.6}px`, opacity: 0.08 }}
      />
    </AbsoluteFill>
  );
};

// Phone geometry
const SCREEN_W = 600;
const SCREEN_H = Math.round((SCREEN_W * 844) / 390);
const BEZEL = 16;
const PHONE_TOP = 330;

const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = spring({ frame: frame - E.phoneIn, fps, config: { damping: 16, mass: 0.7 } });
  const shot = shotAt(frame);

  // Camera: push in on the counter while counting, buzz on «يهتز», zoom to the header total,
  // then to the profile's bio and link, then leave.
  const countPush = interpolate(frame, [E.countStart, E.done], [1, 1.08], clamp)
    * interpolate(frame, [E.done + 10, E.tabMorning], [1, 1 / 1.08], clamp);
  const buzz = frame >= E.done && frame < E.done + 14 ? Math.sin((frame - E.done) * 2.6) * 9 * (1 - (frame - E.done) / 14) : 0;
  const ease = { ...clamp, easing: Easing.inOut(Easing.cubic) };
  const zHeader = interpolate(frame, [E.totalZoom, E.totalZoom + 14, E.motive - 8, E.motive + 4], [0, 1, 1, 0], ease);
  // The reminder line: the phone steps back and dims under the big verse-like title.
  const calm = interpolate(frame, [E.motive, E.motive + 14, E.profile - 10, E.profile], [0, 1, 1, 0], ease);
  const zBio = interpolate(frame, [E.bioZoom - 4, E.bioZoom + 12], [0, 1], ease);
  const z = Math.max(zHeader, zBio);
  const focus = zHeader > 0 ? { x: 0.5, y: 0.07, s: 1.7 } : { x: 0.5, y: 0.24, s: 1.6 };
  const swap = interpolate(frame, [E.profile - 4, E.profile, E.profile + 8], [0, 1, 0], clamp);
  const out = interpolate(frame, [E.outro, E.outro + 16], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const zoomS = 1 + (focus.s - 1) * z;
  const scale = countPush * zoomS * (1 - swap * 0.06) * (1 - out * 0.3) * (1 - calm * 0.12);
  // Bring the focus point to (540, 800): offset from the phone centre, scaled, then moved by z.
  const centerY = PHONE_TOP + SCREEN_H / 2;
  const zoomX = z * (540 - 540 - zoomS * (focus.x - 0.5) * SCREEN_W);
  const zoomY = z * (800 - centerY - zoomS * (focus.y - 0.5) * SCREEN_H);
  const glow = interpolate(frame, [E.done, E.done + 6, E.done + 34], [0, 1, 0], clamp);

  const press = shot.tapAt !== undefined ? interpolate(frame - shot.tapAt, [0, 7], [1, 0], clamp) : 0;
  const fingerOn = shot.touch && shot.tapAt !== undefined && frame - shot.tapAt < 18 && (frame < E.totalZoom || frame >= E.profile);
  const fingerOpacity = fingerOn ? interpolate(frame - (shot.tapAt as number), [0, 2, 12, 18], [0, 1, 1, 0], clamp) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: 540 - SCREEN_W / 2 - BEZEL,
        top: PHONE_TOP - BEZEL,
        width: SCREEN_W + BEZEL * 2,
        height: SCREEN_H + BEZEL * 2,
        borderRadius: 82,
        background: "#0a0f0d",
        boxShadow: `0 0 0 3px #2b3a33, 0 50px 120px rgba(0,0,0,0.6), 0 0 ${150 * glow}px ${44 * glow}px rgba(240,217,164,${0.55 * glow})`,
        transform: `translate(${buzz + zoomX}px, ${(1 - rise) * 1600 + zoomY - out * 140 + calm * 230}px) scale(${scale})`,
        transformOrigin: "50% 50%",
        opacity: (1 - out) * (1 - calm * 0.55),
      }}
    >
      <div style={{ position: "absolute", inset: BEZEL, borderRadius: 66, overflow: "hidden", background: "#061a15" }}>
        <Img src={staticFile(shot.src)} style={{ width: SCREEN_W, height: SCREEN_H, display: "block" }} />
        {frame >= E.profile ? <LinkChip /> : null}
        {shot.touch ? (
          <div
            style={{
              position: "absolute",
              left: shot.touch.x * SCREEN_W - 50,
              top: shot.touch.y * SCREEN_H - 50,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `rgba(255,255,255,${0.18 + press * 0.24})`,
              border: "3px solid rgba(255,255,255,0.6)",
              transform: `scale(${1 - press * 0.22})`,
              opacity: fingerOpacity,
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

// The app link in the profile: appears on «بالبايو», pulses, pressed on «اضغطوا».
const LinkChip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - E.bioZoom, fps, config: { damping: 13 } });
  const pulse = frame < E.linkTap ? 0.5 + 0.5 * Math.sin((frame - E.bioZoom) / 4) : 0;
  const press = interpolate(frame - E.linkTap, [0, 4, 12], [0, 1, 0], clamp);
  const w = (LINK_CHIP.x1 - LINK_CHIP.x0) * SCREEN_W;
  const h = (LINK_CHIP.y1 - LINK_CHIP.y0) * SCREEN_H;
  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        left: LINK_CHIP.x0 * SCREEN_W - 4,
        top: LINK_CHIP.y0 * SCREEN_H,
        width: w + 8,
        height: h,
        borderRadius: h / 2,
        background: `rgba(212,175,106,${0.92 - press * 0.25})`,
        boxShadow: `0 0 ${10 + pulse * 18}px rgba(240,217,164,${0.5 + pulse * 0.4})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        fontFamily: CAIRO,
        fontWeight: 800,
        fontSize: 15,
        color: "#0d1015",
        opacity: p,
        transform: `scale(${(0.6 + 0.4 * p) * (1 - press * 0.08)})`,
      }}
    >
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#0d1015" strokeWidth={2.6} strokeLinecap="round">
        <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
      </svg>
      مِسْبَحَة
    </div>
  );
};

// Top keyword title for each beat (key words only, not the script).
const TITLES: { text: string; from: number; to: number; big?: boolean }[] = [
  { text: "ضاع منك العدّ؟", from: 4, to: segEnd(0) + 6, big: true },
  { text: "اختر الذِّكر", from: E.chip1 - 4, to: E.t33 - 2 },
  { text: "33 أو 100 أو أي رقم", from: E.t33 - 2, to: E.countStart },
  { text: "يهتزّ عند الإتمام", from: E.done - 2, to: segEnd(3) + 4 },
  { text: "أذكار الصباح والمساء", from: segStart(4), to: segEnd(5) + 4 },
  { text: "دون إنترنت", from: segStart(6), to: E.totalZoom },
  { text: "الرابط في البايو", from: E.profile + 4, to: E.outro },
];

const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = TITLES.find((x) => frame >= x.from && frame < x.to);
  if (!t) return null;
  const p = spring({ frame: frame - t.from, fps, config: { damping: 14, stiffness: 180 } });
  const fade = interpolate(frame, [t.to - 6, t.to], [1, 0], clamp);
  const offline = t.text === "دون إنترنت";
  return (
    <div
      style={{
        position: "absolute",
        top: t.big ? 120 : 140,
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        opacity: p * fade,
        transform: `translateY(${(1 - p) * -40}px) scale(${0.9 + 0.1 * p})`,
      }}
    >
      {offline ? <WifiOff /> : null}
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: /[0-9]/.test(t.text) ? CAIRO : KUFI,
          fontWeight: /[0-9]/.test(t.text) ? 800 : 700,
          fontSize: t.big ? 118 : 84,
          color: GOLD_LIGHT,
          textShadow: "0 6px 30px rgba(0,0,0,0.5)",
          whiteSpace: "nowrap",
        }}
      >
        {t.text}
      </div>
    </div>
  );
};

const WifiOff: React.FC = () => (
  <svg width={86} height={86} viewBox="0 0 24 24" fill="none" stroke={GOLD_LIGHT} strokeWidth={2} strokeLinecap="round">
    <path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0" />
    <circle cx={12} cy={19} r={1.2} fill={GOLD_LIGHT} />
    <path d="M3 3l18 18" stroke="#e8735a" strokeWidth={2.4} />
  </svg>
);

// Caption chunks: break after punctuation or at 6 words, never across VO lines.
const CHUNKS: { start: number; end: number; words: Word[] }[] = [];
SEGS.forEach((s) => {
  let cur: Word[] = [];
  s.words.forEach((w, i) => {
    cur.push(w);
    const last = i === s.words.length - 1;
    if (last || /[،,.:؟?]$/.test(w.w) || cur.length >= 6) {
      CHUNKS.push({ start: cur[0].start, end: last ? s.end : cur[cur.length - 1].end, words: cur });
      cur = [];
    }
  });
});

// Word-by-word captions: one phrase at a time, active word gold.
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const seg = CHUNKS.find((c, i) => t >= c.start - 0.05 && t < Math.min(c.end + 0.25, (CHUNKS[i + 1]?.start ?? 1e9) - 0.05));
  if (!seg || frame >= E.outro + 4 || (frame >= E.motive && frame < E.profile)) return null;
  const pop = spring({ frame: frame - f(seg.start - 0.05), fps: FPS, config: { damping: 15, stiffness: 220 } });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 150 }}>
      <div
        dir="rtl"
        lang="ar"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 0.28em",
          maxWidth: 920,
          padding: "10px 34px 16px",
          borderRadius: 28,
          background: "rgba(4,16,12,0.72)",
          fontFamily: CAIRO,
          fontWeight: 800,
          fontSize: 60,
          lineHeight: 1.45,
          color: INK,
          transform: `scale(${0.88 + 0.12 * pop})`,
          opacity: pop,
        }}
      >
        {seg.words.map((w, i) => {
          const active = t >= w.start && t < (seg.words[i + 1]?.start ?? seg.end + 0.25);
          return (
            <span key={i} style={{ display: "inline-block", color: active ? GOLD_LIGHT : INK, transform: active ? "scale(1.07)" : "none" }}>
              {w.w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = E.outro + 8;
  if (frame < start) return null;
  const p = spring({ frame: frame - start, fps, config: { damping: 15 } });
  const p2 = spring({ frame: frame - start - 14, fps, config: { damping: 16 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 26 }}>
      <Img src={staticFile("reel-shots/icon.png")} style={{ width: 230, height: 230, borderRadius: 52, transform: `scale(${p})`, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }} />
      <div dir="rtl" lang="ar" style={{ fontFamily: KUFI, fontWeight: 700, fontSize: 170, color: GOLD_LIGHT, opacity: p, transform: `translateY(${(1 - p) * 40}px)`, textShadow: "0 6px 40px rgba(212,175,106,0.35)" }}>
        مِسْبَحَة
      </div>
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: CAIRO,
          fontWeight: 800,
          fontSize: 54,
          color: "#0d1015",
          background: GOLD,
          borderRadius: 60,
          padding: "14px 44px 18px",
          opacity: p2,
          transform: `translateY(${(1 - p2) * 30}px)`,
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 34,
          boxShadow: "0 14px 40px rgba(0,0,0,0.4)",
        }}
      >
        <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke="#0d1015" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 14v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5M8 10l4 4 4-4M12 3v11" />
        </svg>
        رابط التحميل في البايو
      </div>
      <div style={{ fontFamily: CAIRO, fontWeight: 700, fontSize: 50, color: INK, opacity: p2 * 0.9, marginTop: 6, letterSpacing: 1 }}>
        @aymen.1303
      </div>
    </AbsoluteFill>
  );
};

const Overlays: React.FC = () => {
  const fr = useCurrentFrame();
  const leak = interpolate(fr, [E.done, E.done + 6, E.done + 26], [0, 0.5, 0], clamp)
    + interpolate(fr, [E.outro + 4, E.outro + 12, E.outro + 40], [0, 0.45, 0], clamp);
  const gx = Math.floor(random(`gx${fr}`) * 512);
  const gy = Math.floor(random(`gy${fr}`) * 512);
  return (
    <>
      <AbsoluteFill style={{ opacity: 0.12, transform: `translateY(${-fr * 0.5}px)`, mixBlendMode: "screen" }}>
        <Img src={staticFile("overlays/bokeh_gold_01.png")} style={{ width: "100%", height: "130%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: leak }}>
        <Img src={staticFile("overlays/light_leak_gold_03.jpg")} style={{ width: "100%", height: "100%" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ mixBlendMode: "overlay", opacity: 0.07, overflow: "hidden" }}>
        <Img src={staticFile("overlays/grain_tile_512.png")} style={{ position: "absolute", left: -gx, top: -gy, width: 1080 + 512, height: 1920 + 512 }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 62%, rgba(0,0,0,0.42) 100%)" }} />
    </>
  );
};

const Sfx: React.FC<{ at: number; src: string; volume: number; len?: number }> = ({ at, src, volume, len = 60 }) => (
  <Sequence from={Math.max(0, at)} durationInFrames={len} layout="none">
    <Audio src={staticFile(`sfx/${src}.mp3`)} volume={volume} />
  </Sequence>
);

const Soundtrack: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  const allTaps = [...HOOK_TAPS, ...INTRO_TAPS, E.chip1, E.chip2, E.chip0, E.t33, E.t100, E.tCustom, E.t33back, E.tabMorning, E.card0, ...E.card1];
  // During the fast count only every other tap clicks, so it does not turn into a buzz.
  const countClicks = Array.from({ length: COUNT_TAPS - 1 }, (_, k) => countTap(k + 1)).filter((_, k) => k % 2 === 0);
  return (
    <>
      <Audio src={staticFile("vo/tasbih-reel-vo.wav")} volume={1} />
      <Audio
        src={staticFile("sfx/drone_calm_low_loop.mp3")}
        loop
        volume={(fr) => 0.06 * interpolate(fr, [0, 15, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], clamp)}
      />
      {[...allTaps, ...countClicks].map((at, k) => (
        <Sfx key={k} at={at} src={k % 2 ? "click_02" : "click_01"} volume={0.18} len={6} />
      ))}
      <Sfx at={E.done} src="notify_m2" volume={0.32} len={f(1.9)} />
      <Sfx at={E.tabMorning + 4} src="swish_soft" volume={0.3} len={f(0.9)} />
      <Sfx at={segStart(4)} src="pluck_kalimba_soft" volume={0.16} len={f(3)} />
      <Sfx at={E.card1[2]} src="mallet_celesta" volume={0.22} len={f(0.5)} />
      <Sfx at={E.totalZoom - 6} src="swish_cane" volume={0.22} len={f(0.8)} />
      <Sfx at={E.motive} src="shimmer_m3" volume={0.18} len={f(3.6)} />
      <Sfx at={E.profile - 6} src="swish_soft" volume={0.3} len={f(0.9)} />
      <Sfx at={E.bioZoom} src="mallet_glock" volume={0.2} len={f(0.5)} />
      <Sfx at={E.linkTap} src="click_01" volume={0.3} len={6} />
      <Sfx at={E.outro + 8 - f(1.2)} src="reverse_swell_breath" volume={0.28} len={f(1.3)} />
      <Sfx at={E.outro + 8} src="logo_sting_soft_bloom" volume={0.34} len={f(1.9)} />
    </>
  );
};

// «اجعل لسانك رطبًا بذكر الله، في كل وقتٍ وكل مكان»: big Naskh lines, word by word on the voice.
const Reminder: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < E.motive || frame >= E.profile) return null;
  const seg = SEGS[7];
  const fade = interpolate(frame, [E.profile - 10, E.profile], [1, 0], clamp);
  const lines = [seg.words.slice(0, 5), seg.words.slice(5)];
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 230, opacity: fade }}>
      {lines.map((ws, li) => (
        <div key={li} dir="rtl" lang="ar" style={{ display: "flex", gap: "0 0.25em", fontFamily: "Amiri, serif", fontWeight: 700, fontSize: li ? 74 : 96, lineHeight: 1.6, color: li ? INK : GOLD_LIGHT, textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>
          {ws.map((w, i) => {
            const p = spring({ frame: frame - f(w.start) + 3, fps, config: { damping: 16, mass: 0.6 } });
            return (
              <span key={i} style={{ display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 30}px)`, filter: `blur(${(1 - p) * 6}px)` }}>
                {w.w}
              </span>
            );
          })}
        </div>
      ))}
    </AbsoluteFill>
  );
};

export const TasbihReel: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <Phone />
    <Title />
    <Reminder />
    <Outro />
    <Overlays />
    <Captions />
    <Soundtrack />
  </AbsoluteFill>
);
