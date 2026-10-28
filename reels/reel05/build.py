# Generates index.html for reel05 (how to install a skill in Claude) from template.tpl + w.json word timings.
# Caption spec as in reel02: tokens split by spaces, "+" joins tokens into one unit, "*" marks the keyword.
import json

WORDS = json.load(open("w.json", encoding="utf-8"))
END = 48.31

LINES = [
    "تبي *Claude يشتغل *بطريقتك", "في كل مرة؟", "ثبّت له *Skill...", "في *أقل+من+دقيقة.",
    "بس قبل،", "وش هي *الـ+Skill أصلاً؟", "هي *مجلد فيه *تعليمات،", "يحمّله Claude *وقت+الحاجة.",
    "Claude يقرأ *اسمها+ووصفها بس،", "وإذا طلبك *يناسبها،", "يفتح *التعليمات+كاملة", "ويشتغل بها.",
    "*أولاً: من الإعدادات،", "فعّل خاصية *تنفيذ+الكود", "*وإنشاء+الملفات.",
    "*ثانياً: جهّز *مجلد+المهارة،", "فيه ملف *SKILL.md،", "واضغطه *ملف+ZIP.",
    "*ثالثاً: افتح قسم *Skills،", "اضغط *زر+الإضافة،", "واختر *رفع+مهارة،", "وارفع الملف.",
    "*رابعاً: *فعّل+المهارة،", "واطلب منه *مباشرة.",
    "*وانتبه: اسم المجلد", "لازم *يطابق اسم المهارة.",
    "تبي مهارة *جاهزة", "تجربها الحين؟", "اكتب *SKILL في التعليقات.",
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
