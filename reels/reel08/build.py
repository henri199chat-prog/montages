# Generates index.html for reel08 (build your own connector with the mcp-builder skill) from template.tpl + w.json word timings.
# Caption spec as in reel02: tokens split by spaces, "+" joins tokens into one unit, "*" marks the keyword.
# Template timing tokens: W(i) = start of word i; ADD/SUB(x,y); SPAN(a,b,pad) = W(b)-W(a)+pad; TAIL(a) = END-W(a).
import json, re

WORDS = json.load(open("w.json", encoding="utf-8"))
END = round(WORDS[-1][2] + 1.2, 2)

LINES = [
    "خدمتك *ما+لها+موصّل", "في Claude؟", "ابنِ واحد *بنفسك", "مع مهارة *mcp-builder.",
    "هي مهارة من *Anthropic،", "تعلّم Claude يبني *خادم+MCP", "بطريقة *احترافية…", "مو *كود+عشوائي.",
    "فعّلها من *Customize،", "ثم *Skills.",
    "وبعدين قل له:", "استخدم *mcp-builder", "وابنِ خادم MCP *لخدمتي،", "وابدأ *بالبحث+والتخطيط.",
    "وهو يمشي معك *أربع+مراحل:", "*يبحث+ويخطط،", "*يكتب+الكود،", "*يراجع+ويختبر،", "وبعدين *يقيّم+الأدوات.",
    "بس *انتبه:", "النتيجة *كود…", "لازم تشغّله *على+رابط.",
    "بعدها من *Connectors،", "اضغط *الزائد،", "ثم *Add+custom+connector،", "وحط *الرابط.",
    "هذي خطوة للي عنده", "*خبرة+تقنية…", "واربط بس الخدمات", "اللي *تثق+فيها.",
    "اكتب *BUILD في التعليقات،", "وأرسل لك *البرومبت+كامل.",
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
W = lambda i: WORDS[int(i)][1]
html = re.sub(r"SPAN\((\d+),(\d+),([\d.]+)\)", lambda m: str(round(W(m.group(2)) - W(m.group(1)) + float(m.group(3)), 3)), html)
html = re.sub(r"TAIL\((\d+)\)", lambda m: str(round(END - W(m.group(1)), 3)), html)
html = re.sub(r"W\((\d+)\)", lambda m: str(W(m.group(1))), html)
html = re.sub(r"ADD\(([\d.]+),([\d.]+)\)", lambda m: str(round(float(m.group(1)) + float(m.group(2)), 3)), html)
html = re.sub(r"SUB\(([\d.]+),([\d.]+)\)", lambda m: str(round(float(m.group(1)) - float(m.group(2)), 3)), html)
html = html.replace("<!--CAPTIONS-->", "\n      ".join(cap_html)).replace("/*CAPTION_TWEENS*/", "\n      ".join(cap_js))
html = html.replace("__END__", str(END))
open("index.html", "w", encoding="utf-8").write(html)
print("ok", len(lines), "caption lines, END", END)
