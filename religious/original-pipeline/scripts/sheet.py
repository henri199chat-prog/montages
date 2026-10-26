import sys,glob
from PIL import Image, ImageDraw
fs=sorted(glob.glob(sys.argv[1])); cols=int(sys.argv[3]) if len(sys.argv)>3 else 6; W,H=360,640
rows=(len(fs)+cols-1)//cols; c=Image.new('RGB',(W*cols,H*rows))
for i,f in enumerate(fs):
    im=Image.open(f).convert('RGB').resize((W,H)); d=ImageDraw.Draw(im); d.text((6,4),f.split('_')[-1][:-4],fill=(255,255,0)); c.paste(im,((i%cols)*W,(i//cols)*H))
c.save(sys.argv[2],quality=88)
