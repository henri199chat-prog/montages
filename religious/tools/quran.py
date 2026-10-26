#!/usr/bin/env python3
"""quran.py - verified Uthmani Quran text, OFFLINE (religious/data/quran-uthmani.json, Tanzil via alquran.cloud).

Usage:
  python3 religious/tools/quran.py 9 102-104            # print the ayat
  python3 religious/tools/quran.py 9 102-104 --json     # JSON: display words (waqf marks kept on the word before), romanised words
  python3 religious/tools/quran.py 31 7 --no-basmala    # (only matters for ayah 1) strip the basmala this source prepends
  python3 religious/tools/quran.py --find "خذ من اموالهم"  # search by plain letters (no tashkeel needed)

Rule: the text on screen must come from here (or another verified mushaf source), never from speech recognition.
"""
import json, os, re, sys, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, "..", "data", "quran-uthmani.json")
WAQF = set("\u06D6\u06D7\u06D8\u06D9\u06DA\u06DB\u06DC")
AR_DIGITS = "٠١٢٣٤٥٦٧٨٩"

# romanisation used for torchaudio MMS_FA forced alignment (from the 002 pipeline, fa.py)
ROM = {'ا':'a','أ':'a','إ':'i','آ':'aa','ٱ':'','ء':'','ؤ':'u','ئ':'i','ب':'b','ت':'t','ث':'th','ج':'j','ح':'h','خ':'kh','د':'d',
       'ذ':'dh','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'z','ع':'a','غ':'gh','ف':'f','ق':'q','ك':'k','ل':'l',
       'م':'m','ن':'n','ه':'h','ة':'h','و':'w','ي':'y','ى':'a','\u064E':'a','\u064F':'u','\u0650':'i','\u064B':'an','\u064C':'un',
       '\u064D':'in','\u0670':'a'}


def rom(w):
    w = re.sub('.\u06DF', '', w)  # letters marked silent (small high rounded zero)
    o = ''
    for ch in w:
        if ch == '\u0651' and o:
            o += o[-1]; continue
        o += ROM.get(ch, '')
    o = ''.join(c for c in o if c in 'abcdefghijklmnopqrstuvwxyz')
    return o or 'a'


def load():
    return json.load(open(DATA, encoding="utf-8"))


def ayah_text(q, s, a, no_basmala=False):
    t = q["surahs"][s - 1]["ayahs"][a - 1]
    if no_basmala and a == 1 and s not in (1, 9):
        t = " ".join(t.split(" ")[4:])
    return t


def display_words(text):
    """Split on spaces; a stand-alone waqf mark is glued to the word before it (as in the 002 reel)."""
    out = []
    for tk in text.split(" "):
        if not tk:
            continue
        if all(c in WAQF for c in tk) and out:
            out[-1] += tk
        else:
            out.append(tk)
    return out


def ar_num(n):
    return "".join(AR_DIGITS[int(d)] for d in str(n))


def plain(s):
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if unicodedata.category(c)[0] == "L")
    for a, b in (("ٱ", "ا"), ("أ", "ا"), ("إ", "ا"), ("آ", "ا"), ("ى", "ي"), ("ة", "ه")):
        s = s.replace(a, b)
    return s


def main():
    args = sys.argv[1:]
    if not args or args[0] in ("-h", "--help"):
        print(__doc__); return
    q = load()
    if args[0] == "--find":
        needle = plain(" ".join(args[1:])).replace(" ", "")
        for s in q["surahs"]:
            for i, t in enumerate(s["ayahs"], 1):
                if needle in plain(t).replace(" ", ""):
                    print(f'{s["n"]}:{i}  {s["name"]}  {t}')
        return
    s = int(args[0]); rng = args[1] if len(args) > 1 and not args[1].startswith("--") else "1-%d" % len(q["surahs"][s - 1]["ayahs"])
    a0, a1 = (int(x) for x in (rng.split("-") + [rng])[:2])
    nb = "--no-basmala" in args
    sur = q["surahs"][s - 1]
    if "--json" in args:
        out = {"surah": s, "name": sur["name"], "en": sur["en"], "ayahs": []}
        for a in range(a0, a1 + 1):
            t = ayah_text(q, s, a, nb); w = display_words(t)
            out["ayahs"].append({"n": a, "num_ar": ar_num(a), "text": t, "words": w, "rom": [rom(x) for x in w]})
        print(json.dumps(out, ensure_ascii=False, indent=1))
    else:
        print(f'{sur["name"]} ({sur["en"]}) {s}:{a0}-{a1}')
        for a in range(a0, a1 + 1):
            print(f"﴿{ayah_text(q, s, a, nb)}﴾ ۝{ar_num(a)}")


if __name__ == "__main__":
    main()
