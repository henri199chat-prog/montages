import { loadFont } from "@remotion/fonts";
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  OffthreadVideo,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import TL from "./aymen-timeline.json";
import FACES from "./aymen-faces.json";
import CLIPS from "./aymen-clips.json";

loadFont({ family: "Cairo", url: staticFile("fonts/Cairo-Variable.woff2"), weight: "200 1000" });
loadFont({ family: "Anton", url: staticFile("fonts/Anton-Regular.woff2"), weight: "400" });

// Theme (AG Anime house style: near-black, white text, yellow highlight, red for alarms).
const T = { bg: "#0a0a0f", ink: "#ffffff", acc: "#ffe612", red: "#f02b3a", mut: "#9aa0ad", handle: "@aymen.1303" };
const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const f = (s: number) => Math.round(s * FPS);

type Word = { w: string; start: number; end: number };
// Corrections of the Whisper transcript (same word count, the speaker's real words).
const FIX: Record<number, string> = {};
const WORDS: Word[] = (TL.words as Word[]).map((w, i) => ({ ...w, w: FIX[i] ?? w.w }));
WORDS.forEach((w, i) => {
  if (w.w === "تعج") WORDS[i].w = "تعجّب";
  if (w.w === "كتبوت؟") WORDS[i].w = "كَت!";
  if (w.w === "حرفيا") WORDS[i].w = "حرفيًا";
  if (w.w === "تماما") WORDS[i].w = "تمامًا";
  if (w.w === "طبعا") WORDS[i].w = "طبعًا";
});
WORDS.forEach((w, i) => {
  // «وأنا أنظر إليه»: the second «إلي» is «إليه»
  if (w.w === "إلي" && WORDS[i - 1]?.w === "أنظر") WORDS[i].w = "إليه";
});

// Start time (s) of the n-th occurrence of a word.
const wt = (text: string, n = 1) => {
  let k = 0;
  for (const w of WORDS) if (w.w === text && ++k === n) return w.start;
  throw new Error(`word not found: ${text} #${n}`);
};

export const AYMEN_FRAMES = f(TL.duration) + f(2.4);

// Beats, all hung on the speaker's words.
const B = {
  literal: wt("حرفيًا"),
  splitA: wt("اجعلني", 1), // «اجعلني أنا في الأسفل ومن فوق ... بليتش»
  splitB: wt("اجعلني", 2), // «اجعلني أنا من الفوق وتحت ... بلاك كلوفر»
  splitEnd: wt("اجعل", 1) - 0.4, // «الآن اجعل صوتي ...»
  phoneA: 26.0, // same window as the phone filter in voice.wav
  phoneB: 30.2,
  exclaim: wt("تعجّب"),
  question: wt("استفهام"),
  clawd: wt("إيموجي", 1),
  look: wt("ينظر"),
  smile: wt("مبتسم"),
  cut: wt("كَت!"),
};
const END = B.cut + 0.3;

// Layout of the speaker: 0 = full screen, 1 = bottom half (anime on top), -1 = top half (anime below).
const layoutAt = (t: number) => {
  const inA = interpolate(t, [B.splitA, B.splitA + 0.35], [0, 1], ease) * interpolate(t, [B.splitB - 0.15, B.splitB + 0.2], [1, 0], ease);
  const inB = interpolate(t, [B.splitB - 0.15, B.splitB + 0.2], [0, 1], ease) * interpolate(t, [B.splitEnd, B.splitEnd + 0.35], [1, 0], ease);
  return { inA, inB };
};

// Face of the speaker on the 1080x1920 canvas (video drawn at x1.5).
const faceAt = (frame: number) => {
  const i = Math.max(0, Math.min(FACES.cx.length - 1, frame));
  return { cx: FACES.cx[i] * 1.5, top: FACES.top[i] * 1.5, w: FACES.w[i] * 1.5 };
};

const Speaker: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const { inA, inB } = layoutAt(t);
  // Face centre sits ~470 px into its half.
  const faceY = faceAt(frame).top + faceAt(frame).w / 2;
  const shiftHalf = 470 - faceY;
  const ty = inA * (960 + shiftHalf) + inB * shiftHalf;
  const clipTop = inA * 960;
  const clipBottom = inB * 960;
  return (
    <AbsoluteFill style={{ clipPath: `inset(${clipTop}px 0 ${clipBottom}px 0)` }}>
      <OffthreadVideo
        src={staticFile("aymen/cut.mp4")}
        muted
        style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${ty}px)` }}
      />
    </AbsoluteFill>
  );
};

// The anime half: the real clip when the user sends it, until then a title card for the show.
const AnimePanel: React.FC<{ show: "bleach" | "blackclover"; from: number; to: number; top: boolean }> = ({ show, from, to, top }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const p = interpolate(t, [from, from + 0.35], [0, 1], ease) * interpolate(t, [to - 0.15, to + 0.2], [1, 0], ease);
  if (p <= 0) return null;
  const clip = (CLIPS as Record<string, string | null>)[show];
  const title = show === "bleach" ? "BLEACH" : "BLACK CLOVER";
  const sub = show === "bleach" ? "الحلقة الأولى" : "آخر لقطة صدرت";
  const lines = Array.from({ length: 28 }, (_, i) => i);
  const y0 = top ? 0 : 960;
  return (
    <div style={{ position: "absolute", left: 0, top: y0, width: 1080, height: 960, overflow: "hidden", transform: `translateY(${(1 - p) * (top ? -960 : 960)}px)` }}>
      {clip ? (
        <OffthreadVideo src={staticFile(clip)} muted startFrom={0} style={{ width: 1080, height: 960, objectFit: "cover" }} />
      ) : (
        <AbsoluteFill style={{ background: show === "bleach" ? "radial-gradient(circle at 50% 55%, #2b1414 0%, #0a0a0f 70%)" : "radial-gradient(circle at 50% 55%, #10202a 0%, #0a0a0f 70%)" }}>
          {/* speed lines */}
          <svg width={1080} height={960} style={{ position: "absolute", opacity: 0.35 }}>
            {lines.map((i) => {
              const a = (i / lines.length) * Math.PI * 2 + random(`a${i}`) * 0.2;
              const r0 = 260 + 60 * Math.sin(frame / 3 + i);
              return (
                <line key={i} x1={540 + Math.cos(a) * r0} y1={500 + Math.sin(a) * r0} x2={540 + Math.cos(a) * 900} y2={500 + Math.sin(a) * 900}
                  stroke={show === "bleach" ? "#ff6a3d" : "#7fd3ff"} strokeWidth={2 + random(`w${i}`) * 4} />
              );
            })}
          </svg>
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 6 }}>
            <div style={{ fontFamily: "Anton", fontSize: show === "bleach" ? 200 : 150, color: T.ink, letterSpacing: 6, textShadow: `0 0 40px ${show === "bleach" ? "#ff4d2e" : "#3fb7ff"}` }}>{title}</div>
            <div dir="rtl" style={{ fontFamily: "Cairo", fontWeight: 900, fontSize: 64, color: T.acc }}>{sub}</div>
          </AbsoluteFill>
        </AbsoluteFill>
      )}
      {/* label chip */}
      <div style={{ position: "absolute", right: 40, top: top ? 190 : 110, background: "rgba(10,10,15,0.75)", border: `2px solid ${T.acc}`, borderRadius: 40, padding: "6px 22px", fontFamily: "Anton", fontSize: 34, color: T.acc, letterSpacing: 2 }}>
        {title} {show === "bleach" ? "· EP 1" : "· LATEST"}
      </div>
    </div>
  );
};

const Seam: React.FC = () => {
  const frame = useCurrentFrame();
  const { inA, inB } = layoutAt(frame / FPS);
  const p = Math.max(inA, inB);
  if (p <= 0) return null;
  return <div style={{ position: "absolute", left: 0, top: 957, width: 1080 * p, height: 6, background: T.acc, boxShadow: `0 0 24px ${T.acc}` }} />;
};

// «اجعل صوتي وكأن صوتي من الهاتف المحمول»: a call bar at the top while the voice is on the phone filter.
const PhoneCall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  if (t < B.phoneA - 0.1 || t > B.phoneB + 0.4) return null;
  const p = spring({ frame: frame - f(B.phoneA - 0.1), fps, config: { damping: 15 } }) * interpolate(t, [B.phoneB, B.phoneB + 0.3], [1, 0], clamp);
  const secs = Math.floor(t - B.phoneA);
  return (
    <div style={{ position: "absolute", top: 260, left: 140, right: 140, height: 120, borderRadius: 60, background: "rgba(20,24,20,0.88)", border: "2px solid #34c759", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 34px", transform: `translateY(${(1 - p) * -200}px)`, opacity: p }}>
      <svg width={56} height={56} viewBox="0 0 24 24" fill="#34c759"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" /></svg>
      <div style={{ display: "flex", gap: 6, alignItems: "center", height: 60 }}>
        {Array.from({ length: 14 }, (_, i) => (
          <div key={i} style={{ width: 7, borderRadius: 4, background: "#34c759", height: 10 + 44 * Math.abs(Math.sin(frame / 2.3 + i * 0.9)) * random(`b${i}${Math.floor(frame / 3)}`) }} />
        ))}
      </div>
      <div style={{ fontFamily: "Cairo", fontWeight: 800, fontSize: 40, color: T.ink }}>{`0:${String(Math.max(0, secs)).padStart(2, "0")}`}</div>
    </div>
  );
};

// «ضع نقطة تعجّب فوق رأسي» then «نقطة استفهام»: a mark that rides on the head.
const HeadMark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  const mark = t >= B.question ? "?" : t >= B.exclaim ? "!" : null;
  if (!mark || t > B.question + 1.9) return null;
  const from = mark === "?" ? B.question : B.exclaim;
  const p = spring({ frame: frame - f(from), fps, config: { damping: 9, stiffness: 200 } });
  const out = interpolate(t, [B.question + 1.6, B.question + 1.9], [1, 0], clamp);
  const face = faceAt(frame);
  const wob = Math.sin((frame - f(from)) / 3) * 6 * Math.max(0, 1 - (frame - f(from)) / 30);
  const color = mark === "!" ? T.red : T.acc;
  return (
    <div style={{ position: "absolute", left: face.cx - 110, top: face.top - 300, width: 220, height: 260, display: "flex", justifyContent: "center", alignItems: "flex-end", transform: `scale(${p * out}) rotate(${wob}deg)`, transformOrigin: "50% 100%" }}>
      <svg width={260} height={260} viewBox="-130 -130 260 260" style={{ position: "absolute", left: -20, top: 0, opacity: 0.9 * Math.max(0, 1 - (frame - f(from)) / 10) }}>
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return <line key={i} x1={Math.cos(a) * 80} y1={Math.sin(a) * 80} x2={Math.cos(a) * 125} y2={Math.sin(a) * 125} stroke={color} strokeWidth={8} strokeLinecap="round" />;
        })}
      </svg>
      <div style={{ fontFamily: "Anton", fontSize: 250, lineHeight: 1, color, WebkitTextStroke: "8px #0a0a0f", paintOrder: "stroke", textShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>{mark}</div>
    </div>
  );
};

// «إيموجي بجانبي على كتفي ... مثل شخصية تطبيق كلود ... ينظر إليّ وهو مبتسم»: Claude's pixel character on the shoulder.
const Clawd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  if (t < B.clawd - 0.05 || t > END) return null;
  const pin = spring({ frame: frame - f(B.clawd), fps, config: { damping: 10, stiffness: 160 } });
  const out = interpolate(t, [END - 0.25, END], [1, 0], clamp);
  const look = interpolate(t, [B.look, B.look + 0.25], [0, 1], ease); // eyes turn to the speaker
  const smile = interpolate(t, [B.smile, B.smile + 0.2], [0, 1], ease);
  const blink = frame % 70 < 3 ? 0.15 : 1;
  const bob = Math.sin(frame / 7) * 6;
  const face = faceAt(frame);
  // Viewer-left shoulder (clear of the Instagram buttons on the right).
  const x = face.cx - face.w * 1.55;
  const y = face.top + face.w * 1.75;
  const U = 17; // pixel size
  const px = (cx: number, cy: number, w: number, h: number, fill: string, k: string) => <rect key={k} x={cx * U} y={cy * U} width={w * U} height={h * U} fill={fill} />;
  const body = "#d97757";
  const eyeDx = look * 1; // shift both eyes one pixel toward the speaker (to the right)
  return (
    <div style={{ position: "absolute", left: x - 9 * U, top: y - 14 * U + bob, transform: `scale(${pin * out}) rotate(${look * 4}deg)`, transformOrigin: "50% 100%", filter: "drop-shadow(0 12px 18px rgba(0,0,0,0.45))" }}>
      <svg width={18 * U} height={14 * U} viewBox={`0 0 ${18 * U} ${14 * U}`} shapeRendering="crispEdges">
        {/* legs */}
        {[3, 6, 11, 14].map((lx, i) => px(lx, 10, 1, 3, body, `l${i}`))}
        {/* arms */}
        {px(1, 5, 2, 2, body, "al")}
        {px(15, 5 - look, 2, 2, body, "ar")}
        {/* body */}
        {px(3, 2, 12, 9, body, "b")}
        {/* eyes */}
        {px(6 + eyeDx, 4 + (1 - blink) * 1, 1, 2 * blink, "#1a1a1a", "e1")}
        {px(11 + eyeDx, 4 + (1 - blink) * 1, 1, 2 * blink, "#1a1a1a", "e2")}
        {/* smile */}
        {smile > 0 ? (
          <g opacity={smile}>
            {px(7 + eyeDx, 7, 1, 1, "#1a1a1a", "s1")}
            {px(8 + eyeDx, 8, 3, 1, "#1a1a1a", "s2")}
            {px(11 + eyeDx, 7, 1, 1, "#1a1a1a", "s3")}
            {px(4 + eyeDx, 6, 1, 1, "#f2a48a", "c1")}
            {px(13 + eyeDx, 6, 1, 1, "#f2a48a", "c2")}
          </g>
        ) : null}
      </svg>
      {smile > 0.5 ? (
        <div style={{ position: "absolute", right: -40, top: -50, fontSize: 54, opacity: interpolate(t, [B.smile, B.smile + 0.3, B.smile + 1.4], [0, 1, 0], clamp), transform: `translateY(${-(t - B.smile) * 40}px)` }}>
          <svg width={50} height={50} viewBox="0 0 24 24"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6C19 16.5 12 21 12 21z" fill={T.red} /></svg>
        </div>
      ) : null}
    </div>
  );
};

// Hook keyword on «حرفيًا».
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  if (t < B.literal - 0.1 || t > B.splitA + 0.1) return null;
  const p = spring({ frame: frame - f(B.literal - 0.1), fps, config: { damping: 11, stiffness: 190 } });
  const out = interpolate(t, [B.splitA - 0.2, B.splitA + 0.1], [1, 0], clamp);
  return (
    <div dir="rtl" style={{ position: "absolute", top: 230, width: 1080, textAlign: "center", fontFamily: "Cairo", fontWeight: 1000, fontSize: 150, color: T.acc, transform: `scale(${(0.6 + 0.4 * p) * out})`, opacity: out, textShadow: "0 8px 30px rgba(0,0,0,0.6)", WebkitTextStroke: "3px #0a0a0f" }}>
      حرفيًا
    </div>
  );
};

// Word-by-word captions (≤4 words, break on punctuation), AG style: Cairo Black, active word yellow, dark pill.
// The cut removed the pauses, so new instructions are found by their first word.
const BREAK_BEFORE = new Set(["اجعلني", "جميل", "الآن", "والآن", "ماذا", "ضع", "اجعل", "وهذا", "وهو", "وأنا", "هذا", "شكرا", "تماما", "تمامًا", "حاول"]);
const CHUNKS: Word[][] = [];
{
  let cur: Word[] = [];
  WORDS.forEach((w, i) => {
    const gap = i ? w.start - WORDS[i - 1].end : 0;
    const newIdea = BREAK_BEFORE.has(w.w);
    if (cur.length && (cur.length >= 4 || gap > 0.45 || newIdea || /[.!?؟،,]$/.test(WORDS[i - 1].w))) { CHUNKS.push(cur); cur = []; }
    cur.push(w);
  });
  if (cur.length) CHUNKS.push(cur);
}

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  if (t >= END) return null;
  const c = CHUNKS.find((ch, i) => t >= ch[0].start - 0.03 && t < Math.min(ch[ch.length - 1].end + 0.3, (CHUNKS[i + 1]?.[0].start ?? 1e9) - 0.02));
  if (!c) return null;
  const { inA, inB } = layoutAt(t);
  const split = Math.max(inA, inB);
  const y = interpolate(split, [0, 1], [1440, 960]);
  const pop = spring({ frame: frame - f(c[0].start - 0.03), fps, config: { damping: 15, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", left: 0, width: 1080, top: y - 60, display: "flex", justifyContent: "center" }}>
      <div dir="rtl" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.3em", maxWidth: 880, padding: "10px 32px 14px", borderRadius: 26, background: "rgba(10,10,14,0.72)", fontFamily: "Cairo", fontWeight: 900, fontSize: 70, lineHeight: 1.35, color: T.ink, textShadow: "0 3px 10px rgba(0,0,0,0.55)", transform: `scale(${0.85 + 0.15 * pop})` }}>
        {c.map((w, i) => {
          const active = t >= w.start && t < (c[i + 1]?.start ?? w.end + 0.3);
          return <span key={i} style={{ color: active ? T.acc : T.ink, display: "inline-block", transform: active ? "scale(1.06)" : "none" }}>{w.w}</span>;
        })}
      </div>
    </div>
  );
};

const Handle: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame / FPS >= END) return null;
  return (
    <div style={{ position: "absolute", top: 190, left: 40, padding: "6px 20px", borderRadius: 30, background: "rgba(10,10,15,0.55)", fontFamily: "Cairo", fontWeight: 800, fontSize: 32, color: T.ink, opacity: 0.85 }}>
      {T.handle}
    </div>
  );
};

// «كَت!»: a clapperboard snaps shut, then the end card with his last words.
const Clapper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / FPS;
  if (t < B.cut - 0.35) return null;
  const close = interpolate(t, [B.cut - 0.35, B.cut], [-32, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
  const flash = interpolate(t, [B.cut, B.cut + 0.05, B.cut + 0.3], [0, 1, 0], clamp);
  const card = interpolate(t, [B.cut + 0.05, B.cut + 0.35], [0, 1], ease);
  const p = spring({ frame: frame - f(END), fps, config: { damping: 14 } });
  const stripes = (k: string) => (
    <g>
      {Array.from({ length: 7 }, (_, i) => <rect key={k + i} x={i * 90} y={0} width={45} height={70} fill={T.ink} transform={`skewX(-30)`} />)}
    </g>
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: T.bg, opacity: card }} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <svg width={620} height={520} viewBox="0 0 620 520" style={{ transform: `translateY(${t < END ? 0 : -330 * p}px) scale(${t < END ? 1 : 1 - 0.25 * p})` }}>
          <g transform={`rotate(${close} 20 150)`}>
            <rect x={20} y={80} width={580} height={70} fill="#111" />
            <svg x={20} y={80} width={580} height={70}>{stripes("t")}</svg>
          </g>
          <rect x={20} y={160} width={580} height={70} fill="#111" />
          <svg x={20} y={160} width={580} height={70}>{stripes("b")}</svg>
          <rect x={20} y={230} width={580} height={250} fill="#1b1b22" />
          <text x={310} y={350} textAnchor="middle" fontFamily="Anton" fontSize={90} fill={T.acc}>CUT!</text>
          <text x={310} y={440} textAnchor="middle" fontFamily="Cairo" fontWeight={900} fontSize={60} fill={T.ink}>كَت!</text>
        </svg>
      </AbsoluteFill>
      {t >= END ? (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 470, gap: 18, opacity: p }}>
          <div dir="rtl" style={{ fontFamily: "Cairo", fontWeight: 1000, fontSize: 96, color: T.ink }}>هذا جميل جدًا</div>
          <div dir="rtl" style={{ fontFamily: "Cairo", fontWeight: 900, fontSize: 78, color: T.acc }}>شكرًا</div>
          <div style={{ marginTop: 26, padding: "10px 34px", borderRadius: 40, border: `3px solid ${T.acc}`, fontFamily: "Cairo", fontWeight: 800, fontSize: 48, color: T.ink }}>{T.handle}</div>
        </AbsoluteFill>
      ) : null}
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{ at: number; src: string; volume: number; len?: number }> = ({ at, src, volume, len = 2 }) => (
  <Sequence from={Math.max(0, f(at))} durationInFrames={f(len)} layout="none">
    <Audio src={staticFile(`aymen/sfx/${src}.mp3`)} volume={volume} />
  </Sequence>
);

export const AymenEdit: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <Speaker />
    <AnimePanel show="bleach" from={B.splitA} to={B.splitB} top />
    <AnimePanel show="blackclover" from={B.splitB} to={B.splitEnd} top={false} />
    <Seam />
    <Hook />
    <PhoneCall />
    <HeadMark />
    <Clawd />
    <Handle />
    <Captions />
    <Clapper />
    <Audio src={staticFile("aymen/voice.wav")} />
    {/* sound on the moments that mean something (8 in 56 s) */}
    <Sfx at={B.splitA - 0.15} src="whoosh_fast_02" volume={0.3} len={1} />
    <Sfx at={B.splitB - 0.2} src="whoosh_fast_02" volume={0.3} len={1} />
    <Sfx at={B.phoneA - 0.3} src="beep_twotone_06" volume={0.25} len={1} />
    <Sfx at={B.exclaim} src="pop_high_02" volume={0.35} len={1} />
    <Sfx at={B.question} src="beep_question_05" volume={0.3} len={1} />
    <Sfx at={B.clawd} src="pop_bubble_03" volume={0.35} len={1} />
    <Sfx at={B.smile} src="sparkle_02" volume={0.22} len={1.5} />
    <Sfx at={B.cut - 0.02} src="book_close_01" volume={0.5} len={1} />
  </AbsoluteFill>
);
