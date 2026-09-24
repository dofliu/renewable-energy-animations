/* ================= utilities ================= */
const clamp=(v,a=0,b=1)=>v<a?a:v>b?b:v;
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;};
const easeOut=t=>{t=clamp(t);return 1-Math.pow(1-t,3);};
const easeIn=t=>{t=clamp(t);return t*t*t;};
const seg=(u,a,b)=>clamp((u-a)/(b-a));
const lerpPt=(a,b,t)=>({x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t)});
function kf(u,pts){
  if(u<=pts[0][0]) return {x:pts[0][1],y:pts[0][2]};
  for(let i=1;i<pts.length;i++){
    if(u<=pts[i][0]){const a=pts[i-1],b=pts[i];const t=ease((u-a[0])/(b[0]-a[0]||1));return {x:lerp(a[1],b[1],t),y:lerp(a[2],b[2],t)};}
  }
  const l=pts[pts.length-1];return {x:l[1],y:l[2]};
}
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const nz=x=>Math.sin(x*1.7)*.5+Math.sin(x*3.1+1.3)*.3+Math.sin(x*7.3+.7)*.2;

const W=1600,H=900;
/* ================= canvas, camera, labels ================= */
const cv=document.getElementById('cv');let ctx=cv.getContext('2d');
let dpr=1,cssW=960,cssH=540,fit=.6;
let cam={x:800,y:450,s:1},VX0=0,VX1=W,VY0=0,VY1=H;
let T=0,TT=0,CUR=0,U=0,SHOWLAB=true;
let FONT='"Noto Sans TC","Noto Sans CJK TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif';
let COND='"Barlow Condensed","Arial Narrow","Noto Sans TC","Noto Sans CJK TC",sans-serif';
const TAU=Math.PI*2;

function applyCam(c){
  cam=c;const k=fit*c.s;
  ctx.setTransform(dpr*k,0,0,dpr*k,dpr*(cssW/2-c.x*k),dpr*(cssH/2-c.y*k));
  VX0=c.x-cssW/2/k-6;VX1=c.x+cssW/2/k+6;VY0=c.y-cssH/2/k-6;VY1=c.y+cssH/2/k+6;
}
function toScreen(x,y){const k=fit*cam.s;return {x:cssW/2+(x-cam.x)*k,y:cssH/2+(y-cam.y)*k};}
function screenSpace(){ctx.setTransform(dpr,0,0,dpr,0,0);}

const LQ=[];
function lab(x,y,text,o){
  o=o||{};if(!SHOWLAB)return;const a=o.a===undefined?1:o.a;if(a<=.01)return;
  LQ.push({x,y,text:tr(text),dx:o.dx===undefined?0:o.dx,dy:o.dy===undefined?-40:o.dy,a,st:o.st||'n',minor:!!o.minor});
}
function drawLabels(){
  screenSpace();
  const f=clamp(cssW/100,10,13.5),sc=clamp(cssW/1100,.6,1.15);
  ctx.font=`500 ${f}px ${FONT}`;ctx.textBaseline='middle';ctx.textAlign='left';
  for(const L of LQ){
    if(L.minor&&cssW<760)continue;
    const p=toScreen(L.x,L.y),qx=p.x+L.dx*sc,qy=p.y+L.dy*sc;
    if(p.x<-8||p.x>cssW+8||p.y<-8||p.y>cssH+8)continue;
    ctx.globalAlpha=L.a;
    const tw=ctx.measureText(L.text).width,ph=f*1.8,pw=tw+f*1.2;
    let bx,by;
    if(L.dy===0){bx=L.dx>=0?qx:qx-pw;by=qy-ph/2;}
    else{bx=qx-pw/2;by=L.dy<0?qy-ph:qy;}
    bx=clamp(bx,4,cssW-pw-4);by=clamp(by,4,cssH-ph-4);
    if(L.dx||L.dy){
      const ex=clamp(qx,bx,bx+pw),ey=clamp(qy,by,by+ph);
      ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=1.3;
      ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(ex,ey);ctx.stroke();
      ctx.beginPath();ctx.arc(p.x,p.y,2.6,0,TAU);ctx.fillStyle='#fff';ctx.fill();
      ctx.lineWidth=1;ctx.strokeStyle='rgba(8,32,45,.8)';ctx.stroke();
    }
    let bg='rgba(9,31,44,.88)',fg='#fff';
    if(L.st==='w'){bg='#e8572a';}
    else if(L.st==='s'){bg='#f2c230';fg='#13232e';}
    else if(L.st==='l'){bg='rgba(255,255,255,.93)';fg='#13232e';}
    else if(L.st==='g'){bg='#1f7f5c';}
    rrp(bx,by,pw,ph,ph/2);ctx.fillStyle=bg;ctx.fill();
    ctx.fillStyle=fg;ctx.fillText(L.text,bx+f*.6,by+ph/2+.5);
  }
  ctx.globalAlpha=1;LQ.length=0;
}

/* ================= small helpers ================= */
function rrp(x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function box(x,y,w,h,f,s,lw){ctx.fillStyle=f;ctx.fillRect(x,y,w,h);if(s){ctx.strokeStyle=s;ctx.lineWidth=lw||1;ctx.strokeRect(x,y,w,h);}}
function ln(p,s,lw){ctx.beginPath();ctx.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)ctx.lineTo(p[i],p[i+1]);ctx.strokeStyle=s;ctx.lineWidth=lw||1;ctx.stroke();}
function poly(p,f,s,lw){ctx.beginPath();ctx.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)ctx.lineTo(p[i],p[i+1]);ctx.closePath();if(f){ctx.fillStyle=f;ctx.fill();}if(s){ctx.strokeStyle=s;ctx.lineWidth=lw||1;ctx.stroke();}}
function circ(x,y,r,f,s,lw){ctx.beginPath();ctx.arc(x,y,Math.max(.1,r),0,TAU);if(f){ctx.fillStyle=f;ctx.fill();}if(s){ctx.strokeStyle=s;ctx.lineWidth=lw||1;ctx.stroke();}}
function wins(x,y,n,dx,w,h,col){ctx.fillStyle=col||'#1c3444';for(let i=0;i<n;i++)ctx.fillRect(x+i*dx,y,w,h);}
function rail(x0,x1,y,h,col){ctx.strokeStyle=col||'rgba(40,50,60,.8)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(x0,y-h);ctx.lineTo(x1,y-h);for(let x=x0;x<=x1+.1;x+=6){ctx.moveTo(x,y);ctx.lineTo(x,y-h);}ctx.stroke();}
function person(x,y,col,s){s=s||1;ctx.fillStyle=col||'#e8572a';ctx.fillRect(x-1.6*s,y-7*s,3.2*s,5*s);ctx.fillStyle='#223';ctx.fillRect(x-1.4*s,y-2*s,1.1*s,2*s);ctx.fillRect(x+.3*s,y-2*s,1.1*s,2*s);circ(x,y-8.6*s,1.6*s,'#f0c9a0');ctx.fillStyle='#fff';ctx.fillRect(x-1.8*s,y-10.6*s,3.6*s,1.2*s);}
function alphaDo(a,fn){if(a<=.001)return;const g=ctx.globalAlpha;ctx.globalAlpha=g*clamp(a);fn();ctx.globalAlpha=g;}
function bez(p0,p1,p2,p3,t){const m=1-t;return {x:m*m*m*p0.x+3*m*m*t*p1.x+3*m*t*t*p2.x+t*t*t*p3.x,y:m*m*m*p0.y+3*m*m*t*p1.y+3*m*t*t*p2.y+t*t*t*p3.y};}

/* ================= crane ================= */
function crane(px,py,L,hx,hy,o){
  o=o||{};const col=o.col||'#e9b21f';
  let dx=hx-px;const m=L*.985;dx=clamp(dx,-m,m);
  const tx=px+dx,ty=py-Math.sqrt(L*L-dx*dx);hy=Math.max(hy,ty+14);
  const w=o.w||Math.max(4,L*.028),ang=Math.atan2(ty-py,tx-px),nx=-Math.sin(ang)*w/2,ny=Math.cos(ang)*w/2;
  const back=dx>=0?-1:1,ax=px+back*w*2,ay=py-w*3.4;
  ln([px,py,ax,ay],'#3d4750',2);ln([ax,ay,tx,ty],'rgba(30,35,40,.75)',.9);ln([ax,ay,tx+nx*.3,ty+ny*.3],'rgba(30,35,40,.5)',.7);
  if(o.solid){poly([px+nx,py+ny,tx+nx*.4,ty+ny*.4,tx-nx*.4,ty-ny*.4,px-nx,py-ny],col,'rgba(0,0,0,.35)',1);}
  else{
    const len=Math.hypot(tx-px,ty-py),n=Math.max(3,Math.floor(len/(w*1.3)));
    ctx.strokeStyle=col;ctx.lineWidth=Math.max(1.4,w*.3);ctx.beginPath();
    ctx.moveTo(px+nx,py+ny);ctx.lineTo(tx+nx*.35,ty+ny*.35);ctx.moveTo(px-nx,py-ny);ctx.lineTo(tx-nx*.35,ty-ny*.35);ctx.stroke();
    ctx.lineWidth=.8;ctx.beginPath();
    for(let i=0;i<n;i++){const k0=i/n,k1=(i+1)/n,s0=lerp(1,.35,k0),s1=lerp(1,.35,k1);
      const a={x:lerp(px,tx,k0)+nx*s0*(i%2?1:-1),y:lerp(py,ty,k0)+ny*s0*(i%2?1:-1)},b={x:lerp(px,tx,k1)+nx*s1*(i%2?-1:1),y:lerp(py,ty,k1)+ny*s1*(i%2?-1:1)};
      ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);}
    ctx.stroke();
  }
  circ(tx,ty,w*.45,'#3d4750');
  ln([tx,ty,tx,hy-8],'rgba(25,28,32,.9)',1.1);
  box(tx-4.5,hy-11,9,7,'#2b3137');ctx.strokeStyle='#2b3137';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(tx,hy-4);ctx.lineTo(tx,hy-1);ctx.arc(tx-2,hy-1,2,0,Math.PI);ctx.stroke();
  return {x:tx,y:ty,hy};
}
function slings(hx,hy,pts){ctx.strokeStyle='rgba(30,30,30,.8)';ctx.lineWidth=.8;ctx.beginPath();for(let i=0;i<pts.length;i+=2){ctx.moveTo(hx,hy);ctx.lineTo(pts[i],pts[i+1]);}ctx.stroke();}

/* ================= scene helpers ================= */
let SC=0,SU=0;
const uc=i=>SC>i?1:SC<i?0:SU;
const band=(u,a,b,f)=>{f=f||.03;return seg(u,a,a+f)*(1-seg(u,b-f,b));};
const TQ=[];
function tick(x,y,t,al){TQ.push({x,y,t,al:al||'left'});}
function drawTicks(){
  screenSpace();const f=clamp(cssW/105,9,13);ctx.font=`600 ${f}px ${COND}`;ctx.textBaseline='middle';
  for(const q of TQ){const p=toScreen(q.x,q.y),t=tr(q.t);ctx.textAlign=q.al;ctx.fillStyle='rgba(8,32,45,.7)';ctx.fillText(t,p.x+1,p.y+1);ctx.fillStyle='#fff';ctx.fillText(t,p.x,p.y);}
  TQ.length=0;ctx.textAlign='left';
}
function arrowR(x,y,L,col){ln([x,y,x+L,y],col,2);poly([x+L+6,y,x+L-1,y-4,x+L-1,y+4],col);}
function partial(P,f){
  if(f>=1)return P.slice();if(f<=0)return [P[0]];
  let tot=0;const d=[];for(let i=1;i<P.length;i++){const l=Math.hypot(P[i].x-P[i-1].x,P[i].y-P[i-1].y);d.push(l);tot+=l;}
  let want=tot*f;const out=[P[0]];
  for(let i=1;i<P.length;i++){if(want>=d[i-1]){out.push(P[i]);want-=d[i-1];}else{const t=want/d[i-1];out.push({x:lerp(P[i-1].x,P[i].x,t),y:lerp(P[i-1].y,P[i].y,t)});break;}}
  return out;
}
function pathLine(P,col,lw,dash){if(!P||P.length<2)return;ctx.beginPath();ctx.moveTo(P[0].x,P[0].y);for(let i=1;i<P.length;i++)ctx.lineTo(P[i].x,P[i].y);if(dash)ctx.setLineDash(dash);ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.lineJoin='round';ctx.stroke();ctx.setLineDash([]);}
function drawCable(P){if(!P||P.length<2)return;pathLine(P,'#121416',3.6);pathLine(P,'#e8a33a',.9,[6,8]);}
function ring(x,y,r,col,lw){ctx.beginPath();ctx.arc(x,y,Math.max(.1,r),0,TAU);ctx.strokeStyle=col;ctx.lineWidth=lw||1.5;ctx.stroke();}

/* ================= HUD ================= */
const HK=()=>clamp(cssW/1200,.62,1.15);
let HUDW=0;
function hudPanel(w,h,title,a,fn){
  if(cssW<600||a<=.01||!SHOWLAB)return;
  const k=HK(),x=cssW-(w+14)*k,y=34*k;
  screenSpace();ctx.save();ctx.globalAlpha=clamp(a);ctx.translate(x,y);ctx.scale(k,k);
  rrp(0,0,w,h,10);ctx.fillStyle='rgba(7,27,39,.86)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=1;ctx.stroke();
  ctx.fillStyle='#f2c230';ctx.font=`700 13px ${FONT}`;ctx.textBaseline='alphabetic';ctx.textAlign='left';ctx.fillText(tr(title),14,23,w-28);
  HUDW=w;try{fn(w,h);}finally{HUDW=0;}ctx.restore();
}
function hrow(y,label,val,w,col){label=tr(label);val=tr(val);ctx.textBaseline='alphabetic';ctx.font=`700 17px ${COND}`;const vw=ctx.measureText(val).width;ctx.textAlign='left';ctx.font=`500 12px ${FONT}`;ctx.fillStyle='rgba(227,236,238,.78)';ctx.fillText(label,14,y,Math.max(24,w-36-vw));ctx.textAlign='right';ctx.font=`700 17px ${COND}`;ctx.fillStyle=col||'#fff';ctx.fillText(val,w-14,y);ctx.textAlign='left';}
function hbar(x,y,w,f,col){rrp(x,y,w,6,3);ctx.fillStyle='rgba(255,255,255,.14)';ctx.fill();if(f>0){rrp(x,y,Math.max(6,w*clamp(f)),6,3);ctx.fillStyle=col||'#f2c230';ctx.fill();}}
function htext(x,y,t,size,col,weight,font,align){t=tr(t);const al=align||'left';ctx.textBaseline='alphabetic';ctx.textAlign=al;ctx.font=`${weight||500} ${size}px ${font||FONT}`;ctx.fillStyle=col||'#fff';
  if(HUDW){const mw=al==='left'?HUDW-x-10:al==='right'?x-10:Math.min(x,HUDW-x)*2-10;if(mw>8){ctx.fillText(t,x,y,mw);ctx.textAlign='left';return;}}
  ctx.fillText(t,x,y);ctx.textAlign='left';}
