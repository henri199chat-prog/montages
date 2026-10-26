import { Composition } from "remotion";
import { TasbihAdV2 } from "./TasbihAdV2";

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
    </>
  );
};
