import React, { useLayoutEffect, useRef, useState } from "react";
import { useCurrentFrame } from "remotion";
import { C, FONT, FPS } from "./theme";
import { E, P, arNum, env, lerp } from "./anim";
import type { AyahData, AyahPage } from "./types";

/**
 * Quran verse text, bottom of the frame, karaoke word reveal (ported from the 002 reel):
 * - every word starts grey (alpha .42) and turns to its colour in 0.18 s (easeOut) when it is recited:
 *   k="g" gold + soft glow (divine names, hope, promise) | k="c" coral (sin) | else off-white
 * - gold ﴿ ﴾ brackets; the ۝ medallion with Arabic-Indic digits closes the LAST page of each ayah;
 *   brackets/medallion go muted gold -> gold after the last word of the page
 * - page switch: old page fades out 0.3 s, new page fades in 0.35 s rising 14 px
 * - box: x 40..1040, y 1290..1770, AmiriQuran, line-height 2.42 (so waqf marks never touch the line above),
 *   70 px shrunk until every line is <= 920 px wide
 * Text MUST be the verified Uthmani text (religious/tools/quran.py), never ASR output.
 */
const hexA = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mixRGBA = (a: string, b: string, u: number, al: number) => {
  const A = hexA(a), B = hexA(b);
  return `rgba(${A.map((v, i) => Math.round(lerp(v, B[i], u))).join(",")},${al.toFixed(3)})`;
};

const lineSplit = (pg: AyahPage) => {
  const out: { i: number; t: string }[][] = [];
  let wi = 0;
  for (const end of pg.lines) {
    const ln: { i: number; t: string }[] = [];
    for (; wi < end; wi++) ln.push({ i: wi, t: pg.words[wi].t });
    out.push(ln);
  }
  return out;
};

const PageBody: React.FC<{ pg: AyahPage; t: number; lineRefs?: (el: HTMLDivElement | null) => void }> = ({ pg, t, lineRefs }) => {
  const lines = lineSplit(pg);
  const last = pg.words[pg.words.length - 1].on;
  const bracketCol = mixRGBA(C.mgold, C.gold, P(t, last, 0.6), 0.9);
  return (
    <>
      {lines.map((ln, li) => (
        <div key={li} ref={lineRefs} style={{ whiteSpace: "nowrap", textAlign: "center", direction: "rtl" }}>
          {li === 0 && <span style={{ color: bracketCol }}>{"\uFD3F"} </span>}
          {ln.map(({ i, t: txt }, k) => {
            const w = pg.words[i];
            const u = P(t, w.on - 0.03, 0.18, E.o);
            const tgt = w.k === "g" ? C.gold : w.k === "c" ? C.coralText : C.white;
            const act = env(t, w.on - 0.03, 0.1, w.off, 0.5);
            const shadow =
              w.k === "g"
                ? `0 0 ${(10 + 10 * act).toFixed(1)}px rgba(227,204,143,${(0.2 * u + 0.22 * act).toFixed(3)})`
                : act > 0.01
                  ? `0 0 14px rgba(240,242,235,${(0.16 * act).toFixed(3)})`
                  : "none";
            return (
              <React.Fragment key={i}>
                <span style={{ color: mixRGBA(C.grey, tgt, u, lerp(0.42, 1, u)), textShadow: shadow }}>{txt}</span>
                {k < ln.length - 1 ? " " : ""}
              </React.Fragment>
            );
          })}
          {li === lines.length - 1 && (
            <>
              <span style={{ color: bracketCol }}> {"\uFD3E"}</span>
              {pg.num && <span style={{ color: bracketCol }}> {"\u06DD" + arNum(pg.n)}</span>}
            </>
          )}
        </div>
      ))}
    </>
  );
};

export const AyahKaraoke: React.FC<{
  data: AyahData;
  top?: number;
  height?: number;
  maxLine?: number;
  baseSize?: number;
  /** extra fade of the last page towards the end (0.8 in 002) */
  endDim?: number;
}> = ({ data, top = 1290, height = 480, maxLine = 920, baseSize = 70, endDim = 0.8 }) => {
  const t = useCurrentFrame() / FPS;
  const pages = data.pages;
  const TOTAL = data.total;
  const SW = pages.map((p, k) => (k + 1 < pages.length ? Math.min(p.end, pages[k + 1].start - 0.25) : TOTAL));

  // measure every page once at base size, then shrink to fit
  const [sizes, setSizes] = useState<number[] | null>(null);
  const meas = useRef<HTMLDivElement[][]>([]);
  useLayoutEffect(() => {
    const s = pages.map((_, k) => {
      const els = meas.current[k] || [];
      const mw = Math.max(1, ...els.map((e) => e.scrollWidth));
      return mw <= maxLine ? baseSize : Math.floor(baseSize * (maxLine / mw));
    });
    setSizes(s);
  }, [pages, baseSize, maxLine]);

  const box: React.CSSProperties = {
    position: "absolute",
    left: 40,
    width: 1000,
    top,
    height,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: FONT.quran,
    lineHeight: 2.42,
  };

  if (!sizes) {
    return (
      <div style={{ position: "absolute", visibility: "hidden" }}>
        {pages.map((pg, k) => (
          <div key={k} style={{ ...box, fontSize: baseSize, alignItems: "flex-start" }}>
            <PageBody
              pg={pg}
              t={0}
              lineRefs={(el) => {
                if (!el) return;
                meas.current[k] = meas.current[k] || [];
                if (!meas.current[k].includes(el)) meas.current[k].push(el);
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {pages.map((pg, k) => {
        const tin = k === 0 ? pg.start - 0.5 : SW[k - 1];
        const isLast = k + 1 === pages.length;
        const tout = !isLast ? SW[k] - 0.3 : TOTAL - 1.0;
        const op =
          P(t, tin, k === 0 ? 0.45 : 0.35, E.s) *
          (1 - P(t, tout, !isLast ? 0.3 : 0.8, E.s)) *
          (!isLast ? 1 : lerp(1, endDim, P(t, TOTAL - 4.5, 1, E.s)));
        if (op <= 0.001) return null;
        const dy = (1 - P(t, tin, 0.6, E.o)) * 14 - P(t, tout, 0.4, E.s) * 8;
        return (
          <div key={k} style={{ ...box, fontSize: sizes[k], opacity: op, transform: `translateY(${dy.toFixed(2)}px)` }}>
            <PageBody pg={pg} t={t} />
          </div>
        );
      })}
    </>
  );
};

/** index of the page on screen at time t (for HUD label / counter / scene logic) */
export const pageAt = (data: AyahData, t: number) => {
  let k = 0;
  data.pages.forEach((p, i) => {
    if (t >= (i ? Math.min(data.pages[i - 1].end, p.start - 0.25) : 0)) k = i;
  });
  return k;
};
/** onset (video s) of word i on page p */
export const wordOn = (data: AyahData, p: number, i: number) => data.pages[p].words[i].on;
