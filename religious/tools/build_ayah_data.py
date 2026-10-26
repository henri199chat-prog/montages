#!/usr/bin/env python3
"""build_ayah_data.py - turn a CLEAN recitation voice file + surah:ayat into the JSON the Remotion
<AyahKaraoke> component reads (phrase pages, word onsets, key-word colours).

Usage:
  python3 religious/tools/build_ayah_data.py --audio audio/voice_clean.wav --surah 9 --ayat 102-104 \
      --out video/src/religious/data/tawbah-102-104.json [--off 3.0] [--outro 4.8] [--fa] \
      [--breaks 18.2,28.4] [--keys keys.json] [--max-words 9] [--noise -38]

Timing modes
  --fa      torchaudio MMS_FA CTC forced alignment of the verified words (best; the method used in the
            original reels). Needs torch+torchaudio and the MMS_FA model (downloaded on first use, so it
            only works where internet or a cached model exists).
  default   OFFLINE fallback with ffmpeg only: ayah ends = the longest pauses (or --breaks, seconds in the
            voice file), then words are spread over the speech time of each ayah by letter count.
            Good enough for page switches; check word timing by eye in Remotion Studio and fix in the JSON.

Words come ONLY from religious/data/quran-uthmani.json (never from speech recognition).
Key colours: g = gold (divine names / hope / promise), c = coral (sin, punishment), w = warm white glow,
"" = plain white. Default: words containing a divine name are gold; pass --keys to set the rest:
  {"102": {"2": "c", "4": "g"}}   (word index from 0, per ayah)
"""
import argparse, json, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import quran as Q

DIVINE = ["الله", "لله", "رب", "رحمن", "رحيم", "غفور", "تواب", "عليم", "حكيم", "سميع", "بصير", "عزيز", "كريم", "ودود", "لطيف", "خبير"]


def speech_segments(path, noise, min_sil):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", f"silencedetect=n={noise}dB:d={min_sil}", "-f", "null", "-"],
                       stderr=subprocess.PIPE, stdout=subprocess.PIPE)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                               stdout=subprocess.PIPE).stdout.decode().strip())
    sil, st = [], None
    for ln in p.stderr.decode("utf-8", "replace").splitlines():
        m = re.search(r"silence_start: (-?[\d.]+)", ln)
        if m: st = max(0.0, float(m.group(1)))
        m = re.search(r"silence_end: ([\d.]+)", ln)
        if m and st is not None: sil.append((st, float(m.group(1)))); st = None
    if st is not None: sil.append((st, dur))
    sp, t = [], 0.0
    for a, b in sil:
        if a - t > 0.08: sp.append((t, a))
        t = b
    if dur - t > 0.08: sp.append((t, dur))
    return sp, sil, dur


def fallback_timing(path, ayat, noise, breaks):
    sp, sil, dur = speech_segments(path, noise, 0.25)
    if not sp: sys.exit("no speech found; try --noise -30")
    n = len(ayat)
    if breaks:
        ends = [float(x) for x in breaks.split(",")]
    else:
        # pick the n-1 pauses that make each ayah's speech time best match its share of letters (DP)
        cand = [s for s in sil if s[0] > sp[0][0] and s[1] < sp[-1][1] and s[1] - s[0] >= 0.3]
        if len(cand) < n - 1: sys.exit("not enough pauses to split %d ayat; pass --breaks or another --noise" % n)
        L = [sum(len(r) + 2 for r in ay["rom"]) for ay in ayat]; LT = sum(L)
        def speech(a, b): return sum(max(0.0, min(y, b) - max(x, a)) for x, y in sp)
        ST = speech(sp[0][0], sp[-1][1])
        pts = [sp[0][0]] + [(a + b) / 2 for a, b in cand] + [sp[-1][1]]
        m = len(pts); INF = float("inf")
        best = {(0, 0): (0.0, None)}
        for k in range(1, n + 1):  # k-th ayah ends at pts[j]
            for j in range(1, m):
                if (k == n) != (j == m - 1): continue
                opt = (INF, None)
                for i in range(0, j):
                    if (k - 1, i) not in best: continue
                    share = speech(pts[i], pts[j]) / ST
                    c = best[(k - 1, i)][0] + (share - L[k - 1] / LT) ** 2
                    if c < opt[0]: opt = (c, i)
                if opt[1] is not None: best[(k, j)] = opt
        j, k, ends = m - 1, n, []
        while k > 0:
            i = best[(k, j)][1]
            if k > 1: ends.append(pts[i])
            j, k = i, k - 1
        ends = sorted(ends)
        print("ayah ends (voice s):", [round(e, 2) for e in ends], "- check them; override with --breaks", file=sys.stderr)
    bounds = [sp[0][0]] + ends + [sp[-1][1]]
    for ai, ay in enumerate(ayat):
        a0, a1 = bounds[ai], bounds[ai + 1]
        segs = [(max(a, a0), min(b, a1)) for a, b in sp if b > a0 and a < a1]
        total = sum(b - a for a, b in segs) or 1e-6
        wts = [len(r) + 2 for r in ay["rom"]]; W = sum(wts)
        def at(x):  # x = fraction of speech time -> seconds
            acc = 0.0; tgt = x * total
            for a, b in segs:
                if acc + (b - a) >= tgt: return a + (tgt - acc)
                acc += b - a
            return segs[-1][1]
        c = 0; ay["on"], ay["off"] = [], []
        for w in wts:
            ay["on"].append(at(c / W)); c += w; ay["off"].append(at(c / W))
    return dur


def fa_timing(path, ayat):
    import torch, torchaudio, numpy as np
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], stdout=subprocess.PIPE).stdout
    wav = torch.from_numpy(np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768)[None]
    b = torchaudio.pipelines.MMS_FA
    model = b.get_model(with_star=True); tok = b.get_tokenizer(); aligner = b.get_aligner()
    flat = [(ai, r) for ai, ay in enumerate(ayat) for r in ay["rom"]]
    with torch.inference_mode():
        em, _ = model(wav)
        spans = aligner(em[0], tok([r for _, r in flat]))
    ratio = wav.shape[1] / em.shape[1] / 16000
    for ay in ayat: ay["on"], ay["off"] = [], []
    for (ai, _), s in zip(flat, spans):
        ayat[ai]["on"].append(s[0].start * ratio); ayat[ai]["off"].append(s[-1].end * ratio)
    return wav.shape[1] / 16000


def split_pages(words, maxw):
    """chunks of <= maxw words, preferring to break after a waqf mark; each page 1-2 lines balanced by letters"""
    pages, i = [], 0
    while i < len(words):
        j = min(len(words), i + maxw)
        if j < len(words):
            cands = [k + 1 for k in range(i + 3, j) if any(c in Q.WAQF for c in words[k])]
            if cands: j = cands[-1]
            elif len(words) - j < 3: j = len(words) - 3 if len(words) - 3 > i + 3 else j
        pages.append((i, j)); i = j
    out = []
    for a, b in pages:
        n = b - a
        if n <= 4: out.append((a, b, [n])); continue
        L = [len(w) for w in words[a:b]]; tot = sum(L); acc = 0; cut = 1
        for k, l in enumerate(L):
            acc += l
            if acc >= tot / 2: cut = k + 1; break
        cut = min(max(cut, 2), n - 1)
        out.append((a, b, [cut, n]))
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--audio", required=True); ap.add_argument("--surah", type=int, required=True); ap.add_argument("--ayat", required=True)
    ap.add_argument("--out", required=True); ap.add_argument("--off", type=float, default=3.0, help="voice start in the video (s), after the logo intro")
    ap.add_argument("--outro", type=float, default=4.8, help="hold after the last word (s)"); ap.add_argument("--fa", action="store_true")
    ap.add_argument("--breaks"); ap.add_argument("--keys"); ap.add_argument("--max-words", type=int, default=9)
    ap.add_argument("--noise", type=float, default=-30); ap.add_argument("--no-basmala", action="store_true")
    a = ap.parse_args()
    q = Q.load(); s = a.surah; r = a.ayat.split("-"); a0, a1 = int(r[0]), int(r[-1])
    ayat = []
    for n in range(a0, a1 + 1):
        w = Q.display_words(Q.ayah_text(q, s, n, a.no_basmala))
        ayat.append({"n": n, "words": w, "rom": [Q.rom(x) for x in w]})
    dur = fa_timing(a.audio, ayat) if a.fa else fallback_timing(a.audio, ayat, a.noise, a.breaks)
    keys = json.load(open(a.keys)) if a.keys else {}
    pages = []
    for ay in ayat:
        kmap = keys.get(str(ay["n"]), {})
        ws = []
        for i, t in enumerate(ay["words"]):
            k = kmap.get(str(i))
            if k is None: k = "g" if any(d in Q.plain(t) for d in DIVINE) else ""
            ws.append({"t": t, "on": round(ay["on"][i] + a.off, 3), "off": round(ay["off"][i] + a.off, 3), "k": k})
        for (i0, i1, lines) in split_pages(ay["words"], a.max_words):
            pages.append({"n": ay["n"], "first": i0 == 0, "num": i1 == len(ay["words"]), "lines": [l for l in lines], "words": ws[i0:i1]})
    for k, p in enumerate(pages):
        p["start"] = p["words"][0]["on"]
        p["end"] = round(pages[k + 1]["words"][0]["on"] - 0.25, 3) if k + 1 < len(pages) else round(p["words"][-1]["off"] + 0.15, 3)
    last = pages[-1]["words"][-1]["off"]
    out = {"surah": s, "surahName": q["surahs"][s - 1]["name"], "en": q["surahs"][s - 1]["en"], "ayat": [a0, a1],
           "off": a.off, "total": round(last + a.outro, 2), "timing": "mms_fa" if a.fa else "fallback_letters", "pages": pages}
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    json.dump(out, open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for p in pages: print(p["n"], p["start"], p["end"], " ".join(w["t"] for w in p["words"]))
    print("total", out["total"], "->", a.out)


if __name__ == "__main__":
    main()
