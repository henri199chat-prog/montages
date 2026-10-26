---
name: "video-editing-toolkit"
description: "فهرس أدوات المونتاج الاحترافية وكيف تثبّتها وتدمجها مع video-ad-editor. ALWAYS use this skill when the user wants professional video editing and asks which tools are available, how to install a video-editing skill, or says أبي أدوات مونتاج، شنو المتاح للفيديو، كيف أثبّت مهارة مونتاج، أو أبي أقص سكتات / زوم / بي-رول / ريلز. دليل مرجعي فقط — الأدوات نفسها تتطلّب تثبيتاً يدوياً على جهاز المستخدم."
---

# أدوات المونتاج الاحترافية — فهرس ودليل تثبيت

هذا **دليل مرجعي** لأدوات مونتاج الفيديو المتاحة بمنظومة skills المفتوحة. كل أداة هي حزمة كود مستقلة تُثبّت على جهاز المستخدم — هذا الفهرس يقول أيّها تناسب المهمة وكيف تُثبّت.

## ⚠️ ملاحظة جوهرية قبل أي شي

هذه الأدوات **لا تُثبّت من داخل الجلسة السحابية** (GitHub وnpm محجوبان عن الطرفية). المستخدم يشغّل أوامر التثبيت بنفسه على جهازه (ماك/ويندوز/لينكس). دورُك: اعرض الأمر الصحيح، اشرح شو يسوي، ووضّح المتطلبات (Node.js · Python · ffmpeg).

**الأوامر أدناه مجموعة من دليل Tella لأفضل skills لعام 2026 — ولم تُتحقّق من GitHub مباشرة.** قبل التثبيت اطلب من المستخدم يتأكد من الرابط على skills.sh أو GitHub، ولا تشغّل سكربت تثبيت من مصدر مجهول دون مراجعته.

---

## الأدوات مرتّبة حسب الاستخدام

### 🎬 ريلز وكابشن من فيديو كلام (الأقرب لشغل المستخدم)

**Clipify** — يحوّل الفيديو الطويل لمقاطع سوشال، يقص 16:9 ← 9:16، ويركّب كابشن كلمة-كلمة. (Tella)
```
git clone https://github.com/louisedesadeleer/clipify.git ~/.claude/skills/clipify
```

**Cut Video** — يشيل السكتات وال«آآه» وكلمات الحشو، ويحافظ على الضحكات والوقفات المقصودة. (Tella)
```
git clone https://github.com/louisedesadeleer/cut-video.git ~/.claude/skills/cut-video
```

**Add Zooms** — يضيف زوم-نبضة (punch-zoom) وحركة Ken Burns على فيديوهات الكلام، بالـ ffmpeg. (Tella)
```
git clone https://github.com/louisedesadeleer/add-zooms.git
cd add-zooms && ./install.sh
```

**B-Roll Finder** — يلقى بي-رول مناسب لكل مقطع من الترانسكريبت ويحطّ القطعات على الكلمة المطابقة. (Tella)
```
git clone https://github.com/louisedesadeleer/b-roll-finder.git
brew install yt-dlp ffmpeg imagemagick
uv tool install mlx-whisper
```

### ✨ موشن قرافيكس متقدّم (Remotion)

**video-shotcraft** — فيديوهات سينمائية للمنتجات بـ Remotion، +100 وصفة لقطة. (Vincent Wei) — الوحيد بأمر npx مباشر:
```
npx skills add Vincentwei1021/video-shotcraft
```

**remotion-video-skill** — فيديوهات شرح متحركة بـ React/Remotion من وصف نصي، مع تعليق صوتي (Edge TTS). يحتاج Node.js · Python · ffmpeg. (wshuyi)
```
git clone https://github.com/wshuyi/remotion-video-skill.git ~/.claude/skills/remotion-video
pip install edge-tts
```

### ☁️ خيار تجاري (سحابي — يحتاج حساب مدفوع)

**OpusClip** — يقص فيديوهات طويلة، كابشن، ونشر مجدول للسوشال. يحتاج `OPUSCLIP_API_KEY` وخطة Pro/Max/Enterprise، و`curl` و`jq` و`ffmpeg`. (opus-pro)
```
/plugin marketplace add opus-pro/opus-skills
/plugin install opusclip@opus-skills
```
بديل لأي مضيف: `npx skills add opus-pro/opus-skills`

---

## التكامل مع video-ad-editor (مهارة مجتبى خليفة)

`video-ad-editor` متكاملة وتغطّي السلسلة كاملة (قص سكتات ← تفريغ ← كابشن عربي ← موشن ← رندر). استخدم الأدوات فوق **بديلاً أو مكمّلاً** حسب الحاجة:

- المستخدم يبي السلسلة العربية الكاملة بألوانه ← **video-ad-editor** (الأساس).
- يبي بس يشيل السكتات بسرعة ← **Cut Video**.
- يبي زوم ديناميكي بس ← **Add Zooms**.
- يبي بي-رول جاهز من الويب ← **B-Roll Finder**.
- فيديو شرح/منتج سينمائي بدون متحدّث ← **video-shotcraft** أو **remotion-video-skill**.

عند التعارض: لو المستخدم يبي إعلاناً عربياً عمودياً كاملاً، **video-ad-editor** هي الأولى دائماً — الباقي أدوات متخصّصة لخطوة وحدة.

## البحث عن المزيد

- المتصفّح: https://skills.sh/ (الليدربورد مرتّب حسب التثبيتات)
- الـ CLI: `npx skills find "<كلمة مفتاح>"` ثم `npx skills add <owner/repo@skill> -g -y`
- رجّح الـ skills بـ +1000 تثبيت ومن مصادر موثوقة (anthropics · vercel-labs · Tella).