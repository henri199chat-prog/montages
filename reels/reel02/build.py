# Generates index.html for reel02 (Claude Skills explainer) from template.tpl + w.json word timings.
# Caption spec: one string per on-screen line. Tokens split by spaces; "+" joins tokens into one unit;
# a leading "*" marks the unit as the highlighted keyword. Tokens must match the transcript in order.
import json

WORDS = json.load(open("w.json", encoding="utf-8"))
END = 87.6

LINES = [
    "نفس *Claude...", "نفس *الذكاء...", "لكن واحد يشتغل *كمبتدئ،", "والثاني *كخبير.", "*الفرق؟", "*كلمة+وحدة.",
    "في كل محادثة جديدة،", "تعيد شرح نفس *التعليمات:", "أسلوبك، خطواتك، قواعدك...", "وفي كل مرة *تنسى جزءاً منها.",
    "*الـ+Skill ببساطة", "*مجلد فيه ملف تعليمات.", "تكتب فيه *مرة+واحدة", "كيف تُنجز مهمة معيّنة،",
    "ويصبح عند Claude *خبرة+جاهزة", "يرجع لها متى احتاجها.",
    "*والذكي في الأمر؟", "Claude *لا+يقرأ كل المهارات", "دفعة واحدة.", "يرى *أسماءها+ووصفها فقط،",
    "وعندما *يطابق طلبك مهارة معيّنة،", "*يفتحها ويطبّقها.", "لذلك تستطيع امتلاك", "*عشرات+المهارات دون أن تُثقل عليه.",
    "وتعمل *بطريقتين:", "إما أن يختارها Claude *تلقائياً", "عندما تحتاجها،", "أو تستدعيها أنت *مباشرة",
    "بكتابة *شرطة+مائلة واسمها.",
    "والمهارة *ليست+نصاً فقط.", "يمكن أن تحتوي على *سكريبتات", "*وملفات+مرجعية،", "فينفّذ Claude *عملاً+كاملاً",
    "*بخطواتك أنت:", "تقارير، تحليل ملفات،", "وحتى *مونتاج.",
]
O = 65.6
# outro chunks timed from pauses in vo_end (seconds into that file): (start, end, spec)
OUTRO = [
    (0.13, 0.75, "اليوم،"), (1.05, 3.07, "أغلب الناس يستعملون Claude..."), (3.43, 3.93, "*كأداة."),
    (4.55, 5.82, "لكن *القليل فقط..."), (6.27, 8.77, "يحوّلونه إلى *فريق+عمل+كامل،"), (9.09, 10.45, "يشتغل *بطريقتهم."),
    (10.95, 12.04, "وفي الفيديو القادم،"), (12.28, 15.0, "سأفتح لك *أول+مهارة مهمة جداً..."), (15.38, 17.85, "ونطبّقها أمامك *خطوة+بخطوة."),
    (18.38, 19.31, "*السؤال الآن..."), (19.71, 21.65, "في أي *جهة تريد أن تكون؟"),
]

idx = 0
lines = []  # (units=[(text, start, is_key)], start)
for spec in LINES:
    units = []
    for tok in spec.split(" "):
        key = tok.startswith("*")
        parts = tok.lstrip("*").split("+")
        start = None
        for p in parts:
            w, s, _ = WORDS[idx]
            assert w == p, f"caption mismatch at {idx}: transcript '{w}' vs spec '{p}'"
            start = s if start is None else start
            idx += 1
        units.append((" ".join(parts), start, key))
    lines.append(units)
assert WORDS[idx][0] == "هذا", f"old outro should start at index {idx}"
for s, e, spec in OUTRO:
    units = []
    toks = spec.split(" ")
    total = sum(len(x) for x in toks) + len(toks)
    t = s
    for tok in toks:
        units.append((tok.lstrip("*").replace("+", " "), round(O + t, 3), tok.startswith("*")))
        t += (e - s) * (len(tok) + 1) / total
    lines.append(units)

cap_html, cap_js = [], []
for li, units in enumerate(lines):
    s = units[0][1]
    nxt = lines[li + 1][0][1] if li + 1 < len(lines) else END
    if s < 64.45:
        nxt = min(nxt, 64.45)  # keep the black beat clean
    spans = " ".join(
        f'<span id="c{li}u{ui}" class="w{" key" if k else ""}">{t}</span>' for ui, (t, _, k) in enumerate(units)
    )
    cap_html.append(
        f'<div id="capline{li}" class="clip cap-wrap" data-start="{s}" data-duration="{round(nxt - s, 3)}" data-track-index="9">'
        f'<div class="cap">{spans}</div></div>'
    )
    for ui, (t, st, k) in enumerate(units):
        if k:
            cap_js.append(f'tl.fromTo("#c{li}u{ui}",{{opacity:0,scale:.6}},{{opacity:1,scale:1,duration:.22,ease:"back.out(3)"}},{st});')
        else:
            cap_js.append(f'tl.fromTo("#c{li}u{ui}",{{opacity:0,y:14,color:"#b9b2cc"}},{{opacity:1,y:0,color:"#2b2540",duration:.18,ease:"power2.out"}},{st});')

html = open("template.tpl", encoding="utf-8").read()
html = html.replace("<!--CAPTIONS-->", "\n      ".join(cap_html))
html = html.replace("/*CAPTION_TWEENS*/", "\n      ".join(cap_js))
import random
rnd = random.Random(7)
cols = ["#c9b8ef", "#bfe3f7", "#ffd3bf", "#b39ce6", "#8fc6e8", "#f2a98f", "#d9ccf7", "#e8775a", "#6d55b8"]
books = []
for shelf in (190, 400, 610):
    x = 10
    while x < 860:
        h = rnd.randint(120, 175)
        if not (shelf == 400 and 400 <= x <= 470):
            books.append(f'<div class="book" style="left:{x}px;top:{shelf - h}px;height:{h}px;background:{rnd.choice(cols)}"></div>')
        x += 60
html = html.replace("<!--BOOKS-->", "".join(books))
html = html.replace("__LOOPDUR__", str(round(END - 85.25, 2)))
html = html.replace("__END__", str(END))
open("index.html", "w", encoding="utf-8").write(html)
print("ok", len(lines), "caption lines,", len(cap_js), "word tweens")
