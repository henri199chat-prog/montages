# builds src/data.js : pages (phrase screens) of the verified Uthmani ayat, word onsets, key words
import json, numpy as np, soundfile as sf
M=json.load(open('src/audio_meta.json')); OFF=M['OFF']; TOTAL=M['TOTAL']
T=json.load(open('src/timing.json'))
API={json.loads(l)['data']['numberInSurah']:json.loads(l)['data']['text'] for l in open('src/quran_api.jsonl')}
WAQF=set('\u06D6\u06D7\u06D8\u06D9\u06DA\u06DB\u06DC')
a,sr=sf.read('audio/voc_dfn.wav'); h=int(sr*0.02)
r=np.array([20*np.log10(np.sqrt(np.mean(a[i:i+h]**2))+1e-9) for i in range(0,len(a)-h,h)])
# pages: (ayah, first word, last word excl, cumulative line breaks within page, last page of ayah?)
PAGES=[(102,0,8,[4,8]),(102,8,17,[5,9]),(103,0,7,[4,7]),(103,7,16,[6,9]),(104,0,9,[5,9]),(104,9,16,[2,7])]
# key words: g = gold (divine names / hope), c = coral (sin), w = warm white glow
KEY={102:{1:'w',2:'c',4:'g',5:'g',7:'c',8:'g',9:'g',11:'g',14:'g',15:'g',16:'g'},
     103:{3:'g',4:'g',5:'g',7:'w',10:'w',11:'g',13:'g',14:'g',15:'g'},
     104:{3:'g',5:'g',6:'g',8:'w',10:'g',12:'g',14:'g',15:'g'}}
ay={}
for A in T:
    n=A['n']; toks=API[n].split(' '); disp=[]
    for tk in toks:
        if all(c in WAQF for c in tk): disp[-1]+=tk
        else: disp.append(tk)
    assert len(disp)==len(A['words']),(n,len(disp),len(A['words']))
    for d,w in zip(disp,A['words']): assert d.startswith(w['t'])
    ay[n]=[{'t':d,'on':w['on'],'off':w['off'],'k':KEY[n].get(i,'')} for i,(d,w) in enumerate(zip(disp,A['words']))]
flat_on=[w['on'] for n in (102,103,104) for w in ay[n]]
out=[]
for pi,(n,i0,i1,lines) in enumerate(PAGES):
    ws=ay[n][i0:i1]; start=ws[0]['on']
    last_of_ayah = i1==len(ay[n])
    if pi+1<len(PAGES):
        nn,j0=PAGES[pi+1][0],PAGES[pi+1][1]; nxt=ay[nn][j0]['on']-OFF
        k0=int((nxt-1.5)/0.02); k1=int(nxt/0.02); low=np.where(r[k0:k1]<-34)[0]
        end=(k0+low[0])*0.02+OFF if len(low) else nxt+OFF-0.15
    else:
        end=ws[-1]['off']+0.15
    out.append({'n':n,'p':pi,'start':round(start,3),'end':round(end,3),'lines':lines,'num':last_of_ayah,'first':i0==0,'words':ws})
    print(pi,n,out[-1]['start'],out[-1]['end'],' '.join(w['t'] for w in ws))
open('src/data.js','w').write('window.__DATA__='+json.dumps({'TOTAL':TOTAL,'OFF':OFF,'pages':out},ensure_ascii=False)+';\n')
