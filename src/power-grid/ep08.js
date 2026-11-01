// KITS: land
/* 電網系列 第 8 集：再生能源預測與調度 */
/* 預測誤差、出力曲線、反應時間與 MW 數值皆為典型範例；預測架構整理自台電綜研所相關報導 */
const GYS=600;
const hh8=h=>String(Math.floor(h)).padStart(2,'0')+':'+String(Math.floor((h%1)*60)).padStart(2,'0');
const pvF8=h=>h<6||h>18?0:Math.pow(Math.sin(Math.PI*(h-6)/12),1.3)*100;
const dipG=(h,c,w,a)=>a*Math.exp(-Math.pow((h-c)/w,2));
const DIPS=h=>dipG(h,10.8,.45,.3)+dipG(h,13.6,.6,.55)+dipG(h,15.9,.35,.22);
const pvAct8=h=>pvF8(h)*(1-DIPS(h));
const pvDay8=h=>pvF8(h)*.97;
const pvNear8=h=>pvF8(h)*(1-.55*DIPS(h));
/* 缺口接力：缺口 100 MW，單位 MW，時間為分鐘 */
const GAP=100;
function relay(t){
  const gas=GAP*clamp((t-3)/22,0,1);
  const pump=Math.min(65,GAP*clamp((t-.4)/2.6,0,1))*(1-clamp((t-9)/20,0,1));
  const bat=Math.max(0,GAP-gas-pump);
  return [gas,pump,bat];
}
function ptAlong8(P,t){const k=clamp(t,0,.9999)*(P.length-1),j=Math.floor(k);return [lerp(P[j][0],P[j+1][0],k-j),lerp(P[j][1],P[j+1][1],k-j)];}
function flowDots8(P,dir,col,n,r,a){
  if(a<=0)return;
  alphaDo(a,()=>{for(let i=0;i<n;i++){let t=(TT*.2*dir+i/n)%1;if(t<0)t+=1;const q=ptAlong8(P,t);circ(q[0],q[1],r,col);}});
}
function windT8(x,y,h,rot){ln([x,y,x,y-h],'#eef2f4',5);for(let i=0;i<3;i++){const a=rot+i*TAU/3;ln([x,y-h,x+h*.55*Math.cos(a),y-h+h*.55*Math.sin(a)],'#eef2f4',3);}circ(x,y-h,4.5,'#cfd8dc');}
function pole8(x,gy,h){ln([x,gy,x,gy-h],'#6b5a48',5);ln([x-22,gy-h+12,x+22,gy-h+12],'#6b5a48',4);return [x,gy-h+12];}
function house8(x,gy,lit){
  box(x,gy-54,80,54,'#e8e0d2','rgba(0,0,0,.3)',1);poly([x-8,gy-54,x+40,gy-90,x+88,gy-54],'#b5654a','rgba(0,0,0,.3)',1);
  box(x+12,gy-38,16,16,lit?'#ffd966':'#7aa8c4');box(x+52,gy-38,16,16,lit?'#ffd966':'#7aa8c4');box(x+34,gy-32,14,32,'#7a5a42');
}
function bess8(x,gy,on){for(let i=0;i<2;i++){box(x+i*58,gy-62,50,62,'#e3e8ec','rgba(0,0,0,.35)',1.2);box(x+i*58+6,gy-52,38,6,on?'#7dffc4':'#7a8790');box(x+i*58+6,gy-40,38,6,on?'#7dffc4':'#7a8790');}}
function gasPlant8(x,gy,on){
  box(x,gy-80,150,80,'#aeb8be','rgba(0,0,0,.35)',1.4);box(x+16,gy-64,46,44,'#8d989f');circ(x+39,gy-42,15,'#cfd8dc','rgba(0,0,0,.35)',1.4);
  box(x+78,gy-64,56,44,'#8d989f');for(let i=0;i<3;i++)ln([x+86+i*16,gy-60,x+86+i*16,gy-24],'rgba(0,0,0,.28)',2);
  box(x+110,gy-150,22,70,'#d6dde0','rgba(0,0,0,.35)',1.2);
  if(on>0)for(let i=0;i<4;i++){const t=(TT*.35+i/4)%1;alphaDo(on*(1-t)*.5,()=>circ(x+121+Math.sin(i*2+TT)*6,gy-150-t*70,8+t*14,'#e3e8ec'));}
}
function hrowW8(x,y,label,val,w,col){wt(x,y,label,20,'rgba(227,236,238,.9)',600);wt(x+w,y+4,val,28,col,700,'right',COND);}
function bul8(x,y,arr,u,a0,sz,gap,col){alphaDo(seg(u,a0,a0+.1),()=>arr.forEach((t,i)=>{circ(x+10,y+i*gap-5,3.5,col);wt(x+28,y+i*gap,t,sz,'rgba(227,236,238,.92)',500);}));}

const EP={no:8,slug:'power-grid',seriesName:'電網系列',t:'再生能源預測與調度',en:'Renewable forecasting and dispatch',
lede:'太陽光電與風電的出力跟著天氣走，調度員必須先知道「接下來會有多少電」，才能安排其他機組。這一集看雲影如何讓光電出力起伏、台電的預測怎麼做、預測與實際為何有落差、儲能與機組如何接力補上缺口，以及傍晚光電下降時的調度。',
facts:[['48','小時','台電採用的滾動預測期間（依報導）'],
['2','套','太陽光電與風電各用兩套預測來源（台電綜研所與一家民間公司），依歷史誤差加權'],
['縣市','分區','太陽光電預測改採區處或縣市分區預測，再加總成全台總量'],
['優先','併網與調度','電業法規定再生能源應優先併網、優先調度'],
['秒級','儲能最快','儲能秒級出力，抽蓄約數分鐘，燃氣機組約十餘分鐘（典型範例）'],
['傍晚','斜坡','光電下降速度快於用電下降速度，是傍晚調度最吃緊的時段']],
note:'說明：本集為教育用途示意動畫。預測架構（中央氣象署數值天氣預報、台電綜研所與民間兩套預測依歷史誤差加權的系集預測、48 小時滾動、太陽光電區域性預測、風電深度學習模型）與台電以抽蓄、燃氣與儲能快速調度、不直接限制光電出力、電業法優先併網與調度之說明，整理自 2026 年媒體對台電綜研所的報導摘要，未取得台電官方全文。畫面中的出力曲線、預測誤差百分比、權重、缺口 100 MW 與各資源反應時間皆為典型範例，非特定日期或機組資料。',
base:()=>{landSky(GY,{sun:{x:1300,y:120},clouds:false});drawGround();},
shots:[
{t:'雲來了，光電掉了',en:'A cloud passes, PV output drops',dur:13,side:true,
 d:'光電與風電的出力跟著天氣走。一片雲飄過太陽光電場，案場在幾分鐘內就可能少掉數成出力，雲飄走後又迅速回來；風速改變時，風機出力也會上下起伏。傳統機組可以照排程發電，再生能源卻得先「猜」天氣，才知道下一小時與明天有多少電可以用。各縣市的雲影掃過的時間不同，個別案場的起伏會彼此抵消一部分，但全台加總後仍有明顯變動，調度必須先掌握它。',
 s:[[0,'太陽光電場在晴天滿載發電'],[.3,'一片雲飄來，雲影掃過光電板'],[.55,'出力在幾分鐘內掉了數成'],[.8,'雲過去後出力回升，風機也隨風速起伏']],
 draw(u){
  const cx=lerp(140,1000,ease(seg(u,.1,.86)));
  const ov=Math.exp(-Math.pow((cx+40-610)/250,2));
  for(let i=0;i<8;i++)solarPanel(300+i*80,groundY(300+i*80),84,24);
  cabinet(960,GYS,60,58,'#dfe5e8');
  const sh=.34*clamp(1.4*ov+.05,0,1);
  ctx.save();ctx.fillStyle='rgba(0,0,0,'+sh+')';ctx.beginPath();ctx.ellipse(cx+40,GYS+8,230,24,0,0,TAU);ctx.fill();ctx.restore();
  [1150,1290,1430].forEach((x,i)=>windT8(x,groundY(x),170,TT*1.1+i*1.9));
  alphaDo(.95,()=>{lcloud(cx,215,2.4);lcloud(cx+150,255,1.3);lcloud(cx-90,260,1.1);});
  lab(610,GYS-90,'太陽光電場',{dx:0,dy:-100,st:'g',a:band(u,.02,.4)});
  lab(cx+40,GYS+10,'雲影',{dx:0,dy:70,st:'w',a:band(u,.28,.75)});
  lab(1290,GYS-190,'風機',{dx:0,dy:-90,st:'s',a:band(u,.5,.95)});
 },
 hud(u){
  const cx=lerp(140,1000,ease(seg(u,.1,.86))),ov=Math.exp(-Math.pow((cx+40-610)/250,2));
  const pv=Math.round(100*(1-.7*ov)),wd=Math.round(62+7*Math.sin(TT*.9));
  hudPanel(280,152,'即時出力（示例）',seg(u,.05,.1),w=>{hrow(56,'光電',pv+'%',w,pv<70?'#e8572a':'#7dffc4');hbar(16,70,w-32,pv/100,pv<70?'#e8572a':'#7dffc4');hrow(100,'風電',wd+'%',w,'#f2c230');hbar(16,114,w-32,wd/100,'#f2c230');});}},

{t:'預測從哪裡來',en:'Where forecasts come from',dur:13,
 d:'台電的再生能源預測，以中央氣象署的數值天氣預報為基礎，再加上案場的地理座標、設備資料與實際觀測，推算每個時段能發多少電。太陽光電與風電各有兩套預測來源，一套來自台電綜合研究所，一套來自民間預測公司，再依過去的預測誤差調整權重，合成系集預測供調度員參考。預測每隔一段時間就用最新天氣與實測資料更新，範圍為 48 小時滾動。圖中的權重數值為示例。',
 s:[[0,'氣象預報、案場資料與實測是預測的原料'],[.3,'兩套預測各自算出發電量'],[.55,'依過去誤差加權，合成系集預測'],[.8,'預測以 48 小時範圍持續滾動更新']],
 draw(u){
  diagBG();
  const IN=[['氣象署數值天氣預報','雲量、日照、風速、溫度',170],['案場座標與設備資料','位置、容量、方位、機型',300],['即時觀測與歷史出力','實測資料持續回饋',430]];
  IN.forEach(([a,b,y],i)=>alphaDo(seg(u,.02+i*.06,.12+i*.06),()=>{card(60,y,330,110,{bg:'rgba(7,27,39,.75)',st:'#7dc8dc'});wt(80,y+44,a,21,'#7dc8dc',700);wt(80,y+80,b,17,'rgba(227,236,238,.85)',500);}));
  const e1=ease(seg(u,.26,.44)),e2=ease(seg(u,.5,.7));
  const w1=lerp(50,62,e2),w2=100-w1;
  [['台電綜研所預測',210,w1,'#f2c230'],['民間預測公司',380,w2,'#7dffc4']].forEach(([n,y,w,c],i)=>alphaDo(e1,()=>{
    card(470,y,330,140,{bg:'rgba(7,27,39,.75)',st:c});wt(490,y+46,n,22,c,700);
    wt(490,y+88,'權重',18,'rgba(227,236,238,.85)',600);wt(780,y+92,Math.round(w)+'%',34,c,800,'right',COND);
    box(490,y+108,290,10,'rgba(255,255,255,.12)');box(490,y+108,290*w/100,10,c);}));
  alphaDo(e1,()=>{arrow(390,225,470,270,'rgba(227,236,238,.6)',2.4);arrow(390,355,470,300,'rgba(227,236,238,.6)',2.4);arrow(390,485,470,440,'rgba(227,236,238,.6)',2.4);arrow(390,355,470,430,'rgba(227,236,238,.6)',2.4);});
  alphaDo(seg(u,.46,.58),()=>{arrow(800,280,880,270,'rgba(227,236,238,.7)',2.6);arrow(800,450,880,340,'rgba(227,236,238,.7)',2.6);});
  alphaDo(seg(u,.46,.6),()=>{card(880,170,660,240,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});wt(904,214,'系集預測（加權合成）',24,'#f2c230',700);
    wt(904,268,'預測值 = 台電綜研所 × 權重 + 民間預測 × 權重',20,'rgba(227,236,238,.95)',600);
    wt(904,318,'過去誤差小的來源，權重調高',20,'rgba(227,236,238,.92)',500);
    wt(904,362,'輸出：每個時段的發電量，供調度員排程',20,'rgba(227,236,238,.92)',500);});
  alphaDo(seg(u,.62,.74),()=>{card(880,430,660,150,{bg:'rgba(7,27,39,.75)',st:'#7dc8dc'});wt(904,470,'48 小時滾動預測',22,'#7dc8dc',700);
    const x0=904,w=612,y=520;box(x0,y,w,26,'rgba(255,255,255,.1)');
    const k=(TT*.12)%1,ww=w*.5;box(x0+k*(w-ww),y,ww,26,'rgba(125,200,220,.55)');
    ln([x0+k*(w-ww),y-6,x0+k*(w-ww),y+32],'#fff',2.5);
    wt(x0,y+58,'現在',16,'rgba(227,236,238,.8)',600);wt(x0+w,y+58,'+48 小時',16,'rgba(227,236,238,.8)',600,'right');});
  alphaDo(seg(u,.76,.88),()=>{card(60,610,740,190,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});wt(84,652,'太陽光電：區域性預測',22,'#f2c230',700);
    ['以區處或縣市為邊界分區預測','再聚合成全台總預測量'].forEach((t,i)=>{circ(94,702+i*44-5,3.5,'#f2c230');wt(112,702+i*44,t,20,'rgba(227,236,238,.92)',500);});});
  alphaDo(seg(u,.82,.94),()=>{card(880,610,660,190,{bg:'rgba(7,27,39,.75)',st:'#7dffc4'});wt(904,652,'風電：深度學習模型',22,'#7dffc4',700);
    ['新一代深度學習架構','改善民營案場觀測資料不完整'].forEach((t,i)=>{circ(914,702+i*44-5,3.5,'#7dffc4');wt(932,702+i*44,t,20,'rgba(227,236,238,.92)',500);});});
 }},

{t:'預測與實際的差距',en:'The gap between forecast and actual',dur:14,
 d:'把一天的光電出力畫出來，前一天做的預測通常是一條平滑的鐘形曲線，實際出力卻會因為雲層出現缺口。離實際時間越近，預測就能納入最新的實測與雲況，缺口也縮得越小。示例中，前一天預測的誤差約佔裝置容量的 12%，六小時前約 7%，一小時前約 3%。調度員因此不是只看一次預測，而是看著預測不斷更新，並替剩下的誤差預留空間。',
 s:[[0,'前一天的預測是平滑的鐘形曲線'],[.3,'實際出力因雲層出現一個個缺口'],[.6,'越接近當下，預測修正得越準'],[.85,'剩下的誤差，要預留備用容量']],
 draw(u){
  diagBG();
  const C=chartBox(60,150,960,650,{title:'光電出力（典型範例，佔裝置容量 %）',x0:5,x1:19,y0:0,y1:110,xt:[6,8,10,12,14,16,18],yt:[0,20,40,60,80,100],xl:'時',pl:84,pt:60,pb:56,gx:7,gy:5});
  const th=5+14*ease(seg(u,.06,.86));
  const dr=(f,col,lw,from,dash)=>{ctx.beginPath();let st=false;for(let h=Math.max(5,from||5);h<=th+1e-6;h+=.1){const x=C.X(h),y=C.Y(f(h));st?ctx.lineTo(x,y):(ctx.moveTo(x,y),st=true);}if(st){if(dash)ctx.setLineDash([9,6]);ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke();ctx.setLineDash([]);}};
  ctx.beginPath();let on=false;for(let h=6;h<=Math.min(th,18)+1e-6;h+=.1){const y=C.Y(Math.min(pvDay8(h),pvAct8(h)));on?ctx.lineTo(C.X(h),C.Y(pvDay8(h))):(ctx.moveTo(C.X(h),C.Y(pvDay8(h))),on=true);}
  for(let h=Math.min(th,18);h>=6-1e-6;h-=.1)ctx.lineTo(C.X(h),C.Y(Math.min(pvDay8(h),pvAct8(h))));
  ctx.closePath();ctx.fillStyle='rgba(232,87,42,.4)';ctx.fill();
  dr(pvDay8,'#f2c230',3.2,6,true);
  alphaDo(seg(u,.5,.6),()=>dr(pvNear8,'#b37cff',3,6,true));
  dr(pvAct8,'#7dffc4',3.8,6,false);
  const hc=clamp(th,6,18);ln([C.X(hc),C.py,C.X(hc),C.py+C.ph],'rgba(255,255,255,.4)',1.4);
  wt(C.px+16,C.py+34,'前一天預測',17,'#f2c230',700);wt(C.px+16,C.py+60,'實際出力',17,'#7dffc4',700);
  alphaDo(seg(u,.5,.6),()=>wt(C.px+16,C.py+86,'接近當下的預測',17,'#b37cff',700));
  if(th>13.2)alphaDo(seg(th,13.2,14.2)*(1-seg(u,.6,.66)),()=>tag(C.X(13.6),C.Y(pvAct8(13.6))+36,'雲層造成缺口',{size:16,bg:'#e8572a',align:'center'}));
  const cx=1060,a=pvAct8(hc),d=pvDay8(hc);
  card(cx,150,480,300,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});
  wt(cx+24,192,'此刻（示例）',22,'#f2c230',700);wt(cx+456,192,hh8(hc),30,'#fff',700,'right',COND);
  hrowW8(cx+24,246,'前一天預測',Math.round(d)+'%',432,'#f2c230');
  hrowW8(cx+24,296,'實際出力',Math.round(a)+'%',432,'#7dffc4');
  hrowW8(cx+24,346,'缺口',Math.round(Math.max(0,d-a))+'%',432,d-a>8?'#e8572a':'#fff');
  wt(cx+24,414,'缺口＝預測少了多少，就要有其他電源補',17,'rgba(227,236,238,.75)',500);
  card(cx,470,480,330,{bg:'rgba(7,27,39,.75)',st:'#b37cff'});wt(cx+24,512,'預測誤差（示例，佔裝置容量）',21,'#b37cff',700);
  [['前一天',12],['六小時前',7],['一小時前',3]].forEach(([n,v],i)=>{const y=566+i*74,k=ease(seg(u,.58+i*.08,.72+i*.08));
    wt(cx+24,y,n,19,'rgba(227,236,238,.92)',600);box(cx+150,y-20,240,22,'rgba(255,255,255,.1)');box(cx+150,y-20,240*v/15*k,22,'#b37cff');
    wt(cx+456,y+2,Math.round(v*k)+'%',28,'#fff',700,'right',COND);});
 }},

{t:'誤差靠誰補：反應速度接力',en:'Who fills the gap: a relay of response speeds',dur:13,
 d:'預測再準，仍會有誤差，這些缺口要靠備用容量補。反應速度不同的資源會接力：電池儲能可在秒級內出力，最先頂上；抽蓄水力機組約數分鐘內可升載；燃氣機組要十餘分鐘才能爬升到位。示例中，光電突然少了 100 MW，儲能先擋住缺口，抽蓄接手，等燃氣機組升載完成，前兩者再逐步退場，把電量和容量留給下一次。',
 s:[[0,'光電突然少了 100 MW，缺口出現'],[.25,'儲能秒級反應，最先擋住缺口'],[.5,'抽蓄約數分鐘內升載接手'],[.8,'燃氣機組升載到位，前兩者退場']],
 draw(u){
  diagBG();
  const C=chartBox(60,150,960,650,{title:'缺口補上（典型範例）',x0:0,x1:30,y0:0,y1:120,xt:[0,5,10,15,20,25,30],yt:[0,25,50,75,100],xl:'分鐘',pl:84,pt:60,pb:56,gx:6,gy:5});
  const tm=30*ease(seg(u,.08,.9));
  const L=[[2,'#7dffc4'],[1,'#58b8d0'],[0,'#b37cff']];
  const sh=[];for(let t=0;t<=tm+1e-6;t+=.25)sh.push([t,relay(t)]);
  const stack=(idxs,col)=>{ if(sh.length<2)return;ctx.beginPath();
    sh.forEach(([t,v],i)=>{const top=idxs.reduce((s,k)=>s+v[k],0);i?ctx.lineTo(C.X(t),C.Y(top)):ctx.moveTo(C.X(t),C.Y(top));});
    const lo=idxs.slice(0,-1);
    for(let i=sh.length-1;i>=0;i--){const v=sh[i][1],b=lo.reduce((s,k)=>s+v[k],0);ctx.lineTo(C.X(sh[i][0]),C.Y(b));}
    ctx.closePath();ctx.fillStyle=col;ctx.fill();};
  stack([0],'rgba(179,124,255,.7)');stack([0,1],'rgba(88,184,208,.7)');stack([0,1,2],'rgba(125,255,196,.7)');
  ctx.setLineDash([8,6]);ln([C.px,C.Y(GAP),C.px+C.pw,C.Y(GAP)],'rgba(232,87,42,.9)',1.8);ctx.setLineDash([]);
  wt(C.px+C.pw-10,C.Y(GAP)-10,'缺口 100 MW（示例）',16,'#ff9d7a',700,'right');
  ln([C.X(tm),C.py,C.X(tm),C.py+C.ph],'rgba(255,255,255,.4)',1.4);
  alphaDo(seg(u,.2,.3)*(1-seg(u,.5,.56)),()=>tag(C.X(1.6),C.Y(60),'儲能先頂上',{size:16,bg:'#7dffc4',fg:'#13232e',align:'left'}));
  alphaDo(seg(u,.45,.55)*(1-seg(u,.7,.76)),()=>tag(C.X(5.5),C.Y(80),'抽蓄接手',{size:16,bg:'#58b8d0',align:'left'}));
  alphaDo(seg(u,.72,.82),()=>tag(C.X(17),C.Y(60),'燃氣機組到位',{size:16,bg:'#b37cff',align:'left'}));
  const cx=1060,v=relay(tm);
  card(cx,150,480,300,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});
  wt(cx+24,192,'此刻出力（MW，示例）',22,'#f2c230',700);wt(cx+456,192,Math.round(tm*10)/10+' min',28,'#fff',700,'right',COND);
  hrowW8(cx+24,246,'儲能',Math.round(v[2]),432,'#7dffc4');
  hrowW8(cx+24,296,'抽蓄',Math.round(v[1]),432,'#58b8d0');
  hrowW8(cx+24,346,'燃氣機組',Math.round(v[0]),432,'#b37cff');
  wt(cx+24,414,'三者加總永遠補足 100 MW',17,'rgba(227,236,238,.75)',500);
  card(cx,470,480,330,{bg:'rgba(7,27,39,.75)',st:'#7dc8dc'});wt(cx+24,512,'反應速度（典型範例）',22,'#7dc8dc',700);
  [['儲能','秒級','#7dffc4',.06],['抽蓄水力','數分鐘','#58b8d0',.4],['燃氣機組','十餘分鐘','#b37cff',1]].forEach(([n,t,c,f],i)=>{const y=574+i*72,k=ease(seg(u,.3+i*.12,.45+i*.12));
    wt(cx+24,y,n,20,'rgba(227,236,238,.92)',600);box(cx+200,y-20,130,16,'rgba(255,255,255,.1)');box(cx+200,y-20,Math.max(8,130*f)*k,16,c);wt(cx+456,y+2,t,22,c,700,'right');});
 }},

{t:'傍晚的斜坡',en:'The evening ramp',dur:13,side:true,
 base:u=>{const k=ease(seg(u,.05,.8));landSky(GY,{sun:{x:230,y:lerp(260,585,k)},dusk:k,clouds:false});drawGround();},
 d:'傍晚是最難調度的時段。太陽下山時，光電出力在一兩個小時內降到接近零，家庭與商業用電卻正要進入夜間高峰，光電下降的速度比用電下降的速度快，缺口迅速擴大。台電採取的做法，是以燃氣與抽蓄機組快速升載，再配合儲能充放電，把這段斜坡補起來，而不是直接限制光電出力。畫面中的數字為示例。',
 s:[[0,'傍晚太陽下山，光電出力快速下降'],[.3,'家庭與商業用電卻開始走向夜間高峰'],[.55,'燃氣機組快速升載，儲能同步放電'],[.8,'兩者接手，缺口補上，不必限制光電']],
 draw(u){
  const k=ease(seg(u,.05,.8));
  for(let i=0;i<8;i++)solarPanel(280+i*72,groundY(280+i*72),78,22);
  const top=pole8(900,GYS,170),t2=pole8(1180,GYS,170),t3=pole8(1400,GYS,170);
  const L=[[850,GYS-60],top,t2,t3];
  ln(L.flat(),'rgba(30,40,46,.85)',1.8);
  gasPlant8(980,GYS,seg(u,.35,.55));bess8(1215,GYS,u>.5);
  house8(1430,GYS,k>.35);house8(1530,GYS,k>.5);
  const g=seg(u,.35,.62);
  ln([1121,GYS-150,1121,GYS-190,t2[0],t2[1]],'rgba(30,40,46,.85)',1.6);
  ln([1243,GYS-62,1243,t2[1]+10],'rgba(30,40,46,.85)',1.6);
  flowDots8(L,1,'#f2c230',12,3.6,1-k*.9);
  flowDots8([[1121,GYS-190],t2,t3],1,'#b37cff',6,3.6,g);
  flowDots8([[1243,GYS-62],[1243,t2[1]+10]],1,'#7dffc4',3,3.6,g*(u>.5?1:0));
  lab(560,GYS-70,'光電出力下降',{dx:0,dy:-110,st:'w',a:band(u,.02,.45)});
  lab(1060,GYS-120,'燃氣機組升載',{dx:-60,dy:-120,st:'s',a:band(u,.4,.95)});
  lab(1270,GYS-40,'儲能放電',{dx:0,dy:70,st:'g',a:band(u,.5,.95)});
  lab(1500,GYS-90,'夜間用電高峰',{dx:0,dy:-110,st:'w',a:band(u,.25,.8)});
 },
 hud(u){
  const k=ease(seg(u,.05,.8)),g=ease(seg(u,.35,.8));
  const pv=Math.round(100*(1-k)),gas=Math.round(420*g),bat=Math.round(120*ease(seg(u,.5,.8)));
  hudPanel(280,152,'斜坡補位（示例）',seg(u,.04,.1),w=>{hrow(56,'光電出力',pv+'%',w,pv<40?'#e8572a':'#f2c230');hrow(88,'燃氣升載',gas+' MW',w,'#b37cff');hrow(120,'儲能放電',bat+' MW',w,'#7dffc4');});}},

{t:'優先調度與預測循環',en:'Priority dispatch and the forecasting loop',dur:13,
 d:'電業法規定再生能源應優先併網、優先調度，台電面對高滲透率時，不以直接限制光電出力為手段，而是靠預測、機組排程與儲能補位。只有系統出現事故、需要保護電網安全時，才會要求再生能源短暫降載或停機。調度是一個循環：先預測，再排定機組與備轉，即時監看並快速調整，最後比對實際出力，把誤差回饋給下一輪的預測與權重。',
 s:[[0,'第一步：預測未來的發電量'],[.3,'第二步：排定機組與備轉容量'],[.55,'第三步：即時監看，快速調整'],[.8,'第四步：比對實際，誤差回饋預測']],
 draw(u){
  diagBG();
  card(60,150,700,650,{bg:'rgba(7,27,39,.75)'});wt(84,190,'調度的循環',22,'#f2c230',700);
  const ST=[['1','預測發電量','天氣預報與實測，48 小時滾動'],['2','排定機組與備轉','預留誤差空間'],['3','即時監看、快速調整','儲能、抽蓄、燃氣接力'],['4','比對實際、修正權重','誤差回饋下一輪預測']];
  ST.forEach(([n,a,b],i)=>{const y=224+i*136,lit=band(u,.04+i*.24,.34+i*.24+(i==3?.5:0)),c=['#f2c230','#58b8d0','#7dffc4','#b37cff'][i];
    card(100,y,620,112,{bg:'rgba(255,255,255,'+(.05+.1*lit)+')',st:c});
    circ(148,y+56,26,c);wt(148,y+66,n,28,'#13232e',800,'center',COND);
    wt(194,y+48,a,24,c,700);wt(194,y+86,b,18,'rgba(227,236,238,.9)',500);
    if(i<3)alphaDo(seg(u,.12+i*.24,.2+i*.24),()=>arrow(410,y+112,410,y+136,'rgba(227,236,238,.6)',2.4));});
  const R=[['優先併網與調度',['電業法規定：','再生能源應優先併網、優先調度'],'#7dffc4',.2],['不直接限制光電出力',['以抽蓄、燃氣機組快速調度，','配合儲能充放電，避免被迫棄電'],'#f2c230',.45],['事故時才降載',['系統事故或需保護電網安全時，','才要求再生能源短暫降載或停機'],'#e8572a',.7]];
  R.forEach(([n,ls,c,a0],i)=>alphaDo(seg(u,a0-.1,a0+.02),()=>{const y=150+i*220;card(800,y,740,200,{bg:'rgba(7,27,39,.75)',st:c});wt(824,y+50,n,26,c,700);
    ls.forEach((p,j)=>wt(824,y+110+j*40,p,21,'rgba(227,236,238,.95)',500));}));
 }}
]};
