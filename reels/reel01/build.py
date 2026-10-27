# Generates index.html for reel01 (hook + demo + "not video AI"), timed to assets/vo.mp3.
import json

# Caption chunks: (start, end, words, keyword indices). Times come from silence detection on vo.mp3.
CHUNKS = [
    (0.05, 1.86, ["تعرف", "إن", "مهارة", "وحدة", "في", "Claude"], [5]),
    (2.21, 3.55, ["تسوّي", "لك", "ريلز", "متحركة"], [2]),
    (3.55, 4.33, ["بلا حدود؟"], [0]),
    (4.82, 5.85, ["تعطيه", "فكرة وحدة،"], [1]),
    (6.14, 7.20, ["وهو", "يكتب", "السكربت،"], [2]),
    (7.20, 8.30, ["ويحرّك", "المشاهد،"], [1]),
    (8.30, 9.45, ["ويطلّع", "الفيديو."], [1]),
    (9.95, 11.30, ["مو", "ذكاء اصطناعي", "للفيديو…"], [1]),
    (11.66, 12.40, ["كله", "بالكود."], [1]),
    (12.78, 14.17, ["يعني", "ولا كريدت", "واحد."], [1]),
]
END = 14.6


def word_times(start, end, words):
    total = sum(len(w) for w in words) + len(words)
    t, out = start, []
    for w in words:
        out.append(round(t, 3))
        t += (end - start) * (len(w) + 1) / total
    return out


cap_html, cap_js = [], []
for ci, (s, e, words, keys) in enumerate(CHUNKS):
    hold = (CHUNKS[ci + 1][0] if ci + 1 < len(CHUNKS) else END) - s
    spans = []
    for wi, w in enumerate(words):
        cls = "w key" if wi in keys else "w"
        spans.append(f'<span id="c{ci}w{wi}" class="{cls}">{w}</span>')
    cap_html.append(
        f'<div id="capline{ci}" class="clip cap-wrap" data-start="{s}" data-duration="{round(hold, 3)}" data-track-index="9">'
        f'<div class="cap" id="cap{ci}">{" ".join(spans)}</div></div>'
    )
    for wi, t in enumerate(word_times(s, e, words)):
        local = round(t, 3)
        if wi in keys:
            cap_js.append(f'tl.fromTo("#c{ci}w{wi}",{{opacity:0,scale:.6}},{{opacity:1,scale:1,duration:.22,ease:"back.out(3)"}},{local});')
        else:
            cap_js.append(f'tl.fromTo("#c{ci}w{wi}",{{opacity:0,y:14,color:"#b9b2cc"}},{{opacity:1,y:0,color:"#2b2540",duration:.18,ease:"power2.out"}},{local});')

html = open("template.tpl", encoding="utf-8").read()
html = html.replace("<!--CAPTIONS-->", "\n      ".join(cap_html))
html = html.replace("/*CAPTION_TWEENS*/", "\n      ".join(cap_js))
html = html.replace("__END__", str(END))
open("index.html", "w", encoding="utf-8").write(html)
print("ok", len(cap_js), "caption tweens")
