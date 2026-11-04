---
name: free-image-gen
description: Generate images for free by driving the user's own ChatGPT or Gemini account in Chrome through the Claude in Chrome extension, then download the image and use it in the current project. Use whenever a task needs a new image (thumbnail, cover, B-roll still, background, product shot, icon, illustration, design asset) or the user says "سو صورة", "ولّد صورة", "صمم لي صورة", "generate an image", "make me a picture". Do NOT use when the user already supplied the image or asked for a paid image API.
---

# Free Image Gen

Claude Code can't generate images by itself. This skill does it through the user's
own ChatGPT or Gemini account, opened in their Chrome via the **Claude in Chrome**
extension. It uses the free image quota, or the user's Plus/Pro plan if they have one.
No API key is needed.

## Requirements (check once)

- The Claude in Chrome extension is installed and connected (tools named `mcp__claude-in-chrome__*`).
- The user is already signed in to https://chatgpt.com and/or https://gemini.google.com in that Chrome.

If the Chrome tools are missing, stop and tell the user to install the extension from
https://claude.ai/chrome and connect it. Don't fall back to anything paid.

## Workflow

### 1. Load the browser tools in ONE call

```
ToolSearch  select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__find,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__tabs_close_mcp
```

### 2. Write the prompt (in English, even if the user wrote in Arabic)

Image models follow English prompts best. Build the prompt like this:
`[subject] + [setting] + [style] + [lighting] + [camera/composition] + [aspect ratio] + [what to avoid]`

- State the aspect ratio in words: reel/story = "vertical 9:16", post/carousel = "portrait 4:5", thumbnail = "horizontal 16:9", icon = "square 1:1".
- If the image needs text, keep it short and put it in quotes. If the text is Arabic, prefer **no text in the image** and add it later in the edit, because image models write Arabic badly.
- End with: `no watermark, no extra text, no borders`.
- If the project has a style (colors, fonts, mood), put it in the prompt.

See `references/prompt-recipes.md` for ready-made templates.

### 3. Open the provider

Default to **ChatGPT**. If ChatGPT says the image limit is reached, switch to Gemini.

| Provider | URL | Composer |
|---|---|---|
| ChatGPT | `https://chatgpt.com/` | `#prompt-textarea` (contenteditable) |
| Gemini | `https://gemini.google.com/app` | `rich-textarea .ql-editor` |

1. `tabs_context_mcp` with `createIfEmpty: true`, then `tabs_create_mcp` to get a tab of your own.
2. `navigate` to the URL.
3. Take a screenshot. If you see a login page, **stop and ask the user to sign in**. Never type passwords and never create accounts.

### 4. Send the prompt

Prefer the real UI over hard-coded selectors, because these sites change often:

1. `find` with the query "message" or "prompt" to get the composer ref. Use the selectors above only as a fallback.
2. Click it, then `computer type` the prompt. On ChatGPT, start the prompt with `Generate an image: ` so it doesn't just reply in text.
3. Press `Return`.

### 5. Wait for the image

Before you press Return, record the time so you can find the download later:
`touch /tmp/free-image-gen.marker`

Image generation takes about 30 seconds to 3 minutes. ChatGPT shows a dotted canvas with a
percentage and status text such as "Setting the scene" or "One last tweak". Poll calmly:
batch 3 waits of 10 seconds, then one screenshot. Give up after about 4 minutes.

**ChatGPT A/B test:** sometimes ChatGPT shows "Which image do you like more?" with two images.
Use `find` to get "Image 1 is better" or "Image 2 is better", and click the one that best
matches the request. If you can't tell, click "Skip". The chosen image then shows normally.

You can also check by script:

```js
// ChatGPT: generated images are <img> elements inside the last assistant turn
[...document.querySelectorAll('[data-message-author-role="assistant"] img, main img[alt*="Generated"]')]
  .filter(i => i.naturalWidth > 300).length
```

Or just take a screenshot and look. Stop waiting early if you see "limit", "try again later",
or an upgrade prompt. In that case close the prompt (never click Upgrade or Buy) and switch providers.

### 6. Download

1. **ChatGPT:** click the image to open the viewer, then `find` "Download". The button opens
   a small menu. Take a screenshot and click **"Download image"** (not "Download N images in this series").
   **Gemini:** hover over the image, then `find` "Download full size image" and click it.
2. The file lands in `~/Downloads`. ChatGPT names it after the image title, with spaces
   (for example `Robot Editing a Holographic Landscape.png`), so don't guess the name.
3. Pick up the file that is newer than the marker:

```bash
sleep 5; f=$(find ~/Downloads -maxdepth 1 -type f -newer /tmp/free-image-gen.marker \
  \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.webp' \) | head -1); echo "$f"
```

   If nothing shows up, the download didn't happen. Usually the menu is still open, so take a screenshot and click "Download image".

4. Move it into the project, for example `assets/images/<short-name>.png`, with a descriptive name.
5. **Look at it** with the Read tool to confirm it matches the request. If it's clearly wrong, send one fix-up message in the same chat ("make it ...") and download again. Do this once, not in an endless loop.

### 7. Use it and clean up

- Use the image wherever the task needed it (edit, design, carousel, thumbnail).
- Close your tab with `tabs_close_mcp`.
- Tell the user in one line: where the file is saved and which provider made it.

## Rules

- Only use the user's own signed-in account. Never sign in, never sign out, never change account settings.
- Never click Upgrade, Subscribe, Buy, or anything with a price.
- Don't delete the user's chats.
- Respect the free quota. If both providers are at their limit, say so and stop.
- For several images, send them one at a time in the same chat. That keeps the style consistent.
