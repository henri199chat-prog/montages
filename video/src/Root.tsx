import { Composition } from "remotion";
import { TasbihAdV2 } from "./TasbihAdV2";
import { ReligiousDemo } from "./religious/ReligiousDemo";
import religiousSample from "./religious/data/sample-tawbah-102-104.json";

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
      {/* Ayman's religious style demo (silent). Template: src/religious/RecitationReel.tsx */}
      <Composition
        id="ReligiousDemo"
        component={ReligiousDemo}
        durationInFrames={Math.round(religiousSample.total * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
