// Time helpers ported 1:1 from the original 002 reel (lib.js). Everything is a pure function of time t (seconds).
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const rad = (a: number) => (a * Math.PI) / 180;

export const E = {
  io: (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2),
  o: (u: number) => 1 - Math.pow(1 - u, 3),
  i: (u: number) => u * u * u,
  s: (u: number) => -(Math.cos(Math.PI * u) - 1) / 2,
  back: (u: number) => {
    const c1 = 1.4, c3 = c1 + 1;
    return 1 + c3 * Math.pow(u - 1, 3) + c1 * Math.pow(u - 1, 2);
  },
  x: (u: number) => (u >= 1 ? 1 : 1 - Math.pow(2, -10 * u)),
  q: (u: number) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2),
};
export type Ease = (u: number) => number;

/** progress 0..1 of a tween that starts at a and lasts d seconds */
export const P = (t: number, a: number, d: number, e: Ease = E.io) => e(clamp((t - a) / d));
/** envelope: fade in at a over ai, fade out at b over bo */
export const env = (t: number, a: number, ai: number, b: number, bo: number, e: Ease = E.s) =>
  P(t, a, ai, e) * (1 - P(t, b, bo, e));
/** deterministic pseudo-random 0..1 (never Math.random in Remotion) */
export const hash = (i: number, k = 0) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type Num = Record<string, number>;
/** keyframes: [[t, {props}, ease?], ...] -> interpolated props at time t */
export function kf<T extends Num>(t: number, keys: [number, T, Ease?][], e: Ease = E.io): T {
  if (t <= keys[0][0]) return { ...keys[0][1] };
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1, e1] = keys[i + 1];
    if (t <= t1) {
      const u = (e1 || e)(clamp((t - t0) / Math.max(1e-6, t1 - t0)));
      const o: Num = { ...v0 };
      for (const k in v1) o[k] = k in v0 ? lerp(v0[k], v1[k], u) : v1[k];
      return o as T;
    }
  }
  return { ...keys[keys.length - 1][1] };
}

export const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";
export const arNum = (n: number) => String(n).split("").map((d) => AR_DIGITS[+d]).join("");
