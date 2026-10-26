import sys, torch, soundfile as sf, numpy as np
from df.enhance import init_df, enhance
lim=float(sys.argv[3]) if len(sys.argv)>3 else None
model, st, _ = init_df()
a,sr=sf.read(sys.argv[1],dtype='float32'); assert sr==st.sr()
x=torch.from_numpy(a[None] if a.ndim==1 else a.T)
y=enhance(model,st,x,atten_lim_db=lim)
sf.write(sys.argv[2],y.numpy().T,sr,subtype='FLOAT')
