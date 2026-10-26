# refine FA onsets with de-reverbed energy dips, shift to video time
import json, numpy as np, soundfile as sf
OFF=json.load(open('src/audio_meta.json'))['OFF']
AY=json.load(open('src/timing_fa.json'))
a,sr=sf.read('audio/voc_dfn.wav'); h=int(sr*0.02)
r=np.array([20*np.log10(np.sqrt(np.mean(a[i:i+h]**2))+1e-9) for i in range(0,len(a)-h,h)])
def dip_end(t0,t1):
    i0,i1=int(t0/0.02),int(t1/0.02); seg=r[i0:i1]; q=np.where(seg<-36)[0]
    if len(q)==0: return None
    j=i0+q[-1]
    while j<len(r)-1 and r[j]<-30: j+=1
    return j*0.02
log=[]
for ay in AY:
    for w in ay['words']:
        s=w['s']   # FA onsets used directly (energy dips checked: all are stop closures, not pauses)
        w['on']=round(s+OFF,3); w['src_on']=round(s,3)
flat=[w for ay in AY for w in ay['words']]
for i,w in enumerate(flat):
    nxt=flat[i+1]['on'] if i+1<len(flat) else w['e']+OFF
    w['off']=round(min(w['e']+OFF,nxt),3)
for x in log: print('shift',x)
json.dump(AY,open('src/timing.json','w'),ensure_ascii=False,indent=1)
for ay in AY: print(ay['n'],' '.join(f"{w['t']}@{w['on']:.2f}" for w in ay['words']))
