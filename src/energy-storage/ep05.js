// KITS: land
/* 儲能系列 第 5 集：電池熱失控與儲能消防 */
const CW20=220,CH20=104;                                  // 20 呎貨櫃側視尺寸（世界座標）
const BX=[200,480,760];                                   // 三座電池貨櫃左緣（間距 60）
const PCSX=1040,TRX=1200,PYX=1440;                        // PCS 櫃、升壓變壓器、電塔
const gyy=x=>groundY(x);
const SUN={x:300,y:330};
/* 20 呎電池貨櫃：外殼、肋條、端部空調機組；open 0–1 表示側牆透明程度 */
function battContainer(x,y,open,inside){
  open=open||0;const w=CW20,h=CH20;
  box(x,y-h,w,h,'#1a2c38');
  if(open>0)alphaDo(open,()=>(inside||containerInside)(x,y));
  alphaDo(1-open*.85,()=>{box(x,y-h,w,h,'#e3e8ec');ctx.strokeStyle='rgba(0,0,0,.14)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<22;i++){const xx=x+w*i/22;ctx.moveTo(xx,y-h+4);ctx.lineTo(xx,y-4);}ctx.stroke();
   box(x+w-44,y-h+14,34,34,'#c5ced4','rgba(0,0,0,.25)',1);ring(x+w-27,y-h+31,12,'rgba(0,0,0,.35)',2);
   box(x+14,y-h+20,40,10,'#2d8f5a');});
  ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.5;ctx.strokeRect(x,y-h,w,h);
  box(x-4,y-h-4,w+8,5,'#aeb8be');box(x+6,y,18,6,'#6a747a');box(x+w-24,y,18,6,'#6a747a');
}
function containerInside(x,y){
  const h=CH20;box(x+2,y-h+2,CW20-4,h-4,'#13232e');
  for(let i=0;i<6;i++){const rx=x+10+i*28;box(rx,y-h+14,22,h-22,'#2a4a66','rgba(255,255,255,.3)',1);
   for(let m=0;m<4;m++)box(rx+3,y-h+18+m*19,16,15,'#3f6f96');}
  box(x+CW20-40,y-h+10,34,h-16,'#44535c','rgba(255,255,255,.3)',1);
}
function pcsSkid(x,y){box(x,y-90,110,90,'#dfe5e8','rgba(0,0,0,.3)',1);for(let i=0;i<3;i++)box(x+10+i*34,y-80,26,50,'#c9d1d6','rgba(0,0,0,.2)',1);
  for(let i=0;i<3;i++)ring(x+23+i*34,y-18,7,'rgba(0,0,0,.35)',2);}
function hydrant(x,y){box(x-7,y-30,14,30,'#c8432a');box(x-11,y-34,22,6,'#a8341f');box(x-13,y-22,26,6,'#a8341f');}
function curveP(ch,fn,a,b,step,col,lw,dash){if(b<=a)return;ctx.beginPath();for(let t=a;t<=b+1e-9;t+=step){const x=ch.X(t),y=ch.Y(fn(t));t===a?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=lw;if(dash)ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
function siteDraw(open,inside){
  fence(150,1520,gyy(800)+4);
  BX.forEach((x,i)=>battContainer(x,gyy(x+CW20/2),i===1?open:0,i===1?inside:null));
  pcsSkid(PCSX,gyy(PCSX));hydrant(1000,gyy(1000));
}
/* 內部：第三櫃第二層的模組過熱（h 0–1）、可選的滅火噴頭與霧 */
function insideHot(h,spray){return (x,y)=>{containerInside(x,y);
  const rx=x+10+2*28;alphaDo(h,()=>box(rx+3,y-CH20+18+19,16,15,'#e8572a'));
  if(spray>0){const nx=x+CW20/2-20,ny=y-CH20+8;box(nx-14,ny-4,28,6,'#8d989f');
   const R=rng(7);for(let k=0;k<22;k++){const a=-1.2+R()*2.4,f=(TT*.9+k/22)%1;alphaDo(spray*(1-f*.6),()=>circ(nx+Math.sin(a)*f*90,ny+Math.cos(a)*f*82,3.2,'#cfeaf5'));}}
};}
function plume(x,y,a,n){if(a<=0)return;const R=rng(11);for(let k=0;k<(n||14);k++){const f=(TT*.35+R())%1;alphaDo(a*(1-f)*.7,()=>circ(x+Math.sin(f*5+k)*18*f+f*40,y-f*170,10+f*28,'#aab4ba'));}}
/* 熱失控溫度曲線（示意，t 為 0–100 相對時間） */
const tempT=t=>{const K=[[0,28],[22,60],[40,95],[55,130],[66,200],[74,330],[80,640],[100,780]];for(let i=1;i<K.length;i++)if(t<=K[i][0]){const s=(t-K[i-1][0])/(K[i][0]-K[i-1][0]);return lerp(K[i-1][1],K[i][1],s*s*(3-2*s)*.5+s*.5);}return 780;};
/* 模組內 4×8 電芯蔓延（示意） */
const CRW=4,CCL=8,CSR=1,CSC=2;
function cellsGrid(x0,y0,cs,u,barrier){
  for(let r=0;r<CRW;r++)for(let c=0;c<CCL;c++){
    const d=Math.abs(r-CSR)+Math.abs(c-CSC),x=x0+c*(cs+8),y=y0+r*(cs+8);
    let h=clamp((u-.22-d*.055)/.05);if(barrier&&d>0)h=0;
    const warm=barrier&&d===1?clamp((u-.3)/.2)*.55:0;
    box(x,y,cs,cs,'#3f6f96','rgba(255,255,255,.25)',1);
    if(warm>0)alphaDo(warm,()=>box(x,y,cs,cs,'#f2c230'));
    if(h>0)alphaDo(h,()=>box(x,y,cs,cs,'#e8572a'));
    if(barrier&&c<CCL-1&&Math.abs(r-CSR)<=1&&c>=CSC-1&&c<=CSC)alphaDo(seg(u,.2,.3),()=>box(x+cs+2,y,4,cs,'#7dffc4'));
  }
}
const EP={no:5,slug:'energy-storage',seriesName:'儲能系列',t:'電池熱失控與儲能消防',en:'Thermal runaway and fire safety for storage',
lede:'一顆電芯出問題，會不會燒掉整座儲能電廠？這一集從熱失控的三個階段講起：看熱怎麼在電芯之間傳遞、為什麼要偵測排出的氣體、滅火系統如何配合冷卻與排氣，以及從電芯到案場的層層防護與國際測試標準。',
facts:[['242–249','°C','一項研究測得磷酸鐵鋰（LFP）電芯熱失控溫度；三元（NMC）電芯約 174–215 °C（條件不同差異大）'],
['H₂','氣體','LFP 電芯排氣常含氫氣、甲烷與乙烯等可燃氣體，是早期偵測的重點'],
['3','階段','異常升溫、排氣冒煙、熱失控：愈早介入，愈容易阻止（典型範例）'],
['4','級','UL 9540A 由電芯、模組、單元到安裝層級，逐級測試熱失控是否蔓延'],
['約 0.9','公尺','舊版國際消防規範（IFC）儲能單元間距約 3 呎；縮短需以大規模火燒測試佐證'],
['20','kWh','台灣《提升儲能系統消防安全管理指引》適用門檻（引自產業報導）']],
note:'說明：本集為教育用途示意動畫，設備、案場比例與溫度曲線經過調整。LFP 熱失控約 242–249 °C、三元約 174–215 °C 引自沙烏地 KAUST 的單一研究報導，LFP 自加熱起始約 131 °C 引自電弧量熱研究，不同電芯、SOC 與測試方法差異很大；LFP 排氣含氫氣、甲烷、乙烯等可燃氣體引自期刊文獻整理；UL 9540A 分電芯、模組、單元與安裝層級，及舊版 IFC 單元 50 kWh、區域 600 kWh、間距約 3 呎，引自 UL 與測試服務商公開說明，實際以標準與主管機關為準；台灣《提升儲能系統消防安全管理指引》（2025 年 11 月修正）20 kWh 門檻僅見於單一產業報導，請以消防署公告為準。階段溫度、蔓延時序、偵測先後與防護配置皆為典型範例。',
base:()=>{landSky(GY,{sun:SUN,clouds:false});drawGround();},
shots:[
{t:'一顆電芯出了問題',en:'When a single cell goes wrong',dur:12,side:true,
 d:'儲能貨櫃裡有數千顆電芯，絕大多數時間運作正常。但只要某一顆因為過充、內部短路、外力擠壓或周圍溫度過高而失控，電芯內部的化學反應會自己加速放熱，這就是熱失控。電池管理系統（BMS）時時監測每串電芯的電壓與溫度，一有異常就切斷充放電，大多數問題在這一步就被擋下。真正的設計挑戰是：萬一還是有一顆失效，要怎麼不讓它拖累旁邊的電芯。',
 s:[[0,'貨櫃裡有數千顆電芯，通常安靜地運作'],[.3,'過充、短路、擠壓或高溫，都可能讓一顆電芯失控'],[.55,'電池管理系統發現異常，先切斷充放電'],[.8,'設計重點：一顆失效，不能拖累其他電芯']],
 cam:u=>({x:820,y:450,s:1}),
 draw(u){
  const h=seg(u,.35,.7);
  siteDraw(seg(u,.05,.2),insideHot(h*(.7+.3*Math.sin(TT*8)),0));
  const L=[['過充','充電超過上限',.28],['內部短路','雜質、隔膜缺陷',.38],['外力擠壓','撞擊、針刺、變形',.48],['外部高溫','散熱不良、火源',.58]];
  L.forEach(([a,b,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const x=440+i*258;card(x,170,240,100,{bg:'rgba(7,27,39,.85)',st:'#e8572a'});box(x,170,6,100,'#e8572a');wt(x+22,208,a,21,'#ff9d7a',700);wt(x+22,246,b,16,'rgba(227,236,238,.9)',500);}));
  lab(BX[1]+CW20/2,gyy(BX[1])-CH20,'電池貨櫃',{dx:0,dy:-60,st:'s',a:band(u,.03,.28)});
  lab(BX[1]+90,gyy(BX[1])-CH20+40,'一顆電芯過熱',{dx:-20,dy:90,st:'w',a:band(u,.4,.8)});
  lab(PCSX+55,gyy(PCSX)-90,'BMS 偵測後切斷',{dx:0,dy:-80,st:'g',a:band(u,.55,1)});
 }},

{t:'熱失控的三個階段',en:'Three stages of thermal runaway',dur:13,
 d:'熱失控不是一瞬間發生，而是一連串反應逐步升級。第一階段是異常升溫：電芯內部的保護膜在約攝氏一百度前後開始分解，放出熱量。第二階段是排氣：電解液蒸發、內部壓力升高，防爆閥打開，噴出可燃氣體與白煙。第三階段是熱失控：隔膜熔化、內部短路，溫度在幾秒內急速竄升到數百度。不同化學系統門檻不同，磷酸鐵鋰比三元電池更晚進入熱失控，但一旦發生仍然需要處置。',
 s:[[0,'第一階段：異常升溫，內部保護膜開始分解'],[.3,'第二階段：排氣，噴出可燃氣體與白煙'],[.58,'第三階段：隔膜熔化，溫度急速竄升'],[.8,'磷酸鐵鋰門檻較高，但仍要防範']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,940,640,{title:'電芯溫度（示意）',x0:0,x1:100,y0:0,y1:800,xt:[0,25,50,75,100],yt:[0,200,400,600,800],xl:'時間（相對，示意）',yl:'溫度（°C）',pl:78,pt:64,pb:62,gx:4,gy:4});
  const T=100*seg(u,.04,.9);
  const st=[[0,55,'#f2c230','① 異常升溫',.04],[55,74,'#ff9d7a','② 排氣',.3],[74,100,'#e8572a','③ 熱失控',.56]];
  st.forEach(([a,b,col,n,t0])=>alphaDo(seg(u,t0,t0+.06),()=>{box(c.X(a),c.py,c.X(b)-c.X(a),c.ph,col==='#f2c230'?'rgba(242,194,48,.09)':col==='#ff9d7a'?'rgba(255,157,122,.12)':'rgba(232,87,42,.16)');wt((c.X(a)+c.X(b))/2,c.py+22,n,16,col,700,'center');}));
  curveP(c,tempT,0,T,.4,'#ff8a60',4);
  if(T>0){circ(c.X(T),c.Y(tempT(T)),8,'#fff','#13232e',2);wt(c.X(Math.min(T,88))+12,c.Y(tempT(T))+(T>70?20:-12),trf('{n} °C',{n:Math.round(tempT(T)/5)*5}),22,'#fff',700,'left',COND);}
  const K=[['① 異常升溫',['保護膜分解放熱，','BMS 可能先偵測到'],'#f2c230',.04],['② 排氣',['防爆閥打開，噴出','可燃氣體與白煙'],'#ff9d7a',.3],['③ 熱失控',['隔膜熔化、內部短路，','數秒內升到數百度'],'#e8572a',.56]];
  K.forEach(([h,s,col,t0])=>alphaDo(seg(u,t0,t0+.06),()=>{const y=160+K.findIndex(q=>q[0]===h)*150;card(1040,y,500,132,{bg:'rgba(7,27,39,.75)'});box(1040,y,6,132,col);wt(1066,y+44,h,22,col,700);wt(1066,y+82,s[0],17,'rgba(227,236,238,.92)',500);wt(1066,y+110,s[1],17,'rgba(227,236,238,.92)',500);}));
  alphaDo(seg(u,.8,.88),()=>{card(1040,620,500,180,{bg:'rgba(125,255,196,.1)',st:'rgba(125,255,196,.5)'});wt(1066,660,'不同化學系統，門檻不同',20,'#7dffc4',700);
   wt(1066,700,'三元（NMC）：約 174–215 °C',17,'#fff',500);wt(1066,730,'磷酸鐵鋰（LFP）：約 242–249 °C',17,'#fff',500);wt(1066,768,'單一研究，條件不同差異大',15,'rgba(227,236,238,.7)',500);});
 }},

{t:'熱怎麼傳到隔壁',en:'How heat spreads to neighbours',dur:13,
 d:'單顆電芯失控放出的熱，會從表面傳給相鄰電芯。如果沒有任何阻隔，鄰近電芯被加熱到臨界溫度後也跟著失控，就像骨牌一樣在模組內擴散，再傳到整個電池櫃。防護設計因此從電芯之間下手：加入隔熱材料或氣凝膠，降低熱傳導；保留間隔與液冷板，把熱帶走；再用洩壓與排氣通道，引導高溫氣體流向安全方向。目標是把事故限制在最小範圍，等待處置。',
 s:[[0,'左：沒有阻隔，熱像骨牌一樣傳開'],[.3,'一顆電芯失控，加熱鄰近電芯'],[.55,'右：電芯之間加隔熱，熱傳不過去'],[.78,'事故被限制在最小範圍，爭取處置時間']],
 draw(u){
  diagBG();
  card(60,160,740,430,{bg:'rgba(7,27,39,.75)'});card(800,160,740,430,{bg:'rgba(7,27,39,.75)'});
  wt(90,204,'沒有阻隔',22,'#ff9d7a',700);wt(830,204,'隔熱與間隔設計',22,'#7dffc4',700);
  const cs=64;cellsGrid(100,260,cs,u,false);cellsGrid(840,260,cs,u,true);
  alphaDo(seg(u,.2,.28),()=>{wt(100+CSC*(cs+8)+cs/2,260+CSR*(cs+8)+cs/2+8,'起',22,'#fff',700,'center');wt(840+CSC*(cs+8)+cs/2,260+CSR*(cs+8)+cs/2+8,'起',22,'#fff',700,'center');});
  alphaDo(seg(u,.82,.9),()=>{tag(430,560,'全模組失控',{size:18,bg:'#e8572a',fg:'#fff',align:'center'});tag(1170,560,'限於單顆電芯',{size:18,bg:'#2d8f5a',fg:'#fff',align:'center'});});
  alphaDo(seg(u,.14,.22),()=>{box(100,562,16,16,'#e8572a');wt(124,576,'失控電芯',15,'#fff',600);});
  const K=[['隔熱材料／氣凝膠','降低電芯間的熱傳導','#7dffc4',.5],['間隔與液冷板','把熱帶離危險區','#7dc8dc',.6],['洩壓與排氣通道','高溫氣體導向安全方向','#f2c230',.7]];
  K.forEach(([h,s,col,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const x=60+i*496;card(x,620,468,150,{bg:'rgba(7,27,39,.75)'});box(x,620,6,150,col);wt(x+26,668,h,21,col,700);wt(x+26,710,s,17,'rgba(227,236,238,.92)',500);}));
 }},

{t:'在起火之前先發現',en:'Detecting trouble before the fire',dur:13,
 d:'熱失控的前段會釋放出可偵測的訊號。研究指出，磷酸鐵鋰電芯在排氣階段會釋出氫氣、甲烷與乙烯等可燃氣體，有些訊號甚至早在煙霧出現前就能量到。因此，儲能貨櫃除了電壓與溫度監測，還會加裝氣體、煙霧與火焰偵測。一旦任一偵測達到門檻，系統會停止充放電、斷開電路、啟動排風，並通知控制中心。愈早偵測，愈有時間在擴大之前處置。',
 s:[[0,'電壓或溫度異常，BMS 最先察覺'],[.28,'接著是氣體：氫氣、甲烷、電解液蒸氣'],[.52,'再來是煙霧與高溫，最後才是明火'],[.78,'任一偵測觸發，立即停機、斷電、排風、通報']],
 draw(u){
  diagBG();
  card(60,160,1480,330,{bg:'rgba(7,27,39,.75)'});
  wt(90,204,'偵測訊號出現的先後順序（典型範例）',20,'#f2c230',700);
  const x0=140,x1=1480;ln([x0,370,x1,370],'rgba(255,255,255,.35)',3);arrow(x1-30,370,x1,370,'rgba(255,255,255,.5)',3);wt(x1,410,'時間',16,'rgba(227,236,238,.8)',600,'right');
  const S=[['電壓／溫度異常','BMS',.2,'#f2c230',.04],['可燃氣體','氫氣、甲烷、電解液蒸氣',.42,'#7dffc4',.26],['煙霧','白煙擴散',.66,'#7dc8dc',.48],['明火／高溫','火焰偵測',.88,'#e8572a',.66]];
  S.forEach(([n,s,p,col,t0],i)=>alphaDo(seg(u,t0,t0+.07),()=>{const x=lerp(x0,x1,p)-20;circ(x,370,14,col,'#13232e',3);
   wt(x,(i%2?446:314),n,21,col,700,'center');wt(x,(i%2?472:288),s,15,'rgba(227,236,238,.85)',500,'center');}));
  alphaDo(seg(u,.28,.36),()=>{const xa=lerp(x0,x1,.2)-20,xb=lerp(x0,x1,.88)-20;ln([xa,350,xa,332],'rgba(255,255,255,.0)',1);box(xa,348,xb-xa,6,'rgba(125,255,196,.35)');wt((xa+xb)/2,342,'可處置的時間',16,'#7dffc4',700,'center');});
  const A=[['1','停止充放電','BMS 通知變流器停機','#f2c230'],['2','斷開電路','隔離故障櫃','#7dffc4'],['3','啟動排風','排出可燃氣體','#7dc8dc'],['4','通報','控制中心與消防單位','#ff9d7a']];
  A.forEach(([n,h,s,col],i)=>alphaDo(seg(u,.74+i*.05,.8+i*.05),()=>{const x=60+i*378;card(x,530,348,230,{bg:'rgba(7,27,39,.8)',st:col});wt(x+22,580,n,30,col,700,'left',COND);wt(x+70,578,h,24,'#fff',700);wt(x+22,640,s,17,'rgba(227,236,238,.92)',500);if(i<3)arrow(x+350,645,x+376,645,col,3);}));
 }},

{t:'滅火、冷卻與排氣',en:'Suppression, cooling and venting',dur:13,side:true,
 d:'偵測到異常後，現場的滅火設計要同時處理三件事。第一，貨櫃內的噴頭釋放滅火劑，壓制火焰；第二，持續冷卻，因為電芯內部的熱量還在，火被撲滅後仍可能復燃，所以常以大量水降溫，或由消防人員從外部對相鄰貨櫃噴水；第三，排出可燃氣體，避免累積後爆燃，貨櫃配有排風與防爆釋壓設計。各案場的滅火劑種類與水量不同，需依測試結果與主管機關規定設計（典型範例）。',
 s:[[0,'貨櫃內的噴頭釋放滅火劑，壓制火焰'],[.3,'持續冷卻：熱還在電芯裡，火滅了仍可能復燃'],[.55,'消防人員從外部，對相鄰貨櫃降溫'],[.8,'排風與釋壓，不讓可燃氣體累積']],
 cam:u=>camMix({x:820,y:450,s:1},{x:640,y:520,s:1.32},ease(seg(u,.05,.3))),
 draw(u){
  const sp=band(u,.08,.9),h=1-seg(u,.45,.85)*.6;
  siteDraw(1,insideHot(h*(.75+.25*Math.sin(TT*9)),sp));
  plume(BX[1]+CW20-60,gyy(BX[1])-CH20,band(u,.1,.95),16);
  const a=band(u,.5,.95);if(a>0){const gx=gyy(1000),sx=1000,sy=gx-40,tx=BX[2]+CW20-6,ty=gyy(BX[2])-CH20+16;
   for(let k=0;k<16;k++){const f=((TT*.9+k/16)%1),px=lerp(sx,tx,f),py=lerp(sy,ty,f)-Math.sin(f*Math.PI)*60;alphaDo(a,()=>circ(px,py,3.5,'#bfe3f2'));}}
 },
 fx(u){
  lab(BX[1]+90,gyy(BX[1])-CH20+10,'噴頭釋放滅火劑',{dx:-30,dy:-110,st:'g',a:band(u,.05,.4)});
  lab(BX[1]+CW20-60,gyy(BX[1])-CH20-30,'排風／釋壓',{dx:60,dy:-90,st:'w',a:band(u,.65,1)});
  lab(1000,gyy(1000)-40,'消防栓：外部降溫',{dx:50,dy:-90,st:'s',a:band(u,.45,.9)});
 },
 hud(u){hudPanel(300,180,'三件事同時做',seg(u,.05,.1),w=>{
  const R=[['壓制火焰',.9,'#7dffc4',.1],['持續冷卻',.75,'#7dc8dc',.3],['排出氣體',.6,'#f2c230',.5]];
  R.forEach(([n,v,col,t0],i)=>{const a=seg(u,t0,t0+.15),y=52+i*40;htext(16,y,n,15,'#fff',700);hbar(16,y+8,w-32,v*a,col);});
  htext(16,168,'示意，非實際水量或藥劑量',13,'rgba(227,236,238,.6)',500);});}},

{t:'層層防護與標準',en:'Layers of protection and standards',dur:14,
 d:'儲能的安全不靠單一裝置，而是由內到外層層設防：電芯層用防爆閥與保護膜，模組層用隔熱與液冷，貨櫃層用偵測、滅火與排氣，案場層用間距、圍籬與消防栓。國際上，UL 9540A 把熱失控測試分成電芯、模組、單元到安裝四個層級，用實測數據證明火勢不會無限擴大，NFPA 855 則規範容量與間距，台灣也訂有儲能系統消防安全管理指引。標準會持續更新，案場設計以最新版本與主管機關規定為準。',
 s:[[0,'安全由內到外：電芯、模組、貨櫃、案場'],[.3,'每一層都有自己的防護，不靠單一裝置'],[.58,'UL 9540A：逐級測試熱失控會不會蔓延'],[.8,'再搭配 NFPA 855 與台灣的消防指引']],
 draw(u){
  diagBG();
  const L=[['電芯','防爆閥、保護膜','#f2c230',.04],['模組','隔熱材、液冷板','#7dc8dc',.14],['貨櫃','偵測、滅火、排氣','#7dffc4',.24],['案場','間距、圍籬、消防栓','#ff9d7a',.34]];
  L.forEach(([n,s,col,t0],i)=>alphaDo(seg(u,t0,t0+.07),()=>{const y=170+i*150;card(60,y,720,128,{bg:'rgba(7,27,39,.78)',st:col});box(60,y,6,128,col);
   wt(90,y+50,String(i+1),32,col,700,'left',COND);wt(140,y+50,n,26,'#fff',700);wt(140,y+92,s,19,'rgba(227,236,238,.92)',500);
   const w=80+i*70;box(560+(4-i)*0,y+30,0,0,col);ctx.save();ctx.globalAlpha*=.9;ring(700,y+64,18+i*8,col,3);ctx.restore();}));
  card(820,160,720,640,{bg:'rgba(7,27,39,.75)'});wt(850,204,'標準與規範',22,'#f2c230',700);
  const T=[['UL 9540A','電芯→模組→單元→安裝層級的熱失控蔓延測試','#7dffc4',.52],['NFPA 855','儲能系統的容量、間距與防護要求','#7dc8dc',.64],['台灣消防安全管理指引','併網型與表後型，20 kWh 以上適用（引自報導）','#ff9d7a',.76]];
  T.forEach(([h,s,col,t0],i)=>alphaDo(seg(u,t0,t0+.07),()=>{const y=236+i*136;card(850,y,660,116,{bg:'rgba(255,255,255,.04)',st:'rgba(255,255,255,.14)'});box(850,y,6,116,col);wt(876,y+44,h,22,col,700);wt(876,y+84,s,16,'rgba(227,236,238,.92)',500);}));
  alphaDo(seg(u,.86,.93),()=>wt(850,716,'標準持續更新，以最新版本與主管機關規定為準',17,'rgba(227,236,238,.85)',600));
 }}
]};
