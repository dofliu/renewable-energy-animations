// KITS: land
/* 海洋能系列 第 1 集：波浪發電：點吸收式浮標 */
const SW={y:430,A:24,L:380,sp:1.1,bed:820};          // 湧浪參數
const BX=560,BED=820,CX=1400;                        // 主浮標位置、海床、海岸線
const PWR='#f2c230',WAV='#58b8d0',OIL='#ff8a60',MAG='#b37cff';
const fyAt=x=>swellY(x,SW);
function pl(P,col,lw){const a=[];P.forEach(p=>a.push(p[0],p[1]));ln(a,col,lw);}
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,sp,r){if(a<=0)return;for(let k=0;k<n;k++){const f=((TT*(sp||.3))+k/n)%1,p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4.5,col));}}
/* 浮體（世界座標，中心 x,y，縮放 s） */
function floatBody(x,y,s,tilt,cut){ctx.save();ctx.translate(x,y);ctx.rotate(tilt||0);ctx.scale(s,s);
  rrp(-56,-30,112,58,16);ctx.fillStyle='#e3b53a';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.5;ctx.stroke();
  box(-56,-6,112,8,'#2a3a46');ln([0,-30,0,-78],'#5c6770',3);box(-10,-60,20,6,'#5c6770');
  circ(0,-80,5,Math.sin(TT*3)>0?'#fff4c0':'#8d7a3a');
  if(cut){box(-20,-24,40,46,'#2a3a46');box(-14,-20,28,20,'#1f7f99');ln([0,0,0,26],'#c9d1d6',5);}
  ctx.restore();}
function anchorBlock(x){box(x-44,BED-26,88,26,'#6a747a','rgba(0,0,0,.35)',1);box(x-10,BED-40,20,16,'#8d989f');}
/* 一座浮標：回傳浮體底部座標 */
function wec(x,s,cut){const y=fyAt(x)-6*s,t=Math.atan((fyAt(x+30)-fyAt(x-30))/60)*.6;
  ln([x,y+28*s,x,BED-40],'#2a3a46',Math.max(2,3*s));floatBody(x,y,s,t,cut);anchorBlock(x);return [x,y+28*s];}
/* 海岸與岸上變電站 */
function coast(){poly([CX,1000,CX,770,CX+40,560,CX+70,450,CX+110,420,1800,410,1800,1000],'#8c7a5e');
  poly([CX+70,450,CX+110,420,1800,410,1800,432,CX+120,440],'#7a9a55');
  const x=CX+180,g=412;fence(x-10,x+120,g+2);box(x+14,g-50,74,46,'#8d989f','rgba(0,0,0,.3)',1);for(let i=0;i<3;i++){box(x+24+i*22,g-72,6,22,'#c9d1d6');circ(x+27+i*22,g-74,4,'#e3e8ec');}}
const P_CAB=()=>[[BX+30,BED-12],[900,BED-4],[1200,BED-4],[CX+10,780],[CX+50,560],[CX+90,450],[CX+226,405]];
function bubbles(){const R=rng(5);for(let i=0;i<18;i++){const x=R()*1400,p=(TT*.15+R())%1,y=BED-20-p*340;alphaDo(.4*(1-p),()=>circ(x+6*Math.sin(TT+i),y,2+R()*2,'rgba(255,255,255,.5)'));}}
function fishes(){for(let i=0;i<5;i++){const x=((TT*30+i*260)%1700)-50,y=640+40*Math.sin(i*2.1)+8*Math.sin(TT+i);poly([x,y,x-22,y-7,x-22,y+7],'rgba(20,50,70,.6)');poly([x-22,y,x-32,y-6,x-32,y+6],'rgba(20,50,70,.6)');}}
function seaScene(o){o=o||{};landSky(SW.y,{clouds:true,dusk:o.dusk||0});drawSwell(SW);bubbles();fishes();
  pl(P_CAB(),'#1a1a1a',4);coast();
  wec(1020,.55);wec(1200,.45);return wec(BX,1,o.cut);}
function wavePower(H,T){return .49*H*H*T;}
/* 台灣輪廓（經緯度） */
const TW=[[121.5,25.3],[121.9,25.12],[122.0,25.0],[121.85,24.6],[121.8,24.3],[121.6,23.9],[121.5,23.4],[121.3,22.9],[121.0,22.6],[120.85,21.92],[120.7,22.0],[120.6,22.3],[120.3,22.55],[120.15,22.9],[120.1,23.1],[120.15,23.5],[120.3,23.9],[120.6,24.3],[120.8,24.6],[121.0,24.9],[121.2,25.1],[121.4,25.25]];

const EP={no:1,slug:'ocean-energy',seriesName:'海洋能系列',t:'波浪發電：點吸收式浮標',en:'Wave power: the point absorber buoy',
lede:'海浪是風把能量交給海面的結果，一波接一波把能量送到岸邊。這一集從波浪能量的大小怎麼算談起，看點吸收式浮標如何隨浪上下運動，比較液壓與直驅線性發電機兩種動力擷取方式，再介紹錨繫、海纜與颱風海況的挑戰，以及台灣的波浪能潛力。',
facts:[['0.49','kW/m','每公尺波峰寬的波能流係數：P ≈ 0.49 × H² × T'],
['15–20','kW/m','台灣東北部、澎湖西側與巴士海峽的波能流密度'],
['約 10','GW','台灣周邊海域波浪能蘊藏量估計'],
['3','處','蘇澳港規劃的離岸式波浪發電試驗區'],
['50–100','MW','業界預估 2030 年前的波浪能裝置容量'],
['300','kW','國外直徑 9 m 點吸收式浮標的單機容量（示例）']],
note:'說明：本集為教育用途示意動畫，浮標外觀、水深與波浪比例經過壓縮調整。波能流公式 P ≈ ρg²H²T／64π（約 0.49 H²T kW/m，H 為示性波高、T 為能量週期）為海洋工程通用式；台灣波能流密度 15–20 kW/m 與蘊藏量約 10 GW 取自國科會科技大觀園與中央氣象署科普資料；蘇澳港 3 處試驗區與 2030 年 50–100 MW 預估取自 Reccessary 專家觀點；直徑 9 m、300 kW 浮標與水深約 45 m 參考 CorPower C4 在葡萄牙的公開資料。每月波能、張力、出力與颱風存活模式等數值為典型範例。',
base:()=>seaScene(),
shots:[
{t:'海上的點吸收式浮標',en:'A point absorber at sea',dur:13,side:true,
 d:'點吸收式浮標是最常見的波浪發電裝置之一。浮體漂在海面上，湧浪通過時跟著上下起伏；浮體透過繫纜連到海床基礎，海床幾乎不動，兩者之間的相對運動就由浮體裡的動力擷取系統（PTO）轉成電力。電力經動態海纜與海底電纜送到岸上變電站併網。一座浮標容量約數十到數百瓩，實際案場會把多座浮標排成陣列，共用海纜與併網設備。',
 s:[[0,'湧浪一波接一波通過浮標'],[.26,'浮體隨浪起伏，繫纜連到海床基礎'],[.52,'浮體與海床的相對運動轉成電力'],[.76,'電力經海底電纜送上岸併網']],
 cam:u=>camMix({x:800,y:480,s:1},{x:700,y:500,s:1.12},ease(seg(u,.1,.6))),
 draw(u){},
 fx(u){
  flowDots(P_CAB(),8,PWR,band(u,.74,1),.25,4);
  const y=fyAt(BX);
  lab(BX,y-40,'浮體',{dx:-60,dy:-90,st:'s',a:band(u,.24,.52)});
  lab(BX,640,'繫纜',{dx:70,dy:-20,a:band(u,.26,.52)});
  lab(BX,BED-30,'海床基礎',{dx:-90,dy:-40,a:band(u,.26,.52)});
  lab(BX,y,'動力擷取（PTO）',{dx:110,dy:-80,st:'s',a:band(u,.5,.76)});
  lab(1100,BED-4,'海底電纜',{dx:0,dy:-60,st:'s',a:band(u,.74,1)});
  lab(CX+226,360,'岸上變電站',{dx:-40,dy:-40,st:'g',a:band(u,.78,1),minor:true});
 },
 hud(u){hudPanel(240,150,'海況與出力（示例）',seg(u,.05,.1),w=>{const p=Math.max(0,120+90*Math.sin(TT*1.1))*ease(seg(u,.48,.6));
  hrow(56,'示性波高','2.0 m',w,WAV);hrow(88,'週期','8 s',w,'#fff');hrow(120,'輸出',Math.round(p)+' kW',w,PWR);});}},

{t:'波浪能量從哪裡來',en:'Where wave energy comes from',dur:13,
 d:'風吹過海面，把能量傳給海水形成波浪；風越強、吹得越久、吹過的距離越遠，波浪就越大。波浪能用每公尺波峰寬度的功率表示，稱為波能流密度，約等於 0.49 乘上波高的平方再乘上週期，單位是 kW/m。波高加倍，能量變成四倍，所以選址時最看重波高。示性波高 2 m、週期 8 s 的湧浪，每公尺波峰約帶有 16 kW 的功率。',
 s:[[0,'風把能量交給海面，形成波浪'],[.26,'波高 H 與週期 T 決定波浪的能量'],[.5,'波能流：P ≈ 0.49 × H² × T'],[.74,'波高加倍，能量變成四倍']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'波高與週期',20,'#f2c230',700);
  /* 風 */
  const wa=seg(u,.02,.1);for(let i=0;i<4;i++){const p=(TT*.6+i/4)%1;alphaDo(wa*(1-Math.abs(p-.5)*2),()=>arrow(120+p*400,260+i*26,180+p*400,260+i*26,'rgba(227,236,238,.8)',2.5));}
  alphaDo(wa,()=>wt(640,290,'風',20,'#fff',700,'center'));
  /* 波形 */
  const Y0=500,A=60,L=380,X0=100,X1=740,ph=TT*1.4,wy=x=>Y0-A*Math.sin(TAU*(x-X0)/L-ph);
  ctx.beginPath();ctx.moveTo(X0,720);for(let x=X0;x<=X1;x+=4)ctx.lineTo(x,wy(x));ctx.lineTo(X1,720);ctx.closePath();ctx.fillStyle='rgba(88,184,208,.35)';ctx.fill();
  ctx.beginPath();for(let x=X0;x<=X1;x+=4)ctx.lineTo(x,wy(x));ctx.strokeStyle='#7dc8dc';ctx.lineWidth=3;ctx.stroke();
  const ha=band(u,.24,1);if(ha>0)alphaDo(ha,()=>{ctx.setLineDash([6,6]);ln([X0,Y0-A,X1,Y0-A],'rgba(242,194,48,.7)',1.5);ln([X0,Y0+A,X1,Y0+A],'rgba(242,194,48,.7)',1.5);ctx.setLineDash([]);
   arrow(180,Y0,180,Y0-A+4,PWR,2.5);arrow(180,Y0,180,Y0+A-4,PWR,2.5);wt(196,Y0+8,'波高 H',19,PWR,700,'left');
   arrow(330,640,330+L,640,'#7dffc4',2.5);arrow(330+L,640,330,640,'#7dffc4',2.5);wt(330+L/2,680,'一個週期 T 通過一個波長',18,'#7dffc4',700,'center');});
  /* 公式 */
  alphaDo(seg(u,.5,.56),()=>{card(90,720,660,64,{bg:'rgba(242,194,48,.12)',st:'rgba(242,194,48,.6)'});wt(420,762,'P ≈ 0.49 × H² × T（kW/m）',22,PWR,700,'center',COND);});
  /* 右：圖表 */
  card(820,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(844,196,'波能流密度與波高',20,'#f2c230',700);
  const c=chartBox(840,220,680,520,{x0:0,x1:4,y0:0,y1:80,xt:[0,1,2,3,4],yt:[0,20,40,60,80],xl:'示性波高 H（m）',yl:'kW/m'});
  const S=[[6,'rgba(227,236,238,.9)','T = 6 s',.3],[8,'#7dffc4','T = 8 s',.4],[10,'#ff8a60','T = 10 s',.5]];
  S.forEach(([T,col,n,t0])=>{const f=ease(seg(u,t0,t0+.2));if(f<=0)return;const P=[];for(let i=0;i<=40;i++){const H=4*i/40;P.push({x:c.X(H),y:c.Y(wavePower(H,T))});}
   pathLine(partial(P,f),col,3);alphaDo(seg(u,t0+.16,t0+.22),()=>wt(c.X(4)-6,c.Y(wavePower(4,T))-10,n,17,col,700,'right',COND));});
  const ka=seg(u,.72,.78);if(ka>0)alphaDo(ka,()=>{const x=c.X(2),y=c.Y(wavePower(2,8));circ(x,y,7,PWR);ln([x,y,x,c.Y(0)],'rgba(242,194,48,.5)',1.5);
   const qx=c.X(.2)+150,qy=c.Y(62);ln([x,y,qx,qy+45],'rgba(242,194,48,.6)',1.5);card(qx-150,qy-45,300,90,{bg:'rgba(7,27,39,.92)',st:PWR});wt(qx,qy-9,'H 2 m、T 8 s',18,'#fff',700,'center');wt(qx,qy+25,trf('約 {n} kW/m',{n:wavePower(2,8).toFixed(1)}),20,PWR,700,'center',COND);});
 }},

{t:'點吸收式浮標怎麼運作',en:'How a point absorber works',dur:14,
 d:'點吸收式浮標的直徑通常只有數公尺，比波長小得多，因此不論波浪從哪個方向來，都能從四周吸收能量，好像一個「點」。浮體受浮力推動上下運動，繫纜另一端固定在海床，動力擷取系統就在兩者之間拉伸與收縮。若讓浮體的運動節奏和波浪同步，形成共振，位移可以比波高大好幾倍；國外業者以相位控制讓浮體在 1 m 的浪中上下移動約 3 m，吸收更多能量。',
 s:[[0,'浮體直徑遠小於波長，像一個點'],[.24,'四面八方來的波浪都能吸收'],[.48,'浮體與海床之間的相對運動推動 PTO'],[.72,'共振與相位控制，讓浮體動得比浪更大']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'側視：浮體、PTO 與繫纜',20,'#f2c230',700);
  const Y0=380,A=40,L=520,ph=TT*1.4,wy=x=>Y0-A*Math.sin(TAU*(x-80)/L-ph),X=420;
  ctx.beginPath();ctx.moveTo(80,760);for(let x=80;x<=760;x+=4)ctx.lineTo(x,wy(x));ctx.lineTo(760,760);ctx.closePath();ctx.fillStyle='rgba(29,102,144,.55)';ctx.fill();
  ctx.beginPath();for(let x=80;x<=760;x+=4)ctx.lineTo(x,wy(x));ctx.strokeStyle='#7dc8dc';ctx.lineWidth=2.5;ctx.stroke();
  box(80,740,680,40,'#b59a6a');
  const amp=lerp(1,1.8,ease(seg(u,.72,.8))),fy=Y0-A*amp*Math.sin(TAU*(X-80)/L-ph-.3*amp);
  ln([X,fy+60,X,712],'#e3e8ec',3);box(X-50,712,100,28,'#6a747a');
  /* 浮體剖面：PTO 缸體 */
  rrp(X-80,fy-40,160,80,20);ctx.fillStyle='#e3b53a';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.5;ctx.stroke();
  const pa=band(u,.46,1);box(X-22,fy-30,44,72,pa>0?'rgba(242,194,48,'+(.25+.5*pa)+')':'#2a3a46','rgba(0,0,0,.4)',1);
  const rod=clamp((fy-Y0)/(A*1.8),-1,1);box(X-16,fy-10+rod*14,32,10,'#c9d1d6');ln([X,fy+rod*14,X,fy+60],'#c9d1d6',5);
  const aa=band(u,.46,1);if(aa>0)alphaDo(aa,()=>{arrow(X+120,Y0,X+120,Y0-60,'#7dffc4',3);arrow(X+120,Y0,X+120,Y0+60,'#7dffc4',3);wt(X+140,Y0+8,'相對運動',18,'#7dffc4',700,'left');});
  wt(X-100,fy+6,'浮體',18,'#fff',700,'right');alphaDo(pa,()=>wt(X,fy-52,'PTO',18,PWR,700,'center',COND));
  wt(X+30,650,'繫纜',17,'rgba(227,236,238,.9)',600,'left');wt(X+64,732,'海床基礎',17,'rgba(227,236,238,.9)',600,'left');
  /* 右上：俯視 */
  card(820,150,720,310,{bg:'rgba(7,27,39,.75)'});wt(844,196,'俯視：從各方向吸收',20,'#f2c230',700);
  const cx=1180,cy=320,da=seg(u,.2,.3);
  for(let i=0;i<3;i++){const p=(TT*.35+i/3)%1;ring(cx,cy,20+p*110,'rgba(125,200,220,'+(.6*(1-p))+')',2);}
  if(da>0)alphaDo(da,()=>{for(let k=0;k<6;k++){const a=k*TAU/6+.3,r=120;arrow(cx+Math.cos(a)*r,cy+Math.sin(a)*r*.9,cx+Math.cos(a)*40,cy+Math.sin(a)*36,'#7dc8dc',2.5);}});
  circ(cx,cy,18,'#e3b53a','rgba(0,0,0,.4)',1.5);wt(1510,440,'直徑數公尺，遠小於波長',17,'rgba(227,236,238,.85)',600,'right');
  /* 右下：共振 */
  card(820,490,720,310,{bg:'rgba(7,27,39,.75)'});wt(844,536,'共振與相位控制（示例）',20,'#f2c230',700);
  const gx0=860,gx1=1500,gy=660;ln([gx0,gy,gx1,gy],'rgba(255,255,255,.15)',1);
  const curve=(am,col,lw,f,sh)=>{const P=[];for(let i=0;i<=80;i++){const x=gx0+(gx1-gx0)*i/80;P.push({x,y:gy-am*Math.sin(i/80*TAU*2-TT*1.4+sh)});}pathLine(partial(P,f),col,lw);};
  curve(26,'#7dc8dc',2.5,1,0);const ra=ease(seg(u,.72,.84));if(ra>0)curve(26+52*ra,PWR,3,1,-.4);
  wt(gx0,776,'波浪 1 m',17,'#7dc8dc',700,'left');alphaDo(ra,()=>wt(gx1,776,'浮體位移 約 3 m',17,PWR,700,'right'));
 }},

{t:'動力擷取：液壓與直驅',en:'Power take-off: hydraulic vs direct drive',dur:14,
 d:'浮體的運動慢而有力，每秒只有一兩公尺，方向還不斷反轉，動力擷取系統要把它變成穩定的電力。液壓式用活塞把油壓進蓄壓器，再以固定壓力推動液壓馬達與發電機，能平滑波浪起伏、承受很大的力，但油路元件多、需要定期保養。直驅線性發電機讓裝有磁鐵的動子直接在線圈中往復移動發電，零件少、效率高，但低速大推力使發電機又大又重，輸出電壓與頻率不斷變化，要靠變流器整理後才能併網。',
 s:[[0,'浮體運動慢、力量大，方向不斷反轉'],[.24,'液壓式：活塞壓油，蓄壓器平滑出力'],[.52,'直驅式：磁鐵在線圈中往復，直接發電'],[.78,'變流器把變動的電整理成穩定的交流電']],
 draw(u){
  diagBG();
  const L=band(u,.2,1),R=band(u,.5,1),hl=(k,on)=>on?'rgba(242,194,48,.7)':'rgba(255,255,255,.12)';
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)',st:hl(0,u>=.24&&u<.52)});wt(84,196,'液壓式 PTO',20,'#f2c230',700);
  card(820,150,720,650,{bg:'rgba(7,27,39,.75)',st:hl(1,u>=.52)});wt(844,196,'直驅線性發電機',20,'#f2c230',700);
  const st=Math.sin(TT*1.6);
  /* 液壓：活塞缸 → 蓄壓器 → 馬達 → 發電機 */
  box(110,250,70,220,'#44535c','rgba(255,255,255,.3)',1);const py=330+st*50;box(114,py,62,16,'#c9d1d6');ln([145,py,145,240],'#c9d1d6',6);
  alphaDo(.8,()=>box(114,py+16,62,454-py,'rgba(255,138,96,.45)'));
  wt(145,500,'活塞缸',17,'#fff',700,'center');
  rrp(270,270,70,170,34);ctx.fillStyle='#8d989f';ctx.fill();wt(305,470,'蓄壓器',17,'#fff',700,'center');
  circ(470,350,44,'#5c6770','rgba(255,255,255,.3)',1);for(let i=0;i<4;i++){const a=TT*3*L+i*TAU/4;ln([470,350,470+Math.cos(a)*36,350+Math.sin(a)*36],'#c9d1d6',4);}wt(470,430,'液壓馬達',17,'#fff',700,'center');
  ln([514,350,580,350],'#8d989f',8);box(580,300,130,100,'#1f7f99','rgba(255,255,255,.3)',1);wt(645,430,'發電機',17,'#fff',700,'center');
  const Po=[[180,440],[230,440],[230,400],[270,400]],Pa=[[340,350],[426,350]],Pr=[[470,394],[470,450],[180,450]];
  [Po,Pa,Pr].forEach(P=>pl(P,'rgba(141,152,159,.8)',5));flowDots(Po,3,OIL,L,.6,5);flowDots(Pa,3,OIL,L,.6,5);flowDots(Pr,5,'#ff9d7a',L*.6,.3,4);
  alphaDo(L,()=>{for(let i=0;i<3;i++){const p=(TT*1.2+i/3)%1;ln([712,340+i*12,712+30*p,340+i*12],PWR,3);}});
  /* 右：線性發電機 */
  const cx=1000,cy=280;for(let i=0;i<8;i++)box(cx-60,cy+i*24,20,18,'#c77d3a','rgba(0,0,0,.3)',1);for(let i=0;i<8;i++)box(cx+40,cy+i*24,20,18,'#c77d3a','rgba(0,0,0,.3)',1);
  const my=cy-30+st*50;for(let i=0;i<6;i++)box(cx-30,my+i*30,60,28,i%2?'#e8572a':'#58b8d0','rgba(0,0,0,.35)',1);ln([cx,my,cx,cy-60],'#c9d1d6',6);
  wt(cx,cy+230,'線圈（定子）＋磁鐵（動子）',17,'#fff',700,'center');
  /* 輸出波形 */
  const ox=1120,oy=340;ln([ox,oy,1500,oy],'rgba(255,255,255,.15)',1);
  if(R>0)alphaDo(R,()=>{const P=[];for(let i=0;i<=120;i++){const t=i/120,env=Math.abs(Math.sin(t*TAU*1-TT*1.6));P.push({x:ox+380*t,y:oy-60*env*Math.sin(t*TAU*9-TT*8)});}pathLine(P,MAG,2);wt(1310,440,'電壓與頻率不斷變化',17,MAG,700,'center');});
  const ia=seg(u,.78,.84);if(ia>0)alphaDo(ia,()=>{box(1120,470,160,60,'#44535c','rgba(255,255,255,.3)',1);wt(1200,508,'變流器',18,'#fff',700,'center');arrow(1290,500,1340,500,PWR,3);
   const P=[];for(let i=0;i<=60;i++){const t=i/60;P.push({x:1350+150*t,y:500-26*Math.sin(t*TAU*3-TT*4)});}pathLine(P,'#7dffc4',2.5);});
  /* 優缺點 */
  const pc=(x,y,good,bad,a)=>alphaDo(a,()=>{tag(x,y,'優點',{bg:'rgba(125,255,196,.2)',fg:'#7dffc4',size:16});wt(x+60,y+6,good,18,'#fff',600,'left');
   tag(x,y+54,'限制',{bg:'rgba(232,87,42,.2)',fg:'#ff8a60',size:16});wt(x+60,y+60,bad,18,'#fff',600,'left');});
  pc(100,640,'出力平滑、承受大力量','油路元件多、需定期保養',L);
  pc(860,640,'零件少、效率高','體積大且重、需要變流器',R);
 }},

{t:'錨繫與海纜',en:'Moorings and cables',dur:13,side:true,
 d:'浮標要在大浪中留在原地，錨繫系統是關鍵。張力式繫纜把浮體拉向海床基礎，基礎可用重力式混凝土塊、樁或吸力式沉箱，視海床是砂、泥或岩盤而定。浮標上下起伏，電纜不能繃直，所以從浮體到海床之間用帶浮力模組的動態海纜，彎成緩和的 S 形吸收運動，再接到固定在海床上的海底電纜送往岸邊。國外試驗案例多設在離岸數公里、水深約 40 到 50 m 的海域。',
 s:[[0,'鏡頭潛入水下，看浮標怎麼固定'],[.24,'張力式繫纜把浮體拉向海床基礎'],[.5,'動態海纜彎成 S 形，吸收浮體起伏'],[.76,'海底電纜沿海床送往岸上變電站']],
 cam:u=>camMix({x:800,y:480,s:1},{x:720,y:600,s:1.4},ease(seg(u,.02,.2))),
 draw(u){
  const y=fyAt(BX)+22,a=band(u,.46,1);
  if(a>0)alphaDo(a,()=>{const P=[];for(let i=0;i<=30;i++){const t=i/30;P.push({x:BX+20+t*180,y:lerp(y,BED-10,t)-90*Math.sin(t*Math.PI)*(1-t*.3)+(1-t)*(fyAt(BX)-SW.y)*.3});}
   pathLine(P,'#1a1a1a',4);for(let k=0;k<4;k++){const p=P[10+k*2];circ(p.x,p.y,7,'#e3b53a','rgba(0,0,0,.4)',1);}});
 },
 fx(u){
  flowDots(P_CAB(),8,PWR,band(u,.74,1),.25,4);
  lab(BX,700,'張力式繫纜',{dx:-110,dy:-30,st:'s',a:band(u,.22,.5)});
  lab(BX,BED-26,'海床基礎',{dx:-80,dy:-50,a:band(u,.22,.5)});
  lab(BX+110,fyAt(BX)+60,'動態海纜',{dx:90,dy:-40,st:'s',a:band(u,.5,.78)});
  lab(BX+100,540,'浮力模組',{dx:110,dy:30,a:band(u,.52,.78),minor:true});
  lab(900,BED-4,'海底電纜',{dx:40,dy:-50,st:'g',a:band(u,.76,1)});
 },
 hud(u){hudPanel(240,150,'錨繫（示例）',seg(u,.05,.1),w=>{const t=Math.round(600+300*Math.sin(TT*1.1));
  hrow(56,'水深','約 45 m',w,WAV);hrow(88,'繫纜張力',trf('{n} kN',{n:t}),w,'#fff');hbar(14,100,w-28,t/1000,PWR);hrow(136,'離岸距離','約 4 km',w,'#7dffc4');});}},

{t:'海況與颱風',en:'Sea states and typhoons',dur:13,
 d:'波浪能隨季節變化很大。台灣東北部每年有半年以上吹東北季風，秋冬的波浪能明顯較高，夏季風浪較小，卻可能遇上颱風。浮標的設計要在兩件事之間取得平衡：一般海況盡量多發電，極端海況則要活下來。浪太大時控制系統會限制出力與衝程；颱風來襲時進入存活模式，例如把浮體鎖定或壓入水中，讓巨浪從上方通過。颱風期間的示性波高可超過 10 m，是設計的最大考驗。',
 s:[[0,'東北季風季節，波浪能明顯較高'],[.26,'夏季風浪較小，但有颱風威脅'],[.5,'一般海況發電，大浪時限制出力'],[.74,'颱風來襲：進入存活模式，讓巨浪通過']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'台灣東北部每月波能（示意）',20,'#f2c230',700);
  const M=[22,20,15,10,7,5,5,6,9,16,22,24],c=chartBox(80,220,680,520,{x0:.5,x1:12.5,y0:0,y1:30,xt:[1,2,3,4,5,6,7,8,9,10,11,12],yt:[0,10,20,30],xl:'月份',yl:'kW/m'});
  M.forEach((v,i)=>{const f=ease(seg(u,.02+i*.02,.12+i*.02)),x=c.X(i+1),w=c.pw/12*.62,win=i>=9||i<=2;box(x-w/2,c.Y(v*f),w,c.Y(0)-c.Y(v*f),win?'#58b8d0':'rgba(88,184,208,.45)');});
  alphaDo(seg(u,.02,.1),()=>wt(c.X(1.5),c.Y(27.5),'東北季風',17,'#7dc8dc',700,'center'));
  alphaDo(seg(u,.26,.32),()=>{for(let m=7;m<=9;m++){const x=c.X(m);ring(x,c.Y(12),10,'#ff8a60',2);}wt(c.X(8),c.Y(16),'颱風',17,'#ff8a60',700,'center');});
  /* 右：運轉模式 */
  const modes=[['一般海況','發電','#7dffc4',.5,1],['大浪','限制出力與衝程','#f2c230',.6,1.8],['颱風','存活模式','#ff8a60',.74,3]];
  modes.forEach(([t,s,col,t0,H],i)=>{const a=seg(u,t0,t0+.06),y=160+i*214;alphaDo(Math.max(.25,a),()=>{
   card(820,y,720,196,{bg:'rgba(7,27,39,.75)',st:a>0?col:'rgba(255,255,255,.12)'});wt(844,y+42,t,20,col,700);wt(844,y+78,s,18,'#fff',600);
   const A=10*H,x0=1120,x1=1510,wy=x=>y+110-A*Math.sin(TAU*(x-x0)/200-TT*1.3);ctx.beginPath();ctx.moveTo(x0,y+186);for(let x=x0;x<=x1;x+=4)ctx.lineTo(x,wy(x));ctx.lineTo(x1,y+186);ctx.closePath();ctx.fillStyle='rgba(29,102,144,.6)';ctx.fill();
   const bx=1300,by=i===2?y+150:wy(bx)-(i===1?4:0);ln([bx,by+14,bx,y+186],'#e3e8ec',2);rrp(bx-26,by-12,52,26,8);ctx.fillStyle='#e3b53a';ctx.fill();
   if(i===2)wt(844,y+150,'示性波高可超過 10 m',17,'#ff9d7a',600);});});
 }},

{t:'台灣的波浪能',en:'Wave energy in Taiwan',dur:14,
 d:'台灣四面環海，波浪能資源以東北部、東部外海、澎湖西側與巴士海峽較佳，波能流密度約 15 到 20 kW/m；西岸與西南沿海多在 10 kW/m 以下。估計周邊海域的蘊藏量約 10 GW。颱風與地震頻繁，國外機組不一定適合台灣，國內正發展適合在地海況的技術。蘇澳港已規劃 3 處離岸式波浪發電試驗區，業界預估 2030 年前裝置容量可達 50 到 100 MW。',
 s:[[0,'東北部與東部外海的波浪能較佳'],[.24,'高能海域約 15–20 kW/m'],[.48,'周邊海域蘊藏量估計約 10 GW'],[.72,'蘇澳港規劃 3 處離岸式試驗區']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'波能流密度分布（示意）',20,'#f2c230',700);
  const MX=l=>180+(l-119)*170,MY=a=>190+(25.6-a)*140;
  const ka=seg(u,.02,.1),kb=seg(u,.24,.32);
  const blob=(l,b,rx,ry,col,a)=>{if(a<=0)return;const x=MX(l),y=MY(b);ctx.save();ctx.translate(x,y);ctx.scale(1,ry/rx);const g=ctx.createRadialGradient(0,0,0,0,0,rx);g.addColorStop(0,col+'.55)');g.addColorStop(1,col+'0)');
   alphaDo(a,()=>{ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,rx,0,TAU);ctx.fill();});ctx.restore();};
  blob(122.15,24.9,120,150,'rgba(255,138,96,',kb);blob(121.9,23.5,90,150,'rgba(255,138,96,',kb);blob(119.4,23.6,90,90,'rgba(255,138,96,',kb);blob(120.9,21.6,110,70,'rgba(255,138,96,',kb);
  blob(119.95,23.2,70,200,'rgba(125,200,220,',ka);
  const pts=[];TW.forEach(([l,a])=>pts.push(MX(l),MY(a)));poly(pts,'rgba(122,154,85,.6)','rgba(227,236,238,.7)',2);
  circ(MX(119.6),MY(23.55),10,'rgba(122,154,85,.6)','rgba(227,236,238,.7)',1.5);
  alphaDo(kb,()=>{wt(MX(122.2),MY(25.55),'15–20 kW/m',18,'#ff9d7a',700,'center',COND);wt(MX(119.3),MY(24.15),'澎湖西側',16,'#ff9d7a',700,'center');wt(MX(121.55),MY(21.6),'巴士海峽',16,'#ff9d7a',700,'left');});
  alphaDo(ka,()=>wt(MX(119.85),MY(22.3),'西南沿海 <10 kW/m',16,'#7dc8dc',700,'center'));
  const sa=seg(u,.72,.78);if(sa>0){const x=MX(121.87),y=MY(24.6),p=(TT*.8)%1;alphaDo(sa,()=>{alphaDo(1-p,()=>ring(x,y,8+16*p,PWR,2));circ(x,y,8,PWR);wt(x-16,y+6,'蘇澳港',18,PWR,700,'right');});}
  /* 右：數字卡 */
  const R=[['高能海域波能流','15–20 kW/m','東北部、澎湖西側、巴士海峽',.24,'#ff8a60'],['周邊海域蘊藏量','約 10 GW','理論估計值',.48,'#7dc8dc'],['蘇澳港試驗區','3 處','離岸式波浪發電',.72,'#f2c230'],['2030 年預估','50–100 MW','業界預估裝置容量',.84,'#7dffc4']];
  R.forEach(([t,v,s,t0,col],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=160+i*162;card(820,y,720,146,{bg:'rgba(7,27,39,.75)'});box(820,y,8,146,col);wt(850,y+44,t,19,'rgba(227,236,238,.9)',600);
   wt(850,y+106,v,40,col,700,'left',COND);wt(1510,y+106,s,17,'rgba(227,236,238,.8)',500,'right');}));
 }}
]};
