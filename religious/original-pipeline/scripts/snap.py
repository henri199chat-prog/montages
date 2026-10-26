# snapshot frames: python3 snap.py out_prefix t1 t2 ...
import sys, glob, os
from playwright.sync_api import sync_playwright
EXE=glob.glob('/home/box/.cache/ms-playwright/chromium_headless_shell-1248/*/chrome-headless-shell')[0]
HERE=os.path.dirname(os.path.abspath(__file__))
with sync_playwright() as p:
    b=p.chromium.launch(executable_path=EXE,args=['--allow-file-access-from-files','--disable-web-security'])
    pg=b.new_page(viewport={'width':1080,'height':1920})
    msgs=[]; pg.on('console',lambda m:msgs.append(m.text)); pg.on('pageerror',lambda e:msgs.append('ERR '+str(e)))
    pg.goto('file://'+HERE+'/web/index.html'); pg.wait_for_function('window.__ready'); pg.evaluate('window.__ready')
    for t in sys.argv[2:]:
        pg.evaluate(f'render({float(t)})'); pg.screenshot(path=f'{sys.argv[1]}_{float(t):06.2f}.png')
    b.close(); print('\n'.join(msgs[:20]))
