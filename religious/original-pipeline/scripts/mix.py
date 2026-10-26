# reverb (synthetic stereo hall IR, subtle) + low drone bed + master gain; limiter done by ffmpeg afterwards
import numpy as np, soundfile as sf, scipy.signal as ss, json
SR=48000; OFF=3.0            # voice starts at 3.0 s (after logo + page-name intro)
TOTAL=float(open('src/total.txt').read()) if False else None
v,sr=sf.read('audio/voc_eq.wav'); assert sr==SR
# trim: voice end = last frame above -45 dBFS + 0.6 s
h=int(0.02*SR); r=np.array([np.sqrt(np.mean(v[i:i+h]**2)) for i in range(0,len(v)-h,h)])
act=np.where(20*np.log10(r+1e-9)>-45)[0]; vend=min(len(v),(act[-1]+1)*h+int(0.6*SR))
v=v[:vend]; fo=int(0.25*SR); v[-fo:]*=np.cos(np.linspace(0,np.pi/2,fo))**2
fi=int(0.01*SR); v[:fi]*=np.linspace(0,1,fi)
print('voice dur',len(v)/SR)
rng=np.random.default_rng(7)
def ir(seed,rt=1.6,pre=0.022):
    g=np.random.default_rng(seed); n=int(rt*1.3*SR); t=np.arange(n)/SR
    x=g.standard_normal(n)*np.exp(-6.91*t/rt)
    # frequency-dependent damping: progressively low-passed tail
    b,a=ss.butter(2,5200/(SR/2)); x1=ss.lfilter(b,a,x); b,a=ss.butter(2,1800/(SR/2)); x2=ss.lfilter(b,a,x)
    w=np.clip(t/rt,0,1); x=x1*(1-w)+x2*w
    b,a=ss.butter(2,220/(SR/2),'high'); x=ss.lfilter(b,a,x)
    x*=np.clip(t/0.04,0,1)            # soft onset
    out=np.concatenate([np.zeros(int(pre*SR)),x]); return out/np.sqrt(np.sum(out**2))
irL,irR=ir(1),ir(2)
wetL=ss.fftconvolve(v,irL)[:len(v)+int(1.8*SR)]; wetR=ss.fftconvolve(v,irR)[:len(v)+int(1.8*SR)]
WET=10**(-17/20)                      # subtle: wet ~17 dB under dry
n=len(wetL); dry=np.zeros(n); dry[:len(v)]=v
L=dry+WET*wetL; R=dry+WET*wetR
voice=np.stack([L,R],1)
VDUR=n/SR
TOTAL=round(OFF+len(v)/SR+4.8,2)      # outro hold after the last word
json.dump({'OFF':OFF,'voice_len':len(v)/SR,'TOTAL':TOTAL},open('src/audio_meta.json','w'))
N=int(TOTAL*SR); mix=np.zeros((N,2)); s0=int(OFF*SR); mix[s0:s0+n]+=voice[:N-s0]
sf.write('audio/voice_fx.wav',mix,SR,subtype='FLOAT')
# drone bed: D2/A2/D3 soft partials, slow breathing LFO, low-passed, stereo detune
t=np.arange(N)/SR; d=np.zeros((N,2))
for f,amp in [(73.42,1.0),(110.0,0.55),(146.83,0.35),(220.0,0.12)]:
    for ch,det in [(0,-0.15),(1,0.15)]:
        ph=rng.uniform(0,6.28)
        d[:,ch]+=amp*np.sin(2*np.pi*(f+det)*t+ph)*(0.75+0.25*np.sin(2*np.pi*t/(9.0+f/40)+ph))
noise=rng.standard_normal((N,2)); b,a=ss.butter(2,[60/(SR/2),300/(SR/2)],'band'); noise=ss.lfilter(b,a,noise,axis=0)
d+=noise*0.08
b,a=ss.butter(2,420/(SR/2)); d=ss.lfilter(b,a,d,axis=0)
env=np.clip(t/2.0,0,1)*np.clip((TOTAL-t)/2.5,0,1); env=env**1.5
d*=env[:,None]
rms=np.sqrt(np.mean(d[int(3*SR):int((TOTAL-3)*SR)]**2)); d*=10**(-35/20)/rms   # bed ~ -35 dBFS RMS
sf.write('audio/drone.wav',d,SR,subtype='FLOAT')
print('TOTAL',TOTAL)
