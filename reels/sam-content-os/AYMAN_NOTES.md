# AYMAN_NOTES — how to use sam-content-os for Ayman (read with SKILL.md)

ملاحظات خاصة بأيمن. هذه الملاحظات تتقدّم على الإعدادات الافتراضية في SKILL.md.

## Who
- Ayman (أيمن الغلقاوي، page **aymen.1303**) is **Tunisian**, writes Arabic, works only from an Android phone.
- Reply to him in simple Arabic (Tunisian-friendly), short steps.

## Dialect (overrides the Kuwaiti default)
- Use the dialect Ayman asks for. If he did not say:
  - **Religious reels** (Quran, hadith, naseeha, Islamic tips): **الفصحى** (Modern Standard Arabic), calm and respectful.
  - **Everything else** (anime, comedy, football, app ads...): **تونسي** (Tunisian Darija).
- Never default to Kuwaiti. Kuwaiti only if he explicitly asks for it.
- Content log dates: Ayman's local date (Africa/Tunis), not Asia/Kuwait.

## Setup questions
- Skip the 4 setup questions when Ayman already gave the answers (dialect, niche, length, style) in the message or earlier in the session, or when the job is a religious reel (dialect = Fusha, niche = religious, length from the recitation/voice, style = calm/educational).
- Ask only what is really missing, in one short message.

## Religious reels
- Follow `.claude/skills/religious-reel/SKILL.md` and `religious/README.md`. Use sam-content-os only for the hook, voiceover script, caption and CTA; the video itself is built in Ayman's religious style.
- **Quran / hadith accuracy rules ALWAYS override sam-content-os**: Quran text only from the verified Uthmani source (`religious/tools/quran.py`), with tashkeel and surah:ayah; hadith only authentic, with source and grading. No invented facts, numbers or "miracles"; no hype or clickbait about the Quran; no depiction of prophets, companions, angels or Allah.
- Quran recitation reels have NO added voiceover script and NO sound effects: the hook/caption/CTA are text only.
- Content log for religious reels: `religious/content-log.md` (same table format as `references/content-log.md`).
- Other reels: use `reels/content-log.md` (already started) unless Ayman names another path.

## Credit & license
- Skill made by **@saoudalajme** — https://github.com/saoudphotos/sam-content-os (copied unchanged; upstream commit a63356c, 2026-10-17).
- The upstream repo has **no license file**, so all rights stay with the author: keep it for Ayman's personal use, keep the credit, do not republish or sell it.
- Installed by Claude Code as `reels/sam-content-os/` with the symlink `.claude/skills/sam-content-os`. This file is the only addition; SKILL.md and references/ stay unchanged.
