// KITS: land
/* 陸域風電系列 第 13 集：狀態監測與預測性維護 */
const gyy=x=>groundY(x);
/* 正視的葉片與風機（沿用第 3、10、16 集） */
function bladeF(cx,cy,a,L,w){w=w===undefined?1:w;ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
  const k=Math.max(.18,w);poly([8,-5*k,8+L*.2,-10*k,8+L,-1.5*k,8+L,1.5*k,8+L*.2,8*k,8,5*k],'#f4f6f7','rgba(0,0,0,.35)',1);ctx.restore();}
function turbine(x,gy,H,R,rot){const hy=gy-H,w0=Math.max(4,R*.09),w1=Math.max(2.5,R*.05);
  poly([x-w0,gy,x-w1,hy+R*.06,x+w1,hy+R*.06,x+w0,gy],'#eef2f4','rgba(0,0,0,.3)',1);nacRotor(x,hy,R,rot);return {x,y:hy};}
function nacRotor(x,hy,R,rot){box(x-R*.11,hy-R*.08,R*.24,R*.14,'#e3e8ec','rgba(0,0,0,.3)',1);
  for(let i=0;i<3;i++)bladeF(x,hy,rot+i*TAU/3-Math.PI/2,R);circ(x,hy,Math.max(3,R*.07),'#dfe5e8','rgba(0,0,0,.4)',1);}
function windLines(y0,y1,n,sp,a,seed,len){if(a<=0)return;const r=rng(seed||3);ctx.lineCap='round';
  for(let i=0;i<n;i++){const y=y0+r()*(y1-y0),ph=r(),s=sp*(.7+.6*r()),L=(len||60)*(.6+.8*r());const x=VX0-200+((ph*2400+TT*s)%(VX1-VX0+400));
   alphaDo(a*(.25+.35*r()),()=>ln([x,y,x+L,y],'#ffffff',2));}ctx.lineCap='butt';}
/* 卡片內的一列 */
function rowK(x,y,label,val,col,w){wt(x,y,label,18,'rgba(227,236,238,.85)',600);wt(x+w,y,val,22,col,700,'right',COND);}
function bullets(x,y,L,u,k0,dk,gap){L.forEach(([t,col],i)=>alphaDo(seg(u,k0+i*dk,k0+i*dk+.05),()=>{circ(x,y+i*gap-6,5,col==='#fff'?'#f2c230':col);wt(x+18,y+i*gap,t,18,col,600);}));}
const fmtK=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,',');
/* 沿折線取點（f = 0–1） */
function ptAt(P,f){const s=[];let L=0;for(let i=1;i<P.length;i++){const d=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);s.push(d);L+=d;}
  let r=clamp(f,0,1)*L;for(let i=0;i<s.length;i++){if(r<=s[i]){const k=s[i]?r/s[i]:0;return [lerp(P[i][0],P[i+1][0],k),lerp(P[i][1],P[i+1][1],k)];}r-=s[i];}return P[P.length-1].slice();}
function sine(x0,x1,y,A,fHz,win,t0,col,lw){ctx.beginPath();for(let x=x0;x<=x1;x++){const t=t0+(x-x0)/(x1-x0)*win,v=y-A*Math.sin(TAU*fHz*t);x>x0?ctx.lineTo(x,v):ctx.moveTo(x,v);}ctx.strokeStyle=col;ctx.lineWidth=lw||2;ctx.stroke();}
function specLine(C,f1,fn,col,g){ctx.beginPath();for(let f=0;f<=f1*g;f+=.5){const y=C.Y(fn(f));f?ctx.lineTo(C.X(f),y):ctx.moveTo(C.X(f),y);}ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.stroke();}
const gpk=(f,c,a,w)=>a*Math.exp(-(f-c)*(f-c)/(2*(w||3)*(w||3)));
/* 示例：高速軸 25 Hz（1,500 rpm）、小齒輪 23 齒 → 嚙合頻率 575 Hz；軸承 13 顆滾子、d/D = 0.2 */
const FR=25,GMF=575,BPFO=130;
/* 示例：軸承溫度殘差（第 60 天起偏移，約第 92 天越過 3 °C 門檻） */
const tPred=d=>63+5*Math.sin(d*.21)+2*Math.sin(d*.83+1);
const tDrift=d=>d>60?.012*Math.pow(d-60,1.6):0;
const tNoise=d=>.5*Math.sin(d*2.1)+.3*Math.sin(d*5.3+1);
/* 示例：鐵質顆粒累積數（第 7 個月起加速） */
const ferr=m=>60*m+(m>7?40*Math.pow(m-7,2.2):0);
/* P–F 曲線 */
const pfC=t=>t<.12?1:1-.95*Math.pow((t-.12)/.88,2.4);

/* 機艙傳動系剖面（第 1 集卡片） */
function drivetrain(u){
  card(700,170,840,390,{bg:'rgba(7,27,39,.9)'});wt(724,208,'傳動系剖面（示意）',20,'#f2c230',700);
  rrp(750,240,760,260,26);ctx.fillStyle='rgba(227,236,238,.06)';ctx.fill();ctx.strokeStyle='rgba(227,236,238,.35)';ctx.lineWidth=2;ctx.stroke();
  box(758,262,20,100,'#e3e8ec');box(758,382,20,100,'#e3e8ec');circ(780,372,40,'#dfe5e8','rgba(0,0,0,.4)',1.5);
  box(818,360,200,24,'#b9c0c4','rgba(0,0,0,.4)',1);
  box(862,328,64,88,'#8a99a3','rgba(0,0,0,.45)',1.5);
  rrp(1018,290,170,166,10);ctx.fillStyle='#6f7c84';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1.5;ctx.stroke();
  const ga=TT*.8;ring(1078,372,46,'#b9c0c4',3);circ(1078,372,14,'#cfd6db');
  for(let i=0;i<3;i++){const a=ga+i*TAU/3;circ(1078+Math.cos(a)*30,372+Math.sin(a)*30,12,'#9aa3a8','rgba(0,0,0,.4)',1);}
  circ(1152,330,20,'#9aa3a8','rgba(0,0,0,.4)',1);circ(1152,372,10,'#cfd6db','rgba(0,0,0,.4)',1);
  box(1188,364,84,16,'#b9c0c4','rgba(0,0,0,.4)',1);box(1222,356,14,32,'#8a99a3');
  rrp(1272,318,200,108,8);ctx.fillStyle='#4f6f80';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.5)';ctx.stroke();
  for(let x=1290;x<1460;x+=16)ln([x,322,x,422],'rgba(255,255,255,.12)',2);
  /* 潤滑油路與顆粒感測器 */
  box(1030,446,146,10,'rgba(242,194,48,.55)');ln([1176,451,1210,451,1210,470],'#c9a227',4);box(1196,470,28,20,'#f2c230','rgba(0,0,0,.5)',1);
  wt(894,448,'主軸承',16,'rgba(227,236,238,.85)',600,'center');wt(1103,484,'齒輪箱',16,'rgba(227,236,238,.85)',600,'center');wt(1372,448,'發電機',16,'rgba(227,236,238,.85)',600,'center');
  const S=[[894,326],[1050,288],[1160,288],[1290,316],[1454,316]];
  S.forEach(([x,y],i)=>{const a=seg(u,.3+i*.03,.34+i*.03);if(a<=0)return;alphaDo(a,()=>{
    const p=(TT*1.2+i*.37)%1;alphaDo(1-p,()=>ring(x,y-4,8+p*16,'#7dffc4',2));box(x-7,y-12,14,12,'#7dffc4','rgba(0,0,0,.6)',1);});});
  const oa=seg(u,.52,.58);if(oa>0)alphaDo(oa*(.6+.4*Math.sin(TT*6)),()=>ring(1210,480,18,'#f2c230',3));
}

const EP={no:13,slug:'onshore-wind',seriesName:'陸域風電系列',t:'狀態監測與預測性維護',en:'Condition monitoring and predictive maintenance',
lede:'風機的齒輪箱與軸承很少毫無預兆地壞掉。這一集看狀態監測系統如何用加速度計「聽」傳動系、用 FFT 與軸承故障特徵頻率找出損傷，再用油液顆粒與 SCADA 資料交叉確認，最後把突發故障變成可以事先排程的計畫維修。',
facts:[['10','分鐘','SCADA 資料常見的平均間隔，每台風機記錄數百個訊號'],
['575','Hz','示例齒輪嚙合頻率：高速軸每秒 25 轉 × 小齒輪 23 齒'],
['130','Hz','示例軸承的外環故障特徵頻率：13 顆滾子、d/D = 0.2、轉速每秒 25 轉'],
['17/15/12','ISO 4406','齒輪箱潤滑油常見的清潔度目標等級（示例）'],
['1–6','個月','文獻中以 SCADA 正常行為模型提早察覺傳動系異常的時間範圍'],
['3–5','天','計畫性更換齒輪箱的典型停機天數；故障後搶修常需 2–3 週（示例）']],
note:'說明：本集為教育用途示意動畫，傳動系、軸承與油路的比例與配置經過簡化，並非特定機型。高速軸轉速 1,500 rpm、小齒輪 23 齒、軸承 13 顆滾子與 d/D = 0.2 為典型範例；軸承故障特徵頻率依 BPFO = n/2 × fr × (1 − d/D × cos α) 等標準公式計算（接觸角取 0）。頻譜、包絡頻譜、顆粒累積數與溫度殘差曲線均為示意資料，不代表實測。ISO 4406 清潔度 17/15/12 為業界文獻常見的齒輪箱目標、20/18/15 為常見警戒等級，實際依製造商與 AGMA／ISO 規範而定；風機振動量測與評估方法見 ISO 10816-21（後續由 ISO 20816-21 取代）。SCADA 正常行為模型提早 1–6 個月察覺異常引自學術研究的範圍；計畫性更換與故障搶修的停機天數為業界文獻常見說法，實際依吊機、備品、天候與風場條件而定。',
base:()=>{landSky(GY,{sun:{x:1260,y:140},clouds:false});drawGround();},
shots:[
/* 1 ─────────────────────────────── 機艙裡的聽診器 */
{t:'機艙裡的聽診器',en:'Stethoscopes in the nacelle',dur:13,side:true,
 d:'風機的傳動系從輪轂開始，經過主軸、主軸承、齒輪箱的行星級與平行級，再由高速軸帶動發電機。這些旋轉件長期承受變動的風載，一旦軸承或齒輪損壞，往往要動用大型吊機更換。狀態監測系統（CMS）在各軸承座上裝加速度計，在齒輪箱油路上裝顆粒感測器，再配合控制系統每 10 分鐘記錄的 SCADA 資料，把這些訊號持續傳回監控中心，讓維修團隊在損傷擴大前就發現徵兆。',
 s:[[0,'傳動系從主軸承、齒輪箱一路連到發電機'],[.28,'加速度計裝在各軸承座上，持續記錄振動'],[.52,'油路上的感測器計算潤滑油裡的金屬顆粒'],[.76,'振動、油液與 SCADA 資料傳回監控中心']],
 draw(u){
  turbine(120,gyy(120),170,80,TT*1.1+.4);
  const X=400,G=gyy(X),rot=TT*1.0+.3;
  windLines(120,560,10,150,.5,5,50);
  const T=turbine(X,G,320,150,rot);
  /* 監控中心 */
  const BX=560,BG=gyy(BX+60);box(BX,BG-70,120,70,'#dfe5e8','rgba(0,0,0,.3)',1);poly([BX-8,BG-70,BX+60,BG-100,BX+128,BG-70],'#8a99a3');
  box(BX+16,BG-52,40,24,'#2a3a46');box(BX+70,BG-52,34,52,'#5b6a73');
  const sc=seg(u,.76,.82);if(sc>0)alphaDo(sc,()=>{box(BX+20,BG-48,32,16,'#7dffc4');});
  /* 資料流 */
  const da=seg(u,.72,.78);if(da>0){const P=[[X,T.y+16],[X,G+20],[BX+36,BG+20],[BX+36,BG-30]];
   alphaDo(da*.5,()=>{ctx.setLineDash([6,6]);pathLine(P,'#7dffc4',2);ctx.setLineDash([]);});
   for(let k=0;k<6;k++){const f=(TT*.35+k/6)%1,[x,y]=ptAt(P,f);alphaDo(da,()=>circ(x,y,5,'#7dffc4','#13232e',1.5));}}
  /* 剖面放大 */
  const ca=seg(u,.2,.28);if(ca>0)alphaDo(ca,()=>{ctx.setLineDash([5,6]);ln([X+18,T.y-10,700,190],'rgba(255,255,255,.55)',1.5);ln([X+18,T.y+10,700,540],'rgba(255,255,255,.55)',1.5);ctx.setLineDash([]);
   ring(X,T.y,24,'rgba(255,255,255,.7)',2);drivetrain(u);});
  lab(X,T.y,'機艙與傳動系',{dx:110,dy:-70,st:'l',a:band(u,.04,.22)});
  lab(894,316,'加速度計',{dx:80,dy:-46,st:'g',a:band(u,.32,.54)});
  lab(1210,480,'油液顆粒感測器',{dx:150,dy:30,st:'s',a:band(u,.54,.76)});
  lab(BX+60,BG-100,'遠端監控中心',{dx:120,dy:70,st:'g',a:band(u,.78,1)});
  lab(X,G-40,'塔底控制櫃',{dx:-120,dy:-30,a:band(u,.74,1),minor:true});
 }},

/* 2 ─────────────────────────────── FFT */
{t:'振動頻譜：把波形拆開',en:'Vibration spectrum: taking the waveform apart',dur:15,
 d:'加速度計量到的是一條混雜的時間波形：軸的轉動、齒輪一齒一齒嚙合、軸承的細小衝擊全部疊在一起，單看波形很難分辨。快速傅立葉轉換（FFT）把波形拆成不同頻率的成分，畫成頻譜。每種機件都有自己的指紋頻率：轉速的 1 倍頻升高常代表不平衡，2 倍頻常與軸不對心有關；齒輪嚙合頻率等於轉速乘上齒數，旁邊若長出間距等於轉速的邊帶，表示齒面可能已經磨損或裂齒。',
 s:[[0,'加速度計記錄的是混在一起的時間波形'],[.28,'FFT 把波形拆成不同頻率的成分'],[.5,'1 倍頻、2 倍頻與齒輪嚙合頻率各自成峰'],[.74,'嚙合頻率旁長出邊帶，提示齒面可能受損']],
 draw(u){
  diagBG();
  const sb=ease(seg(u,.74,.86)),t0=TT*.03,W=.12;
  card(60,160,700,310,{bg:'rgba(7,27,39,.75)'});wt(84,200,'時間波形：高速軸加速度（示例）',20,'#f2c230',700);
  ln([90,330,730,330],'rgba(255,255,255,.15)',1);
  ctx.beginPath();for(let x=90;x<=730;x++){const t=t0+(x-90)/640*W,v=.55*Math.sin(TAU*FR*t)+.3*Math.sin(TAU*2*FR*t+.7)+.45*Math.sin(TAU*GMF*t)*(1+sb*.9*Math.sin(TAU*FR*t));
   const y=330-v*80;x>90?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#7dc8dc';ctx.lineWidth=1.6;ctx.stroke();
  wt(730,450,'0.12 秒',16,'rgba(227,236,238,.7)',600,'right');
  /* 拆解 */
  card(60,490,700,310,{bg:'rgba(7,27,39,.75)'});wt(84,530,'拆成三個頻率成分',20,'#f2c230',700);
  [['1 倍頻',FR,.55,'#7dc8dc'],['2 倍頻',2*FR,.3,'#7dffc4'],['齒輪嚙合頻率',GMF,.45,'#f2c230']].forEach(([n,f,a,col],i)=>{
   const g=seg(u,.28+i*.06,.34+i*.06);if(g<=0)return;const y=588+i*80;alphaDo(g,()=>{
    wt(90,y-4,n,18,col,700);wt(90,y+22,trf('{f} Hz',{f}),18,'rgba(227,236,238,.85)',600,'left',COND);
    sine(330,730,y,a*46,f,W,t0,col,1.6);});});
  alphaDo(seg(u,.26,.3),()=>{arrow(762,330,796,330,'#f2c230',3);});
  /* 頻譜 */
  const C=chartBox(800,160,740,390,{title:'FFT 頻譜（示例）',x0:0,x1:700,y0:0,y1:1,xt:[0,100,200,300,400,500,600,700],yt:[],xl:'頻率（Hz）',pl:30,pt:70,pb:58,gx:7,gy:4});
  const spec=f=>.02+.015*Math.pow(Math.sin(f*1.7),2)+gpk(f,FR,.55)+gpk(f,2*FR,.3)+gpk(f,GMF,.8)+gpk(f,GMF-FR,.38*sb)+gpk(f,GMF+FR,.38*sb)+gpk(f,GMF-2*FR,.16*sb)+gpk(f,GMF+2*FR,.16*sb);
  const g=ease(seg(u,.28,.5));if(g>0)specLine(C,700,spec,'#7dffc4',g);
  alphaDo(seg(u,.5,.56),()=>{wt(C.X(FR)-6,C.Y(.55)-12,'1 倍頻',16,'#7dc8dc',700);wt(C.X(2*FR)+10,C.Y(.3)-6,'2 倍頻',16,'#7dffc4',700);
   wt(C.X(GMF),C.Y(.8)-14,trf('嚙合頻率 {f} Hz',{f:GMF}),16,'#f2c230',700,'center');});
  alphaDo(seg(u,.8,.86),()=>{tag(C.X(GMF+2*FR)+14,C.Y(.38)-6,'邊帶',{size:15,bg:'#e8572a',fg:'#fff'});
   ln([C.X(GMF-FR),C.Y(.42),C.X(GMF-FR),C.Y(.5)],'#ff9d7a',2);ln([C.X(GMF+FR),C.Y(.42),C.X(GMF+FR),C.Y(.5)],'#ff9d7a',2);});
  /* 指紋 */
  card(800,570,740,230,{bg:'rgba(7,27,39,.75)'});wt(824,608,'頻譜裡的指紋',20,'#f2c230',700);
  bullets(836,650,[['1 倍頻升高：轉子不平衡','#fff'],['2 倍頻升高：軸不對心','#fff'],['嚙合頻率 = 25 Hz × 23 齒 = 575 Hz','#f2c230'],['邊帶間距 = 轉速：齒面磨損或裂齒','#ff9d7a']],u,.5,.09,40);
 }},

/* 3 ─────────────────────────────── 軸承故障特徵頻率 */
{t:'軸承的故障特徵頻率',en:'Bearing defect frequencies',dur:15,
 d:'軸承的早期損傷常從滾道表面的微小剝落開始。每當滾子壓過剝落處，就產生一次短促的衝擊，衝擊重複的頻率只由軸承幾何與轉速決定，稱為故障特徵頻率。以 13 顆滾子、滾子直徑與節圓直徑比 0.2、轉速每秒 25 轉的軸承為例，外環缺陷頻率約 130 Hz、內環約 195 Hz。早期衝擊的能量很小，會被其他振動淹沒，所以 CMS 先用包絡分析把高頻衝擊解調出來，再看頻譜上是否出現這個頻率與它的倍頻。',
 s:[[0,'外環滾道出現一處微小剝落'],[.24,'每顆滾子壓過剝落處，就產生一次衝擊'],[.5,'衝擊頻率由幾何與轉速決定：外環約 130 Hz'],[.76,'包絡頻譜的 130 Hz 與倍頻升高，損傷正在擴大']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'滾子軸承正視（示意）',20,'#f2c230',700);
  const cx=410,cy=450,RP=165,rr=33,ca=TT*.55,sa=-Math.PI/2;
  circ(cx,cy,232,'#8a99a3','rgba(0,0,0,.5)',1.5);circ(cx,cy,RP+rr+2,'#1d3646');
  /* 剝落 */
  const sp=seg(u,.02,.1)*(1+.8*ease(seg(u,.7,.95)));if(sp>0){const w=10*sp,y0=cy-RP-rr-2;poly([cx-w,y0,cx-w*.4,y0-7*sp,cx+w*.5,y0-5*sp,cx+w,y0],'#3a2a22');}
  /* 內環與軸 */
  circ(cx,cy,RP-rr-2,'#b9c0c4','rgba(0,0,0,.5)',1.5);circ(cx,cy,86,'#5b6a73','rgba(0,0,0,.5)',1.5);
  for(let i=0;i<4;i++){const a=TT*1.4+i*TAU/4;ln([cx+Math.cos(a)*40,cy+Math.sin(a)*40,cx+Math.cos(a)*80,cy+Math.sin(a)*80],'rgba(255,255,255,.25)',3);}
  ring(cx,cy,RP,'rgba(242,194,48,.25)',10);
  let imp=0;
  for(let k=0;k<13;k++){const a=ca+k*TAU/13,x=cx+Math.cos(a)*RP,y=cy+Math.sin(a)*RP;
   let d=((a-sa)%TAU+TAU)%TAU;d=Math.min(d,TAU-d);imp=Math.max(imp,1-d/.12);
   circ(x,y,rr,'#dfe5e8','rgba(0,0,0,.5)',1.5);const s=-TT*3.5+k;ln([x,y,x+Math.cos(s)*rr*.8,y+Math.sin(s)*rr*.8],'rgba(0,0,0,.3)',2);}
  imp=Math.max(0,imp);
  if(u>.2)alphaDo(imp*seg(u,.2,.26),()=>{ring(cx,cy-RP-rr,20+20*imp,'#f2c230',4);ring(cx,cy-RP-rr,36+30*imp,'rgba(232,87,42,.7)',2);});
  lab(cx,cy-RP-rr-4,'滾道剝落',{dx:170,dy:-30,st:'w',a:band(u,.04,.48)});
  lab(cx+Math.cos(-.3)*RP,cy+Math.sin(-.3)*RP,'滾子 13 顆',{dx:120,dy:40,a:band(u,.24,.5)});
  wt(90,738,'BPFO = n/2 × fr × (1 − d/D × cos α)',20,'#fff',600,'left',COND);
  alphaDo(seg(u,.5,.56),()=>wt(90,776,'= 13/2 × 25 × (1 − 0.2) = 130 Hz',22,'#f2c230',700,'left',COND));
  /* 包絡頻譜 */
  const C=chartBox(800,160,740,380,{title:'包絡頻譜（示例）',x0:0,x1:450,y0:0,y1:1,xt:[0,100,200,300,400],yt:[],xl:'頻率（Hz）',pl:30,pt:70,pb:58,gx:9,gy:4});
  const dm=.2+.75*ease(seg(u,.68,.95)),A=.25+.6*(dm-.2)/.75;
  const env=f=>.03+.015*Math.pow(Math.sin(f*2.3),2)+gpk(f,FR,.12)+gpk(f,BPFO,A,2.5)+gpk(f,2*BPFO,A*.62,2.5)+gpk(f,3*BPFO,A*.38,2.5);
  const g=ease(seg(u,.5,.66));if(g>0)specLine(C,450,env,'#7dffc4',g);
  alphaDo(seg(u,.58,.64),()=>{[[BPFO,'130 Hz'],[2*BPFO,'260 Hz'],[3*BPFO,'390 Hz']].forEach(([f,t],i)=>{const a=[A,A*.62,A*.38][i];
   ctx.setLineDash([4,5]);ln([C.X(f),C.Y(a)-8,C.X(f),C.py+30],'rgba(242,194,48,.5)',1.5);ctx.setLineDash([]);wt(C.X(f),C.py+22,t,17,'#f2c230',700,'center',COND);});});
  alphaDo(seg(u,.8,.86),()=>tag(C.X(BPFO)+16,C.Y(A)+20,'損傷擴大，峰值升高',{size:15,bg:'#e8572a',fg:'#fff'}));
  /* 四種頻率 */
  card(800,560,740,240,{bg:'rgba(7,27,39,.75)'});wt(824,598,'四種故障特徵頻率（示例）',20,'#f2c230',700);
  [['外環缺陷 BPFO','130 Hz','#f2c230'],['內環缺陷 BPFI','195 Hz','#fff'],['滾動體 BSF','60 Hz','#fff'],['保持架 FTF','10 Hz','#fff']].forEach(([a,b,col],i)=>
   alphaDo(seg(u,.52+i*.05,.56+i*.05),()=>rowK(836,642+i*40,a,b,col,680)));
 }},

/* 4 ─────────────────────────────── 油液分析 */
{t:'油液裡的金屬顆粒',en:'Metal particles in the oil',dur:14,
 d:'齒輪與軸承磨損時，會把金屬碎屑留在潤滑油裡。線上顆粒感測器裝在齒輪箱的油路上，持續計算流過的鐵質顆粒數量與大小；累積數若突然加速上升，往往代表表面開始剝落。此外每季或每半年抽取油樣送實驗室，量測顆粒清潔度、金屬元素、黏度與水分。清潔度以 ISO 4406 表示，例如 17/15/12 依序代表每毫升中大於 4、6、14 微米的顆粒數等級，數字每增加 1，顆粒數約加倍。',
 s:[[0,'潤滑油在齒輪箱、過濾器與冷卻器之間循環'],[.26,'線上感測器計算流過的鐵質顆粒'],[.5,'累積數加速上升，提示齒面或軸承開始剝落'],[.76,'定期取油樣送實驗室，以 ISO 4406 評估清潔度']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'齒輪箱潤滑油路（示意）',20,'#f2c230',700);
  const P=[[300,470],[300,590],[700,590],[700,240],[300,240],[300,260]];
  pathLine(P,'rgba(201,162,39,.45)',12);
  rrp(140,260,320,210,12);ctx.fillStyle='#6f7c84';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1.5;ctx.stroke();
  box(150,430,300,32,'rgba(242,194,48,.45)');
  const ga=TT*.7;ring(240,350,58,'#b9c0c4',4);for(let i=0;i<3;i++){const a=ga+i*TAU/3;circ(240+Math.cos(a)*36,350+Math.sin(a)*36,15,'#9aa3a8','rgba(0,0,0,.4)',1);}
  circ(380,330,30,'#9aa3a8','rgba(0,0,0,.4)',1);circ(380,392,18,'#cfd6db','rgba(0,0,0,.4)',1);
  wt(300,500,'齒輪箱',16,'rgba(227,236,238,.85)',600,'center');
  /* 泵、感測器、過濾器、冷卻器 */
  circ(420,590,22,'#5b6a73','rgba(0,0,0,.5)',1.5);const pa=TT*4;ln([420,590,420+Math.cos(pa)*16,590+Math.sin(pa)*16],'#cfd6db',3);
  box(560,572,44,36,'#f2c230','rgba(0,0,0,.5)',1.5);
  box(682,430,36,80,'#cfd6db','rgba(0,0,0,.5)',1.5);for(let y=440;y<505;y+=8)ln([686,y,714,y],'rgba(0,0,0,.25)',1.5);
  box(672,280,56,90,'#7dc8dc','rgba(0,0,0,.5)',1.5);for(let y=290;y<365;y+=10)ln([676,y,724,y],'rgba(255,255,255,.4)',1.5);
  wt(420,640,'油泵',16,'rgba(227,236,238,.85)',600,'center');wt(582,640,'顆粒感測器',16,'#f2c230',700,'center');
  wt(728,470,'過濾器',16,'rgba(227,236,238,.85)',600,'right',FONT,'alphabetic');
  /* 過濾器位置之前才有鐵質顆粒 */
  const fF=(130+400+120)/(130+400+350+400+20);
  const wear=seg(u,.46,.6);let hit=0;
  for(let k=0;k<44;k++){const f=(k/44+TT*.06)%1,[x,y]=ptAt(P,f),fe=k%4===0||(wear>0&&k%4===2);
   if(fe&&f<fF){circ(x,y,4.5,'#ff9d7a','#13232e',1);if(Math.abs(x-582)<14&&y>570)hit=1;}else circ(x,y,2.5,'rgba(242,194,48,.8)');}
  alphaDo(hit*seg(u,.26,.3),()=>ring(582,590,30,'#ff9d7a',3));
  const mm=12*ease(seg(u,.26,.74));
  rowK(90,700,'運轉月數',trf('{n} 個月',{n:mm.toFixed(1)}),'#fff',640);
  rowK(90,746,'累積鐵質顆粒',trf('{n} 顆',{n:fmtK(ferr(mm))}),mm>8.5?'#ff9d7a':'#7dffc4',640);
  /* 趨勢 */
  const C=chartBox(800,160,740,380,{title:'鐵質顆粒累積數（示例）',x0:0,x1:12,y0:0,y1:2400,xt:[0,3,6,9,12],yt:[0,800,1600,2400],xl:'運轉月數',pl:76,pt:64,pb:58,gx:4,gy:3});
  alphaDo(seg(u,.5,.56),()=>{ctx.setLineDash([7,6]);ln([C.X(0),C.Y(0),C.X(12),C.Y(720)],'rgba(125,255,196,.7)',2);ctx.setLineDash([]);wt(C.X(11.8),C.Y(720)+24,'正常磨損趨勢',15,'#7dffc4',700,'right');});
  if(mm>0){ctx.beginPath();for(let m=0;m<=mm;m+=.05){const x=C.X(m),y=C.Y(ferr(m));m?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#ff9d7a';ctx.lineWidth=3.5;ctx.stroke();
   circ(C.X(mm),C.Y(ferr(mm)),6,'#ff9d7a','#13232e',2);}
  alphaDo(seg(u,.58,.64),()=>tag(C.X(8.8),C.Y(ferr(10))-4,'斜率上升：提早預警',{size:15,bg:'#e8572a',fg:'#fff',align:'right'}));
  /* ISO 4406 */
  const ia=seg(u,.74,.8);card(800,560,740,240,{bg:'rgba(7,27,39,.75)'});wt(824,598,'實驗室油樣：ISO 4406 清潔度',20,'#f2c230',700);
  alphaDo(ia,()=>{wt(836,670,'17/15/12',42,'#7dffc4',700,'left',COND);wt(836,700,'常見目標',16,'rgba(227,236,238,.85)',600);
   wt(1180,670,'20/18/15',42,'#ff9d7a',700,'left',COND);wt(1180,700,'常見警戒等級',16,'rgba(227,236,238,.85)',600);});
  alphaDo(seg(u,.84,.9),()=>{wt(836,746,'三個數字：每毫升 ≥4、≥6、≥14 µm 的顆粒數等級',16,'#fff',600);wt(836,776,'數字每加 1，顆粒數約加倍',16,'#f2c230',700);});
 }},

/* 5 ─────────────────────────────── SCADA 異常偵測 */
{t:'SCADA 資料的異常偵測',en:'Anomaly detection with SCADA data',dur:14,
 d:'風機的控制系統每 10 分鐘就記錄數百個平均值：功率、轉速、風速、外氣溫度，以及軸承與齒輪箱的溫度。常見的異常偵測做法是正常行為模型：先用風機健康時期的資料訓練模型，讓它依功率、轉速與環境溫度預測軸承應有的溫度；再把實測值減去預測值得到殘差。健康時殘差在零附近擺動，一旦軸承摩擦增加，殘差會持續偏高並越過門檻，系統就發出預警。研究顯示這類方法可提早約 1 至 6 個月察覺傳動系異常。',
 s:[[0,'SCADA 每 10 分鐘記錄功率、轉速與各部溫度'],[.26,'正常行為模型依運轉條件預測軸承應有的溫度'],[.52,'實測溫度逐漸高於預測，殘差開始偏移'],[.76,'殘差越過門檻，在停機前數週發出預警']],
 draw(u){
  diagBG();
  const dd=120*ease(seg(u,.2,.92)),res=d=>tDrift(d)+tNoise(d)*.6;
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'正常行為模型（示意）',20,'#f2c230',700);
  const IN=['功率','轉速','外氣溫度','機艙溫度'];
  IN.forEach((t,i)=>alphaDo(seg(u,.02+i*.04,.06+i*.04),()=>{const y=270+i*56;tag(90,y,t,{size:16,bg:'rgba(125,200,220,.9)'});arrow(232,y,296,lerp(320,400,i/3),'rgba(125,200,220,.8)',2);}));
  const ma=seg(u,.2,.26);alphaDo(ma,()=>{card(300,290,220,140,{bg:'rgba(242,194,48,.14)',st:'#f2c230'});wt(410,350,'模型',24,'#f2c230',700,'center');wt(410,384,'以健康期資料訓練',15,'rgba(227,236,238,.85)',600,'center');
   arrow(520,360,640,360,'#f2c230',3);ln([640,360,640,532],'#f2c230',3);arrow(640,500,640,534,'#f2c230',3);wt(580,348,'預測溫度',16,'#f2c230',700,'center');});
  const ra=seg(u,.36,.42);alphaDo(ra,()=>{tag(420,560,'實測溫度',{size:16,bg:'#ff9d7a',align:'right'});arrow(430,560,614,560,'#ff9d7a',3);
   circ(640,560,24,'rgba(7,27,39,.9)','#fff',2);wt(640,568,'−',26,'#fff',700,'center');arrow(640,584,640,650,'#fff',3);
   wt(560,700,'殘差 = 實測 − 預測',20,'#fff',700,'center');});
  const rv=res(dd);alphaDo(seg(u,.42,.46),()=>rowK(90,756,'目前殘差',trf('{v} °C',{v:(rv>=0?'+':'')+rv.toFixed(1)}),rv>3?'#ff9d7a':'#7dffc4',640));
  /* 溫度 */
  const C=chartBox(800,160,740,330,{title:'高速軸軸承溫度（示例）',x0:0,x1:120,y0:50,y1:85,xt:[0,30,60,90,120],yt:[50,60,70,80],xl:'天',yl:'°C',pl:64,pt:64,pb:56,gx:4,gy:7});
  const plot=(C,fn,col,lw)=>{ctx.beginPath();for(let d=0;d<=dd;d+=.5){const y=C.Y(fn(d));d?ctx.lineTo(C.X(d),y):ctx.moveTo(C.X(d),y);}ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke();};
  if(dd>0){plot(C,tPred,'#f2c230',2.5);plot(C,d=>tPred(d)+res(d),'#ff9d7a',2);}
  alphaDo(seg(u,.3,.36),()=>{ln([C.px+16,C.py+14,C.px+46,C.py+14],'#f2c230',3);wt(C.px+54,C.py+20,'預測',15,'#f2c230',700);
   ln([C.px+120,C.py+14,C.px+150,C.py+14],'#ff9d7a',3);wt(C.px+158,C.py+20,'實測',15,'#ff9d7a',700);});
  /* 殘差 */
  const R=chartBox(800,510,740,290,{title:'殘差與警戒門檻（示例）',x0:0,x1:120,y0:-3,y1:10,xt:[0,30,60,90,120],yt:[0,3,6,9],xl:'天',yl:'°C',pl:64,pt:56,pb:52,gx:4,gy:4});
  ctx.setLineDash([8,6]);ln([R.X(0),R.Y(3),R.X(120),R.Y(3)],'#e8572a',2);ctx.setLineDash([]);wt(R.X(2),R.Y(3)-8,'門檻 3 °C',15,'#ff9d7a',700);
  if(dd>0)plot(R,res,'#7dffc4',2.5);
  if(dd>92)alphaDo(seg(dd,92,96),()=>{ln([R.X(92),R.py,R.X(92),R.py+R.ph],'#f2c230',2);tag(R.X(92)-8,R.py+22,'發出預警',{size:15,bg:'#f2c230',align:'right'});});
  if(dd>118)alphaDo(seg(dd,118,120),()=>tag(C.X(118),C.Y(83),'約 4 週後停機',{size:15,bg:'#e8572a',fg:'#fff',align:'right'}));
 }},

/* 6 ─────────────────────────────── P–F 與計畫維修 */
{t:'從預警到計畫維修',en:'From early warning to planned repair',dur:14,side:true,
 d:'狀態監測的價值，在於把故障變成排程。P–F 曲線描述設備從可被偵測的潛在故障（P）走到功能失效（F）的過程：振動頻譜通常最早察覺，其次是油液中的磨損顆粒，再來是 SCADA 溫度上升，最後才是異音與過熱。預警越早，維修團隊越能預訂吊機與零件，並選在風小的季節施工。以齒輪箱為例，計畫性更換約停機 3–5 天；若等到故障才搶修，加上等待吊機與備品，常要停機 2–3 週以上。',
 s:[[0,'設備劣化從可偵測的 P 點，一路走向失效的 F 點'],[.26,'振動最早察覺，其次是油液顆粒與溫度上升'],[.52,'提早預警，就能預訂吊機與備品、排在小風季節'],[.78,'計畫性更換停機約 3–5 天，搶修常要 2–3 週']],
 draw(u){
  turbine(110,gyy(110),150,70,TT*1.1+1.2);
  const X=330,G=gyy(X);
  const p=u<.44?u:u<.54?.44+(u-.44)-(u-.44)*(u-.44)/.2:.49,rot=18*p+.3;
  windLines(120,560,8,150,.5*(1-seg(u,.44,.54))+.15,7,50);
  const T=turbine(X,G,300,130,rot);
  /* 吊機與新齒輪箱 */
  const ca=seg(u,.5,.56),HK=kf(seg(u,.58,.92),[[0,X+342,G-50],[.45,X+342,T.y-90],[.8,X+30,T.y-90],[1,X+30,T.y-46]]);
  const onTruck=u<.58;
  if(ca>0)alphaDo(ca,()=>{box(X+150,G-26,96,20,'#e9b21f','rgba(0,0,0,.4)',1);box(X+132,G-10,132,10,'#394650');
   const h=onTruck?{x:X+342,y:G-120}:{x:HK.x,y:HK.y};crane(X+190,G-30,460,h.x,h.y-20,{col:'#e9b21f'});
   if(!onTruck){ln([h.x,h.y-20,h.x-16,h.y,h.x,h.y-20,h.x+16,h.y],'rgba(30,35,40,.7)',1.2);box(h.x-22,h.y,44,32,'#7f8b93','rgba(0,0,0,.5)',1);}});
  alphaDo(ca,()=>truck(X+270,gyy(X+330),false,'#5b6a73',()=>{if(onTruck)box(50,-66,44,32,'#7f8b93','rgba(0,0,0,.5)',1);}));
  person(X+120,gyy(X+120),'#e8572a',1.3);
  lab(X,T.y,'計畫停機',{dx:-40,dy:-100,st:'s',a:band(u,.54,.78)});
  lab(X+342,G-50,'新齒輪箱',{dx:60,dy:-90,a:band(u,.52,.66)});
  lab(X+190,G-30,'主吊機',{dx:-130,dy:-30,a:band(u,.56,.8)});
  /* P–F 曲線 */
  const C=chartBox(780,340,760,460,{title:'P–F 曲線（示意）',x0:0,x1:1,y0:0,y1:1.05,xt:[],yt:[],xl:'時間',yl:'設備狀態',pl:56,pt:70,pb:50,gx:5,gy:4});
  const tm=.97*ease(seg(u,.04,.48));
  ctx.beginPath();for(let t=0;t<=tm;t+=.005){const y=C.Y(pfC(t));t?ctx.lineTo(C.X(t),y):ctx.moveTo(C.X(t),y);}ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.stroke();
  const M=[[.3,'振動頻譜','#7dffc4'],[.45,'油液顆粒','#7dc8dc'],[.62,'SCADA 溫度','#f2c230'],[.82,'異音、過熱','#ff9d7a']];
  M.forEach(([t,n,col])=>{if(tm<t)return;const x=C.X(t),y=C.Y(pfC(t));alphaDo(seg(tm,t,t+.04),()=>{circ(x,y,8,col,'#13232e',2);wt(x-12,y+28,n,17,col,700,'right');});});
  if(tm>.3)alphaDo(seg(tm,.3,.34),()=>tag(C.X(.3),C.Y(pfC(.3))-26,'P',{size:16,bg:'#7dffc4',align:'center'}));
  if(tm>.95)alphaDo(seg(tm,.95,.97),()=>{circ(C.X(.97),C.Y(pfC(.97)),9,'#e8572a','#13232e',2);tag(C.X(.97),C.Y(pfC(.97))-28,'F',{size:16,bg:'#e8572a',fg:'#fff',align:'center'});});
  alphaDo(seg(u,.5,.56),()=>{const y=C.py+C.ph-22;arrow(C.X(.3),y,C.X(.97),y,'#f2c230',2.5);arrow(C.X(.97),y,C.X(.3),y,'#f2c230',2.5);
   wt((C.X(.3)+C.X(.97))/2,y-12,'P–F 間隔：安排維修的時間',17,'#f2c230',700,'center');});
 },
 hud(u){hudPanel(260,150,'停機天數（示例）',seg(u,.58,.64),w=>{
  hrow(56,'計畫性更換','3–5 天',w,'#7dffc4');hrow(88,'故障後搶修','14–21 天',w,'#ff9d7a');hrow(120,'預警提前','數週至數月',w,'#f2c230');});}}
]};
