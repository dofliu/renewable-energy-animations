// KITS: land
/* 水力系列 第 1 集：川流式小水力 */
/* 溪谷剖面（示意，比例壓縮）：左上攔水堰、沿山腰的引水道、前池、壓力鋼管、右下廠房與尾水 */
const RV=[[-400,300],[200,302],[236,300],[262,318],[400,352],[600,410],[800,470],[1000,540],[1150,608],[1300,642],[1500,660],[2000,672]];
const WL0=268;                                   // 攔水堰上游水位
const WEIR={x:236,w:26,top:264};
const CANAL=[[290,276],[380,277],[890,284]];     // 引水道水面
const SB={x:300,w:84};                           // 沉砂池
const FB={x:890,w:44};                           // 前池
const PEN=[[930,300],[1000,380],[1150,588]];     // 壓力鋼管
const PH={x:1130,y:552,w:112,h:56};              // 廠房
const TAIL=[[1242,600],[1300,630]];
const HILL=[[-400,150],[0,170],[300,190],[600,200],[900,230],[1100,330],[1300,440],[1600,520],[2000,540]];
function pl(P,col,lw){ctx.lineJoin='round';ln(P.flat(),col,lw);}
function pf(P,x){for(let i=1;i<P.length;i++)if(x<=P[i][0]){const a=P[i-1],b=P[i],t=(x-a[0])/(b[0]-a[0]);return lerp(a[1],b[1],t);}return P[P.length-1][1];}
const rvY=x=>pf(RV,x);
/* 沿折線 P 取比例 f 的點 */
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,dir,sp,r){if(a<=0)return;for(let k=0;k<n;k++){let f=((TT*(sp||.3))+k/n)%1;if(dir<0)f=1-f;const p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4.5,col));}}
const RIVER_DOWN=[[262,318],[400,352],[600,410],[800,470],[1000,540],[1150,608],[1300,642],[1600,662]];
/* 河道水體：dLow 減水段水深、dHigh 尾水匯入後水深（像素） */
function riverWater(dLow,dHigh){
  const g=ctx.createLinearGradient(0,250,0,700);g.addColorStop(0,'#4ea3c4');g.addColorStop(1,'#1d5f86');
  ctx.beginPath();ctx.moveTo(-400,WL0);ctx.lineTo(WEIR.x,WL0);ctx.lineTo(WEIR.x,rvY(WEIR.x)+2);ctx.lineTo(-400,rvY(-400)+2);ctx.closePath();ctx.fillStyle=g;ctx.fill();
  ln([-400,WL0,WEIR.x,WL0],'rgba(255,255,255,.75)',2);
  const dep=x=>x<1296?dLow:dHigh;
  ctx.beginPath();for(let x=262;x<=2000;x+=8)ctx.lineTo(x,rvY(x)-dep(x));for(let x=2000;x>=262;x-=8)ctx.lineTo(x,rvY(x)+2);ctx.closePath();ctx.fillStyle='#3f93b8';ctx.fill();
}
function valley(o){
  o=o||{};
  /* 遠山與山腰 */
  ctx.beginPath();ctx.moveTo(-400,1000);HILL.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(2000,1000);ctx.closePath();ctx.fillStyle='#7f9e62';ctx.fill();
  const r=rng(8);for(let i=0;i<40;i++){const x=-200+r()*2000,y=pf(HILL,x);circ(x,y-6,8+r()*5,'#5d8646');}
  /* 引水道（沿山腰，坡度很緩） */
  ctx.fillStyle='#9aa4aa';ctx.fillRect(CANAL[0][0]-6,272,FB.x+FB.w-CANAL[0][0]+12,24);
  ctx.beginPath();CANAL.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.lineTo(890,292);ctx.lineTo(290,292);ctx.closePath();ctx.fillStyle='#3f93b8';ctx.fill();
  box(SB.x,277,SB.w,26,'#3f93b8','#9aa4aa',3);                                     // 沉砂池
  box(FB.x,280,FB.w,26,'#3f93b8','#9aa4aa',3);                                     // 前池
  for(let k=0;k<5;k++)ln([284+k*3,268,284+k*3,294],'#44535c',1.5);                // 攔污柵
  /* 河谷前景 */
  ctx.beginPath();ctx.moveTo(-400,rvY(-400));RV.forEach(p=>ctx.lineTo(p[0],p[1]));ctx.lineTo(2000,1000);ctx.lineTo(-400,1000);ctx.closePath();ctx.fillStyle='#8f7d68';ctx.fill();
  ctx.beginPath();ctx.moveTo(-400,rvY(-400)+60);RV.forEach(p=>ctx.lineTo(p[0],p[1]+60));ctx.lineTo(2000,1000);ctx.lineTo(-400,1000);ctx.closePath();ctx.fillStyle='#716a62';ctx.fill();
  riverWater(o.low===undefined?6:o.low,o.high===undefined?16:o.high);
  /* 攔水堰與魚道 */
  box(WEIR.x,WEIR.top,WEIR.w,rvY(WEIR.x)-WEIR.top+10,'#b8c0c4','rgba(0,0,0,.35)',1.5);
  ctx.beginPath();ctx.moveTo(WEIR.x+WEIR.w,WEIR.top+8);for(let k=0;k<5;k++){ctx.lineTo(WEIR.x+WEIR.w+8+k*8,WEIR.top+8+k*9);ctx.lineTo(WEIR.x+WEIR.w+8+k*8,WEIR.top+17+k*9);}ctx.strokeStyle='#c9d1d6';ctx.lineWidth=2.5;ctx.stroke();
  box(WEIR.x+4,WEIR.top+22,8,rvY(WEIR.x)-WEIR.top-22,'#5c6770');                     // 排砂門
  /* 壓力鋼管、廠房、尾水道 */
  ctx.lineCap='round';pl(PEN,'#44535c',14);pl(PEN,o.dry?'#3a4a54':'#5f7f92',7);ctx.lineCap='butt';
  box(PH.x,PH.y,PH.w,PH.h,'#d9dfe2','rgba(0,0,0,.35)',1.5);poly([PH.x-6,PH.y,PH.x+PH.w/2,PH.y-22,PH.x+PH.w+6,PH.y],'#8a4a3a');
  for(let k=0;k<3;k++)box(PH.x+14+k*32,PH.y+14,18,14,'#6f8a9a');
  ln(TAIL.flat(),'#44535c',12);ln(TAIL.flat(),'#3f93b8',7);
  /* 送電 */
  const px=1380,py=pf(RV,1380);ln([px,py,px,py-120],'#6b5a48',5);ln([px-24,py-110,px+24,py-110],'#6b5a48',3);
  ln([PH.x+PH.w,PH.y+10,px,py-110,1700,py-150],'#394650',2);
}
/* 衝擊式：佩爾頓轉輪（側視），ang 轉角 */
function pelton(cx,cy,R,ang){
  circ(cx,cy,R*.62,'#44535c','#c9d1d6',2);
  for(let k=0;k<18;k++){const a=ang+k*TAU/18;ctx.save();ctx.translate(cx+Math.cos(a)*R*.8,cy+Math.sin(a)*R*.8);ctx.rotate(a+Math.PI/2);
   ctx.beginPath();ctx.ellipse(0,0,R*.13,R*.2,0,0,TAU);ctx.fillStyle='#b8c7d0';ctx.fill();ctx.strokeStyle='#44535c';ctx.lineWidth=2;ctx.stroke();
   ln([0,-R*.18,0,R*.18],'#44535c',1.5);ctx.restore();}
  circ(cx,cy,R*.18,'#c9d1d6');circ(cx,cy,R*.07,'#44535c');
}
/* 反擊式：法蘭西斯轉輪俯視 */
function runnerTop(cx,cy,R,ang,col){
  ctx.save();ctx.translate(cx,cy);ctx.rotate(ang);
  for(let k=0;k<9;k++){ctx.save();ctx.rotate(k*TAU/9);ctx.beginPath();ctx.moveTo(R*.3,0);ctx.quadraticCurveTo(R*.62,R*.34,R*.95,R*.22);ctx.lineTo(R*.95,R*.08);ctx.quadraticCurveTo(R*.62,R*.18,R*.3,-R*.08);ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.restore();}
  ctx.restore();circ(cx,cy,R*.3,'#44535c','#c9d1d6',2);circ(cx,cy,R*.1,'#c9d1d6');
}
/* 灌溉渠道落差工場景 */
const CUP=585,CDN=640,DROP=780;
function canalScene(u){
  landSky(560,{sun:{x:1260,y:130},clouds:true});
  box(VX0,560,VX1-VX0,40,'#86a95e');
  const r=rng(21);for(let i=0;i<120;i++){const x=VX0+r()*(VX1-VX0),y=562+r()*34;ln([x,y,x-2,y-6],'#5c8a3f',1.5);ln([x,y,x+3,y-5],'#5c8a3f',1.5);}
  /* 地層 */
  ctx.beginPath();ctx.moveTo(VX0,600);ctx.lineTo(DROP,600);ctx.lineTo(DROP+30,628);ctx.lineTo(VX1,628);ctx.lineTo(VX1,VY1+20);ctx.lineTo(VX0,VY1+20);ctx.closePath();ctx.fillStyle='#a4876a';ctx.fill();
  box(VX0,730,VX1-VX0,VY1-710,'#8a7560');
  /* 渠道 */
  box(VX0,CUP,DROP-VX0,36,'#3f93b8');box(DROP,CDN,VX1-DROP,32,'#3f93b8');
  ln([VX0,CUP+36,DROP,CUP+36,DROP,CDN+32,VX1,CDN+32],'#9aa4aa',6);
  ln([VX0,CUP,DROP,CUP],'rgba(255,255,255,.8)',2);ln([DROP,CDN,VX1,CDN],'rgba(255,255,255,.8)',2);
  /* 落差工的水舌 */
  const fa=1-.55*seg(u,.25,.35);ctx.fillStyle=`rgba(190,230,245,${.85*fa})`;ctx.beginPath();ctx.moveTo(DROP,CUP);ctx.quadraticCurveTo(DROP+22,CUP+4,DROP+30,CDN);ctx.lineTo(DROP+8,CDN);ctx.quadraticCurveTo(DROP+4,CUP+30,DROP-2,CUP+34);ctx.closePath();ctx.fill();
  for(let k=0;k<6;k++){const f=(TT*1.3+k/6)%1;alphaDo(fa*(1-f),()=>circ(DROP+18+k*5,CDN-4+f*6,3,'#fff'));}
  /* 旁通管與機房 */
  const on=seg(u,.25,.32);
  const PP=[[640,600],[700,640],[860,652],[900,652]];
  ctx.lineCap='round';pl(PP,'#44535c',14);pl(PP,'#5f7f92',7);ctx.lineCap='butt';
  box(836,560,120,80,'#d9dfe2','rgba(0,0,0,.35)',1.5);poly([830,560,896,538,962,560],'#8a4a3a');
  circ(880,610,20,'#44535c','#c9d1d6',2);ctx.save();ctx.translate(880,610);ctx.rotate(TT*4*on);for(let k=0;k<8;k++){ctx.rotate(TAU/8);ln([0,0,17,0],'#c9d1d6',2);}ctx.restore();
  box(912,590,34,30,'#6f8a9a');
  box(620,586,24,14,'#5c6770');
  ln([956,600,990,648],'#3f93b8',7);
  flowDots(PP,6,'#dff6ff',on,1,.6,4);
  /* 電桿 */
  ln([1120,600,1120,440],'#6b5a48',5);ln([1096,452,1144,452],'#6b5a48',3);box(1108,470,24,28,'#8d989f');
  ln([956,580,1108,480],'#394650',2);ln([VX0,440,1120,452,VX1,440],'#394650',1.5);
  flowDots([[960,578],[1110,482]],4,'#f2c230',on,1,.7,3.5);
  /* 田與遠樹 */
  const r2=rng(4);for(let i=0;i<22;i++){const x=VX0+r2()*(VX1-VX0);circ(x,548,10+r2()*6,'#5d8646');}
}

const EP={no:1,slug:'hydropower',seriesName:'水力系列',t:'川流式小水力',en:'Run-of-river small hydropower',
lede:'不必築起大壩，也能用溪水發電。這一集走進川流式小水力電廠，看水如何從攔水堰取入、沿著引水道來到前池，再經壓力鋼管衝進廠房；接著用落差與流量算出發電量，打開衝擊式與反擊式兩大類水輪機，最後看看怎麼依場址條件挑選機型，以及台灣灌溉渠道裡的小水力。',
facts:[['20,000','kW','台灣法規中小水力的上限：利用既有水利設施、裝置容量未達 2 萬瓩'],
['9.81','× Q × H × η','小水力的功率（kW）約等於 9.81 乘上流量 Q（m³/s）、落差 H（m）與效率 η'],
['約 830','kW','流量 2 m³/s、落差 50 m、效率 0.85 時的出力（示例）'],
['約 63','m/s','落差 200 m 的水從噴嘴射出的理論速度，推動佩爾頓轉輪（示例）'],
['100','kW','常見以 100 kW 以下稱為微水力，適合灌溉渠道與小型落差工'],
['47 + 2','處','水利署 2023 年評估的小水力潛能點：河川 47 處、灌溉渠道 2 處']],
note:'說明：本集為教育用途示意動畫，溪谷、引水道與廠房比例經過壓縮。小水力定義（利用非發電用之水路、渠道或既有水利設施，裝置容量未達 20,000 kW）依再生能源相關法規與能源署、台電公開說明；水利署潛能點數量取自其公開資料。流量 2 m³/s、落差 50 m、效率 0.85、容量因數、河川流量與生態基流、渠道機組 200 kW 等數值均為典型範例；各型水輪機的適用落差與流量範圍參考 ESHA 小水力指引與設備商選型圖的常見區間，實際依場址與機組設計而定。',
base:()=>{landSky(640,{sun:{x:1240,y:110},clouds:true});},
shots:[
{t:'不築大壩的水力電廠',en:'A hydro plant without a big dam',dur:13,side:true,
 d:'川流式小水力不需要大水庫。它在溪流上築一道低矮的攔水堰，把部分溪水導入沿著山腰緩緩前進的引水道。溪床往下游落得很快，引水道卻幾乎保持水平，走了一段距離後，兩者之間就拉出數十公尺的高度差。水在前池沉澱、穩定後，進入壓力鋼管衝下山坡，推動廠房裡的水輪機發電，最後經尾水道回到溪裡。水只是借用一段路，並沒有被消耗。',
 s:[[0,'溪流上的攔水堰，把部分溪水導入引水道'],[.26,'引水道沿山腰緩緩前進，溪床卻快速下降'],[.5,'前池的水進入壓力鋼管，衝向廠房'],[.76,'發電後的水經尾水道回到溪裡']],
 cam:u=>camMix({x:800,y:450,s:1},{x:780,y:430,s:1.06},ease(seg(u,.1,.7))),
 draw(u){
  valley();
  flowDots([[-300,WL0-6],[WEIR.x-10,WL0-6]],6,'#dff6ff',1,1,.2,3.5);
  flowDots(CANAL.concat([[FB.x+20,284]]),12,'#dff6ff',seg(u,.04,.12),1,.12,3.5);
  flowDots(PEN,6,'#dff6ff',seg(u,.48,.54),1,.6,4);
  flowDots(TAIL,3,'#dff6ff',seg(u,.72,.78),1,.9,3.5);
  flowDots(RIVER_DOWN.map(p=>[p[0],p[1]-3]),10,'#dff6ff',.8,1,.08,2.5);
  const hA=seg(u,.3,.45);
  alphaDo(band(u,.3,.72),()=>{ctx.setLineDash([8,7]);ln([FB.x+FB.w,280,1440,280],'rgba(255,255,255,.75)',1.5);ln([1300,630,1440,630],'rgba(255,255,255,.75)',1.5);ctx.setLineDash([]);
   arrow(1420,284,1420,lerp(284,626,hA),'#f2c230',3);tick(1430,455,'落差 H','left');});
  lab(WEIR.x+13,WEIR.top,'攔水堰',{dx:-60,dy:-80,st:'s',a:band(u,.03,.3)});
  lab(620,280,'引水道',{dx:20,dy:-90,st:'s',a:band(u,.24,.5)});
  lab(FB.x+22,282,'前池',{dx:60,dy:-80,a:band(u,.44,.7)});
  lab(1040,440,'壓力鋼管',{dx:-150,dy:40,a:band(u,.48,.76)});
  lab(PH.x+PH.w/2,PH.y,'廠房',{dx:-80,dy:-70,st:'l',a:band(u,.62,1)});
  lab(1280,622,'尾水回到溪裡',{dx:60,dy:80,st:'g',a:band(u,.74,1)});
 },
 hud(u){hudPanel(240,150,'小水力電廠（示例）',seg(u,.05,.1),w=>{const g=ease(seg(u,.52,.72));
  hrow(56,'流量',trf('{q} m³/s',{q:(2*seg(u,.06,.2)).toFixed(1)}),w,'#7dc8dc');hrow(88,'落差','50 m',w,'#fff');hrow(120,'出力',Math.round(834*g)+' kW',w,'#f2c230');});}},

{t:'落差乘流量，就是發電量',en:'Head times flow',dur:13,
 d:'水力發電的能量來自兩件事：落差 H，也就是水能往下落多高；流量 Q，也就是每秒有多少水通過。功率可寫成 P = ρgQHη，把水的密度與重力加速度代入，就簡化成 P ≈ 9.81 × Q × H × η，單位是 kW。以本集的示例電廠為例，每秒 2 立方公尺的水、落差 50 公尺、整體效率 0.85，出力約 830 kW。同樣的功率，若場址落差只有 5 公尺，就需要十倍的流量，機組與水路也要大得多。',
 s:[[0,'發電量取決於落差 H 與流量 Q'],[.28,'P ≈ 9.81 × Q × H × η（kW）'],[.52,'2 m³/s、50 m、效率 0.85，約 830 kW'],[.76,'落差只有 5 m，就需要十倍的流量']],
 draw(u){
  diagBG();
  card(60,160,560,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'落差與流量',20,'#f2c230',700);
  const yT=280,yB=690;
  box(100,yT,150,40,'#2f7fa3');ln([100,yT,250,yT],'#dff6ff',2);wt(175,yT-14,'前池',18,'#fff',700,'center');
  box(400,yB,180,40,'#2f7fa3');ln([400,yB,580,yB],'#dff6ff',2);wt(490,yB-14,'尾水',18,'#fff',700,'center');
  const P=[[240,yT+30],[300,yT+60],[400,yB-40],[430,yB+14]];
  ctx.lineCap='round';pl(P,'#26343d',22);pl(P,'#3b7fa0',12);ctx.lineCap='butt';
  flowDots(P,8,'#dff6ff',seg(u,.05,.12),1,.45,4);
  const hA=seg(u,.06,.2);alphaDo(hA,()=>{ctx.setLineDash([6,6]);ln([250,yT,570,yT],'rgba(255,255,255,.6)',1.5);ctx.setLineDash([]);arrow(550,yT+4,550,lerp(yT+4,yB-4,hA),'#f2c230',3);});
  alphaDo(seg(u,.16,.22),()=>{wt(536,(yT+yB)/2-8,'H',34,'#f2c230',700,'right',COND);wt(536,(yT+yB)/2+26,'50 m',24,'#f2c230',700,'right',COND);});
  alphaDo(seg(u,.2,.26),()=>{wt(330,440,'Q',30,'#7dc8dc',700,'right',COND);wt(330,472,'2 m³/s',20,'#7dc8dc',700,'right',COND);});
  card(660,160,880,380,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.5)'});wt(684,200,'發電功率',20,'#f2c230',700);
  alphaDo(seg(u,.28,.34),()=>{wt(1100,270,'P ≈ 9.81 · Q · H · η',46,'#fff',700,'center',COND);wt(1100,306,'單位 kW；9.81 來自水的密度 × 重力加速度',16,'rgba(227,236,238,.8)',500,'center');});
  const V=[['9.81','kN/m³','水的單位重'],['Q','2 m³/s','流量（示例）'],['H','50 m','落差（示例）'],['η','0.85','整體效率（示例）']];
  V.forEach(([s,v,n],i)=>{const a=seg(u,.34+i*.04,.38+i*.04);alphaDo(a,()=>{const x=690+i*210;card(x,328,196,112,{bg:'rgba(255,255,255,.05)'});wt(x+98,364,s,28,'#f2c230',700,'center',COND);wt(x+98,396,v,19,'#fff',700,'center',COND);wt(x+98,424,n,15,'rgba(227,236,238,.8)',500,'center');});});
  const pk=ease(seg(u,.52,.68));
  alphaDo(seg(u,.52,.56),()=>{wt(690,500,'示例電廠出力',20,'#fff',700);wt(1510,504,trf('≈ {p} kW',{p:Math.round(834*pk)}),40,'#7dffc4',700,'right',COND);});
  /* 下：低落差對照 */
  alphaDo(seg(u,.74,.8),()=>{card(660,570,880,230,{bg:'rgba(31,127,92,.22)',st:'rgba(125,255,196,.45)'});
   wt(690,610,'同樣約 830 kW',20,'#7dffc4',700);
   const k=ease(seg(u,.78,.92));
   wt(690,660,'H = 50 m',22,'#fff',700,'left',COND);box(820,644,lerp(0,60,k),22,'#58b8d0');wt(900,662,'Q = 2 m³/s',20,'#fff',700,'left',COND);
   wt(690,712,'H = 5 m',22,'#fff',700,'left',COND);box(820,696,lerp(0,600,k),22,'#ff8a60');wt(1440,714,'Q = 20 m³/s',20,'#fff',700,'right',COND);
   wt(690,770,'落差越小，需要的流量與機組尺寸越大',18,'rgba(227,236,238,.9)',500);});
 }},

{t:'攔水堰與取水',en:'Weir and intake',dur:13,side:true,
 d:'攔水堰只把水位抬高一點，讓進水口能穩定取水，而不是像水庫那樣大量蓄水。進水口前的攔污柵擋住樹枝與落葉，堰旁的排砂門定期沖走淤積的砂石，沉砂池讓水中的細砂沉下，避免磨損水輪機。更重要的是，堰到尾水口之間的河段稱為減水段，必須保留足夠的生態基流，並設置魚道讓魚蝦上下洄游。枯水期溪流變小時，電廠要先減少取水，把基流留給河川。',
 s:[[0,'攔水堰把水位稍微抬高，讓進水口穩定取水'],[.24,'攔污柵擋住漂流物，沉砂池讓細砂沉下'],[.48,'魚道與生態基流，讓減水段的河川仍然活著'],[.72,'枯水期流量變小，電廠先減少取水']],
 cam:u=>{const k=ease(seg(u,.04,.2))*(1-ease(seg(u,.5,.66)));return camMix({x:800,y:450,s:1},{x:330,y:300,s:2.6},k);},
 draw(u){
  const dry=seg(u,.7,.9);
  valley({low:lerp(6,4,dry)});
  flowDots([[-300,WL0-6],[WEIR.x-10,WL0-6]],6,'#dff6ff',1,1,.2,3);
  flowDots(CANAL.concat([[FB.x+20,284]]),12,'#dff6ff',1-dry*.5,1,.12,3);
  /* 越過魚道的基流 */
  flowDots([[WEIR.x+WEIR.w,WEIR.top+6],[WEIR.x+WEIR.w+40,WEIR.top+48],[WEIR.x+WEIR.w+60,rvY(WEIR.x+80)-4]],5,'#dff6ff',1,1,.5,2.5);
  flowDots(RIVER_DOWN.map(p=>[p[0],p[1]-3]),10,'#dff6ff',1,1,.08,2.5);
  /* 小魚沿魚道上溯 */
  alphaDo(band(u,.44,.66),()=>{const f=(TT*.25)%1,p=ptAt([[WEIR.x+WEIR.w+64,WEIR.top+50],[WEIR.x+WEIR.w+4,WEIR.top+6]],f);ctx.save();ctx.translate(p[0],p[1]);ctx.rotate(-2.4);ctx.beginPath();ctx.ellipse(0,0,6,2.6,0,0,TAU);ctx.fillStyle='#e3ecee';ctx.fill();ctx.restore();});
  lab(WEIR.x+13,WEIR.top,'攔水堰',{dx:-70,dy:-70,st:'s',a:band(u,.06,.26)});
  lab(287,282,'攔污柵',{dx:10,dy:-80,a:band(u,.24,.48)});
  lab(SB.x+SB.w/2,300,'沉砂池',{dx:60,dy:60,a:band(u,.26,.48)});
  lab(WEIR.x+8,rvY(WEIR.x)-20,'排砂門',{dx:-90,dy:50,minor:true,a:band(u,.12,.3)});
  lab(WEIR.x+WEIR.w+24,WEIR.top+30,'魚道',{dx:60,dy:70,st:'g',a:band(u,.46,.66)});
  lab(700,rvY(700)-6,'減水段：保留生態基流',{dx:40,dy:90,st:'g',a:band(u,.62,1)});
 },
 hud(u){hudPanel(240,150,'流量分配（示例）',seg(u,.05,.1),w=>{const dry=seg(u,.7,.9),R=lerp(5,1.8,dry),E=.5,I=Math.min(2,R-E);
  hrow(56,'溪流流量',trf('{q} m³/s',{q:R.toFixed(1)}),w,'#7dc8dc');hrow(88,'電廠取水',trf('{q} m³/s',{q:I.toFixed(1)}),w,'#f2c230');hrow(120,'留給河川',trf('{q} m³/s',{q:(R-I).toFixed(1)}),w,'#7dffc4');});}},

{t:'衝擊式水輪機：用水柱去撞',en:'Impulse turbines',dur:13,
 d:'衝擊式水輪機把水的壓力在噴嘴一次轉成高速水柱，再用水柱去撞擊轉輪。最具代表性的是佩爾頓水輪機：轉輪周圍排列著一圈雙碗形的水斗，水柱打在水斗中央被分成兩半，幾乎折返 180 度，把動能交給轉輪。轉輪在空氣中旋轉，不必浸在水裡。落差 200 公尺時，噴嘴出口的理論流速約每秒 63 公尺。噴嘴內的針閥前後移動，就能調整水量與出力。另一種常見於小水力的橫流式水輪機，構造簡單、易於維修，適合中低落差。',
 s:[[0,'噴嘴把水壓變成高速水柱'],[.28,'水柱打進水斗，被分成兩半折返'],[.52,'落差 200 m，水柱速度約 63 m/s'],[.76,'橫流式構造簡單，常見於小水力']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'佩爾頓水輪機（示意）',20,'#f2c230',700);
  const cx=450,cy=440,R=190,on=seg(u,.06,.14);
  box(cx-R-20,cy-R-20,2*R+40,R*.9,'rgba(255,255,255,.06)','rgba(255,255,255,.25)',1.5);    // 機殼上半
  pelton(cx,cy,R,TT*1.4*on);
  /* 噴嘴與水柱：切線打在轉輪下緣 */
  const jy=cy+R*.8;poly([100,jy-26,220,jy-26,250,jy-9,250,jy+9,220,jy+26,100,jy+26],'#6f7a80','#c9d1d6',2);
  const nv=lerp(0,14,seg(u,.84,.95));poly([150+nv,jy-6,230+nv,jy,150+nv,jy+6],'#c9d1d6');
  alphaDo(on,()=>{box(250,jy-8,cx-250,16,'rgba(190,230,245,.85)');
   for(let k=0;k<8;k++){const f=(TT*2+k/8)%1;circ(cx+10+f*40,jy+20+f*120,4-f*2,'rgba(223,246,255,.8)');circ(cx-10+f*20,jy+26+f*130,3.5-f*2,'rgba(223,246,255,.7)');}});
  box(cx-R-20,cy+R+30,2*R+40,30,'rgba(59,127,160,.6)');
  alphaDo(seg(u,.04,.1),()=>{wt(100,jy-40,'噴嘴',17,'rgba(227,236,238,.9)',600);wt(cx+R+30,cy-R*.6,'水斗',17,'rgba(227,236,238,.9)',600,'right');wt(cx-R-10,cy+R+80,'尾水',17,'rgba(227,236,238,.9)',600);});
  alphaDo(seg(u,.84,.9),()=>wt(100,jy+60,'針閥調整水量',17,'#7dffc4',700));
  /* 右上：水斗分流 */
  card(800,160,740,300,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.5)'});wt(826,200,'水斗把水柱分成兩半',20,'#f2c230',700);
  alphaDo(seg(u,.28,.34),()=>{const bx=1130,by=320;
   ctx.beginPath();ctx.ellipse(bx-40,by,40,70,0,Math.PI*.5,Math.PI*1.5);ctx.strokeStyle='#b8c7d0';ctx.lineWidth=10;ctx.stroke();
   ctx.beginPath();ctx.ellipse(bx+40,by,40,70,0,-Math.PI*.5,Math.PI*.5);ctx.stroke();ln([bx,by-70,bx,by+70],'#b8c7d0',4);
   const f=seg(u,.3,.5);arrow(bx,by+150,bx,by+lerp(150,78,f),'#dff6ff',5);
   alphaDo(seg(u,.42,.5),()=>{arrow(bx-10,by-60,bx-120,by+60,'#7dc8dc',3);arrow(bx+10,by-60,bx+120,by+60,'#7dc8dc',3);});
   wt(830,300,'水柱',18,'#fff',700);wt(830,334,'由下方射入',16,'rgba(227,236,238,.8)',500);
   wt(1500,300,'約 165° 折返',18,'#7dc8dc',700,'right');wt(1500,334,'動能幾乎全交給轉輪',16,'rgba(227,236,238,.8)',500,'right');});
  /* 右中：速度 */
  alphaDo(seg(u,.52,.58),()=>{card(800,480,740,140,{bg:'rgba(31,127,92,.22)',st:'rgba(125,255,196,.45)'});
   wt(826,528,'v = √(2gH)',30,'#fff',700,'left',COND);wt(826,578,'H = 200 m（示例）',18,'rgba(227,236,238,.9)',500);
   wt(1510,572,trf('≈ {v} m/s',{v:Math.round(63*ease(seg(u,.54,.68)))}),44,'#7dffc4',700,'right',COND);});
  /* 右下：橫流式 */
  alphaDo(seg(u,.76,.82),()=>{card(800,640,740,160,{bg:'rgba(7,27,39,.75)'});wt(826,680,'橫流式水輪機',20,'#f2c230',700);
   const x=1400,y=722,rr=50;ring(x,y,rr,'#b8c7d0',3);ctx.save();ctx.translate(x,y);ctx.rotate(TT*1.5);for(let k=0;k<16;k++){ctx.rotate(TAU/16);ln([rr*.62,0,rr,10],'#b8c7d0',2);}ctx.restore();
   flowDots([[x-110,y-60],[x-30,y-30],[x+20,y+20],[x+40,y+80]],5,'#dff6ff',1,1,.7,4);
   wt(826,724,'水流兩次穿過圓筒形轉輪',17,'#fff',600);wt(826,760,'構造簡單、好維修，適合中低落差',17,'rgba(227,236,238,.85)',500);});
 }},

{t:'反擊式水輪機：泡在水裡轉',en:'Reaction turbines',dur:13,
 d:'反擊式水輪機的轉輪完全浸在水中，水的壓力與速度一起推動葉片，水流過轉輪時壓力逐漸降低。法蘭西斯水輪機是最常見的一種：水從蝸殼四周均勻流入，經過可調角度的導翼，轉向後進入轉輪，再從中心往下流出。卡普蘭水輪機像船的螺旋槳，葉片角度可以隨流量調整，適合低落差、大流量的場址。兩者出口都接著尾水管，讓水流慢慢減速，回收剩餘的能量。',
 s:[[0,'反擊式的轉輪完全浸在水中'],[.26,'法蘭西斯：水從蝸殼經導翼流入轉輪'],[.52,'卡普蘭：可調角度的螺旋槳，適合低落差'],[.76,'水流過轉輪時，壓力逐漸降低']],
 draw(u){
  diagBG();
  /* 左：法蘭西斯俯視 */
  const fA=seg(u,.02,.08),kA=seg(u,.48,.54);
  card(60,160,720,500,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.5)'});wt(84,200,'法蘭西斯水輪機（俯視）',20,'#f2c230',700);
  alphaDo(fA,()=>{const cx=400,cy=430;
   ctx.beginPath();for(let a=0;a<=TAU*.95;a+=.05){const r=210-a*14;const x=cx+r*Math.cos(a-Math.PI/2),y=cy+r*.95*Math.sin(a-Math.PI/2);a?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#8d989f';ctx.lineWidth=26;ctx.stroke();
   box(cx-20,cy-236,300,40,'#8d989f');wt(cx+270,cy-206,'進水',16,'#13232e',700,'right');
   const gv=lerp(.25,.7,seg(u,.3,.4));
   for(let k=0;k<16;k++){const a=k*TAU/16,x=cx+128*Math.cos(a),y=cy+128*Math.sin(a);ctx.save();ctx.translate(x,y);ctx.rotate(a+Math.PI/2+gv);box(-3,-16,6,32,'#c9d1d6');ctx.restore();}
   runnerTop(cx,cy,100,TT*1.8,'#7fb3cf');
   for(let k=0;k<10;k++){const f=((TT*.35)+k/10)%1,a=f*TAU*.9-Math.PI/2,r=190-f*80;circ(cx+r*Math.cos(a),cy+r*.95*Math.sin(a),3.5,'rgba(223,246,255,.9)');}
   alphaDo(seg(u,.26,.32),()=>{wt(640,560,'蝸殼',17,'rgba(227,236,238,.9)',600,'right');tag(560,300,'導翼',{size:16});wt(400,590,'轉輪',17,'#fff',700,'center');});});
  /* 右：卡普蘭側視 */
  card(820,160,720,500,{bg:'rgba(7,27,39,.75)',st:kA>.5?'rgba(125,255,196,.55)':'rgba(255,255,255,.16)'});wt(844,200,'卡普蘭水輪機（側視）',20,kA>.5?'#7dffc4':'#f2c230',700);
  alphaDo(kA,()=>{const cx=1180;
   ln([cx,230,cx,380],'#c9d1d6',12);box(cx-60,236,120,44,'#44535c','#c9d1d6',2);wt(cx+76,264,'發電機',16,'rgba(227,236,238,.9)',600);
   poly([cx-160,380,cx+160,380,cx+120,440,cx+220,620,cx-220,620,cx-120,440],'rgba(59,127,160,.45)','#8d989f',3);
   const pit=lerp(.2,.9,.5+.5*Math.sin(TT*.9));
   ctx.save();ctx.translate(cx,430);
   const sp=TT*3;for(let k=0;k<4;k++){const a=sp+k*TAU/4,cs=Math.cos(a),sn=Math.sin(a),x=cs*100;if(sn<0)continue;const hw=(6+pit*14)*(.4+.6*sn);
    poly([cs*26,-8,x,-hw,x,hw,cs*26,8],'#7fb3cf','#c9d1d6',1.5);}
   ctx.beginPath();ctx.ellipse(0,0,30,20,0,0,TAU);ctx.fillStyle='#c9d1d6';ctx.fill();
   ctx.restore();
   flowDots([[cx-70,390],[cx-80,470],[cx-150,610]],4,'#dff6ff',1,1,.6,4);flowDots([[cx+70,390],[cx+80,470],[cx+150,610]],4,'#dff6ff',1,1,.6,4);
   wt(cx+120,480,'可調葉片',17,'#7dffc4',700,'left');wt(cx,600,'尾水管',17,'rgba(227,236,238,.9)',600,'center');});
  /* 下：壓力變化 */
  alphaDo(seg(u,.76,.82),()=>{card(60,680,1480,120,{bg:'rgba(31,127,92,.22)',st:'rgba(125,255,196,.45)'});
   wt(90,730,'水壓變化',20,'#7dffc4',700);
   const k=ease(seg(u,.78,.95)),X0=300,X1=1500;
   ctx.beginPath();for(let i=0;i<=40*k;i++){const f=i/40,x=lerp(X0,X1,f),p=f<.3?1:f<.7?lerp(1,.15,(f-.3)/.4):.15-.05*(f-.7)/.3;const y=780-p*60;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#f2c230';ctx.lineWidth=4;ctx.stroke();
   wt(X0,776,'蝸殼與導翼',16,'rgba(227,236,238,.85)',600);wt(lerp(X0,X1,.5),776,'轉輪',16,'#fff',700,'center');wt(X1,776,'尾水管',16,'rgba(227,236,238,.85)',600,'right');});
 }},

{t:'怎麼挑水輪機',en:'Choosing a turbine',dur:12,
 d:'水輪機的選擇主要看落差與流量。高落差、小流量的山區溪流適合佩爾頓等衝擊式機組；中等落差、中等流量的場址常用法蘭西斯；落差只有數公尺、流量很大的河堰或渠道，則適合卡普蘭或螺旋槳式；橫流式涵蓋的範圍較廣，常見於中小型電廠。圖上的斜線是相同功率的組合。實際選型還要考慮流量一年四季的變化、機組在部分負載時的效率、泥砂磨損與維修方便性。',
 s:[[0,'橫軸是流量，縱軸是落差'],[.25,'高落差、小流量：佩爾頓等衝擊式'],[.5,'中落差用法蘭西斯，低落差大流量用卡普蘭'],[.75,'還要看季節流量、泥砂與維修條件']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,960,640,{title:'水輪機適用範圍（示意）',x0:-1,x1:2,y0:0,y1:3,pl:90,pb:80,pt:76,gx:3,gy:3});
  ['0.1','1','10','100'].forEach((t,i)=>wt(c.X(i-1),c.py+c.ph+24,t,16,'rgba(227,236,238,.75)',600,'center',COND));
  ['1','10','100','1000'].forEach((t,i)=>wt(c.px-12,c.Y(i)+5,t,16,'rgba(227,236,238,.75)',600,'right',COND));
  wt(c.px+c.pw-8,c.py+c.ph-12,'流量 Q（m³/s）',16,'rgba(227,236,238,.7)',500,'right');wt(c.px,c.py-14,'落差 H（m）',16,'rgba(227,236,238,.7)',500,'left');
  const L=Math.log10,reg=(q0,q1,h0,h1,col,name,a,tx,ty)=>alphaDo(a,()=>{const x0=c.X(L(q0)),x1=c.X(L(q1)),y0=c.Y(L(h1)),y1=c.Y(L(h0));rrp(x0,y0,x1-x0,y1-y0,40);ctx.fillStyle=col;ctx.fill();ctx.strokeStyle=col.replace(/[\d.]+\)$/,'.9)');ctx.lineWidth=2;ctx.stroke();NAMES.push([c.X(L(tx)),c.Y(L(ty)),name,a]);});
  const NAMES=[];
  const a0=seg(u,.02,.08);
  /* 等功率線 */
  alphaDo(a0,()=>{ctx.save();ctx.beginPath();ctx.rect(c.px,c.py,c.pw,c.ph);ctx.clip();ctx.setLineDash([6,6]);
   [[100,'100 kW'],[1000,'1 MW'],[10000,'10 MW']].forEach(([P,t])=>{const qa=.1,qb=100,h=q=>P/(9.81*.85*q);ln([c.X(L(qa)),c.Y(L(h(qa))),c.X(L(qb)),c.Y(L(h(qb)))],'rgba(255,255,255,.35)',1.5);});ctx.setLineDash([]);ctx.restore();
   [[100,'100 kW',.15],[1000,'1 MW',.4],[10000,'10 MW',2.5]].forEach(([P,t,q])=>wt(c.X(L(q))+6,c.Y(L(P/(9.81*.85*q)))-6,t,15,'rgba(255,255,255,.6)',600,'left',COND));});
  reg(.1,8,60,1000,'rgba(242,194,48,.22)','佩爾頓',seg(u,.25,.32),.3,650);
  reg(.3,100,15,500,'rgba(88,184,208,.22)','法蘭西斯',seg(u,.48,.55),12,120);
  reg(1.5,100,1.5,40,'rgba(125,255,196,.2)','卡普蘭',seg(u,.55,.62),20,4);
  reg(.1,6,2.5,150,'rgba(179,124,255,.22)','橫流式',seg(u,.35,.42),.28,6);
  NAMES.forEach(([x,y,n,a])=>alphaDo(a,()=>wt(x,y,n,20,'#fff',800,'center')));
  /* 案例點 */
  const pt=(q,h,t,col,a,dx)=>alphaDo(a,()=>{const x=c.X(L(q)),y=c.Y(L(h));circ(x,y,8,col,'#fff',2);tag(x+(dx||14),y,t,{size:15,bg:col,align:dx<0?'right':'left'});});
  pt(.5,200,'山區溪流','#f2c230',ptA(u,.3));pt(2,50,'本集示例','#58b8d0',ptA(u,.5));pt(8,3,'渠道落差工','#7dffc4',ptA(u,.62),-14);
  /* 右：選型要點 */
  card(1060,160,480,640,{bg:'rgba(7,27,39,.75)'});wt(1086,200,'選型時要考慮',20,'#f2c230',700);
  const R=[['落差與流量','決定機型的第一步',.02],['季節流量變化','枯水期仍要能運轉',.75],['部分負載效率','流量變小時效率不能掉太多',.8],['泥砂與漂流物','台灣溪流含砂量高',.85],['維修方便','小電廠常無人值守',.9]];
  R.forEach(([a,b,t],i)=>alphaDo(seg(u,t,t+.05),()=>{const y=270+i*104;ln([1080,y-36,1520,y-36],'rgba(255,255,255,.14)',1);wt(1086,y,a,19,'#fff',700);wt(1086,y+34,b,16,'rgba(227,236,238,.8)',500);}));
 }},

{t:'台灣灌溉渠道裡的小水力',en:'Small hydro in Taiwan\'s canals',dur:13,side:true,
 d:'台灣的農田水利系統有綿密的灌溉渠道，渠道每隔一段距離就設有落差工，讓水安全地降到下一段。這些既有的落差，正是小水力可以利用的地方：在落差工旁設置旁通管與小型機組，水發電後回到同一條渠道，灌溉用水一滴也沒有少。依法規，利用既有水利設施、裝置容量未達 2 萬瓩的屬於小水力，100 kW 以下常稱為微水力。水利署 2023 年評估了河川 47 處與渠道 2 處潛能點，農田水利署也另提出多處場址，正逐步推動。',
 s:[[0,'灌溉渠道的落差工，是現成的小落差'],[.26,'旁通管把水引進小型機組發電'],[.5,'發電後的水回到渠道，灌溉用水沒有減少'],[.74,'小水力未達 2 萬瓩，可以就近併入配電線路']],
 base:u=>{},
 cam:u=>camMix({x:800,y:450,s:1},{x:820,y:520,s:1.35},ease(seg(u,.16,.4))*(1-ease(seg(u,.56,.72)))),
 draw(u){
  canalScene(u);
  flowDots([[VX0,CUP+14],[DROP-10,CUP+14]],10,'#dff6ff',1,1,.12,3);flowDots([[DROP+40,CDN+14],[VX1,CDN+14]],10,'#dff6ff',1,1,.12,3);
  lab(400,CUP+10,'灌溉渠道',{dx:-40,dy:-120,st:'s',a:band(u,.03,.3)});
  lab(DROP+10,CUP+30,'落差工',{dx:-40,dy:110,a:band(u,.06,.4)});
  lab(700,640,'旁通管',{dx:-90,dy:80,a:band(u,.26,.52)});
  lab(880,590,'小型水輪機',{dx:40,dy:-140,st:'s',a:band(u,.28,.6)});
  lab(990,648,'回到渠道',{dx:80,dy:80,st:'g',a:band(u,.5,.74)});
  lab(1120,470,'併入配電線路',{dx:80,dy:-60,st:'l',a:band(u,.74,1)});
  alphaDo(seg(u,.76,.82),()=>{card(60,640,620,160,{bg:'rgba(7,27,39,.8)'});
   wt(84,680,'小水力',18,'#f2c230',700);wt(260,680,'未達 20,000 kW',18,'#fff',700,'left',COND);
   wt(84,716,'微水力',18,'#7dffc4',700);wt(260,716,'常指 100 kW 以下',18,'#fff',700);
   wt(84,752,'潛能點',18,'#7dc8dc',700);wt(260,752,'河川 47 處、渠道 2 處',18,'#fff',700);
   wt(84,784,'水利署 2023 年評估',15,'rgba(227,236,238,.75)',500);});
 },
 hud(u){hudPanel(300,150,'渠道機組（示例）',seg(u,.05,.1),w=>{const on=seg(u,.25,.4);
  hrow(56,'落差','3 m',w,'#fff');hrow(88,'出力',Math.round(200*on)+' kW',w,'#f2c230');hrow(120,'年發電',trf('約 {e} 度',{e:Math.round(1051200*on).toLocaleString('en-US')}),w,'#7dffc4');});}}
]};
const ptA=(u,t)=>seg(u,t,t+.05);
