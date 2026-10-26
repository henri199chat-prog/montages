#!/usr/bin/env python3
"""mix_master.py - final soundtrack of a religious reel (002 recipe), needs only Python 3 + ffmpeg.

  python3 religious/tools/mix_master.py --voice work/voice_clean.wav --out video/public/religious/<name>/mix.wav \
      [--off 3.0] [--outro 4.8] [--wet -17] [--drone -35] [--lufs -14] [--no-drone]

1. trims the voice end (last sound above -45 dBFS + 0.6 s, 0.25 s fade)
2. subtle synthetic stereo hall reverb (decaying noise IR, RT 1.6 s, wet -17 dB under dry)
3. places the voice at --off (logo intro first, 3.0 s in 002) and holds --outro s after it
4. drone bed: D2/A2/D3/A3 soft partials (73.42/110/146.83/220 Hz) with slow breathing LFO + a little band noise,
   low-passed 420 Hz, fade in 2 s / out 2.5 s, at -35 dBFS RMS (NEVER music, no melody)
5. master: oversampled limiter, iterate gain to -14 LUFS integrated, true peak <= -1 dBTP
Prints the JSON meta (off, voice_len, total) — use total for the Remotion composition length.
"""
import argparse, json, math, os, random, re, struct, subprocess, sys, tempfile, wave


def ff(*a):
    p = subprocess.run(["ffmpeg", "-v", "error", "-y", *a], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if p.returncode: sys.exit(p.stderr.decode()[-2000:])


def dur(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                                stdout=subprocess.PIPE).stdout.decode().strip())


def measure(path):
    s = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"],
                       stderr=subprocess.PIPE).stderr.decode()
    s = s[s.rfind("Summary:"):]
    I = float(re.search(r"I:\s+(-?[\d.]+) LUFS", s).group(1)); TP = float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", s).group(1))
    return I, TP


def last_sound(path, thr=-45):
    s = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-af", f"silencedetect=n={thr}dB:d=0.3", "-f", "null", "-"],
                       stderr=subprocess.PIPE).stderr.decode()
    d = dur(path); starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", s)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", s)]
    if starts and (len(ends) < len(starts)):  # trailing silence
        return max(0.5, starts[-1])
    return d


def write_ir(path, seed, rt=1.6, pre=0.022, sr=48000):
    g = random.Random(seed); n = int(rt * 1.3 * sr); p = int(pre * sr)
    xs = [0.0] * p
    for i in range(n):
        t = i / sr
        xs.append(g.gauss(0, 1) * math.exp(-6.91 * t / rt) * min(1.0, t / 0.04))
    e = math.sqrt(sum(x * x for x in xs)); pk = max(abs(x) for x in xs) / e
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        w.writeframes(b"".join(struct.pack("<h", int(32767 * 0.98 * (x / e) / pk)) for x in xs))


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--voice", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--off", type=float, default=3.0); ap.add_argument("--outro", type=float, default=4.8)
    ap.add_argument("--wet", type=float, default=-17); ap.add_argument("--drone", type=float, default=-35)
    ap.add_argument("--lufs", type=float, default=-14); ap.add_argument("--no-drone", action="store_true")
    a = ap.parse_args()
    tmp = tempfile.mkdtemp(prefix="relmix_")
    vend = min(dur(a.voice), last_sound(a.voice) + 0.6)
    ff("-i", a.voice, "-af", f"atrim=0:{vend:.3f},afade=t=in:d=0.01,afade=t=out:st={max(0, vend - 0.25):.3f}:d=0.25",
       "-ac", "1", "-ar", "48000", "-c:a", "pcm_f32le", f"{tmp}/v.wav")
    total = round(a.off + vend + a.outro, 2)
    # reverb IRs (damped: lowpass + highpass like the 002 IR), stereo = two different seeds
    for i, seed in enumerate((1, 2)):
        write_ir(f"{tmp}/ir{i}_raw.wav", seed)
        ff("-i", f"{tmp}/ir{i}_raw.wav", "-af", "highpass=f=220,lowpass=f=3500", "-c:a", "pcm_f32le", f"{tmp}/ir{i}.wav")
    wet = 10 ** (a.wet / 20)
    # no IR normalisation: irnorm=-1 on ffmpeg >= 7, gtype=-1 on ffmpeg 6
    afh = subprocess.run(["ffmpeg", "-hide_banner", "-h", "filter=afir"], stdout=subprocess.PIPE).stdout.decode()
    nonorm = "irnorm=-1" if "irnorm" in afh else "gtype=-1"
    ff("-i", f"{tmp}/v.wav", "-i", f"{tmp}/ir0.wav", "-i", f"{tmp}/ir1.wav", "-filter_complex",
       f"[0]asplit=3[d][a][b];[a][1]afir=dry=0:wet=1:{nonorm}[wl];[b][2]afir=dry=0:wet=1:{nonorm}[wr];"
       f"[wl][wr]join=inputs=2:channel_layout=stereo,volume={wet:.5f}[w];[d]pan=stereo|c0=c0|c1=c0,apad=pad_dur=1.8[dd];"
       f"[dd][w]amix=inputs=2:normalize=0:duration=first,adelay={int(a.off * 1000)}:all=1,apad,atrim=0:{total}",
       "-ar", "48000", "-c:a", "pcm_f32le", f"{tmp}/voice_fx.wav")
    inputs = ["-i", f"{tmp}/voice_fx.wav"]
    if not a.no_drone:
        L = "+".join(f"{amp}*sin(2*PI*{f - 0.15}*t+{i})*(0.75+0.25*sin(2*PI*t/{9.0 + f / 40}+{i}))" for i, (f, amp) in enumerate([(73.42, 1.0), (110.0, 0.55), (146.83, 0.35), (220.0, 0.12)]))
        R = "+".join(f"{amp}*sin(2*PI*{f + 0.15}*t+{i + 2})*(0.75+0.25*sin(2*PI*t/{9.0 + f / 40}+{i + 2}))" for i, (f, amp) in enumerate([(73.42, 1.0), (110.0, 0.55), (146.83, 0.35), (220.0, 0.12)]))
        ff("-f", "lavfi", "-i", f"aevalsrc=0.2*({L})|0.2*({R}):s=48000:d={total}", "-f", "lavfi", "-i",
           f"anoisesrc=c=pink:a=0.05:d={total}:r=48000", "-filter_complex",
           f"[1]bandpass=f=150:w=240:t=h,pan=stereo|c0=c0|c1=c0[n];[0][n]amix=inputs=2:normalize=0,lowpass=f=420,"
           f"afade=t=in:d=2,afade=t=out:st={total - 2.5}:d=2.5", "-c:a", "pcm_f32le", f"{tmp}/drone_raw.wav")
        st = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", f"{tmp}/drone_raw.wav", "-af",
                             f"atrim=3:{max(4, total - 3)},astats=measure_overall=RMS_level:measure_perchannel=none", "-f", "null", "-"],
                            stderr=subprocess.PIPE).stderr.decode()
        rms = float(re.findall(r"RMS level dB: (-?[\d.]+)", st)[-1])
        ff("-i", f"{tmp}/drone_raw.wav", "-af", f"volume={a.drone - rms:.2f}dB", "-c:a", "pcm_f32le", f"{tmp}/drone.wav")
        inputs += ["-i", f"{tmp}/drone.wav"]
    G = 0.0
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    for it in range(4):
        lim = "aresample=192000,alimiter=limit=0.80:attack=3:release=60:level=disabled,aresample=48000"
        if a.no_drone:
            fc = f"[0]volume={G}dB,{lim}"
        else:
            fc = (f"[0]volume={G}dB,{lim}[v];[v][1]amix=inputs=2:normalize=0:duration=first,"
                  "aresample=192000,alimiter=limit=0.86:attack=2:release=50:level=disabled,aresample=48000")
        ff(*inputs, "-filter_complex", fc, "-c:a", "pcm_s24le", a.out)
        I, TP = measure(a.out); print(f"iter {it} G={G:+.2f}  I={I} LUFS  TP={TP} dBTP", file=sys.stderr)
        if abs(a.lufs - I) < 0.15 and TP <= -1.0: break
        G = round(G + (a.lufs - I), 2)
    meta = {"off": a.off, "voice_len": round(vend, 3), "total": total, "lufs": I, "true_peak": TP}
    json.dump(meta, open(os.path.splitext(a.out)[0] + ".json", "w"))
    print(json.dumps(meta))


if __name__ == "__main__":
    main()
