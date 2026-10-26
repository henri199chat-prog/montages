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
import VO from "./kidney-vo.json";

loadFont({ family: "Cairo", url: staticFile("fonts/Cairo-Variable.woff2"), weight: "200 1000" });

// Medical-awareness palette: deep navy, water aqua, warning amber, danger coral.
const C = { bg0: "#041024", bg1: "#0a2a4a", ink: "#f4f8ff", mut: "#8fa6c4", aqua: "#3fd0ff", water: "#59c8ff", deep: "#1677c9", amber: "#ffb547", red: "#ff5a5f", green: "#3ddc97", kidney: "#e0707a", kidneyDark: "#a8434f" };
const FPS = 30;
const W = 1080;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = { ...clamp, easing: Easing.inOut(Easing.cubic) };
const out = { ...clamp, easing: Easing.out(Easing.cubic) };
const f = (s: number) => Math.round(s * FPS);

type Word = { w: string; start: number; end: number };
type Line = { text: string; start: number; end: number; words: Word[] };
const LINES = VO.lines as Line[];
const strip = (s: string) => s.replace(/[ً-ْـ،,.؟?:؛!«»]/g, "");
// Start (s) of the first word in line `li` that begins with `prefix` (diacritics ignored).
const at = (li: number, prefix: string) => {
  const w = LINES[li].words.find((x) => strip(x.w).startsWith(strip(prefix)));
  if (!w) throw new Error(`no «${prefix}» in line ${li}`);
  return w.start;
};
export const KIDNEY_FRAMES = f(VO.duration) + f(2.2);

// Scenes: [first line, last line]. Each ends where the next one starts.
const GROUPS: [number, number][] = [[0, 1], [2, 3], [4, 5], [6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [11, 12], [13, 13]];
const SCENE_START = GROUPS.map(([a], i) => (i === 0 ? 0 : LINES[a].start - 0.25));
const sceneEnd = (i: number) => (i + 1 < GROUPS.length ? SCENE_START[i + 1] : VO.duration + 2.2);
type TrKind = "wave" | "zoom" | "whip" | "flash" | "drop" | "leak";
// Transition INTO scene i (i ≥ 1). One family: water.
const TRANS: TrKind[] = ["wave", "wave", "zoom", "wave", "whip", "flash", "drop", "whip", "leak", "wave"];
const TR_LEN = 0.5; // seconds

/* ---------- shared drawing ---------- */

const KIDNEY_PATH =
  "M88 6 C128 6 150 46 148 92 C146 140 120 174 82 172 C52 170 32 152 36 130 C39 114 56 108 58 92 C60 76 44 70 38 56 C30 32 52 6 88 6 Z";

const Kidney: React.FC<{ size: number; draw?: number; fill?: string; glow?: number; flip?: boolean; style?: React.CSSProperties; children?: React.ReactNode }> = ({ size, draw = 1, fill = C.kidney, glow = 0, flip, style, children }) => (
  <svg width={size} height={size * 1.18} viewBox="0 0 154 178" style={{ overflow: "visible", transform: flip ? "scaleX(-1)" : undefined, filter: glow ? `drop-shadow(0 0 ${30 * glow}px ${C.aqua})` : undefined, ...style }}>
    <defs>
      <linearGradient id="kg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={fill} />
        <stop offset="1" stopColor={C.kidneyDark} />
      </linearGradient>
    </defs>
    <path d={KIDNEY_PATH} fill="url(#kg)" opacity={Math.max(0, draw - 0.6) / 0.4} />
    <path d={KIDNEY_PATH} fill="none" stroke={C.ink} strokeWidth={3} strokeDasharray={520} strokeDashoffset={520 * (1 - Math.min(1, draw / 0.7))} strokeLinecap="round" opacity={0.9} />
    {children}
  </svg>
);

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(130% 80% at 50% 10%, ${C.bg1} 0%, ${C.bg0} 70%)` }}>
      {/* slow caustic light */}
      <AbsoluteFill style={{ opacity: 0.18, background: `radial-gradient(40% 25% at ${50 + 20 * Math.sin(frame / 90)}% ${30 + 10 * Math.cos(frame / 70)}%, ${C.aqua}, transparent 70%)` }} />
      {/* rising bubbles */}
      <svg width={W} height={1920} style={{ position: "absolute", opacity: 0.35 }}>
        {Array.from({ length: 26 }, (_, i) => {
          const sp = 0.6 + random(`s${i}`) * 1.4;
          const y = 1980 - ((frame * sp * 2.2 + random(`y${i}`) * 1980) % 2060);
          const x = random(`x${i}`) * W + Math.sin(frame / 25 + i) * 12;
          return <circle key={i} cx={x} cy={y} r={3 + random(`r${i}`) * 7} fill="none" stroke={C.aqua} strokeWidth={1.5} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Title: React.FC<{ t: number; from: number; children: React.ReactNode; size?: number; color?: string; y?: number }> = ({ t, from, children, size = 86, color = C.ink, y = 230 }) => {
  const p = interpolate(t, [from, from + 0.35], [0, 1], out);
  return (
    <div dir="rtl" style={{ position: "absolute", top: y, left: 60, right: 60, textAlign: "center", fontFamily: "Cairo", fontWeight: 900, fontSize: size, lineHeight: 1.25, color, opacity: p, transform: `translateY(${(1 - p) * 40}px)`, textShadow: "0 8px 30px rgba(0,0,0,0.45)" }}>
      {children}
    </div>
  );
};

const Chip: React.FC<{ t: number; from: number; text: string; color?: string; icon?: React.ReactNode; y: number }> = ({ t, from, text, color = C.aqua, icon, y }) => {
  const p = spring({ frame: f(t - from), fps: FPS, config: { damping: 14, stiffness: 170 } });
  if (t < from) return null;
  return (
    <div dir="rtl" style={{ position: "absolute", top: y, left: "50%", transform: `translateX(-50%) scale(${p})`, display: "flex", alignItems: "center", gap: 18, padding: "16px 34px", borderRadius: 60, background: "rgba(8,30,56,0.85)", border: `3px solid ${color}`, fontFamily: "Cairo", fontWeight: 800, fontSize: 52, color: C.ink, whiteSpace: "nowrap", boxShadow: `0 0 30px ${color}55` }}>
      {icon}
      {text}
    </div>
  );
};

const Check: React.FC<{ on: number; color?: string }> = ({ on, color = C.green }) => (
  <svg width={56} height={56} viewBox="0 0 24 24">
    <circle cx={12} cy={12} r={11} fill={color} opacity={0.18 + 0.82 * on} />
    <path d="M6.5 12.5l3.5 3.5 7.5-8" fill="none" stroke="#04131f" strokeWidth={2.8} strokeLinecap="round" strokeDasharray={20} strokeDashoffset={20 * (1 - on)} />
  </svg>
);

/* ---------- scenes (t = seconds on the master timeline) ---------- */

// 0-1 · «عادة بسيطة، مثل شرب الماء ... صحة الكليتين؟»
const S0: React.FC<{ t: number }> = ({ t }) => {
  const drop = interpolate(t, [0.05, 0.75], [-200, 760], { ...clamp, easing: Easing.in(Easing.quad) });
  const ripple = interpolate(t, [0.75, 1.8], [0, 1], clamp);
  const fill = interpolate(t, [0.8, LINES[0].end], [0.05, 0.75], out);
  const k = interpolate(t, [at(1, "الكليتين") - 0.3, at(1, "الكليتين") + 0.6], [0, 1], ease);
  const glassX = interpolate(k, [0, 1], [540, 540]);
  return (
    <AbsoluteFill>
      <Title t={t} from={at(0, "عادة")} size={92}>عادةٌ بسيطة…</Title>
      <Title t={t} from={at(0, "شرب")} y={360} size={110} color={C.aqua}>شرب الماء</Title>
      {/* glass */}
      <div style={{ position: "absolute", left: glassX - 150, top: 640, transform: `scale(${1 - 0.35 * k}) translateY(${-k * 120}px)`, transformOrigin: "50% 0%" }}>
        <svg width={300} height={420} viewBox="0 0 300 420">
          <defs>
            <clipPath id="glass"><path d="M30 10 L270 10 L240 410 L60 410 Z" /></clipPath>
            <linearGradient id="wat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.water} stopOpacity={0.9} /><stop offset="1" stopColor={C.deep} stopOpacity={0.95} /></linearGradient>
          </defs>
          <g clipPath="url(#glass)">
            <path d={`M0 ${410 - 400 * fill} Q 75 ${400 - 400 * fill + 12 * Math.sin(t * 6)} 150 ${410 - 400 * fill} T 300 ${410 - 400 * fill} V 420 H 0 Z`} fill="url(#wat)" />
          </g>
          <path d="M30 10 L270 10 L240 410 L60 410 Z" fill="none" stroke={C.ink} strokeWidth={5} strokeLinejoin="round" opacity={0.9} />
          <path d="M60 40 L75 370" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.25} />
        </svg>
      </div>
      {/* falling drop + ripple */}
      {t < 0.8 ? <svg width={60} height={80} viewBox="0 0 60 80" style={{ position: "absolute", left: 510, top: drop }}><path d="M30 0 C30 0 0 40 0 55 A30 30 0 0 0 60 55 C60 40 30 0 30 0 Z" fill={C.water} /></svg> : null}
      {ripple > 0 && ripple < 1 ? <div style={{ position: "absolute", left: 540 - 250 * ripple, top: 650 - 40 * ripple, width: 500 * ripple, height: 80 * ripple, borderRadius: "50%", border: `4px solid ${C.aqua}`, opacity: 1 - ripple }} /> : null}
      {/* kidneys appear with «الكليتين» */}
      <div style={{ position: "absolute", top: 1010, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 70, opacity: k, transform: `scale(${0.7 + 0.3 * k})` }}>
        <Kidney size={190} draw={k * 1.0} glow={k} />
        <Kidney size={190} draw={k * 1.0} glow={k} flip />
      </div>
      {k > 0 ? <Title t={t} from={at(1, "الكليتين")} y={1300} size={70} color={C.aqua}>صحة الكليتين</Title> : null}
    </AbsoluteFill>
  );
};

// 2-3 · «الكلى من أهم أعضاء الجسم؛ تصفية الدم، الفضلات، السوائل الزائدة، البول»
const S1: React.FC<{ t: number }> = ({ t }) => {
  const frame = f(t);
  const t0 = LINES[2].start;
  const k = interpolate(t, [t0, t0 + 0.6], [0, 1], out);
  const items = [
    { w: at(3, "تصفية"), text: "تصفية الدم", color: C.red },
    { w: at(3, "والتخلّص"), text: "التخلّص من الفضلات", color: C.amber },
    { w: at(3, "والسوائل"), text: "السوائل الزائدة", color: C.aqua },
  ];
  const flow = t >= at(3, "تصفية");
  return (
    <AbsoluteFill>
      <Title t={t} from={t0} size={80}>من أهم أعضاء الجسم</Title>
      {/* big kidney with flowing particles */}
      <div style={{ position: "absolute", left: 540 - 230, top: 420, transform: `scale(${0.8 + 0.2 * k})`, opacity: k }}>
        <Kidney size={460} draw={1} glow={0.4}>
          {flow
            ? Array.from({ length: 28 }, (_, i) => {
                const ph = ((frame * 1.6 + i * 23) % 180) / 180;
                const waste = i % 3 === 0;
                const x = 140 - ph * 120 + Math.sin(ph * 9 + i) * 8;
                const y = 30 + ph * 120 + (waste ? ph * 20 : 0);
                return <circle key={i} cx={waste && ph > 0.55 ? 70 + (ph - 0.55) * 30 : x} cy={waste && ph > 0.55 ? 100 + (ph - 0.55) * 160 : y} r={waste ? 3.2 : 4} fill={waste ? C.amber : C.red} opacity={0.9} />;
              })
            : null}
        </Kidney>
      </div>
      {items.map((it, i) => (
        <Chip key={i} t={t} from={it.w} text={it.text} color={it.color} y={1000 + i * 120} icon={<Check on={interpolate(t, [it.w + 0.15, it.w + 0.45], [0, 1], clamp)} color={it.color} />} />
      ))}
    </AbsoluteFill>
  );
};

// 4-5 · «من خلال معرفتي ... قسم الكلى ... أهمية المحافظة على صحة هذين العضوين»
const S2: React.FC<{ t: number }> = ({ t }) => {
  const t0 = LINES[4].start;
  const card = spring({ frame: f(t - t0), fps: FPS, config: { damping: 15 } });
  const shield = interpolate(t, [LINES[5].start, LINES[5].start + 0.6], [0, 1], out);
  return (
    <AbsoluteFill>
      <div dir="rtl" style={{ position: "absolute", top: 300, left: 140, right: 140, padding: "40px 40px", borderRadius: 40, background: "linear-gradient(160deg, rgba(20,60,100,0.9), rgba(8,26,48,0.95))", border: `2px solid ${C.aqua}66`, transform: `translateY(${(1 - card) * 300}px) rotate(${(1 - card) * -6}deg)`, opacity: card, boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width={100} height={100} viewBox="0 0 24 24"><rect x={2} y={2} width={20} height={20} rx={6} fill={C.aqua} /><path d="M12 6v12M6 12h12" stroke="#04131f" strokeWidth={3.2} strokeLinecap="round" /></svg>
          <div>
            <div style={{ fontFamily: "Cairo", fontWeight: 900, fontSize: 62, color: C.ink }}>من داخل قسم الكلى</div>
            <div style={{ fontFamily: "Cairo", fontWeight: 600, fontSize: 38, color: C.mut }}>معرفة بطبيعة أمراض الكلى</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: shield, transform: `scale(${0.6 + 0.4 * shield})` }}>
        <svg width={460} height={530} viewBox="0 0 260 300" style={{ overflow: "visible", filter: `drop-shadow(0 0 ${40 * shield}px ${C.aqua}88)` }}>
          <path d="M130 8 L246 48 V140 C246 214 196 268 130 292 C64 268 14 214 14 140 V48 Z" fill="rgba(63,208,255,0.12)" stroke={C.aqua} strokeWidth={5} strokeDasharray={900} strokeDashoffset={900 * (1 - shield)} />
          <g transform="translate(52 66) scale(0.52)"><path d={KIDNEY_PATH} fill={C.kidney} /></g>
          <g transform="translate(208 66) scale(-0.52 0.52)"><path d={KIDNEY_PATH} fill={C.kidney} /></g>
        </svg>
      </div>
      <Title t={t} from={at(5, "صحة")} y={1215} size={62} color={C.aqua}>صحة هذين العضوين</Title>
    </AbsoluteFill>
  );
};

// 6 · «عدم شرب كمية كافية ... الجفاف ... البول أكثر تركيزًا»
const S3: React.FC<{ t: number }> = ({ t }) => {
  const t0 = LINES[6].start;
  const drain = interpolate(t, [t0 + 0.2, at(6, "الجفاف") + 0.4], [0.75, 0.06], ease);
  const conc = interpolate(t, [at(6, "تركيز") - 0.4, at(6, "تركيز") + 0.6], [0.1, 0.92], ease);
  const urine = (p: number) => `hsl(${52 - 22 * p}, ${70 + 25 * p}%, ${82 - 42 * p}%)`;
  return (
    <AbsoluteFill>
      <Title t={t} from={at(6, "الجفاف")} size={110} color={C.amber}>الجفاف</Title>
      <div style={{ position: "absolute", left: 540 - 130, top: 420 }}>
        <svg width={260} height={360} viewBox="0 0 300 420">
          <defs><clipPath id="g2"><path d="M30 10 L270 10 L240 410 L60 410 Z" /></clipPath></defs>
          <g clipPath="url(#g2)"><rect x={0} y={410 - 400 * drain} width={300} height={420} fill={C.water} opacity={0.85} /></g>
          <path d="M30 10 L270 10 L240 410 L60 410 Z" fill="none" stroke={C.ink} strokeWidth={5} />
        </svg>
      </div>
      {/* urine colour scale */}
      <div style={{ position: "absolute", top: 900, left: 120, right: 120, opacity: interpolate(t, [at(6, "ويجعل") - 0.2, at(6, "ويجعل") + 0.2], [0, 1], clamp) }}>
        <div dir="rtl" style={{ fontFamily: "Cairo", fontWeight: 800, fontSize: 46, color: C.ink, textAlign: "center", marginBottom: 22 }}>لون البول</div>
        <div style={{ position: "relative", height: 70, borderRadius: 40, background: `linear-gradient(90deg, ${urine(0)}, ${urine(0.5)}, ${urine(1)})` }}>
          <div style={{ position: "absolute", left: `calc(${conc * 100}% - 30px)`, top: -18, width: 60, height: 106, borderRadius: 30, border: `6px solid ${C.ink}`, boxShadow: "0 0 20px rgba(0,0,0,0.6)" }} />
        </div>
        <div dir="ltr" style={{ display: "flex", justifyContent: "space-between", fontFamily: "Cairo", fontWeight: 700, fontSize: 38, color: C.mut, marginTop: 16 }}>
          <span>فاتح</span><span style={{ color: conc > 0.6 ? C.amber : C.mut }}>أكثر تركيزًا</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 7 · «خطر تكوّن حصوات الكلى لدى بعض الأشخاص»
const S4: React.FC<{ t: number }> = ({ t }) => {
  const s = at(7, "حصوات");
  const grow = interpolate(t, [s - 0.6, s + 0.5], [0, 1], out);
  const shake = t > s && t < s + 0.4 ? Math.sin(t * 90) * 6 : 0;
  const stones = [[66, 120, 1], [52, 98, 0.8], [80, 140, 0.7], [44, 128, 0.6]];
  return (
    <AbsoluteFill>
      <Title t={t} from={LINES[7].start} size={78} color={C.ink}>خطر تكوّن</Title>
      <Title t={t} from={s} y={340} size={118} color={C.amber}>حصوات الكلى</Title>
      <div style={{ position: "absolute", left: 540 - 240, top: 560, transform: `translateX(${shake}px)` }}>
        <Kidney size={480} draw={1}>
          {stones.map(([x, y, r], i) => {
            const g = Math.max(0, Math.min(1, grow * 1.6 - i * 0.18));
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(${g * (r as number)})`}>
                <path d="M0 -12 L10 -4 L8 9 L-6 11 L-12 0 Z" fill="#f3e3b5" stroke="#8a6d2b" strokeWidth={1.5} />
              </g>
            );
          })}
        </Kidney>
      </div>
      <Chip t={t} from={at(7, "بعض")} y={1210} text="لدى بعض الأشخاص" color={C.amber} />
    </AbsoluteFill>
  );
};

// 8 · «الجفاف الشديد قد يؤثر في وظائف الكلى، خاصةً إذا لم يُعالج»
const S5: React.FC<{ t: number }> = ({ t }) => {
  const v = interpolate(t, [at(8, "وظائف") - 0.3, at(8, "وظائف") + 0.9], [0.85, 0.28], ease);
  const ang = -120 + 240 * v;
  const warn = t >= at(8, "خاص");
  const col = v > 0.6 ? C.green : v > 0.4 ? C.amber : C.red;
  return (
    <AbsoluteFill>
      <Title t={t} from={LINES[8].start} size={86}>الجفاف الشديد</Title>
      <div style={{ position: "absolute", left: 540 - 300, top: 470 }}>
        <svg width={600} height={420} viewBox="-150 -150 300 210">
          <path d="M-120 0 A120 120 0 0 1 120 0" fill="none" stroke="#183a5e" strokeWidth={26} strokeLinecap="round" transform="rotate(-30) " />
          {[...Array(48)].map((_, i) => {
            const a = (-120 + (240 * i) / 47) * (Math.PI / 180);
            const on = i / 47 <= v;
            const c = i / 47 > 0.6 ? C.green : i / 47 > 0.4 ? C.amber : C.red;
            return <line key={i} x1={Math.sin(a) * 104} y1={-Math.cos(a) * 104} x2={Math.sin(a) * 128} y2={-Math.cos(a) * 128} stroke={on ? c : "#183a5e"} strokeWidth={5} strokeLinecap="round" />;
          })}
          <g transform={`rotate(${ang})`}><path d="M-6 0 L0 -96 L6 0 Z" fill={C.ink} /></g>
          <circle r={14} fill={C.ink} />
          <text y={52} textAnchor="middle" fontFamily="Cairo" fontWeight={800} fontSize={26} fill={col}>وظائف الكلى</text>
        </svg>
      </div>
      {warn ? <Chip t={t} from={at(8, "خاص")} y={1060} text="خاصةً إذا لم يُعالَج" color={C.red} icon={<svg width={48} height={48} viewBox="0 0 24 24"><path d="M12 2 L23 21 H1 Z" fill={C.red} /><path d="M12 9v5M12 17.5v.5" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" /></svg>} /> : null}
    </AbsoluteFill>
  );
};

// 9 · «وهنا تأتي أهمية الوقاية»
const S6: React.FC<{ t: number }> = ({ t }) => {
  const w = at(9, "الوقاية");
  const p = spring({ frame: f(t - w), fps: FPS, config: { damping: 11, stiffness: 160 } });
  const rings = interpolate(t, [w, w + 1.2], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Title t={t} from={LINES[9].start} y={520} size={70} color={C.mut}>وهنا تأتي أهمية</Title>
      {[0, 1, 2].map((i) => {
        const r = Math.max(0, rings - i * 0.2);
        return <div key={i} style={{ position: "absolute", width: 300 + 700 * r, height: 300 + 700 * r, borderRadius: "50%", border: `4px solid ${C.aqua}`, opacity: (1 - r) * 0.8 }} />;
      })}
      <div dir="rtl" style={{ fontFamily: "Cairo", fontWeight: 1000, fontSize: 200, color: C.aqua, transform: `scale(${p})`, textShadow: `0 0 60px ${C.aqua}88` }}>الوقاية</div>
    </AbsoluteFill>
  );
};

// 10 · checklist on its words
const S7: React.FC<{ t: number }> = ({ t }) => {
  const items = [
    { w: at(10, "فشرب"), text: "شرب الماء بانتظام", icon: "💧" },
    { w: at(10, "وعدم"), text: "عدم إهمال العطش", icon: "🥤" },
    { w: at(10, "والانتباه"), text: "الانتباه لتغيّرات البول", icon: "👁" },
  ];
  return (
    <AbsoluteFill>
      <Title t={t} from={LINES[10].start - 0.1} size={76} color={C.aqua}>الوقاية تبدأ بـ</Title>
      {items.map((it, i) => {
        const p = spring({ frame: f(t - it.w), fps: FPS, config: { damping: 15 } });
        const c = interpolate(t, [it.w + 0.3, it.w + 0.6], [0, 1], clamp);
        if (t < it.w) return null;
        return (
          <div key={i} dir="rtl" style={{ position: "absolute", top: 470 + i * 230, left: 90, right: 90, height: 180, borderRadius: 34, background: "rgba(10,42,74,0.85)", border: `2px solid ${C.aqua}55`, display: "flex", alignItems: "center", gap: 30, padding: "0 40px", transform: `translateX(${(1 - p) * -900}px)`, boxShadow: "0 20px 50px rgba(0,0,0,0.35)" }}>
            <Check on={c} />
            <div style={{ fontFamily: "Cairo", fontWeight: 900, fontSize: 56, color: C.ink }}>{it.text}</div>
          </div>
        );
      })}
      <Title t={t} from={at(10, "كلها")} y={1210} size={52} color={C.mut}>كلها أمور تستحق اهتمامنا</Title>
    </AbsoluteFill>
  );
};

// 11-12 · quote: «لا ننتظر المرض ... نبدأ بالوقاية قبل أن نحتاج إلى العلاج»
const S8: React.FC<{ t: number }> = ({ t }) => {
  const w1 = at(11, "لا");
  const w2 = at(12, "نبدأ");
  const strike = interpolate(t, [w2 - 0.4, w2], [0, 1], ease);
  return (
    <AbsoluteFill>
      <Title t={t} from={LINES[11].start} y={300} size={64} color={C.mut}>تذكّروا دائمًا</Title>
      <div dir="rtl" style={{ position: "absolute", top: 470, left: 70, right: 70, textAlign: "center", fontFamily: "Cairo", fontWeight: 900, fontSize: 84, color: C.ink, opacity: interpolate(t, [w1, w1 + 0.3], [0, 1], clamp), lineHeight: 1.3 }}>
        <span style={{ position: "relative" }}>
          لا ننتظر المرض
          <span style={{ position: "absolute", left: 0, right: 0, top: "55%", height: 10, background: C.red, transform: `scaleX(${strike})`, transformOrigin: "right", borderRadius: 6 }} />
        </span>
      </div>
      <div dir="rtl" style={{ position: "absolute", top: 760, left: 60, right: 60, textAlign: "center", fontFamily: "Cairo", fontWeight: 1000, fontSize: 104, color: C.aqua, lineHeight: 1.25, opacity: interpolate(t, [w2, w2 + 0.3], [0, 1], clamp), transform: `scale(${spring({ frame: f(t - w2), fps: FPS, config: { damping: 13 } })})` }}>
        نبدأ بالوقاية
      </div>
      <Title t={t} from={at(12, "قبل")} y={1020} size={58} color={C.ink}>قبل أن نحتاج إلى العلاج</Title>
    </AbsoluteFill>
  );
};

// 13 · ending: a glass fills, «كأس من الماء اليوم ... صحة أفضل غدًا»
const S9: React.FC<{ t: number }> = ({ t }) => {
  const t0 = LINES[13].start;
  const fill = interpolate(t, [t0, at(13, "خطوة")], [0.05, 0.88], out);
  const end = interpolate(t, [LINES[13].end, LINES[13].end + 0.6], [0, 1], out);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 540 - 140, top: 300, transform: `scale(${1 - end * 0.25}) translateY(${-end * 60}px)` }}>
        <svg width={280} height={390} viewBox="0 0 300 420">
          <defs><clipPath id="g3"><path d="M30 10 L270 10 L240 410 L60 410 Z" /></clipPath></defs>
          <g clipPath="url(#g3)"><path d={`M0 ${410 - 400 * fill} Q 75 ${400 - 400 * fill + 10 * Math.sin(t * 6)} 150 ${410 - 400 * fill} T 300 ${410 - 400 * fill} V 420 H 0 Z`} fill={C.water} /></g>
          <path d="M30 10 L270 10 L240 410 L60 410 Z" fill="none" stroke={C.ink} strokeWidth={5} />
        </svg>
      </div>
      <Title t={t} from={at(13, "اليوم")} y={780} size={84}>كأس ماء اليوم</Title>
      <Title t={t} from={at(13, "صحة")} y={900} size={96} color={C.aqua}>صحة أفضل غدًا</Title>
      <div style={{ position: "absolute", top: 1110, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: end }}>
        <div style={{ padding: "10px 34px", borderRadius: 40, border: `3px solid ${C.aqua}`, fontFamily: "Cairo", fontWeight: 800, fontSize: 46, color: C.ink }}>@aymen.1303</div>
      </div>
    </AbsoluteFill>
  );
};

const SCENES = [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9];

/* ---------- transitions (water family) ---------- */

const L: React.CSSProperties = { position: "absolute", inset: 0 };
const Transition: React.FC<{ kind: TrKind; p: number; a: React.ReactNode; b: React.ReactNode; seed: number }> = ({ kind, p, a, b, seed }) => {
  const frame = useCurrentFrame();
  if (kind === "wave") {
    // A liquid wave rises from the bottom and carries the next scene in.
    const lvl = 1920 * (1 - p);
    const amp = 60 * Math.sin(p * Math.PI);
    const path = `M0 ${lvl} ` + Array.from({ length: 13 }, (_, i) => `L${i * 90} ${lvl + Math.sin(i * 0.9 + frame / 3 + seed) * amp}`).join(" ") + ` L1080 1920 L0 1920 Z`;
    return (
      <AbsoluteFill>
        <div style={L}>{a}</div>
        <svg width={1080} height={1920} style={{ position: "absolute" }}>
          <defs><clipPath id={`w${seed}`}><path d={path} /></clipPath></defs>
          <path d={path} fill={C.water} opacity={0.9} transform={`translate(0 ${-30 * Math.sin(p * Math.PI)})`} />
        </svg>
        <div style={{ ...L, clipPath: `path('${path}')` }}>{b}</div>
      </AbsoluteFill>
    );
  }
  if (kind === "zoom") {
    return (
      <AbsoluteFill>
        <div style={{ ...L, transform: `scale(${1 + p * 3})`, filter: `blur(${p * 16}px)`, opacity: 1 - Math.max(0, (p - 0.5) * 2) }}>{a}</div>
        <div style={{ ...L, transform: `scale(${0.6 + 0.4 * p})`, filter: `blur(${(1 - p) * 16}px)`, opacity: Math.min(1, p * 2) }}>{b}</div>
      </AbsoluteFill>
    );
  }
  if (kind === "whip") {
    const blur = Math.sin(p * Math.PI) * 50;
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <svg width={0} height={0}><filter id={`wb${seed}`}><feGaussianBlur stdDeviation={`${blur} 0`} /></filter></svg>
        <div style={{ ...L, transform: `translateX(${p * 1080}px)`, filter: `url(#wb${seed})` }}>{a}</div>
        <div style={{ ...L, transform: `translateX(${p * 1080 - 1080}px)`, filter: `url(#wb${seed})` }}>{b}</div>
      </AbsoluteFill>
    );
  }
  if (kind === "flash") {
    return (
      <AbsoluteFill>
        <div style={L}>{p < 0.5 ? a : b}</div>
        <div style={{ ...L, background: "#fff", opacity: 1 - Math.abs(p - 0.5) * 2 }} />
      </AbsoluteFill>
    );
  }
  if (kind === "drop") {
    // A drop lands in the centre and its ripple opens the next scene.
    return (
      <AbsoluteFill>
        <div style={L}>{a}</div>
        <div style={{ ...L, clipPath: `circle(${Math.pow(p, 1.6) * 120}% at 50% 50%)` }}>{b}</div>
        <div style={{ position: "absolute", left: 540, top: 960, width: 0, height: 0 }}>
          {[0, 1].map((i) => {
            const r = Math.max(0, p - i * 0.15) * 2400;
            return <div key={i} style={{ position: "absolute", left: -r / 2, top: -r / 2, width: r, height: r, borderRadius: "50%", border: `6px solid ${C.aqua}`, opacity: 1 - p }} />;
          })}
        </div>
      </AbsoluteFill>
    );
  }
  // leak: soft light sweep
  return (
    <AbsoluteFill>
      <div style={{ ...L, opacity: 1 - p }}>{a}</div>
      <div style={{ ...L, opacity: p }}>{b}</div>
      <Img src={staticFile("overlays/light_leak_gold_03.jpg")} style={{ ...L, width: "100%", height: "100%", mixBlendMode: "screen", opacity: Math.sin(p * Math.PI) * 0.8, filter: "hue-rotate(160deg)", transform: `scale(${1.2 + p * 0.3})` }} />
    </AbsoluteFill>
  );
};

const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  let i = 0;
  for (let k = 0; k < SCENES.length; k++) if (t >= SCENE_START[k]) i = k;
  const Cur = SCENES[i];
  const nextStart = i + 1 < SCENES.length ? SCENE_START[i + 1] : 1e9;
  // transition window: [nextStart - TR_LEN/2, nextStart + TR_LEN/2]
  const inNext = i + 1 < SCENES.length && t >= nextStart - TR_LEN / 2;
  const inPrev = i > 0 && t < SCENE_START[i] + TR_LEN / 2;
  if (inNext || inPrev) {
    const k = inNext ? i + 1 : i;
    const A = SCENES[k - 1];
    const B = SCENES[k];
    const p = interpolate(t, [SCENE_START[k] - TR_LEN / 2, SCENE_START[k] + TR_LEN / 2], [0, 1], ease);
    return <Transition kind={TRANS[k]} p={p} seed={k} a={<A t={t} />} b={<B t={t} />} />;
  }
  void sceneEnd;
  return <Cur t={t} />;
};

// Word-by-word captions: ≤5 words, break on punctuation; active word aqua.
const CHUNKS: Word[][] = [];
LINES.forEach((ln) => {
  let cur: Word[] = [];
  ln.words.forEach((w, i) => {
    cur.push(w);
    if (i === ln.words.length - 1 || cur.length >= 5 || /[،,.؟?:؛]$/.test(w.w)) { CHUNKS.push(cur); cur = []; }
  });
});
const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const c = CHUNKS.find((ch, i) => t >= ch[0].start - 0.04 && t < Math.min(ch[ch.length - 1].end + 0.3, (CHUNKS[i + 1]?.[0].start ?? 1e9) - 0.03));
  if (!c) return null;
  const pop = spring({ frame: frame - f(c[0].start - 0.04), fps: FPS, config: { damping: 15, stiffness: 220 } });
  return (
    <div style={{ position: "absolute", left: 0, width: W, top: 1400, display: "flex", justifyContent: "center" }}>
      <div dir="rtl" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.28em", maxWidth: 900, padding: "8px 30px 14px", borderRadius: 26, background: "rgba(3,14,30,0.72)", fontFamily: "Cairo", fontWeight: 800, fontSize: 56, lineHeight: 1.4, color: C.ink, transform: `scale(${0.88 + 0.12 * pop})` }}>
        {c.map((w, i) => {
          const active = t >= w.start && t < (c[i + 1]?.start ?? w.end + 0.3);
          return <span key={i} style={{ color: active ? C.aqua : C.ink, display: "inline-block" }}>{w.w}</span>;
        })}
      </div>
    </div>
  );
};

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <div style={{ position: "absolute", left: 0, top: 0, height: 8, width: (W * frame) / durationInFrames, background: C.aqua, boxShadow: `0 0 14px ${C.aqua}` }} />;
};

const Sfx: React.FC<{ at: number; src: string; volume: number; len?: number }> = ({ at: s, src, volume, len = 1.5 }) => (
  <Sequence from={Math.max(0, f(s))} durationInFrames={f(len)} layout="none">
    <Audio src={staticFile(`kidney/sfx/${src}.mp3`)} volume={volume} />
  </Sequence>
);

const TR_SFX: Record<TrKind, string> = { wave: "swish_soft", zoom: "whoosh_deep_03", whip: "whoosh_fast_02", flash: "hit_soft_01", drop: "drip_drop", leak: "shimmer_01" };

export const KidneyReel: React.FC = () => {
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg0 }}>
      <Background />
      <Stage />
      <Captions />
      <Progress />
      <Audio src={staticFile("kidney/vo.wav")} />
      {/* background audio file, low and ducked by its level only (no music) */}
      <Audio src={staticFile("kidney/sfx/drone_calm_low_loop.mp3")} loop volume={(fr) => 0.07 * interpolate(fr, [0, 20, durationInFrames - 40, durationInFrames], [0, 1, 1, 0], clamp)} />
      <Sfx at={0.7} src="drip_drop" volume={0.5} />
      {SCENE_START.slice(1).map((s, k) => (
        <Sfx key={k} at={s - TR_LEN / 2 - 0.05} src={TR_SFX[TRANS[k + 1]]} volume={0.28} />
      ))}
      <Sfx at={at(7, "حصوات")} src="hit_soft_01" volume={0.3} />
      <Sfx at={at(9, "الوقاية")} src="chime_soft_01" volume={0.3} len={2.5} />
      {["فشرب", "وعدم", "والانتباه"].map((w, i) => <Sfx key={w} at={at(10, w) + 0.3} src={i % 2 ? "pop_high_02" : "pop_01"} volume={0.28} len={0.6} />)}
    </AbsoluteFill>
  );
};
