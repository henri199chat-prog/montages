---
name: youtube-clips
description: Use when a montage needs footage from YouTube (anime scenes, trailers, B-roll, a moment the user names) - search YouTube by yourself with scripts/yt-search, rank official channels first, pick the exact clip and timestamp for each beat of the edit, and hand the user ready links. Also covers how the clip gets into the project (the cloud container cannot download from YouTube) and the copyright rules.
---

# youtube-clips: find the footage yourself

## 1. Search (works from the cloud container)
```bash
scripts/yt-search "Bleach episode 1 official" 10
scripts/yt-search "Black Clover latest episode preview Crunchyroll" 10
```
Prints duration, channel, title and link; ★ = official channel (Crunchyroll, VIZ, Aniplex, TV Tokyo, Animax...).
Search in English and Japanese titles too (e.g. 「BLEACH 千年血戦篇」), and add "official", "PV", "trailer", "preview".

## 2. Choose
- Prefer ★ official uploads: trailers, PVs, "episode preview", openings uploaded by the rights holder.
- For each beat of the edit write: link, start-end seconds (4-15 s), why it fits (what the speaker says there).
- Give the user the list as short lines they can tap.

## 3. Getting the clip into the project
- **Downloading from the cloud container does not work**: YouTube answers "Sign in to confirm you're not a bot".
  Do not work around it (no cookies, no tokens, no proxies, no other download sites).
- The user downloads or screen-records the clip on their phone and sends it in the chat, or uploads it to Google Drive
  ("anyone with the link") and sends the link: `curl -sL "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t" -o clip.mp4`.
- Until the clip arrives, build the edit with a labelled placeholder panel in the clip's slot, so dropping the clip in
  later needs no re-edit.

## 4. Rules
- Never search for or use pirate / re-upload sites for full episodes.
- Short clips from official trailers in a fan edit or commentary are the user's call; say once that the rights belong to
  the studio and that platforms may mute or flag the reel.
