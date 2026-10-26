from faster_whisper import WhisperModel
import numpy as np, wave
m=WhisperModel("large-v3",device="cpu",compute_type="int8",cpu_threads=8)
w=wave.open("audio/voc16.wav"); sr=16000; aud=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768
for a,b in [(9.0,20.3),(20.0,35.5),(35.0,50.2)]:
    segs,_=m.transcribe(aud[int(a*sr):int(b*sr)],language="ar",beam_size=5,vad_filter=False,condition_on_previous_text=False,initial_prompt="القرآن الكريم سورة التوبة")
    for s in segs: print(f"{s.start+a:.2f}-{s.end+a:.2f} {s.text}",flush=True)
print("DONE")
