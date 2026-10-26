import { loadFont } from "@remotion/fonts";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

loadFont({ family: "Amiri", url: staticFile("fonts/amiri-700-ar.woff2"), weight: "700" });
loadFont({ family: "Reem Kufi", url: staticFile("fonts/reemkufi-ar.woff2"), weight: "400 700" });

const GOLD = "#d4af6a";
const GOLD_LIGHT = "#f0d9a4";
const INK = "#f3ecd9";
const NASKH = "Amiri, serif";
const KUFI = "'Reem Kufi', sans-serif";

// Timeline (30 fps, 450 frames = 15 s)
const PHONE_IN = 82;
const TAP_START = 112;
const TAP_SPAN = 128;
const TAPS = 33;
const MORNING_TAP = 262;
const EVENING_TAP = 312;
const OUTRO = 372;

// Frame of the i-th tap (1..33); gaps shrink so the counting speeds up.
const tapFrame = (i: number) =>
  Math.round(TAP_START + TAP_SPAN * Math.pow((i - 1) / (TAPS - 1), 0.72));
const DONE_FRAME = tapFrame(TAPS);

// Phone screen geometry
const SCREEN_W = 560;
const SCREEN_H = Math.round((SCREEN_W * 844) / 390);
const BEZEL = 16;
const PHONE_TOP = 470;

// Touch points as fractions of the screenshot
const COUNTER = { x: 0.56, y: 0.6 };
const TAB_MORNING = { x: 0.5, y: 0.945 };
const TAB_EVENING = { x: 0.168, y: 0.945 };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Star: React.FC<{ size: number; rotate?: number }> = ({ size, rotate = 0 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ transform: `rotate(${rotate}deg)` }}>
    <g fill="none" stroke={GOLD} strokeWidth={5} strokeLinejoin="round">
      <rect x={22} y={22} width={56} height={56} />
      <rect x={22} y={22} width={56} height={56} transform="rotate(45 50 50)" />
    </g>
    <circle cx={50} cy={50} r={9} fill={GOLD} />
  </svg>
);

const PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23d4af6a' stroke-width='1.2'%3E%3Crect x='22' y='22' width='36' height='36'/%3E%3Crect x='22' y='22' width='36' height='36' transform='rotate(45 40 40)'/%3E%3Cpath d='M0 0L22 22M80 0L58 22M0 80L22 58M80 80L58 58'/%3E%3C/g%3E%3C/svg%3E\")";

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(120% 70% at 50% 0%, #1b5444 0%, #0b2a22 50%, #061a15 100%)",
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: PATTERN,
          backgroundSize: "160px 160px",
          backgroundPosition: `0px ${frame * 0.6}px`,
          opacity: 0.08,
        }}
      />
    </AbsoluteFill>
  );
};

// A line of Arabic that rises in word by word (words stay whole so letters keep joining).
const RisingLine: React.FC<{
  text: string;
  start: number;
  size: number;
  font: string;
  color: string;
}> = ({ text, start, size, font, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div dir="rtl" lang="ar" style={{ fontFamily: font, fontSize: size, color, lineHeight: 1.5, textAlign: "center" }}>
      {words.map((w, i) => {
        const p = spring({ frame: frame - start - i * 4, fps, config: { damping: 16, mass: 0.6 } });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              margin: "0 0.14em",
              opacity: p,
              transform: `translateY(${(1 - p) * 40}px)`,
              filter: `blur(${(1 - p) * 8}px)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const starIn = spring({ frame: frame - 2, fps, config: { damping: 14 } });
  // Everything lifts away as the phone arrives.
  const lift = interpolate(frame, [PHONE_IN - 8, PHONE_IN + 14], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  if (frame > PHONE_IN + 16) return null;
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        transform: `translateY(${-lift * 260}px)`,
        opacity: 1 - lift,
      }}
    >
      <div style={{ transform: `scale(${starIn})`, marginBottom: 40 }}>
        <Star size={130} rotate={frame * 0.6} />
      </div>
      <RisingLine text="سُبْحَانَ اللَّهِ" start={10} size={130} font={NASKH} color={GOLD_LIGHT} />
      <RisingLine text="الْحَمْدُ لِلَّهِ" start={30} size={110} font={NASKH} color={INK} />
      <RisingLine text="اللَّهُ أَكْبَرُ" start={50} size={110} font={NASKH} color={INK} />
    </AbsoluteFill>
  );
};

const Heading: React.FC<{ text: string; sub?: string; start: number; end: number }> = ({ text, sub, start, end }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end) return null;
  const out = interpolate(frame, [end - 10, end], [1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 150, left: 80, right: 80, opacity: out }}>
      <RisingLine text={text} start={start} size={88} font={KUFI} color={GOLD_LIGHT} />
      {sub ? <RisingLine text={sub} start={start + 14} size={46} font={KUFI} color={INK} /> : null}
    </div>
  );
};

const shotFor = (frame: number) => {
  if (frame >= EVENING_TAP + 6) return "app-shots/evening.png";
  if (frame >= MORNING_TAP + 6) return "app-shots/morning.png";
  let count = 0;
  for (let i = 1; i <= TAPS; i++) if (frame >= tapFrame(i)) count = i;
  return `app-shots/count-${String(count).padStart(2, "0")}.png`;
};

// Where the finger is, and how hard it is pressing (0..1).
const touchFor = (frame: number) => {
  let last = -999;
  for (let i = 1; i <= TAPS; i++) if (frame >= tapFrame(i)) last = tapFrame(i);
  for (const f of [MORNING_TAP, EVENING_TAP]) if (frame >= f) last = f;
  const press = interpolate(frame - last, [0, 7], [1, 0], clamp);
  let pos = COUNTER;
  let visible = interpolate(frame, [TAP_START - 12, TAP_START - 2], [0, 1], clamp);
  if (frame > DONE_FRAME + 8) {
    // finger travels to the tabs
    const toMorning = interpolate(frame, [DONE_FRAME + 8, MORNING_TAP], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    const toEvening = interpolate(frame, [EVENING_TAP - 14, EVENING_TAP], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    pos = {
      x: COUNTER.x + (TAB_MORNING.x - COUNTER.x) * toMorning + (TAB_EVENING.x - TAB_MORNING.x) * toEvening,
      y: COUNTER.y + (TAB_MORNING.y - COUNTER.y) * toMorning,
    };
  }
  visible *= interpolate(frame, [EVENING_TAP + 12, EVENING_TAP + 20], [1, 0], clamp);
  return { pos, press, visible };
};

const Phone: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < PHONE_IN - 2) return null;

  const rise = spring({ frame: frame - PHONE_IN, fps, config: { damping: 18, mass: 0.9 } });
  // A slow push-in while counting, a small punch when the round completes.
  const push = interpolate(frame, [TAP_START, DONE_FRAME], [1, 1.05], clamp);
  const punch = 0.035 * Math.max(0, Math.sin(Math.min(1, Math.max(0, (frame - DONE_FRAME) / 10)) * Math.PI));
  const settle = interpolate(frame, [DONE_FRAME + 10, MORNING_TAP], [0, 0.05], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const outro = interpolate(frame, [OUTRO, OUTRO + 18], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const scale = (push + punch - settle) * (1 - outro * 0.35);

  const glow = interpolate(frame, [DONE_FRAME, DONE_FRAME + 6, DONE_FRAME + 30], [0, 1, 0], clamp);
  const { pos, press, visible } = touchFor(frame);

  return (
    <div
      style={{
        position: "absolute",
        left: 540 - SCREEN_W / 2 - BEZEL,
        top: PHONE_TOP - BEZEL,
        width: SCREEN_W + BEZEL * 2,
        height: SCREEN_H + BEZEL * 2,
        borderRadius: 78,
        background: "#0a0f0d",
        boxShadow: `0 0 0 3px #2b3a33, 0 50px 120px rgba(0,0,0,0.6), 0 0 ${140 * glow}px ${40 * glow}px rgba(240,217,164,${0.55 * glow})`,
        transform: `translateY(${(1 - rise) * 1500 + outro * -120}px) scale(${scale})`,
        opacity: 1 - outro,
        transformOrigin: "50% 45%",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: BEZEL,
          borderRadius: 62,
          overflow: "hidden",
          background: "#061a15",
        }}
      >
        <Img src={staticFile(shotFor(frame))} style={{ width: SCREEN_W, height: SCREEN_H, display: "block" }} />
        <div
          style={{
            position: "absolute",
            left: pos.x * SCREEN_W - 50,
            top: pos.y * SCREEN_H - 50,
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: `rgba(255,255,255,${0.18 + press * 0.22})`,
            border: "3px solid rgba(255,255,255,0.55)",
            transform: `scale(${1 - press * 0.22})`,
            opacity: visible,
          }}
        />
      </div>
    </div>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = OUTRO + 12;
  if (frame < start) return null;
  const p = spring({ frame: frame - start, fps, config: { damping: 15 } });
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 30 }}>
      <div style={{ transform: `scale(${p}) rotate(${(1 - p) * -90}deg)` }}>
        <Star size={220} rotate={(frame - start) * 0.5} />
      </div>
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: KUFI,
          fontWeight: 700,
          fontSize: 190,
          color: GOLD_LIGHT,
          opacity: p,
          transform: `translateY(${(1 - p) * 50}px)`,
          textShadow: "0 6px 40px rgba(212,175,106,0.35)",
        }}
      >
        مِسْبَحَة
      </div>
    </AbsoluteFill>
  );
};

export const TasbihAd: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Intro />
      <Heading text="عدّاد للتسبيح" start={PHONE_IN + 14} end={MORNING_TAP - 4} />
      <Heading
        text="أذكار الصباح والمساء"
        sub="من حصن المسلم · يعمل بدون إنترنت"
        start={MORNING_TAP + 4}
        end={OUTRO + 10}
      />
      <Phone />
      <Outro />
    </AbsoluteFill>
  );
};
