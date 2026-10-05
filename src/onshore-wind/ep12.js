// KITS: land
/* 陸域風電系列 第 12 集：擴展式基礎施工 */
/* 側視場景座標：基礎中心 CX，地面 GL；水平 30 px/m、垂直 45 px/m（深度放大顯示） */
const CX=800,GL=600,KH=30,KV=45;
const SB=750,PB=758,PT=585;                 /* 基礎底、墊層底、基座頂 */
const FND=[500,750,500,696,710,615,710,585,890,585,890,615,1100,696,1100,750];
const PIT=p=>{const w=435-105*p,y=GL+(PB-GL)*p;return [365,GL,CX-w,y,CX+w,y,1235,GL];};
const fmtK=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,',');
const REB='#a0603f',CON='#b9bfc2';
/* 卡片內的一列與條列 */
function rowK(x,y,label,val,col,w){wt(x,y,label,18,'rgba(227,236,238,.85)',600);wt(x+w,y,val,22,col,700,'right',COND);}
function bullets(x,y,L,u,k0,dk,gap){L.forEach(([t,col],i)=>alphaDo(seg(u,k0+i*dk,k0+i*dk+.05),()=>{circ(x,y+i*gap-6,5,col==='#fff'?'#f2c230':col);wt(x+18,y+i*gap,t,18,col,600);}));}
function clipAbove(y,fn){ctx.save();ctx.beginPath();ctx.rect(-3000,-3000,8000,y+3000);ctx.clip();fn();ctx.restore();}
function clipBelow(y,fn){ctx.save();ctx.beginPath();ctx.rect(-3000,y,8000,4000);ctx.clip();fn();ctx.restore();}
/* 錨栓籠：上下錨板與兩圈錨栓（側視投影） */
function cage(dy,tilt,a){alphaDo(a===undefined?1:a,()=>{ctx.save();ctx.translate(CX,655+dy);ctx.rotate(tilt||0);ctx.translate(-CX,-655);
  for(const back of [true,false])for(const r of [2.0,2.3])for(let i=0;i<30;i++){const th=i/30*TAU+(r>2.1?.1:0),s=Math.sin(th);if((s<0)!==back)continue;
   const x=CX+r*KH*Math.cos(th);ln([x,736,x,572],back?'rgba(70,84,92,.55)':'#4a5961',back?1.6:2.4);}
  box(725,728,150,9,'#8a99a3','rgba(0,0,0,.5)',1);box(725,580,150,8,'#cfd6db','rgba(0,0,0,.5)',1);ctx.restore();});}
/* 一個施工階段的剖面 */
function stage(o){
  const dig=o.dig===undefined?1:o.dig,lv=o.fill===undefined?PB+10:lerp(SB,PT,o.fill);
  if(dig>0){const P=PIT(dig);poly(P,'#7d6450');ln(P,'rgba(0,0,0,.25)',1.5);
   for(let k=1;k<4;k++){const f=k/4*dig;if(f<.05)continue;const Q=PIT(f);ln([lerp(365,Q[2],1),Q[3],Q[4],Q[5]],'rgba(0,0,0,.08)',1);}}
  if(o.back>0){const by=lerp(PB,GL,o.back);clipBelow(by,()=>{poly(PIT(1),'#8f7458');for(let y=PB-20;y>by;y-=24)ln([350,y,1250,y],'rgba(0,0,0,.12)',1.5);});}
  if(o.blind>0)box(470,SB,660*o.blind,PB-SB,'#9aa3a8','rgba(0,0,0,.25)',1);
  if(o.form)alphaDo(o.form,()=>{box(491,690,9,62,'#b07a3e');box(1100,690,9,62,'#b07a3e');box(702,580,8,38,'#b07a3e');box(890,580,8,38,'#b07a3e');});
  clipAbove(lv,()=>{
   if(o.rb1>0){const x1=lerp(504,1096,o.rb1);ln([504,741,x1,741],REB,3);for(let x=510;x<x1;x+=14)circ(x,736,2.4,REB);}
   if(o.rb2>0){const P=[504,688,716,607,884,607,1096,688];alphaDo(o.rb2,()=>{ln(P,REB,3);for(let x=510;x<1096;x+=16){const r=Math.abs(x-CX)/KH;const y=r<3.2?612:lerp(612,693,(r-3.2)/6.8);circ(x,y-4,2.2,REB);}});}
   if(o.cage)cage(o.cage.dy||0,o.cage.tilt||0,o.cage.a);});
  if(o.fill>0){clipBelow(lv,()=>{poly(FND,CON,'rgba(0,0,0,.35)',1.5);poly([CX+40,750,CX+40,585,890,585,890,615,1100,696,1100,750],'rgba(0,0,0,.07)');
    if(o.layers)for(let y=SB-22;y>PT;y-=22)ln([500,y,1100,y],'rgba(0,0,0,.08)',1);});
   if(o.fill<1)ln([480,lv,1120,lv],'rgba(90,100,105,.6)',2);
   if(o.cage&&o.fill>=1)clipAbove(PT,()=>cage(0,0,1));}
  if(o.grout>0)alphaDo(o.grout,()=>box(733,578,134,7,'#e3e8ec','rgba(0,0,0,.4)',1));
  if(o.tower!==undefined){const ty=578-o.tower;box(735,ty-1200,130,1200,'#eef2f4','rgba(0,0,0,.3)',1);box(800,ty-1200,65,1200,'rgba(0,0,0,.06)');
   box(722,ty-14,156,14,'#8a99a3','rgba(0,0,0,.5)',1);box(790,ty-120,20,90,'#5b6a73');}
}
function spoil(k){if(k<=0)return;const h=120*k;poly([1420,GL,1470,GL-h*.7,1520,GL-h,1575,GL-h*.85,1640,GL],'#8f7458','rgba(0,0,0,.25)',1);}
/* 怪手（朝左），B 為鏟斗位置 */
function excav(x,y,B){const P={x:x-60,y:y-62},L1=230,L2=200;let d=Math.hypot(B.x-P.x,B.y-P.y);d=Math.min(d,L1+L2-2);
  const a=Math.atan2(B.y-P.y,B.x-P.x),c=Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1));
  const E1={x:P.x+L1*Math.cos(a-c),y:P.y+L1*Math.sin(a-c)},E2={x:P.x+L1*Math.cos(a+c),y:P.y+L1*Math.sin(a+c)},E=E1.y<E2.y?E1:E2;
  const T={x:P.x+Math.cos(a)*d,y:P.y+Math.sin(a)*d};
  rrp(x-85,y-30,170,30,14);ctx.fillStyle='#2b3137';ctx.fill();for(let k=-3;k<=3;k++)circ(x+k*22,y-15,7,'#4a5258');
  box(x-75,y-76,150,46,'#e9b21f','rgba(0,0,0,.4)',1);box(x+48,y-72,30,38,'#c99a1a');
  box(x-74,y-124,52,48,'#e9b21f','rgba(0,0,0,.4)',1);box(x-68,y-118,38,28,'#a8d8e8');
  ctx.lineCap='round';ln([P.x,P.y,E.x,E.y],'#e9b21f',16);ln([E.x,E.y,T.x,T.y],'#d9a21a',11);ctx.lineCap='butt';
  ln([P.x+10,P.y-18,lerp(P.x,E.x,.55),lerp(P.y,E.y,.55)-10],'#5b6a73',4);
  poly([T.x-16,T.y-8,T.x+16,T.y-8,T.x+10,T.y+18,T.x-12,T.y+14],'#7f6a2a','rgba(0,0,0,.5)',1);}
/* 預拌車與泵送車 */
function mixer(x,y,flip){ctx.save();ctx.translate(x,y);ctx.scale(1.9,1.9);truck(0,0,flip,'#cfd6db',()=>{
  ctx.save();ctx.translate(46,-50);ctx.rotate(-.12);ctx.beginPath();ctx.ellipse(0,0,44,20,0,0,TAU);ctx.fillStyle='#e3e8ec';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=1;ctx.stroke();
  ctx.beginPath();ctx.ellipse(0,0,44,20,0,0,TAU);ctx.clip();for(let k=-3;k<4;k++){const s=((TT*30+k*22)%154+154)%154-77;ln([s,-22,s+14,22],'#e8572a',4);}ctx.restore();});ctx.restore();}
function pump(x,y,hx,hy){ctx.save();ctx.translate(x,y);ctx.scale(1.9,1.9);truck(0,0,true,'#e9b21f');ctx.restore();
  const P={x:x-110,y:y-80},J1={x:x-260,y:y-200},L2=260,L3=240;let d=Math.hypot(hx-J1.x,hy-J1.y);d=Math.min(d,L2+L3-2);
  const a=Math.atan2(hy-J1.y,hx-J1.x),c=Math.acos(clamp((L2*L2+d*d-L3*L3)/(2*L2*d),-1,1));
  const J2={x:J1.x+L2*Math.cos(a-c),y:J1.y+L2*Math.sin(a-c)},T={x:J1.x+Math.cos(a)*d,y:J1.y+Math.sin(a)*d};
  ctx.lineCap='round';ln([P.x,P.y,J1.x,J1.y],'#e9b21f',12);ln([J1.x,J1.y,J2.x,J2.y],'#e9b21f',10);ln([J2.x,J2.y,T.x,T.y],'#e9b21f',8);ctx.lineCap='butt';
  ln([P.x+4,P.y,J1.x+4,J1.y,J2.x,J2.y+4,T.x,T.y+4],'#394650',2.5);return T;}
/* 溫度歷程模型（示例）：T = 氣溫 + A·(t/tp)·e^(1−t/tp) */
const TEMP=(A,tp)=>t=>28+A*(t/tp)*Math.exp(1-t/tp);
const CORE0=TEMP(42,1.8),SURF0=TEMP(9,1.0),CORE1=TEMP(32,1.7),SURF1=TEMP(19,2.1);
const maxDT=(a,b)=>{let m=0,tm=0;for(let t=0;t<=7;t+=.05){const d=a(t)-b(t);if(d>m){m=d;tm=t;}}return [m,tm];};
const DT0=maxDT(CORE0,SURF0),DT1=maxDT(CORE1,SURF1);

const EP={no:12,slug:'onshore-wind',seriesName:'陸域風電系列',t:'擴展式基礎施工',en:'Building a spread foundation',
lede:'風機塔架的所有力量，最後都落在地面下一座直徑約 20 公尺的鋼筋混凝土基礎上。這一集從開挖與墊層、錨栓籠定位調平、鋼筋綁紮，看到數百立方公尺混凝土的連續澆置、大體積混凝土的溫度控制，以及回填與灌漿。',
facts:[['20','m','擴展式基礎直徑示例，中央基座厚約 3.7 m、邊緣約 1.2 m'],
['650','m³','一座基礎的混凝土量示例，約 90 車預拌車、連續澆置約 14 小時'],
['1.5','mm','錨栓籠上錨板的水平差常見容許值（示例）'],
['20','°C','大體積混凝土內部與表面溫差常見的控制上限'],
['70','°C','混凝土核心最高溫度常見的控制上限'],
['2,400','t','基礎混凝土加上方覆土的總重量示例，用來抵抗傾倒']],
note:'說明：本集為教育用途示意動畫，基礎剖面的深度方向放大約 1.5 倍顯示，機具與人員比例經過調整。基礎直徑 20 m、邊緣厚 1.2 m、基座厚約 3.7 m、開挖深約 3.5 m、混凝土約 650 m³、鋼筋約 70 t、錨栓約 180 支、上錨板水平差 1.5 mm 等皆為 4 MW 級陸域風機常見的典型範例，並非特定案場資料；實際尺寸依機型載重、地質鑽探與設計核定而定，軟弱地盤常改用樁基礎。開挖土方以截頭圓錐估算，覆土重量以單位重 1.8 t/m³ 估算。溫度曲線為簡化模型示例；核心溫度 70 °C 與內外溫差約 20 °C 的控制值引自美國混凝土學會（ACI 207、ACI 301）大體積混凝土的常見做法，國內工程多採相近規定，實際以各工程施工規範與溫控計畫為準。灌漿材料與等待強度的天數依製造商安裝手冊而定。',
base:()=>{landSky(GY,{sun:{x:1260,y:140}});drawGround();box(180,GL,1260,16,'#b39d7c');ln([180,GL,1440,GL],'rgba(0,0,0,.2)',1);},
shots:[
/* 1 ─────────────────────────────── 開挖與墊層 */
{t:'開挖與墊層',en:'Excavation and blinding',dur:12,side:true,
 d:'基礎施工從開挖開始。以 4 MW 級陸域風機為例，基礎直徑約 20 公尺，基坑底部每邊再多留約 1 公尺工作空間，坑壁依土質放緩坡，開挖深度約 3.5 公尺，土方量約 1,800 立方公尺。挖到設計高程後先驗槽，確認實際地層與鑽探結果相符、承載力足夠，再澆一層約 10–15 公分的墊層混凝土，讓後續的鋼筋與錨栓籠有平整、乾淨的工作面。',
 s:[[0,'怪手開挖直徑約 22 m 的基坑'],[.3,'坑壁放緩坡，挖到約 3.5 m 深'],[.56,'驗槽：確認地層與承載力符合設計'],[.76,'澆一層墊層混凝土，做出平整工作面']],
 cam:u=>camMix({x:800,y:470,s:1},{x:820,y:600,s:1.35},ease(seg(u,.5,.66))),
 draw(u){
  const dig=ease(seg(u,.02,.52)),blind=ease(seg(u,.74,.92));
  spoil(dig);stage({dig,blind});
  const ph=(TT*.32)%1,by=GL+(PB-GL)*dig-12,bx=lerp(1080,920,(Math.floor(TT*.32)%3)/2);
  const B=u<.54?kf(ph,[[0,bx,by],[.35,bx+60,by-30],[.55,1180,440],[.75,1480,520],[.88,1400,470],[1,bx,by]]):{x:1150+ease(seg(u,.5,.64))*620,y:470};
  excav(1330+ease(seg(u,.5,.64))*620,GL,B);
  /* 驗槽與墊層 */
  alphaDo(band(u,.54,.74),()=>{person(940,PB,'#e8572a',4.5);ln([960,PB-30,975,PB+4],'#394650',3);});
  if(u>.7)alphaDo(seg(u,.7,.74),()=>{person(lerp(500,1100,blind)+20,PB-8,'#7dc8dc',4.5);ln([lerp(500,1100,blind),PB-36,lerp(500,1100,blind)-24,SB],'#394650',3);});
  lab(CX,GL+40,'基坑',{dx:-160,dy:-80,st:'l',a:band(u,.08,.5)});
  lab(1500,GL-90,'開挖土方',{dx:20,dy:-70,a:band(u,.3,.54)});
  lab(395,GL+40,'坑壁放緩坡',{dx:-60,dy:-120,minor:true,a:band(u,.36,.56)});
  lab(960,PB-6,'驗槽',{dx:90,dy:-70,st:'s',a:band(u,.56,.74)});
  lab(700,SB+4,'墊層混凝土',{dx:-100,dy:-80,st:'g',a:band(u,.8,1)});
 },
 hud(u){const dig=ease(seg(u,.02,.52)),h=3.5*dig,D2=29-2*h;hudPanel(250,150,'開挖（示例）',seg(u,.04,.1),w=>{
  hrow(56,'基礎直徑','20 m',w,'#f2c230');hrow(88,'開挖深度',trf('{v} m',{v:h.toFixed(1)}),w,'#fff');
  hrow(120,'土方量',trf('{v} m³',{v:fmtK(Math.PI*h/12*(29*29+29*D2+D2*D2))}),w,'#7dffc4');});}},

/* 2 ─────────────────────────────── 基礎剖面 */
{t:'擴展式基礎的構造',en:'Anatomy of a spread foundation',dur:14,
 d:'擴展式基礎是一塊圓形或多邊形的厚板，中央是承接塔架的基座，向外逐漸變薄。內部有上下兩層鋼筋網，以及貫穿全厚度的錨栓籠：錨栓下端鎖在埋入底部的錨板上，上端穿過塔架底法蘭。風把塔頂往下風推時，上風側的錨栓把拉力一路傳到基礎底部，整座基礎連同上方覆土的重量一起抵抗傾倒，寬大的底面則把壓力分散到地盤。',
 s:[[0,'墊層之上，綁紮上下兩層鋼筋網'],[.26,'錨栓籠貫穿全厚度，下端鎖在底部錨板'],[.5,'澆置混凝土，再回填覆土增加壓重'],[.74,'風推塔頂，重量與寬底面一起抵抗傾倒']],
 draw(u){
  diagBG();
  card(60,160,960,470,{bg:'rgba(7,27,39,.75)'});wt(84,200,'擴展式基礎剖面（示意，深度放大）',20,'#f2c230',700);
  const S=1.42,MX=x=>540+(x-CX)*S,MY=y=>335+(y-GL)*S;
  ctx.save();rrp(62,214,956,414,12);ctx.clip();
  box(62,MY(GL),956,400,'#5a4d40');
  ctx.translate(540,335);ctx.scale(S,S);ctx.translate(-CX,-GL);
  const k=t=>ease(seg(u,t,t+.08));
  stage({dig:1,blind:1,rb1:k(.02),rb2:k(.08),cage:{a:k(.16)},fill:k(.36),back:k(.48),grout:k(.56),form:0});
  if(k(.6)>0)alphaDo(k(.6),()=>{box(722,564,156,14,'#8a99a3','rgba(0,0,0,.5)',1);box(735,300,130,264,'#eef2f4','rgba(0,0,0,.3)',1);});
  ctx.restore();
  /* 尺寸標示 */
  alphaDo(band(u,.36,.7),()=>{const y=MY(PB)+30;ln([MX(500),y,MX(1100),y],'#f2c230',2);ln([MX(500),y-8,MX(500),y+8],'#f2c230',2);ln([MX(1100),y-8,MX(1100),y+8],'#f2c230',2);
   wt(540,y+26,'直徑 約 20 m',18,'#f2c230',700,'center');});
  const L=(x,y,tx,ty,t,col,a)=>alphaDo(a,()=>{ln([MX(x),MY(y),tx,ty],col,1.5);circ(MX(x),MY(y),4,col);wt(tx+(tx<MX(x)?-6:6),ty+6,t,17,col,700,tx<MX(x)?'right':'left');});
  L(560,754,250,600,'墊層',  'rgba(227,236,238,.9)',band(u,.02,.3));
  L(620,741,300,560,'下層鋼筋','#ff9d7a',band(u,.04,.3));
  L(660,640,250,290,'上層鋼筋','#ff9d7a',band(u,.1,.3));
  L(745,732,350,600,'底部錨板','#7dffc4',band(u,.18,.5));
  L(860,620,880,280,'錨栓籠','#7dffc4',band(u,.18,.5));
  L(1000,660,940,560,'混凝土','#fff',band(u,.38,.6));
  L(1180,620,960,250,'回填覆土','#f2c230',band(u,.5,.74));
  L(734,580,300,250,'灌漿層','rgba(227,236,238,.9)',band(u,.56,.74));
  /* 受力 */
  const fa=seg(u,.74,.8);if(fa>0)alphaDo(fa,()=>{arrow(MX(580),MY(360),MX(720),MY(360),'#7dc8dc',5);wt(MX(570),MY(360)+6,'風推力',17,'#7dc8dc',700,'right');
   const y0=MY(PB)+4,p=.6+.4*Math.sin(TT*2)*.3;ctx.beginPath();ctx.moveTo(MX(500),y0);ctx.lineTo(MX(1100),y0);ctx.lineTo(MX(1100),y0+48*(1+p*.3));ctx.lineTo(MX(500),y0+12);ctx.closePath();ctx.fillStyle='rgba(232,87,42,.4)';ctx.fill();
   wt(MX(1110),y0+50,'下風側地盤壓力較大',15,'#ff9d7a',700,'right');
   arrow(MX(740),MY(560),MX(740),MY(700),'#ff9d7a',3);});
  /* 下方：設計重點 */
  card(60,650,960,150,{bg:'rgba(7,27,39,.75)'});
  bullets(84,696,[['重量加上覆土，抵抗傾倒力矩','#fff'],['錨栓把塔底拉力傳到基礎底部','#7dffc4']],u,.6,.08,46);
  bullets(560,696,[['寬底面把壓力分散到地盤','#fff'],['軟弱地盤改用樁基礎','#ff9d7a']],u,.76,.08,46);
  /* 右：規格 */
  card(1060,160,480,640,{bg:'rgba(7,27,39,.75)'});wt(1084,200,'一座基礎（示例）',20,'#f2c230',700);
  [['直徑','20 m','#f2c230'],['邊緣厚度','1.2 m','#fff'],['基座厚度','約 3.7 m','#fff'],['開挖深度','約 3.5 m','#fff'],['混凝土','約 650 m³','#7dffc4'],['鋼筋','約 70 t','#ff9d7a'],['錨栓','約 180 支','#7dffc4'],['基座直徑','約 6 m','#fff']]
   .forEach(([a,b,c],i)=>alphaDo(seg(u,.04+i*.05,.08+i*.05),()=>{rowK(1084,260+i*62,a,b,c,432);ln([1084,276+i*62,1516,276+i*62],'rgba(255,255,255,.1)',1);}));
 }},

/* 3 ─────────────────────────────── 錨栓籠定位 */
{t:'錨栓籠定位與調平',en:'Setting and levelling the anchor cage',dur:13,side:true,
 d:'錨栓籠由上百支高強度錨栓、底部錨板與上方的定位模板組成，多在現場地面先組好，再由吊車整組吊入基坑，放在可微調高度的支撐架上。塔架底法蘭最後要平穩地座在這圈錨栓上，所以定位比一般鋼筋嚴格得多：中心位置、方位角與高程都要測量，上錨板一圈的水平差常要求在約 1.5 公釐以內。調平後固定支撐，綁完鋼筋、澆置前還要再複測一次。',
 s:[[0,'整組錨栓籠由吊車吊入基坑'],[.3,'放在可微調的支撐架上，對準中心與方位'],[.54,'水準儀逐點量測上錨板高程'],[.78,'水平差調到 1.5 mm 以內，再固定支撐']],
 cam:u=>camMix({x:800,y:520,s:1.05},{x:870,y:640,s:1.8},ease(seg(u,.36,.52))),
 draw(u){
  spoil(1);
  const dn=ease(seg(u,.04,.34)),dy=(1-dn)*-380,err=u<.5?6:lerp(6,.8,ease(seg(u,.56,.8))),tilt=err*.0035*(u>.34?1:0);
  stage({dig:1,blind:1,cage:{dy,tilt}});
  /* 支撐架 */
  alphaDo(seg(u,.02,.06),()=>{for(const x of [735,865]){ln([x-10,SB,x,737,x+10,SB],'#5b6a73',3);}});
  /* 吊車 */
  const ca=1-seg(u,.4,.48);if(ca>0)alphaDo(ca,()=>{box(160,GL-40,200,30,'#e9b21f','rgba(0,0,0,.4)',1);box(150,GL-12,230,12,'#394650');for(const wx of [180,230,310,350])circ(wx,GL-4,9,'#222');
   const hy=580+dy-90;crane(300,GL-44,620,CX,hy,{col:'#e9b21f'});slings(CX,hy,[730,580+dy,870,580+dy]);});
  /* 水準儀與標尺 */
  const la=seg(u,.5,.56);if(la>0)alphaDo(la,()=>{ln([1250,GL,1265,560,1280,GL],'#394650',3);box(1252,546,28,14,'#e9b21f','rgba(0,0,0,.5)',1);person(1300,GL,'#e8572a',4.5);
   box(866,470,7,110,'#fff','rgba(0,0,0,.4)',1);for(let y=476;y<578;y+=12)box(866,y,7,5,'#e8572a');
   ctx.setLineDash([8,6]);ln([1252,553,873,553],'#e8572a',1.5);ctx.setLineDash([]);});
  lab(CX,560+dy,'錨栓籠',{dx:-170,dy:-40,st:'s',a:band(u,.06,.4)});
  lab(735,742,'可調支撐架',{dx:-150,dy:20,a:band(u,.3,.54)});
  lab(820,732,'底部錨板',{dx:-60,dy:60,st:'l',minor:true,a:band(u,.3,.54)});
  lab(1266,560,'水準儀',{dx:-90,dy:70,st:'g',a:band(u,.56,1)});
  lab(869,480,'標尺',{dx:-80,dy:-40,a:band(u,.58,.8)});
  alphaDo(seg(u,.82,.88),()=>tag(CX,520,trf('水平差 {v} mm',{v:err.toFixed(1)}),{size:16,bg:err<1.5?'#7dffc4':'#e8572a',fg:'#13232e',align:'center'}));
 },
 hud(u){const err=u<.5?6:lerp(6,.8,ease(seg(u,.56,.8)));hudPanel(250,150,'定位檢查（示例）',seg(u,.04,.1),w=>{
  hrow(56,'上錨板水平差',u<.5?'—':trf('{v} mm',{v:err.toFixed(1)}),w,err<=1.5?'#7dffc4':'#ff9d7a');
  hrow(88,'容許值','≤ 1.5 mm',w,'#f2c230');hrow(120,'錨栓數量','約 180 支',w,'#fff');});}},

/* 4 ─────────────────────────────── 鋼筋綁紮 */
{t:'鋼筋綁紮：放射筋與環向筋',en:'Rebar: radial and ring bars',dur:13,
 d:'圓形基礎的鋼筋多以放射筋配上一圈圈環向筋組成，上下各一層。放射筋從錨栓籠向外延伸，承擔基礎像懸臂一樣受彎的拉力；環向筋把放射筋圍成整體，也控制混凝土收縮裂縫。錨栓籠周圍受力集中，鋼筋最密，常另加補強筋與箍筋。底層鋼筋以墊塊撐起，保留約 7.5 公分的保護層，避免地下水與土壤讓鋼筋生鏽。一座基礎的鋼筋量約 70 公噸，澆置前逐項查驗。',
 s:[[0,'放射筋從錨栓籠向外延伸，上下各一層'],[.32,'一圈圈環向筋把放射筋圍成整體'],[.58,'錨栓籠周圍受力集中，鋼筋最密'],[.78,'墊塊撐起底層鋼筋，留約 7.5 cm 保護層']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'俯視：鋼筋配置（示意）',20,'#f2c230',700);
  const ox=410,oy=500,R=270,nr=72,kr=seg(u,.04,.34),kc=seg(u,.32,.58),kd=seg(u,.58,.7);
  ctx.save();ctx.beginPath();ctx.arc(ox,oy,R,0,TAU);ctx.fillStyle='rgba(154,163,168,.18)';ctx.fill();ctx.strokeStyle='rgba(227,236,238,.6)';ctx.lineWidth=2;ctx.stroke();ctx.restore();
  ctx.setLineDash([6,6]);ring(ox,oy,90,'rgba(227,236,238,.5)',1.5);ctx.setLineDash([]);
  const n=Math.floor(nr*kr);for(let i=0;i<n;i++){const a=i/nr*TAU,r0=i%2?92:52;ln([ox+Math.cos(a)*r0,oy+Math.sin(a)*r0,ox+Math.cos(a)*(R-8),oy+Math.sin(a)*(R-8)],REB,2);}
  const nc=Math.floor(12*kc);for(let i=0;i<nc;i++)ring(ox,oy,98+i*14.5,REB,2);
  if(kd>0)alphaDo(kd,()=>{for(let i=0;i<5;i++)ring(ox,oy,56+i*7,'#ff9d7a',2);});
  for(const r of [60,69])for(let i=0;i<30;i++){const a=i/30*TAU+(r>65?.1:0);circ(ox+Math.cos(a)*r,oy+Math.sin(a)*r,3,'#7dffc4');}
  wt(84,770,trf('放射筋 {n} 支／層',{n}),17,'#fff',600);wt(736,770,trf('環向筋 {n} 圈',{n:nc}),17,'#fff',600,'right');
  alphaDo(band(u,.04,1),()=>{ln([ox+45,oy-45,560,250],'#7dffc4',1.5);wt(566,256,'錨栓籠',16,'#7dffc4',700);});
  alphaDo(band(u,.58,1),()=>{ln([ox-70,oy+20,150,700],'#ff9d7a',1.5);wt(150,722,'加密補強',16,'#ff9d7a',700,'center');});
  /* 右上：剖面局部 */
  card(800,160,740,330,{bg:'rgba(7,27,39,.75)'});wt(824,200,'局部剖面：上下兩層鋼筋',20,'#f2c230',700);
  box(830,250,680,200,'rgba(185,191,194,.35)','rgba(227,236,238,.4)',1);box(830,450,680,14,'#9aa3a8');
  const ra=seg(u,.06,.3);ln([850,420,lerp(850,1490,ra),420],REB,4);ln([850,280,lerp(850,1490,ra),280],REB,4);
  for(let x=870;x<lerp(850,1490,kc);x+=40){circ(x,412,5,REB);circ(x,288,5,REB);}
  alphaDo(seg(u,.76,.82),()=>{for(let x=900;x<1490;x+=160){box(x-9,428,18,22,'#e3e8ec','rgba(0,0,0,.4)',1);}
   ln([1470,420,1470,450],'#f2c230',2);ln([1460,420,1480,420],'#f2c230',2);ln([1460,450,1480,450],'#f2c230',2);wt(1460,404,'保護層 7.5 cm',15,'#f2c230',700,'right');wt(990,472,'墊塊',15,'rgba(227,236,238,.9)',600);});
  wt(850,268,'上層',15,'rgba(227,236,238,.85)',600);wt(850,408,'下層',15,'rgba(227,236,238,.85)',600);
  /* 右下：重點 */
  card(800,510,740,290,{bg:'rgba(7,27,39,.75)'});wt(824,550,'綁紮重點（示例）',20,'#f2c230',700);
  bullets(836,600,[['放射筋承擔受彎拉力，上下各一層','#fff'],['環向筋圍成整體、控制收縮裂縫','#fff'],['錨栓籠周圍加密，另加補強筋','#ff9d7a'],['鋼筋約 70 t，澆置前逐項查驗','#7dffc4']],u,.06,.18,48);
 }},

/* 5 ─────────────────────────────── 連續澆置 */
{t:'一次澆完：連續澆置',en:'One continuous pour',dur:14,side:true,
 d:'基礎混凝土原則上一次連續澆完，避免留下施工冷縫成為弱面。約 650 立方公尺的混凝土，需要大約 90 車次預拌車排隊進場，由泵送車的長臂把混凝土送到每個角落，分層澆置、每層約 50 公分，並以振動棒搗實，排出氣泡。整個過程常持續十幾個小時，夏季多選在夜間或清晨開始，降低入模溫度。現場同時取樣做坍度與抗壓試體，留待之後確認強度。',
 s:[[0,'預拌車排隊進場，泵送車長臂送料'],[.3,'分層澆置，每層約 50 cm'],[.55,'振動棒搗實，排出混凝土裡的氣泡'],[.78,'連續十幾個小時，不留施工冷縫']],
 cam:u=>({x:860,y:560,s:1.2}),
 draw(u){
  spoil(1);
  const f=ease(seg(u,.04,.94)),lv=lerp(SB,PT,f);
  stage({dig:1,blind:1,rb1:1,rb2:1,cage:{},fill:Math.max(.001,f),form:1,layers:true});
  const hx=CX+250*Math.sin(TT*.5),hy=Math.min(lv,600)-150;
  const T=pump(1430,GL,hx,hy);
  ln([T.x,T.y,T.x,lv-6],'#2b3137',5);
  alphaDo(.9,()=>{for(let k=0;k<4;k++){const y=lerp(T.y+20,lv,((TT*1.6+k/4)%1));circ(T.x+Math.sin(k*2)*2,y,4,'#9aa3a8');}});
  const mx=lerp(1700,1450,ease(seg(u,0,.12)));mixer(mx,GL,false);
  /* 振動棒 */
  const vx=CX-200+Math.sin(TT*.7)*60;alphaDo(seg(u,.5,.56),()=>{person(vx,lv,'#e8572a',4.5);ln([vx+8,lv-30,vx+30,lv+20],'#394650',3);
   for(let k=0;k<3;k++)ring(vx+30,lv+10,6+((TT*20+k*6)%18),'rgba(255,255,255,.5)',1.2);});
  lab(1330,GL-80,'泵送車',{dx:40,dy:-90,a:band(u,.04,.3)});
  lab(1520,GL-90,'預拌車',{dx:0,dy:-70,minor:true,a:band(u,.08,.3)});
  lab(T.x,lv-20,'泵送管出料',{dx:-150,dy:-50,st:'s',a:band(u,.12,.34)});
  lab(1050,lv+10,'分層澆置 每層約 50 cm',{dx:110,dy:60,st:'l',a:band(u,.3,.56)});
  lab(vx+30,lv+10,'振動棒',{dx:-110,dy:-70,st:'g',a:band(u,.56,.78)});
  lab(1100,720,'模板',{dx:120,dy:30,minor:true,a:band(u,.12,.3)});
 },
 hud(u){const f=ease(seg(u,.04,.94)),v=650*f;hudPanel(250,182,'澆置進度（示例）',seg(u,.04,.1),w=>{
  hrow(56,'已澆置',trf('{v} m³',{v:fmtK(v)}),w,'#7dffc4');hbar(14,66,w-28,f,'#7dffc4');
  hrow(100,'預拌車',trf('{n} 車次',{n:Math.round(v/7.2)}),w,'#fff');
  hrow(132,'經過時間',trf('{v} 小時',{v:(14*f).toFixed(1)}),w,'#fff');hrow(164,'設計量','650 m³',w,'#f2c230');});}},

/* 6 ─────────────────────────────── 溫度控制 */
{t:'大體積混凝土的溫度控制',en:'Thermal control of mass concrete',dur:15,
 d:'水泥與水反應會放熱，一座數公尺厚的基礎散熱很慢，核心溫度可在一兩天內升到六、七十度，表面卻快速被空氣冷卻。內外溫差太大時，表面收縮被內部拉住，就會出現溫度裂縫；核心過熱也可能影響長期耐久性。常見做法是把核心最高溫控制在約 70 °C 以下、內外溫差控制在約 20 °C 以內：配比以飛灰、爐石取代部分水泥降低水化熱，預冷材料、夜間澆置，必要時埋設冷卻水管，表面覆蓋保溫養護，並以溫度計 24 小時監測。',
 s:[[0,'水化熱讓基礎核心快速升溫'],[.24,'表面散熱快，內外溫差超過 30 °C'],[.46,'溫差太大，表面被拉出溫度裂縫'],[.68,'低熱配比、冷卻水管與保溫養護'],[.86,'核心降溫、表面保溫，溫差控制在 20 °C 內']],
 draw(u){
  diagBG();
  const k0=seg(u,.04,.4),k1=seg(u,.6,.86),fix=seg(u,.56,.62),day=lerp(0,7,u<.56?k0:k1);
  const core=fix>.5?CORE1:CORE0,surf=fix>.5?SURF1:SURF0;
  /* 左上：剖面 */
  card(60,160,700,330,{bg:'rgba(7,27,39,.75)'});wt(84,200,'基礎內部溫度（示意）',20,'#f2c230',700);
  const S=.95,MX=x=>410+(x-CX)*S,MY=y=>238+(y-PT)*S;
  const tc=core(day),ts=surf(day),hot=clamp((tc-28)/42);
  ctx.save();ctx.beginPath();FND.forEach((v,i)=>{if(i%2)return;const X=MX(v),Y=MY(FND[i+1]);i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});ctx.closePath();
  const g=ctx.createRadialGradient(MX(CX),MY(690),10,MX(CX),MY(690),300);g.addColorStop(0,`rgba(255,${Math.round(lerp(190,110,hot))},${Math.round(lerp(150,70,hot))},1)`);g.addColorStop(1,'#7dc8dc');
  ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='rgba(0,0,0,.4)';ctx.lineWidth=1.5;ctx.stroke();ctx.restore();
  /* 冷卻管與保溫 */
  if(fix>0)alphaDo(fix,()=>{for(let x=560;x<=1040;x+=40)circ(MX(x),MY(712),5,'#58b8d0','#13232e',1.5);
   ctx.beginPath();[[500,690],[710,609],[710,579],[890,579],[890,609],[1100,690]].forEach(([x,y],i)=>{i?ctx.lineTo(MX(x),MY(y)):ctx.moveTo(MX(x),MY(y));});ctx.strokeStyle='#e3e8ec';ctx.lineWidth=7;ctx.stroke();
   wt(MX(CX),MY(579)+30,'保溫覆蓋',15,'#13232e',700,'center');wt(MX(CX),MY(712)+24,'冷卻水管',15,'#13232e',700,'center');});
  /* 裂縫 */
  const cr=seg(u,.46,.5)*(1-fix);if(cr>0)alphaDo(cr,()=>{[[560,686],[650,651],[960,668],[1040,690]].forEach(([x,y])=>ln([MX(x),MY(y)-6,MX(x)+4,MY(y)+10,MX(x)-3,MY(y)+22],'#e8572a',2.5));
   tag(MX(CX),MY(650),'溫度裂縫',{size:15,bg:'#e8572a',fg:'#fff',align:'center'});});
  circ(MX(CX),MY(690),7,'#f2c230','#13232e',2);circ(MX(980),MY(668),7,'#7dffc4','#13232e',2);
  rowK(84,434,'核心溫度',trf('{v} °C',{v:tc.toFixed(0)}),'#f2c230',300);rowK(420,434,'表面溫度',trf('{v} °C',{v:ts.toFixed(0)}),'#7dffc4',310);
  rowK(84,472,'內外溫差',trf('{v} °C',{v:(tc-ts).toFixed(0)}),tc-ts>20?'#ff9d7a':'#7dffc4',300);rowK(420,472,'澆置後',trf('第 {v} 天',{v:day.toFixed(1)}),'#fff',310);
  /* 左下：對策 */
  card(60,510,700,290,{bg:'rgba(7,27,39,.75)'});wt(84,550,'溫控對策',20,'#f2c230',700);
  bullets(96,598,[['飛灰、爐石取代部分水泥，降低水化熱','#fff'],['預冷材料、夜間澆置，降低入模溫度','#fff'],['埋設冷卻水管，帶走核心熱量','#7dc8dc'],['表面覆蓋保溫，溫度計 24 小時監測','#7dffc4']],u,.62,.06,48);
  /* 右：溫度歷程 */
  const C=chartBox(800,160,740,640,{title:'溫度歷程（示例）',x0:0,x1:7,y0:20,y1:80,xt:[0,1,2,3,4,5,6,7],yt:[20,40,60,80],xl:'澆置後天數',yl:'°C',pl:66,pt:64,pb:60,gx:7,gy:3});
  const draw=(fn,col,t1,lw,dash)=>{ctx.beginPath();for(let t=0;t<=t1;t+=.05){const x=C.X(t),y=C.Y(fn(t));t?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=lw||3.5;if(dash)ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);};
  ctx.setLineDash([8,6]);ln([C.X(0),C.Y(70),C.X(7),C.Y(70)],'#e8572a',2);ctx.setLineDash([]);wt(C.X(7)-6,C.Y(70)-10,'核心上限 70 °C',15,'#ff9d7a',700,'right');
  alphaDo(1-fix*.7,()=>{draw(CORE0,'#ff9d7a',7*k0);draw(SURF0,'#7dc8dc',7*k0,3,[8,5]);});
  alphaDo(seg(u,.08,.14)*(1-fix),()=>{wt(C.X(1.9),C.Y(CORE0(1.9))-14,'核心（未溫控）',15,'#ff9d7a',700,'center');wt(C.X(4.6),C.Y(SURF0(4.6))+26,'表面（未保溫）',15,'#7dc8dc',700,'center');});
  const dA=seg(u,.26,.32)*(1-fix);if(dA>0)alphaDo(dA,()=>{const t=DT0[1],x=C.X(t);ln([x,C.Y(CORE0(t)),x,C.Y(SURF0(t))],'#e8572a',3);
   tag(x+12,(C.Y(CORE0(t))+C.Y(SURF0(t)))/2,trf('溫差 {v} °C',{v:DT0[0].toFixed(0)}),{size:15,bg:'#e8572a',fg:'#fff'});});
  if(fix>0){draw(CORE1,'#f2c230',7*k1);draw(SURF1,'#7dffc4',7*k1);
   alphaDo(seg(u,.64,.7),()=>{wt(C.X(1.2),C.Y(CORE1(1.2))-16,'核心（溫控後）',15,'#f2c230',700,'center');wt(C.X(5.2),C.Y(SURF1(5.2))+28,'表面（保溫）',15,'#7dffc4',700,'center');});
   const dB=seg(u,.84,.9);if(dB>0)alphaDo(dB,()=>{const t=DT1[1],x=C.X(t);ln([x,C.Y(CORE1(t)),x,C.Y(SURF1(t))],'#7dffc4',3);
    tag(x+12,(C.Y(CORE1(t))+C.Y(SURF1(t)))/2,trf('最大溫差 {v} °C',{v:DT1[0].toFixed(0)}),{size:15,bg:'#7dffc4'});});}
  if(day>0){const x=C.X(day);ln([x,C.py,x,C.py+C.ph],'rgba(255,255,255,.25)',1.5);}
 }},

/* 7 ─────────────────────────────── 回填與灌漿 */
{t:'回填、灌漿與等待強度',en:'Backfill, grout and curing',dur:12,side:true,
 d:'混凝土養護期間拆除模板，確認強度後分層回填，每層壓實，覆土約 800 公噸，與約 1,560 公噸的混凝土合計約 2,400 公噸，一起把風機穩穩壓住。基座頂面與塔架底法蘭之間，用高強度無收縮灌漿料填出一層平整的承壓面。混凝土與灌漿層達到設計強度、試體報告通過後，第一段塔架才能吊上錨栓，以液壓拉伸器鎖緊，接著就是第 1 集的吊裝。',
 s:[[0,'拆模後分層回填，每層壓實'],[.3,'覆土加上混凝土，總重約 2,400 t'],[.52,'基座頂面灌一層高強度無收縮灌漿'],[.76,'強度達標後，第一段塔架吊上錨栓']],
 cam:u=>camMix({x:840,y:520,s:1.12},{x:800,y:540,s:1.9},ease(seg(u,.46,.6))),
 draw(u){
  const bk=ease(seg(u,.04,.42));spoil(1-bk);
  const tw=ease(seg(u,.62,.86));
  stage({dig:1,blind:1,rb1:1,rb2:1,cage:{},fill:1,back:bk,grout:seg(u,.54,.62),tower:u>.6?(1-tw)*260:undefined});
  /* 壓路機 */
  const ry=lerp(PB,GL,bk)-2,rx=lerp(420,1180,(Math.sin(TT*.6)*.5+.5));
  if(u<.46)alphaDo(1-seg(u,.42,.46),()=>{const x=rx<CX?Math.min(rx,500-40):Math.max(rx,1100+40);
   circ(x-30,ry-16,16,'#5b6a73','#222',2);box(x-20,ry-40,60,26,'#e9b21f','rgba(0,0,0,.4)',1);circ(x+34,ry-12,12,'#222');box(x-6,ry-62,26,22,'#a8d8e8','rgba(0,0,0,.3)',1);});
  lab(1170,lerp(PB,GL,bk)+20,'分層回填壓實',{dx:110,dy:-70,st:'l',a:band(u,.06,.42)});
  lab(980,GL+30,'覆土壓重',{dx:150,dy:60,a:band(u,.32,.5)});
  lab(866,582,'無收縮灌漿層',{dx:150,dy:20,st:'s',a:band(u,.56,.76)});
  lab(735,560,'第一段塔架',{dx:-150,dy:-60,st:'g',a:band(u,.76,1)});
  lab(800,592,'錨栓',{dx:-140,dy:40,minor:true,a:band(u,.6,.76)});
 },
 hud(u){hudPanel(250,182,'基礎壓重（示例）',seg(u,.04,.1),w=>{const bk=ease(seg(u,.04,.42));
  hrow(56,'混凝土','≈ 1,560 t',w,'#fff');hrow(88,'覆土',trf('≈ {v} t',{v:fmtK(800*bk)}),w,'#7dffc4');
  hrow(120,'總重',trf('≈ {v} t',{v:fmtK(1560+800*bk)}),w,'#f2c230');hrow(152,'塔架吊裝前',u>.7?'強度達標':'等待強度',w,u>.7?'#7dffc4':'#fff');});}}
]};
