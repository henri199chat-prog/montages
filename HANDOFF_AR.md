# ملف تسليم: أين وصل أيمن مع Claude Code (26 أكتوبر 2026)

اقرأ هذا الملف كاملًا قبل أن ترد. أنا أيمن الغلقاوي من تونس، أكتب بالعربية، مبتدئ، وأستعمل الهاتف فقط (Samsung S25 Ultra) بلا كمبيوتر. كلّمني بالعربية البسيطة، خطوة خطوة، وأعطني رسائل جاهزة ألصقها لـ Claude Code.

## 1. أين أعمل
- Claude Code على الويب من الهاتف: claude.ai/code (باقة Pro، نموذج Opus 5.5).
- البيئة السحابية اسمها `Claude caude.01`، وفتحت فيها الإنترنت من إعدادات Network access.
- المستودع: https://github.com/henri199chat-prog/montages
- الفرع الذي نعمل عليه: `ccr-03667856-catmah` (لا نلمس main).
- الجلسة الحالية في Claude Code اسمها «مشروع Remotion للفيديو».
- لمشاهدة الفيديوهات من الهاتف: تطبيق GitHub ← مستودع montages ← غيّر الفرع إلى ccr-03667856-catmah ← مجلد `videos`.

## 2. ما الموجود في المستودع
- `video/` مشروع Remotion (فيديو بالكود).
- `videos/` الفيديوهات المصدّرة بأرقام: -v1 ثم -v2 ... (لا تُحذف القديمة).
- `.claude/skills/` المهارات:
  - مهارات Remotion الرسمية (من github.com/remotion-dev/skills).
  - 12 مهارة مونتاج أضافها زميلي APKMEN: montage-kit-index (نقطة البداية)، offline-assets، audio-analysis، audio-beat-sync، audio-mixing-remotion، pro-editing-style، kinetic-typography-remotion، remotion-transitions-pro، arabic-text-remotion، talking-head-captions، religious-hud-reel، anime-amv-edit.
- `scripts/analyze-audio` سكربت يحلّل أي صوت بدون إنترنت (بداية ونهاية كل جملة، القوة، الإيقاع). Claude لا "يسمع" الصوت، بل يحلله بهذه المهارة.
- `assets/sfx/` 87 مؤثرًا صوتيًا مجانيًا (CC0) مع INDEX.md، و`assets/fonts/` 16 خطًا عربيًا (Amiri، Amiri Quran، Cairo، Tajawal، Reem Kufi...)، و8 مؤثرات ضوئية.
- `audio/` التعليق الصوتي لإعلان تطبيقي «مِسْبَحة»:
  - الأساسي: `audio/misbaha_vo_male_main.mp3` (صوت رجل هادئ بالفصحى، 20 ثانية، توقيت كل جملة في `audio/README.md`).
  - بديل: `audio/misbaha_vo_male_alt.mp3`. ونسخ أقدم: voiceover_main و voiceover_male2.
- `CLAUDE.md` تعليمات دائمة لـ Claude.

## 3. المشروع الحالي: إعلان تطبيق «مِسْبَحة»
النص:
سبحان الله... الحمد لله... الله أكبر.
اجعل ذكر الله رفيقك في كل وقت.
عدّاد للتسبيح، وأذكار الصباح والمساء من حصن المسلم.
يعمل بدون إنترنت.
مِسْبَحة.

- صُدّرت النسخة v1 (بلا صوت) وv2. الخطوة القادمة: النسخة v3 على الصوت الجديد، مدة ~20.5 ثانية، طولي للريلز، بأسلوب Kinetic Typography هادئ، بلا موسيقى، مع مؤثرات صوتية هادئة.

## 4. ما طلبته من Claude ولم أتأكد من نتيجته بعد
1. تثبيت أدوات المؤثرات الصوتية: Earshot (github.com/Leonxlnx/earshot) لتوليد المؤثرات بالكود، وReal SFX (github.com/Clipwing/skills/tree/main/skills/real-sfx) بعد التحقق من رخصتها، وOpenverse API للبحث عن أصوات مجانية. القاعدة: توقيت كل صوت يُحسب من كود الحركة لا بالتخمين.
2. تثبيت Graphify (github.com/Graphify-Labs/graphify، الحزمة `graphifyy`): خريطة للمشروع يقرؤها Claude بدل قراءة كل الملفات لتوفير الرصيد. الأوامر: `pip install graphifyy` ثم `graphify install --project --platform claude` ثم `graphify claude install` ثم `/graphify .` وبعد كل تعديل كبير `/graphify . --update`. الرسم في `graphify-out/graph.html`.

## 5. قواعدي في العمل مع Claude
- يكلمني بالعربية وبخطوات بسيطة.
- يسألني قبل أن يبدأ، ويعرض السيناريو بجدول ثوانٍ قبل التحريك.
- يصدّر MP4 بعد كل نسخة ويحفظه في `videos/` لأشاهده من الهاتف.
- لا force-push ولا حذف للنسخ القديمة.
- لا أضع كلمات سر أو مفاتيح في المحادثة أو البيئة.
- آيات القرآن تُنسخ حرفيًا من مصدر موثوق (quran.com) بالرسم العثماني والتشكيل.

## 6. أول رسالة أرسلها لـ Claude Code إذا فتحت جلسة جديدة
"اسحب آخر التحديثات من الفرع ccr-03667856-catmah، واقرأ CLAUDE.md وملف HANDOFF_AR.md ومهارة montage-kit-index. ثم أخبرني بالعربية وباختصار: هل ثُبّتت Earshot وGraphify؟ وما آخر نسخة من فيديو مسبحة في مجلد videos؟ ثم نكمل النسخة التالية."
