# SFX index (`assets/sfx/`)

87 compact MP3 sound effects, all **CC0 / public domain** (sources in `../LICENSES.md`). Every file is peak-normalised to -1 dBFS, 44.1 kHz (96 kbps mono / 128 kbps stereo). Files marked loop are seamless loops: use `<Audio loop>`.

Use in Remotion: copy the files you need to `video/public/sfx/` and play them with `<Audio src={staticFile("sfx/<file>")} volume={...} />` inside a `<Sequence from={frame}>` (see skill `offline-assets` and `audio-mixing-remotion`). Suggested volume is a linear `volume` start value under a -16 LUFS voiceover; check the final mix with `scripts/analyze-audio`.

## Whooshes & swipes

| file | duration (s) | description | when to use | suggested volume |
|---|---|---|---|---|
| `swipe_ui_01.mp3` | 0.34 | Clean UI swipe | App/phone UI scrolling, card slides, ads | 0.25-0.4 |
| `swish_01.mp3` | 0.16 | Short swish | Fast element slides, sword/arm motion, text fly-in | 0.3-0.5 |
| `swish_02.mp3` | 0.16 | Short swish variant | Same as swish_01, vary | 0.3-0.5 |
| `swish_03.mp3` | 0.21 | Swish, thinner | Small UI/sticker moves | 0.3-0.45 |
| `swish_04.mp3` | 0.18 | Swish, heavier | Bigger slides, comedy motion | 0.35-0.5 |
| `whoosh_air_06.mp3` | 1.15 | Real air whoosh (recorded) | Natural movement, swipes, object passing | 0.35-0.5 |
| `whoosh_air_07.mp3` | 1.12 | Real air whoosh variant | Alternate with air_06 to avoid repetition | 0.35-0.5 |
| `whoosh_deep_03.mp3` | 2.22 | Deep heavy whoosh | Zoom-through, big camera moves, hype | 0.4-0.6 |
| `whoosh_fast_02.mp3` | 0.76 | Fast bright whoosh | Whip pans, quick slides, fast cuts (start ~3 f before midpoint) | 0.35-0.5 |
| `whoosh_long_04.mp3` | 2.43 | Long sweeping whoosh | Slow transitions, title sweeps | 0.3-0.45 |
| `whoosh_reverse_05.mp3` | 1.80 | Reverse whoosh (sucks in) | Into a cut/reveal, ends on the cut | 0.3-0.45 |
| `whoosh_soft_01.mp3` | 1.36 | Soft airy whoosh | Text/verse entering, gentle transitions, religious | 0.25-0.4 |

## UI: clicks, ticks, pops

| file | duration (s) | description | when to use | suggested volume |
|---|---|---|---|---|
| `click_01.mp3` | 0.13 | UI click | Buttons, menu selections, cursor taps | 0.25-0.4 |
| `click_02.mp3` | 0.13 | UI click variant | Alternate clicks | 0.25-0.4 |
| `click_mouse_03.mp3` | 0.10 | Mouse click | Screen recordings, cursor clicks | 0.3-0.45 |
| `pop_01.mp3` | 0.39 | Round pop | Bubbles, icons/stickers appearing | 0.3-0.45 |
| `pop_bubble_03.mp3` | 0.39 | Bubble pop | Playful entries, captions in comedy | 0.25-0.4 |
| `pop_drop_04.mp3` | 0.24 | Drop pop (Kenney) | Items landing, drop-ins | 0.3-0.45 |
| `pop_high_02.mp3` | 0.39 | High pop | Small elements, emoji, comedy | 0.25-0.4 |
| `pop_pluck_05.mp3` | 0.13 | Pluck pop (Kenney) | Light UI entries | 0.3-0.45 |
| `switch_toggle_01.mp3` | 0.18 | Toggle switch | On/off, mode change, checkbox | 0.3-0.4 |
| `tick_01.mp3` | 0.08 | Tick | Counters, list items, timers | 0.2-0.35 |
| `tick_02.mp3` | 0.05 | Tick variant | Alternate ticks | 0.2-0.35 |
| `tick_soft_01.mp3` | 0.47 | Very soft tick | HUD/text micro-entries, religious HUD | 0.2-0.3 |

## HUD, beeps & tech

| file | duration (s) | description | when to use | suggested volume |
|---|---|---|---|---|
| `beep_confirm_04.mp3` | 0.34 | Confirm beep (Kenney) | Success, check marks | 0.3-0.4 |
| `beep_data_03.mp3` | 0.94 | Data blips | Numbers/lines loading, scanning data | 0.2-0.3 |
| `beep_hud_01.mp3` | 1.04 | HUD beep | HUD elements/data appearing (religious, tech) | 0.2-0.35 |
| `beep_hud_double_02.mp3` | 0.99 | Double HUD beep | Lock-on, target found, confirmation | 0.2-0.35 |
| `beep_question_05.mp3` | 0.52 | Question beep (Kenney) | Questions on screen, curiosity | 0.3-0.4 |
| `beep_twotone_06.mp3` | 0.44 | Two-tone beep (Kenney) | Notifications, alerts | 0.3-0.4 |
| `computer_noise_01.mp3` | 5.04 | Computer processing noise (Kenney) | Tech, hacking, data | 0.2-0.35 |
| `counter_roll_01.mp3` | 1.85 | Rolling counter | Numbers counting up | 0.25-0.35 |
| `error_buzz_01.mp3` | 0.16 | Error buzz (Kenney) | Wrong answer, fail, comedy "no" | 0.3-0.45 |
| `forcefield_hum_01.mp3` | 0.89 | Force-field hum (Kenney) | Energy/sci-fi auras, power-ups held | 0.2-0.35 |
| `powerup_01.mp3` | 0.24 | Power-up (Kenney) | Level up, transformation, game feel | 0.3-0.45 |
| `scan_hud_01.mp3` | 1.99 | Scanner sweep | Light-scan wipes, grid reveals, analysis | 0.25-0.35 |

## Glitch

| file | duration (s) | description | when to use | suggested volume |
|---|---|---|---|---|
| `glitch_03.mp3` | 0.05 | Glitch (Kenney) | Glitch transitions, distortion | 0.3-0.45 |
| `glitch_04.mp3` | 0.08 | Glitch variant (Kenney) | Alternate glitch | 0.3-0.45 |
| `glitch_05.mp3` | 0.05 | Glitch variant (Kenney) | Alternate glitch | 0.3-0.45 |
| `glitch_digital_01.mp3` | 0.50 | Digital glitch burst | Glitch transitions, RGB split hits | 0.3-0.45 |
| `glitch_short_02.mp3` | 0.21 | Short glitch | Micro glitches on text | 0.25-0.4 |

## Impacts, booms & hits

| file | duration (s) | description | when to use | suggested volume |
|---|---|---|---|---|
| `boom_cinematic_01.mp3` | 3.84 | Cinematic boom with tail | Big reveals, title hits, drops | 0.5-0.7 |
| `boom_crunch_04.mp3` | 0.81 | Crunchy explosion (Kenney) | Destruction, comedy impacts | 0.4-0.6 |
| `boom_explosion_03.mp3` | 2.04 | Explosion (Kenney) | Explosions, huge impacts, football goals | 0.4-0.6 |
| `boom_sub_02.mp3` | 3.79 | Sub boom (low) | Layer under hits for weight, bass drop | 0.4-0.6 |
| `hit_glass_01.mp3` | 0.29 | Glass hit | Fragile/crack moments, ice | 0.35-0.5 |
| `hit_metal_clang_01.mp3` | 0.21 | Metal clang | Swords, metal, hard stops | 0.35-0.5 |
| `hit_punch_01.mp3` | 0.60 | Punch | Fights, comedy slaps, text slams | 0.4-0.6 |
| `hit_punch_02.mp3` | 0.42 | Punch variant | Alternate punch | 0.4-0.6 |
| `hit_soft_01.mp3` | 0.57 | Soft hit | Gentle landings, soft text slams | 0.35-0.5 |
| `hit_trailer_01.mp3` | 3.08 | Trailer hit | Impact on cuts/titles, layer with boom_sub_02 | 0.5-0.7 |
| `thud_soft_01.mp3` | 1.62 | Soft low thud | Calm reveals, heavy text landing (religious ok) | 0.35-0.5 |

## Risers, downlifters & reveals

| file | duration (s) | description | when to use | suggested volume |
|---|---|---|---|---|
| `downlifter_01.mp3` | 2.09 | Downlifter | After a hit, releasing tension, scene exit | 0.3-0.45 |
| `downlifter_sub_02.mp3` | 3.08 | Sub downlifter | Heavy drop/exit, after big boom | 0.35-0.5 |
| `riser_dark_03.mp3` | 4.88 | Dark riser 4.9 s | Mystery/religious tension before reveal | 0.3-0.45 |
| `riser_noise_01.mp3` | 2.74 | Noise riser 2.7 s | Build-up into a hit (end exactly on hit) | 0.3-0.45 |
| `riser_tonal_02.mp3` | 4.26 | Tonal riser 4.3 s | Tension before reveal, emotional builds | 0.3-0.45 |
| `shimmer_01.mp3` | 3.16 | Shimmer | Magic/light reveals, light leaks, sparkles | 0.2-0.35 |
| `sparkle_02.mp3` | 1.57 | Sparkle | Particles, stars, gold glints | 0.2-0.3 |
| `swell_reveal_01.mp3` | 7.13 | Soft swell | Gentle reveal of verse/title, fade-ins | 0.25-0.4 |

## Bells, chimes & gongs

| file | duration (s) | description | when to use | suggested volume |
|---|---|---|---|---|
| `bell_metal_01.mp3` | 1.41 | Metal bell (Kenney) | Rounds, alarms, accents | 0.3-0.45 |
| `chime_high_02.mp3` | 3.42 | High chime | Small positive accents | 0.2-0.35 |
| `chime_soft_01.mp3` | 5.59 | Soft chime | Calm reveals, ideas, religious accents | 0.25-0.4 |
| `ding_notify_01.mp3` | 1.72 | Notification ding | Messages, likes, notifications | 0.3-0.4 |
| `gong_soft_01.mp3` | 10.03 | Soft gong, long tail (10 s) | Major reveal in religious HUD, endings | 0.4-0.6 |

## Foley: camera, typing, paper

| file | duration (s) | description | when to use | suggested volume |
|---|---|---|---|---|
| `book_close_01.mp3` | 0.26 | Book close (Kenney) | Ending, closing a chapter | 0.3-0.45 |
| `book_open_01.mp3` | 0.18 | Book open (Kenney) | Opening a story/chapter | 0.3-0.45 |
| `keypress_01.mp3` | 0.24 | Single keypress | Single key, enter, small taps | 0.3-0.4 |
| `page_turn_01.mp3` | 0.71 | Page turn (Kenney) | Books, chapters, next section | 0.3-0.45 |
| `page_turn_02.mp3` | 0.44 | Page turn variant (Kenney) | Alternate page turn | 0.3-0.45 |
| `shutter_camera_01.mp3` | 0.57 | Camera shutter (recorded) | Photo moments, freeze frames, snapshots | 0.35-0.5 |
| `shutter_camera_02.mp3` | 0.91 | Camera shutter variant | Alternate shutter | 0.35-0.5 |
| `shutter_synth_01.mp3` | 0.37 | Synth shutter click | Freeze frames, flash cuts | 0.3-0.45 |
| `typewriter_key_01.mp3` | 0.71 | Typewriter key | Word-by-word typing (every 2-3 words) | 0.3-0.4 |
| `typewriter_key_02.mp3` | 0.55 | Typewriter key variant | Alternate key | 0.3-0.4 |
| `typewriter_return_03.mp3` | 0.65 | Typewriter return/ding | End of a typed line | 0.3-0.4 |
| `typing_keyboard_loop.mp3` | 4.05 | Keyboard typing loop (loop) | Typing on screen, chat UIs (loop) | 0.2-0.35 |

## Heartbeat

| file | duration (s) | description | when to use | suggested volume |
|---|---|---|---|---|
| `heartbeat_fast_loop.mp3` | 1.18 | Fast heartbeat loop (loop) | Panic, stress, chase | 0.25-0.4 |
| `heartbeat_single_01.mp3` | 1.75 | Single heartbeat | Tension beat, dramatic pause | 0.35-0.5 |
| `heartbeat_slow_loop.mp3` | 1.83 | Slow heartbeat loop (loop) | Suspense, emotional moments, heart topics | 0.25-0.4 |
| `heartbeat_synth_loop_60bpm.mp3` | 4.05 | Synth heartbeat loop 60 BPM (loop) | Clean heartbeat under HUD/religious | 0.2-0.35 |

## Drones & ambience (loops)

| file | duration (s) | description | when to use | suggested volume |
|---|---|---|---|---|
| `drone_air_texture_loop.mp3` | 20.04 | Airy texture loop, 20 s (loop) | Layer over a drone for air/space | 0.05-0.1 |
| `drone_calm_low_loop.mp3` | 20.04 | Calm low drone, 20 s loop (loop) | Bed for religious/reflection videos | 0.06-0.12 |
| `drone_dark_space_loop.mp3` | 20.04 | Dark space drone, 20 s loop (loop) | Mystery, death/soul topics, night | 0.06-0.12 |
| `drone_warm_pad_loop.mp3` | 20.04 | Warm pad drone, 20 s loop (loop) | Soft emotional bed, hopeful endings | 0.06-0.12 |
| `wind_gentle_loop.mp3` | 20.04 | Gentle wind loop, 20 s (loop) | Ambience, desert, empty spaces | 0.1-0.25 |
| `wind_gust_01.mp3` | 6.01 | Wind gust (loop) | Gust transitions, dust, storm accents | 0.25-0.4 |

## Tips

- Risers: start the riser at `hitFrame - Math.round(duration*fps)` so it ENDS on the hit; then the boom/gong on the hit.
- Layer for weight: `boom_sub_02` + `hit_trailer_01` on the same frame.
- Vary repeated sounds (swish_01..04, click_01/02, whoosh_air_06/07) so it does not sound mechanical.
- Religious reels: only drones, soft ticks/beeps, risers, gong, chimes, shimmer, swell, soft whoosh. No music.

## Calm, made in code with earshot (`earshot_calm/`)

30 sounds rendered from the earshot bank (`tools/earshot`, MIT; output is original, CC0) with
`earshot sfx render <id> --peak -6`, 48 kHz MP3. Peak -6 dBFS (quieter than the rest of the kit, on purpose).
Good for religious reels, Tasbih/Misbaha ads, reflective edits. Re-render any one with another `--dur` / `--pitch` /
`--seed` (skill `earshot`).

| file | earshot id | duration (s) | when to use | suggested volume |
|---|---|---|---|---|
| `earshot_calm/shimmer_m0.mp3` | `shimmer/m0` | 4.22 | Soft sparkle tail under a title or verse reveal | 0.3-0.5 |
| `earshot_calm/shimmer_m1.mp3` | `shimmer/m1` | 4.03 | Soft sparkle tail under a title or verse reveal | 0.3-0.5 |
| `earshot_calm/shimmer_m3.mp3` | `shimmer/m3` | 3.62 | Soft sparkle tail under a title or verse reveal | 0.3-0.5 |
| `earshot_calm/shimmer_m5.mp3` | `shimmer/m5` | 4.44 | Soft sparkle tail under a title or verse reveal | 0.3-0.5 |
| `earshot_calm/pro_shimmer_m1.mp3` | `pro_shimmer/m1` | 1.44 | Short sparkle on a highlight | 0.3-0.5 |
| `earshot_calm/pro_shimmer_m4.mp3` | `pro_shimmer/m4` | 2.42 | Short sparkle on a highlight | 0.3-0.5 |
| `earshot_calm/notify_m0.mp3` | `notify/m0` | 2.33 | Gentle bell/notification, counter step, tasbih count | 0.3-0.5 |
| `earshot_calm/notify_m2.mp3` | `notify/m2` | 1.82 | Gentle bell/notification, counter step, tasbih count | 0.3-0.5 |
| `earshot_calm/notify_m3.mp3` | `notify/m3` | 2.54 | Gentle bell/notification, counter step, tasbih count | 0.3-0.5 |
| `earshot_calm/notify_m4.mp3` | `notify/m4` | 1.82 | Gentle bell/notification, counter step, tasbih count | 0.3-0.5 |
| `earshot_calm/notify_mid_wood.mp3` | `notify/mid_wood` | 0.36 | Gentle bell/notification, counter step, tasbih count | 0.3-0.5 |
| `earshot_calm/pluck_kalimba_soft.mp3` | `pluck/kalimba_soft` | 3.02 | Kalimba note, warm and slow | 0.3-0.5 |
| `earshot_calm/pluck_kalimba_ring.mp3` | `pluck/kalimba_ring` | 3.02 | Kalimba note, warm and slow | 0.3-0.5 |
| `earshot_calm/mallet_celesta.mp3` | `mallet/celesta` | 0.46 | Small celesta/glock/marimba tap on text pop | 0.35-0.55 |
| `earshot_calm/mallet_glock.mp3` | `mallet/glock` | 0.46 | Small celesta/glock/marimba tap on text pop | 0.35-0.55 |
| `earshot_calm/mallet_marimba.mp3` | `mallet/marimba` | 0.60 | Small celesta/glock/marimba tap on text pop | 0.35-0.55 |
| `earshot_calm/mallet_flourish.mp3` | `mallet/flourish` | 0.55 | Small celesta/glock/marimba tap on text pop | 0.35-0.55 |
| `earshot_calm/bell_small_bell.mp3` | `fit/bell/small_bell` | 1.70 | Small bell, a single calm accent | 0.3-0.5 |
| `earshot_calm/drip_drop.mp3` | `drip/drop` | 0.36 | Water drop on a soft pop or bead | 0.35-0.55 |
| `earshot_calm/drip_plink.mp3` | `drip/plink` | 0.29 | Water drop on a soft pop or bead | 0.35-0.55 |
| `earshot_calm/drip_bloop.mp3` | `drip/bloop` | 0.41 | Water drop on a soft pop or bead | 0.35-0.55 |
| `earshot_calm/reverse_swell_breath.mp3` | `reverse_swell/breath` | 1.27 | Breath-like swell into a cut | 0.35-0.55 |
| `earshot_calm/reverse_swell_ring.mp3` | `reverse_swell/ring` | 1.70 | Breath-like swell into a cut | 0.35-0.55 |
| `earshot_calm/swish_soft.mp3` | `swish/soft` | 0.91 | Soft slow swish for gentle slides | 0.4-0.6 |
| `earshot_calm/swish_cane.mp3` | `swish/cane` | 0.74 | Soft slow swish for gentle slides | 0.4-0.6 |
| `earshot_calm/riser_swell.mp3` | `riser/swell` | 2.23 | Airy slow build into a reveal | 0.35-0.55 |
| `earshot_calm/riser_air.mp3` | `riser/air` | 2.42 | Airy slow build into a reveal | 0.35-0.55 |
| `earshot_calm/logo_sting_soft_bloom.mp3` | `logo_sting/soft_bloom` | 1.90 | Soft bloom for logo / end card | 0.4-0.6 |
| `earshot_calm/logo_sting_reverse_bloom.mp3` | `logo_sting/reverse_bloom` | 2.16 | Soft bloom for logo / end card | 0.4-0.6 |
| `earshot_calm/downlifter_air_fall.mp3` | `downlifter/air_fall` | 2.09 | Airy fall after a peak, outro | 0.35-0.55 |
