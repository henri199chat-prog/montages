# montages

مونتاج ومحتوى حساب Instagram **@aymen.ai.lab**.

| المجلد | المحتوى |
|---|---|
| `brand/` | دليل البراند (`brand.md`) وملف الأسلوب (`voice.md`) |
| `reels/reel01/` | تجربة 14 ثانية: مهارة وحدة في Claude تسوّي ريلز بلا حدود |
| `reels/reel02/` | ريل «الـ Skills في Claude» كامل (1:27) مع الغلاف |
| `.claude/skills/` | مهارات Instagram (ig-reel، ig-caption، ig-profile...) |

كل ريل مشروع HyperFrames: `template.tpl` + `build.py` ينتجون `index.html`، والصوت والخطوط في `assets/`.
النسخة النهائية من كل ريل محفوظة بجانب الكود (`*_final.mp4`).

إعادة التصدير:

```bash
cd reels/reel02
python3 build.py
npx -y hyperframes render --output out.mp4
```

تفاصيل طريقة العمل في `CLAUDE.md`.
