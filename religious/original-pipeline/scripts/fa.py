# CTC forced alignment (torchaudio MMS_FA, star token) of the verified Uthmani words of 9:102-104
import json, torch, torchaudio, wave, numpy as np, re
AY=[]
for l in open('src/quran_api.jsonl'):
    d=json.loads(l)['data']
    if 102<=d['numberInSurah']<=104: AY.append({'n':d['numberInSurah'],'text':d['text']})
WAQF=set('\u06D6\u06D7\u06D8\u06D9\u06DA\u06DB\u06DC')
M={'ا':'a','أ':'a','إ':'i','آ':'aa','ٱ':'','ء':'','ؤ':'u','ئ':'i','ب':'b','ت':'t','ث':'th','ج':'j','ح':'h','خ':'kh','د':'d','ذ':'dh','ر':'r','ز':'z','س':'s','ش':'sh','ص':'s','ض':'d','ط':'t','ظ':'z','ع':'a','غ':'gh','ف':'f','ق':'q','ك':'k','ل':'l','م':'m','ن':'n','ه':'h','ة':'h','و':'w','ي':'y','ى':'a',
   '\u064E':'a','\u064F':'u','\u0650':'i','\u064B':'an','\u064C':'un','\u064D':'in','\u0670':'a'}
def rom(w):
    w=re.sub('.\u06DF','',w)          # letters marked silent (small high rounded zero)
    o=''
    for ch in w:
        if ch=='\u0651' and o: o+=o[-1]; continue
        o+=M.get(ch,'')
    o=''.join(c for c in o if c in 'abcdefghijklmnopqrstuvwxyz')
    return o or 'a'
words=[]
for ai,ay in enumerate(AY):
    toks=[t for t in ay['text'].split(' ') if t and not all(c in WAQF for c in t)]
    ay['words']=[{'t':t} for t in toks]
    for wi,t in enumerate(toks): words.append((ai,wi,rom(t)))
b=torchaudio.pipelines.MMS_FA
model=b.get_model(with_star=True); tok=b.get_tokenizer(); aligner=b.get_aligner()
w=wave.open('audio/voc16.wav'); a=torch.tensor(np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768)[None]
with torch.inference_mode():
    em,_=model(a)
    toks=tok([x[2] for x in words])
    spans=aligner(em[0],toks)
ratio=a.shape[1]/em.shape[1]/16000
for (ai,wi,r),sp in zip(words,spans):
    s=sp[0].start*ratio; e=sp[-1].end*ratio; sc=float(np.exp(np.mean([x.score for x in sp]))) if hasattr(sp[0],'score') else 0
    W=AY[ai]['words'][wi]; W.update(s=round(s,3),e=round(e,3),rom=r,score=round(sc,3))
    print(f"{AY[ai]['n']} {W['t']:<16} {s:6.2f}-{e:6.2f} {sc:.2f} {r}")
json.dump(AY,open('src/timing_fa.json','w'),ensure_ascii=False,indent=1)
