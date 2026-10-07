// KITS: marine
/* ================= EP27 結構健康監測與疲勞 ================= */
function wrap27(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
/* complete monopile turbine at TX; sway = tower lean angle (rad, exaggerated) */
function turb27(sway,rot){
  const yb=bedY(TX)+130;
  drawPile(TX,yb,Math.PI/2,yb-PILE_TOP,PILE_W);
  ctx.save();ctx.translate(TX,TP_BOT);ctx.rotate(sway);ctx.translate(-TX,-TP_BOT);
  drawTP(TX,TP_BOT);for(let k=0;k<3;k++)drawTowerSec(TX,TP_TOP-k*HS,k);
  drawNacelle(TX,TW_TOP,0,true);drawRotor(TX-44,TW_TOP-20,rot,3);
  ctx.restore();
}
/* sensor marker with a pulse ring */
function sens27(x,y,col,a,sq){
  alphaDo(a,()=>{const p=(TT*.9+x*.01)%1;ring(x,y,5+p*13,col,1.6*(1-p));
    if(sq)box(x-4,y-4,8,8,col,'#0e2a3b',1);else circ(x,y,4.5,col,'#0e2a3b',1);});
}
/* frequency axis for the 1P/3P diagram: 0–0.7 Hz → x 120–980 */
const FX27=f=>120+f/0.7*860;
/* stress-range S–N curve, detail category D in air (typical example) */
const SN27=N=>N<1e7?Math.pow(Math.pow(10,12.164)/N,1/3):Math.pow(Math.pow(10,15.606)/N,1/5);
const NS27=S=>S>52.63?Math.pow(10,12.164)/Math.pow(S,3):Math.pow(10,15.606)/Math.pow(S,5);
/* damage bins: stress range (MPa), cycles per year (millions, typical example) */
const BIN27=[[8,9.6],[16,3.1],[28,0.95],[44,0.19],[64,0.022]];
const DYR27=BIN27.reduce((s,b)=>s+b[1]*1e6/NS27(b[0]),0);   // damage per year

const EP={no:27,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'結構健康監測與疲勞',en:'Structural health monitoring and fatigue',
lede:'離岸風機每天承受風與浪反覆的拉扯，鋼構的壽命主要取決於疲勞。這一集看感測器如何貼在塔架與基礎上，為什麼要追蹤自然頻率來發現淘刷，如何用雨流計數把不規則的應力變成循環次數，再依 S-N 曲線與 Miner 法則累積損傷，最後由數位分身推估剩餘壽命。',
facts:[['約 50','Hz','結構監測系統加速度計與應變計的典型取樣頻率'],['每 10','分鐘','自動推估一次自然頻率的常見做法（示例）'],['約 0.25','Hz','單樁風機第一彎曲自然頻率的典型示例，落在 1P 與 3P 之間'],['約 10','%','自然頻率與 1P、3P 範圍之間常見的設計餘裕（示例）'],['25','年','常見設計壽命；累積損傷 D 不得超過 1／DFF']],
note:'說明：本集為教育用途示意動畫，風機、感測器與淘刷坑的比例經過壓縮。自然頻率 0.25 Hz、轉速範圍、應力範圍與循環次數皆為「典型範例」，並非特定案場資料。S-N 曲線採 DNV-RP-C203 的 D 級細節（空氣中，斜率 3 與 5，轉折於 10^7 次）作示意；Miner 線性損傷累積與設計疲勞係數（DFF）的概念依該建議規範。取樣頻率與每 10 分鐘模態追蹤依公開之離岸風機長期監測研究（如美國 BSEE 區塊島與 CVOW 先導案的結構監測）。',
shots:[
/* 1 */{t:'風機身上的感測器',en:'Sensors on the structure',dur:13,side:true,
 d:'離岸風機的鋼構看不見內部的疲勞，所以要靠感測器長期量測。應變計貼在轉接段與塔架底部的焊道附近，直接量出鋼材被拉伸與壓縮的程度；加速度計裝在塔架中段與機艙，記錄結構的振動；傾斜計監看基礎有沒有慢慢歪斜。這些資料以約 50 Hz 的頻率取樣，經海纜與光纖傳回陸上的監測系統，與風速、轉速、波浪資料一起對時，才能知道每一次應力是在什麼條件下產生的。',
 s:[[0,'風機在風與浪的作用下持續微幅擺動'],[.25,'應變計貼在轉接段與塔底焊道附近'],[.5,'加速度計記錄塔架與機艙的振動'],[.74,'資料約 50 Hz 取樣，與風浪資料對時後傳回陸上']],
 cam:u=>camMix({x:800,y:450,s:1},{x:TX+40,y:300,s:1.35},ease(seg(u,.1,.4))),
 draw(u){
  const sw=.012*Math.sin(TT*2.1)*seg(u,0,.1);
  turb27(sw,TT*.9);
  const a1=seg(u,.2,.3),a2=seg(u,.42,.52),a3=seg(u,.6,.68);
  sens27(TX+18,TP_TOP-6,'#7dffc4',a1,true);sens27(TX+17,TP_TOP-HS+6,'#7dffc4',a1,true);
  sens27(TX+19,TP_TOP-2*HS,'#f2c230',a2);sens27(TX+8,TW_TOP-20,'#f2c230',a2);
  sens27(TX-14,TP_TOP-20,'#58b8d0',a3,true);
  // data packets travelling to the nacelle and out
  if(u>.7){for(let k=0;k<4;k++){const q=(TT*.5+k/4)%1;circ(TX+14,TP_TOP-q*(TP_TOP-TW_TOP),2.4,'#7dffc4');}}
 },
 fx(u){
  lab(TX+18,TP_TOP-6,'應變計（焊道）',{dx:150,dy:30,a:band(u,.22,.5),st:'g'});
  lab(TX+19,TP_TOP-2*HS,'加速度計（塔架）',{dx:150,dy:0,a:band(u,.44,.74),st:'s'});
  lab(TX+8,TW_TOP-20,'加速度計（機艙）',{dx:150,dy:-20,a:band(u,.44,.74),st:'s'});
  lab(TX-14,TP_TOP-20,'傾斜計',{dx:-120,dy:0,a:band(u,.62,.9)});
  lab(TX,SEA+30,'單樁（水下不易檢查）',{dx:-150,dy:50,a:band(u,.08,.3),st:'w'});
 },
 hud(u){hudPanel(240,150,'監測系統（示例）',seg(u,.05,.12),w=>{
  hrow(52,'取樣頻率','約 50 Hz',w,'#7dffc4');
  hrow(78,'感測器','30–60 個',w);
  hrow(104,'時間同步','GPS/NTP',w);
  hrow(130,'傳輸','光纖＋海纜',w,'#f2c230');})}},
/* 2 */{t:'自然頻率與 1P、3P',en:'Natural frequency vs 1P and 3P',dur:14,
 d:'風機像一根頂著重物的懸臂梁，有自己最容易搖擺的頻率，稱為自然頻率。轉子轉一圈會激振一次（1P），三片葉片通過塔架時每圈激振三次（3P）。設計時要讓自然頻率落在 1P 範圍上緣與 3P 範圍下緣之間，並保留約 10% 的餘裕，否則共振會讓振幅與疲勞損傷急遽增加。結構監測每隔約 10 分鐘就推估一次自然頻率，把它當成基礎的健康指標。',
 s:[[0,'轉子每轉一圈激振一次，稱為 1P'],[.28,'三片葉片通過塔架，每圈激振三次，稱為 3P'],[.52,'自然頻率要落在兩者之間，並留約 10% 餘裕'],[.76,'監測持續追蹤這條頻率的變化']],
 draw(u){
  diagBG();
  card(60,150,960,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'激振頻率與自然頻率（典型示例）',21,'#fff',700);
  const X0=120,X1=980,AY=640;
  box(X0,AY,X1-X0,2,'rgba(255,255,255,.4)');
  for(const f of [0,.1,.2,.3,.4,.5,.6,.7]){const x=FX27(f);box(x-.5,AY,1,8,'rgba(255,255,255,.4)');wt(x,AY+30,f.toFixed(1),16,'rgba(227,236,238,.8)',600,'center',COND);}
  wt(X1,AY+58,'頻率 (Hz)',16,'rgba(227,236,238,.75)',600,'right');
  // bands
  const b1=seg(u,.05,.18),b3=seg(u,.22,.36),bw=seg(u,.42,.54);
  alphaDo(b1,()=>{box(FX27(.1),300,FX27(.2)-FX27(.1),AY-300,'rgba(88,184,208,.28)','#58b8d0',1.4);
    wt((FX27(.1)+FX27(.2))/2,340,'1P',34,'#7dc8dc',700,'center',COND);wt((FX27(.1)+FX27(.2))/2,372,'6–12 rpm',16,'#fff',600,'center');});
  alphaDo(b3,()=>{box(FX27(.3),300,FX27(.6)-FX27(.3),AY-300,'rgba(255,138,96,.24)','#ff8a60',1.4);
    wt((FX27(.3)+FX27(.6))/2,340,'3P',34,'#ff9d7a',700,'center',COND);wt((FX27(.3)+FX27(.6))/2,372,'18–36 rpm 等效',16,'#fff',600,'center');});
  alphaDo(bw,()=>{box(FX27(.22),300,FX27(.27)-FX27(.22),AY-300,'rgba(125,255,196,.16)','#7dffc4',1.2);
    wt((FX27(.22)+FX27(.27))/2,262,'安全窗口',18,'#7dffc4',700,'center');ln([FX27(.22),290,FX27(.27),290],'#7dffc4',2);});
  // natural frequency marker (drifts down slowly in last part)
  const fn=.25-.012*ease(seg(u,.78,1));const a=seg(u,.5,.6);
  alphaDo(a,()=>{const x=FX27(fn);ln([x,240,x,AY],'#f2c230',3);circ(x,240,8,'#f2c230');
   wt(x,214,trf('自然頻率 {f} Hz',{f:fn.toFixed(3)}),20,'#f2c230',700,'center');});
  // right: meaning
  card(1060,150,480,650,{bg:'rgba(7,27,39,.8)'});wt(1084,190,'為什麼要有餘裕',21,'#fff',700);
  const L=[['1P 上緣約 0.20 Hz，往上留約 10%','#7dc8dc'],['3P 下緣約 0.30 Hz，往下留約 10%','#ff9d7a'],['自然頻率約 0.25 Hz，位於兩者之間','#f2c230'],['落入 1P 或 3P：共振、損傷倍增','#e8572a']];
  L.forEach(([t,c],i)=>alphaDo(seg(u,.48+i*.08,.54+i*.08),()=>{circ(1090,262+i*92,6,c);wrap27(1110,268+i*92,t,400,18,'#fff',600,24);}));
  const v=seg(u,.78,.86);if(v>0)alphaDo(v,()=>{box(1084,650,432,1,'rgba(255,255,255,.14)');
   wt(1084,696,'頻率下降代表基礎變軟',18,'rgba(227,236,238,.85)',600);wt(1084,736,'可能是淘刷或地層變化',18,'rgba(227,236,238,.85)',600);
   wt(1516,780,trf('{p}%',{p:(((.25-fn)/.25)*100).toFixed(1)}),34,'#e8572a',700,'right',COND);});
 }},
/* 3 */{t:'頻率下降：發現淘刷',en:'A falling frequency reveals scour',dur:13,side:true,
 d:'海流與波浪會把單樁周圍的泥沙帶走，形成淘刷坑。樁身在海床下的有效埋深變短，基礎變軟，整座風機的自然頻率便會緩慢下降。這個變化通常只有百分之幾，潛水員或水下機器人很難看出來，但加速度計每十分鐘推估一次的頻率曲線可以清楚顯示趨勢。扣除風速與轉速的影響後，若頻率持續向下偏離，就能提早安排測深與水下檢查，必要時拋石補強。',
 s:[[0,'海流帶走單樁周圍的泥沙，淘刷坑逐漸加深'],[.3,'樁身有效埋深變短，基礎變軟'],[.55,'自然頻率緩慢下降，只差百分之幾'],[.78,'頻率持續偏離，就提早安排測深與水下檢查']],
 cam:u=>camMix({x:800,y:450,s:1},{x:TX+60,y:SEA+70,s:1.9},ease(seg(u,.05,.3))),
 draw(u){
  const sc=ease(seg(u,.12,.7)),bed=bedY(TX),d=sc*58,w=34+d*2.3;
  // scour hole (drawn over the soil, under the pile)
  if(sc>0){poly([TX-w,bed-1,TX-22,bed+d,TX+22,bed+d,TX+w,bed-1],'#17536f');
   ln([TX-w,bed-1,TX-22,bed+d,TX+22,bed+d,TX+w,bed-1],'rgba(255,255,255,.25)',1.2);
   for(let k=0;k<7;k++){const q=(TT*.5+k/7)%1;alphaDo(Math.min(1,sc*3)*(1-q),()=>circ(TX+(k%2?1:-1)*(30+q*50),bed-q*34,2.2,'#c9b48a'));}}
  turb27(.012*Math.sin(TT*2.1),TT*.9);
  // embedment indicator
  const emb=PILE_BOT-(bed+d);
  alphaDo(seg(u,.28,.4),()=>{ln([TX+70,bed+d,TX+70,PILE_BOT],'#f2c230',2);ln([TX+64,bed+d,TX+76,bed+d],'#f2c230',2);ln([TX+64,PILE_BOT,TX+76,PILE_BOT],'#f2c230',2);});
 },
 fx(u){
  const sc=ease(seg(u,.12,.7)),bed=bedY(TX);
  lab(TX-40,bed+sc*40,'淘刷坑',{dx:-140,dy:10,a:band(u,.1,.5),st:'w'});
  lab(TX+70,bed+90,'有效埋深縮短',{dx:150,dy:20,a:band(u,.3,.6),st:'s'});
  lab(TX,SEA-90,'加速度計推估頻率',{dx:170,dy:20,a:band(u,.52,.9),st:'g'});
 },
 hud(u){hudPanel(250,172,'自然頻率趨勢（示例）',seg(u,.05,.12),w=>{
  const s=ease(seg(u,.12,.7)),f=.25-.012*s,k=seg(u,.52,1);
  hrow(52,'目前頻率',f.toFixed(3)+' Hz',w,'#f2c230');
  hrow(78,'變化',(-(.012*s/.25*100)).toFixed(1)+'%',w,s>.5?'#e8572a':'#7dffc4');
  htext(14,106,'每 10 分鐘一點',14,'rgba(227,236,238,.75)',500);
  // trend
  box(14,114,w-28,46,'rgba(255,255,255,.05)');
  ctx.beginPath();const n=24;for(let i=0;i<=n;i++){const q=i/n;if(q>k)break;
   const sv=ease(seg(lerp(.12,.7,q),.12,.7)),yy=124+sv*28+Math.sin(i*1.7)*2.2,xx=14+q*(w-28);if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}
  ctx.strokeStyle='#7dffc4';ctx.lineWidth=2;ctx.stroke();}) }},
/* 4 */{t:'雨流計數：把應力變成次數',en:'Rainflow counting',dur:13,
 d:'風與浪造成的應力忽大忽小、毫無規律，無法直接和材料的疲勞資料比較。雨流計數法把這條不規則的應力歷程拆成一個個完整的循環，每個循環記錄應力範圍：從谷底到峰頂的差距。拆完後依範圍大小分組，就得到一張「每種應力範圍發生幾次」的直方圖。小範圍的循環數量龐大，大範圍的很少，但大範圍的循環對疲勞的貢獻往往更大。',
 s:[[0,'塔底的應力歷程忽大忽小，沒有規律'],[.3,'雨流計數法把它拆成一個個完整循環'],[.55,'每個循環記錄應力範圍，也就是峰谷差'],[.78,'依範圍分組，得到每個範圍發生的次數']],
 draw(u){
  diagBG();
  card(60,150,820,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'塔底焊道的應力歷程（示例）',21,'#fff',700);
  const cx=chartBox(100,230,740,500,{title:'',x0:0,x1:60,y0:-60,y1:60,xt:[0,10,20,30,40,50,60],yt:[-60,-30,0,30,60],xl:'時間 (秒)',yl:'應力 (MPa)',pl:60,pr:20,pt:20,pb:56});
  const sig=t=>30*Math.sin(t*.85)+16*Math.sin(t*2.3+1)+9*Math.sin(t*5.1+2)+(nz(t*.3)-.5)*30;
  const f=seg(u,.04,.3),P=[];for(let i=0;i<=240;i++){const t=i/4;if(t/60>f)break;P.push([cx.X(t),cx.Y(sig(t))]);}
  if(P.length>1)ln(P.flat(),'#7dffc4',2.2);
  // highlight three loops picked from the curve (peak/valley pairs)
  const pk=[[3.7,'#f2c230'],[18.2,'#f2c230'],[39.5,'#f2c230']];
  pk.forEach(([t0],i)=>alphaDo(seg(u,.32+i*.07,.38+i*.07),()=>{
   let tmax=t0,tmin=t0;for(let k=0;k<30;k++){const t=t0+k*.1;if(sig(t)>sig(tmax))tmax=t;if(sig(t)<sig(tmin))tmin=t;}
   const xa=cx.X(tmax),ya=cx.Y(sig(tmax)),xb=cx.X(tmin),yb2=cx.Y(sig(tmin));
   ln([xa,ya,xa+40,ya],'#f2c230',1.6);ln([xb,yb2,xa+40,yb2],'#f2c230',1.6);arrow(xa+40,ya,xa+40,yb2,'#f2c230',2);arrow(xa+40,yb2,xa+40,ya,'#f2c230',2);
   wt(xa+50,(ya+yb2)/2+6,'範圍 S',17,'#f2c230',700);}));
  // histogram
  card(920,150,620,650,{bg:'rgba(7,27,39,.8)'});wt(944,190,'應力範圍分組與次數（每年，示例）',21,'#fff',700);
  const HX=980,HY=720,HW=500,maxV=9.6;
  box(HX,HY,HW,2,'rgba(255,255,255,.4)');
  BIN27.forEach((b,i)=>{const a=seg(u,.6+i*.06,.68+i*.06),h=Math.max(a*b[1]/maxV*430,a>0?3:0),x=HX+20+i*96;
   box(x,HY-h,70,h,i<3?'#58b8d0':i<4?'#f2c230':'#e8572a');
   if(a>.5)wt(x+35,HY-h-10,b[1]<1?b[1].toFixed(2):b[1].toFixed(1),18,'#fff',700,'center',COND);
   wt(x+35,HY+28,String(b[0]),16,'rgba(227,236,238,.85)',600,'center',COND);});
  wt(HX+HW,HY+58,'應力範圍 (MPa)',16,'rgba(227,236,238,.75)',600,'right');
  wt(944,230,'單位：百萬次／年',16,'rgba(227,236,238,.75)',500);
  alphaDo(seg(u,.86,.94),()=>{tag(1510,270,'小範圍次數多，大範圍次數少',{bg:'rgba(242,194,48,.18)',fg:'#f2c230',size:16,align:'right'});});
 }},
/* 5 */{t:'S-N 曲線與損傷累積',en:'S-N curve and damage',dur:14,
 d:'S-N 曲線描述焊接細節在某個應力範圍下，能承受多少次循環才會疲勞破壞：應力範圍越大，壽命越短。把每一組應力範圍的實際次數 n 除以該範圍的容許次數 N，加總就是 Miner 線性損傷累積 D。D 達到 1 代表理論上的疲勞壽命用完。水下或難以檢查的部位會再除以設計疲勞係數 DFF，因此設計時要求 D 不超過 1／DFF，才有足夠安全餘裕。',
 s:[[0,'S-N 曲線：應力範圍越大，容許的次數越少'],[.3,'每組應力範圍的實際次數 n 除以容許次數 N'],[.58,'把各組加總，就是 Miner 損傷累積 D'],[.8,'D 要小於 1／DFF，才算有足夠的安全餘裕']],
 draw(u){
  diagBG();
  card(60,150,860,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'S-N 曲線（D 級焊接細節，示例）',21,'#fff',700);
  const X0=160,X1=880,Y0=720,Y1=250;
  const lx=N=>X0+(Math.log10(N)-4)/4*(X1-X0), ly=S=>Y0-(Math.log10(S)-Math.log10(10))/(Math.log10(300)-1)*(Y0-Y1);
  box(X0,Y0,X1-X0,2,'rgba(255,255,255,.4)');box(X0,Y1,2,Y0-Y1,'rgba(255,255,255,.4)');
  for(const e of [4,5,6,7,8]){const x=lx(Math.pow(10,e));box(x-.5,Y0,1,7,'rgba(255,255,255,.4)');wt(x,Y0+28,'10^'+e,15,'rgba(227,236,238,.85)',600,'center',COND);}
  for(const s of [10,30,100,300]){const y=ly(s);box(X0-7,y-.5,7,1,'rgba(255,255,255,.4)');box(X0,y-.5,X1-X0,1,'rgba(255,255,255,.07)');wt(X0-12,y+5,String(s),15,'rgba(227,236,238,.85)',600,'right',COND);}
  wt(X1,Y0+58,'循環次數 N',16,'rgba(227,236,238,.75)',600,'right');wt(X0-60,Y1-14,'應力範圍 S (MPa)',16,'rgba(227,236,238,.75)',600);
  const c=seg(u,.05,.25),pts=[];for(let i=0;i<=80;i++){const N=Math.pow(10,4+i/80*4);if(i/80>c)break;const S=SN27(N);if(S<10||S>300)continue;pts.push(lx(N),ly(S));}
  if(pts.length>3)ln(pts,'#7dc8dc',3);
  alphaDo(seg(u,.2,.3),()=>{wt(lx(1e5)+10,ly(SN27(1e5))-14,'斜率 m = 3',16,'#7dc8dc',700);wt(lx(2e7),ly(SN27(2e7))-16,'m = 5',16,'#7dc8dc',700);});
  // bins as points on the curve with arrows to demand
  BIN27.forEach((b,i)=>{const a=seg(u,.3+i*.05,.36+i*.05);if(a<=0)return;const N=NS27(b[0]);if(b[0]<10)return;
   alphaDo(a,()=>{circ(lx(N),ly(b[0]),7,'#f2c230','#0e2a3b',1.5);const nn=b[1]*1e6;if(nn>0){const xn=lx(nn);ln([X0,ly(b[0]),lx(N),ly(b[0])],'rgba(242,194,48,.35)',1.2);circ(xn,ly(b[0]),4,'#7dffc4');}});});
  alphaDo(seg(u,.3,.4),()=>{wt(X0+14,Y0-46,'黃點：容許次數 N',15,'#f2c230',600);wt(X0+14,Y0-26,'綠點：實際次數 n（每年）',15,'#7dffc4',600);});
  // right: Miner
  card(940,150,600,650,{bg:'rgba(7,27,39,.8)'});wt(964,190,'Miner 線性損傷累積',21,'#fff',700);
  alphaDo(seg(u,.3,.4),()=>{wt(964,246,'D = Σ ( nᵢ / Nᵢ )',32,'#f2c230',700,'left',COND);});
  const yrs=Math.round(25*ease(seg(u,.5,.78)));
  const D=DYR27*yrs;
  alphaDo(seg(u,.5,.56),()=>{wt(964,326,'運轉年數',18,'rgba(227,236,238,.85)',600);wt(1516,330,trf('{n} 年',{n:yrs}),38,'#fff',700,'right',COND);
   wt(964,386,'累積損傷 D',18,'rgba(227,236,238,.85)',600);wt(1516,392,D.toFixed(2),44,D>1/3?'#e8572a':'#7dffc4',700,'right',COND);
   box(964,420,552,26,'rgba(255,255,255,.1)');box(964,420,Math.min(1,D)*552,26,D>1/3?'#e8572a':'#7dffc4');
   const xt=964+552/3;ln([xt,408,xt,458],'#f2c230',3);wt(xt,486,'1/DFF = 0.33',16,'#f2c230',700,'center',COND);
   wt(1516,486,'D = 1',16,'rgba(227,236,238,.85)',700,'right',COND);});
  alphaDo(seg(u,.8,.88),()=>{wrap27(964,560,'DFF（設計疲勞係數）依檢查難度而定，水下難檢查的部位取較大值，例如 3',552,18,'#fff',600,26);
   wrap27(964,650,'D 超過 1／DFF 前，就要檢查、補強或調整運轉',552,18,'#f2c230',600,26);});
 }},
/* 6 */{t:'數位分身與剩餘壽命',en:'Digital twin and remaining life',dur:15,
 d:'數位分身是把風機的有限元素模型與實際量測資料連在一起。模型先用量測到的自然頻率與振型校正，再用塔架上的加速度與應變推估水下焊道這種裝不了感測器的位置的應力，稱為虛擬感測。把推估應力經雨流計數與 S-N 曲線換算，就能每天更新疲勞損傷。若實際累積比設計曲線慢，就有機會延長檢查間隔，甚至評估延壽；若比設計快，就提早檢查與補強。',
 s:[[0,'感測器把量測資料送進校正過的有限元素模型'],[.28,'模型推估裝不了感測器的水下焊道應力'],[.52,'每天依應力更新疲勞損傷與剩餘壽命'],[.78,'實際比設計慢，就有機會延長檢查間隔或延壽']],
 draw(u){
  diagBG();
  const steps=[['實體風機','感測器量測','#58b8d0'],['數位分身','有限元素模型校正','#f2c230'],['虛擬感測','推估水下焊道應力','#7dffc4'],['疲勞計算','雨流＋S-N＋Miner','#ff9d7a']];
  steps.forEach((s,i)=>{const a=seg(u,.04+i*.08,.1+i*.08),x=60+i*390;if(a<=0)return;alphaDo(a,()=>{
   card(x,150,340,150,{bg:'rgba(7,27,39,.85)',st:s[2]});wt(x+170,208,s[0],26,s[2],700,'center');wrap27(x+170,252,s[1],300,17,'#fff',600,24,'center');
   if(i<3)arrow(x+346,225,x+384,225,'rgba(255,255,255,.7)',3);});});
  card(60,330,860,470,{bg:'rgba(7,27,39,.8)'});wt(84,370,'累積疲勞損傷 D（示例）',21,'#fff',700);
  const c=chartBox(110,400,780,330,{x0:0,x1:25,y0:0,y1:1,xt:[0,5,10,15,20,25],yt:[0,.25,.5,.75,1],xl:'運轉年數',yl:'D',pl:60,pr:20,pt:16,pb:50});
  const f=seg(u,.3,.75);
  // design line (DFF 3 allowable at 0.33)
  const dl=[];for(let i=0;i<=25;i++){if(i/25>f)break;dl.push(c.X(i),c.Y(i/25*.33));}
  const al=[];for(let i=0;i<=25;i++){if(i/25>f)break;al.push(c.X(i),c.Y(i/25*.33*(.66+.1*Math.sin(i*.6))*(1-.02*i/25)));}
  ln([c.X(0),c.Y(.33),c.X(25),c.Y(.33)],'rgba(242,194,48,.7)',1.5);
  wt(c.X(25),c.Y(.33)-10,'容許 D = 1/DFF',15,'#f2c230',700,'right',COND);
  if(dl.length>3)ln(dl,'#ff9d7a',2.4);if(al.length>3)ln(al,'#7dffc4',3);
  wt(c.X(1),c.Y(.97),'設計假設',16,'#ff9d7a',700);wt(c.X(1),c.Y(.9),'實際推估（監測＋數位分身）',16,'#7dffc4',700);
  // right: outcomes
  card(940,330,600,470,{bg:'rgba(7,27,39,.8)'});wt(964,370,'用壽命資料做決策',21,'#fff',700);
  const O=[['實際比設計慢','延長檢查間隔，評估延壽','#7dffc4'],['頻率持續下降','提前測深、水下檢查與補強','#f2c230'],['某部位損傷偏快','加強監測，調整運轉或維修','#e8572a']];
  O.forEach((o,i)=>alphaDo(seg(u,.55+i*.1,.62+i*.1),()=>{const y=400+i*126;card(964,y,552,110,{bg:'rgba(255,255,255,.04)',st:o[2],r:8});
   wt(986,y+42,o[0],21,o[2],700);wrap27(986,y+78,o[1],510,17,'#fff',600,24);}));
 }}
]};
