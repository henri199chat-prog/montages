# montages

- The user is a beginner on a phone: reply in Arabic, with short, simple steps.
- The Remotion project lives in `video/`. Remotion skills are in `.claude/skills/`
  (official, from https://github.com/remotion-dev/skills); follow `remotion-best-practices`.
- After every new version of a video: render it to MP4 and save it as
  `videos/<name>-v<N>.mp4` (never overwrite older versions), then commit and push,
  so the user can watch it from GitHub on their phone.
  Render: `cd video && npx remotion render <CompositionId> ../videos/<name>-v<N>.mp4`
- `video/remotion.config.ts` points to the preinstalled Chrome in the cloud container,
  because Remotion cannot download its own there.
