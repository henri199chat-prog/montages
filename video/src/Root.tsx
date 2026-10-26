import { Composition } from "remotion";
import { TasbihAd } from "./TasbihAd";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TasbihAd"
        component={TasbihAd}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
