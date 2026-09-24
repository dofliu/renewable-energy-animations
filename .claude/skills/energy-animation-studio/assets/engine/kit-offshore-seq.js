let ROT_T=()=>-1;
/* ================= CH5 transition piece ================= */
function hlv5(u){let R=TX-40,a=1;if(u>.86){R=lerp(TX-40,TX-520,easeIn(seg(u,.86,1)));a=1-seg(u,.9,1);}return {R,a};}
function tp5(u,R,deck){if(u<.16)return {x:R-290,y:deck};return kf(u,[[.16,R-290,deck],[.27,R-290,300],[.41,TX,300],[.56,TX,TP_BOT]]);}
function sc5(u){
  const {R,a}=hlv5(u),deck=hlvDeck(R);
  vsl(R,430,true,{damp:.35,a},vHLV);
  const ham=u<.12?kf(u,[[0,TX,PILE_TOP-60],[.04,TX,300],[.08,R-150,300],[.12,R-150,deck-8]]):{x:R-150,y:deck-8};
  alphaDo(a,()=>drawHammer(ham.x,ham.y,0));
  const tp=tp5(u,R,deck);
  alphaDo(u<.56?a:1,()=>drawTP(tp.x,tp.y));
  if(u>=.16&&u<.56)slings(tp.x,tp.y-88,[tp.x-22,tp.y-58,tp.x+22,tp.y-58]);
  alphaDo(a,()=>{
    box(R-2,deck-40,8,40,'#2b3137');box(R+2,deck-44,5,6,'#e8572a');
    const stow={x:R-250,y:deck-90};let hk;
    if(u<.12)hk={x:ham.x,y:ham.y-110};else if(u<.16)hk=lerpPt({x:R-150,y:deck-118},{x:R-290,y:deck-88},ease(seg(u,.12,.16)));
    else if(u<.56)hk={x:tp.x,y:tp.y-88};else if(u<.66)hk=lerpPt({x:TX,y:TP_BOT-88},{x:TX-40,y:240},ease(seg(u,.56,.66)));
    else hk=lerpPt({x:TX-40,y:240},stow,ease(seg(u,.66,.8)));
    crane(R-80,deck-30,440,hk.x,hk.y,{col:'#e9b21f'});
  });
  lab(tp.x+17,tp.y-30,'轉接段 TP',{dx:70,dy:-20,a:band(u,.15,.58)});
  lab(TX,PILE_TOP,'對準樁頂套接',{dx:70,dy:40,a:band(u,.44,.58)});
  lab(TX+16,PILE_TOP+2,'螺栓法蘭鎖固',{dx:80,dy:20,st:'s',a:band(u,.56,.76)});
  lab(TX+40,TP_TOP-3,'工作平台',{dx:110,dy:-6,a:band(u,.75,1)});
  lab(TX-34,470,'靠船設施與爬梯',{dx:-80,dy:30,a:band(u,.75,1)});
  lab(TX+46,TP_TOP-22,'平台吊車',{dx:40,dy:-70,a:band(u,.78,1),minor:true});
  lab(R-380,deck-104,'吊裝船撤離',{dy:-30,a:band(u,.87,.97)});
}
function fx5(u){
  if(u<.56||u>.76)return;const q=seg(u,.56,.75),k=Math.floor(q*14);
  for(let i=0;i<=k&&i<14;i++){const x=TX-14+(i%7)*4.6,a=i===k?1-((q*14)%1):.35;circ(x,PILE_TOP+1,i===k?3.5:1.6,`rgba(255,236,150,${a})`);}
}

/* ================= CH6 offshore substation ================= */
function cv6(u){let Ls=lerp(-700,600,easeOut(seg(u,0,.15))),a=1;if(u>.88){Ls=lerp(600,100,easeIn(seg(u,.88,1)));a=1-seg(u,.9,1);}return {Ls,a};}
function sc6(u){
  const {Ls,a}=cv6(u),deck=wlAt(Ls+230,.3)-20,pv={x:Ls+420,y:deck-40};
  vsl(Ls,460,false,{damp:.3,a},vCraneVessel);
  const jb=u<.15?{x:Ls+315,y:deck}:kf(u,[[.15,Ls+315,deck],[.22,Ls+315,380],[.28,OX,380],[.36,OX,bedOX]]);
  const tb=u<.5?{x:Ls+175,y:deck}:kf(u,[[.5,Ls+175,deck],[.6,Ls+175,256],[.68,OX,256],[.76,OX,440]]);
  drawJacket(jb.x,jb.y,JH,true);
  if(u>.36)drawPins(OX,bedOX,ease(seg(u,.38,.5)),u>.38&&u<.5?Math.max(0,1-((seg(u,.38,.5)*9)%1)*3):0);
  drawTopside(tb.x,tb.y,seg(u,.78,.9));
  if(u>=.15&&u<.36)slings(jb.x,jb.y-JH-26,[jb.x-40,jb.y-JH-2,jb.x+40,jb.y-JH-2]);
  if(u>=.5&&u<.76)slings(tb.x,tb.y-144,[tb.x-70,tb.y-84,tb.x+64,tb.y-84]);
  alphaDo(a,()=>{
    const stow={x:Ls+330,y:deck-130};let hk;
    if(u<.12)hk=stow;else if(u<.15)hk=lerpPt(stow,{x:Ls+315,y:deck-JH-26},ease(seg(u,.12,.15)));
    else if(u<.36)hk={x:jb.x,y:jb.y-JH-26};else if(u<.44)hk=lerpPt({x:OX,y:bedOX-JH-26},{x:OX-60,y:150},ease(seg(u,.36,.44)));
    else if(u<.5)hk=lerpPt({x:OX-60,y:150},{x:Ls+175,y:deck-144},ease(seg(u,.44,.5)));
    else if(u<.76)hk={x:tb.x,y:tb.y-144};else if(u<.86)hk=lerpPt({x:OX,y:296},{x:OX-60,y:130},ease(seg(u,.76,.86)));
    else hk=lerpPt({x:OX-60,y:130},stow,ease(seg(u,.86,.96)));
    crane(pv.x,pv.y,400,hk.x,hk.y,{col:'#e8a33a'});
  });
  lab(Ls+33,deck-106,'大型起重船',{dy:-30,a:band(u,.02,.2)});
  lab(jb.x+48,jb.y-JH*.5,'套管式基礎 Jacket',{dx:70,dy:-20,a:band(u,.16,.4)});
  lab(OX+66,bedOX-20,'打入針樁',{dx:60,dy:30,a:band(u,.38,.52)});
  lab(tb.x+64,tb.y-60,'上部模組',{dx:70,dy:-30,a:band(u,.5,.78)});
  lab(OX-12,392,'主變壓器',{dx:-30,dy:-80,a:band(u,.76,1,.04)});
  lab(OX-90,344,'直升機平台',{dx:-60,dy:-40,a:band(u,.8,1)});
  lab(OX-60,bedOX-70,'J 形管',{dx:-70,dy:0,a:band(u,.8,1)});
}
function hud6(u){
  hudPanel(250,134,'升壓送電',band(u,.5,1),(w)=>{
    htext(14,52,'陣列海纜',11,'rgba(227,236,238,.8)');htext(14,74,'66 kV',19,'#fff',700,COND);
    rrp(86,40,58,42,6);ctx.fillStyle='#56626a';ctx.fill();htext(115,58,'主變',12,'#fff',700,FONT,'center');htext(115,74,'壓器',12,'#fff',700,FONT,'center');
    arrowR(64,62,8,'#f2c230');arrowR(150,62,8,'#f2c230');
    htext(w-14,52,'輸出海纜',11,'rgba(227,236,238,.8)',500,FONT,'right');htext(w-14,74,'161 kV',19,'#f2c230',700,COND,'right');
    htext(14,108,'電壓升高、電流變小，',12,'rgba(227,236,238,.75)');htext(14,124,'長距離輸電損耗更低',12,'rgba(227,236,238,.75)');
  });
}

/* ================= CH7 cables ================= */
function clvS(u){if(u<.12)return lerp(-500,TX+30,easeOut(seg(u,0,.12)));if(u<.24)return TX+30;return lerp(TX+30,985,ease(seg(u,.24,.54)));}
function clvS2(u){return u<.74?1336:lerp(1336,1215,ease(seg(u,.74,.88)));}
function rovX1(u){if(u<.34)return TX+45;let x=lerp(TX+45,OX-85,seg(u,.34,.68));if(u<.54){const TD=Math.max(TX+40,clvS(u)-70);x=Math.min(x,TD-40);}return Math.max(x,TX+45);}
function rovX2(u){if(u<.86)return 1340;return lerp(1340,OX+85,seg(u,.86,.99));}
const burA=(x,r)=>clamp((x-(TX+30))/15)*clamp((r-x)/15);
const burB=(x,r)=>clamp((1340-x)/15)*clamp((x-r)/15);
const jtube=s=>[{x:OX+62*s,y:bedOX-15},{x:OX+59*s,y:bedOX-40},{x:OX+46*s,y:444}];
function iaPts(u){
  if(u<.12)return null;
  const A={x:TX+15,y:bedTX-20},S=clvS(u),ch={x:S-4,y:wlAt(S+125,.4)+3};
  if(u<.24){const p=ease(seg(u,.12,.24)),E=lerpPt(ch,A,p),P=[];for(let i=0;i<=16;i++)P.push(bez(ch,{x:ch.x-4,y:lerp(ch.y,E.y,.7)},{x:lerp(E.x,ch.x,.35),y:E.y+4},E,i/16));return P.reverse();}
  const r=rovX1(u),P=[A,{x:TX+35,y:bedY(TX+35)-2}];
  const end=u<.54?Math.max(TX+40,S-70):lerp(915,OX-85,ease(seg(u,.54,.57)));
  for(let x=TX+40;x<end;x+=6)P.push({x,y:bedY(x)-2+13*burA(x,r)});
  P.push({x:end,y:bedY(end)-2+13*burA(end,r)});
  if(u<.54){const td=P[P.length-1];for(let i=1;i<=14;i++)P.push(bez(td,{x:lerp(td.x,ch.x,.45),y:td.y},{x:ch.x-6,y:lerp(ch.y,td.y,.45)},ch,i/14));}
  else if(end>=OX-86)P.push(...partial(jtube(-1),seg(u,.56,.6)));
  return P;
}
function landPts(){const L=[];for(let i=0;i<=20;i++)L.push(hddPt(i/20));L.push({x:1556,y:437});return L;}
function exPts(u){
  if(u<.66)return null;
  const S2=clvS2(u),ch={x:S2+4,y:wlAt(S2-125,.4)+3},X={x:1350,y:bedY(1350)},land=landPts();
  if(u<.74){const P=[];for(let i=0;i<=12;i++)P.push(bez(ch,{x:ch.x+4,y:lerp(ch.y,X.y,.7)},{x:lerp(X.x,ch.x,.4),y:X.y},X,i/12));P.push(...land.slice(1));return partial(P,ease(seg(u,.66,.74)));}
  const r=rovX2(u),P=land.slice().reverse();
  const end=u<.88?Math.min(1350,S2+70):lerp(1285,OX+85,ease(seg(u,.88,.91)));
  for(let x=1344;x>end;x-=6)P.push({x,y:bedY(x)-2+13*burB(x,r)});
  P.push({x:end,y:bedY(end)-2+13*burB(end,r)});
  if(u<.88){const td=P[P.length-1];for(let i=1;i<=14;i++)P.push(bez(td,{x:lerp(td.x,ch.x,.45),y:td.y},{x:ch.x+6,y:lerp(ch.y,td.y,.45)},ch,i/14));}
  else if(end<=OX+86)P.push(...partial(jtube(1),seg(u,.9,.95)));
  return P;
}
function drawCables(){
  if(SC<7)return;const u=uc(7);
  const ia=iaPts(u),ex=exPts(u);
  drawCable(ia);drawCable(ex);
  if(ia&&u>=.24){ln([TX+15,bedTX-20,TX+40,bedY(TX+40)-1],'rgba(232,87,42,.9)',5.5);}
}
function sc7(u){
  const S=clvS(u),wl=wlAt(S+125,.4);
  const r1=rovX1(u),ra=seg(u,.28,.33)*(1-seg(u,.68,.72));
  if(ra>0){const bw=wlAt(r1+45,.7),ry=u<.34?lerp(bw+10,bedY(r1),ease(seg(u,.3,.34))):bedY(r1);
    alphaDo(ra,()=>{ctx.strokeStyle='#f2c230';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(r1-16,bw-44);ctx.quadraticCurveTo(r1-30,(bw+ry)/2,r1-4,ry-19);ctx.stroke();
      if(u>.3)rov(r1,ry,TT,u>.34&&u<.68);vsl(r1-10,110,false,{tilt:.5},vSmallWork);});}
  const r2=rovX2(u),ra2=seg(u,.84,.87)*(1-seg(u,.97,1));
  if(ra2>0){const bw=wlAt(r2-45,.7),ry=u<.87?lerp(bw+10,bedY(r2),ease(seg(u,.84,.87))):bedY(r2);
    alphaDo(ra2,()=>{ctx.strokeStyle='#f2c230';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(r2+16,bw-44);ctx.quadraticCurveTo(r2+30,(bw+ry)/2,r2+4,ry-19);ctx.stroke();
      if(u>.84){ctx.save();ctx.translate(r2,0);ctx.scale(-1,1);rov(0,ry,TT,u>.87&&u<.99);ctx.restore();}vsl(r2+10,110,true,{tilt:.5},vSmallWork);});}
  if(u<.62)vsl(S,250,false,{damp:.4,a:1-seg(u,.58,.62)},vCLV);
  const S2=clvS2(u),wl2=wlAt(S2-125,.4);
  if(u>.62&&u<.95)vsl(S2,250,true,{damp:.4,a:seg(u,.62,.66)*(1-seg(u,.9,.95))},vCLV);
  const wa=band(u,.63,.78);if(wa>0)alphaDo(wa,()=>{box(1548,425,20,12,'#e8a33a');circ(1553,438,2.4,'#222');circ(1564,438,2.4,'#222');circ(1558,428,4,'#394650');});
  lab(S+208,wl-76,'海纜鋪設船 CLV',{dy:-30,a:band(u,.02,.2)});
  lab(S+95,wl-46,'海纜轉盤',{dx:-40,dy:-54,a:band(u,.05,.3)});
  lab(TX+15,bedTX-20,'拉入風機基礎',{dx:-70,dy:-40,a:band(u,.12,.28)});
  lab(TX+80,bedY(TX+80)-2,'陣列海纜 66 kV',{dx:-50,dy:-60,a:band(u,.26,.56)});
  if(ra>0)lab(r1,bedY(r1)-20,'埋設機：高壓水刀開溝',{dx:60,dy:-90,a:band(u,.36,.6)*ra});
  lab(OX-62,bedOX-15,'拉入 J 形管',{dx:-70,dy:-40,a:band(u,.55,.63)});
  const hp=hddPt(.45);lab(hp.x,hp.y,'HDD 登陸導管',{dx:30,dy:60,a:band(u,.63,.82)});
  lab(1558,424,'陸上絞機',{dx:10,dy:-44,a:band(u,.66,.76),minor:true});
  lab(1290,bedY(1290),'輸出海纜 161 kV',{dx:0,dy:-60,a:band(u,.76,.92)});
  lab(1546,414,'陸上變電站',{dx:40,dy:-40,a:band(u,.7,1)});
  lab(OX+62,bedOX-15,'拉入 J 形管',{dx:60,dy:-40,a:band(u,.89,.98)});
  if(ra2>0)lab(r2,bedY(r2)-20,'埋設機',{dx:-40,dy:-50,a:ra2,minor:true});
}
function hud7(u){
  hudPanel(226,236,'海纜剖面（3 芯 XLPE）',band(u,.1,.6),(w)=>{
    const cx=74,cy=128,R=56;
    circ(cx,cy,R,'#1b1f22');for(let i=0;i<40;i++){const a=i/40*TAU;circ(cx+Math.cos(a)*(R-6),cy+Math.sin(a)*(R-6),3.2,'#9aa5ab','#5d6b74',.6);}
    circ(cx,cy,R-11,'#3a3f44');
    for(let i=0;i<3;i++){const a=-Math.PI/2+i*TAU/3,x=cx+Math.cos(a)*22,y=cy+Math.sin(a)*22;circ(x,y,17.5,'#1c1c1c');circ(x,y,16,'#e9ecef');circ(x,y,9,'#c87533');}
    circ(cx,cy+2,4.5,'#f2c230');
    const L=(y,t,tx,ty)=>{ln([tx,ty,142,y],'rgba(255,255,255,.55)',1);htext(146,y+4,t,12,'#fff',500);};
    L(62,'銅導體',cx,cy-22);L(96,'XLPE 絕緣',cx+14,cy+14);L(130,'光纖單元',cx+4,cy+2);L(164,'鋼線鎧裝',cx+R-6,cy+10);
    htext(14,210,'陣列 66 kV　輸出 161–220 kV',12,'rgba(227,236,238,.75)');
    htext(14,227,'埋深約 1–3 m',12,'rgba(227,236,238,.75)');
  });
}

/* ================= CH8-10 WTIV ================= */
function wtivState(){
  const c=SC,u=SU;if(c<8||c>11)return null;
  let R=TX-45,a=1;
  if(c===8)R=lerp(2100,TX-45,easeOut(seg(u,0,.18)));
  if(c===11){R=lerp(TX-45,TX-700,easeIn(seg(u,0,.16)));a=1-seg(u,.08,.16);if(a<=0)return null;}
  const wl=wlAt(R-240,.25),fl=wl-22,bed=bedY(R-240)+12;
  let d=395,lb=bed;
  if(c===8){if(u<.32){d=fl;lb=u<.18?fl+38:lerp(fl+38,bed,ease(seg(u,.18,.32)));}else d=lerp(fl,395,ease(seg(u,.32,.45)));}
  if(c===10&&u>.84){d=lerp(395,fl,ease(seg(u,.84,.93)));lb=u<.93?bed:lerp(bed,d+38,ease(seg(u,.93,1)));}
  if(c===11){d=fl;lb=fl+38;}
  return {R,d,lb,a};
}
const SECB=[.45,.63,.80],BLB=[.02,.29,.56];
function secState(k,w){
  if(SC>8)return {m:'set'};if(SC<8)return {m:'deck'};
  const b=SECB[k],u=SU;if(u<b)return {m:'deck'};if(u>=b+.15)return {m:'set'};
  const cx=w.R-240+30*k,pb=TP_TOP-k*HS,hy=Math.min(pb-40,w.d-60);
  const p=kf(u,[[b,cx,w.d],[b+.05,cx,hy],[b+.1,TX,hy],[b+.15,TX,pb]]);return {m:'hang',x:p.x,y:p.y};
}
function nacState(w){
  if(SC>9)return {m:'set'};if(SC<9)return {m:'deck'};const u=SU;
  if(u<.1)return {m:'deck'};if(u>=.58)return {m:'set'};
  const p=kf(u,[[.1,w.R-110,w.d],[.3,w.R-110,120],[.45,TX,120],[.58,TX,TW_TOP]]);return {m:'hang',x:p.x,y:p.y};
}
function bladeState(k,w){
  if(SC>10)return {m:'set'};if(SC<10)return {m:'rack'};const u=SU,b=BLB[k];
  if(u<b)return {m:'rack'};if(u>=b+.215)return {m:'set'};
  const ry=w.d-38+12*k;
  const p=kf(u,[[b,w.R-262,ry],[b+.06,w.R-202,ry-60],[b+.11,HUB.x-49,130],[b+.17,HUB.x-49,HUB.y],[b+.2,HUB.x,HUB.y]]);return {m:'hang',x:p.x,y:p.y};
}
function rotorAng(){
  const u10=uc(10);let a=Math.PI+TAU/3*ease(seg(u10,.24,.29))+TAU/3*ease(seg(u10,.51,.56));
  const t=ROT_T();if(t>0)a+=t<4?.95*t*t/8:.95*(t-2);return a;
}
function rotorW(){const t=ROT_T();return t<=0?0:clamp(t/4);}
function nBlades(){if(SC>10)return 3;if(SC<10)return 0;let n=0;for(let k=0;k<3;k++)if(SU>=BLB[k]+.215)n++;return n;}
const bladeLug=(x,y)=>({x:x-.35*BR,y:y-14});
function wtivHook(w){
  const c=SC,u=SU,R=w.R,d=w.d,stow={x:R-360,y:d-150},stowB={x:R-200,y:d-200};
  const pre0={x:R-262-.35*BR,y:d-38-14-80};
  if(c===8){
    if(u<.4)return stow;
    const secLug=(k)=>({x:R-240+30*k,y:d-HS-8});
    if(u<.45)return lerpPt(stow,secLug(0),ease(seg(u,.4,.45)));
    for(let k=0;k<3;k++){const b=SECB[k];
      if(u<b+.15){const s=secState(k,w);return {x:s.x,y:s.y-HS-8};}
      const nb=k<2?SECB[k+1]:1,placed={x:TX,y:TP_TOP-k*HS-HS-8},tgt=k<2?secLug(k+1):stowB;
      if(u<nb||k===2)return lerpPt(placed,tgt,ease(seg(u,b+.15,k<2?nb:1)));}
  }
  if(c===9){
    const lug=(p)=>({x:p.x+16,y:p.y-66});
    if(u<.1)return lerpPt(stowB,lug({x:R-110,y:d}),ease(seg(u,0,.1)));
    if(u<.58){const s=nacState(w);return lug(s);}
    if(u<.64)return lug({x:TX,y:TW_TOP});
    return lerpPt(lug({x:TX,y:TW_TOP}),pre0,ease(seg(u,.64,.8)));
  }
  if(c===10){
    const rackLug=k=>bladeLug(R-262,d-38+12*k);
    if(u<BLB[0])return lerpPt(pre0,rackLug(0),ease(seg(u,0,BLB[0])));
    for(let k=0;k<3;k++){const b=BLB[k];
      if(u<b+.215){const s=bladeState(k,w);const p=s.m==='hang'?s:{x:HUB.x,y:HUB.y};return bladeLug(p.x,p.y);}
      const nb=k<2?BLB[k+1]:.84,from=bladeLug(HUB.x,HUB.y),tgt=k<2?rackLug(k+1):stowB;
      if(u<nb||k===2)return lerpPt(from,tgt,ease(seg(u,b+.215,nb)));}
  }
  return stowB;
}
function tagLine(x0,y0,x1,y1){ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2,Math.max(y0,y1)+30,x1,y1);ctx.stroke();}
function scWTIV(){
  const w=wtivState();if(!w)return;const c=SC,u=SU,{R,d}=w;
  alphaDo(w.a,()=>{
    drawWTIV(R,d,w.lb);
    for(let k=0;k<3;k++){if(bladeState(k,w).m==='rack')drawBlade(R-262,d-38+12*k,Math.PI,BR);}
    for(let k=0;k<3;k++){if(secState(k,w).m==='deck')drawTowerSec(R-240+30*k,d,k);}
    const ns=nacState(w);if(ns.m==='deck'){drawNacelle(R-110,d,0,false);drawRotor(R-154,d-20,0,0);}
    if(c===8)for(let k=0;k<3;k++){const s=secState(k,w);if(s.m==='hang')drawTowerSec(s.x,s.y,k);}
    if(c===9&&ns.m==='hang'){drawNacelle(ns.x,ns.y,0,false);drawRotor(ns.x-44,ns.y-20,0,0);tagLine(ns.x+60,ns.y-8,R-60,d-4);}
    if(c===10)for(let k=0;k<3;k++){const s=bladeState(k,w);if(s.m==='hang'){drawBlade(s.x,s.y,Math.PI,BR);box(s.x-.5*BR,s.y-9,.3*BR,17,'#394650');const lg=bladeLug(s.x,s.y);slings(lg.x,lg.y,[s.x-.48*BR,s.y-9,s.x-.22*BR,s.y-9]);tagLine(s.x-.5*BR,s.y+8,R-300,d-2);tagLine(s.x-.2*BR,s.y+8,R-150,d-2);}}
    const hk=wtivHook(w);crane(R-25,d-26,370,hk.x,hk.y,{col:'#f2c230'});
  });
  if(c===8){
    lab(R-240,d-60,'自升式風機安裝船 WTIV',{dy:-36,a:band(u,.02,.2)});
    lab(R-110,d-40,'機艙',{dy:-30,a:band(u,.04,.3),minor:true});lab(R-340,d-44,'葉片',{dy:-30,a:band(u,.04,.3),minor:true});lab(R-210,d-80,'塔架段',{dy:-30,a:band(u,.04,.3),minor:true});
    lab(R-25,w.lb,'樁腿插入海床並預壓',{dx:70,dy:-20,a:band(u,.2,.36)});
    lab(R-240,d+32,'船身頂升離開水面',{dx:0,dy:44,st:'s',a:band(u,.33,.47)});
    for(let k=0;k<3;k++){const s=secState(k,w);if(s.m==='hang')lab(s.x+13,s.y-HS/2,`第 ${k+1} 段塔架`,{dx:60,dy:-10,a:1});
      const pb=TP_TOP-k*HS,b=SECB[k];lab(TX+13,pb-2,'法蘭螺栓鎖固',{dx:70,dy:0,st:'s',a:band(u,b+.15,b+.18,.01)});}
  }
  if(c===9){
    const ns=nacState(w);if(ns.m==='hang')lab(ns.x+62,ns.y-20,'機艙（含輪轂）',{dx:60,dy:-20,a:band(u,.1,.56)});
    if(ns.m==='hang')lab(ns.x+60,ns.y-8,'導引繩',{dx:80,dy:40,a:band(u,.16,.5),minor:true});
    lab(TX,TW_TOP-2,'對準偏航軸承，螺栓鎖固',{dx:80,dy:30,st:'s',a:band(u,.56,.72)});
    const ca=band(u,.74,1);const ax=TX,ay=TW_TOP;
    lab(ax-44,ay-20,'輪轂',{dx:-60,dy:40,a:ca});lab(ax-20,ay-24,'主軸承',{dx:-60,dy:-70,a:ca});lab(ax-2,ay-26,'發電機',{dx:-10,dy:-96,a:ca});
    lab(ax+19,ay-26,'變流器',{dx:40,dy:-96,a:ca});lab(ax+42,ay-22,'變壓器',{dx:130,dy:10,a:ca});lab(ax+43,ay-44,'冷卻系統',{dx:90,dy:-80,a:ca});lab(ax,ay-7,'偏航驅動',{dx:80,dy:46,a:ca});
  }
  if(c===10){
    for(let k=0;k<3;k++){const s=bladeState(k,w);if(s.m==='hang')lab(s.x-.35*BR,s.y-12,k===0?'葉片夾具 Blade yoke':`第 ${k+1} 支葉片`,{dx:-30,dy:-50,a:1});}
    lab(HUB.x,HUB.y,'盤車裝置：輪轂轉 120°',{dx:90,dy:40,st:'s',a:band(u,.23,.3)+band(u,.5,.57)});
    lab(R-150,d-6,'導引繩控制姿態',{dx:-20,dy:50,a:band(u,.06,.2),minor:true});
    lab(R-330,d,'降下船身、收起樁腿',{dx:0,dy:-60,a:band(u,.84,1)});
  }
}
function fx9(u){if(u<.56||u>.66)return;const q=seg(u,.56,.64),k=Math.floor(q*10);for(let i=0;i<=k&&i<10;i++){circ(TX-12+(i%5)*6,TW_TOP-1,i===k?3:1.5,`rgba(255,236,150,${i===k?1-((q*10)%1):.35})`);}}
function hudW(){
  const c=SC,u=SU,w=wtivState();if(!w)return;
  if(c===8)hudPanel(226,128,'自升式安裝船',seg(u,.16,.22),(ww)=>{
    const st=u<.18?'航行進場':u<.32?'樁腿插入海床':u<.45?'頂升中':'吊裝作業';hrow(50,'狀態',st,ww,'#f2c230');
    const gap=Math.max(0,(SEA-(w.d+32))/1.95);hrow(76,'氣隙（船底至海面）',gap>0?gap.toFixed(1)+' m':'—',ww);
    hrow(102,'樁腿長度','約 110 m',ww);
    htext(14,120,'（示意數值）',10,'rgba(227,236,238,.5)');});
  if(c===9)hudPanel(226,118,'機艙（15 MW 級示例）',seg(u,.06,.12),(ww)=>{hrow(50,'額定功率','15 MW',ww,'#f2c230');hrow(76,'輪轂高度','約 150 m',ww);hrow(102,'機艙＋輪轂','數百公噸',ww);});
  if(c===10)hudPanel(226,146,'葉片吊裝',seg(u,.02,.08)*(1-seg(u,.82,.86)),(ww)=>{hrow(50,'葉片長度','> 100 m',ww);hrow(76,'作業風速上限','約 10–12 m/s',ww);
    const v=7.4+.4*Math.sin(TT*.9);hrow(102,'目前風速',v.toFixed(1)+' m/s',ww,'#6fe07a');hrow(128,'已安裝',nBlades()+' / 3',ww,'#f2c230');});
}

/* ================= CH11 commissioning ================= */
const PPATH=(()=>{const P=[],add=(x,y)=>P.push({x,y});
  add(TX,190);add(TX,420);add(TX,470);add(TX,bedTX-20);add(TX+15,bedTX-20);add(TX+38,bedY(TX+38)-1);
  for(let x=TX+45;x<=OX-85;x+=10)add(x,bedY(x)+11);
  add(OX-62,bedOX-15);add(OX-59,bedOX-40);add(OX-46,444);add(OX-10,410);add(OX+46,444);add(OX+59,bedOX-40);add(OX+62,bedOX-15);
  for(let x=OX+85;x<=1340;x+=10)add(x,bedY(x)+11);
  for(let i=0;i<=20;i++){const p=hddPt(i/20);add(p.x,p.y);}
  add(1556,437);add(1574,428);add(1594,400);add(1612,334);
  let L=0;P[0].l=0;for(let i=1;i<P.length;i++){L+=Math.hypot(P[i].x-P[i-1].x,P[i].y-P[i-1].y);P[i].l=L;}P.L=L;return P;})();
function ppAt(l){const P=PPATH;let lo=0,hi=P.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(P[m].l<l)lo=m;else hi=m;}const a=P[lo],b=P[hi],t=(l-a.l)/((b.l-a.l)||1);return {x:lerp(a.x,b.x,t),y:lerp(a.y,b.y,t),i:lo};}
function ctv11(u){if(u<.52)return {x:lerp(TX-620,TX-114,easeOut(seg(u,.14,.22))),a:seg(u,.14,.17)};return {x:lerp(TX-114,TX-520,easeIn(seg(u,.52,.62))),a:1-seg(u,.55,.62)};}
function sc11(u){
  const fa=seg(u,.45,.55);
  if(fa>0)alphaDo(fa,()=>{school(TX-70,600,9,21,TT,26,1,'rgba(242,214,120,.85)');school(TX+60,650,8,22,TT,24,-1);school(OX-10,640,9,23,TT,30,1,'rgba(242,214,120,.85)');});
  const cv=ctv11(u),cwl=wlAt(cv.x+37,.9);
  if(u>.14)vsl(cv.x,74,false,{a:cv.a,tilt:.5},vCTV);
  if(u>.22&&u<.4){for(let i=0;i<2;i++){const s=u-i*.03;if(s<.22)continue;const p=kf(s,[[.22,TX-50,cwl-12],[.25,TX-33,cwl-12],[.31,TX-33,TP_TOP-3],[.34,TX+7,TP_TOP-3]]);alphaDo(1-seg(s,.34,.36),()=>person(p.x,p.y,'#e8572a',1));}}
  const ss=lerp(TX-900,TX-300,easeOut(seg(u,.58,.72))),swl=wlAt(ss+115,.5);
  if(u>.58){vsl(ss,230,false,{damp:.5,a:seg(u,.58,.62)},vSOV);
    if(u>.72){const p=ease(seg(u,.72,.8)),gx0=ss+117,gy0=swl-46,gx1=lerp(gx0,TX-57,p),gy1=lerp(gy0,TP_TOP-4,p);ln([gx0,gy0,gx1,gy1],'#8a5a12',4.6);ln([gx0,gy0,gx1,gy1],'#f2a33a',3);ln([gx0,gy0-7,gx1,gy1-7],'#f2a33a',1.2);for(let i=0;i<=6;i++){const t=i/6;ln([lerp(gx0,gx1,t),lerp(gy0,gy1,t),lerp(gx0,gx1,t),lerp(gy0,gy1,t)-7],'#f2a33a',1);}
      if(u>.8){const q=ease(seg(u,.8,.9));person(lerp(gx0,TX-57,q),lerp(gy0,TP_TOP-4,q)-1,'#f2c230',1);}}}
  lab(cv.x+42,cwl-28,'人員運輸船 CTV',{dy:-40,a:band(u,.16,.34)*cv.a});
  lab(TX-33,440,'技術人員登塔',{dx:-120,dy:24,a:band(u,.22,.36)});
  lab(HUB.x,HUB.y-60,'偏航對風、葉片變槳',{dx:60,dy:-30,a:band(u,.34,.46)});
  lab(OX,370,'海上變電站升壓',{dx:40,dy:-60,a:band(u,.43,.72)});
  lab(880,bedY(880)+11,'陣列海纜',{dx:0,dy:-50,a:band(u,.43,.72)});
  lab(1250,bedY(1250)+11,'輸出海纜',{dx:-10,dy:-60,a:band(u,.46,.74)});
  lab(1600,380,'陸上變電站 → 電網',{dx:-30,dy:-60,a:band(u,.48,.78)});
  lab(ss+190,swl-80,'運維母船 SOV',{dy:-34,a:band(u,.62,.82)});
  lab(TX-110,TP_TOP-14,'動態補償舷梯',{dx:-40,dy:-60,a:band(u,.74,.92)});
  lab(TX-70,610,'基礎成為人工魚礁',{dx:-80,dy:40,a:band(u,.52,.95)});
}
function fx11(u){
  const pa=SC===11?seg(u,.4,.46):1;if(pa<=0)return;
  const n=46,sp=140;
  for(let i=0;i<n;i++){const l=((T*sp+i*PPATH.L/n)%PPATH.L);const p=ppAt(l);const hv=p.i>40;
    const rg=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,11);rg.addColorStop(0,`rgba(255,${hv?190:228},${hv?60:110},${.8*pa})`);rg.addColorStop(1,'rgba(255,210,80,0)');ctx.fillStyle=rg;ctx.fillRect(p.x-11,p.y-11,22,22);circ(p.x,p.y,2.4,`rgba(255,248,210,${pa})`);}
}
function hud11(u){
  hudPanel(236,176,'風機運轉狀態',seg(u,.34,.4),(w)=>{
    const f=rotorW(),pw=15*ease(clamp(f*1.1));
    hrow(50,'風速','11.4 m/s',w);hrow(76,'轉速',(7.4*f).toFixed(1)+' rpm',w);
    hrow(102,'輸出功率',pw.toFixed(1)+' MW',w,'#f2c230');hbar(14,110,w-28,pw/15,'#f2c230');
    hrow(140,'每轉一圈約發','34 度電',w);
    const pt=tr(f>.9?'併網發電中':'啟動中');ctx.font=`700 11px ${FONT}`;rrp(14,150,Math.min(w-28,ctx.measureText(pt).width+20),20,10);ctx.fillStyle=f>.9?'#1f7f5c':'#4f6470';ctx.fill();htext(24,164,pt,11,'#fff',700);
  });
}

/* ================= persistent structures ================= */
function drawStructures(){
  const c=SC;
  if(c>6){drawJacket(OX,bedOX,JH,true);drawPins(OX,bedOX,1,0);drawTopside(OX,440,1);}
  if(c>4)drawPile(TX,PILE_BOT,Math.PI/2,PILE_L,PILE_W);
  if(c>5)drawTP(TX,TP_BOT);
  if(c>=8){const w=wtivState();for(let k=0;k<3;k++){if(c>8||(w&&secState(k,w).m==='set'))drawTowerSec(TX,TP_TOP-k*HS,k);}}
  if(c>=9){const w=wtivState();if(c>9||(w&&nacState(w).m==='set'))drawNacelle(TX,TW_TOP,c===9?seg(SU,.72,.8):0,c>=11&&(T%2)<1);}
  if(c>=9){const n=nBlades();if(c>9||nacState(wtivState()).m==='set')drawRotor(HUB.x,HUB.y,rotorAng(),n);}
}
