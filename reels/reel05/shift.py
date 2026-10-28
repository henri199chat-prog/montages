# Inserts the "what is a Skill" scene: shifts every time >= CUT in template_v1.tpl by D, then injects sDef markup/tweens.
import re, sys, json
CUT, D = 5.0, float(sys.argv[1])
s = open("template_v1.tpl", encoding="utf-8").read()
sh = lambda v: round(float(v) + D, 3) if float(v) >= CUT else float(v)
s = re.sub(r'data-start="([\d.]+)"', lambda m: f'data-start="{sh(m.group(1))}"', s)
# last numeric arg of tl.* / stepOn / click calls, and the 3rd arg of cur()
s = re.sub(r'(tl\.(?:to|fromTo|set|from)\(.*?), ([\d.]+)\);', lambda m: f'{m.group(1)}, {sh(m.group(2))});', s)
s = re.sub(r'(stepOn\(\d, )([\d.]+)\)', lambda m: f'{m.group(1)}{sh(m.group(2))})', s)
s = re.sub(r'(swap\(\d, )([\d.]+)\)', lambda m: f'{m.group(1)}{sh(m.group(2))})', s)
s = re.sub(r'click\(([\d.]+)\)', lambda m: f'click({sh(m.group(1))})', s)
s = re.sub(r'(cur\([^;]*?, )([\d.]+)(, [\d.]+\);)', lambda m: f'{m.group(1)}{sh(m.group(2))}{m.group(3)}', s)
s = s.replace("<!--DEF_HTML-->", open("def.html", encoding="utf-8").read()).replace("/*DEF_CSS*/", open("def.css", encoding="utf-8").read()).replace("/*DEF_JS*/", open("def.js", encoding="utf-8").read())
dw0 = json.load(open("w_def.json", encoding="utf-8"))
def tok(t):
    t = re.sub(r"W\((\d+)\)", lambda m: str(round(dw0[int(m.group(1))][1] + CUT + .1, 3)), t)
    t = re.sub(r"S\(([\d.]+)\)", lambda m: str(round(float(m.group(1)) + D, 3)), t)
    return t.replace("DLEN2", str(round(D - .45, 3))).replace("SRCLEN", str(round(sh(26.6) - sh(5.4), 3))).replace("DLEN", str(round(D + .45, 3)))
s = tok(s)
open("template.tpl", "w", encoding="utf-8").write(s)
w = json.load(open("w_v1.json", encoding="utf-8")); dw = json.load(open("w_def.json", encoding="utf-8"))
out = [x for x in w if x[1] < CUT] + [[t, round(a + CUT + .1, 3), 0] for t, a, _ in dw] + [[t, round(a + D, 3), 0] for t, a, _ in w if a >= CUT]
json.dump(out, open("w.json", "w", encoding="utf-8"), ensure_ascii=False)
