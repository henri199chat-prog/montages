# Word timings from pauses (transcription unavailable): spread words over the speech segments
# by character weight, then snap phrase-initial words to the nearest segment start.
import json, re, sys
text = open("script.txt", encoding="utf-8").read().split()
dur = float(sys.argv[1])
vals = [float(l.split(": ")[1]) for l in open("sil.txt")]
sil = list(zip(vals[0::2], vals[1::2]))
segs, t = [], 0.0
for a, b in sil:
    if a - t > 0.05: segs.append((t, a))
    t = b
if dur - t > 0.05: segs.append((t, dur))
total = sum(b - a for a, b in segs)
wts = [len(re.sub(r"[^\w]", "", w)) + 1.5 for w in text]
W = sum(wts)
def at(frac):
    x = frac * total
    for a, b in segs:
        if x <= b - a: return a + x
        x -= b - a
    return segs[-1][1]
out, c = [], 0.0
starts = [a for a, _ in segs]
for i, w in enumerate(text):
    s = at(c / W); c += wts[i]; e = at(c / W)
    if i == 0 or re.search(r"[،.؟…:]$", text[i - 1]):
        near = min(starts, key=lambda x: abs(x - s))
        if abs(near - s) < .6: s = near
    out.append([w, round(s, 3), round(e, 3)])
for i in range(1, len(out)):
    out[i][1] = max(out[i][1], out[i - 1][1] + .05)
json.dump(out, open("w.json", "w", encoding="utf-8"), ensure_ascii=False)
print(len(segs), "segments,", len(out), "words")

# second pass: align phrase starts to pause ends with a monotone DP, then re-spread words inside each phrase
P = [i for i in range(len(out)) if i == 0 or re.search(r"[،.؟…:]$", out[i - 1][0])]
A = sorted(set([0.0] + starts))
est = [out[i][1] for i in P]
INF = 1e9
n, m = len(P), len(A)
dp = [[INF] * (m + 1) for _ in range(n + 1)]; bk = [[None] * (m + 1) for _ in range(n + 1)]
dp[0][0] = 0
for i in range(n + 1):
    for j in range(m + 1):
        if dp[i][j] >= INF: continue
        if j < m and dp[i][j] < dp[i][j + 1]: dp[i][j + 1] = dp[i][j]; bk[i][j + 1] = ("skipA", i, j)
        if i < n:
            if j < m:
                c = dp[i][j] + abs(est[i] - A[j])
                if c < dp[i + 1][j + 1]: dp[i + 1][j + 1] = c; bk[i + 1][j + 1] = ("match", i, j)
            c = dp[i][j] + 1.8
            if c < dp[i + 1][j]: dp[i + 1][j] = c; bk[i + 1][j] = ("free", i, j)
j = min(range(m + 1), key=lambda j: dp[n][j]); i = n; anchor = {}
while i > 0 or j > 0:
    k, pi, pj = bk[i][j]
    if k == "match": anchor[pi] = A[pj]
    i, j = pi, pj
ps = [anchor.get(k, est[k]) for k in range(n)]
for k in range(n):
    a = ps[k]; b = ps[k + 1] if k + 1 < n else dur
    # end of speech before the next phrase: last pause start before b
    stops = [s for s, e in sil if a < s <= b]
    end = stops[-1] if stops else b
    idx = list(range(P[k], P[k + 1] if k + 1 < n else len(out)))
    tw = sum(wts[x] for x in idx); c2 = 0
    for x in idx:
        out[x][1] = round(a + (end - a) * c2 / tw, 3); c2 += wts[x]; out[x][2] = round(a + (end - a) * c2 / tw, 3)
json.dump(out, open("w.json", "w", encoding="utf-8"), ensure_ascii=False)
print("aligned", sum(1 for k in range(n) if k in anchor), "of", n, "phrases")
print([(out[i][0], out[i][1]) for i in P])
