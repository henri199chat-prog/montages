# Original SFX synthesized with numpy (CC0). Writes 48k stereo wavs to syn/
import numpy as np, wave, os
SR=48000; OUT=os.environ.get('OUT','syn'); rng=np.random.default_rng(7)
os.makedirs(OUT, exist_ok=True)
def tt(d): return np.arange(int(d*SR))/SR
def fft_filt(x,lo=None,hi=None,order=2):
    X=np.fft.rfft(x); f=np.fft.rfftfreq(len(x),1/SR); H=np.ones_like(f)
    if hi: H/=np.sqrt(1+(f/hi)**(2*order))
    if lo: H/=np.sqrt(1+(lo/np.maximum(f,1e-3))**(2*order))
    return np.fft.irfft(X*H,len(x))
def svf_bp(x,fc,q=2.0):
    # time-varying state-variable bandpass
    y=np.zeros_like(x); lp=bp=0.0
    f=2*np.sin(np.pi*np.minimum(fc,SR/6)/SR); d=1/q
    for i in range(len(x)):
        hp=x[i]-lp-d*bp; bp+=f[i]*hp; lp+=f[i]*bp; y[i]=bp
    return y
def ir(rt,bright=6000,seed=1):
    r=np.random.default_rng(seed); n=int(rt*SR); t=np.arange(n)/SR
    out=[]
    for k in range(2):
        h=r.standard_normal(n)*np.exp(-6.9*t/rt); h=fft_filt(h,lo=150,hi=bright)
        h[:int(.01*SR)]*=np.linspace(0,1,int(.01*SR)); out.append(h/np.sqrt((h**2).sum()))
    return out
def conv(x,h):
    n=len(x)+len(h)-1; m=1<<(n-1).bit_length(); return np.fft.irfft(np.fft.rfft(x,m)*np.fft.rfft(h,m),m)[:n]
def verb(x,rt=1.2,wet=0.25,bright=6000):
    if x.ndim==1: x=np.stack([x,x])
    L,R=ir(rt,bright); wl=conv(x[0],L); wr=conv(x[1],R); n=len(wl)
    d=np.pad(x,((0,0),(0,n-x.shape[1])))
    return np.stack([d[0]*(1-wet)+wl*wet*3, d[1]*(1-wet)+wr*wet*3])
def pan(x,p):  # p array or scalar -1..1
    p=np.broadcast_to(p,x.shape); return np.stack([x*np.cos((p+1)*np.pi/4),x*np.sin((p+1)*np.pi/4)])*1.414
def fade(x,fi=0.003,fo=0.02):
    n=x.shape[-1]; a=int(fi*SR); b=int(fo*SR); e=np.ones(n)
    if a: e[:a]=np.linspace(0,1,a)
    if b: e[-b:]*=np.linspace(1,0,b)
    return x*e
def save(name,x):
    if x.ndim==1: x=np.stack([x,x])
    x=fade(x); x=x/np.abs(x).max()*0.89
    with wave.open(f'{OUT}/{name}.wav','wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x.T*32767).astype('<i2').tobytes())
def sine_sweep(f0,f1,d,curve='geom'):
    f=np.geomspace(f0,f1,int(d*SR)) if curve=='geom' else np.linspace(f0,f1,int(d*SR))
    return np.sin(2*np.pi*np.cumsum(f)/SR)
# ---- whooshes ----
def whoosh(d,f0,f1,peak=0.5,q=1.2,pan0=-.7,pan1=.7,rt=0.8,wet=.2,sub=0):
    n=int(d*SR); t=tt(d); u=t/d
    env=np.where(u<peak,(u/peak)**2,((1-u)/(1-peak))**1.6)
    fc=np.where(u<peak,f0+(f1-f0)*(u/peak),f1+(f0*0.6-f1)*((u-peak)/(1-peak)))
    x=svf_bp(rng.standard_normal(n),np.abs(fc),q)*env
    x+=0.4*fft_filt(rng.standard_normal(n),hi=900)*env
    if sub: x+=sub*np.sin(2*np.pi*np.cumsum(np.geomspace(90,45,n))/SR)*env
    return verb(pan(x/np.abs(x).max(),np.linspace(pan0,pan1,n)),rt,wet)
save('whoosh_soft_01',whoosh(0.7,400,2500,0.55,1.0))
save('whoosh_fast_02',whoosh(0.32,800,5000,0.6,1.4,-.9,.9,0.5,.12))
save('whoosh_deep_03',whoosh(1.2,150,1200,0.6,0.9,-.4,.4,1.2,.25,sub=0.5))
save('whoosh_long_04',whoosh(1.9,300,3500,0.62,1.1,-1,1,1.4,.3))
save('whoosh_reverse_05',whoosh(0.9,300,4000,0.92,1.0,0,0,1.0,.2))
# ---- swipe ui ----
save('swipe_ui_01',whoosh(0.18,2000,7000,0.4,1.8,.5,-.5,0.3,.1))
# ---- pops ----
def pop(f0=600,f1=180,d=0.09,noise=0.15):
    t=tt(d); x=sine_sweep(f0,f1,d)*np.exp(-t/0.025)+noise*fft_filt(rng.standard_normal(len(t)),lo=2000)*np.exp(-t/0.003)
    return verb(x,0.3,0.08)
save('pop_01',pop()); save('pop_high_02',pop(1400,500,0.07)); save('pop_bubble_03',pop(300,900,0.12,0.05))
# ---- clicks/ticks/beeps ----
t=tt(0.04); save('tick_soft_01',verb(fft_filt(rng.standard_normal(len(t)),lo=3000,hi=9000)*np.exp(-t/0.002)+0.5*np.sin(2*np.pi*4800*t)*np.exp(-t/0.004),0.4,0.1))
def bleep(f,d=0.14,f2=None):
    t=tt(d); fr=np.linspace(f,f2 or f,len(t)); x=(np.sin(2*np.pi*np.cumsum(fr)/SR)+0.2*np.sin(4*np.pi*np.cumsum(fr)/SR))*np.clip(t/0.004,0,1)*np.exp(-t/(d/3))
    return x
save('beep_hud_01',verb(bleep(1500,0.16,1750),0.9,0.25))
save('beep_hud_double_02',verb(np.concatenate([bleep(1800,0.07),np.zeros(int(.04*SR)),bleep(2400,0.09)]),0.8,0.2))
save('beep_data_03',verb(np.concatenate([bleep(f,0.035) for f in rng.choice([1200,1600,2000,2400,2800],9)]),0.6,0.15))
# ---- scan / counter roll ----
d=1.2; t=tt(d); x=svf_bp(rng.standard_normal(len(t)),np.geomspace(500,5000,len(t)),3)*np.sin(np.pi*t/d)**1.5+0.15*sine_sweep(300,1200,d)*np.sin(np.pi*t/d)
save('scan_hud_01',verb(pan(x,np.linspace(-.6,.6,len(t))),1.0,.25))
out=np.zeros(int(1.6*SR))
for k in range(24):
    u=k/24; i=int((1-(1-u)**2)*1.5*SR); tk=tt(0.03); s=fft_filt(rng.standard_normal(len(tk)),lo=3500,hi=9000)*np.exp(-tk/0.0025)+0.6*np.sin(2*np.pi*5200*tk)*np.exp(-tk/0.004)
    out[i:i+len(s)]+=s*(0.6+0.4*rng.random())
save('counter_roll_01',verb(out,0.5,.1))
# ---- impacts ----
def boom(d=2.5,f0=110,f1=38,dec=0.6):
    t=tt(d); x=sine_sweep(f0,f1,d)*np.exp(-t/dec)+0.5*fft_filt(rng.standard_normal(len(t)),hi=300)*np.exp(-t/0.25)+0.3*fft_filt(rng.standard_normal(len(t)),lo=1500)*np.exp(-t/0.02)
    return verb(x,2.0,0.3,3000)
save('boom_cinematic_01',boom()); save('boom_sub_02',boom(1.8,70,32,0.5))
t=tt(1.0); save('thud_soft_01',verb(sine_sweep(95,45,1.0)*np.exp(-t/0.2)+0.3*fft_filt(rng.standard_normal(len(t)),hi=500)*np.exp(-t/0.04),0.8,0.15))
t=tt(1.4); hit=sine_sweep(160,45,1.4)*np.exp(-t/0.35)+0.8*fft_filt(rng.standard_normal(len(t)),lo=800,hi=8000)*np.exp(-t/0.05)+0.4*fft_filt(rng.standard_normal(len(t)),hi=200)*np.exp(-t/0.3)
save('hit_trailer_01',verb(hit,1.8,.3,5000))
# ---- risers / downlifters ----
def riser(d=2.5,f0=300,f1=7000,tone=0.3,p=2.2):
    t=tt(d); u=t/d; x=svf_bp(rng.standard_normal(len(t)),np.geomspace(f0,f1,len(t)),1.5)*u**p
    x+=tone*(sine_sweep(f0/2,f1/8,d)+0.5*sine_sweep(f0/2*1.5,f1/8*1.5,d))*u**p
    y=verb(x,1.5,.3); return y
save('riser_noise_01',riser(2.0,400,8000,0.1))
save('riser_tonal_02',riser(3.0,200,4000,0.6,1.8))
t=tt(2.6); u=t/2.6; x=fft_filt(rng.standard_normal(len(t)),hi=900)*u**2*0.6+0.7*sine_sweep(45,95,2.6)*u**1.5
save('riser_dark_03',verb(x,2.4,.35,3000))
def downl(d=1.6,f0=6000,f1=200,sub=0.0):
    t=tt(d); u=t/d; e=(1-u)**1.8*np.clip(t/0.01,0,1)
    x=svf_bp(rng.standard_normal(len(t)),np.geomspace(f0,f1,len(t)),1.3)*e+sub*sine_sweep(120,30,d)*e
    return verb(x,1.6,.3)
save('downlifter_01',downl()); save('downlifter_sub_02',downl(2.2,3000,100,0.9))
# ---- shimmer / sparkle / chimes (textures, no melody) ----
def bell(f0,parts,decs,amps,d):
    t=tt(d); y=np.zeros_like(t)
    for p,dc,a in zip(parts,decs,amps): y+=a*np.sin(2*np.pi*f0*p*t+rng.uniform(0,6))*np.exp(-t/dc)
    return y*np.clip(t/0.003,0,1)
out=np.zeros(int(2.4*SR))
for k in range(28):
    i=int(rng.uniform(0,1.4)*SR); f=rng.uniform(3000,9000); b=bell(f,[1,2.3],[0.25,0.1],[1,.3],0.6)*(0.3+0.7*rng.random())
    out[i:i+len(b)]+=b
save('shimmer_01',verb(pan(out,np.sin(np.linspace(0,6,len(out)))*.6),2.0,.45,9000))
out=np.zeros(int(1.4*SR))
for k in range(12):
    i=int((k/12)**0.7*0.5*SR); b=bell(rng.uniform(4000,10000),[1,2.7],[0.12,0.05],[1,.2],0.4)*(1-k/14); out[i:i+len(b)]+=b
save('sparkle_02',verb(out,1.2,.35,10000))
save('chime_soft_01',verb(bell(1046.5,[1,2.0,2.76,4.07,5.4],[2.2,1.4,0.9,0.5,0.3],[1,.35,.45,.2,.12],4.0),3.0,.4,7000))
save('chime_high_02',verb(bell(1568,[1,2.76,5.4],[0.9,0.4,0.2],[1,.35,.15],2.0),2.2,.38,8000))
t=tt(6.0); f=110*(1+0.012*np.exp(-t/0.4)); parts=[1,1.47,2.09,2.56,3.22,4.08]; decs=[5,4,3.2,2.4,1.6,1.0]; amps=[1,.6,.5,.35,.25,.15]
g=sum(a*np.sin(2*np.pi*np.cumsum(f*p)/SR+rng.uniform(0,6))*np.exp(-t/dc) for p,dc,a in zip(parts,decs,amps))*np.clip(t/0.012,0,1)+0.5*np.sin(2*np.pi*55*t)*np.exp(-t/0.25)
save('gong_soft_01',verb(g,4.0,.4,5000))
t=tt(0.9); save('ding_notify_01',verb(bell(1318.5,[1,2.0,3.0],[0.5,0.25,0.12],[1,.3,.1],0.9)+0.7*np.concatenate([np.zeros(int(.09*SR)),bell(1760,[1,2.0],[0.5,0.2],[1,.3],0.81)]),1.0,.25))
# ---- glitch ----
def glitch(d=0.5):
    n=int(d*SR); x=np.zeros(n); i=0
    while i<n:
        L=int(rng.uniform(0.008,0.05)*SR); k=rng.integers(4)
        tk=np.arange(L)/SR
        if k==0: s=np.sign(np.sin(2*np.pi*rng.uniform(80,2000)*tk))
        elif k==1: s=rng.standard_normal(L)
        elif k==2: s=np.round(np.sin(2*np.pi*rng.uniform(200,900)*tk)*3)/3
        else: s=np.zeros(L)
        x[i:i+L]=s[:max(0,min(L,n-i))]*rng.uniform(.3,1); i+=L
    return pan(x,np.repeat(rng.uniform(-.6,.6,n//2400+1),2400)[:n])
save('glitch_digital_01',glitch(0.45)); save('glitch_short_02',glitch(0.18))
# ---- shutter ----
t=tt(0.25); c=lambda: fft_filt(rng.standard_normal(int(.03*SR)),lo=1500,hi=9000)*np.exp(-np.arange(int(.03*SR))/SR/0.004)
x=np.zeros(len(t)); x[:len(c())]+=c(); j=int(.07*SR); x[j:j+int(.03*SR)]+=0.7*c()
save('shutter_synth_01',verb(x,0.4,.1))
# ---- heartbeat ----
def lub(f=55,d=0.18,a=1): t=tt(d); return a*np.sin(2*np.pi*np.cumsum(np.geomspace(f*1.4,f,len(t)))/SR)*np.exp(-t/0.05)*np.clip(t/0.004,0,1)
out=np.zeros(int(4.0*SR))
for b in range(4):
    i=int(b*1.0*SR); out[i:i+len(lub())]+=lub(); j=i+int(.26*SR); out[j:j+len(lub())]+=lub(48,a=.7)
save('heartbeat_synth_loop_60bpm',fft_filt(out,hi=200))
# ---- drones / pads (no melody: sustained static tones only) ----
def drone(d,freqs,amps,lfo=0.07,noise=0.08,hi=2000,seed=0):
    r=np.random.default_rng(seed); t=tt(d); L=np.zeros_like(t); R=np.zeros_like(t)
    for f,a in zip(freqs,amps):
        for det in (-0.6,0,0.6):
            ph=r.uniform(0,6); m=1+0.3*np.sin(2*np.pi*lfo*r.uniform(.5,1.5)*t+ph)
            s=a*m*np.sin(2*np.pi*(f+det)*t+r.uniform(0,6)); p=r.uniform(-.5,.5)
            L+=s*np.cos((p+1)*np.pi/4); R+=s*np.sin((p+1)*np.pi/4)
    nz=fft_filt(r.standard_normal(len(t)),lo=200,hi=hi)*noise
    x=np.stack([fft_filt(L,hi=hi)+nz,fft_filt(R,hi=hi)+np.roll(nz,999)])
    # seamless loop: crossfade tail into head
    cf=int(2*SR); w=np.linspace(0,1,cf)
    x[:,:cf]=x[:,:cf]*w+x[:,-cf:]*(1-w); x=x[:,:-cf]
    return x
def save_loop(name,x):
    x=x/np.abs(x).max()*0.89
    with wave.open(f'{OUT}/{name}.wav','wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x.T*32767).astype('<i2').tobytes())
save_loop('drone_calm_low_loop',drone(22,[55,110,165,220],[1,.5,.2,.12],hi=1200,seed=1))
save_loop('drone_warm_pad_loop',drone(22,[130.81,196.0,261.63,392.0],[.8,.6,.4,.2],lfo=.05,hi=2500,seed=2))
save_loop('drone_dark_space_loop',drone(22,[41.2,61.7,82.4,123.5],[1,.6,.4,.2],lfo=.04,noise=.15,hi=900,seed=3))
save_loop('drone_air_texture_loop',drone(22,[220,330,440],[.15,.1,.08],lfo=.03,noise=.6,hi=5000,seed=4))
t=tt(5.0); u=t/5; sw=drone(7,[110,165,220,330],[1,.6,.4,.2],hi=3000,seed=5)[:, :len(t)]*np.minimum(u/0.6,1)**2*np.minimum((1-u)/0.4,1)
save('swell_reveal_01',verb(sw,2.5,.3))
print('done',len(os.listdir(OUT)))
