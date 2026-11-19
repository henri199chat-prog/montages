import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

/**
 * «قصة الدينار» — economic documentary style (NOT the religious style): charcoal black, Tunisian flag red,
 * off-white, steel for the dollar, blue for the euro, amber for warnings. Data-journalism look.
 */
export const T = {
  bg: "#0A0A0C",
  panel: "#141418",
  red: "#E70013",
  redDeep: "#8E0010",
  white: "#F5F3EE",
  grey: "#8C9099",
  dim: "#4A4D55",
  steel: "#A9B8C9", // the dollar
  euro: "#7C95D8",
  amber: "#F4B740",
};
export const F = {
  ar: "TnCairo, sans-serif", // Arabic display (variable weight)
  arBody: "TnPlexAr, sans-serif",
  num: "TnBebas, sans-serif", // tall data numbers
  hit: "TnAnton, sans-serif",
  mono: "TnMono, monospace",
};

let p: Promise<unknown> | null = null;
const loadAll = () => {
  if (!p) {
    const f = (family: string, file: string, weight?: string) => loadFont({ family, url: staticFile(`tn-dinar/fonts/${file}`), weight });
    p = Promise.all([
      f("TnCairo", "Cairo-Variable.woff2", "200 1000"),
      f("TnPlexAr", "IBMPlexSansArabic-Bold.woff2", "700"),
      f("TnBebas", "BebasNeue-Regular.woff2"),
      f("TnAnton", "Anton-Regular.woff2"),
      f("TnMono", "IBMPlexMono-Medium.ttf"),
    ]);
  }
  return p;
};
export const useTnFonts = () => {
  const [ready, setReady] = useState(false);
  const [h] = useState(() => delayRender("tn fonts"));
  useEffect(() => {
    loadAll()
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        continueRender(h);
      })
      .catch((e) => {
        console.error(e);
        continueRender(h);
      });
  }, [h]);
  return ready;
};

/**
 * Official exchange rate, dinars per US dollar, period average — World Bank WDI PA.NUS.FCRF (fetched 2026-11-19),
 * plus November 2026 ≈ 3.04 (mid-market, Wise / RIA, 2026-11-19).
 */
export const USD_TND: [number, number][] = [
  [1975, 0.402], [1976, 0.429], [1977, 0.429], [1978, 0.416], [1979, 0.406], [1980, 0.405], [1981, 0.494], [1982, 0.591],
  [1983, 0.679], [1984, 0.777], [1985, 0.834], [1986, 0.794], [1987, 0.829], [1988, 0.858], [1989, 0.949], [1990, 0.878],
  [1991, 0.925], [1992, 0.884], [1993, 1.004], [1994, 1.012], [1995, 0.946], [1996, 0.973], [1997, 1.106], [1998, 1.139],
  [1999, 1.186], [2000, 1.371], [2001, 1.439], [2002, 1.422], [2003, 1.288], [2004, 1.245], [2005, 1.297], [2006, 1.331],
  [2007, 1.281], [2008, 1.232], [2009, 1.35], [2010, 1.431], [2011, 1.408], [2012, 1.562], [2013, 1.625], [2014, 1.698],
  [2015, 1.962], [2016, 2.148], [2017, 2.419], [2018, 2.647], [2019, 2.934], [2020, 2.812], [2021, 2.794], [2022, 3.104],
  [2023, 3.106], [2024, 3.107], [2025, 2.997], [2026.88, 3.04],
];
/** value of the series at a (fractional) year */
export const rateAt = (y: number) => {
  if (y <= USD_TND[0][0]) return USD_TND[0][1];
  for (let i = 0; i < USD_TND.length - 1; i++) {
    const [a, va] = USD_TND[i], [b, vb] = USD_TND[i + 1];
    if (y <= b) return va + ((vb - va) * (y - a)) / (b - a);
  }
  return USD_TND[USD_TND.length - 1][1];
};
