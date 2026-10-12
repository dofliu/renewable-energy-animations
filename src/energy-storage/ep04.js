// KITS: land
/* 儲能系列 第 4 集：儲能如何參與電力市場 */
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
function transformer(x,y){box(x,y-80,90,80,'#8d989f');for(let i=0;i<5;i++)box(x-10,y-72+i*14,10,8,'#6f7a80');for(let i=0;i<5;i++)box(x+90,y-72+i*14,10,8,'#6f7a80');
  for(let i=0;i<3;i++){box(x+18+i*24,y-110,8,30,'#c9a38c');for(let k=0;k<4;k++)box(x+14+i*24,y-106+k*7,16,3,'#b58b73');}}
function pylon(x,y){ctx.strokeStyle='#5c6770';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-34,y);ctx.lineTo(x-6,y-230);ctx.lineTo(x+6,y-230);ctx.lineTo(x+34,y);
  for(let k=0;k<6;k++){const t=k/6,t2=(k+1)/6;ctx.moveTo(lerp(x-34,x-6,t),lerp(y,y-230,t));ctx.lineTo(lerp(x+34,x+6,t2),lerp(y,y-230,t2));ctx.moveTo(lerp(x+34,x+6,t),lerp(y,y-230,t));ctx.lineTo(lerp(x-34,x-6,t2),lerp(y,y-230,t2));}
  ctx.moveTo(x-60,y-200);ctx.lineTo(x+60,y-200);ctx.moveTo(x-46,y-170);ctx.lineTo(x+46,y-170);ctx.stroke();}
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,dir,sp){if(a<=0)return;for(let k=0;k<n;k++){let f=((TT*(sp||.3))+k/n)%1;if(dir<0)f=1-f;const p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],4.5,col));}}
function sitePath(){const yb=gyy(PCSX)-40;return [[BX[0]+CW20/2,gyy(BX[0])-CH20-10],[BX[0]+CW20/2,gyy(BX[0])-CH20-22],[PCSX+55,gyy(PCSX)-CH20-22],[PCSX+55,yb-50],[TRX+45,yb-50],[TRX+45,gyy(TRX)-112],[PYX,gyy(PYX)-200]];}
/* 消防栓 */
function hydrant(x,y){box(x-7,y-30,14,30,'#c8432a');box(x-11,y-34,22,6,'#a8341f');box(x-13,y-22,26,6,'#a8341f');}
/* 整座案場；inside 用來替換中間貨櫃的內部畫法 */
function siteDraw(o){o=o||{};
  fence(150,1520,gyy(800)+4);
  BX.forEach((x,i)=>battContainer(x,gyy(x+CW20/2),i===1?(o.open||0):0,o.inside));
  pcsSkid(PCSX,gyy(PCSX));transformer(TRX,gyy(TRX));pylon(PYX,gyy(PYX));
  ln([PYX,gyy(PYX)-200,1700,gyy(PYX)-215],'#394650',2);
  ctx.setLineDash([8,6]);ln([BX[0]+CW20/2,gyy(BX[0])-CH20-22,PCSX+55,gyy(PCSX)-CH20-22],'rgba(40,50,58,.55)',2.5);ctx.setLineDash([]);
  for(const x of BX)ln([x+CW20/2,gyy(x)-CH20-4,x+CW20/2,gyy(x)-CH20-22],'rgba(40,50,58,.55)',2.5);
  ln([PCSX+55,gyy(PCSX)-CH20-22,PCSX+55,gyy(PCSX)-90],'rgba(40,50,58,.55)',2.5);
  ln([PCSX+110,gyy(PCSX)-60,TRX,gyy(TRX)-60],'rgba(40,50,58,.55)',2.5);
  ln([TRX+45,gyy(TRX)-110,PYX,gyy(PYX)-200],'#394650',2);
}
function curveP(ch,fn,a,b,step,col,lw,dash){if(b<=a)return;ctx.beginPath();for(let t=a;t<=b+1e-9;t+=step){const x=ch.X(t),y=ch.Y(fn(t));t===a?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=lw;if(dash)ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);}
/* 頻率與電池出力（示意）：t 為秒 */
const fNoise=t=>.035*Math.sin(t*.9)+.02*Math.sin(t*2.3+1);
const fDip=t=>t<40?0:-.5*(Math.exp(-(t-40)/22)-Math.exp(-(t-40)/2));
const fNo=t=>60+fNoise(t)+fDip(t);
const fWith=t=>60+fNoise(t)*.5+fDip(t)*.55;
const batP=t=>clamp((60-fNo(t))*45,-5,5);
/* 一天的 SOC 與電價（示意，h 為 0–24 時） */
const socDay=h=>{const K=[[0,50],[6,50],[9,52],[13,90],[15,90],[17,84],[21,22],[22.5,40],[24,50]];for(let i=1;i<K.length;i++)if(h<=K[i][0]){const t=(h-K[i-1][0])/(K[i][0]-K[i-1][0]);return lerp(K[i-1][1],K[i][1],t);}return 50;};
const priceDay=h=>.35+.2*Math.exp(-Math.pow((h-19.5)/2.2,2))-.18*Math.exp(-Math.pow((h-12.5)/3,2))+.08*Math.exp(-Math.pow((h-9.5)/1.8,2));

const EP={no:4,slug:'energy-storage',seriesName:'儲能系列',t:'儲能如何參與電力市場',en:'How storage takes part in the power market',
lede:'儲能電廠蓋好之後，要靠賣「服務」才能回本。這一集看台電日前輔助服務市場怎麼運作：前一天報量報價、依反應速度分成調頻與備轉、電池如何在一秒內修正頻率，以及怎麼安排一天的充放電，才不辜負每一度電。',
facts:[['1','秒','動態調頻（dReg）要求的反應時間；靜態調頻（sReg）為 10 秒'],
['10','分鐘','即時備轉需在約 10 分鐘內到位，持續供電（典型範例）'],
['30','分鐘','補充備轉的反應時間約 30 分鐘，持續時間更長（典型範例）'],
['60','Hz','台灣電網的額定頻率；調頻備轉負責把偏差拉回 60 Hz'],
['1,000','MW','台電規劃 2025 年的儲能目標，其中自建約 160 MW、採購輔助服務約 840 MW']],
note:'說明：本集為教育用途示意動畫，設備與案場比例經過調整。日前輔助服務的項目（調頻備轉、即時備轉、補充備轉與電能移轉複合動態調頻）、動態調頻 1 秒與靜態調頻 10 秒反應時間、2025 年儲能目標約 1,000 MW（自建 160 MW、採購 840 MW），參考台電電力交易平台與公開報導；即時備轉 10 分鐘、補充備轉 30 分鐘等時間、得標流程細節與頻率、出力、充放電曲線均為典型範例或示意，實際規則與價格以台電電力交易平台公告為準，且規則會調整。',
base:()=>{landSky(GY,{sun:SUN,clouds:false});drawGround();},
shots:[
{t:'電池賣的是「速度」',en:'What storage really sells',dur:12,side:true,
 d:'再生能源愈多，電網愈需要能快速增減出力的資源。儲能不只是把電存起來，更重要的是它反應快：電池變流器可以在一秒內由充電轉為放電。台灣的電力交易平台把這種能力依反應時間分成不同產品：秒級的調頻、分鐘級的備轉，以及小時級的電能移轉。儲能業者把可用容量報給台電，得標後就按「容量」與「表現」領取費用，這就是儲能電廠主要的收入來源（示例）。',
 s:[[0,'儲能電廠不只存電，更重要的是反應快'],[.3,'秒級：調頻，把頻率穩在 60 Hz'],[.55,'分鐘級：備轉，機組跳脫時補上缺口'],[.78,'小時級：電能移轉，把中午的電留到晚上']],
 cam:u=>({x:820,y:450,s:1}),
 draw(u){
  siteDraw();
  const P=sitePath();flowDots(P,10,'#7dffc4',band(u,.25,.55),-1,.5);flowDots(P,12,'#f2c230',band(u,.5,.78),-1,.3);flowDots(P,10,'#7dc8dc',seg(u,.76,.84),1,.25);
  const L=[['秒級','調頻備轉','1–10 秒反應','#7dffc4',.2],['分鐘級','即時／補充備轉','10–30 分鐘到位','#f2c230',.46],['小時級','電能移轉','中午充、晚上放','#7dc8dc',.7]];
  L.forEach(([n,v,s,col,t0],i)=>{const a=seg(u,t0,t0+.07),x=480+i*350;alphaDo(a,()=>{card(x,170,320,100,{bg:'rgba(7,27,39,.82)',st:col});box(x,170,6,100,col);
   wt(x+24,206,n,18,col,700);wt(x+24,238,v,22,'#fff',700);wt(x+24,262,s,15,'rgba(227,236,238,.85)',500);});});
  lab(BX[1]+CW20/2,gyy(BX[1])-CH20,'電池貨櫃',{dx:0,dy:-60,st:'s',a:band(u,.05,.3)});
  lab(PCSX+55,gyy(PCSX)-90,'變流器（PCS）一秒內換向',{dx:-10,dy:-70,st:'g',a:band(u,.2,.5)});
  lab(PYX,gyy(PYX)-200,'電力市場',{dx:-50,dy:40,st:'l',a:band(u,.5,1)});
 }},

{t:'前一天就要報價',en:'Bidding the day before',dur:13,
 d:'台電的「日前輔助服務市場」，顧名思義在用電日的前一天就先交易。業者依自己的設備狀況，報出隔天每個時段願意提供的容量與價格；台電調度中心依系統需求，由低價往高價依序選取，直到需求量滿足，得標的業者就取得隔天的履約責任。到了當天，調度中心以控制訊號呼叫儲能充放電；事後再依實際表現結算，若未達到要求就會扣款。儲能必須在報價前先通過台電的能力驗測，才能成為合格交易者。',
 s:[[0,'前一天：業者報出隔天各時段的容量與價格'],[.28,'調度中心由低價往高價選取，直到需求滿足'],[.52,'當天：收到控制訊號，儲能依指令充放電'],[.76,'事後：依實際表現結算，沒做到就扣款']],
 draw(u){
  diagBG();
  const S=[['①','前一天','業者報量報價','隔天各時段容量與價格','#f2c230'],['②','前一天','調度中心結清','低價優先，到需求滿足為止','#f2c230'],['③','用電當天','即時調度','訊號呼叫電池充放電','#7dffc4'],['④','事後','表現結算','達標領費，未達標扣款','#7dc8dc']];
  S.forEach(([n,w,h,s,col],i)=>{const t0=.03+i*.2,a=seg(u,t0,t0+.07),x=60+i*378;alphaDo(a,()=>{card(x,170,348,190,{bg:'rgba(7,27,39,.8)',st:col});
   wt(x+22,214,n,28,col,700,'left',COND);wt(x+68,212,w,18,'rgba(227,236,238,.8)',600);wt(x+22,264,h,26,'#fff',700);wt(x+22,306,s,17,'rgba(227,236,238,.9)',500);});
   if(i<3)alphaDo(a,()=>arrow(x+350,265,x+376,265,col,3));});
  /* 24 小時得標格 */
  const x0=130,w=1340,cw=w/24,y0=470;
  alphaDo(seg(u,.1,.18),()=>{card(60,420,1480,370,{bg:'rgba(7,27,39,.6)'});wt(86,458,'隔天 24 個時段的得標結果（示意）',20,'#f2c230',700);
   for(let h=0;h<24;h++){box(x0+h*cw+2,y0+20,cw-4,150,'rgba(255,255,255,.06)');if(h%3===0)wt(x0+h*cw+cw/2,y0+196,String(h).padStart(2,'0'),16,'rgba(227,236,238,.8)',600,'center',COND);}});
  const bid=h=>h>=0&&h<24;const won=h=>[0,1,2,3,4,5,10,11,12,13,14,18,19,20,21,22].includes(h);
  const f=seg(u,.2,.5);
  for(let h=0;h<24;h++){const k=clamp(f*24-h);if(k<=0)continue;const base=y0+20+150;const hh=bid(h)?110+30*Math.sin(h*.7):0;
   alphaDo(k,()=>box(x0+h*cw+2,base-hh,cw-4,hh,'rgba(242,194,48,.35)'));
   const g=seg(u,.4,.6);if(won(h)&&g>0)alphaDo(g,()=>{box(x0+h*cw+2,base-hh,cw-4,hh,'#7dffc4');});}
  alphaDo(seg(u,.3,.4),()=>{ctx.setLineDash([8,6]);ln([x0,y0+60,x0+w,y0+60],'#e8572a',2);ctx.setLineDash([]);wt(x0+w,y0-12,'系統需求量（虛線）',16,'#ff9d7a',700,'right');});
  alphaDo(seg(u,.55,.62),()=>{circ(100,742,8,'rgba(242,194,48,.6)');wt(116,748,'報價容量',16,'#fff',600);box(236,734,16,16,'#7dffc4');wt(260,748,'得標，隔天履約',16,'#fff',600);});
  alphaDo(seg(u,.8,.88),()=>tag(1280,742,'未通過驗測，不能報價',{size:16,bg:'#e8572a',fg:'#fff',align:'center'}));
 }},

{t:'四種產品，反應速度不同',en:'Four products, four response speeds',dur:13,
 d:'日前輔助服務依反應速度分成幾種產品。動態調頻（dReg）由調度系統每隔幾秒送出訊號，電池要在 1 秒內做出雙向充放電；靜態調頻（sReg）在頻率偏離時，10 秒內啟動。即時備轉與補充備轉則是機組跳脫後的備用電源，即時備轉約 10 分鐘內要到位，補充備轉約 30 分鐘，持續時間較長。愈快的產品愈適合電池，慢而持久的產品則由燃氣機組、抽蓄水力等分擔。',
 s:[[0,'動態調頻：1 秒內，雙向充放電'],[.28,'靜態調頻：頻率偏離時，10 秒內啟動'],[.52,'即時備轉：約 10 分鐘內到位'],[.74,'補充備轉：約 30 分鐘，持續更久']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:'rgba(7,27,39,.75)'});
  wt(90,204,'要求的反應時間（對數座標，示意）',20,'#f2c230',700);
  const ax=330,aw=680,lg=v=>Math.log10(v/.5)/Math.log10(3600/.5),X=v=>ax+aw*lg(v);
  [[1,'1 秒'],[10,'10 秒'],[60,'1 分'],[600,'10 分'],[3600,'1 小時']].forEach(([v,t])=>{ln([X(v),250,X(v),700],'rgba(255,255,255,.12)',1);wt(X(v),730,t,16,'rgba(227,236,238,.85)',600,'center');});
  const R=[['動態調頻 dReg',1,'#7dffc4','電池最擅長',.04],['靜態調頻 sReg',10,'#7dffc4','',.26],['即時備轉',600,'#f2c230','',.5],['補充備轉',1800,'#7dc8dc','',.72]];
  R.forEach(([n,v,col,s,t0],i)=>{const y=275+i*108,a=seg(u,t0,t0+.14);alphaDo(a>0?1:0,()=>{wt(90,y+36,n,19,'#fff',700);box(ax,y+8,Math.max(6,(X(v)-ax)*ease(a)),44,col);
   if(a>.6)wt(Math.max(X(v),ax+6)+12,y+38,({1:'1 秒',10:'10 秒',600:'10 分鐘',1800:'30 分鐘'})[v],22,'#fff',700,'left',COND);});});
  /* 右：誰適合 */
  card(1090,160,450,640,{bg:'rgba(7,27,39,.75)'});wt(1116,204,'適合誰來做',20,'#f2c230',700);
  const W=[['秒級調頻',['電池、飛輪：','反應快、可雙向'],'#7dffc4',.1],['分鐘級備轉',['電池、燃氣機組、','抽蓄水力、需量反應'],'#f2c230',.54],['持續時間',['愈長的產品，','愈吃電池的容量'],'#ff9d7a',.76]];
  W.forEach(([h,s,col,t0])=>alphaDo(seg(u,t0,t0+.07),()=>{const y=240+W.findIndex(q=>q[0]===h)*180;card(1116,y,398,156,{bg:'rgba(255,255,255,.04)',st:'rgba(255,255,255,.14)'});box(1116,y,6,156,col);wt(1142,y+44,h,20,col,700);wt(1142,y+84,s[0],17,'rgba(227,236,238,.9)',500);wt(1142,y+112,s[1],17,'rgba(227,236,238,.9)',500);}));
 }},

{t:'一秒內，把頻率拉回來',en:'Pulling frequency back within a second',dur:14,
 d:'電網頻率代表供需是否平衡：發電比用電少，頻率下降；發電太多，頻率上升。台灣額定 60 赫茲，當大型機組跳脫，頻率會在幾秒內快速下滑。調頻儲能每秒量測頻率，頻率低於 60 Hz 就放電、高於就充電，偏離愈多，出力愈大，直到額定功率為止。圖中虛線是沒有儲能時的頻率，實線是有儲能協助的頻率：下探幅度較小，也比較快恢復。調頻時電池的淨充放電量很小，所以電量大致維持穩定。',
 s:[[0,'發電少於用電，頻率就會往下掉'],[.3,'機組跳脫：頻率快速下滑'],[.5,'頻率低於 60 Hz，電池立刻放電補上'],[.75,'有儲能協助，下探較淺、恢復更快']],
 draw(u){
  diagBG();
  const T=100*seg(u,.04,.9);
  const c1=chartBox(60,160,960,330,{title:'電網頻率（示意）',x0:0,x1:100,y0:59.5,y1:60.2,yt:[59.6,59.8,60,60.2],pl:72,pt:56,pb:20,gx:5,gy:7});
  const c2=chartBox(60,500,960,300,{title:'儲能出力（示意，正為放電）',x0:0,x1:100,y0:-6,y1:6,xt:[0,20,40,60,80,100],yt:[-5,0,5],xl:'時間（秒）',pl:72,pt:46,pb:56,gx:5,gy:4});
  ln([c1.px,c1.Y(60),c1.px+c1.pw,c1.Y(60)],'rgba(255,255,255,.4)',1.5);wt(c1.px+c1.pw-8,c1.Y(60)-8,'60 Hz',16,'#fff',700,'right',COND);
  alphaDo(seg(u,.28,.34),()=>{ln([c1.X(40),c1.py,c1.X(40),c1.py+c1.ph],'rgba(232,87,42,.7)',2);tag(c1.X(40)+10,c1.py+16,'機組跳脫',{size:15,bg:'#e8572a',fg:'#fff'});});
  curveP(c1,fNo,0,T,.4,'#ff8a60',3,[8,6]);curveP(c1,fWith,0,T,.4,'#7dffc4',4);curveP(c2,batP,0,T,.4,'#f2c230',4);
  if(T>0){circ(c1.X(T),c1.Y(fWith(T)),7,'#fff','#13232e',2);circ(c2.X(T),c2.Y(batP(T)),7,'#fff','#13232e',2);
   wt(c1.px+c1.pw-10,c1.py+36,trf('{f} Hz',{f:fWith(T).toFixed(2)}),22,'#7dffc4',700,'right',COND);
   wt(c2.px+c2.pw-10,c2.py+34,trf('{p} MW',{p:batP(T).toFixed(1)}),22,'#f2c230',700,'right',COND);}
  alphaDo(seg(u,.7,.78),()=>{wt(c1.X(46),c1.Y(59.62),'無儲能（虛線）',16,'#ff8a60',700);wt(c1.X(62),c1.Y(59.95)+26,'有儲能（實線）',16,'#7dffc4',700);});
  const K=[['每秒量測','頻率低就放電、高就充電','#7dffc4',.08],['按偏差比例出力','偏離愈多，出力愈大，最高到額定','#f2c230',.4],['淨能量很小','上下來回，電量大致不變','#7dc8dc',.62]];
  K.forEach(([h,s,col,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=160+i*140;card(1060,y,480,122,{bg:'rgba(7,27,39,.75)'});box(1060,y,6,122,col);wt(1086,y+46,h,21,col,700);wt(1086,y+84,s,16,'rgba(227,236,238,.9)',500);}));
  alphaDo(seg(u,.82,.9),()=>{card(1060,590,480,210,{bg:'rgba(125,255,196,.1)',st:'rgba(125,255,196,.5)'});wt(1086,634,'為什麼適合電池',20,'#7dffc4',700);
   wt(1086,676,'火力機組調整出力要數十秒',17,'#fff',500);wt(1086,706,'以上，電池只要不到 1 秒',17,'#fff',500);wt(1086,750,'→ 同樣容量，調頻效果更好',17,'rgba(227,236,238,.88)',600);});
 }},

{t:'一天怎麼充放，才不吃虧',en:'Scheduling a day of charge and discharge',dur:13,
 d:'儲能的電量是有限的，同一份容量不能重複承諾。能量管理系統（EMS）要先預留調頻或備轉需要的充放電空間，再用剩下的容量做電能移轉：中午太陽光電大發、電價偏低時充電，傍晚用電尖峰、電價較高時放電。為了避免電池過度深充深放，排程通常把電量保持在中間範圍，夜間再慢慢回到約一半，準備迎接隔天。每次充放都會消耗循環壽命，賺到的錢要和電池耗損一起算。',
 s:[[0,'先為調頻、備轉預留充放電空間'],[.3,'中午太陽光電大發，電價低，充電'],[.55,'傍晚尖峰，電價高，放電'],[.8,'夜間回到約一半電量，準備隔天']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,960,640,{title:'一天的電量與電價（示意）',x0:0,x1:24,y0:0,y1:100,xt:[0,3,6,9,12,15,18,21,24],yt:[0,20,50,80,100],xl:'時刻',yl:'電量 SOC（%）',pl:72,pt:70,pb:60,gx:8,gy:5});
  const h=24*seg(u,.04,.78);
  alphaDo(seg(u,.02,.1),()=>{box(c.px,c.Y(80),c.pw,c.Y(20)-c.Y(80),'rgba(125,255,196,.07)');wt(c.px+c.pw-10,c.Y(20)-10,'日常保留範圍 20–80%（典型範例）',15,'rgba(125,255,196,.9)',600,'right');});
  alphaDo(seg(u,.26,.32),()=>{box(c.X(9),c.py,c.X(15)-c.X(9),c.ph,'rgba(242,194,48,.12)');wt(c.X(12),c.py+22,'充電：太陽光電多、電價低',16,'#f2c230',700,'center');});
  alphaDo(seg(u,.52,.58),()=>{box(c.X(17),c.py,c.X(22)-c.X(17),c.ph,'rgba(232,87,42,.14)');wt(c.X(19.5),c.py+22,'放電：尖峰電價高',16,'#ff9d7a',700,'center');});
  alphaDo(seg(u,.1,.18),()=>{box(c.X(0),c.Y(56),c.X(6)-c.X(0),c.Y(44)-c.Y(56),'rgba(125,200,220,.25)');wt(c.X(3),c.Y(56)-10,'預留調頻空間',15,'#7dc8dc',700,'center');});
  curveP(c,h2=>priceDay(h2)*180-20,0,24*seg(u,.1,.5),.1,'#b37cff',2.5,[8,6]);
  curveP(c,socDay,0,h,.05,'#7dffc4',4);
  if(h>0){circ(c.X(h),c.Y(socDay(h)),8,'#fff','#13232e',2);wt(c.X(Math.min(h,22))+(h>20?-14:14),c.Y(socDay(h))-(h>20?-30:12),trf('{p}%',{p:Math.round(socDay(h))}),20,'#fff',700,h>20?'right':'left',COND);}
  alphaDo(seg(u,.14,.2),()=>wt(c.X(1),c.Y(97),'虛線：電價走勢（示意）',16,'#b37cff',700));
  const K=[['先預留，再移轉',['調頻備轉的空間優先，','剩下的才做電能移轉'],'#7dc8dc',.1],['低買高賣',['中午充、傍晚放，','吃進價差'],'#f2c230',.3],['別放到見底',['保留緩衝，','延長循環壽命'],'#7dffc4',.58],['價差要扣耗損',['每次循環都有成本','與效率損失'],'#ff9d7a',.8]];
  K.forEach(([hh,s,col,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=160+i*160;card(1060,y,480,140,{bg:'rgba(7,27,39,.75)'});box(1060,y,6,140,col);wt(1086,y+46,hh,21,col,700);wt(1086,y+84,s[0],16,'rgba(227,236,238,.9)',500);wt(1086,y+112,s[1],16,'rgba(227,236,238,.9)',500);}));
 }},

{t:'收益從哪裡來，風險在哪裡',en:'Where the revenue comes from, and the risks',dur:13,side:true,
 d:'一座儲能電廠的收入通常由幾部分疊加：調頻與備轉的容量費、依實際表現計算的績效，以及電能移轉的價差。能量管理系統每天依市場得標結果排出充放電計畫，再由變流器執行。風險同樣不能忽略：申請合格的儲能愈來愈多，容量供過於求時價格會下滑；設備可用率或反應速度不達標會被扣款；頻繁充放電也會加速電池老化。因此，業者要同時考慮市場、設備與壽命，才能算出真正的收益（示例）。',
 s:[[0,'能量管理系統依得標結果，排出一天的計畫'],[.3,'收入來自容量費、績效與電能移轉價差'],[.55,'風險一：合格容量變多，價格下滑'],[.78,'風險二：未達標扣款，電池也會老化']],
 cam:u=>({x:820,y:450,s:1}),
 draw(u){
  siteDraw();
  const P=sitePath();flowDots(P,12,'#7dffc4',band(u,.15,.5),-1,.4);flowDots(P,12,'#f2c230',band(u,.4,.9),1,.3);
  const L=[['市場飽和',['合格容量增加，','價格下滑'],'#ff9d7a',.5],['未達標扣款',['可用率、反應','速度不足'],'#e8572a',.7],['電池耗損',['循環愈多，','壽命愈短'],'#b37cff',.78]];
  L.forEach(([h,s,col,t0],i)=>{const a=seg(u,t0,t0+.07),x=440+i*258;alphaDo(a,()=>{card(x,170,240,110,{bg:'rgba(7,27,39,.85)',st:col});box(x,170,6,110,col);wt(x+20,206,h,20,col,700);wt(x+20,238,s[0],15,'rgba(227,236,238,.9)',500);wt(x+20,262,s[1],15,'rgba(227,236,238,.9)',500);});});
  lab(BX[1]+CW20/2,gyy(BX[1])-CH20,'能量管理系統（EMS）排程',{dx:0,dy:-60,st:'s',a:band(u,.03,.35)});
  lab(PYX,gyy(PYX)-200,'電力交易平台',{dx:-50,dy:40,st:'l',a:band(u,.3,.6)});
 },
 hud(u){hudPanel(300,200,'一天的收入組成（示例）',seg(u,.05,.1),w=>{
  const R=[['調頻容量費',.55,'#7dffc4',.12],['績效費',.18,'#7dc8dc',.22],['電能移轉價差',.27,'#f2c230',.32]];
  R.forEach(([n,v,col,t0],i)=>{const a=seg(u,t0,t0+.15),y=52+i*40;htext(16,y,n,15,'#fff',700);hbar(16,y+8,w-32,v*a,col);htext(w-14,y,Math.round(v*100*a)+'%',15,col,700,COND,'right');});
  htext(16,184,'比例為示例，非實際案場',13,'rgba(227,236,238,.6)',500);});}}
]};
