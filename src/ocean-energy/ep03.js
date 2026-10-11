// KITS: land
/* 海洋能系列 第 3 集：海洋溫差發電 */
const SURF=300,TXP=560,COASTX=1330,BEDF=830;
const PWR='#f2c230',HOT='#ff9d7a',COLD='#7dc8dc';
function pl(P,col,lw){const a=[];P.forEach(p=>a.push(p[0],p[1]));ln(a,col,lw);}
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function part(P,f){const out=[P[0]];let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r>=d[i]){out.push(P[i+1]);r-=d[i];}else{const t=d[i]?r/d[i]:0;out.push([lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)]);break;}}return out;}
function flowDots(P,n,col,a,sp,r){if(a<=0)return;for(let k=0;k<n;k++){const f=((TT*(sp||.3))+k/n)%1,p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4.5,col));}}
const bedY=x=>x>=COASTX?SURF:Math.min(BEDF,SURF+(COASTX-x)*.95);
/* 海面溫度剖面：深度 d（m）→ 水溫（°C），示意曲線 */
const tempAt=d=>5+21/(1+Math.pow(d/250,2.2));
function oceanScene(){
  landSky(SURF,{sun:{x:1180,y:110},clouds:false});
  const g=ctx.createLinearGradient(0,SURF,0,BEDF);g.addColorStop(0,'#4aa6b0');g.addColorStop(.25,'#2a7fa0');g.addColorStop(.6,'#14486a');g.addColorStop(1,'#0a2c47');
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-200,1000);for(let x=-200;x<=COASTX+80;x+=10)ctx.lineTo(x,SURF+3*Math.sin(x*.03-TT*2)+2*Math.sin(x*.011+TT));ctx.lineTo(COASTX+80,1000);ctx.closePath();ctx.fill();
  const wg=ctx.createLinearGradient(0,SURF,0,SURF+130);wg.addColorStop(0,'rgba(255,157,122,.35)');wg.addColorStop(1,'rgba(255,157,122,0)');ctx.fillStyle=wg;ctx.fillRect(-200,SURF,COASTX+280,130);
  poly([-200,1000,-200,BEDF,772,BEDF,COASTX,SURF,1380,SURF-14,1800,SURF-20,1800,1000],'#b59a6a');
  ln([-200,BEDF,772,BEDF,COASTX,SURF],'#9c845a',3);
  poly([COASTX,SURF,1380,SURF-14,1800,SURF-20,1800,SURF-6,1380,SURF+2],'#7a9a55');
  const R=rng(5);for(let i=0;i<14;i++){const x=-150+R()*900,y=BEDF+14+R()*120;circ(x,y,2+R()*3,'rgba(80,60,40,.35)');}
  fence(1500,1680,SURF-18);
}
function platform(x,len,bob){
  const y=SURF+bob;
  box(x-100,y-16,200,32,'#cfd6da','rgba(0,0,0,.35)',1);box(x-100,y+8,200,8,'#e8572a');
  box(x-70,y-58,74,42,'#e3e8ec','rgba(0,0,0,.3)',1);
  [18,58,98].forEach(dx=>{box(x+dx-8,y-84,30,68,'#c9d1d6','rgba(0,0,0,.3)',1);circ(x+dx+7,y-84,15,'#dfe5e8','rgba(0,0,0,.3)',1);});
  box(x-7,y+16,14,len,'#8d989f','rgba(0,0,0,.3)',1);
  if(len>20)box(x-17,y+16+len,34,14,'#6a747a','rgba(0,0,0,.35)',1);
}
function boat(x,y){poly([x-60,y-16,x+60,y-16,x+44,y+10,x-48,y+10],'#cfd6da','rgba(0,0,0,.35)',1);box(x-20,y-44,34,28,'#e3e8ec','rgba(0,0,0,.3)',1);box(x+34,y-50,5,34,'#8d989f');}
const P_CAB=[[TXP+100,SURF+10],[900,SURF+24],[1200,SURF+58],[1322,SURF+8]];
const P_BED=[[1300,SURF+34],[1150,bedY(1150)-6],[950,bedY(950)-6],[800,bedY(800)-6]];
const P_WARM=[[1200,SURF+22],[1300,SURF+24]];
/* 台灣輪廓（經緯度） */
const TW=[[121.5,25.3],[121.9,25.12],[122.0,25.0],[121.85,24.6],[121.8,24.3],[121.6,23.9],[121.5,23.4],[121.3,22.9],[121.0,22.6],[120.85,21.92],[120.7,22.0],[120.6,22.3],[120.3,22.55],[120.15,22.9],[120.1,23.1],[120.15,23.5],[120.3,23.9],[120.6,24.3],[120.8,24.6],[121.0,24.9],[121.2,25.1],[121.4,25.25]];

const EP={no:3,slug:'ocean-energy',seriesName:'海洋能系列',t:'海洋溫差發電',en:'Ocean thermal energy conversion',
lede:'熱帶與亞熱帶海洋的表層被太陽曬得溫暖，深處卻始終冰冷。海洋溫差發電（OTEC）就是利用這兩層海水的溫度差來發電。這一集從溫差的來源談起，看閉式朗肯循環如何用低沸點的氨推動渦輪，為什麼效率只有幾個百分點，冷水管如何鋪向深海，以及台灣東部陡峭海岸與黑潮帶來的條件。',
facts:[['約 20','°C','表層與深層海水至少約 20°C 的溫差才適合發電'],
['約 6.7','%','溫差 20°C 時的卡諾理論效率上限'],
['約 3','%','實際淨效率（典型範例，已扣除泵浦用電）'],
['105','kW','夏威夷 Makai 閉式循環示範機組，2015 年併網'],
['約 662','m','花蓮深層海水取水口深度（既有產業取水）'],
['約 1,000','m','台灣東部離岸 3 至 5 公里處的水深']],
note:'說明：本集為教育用途示意動畫，平台、冷水管與海岸坡度比例經過壓縮調整。表層約 26°C、深層約 5°C 與溫度剖面曲線為典型範例；溫差需約 20°C 以上、卡諾效率 η = ΔT／T_hot 與實際淨效率約 3% 為 OTEC 通用數值（扣除冷水泵與工作流體泵的用電後更低）；夏威夷 Makai 105 kW 閉式循環（氨）示範機組 2015 年併網取自 Makai 公開資料與 PRIMRE 資料庫；沖繩久米島 2013 年起進行 OTEC 試運轉取自縣府公開資訊；台灣東部離岸 3–5 公里水深可達 1,000 公尺、表深層溫差終年約 20°C，取自環評相關報告；花蓮深層海水取水口約 662 公尺取自台灣海洋深層水公司公開資料，該取水口供產業使用，並非發電設計值。毛發電與泵浦自用比例為示例。',
base:()=>oceanScene(),
shots:[
{t:'溫水與冷水之間的發電廠',en:'A power plant between warm and cold water',dur:13,side:true,
 d:'海洋溫差發電把海水的溫度差變成電力。台灣東部外海被黑潮暖流經過，表層海水終年約 26°C；水深一千公尺左右的海底則只有約 5°C。浮動式平台在海面抽取溫海水，同時用一條垂直放下的冷水管，從深處抽上冷海水。兩股水在平台上的熱交換器裡交會，溫度差推動內部循環，帶動渦輪發電機。電力再經海底電纜送上岸，併入電網。整個過程不燃燒任何燃料，只要海洋的溫差存在就能持續運轉。',
 s:[[0,'黑潮帶來終年溫暖的表層海水'],[.26,'一千公尺深處的海水只有約 5°C'],[.52,'平台同時抽取溫水與冷水，在熱交換器交會'],[.76,'溫差推動渦輪發電，電力經海纜上岸']],
 cam:u=>camMix({x:800,y:450,s:1},{x:640,y:560,s:1.15},ease(seg(u,.2,.6))),
 draw(u){platform(TXP,420*ease(seg(u,.26,.55)),3*Math.sin(TT*1.2));pl(P_CAB,'#1a1a1a',3);},
 fx(u){
  flowDots([[TXP-190,SURF+34],[TXP-100,SURF+34]],4,HOT,band(u,.5,1),.3,4.5);
  flowDots([[TXP,SURF+436],[TXP,SURF+26]],7,COLD,seg(u,.5,.56),.22,4.5);
  flowDots(P_CAB,8,PWR,band(u,.74,1),.25,4);
  lab(240,SURF+30,'表層溫水',{dx:-40,dy:60,st:'w',a:band(u,.0,.28)});
  lab(300,SURF+390,'深層冷水',{dx:0,dy:-60,st:'g',a:band(u,.24,.52)});
  lab(TXP+8,SURF+260,'冷水管',{dx:150,dy:0,st:'s',a:band(u,.4,.7)});
  lab(TXP+40,SURF-60,'浮動式平台',{dx:130,dy:-60,st:'s',a:band(u,.5,.76)});
  lab(900,SURF+24,'海底電纜',{dx:0,dy:90,st:'s',a:band(u,.74,1)});
  lab(1580,SURF-60,'岸上變電站',{dx:-40,dy:-50,st:'g',a:band(u,.78,1),minor:true});
 },
 hud(u){hudPanel(240,150,'水溫（示例）',seg(u,.05,.1),w=>{
  hrow(56,'表層','約 26 °C',w,HOT);hrow(88,'深層','約 5 °C',w,COLD);hrow(120,'溫差','約 21 °C',w,PWR);});}},

{t:'溫差從哪裡來',en:'Where the temperature difference comes from',dur:13,
 d:'海水的溫度隨深度快速下降。表層約一百公尺是被陽光與風攪動的混合層，溫度接近 26°C；往下穿過溫躍層，水溫迅速降低，到六百公尺以下只剩 5 到 7°C，這些冷水來自高緯度的極區，沿海底緩慢流向低緯度。表層與深層的溫差只要有 20°C 左右，就足以讓工作流體沸騰與冷凝。台灣東部海岸陡峭，離岸三到五公里水深就能達到一千公尺，加上黑潮暖流，是難得的好條件。',
 s:[[0,'表層混合層被太陽曬暖，約 26°C'],[.26,'穿過溫躍層，水溫快速下降'],[.5,'深層冷水來自極區，只有約 5°C'],[.76,'溫差約 20°C 以上才適合發電']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'一條海水柱',20,PWR,700);
  const cg=ctx.createLinearGradient(0,230,0,750);cg.addColorStop(0,'#e07a4a');cg.addColorStop(.3,'#2a7fa0');cg.addColorStop(1,'#0b3858');
  ctx.fillStyle=cg;ctx.fillRect(110,230,200,520);ctx.strokeStyle='rgba(255,255,255,.4)';ctx.lineWidth=1.2;ctx.strokeRect(110,230,200,520);
  [[0,'0 m'],[200,'200 m'],[600,'600 m'],[1000,'1,000 m']].forEach(([d,t])=>{const y=230+d*.52;ln([310,y,326,y],'rgba(255,255,255,.6)',1.5);wt(334,y+6,t,17,'rgba(227,236,238,.9)',600,'left',COND);});
  alphaDo(seg(u,.04,.1),()=>{tag(210,270,'表層混合層',{bg:'rgba(7,27,39,.85)',fg:HOT,size:18,align:'center'});wt(210,330,'約 26 °C',26,'#fff',700,'center',COND);});
  alphaDo(seg(u,.26,.32),()=>{tag(210,470,'溫躍層',{bg:'rgba(7,27,39,.85)',fg:PWR,size:18,align:'center'});});
  alphaDo(seg(u,.5,.56),()=>{tag(210,640,'深層冷水',{bg:'rgba(7,27,39,.85)',fg:COLD,size:18,align:'center'});wt(210,712,'約 5 °C',26,'#fff',700,'center',COND);});
  alphaDo(seg(u,.74,.8),()=>{arrow(620,250,620,740,PWR,3);arrow(620,740,620,250,PWR,3);card(520,430,230,110,{bg:'rgba(7,27,39,.92)',st:PWR});wt(635,478,'溫差',19,'#fff',700,'center');wt(635,522,'≥ 約 20 °C',30,PWR,700,'center',COND);});
  const c=chartBox(820,150,720,650,{title:'水溫隨深度（m）變化（示意）',x0:0,x1:30,y0:1000,y1:0,xt:[0,10,20,30],yt:[0,200,400,600,800,1000],xl:'水溫（°C）',gx:3,gy:5});
  const P=[];for(let i=0;i<=100;i++){const d=1000*i/100;P.push({x:c.X(tempAt(d)),y:c.Y(d)});}
  pathLine(partial(P,ease(seg(u,.04,.5))),'#7dc8dc',3.5);
  alphaDo(seg(u,.06,.12),()=>{circ(c.X(26),c.Y(0)+0,8,HOT);wt(c.X(26)-14,c.Y(0)+34,'26 °C',18,HOT,700,'right',COND);});
  alphaDo(seg(u,.5,.56),()=>{circ(c.X(tempAt(1000)),c.Y(1000),8,COLD);wt(c.X(tempAt(1000))+14,c.Y(1000)-14,'約 5–6 °C',18,COLD,700,'left',COND);});
  alphaDo(seg(u,.74,.8),()=>{ctx.setLineDash([6,6]);ln([c.X(26),c.Y(0),c.X(26),c.Y(1000)],'rgba(255,157,122,.7)',1.5);ln([c.X(5),c.Y(0),c.X(5),c.Y(1000)],'rgba(125,200,220,.7)',1.5);ctx.setLineDash([]);
   tag(c.X(15.5),c.Y(860),'溫差約 20 °C',{bg:PWR,fg:'#13232e',size:20,align:'center'});});
 }},

{t:'閉式朗肯循環',en:'The closed Rankine cycle',dur:15,
 d:'目前最成熟的做法是閉式循環。系統裡封著氨這類低沸點的工作流體，在蒸發器裡被溫海水加熱，沸騰成高壓蒸氣；蒸氣推動渦輪，帶動發電機；排出的低壓蒸氣進入冷凝器，被冷海水冷卻成液體；泵再把液體加壓送回蒸發器，完成一圈。海水只負責交換熱量，不會進入循環，渦輪裡流動的只有乾淨的工作流體。因為溫差很小，要靠很大的海水流量來補足熱量。',
 s:[[0,'蒸發器：溫海水把氨加熱成蒸氣'],[.26,'高壓蒸氣推動渦輪，帶動發電機'],[.5,'冷凝器：冷海水把蒸氣冷卻成液體'],[.76,'泵把液體加壓，送回蒸發器']],
 draw(u){
  diagBG();
  card(60,150,1480,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'閉式循環流程（示意）',20,PWR,700);
  const act=u<.25?0:u<.5?1:u<.75?2:3;
  /* 元件 */
  box(150,230,240,130,'rgba(255,157,122,.28)','rgba(255,157,122,.9)',2.5);wt(270,300,'蒸發器',22,'#fff',700,'center');
  circ(700,295,55,'#e3e8ec','rgba(0,0,0,.35)',1.5);wt(700,302,'渦輪',20,'#13232e',700,'center');box(756,266,96,58,'#c9d1d6','rgba(0,0,0,.35)',1.5);wt(804,302,'發電機',17,'#13232e',700,'center');
  box(560,540,280,130,'rgba(125,200,220,.28)','rgba(125,200,220,.9)',2.5);wt(700,610,'冷凝器',22,'#fff',700,'center');
  circ(270,605,34,'#e3e8ec','rgba(0,0,0,.35)',1.5);wt(270,612,'泵',20,'#13232e',700,'center');
  /* 管路 */
  const V=[[390,295],[645,295]],T=[[700,350],[700,540]],Lq=[[560,605],[304,605]],Up=[[270,571],[270,360]];
  pl(V,'rgba(255,157,122,.45)',8);pl(T,'rgba(255,157,122,.3)',8);pl(Lq,'rgba(125,200,220,.45)',8);pl(Up,'rgba(125,200,220,.45)',8);
  flowDots(V,5,HOT,act===0||act===1?1:.35,.3,5);flowDots(T,4,HOT,act===1||act===2?1:.35,.3,5);flowDots(Lq,5,COLD,act===2||act===3?1:.35,.3,5);flowDots(Up,4,COLD,act===3||act===0?1:.35,.3,5);
  /* 海水進出 */
  arrow(100,250,150,250,HOT,4);wt(100,226,'溫海水',18,HOT,700,'left');arrow(100,340,150,340,'rgba(255,157,122,.6)',3);
  arrow(1000,605,845,605,COLD,4);wt(1000,581,'冷海水',18,COLD,700,'right');
  wt(270,404,'氨：液體 → 蒸氣',17,HOT,600,'center');wt(700,716,'氨：蒸氣 → 液體',17,COLD,600,'center');
  /* 發電閃光 */
  alphaDo(seg(u,.26,.32),()=>{for(let i=0;i<3;i++)ln([876,284+i*14,900+(TT*40%20),284+i*14],PWR,3);wt(940,306,'電力',20,PWR,700,'left');});
  /* 右側步驟 */
  const S=[['1','蒸發','溫海水加熱，氨沸騰'],['2','膨脹','蒸氣推動渦輪發電'],['3','冷凝','冷海水帶走餘熱'],['4','加壓','泵送回蒸發器']];
  S.forEach(([n,t,s],i)=>{const y=240+i*128,on=act===i;card(1060,y,440,108,{bg:on?'rgba(242,194,48,.14)':'rgba(255,255,255,.04)',st:on?'rgba(242,194,48,.8)':'rgba(255,255,255,.12)'});
   circ(1104,y+54,24,on?PWR:'rgba(255,255,255,.2)');wt(1104,y+62,n,24,on?'#13232e':'#fff',700,'center',COND);
   wt(1148,y+46,t,22,on?PWR:'#fff',700,'left');wt(1148,y+82,s,17,'rgba(227,236,238,.85)',500,'left');});
  alphaDo(seg(u,.8,.86),()=>wt(540,770,'海水只交換熱量，不進入循環',19,'#7dffc4',700,'center'));
 }},

{t:'效率為什麼這麼低',en:'Why the efficiency is so low',dur:13,
 d:'熱機的效率受溫差限制：卡諾效率 η = ΔT／T_hot，其中溫度要用絕對溫度。表層 25°C（298 K）、深層 5°C 時，理論上限只有約 6.7%，一般火力電廠的蒸汽溫度高達數百度，效率因此高得多。實際運轉還有熱交換損失，並且要用大功率的泵抽取冷海水與循環工作流體，扣除自用電後，淨效率常常只有約 3%。換句話說，OTEC 靠的是「流量大、燃料免費、全年穩定」，而不是高效率。',
 s:[[0,'效率上限取決於溫差：η = ΔT／T_hot'],[.26,'溫差 20°C 時，理論上限約 6.7%'],[.5,'泵送大量海水要耗掉一部分發電量'],[.76,'扣除自用電後，淨效率約 3%']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});
  const c=chartBox(60,150,720,650,{title:'卡諾效率上限（%）與溫差',x0:0,x1:30,y0:0,y1:10,xt:[0,10,20,30],yt:[0,2,4,6,8,10],xl:'溫差 ΔT（°C）',gx:3,gy:5});
  const eta=dT=>100*dT/(278+dT+0);const P=[];for(let i=0;i<=60;i++){const d=30*i/60;P.push({x:c.X(d),y:c.Y(eta(d))});}
  pathLine(partial(P,ease(seg(u,.04,.5))),'#7dc8dc',3.5);
  alphaDo(seg(u,.26,.32),()=>{const x=c.X(20),y=c.Y(eta(20));ln([x,y,x,c.Y(0)],PWR,1.5);ln([x,y,c.X(0),y],PWR,1.5);circ(x,y,8,PWR);wt(x+14,y+30,'約 6.7%',24,PWR,700,'left',COND);});
  alphaDo(seg(u,.76,.82),()=>{const x=c.X(20),y=c.Y(3);circ(x,y,8,'#7dffc4');wt(x-14,y+8,'淨效率約 3%',20,'#7dffc4',700,'right');});
  card(820,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(844,196,'發電量的去處（典型範例）',20,PWR,700);
  const bx=900,bw=560;
  box(bx,260,bw,70,'rgba(255,255,255,.08)');box(bx,260,bw*ease(seg(u,.1,.3)),70,'#58b8d0');wt(bx,246,'毛發電量',18,'#7dc8dc',700,'left');wt(bx+bw,246,'100',24,'#fff',700,'right',COND);
  const pa=ease(seg(u,.5,.7));
  box(bx,400,bw,70,'rgba(255,255,255,.08)');box(bx,400,bw*.3*pa,70,'#e8572a');wt(bx,386,'泵浦與設備自用',18,'#ff8a60',700,'left');wt(bx+bw,386,'約 30',24,'#fff',700,'right',COND);
  box(bx,540,bw,70,'rgba(255,255,255,.08)');box(bx,540,bw*.7*ease(seg(u,.72,.9)),70,'#7dffc4');wt(bx,526,'淨輸出',18,'#7dffc4',700,'left');wt(bx+bw,526,'約 70',24,'#fff',700,'right',COND);
  alphaDo(seg(u,.8,.88),()=>{card(900,650,560,100,{bg:'rgba(242,194,48,.12)',st:'rgba(242,194,48,.6)'});wt(1180,692,'流量大、燃料免費、全年穩定',22,PWR,700,'center');wt(1180,730,'基載電力，而非高效率',19,'rgba(227,236,238,.9)',600,'center');});
 }},

{t:'冷水管如何鋪向深海',en:'Laying the cold water pipe to the deep',dur:13,side:true,
 d:'冷水管是整座電廠最大的工程挑戰。要抽上足夠的冷水，管徑動輒數公尺，長度數公里，還得抵抗海流與颱風的拉扯。岸基式電廠利用台灣東部陡峭的海岸，讓管線沿著海床坡面一路鋪向一千公尺深處，工作船沿路放管並固定；溫海水則由岸邊淺處取水。管線重量要平衡浮力，才不會被洋流推離位置。深層冷水本身富含營養鹽、乾淨，抽上來還能用於水產養殖與冷卻。',
 s:[[0,'岸基式電廠建在陡峭的海岸邊'],[.26,'工作船沿海床坡面放下冷水管'],[.52,'管口深入約一千公尺的冷水層'],[.76,'冷、溫兩股海水送進岸上熱交換器']],
 cam:u=>camMix({x:900,y:470,s:1},{x:1000,y:520,s:1.12},ease(seg(u,.1,.6))),
 draw(u){
  const f=ease(seg(u,.1,.52));
  pl(P_WARM,'#c8553d',9);
  pl(part(P_BED,f),'#8d989f',11);
  const e=ptAt(P_BED,f),bx=e[0];
  boat(bx,SURF-4+3*Math.sin(TT*1.3));ln([bx,SURF+8,e[0],e[1]],'rgba(255,255,255,.5)',1.2);
  cabinet(1480,SURF-20,90,56,'#dfe5e8');box(1590,SURF-80,64,60,'#c9d1d6','rgba(0,0,0,.3)',1);circ(1622,SURF-80,32,'#dfe5e8','rgba(0,0,0,.3)',1);
 },
 fx(u){
  const Pc=[P_BED[3],P_BED[2],P_BED[1],P_BED[0]];
  flowDots(Pc,8,COLD,seg(u,.56,.62),.2,4.5);
  flowDots([[1200,SURF+22],[1300,SURF+24]],4,HOT,seg(u,.56,.62),.3,4.5);
  lab(1250,SURF+22,'溫水取水口',{dx:-70,dy:-70,st:'w',a:band(u,.52,.9)});
  lab(1040,bedY(1040)-6,'冷水管沿海床鋪設',{dx:-110,dy:-40,st:'s',a:band(u,.2,.6)});
  lab(810,bedY(810)-6,'深層取水口（約 1,000 m）',{dx:-20,dy:-80,st:'g',a:band(u,.4,.76)});
  lab(1600,SURF-100,'岸上發電廠',{dx:-60,dy:-50,st:'g',a:band(u,.0,.3),minor:true});
 },
 },

{t:'台灣東部與示範案例',en:'Eastern Taiwan and demonstration plants',dur:14,
 d:'台灣東部海岸陡峭，離岸三到五公里水深就可達一千公尺，加上黑潮暖流經過，表層與深層水溫差終年約 20°C，被認為有發展溫差能的潛力。花蓮與臺東早已設有深層海水取水口，例如花蓮的取水口深約 662 公尺，供養殖、飲用水與產業使用，證明深海取水在這片海域可行。國外方面，夏威夷 Makai 的 105 kW 閉式循環示範機組在 2015 年併網，日本沖繩久米島也在 2013 年起進行試運轉。',
 s:[[0,'黑潮沿著台灣東岸向北流動'],[.26,'東部海岸陡峭，離岸不遠就是深海'],[.5,'花蓮已有深約 662 公尺的取水口'],[.76,'夏威夷與沖繩已有示範機組運轉']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'台灣東部海域（示意）',20,PWR,700);
  const MX=l=>120+(l-119)*170,MY=a=>190+(25.6-a)*140;
  const pts=[];TW.forEach(([l,a])=>pts.push(MX(l),MY(a)));poly(pts,'rgba(122,154,85,.6)','rgba(227,236,238,.7)',2);
  alphaDo(seg(u,.02,.1),()=>{for(let i=0;i<5;i++){const p=(TT*.4+i/5)%1;alphaDo(1-Math.abs(p-.5)*2,()=>arrow(MX(122.3),MY(22.4+p*2.4),MX(122.3),MY(22.7+p*2.4),HOT,3));}wt(MX(122.3)+8,MY(24.7),'黑潮',18,HOT,700,'left');});
  const site=(l,a,t,col,t0,dx,dy)=>{const sa=seg(u,t0,t0+.06);if(sa<=0)return;const x=MX(l),y=MY(a),p=(TT*.8)%1;
   alphaDo(sa,()=>{alphaDo(1-p,()=>ring(x,y,8+16*p,col,2));circ(x,y,7,col);wt(x+dx,y+dy,t,18,col,700,'right');});};
  site(121.6,23.97,'花蓮',PWR,.5,-16,-6);
  site(121.15,22.76,'臺東',PWR,.58,-16,-6);
  alphaDo(seg(u,.26,.32),()=>{ctx.setLineDash([6,6]);ln([MX(121.7),MY(24.2),MX(122.05),MY(24.2)],'rgba(125,200,220,.8)',1.5);ctx.setLineDash([]);wt(MX(121.75),MY(24.2)+22,'離岸 3–5 km',16,COLD,700,'left');wt(MX(121.75),MY(24.2)+42,'水深可達 1,000 m',16,COLD,700,'left');});
  const R=[['東部海域溫差','約 20 °C','表層與深層終年',.26,HOT],['花蓮深層水取水口','約 662 m','養殖、飲用與產業用',.5,'#7dffc4'],['夏威夷 Makai','105 kW','閉式循環，2015 年併網',.76,PWR],['沖繩久米島','2013 起','OTEC 試運轉',.86,COLD]];
  R.forEach(([t,v,s,t0,col],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=160+i*162;card(820,y,720,146,{bg:'rgba(7,27,39,.75)'});box(820,y,8,146,col);wt(850,y+44,t,19,'rgba(227,236,238,.9)',600);
   wt(850,y+106,v,40,col,700,'left',COND);wt(1510,y+106,s,17,'rgba(227,236,238,.8)',500,'right');}));
 }}
]};
