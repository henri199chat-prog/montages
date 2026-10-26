from faster_whisper import WhisperModel
import json, numpy as np, wave
m=WhisperModel("large-v3",device="cpu",compute_type="int8",cpu_threads=8)
w=wave.open("audio/voc16.wav"); sr=16000; aud=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
# windows cut at local RMS minima approx every 12-18 s
h=int(0.05*sr); rms=np.array([np.sqrt(np.mean(aud[i:i+h]**2)) for i in range(0,len(aud)-h,h)])
cuts=[0.0]; t=0
while t+18<len(aud)/sr:
    lo,hi=int((t+10)/0.05),int((t+18)/0.05); k=lo+int(np.argmin(rms[lo:hi])); t=k*0.05; cuts.append(t)
cuts.append(len(aud)/sr); print(cuts)
out=[]
for a,b in zip(cuts[:-1],cuts[1:]):
    seg=aud[int(a*sr):int(b*sr)]
    segs,_=m.transcribe(seg,language="ar",word_timestamps=True,beam_size=5,vad_filter=False,condition_on_previous_text=False)
    for s in segs:
        out.append({"start":s.start+a,"end":s.end+a,"text":s.text,"words":[{"w":w.word,"s":w.start+a,"e":w.end+a,"p":w.probability} for w in s.words]})
        print(f"{s.start+a:.2f}-{s.end+a:.2f} {s.text}",flush=True)
json.dump(out,open("src/whisper2.json","w"),ensure_ascii=False,indent=1)
print("DONE")
