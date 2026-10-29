import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FPS } from "./theme";

/**
 * Hand-inked look for the line-art layer (style v2, from the clawd-animation principles):
 * - BOIL: the whole drawing wobbles very slightly and the wobble changes 12 times a second, like hand-drawn animation
 *   (low-frequency displacement, so lines wave instead of getting noisy). Still things stay readable.
 * - BRUSH: a fine grain eats a little into the strokes' alpha, so lines look inked with a brush, not vector-perfect.
 * Colours are untouched (navy / gold / white stay exactly the palette). Pure function of the frame number.
 * Use: <InkLayer>{scene}</InkLayer>  (RecitationReel does this when ink is on).
 */
export const BOIL_FPS = 12;

export const InkLayer: React.FC<{ children: React.ReactNode; amount?: number; grain?: number; id?: string }> = ({
  children,
  amount = 2.6,
  grain = 0.55,
  id = "inkBoil",
}) => {
  const f = useCurrentFrame();
  const bf = Math.floor((f / FPS) * BOIL_FPS); // boil frame: held for 2–3 video frames
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id={id} x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves={2} seed={(bf % 997) + 1} result="wob" />
            <feDisplacementMap in="SourceGraphic" in2="wob" scale={amount} xChannelSelector="R" yChannelSelector="G" result="moved" />
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={((bf * 7) % 991) + 3} result="tooth" />
            {/* alpha = 1 - grain * noise (only eats into strokes, never adds colour) */}
            <feColorMatrix in="tooth" type="matrix" values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  ${-grain} 0 0 0 ${1 + grain * 0.35}`} result="mask" />
            <feComposite in="moved" in2="mask" operator="in" />
          </filter>
        </defs>
      </svg>
      <AbsoluteFill style={{ filter: `url(#${id})` }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
