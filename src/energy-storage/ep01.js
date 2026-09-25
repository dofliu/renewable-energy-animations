// KITS: land
/* 儲能系列 第 1 集：貨櫃式電池儲能系統 */
const CW20=220,CH20=104;                                  // 20 呎貨櫃側視尺寸（世界座標）
const BX=[250,500,750];                                   // 場景中三座電池貨櫃左緣
const PCSX=1010,TRX=1150,PYX=1420;                        // PCS 櫃、升壓變壓器、電塔
const gyy=x=>groundY(x);
const SUN={x:420,y:130};
/* 20 呎電池貨櫃：外殼、肋條、端部空調機組；open 0–1 表示側牆透明程度 */
function battContainer(x,y,open){
  open=open||0;const w=CW20,h=CH20;
  box(x,y-h,w,h,'#1a2c38');
  if(open>0)alphaDo(open,()=>containerInside(x,y));
  alphaDo(1-open*.85,()=>{box(x,y-h,w,h,'#e3e8ec');ctx.strokeStyle='rgba(0,0,0,.14)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<22;i++){const xx=x+w*i/22;ctx.moveTo(xx,y-h+4);ctx.lineTo(xx,y-4);}ctx.stroke();
   box(x+w-44,y-h+14,34,34,'#c5ced4','rgba(0,0,0,.25)',1);ring(x+w-27,y-h+31,12,'rgba(0,0,0,.35)',2);
   box(x+14,y-h+20,40,10,'#2d8f5a');});
  ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.5;ctx.strokeRect(x,y-h,w,h);
  box(x-4,y-h-4,w+8,5,'#aeb8be');box(x+6,y,18,6,'#6a747a');box(x+w-24,y,18,6,'#6a747a');
}
/* 貨櫃內部：6 個電池簇＋液冷管路（示意） */
function containerInside(x,y){
  const h=CH20;box(x+2,y-h+2,CW20-4,h-4,'#13232e');
  for(let i=0;i<6;i++){const rx=x+10+i*28;box(rx,y-h+14,22,h-22,'#2a4a66','rgba(255,255,255,.3)',1);
   for(let m=0;m<4;m++)box(rx+3,y-h+18+m*19,16,15,'#3f6f96');box(rx+3,y-h+94-8,16,4,'#f2c230');}
  box(x+CW20-40,y-h+10,34,h-16,'#44535c','rgba(255,255,255,.3)',1);
}
function pcsSkid(x,y){box(x,y-90,110,90,'#dfe5e8','rgba(0,0,0,.3)',1);for(let i=0;i<3;i++)box(x+10+i*34,y-80,26,50,'#c9d1d6','rgba(0,0,0,.2)',1);
  for(let i=0;i<3;i++)ring(x+23+i*34,y-18,7,'rgba(0,0,0,.35)',2);}
function transformer(x,y){box(x,y-80,90,80,'#8d989f');for(let i=0;i<5;i++)box(x-10,y-72+i*14,10,8,'#6f7a80');for(let i=0;i<5;i++)box(x+90,y-72+i*14,10,8,'#6f7a80');
  for(let i=0;i<3;i++){box(x+18+i*24,y-110,8,30,'#c9a38c');for(let k=0;k<4;k++)box(x+14+i*24,y-106+k*7,16,3,'#b58b73');}}
function pylon(x,y){ctx.strokeStyle='#5c6770';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-34,y);ctx.lineTo(x-6,y-230);ctx.lineTo(x+6,y-230);ctx.lineTo(x+34,y);
  for(let k=0;k<6;k++){const t=k/6,t2=(k+1)/6;ctx.moveTo(lerp(x-34,x-6,t),lerp(y,y-230,t));ctx.lineTo(lerp(x+34,x+6,t2),lerp(y,y-230,t2));ctx.moveTo(lerp(x+34,x+6,t),lerp(y,y-230,t));ctx.lineTo(lerp(x-34,x-6,t2),lerp(y,y-230,t2));}
  ctx.moveTo(x-60,y-200);ctx.lineTo(x+60,y-200);ctx.moveTo(x-46,y-170);ctx.lineTo(x+46,y-170);ctx.stroke();}
/* 沿折線 P（[[x,y],…]）取比例 f 的點 */
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
/* 沿路徑流動的電力點：dir=1 順向、-1 逆向 */
function flowDots(P,n,col,a,dir,sp){if(a<=0)return;for(let k=0;k<n;k++){let f=((TT*(sp||.3))+k/n)%1;if(dir<0)f=1-f;const p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],4.5,col));}}
/* 場景的電力路徑：貨櫃 → PCS → 變壓器 → 電塔 */
function sitePath(){const yb=gyy(PCSX)-40;return [[BX[0]+CW20/2,gyy(BX[0])-CH20-10],[BX[0]+CW20/2,gyy(BX[0])-CH20-22],[PCSX+55,gyy(PCSX)-CH20-22],[PCSX+55,yb-50],[TRX+45,yb-50],[TRX+45,gyy(TRX)-112],[PYX,gyy(PYX)-200]];}
function siteDraw(){
  fence(200,1500,gyy(800)+4);
  BX.forEach(x=>battContainer(x,gyy(x+CW20/2),0));
  pcsSkid(PCSX,gyy(PCSX));transformer(TRX,gyy(TRX));pylon(PYX,gyy(PYX));
  ln([PYX,gyy(PYX)-200,1700,gyy(PYX)-215],'#394650',2);
  ctx.setLineDash([8,6]);ln([BX[0]+CW20/2,gyy(BX[0])-CH20-22,PCSX+55,gyy(PCSX)-CH20-22],'rgba(40,50,58,.55)',2.5);ctx.setLineDash([]);
  for(const x of BX)ln([x+CW20/2,gyy(x)-CH20-4,x+CW20/2,gyy(x)-CH20-22],'rgba(40,50,58,.55)',2.5);
  ln([PCSX+55,gyy(PCSX)-CH20-22,PCSX+55,gyy(PCSX)-90],'rgba(40,50,58,.55)',2.5);
  ln([PCSX+110,gyy(PCSX)-60,TRX,gyy(TRX)-60],'rgba(40,50,58,.55)',2.5);
  ln([TRX+45,gyy(TRX)-110,PYX,gyy(PYX)-200],'#394650',2);
}
/* 稜柱形電池芯 */
function prism(x,y,w,h,col){box(x,y,w,h,col||'#3f6f96','rgba(255,255,255,.55)',1.5);box(x+w*.18,y-h*.06,w*.18,h*.06,'#c9d1d6');box(x+w*.64,y-h*.06,w*.18,h*.06,'#e8572a');}
/* dReg0.25 運轉曲線：頻率 → 輸出（+ 放電、- 充電，比例） */
const dreg=f=>{const d=60-f;if(Math.abs(d)<=.015)return 0;return clamp((Math.abs(d)-.015)/(.25-.015))*Math.sign(d);};
/* 調頻示意：發電機跳機後的頻率（有儲能／沒有儲能） */
const fNo=t=>t<2?60:60-.28*(1-Math.exp(-(t-2)/1.6))+.12*(1-Math.exp(-(t-2)/9));
const fBs=t=>t<2?60:60-.17*(1-Math.exp(-(t-2)/1.1))+.1*(1-Math.exp(-(t-2)/7));

const EP={no:1,slug:'energy-storage',seriesName:'儲能系列',t:'貨櫃式電池儲能系統',en:'Containerized battery energy storage',
lede:'太陽下山之後，白天多出來的電可以留到晚上用嗎？這一集打開一座貨櫃式電池儲能系統，從一顆電池芯一路組成 5 MWh 的貨櫃，看 BMS、PCS、EMS 如何分工，貨櫃怎麼散熱與防火，以及儲能如何在一秒內幫台灣電網穩住 60 Hz。',
facts:[['3.2','V','磷酸鋰鐵（LFP）電池芯的標稱電壓；常見 314 Ah 電芯約可存 1 度電'],
['416','串','一個電池簇串聯的電池芯數，直流電壓約 1,331 V（示例配置）'],
['約 5','MWh','一個 20 呎液冷電池貨櫃的典型容量，約 5,000 度電（示例）'],
['1','秒','台電調頻備轉（dReg）要求的反應時間：偵測到頻率偏移後 1 秒內動作'],
['1,500','MW','經濟部規劃 2025 年底的儲能設置目標，包含光儲與台電自建'],
['約 85–90','%','電池儲能系統常見的交流端往返效率（示例）']],
note:'說明：本集為教育用途示意動畫，貨櫃、電池與設備比例經過調整。電池配置以 20 呎液冷貨櫃常見的 314 Ah 磷酸鋰鐵電芯、104 串模組、416 串電池簇、12 簇約 5 MWh 為典型範例；調頻曲線依台電調頻備轉 dReg0.25 的運轉曲線概念繪製（死區 ±0.015 Hz、偏移 0.25 Hz 時滿載），頻率事件為示意情境；消防項目參考內政部「提升儲能系統消防安全管理指引」與國際常用的 UL 9540A、NFPA 855。實際數值依各案場設計與台電規範而定。',
base:()=>{landSky(GY,{sun:SUN,clouds:false});drawGround();},
shots:[
{t:'一座儲能案場',en:'A battery storage site',dur:12,side:true,
 d:'電池儲能系統像一座可以充放電的電廠。常見的做法是把電池裝進 20 呎貨櫃，一排排放在圍籬內，旁邊是變流器（PCS）與升壓變壓器，再接上台電的電網。電多的時候，例如白天太陽光電大量發電，貨櫃從電網充電；傍晚用電尖峰或電網需要支援時，再把電送回去。它不燃燒燃料，也不需要水源，從收到指令到滿載輸出只要幾分之一秒。',
 s:[[0,'圍籬內一排排的貨櫃，裝的都是電池'],[.25,'變流器與升壓變壓器把貨櫃接上電網'],[.5,'電多的時候，貨櫃從電網充電'],[.75,'電網需要時，再把電送回去']],
 cam:u=>camMix({x:840,y:440,s:1},{x:820,y:470,s:1.12},ease(seg(u,.1,.5))),
 draw(u){
  siteDraw();const P=sitePath();
  flowDots(P,12,'#7dffc4',band(u,.45,.7),-1,.35);
  flowDots(P,12,'#f2c230',seg(u,.72,.78),1,.35);
  lab(BX[1]+CW20/2,gyy(BX[1])-CH20,'電池貨櫃',{dx:-30,dy:-80,st:'s',a:band(u,.04,.45)});
  lab(PCSX+55,gyy(PCSX)-90,'變流器（PCS）',{dx:-20,dy:-120,a:band(u,.25,.7)});
  lab(TRX+45,gyy(TRX)-80,'升壓變壓器',{dx:40,dy:60,a:band(u,.25,.7)});
  lab(PYX,gyy(PYX)-200,'台電電網',{dx:-40,dy:-40,st:'l',a:band(u,.3,1)});
  lab(BX[2]+60,gyy(BX[2])-CH20-22,'充電',{dx:0,dy:-50,st:'g',a:band(u,.5,.7)});
  lab(BX[2]+60,gyy(BX[2])-CH20-22,'放電',{dx:0,dy:-50,st:'s',a:band(u,.76,1)});
 },
 hud(u){hudPanel(240,150,'儲能案場（示例）',seg(u,.05,.1),w=>{const c=seg(u,.48,.7),d=seg(u,.76,.98);const p=u<.72?-10*seg(u,.45,.52):10*seg(u,.74,.8);const soc=40+45*c-20*d;
  hrow(56,'功率',(p>0?'+':'')+p.toFixed(1)+' MW',w,p<0?'#7dffc4':'#f2c230');hrow(88,'狀態',p<-.1?'充電':p>.1?'放電':'待機',w,'#fff');hrow(120,'電量（SOC）',Math.round(soc)+'%',w,'#7dffc4');hbar(14,132,w-28,soc/100,'#7dffc4');});}},

{t:'從電池芯到貨櫃',en:'From a cell to a container',dur:14,
 d:'儲能貨櫃裡最小的單位是電池芯。常見的磷酸鋰鐵（LFP）電芯標稱 3.2 伏特、314 安培小時，約可存 1 度電。104 顆串聯成一個電池模組，約 333 伏特；4 個模組再疊成一個電池簇，416 顆串聯，直流電壓約 1,331 伏特。一個 20 呎貨櫃放 12 個電池簇，總共約 5,000 顆電芯，容量約 5 MWh，大約是 500 戶家庭一天的用電量（示例）。',
 s:[[0,'最小單位：一顆 3.2 V 的磷酸鋰鐵電池芯'],[.25,'104 顆串聯，組成一個電池模組'],[.48,'4 個模組疊成電池簇，電壓約 1,331 V'],[.7,'12 個電池簇裝進貨櫃，約 5 MWh']],
 draw(u){
  diagBG();
  const C=[[60,'電池芯',.02],[440,'電池模組',.22],[820,'電池簇',.45],[1200,'電池貨櫃',.68]];
  C.forEach(([x,n,t0],i)=>{const a=seg(u,t0,t0+.06);alphaDo(.25+.75*a,()=>{card(x,170,340,440,{bg:'rgba(7,27,39,.75)',st:a>.5?'rgba(242,194,48,.6)':undefined});wt(x+24,210,n,22,a>.5?'#f2c230':'rgba(227,236,238,.7)',700);});
   if(i<3)alphaDo(a,()=>arrow(x+346,390,x+374,390,'#f2c230',3));});
  /* 電池芯 */
  alphaDo(seg(u,.02,.08),()=>{prism(160,270,140,190,'#3f6f96');wt(230,380,'LFP',22,'#fff',700,'center',COND);
   wt(84,510,'3.2 V · 314 Ah',24,'#fff',700,'left',COND);wt(84,548,'約 1 kWh',22,'#7dffc4',700,'left',COND);wt(84,584,'磷酸鋰鐵電池芯',17,'rgba(227,236,238,.85)',500);});
  /* 模組：13×8 顆 */
  const m=seg(u,.22,.3),mn=Math.floor(104*seg(u,.24,.4));
  alphaDo(m,()=>{box(474,260,272,200,'#0b1e2c','#c9d1d6',2);for(let i=0;i<104;i++){const c=i%13,r=Math.floor(i/13);box(484+c*20,270+r*23,16,19,i<mn?'#3f6f96':'#1a3350');}
   wt(464,510,'104 串 · 約 333 V',24,'#fff',700,'left',COND);wt(464,548,'約 104 kWh',22,'#7dffc4',700,'left',COND);wt(464,584,'電芯串聯，裝進鋁殼',17,'rgba(227,236,238,.85)',500);});
  /* 電池簇：4 模組＋控制盒 */
  const r=seg(u,.45,.52),rn=Math.floor(4*seg(u,.47,.6)+.001);
  alphaDo(r,()=>{box(930,240,120,230,'#1c3144','#c9d1d6',2);for(let k=0;k<4;k++)box(940,250+k*46,100,38,k<rn?'#3f6f96':'#1a3350','rgba(255,255,255,.4)',1);box(940,436,100,26,'#44535c');wt(990,454,'BMS',15,'#f2c230',700,'center',COND);
   wt(844,510,'416 串 · 約 1,331 V',24,'#fff',700,'left',COND);wt(844,548,'約 418 kWh',22,'#7dffc4',700,'left',COND);wt(844,584,'4 個模組＋控制盒',17,'rgba(227,236,238,.85)',500);});
  /* 貨櫃：12 簇 */
  const k=seg(u,.68,.74),kn=Math.floor(12*seg(u,.7,.84)+.001);
  alphaDo(k,()=>{box(1230,270,280,180,'#13232e','#c9d1d6',2);for(let i=0;i<12;i++){const c=i%6,rr=Math.floor(i/6);box(1242+c*38,282+rr*82,30,74,i<kn?'#3f6f96':'#1a3350','rgba(255,255,255,.35)',1);}
   wt(1224,510,'12 簇 · 約 5 MWh',24,'#fff',700,'left',COND);wt(1224,548,'20 呎貨櫃',22,'#7dffc4',700,'left',COND);wt(1224,584,'液冷、消防、配電一體',17,'rgba(227,236,238,.85)',500);});
  /* 底部累計 */
  const n=u<.22?1:u<.45?Math.max(1,mn):u<.68?104*Math.max(1,rn):416*Math.max(1,kn);
  alphaDo(seg(u,.04,.1),()=>{card(60,650,1480,120,{bg:'rgba(31,127,92,.25)',st:'rgba(125,255,196,.45)'});
   wt(100,722,trf('電池芯 {n} 顆',{n:n.toLocaleString('en-US')}),30,'#fff',700);
   wt(1500,722,trf('約 {e} kWh',{e:Math.round(n*1.0048).toLocaleString('en-US')}),36,'#7dffc4',700,'right',COND);
   wt(780,722,'3.2 V × 314 Ah ≈ 1 kWh / 顆',22,'rgba(227,236,238,.85)',600,'center',COND);});
 }},

{t:'三個大腦：BMS、PCS、EMS',en:'Three controllers: BMS, PCS and EMS',dur:14,
 d:'電池只會儲存直流電，要靠三套系統分工才能變成電廠。電池管理系統（BMS）監測每一顆電芯的電壓與溫度，估算剩餘電量（SOC），異常時切斷電路。變流器（PCS）負責直流與交流的雙向轉換，決定充放電的功率，再經升壓變壓器接到 22.8 kV 或 161 kV 的電網。能源管理系統（EMS）是總指揮，依排程、市場得標結果與台電調度訊號，下指令給 PCS。',
 s:[[0,'電池簇輸出直流電，約 1,331 V'],[.25,'PCS：直流與交流雙向轉換，決定功率'],[.45,'升壓變壓器把電送上 22.8 kV 或 161 kV 電網'],[.65,'BMS 看好每一顆電芯；EMS 依調度訊號下指令']],
 draw(u){
  diagBG();
  const Y=420,a1=seg(u,.02,.08),a2=seg(u,.24,.3),a3=seg(u,.44,.5),a4=seg(u,.64,.7);
  /* 主電力路徑 */
  alphaDo(a1,()=>{card(60,330,280,180,{bg:'rgba(7,27,39,.75)'});for(let k=0;k<4;k++)box(90+k*62,356,50,120,'#3f6f96','rgba(255,255,255,.4)',1);wt(200,498,'電池簇',18,'#fff',700,'center');});
  alphaDo(a2,()=>{card(520,330,260,180,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.6)'});wt(650,390,'PCS',34,'#f2c230',700,'center',COND);wt(650,428,'變流器',18,'#fff',700,'center');
   ctx.strokeStyle='#fff';ctx.lineWidth=2.5;ctx.beginPath();ln([590,466,620,466],'#fff',2.5);ctx.moveTo(670,466);for(let i=0;i<=30;i++){const x=670+i,y=466-8*Math.sin(i/30*TAU);ctx.lineTo(x,y);}ctx.stroke();wt(650,472,'⇄',18,'#fff',700,'center');});
  alphaDo(a3,()=>{card(960,330,220,180,{bg:'rgba(7,27,39,.75)'});ring(1045,410,34,'#c9d1d6',4);ring(1095,410,34,'#c9d1d6',4);wt(1070,490,'升壓變壓器',18,'#fff',700,'center');
   card(1320,330,220,180,{bg:'rgba(7,27,39,.75)'});pylonMini(1430,480);wt(1430,498,'台電電網',18,'#fff',700,'center');});
  const dc=[[340,Y],[520,Y]],ac=[[780,Y],[960,Y]],hv=[[1180,Y],[1320,Y]];
  alphaDo(a1,()=>{ln([340,Y,520,Y],'#ff9d7a',4);wt(430,Y-16,'直流 1,331 V',16,'#ff9d7a',700,'center',COND);});
  alphaDo(a2,()=>{ln([780,Y,960,Y],'#7dc8dc',4);wt(870,Y-16,'交流',16,'#7dc8dc',700,'center');});
  alphaDo(a3,()=>{ln([1180,Y,1320,Y],'#7dc8dc',5);wt(1250,Y-16,'22.8 / 161 kV',16,'#7dc8dc',700,'center',COND);});
  const fl=seg(u,.3,.36);flowDots(dc,4,'#ff9d7a',a1*fl,1,.5);flowDots(ac,4,'#7dc8dc',a2*fl,1,.5);flowDots(hv,3,'#7dc8dc',a3*seg(u,.5,.56),1,.5);
  /* EMS 與調度訊號 */
  alphaDo(a4,()=>{card(520,170,660,90,{bg:'rgba(125,255,196,.12)',st:'rgba(125,255,196,.55)'});wt(550,210,'EMS 能源管理系統',20,'#7dffc4',700);wt(550,242,'排程 · 市場得標 · 調度訊號 → 功率指令',17,'#fff',500);
   tag(1540,215,'台電調度',{size:17,bg:'#dfe5e8',align:'right'});
   ctx.setLineDash([6,6]);arrow(1400,215,1190,215,'#7dffc4',2.5);arrow(650,262,650,326,'#7dffc4',2.5);arrow(200,326,200,262,'rgba(242,194,48,.9)',2.5);ctx.setLineDash([]);
   card(60,170,280,90,{bg:'rgba(242,194,48,.12)',st:'rgba(242,194,48,.55)'});wt(84,210,'BMS 電池管理',20,'#f2c230',700);wt(84,242,'電壓 · 溫度 · SOC',17,'#fff',500);
   ctx.setLineDash([6,6]);arrow(342,215,516,215,'rgba(242,194,48,.9)',2.5);ctx.setLineDash([]);});
  /* 下方：職責卡 */
  const R=[[60,'BMS','監測每顆電芯的電壓與溫度','估算 SOC，異常時切斷電路','#f2c230',a1],[560,'PCS','直流 ⇄ 交流雙向轉換','決定充電或放電的功率','#f2c230',a2],[1060,'EMS','整座案場的總指揮','依排程與調度訊號下指令','#7dffc4',a4]];
  R.forEach(([x,n,l1,l2,c,a])=>alphaDo(a*seg(u,.08,.14),()=>{card(x,580,480,200,{bg:'rgba(7,27,39,.75)'});wt(x+26,630,n,30,c,700,'left',COND);wt(x+26,680,l1,18,'#fff',600);wt(x+26,718,l2,18,'rgba(227,236,238,.85)',500);}));
 }},

{t:'貨櫃裡的溫度控制',en:'Keeping the batteries cool',dur:12,side:true,
 d:'電池充放電會發熱，溫度太高會加速老化，太低則效率變差。磷酸鋰鐵電池最舒服的工作溫度大約在 20 至 30°C。新一代貨櫃多採液冷：冷卻液在每個電池模組下方的液冷板裡流動，把熱帶到貨櫃端部的冷水機組排出。液冷的好處是溫度均勻，同一個貨櫃裡最熱與最冷的電芯常可控制在幾度之內，讓每顆電芯老化速度接近，延長整體壽命。台灣夏季高溫潮濕，貨櫃也要做好防水與防鹽霧。',
 s:[[0,'打開貨櫃：裡面是一排排電池簇'],[.3,'冷卻液流經每個模組下方的液冷板'],[.55,'熱量被帶到端部的冷水機組排出'],[.75,'電芯溫度維持在約 25°C，溫差只有幾度']],
 cam:u=>camMix({x:840,y:450,s:1},{x:BX[1]+CW20/2+30,y:gyy(BX[1]+CW20/2)-CH20/2-10,s:3},ease(seg(u,.02,.25))),
 draw(u){
  const op=ease(seg(u,.12,.3)),x0=BX[1],y0=gyy(x0+CW20/2);
  fence(200,1500,gyy(800)+4);battContainer(BX[0],gyy(BX[0]+CW20/2),0);battContainer(BX[2],gyy(BX[2]+CW20/2),0);pcsSkid(PCSX,gyy(PCSX));
  battContainer(x0,y0,op);
  const cl=seg(u,.3,.38);
  if(cl>0)alphaDo(cl*op,()=>{const yc=y0-10,yh=y0-CH20+8;ln([x0+10,yc,x0+CW20-40,yc],'#58b8d0',3);ln([x0+10,yh,x0+CW20-40,yh],'#ff8a60',3);
   for(let i=0;i<6;i++){const rx=x0+21+i*28;ln([rx,yc,rx,yh],'rgba(125,200,220,.5)',1.5);}
   for(let k=0;k<10;k++){const f=(TT*.25+k/10)%1;circ(lerp(x0+CW20-40,x0+10,f),yc,2.4,'#b9ecff');circ(lerp(x0+10,x0+CW20-40,f),yh,2.4,'#ffd0bd');}});
  const ex=seg(u,.55,.62);
  if(ex>0)for(let q=0;q<3;q++){const p=(TT*.6+q/3)%1,xx=x0+CW20+4+p*30,yy=y0-CH20+30+q*14;alphaDo(ex*(1-p),()=>ln([xx,yy,xx+6,yy-5,xx+12,yy,xx+18,yy-5],'#ff8a60',2));}
  lab(x0+24,y0-60,'電池簇',{dx:-70,dy:-60,st:'n',a:band(u,.2,.5)});
  lab(x0+80,y0-10,'液冷板與冷卻液（冷）',{dx:-40,dy:70,st:'g',a:band(u,.32,.75)});
  lab(x0+120,y0-CH20+8,'冷卻液回流（熱）',{dx:30,dy:-70,st:'w',a:band(u,.36,.75)});
  lab(x0+CW20-22,y0-50,'冷水機組',{dx:80,dy:-40,st:'s',a:band(u,.52,1)});
 },
 hud(u){hudPanel(240,150,'電芯溫度（示例）',seg(u,.05,.1),w=>{const k=ease(seg(u,.3,.8));const tmax=lerp(34,27.5,k),tmin=lerp(24,24.5,k);
  hrow(56,'最高',tmax.toFixed(1)+'°C',w,tmax>30?'#ff8a60':'#7dffc4');hrow(88,'最低',tmin.toFixed(1)+'°C',w,'#7dc8dc');hrow(120,'溫差',(tmax-tmin).toFixed(1)+'°C',w,tmax-tmin>5?'#ff8a60':'#7dffc4');});}},

{t:'熱失控與多層防護',en:'Thermal runaway and layered protection',dur:13,
 d:'電池最需要防範的是熱失控：過充、撞擊或內部短路，讓一顆電芯溫度急升，釋放可燃氣體，熱量再傳給旁邊的電芯，一顆接一顆擴大。磷酸鋰鐵的熱穩定性比三元鋰電池好，但仍要多層防護：BMS 先發現電壓或溫度異常並切斷；氣體偵測器早期警報；滅火抑制系統啟動；洩爆設計把壓力導向安全方向；貨櫃之間保留間距與消防通道。台灣依內政部「提升儲能系統消防安全管理指引」要求風險評估與應變計畫。',
 s:[[0,'一顆電芯過熱，釋放可燃氣體'],[.28,'熱量傳給相鄰電芯，可能一顆接一顆擴大'],[.5,'第一道防線：BMS 偵測異常並切斷電路'],[.7,'氣體偵測、滅火、洩爆、間距，層層把關']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'熱失控如何擴大（示意）',20,'#e8572a',700);
  const sp=seg(u,.28,.48),stop=seg(u,.5,.6);
  const heatC=h=>h<.5?`rgb(${lerp(63,232,h*2)|0},${lerp(111,160,h*2)|0},${lerp(150,60,h*2)|0})`:`rgb(232,${lerp(160,70,(h-.5)*2)|0},${lerp(60,42,(h-.5)*2)|0})`;
  for(let i=0;i<5;i++){const x=100+i*128,d=Math.abs(i-2);let h=i===2?seg(u,.04,.24):clamp(sp*2.2-(d-1)*1.1);h*=1-stop*.9*(i===2?.3:1);
   prism(x,340,100,220,heatC(clamp(h)));
   if(i===2)wt(x+50,600,'過熱電芯',17,'#ff9d7a',700,'center');}
  const g=seg(u,.12,.3);if(g>0)for(let q=0;q<6;q++){const p=(TT*.5+q/6)%1;alphaDo(g*(1-p)*(1-stop),()=>circ(406+18*Math.sin(p*9+q),326-p*90,6+p*10,'rgba(200,200,200,.5)'));}
  alphaDo(g*(1-stop),()=>wt(460,262,'可燃氣體',17,'rgba(227,236,238,.9)',600));
  if(sp>0)alphaDo(sp*(1-stop),()=>{arrow(390,450,310,450,'#e8572a',3);arrow(426,450,506,450,'#e8572a',3);});
  alphaDo(seg(u,.3,.36),()=>{wt(410,672,'熱量往相鄰電芯傳遞',18,'#ff9d7a',700,'center');wt(410,706,'電芯間的隔熱材料可延緩擴散',17,'rgba(227,236,238,.85)',500,'center');});
  alphaDo(stop,()=>tag(410,760,'切斷電路，擴散被擋下',{size:18,bg:'#7dffc4',align:'center'}));
  /* 右：防護層 */
  card(820,160,720,640,{bg:'rgba(7,27,39,.75)'});wt(844,200,'多層防護',20,'#f2c230',700);
  const L=[['1','BMS 預警','電壓、溫度異常即切斷'],['2','氣體偵測','一氧化碳、氫氣早期警報'],['3','滅火抑制','自動啟動滅火或冷卻系統'],['4','洩爆設計','壓力導向安全方向'],['5','間距與通道','避免延燒到相鄰貨櫃']];
  L.forEach(([n,t,s],i)=>{const a=seg(u,.5+i*.07,.56+i*.07);if(a<=0)return;alphaDo(a,()=>{const y=236+i*104;card(850,y,660,88,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});
   circ(894,y+44,24,'#7dffc4');wt(894,y+45,n,24,'#0e2a3b',700,'center',COND,'middle');wt(936,y+38,t,20,'#fff',700);wt(936,y+70,s,17,'rgba(227,236,238,.85)',500);});});
 }},

{t:'一秒內穩住 60 Hz',en:'Holding 60 Hz within a second',dur:14,
 d:'台灣電網的頻率是 60 Hz。一部大型機組突然跳脫，發電少於用電，頻率就會往下掉。電池儲能的強項是反應快：參與台電調頻備轉（dReg）的儲能，每秒量測頻率，依運轉曲線自動充放電。以 dReg0.25 為例，頻率在 60 Hz 上下 0.015 Hz 內不動作；頻率越低放電越多，低到 59.75 Hz 時滿載放電，頻率偏高時則改為充電。反應時間要求在 1 秒以內，比傳統機組快得多。',
 s:[[0,'運轉曲線：頻率越低，放電越多'],[.3,'一部機組跳脫，頻率開始下降'],[.5,'儲能 1 秒內放電支援'],[.72,'有儲能時，頻率下降較少、恢復較快']],
 draw(u){
  diagBG();
  const A=chartBox(60,160,620,640,{title:'dReg0.25 運轉曲線',x0:59.7,x1:60.3,y0:-110,y1:110,xt:[59.75,60,60.25],yt:[-100,0,100],xl:'頻率（Hz）',yl:'輸出（%）',pt:70,pb:60,gx:6,gy:4});
  const f1=seg(u,.02,.25);
  if(f1>0){ctx.beginPath();for(let i=0;i<=120*f1;i++){const f=59.7+.6*i/120,x=A.X(f),y=A.Y(100*dreg(f));i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#f2c230';ctx.lineWidth=3.5;ctx.stroke();}
  alphaDo(seg(u,.1,.2),()=>{wt(A.X(59.72),A.Y(100)+32,'放電',18,'#f2c230',700);wt(A.X(60.28),A.Y(-100)-16,'充電',18,'#7dffc4',700,'right');
   box(A.X(59.985),A.Y(20),A.X(60.015)-A.X(59.985),A.Y(-20)-A.Y(20),'rgba(255,255,255,.18)');ln([A.X(59.8),A.Y(-38),A.X(59.985),A.Y(-12)],'rgba(255,255,255,.4)',1.2);wt(A.X(59.72),A.Y(-45),'死區 ±0.015 Hz',15,'rgba(227,236,238,.9)',600);});
  /* 右：頻率事件 */
  const B=chartBox(720,160,820,300,{title:'機組跳脫後的頻率（示意）',x0:0,x1:30,y0:59.7,y1:60.05,xt:[0,10,20,30],yt:[59.8,59.9,60],xl:'秒',pt:56,pb:44,pl:72,gx:3,gy:3});
  const C=chartBox(720,490,820,310,{title:'儲能輸出',x0:0,x1:30,y0:0,y1:100,xt:[0,10,20,30],yt:[0,50,100],xl:'秒',yl:'%',pt:56,pb:44,pl:72,gx:3,gy:2});
  const tE=30*seg(u,.28,.95),showB=seg(u,.5,.56);
  const curve=(ch,fn,T,col,lw,dash)=>{if(T<=0)return;ctx.beginPath();for(let t=0;t<=T;t+=.1){const x=ch.X(t),y=ch.Y(fn(t));t?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=lw;if(dash)ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);};
  curve(B,fNo,tE,'#ff8a60',3,[8,6]);
  if(showB>0)alphaDo(showB,()=>{curve(B,fBs,tE,'#7dffc4',3.5);curve(C,t=>t<2?0:100*dreg(fBs(t))*clamp((t-2)/.8),tE,'#f2c230',3.5);});
  alphaDo(seg(u,.32,.4),()=>{ctx.setLineDash([4,5]);ln([B.X(2),B.py,B.X(2),B.py+B.ph],'rgba(255,255,255,.5)',1.5);ctx.setLineDash([]);wt(B.X(2)+8,B.py+22,'機組跳脫',15,'#fff',600);});
  alphaDo(seg(u,.4,.46),()=>wt(B.px+B.pw-10,B.Y(59.74)+4,'沒有儲能',16,'#ff9d7a',700,'right'));
  alphaDo(seg(u,.72,.78),()=>wt(B.px+B.pw-10,B.Y(59.87)-8,'有儲能',16,'#7dffc4',700,'right'));
  alphaDo(seg(u,.56,.62),()=>tag(C.X(4),C.Y(80),'1 秒內動作',{size:17}));
  /* 左圖上的即時工作點 */
  if(tE>2&&showB>0){const f=fBs(tE);alphaDo(showB,()=>{circ(A.X(f),A.Y(100*dreg(f)),8,'#fff','#13232e',2);wt(A.X(f)+14,A.Y(100*dreg(f))+6,trf('{f} Hz',{f:f.toFixed(2)}),17,'#fff',700,'left',COND);});}
 }},

{t:'白天存電，傍晚送電',en:'Store at noon, deliver in the evening',dur:13,side:true,
 d:'台灣中午太陽光電發電最多，傍晚太陽下山、用電仍高，電網需要其他電源快速補上。儲能可以在中午充電、傍晚放電，把白天的綠電移到晚上用；台電的電能移轉複合動態調節備轉（E-dReg）就是結合這兩種任務的服務。經濟部規劃 2025 年底設置 1,500 MW 的儲能，包含與光電案場結合的光儲、台電自建，以及民間業者參與電力交易平台的儲能。',
 s:[[0,'中午太陽光電發電最多，儲能開始充電'],[.35,'電量逐漸充滿'],[.55,'傍晚太陽下山，用電仍然很高'],[.75,'儲能放電，把白天的綠電送到晚上']],
 base:u=>{const k=seg(u,.45,.7);landSky(GY,{sun:{x:lerp(700,1500,seg(u,0,.7)),y:lerp(130,560,ease(seg(u,.1,.7)))},dusk:k,clouds:false});drawGround();},
 cam:u=>({x:800,y:450,s:1}),
 draw(u){
  const k=seg(u,.45,.7);
  for(let i=0;i<4;i++)solarPanel(80+i*48,gyy(100+i*48),44,22,{h:34,glint:u<.4});
  siteDraw();
  const P=sitePath();
  const pv=[[270,gyy(270)-40],[BX[0]+30,gyy(BX[0])-40]];
  flowDots(pv,5,'#7dffc4',band(u,.05,.45),1,.5);
  flowDots(P,12,'#f2c230',seg(u,.7,.76),1,.35);
  alphaDo(k*.25,()=>box(VX0,VY0,VX1-VX0,VY1-VY0,'#0e1a2a'));
  /* 一天的電力曲線（示意） */
  const a=seg(u,.02,.08);
  alphaDo(a,()=>{const c=chartBox(520,150,700,260,{title:'一天的光電與儲能（示意）',x0:0,x1:24,y0:-100,y1:100,xt:[0,6,12,18,24],yt:[-100,0,100],xl:'時',pt:52,pb:40,pl:58,gx:4,gy:2});
   const now=lerp(10,20,seg(u,.02,.95));
   const pvC=h=>h<6||h>18?0:100*Math.sin(Math.PI*(h-6)/12);
   const bsC=h=>h>=10&&h<14?-60:h>=17&&h<21?70:0;
   ctx.beginPath();for(let h=0;h<=24;h+=.2){const x=c.X(h),y=c.Y(pvC(h));h?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='rgba(242,194,48,.8)';ctx.lineWidth=2.5;ctx.stroke();
   for(let h=0;h<now;h+=.25){const v=bsC(h);if(v)box(c.X(h),Math.min(c.Y(0),c.Y(v)),c.X(.25)-c.X(0)-1,Math.abs(c.Y(v)-c.Y(0)),v<0?'rgba(125,255,196,.7)':'rgba(255,157,122,.8)');}
   ln([c.X(now),c.py,c.X(now),c.py+c.ph],'#fff',1.5);
   wt(c.X(12),c.Y(-80)+6,'充電',15,'#7dffc4',700,'center');wt(c.X(19),c.Y(92)+4,'放電',15,'#ff9d7a',700,'center');wt(c.X(7.2),c.Y(70),'光電',15,'#f2c230',700,'center');});
  lab(160,gyy(160)-36,'太陽光電',{dx:0,dy:-70,st:'s',a:band(u,.06,.4)});
  lab(BX[1]+CW20/2,gyy(BX[1])-CH20,'充電中',{dx:0,dy:-50,st:'g',a:band(u,.12,.5)});
  lab(BX[1]+CW20/2,gyy(BX[1])-CH20,'放電中',{dx:0,dy:-50,st:'s',a:band(u,.72,1)});
  lab(PYX,gyy(PYX)-200,'傍晚用電尖峰',{dx:-60,dy:60,st:'w',a:band(u,.58,1)});
 },
 hud(u){hudPanel(240,150,'儲能狀態（示例）',seg(u,.05,.1),w=>{const h=lerp(10,20,seg(u,.02,.95)),c=seg(h,10,14),d=seg(h,17,20);const soc=15+75*c-65*d;
  hrow(56,'時間',trf('{h}:{m}',{h:Math.floor(h),m:String(Math.floor((h%1)*60)).padStart(2,'0')}),w,'#fff');hrow(88,'狀態',h<14&&h>=10?'充電':h>=17?'放電':'待機',w,h>=17?'#f2c230':'#7dffc4');hrow(120,'電量（SOC）',Math.round(soc)+'%',w,'#7dffc4');hbar(14,132,w-28,soc/100,'#7dffc4');});}}
]};
function pylonMini(x,y){ctx.strokeStyle='#c9d1d6';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x-26,y-24);ctx.lineTo(x-5,y-130);ctx.lineTo(x+5,y-130);ctx.lineTo(x+26,y-24);ctx.moveTo(x-44,y-112);ctx.lineTo(x+44,y-112);ctx.moveTo(x-34,y-86);ctx.lineTo(x+34,y-86);
  for(let k=0;k<4;k++){const t=k/4,t2=(k+1)/4;ctx.moveTo(lerp(x-26,x-5,t),lerp(y-24,y-130,t));ctx.lineTo(lerp(x+26,x+5,t2),lerp(y-24,y-130,t2));}ctx.stroke();}
