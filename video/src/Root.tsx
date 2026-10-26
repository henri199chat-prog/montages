import { Composition } from "remotion";
import { TasbihAdV2 } from "./TasbihAdV2";
import { REEL_FRAMES, TasbihReel } from "./TasbihReel";
import { AYMEN_FRAMES, AymenEdit } from "./AymenEdit";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TasbihAd"
        component={TasbihAdV2}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="TasbihReel"
        component={TasbihReel}
        durationInFrames={REEL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="AymenEdit"
        component={AymenEdit}
        durationInFrames={AYMEN_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
