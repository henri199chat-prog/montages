// Ayman reel 002 — At-Tawbah 9:102-104. Pure function of time: window.render(t).
'use strict';
const svg=document.getElementById('svg');
const defs=el('defs',{},svg);
defs.innerHTML=`
<linearGradient id="wmg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1920"><stop offset="0" stop-color="#fff"/><stop offset="0.615" stop-color="#fff"/><stop offset="0.665" stop-color="#000"/></linearGradient>
<mask id="worldMask" maskUnits="userSpaceOnUse" x="-10" y="-10" width="1100" height="1940"><rect x="-10" y="-10" width="1100" height="1940" fill="url(#wmg)"/></mask>
<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6E2A6" stop-opacity=".55"/><stop offset=".55" stop-color="#E3CC8F" stop-opacity=".16"/><stop offset="1" stop-color="#E3CC8F" stop-opacity=".02"/></linearGradient>
<radialGradient id="ell"><stop offset="0" stop-color="#F6E2A6" stop-opacity=".95"/><stop offset=".45" stop-color="#E3CC8F" stop-opacity=".42"/><stop offset="1" stop-color="#E3CC8F" stop-opacity="0"/></radialGradient>
<radialGradient id="halo"><stop offset="0" stop-color="#E3CC8F" stop-opacity=".30"/><stop offset=".45" stop-color="#E3CC8F" stop-opacity=".09"/><stop offset="1" stop-color="#E3CC8F" stop-opacity="0"/></radialGradient>
<radialGradient id="haloW"><stop offset="0" stop-color="#FFF3D2" stop-opacity=".55"/><stop offset=".35" stop-color="#E3CC8F" stop-opacity=".2"/><stop offset="1" stop-color="#E3CC8F" stop-opacity="0"/></radialGradient>
<radialGradient id="skyG" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#2A4E66" stop-opacity=".55"/><stop offset=".6" stop-color="#1C3A52" stop-opacity=".15"/><stop offset="1" stop-color="#152E43" stop-opacity="0"/></radialGradient>
<radialGradient id="warmG" cx=".5" cy=".1" r=".9"><stop offset="0" stop-color="#E3CC8F" stop-opacity=".22"/><stop offset=".5" stop-color="#B09F75" stop-opacity=".06"/><stop offset="1" stop-color="#B09F75" stop-opacity="0"/></radialGradient>
<radialGradient id="chest"><stop offset="0" stop-color="#FFF0C4" stop-opacity="1"/><stop offset=".3" stop-color="#E3CC8F" stop-opacity=".55"/><stop offset="1" stop-color="#E3CC8F" stop-opacity="0"/></radialGradient>
<radialGradient id="stone" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#26303A"/><stop offset=".7" stop-color="#0B1117"/><stop offset="1" stop-color="#05090D"/></radialGradient>
<radialGradient id="coralG"><stop offset="0" stop-color="#E66A65" stop-opacity=".45"/><stop offset="1" stop-color="#E66A65" stop-opacity="0"/></radialGradient>
<radialGradient id="coin" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#FFF4D0"/><stop offset=".6" stop-color="#E3CC8F"/><stop offset="1" stop-color="#B09F75"/></radialGradient>
<linearGradient id="door" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFEFC2"/><stop offset="1" stop-color="#E9C87E"/></linearGradient>
<linearGradient id="archFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3CC8F" stop-opacity=".16"/><stop offset="1" stop-color="#E3CC8F" stop-opacity=".02"/></linearGradient>
<linearGradient id="ray" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F3DFA6" stop-opacity=".45"/><stop offset=".6" stop-color="#E3CC8F" stop-opacity=".12"/><stop offset="1" stop-color="#E3CC8F" stop-opacity="0"/></linearGradient>
<linearGradient id="floorG" gradientUnits="userSpaceOnUse" x1="-200" y1="0" x2="1280" y2="0"><stop offset="0" stop-color="#B09F75" stop-opacity="0"/><stop offset=".3" stop-color="#B09F75" stop-opacity=".65"/><stop offset=".7" stop-color="#B09F75" stop-opacity=".65"/><stop offset="1" stop-color="#B09F75" stop-opacity="0"/></linearGradient>
<linearGradient id="groundG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07101A" stop-opacity=".55"/><stop offset="1" stop-color="#07101A" stop-opacity="0"/></linearGradient>
<linearGradient id="hillG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#173349"/><stop offset="1" stop-color="#0C1B27"/></linearGradient>
<linearGradient id="hillG2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#11273A"/><stop offset="1" stop-color="#0A141D"/></linearGradient>
<linearGradient id="veil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3DFA6" stop-opacity=".30"/><stop offset="1" stop-color="#E3CC8F" stop-opacity=".04"/></linearGradient>
<linearGradient id="scan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3D2" stop-opacity="0"/><stop offset=".5" stop-color="#FFF3D2" stop-opacity=".55"/><stop offset="1" stop-color="#FFF3D2" stop-opacity="0"/></linearGradient>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="glow2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="blur6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="blur12" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="12"/></filter>
<filter id="blur20" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="20"/></filter>
<filter id="blur40" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="40"/></filter>`;

// ---------- HUD ----------
const hud=el('g',{id:'hud'},svg);
const M=40,BL=46;
[[M,M,1,1],[1080-M,M,-1,1],[M,1920-M,1,-1],[1080-M,1920-M,-1,-1]].forEach(([x,y,sx,sy])=>el('path',{d:`M${x},${y+sy*BL} L${x},${y} L${x+sx*BL},${y}`,fill:'none',stroke:C.mgold,'stroke-width':1.6,'stroke-opacity':.55},hud));
el('line',{x1:78,y1:138,x2:1002,y2:138,stroke:C.mgold,'stroke-width':1,'stroke-opacity':.35},hud);
el('line',{x1:78,y1:1800,x2:1002,y2:1800,stroke:C.mgold,'stroke-width':1,'stroke-opacity':.35},hud);
const figLbl=el('text',{x:78,y:178,'font-family':'PlexMono','font-size':15,'letter-spacing':'4',fill:C.teal,'fill-opacity':.8,direction:'ltr'},hud);
const LBL=['FIG.01 — CONFESSION','FIG.02 — HOPE · MERCY','FIG.03 — PURIFICATION','FIG.04 — SAKINAH','FIG.05 — ACCEPTANCE','FIG.06 — AT-TAWWAB'];
// progress ticks under the header hairline (one per page)
const ticks=[0,1,2,3,4,5].map(i=>el('rect',{x:1002-6*34+i*34,y:150,width:26,height:2,fill:C.mgold},hud));

// ---------- world: parallax layers under a screen-space mask (keeps light away from the ayah text) ----------
const worldM=el('g',{mask:'url(#worldMask)'},svg);
const LAY={}; [['sky',.22],['far',.5],['mid',1],['front',1.12]].forEach(([k,f])=>{LAY[k]={g:el('g',{},worldM),f}});
const L={sky:LAY.sky.g, far:LAY.far.g, back:el('g',{},LAY.mid.g), light:el('g',{},LAY.mid.g), props:el('g',{},LAY.mid.g), figs:el('g',{},LAY.mid.g), fglow:el('g',{},LAY.mid.g), front:LAY.front.g};
let CAM={s:1,x:540,y:960};
const camT=f=>{const s=1+(CAM.s-1)*f, x=540+(CAM.x-540)*f, y=960+(CAM.y-960)*f; return {s,x,y,str:`translate(540,960) scale(${s.toFixed(4)}) translate(${(-x).toFixed(2)},${(-y).toFixed(2)})`}};

// ---------- scenery ----------
const skyGlow=el('rect',{x:-400,y:-300,width:1880,height:1500,fill:'url(#skyG)'},L.sky);
const warmGlow=el('rect',{x:-400,y:-300,width:1880,height:1600,fill:'url(#warmG)',opacity:0},L.sky);
function Moon(parent){const g=el('g',{},parent);const halo=el('circle',{fill:'url(#halo)'},g);const halo2=el('circle',{fill:'url(#haloW)'},g);
  const m=el('path',{fill:'#F4E6BE',filter:'url(#glow)'},g);
  return {g,set(x,y,r,op,glow=1){sa(g,{opacity:f2(op)});sa(halo,{cx:x,cy:y,r:r*6});sa(halo2,{cx:x,cy:y,r:r*2.2,opacity:f2(.5*glow)});
    sa(m,{d:`M${x+r*.3},${y-r} A${r},${r} 0 1 0 ${x+r*.3},${y+r} A${r*.8},${r*.86} 0 1 1 ${x+r*.3},${y-r} Z`})}}}
const moon=Moon(L.sky);
// far hills (two depths) with a faint gold rim
const hillFar=el('path',{fill:'url(#hillG)',opacity:.55},L.far), hillFarRim=el('path',{fill:'none',stroke:C.mgold,'stroke-width':1.2,'stroke-opacity':.16},L.far);
function hillD(y0,amp,seed,x0=-500,x1=1580){let d=`M${x0},${y0+300} L${x0},${y0}`;for(let x=x0;x<=x1;x+=20){const y=y0-amp*(0.5+0.5*Math.sin(x/260+seed))*(0.6+0.4*Math.sin(x/97+seed*2));d+=` L${x},${y.toFixed(1)}`}return d+` L${x1},${y0+300} Z`}
const hFD=hillD(1080,70,1.3); sa(hillFar,{d:hFD}); sa(hillFarRim,{d:hFD.replace(/ L1580,1380 Z$/,'').replace(/^M-500,1380 L/,'M')});
const farDoor={g:el('g',{},L.far)}; // distant glowing door (hope) in far layer
(function(){const g=farDoor.g; farDoor.glow=el('path',{fill:'#E3CC8F',filter:'url(#blur20)'},g); farDoor.body=el('path',{fill:'url(#door)'},g); farDoor.frame=el('path',{fill:'none',stroke:C.gold,'stroke-width':1.6},g); farDoor.spill=el('ellipse',{fill:'url(#ell)'},g)})();
farDoor.set=(x,base,w,h,op,lum)=>{sa(farDoor.g,{opacity:f2(op)});const d=archD(x,base,w,h)+' Z';sa(farDoor.glow,{d:archD(x,base,w,h,8)+' Z',opacity:f2(.6*lum)});sa(farDoor.body,{d,opacity:f2(.2+.8*lum)});sa(farDoor.frame,{d:archD(x,base,w,h,6)});sa(farDoor.spill,{cx:x,cy:base+3,rx:w*1.8,ry:12,opacity:f2(.7*lum)})};
const hillNear=el('path',{fill:'url(#hillG2)',opacity:.8},L.back); sa(hillNear,{d:hillD(FLOOR-8,46,4.1)});
const ground=el('rect',{x:-500,y:FLOOR,width:2080,height:260,fill:'url(#groundG)'},L.back);
const floor=el('line',{x1:-200,y1:FLOOR,x2:1280,y2:FLOOR,stroke:'url(#floorG)','stroke-width':1.6},L.props);

// ---------- light objects ----------
function Beam(parent){const g=el('g',{},parent);const p=el('path',{fill:'url(#beam)',filter:'url(#blur12)'},g);const core=el('path',{fill:'url(#beam)',opacity:.6,filter:'url(#blur6)'},g);
  return {g,set(x,top,bot,w0,w1,op){sa(g,{opacity:f2(op)});if(op<=0.002)return;sa(p,{d:`M${x-w0},${top} L${x+w0},${top} L${x+w1},${bot} L${x-w1},${bot} Z`});sa(core,{d:`M${x-w0*.35},${top} L${x+w0*.35},${top} L${x+w1*.4},${bot} L${x-w1*.4},${bot} Z`})}}}
function Rays(parent,n=18){const g=el('g',{},parent);const r=[];for(let i=0;i<n;i++)r.push(el('polygon',{fill:'url(#ray)'},g));
  return {g,set(x,y,op,len,rot,spread=360,base=-90){sa(g,{opacity:f2(op)});if(op<=0.002)return;sa(g,{transform:`translate(${f2(x)},${f2(y)})`});
    r.forEach((p,i)=>{const w=len*(0.03+0.03*hash(i,3)); const l=len*(0.6+0.4*hash(i,5));
      const a=base-spread/2+spread*(i+0.5)/n+rot+7*Math.sin(rot*0.03+i*1.3);
      sa(p,{points:`0,0 ${f2(l)},${f2(-w)} ${f2(l)},${f2(w)}`,transform:`rotate(${f2(a)})`})})}}}
function Spot(parent){const g=el('g',{},parent);const ellG=el('ellipse',{fill:'url(#ell)'},g);const ring=el('ellipse',{fill:'none',stroke:C.gold,'stroke-width':2},g);
  return {g,set(x,y,op,w=150){sa(g,{opacity:f2(op)});sa(ellG,{cx:x,cy:y,rx:w*1.05,ry:w*0.15});sa(ring,{cx:x,cy:y,rx:w*.62,ry:w*.09,'stroke-opacity':.6})}}}
function Halo(parent,fill='url(#halo)'){const c=el('circle',{fill},parent);return {set(x,y,r,op){sa(c,{cx:f2(x),cy:f2(y),r:f2(r),opacity:f2(op)})}}}

const beamTop=Beam(L.light), raysTop=Rays(L.light,26), raysArch=Rays(L.light,30);
const heroHalo=Halo(L.light,'url(#haloW)'), bigHalo=Halo(L.light,'url(#halo)');
const spot=Spot(L.light);
// hero shadow (guilt / fear) – big blurred dark copy
const shadowFig=new Fig(L.back,{color:'#03070B',w:24,filter:'url(#blur6)'});

// ---------- figures ----------
const others=[0,1,2,3,4].map(()=>new Fig(L.back,{color:'#7E8D96',w:10}));
const crowdBack=[0,1,2,3,4].map(()=>new Fig(L.back,{color:'#9AA6AC',w:10}));
const crowdFront=[0,1,2,3].map(()=>new Fig(L.figs,{color:'#DCE1DB',w:11}));
const mates=[0,1].map(()=>new Fig(L.figs,{color:'#DCE1DB',w:11}));
const heroAura=new Fig(L.figs,{color:C.gold,w:11,filter:'url(#blur12)'});
const hero=new Fig(L.figs,{w:11});
const chestGlow=el('circle',{fill:'url(#chest)'},L.fglow);

// ---------- S1: sins (dark stones) + good/bad deeds braid ----------
const stones=[0,1,2,3].map(i=>{const g=el('g',{},L.back);const glow=el('circle',{fill:'url(#coralG)'},g);
  const a=el('g',{},g);const b=el('g',{},g);
  const mk=(par,clip)=>{const q=el('g',{'clip-path':`url(#${clip})`},par);el('circle',{r:1,fill:'url(#stone)'},q);el('circle',{r:1,fill:'none',stroke:C.coral,'stroke-width':.06,'stroke-opacity':.75},q);return q};
  const ha=mk(a,'halfL'), hb=mk(b,'halfR'); return {g,glow,a,b}});
(function(){const l=el('clipPath',{id:'halfL',clipPathUnits:'userSpaceOnUse'},defs), r=el('clipPath',{id:'halfR',clipPathUnits:'userSpaceOnUse'},defs);
  el('path',{d:'M-2,-2 L0.08,-2 L-0.1,-0.4 L0.12,0.1 L-0.06,0.5 L0.05,2 L-2,2 Z'},l); el('path',{d:'M2,-2 L0.08,-2 L-0.1,-0.4 L0.12,0.1 L-0.06,0.5 L0.05,2 L2,2 Z'},r);})();
const orbGood=el('g',{},L.fglow), orbBad=el('g',{},L.fglow);
el('circle',{r:46,fill:'url(#halo)'},orbGood); el('circle',{r:13,fill:'#FFF0C4',filter:'url(#glow)'},orbGood);
el('circle',{r:40,fill:'url(#coralG)',opacity:.6},orbBad); el('circle',{r:13,fill:'url(#stone)',stroke:C.coral,'stroke-width':1.5,'stroke-opacity':.8},orbBad);
const braidG=Path(L.fglow,{stroke:C.gold,'stroke-width':3.2,filter:'url(#glow2)'}), braidB=Path(L.fglow,{stroke:'#8E4F52','stroke-width':3});
const braidG2=Path(L.fglow,{stroke:C.gold,'stroke-width':1.4,'stroke-opacity':.6}), braidB2=Path(L.fglow,{stroke:C.coral,'stroke-width':1.2,'stroke-opacity':.35});

// ---------- S2: veil (ghafur = covering), ripples (rahim) ----------
const veil=el('path',{fill:'url(#veil)'},L.fglow); const veilLine=Path(L.fglow,{stroke:C.gold,'stroke-width':2.2,filter:'url(#glow2)'});
const ripples=[0,1,2,3].map(()=>Path(L.light,{stroke:C.gold,'stroke-width':1.8}));

// ---------- S3: coins, purifying scan, tree (tazkiya = growth) ----------
const coins=[0,1,2,3,4].map(()=>{const g=el('g',{},L.fglow);const h=el('circle',{r:30,fill:'url(#halo)'},g);const c=el('ellipse',{rx:14,ry:14,fill:'url(#coin)',stroke:'#FFF4D0','stroke-width':1.2},g);const i=el('ellipse',{rx:8,ry:8,fill:'none',stroke:C.mgold,'stroke-width':1.4},g);const tr=Path(L.fglow,{stroke:C.gold,'stroke-width':1.4,'stroke-opacity':.55});return {g,c,i,tr}});
const scan=el('rect',{x:0,y:0,width:10,height:10,fill:'url(#scan)',opacity:0,filter:'url(#blur6)'},L.fglow);
const tree={g:el('g',{},L.props),br:[],lv:[]};
(function(){ // deterministic branching tree rooted at (0,0), grows upward
  const segs=[]; function rec(x,y,a,len,d,k){const x2=x+Math.sin(rad(a))*len, y2=y-Math.cos(rad(a))*len; segs.push({x,y,x2,y2,d,k});
    if(d<4){const n=d<1?2:2; for(let j=0;j<n;j++){const sp=(j?1:-1)*(22+10*hash(k*7+j,2)); rec(x2,y2,a+sp+(hash(k,3)-.5)*10,len*(0.72+0.08*hash(k+j,4)),d+1,k*3+j+1)}}
    else {tree.lv.push({x:x2,y:y2,d,k})}}
  rec(0,0,0,120,0,1);
  segs.forEach(s=>{const p=Path(tree.g,{stroke:C.mgold,'stroke-width':Math.max(1.4,6-s.d*1.2)}); p.setD(`M${s.x.toFixed(1)},${s.y.toFixed(1)} L${s.x2.toFixed(1)},${s.y2.toFixed(1)}`); tree.br.push({p,d:s.d})});
  tree.lv=tree.lv.map(l=>({l,e:el('ellipse',{rx:9,ry:5,fill:C.gold,filter:'url(#glow2)'},tree.g)}));
})();

// ---------- S4: mihrab canopy, calm water ripples, sound arcs, octagram (knowledge) ----------
const archC=Path(L.props,{stroke:C.gold,'stroke-width':2.2}), archC2=Path(L.props,{stroke:C.mgold,'stroke-width':1.1,'stroke-dasharray':'2 9'});
const archFill=el('path',{fill:'url(#archFill)',opacity:0},L.light);
const lamp={g:el('g',{},L.props)}; lamp.ch=el('line',{stroke:C.mgold,'stroke-width':1.2},lamp.g); lamp.h=el('circle',{r:60,fill:'url(#halo)'},lamp.g); lamp.b=el('path',{fill:'#F3DFA6',filter:'url(#glow)'},lamp.g);
const water=[0,1,2,3,4].map(()=>Path(L.props,{stroke:C.mgold,'stroke-width':1.4}));
const sound=[0,1,2,3,4,5].map(()=>Path(L.front,{stroke:C.gold,'stroke-width':2}));
const oct={g:el('g',{},L.props)}; oct.star=Path(oct.g,{stroke:C.gold,'stroke-width':1.8}); oct.c1=Path(oct.g,{stroke:C.mgold,'stroke-width':1.2}); oct.c2=Path(oct.g,{stroke:C.mgold,'stroke-width':1,'stroke-dasharray':'2 8'});
oct.nodes=[0,1,2,3,4,5,6,7].map(()=>el('circle',{r:4,fill:C.gold},oct.g)); oct.core=el('circle',{fill:'url(#haloW)'},oct.g);

// ---------- S5/S6: sky arch (door of tawbah), rising lights ----------
const skyArch={g:el('g',{},L.far)}; skyArch.glow=el('path',{fill:'#E3CC8F',filter:'url(#blur40)'},skyArch.g); skyArch.body=el('path',{fill:'url(#door)'},skyArch.g);
skyArch.frame=Path(skyArch.g,{stroke:C.gold,'stroke-width':2.4}); skyArch.frame2=Path(skyArch.g,{stroke:C.mgold,'stroke-width':1.2});
const lights=[...Array(9)].map(()=>{const g=el('g',{},L.front);el('circle',{r:26,fill:'url(#halo)'},g);el('circle',{r:6,fill:'#FFF3CF',filter:'url(#glow2)'},g);const tr=Path(L.front,{stroke:C.gold,'stroke-width':1.3,'stroke-opacity':.5});return {g,tr}});
const pulses=[0,1,2].map(()=>Path(L.far,{stroke:C.gold,'stroke-width':2}));

// intro drop line
const intro=el('g',{},svg);
const dropLine=el('line',{x1:540,y1:262,x2:540,y2:FLOOR,stroke:C.gold,'stroke-width':1.4},intro);
const dropDot=el('circle',{cx:540,cy:262,r:16,fill:'url(#halo)'},intro); const dropCore=el('circle',{cx:540,cy:262,r:3.4,fill:'#FFF3CF'},intro);
// intro/outro ring around big logo
const ringIn=Path(svg,{stroke:C.mgold,'stroke-width':1.3}); const ringIn2=Path(svg,{stroke:C.mgold,'stroke-width':1,'stroke-dasharray':'2 10'});

// ---------- ayah text (phrase pages) ----------
const texts=document.getElementById('texts'); const PGD=[];
const AR=['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
D.pages.forEach((pg,k)=>{const div=document.createElement('div');div.className='ayah';texts.appendChild(div);
  const spans=[]; let wi=0; const lines=[];
  pg.lines.forEach((endIdx,li)=>{const ln=document.createElement('div');ln.className='ln';div.appendChild(ln);lines.push(ln);
    if(li===0){const b=document.createElement('span');b.className='br';b.textContent='\uFD3F';ln.appendChild(b);ln.appendChild(document.createTextNode(' '))}
    for(;wi<endIdx;wi++){const s=document.createElement('span');s.className='w';s.textContent=pg.words[wi].t;ln.appendChild(s);spans.push(s);
      if(wi<endIdx-1)ln.appendChild(document.createTextNode(' '))}
    if(li===pg.lines.length-1){ln.appendChild(document.createTextNode(' '));const b=document.createElement('span');b.className='br';b.textContent='\uFD3E';ln.appendChild(b);
      if(pg.num){ln.appendChild(document.createTextNode(' '));const m=document.createElement('span');m.className='med';m.textContent='\u06DD'+String(pg.n).split('').map(d=>AR[+d]).join('');ln.appendChild(m)}}
  });
  PGD.push({div,spans,lines,pg});
});
function layoutText(){PGD.forEach(o=>{let fs=70;o.div.style.fontSize=fs+'px';o.div.style.lineHeight='2.42';
  for(let it=0;it<16;it++){const mw=Math.max(...o.lines.map(l=>l.scrollWidth));if(mw<=920)break;fs-=2;o.div.style.fontSize=fs+'px'}
  o.fs=fs})}
const hexA=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const cG=hexA(C.grey),cW=hexA(C.white),cGo=hexA(C.gold),cCo=hexA('#EE8A84'),cMg=hexA(C.mgold);
function rgb(a,b,u,al){return `rgba(${Math.round(lerp(a[0],b[0],u))},${Math.round(lerp(a[1],b[1],u))},${Math.round(lerp(a[2],b[2],u))},${al.toFixed(3)})`}
// switch times between pages: old fades out [S-0.3,S], new fades in [S,S+0.35]
const SW=D.pages.map((p,k)=>k+1<D.pages.length?Math.min(p.end,D.pages[k+1].start-0.25):null);
function renderText(t){
  PGD.forEach((o,k)=>{const pg=o.pg;
    const tin=k===0?pg.start-0.5:SW[k-1], tout=k+1<PGD.length?SW[k]-0.3:TOTAL-1.0;
    const op=P(t,tin,k===0?0.45:0.35,E.s)*(1-P(t,tout,k+1<PGD.length?0.3:0.8,E.s))*(k+1<PGD.length?1:lerp(1,0.8,P(t,TOTAL-4.5,1,E.s)));
    o.div.style.opacity=op.toFixed(3); o.div.style.display=op<=0.001?'none':'flex';
    if(op<=0.001)return;
    const dy=(1-P(t,tin,0.6,E.o))*14 - P(t,tout,0.4,E.s)*8; o.div.style.transform=`translateY(${dy.toFixed(2)}px)`;
    o.spans.forEach((s,i)=>{const w=pg.words[i]; const u=P(t,w.on-0.03,0.18,E.o);
      const tgt=w.k==='g'?cGo:w.k==='c'?cCo:cW; const al=lerp(0.42,1,u);
      s.style.color=rgb(cG,tgt,u,al);
      const act=env(t,w.on-0.03,0.1,w.off,0.5);
      s.style.textShadow = w.k==='g'? `0 0 ${(10+10*act).toFixed(1)}px rgba(227,204,143,${(0.2*u+0.22*act).toFixed(3)})` : (act>0.01?`0 0 14px rgba(240,242,235,${(0.16*act).toFixed(3)})`:'none');
    });
    o.div.querySelectorAll('.br,.med').forEach(b=>{b.style.color=rgb(cMg,cGo,P(t,pg.words[pg.words.length-1].on,0.6),0.9)});
  });
}

// ---------- canvases ----------
const cv=document.getElementById('fx'), cx=cv.getContext('2d'), cv2=document.getElementById('fx2'), cx2=cv2.getContext('2d');
const DUST=[];for(let i=0;i<110;i++)DUST.push({x:hash(i,11)*1080,y:hash(i,12)*1920,r:0.6+hash(i,13)*1.9,vx:(hash(i,14)-.5)*6,vy:-2-hash(i,15)*8,ph:hash(i,16)*6.28,a:.12+hash(i,17)*.4,g:hash(i,18)>.3});
function renderDust(t,boost){cx.clearRect(0,0,1080,1920);
  for(const d of DUST){let x=(d.x+d.vx*t+12*Math.sin(t*0.21+d.ph))%1080;if(x<0)x+=1080;let y=(d.y+d.vy*t)%1920;if(y<0)y+=1920;
    const a=d.a*(0.55+0.45*Math.sin(t*0.9+d.ph*3))*boost; const r=d.r*2.2;
    cx.globalAlpha=Math.min(1,a); cx.drawImage(d.g?SPR.gold:SPR.white,x-r*2,y-r*2,r*4,r*4)} cx.globalAlpha=1}
const grainEl=document.getElementById('grain');
const $=id=>document.getElementById(id);

// =====================================================================================
function setHud(t){
  const op=P(t,1.9,0.9,E.s);
  ['hdrL','hdrR','ftrL','ftrC'].forEach(id=>$(id).style.opacity=op.toFixed(3));
  sa(hud,{opacity:f2(op)});
  let k=0; D.pages.forEach((p,i)=>{if(t>=(i?SW[i-1]:0))k=i});
  const n=D.pages[k].n;
  if($('hdrL').dataset.n!=String(k)){$('hdrL').dataset.n=String(k);$('hdrL').textContent='QURAN · 09:'+n;$('ftrL').textContent='0'+(n-101)+' / 03';figLbl.textContent=LBL[k]}
  let ch=1; for(let i=0;i<SW.length;i++){const a=SW[i];if(t>a-0.3&&t<a+0.35)ch=Math.min(ch,Math.abs(t-a)/0.3)} ch=E.s(clamp(ch));
  const outro=P(t,PE(5)+0.2,0.8,E.s);
  $('hdrL').style.opacity=(op*ch).toFixed(3); $('ftrL').style.opacity=(op*ch).toFixed(3);
  sa(figLbl,{opacity:f2(op*ch*(1-outro))});
  ticks.forEach((r,i)=>sa(r,{opacity:f2((i<=k?0.85:0.22)*(i===k?(0.7+0.3*Math.sin(t*3)):1)),fill:i===k?C.gold:C.mgold}));
}

function render(t){
  const climax=env(t,W(5,5)-0.4,1.2,PE(5),2.0); // overall brightness at the climax
  renderDust(t,1+1.2*climax);
  const fi=Math.round(t*FPS); grainEl.style.backgroundImage=`url(assets/grain${fi%4}.png)`; grainEl.style.backgroundPosition=`${Math.floor(hash(fi,1)*512)}px ${Math.floor(hash(fi,2)*512)}px`;
  setHud(t); renderText(t);
  // ---- camera: slow continuous push / pull, never a cut ----
  const ck=[[0,{s:1,x:540,y:960}],[PS(0)-0.4,{s:1,x:540,y:950}],[PE(0),{s:1.13,x:540,y:930}],[PS(1)+2.2,{s:1.0,x:560,y:860}],[PE(1),{s:1.06,x:550,y:880}],
    [PS(2)+1.2,{s:1.04,x:560,y:920}],[PE(2),{s:1.1,x:600,y:910}],[PS(3)+1.4,{s:1.0,x:540,y:880}],[PE(3),{s:1.07,x:540,y:850}],
    [PS(4)+1.8,{s:0.93,x:540,y:900}],[PE(4),{s:0.96,x:540,y:890}],[W(5,2),{s:0.99,x:540,y:900}],[W(5,6)+0.6,{s:1.09,x:540,y:880}],[TOTAL,{s:1.02,x:540,y:950}]];
  CAM=kf(t,ck,E.s); CAM.x+=5*Math.sin(t*0.13); CAM.y+=4*Math.sin(t*0.17+1);
  for(const k in LAY){sa(LAY[k].g,{transform:camT(LAY[k].f).str})}
  // ---- sky / scenery ----
  sa(skyGlow,{opacity:f2(lerp(0.55,1,P(t,PS(1),3))*(1-0.4*climax))});
  sa(warmGlow,{opacity:f2(0.25*env(t,W(1,8),2,PE(1),1.5)+0.35*env(t,W(3,3),2,PE(3),1.5)+0.5*env(t,W(4,3),2,TOTAL-1,1.5)+0.6*climax)});
  moon.set(830+6*Math.sin(t*.2),330,40,env(t,W(1,0)-0.2,1.6,TOTAL-2.2,1.5)*(1-0.6*env(t,PS(4),1,TOTAL,1))*(1-0.5*climax),0.6+0.4*P(t,W(1,8),2));
  const fdo=env(t,W(1,0),1.6,PE(2)-0.5,1.0); farDoor.set(800,1030,62,104,fdo,0.35+0.65*P(t,W(1,8),1.5)+0.06*Math.sin(t*2));
  sa(floor,{x1:540-740*P(t,3.0,1.0,E.o),x2:540+740*P(t,3.0,1.0,E.o),opacity:f2(1-P(t,TOTAL-4.5,1.2,E.s))});
  sa(hillFar,{opacity:f2(0.55*P(t,2.6,1.6))}); sa(hillFarRim,{opacity:f2(P(t,2.6,1.6)*(1+2*climax))}); sa(hillNear,{opacity:f2(0.8*P(t,2.6,1.6))});
  // ---- intro / outro ----
  introOutro(t);
  // ---- scenes ----
  cx2.setTransform(1,0,0,1,0,0); cx2.clearRect(0,0,1080,1920);
  const cm=camT(1); cx2.setTransform(cm.s,0,0,cm.s,540-cm.x*cm.s,960-cm.y*cm.s);
  heroScene(t); s1(t); s2(t); s3(t); s4(t); s5(t); s6(t);
  // fade particles before the text band
  cx2.setTransform(1,0,0,1,0,0); cx2.globalCompositeOperation='destination-out';
  const gm=cx2.createLinearGradient(0,1170,0,1265); gm.addColorStop(0,'rgba(0,0,0,0)'); gm.addColorStop(1,'rgba(0,0,0,1)'); cx2.fillStyle=gm; cx2.fillRect(0,1170,1080,750); cx2.globalCompositeOperation='source-over';
}
window.render=render;

// ---------------- intro / outro (logo + page name) ----------------
function introOutro(t){
  // INTRO: ring draws, logo resolves with a light sweep, page name opens up, then logo -> header, name -> footer watermark
  const lb=$('logoBig'), sw=$('sweep'), nm=$('nameIn'), sb=$('subIn'), wm=$('wm'), lt=$('logoTop');
  const ia=P(t,0.25,1.1,E.o), iOut=P(t,2.05,0.8,E.io);
  const ox=540, oy=lerp(800,196,iOut);
  const sz=lerp(380*(0.9+0.1*ia),118,iOut);
  const oOut=t>TOTAL-6?0:1;
  // outro
  const t0=PE(5)+0.25, ou=P(t,t0,1.8,E.o), oo=P(t,t0,1.2,E.s)*(1-P(t,TOTAL-0.45,0.45,E.s));
  if(t<6){
    lb.style.opacity=(P(t,0.25,0.9,E.s)).toFixed(3); lb.style.width=sz+'px'; lb.style.left=(ox-sz/2)+'px'; lb.style.top=(oy-sz/2)+'px';
    lb.style.filter=`blur(${(4*(1-ia)).toFixed(2)}px) drop-shadow(0 0 ${(10+14*env(t,0.6,0.6,1.6,0.8)).toFixed(1)}px rgba(227,204,143,.45))`;
    if(t>2.85){lb.style.opacity=(1-P(t,2.85,0.6,E.s)).toFixed(3)}
  } else {
    const s2=430*(0.86+0.14*ou); lb.style.opacity=oo.toFixed(3); lb.style.width=s2+'px'; lb.style.left=(540-s2/2)+'px'; lb.style.top=(720-s2/2)+'px';
    lb.style.filter=`drop-shadow(0 0 ${(16+10*Math.sin(t*1.6)).toFixed(1)}px rgba(227,204,143,${(0.35*ou).toFixed(3)}))`;
  }
  // light sweep through the logo (masked by the logo itself)
  const swU=t<6?P(t,0.9,1.0,E.io):P(t,t0+0.9,1.2,E.io), swO=t<6?env(t,0.9,0.2,1.7,0.3)*(1-iOut):env(t,t0+0.9,0.2,t0+1.9,0.4);
  const ssz=t<6?sz:430*(0.86+0.14*ou), sy=t<6?oy:720;
  Object.assign(sw.style,{width:ssz+'px',height:ssz+'px',left:(540-ssz/2)+'px',top:(sy-ssz/2)+'px',opacity:swO.toFixed(3),
    webkitMaskImage:'url(assets/logo_rgba.png)',webkitMaskSize:'100% 100%',
    background:`linear-gradient(115deg,rgba(255,250,230,0) ${(swU*160-60).toFixed(1)}%,rgba(255,250,230,.95) ${(swU*160-45).toFixed(1)}%,rgba(255,250,230,0) ${(swU*160-30).toFixed(1)}%)`});
  // rings
  const rin=t<6?P(t,0.1,1.2,E.io)*(1-iOut):P(t,t0+0.3,1.6,E.io)*oo;
  const rr=t<6?lerp(222,70,iOut):246*(0.86+0.14*ou), ry=t<6?oy:720;
  ringIn.setD(circD(540,ry,rr)); ringIn.draw(rin,t<6?0.0:0.0); ringIn2.setD(circD(540,ry,rr+22)); sa(ringIn2.p,{opacity:f2(0.5*(t<6?env(t,0.4,0.8,1.9,0.5):oo*P(t,t0+0.6,1))),transform:`rotate(${(t*10).toFixed(1)},540,${ry})`});
  // page name: big under the logo, then flies to the footer watermark
  const nIn=P(t,0.75,0.9,E.o), nFly=P(t,1.85,0.8,E.io);
  if(t<6){
    nm.style.fontSize='46px'; nm.style.letterSpacing=lerp(0.9,0.32,nIn).toFixed(3)+'em';
    const tx=lerp(0,928-540,nFly), ty=lerp(1040,1828-12,nFly), sc=lerp(1,0.4,nFly);
    nm.style.top=ty+'px'; nm.style.transform=`translateX(${tx.toFixed(1)}px) scale(${sc.toFixed(3)})`;
    nm.style.opacity=(nIn*(1-P(t,2.6,0.25,E.s))).toFixed(3);
    nm.style.textShadow=`0 0 ${(18*env(t,1.0,0.5,1.9,0.6)).toFixed(1)}px rgba(227,204,143,.6)`;
    sb.style.top='1112px'; sb.style.opacity=(P(t,1.1,0.7,E.s)*(1-P(t,1.95,0.4,E.s))).toFixed(3);
  } else {
    nm.style.transform='none'; nm.style.fontSize='44px'; nm.style.letterSpacing=lerp(0.7,0.3,P(t,t0+0.8,1.2,E.o)).toFixed(3)+'em'; nm.style.top='985px';
    nm.style.opacity=(P(t,t0+0.7,1.0,E.s)*(1-P(t,TOTAL-0.45,0.45,E.s))).toFixed(3); nm.style.textShadow=`0 0 ${(10+6*Math.sin(t*2)).toFixed(1)}px rgba(227,204,143,.45)`;
    sb.style.top='1050px'; sb.textContent='FOLLOW · SHARE'; sb.style.opacity=(P(t,t0+1.2,1.0,E.s)*(1-P(t,TOTAL-0.45,0.45,E.s))*.9).toFixed(3);
  }
  // persistent watermark (footer right), fades in as the name lands, hidden in the outro (name is big there)
  const wmo=P(t,2.6,0.35,E.s)*(1-P(t,t0+0.3,0.8,E.s)); wm.style.opacity=(0.5*wmo+0.4*env(t,2.6,0.2,2.95,0.8)).toFixed(3);
  // small top logo during the first ayah, fades as the scene develops
  const lto=P(t,2.8,0.3,E.s)*(1-P(t,5.2,1.2,E.s)); lt.style.opacity=lto.toFixed(3); lt.style.width='118px'; lt.style.left='481px'; lt.style.top='137px';
  lt.style.filter='drop-shadow(0 0 8px rgba(227,204,143,.4))';
  // drop line from the small logo to the floor
  const dropU=P(t,2.55,1.0,E.io); const dy=lerp(262,FLOOR,dropU);
  sa(dropLine,{y2:dy,y1:lerp(262,dy,P(t,3.1,0.6,E.io)),opacity:f2(env(t,2.5,0.2,3.4,0.6)*0.8)}); sa(dropDot,{cy:dy,opacity:f2(env(t,2.5,0.2,3.45,0.4))}); sa(dropCore,{cy:dy,opacity:f2(env(t,2.5,0.2,3.45,0.4))});
  const cta=$('cta'); cta.style.opacity=(P(t,t0+1.4,0.9,E.s)*(1-P(t,TOTAL-0.45,0.45,E.s))).toFixed(3); cta.style.transform=`translateY(${((1-P(t,t0+1.4,1.0,E.o))*12).toFixed(1)}px)`;
  // world fades out for the outro
  sa(worldM,{opacity:f2(1-P(t,t0-0.15,0.9,E.s)*0.97)});
}

// ---------------- HERO (one continuous character through the whole reel) ----------------
const HX=540, HS=1.62;
function heroKeys(){return [
  [0,pose('bowed',{x:HX,op:0})],
  [PS(0)-0.6,pose('bowed',{x:HX,op:0})],
  [PS(0)+0.3,pose('bowed',{x:HX,op:1})],
  [W(0,1)-0.15,pose('bowed',{x:HX,op:1})],
  [W(0,1)+0.55,pose('kneelChest',{x:HX,op:1})],
  [W(0,2)+0.25,pose('kneelChest',{x:HX,op:1})],
  [W(0,2)+0.85,pose('kneelBow',{x:HX,op:1})],
  [W(0,3)-0.05,pose('kneelBow',{x:HX,op:1})],
  [W(0,3)+0.55,pose('kneelOffer',{x:HX,op:1,hd:16,m:-.3})],
  [W(0,7)+0.6,pose('kneelOffer',{x:HX,op:1,hd:18,m:-.5})],
  [PE(0)+0.2,pose('kneelBow',{x:HX,op:1})],
  [W(1,0)+0.2,pose('kneelBow',{x:HX,op:1,hd:22})],
  [W(1,1)+0.8,pose('kneelChest',{x:HX,op:1,hd:4,m:-.1})],
  [W(1,3)-0.1,pose('kneelChest',{x:HX,op:1,hd:-2,m:.1})],
  [W(1,3)+0.7,pose('kneelUp',{x:HX,op:1})],
  [W(1,7)-0.1,pose('kneelUp',{x:HX,op:1,m:.6})],
  [W(1,7)+0.6,pose('kneelDua',{x:HX,op:1,m:.6})],
  [W(1,8)+0.2,pose('kneelDua',{x:HX,op:1,m:.7})],
  [W(1,8)+1.0,pose('stand',{x:HX,op:1,m:.7,hd:-6})],
  [PE(1)-0.2,pose('chest',{x:HX,op:1,m:.75})],
  [W(2,0)+0.2,pose('chest',{x:HX,op:1,m:.6})],
  [W(2,0)+0.7,pose('offer',{x:HX,op:1})],
  [W(2,4)-0.2,pose('offer',{x:HX,op:1,hd:-6})],
  [W(2,4)+0.5,pose('open',{x:HX,op:1,hd:-10,m:.8})],
  [W(2,5)+0.2,pose('open',{x:HX,op:1,hd:-8,m:.85})],
  [W(2,5)+0.9,pose('stand',{x:HX-40,op:1,f:.5,m:.8})],
  [PE(2)-0.2,pose('chest',{x:HX-40,op:1,f:.3,m:.8})],
  [W(3,0)+0.2,pose('chest',{x:HX,op:1,m:.6})],
  [W(3,0)+1.0,pose('sit',{x:HX,op:1,m:.5})],
  [W(3,3),pose('sit',{x:HX,op:1,m:.55,hd:2})],
  [W(3,4)+0.6,pose('sit',{x:HX,op:1,m:.75,hd:8,br:.02,bp:5})],
  [W(3,7)-0.2,pose('sit',{x:HX,op:1,m:.75,hd:6,br:.02,bp:5})],
  [W(3,7)+0.5,pose('sitDua',{x:HX,op:1,m:.7})],
  [PE(3)-0.1,pose('sitDua',{x:HX,op:1,m:.7})],
  [PS(4)+0.5,pose('sitDua',{x:HX,op:0,m:.7})],
  [W(5,2)-0.4,pose('stand',{x:HX,op:0,hd:-4})],
  [W(5,2)+0.5,pose('stand',{x:HX,op:1,hd:-8,m:.6})],
  [W(5,3)+0.5,pose('dua',{x:HX,op:1,m:.7})],
  [W(5,5)-0.1,pose('dua',{x:HX,op:1,m:.75})],
  [W(5,5)+0.5,pose('raise',{x:HX,op:1})],
  [W(5,6)-0.15,pose('raise',{x:HX,op:1})],
  [W(5,6)+0.35,pose('kneelSide',{x:HX+30,op:1})],
  [W(5,6)+1.1,pose('sujud',{x:HX+30,op:1})],
  [PE(5)+0.3,pose('sujud',{x:HX+30,op:1})],
  [PE(5)+1.3,pose('sujud',{x:HX+30,op:0})],
]}
let HK=null;
function heroScene(t){
  if(!HK)HK=heroKeys();
  let p=kf(t,HK); p.s=HS; p.sq=squash(t,HK,1.2);
  // weight of the sins: extra sink + squash on impact
  const hit=env(t,W(0,2)+0.55,0.08,W(0,2)+0.7,0.5); p.sq-=0.05*hit;
  hero.set(p,t);
  // aura (purification + climax)
  const au=Math.max(env(t,W(2,4),0.6,W(2,5)+1.5,1.2)*0.9, env(t,W(1,8),0.8,PE(1),0.8)*0.5, env(t,W(5,5)-0.2,0.8,PE(5)+0.3,1.0)*0.9);
  heroAura.set(Object.assign({},p,{op:(p.op==null?1:p.op)*au}),t);
  // chest light (honest confession / faith)
  const cg=Math.max(env(t,W(0,1)+0.3,0.6,W(0,2)+0.5,0.5)*0.5, env(t,W(1,3)+0.3,1.0,PE(1),0.6)*(0.6+0.4*P(t,W(1,8),1)), env(t,W(3,4),1,PE(3),0.6)*0.7, env(t,W(5,3),0.8,PE(5),1.0));
  if(!hero.hidden){const ch=hero.chest; sa(chestGlow,{cx:f2(ch[0]),cy:f2(ch[1]),r:f2((44+8*Math.sin(t*3))*hero.sz),opacity:f2(cg*(p.op==null?1:p.op))})} else sa(chestGlow,{opacity:0});
  // halo behind the hero (rahma)
  const hb=hero.headC||[HX,800];
  heroHalo.set(HX,hb[1]+40,lerp(160,330,P(t,W(1,8),1.4,E.o))+8*Math.sin(t*1.4), Math.max(env(t,W(1,8)-0.1,0.8,PE(1)+0.2,0.8)*0.9, env(t,W(5,5)-0.1,0.6,PE(5)+0.4,1.2)));
  // giant shadow behind (guilt), grows on "سيئا", melts on "يتوب"
  const sh=env(t,W(0,6)-0.2,1.2,W(1,3)+0.2,1.6);
  shadowFig.set(Object.assign(pose('kneelBow'),{x:HX-150,s:2.2+0.6*E.o(P(t,W(0,6),2.6)),op:0.75*sh,m:0,mo:0,floor:FLOOR+10}),t);
  spot.set(HX,FLOOR,Math.max(env(t,W(1,1),1.2,PE(1),0.8)*0.8, env(t,W(5,2),1,PE(5)+0.3,1)*0.9),180);
}

// ---------------- S1: confession, sins, mixed deeds ----------------
function s1(t){
  // "and others": a row of people in the far back, then the focus narrows to one
  others.forEach((f,i)=>{const xs=[170,330,750,910,1040][i]; const a=PS(0)-0.2+i*0.15;
    const op=env(t,a,0.8,W(0,1)+0.3,1.0)*0.55;
    f.set(pose(i%2?'bowed':'stand',{x:xs,floor:FLOOR-34,s:1.0,op,f:(i<2?.3:-.3),m:-.2,ph:i,hd:i%2?20:10}),t+i)});
  // sins: dark stones fall onto the back
  const back=hero.shoulder||[HX,900];
  stones.forEach((s,i)=>{const a=W(0,2)+0.05+i*0.16; const fall=P(t,a,0.5,E.i);
    const off=[[-110,-4],[106,-16],[-136,-68],[130,-84]][i]; const R=[30,26,20,17][i];
    const tx=back[0]+off[0], ty=back[1]+off[1];
    const crack=P(t,W(1,3)+0.1+i*0.2,0.7,E.i); const on=env(t,a-0.3,0.3,W(1,3)+0.5+i*0.2,0.5);
    const x=lerp(tx+(i-1.5)*40, tx, fall), y=lerp(ty-420, ty, fall) + (fall>=1?3*Math.sin(t*1.3+i):0) - 140*crack;
    sa(s.g,{opacity:f2(on),transform:`translate(${f2(x)},${f2(y)})`});
    sa(s.glow,{r:R*2.3,opacity:f2(0.6*on)});
    const sp=24*crack; sa(s.a,{transform:`translate(${-sp},${sp*0.4}) rotate(${-25*crack}) scale(${R})`}); sa(s.b,{transform:`translate(${sp},${sp*0.4}) rotate(${25*crack}) scale(${R})`});
    // dissolving into rising gold dust (forgiven)
    emitC(cx2,t,{t0:W(1,3)+0.2+i*0.2,t1:W(1,3)+1.2+i*0.2,rate:26,life:2.6,x:x,y:y,w:R*2,h:R*2,vy:-110,size:5,op:.9,seed:40+i,spr:'gold',sway:18});
  });
  // good deed (gold) in right hand, bad deed (dark) in left; they rise and braid = "mixed"
  const hR=hero.hand?hero.hand.R:[HX+80,900], hL=hero.hand?hero.hand.L:[HX-80,900];
  const g=env(t,W(0,4)-0.1,0.6,W(1,3)+0.6,0.8), b=env(t,W(0,6)-0.1,0.6,W(1,3)+0.2,0.6);
  const rise=P(t,W(0,7)+0.3,1.6,E.io); const BX=HX, BY=560;
  const ang=t*2.2;
  const gx=lerp(hR[0],BX+Math.cos(ang)*70,rise), gy=lerp(hR[1]-30,BY+Math.sin(ang)*22,rise);
  const bx=lerp(hL[0],BX+Math.cos(ang+Math.PI)*70,rise), by=lerp(hL[1]-30,BY+Math.sin(ang+Math.PI)*22,rise);
  sa(orbGood,{opacity:f2(g),transform:`translate(${f2(gx)},${f2(gy)}) scale(${f2(0.6+0.4*P(t,W(0,4),0.6,E.back))})`});
  sa(orbBad,{opacity:f2(b*(1-P(t,W(1,3),0.8))),transform:`translate(${f2(bx)},${f2(by)}) scale(${f2(0.6+0.4*P(t,W(0,6),0.6,E.back))})`});
  // braid: two intertwined strands from the hands up to the orbs
  const bu=P(t,W(0,7)+0.2,1.8,E.io); const bo=env(t,W(0,7)+0.2,0.4,W(1,3)+0.2,1.0);
  if(bo>0.002){const mk=(ph,x0,y0)=>{let d='';for(let k=0;k<=40;k++){const u=k/40; const yy=lerp(y0,BY+40,u); const amp=60*Math.sin(Math.PI*u)+12; const xx=lerp(x0,BX,u)+amp*Math.sin(u*Math.PI*4+ph+t*1.5); d+=(k?' L':'M')+xx.toFixed(1)+','+yy.toFixed(1)}return d};
    braidG.setD(mk(0,hR[0],hR[1]-20)); braidB.setD(mk(Math.PI,hL[0],hL[1]-20)); braidG2.setD(mk(0.5,hR[0],hR[1]-20)); braidB2.setD(mk(Math.PI+0.5,hL[0],hL[1]-20));
    braidG.draw(bu,bo*0.9); braidB.draw(bu,bo*0.85*(1-P(t,W(1,3),0.8))); braidG2.draw(bu,bo*.6); braidB2.draw(bu,bo*.5*(1-P(t,W(1,3),0.8)));
  } else {braidG.draw(0,0);braidB.draw(0,0);braidG2.draw(0,0);braidB2.draw(0,0)}
  // cold, heavy atmosphere: sinking dark motes
  emitC(cx2,t,{t0:W(0,2),t1:W(1,2),rate:6,life:3.5,x:HX,y:620,w:700,h:200,vy:40,size:9,op:.55,seed:7,spr:'dark',sway:10});
}

// ---------------- S2: hope, forgiveness, mercy ----------------
function s2(t){
  // divine light: soft volumetric column descending from above on "ٱللَّهُ"
  const bm=env(t,W(1,1)-0.1,1.6,PE(1)+0.2,1.2);
  const bLen=lerp(300,FLOOR,P(t,W(1,1)-0.1,2.0,E.io));
  beamTop.set(HX,-120,bLen,70,230+20*Math.sin(t*0.9),bm*0.85);
  // falling light motes inside the beam
  emitC(cx2,t,{t0:W(1,1)+0.3,t1:PE(1),rate:10,life:3.2,x:HX,y:250,w:260,h:200,vy:90,size:4,op:.7,seed:11,spr:'gold',sway:8});
  // veil of mercy (ghafur: covering) drawn over the kneeling hero
  const vu=P(t,W(1,7)-0.1,1.2,E.io), vo=env(t,W(1,7)-0.1,0.4,PE(1)+0.1,0.7);
  const vy=hero.headC?hero.headC[1]-120:760; const vd=`M${HX-250},${FLOOR} C${HX-250},${vy-30} ${HX+250},${vy-30} ${HX+250},${FLOOR}`;
  veilLine.setD(vd); veilLine.draw(vu,vo*0.9); sa(veil,{d:vd+' Z',opacity:f2(vo*P(t,W(1,7)+0.4,0.9))});
  // rahim: warm ripples expanding from the heart
  const ro=env(t,W(1,8),0.3,PE(1),0.6);
  ripples.forEach((r,i)=>{const per=2.2, a=t-W(1,8)-i*per/4; const ph=((a%per)+per)%per/per; const ch=hero.chest||[HX,900];
    if(a<0||ro<=0){r.draw(0,0);return} r.setD(circD(ch[0],ch[1],30+300*E.o(ph))); r.draw(1,ro*(1-ph)*0.7)});
  emitC(cx2,t,{t0:W(1,8),t1:PE(1)+0.3,rate:14,life:3.0,x:HX,y:FLOOR-60,w:520,h:60,vy:-80,size:6,op:.8,seed:13,spr:'gold'});
}

// ---------------- S3: charity purifies and makes grow ----------------
function s3(t){
  const hs=hero.hand?[(hero.hand.L[0]+hero.hand.R[0])/2,(hero.hand.L[1]+hero.hand.R[1])/2]:[HX,900];
  coins.forEach((c,i)=>{const a=W(2,2)+0.1+i*0.13; const ap=P(t,a,0.4,E.back); const lift=W(2,3)+0.15+i*0.32; const u=P(t,lift,1.9,E.io);
    const on=env(t,a,0.25,lift+1.7,0.35);
    const sx=hs[0]+(i-2)*22, sy=hs[1]-14-(i%2)*10; const ex=HX+(i-2)*40, ey=180+((i*37)%50);
    const mx=sx+(i-2)*160, my=(sy+ey)/2;
    const q=(1-u)*(1-u), r2=2*u*(1-u), s2=u*u;
    const x=q*sx+r2*mx+s2*ex, y=q*sy+r2*my+s2*ey;
    const spin=Math.abs(Math.cos(t*4+i)); sa(c.c,{rx:f2(14*(0.25+0.75*spin))}); sa(c.i,{rx:f2(8*(0.25+0.75*spin))});
    sa(c.g,{opacity:f2(on),transform:`translate(${f2(x)},${f2(y)}) scale(${f2(ap*(1-0.4*u))})`});
    c.tr.setD(`M${f2(sx)},${f2(sy)} Q${f2(mx)},${f2(my)} ${f2(ex)},${f2(ey)}`); c.tr.draw(u,on*0.6*(1-P(t,lift+1.2,0.6)));
    // arrival flash high above
    emitC(cx2,t,{t0:lift+1.75,t1:lift+1.95,rate:30,life:1.4,x:ex,y:ey,w:10,h:10,vy:-20,spread:120,size:5,op:.9,seed:60+i,spr:'gold',sway:4});
  });
  // purification: light rain + a bright scan down the body
  const rain=env(t,W(2,4)-0.2,0.5,W(2,5)+0.6,0.8);
  emitC(cx2,t,{t0:W(2,4)-0.2,t1:W(2,5)+0.5,rate:38,life:1.2,x:HX,y:250,w:420,h:120,vy:620,size:3.5,op:.85*rain,seed:17,spr:'white',sway:0,streak:5});
  const sc=P(t,W(2,4)+0.05,1.4,E.io), scO=env(t,W(2,4),0.25,W(2,4)+1.2,0.35);
  const top=hero.headC?hero.headC[1]-60:640; sa(scan,{x:HX-170,width:340,y:f2(lerp(top-60,FLOOR-30,sc)),height:110,opacity:f2(scO)});
  // dark specks washed off and falling away
  emitC(cx2,t,{t0:W(2,4)+0.1,t1:W(2,4)+1.4,rate:16,life:1.4,x:HX,y:(b)=>lerp(top,FLOOR-80,clamp((b-W(2,4))/1.4)),w:120,h:20,vy:160,ay:300,size:6,op:.8,seed:19,spr:'dark',sway:6});
  // tazkiya: a tree grows beside him, leaves glow
  const tx=800, gu=P(t,W(2,5)-0.1,2.2,E.io), to=env(t,W(2,5)-0.2,0.3,PE(2)+0.3,0.9);
  sa(tree.g,{transform:`translate(${tx},${FLOOR}) rotate(${f2(1.2*Math.sin(t*0.9))})`,opacity:f2(to)});
  tree.br.forEach(b=>b.p.draw(clamp(gu*5-b.d),1));
  tree.lv.forEach((l,i)=>{const a=W(2,5)+1.3+hash(i,5)*1.1; const s=P(t,a,0.5,E.back); const gl=0.55+0.45*Math.sin(t*2.5+i)*P(t,W(2,6),0.8);
    sa(l.e,{cx:f2(l.l.x),cy:f2(l.l.y),transform:`rotate(${f2(hash(i,6)*180)},${f2(l.l.x)},${f2(l.l.y)})`,opacity:f2(s*gl),rx:f2(9*s),ry:f2(5*s)})});
  emitC(cx2,t,{t0:W(2,6),t1:PE(2),rate:8,life:2.4,x:tx,y:FLOOR-260,w:240,h:120,vy:-40,size:5,op:.75,seed:23,spr:'gold'});
}

// ---------------- S4: prayer = sakinah; All-Hearing, All-Knowing ----------------
function s4(t){
  // two companions sit beside him
  mates.forEach((f,i)=>{const x=[300,780][i]; const op=env(t,W(3,1)-0.3+i*0.2,0.9,PE(3)-0.1,0.7);
    let pp=kf(t,[[0,pose('sit',{m:.3})],[W(3,4),pose('sit',{m:.4})],[W(3,4)+0.8,pose('sit',{m:.7,hd:8})],[W(3,7),pose('sit',{m:.7,hd:8})],[W(3,7)+0.6,pose('sitDua',{m:.6})]]);
    f.set(Object.assign(pp,{x,s:1.25,op,ph:i*1.7,br:.02,bp:5}),t)});
  // rising supplication lights
  emitC(cx2,t,{t0:W(3,0),t1:PE(3)-0.2,rate:9,life:4.2,x:HX,y:FLOOR-80,w:640,h:40,vy:-95,size:5.5,op:.85,seed:29,spr:'gold'});
  // mihrab canopy over them on "صلاتك"
  const au=P(t,W(3,3)-0.2,1.6,E.io), ao=env(t,W(3,3)-0.2,0.3,PE(3)+0.1,0.8);
  const ad=pointArchD(HX,FLOOR,760,800); archC.setD(ad); archC.draw(au,ao); archC2.setD(pointArchD(HX,FLOOR,800,850)); archC2.draw(au,ao*0.7);
  sa(archFill,{d:ad+' Z',opacity:f2(ao*P(t,W(3,3)+0.8,1.0))});
  const lo=ao*P(t,W(3,3)+1.0,0.8,E.back); const lx=HX+4*Math.sin(t*0.8), ly=FLOOR-800+120;
  sa(lamp.g,{opacity:f2(lo)}); sa(lamp.ch,{x1:HX,y1:FLOOR-800+14,x2:lx,y2:ly-20}); sa(lamp.h,{cx:lx,cy:ly,r:f2(70+10*Math.sin(t*2))});
  sa(lamp.b,{d:`M${lx},${ly-22} C${lx+16},${ly-10} ${lx+16},${ly+10} ${lx},${ly+22} C${lx-16},${ly+10} ${lx-16},${ly-10} ${lx},${ly-22} Z`});
  // sakan: calm water rings under them, settling
  const wo=env(t,W(3,4)-0.2,0.6,PE(3),0.8);
  water.forEach((w,i)=>{const per=3.4, a=t-W(3,4)-i*per/5; const ph=((a%per)+per)%per/per;
    if(a<0||wo<=0){w.draw(0,0);return} w.setD(ellD(HX,FLOOR+18,60+420*E.o(ph),(60+420*E.o(ph))*0.07)); w.draw(1,wo*(1-ph)*0.65)});
  // All-Hearing: arcs rising from the group to the top
  const so=env(t,W(3,7)-0.1,0.3,PE(3),0.6);
  sound.forEach((r,i)=>{const per=1.4, a=t-W(3,7)-i*per/6; const ph=((a%per)+per)%per/per;
    if(a<0||so<=0){r.draw(0,0);return} const y=lerp(820,300,E.io(ph)); const rr=70+90*ph; r.setD(arcD(HX,y+rr,rr,230,310)); r.draw(1,so*Math.sin(Math.PI*ph)*0.8)});
  // All-Knowing: octagram with orbiting nodes at the top
  const oo=env(t,W(3,8)-0.25,0.8,PE(3)+0.1,0.8), op=P(t,W(3,8)-0.25,1.2,E.io); const OX=HX, OY=250;
  oct.star.setD(starD(OX,OY,62)); oct.star.draw(op,oo); sa(oct.star.p,{transform:`rotate(${f2(t*6)},${OX},${OY})`});
  oct.c1.setD(circD(OX,OY,90)); oct.c1.draw(P(t,W(3,8),1.1,E.io),oo*0.8); oct.c2.setD(circD(OX,OY,118)); sa(oct.c2.p,{opacity:f2(oo*.6),transform:`rotate(${f2(-t*10)},${OX},${OY})`});
  oct.nodes.forEach((n,i)=>{const a=rad(i*45+t*14);sa(n,{cx:f2(OX+Math.cos(a)*118),cy:f2(OY+Math.sin(a)*118),opacity:f2(oo*(0.5+0.5*Math.sin(t*3+i)))})});
  sa(oct.core,{cx:OX,cy:OY,r:150,opacity:f2(oo*0.8)});
}

// ---------------- S5: He accepts repentance from His servants ----------------
const CB=[120,300,540,780,960], CF=[205,415,665,875];
function crowdPose(t,i,row){ // shared choreography for the servants
  const lift=W(4,5)+0.2+i*0.3+(row?0.15:0);
  return kf(t,[[0,pose('bowed',{m:-.3})],[W(4,3)-0.3,pose('bowed',{m:-.3})],[W(4,3)+0.4,pose('stand',{hd:-4,m:0})],[lift,pose('stand',{hd:-4,m:0})],[lift+0.6,pose('chest',{m:.4})],
    [W(4,8),pose('chest',{m:.5})],[W(4,8)+0.6,pose('dua',{m:.55})],[W(5,1)+0.8,pose('offer',{m:.6})],[W(5,2)+0.2,pose('stand',{m:.6,hd:-6})],[W(5,5),pose('dua',{m:.7})],[W(5,6)+0.3,pose('dua',{m:.7})],[W(5,6)+0.9,pose('kneelDua',{m:.7})]]);
}
function s5(t){
  const cin=(i,row)=>PS(4)+0.2+i*0.18+(row?0.35:0);
  crowdBack.forEach((f,i)=>{const op=env(t,cin(i,1),0.9,PE(5)+0.2,1.2)*0.62*(1-0.35*P(t,W(5,2),1.0));
    f.set(Object.assign(crowdPose(t,i,1),{x:CB[i],floor:FLOOR-90,s:1.08,op,ph:i,f:(CB[i]<540?.25:-.25)*(1-P(t,W(4,8),0.6))}),t+i)});
  crowdFront.forEach((f,i)=>{const op=env(t,cin(i,0),0.9,PE(5)+0.2,1.2)*(1-0.55*P(t,W(5,2),1.0));
    f.set(Object.assign(crowdPose(t,i,0),{x:CF[i],s:1.32,op,ph:i*2}),t+i*2)});
  // the door of repentance in the sky (up = divine)
  const ao=env(t,W(4,3)-0.4,1.4,TOTAL-1.5,1.5), au=P(t,W(4,3)-0.4,1.6,E.io); const AX=540, AB=820, AW=200, AH=330;
  const lum=0.25+0.35*P(t,W(4,5),1.5)+0.4*P(t,W(5,5),0.6)+0.05*Math.sin(t*2);
  sa(skyArch.g,{opacity:f2(ao)}); const ad=archD(AX,AB,AW,AH);
  sa(skyArch.glow,{d:archD(AX,AB,AW,AH,14)+' Z',opacity:f2(0.55*lum*au)}); sa(skyArch.body,{d:ad+' Z',opacity:f2((0.12+0.8*lum)*P(t,W(4,3)+0.6,1.2))});
  skyArch.frame.setD(archD(AX,AB,AW,AH,10)); skyArch.frame.draw(au,1); skyArch.frame2.setD(archD(AX,AB,AW,AH,26)); skyArch.frame2.draw(P(t,W(4,3),1.8,E.io),0.6);
  // rays around the arch: growing, climax burst
  const ra=Math.max(env(t,W(4,5),1.2,PE(5),1.5)*0.35, climaxU(t));
  raysArch.set(AX,AB-AH*0.55,ra,lerp(520,1300,P(t,W(5,5)-0.2,1.6,E.o)),t*3,360,-90);
  // repentance lights rise from each servant into the door, door pulses on each arrival
  const src=[...CF.map((x,i)=>[x,FLOOR-330,cin(i,0)]),...CB.map((x,i)=>[x,FLOOR-90-280,cin(i,1)])];
  lights.forEach((L2,i)=>{const s=src[i]; const a=W(4,5)+0.2+(i%4)*0.32+(i>=4?0.5:0); const u=P(t,a,1.7,E.io); const on=env(t,a-0.1,0.3,a+1.75,0.3);
    const ex=AX+(hash(i,3)-.5)*80, ey=AB-AH*0.45; const mx=(s[0]+ex)/2+(s[0]<540?-80:80), my=(s[1]+ey)/2;
    const q=(1-u)*(1-u), r2=2*u*(1-u), s2=u*u; const x=q*s[0]+r2*mx+s2*ex, y=q*s[1]+r2*my+s2*ey;
    sa(L2.g,{opacity:f2(on),transform:`translate(${f2(x)},${f2(y)})`}); L2.tr.setD(`M${f2(s[0])},${f2(s[1])} Q${f2(mx)},${f2(my)} ${f2(ex)},${f2(ey)}`); L2.tr.draw(u,on*0.7*(1-u*0.5));
    emitC(cx2,t,{t0:a+1.65,t1:a+1.8,rate:40,life:1.2,x:ex,y:ey,w:20,h:10,vy:-10,spread:160,size:5,op:.9,seed:80+i,spr:'gold',sway:4});
  });
  pulses.forEach((pp,j)=>{const per=0.95, a=t-(W(4,5)+1.9)-j*per/3; const ph=((a%per)+per)%per/per; const on=env(t,W(4,5)+1.9,0.3,W(4,8)+1.6,0.6);
    if(a<0||on<=0){pp.draw(0,0);return} pp.setD(archD(AX,AB,AW+ph*120,AH+ph*70)); pp.draw(1,on*(1-ph)*0.7)});
  // chest lights on the servants
  emitC(cx2,t,{t0:W(4,8),t1:W(5,2),rate:10,life:3,x:540,y:FLOOR-150,w:880,h:80,vy:-70,size:5,op:.75,seed:31,spr:'gold'});
}
function climaxU(t){return env(t,W(5,5)-0.25,0.7,PE(5)+0.4,1.8)}
// ---------------- S6: He takes the charities; At-Tawwab, Ar-Rahim (climax) ----------------
function s6(t){
  // charities rise from the crowd's hands into the door
  coinsUp(t);
  // god rays from above + volumetric beam on the hero
  const cu=climaxU(t), pre=env(t,W(5,2)-0.2,1.2,PE(5)+0.4,1.8);
  raysTop.set(540,-160,Math.max(pre*0.35,cu*0.85),lerp(900,1500,P(t,W(5,4),1.6,E.o)),t*2.4,70,90);
  if(t>W(5,1)) beamTop.set(HX,-120,FLOOR,lerp(60,110,cu),lerp(200,320,cu)+20*Math.sin(t),Math.max(pre*0.7,cu));
  bigHalo.set(540,600,lerp(300,760,P(t,W(5,5)-0.2,1.6,E.o)),cu*0.9);
  // torrent of rising gold dust at the climax
  emitC(cx2,t,{t0:W(5,5)-0.2,t1:PE(5)+0.6,rate:42,life:3.6,x:540,y:FLOOR-20,w:1000,h:80,vy:-170,size:6.5,op:.95,seed:37,spr:'gold',sway:22});
  emitC(cx2,t,{t0:W(5,2),t1:PE(5)+0.5,rate:10,life:4.5,x:540,y:700,w:1000,h:900,vy:-20,size:4,op:.7,seed:39,spr:'white',sway:16});
}
const charity=[...Array(8)].map(()=>{const g=el('g',{},L.front);el('circle',{r:26,fill:'url(#halo)'},g);const c=el('ellipse',{rx:11,ry:11,fill:'url(#coin)'},g);return {g,c}});
function coinsUp(t){
  const xs=[...CF,...CB.slice(0,4)];
  charity.forEach((c,i)=>{const a=W(5,0)+0.15+i*0.17; const u=P(t,a,1.6,E.io); const on=env(t,a,0.25,a+1.55,0.25);
    const sx=xs[i], sy=(i<4?FLOOR-250:FLOOR-90-190), ex=540+(hash(i,9)-.5)*90, ey=820-330*0.45;
    const x=lerp(sx,ex,E.io(u))+40*Math.sin(u*Math.PI)*(sx<540?-1:1), y=lerp(sy,ey,u);
    sa(c.c,{rx:f2(11*(0.25+0.75*Math.abs(Math.cos(t*4+i))))}); sa(c.g,{opacity:f2(on),transform:`translate(${f2(x)},${f2(y)})`});
    emitC(cx2,t,{t0:a+1.5,t1:a+1.62,rate:40,life:1.1,x:ex,y:ey,w:10,h:10,vy:-10,spread:140,size:5,op:.85,seed:120+i,spr:'gold',sway:3});
  });
}

window.__ready=document.fonts.ready.then(()=>{layoutText();render(0);return true});
