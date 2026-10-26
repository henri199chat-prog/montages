"""Check every generated line: does Whisper hear the script's words, any repeated word (stutter), any long pause?
Usage: ~/.whisper-venv/bin/python scripts/my-voice-check.py DIR lines.txt   -> DIR/check.json, exit 1 if a line fails."""
import json, re, subprocess, sys
from pathlib import Path
import numpy as np
from faster_whisper import WhisperModel

DIAC = re.compile(r"[ً-ْـ]")
PUNCT = re.compile(r"[^\w\s]")


def norm(s):
    s = DIAC.sub("", s)
    s = PUNCT.sub(" ", s)
    s = re.sub("[إأآا]", "ا", s).replace("ى", "ا").replace("ة", "ه")  # final alif maqsura is spoken as alif
    return s.split()


def load16k(p):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(p), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


d = Path(sys.argv[1])
lines = [l.strip() for l in open(sys.argv[2], encoding="utf-8") if l.strip()]
m = WhisperModel("large-v3", device="cpu", compute_type="int8")
report, bad = [], 0
for n, text in enumerate(lines, 1):
    f = d / f"{n:02d}.wav"
    if not f.exists():
        report.append({"line": n, "status": "missing"}); bad += 1; continue
    segs, _ = m.transcribe(load16k(f), language="ar", beam_size=5, word_timestamps=True, condition_on_previous_text=False)
    words = [w for s in segs for w in s.words]
    heard = " ".join(w.word.strip() for w in words)
    want, got = norm(text), norm(heard)
    # word-level diff (simple LCS)
    L = [[0] * (len(got) + 1) for _ in range(len(want) + 1)]
    for i in range(len(want) - 1, -1, -1):
        for j in range(len(got) - 1, -1, -1):
            L[i][j] = L[i + 1][j + 1] + 1 if want[i] == got[j] else max(L[i + 1][j], L[i][j + 1])
    match = L[0][0] / max(1, len(want))
    repeats = [got[i] for i in range(1, len(got)) if got[i] == got[i - 1] and len(got[i]) > 1]
    gaps = [round(words[i].start - words[i - 1].end, 2) for i in range(1, len(words)) if words[i].start - words[i - 1].end > 0.7]
    dur = len(load16k(f)) / 16000
    wps = len(want) / max(0.1, dur)
    # no initial prompt: a prompt would bias Whisper toward the script and hide real mistakes
    ok = match >= 0.95 and not repeats and not gaps and 1.4 <= wps <= 3.6
    bad += not ok
    report.append({"line": n, "ok": ok, "match": round(match, 2), "repeats": repeats, "long_pauses": gaps,
                   "words_per_s": round(wps, 2), "want": text, "heard": heard})
    print(f"{'OK ' if ok else 'BAD'} {n:2d} match={match:.2f} wps={wps:.1f} rep={repeats} pauses={gaps}\n     heard: {heard}", flush=True)
(d / "check.json").write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
sys.exit(1 if bad else 0)
