import React from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FPS } from "./theme";
import { E, P, env, lerp } from "./anim";

/**
 * Captions for TALK videos (naseeha, hadith explanation, Fajr tips, podcast) — Ayman's works W1–W3:
 * centred lower-middle (≈60–75% of height), 1–3 lines, ≈5–7% of frame height per line (≈ 52–64 px here),
 * karaoke: grey -> white as each word is spoken; key words (k="g") turn gold and get a rounded gold glow box
 * that draws around them; (k="c") coral for negative words, (k="x") coral + red strike-through (rejected idea).
 * Optional small grey/gold source line above (e.g. «الشيخ ابن عثيمين رحمه الله» / «رواه مسلم»).
 * variant "naskh" (AmiriQuran) for hadith / dua text with tashkeel; "sans" (IBM Plex Sans Arabic SemiBold) for tips.
 */
export type CapWord = { t: string; on: number; off: number; k?: "" | "g" | "c" | "x" | string };

export const TipCaption: React.FC<{
  words: CapWord[];
  start: number; // page in (s)
  end: number; // page out (s)
  source?: string;
  variant?: "sans" | "naskh";
  y?: number; // centre y of the text block
  size?: number;
  maxWidth?: number;
  breaks?: number[]; // word indices that start a new line
  boxes?: boolean; // gold glow box around k="g" words (tips); false = gold text only (naseeha / hadith)
}> = ({ words, start, end, source, variant = "sans", y = 1300, size = 58, maxWidth = 900, breaks = [], boxes = true }) => {
  const t = useCurrentFrame() / FPS;
  const op = P(t, start - 0.2, 0.35, E.s) * (1 - P(t, end - 0.3, 0.3, E.s));
  if (op <= 0.001) return null;
  const dy = (1 - P(t, start - 0.2, 0.6, E.o)) * 14;
  const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const col = (a: string, b: string, u: number, al: number) => {
    const A = hex(a), B = hex(b);
    return `rgba(${A.map((v, i) => Math.round(lerp(v, B[i], u))).join(",")},${al})`;
  };
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - maxWidth) / 2,
        width: maxWidth,
        top: y,
        transform: `translateY(-50%) translateY(${dy}px)`,
        opacity: op,
        textAlign: "center",
        direction: "rtl",
      }}
    >
      {source && (
        <div style={{ fontFamily: FONT.ar, fontWeight: 500, fontSize: 26, color: C.mgold, marginBottom: 18, opacity: 0.9 }}>{source}</div>
      )}
      <div
        style={{
          fontFamily: variant === "naskh" ? FONT.quran : FONT.ar,
          fontWeight: variant === "naskh" ? 400 : 600,
          fontSize: size,
          lineHeight: variant === "naskh" ? 2.1 : 1.55,
        }}
      >
        {words.map((w, i) => {
          const u = P(t, w.on - 0.03, 0.18, E.o);
          const gold = w.k === "g";
          const key = gold && boxes;
          const neg = w.k === "c" || w.k === "x";
          const tgt = gold ? C.gold : neg ? C.coralText : C.white;
          const box = key ? P(t, w.on, 0.45, E.o) : 0;
          const act = env(t, w.on - 0.03, 0.1, w.off, 0.5);
          const strike = w.k === "x" ? P(t, w.off, 0.35, E.io) : 0;
          return (
            <React.Fragment key={i}>
              {breaks.includes(i) && <br />}
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  padding: key ? "0 .18em" : undefined,
                  color: col(C.grey, tgt, u, lerp(0.42, 1, u)),
                  textShadow: gold
                    ? `0 0 ${(10 + 10 * act).toFixed(1)}px rgba(227,204,143,${(0.2 * u + 0.22 * act).toFixed(3)})`
                    : act > 0.01
                      ? `0 0 14px rgba(240,242,235,${(0.16 * act).toFixed(3)})`
                      : "none",
                }}
              >
                {key && box > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      inset: "0.12em -0.02em 0.02em",
                      border: `2px solid ${C.gold}`,
                      borderRadius: 14,
                      opacity: box,
                      transform: `scale(${lerp(1.15, 1, box)})`,
                      boxShadow: `0 0 ${10 + 8 * act}px rgba(227,204,143,.45), inset 0 0 12px rgba(227,204,143,.18)`,
                      background: "rgba(227,204,143,.07)",
                    }}
                  />
                )}
                {w.t}
                {strike > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "52%",
                      height: 4,
                      width: `${strike * 100}%`,
                      background: C.coral,
                      borderRadius: 2,
                    }}
                  />
                )}
              </span>
              {i < words.length - 1 ? " " : ""}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
