import { Composition } from "remotion";
import { TasbihAdV2 } from "./TasbihAdV2";
import { ReligiousDemo } from "./religious/ReligiousDemo";
import religiousSample from "./religious/data/sample-tawbah-102-104.json";
import { NiamReel, NIAM_TOTAL } from "./religious/NiamReel";
import { DinarReel, DINAR_TOTAL } from "./religious/DinarReel";
import { BaoudaReel, BAOUDA_TOTAL } from "./religious/BaoudaReel";
import { ImranReel, IMRAN_TOTAL } from "./religious/ImranReel";
import { JumuahReel, JUMUAH_TOTAL } from "./religious/JumuahReel";
import { LawReel, LAW_TOTAL } from "./religious/LawReel";

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
      {/* Naseeha «شكر النعم» (talk audio from Ayman's video + An-Nahl 16:18) */}
      <Composition
        id="NiamReel"
        component={NiamReel}
        durationInFrames={Math.round(NIAM_TOTAL * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Hadith talk «تعس عبد الدينار» (original audio of the clip Ayman sent) */}
      <Composition
        id="DinarReel"
        component={DinarReel}
        durationInFrames={Math.round(DINAR_TOTAL * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* «البعوضة» — science narration around Al-Baqarah 2:26 (voice only, music removed) */}
      <Composition
        id="BaoudaReel"
        component={BaoudaReel}
        durationInFrames={Math.round(BAOUDA_TOTAL * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Aal-Imran 3:133–134, child's recitation, original audio untouched */}
      <Composition
        id="ImranReel"
        component={ImranReel}
        durationInFrames={Math.round(IMRAN_TOTAL * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Friday: hadith (Abu Dawud 1047) + Al-Ahzab 33:56, voice only */}
      <Composition
        id="JumuahReel"
        component={JumuahReel}
        durationInFrames={Math.round(JUMUAH_TOTAL * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
      {/* Ibn Uthaymeen «لا تقل لو» — voice only, clearer */}
      <Composition
        id="LawReel"
        component={LawReel}
        durationInFrames={Math.round(LAW_TOTAL * 30)}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
