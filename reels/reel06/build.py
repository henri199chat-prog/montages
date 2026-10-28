# Generates index.html for reel06 (build a skill with skill-creator, over real screen recordings) from template.tpl + w.json word timings.
# Caption spec as in reel02: tokens split by spaces, "+" joins tokens into one unit, "*" marks the keyword.
import json

WORDS = json.load(open("w.json", encoding="utf-8"))
END = 45.6

LINES = [
    "تبي *Claude يكتب *بأسلوبك؟", "لا تكتب المهارة *بنفسك…", "خلّه هو *يبنيها+لك.",
    "*أولاً: من *الإعدادات،", "افتح *Capabilities،", "وفعّل *Run+code+in+the+cloud…", "بدونه *المهارات ما *تشتغل.",
    "*ثانياً: افتح *Customize،", "وابحث عن *skill-creator…", "مهارة *رسمية من Anthropic،", "وتأكد إنها *مفعّلة.",
    "*ثالثاً: افتح *محادثة+جديدة،", "وقل له:", "ساعدني أسوّي *مهارة", "تكتب كابشن إنستغرام *بأسلوبي.",
    "بيسألك عن *حسابك+وأسلوبك…", "جاوبه *بوضوح،", "وهو يكتب ملف *SKILL.md", "*لحاله.",
    "*رابعاً: اضغط *Save+skill…", "وصارت مهارتك *جاهزة.",
    "*جرّبها: اطلب *كابشن،", "وشوف Claude *يحمّل+مهارتك", "ويكتب *بطريقتك.",
    "تبي مهارة كابشن *جاهزة؟", "اكتب *SKILL في التعليقات.",
]

idx, lines = 0, []
for spec in LINES:
    units = []
    for tok in spec.split(" "):
        parts = tok.lstrip("*").split("+")
        start = None
        for p in parts:
            w, s, _ = WORDS[idx]
            assert w == p, f"caption mismatch at {idx}: transcript '{w}' vs spec '{p}'"
            start = s if start is None else start
            idx += 1
        units.append((" ".join(parts), start, tok.startswith("*")))
    lines.append(units)
assert idx == len(WORDS), f"{len(WORDS) - idx} transcript words not captioned"

cap_html, cap_js = [], []
for li, units in enumerate(lines):
    s = units[0][1]
    nxt = lines[li + 1][0][1] if li + 1 < len(lines) else END
    spans = " ".join(f'<span id="c{li}u{ui}" class="w{" key" if k else ""}">{t}</span>' for ui, (t, _, k) in enumerate(units))
    cap_html.append(f'<div id="capline{li}" class="clip cap-wrap" data-start="{s}" data-duration="{round(nxt - s, 3)}" data-track-index="9"><div class="cap">{spans}</div></div>')
    for ui, (t, st, k) in enumerate(units):
        if k:
            cap_js.append(f'tl.fromTo("#c{li}u{ui}",{{opacity:0,scale:.6}},{{opacity:1,scale:1,duration:.22,ease:"back.out(3)"}},{st});')
        else:
            cap_js.append(f'tl.fromTo("#c{li}u{ui}",{{opacity:0,y:14,color:"#b9b2cc"}},{{opacity:1,y:0,color:"#2b2540",duration:.18,ease:"power2.out"}},{st});')

html = open("template.tpl", encoding="utf-8").read()
html = html.replace("<!--CAPTIONS-->", "\n      ".join(cap_html)).replace("/*CAPTION_TWEENS*/", "\n      ".join(cap_js))
html = html.replace("__END__", str(END))
open("index.html", "w", encoding="utf-8").write(html)
print("ok", len(lines), "caption lines,", len(cap_js), "word tweens")
