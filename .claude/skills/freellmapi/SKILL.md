---
name: freellmapi
description: Use when a task needs an extra AI model through an OpenAI-compatible API (free chat models for brainstorming hooks, rewriting captions, translating, batch text work; or image / speech generation once provider keys are set) - start the local FreeLLMAPI router with scripts/freellmapi and call http://localhost:3001/v1. Explains which parts work keyless and which need the user's own free provider keys.
---

# freellmapi: many free AI tiers behind one local /v1 endpoint

FreeLLMAPI (https://github.com/tashfeenahmed/freellmapi, MIT) is a router server, not a model. It runs locally and
forwards OpenAI-style requests to free provider tiers, switching provider when one is rate-limited.

## Start (each new session; first run installs in ~2 min)
```bash
scripts/freellmapi start          # installs to ~/apps/freellmapi, starts :3001, adds keyless providers + env keys
eval "$(scripts/freellmapi env)"  # OPENAI_BASE_URL + OPENAI_API_KEY for any OpenAI client
curl -s $OPENAI_BASE_URL/chat/completions -H "authorization: Bearer $OPENAI_API_KEY" -H 'content-type: application/json' \
  -d '{"model":"auto","messages":[{"role":"user","content":"..."}]}'
```
Admin login and the unified key live in `~/.freellmapi.env` (chmod 600). Never print the key into chat or commit it.

## What works (checked 2026-10-26 in the cloud container)
| Surface | Without keys | With the user's keys |
|---|---|---|
| Chat `/v1/chat/completions` | Yes (kilo, ovh, aihorde keyless; small free models, Arabic OK) | Much better with `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY` |
| Images `/v1/images/generations` | No | `CLOUDFLARE_AI_KEY` ("account_id:api_token", Workers AI: Flux, SDXL) |
| Speech `/v1/audio/speech` | No | `GEMINI_API_KEY` (Gemini TTS) or Cloudflare (English voices) |
| Transcription | No (use local Whisper instead) | `GROQ_API_KEY` |
| Video `/v1/videos/generations` | No | Not in the free catalog snapshot yet (Pollinations / HF video arrive on the paid live feed) |

Keys go in the cloud environment settings as environment variables (names above); a new session picks them up and
`scripts/freellmapi start` adds them. Never ask for a key in chat.

## Rules
- It is the user's Claude session that does the real work; use this only for bulk/cheap side tasks or media endpoints.
- Free tiers log and rate-limit; do not send private data (personal files, unpublished scripts the user wants kept
  private) to them without saying so.
