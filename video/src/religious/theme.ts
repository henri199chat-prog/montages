import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";

/** Ayman's confirmed palette (measured from his own reels, see religious/README.md §4) */
export const C = {
  gold: "#E3CC8F", // bright gold: key words, logo, lines
  mgold: "#B09F75", // muted gold: header category, brackets ﴿﴾ before they light up
  white: "#F0F2EB", // off-white: spoken words
  grey: "#97A0A2", // unread words (shown at ~42% alpha)
  teal: "#608F8C", // Latin mono HUD labels
  coral: "#E66A65", // negative words / figures (sin, fear) ; karaoke text uses #EE8A84
  coralText: "#EE8A84",
  navy: "#0E1D2B", // stick-figure mouth
  dim: "#6E7E88",
  deep: "#0A141D", // background corners
  mid: "#10202E",
  centre: "#152E43",
  footer: "#7F8F90",
};

export const W = 1080, H = 1920, FPS = 30;
/** floor line for stick figures / scenery (002) */
export const FLOOR = 1150;

export const FONT = {
  quran: "AmiriQuran, serif", // Quran & hadith text (Uthmani, full tashkeel)
  ar: "PlexAr, sans-serif", // Arabic UI, tips, CTA
  mono: "PlexMono, monospace", // Latin HUD labels
  monoR: "PlexMonoR, monospace", // watermark, small subs
};

let fontsPromise: Promise<unknown> | null = null;
const loadAll = () => {
  if (!fontsPromise) {
    const f = (family: string, file: string, weight?: string) =>
      loadFont({ family, url: staticFile(`religious/fonts/${file}`), weight });
    fontsPromise = Promise.all([
      f("AmiriQuran", "AmiriQuran-Regular.woff2"),
      f("PlexAr", "IBMPlexSansArabic-Medium.ttf", "500"),
      f("PlexAr", "IBMPlexSansArabic-SemiBold.ttf", "600"),
      f("PlexAr", "IBMPlexSansArabic-Bold.woff2", "700"),
      f("PlexMono", "IBMPlexMono-Medium.ttf"),
      f("PlexMonoR", "IBMPlexMono-Regular.ttf"),
    ]);
  }
  return fontsPromise;
};

/** Render nothing until the fonts are in (text measuring depends on it). */
export const useReligiousFonts = () => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("religious fonts"));
  useEffect(() => {
    loadAll()
      .then(() => document.fonts.ready)
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [handle]);
  return ready;
};
