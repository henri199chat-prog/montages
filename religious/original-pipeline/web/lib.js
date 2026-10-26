// ===== shared library (from 001, extended) =====
'use strict';
const D=window.__DATA__, TOTAL=D.TOTAL, FPS=30, FLOOR=1150;
const C={gold:'#E3CC8F',mgold:'#B09F75',white:'#F0F2EB',grey:'#97A0A2',teal:'#608F8C',coral:'#E66A65',navy:'#0E1D2B',dim:'#6E7E88',deep:'#0A141D'};
const NS='http://www.w3.org/2000/svg';
const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)), lerp=(a,b,u)=>a+(b-a)*u;
const E={io:u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2, o:u=>1-Math.pow(1-u,3), i:u=>u*u*u, s:u=>-(Math.cos(Math.PI*u)-1)/2,
  back:u=>{const c1=1.4,c3=c1+1;return 1+c3*Math.pow(u-1,3)+c1*Math.pow(u-1,2)}, x:u=>u>=1?1:1-Math.pow(2,-10*u), q:u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2,
  el:u=>u===0||u===1?u:Math.pow(2,-9*u)*Math.sin((u*10-.75)*2*Math.PI/3)*.5+1};
const P=(t,a,d,e=E.io)=>e(clamp((t-a)/d));
const env=(t,a,ai,b,bo,e=E.s)=>P(t,a,ai,e)*(1-P(t,b,bo,e));
const hash=(i,k=0)=>{const x=Math.sin(i*127.1+k*311.7)*43758.5453;return x-Math.floor(x)};
const rad=a=>a*Math.PI/180;
function mix(a,b,u){ if(typeof a==='number')return lerp(a,b,u); const o={}; for(const k in a)o[k]=(k in b)?lerp(a[k],b[k],u):a[k]; for(const k in b)if(!(k in a))o[k]=b[k]; return o}
function kf(t,keys,e=E.io){ if(t<=keys[0][0])return Object.assign({},keys[0][1]);
  for(let i=0;i<keys.length-1;i++){const [t0,v0]=keys[i],[t1,v1,e1]=keys[i+1];
    if(t<=t1){const u=(e1||e)(clamp((t-t0)/Math.max(1e-6,t1-t0)));return mix(v0,v1,u)}}
  return Object.assign({},keys[keys.length-1][1]);}
const PG=p=>D.pages[p], W=(p,i)=>D.pages[p].words[i].on, PS=p=>D.pages[p].start, PE=p=>D.pages[p].end;
function el(tag,attrs,parent){const e=document.createElementNS(NS,tag);for(const k in attrs)e.setAttribute(k,attrs[k]);if(parent)parent.appendChild(e);return e}
function sa(e,attrs){for(const k in attrs)e.setAttribute(k,attrs[k])}
const f2=v=>(+v).toFixed(2);
function Path(parent,attrs){const p=el('path',Object.assign({fill:'none','stroke-linecap':'round','stroke-linejoin':'round'},attrs),parent);
  return {p,len:0,d:'',setD(d){if(d!==this.d){sa(p,{d});this.len=p.getTotalLength();this.d=d}},draw(u,op=1){const l=this.len||1;
    if(op<=0.001||u<=0){sa(p,{opacity:0});return} sa(p,{'stroke-dasharray':`${l} ${l}`,'stroke-dashoffset':l*(1-u),opacity:op})}}}
function arcD(cx,cy,r,a0,a1){const p=a=>[cx+r*Math.cos(rad(a)),cy+r*Math.sin(rad(a))];const s=p(a0),e=p(a1);const large=Math.abs(a1-a0)>180?1:0;return `M${s[0]},${s[1]} A${r},${r} 0 ${large} ${a1>a0?1:0} ${e[0]},${e[1]}`}
function circD(cx,cy,r){return `M${cx},${cy-r} A${r},${r} 0 1 1 ${cx-0.01},${cy-r}`}
function starD(cx,cy,r){let d='';for(let k=0;k<2;k++){const pts=[];for(let i=0;i<4;i++){const a=rad(45*k+90*i-90);pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)])}d+=`M${pts[0]} L${pts[1]} L${pts[2]} L${pts[3]} Z `}return d}
function archD(x,base,w,h,pad=0){const X0=x-w/2-pad,X1=x+w/2+pad,top=base-h-pad,r=w/2+pad;return `M${X0},${base} L${X0},${top+r} A${r},${r} 0 0 1 ${X1},${top+r} L${X1},${base}`}
function pointArchD(x,base,w,h){const X0=x-w/2,X1=x+w/2,sh=base-h*0.55,top=base-h;return `M${X0},${base} L${X0},${sh} C${X0},${sh-h*0.28} ${x-w*0.18},${top+h*0.1} ${x},${top} C${x+w*0.18},${top+h*0.1} ${X1},${sh-h*0.28} ${X1},${sh} L${X1},${base}`}
function wave(x0,x1,y,amp,per,ph){let d='';for(let x=x0;x<=x1;x+=4){const y1=y+amp*Math.sin((x-x0)/per*2*Math.PI+ph)*Math.sin(Math.PI*(x-x0)/(x1-x0));d+=(d?' L':'M')+x.toFixed(1)+','+y1.toFixed(1)}return d}
function ellD(cx,cy,rx,ry){return `M${cx-rx},${cy} A${rx},${ry} 0 1 0 ${cx+rx},${cy} A${rx},${ry} 0 1 0 ${cx-rx},${cy}`}

// ---------- stick figure: pure white, solid round head, NO eyes, single-line mouth ----------
const LEN={th:64,sh:62,sp:98,neck:12,hr:25,ua:54,fa:50};
const POSE={
 stand:{sp:0,hd:0,uaL:-13,faL:-7,uaR:13,faR:7,thL:-7,shL:-4,thR:7,shR:4,m:.25,f:0,sl:1},
 bowed:{sp:4,hd:26,uaL:-6,faL:-2,uaR:6,faR:2,thL:-6,shL:-3,thR:6,shR:3,m:-.5,f:0,sl:.97},
 slump:{sp:6,hd:22,uaL:-4,faL:2,uaR:6,faR:3,thL:-4,shL:-2,thR:5,shR:3,m:-.75,f:0,sl:.9},
 open:{sp:0,hd:-6,uaL:-34,faL:-24,uaR:34,faR:24,thL:-9,shL:-6,thR:9,shR:6,m:.85,f:0,sl:1.03},
 chest:{sp:0,hd:-3,uaL:-26,faL:118,uaR:26,faR:-118,thL:-7,shL:-4,thR:7,shR:4,m:.55,f:0,sl:1.01},
 dua:{sp:0,hd:-10,uaL:-30,faL:168,uaR:30,faR:-168,thL:-7,shL:-4,thR:7,shR:4,m:.35,f:0,sl:1.01},
 raise:{sp:0,hd:-14,uaL:-150,faL:-162,uaR:150,faR:162,thL:-9,shL:-6,thR:9,shR:6,m:.95,f:0,sl:1.04},
 offer:{sp:0,hd:4,uaL:-30,faL:-100,uaR:30,faR:100,thL:-7,shL:-4,thR:7,shR:4,m:.5,f:0,sl:1.0},
 kneel:{sp:8,hd:10,uaL:-14,faL:-6,uaR:14,faR:6,thL:-20,shL:-90,thR:20,shR:92,m:.2,f:0,sl:1,kn:1},
 kneelBow:{sp:16,hd:30,uaL:-6,faL:40,uaR:8,faR:-36,thL:-20,shL:-90,thR:20,shR:92,m:-.6,f:0,sl:.95,kn:1},
 kneelChest:{sp:6,hd:18,uaL:-24,faL:116,uaR:24,faR:-116,thL:-20,shL:-90,thR:20,shR:92,m:-.45,f:0,sl:.97,kn:1},
 kneelOffer:{sp:2,hd:8,uaL:-26,faL:-96,uaR:26,faR:96,thL:-20,shL:-90,thR:20,shR:92,m:.1,f:0,sl:1,kn:1},
 kneelUp:{sp:0,hd:-12,uaL:-24,faL:116,uaR:24,faR:-116,thL:-20,shL:-90,thR:20,shR:92,m:.55,f:0,sl:1.02,kn:1},
 kneelDua:{sp:0,hd:-12,uaL:-30,faL:168,uaR:30,faR:-168,thL:-20,shL:-90,thR:20,shR:92,m:.45,f:0,sl:1.02,kn:1},
 sit:{sp:0,hd:6,uaL:-25,faL:-40,uaR:25,faR:40,thL:-74,shL:66,thR:74,shR:-66,m:.45,f:0,sl:1},
 sitDua:{sp:0,hd:-10,uaL:-30,faL:168,uaR:30,faR:-168,thL:-74,shL:66,thR:74,shR:-66,m:.5,f:0,sl:1.01},
 sujud:{sp:104,hd:10,uaL:40,faL:90,uaR:46,faR:92,thL:-8,shL:-90,thR:-12,shR:-92,m:.4,f:1,sl:1,gh:1,mo:0},
 kneelSide:{sp:14,hd:14,uaL:20,faL:60,uaR:26,faR:66,thL:-6,shL:-90,thR:-10,shR:-92,m:.4,f:1,sl:1,mo:1},
};
const pose=(name,extra)=>Object.assign({},POSE[name],extra||{});
class Fig{
 constructor(parent,{color=C.white,w=11,scale=1,filter=null}={}){
  this.g=el('g',filter?{filter}:{},parent); this.inner=el('g',{},this.g);
  const st={fill:'none',stroke:color,'stroke-width':w,'stroke-linecap':'round','stroke-linejoin':'round'};
  this.legL=el('path',st,this.inner);this.legR=el('path',st,this.inner);this.body=el('path',st,this.inner);
  this.armL=el('path',st,this.inner);this.armR=el('path',st,this.inner);
  this.head=el('circle',{fill:color},this.inner);
  this.mouth=el('path',{fill:'none',stroke:C.navy,'stroke-width':3.4,'stroke-linecap':'round'},this.inner);
  this.scale=scale; this.color=color; this.w=w; this.parts=[this.legL,this.legR,this.body,this.armL,this.armR];
 }
 colour(c){if(c===this.color)return;this.color=c;this.parts.forEach(p=>sa(p,{stroke:c}));sa(this.head,{fill:c})}
 set(p,t=0){
  const s=(p.s||1)*this.scale, L2=LEN, o=(a,l)=>[Math.sin(rad(a))*l,Math.cos(rad(a))*l];
  if(p.op!=null&&p.op<=0.002){sa(this.g,{opacity:0});this.hidden=true;return} this.hidden=false;
  const br=1+(p.br==null?0.012:p.br)*Math.sin(t*2*Math.PI/(p.bp||3.4)+(p.ph||0));
  const sl=(p.sl||1)*br;
  const kL=o(p.thL,L2.th),fL=[kL[0]+o(p.shL,L2.sh)[0],kL[1]+o(p.shL,L2.sh)[1]];
  const kR=o(p.thR,L2.th),fR=[kR[0]+o(p.shR,L2.sh)[0],kR[1]+o(p.shR,L2.sh)[1]];
  const sp=rad(p.sp), up=[Math.sin(sp),-Math.cos(sp)];
  const N=[up[0]*L2.sp*sl,up[1]*L2.sp*sl], S=[up[0]*(L2.sp*sl-10),up[1]*(L2.sp*sl-10)];
  const ha=rad(p.sp+p.hd), Hc=[N[0]+Math.sin(ha)*(L2.neck+L2.hr),N[1]-Math.cos(ha)*(L2.neck+L2.hr)];
  let low=Math.max(kL[1],fL[1],kR[1],fR[1]); if(p.gh)low=Math.max(low,Hc[1]+L2.hr-2);
  const hip=[p.x,(p.floor||FLOOR)-low*s-(p.lift||0)];
  const T=(v)=>[hip[0]+v[0]*s,hip[1]+v[1]*s];
  const eL=[S[0]+o(p.uaL,L2.ua)[0],S[1]+o(p.uaL,L2.ua)[1]], hL=[eL[0]+o(p.faL,L2.fa)[0],eL[1]+o(p.faL,L2.fa)[1]];
  const eR=[S[0]+o(p.uaR,L2.ua)[0],S[1]+o(p.uaR,L2.ua)[1]], hR=[eR[0]+o(p.faR,L2.fa)[0],eR[1]+o(p.faR,L2.fa)[1]];
  const pt=v=>{const q=T(v);return q[0].toFixed(2)+','+q[1].toFixed(2)};
  sa(this.legL,{d:`M${pt([0,0])} L${pt(kL)} L${pt(fL)}`}); sa(this.legR,{d:`M${pt([0,0])} L${pt(kR)} L${pt(fR)}`});
  sa(this.body,{d:`M${pt([0,0])} L${pt(N)}`});
  sa(this.armL,{d:`M${pt(S)} L${pt(eL)} L${pt(hL)}`}); sa(this.armR,{d:`M${pt(S)} L${pt(eR)} L${pt(hR)}`});
  const sw=this.w*s; this.parts.forEach(q=>q.setAttribute('stroke-width',f2(sw)));
  const hc=T(Hc); sa(this.head,{cx:f2(hc[0]),cy:f2(hc[1]),r:f2(L2.hr*s)});
  const f=p.f||0, mw=13*(1-.38*Math.abs(f))*s, mx=f*9*s, my=8.5*s, c=(p.m||0)*7*s;
  const rot=(x,y)=>{const ca=Math.cos(ha),sn=Math.sin(ha);return [hc[0]+x*ca-y*sn,hc[1]+x*sn+y*ca]};
  const a=rot(mx-mw/2,my),b=rot(mx,my+c),d=rot(mx+mw/2,my);
  sa(this.mouth,{d:`M${f2(a[0])},${f2(a[1])} Q${f2(b[0])},${f2(b[1])} ${f2(d[0])},${f2(d[1])}`,'stroke-width':f2(3.4*s),opacity:p.mo==null?1:clamp(p.mo)});
  const sq=p.sq||0, gy=(p.floor||FLOOR)-(p.lift||0);
  sa(this.inner,{transform:`translate(${f2(p.x)},${f2(gy)}) scale(${f2(1-sq*.5)},${f2(1+sq)}) translate(${f2(-p.x)},${f2(-gy)})`});
  sa(this.g,{opacity:p.op==null?1:f2(p.op)});
  this.hand={L:T(hL),R:T(hR)}; this.headC=hc; this.chest=T([S[0]*0.72,S[1]*0.72]); this.back=T([S[0]*0.8-14*up[1]*0,S[1]*0.8]); this.hip=hip; this.sz=s; this.shoulder=T(S); this.up=up;
 }
}
// squash-and-stretch from keyframe list
function squash(t,K,amp=1){let sq=0; for(const [kt] of K){const a=t-kt; if(a>-0.18&&a<0.6){sq+= a<0? -0.035*Math.sin(Math.PI*(a+0.18)/0.18): 0.03*Math.sin(Math.PI*a/0.3)*Math.exp(-a*5)}} return clamp(sq*amp,-0.05,0.05)}
function gait(p,ph,amt){ if(amt<=0)return p; const q=Object.assign({},p), A=amt, sn=Math.sin(ph), cs=Math.cos(ph);
  const sw=22*A, dir=(p.f||0)>=0?1:-1;
  q.thL=lerp(p.thL,dir*sw*sn,A); q.thR=lerp(p.thR,-dir*sw*sn,A);
  q.shL=q.thL-dir*28*A*Math.max(0,-cs); q.shR=q.thR-dir*28*A*Math.max(0,cs);
  q.lift=(p.lift||0)+4*A*Math.abs(Math.sin(ph)); return q}

// ---------- canvas particles (deterministic, per-emitter, no shared pools) ----------
function sprite(rgb,core='255,246,214'){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');
  const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,`rgba(${core},1)`);g.addColorStop(.22,`rgba(${rgb},.75)`);g.addColorStop(.55,`rgba(${rgb},.18)`);g.addColorStop(1,`rgba(${rgb},0)`);
  x.fillStyle=g;x.fillRect(0,0,64,64);return c}
const SPR={gold:sprite('227,204,143'),white:sprite('240,242,235','255,255,255'),coral:sprite('230,106,101','255,200,190'),dark:(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(4,8,12,.9)');g.addColorStop(.5,'rgba(4,8,12,.45)');g.addColorStop(1,'rgba(4,8,12,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return c})()};
// o: {t0,t1,rate,life,x,y (num or fn(birth)),w,h,vx,vy,ax,ay,size,op,seed,sway,spr,streak}
function emitC(ctx,t,o){ if(t<o.t0||t>o.t1+o.life)return;
  const i0=Math.max(0,Math.floor((t-o.life-o.t0)*o.rate)), i1=Math.floor((Math.min(t,o.t1)-o.t0)*o.rate);
  const spr=SPR[o.spr||'gold'];
  for(let i=i0;i<=i1;i++){const b=o.t0+i/o.rate, a=t-b; if(a<0||a>o.life)continue;
    const u=a/o.life, s=(o.seed||0)*131+i;
    const bx=typeof o.x==='function'?o.x(b):o.x, by=typeof o.y==='function'?o.y(b):o.y;
    const vy=(o.vy==null?-60:o.vy)*(0.7+0.6*hash(s,4)), vx=(o.vx||0)+(o.spread||0)*(hash(s,7)-.5);
    const x=bx+(hash(s,1)-.5)*(o.w||0)+vx*a+0.5*(o.ax||0)*a*a+(o.sway==null?14:o.sway)*Math.sin(a*1.7+hash(s,2)*6);
    const y=by+(hash(s,3)-.5)*(o.h||0)+vy*a+0.5*(o.ay||0)*a*a;
    const op=(o.op==null?1:o.op)*Math.sin(Math.PI*Math.pow(u,o.skew||1))*(0.45+0.55*hash(s,5))*(0.75+0.25*Math.sin(t*6+s));
    if(op<=0.003)continue;
    const r=(o.size||7)*(0.55+0.9*hash(s,6));
    ctx.globalAlpha=Math.min(1,op);
    if(o.streak){ctx.drawImage(spr,x-r*0.5,y-r*o.streak,r,r*o.streak*2)} else ctx.drawImage(spr,x-r*2,y-r*2,r*4,r*4);
  } ctx.globalAlpha=1;
}
