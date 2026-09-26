// KITS: land
/* 儲能系列 第 2 集：抽蓄水力 */
/* 山體剖面：上池在左上、下池在右下（比例經過壓縮） */
const TER=[[-400,238],[20,240],[50,300],[120,352],[380,356],[450,300],[490,262],[560,210],[630,188],[700,215],[800,300],[900,420],[960,478],[1010,482],[1040,520],[1080,600],[1120,660],[1160,718],[1300,728],[1450,720],[1510,662],[1560,630],[2000,626]];
const LU0=276,LD0=680;                                      // 上池、下池的基準水位（世界座標）
const WAY=[[455,338],[560,358],[700,380],[860,640],[900,696],[1000,716],[1170,716]]; // 進水口 → 壓力水道 → 廠房 → 尾水道
const CAV={x:880,y:652,w:130,h:86};                          // 地下廠房
const SWY={x:958,y:478};                                     // 開關場
const PYL={x:1060,y:560};                                    // 輸電鐵塔
function terY(x){for(let i=1;i<TER.length;i++)if(x<=TER[i][0]){const a=TER[i-1],b=TER[i],t=(x-a[0])/(b[0]-a[0]);return lerp(a[1],b[1],t);}return TER[TER.length-1][1];}
/* 沿折線 P 取比例 f 的點 */
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,dir,sp,r){if(a<=0)return;for(let k=0;k<n;k++){let f=((TT*(sp||.3))+k/n)%1;if(dir<0)f=1-f;const p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4.5,col));}}
/* 山、湖、水道與廠房；dz：上池水位變化（像素，正值為上升） */
function mountain(dz,o){
  o=o||{};const lu=LU0-dz,ld=LD0+dz*.8;
  const wg=(y0,y1)=>{const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,'#4ea3c4');g.addColorStop(1,'#1d5f86');return g;};
  ctx.fillStyle=wg(lu,360);ctx.fillRect(20,lu,480,110);
  ctx.fillStyle=wg(ld,730);ctx.fillRect(1100,ld,420,60);
  const prof=(off)=>{ctx.beginPath();ctx.moveTo(TER[0][0],TER[0][1]+off);TER.forEach(p=>ctx.lineTo(p[0],p[1]+off));ctx.lineTo(2000,1000);ctx.lineTo(-400,1000);ctx.closePath();};
  prof(0);ctx.fillStyle='#6f9152';ctx.fill();
  prof(22);ctx.fillStyle='#8f7d68';ctx.fill();
  prof(90);ctx.fillStyle='#716a62';ctx.fill();
  ctx.beginPath();TER.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle='#4f7a3a';ctx.lineWidth=3;ctx.stroke();
  ln([20,lu,500,lu],'rgba(255,255,255,.75)',2);ln([1100,ld,1520,ld],'rgba(255,255,255,.75)',2);
  /* 樹 */
  const r=rng(5);for(let i=0;i<26;i++){const x=500+r()*560;if(x>930&&x<1020)continue;const y=terY(x);circ(x,y-8,7+r()*4,'#4c7a3c');}
  for(let i=0;i<10;i++){const x=-200+r()*230;circ(x,terY(x)-8,7+r()*4,'#4c7a3c');}
  for(let i=0;i<8;i++){const x=1530+r()*300;circ(x,terY(x)-8,7+r()*4,'#4c7a3c');}
  /* 水道 */
  ctx.lineCap='round';ctx.lineJoin='round';
  pathLine(WAY,'#26343d',18);pathLine(WAY,o.water===false?'#3a4a54':'#3b7fa0',9);
  ln([700,380,700,214],'#26343d',14);ln([700,380,700,230],'#3b7fa0',6);            // 調壓井
  ctx.lineCap='butt';
  box(440,326,24,24,'#44535c');                                                   // 進水口
  /* 地下廠房 */
  box(CAV.x,CAV.y,CAV.w,CAV.h,'#1b2a33','#c9d1d6',2);
  unitSmall(CAV.x+40,CAV.y+CAV.h-8,o.dir||0);unitSmall(CAV.x+92,CAV.y+CAV.h-8,o.dir||0);
  ln([CAV.x+CAV.w/2+10,CAV.y,SWY.x+10,SWY.y],'rgba(40,50,58,.8)',3);             // 電纜豎井
  /* 開關場與鐵塔 */
  box(SWY.x-6,SWY.y-2,60,6,'#9aa4aa');for(let i=0;i<3;i++){box(SWY.x+2+i*18,SWY.y-30,6,28,'#c9d1d6');ln([SWY.x+i*18,SWY.y-30,SWY.x+10+i*18,SWY.y-30],'#6f7a80',2);}
  towerSmall(PYL.x,PYL.y);ln([SWY.x+48,SWY.y-30,PYL.x,PYL.y-150],'#394650',2);ln([PYL.x,PYL.y-150,1700,PYL.y-200],'#394650',2);
}
/* 小型機組：上方發電機／馬達、下方轉輪；dir=1 發電、-1 抽水 */
function unitSmall(x,y,dir){
  box(x-18,y-66,36,26,'#c9d1d6','rgba(0,0,0,.4)',1);ln([x,y-40,x,y-18],'#8d989f',4);
  ctx.beginPath();ctx.ellipse(x,y-12,20,8,0,0,TAU);ctx.fillStyle='#58b8d0';ctx.fill();
  if(dir){const ph=(TT*2.4*dir)%1;for(let k=0;k<3;k++){const f=((ph+k/3)%1+1)%1;const xx=x-16+32*f;ln([xx,y-60,xx,y-46],'rgba(20,30,40,.55)',2);ln([xx,y-16,xx,y-8],'rgba(255,255,255,.8)',2);}}
}
function towerSmall(x,y){ctx.strokeStyle='#5c6770';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x-22,y);ctx.lineTo(x-4,y-150);ctx.lineTo(x+4,y-150);ctx.lineTo(x+22,y);
  for(let k=0;k<5;k++){const t=k/5,t2=(k+1)/5;ctx.moveTo(lerp(x-22,x-4,t),lerp(y,y-150,t));ctx.lineTo(lerp(x+22,x+4,t2),lerp(y,y-150,t2));}
  ctx.moveTo(x-38,y-130);ctx.lineTo(x+38,y-130);ctx.moveTo(x-30,y-108);ctx.lineTo(x+30,y-108);ctx.stroke();}
const LINE=[[SWY.x+48,SWY.y-30],[PYL.x,PYL.y-150],[1640,PYL.y-196]];
/* 可逆式機組的轉輪俯視圖：dir=1 發電（順時針）、-1 抽水（逆時針） */
function runnerTop(cx,cy,R,ang,col){
  ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);
  for(let k=0;k<7;k++){ctx.save();ctx.rotate(k*TAU/7);ctx.beginPath();ctx.moveTo(R*.3,0);ctx.quadraticCurveTo(R*.62,R*.34,R*.95,R*.22);ctx.lineTo(R*.95,R*.08);ctx.quadraticCurveTo(R*.62,R*.18,R*.3,-R*.08);ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.restore();}
  ctx.restore();circ(cx,cy,R*.3,'#44535c','#c9d1d6',2);circ(cx,cy,R*.1,'#c9d1d6');
}
/* 一天的抽水／發電排程（示意）：+ 發電、- 抽水，單位 MW 的比例 */
const sched=h=>h>=10&&h<14.5?-100:h>=17&&h<21.5?100:h>=6.5&&h<8.5?40:0;
const pvC=h=>h<6||h>18?0:100*Math.sin(Math.PI*(h-6)/12);
/* 以排程積分得到上池水位變化（公尺，示意） */
function lakeAt(h){let z=0;for(let t=0;t<h;t+=.1)z+=-sched(t)*.1;return z/100*.45;}

const EP={no:2,slug:'energy-storage',seriesName:'儲能系列',t:'抽蓄水力',en:'Pumped-storage hydropower',
lede:'世界上容量最大的儲能不是電池，而是兩座高低不同的水庫。這一集走進抽蓄水力電廠，看電多時把水抽上山、需要時放水發電的原理，打開可逆式機組看同一部機器如何正轉發電、反轉抽水，並算一算往返效率，最後介紹以日月潭為上池的明湖與明潭兩座抽蓄電廠。',
facts:[['2,602','MW','明湖（大觀二廠）1,000 MW 與明潭 1,602 MW 兩座抽蓄電廠的合計裝置容量'],
['380','m','明潭抽蓄電廠上池日月潭與下池明潭水庫的落差'],
['267','MW','明潭電廠單部可逆式機組的容量，共 6 部'],
['約 1','kWh','1 立方公尺的水從 380 m 高落下所含的位能（未計損失）'],
['約 75','%','抽蓄電廠常見的往返效率，抽 4 度電約可發回 3 度（示例）'],
['1985','年','明湖抽蓄電廠商轉，是台灣第一座抽蓄水力電廠']],
note:'說明：本集為教育用途示意動畫，山體、水道與廠房比例經過壓縮。明湖（大觀二廠）4 部 250 MW、落差約 310 m、1985 年商轉，明潭 6 部 267 MW、落差約 380 m，兩廠皆以日月潭為上池，數據取自台電與日月潭國家風景區管理處公開資料。流量約 80 m³/s、機組效率 0.9、往返效率約 75% 與損失分配、一天的抽水與發電排程、水位變化量均為典型範例，實際依台電調度與水情而定。',
base:()=>{landSky(700,{sun:{x:1180,y:120},clouds:true});},
shots:[
{t:'兩座水庫的電池',en:'A battery made of two reservoirs',dur:13,side:true,
 d:'抽蓄水力電廠由高低兩座水庫組成：上池在山上，下池在山腳，中間以山體內的壓力水道連接，機組則放在地下廠房。需要電的時候，打開上池的進水口，水沿著水道衝下，推動水輪機發電，再流入下池。電網電力有餘時，機組反過來當抽水機，把下池的水送回上池。電能就這樣以「水的高度」存了起來，隨時可以再放出來。',
 s:[[0,'上池在山上，下池在山腳，中間是壓力水道'],[.28,'打開進水口，水沿著水道往下衝'],[.52,'地下廠房的機組把水的能量變成電'],[.76,'電力經開關場與輸電線送上電網']],
 cam:u=>camMix({x:800,y:450,s:1},{x:820,y:480,s:1.08},ease(seg(u,.1,.6))),
 draw(u){
  const g=seg(u,.28,.36);mountain(-6*seg(u,.3,1),{dir:g>.5?1:0});
  flowDots(WAY,14,'#dff6ff',g,1,.28,4);
  flowDots(LINE,6,'#f2c230',seg(u,.72,.78),1,.5);
  alphaDo(band(u,.08,.6),()=>{ctx.setLineDash([8,7]);ln([470,LU0,1200,LU0],'rgba(255,255,255,.7)',1.5);ln([1060,LD0,1200,LD0],'rgba(255,255,255,.7)',1.5);ctx.setLineDash([]);
   arrow(1180,LU0+4,1180,LD0-4,'#f2c230',3);arrow(1180,LD0-4,1180,LU0+4,'#f2c230',3);});
  alphaDo(band(u,.08,.6),()=>tick(1192,(LU0+LD0)/2,'落差','left'));
  lab(300,LU0,'上池',{dx:120,dy:50,st:'s',a:band(u,.03,.5)});
  lab(1330,LD0,'下池',{dx:40,dy:-80,st:'s',a:band(u,.03,.5)});
  lab(780,510,'壓力水道',{dx:-160,dy:40,a:band(u,.28,.7)});
  lab(CAV.x+CAV.w/2,CAV.y+CAV.h,'地下廠房',{dx:-40,dy:70,st:'l',a:band(u,.5,1)});
  lab(SWY.x+20,SWY.y-30,'開關場',{dx:-110,dy:-60,a:band(u,.72,1)});
 },
 hud(u){hudPanel(240,150,'抽蓄電廠（示例）',seg(u,.05,.1),w=>{const g=seg(u,.3,.5);const p=1602*g;
  hrow(56,'模式',g>0?'發電':'待機',w,g>0?'#f2c230':'#fff');hrow(88,'出力',Math.round(p).toLocaleString('en-US')+' MW',w,'#f2c230');hrow(120,'上池水位',trf('{z} m',{z:(-0.6*seg(u,.3,1)).toFixed(2)}),w,'#7dc8dc');});}},

{t:'水位高度就是能量',en:'Height is energy',dur:13,
 d:'水從高處落下，位能變成動能再變成電。能量的大小取決於兩件事：落差 H 與流量 Q。發電功率可寫成 P = ρgQHη，其中 ρ 是水的密度，g 是重力加速度，η 是機組效率。以明潭電廠為例，落差約 380 公尺，每秒約 80 立方公尺的水流過一部機組、效率 0.9 時，功率約 267 MW。換個角度看，1 立方公尺的水從 380 公尺落下，就含有約 1 度電的位能，所以落差越大，同一池水能存的電越多。',
 s:[[0,'落差越大，同一池水能存的能量越多'],[.3,'功率 P = ρ × g × Q × H × η'],[.55,'每秒 80 m³ 的水流過一部機組，約 267 MW'],[.78,'1 m³ 的水從 380 m 落下，約含 1 度電']],
 draw(u){
  diagBG();
  card(60,160,560,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'落差與流量',20,'#f2c230',700);
  /* 左：上池、下池與落差 */
  const yT=270,yB=690;box(100,yT,170,50,'#2f7fa3');ln([100,yT,270,yT],'#dff6ff',2);wt(185,yT-14,'上池',18,'#fff',700,'center');
  box(400,yB,190,50,'#2f7fa3');ln([400,yB,590,yB],'#dff6ff',2);wt(495,yB-14,'下池',18,'#fff',700,'center');
  ctx.lineCap='round';ln([260,yT+30,330,yT+80,390,yB-60,420,yB+20],'#26343d',22);ln([260,yT+30,330,yT+80,390,yB-60,420,yB+20],'#3b7fa0',12);ctx.lineCap='butt';
  const P=[[260,yT+30],[330,yT+80],[390,yB-60],[420,yB+20]];flowDots(P,8,'#dff6ff',seg(u,.05,.12),1,.45,4);
  const hA=seg(u,.06,.2);alphaDo(hA,()=>{ctx.setLineDash([6,6]);ln([270,yT,560,yT],'rgba(255,255,255,.6)',1.5);ctx.setLineDash([]);arrow(540,yT+4,540,lerp(yT+4,yB-4,hA),'#f2c230',3);});
  alphaDo(seg(u,.16,.22),()=>{wt(530,(yT+yB)/2-8,'H',34,'#f2c230',700,'right',COND);wt(530,(yT+yB)/2+26,'380 m',24,'#f2c230',700,'right',COND);});
  alphaDo(seg(u,.4,.46),()=>{wt(330,420,'Q',30,'#7dc8dc',700,'right',COND);wt(330,452,'80 m³/s',20,'#7dc8dc',700,'right',COND);});
  /* 右：公式逐項代入 */
  card(660,160,880,380,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.5)'});wt(684,200,'發電功率',20,'#f2c230',700);
  alphaDo(seg(u,.28,.34),()=>wt(1100,280,'P = ρ · g · Q · H · η',46,'#fff',700,'center',COND));
  const V=[['ρ','1,000 kg/m³','水的密度'],['g','9.81 m/s²','重力加速度'],['Q','80 m³/s','流量（示例）'],['H','380 m','落差'],['η','0.9','機組效率（示例）']];
  V.forEach(([s,v,n],i)=>{const a=seg(u,.34+i*.04,.38+i*.04);alphaDo(a,()=>{const x=690+i*168;card(x,318,156,120,{bg:'rgba(255,255,255,.05)'});wt(x+78,356,s,28,'#f2c230',700,'center',COND);wt(x+78,390,v,19,'#fff',700,'center',COND);wt(x+78,420,n,15,'rgba(227,236,238,.8)',500,'center');});});
  const pk=ease(seg(u,.56,.74));
  alphaDo(seg(u,.55,.6),()=>{wt(690,500,'一部機組',20,'#fff',700);wt(1510,504,trf('≈ {p} MW',{p:Math.round(267*pk)}),40,'#7dffc4',700,'right',COND);});
  /* 下：1 m³ 的水 */
  alphaDo(seg(u,.76,.82),()=>{card(660,570,880,230,{bg:'rgba(31,127,92,.22)',st:'rgba(125,255,196,.45)'});
   box(700,620,90,90,'#3b7fa0','#dff6ff',2);wt(745,672,'1 m³',22,'#fff',700,'center',COND);
   wt(830,640,'1,000 kg × 9.81 × 380 m',24,'#fff',700,'left',COND);wt(830,684,'≈ 3.7 MJ',26,'#7dffc4',700,'left',COND);
   wt(1510,684,'≈ 1 kWh',44,'#7dffc4',700,'right',COND);wt(830,752,'1 立方公尺的水從 380 m 落下，約含 1 度電的位能',18,'rgba(227,236,238,.9)',500);});
 }},

{t:'可逆式機組：正轉發電、反轉抽水',en:'The reversible pump-turbine',dur:14,
 d:'抽蓄電廠不必分別裝水輪機與抽水機。常見的是可逆式法蘭西斯機組：上方是發電電動機，下方是水泵水輪機，以同一根主軸相連。發電時，水從蝸殼四周流進轉輪，推動它往一個方向轉，帶動上方的發電機；抽水時，電網供電讓電動機反向旋轉，轉輪變成離心泵，把水從下方吸入、往上池壓回去。轉輪葉片的形狀必須在兩個方向之間取得平衡，所以設計上是一種折衷。',
 s:[[0,'上方是發電電動機，下方是水泵水輪機'],[.3,'發電：水流推動轉輪，帶動發電機'],[.58,'抽水：電動機反轉，轉輪變成抽水機'],[.8,'同一部機組，兩個方向都能運轉']],
 draw(u){
  diagBG();
  const pump=seg(u,.56,.62),dir=pump>.5?-1:1;
  /* 左：剖面 */
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'機組剖面（示意）',20,'#f2c230',700);
  const cx=410,a1=seg(u,.02,.08);
  alphaDo(a1,()=>{
   box(cx-140,240,280,150,'#44535c','#c9d1d6',2);box(cx-110,262,220,106,'#2a4a66');
   for(let k=0;k<8;k++){const f=(((TT*.8*dir)+k/8)%1+1)%1;box(cx-100+200*f,272,12,86,'#c9a38c');}
   ln([cx,390,cx,520],'#c9d1d6',12);
   ctx.beginPath();ctx.ellipse(cx,560,230,48,0,0,TAU);ctx.fillStyle='#3a4a54';ctx.fill();ctx.strokeStyle='#c9d1d6';ctx.lineWidth=2;ctx.stroke();
   ctx.beginPath();ctx.ellipse(cx,560,120,28,0,0,TAU);ctx.fillStyle='#58b8d0';ctx.fill();
   for(let k=0;k<6;k++){const f=(((TT*1.4*dir)+k/6)%1+1)%1,xx=cx-104+208*f;ln([xx,540,xx,580],'rgba(14,42,59,.7)',3);}
   poly([cx-70,600,cx+70,600,cx+110,720,cx-110,720],'#2f5f7a','#c9d1d6',2);
  });
  /* 水流方向 */
  const gA=seg(u,.3,.36)*(1-pump),pA=pump;
  if(gA>0){flowDots([[160,560],[cx-120,560]],4,'#dff6ff',gA,1,.7,5);flowDots([[660,560],[cx+120,560]],4,'#dff6ff',gA,1,.7,5);flowDots([[cx,600],[cx,760]],4,'#dff6ff',gA,1,.7,5);}
  if(pA>0){flowDots([[160,560],[cx-120,560]],4,'#7dffc4',pA,-1,.7,5);flowDots([[660,560],[cx+120,560]],4,'#7dffc4',pA,-1,.7,5);flowDots([[cx,600],[cx,760]],4,'#7dffc4',pA,-1,.7,5);}
  alphaDo(a1*seg(u,.04,.1),()=>{wt(cx+160,300,'發電電動機',18,'#fff',700);
   wt(cx+30,460,'主軸',17,'rgba(227,236,238,.9)',600);wt(cx+160,500,'水泵水輪機',18,'#fff',700);wt(100,640,'蝸殼',17,'rgba(227,236,238,.9)',600);wt(cx+120,700,'尾水管',17,'rgba(227,236,238,.9)',600);});
  /* 右：俯視轉輪 */
  card(820,160,720,420,{bg:'rgba(7,27,39,.75)',st:pump>.5?'rgba(125,255,196,.55)':'rgba(242,194,48,.55)'});wt(844,200,'轉輪俯視',20,'#f2c230',700);
  const ang=TT*1.6*dir;runnerTop(1040,390,150,ang,'#7fb3cf');
  ring(1040,390,168,'rgba(255,255,255,.3)',2);
  const ac=pump>.5?'#7dffc4':'#f2c230';
  ctx.beginPath();if(dir>0)ctx.arc(1040,390,190,-1.3,-.2);else ctx.arc(1040,390,190,-.2,-1.3,true);ctx.strokeStyle=ac;ctx.lineWidth=4;ctx.stroke();
  const e=dir>0?-.2:-1.3,ex=1040+190*Math.cos(e),ey=390+190*Math.sin(e),tx=-dir*Math.sin(e),ty=dir*Math.cos(e);arrow(ex-tx*16,ey-ty*16,ex+tx*4,ey+ty*4,ac,4);
  alphaDo(1-seg(u,.56,.59),()=>{tag(1270,300,'發電模式',{size:22});wt(1270,356,'水推轉輪',19,'#fff',700);wt(1270,390,'轉輪帶動發電機',17,'rgba(227,236,238,.85)',500);wt(1270,424,'水：上池 → 下池',17,'rgba(227,236,238,.85)',500);});
  alphaDo(seg(u,.59,.62),()=>{tag(1270,300,'抽水模式',{size:22,bg:'#7dffc4'});wt(1270,356,'電動機反轉',19,'#fff',700);wt(1270,390,'轉輪當離心泵',17,'rgba(227,236,238,.85)',500);wt(1270,424,'水：下池 → 上池',17,'rgba(227,236,238,.85)',500);});
  /* 右下：比較 */
  alphaDo(seg(u,.8,.86),()=>{card(820,610,720,190,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});
   wt(850,654,'同一部機組，兩種用途',20,'#7dffc4',700);
   wt(850,700,'發電：水輪機效率約 90%',18,'#fff',600);wt(850,740,'抽水：水泵效率略低，約 85–90%',18,'#fff',600);wt(850,776,'葉片形狀在兩個方向之間折衷',17,'rgba(227,236,238,.85)',500);});
 }},

{t:'電多時，把水抽上山',en:'Pumping water uphill',dur:12,side:true,
 d:'當電網供電大於需求，例如中午太陽光電大量發電時，調度中心就讓抽蓄電廠改成抽水模式。機組先與電網同步，電動機帶著轉輪反向旋轉，把下池的水沿著同一條水道壓回上池。明潭電廠 6 部機組全力抽水時，可以一次吸收一百多萬瓩的電力。上池水位慢慢上升，下池水位下降，這些電能就以位能的形式儲存在日月潭裡，等傍晚再放出來。',
 s:[[0,'電網電力有餘，調度中心下令抽水'],[.3,'電動機反轉，把下池的水壓回上池'],[.55,'上池水位上升，下池水位下降'],[.78,'電能以水的高度存在上池裡']],
 cam:u=>{const k=ease(seg(u,.18,.4))*(1-ease(seg(u,.62,.85)));return camMix({x:800,y:450,s:1},{x:CAV.x+CAV.w/2,y:CAV.y+20,s:2.4},k);},
 draw(u){
  const p=seg(u,.22,.3),dz=10*seg(u,.3,1);
  mountain(dz,{dir:p>.5?-1:0});
  flowDots(LINE,6,'#7dffc4',seg(u,.06,.12),-1,.5);
  flowDots(WAY,14,'#b8ffe0',p,-1,.28,4);
  lab(PYL.x,PYL.y-150,'電網送電進廠',{dx:80,dy:-50,st:'g',a:band(u,.04,.28)});
  lab(CAV.x+40,CAV.y+CAV.h-40,'電動機反轉',{dx:-60,dy:-50,st:'g',a:band(u,.26,.58)});
  lab(CAV.x+CAV.w,CAV.y+CAV.h-10,'從下池吸水',{dx:50,dy:40,a:band(u,.3,.58)});
  lab(300,LU0-dz,'上池水位上升',{dx:130,dy:50,st:'s',a:band(u,.62,1)});
  lab(1330,LD0+dz*.8,'下池水位下降',{dx:40,dy:-80,a:band(u,.62,1)});
 },
 hud(u){hudPanel(240,150,'抽水運轉（示例）',seg(u,.05,.1),w=>{const p=seg(u,.22,.4);
  hrow(56,'模式',p>0?'抽水':'切換中',w,p>0?'#7dffc4':'#fff');hrow(88,'用電',Math.round(-1560*p).toLocaleString('en-US')+' MW',w,'#7dffc4');hrow(120,'上池水位',trf('+{z} m',{z:(1*seg(u,.3,1)).toFixed(2)}),w,'#7dc8dc');});}},

{t:'往返效率：抽 4 度，發回 3 度',en:'Round-trip efficiency',dur:13,
 d:'抽水與發電各有損失：電動機與水泵把電變成位能時會損失一部分，水在水道裡流動有摩擦，發電時水輪機、發電機與變壓器又各損失一些。整體來說，抽蓄電廠的往返效率大約在 70% 到 80% 之間，典型值約 75%，也就是抽水用掉 4 度電，約可發回 3 度。聽起來不划算，但它把沒人用的電移到最需要的時段，而且水庫與隧道可使用 50 年以上，容量也遠大於一般電池案場。',
 s:[[0,'抽水用掉 100 份電能'],[.25,'電動機、水泵與水道先損失一部分'],[.5,'發電時水輪機與發電機再損失一些'],[.75,'最後約 75 份送回電網']],
 draw(u){
  diagBG();
  const B=chartBox(60,160,960,640,{title:'能量去向（示例）',x0:0,x1:7,y0:0,y1:110,yt:[0,25,50,75,100],yl:'%',pt:60,pb:120,pl:70,gx:7,gy:4});
  const S=[['抽水用電',0,100,'#7dffc4',.02],['電動機與水泵',100,-11,'#ff8a60',.24],['水道摩擦',89,-2,'#ff8a60',.3],['存在上池',0,87,'#58b8d0',.38],['水道摩擦',87,-2,'#ff8a60',.5],['水輪機與發電機',85,-9,'#ff8a60',.56],['變壓器等',76,-1,'#ff8a60',.62]];
  S.forEach(([n,b,v,c,t0],i)=>{const k=ease(seg(u,t0,t0+.08));if(k<=0)return;const x=B.X(i)+12,w=B.X(1)-B.X(0)-24;
   const y0=B.Y(v<0?b:b+v*k),y1=B.Y(v<0?b+v*k:b);box(x,y0,w,y1-y0,c);
   alphaDo(k,()=>{wt(x+w/2,y0-10,String(v),20,v<0?'#ff9d7a':'#fff',700,'center',COND);
    ctx.save();ctx.translate(x+w/2+6,B.py+B.ph+14);ctx.rotate(-.5);wt(0,0,n,16,'rgba(227,236,238,.9)',600,'right',FONT,'top');ctx.restore();});});
  const fk=ease(seg(u,.74,.82));if(fk>0){const x=B.X(7)-14,w=40;box(x-w,B.Y(75*fk),w,B.Y(0)-B.Y(75*fk),'#f2c230');alphaDo(fk,()=>wt(x-w/2,B.Y(75*fk)-10,'75',20,'#f2c230',700,'center',COND));}
  alphaDo(seg(u,.76,.82),()=>tag(B.X(6.1),B.Y(97),'送回電網 ≈ 75',{size:18,align:'center'}));
  /* 右：比較卡 */
  alphaDo(seg(u,.8,.86),()=>{card(1060,160,480,640,{bg:'rgba(7,27,39,.75)'});wt(1086,200,'抽蓄與電池',20,'#f2c230',700);
   const R=[['往返效率','約 70–80%','約 85–90%'],['使用年限','50 年以上','約 15–20 年'],['反應速度','數分鐘','1 秒內'],['適合用途','大量、數小時','快速調頻']];
   wt(1260,250,'抽蓄',18,'#58b8d0',700,'center');wt(1440,250,'電池',18,'#7dffc4',700,'center');
   R.forEach(([a,b,c],i)=>{const y=310+i*118;ln([1080,y-38,1520,y-38],'rgba(255,255,255,.14)',1);wt(1086,y,a,17,'rgba(227,236,238,.85)',600);wt(1260,y+36,b,19,'#fff',700,'center');wt(1440,y+36,c,19,'#fff',700,'center');});});
 }},

{t:'中午抽水，傍晚發電',en:'Pump at noon, generate at dusk',dur:13,side:true,
 d:'過去抽蓄電廠的節奏是「夜間抽水、白天發電」：半夜用電少、火力機組不便降載，就把多餘的電拿來抽水。隨著太陽光電大量併網，台灣的運轉方式逐漸變成「中午抽水、傍晚發電」：中午光電發電最多時抽水，把綠電存進上池；太陽下山、光電退場而用電仍高時，再放水發電補上缺口。所以遊客常會發現，日月潭的水位在一天之中會起伏變化。',
 s:[[0,'中午太陽光電最多，電廠抽水'],[.32,'上池水位慢慢升高'],[.55,'太陽下山，光電發電減少'],[.75,'傍晚放水發電，補上用電缺口']],
 base:u=>{const h=lerp(9,21,seg(u,.02,.95)),k=seg(h,16,19.5);landSky(700,{sun:{x:lerp(300,1600,seg(h,6,19)),y:lerp(90,640,Math.pow(seg(h,12,19.5),1.6))},dusk:k,clouds:false});},
 draw(u){
  const h=lerp(9,21,seg(u,.02,.95)),s=sched(h),dz=lakeAt(h)*14;
  mountain(dz,{dir:s>0?1:s<0?-1:0});
  flowDots(WAY,14,s<0?'#b8ffe0':'#dff6ff',s?1:0,s>0?1:-1,.28,4);
  flowDots(LINE,6,s<0?'#7dffc4':'#f2c230',s?1:0,s>0?1:-1,.5);
  alphaDo(seg(h,17,20.5)*.35,()=>box(VX0,VY0,VX1-VX0,VY1-VY0,'#0e1a2a'));
  /* 一天的曲線（示意） */
  alphaDo(seg(u,.02,.08),()=>{const c=chartBox(640,140,600,250,{title:'光電與抽蓄一天的運轉（示意）',x0:0,x1:24,y0:-100,y1:100,xt:[0,6,12,18,24],yt:[-100,0,100],xl:'時',pt:52,pb:40,pl:58,gx:4,gy:2});
   ctx.beginPath();for(let t=0;t<=24;t+=.2){const x=c.X(t),y=c.Y(pvC(t));t?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='rgba(242,194,48,.85)';ctx.lineWidth=2.5;ctx.stroke();
   for(let t=0;t<h;t+=.25){const v=sched(t);if(v)box(c.X(t),Math.min(c.Y(0),c.Y(v*.7)),c.X(.25)-c.X(0)-1,Math.abs(c.Y(v*.7)-c.Y(0)),v<0?'rgba(125,255,196,.7)':'rgba(88,184,208,.85)');}
   ln([c.X(h),c.py,c.X(h),c.py+c.ph],'#fff',1.5);
   wt(c.X(12.2),c.Y(-88)+4,'抽水',15,'#7dffc4',700,'center');wt(c.X(19.2),c.Y(88)+4,'發電',15,'#7dc8dc',700,'center');wt(c.X(7.4),c.Y(66),'光電',15,'#f2c230',700,'center');});
  lab(300,LU0-dz,'日月潭（上池）',{dx:130,dy:50,st:'s',a:band(u,.08,.5)});
  lab(PYL.x,PYL.y-150,'吸收中午多餘的光電',{dx:-60,dy:80,st:'g',a:band(u,.12,.4)});
  lab(PYL.x,PYL.y-150,'傍晚用電尖峰',{dx:-60,dy:80,st:'w',a:band(u,.72,1)});
 },
 hud(u){hudPanel(240,150,'運轉狀態（示例）',seg(u,.05,.1),w=>{const h=lerp(9,21,seg(u,.02,.95)),s=sched(h);
  hrow(56,'時間',trf('{h}:{m}',{h:Math.floor(h),m:String(Math.floor((h%1)*60)).padStart(2,'0')}),w,'#fff');hrow(88,'模式',s<0?'抽水':s>0?'發電':'待機',w,s<0?'#7dffc4':s>0?'#f2c230':'#fff');
  hrow(120,'上池水位',trf('{z} m',{z:(lakeAt(h)>=0?'+':'')+lakeAt(h).toFixed(2)}),w,'#7dc8dc');});}},

{t:'台灣的抽蓄電廠',en:"Taiwan's pumped-storage plants",dur:12,
 d:'台灣現有兩座抽蓄電廠，都在南投水里溪一帶，共用日月潭當上池。明湖抽蓄電廠（現稱大觀二廠）於 1985 年商轉，4 部 250 MW 機組，以明湖水庫為下池，落差約 310 公尺。明潭抽蓄電廠於 1990 年代陸續完工，6 部 267 MW 機組，以明潭水庫為下池，落差約 380 公尺。兩廠合計約 2,602 MW，廠房都建在山體內的地下洞室，是台電調度尖峰與因應機組跳脫時的重要備援。',
 s:[[0,'兩座抽蓄電廠共用日月潭當上池'],[.3,'明湖：4 部 250 MW，落差約 310 m'],[.55,'明潭：6 部 267 MW，落差約 380 m'],[.78,'合計約 2,602 MW，是電網的重要備援']],
 draw(u){
  diagBG();
  /* 左：配置示意 */
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'配置示意（非比例）',20,'#f2c230',700);
  alphaDo(seg(u,.02,.08),()=>{ctx.beginPath();ctx.ellipse(250,360,150,90,-.2,0,TAU);ctx.fillStyle='#2f7fa3';ctx.fill();ctx.strokeStyle='#dff6ff';ctx.lineWidth=2;ctx.stroke();
   wt(250,352,'日月潭',24,'#fff',700,'center');wt(250,384,'共用上池',16,'rgba(227,236,238,.85)',500,'center');
   ctx.strokeStyle='rgba(125,200,220,.55)';ctx.lineWidth=10;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(420,740);ctx.bezierCurveTo(520,640,560,540,720,470);ctx.stroke();ctx.lineCap='butt';
   wt(700,520,'水里溪',16,'rgba(125,200,220,.9)',600,'right');});
  const m1=seg(u,.28,.36),m2=seg(u,.52,.6);
  alphaDo(m1,()=>{ctx.setLineDash([10,7]);ln([330,410,520,610],'#f2c230',4);ctx.setLineDash([]);flowDots([[330,410],[520,610]],4,'#f2c230',1,1,.5);
   ctx.beginPath();ctx.ellipse(560,630,60,30,.3,0,TAU);ctx.fillStyle='#2f7fa3';ctx.fill();wt(560,690,'明湖水庫',17,'#fff',700,'center');tag(470,500,'大觀二廠',{size:16});});
  alphaDo(m2,()=>{ctx.setLineDash([10,7]);ln([360,330,640,420],'#7dffc4',4);ctx.setLineDash([]);flowDots([[360,330],[640,420]],4,'#7dffc4',1,1,.5);
   ctx.beginPath();ctx.ellipse(670,440,55,28,.3,0,TAU);ctx.fillStyle='#2f7fa3';ctx.fill();wt(690,400,'明潭水庫',17,'#fff',700,'center');tag(470,300,'明潭電廠',{size:16,bg:'#7dffc4'});});
  /* 右：規格卡 */
  const C=[[160,'明湖抽蓄電廠（大觀二廠）','#f2c230',m1,[['商轉','1985 年'],['機組','4 × 250 MW'],['落差','約 310 m'],['下池','明湖水庫']]],
   [420,'明潭抽蓄電廠','#7dffc4',m2,[['完工','1990 年代'],['機組','6 × 267 MW'],['落差','約 380 m'],['下池','明潭水庫']]]];
  C.forEach(([y,n,c,a,R])=>alphaDo(a,()=>{card(800,y,740,236,{bg:'rgba(7,27,39,.75)',st:c});wt(826,y+42,n,21,c,700);
   R.forEach(([k,v],i)=>{const x=826+(i%2)*350,yy=y+100+Math.floor(i/2)*72;wt(x,yy,k,16,'rgba(227,236,238,.75)',600);wt(x,yy+32,v,24,'#fff',700,'left',COND);});}));
  const tk=ease(seg(u,.78,.9));
  alphaDo(seg(u,.76,.82),()=>{card(800,680,740,120,{bg:'rgba(31,127,92,.25)',st:'rgba(125,255,196,.45)'});wt(826,748,'兩廠合計',22,'#fff',700);
   wt(1510,754,trf('{p} MW',{p:Math.round(2602*tk).toLocaleString('en-US')}),44,'#7dffc4',700,'right',COND);});
 }}
]};
