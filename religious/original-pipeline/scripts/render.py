# python3 render.py chunk_idx n_chunks  -> render/chunk_XX.mkv
import sys, glob, os, subprocess, json, time
from playwright.sync_api import sync_playwright
EXE=glob.glob('/home/box/.cache/ms-playwright/chromium_headless_shell-1248/*/chrome-headless-shell')[0]
HERE=os.path.dirname(os.path.abspath(__file__)); FPS=30
meta=json.load(open(HERE+'/audio_meta.json')); N=int(round(meta['TOTAL']*FPS))
ci,nc=int(sys.argv[1]),int(sys.argv[2]); fmt=sys.argv[3] if len(sys.argv)>3 else 'png'
a=N*ci//nc; b=N*(ci+1)//nc
if len(sys.argv)>5: a,b=int(sys.argv[4]),int(sys.argv[5])
out=f'{HERE}/../render/chunk_{ci:02d}.mkv'
ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate',str(FPS),'-c:v','png' if fmt=='png' else 'mjpeg','-i','-',
  '-vf','scale=out_color_matrix=bt709:out_range=tv','-c:v','libx264','-preset','medium','-crf','8','-pix_fmt','yuv444p','-color_range','tv','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709',out],stdin=subprocess.PIPE)
with sync_playwright() as p:
    br=p.chromium.launch(executable_path=EXE,args=['--allow-file-access-from-files','--disable-web-security'])
    pg=br.new_page(viewport={'width':1080,'height':1920})
    errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+HERE+'/web/index.html'); pg.wait_for_function('window.__ready'); pg.evaluate('window.__ready')
    t0=time.time()
    for f in range(a,b):
        pg.evaluate(f'render({f/FPS})')
        ff.stdin.write(pg.screenshot(type=fmt,**({'quality':96} if fmt=='jpeg' else {})))
        if (f-a)%200==0: print(ci,f,round(time.time()-t0,1),flush=True)
    br.close()
ff.stdin.close(); ff.wait(); print('done',ci,a,b,round(time.time()-t0,1),errs[:5],flush=True)
