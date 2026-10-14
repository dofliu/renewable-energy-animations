// KITS: marine
/* ================= EP33 運維的天候窗口排程 ================= */
/* complete fixed-bottom turbine at cx (monopile + TP + tower + nacelle + rotor) */
function turb33(cx,ang){
  const yb=bedY(cx)+130;drawPile(cx,yb,Math.PI/2,yb-PILE_TOP,PILE_W);drawTP(cx,TP_BOT);
  for(let k=0;k<3;k++)drawTowerSec(cx,TP_TOP-k*HS,k);
  drawNacelle(cx,TW_TOP,0,true);drawRotor(cx-44,TW_TOP-20,ang,3);
}
function far33(x,s,ang){const h=150*s,hx=x,hy=SEA-h;ln([x,SEA,x,hy],'rgba(235,240,243,.85)',3*s);
  for(let i=0;i<3;i++){const a=ang-i*TAU/3;ln([hx,hy,hx+Math.cos(a)*70*s,hy+Math.sin(a)*70*s],'rgba(245,247,248,.9)',2.2*s);}circ(hx,hy,3*s,'#eef2f4');}
/* O&M port on the land side: quay, control room, warehouse, spare parts */
function port33(){
  const x0=1440,xe=VX1+30;if(xe<x0)return;
  box(x0,452,xe-x0,120,'#9aa3a8');box(x0,452,xe-x0,5,'#6f7a80');
  for(let x=x0+8;x<xe;x+=40)box(x,458,7,18,'#2b3137');
  superBlock(1478,386,64,66,5,'#e9edef');box(1474,380,72,7,'#6f7a80');mast(1530,380,16);
  box(1560,404,110,48,'#c7cfd3');poly([1556,404,1615,388,1674,404],'#8e9aa1');
  for(let i=0;i<3;i++)box(1572+i*32,426,22,26,'#5d6b74');
}
const LAD33=TX-33.5,PLAT33=TP_TOP-3,CTVX33=TX-114;
function tech33(x,y,col,slider){person(x,y,col||'#e8572a',1.1);if(slider)box(x-1.6,y-9,3.2,3,'#f2c230');}
/* smooth interpolation through key points [[t,v],…] */
function iv(K,t){if(t<=K[0][0])return K[0][1];for(let i=0;i<K.length-1;i++){if(t<=K[i+1][0]){let f=(t-K[i][0])/(K[i+1][0]-K[i][0]);f=(1-Math.cos(Math.PI*f))/2;return lerp(K[i][1],K[i+1][1],f);}}return K[K.length-1][1];}
const HSK=[[0,1.9],[6,1.65],[12,1.15],[18,.95],[24,.9],[30,1.15],[36,1.6],[42,2.1],[48,2.4]];
const WSK=[[0,13.5],[6,11.5],[12,9],[18,7],[24,8],[30,10],[36,12.5],[42,15],[48,16]];
/* window = longest run where both Hs ≤ 1.5 m and wind ≤ 12 m/s */
const WIN33=(()=>{let a=null,b=null,s=null;for(let t=0;t<=48.001;t+=.25){const ok=iv(HSK,t)<=1.5&&iv(WSK,t)<=12;if(ok&&s===null)s=t;if((!ok||t>=48)&&s!==null){if(a===null||t-s>b-a){a=s;b=t;}s=null;}}return [a,b];})();
/* top-view CTV pointing right, bow at (0,0) */
function ctvTop(x,y,ang){ctx.save();ctx.translate(x,y);ctx.rotate(ang);poly([0,0,-12,-16,-80,-16,-80,16,-12,16],'#f2c230','rgba(0,0,0,.4)',1.5);box(-60,-10,30,20,'#e9edef');box(-4,-10,6,20,'#1c1c1c');ctx.restore();}
/* side-view CTV silhouette riding a wave of given slope */
function ctvSide(x,y,ang,s){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s,s);poly([-40,-6,34,-6,40,0,32,8,-36,8],'#f2c230','rgba(0,0,0,.35)',1);box(-22,-20,26,14,'#e9edef');ctx.restore();}

const EP={no:33,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'運維的天候窗口排程',en:'Scheduling O&M around weather windows',
lede:'離岸風機壞了，不是想修就能出海。運維團隊每天要看預報、讀懂海象，再對照船舶與人員的作業上限，在預報圖上找出「天候窗口」，確認工作裝得進去，還要替預報誤差留下餘裕。這一集從清晨的運維碼頭出發，看出海決定怎麼做、天氣轉壞時怎麼撤離，以及台灣海峽一整年的排程策略。',
facts:[['約 1.5','m','人員運輸船船首頂靠登塔的典型示性波高上限'],['約 2.5–3','m','運維母船動態補償步橋可作業的示性波高'],['35–60','km','彰化外海風場的離岸距離，決定每天的航程時間'],['24','節','台中港運維人員運輸船的航速，一次可載 12 名技術人員'],['約 0.7–0.8','係數','α 係數：把設計上限打折成預報上限（典型範例）'],['4–9','月','台灣海峽浪況較佳、大型海事作業集中的月份']],
note:'說明：本集為教育用途示意動畫，船舶、風機與海況比例經過壓縮。人員運輸船登塔約 1.5 m、運維母船動態補償步橋約 2.5–3 m 示性波高為業界常用典型值，與本系列第 15、26 集一致；彰化風場離岸約 35–60 km 取自開發商公開報導；台中港運維人員運輸船 24 節、船長 26 m、載客 12 名取自台電與台中港務公司報導；台灣海峽每年約 4 至 9 月為海事作業主要季節，取自台電施工說明。48 小時預報曲線、風速上限 12 m/s、任務工時、α 係數 0.75、各月可出海天數皆為典型範例：α 係數的概念來自 DNV 海事作業規範（DNV-ST-N001 等），實際數值依作業期間、海況與預報品質而定；各風場的作業上限依業主、船型與設備商規定。不代表任何特定風場。',
shots:[
/* 1 */{t:'清晨的運維碼頭',en:'Dawn at the O&M port',dur:13,side:true,
 d:'清晨六點，運維港的技術人員已經集合，備品、工具與吊具也裝上了人員運輸船（CTV）。不過，船要不要出港，並不是到了碼頭才決定。前一天下午，運維主管就會根據天氣預報、當天的工單與可用的船舶和人力，排出隔天的計畫；清晨出港前再看一次最新預報與現場海況。最後是否出海，由運維主管與船長共同確認，船長對船舶與人員安全有最終決定權。',
 s:[[0,'清晨六點，技術人員在運維港集合'],[.26,'備品與工具已經裝上人員運輸船'],[.5,'出不出海，要看預報、海象與船舶能力'],[.74,'運維主管與船長確認後，才解纜出港']],
 base:()=>{drawSky();drawWaterBack();drawSoil();},
 cam:u=>camMix({x:1360,y:420,s:2.1},{x:1150,y:430,s:1.4},ease(seg(u,.72,1))),
 draw(u){
  for(const [x,s,p] of [[300,.5,.4],[620,.42,1.7],[860,.38,2.6]])far33(x,s,TT*.9+p);
  port33();
  for(let i=0;i<3;i++)box(1690+i*26,432,22,20,['#e8572a','#1f7f99','#f2c230'][i]);
  const xC=lerp(1436,1150,ease(seg(u,.8,1)));
  const wl=vsl(xC,77,true,{tilt:.6},vCTV);
  box(xC-58,wl-20,12,8,'#e8572a');box(xC-44,wl-20,10,8,'#1f7f99');
  for(let j=0;j<3;j++){const s=clamp(u-j*.06);const p=s<.5?{x:lerp(1560+j*16,1462+j*8,ease(seg(s,.06,.48))),y:452}:{x:lerp(1462+j*8,xC-30+j*9,ease(seg(s,.5,.64))),y:s<.57?452:wl-12};
   if(u>.8)p.x=xC-30+j*9,p.y=wl-12;tech33(p.x,p.y,['#e8572a','#f2c230','#7dffc4'][j]);}
  lab(1510,386,'監控中心',{dx:-30,dy:-50,a:band(u,.02,.3)});
  lab(1700,432,'備品與工具',{dx:-20,dy:-60,a:band(u,.24,.5)});
  lab(xC-40,wl-18,'人員運輸船（CTV）',{dx:-60,dy:-60,a:band(u,.04,.5),st:'s'});
  lab(1500,452,'技術人員集合',{dx:30,dy:50,a:band(u,.04,.3),minor:true});
 },
 hud(u){hudPanel(250,176,'出海判斷（示例）',seg(u,.04,.1),w=>{
  hrow(52,'示性波高','1.1 m',w,'#7dffc4');hrow(78,'風速','9 m/s',w,'#7dffc4');hrow(104,'能見度','良好',w,'#7dffc4');
  hrow(130,'工單','齒輪箱油品更換',w);hrow(156,'決定',u<.74?'確認中':'出海',w,u<.74?'#f2c230':'#7dffc4');});}},

/* 2 */{t:'在預報圖上找天候窗口',en:'Finding the weather window',dur:14,
 d:'天候窗口指的是「連續多少小時，海況與天氣都低於作業上限」。運維主管會把未來兩天的逐時預報畫出來：示性波高（Hs）要低於人員運輸船登塔的約 1.5 公尺，風速要低於作業的上限，例如 12 m/s（典型範例），兩個條件同時成立的時段才算數。只看平均值不夠，一定要看連續時間，因為人員一旦登上風機，就需要足夠長的好天氣才能完成工作並安全撤離。',
 s:[[0,'把未來 48 小時的浪高與風速逐時畫出來'],[.26,'浪高要低於約 1.5 m，風速要低於作業上限'],[.52,'兩個條件同時成立的連續時段，就是天候窗口'],[.76,'窗口有多長，決定能派什麼工作']],
 draw(u){
  diagBG();
  const top=chartBox(60,150,960,330,{title:'示性波高 Hs 預報（典型範例）',x0:0,x1:48,y0:0,y1:3,xt:[0,6,12,18,24,30,36,42,48],yt:[0,1,2,3],pt:62,gx:8,gy:3});
  const bot=chartBox(60,490,960,310,{title:'風速預報（典型範例）',x0:0,x1:48,y0:0,y1:20,xt:[0,6,12,18,24,30,36,42,48],yt:[0,5,10,15,20],xl:'預報時間（小時）',pt:62,gx:8,gy:4});
  wt(top.px-10,top.py-12,'m',15,'rgba(227,236,238,.7)',600,'right',COND);wt(bot.px-10,bot.py-12,'m/s',15,'rgba(227,236,238,.7)',600,'right',COND);
  const [a,b]=WIN33,wk=seg(u,.52,.6);
  if(wk>0)alphaDo(wk*.28,()=>{box(top.X(a),top.py,top.X(b)-top.X(a),top.ph,'#7dffc4');box(bot.X(a),bot.py,bot.X(b)-bot.X(a),bot.ph,'#7dffc4');});
  const f=ease(seg(u,.03,.26));const P1=[],P2=[];for(let i=0;i<=96;i++){const t=48*i/96;P1.push({x:top.X(t),y:top.Y(iv(HSK,t))});P2.push({x:bot.X(t),y:bot.Y(iv(WSK,t))});}
  pathLine(partial(P1,f),'#58b8d0',3.5);pathLine(partial(P2,f),'#7dc8dc',3.5);
  const th=(c,v,t,al)=>{if(al<=0)return;alphaDo(al,()=>{ctx.setLineDash([8,6]);ln([c.px,c.Y(v),c.px+c.pw,c.Y(v)],'#e8572a',2.2);ctx.setLineDash([]);wt(c.px+c.pw-8,c.Y(v)-10,t,17,'#ff8a60',700,'right');});};
  th(top,1.5,'登塔上限 1.5 m',seg(u,.26,.32));th(bot,12,'作業上限 12 m/s',seg(u,.3,.36));
  alphaDo(wk,()=>{const cx=(top.X(a)+top.X(b))/2;tag(cx,top.py+34,trf('天候窗口 約 {n} 小時',{n:Math.round(b-a)}),{bg:'#7dffc4',fg:'#13232e',size:19,align:'center'});});
  card(1060,150,480,650,{bg:'rgba(7,27,39,.8)'});wt(1084,196,'出海條件（典型範例）',20,'#f2c230',700);
  const R=[['示性波高','≤ 1.5 m','人員運輸船登塔',.26],['風速','≤ 12 m/s','人員作業',.3],['能見度','良好','航行與救援',.4],['雷電','無','高處作業停止',.46]];
  R.forEach(([k,v,s,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=226+i*112;card(1084,y,432,96,{bg:'rgba(255,255,255,.04)',st:'rgba(255,255,255,.14)'});
   wt(1106,y+40,k,21,'#fff',700);wt(1106,y+74,s,16,'rgba(227,236,238,.75)',500);wt(1494,y+58,v,30,'#7dffc4',700,'right',COND);}));
  alphaDo(seg(u,.76,.82),()=>wt(1300,720,'窗口長度決定能派的工單',19,'#f2c230',700,'center'));
 }},

/* 3 */{t:'看懂海象：浪高、週期與方向',en:'Reading the sea state',dur:13,
 d:'同樣是 1.2 公尺的示性波高，海況可能完全不同。週期短的風浪又陡又密，船身劇烈俯仰，船首很難穩穩頂住風機；週期長的湧浪雖然起伏大，卻相對平緩。浪的方向也很重要：人員運輸船頂靠時最好船首迎浪，如果浪從側面打來，船身會橫搖，護舷容易滑動。因此預報除了 Hs，還要看尖峰週期（Tp）與波向，有經驗的船長也會參考現場實際觀察。',
 s:[[0,'同樣的浪高，週期不同，海況差很多'],[.26,'週期短的風浪又陡又密，船身劇烈俯仰'],[.52,'頂靠時船首迎浪較穩，橫浪會讓船身橫搖'],[.76,'預報要一起看浪高、尖峰週期與波向']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(84,196,'週期：同樣 Hs 1.2 m',20,'#f2c230',700);
  const panel=(y,L,sp,lab1,lab2,col,a)=>{if(a<=0)return;alphaDo(a,()=>{
   const yc=y+150,A=34,W=x=>yc+A*Math.sin(TAU*x/L-TT*sp);
   ctx.fillStyle='rgba(42,127,160,.35)';ctx.beginPath();ctx.moveTo(100,y+250);for(let x=100;x<=740;x+=4)ctx.lineTo(x,W(x));ctx.lineTo(740,y+250);ctx.closePath();ctx.fill();
   const P=[];for(let x=100;x<=740;x+=4)P.push(x,W(x));ln(P,'#bfe8f0',2.5);
   const bx=420,sl=(W(bx+30)-W(bx-30))/60;ctvSide(bx,W(bx)-6,Math.atan(sl),1.4);
   wt(110,y+64,lab1,22,col,700);wt(110,y+94,lab2,17,'rgba(227,236,238,.85)',500);});};
  panel(214,150,4.2,'週期短（約 4 s）','風浪又陡又密，船身劇烈俯仰','#ff8a60',seg(u,.04,.12));
  panel(500,520,1.6,'週期長（約 9 s）','湧浪起伏平緩，船身較穩','#7dffc4',seg(u,.2,.28));
  card(820,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(844,196,'波向：頂靠時的船身',20,'#f2c230',700);
  const dir=(y,ang,lab1,lab2,col,roll,a)=>{if(a<=0)return;alphaDo(a,()=>{
   const tx=1340,ty=y+130;circ(tx,ty,26,'#dfe5e8','rgba(0,0,0,.4)',2);circ(tx,ty,9,'#9aa3a8');
   ctvTop(tx-28,ty,roll*.06*Math.sin(TT*3));
   for(let k=0;k<3;k++){const f=((TT*.6+k/3)%1);const d=[Math.cos(ang),Math.sin(ang)],ox=tx-60-d[0]*(170-f*80),oy=ty-d[1]*(120-f*60)+(ang?0:(k-1)*44);
    alphaDo(1-f*.6,()=>arrow(ox-d[0]*30,oy-d[1]*30,ox,oy,'#bfe8f0',3));}
   wt(860,y+60,lab1,22,col,700);wt(860,y+92,lab2,17,'rgba(227,236,238,.85)',500);});};
  dir(214,0,'迎浪','船首頂住，船身穩定','#7dffc4',0,seg(u,.5,.58));
  dir(500,Math.PI/2,'橫浪','船身橫搖，護舷易滑動','#ff8a60',1,seg(u,.58,.66));
  alphaDo(seg(u,.76,.82),()=>tag(1180,770,'看 Hs，也看尖峰週期 Tp 與波向',{bg:'#f2c230',fg:'#13232e',size:19,align:'center'}));
 }},

/* 4 */{t:'工作要裝得進窗口',en:'Fitting the job into the window',dur:14,
 d:'找到窗口後，還要算算工作裝不裝得下。以彰化外海為例，風場離岸約 35 到 60 公里，人員運輸船以約 24 節航行，單趟大約一個多小時。一張工單需要的時間包括：出港航行、登塔與準備、實際檢修、收工撤離、返航，再加上一段應變餘裕，給天氣提早變化或工作延誤使用。如果窗口有十二小時，一天的檢修作業可以順利完成；如果只有六小時，就只能派短工單，或把工作延到下一個窗口。',
 s:[[0,'工作時間要從出港算到返航'],[.26,'航行、登塔、檢修、撤離，再留應變餘裕'],[.52,'十二小時的窗口，一天的檢修可以完成'],[.76,'窗口太短，只能改派短工單或延期']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,1480,420,{title:'一天的工單排程（典型範例）',x0:5,x1:21,y0:0,y1:4,xt:[6,8,10,12,14,16,18,20],yt:[],xl:'時間（時）',pt:70,pl:200,gx:8,gy:0});
  const T=[['出港航行',6,1.2,'#58b8d0'],['登塔準備',7.2,.5,'#7dc8dc'],['檢修作業',7.7,6,'#f2c230'],['撤離',13.7,.5,'#7dc8dc'],['返航',14.2,1.2,'#58b8d0'],['應變餘裕',15.4,1.6,'rgba(227,236,238,.4)']];
  const yA=c.Y(3),yB=c.Y(1.4),bh=46;
  wt(c.px-16,yA+8,'窗口 A',19,'#7dffc4',700,'right');wt(c.px-16,yB+8,'窗口 B',19,'#ff8a60',700,'right');
  alphaDo(seg(u,.02,.08),()=>{box(c.X(6),yA-bh/2-12,c.X(18)-c.X(6),bh+24,'rgba(125,255,196,.14)');ctx.strokeStyle='#7dffc4';ctx.lineWidth=2;ctx.strokeRect(c.X(6),yA-bh/2-12,c.X(18)-c.X(6),bh+24);
   wt(c.X(18)-8,yA-bh/2-20,'12 小時',17,'#7dffc4',700,'right');});
  T.forEach(([n,t0,d,col],i)=>{const a=seg(u,.06+i*.05,.1+i*.05);if(a<=0)return;alphaDo(a,()=>{box(c.X(t0),yA-bh/2,c.X(t0+d)-c.X(t0),bh,col);});
   if(i!==2&&i!==5)return;alphaDo(a,()=>wt((c.X(t0)+c.X(t0+d))/2,yA+7,n,17,'#13232e',700,'center'));});
  alphaDo(seg(u,.42,.48),()=>tag(c.X(19.2),yA,'完成',{bg:'#7dffc4',fg:'#13232e',size:19,align:'center'}));
  const bk=seg(u,.52,.6);
  if(bk>0){alphaDo(bk,()=>{box(c.X(6),yB-bh/2-12,c.X(12)-c.X(6),bh+24,'rgba(232,87,42,.12)');ctx.strokeStyle='#e8572a';ctx.lineWidth=2;ctx.strokeRect(c.X(6),yB-bh/2-12,c.X(12)-c.X(6),bh+24);
    wt(c.X(12)-8,yB-bh/2-20,'6 小時',17,'#ff8a60',700,'right');
    T.forEach(([n,t0,d,col])=>{const over=t0+d>12;box(c.X(t0),yB-bh/2,c.X(t0+d)-c.X(t0),bh,over?'rgba(232,87,42,.55)':col);});
    ctx.setLineDash([6,5]);ln([c.X(12),yB-bh/2-30,c.X(12),yB+bh/2+20],'#e8572a',2.5);ctx.setLineDash([]);});
   alphaDo(seg(u,.6,.66),()=>tag(c.X(19.2),yB,'超出窗口',{bg:'#e8572a',fg:'#fff',size:19,align:'center'}));}
  alphaDo(seg(u,.2,.28),()=>{card(60,600,1480,190,{bg:'rgba(7,27,39,.8)'});
   wt(800,660,'需要的窗口 ＝ 航行 ＋ 登塔 ＋ 作業 ＋ 撤離 ＋ 返航 ＋ 餘裕',24,'#fff',700,'center');
   wt(800,710,'離岸 35–60 km，24 節航速，單趟約 1–1.5 小時',19,'rgba(227,236,238,.85)',500,'center');});
  alphaDo(seg(u,.76,.82),()=>wt(800,758,'窗口不夠：改派短工單，或延到下一個窗口',20,'#f2c230',700,'center'));
 }},

/* 5 */{t:'預報有誤差：替上限打個折',en:'Forecasts are uncertain: build in a margin',dur:14,
 d:'預報本身有誤差，而且越往後越不準。如果預報剛好等於作業上限，實際海況就有很高的機會超標。大型海事作業會依 DNV 等海事作業規範，用小於 1 的 α 係數把設計上限打折，例如設計上限 1.5 公尺乘上 0.75，預報要低於約 1.1 公尺才排入作業（典型範例）；作業時間越長、預報越遠，係數越小。日常運維也採類似的思維：前一天排計畫，出港前與抵達現場時再確認一次，留下安全餘裕。',
 s:[[0,'預報越往後越不準，誤差帶越來越寬'],[.26,'預報剛好等於上限，實際海況很可能超標'],[.52,'用 α 係數把上限打折，留下安全餘裕'],[.76,'前一天排計畫，出港前與到場時再確認']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,860,650,{title:'Hs 預報與不確定性（典型範例）',x0:0,x1:72,y0:0,y1:2.5,xt:[0,12,24,36,48,60,72],yt:[0,.5,1,1.5,2,2.5],xl:'預報時間（小時）',pt:62,gx:6,gy:5});
  wt(c.px-10,c.py-12,'m',15,'rgba(227,236,238,.7)',600,'right',COND);
  const m=t=>1.0+.12*Math.sin(t/11),sd=t=>.08+.0065*t;
  const f=ease(seg(u,.03,.24)),n=Math.round(72*f);
  if(n>1){ctx.beginPath();for(let t=0;t<=n;t++)ctx.lineTo(c.X(t),c.Y(m(t)+1.28*sd(t)));for(let t=n;t>=0;t--)ctx.lineTo(c.X(t),c.Y(Math.max(0,m(t)-1.28*sd(t))));ctx.closePath();ctx.fillStyle='rgba(88,184,208,.28)';ctx.fill();
   const P=[];for(let t=0;t<=n;t++)P.push({x:c.X(t),y:c.Y(m(t))});pathLine(P,'#58b8d0',3.5);}
  alphaDo(seg(u,.1,.16),()=>wt(c.X(60),c.Y(m(60)-1.28*sd(60))+28,'誤差帶',17,'#7dc8dc',700,'center'));
  const th=(v,col,t,al)=>{if(al<=0)return;alphaDo(al,()=>{ctx.setLineDash([8,6]);ln([c.px,c.Y(v),c.px+c.pw,c.Y(v)],col,2.4);ctx.setLineDash([]);wt(c.px+12,c.Y(v)-10,t,17,col,700,'left');});};
  th(1.5,'#e8572a','設計上限 1.5 m',seg(u,.24,.3));
  th(1.125,'#f2c230','預報上限 約 1.1 m',seg(u,.52,.58));
  alphaDo(band(u,.3,.5),()=>{const x=c.X(40);circ(x,c.Y(1.5),9,'#e8572a');tag(x,c.Y(1.5)-36,'實際可能超標',{bg:'#e8572a',fg:'#fff',size:17,align:'center'});});
  card(960,150,580,650,{bg:'rgba(7,27,39,.8)'});wt(984,196,'α 係數（典型範例）',20,'#f2c230',700);
  alphaDo(seg(u,.5,.56),()=>{card(990,226,520,104,{bg:'rgba(242,194,48,.12)',st:'rgba(242,194,48,.7)'});wt(1250,292,'預報上限 ＝ α × 設計上限',28,'#f2c230',700,'center');});
  const R=[['設計上限','1.5 m','#fff',.56],['α 係數','0.75','#f2c230',.6],['預報上限','約 1.1 m','#7dffc4',.64]];
  R.forEach(([k,v,col,t0],i)=>alphaDo(seg(u,t0,t0+.05),()=>{const y=350+i*84;card(990,y,520,70,{bg:'rgba(255,255,255,.04)',st:'rgba(255,255,255,.14)'});wt(1014,y+45,k,21,'rgba(227,236,238,.9)',600);wt(1488,y+48,v,32,col,700,'right',COND);}));
  alphaDo(seg(u,.76,.82),()=>{wt(1250,644,'作業越長、預報越遠，α 越小',19,'rgba(227,236,238,.9)',600,'center');
   tag(1250,708,'前一天排程 → 出港前 → 到場再確認',{bg:'#7dffc4',fg:'#13232e',size:18,align:'center'});});
 }},

/* 6 */{t:'海況轉壞就提早撤離',en:'Leaving early when the weather turns',dur:14,side:true,
 d:'窗口不是出海後就可以忘記的事。人員在風機上工作時，船長持續觀察現場的浪高與風速，並與岸上的監控中心保持聯繫。午後東北季風增強，浪高逐漸接近上限時，船長會通知技術人員收工，按照順序沿爬梯回到船上；必須在浪高超過登塔上限之前完成撤離，否則人員可能被困在風機上。回港後，未完成的工作重新排入下一個窗口，這就是預留應變餘裕的原因。',
 s:[[0,'午後，風場的浪高開始上升'],[.26,'浪高接近上限，船長通知提早撤離'],[.5,'技術人員收工，沿爬梯回到船上'],[.76,'安全返航，未完成的工作重新排程']],
 cam:u=>camMix({x:TX-70,y:452,s:2.1},{x:TX-260,y:440,s:1.4},ease(seg(u,.72,1))),
 draw(u){
  for(const [x,s,p] of [[180,.55,.4],[1000,.45,1.7],[1200,.4,2.6]])far33(x,s,TT*1.4+p);
  turb33(TX,TT*.9);
  ln([LAD33,PLAT33,LAD33,TP_BOT+22],'rgba(242,194,48,.85)',1);
  const cx=lerp(CTVX33,TX-620,ease(seg(u,.72,1)));
  const wl=vsl(cx,77,false,{tilt:.6+u},vCTV);
  const sp=seg(u,.05,.6);
  if(sp>0)alphaDo(sp,()=>{const R=rng(7);for(let i=0;i<10;i++){const k=(TT*1.3+R())%1;circ(TX-38-R()*30-k*20,wl-6-k*26*sp-R()*8,2+R()*3,`rgba(240,250,255,${.8*(1-k)})`);}
   for(let i=0;i<6;i++){const x=TX-300+i*90+((TT*30)%90);ln([x,SEA-1,x+14,SEA-3],'rgba(255,255,255,.85)',2);}});
  if(u<.72)alphaDo(.8,()=>{for(let i=0;i<5;i++){const k=(TT*1.6+i/5)%1;circ(cx-3-k*26,wl+4+k*3,2+k*4,`rgba(235,248,255,${.6*(1-k)})`);}});
  const dk=wl-12;
  for(let j=0;j<2;j++){const s=u-j*.08;let p;
   if(s<.34)p={x:TX-8+j*10,y:PLAT33};
   else if(s<.66)p=kf(s,[[.34,TX-8+j*10,PLAT33],[.38,LAD33,PLAT33],[.6,LAD33,dk-4],[.66,cx+20+j*10,dk]]);
   else p={x:cx+20+j*10,y:dk};
   tech33(p.x,p.y,j?'#f2c230':'#e8572a',s>.38&&s<.6);}
  lab(TX+10,PLAT33,'技術人員在平台作業',{dx:90,dy:-30,a:band(u,0,.3)});
  lab(TX-40,wl-14,'浪花增大',{dx:-110,dy:-40,a:band(u,.12,.4),st:'w'});
  lab(LAD33,PLAT33+30,'沿爬梯撤離',{dx:-120,dy:-20,a:band(u,.42,.66),st:'g'});
  lab(cx+40,wl-26,'返航',{dx:-30,dy:-50,a:band(u,.76,1),st:'s'});
 },
 hud(u){hudPanel(250,150,'現場海況（示例）',seg(u,.04,.1),w=>{
  const h=lerp(1.0,1.6,seg(u,.02,.9)),wv=lerp(9,13,seg(u,.02,.9));
  hrow(52,'示性波高',trf('{n} m',{n:h.toFixed(1)}),w,h<1.3?'#7dffc4':h<1.5?'#f2c230':'#ff8a60');hbar(14,62,w-28,h/2,h<1.3?'#7dffc4':'#ff8a60');
  hrow(98,'風速',trf('{n} m/s',{n:wv.toFixed(0)}),w);
  hrow(130,'狀態',u<.26?'持續作業':u<.72?'撤離中':'返航',w,u<.26?'#7dffc4':'#f2c230');});}},

/* 7 */{t:'一整年的排程策略',en:'Planning across the year',dur:14,
 d:'把天候窗口放到一整年來看，台灣海峽的季節差異非常明顯。十月到隔年三月東北季風盛行，彰化外海浪高經常超過人員運輸船的上限，可出海的日子大幅減少；四到九月浪況較好，但要留意颱風。因此需要大型船機的維修與更換工作，盡量排在四到九月；冬季則依靠能在較高浪況下作業的運維母船、遠端監控與預測性維護，先把能在岸上準備的工作做好，窗口一開就出海。',
 s:[[0,'冬季東北季風，可出海的日子大幅減少'],[.26,'運維母船的步橋能在較高浪況下作業'],[.52,'大型維修盡量排在四到九月，留意颱風'],[.76,'岸上先備妥人力與備品，窗口一開就出海']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,900,650,{title:'各月可出海天數（典型範例）',x0:.5,x1:12.5,y0:0,y1:30,xt:[1,2,3,4,5,6,7,8,9,10,11,12],yt:[0,10,20,30],xl:'月份',pt:70,gx:12,gy:3});
  wt(c.px-10,c.py-14,'天',15,'rgba(227,236,238,.7)',600,'right');
  alphaDo(seg(u,.02,.08),()=>{box(c.X(.5),c.py,c.X(3.5)-c.X(.5),c.ph,'rgba(232,87,42,.08)');box(c.X(9.5),c.py,c.X(12.5)-c.X(9.5),c.ph,'rgba(232,87,42,.08)');
   wt(c.X(2),c.py+26,'東北季風',17,'#ff9d7a',700,'center');wt(c.X(11),c.py+26,'東北季風',17,'#ff9d7a',700,'center');});
  alphaDo(seg(u,.52,.58),()=>{box(c.X(6.5),c.py,c.X(9.5)-c.X(6.5),c.ph,'rgba(242,194,48,.08)');wt(c.X(8),c.py+26,'颱風季',17,'#f2c230',700,'center');});
  const CT=[6,7,10,15,19,18,16,14,12,7,5,5],SV=[14,14,18,23,25,24,22,20,20,15,13,13],bw=c.pw/12*.34;
  CT.forEach((v,i)=>{const k=ease(seg(u,.04+i*.012,.1+i*.012));if(k>0){const x=c.X(i+1)-bw;box(x,c.Y(v*k),bw,c.Y(0)-c.Y(v*k),'#58b8d0');}
   const k2=ease(seg(u,.26+i*.012,.32+i*.012));if(k2>0){const x=c.X(i+1);box(x,c.Y(SV[i]*k2),bw,c.Y(0)-c.Y(SV[i]*k2),'#7dffc4');}});
  box(c.px+20,c.py+50,16,16,'#58b8d0');wt(c.px+44,c.py+64,'人員運輸船（Hs ≤ 1.5 m）',16,'rgba(227,236,238,.9)',600);
  alphaDo(seg(u,.26,.32),()=>{box(c.px+20,c.py+78,16,16,'#7dffc4');wt(c.px+44,c.py+92,'運維母船（Hs ≤ 2.5–3 m）',16,'rgba(227,236,238,.9)',600);});
  card(1000,150,540,650,{bg:'rgba(7,27,39,.8)'});wt(1024,196,'排程策略',20,'#f2c230',700);
  const S=[['4–9 月','大型船機維修集中排程','#f2c230',.5],['冬季','運維母船與遠端監控','#7dffc4',.3],['颱風前後','停機避險，風後優先巡檢','#ff8a60',.6],['平時','備品人力先備妥，窗口一開就出海','#7dc8dc',.76]];
  S.forEach(([k,v,col,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=226+i*138;card(1024,y,492,118,{bg:'rgba(255,255,255,.04)',st:'rgba(255,255,255,.14)'});box(1024,y,8,118,col);
   wt(1052,y+48,k,26,col,700);wt(1052,y+88,v,18,'rgba(227,236,238,.9)',500);}));
 }}
]};
