// KITS: land
/* 氫能系列 第 9 集：綠氨與哈柏法 */
const gyy=x=>groundY(x);
const SUN={x:1180,y:120};
const H2C='#7dffc4',WC='#58b8d0',EC='#f2c230',HC='#ff8a60',CC='#7dc8dc',PC='#b37cff',NC='#8fb4ff';
function pipeDots(P,n,col,sp,r){const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));const T=L[L.length-1];
  for(let k=0;k<n;k++){const d=(((TT*sp)+k/n)%1)*T;let i=1;while(i<L.length-1&&L[i]<d)i++;const f=(d-L[i-1])/(L[i]-L[i-1]);circ(lerp(P[i-1][0],P[i][0],f),lerp(P[i-1][1],P[i][1],f),r||5,col);}}
function vessel(x,g,w,h,fill,col){rrp(x,g-h,w,h,w/2.4);ctx.fillStyle='#10354a';ctx.fill();
  if(fill>0){ctx.save();rrp(x,g-h,w,h,w/2.4);ctx.clip();ctx.fillStyle=col;ctx.globalAlpha=.4;ctx.fillRect(x,g-h*fill,w,h*fill);ctx.restore();}
  rrp(x,g-h,w,h,w/2.4);ctx.strokeStyle='#aeb8be';ctx.lineWidth=5;ctx.stroke();}
function tower(x,g,w,h){rrp(x,g-h,w,h,w/2.6);ctx.fillStyle='#9aa6ad';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=2;ctx.stroke();
  for(let i=1;i<6;i++)ln([x+8,g-h+i*h/6,x+w-8,g-h+i*h/6],'rgba(0,0,0,.2)',2);}

const EP={no:9,slug:'hydrogen',seriesName:'氫能系列',t:'綠氨：把氫變成氨的哈柏法',en:'Green ammonia: the Haber-Bosch process',
lede:'氫很輕、很難運，但把它和空氣中的氮結合，就變成氨：常壓下冷到零下 33°C，或加壓到約 8.6 bar 就成液體。哈柏法在高溫高壓與鐵觸媒下合成氨，用綠氫做原料，就是綠氨，可作肥料、船舶燃料或氫的載體。',
facts:[['約 17.8','％（質量）','氨 NH₃ 中氫的質量占比，每噸氨約含 177 kg 氫'],
['約 −33','°C','氨在常壓下的沸點；20°C 加壓約 8.6 bar 即可液化儲存'],
['400–500','°C','哈柏法反應器溫度的典型範圍，壓力約 150–300 bar'],
['約 120','kg H₂／m³','液氨的體積儲氫密度，高於液氫約 71 與 700 bar 氣態氫約 40'],
['約 20','％','單次通過反應器的轉化率（典型範例），未反應氣體要循環回去'],
['約 10','MWh／t 氨','綠氨耗電的典型範例，其中約 9 成用在電解製氫']],
note:'說明：本集為教育用途示意動畫，設備外觀與比例經過調整。氨含氫約 17.8％（以原子量計算）、沸點 −33°C、20°C 蒸氣壓約 8.6 bar 為物性數據；哈柏法 400–500°C、150–300 bar、鐵觸媒為常見操作範圍；單次轉化率約 20％、200 bar 下平衡轉化率（400°C 約 48％、450°C 約 36％、500°C 約 24％）與每噸氨約 10 MWh 皆為典型範例，各文獻有差異（綠氨電耗常見 9–11 MWh／t）；電解以約 52 kWh／kg 氫估算，與第 7 集一致。氣態與液態氫密度以 700 bar 約 40、液氫約 71 kg／m³ 比較。台灣的氨能應用仍在評估與示範階段，不涉及特定案場數據。',
base:()=>{landSky(GY,{sun:SUN,clouds:true});drawGround();},
shots:[
{t:'為什麼把氫變成氨',en:'Why turn hydrogen into ammonia',dur:13,
 d:'氫氣的體積能量密度很低：要壓到 700 bar 才約 40 公斤氫／立方公尺，液化要冷到零下 253°C，約 71。氨是氮與氫的化合物，每個分子帶 3 個氫原子，質量占比約 17.8％。氨在常壓下冷到零下 33°C 就變成液體，或在 20°C 加壓到約 8.6 bar 液化，液氨約含 120 公斤氫／立方公尺，儲存與海運技術早已成熟。',
 s:[[0,'氫很輕，壓到 700 bar 每立方公尺也只裝約 40 公斤'],[.3,'液氫要冷到零下 253°C，約 71 公斤'],[.58,'液氨每立方公尺約含 120 公斤氫'],[.82,'氨零下 33°C 或加壓約 8.6 bar 就能液化']],
 draw(u){
  diagBG();
  card(60,160,900,600,{bg:'rgba(7,27,39,.75)'});wt(90,208,'每立方公尺能裝多少氫（kg H₂／m³）',22,EC,700);
  const rows=[['700 bar 氣態氫',40,CC,.06],['液氫（−253°C）',71,PC,.26],['液氨（−33°C 或約 8.6 bar）',120,H2C,.46]];
  rows.forEach(([n,v,col,t0],i)=>{const y=290+i*140,k=ease(seg(u,t0,t0+.14));
   alphaDo(seg(u,t0,t0+.04),()=>wt(90,y,n,22,'rgba(227,236,238,.95)',700));
   if(k>0){const w=Math.max(4,640*(v/130)*k);box(90,y+16,w,54,col);if(k>.9)wt(90+w+14,y+58,trf('約 {n}',{n:v}),30,'#fff',800,'left',COND);}});
  card(1000,160,540,600,{bg:'rgba(7,27,39,.75)'});wt(1030,208,'氨 NH₃',30,H2C,800);
  alphaDo(seg(u,.5,.58),()=>{circ(1130,350,34,NC,'#fff',3);wt(1130,362,'N',30,'#0e2a3b',800,'center');
   [[1050,290],[1210,290],[1130,440]].forEach(([x,y])=>{ln([1130,350,x,y],'#cfd8dc',5);circ(x,y,20,H2C,'#fff',3);wt(x,y+8,'H',20,'#0e2a3b',800,'center');});});
  alphaDo(seg(u,.62,.7),()=>{tag(1030,520,'氫占質量約 17.8％',{bg:EC,fg:'#0e2a3b',size:24});});
  alphaDo(seg(u,.72,.8),()=>{tag(1030,590,'沸點 −33°C（常壓）',{bg:'rgba(0,0,0,.35)',fg:CC,size:22});});
  alphaDo(seg(u,.8,.88),()=>{tag(1030,650,'20°C 約 8.6 bar 液化',{bg:'rgba(0,0,0,.35)',fg:CC,size:22});});
 }},

{t:'空氣分離：先取得氮氣',en:'Air separation: getting the nitrogen',dur:13,side:true,
 d:'氨的另一半原料是氮，而空氣有 78％是氮。空氣分離廠先把空氣過濾、壓縮並冷卻到約零下 190°C 以下使它液化，再在蒸餾塔裡分離：氮的沸點約零下 196°C，氧約零下 183°C，沸點不同就能分開。純氮送往合成廠，氧氣可以另外利用或排放。電解槽則供應另一半原料氫氣，兩者以 1 比 3 的比例送進合成迴路。',
 s:[[0,'空氣有 78％是氮、21％是氧'],[.3,'壓縮並冷卻到約零下 190°C，空氣液化'],[.58,'蒸餾塔依沸點分離：氮約 −196°C，氧約 −183°C'],[.82,'純氮與綠氫以 1 比 3 送往合成迴路']],
 draw(u){
  const g=gyy(700),X=560,W=170,H=330;
  for(let i=0;i<3;i++)solarPanel(60+i*92,gyy(60+i*92),84,24,{h:46,glint:true});
  box(160,g-110,170,110,'#dfe5e8','rgba(0,0,0,.3)',1.5);box(160,g-110,170,14,'#1f7f99');wt(245,g-40,'電解槽',22,'#0e2a3b',700,'center');
  const PH=[[330,g-60],[1040,g-60],[1040,g-90]];
  ln(PH.flat(),H2C,8);alphaDo(seg(u,.6,.7),()=>pipeDots(PH,7,H2C,.2,4));
  /* 進氣與壓縮 */
  box(240,g-250,90,70,'#6c777e','rgba(0,0,0,.3)',1.5);wt(285,g-207,'壓縮冷卻',18,'#fff',700,'center');
  const PA=[[120,g-215],[240,g-215]];ln(PA.flat(),CC,8);alphaDo(seg(u,.02,.1),()=>pipeDots(PA,4,'#e6f6fb',.3,4));
  const PB=[[330,g-215],[X,g-215]];ln(PB.flat(),'#9fd0e8',8);alphaDo(seg(u,.28,.38),()=>pipeDots(PB,4,'#cfeaff',.3,4));
  tower(X,g,W,H);
  const lv=seg(u,.32,.6);
  ctx.save();rrp(X,g-H,W,H,W/2.6);ctx.clip();ctx.fillStyle='rgba(143,180,255,.35)';ctx.fillRect(X,g-H*.55*lv-20,W,H*.55*lv+20);ctx.restore();
  alphaDo(seg(u,.4,.75),()=>{for(let i=0;i<8;i++){const f=(TT*.2+i/8)%1;circ(X+30+(i%4)*36,g-30-f*(H-60),4,i%2?NC:'#ff9d7a');}});
  const PN=[[X+W/2,g-H-2],[X+W/2,g-H-40],[1040,g-H-40],[1040,g-250]];
  ln(PN.flat(),NC,8);alphaDo(seg(u,.6,.7),()=>pipeDots(PN,8,'#dbe6ff',.18,4));
  box(960,g-250,160,160,'#8a969e','rgba(0,0,0,.35)',1.5);wt(1040,g-158,'合成迴路',24,'#fff',700,'center');
  alphaDo(seg(u,.55,.75),()=>{for(let i=0;i<3;i++){const f=(TT*.2+i/3)%1;alphaDo(1-f,()=>circ(X+W+20+f*40,g-H*.25-f*70,6,'#ff9d7a'));}});
  alphaDo(seg(u,.02,.12),()=>{ln([60,g-300,560,g-300],'rgba(0,0,0,0)',1);});
  alphaDo(band(u,.02,.3),()=>{box(130,g-345,300,16,'rgba(255,255,255,.18)');box(130,g-345,300*.78,16,NC);wt(130,g-355,'空氣：氮 78％',18,'#fff',700);wt(440,g-332,'氧 21％',18,'#ff9d7a',700);});
  lab(285,g-250,'壓縮冷卻到約 −190°C',{dx:-10,dy:-90,a:band(u,.25,.6)});
  lab(X+W/2,g-H*.5,'蒸餾塔',{dx:-240,dy:-140,a:band(u,.35,.8)});
  lab(X+W/2,g-H-40,'氮氣 N₂',{dx:-120,dy:-60,st:'s',a:band(u,.55,1)});
  lab(245,g-110,'氫氣 H₂',{dx:-20,dy:80,st:'g',a:band(u,.6,1)});
 },
 hud(u){hudPanel(270,128,'分離（示例）',seg(u,.05,.1),w=>{const v=lerp(25,-190,ease(seg(u,.2,.5)));
  hrow(56,'空氣溫度',trf('{n} °C',{n:Math.round(v)}),w,CC);hbar(14,68,w-28,(25-v)/215,CC);hrow(106,'氮：氫','1 : 3',w,H2C);});}},

{t:'哈柏法合成迴路',en:'The Haber-Bosch synthesis loop',dur:14,side:true,
 d:'氮與氫先壓縮到約 150 到 300 bar，加熱後通過裝有鐵觸媒的反應器，在約 400 到 500°C 反應成氨：N₂ + 3H₂ → 2NH₃。反應放熱，熱量可回收產生蒸汽。但單次通過只有約 20％轉成氨，所以氣體要冷卻，讓氨凝結成液體分離出來，剩下的氮氫混合氣再加壓送回反應器，反覆循環直到幾乎全部轉成氨。',
 s:[[0,'氮氫混合氣壓縮到約 150–300 bar'],[.3,'通過鐵觸媒，在 400–500°C 反應成氨'],[.58,'冷卻後氨凝結成液體，從分離器取出'],[.82,'未反應的氮氫氣體加壓送回反應器循環']],
 draw(u){
  const g=gyy(700);
  box(130,g-110,130,110,'#6c777e','rgba(0,0,0,.35)',1.5);wt(195,g-45,'壓縮機',22,'#fff',700,'center');
  const P0=[[40,g-60],[130,g-60]];ln(P0.flat(),'#b9d8c8',8);alphaDo(seg(u,.02,.1),()=>pipeDots(P0,3,H2C,.3,4));
  const P1=[[260,g-60],[400,g-60],[400,g-120],[520,g-120]];ln(P1.flat(),'#ffb070',8);alphaDo(seg(u,.1,.25),()=>pipeDots(P1,5,'#ffe0a0',.22,4));
  box(520,g-420,170,420,'#8a969e','rgba(0,0,0,.35)',1.5);
  const rg=seg(u,.2,.4);
  alphaDo(rg,()=>{box(536,g-330,138,170,'#6e5a4a');for(let i=0;i<20;i++){const R=rng(i+7);circ(548+R()*114,g-320+R()*150,5,'#c9d3d8');}
   for(let i=0;i<6;i++){const f=(TT*.2+i/6)%1;circ(560+(i%3)*50,g-160-f*160,5,i%2?H2C:'#ff9d7a');}});
  alphaDo(seg(u,.3,.5),()=>{const fl=.5+.2*Math.sin(TT*6);alphaDo(fl,()=>box(536,g-330,138,170,'#ff7a30'));});
  const P2=[[690,g-380],[790,g-380],[790,g-180],[900,g-180]];ln(P2.flat(),'#ffb070',8);alphaDo(seg(u,.4,.5),()=>pipeDots(P2,5,'#ff9d7a',.22,4));
  box(900,g-250,100,140,'#9bb7c2','rgba(0,0,0,.3)',1.5);wt(950,g-170,'冷凝',20,'#0e2a3b',700,'center');
  vessel(1080,g,150,250,seg(u,.5,.9)*.7,'#9ff0c8');wt(1155,g-120,'液氨',24,'#fff',800,'center');
  const P3=[[1000,g-180],[1080,g-180]];ln(P3.flat(),CC,8);alphaDo(seg(u,.52,.6),()=>pipeDots(P3,3,'#e6f6fb',.25,4));
  const P4=[[950,g-250],[950,g-480],[195,g-480],[195,g-110]];ln(P4.flat(),NC,6);alphaDo(seg(u,.7,.8),()=>pipeDots(P4,10,'#dbe6ff',.15,4));
  alphaDo(band(u,.04,.5),()=>tag(720,g-445,'N₂ + 3H₂ → 2NH₃',{bg:EC,fg:'#0e2a3b',size:26}));
  lab(195,g-110,'壓縮到 150–300 bar',{dx:30,dy:-150,a:band(u,.05,.4)});
  lab(600,g-250,'鐵觸媒反應器',{dx:-330,dy:-130,a:band(u,.25,.7)});
  lab(950,g-250,'冷卻凝結',{dx:50,dy:-100,a:band(u,.45,.8)});
  lab(800,g-480,'未反應氣體循環回去',{dx:0,dy:-40,st:'s',a:band(u,.7,1)});
 },
 hud(u){hudPanel(270,128,'反應器（示例）',seg(u,.05,.1),w=>{const v=lerp(25,450,ease(seg(u,.15,.45)));const p=lerp(1,200,ease(seg(u,.05,.25)));
  hrow(56,'溫度',trf('{n} °C',{n:Math.round(v)}),w,HC);hbar(14,68,w-28,v/500,HC);hrow(106,'壓力',trf('{n} bar',{n:Math.round(p)}),w,EC);});}},

{t:'溫度與壓力的拉鋸',en:'The temperature–pressure trade-off',dur:14,
 d:'合成氨是放熱反應，也是分子數減少的反應：4 個分子變成 2 個。所以壓力越高、溫度越低，平衡時氨的比例越高。但溫度太低，反應慢得沒有意義。以 200 bar 為例，平衡轉化率約在 400°C 為 48％、450°C 為 36％、500°C 為 24％。鐵觸媒讓反應在約 450°C 就夠快，工廠於是選高壓、中溫，再用循環補足單次轉化率不高的缺點。',
 s:[[0,'合成氨放熱，而且 4 個分子變成 2 個'],[.3,'壓力越高、溫度越低，平衡時氨越多'],[.58,'200 bar 下：400°C 約 48％，500°C 只剩約 24％'],[.82,'鐵觸媒讓 450°C 就夠快，再靠循環補足轉化率']],
 draw(u){
  diagBG();
  card(60,160,820,600,{bg:'rgba(7,27,39,.75)'});wt(90,208,'200 bar 下的平衡轉化率（典型範例）',22,EC,700);
  const rows=[['400°C',48,CC,.3],['450°C',36,EC,.42],['500°C',24,HC,.54]];
  rows.forEach(([n,v,col,t0],i)=>{const y=290+i*140,k=ease(seg(u,t0,t0+.12));
   alphaDo(seg(u,t0,t0+.04),()=>wt(90,y,n,24,'rgba(227,236,238,.95)',700));
   if(k>0){const w=Math.max(4,560*(v/60)*k);box(90,y+16,w,54,col);if(k>.9)wt(90+w+14,y+58,trf('約 {n}％',{n:v}),30,'#fff',800,'left',COND);}});
  card(920,160,620,600,{bg:'rgba(7,27,39,.75)'});wt(950,208,'工廠怎麼取捨',22,EC,700);
  const L=[['壓力高：平衡有利，設備貴',PC,.06],['溫度低：平衡有利，反應慢',CC,.2],['鐵觸媒：約 450°C 就夠快',H2C,.66],['循環：未轉化的氣體再利用',NC,.76]];
  L.forEach(([a,col,t0],i)=>alphaDo(seg(u,t0,t0+.07),()=>{circ(965,290+i*105,13,col,'#fff',2);wt(995,300+i*105,a,23,'rgba(227,236,238,.95)',600);}));
  alphaDo(seg(u,.1,.18),()=>wt(950,680,'N₂ + 3H₂ ⇌ 2NH₃（放熱）',24,HC,700));
 }},

{t:'綠氨廠的電力緩衝',en:'Buffering variable power',dur:14,side:true,
 d:'綠氨廠的電來自太陽光電與風電，出力一天內起伏很大，電解槽跟著變動。但哈柏法的合成迴路偏好穩定運轉，頻繁大幅升降載會使觸媒與設備受熱應力。常見做法是在電解槽與合成塔之間加氫氣儲槽當緩衝：電多的時候多產氫並存起來，電少的時候由儲槽補，讓合成塔維持在平穩的負載。也可搭配電池或併網，並設定可降載的最低負載。',
 s:[[0,'風光發電起伏，電解槽的產氫量跟著變'],[.3,'氫氣儲槽當緩衝，電多時存起來'],[.58,'電少時由儲槽補氫，合成塔負載維持平穩'],[.82,'也可搭配電池或併網，降低起伏']],
 draw(u){
  const g=gyy(700);
  for(let i=0;i<3;i++)solarPanel(50+i*92,gyy(50+i*92),84,24,{h:46,glint:true});
  const pw=.5+.45*Math.sin(u*9);
  box(150,g-110,170,110,'#dfe5e8','rgba(0,0,0,.3)',1.5);box(150,g-110,170,14,'#1f7f99');wt(235,g-40,'電解槽',22,'#0e2a3b',700,'center');
  const P1=[[320,g-60],[480,g-60]];ln(P1.flat(),H2C,8);alphaDo(seg(u,.05,.12),()=>pipeDots(P1,2+Math.round(pw*3),H2C,.25,4));
  const buf=.45+.4*Math.sin(u*9-.6);
  vessel(480,g,180,230,seg(u,.2,.3)*buf,H2C);wt(570,g-100,'氫氣儲槽',22,'#fff',800,'center');
  const P2=[[660,g-60],[800,g-60]];ln(P2.flat(),H2C,8);alphaDo(seg(u,.3,.4),()=>pipeDots(P2,4,H2C,.2,4));
  box(800,g-300,170,300,'#8a969e','rgba(0,0,0,.35)',1.5);wt(885,g-140,'合成塔',24,'#fff',800,'center');
  alphaDo(seg(u,.4,.5),()=>{for(let i=0;i<5;i++){const f=(TT*.2+i/5)%1;circ(830+(i%3)*50,g-20-f*240,5,i%2?H2C:'#ff9d7a');}});
  box(1060,g-190,110,190,'#9bb7c2','rgba(0,0,0,.3)',1.5);wt(1115,g-90,'儲氨槽',22,'#0e2a3b',800,'center');
  const P3=[[970,g-100],[1060,g-100]];ln(P3.flat(),CC,8);alphaDo(seg(u,.5,.6),()=>pipeDots(P3,3,'#e6f6fb',.25,4));
  /* 曲線 */
  alphaDo(seg(u,.02,.1),()=>{card(1220,200,320,250,{bg:'rgba(7,27,39,.75)'});
   ctx.beginPath();for(let i=0;i<=60;i++){const x=1240+i*4.6,y=330-(.5+.45*Math.sin(i/60*9))*90;i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
   ctx.strokeStyle=EC;ctx.lineWidth=4;ctx.stroke();wt(1240,236,'風光電力（起伏）',18,EC,700);
   alphaDo(seg(u,.55,.65),()=>{ln([1240,400,1516,400],NC,4);wt(1240,432,'合成塔負載（平穩）',18,NC,700);});});
  lab(235,g-110,'電解槽',{dx:-80,dy:-130,st:'s',a:band(u,.03,.4)});
  lab(570,g-230,'緩衝：電多存、電少補',{dx:-60,dy:-110,a:band(u,.2,.75)});
  lab(885,g-300,'合成塔維持平穩',{dx:-20,dy:-60,st:'w',a:band(u,.5,1)});
 },
 hud(u){hudPanel(270,128,'負載（示例）',seg(u,.05,.1),w=>{const e=Math.round(100*(.5+.45*Math.sin(u*9)));
  hrow(56,'電解槽',trf('{n} ％',{n:e}),w,EC);hbar(14,68,w-28,e/100,EC);hrow(106,'合成塔',trf('{n} ％',{n:70}),w,NC);});}},

{t:'一噸氨要多少電，去哪裡用',en:'Power per tonne of ammonia and where it goes',dur:14,
 d:'每噸氨含約 177 公斤氫。以電解約 52 kWh／公斤估算，製氫就需約 9.2 MWh，再加上空氣分離、壓縮與合成，總計約 10 MWh，常見範圍 9 到 11 MWh。所以綠氨的成本與碳排主要由電力決定。綠氨的出路包括：製造肥料、當作低碳船舶燃料、發電混燒，或當作氫載體運到遠方再裂解回氫，但裂解要再耗能。台灣的氨能應用仍在評估與示範階段。',
 s:[[0,'每噸氨含約 177 公斤氫，製氫約耗電 9.2 MWh'],[.3,'加上空分、壓縮與合成，總計約 10 MWh'],[.58,'成本與碳排主要由電力決定'],[.82,'用途：肥料、船舶燃料、發電混燒、氫載體']],
 draw(u){
  diagBG();
  card(60,160,700,600,{bg:'rgba(7,27,39,.75)'});wt(90,208,'每噸氨的耗電（示例）',22,EC,700);
  const bx=100,bw=620;
  alphaDo(seg(u,.04,.1),()=>{wt(bx,300,'電解製氫（約 177 kg H₂）',20,H2C,700);const k=ease(seg(u,.04,.22));box(bx,316,bw*(9.2/10)*k,54,H2C);if(k>.9)wt(bx+bw*(9.2/10)-12,358,'9.2',28,'#0e2a3b',800,'right',COND);});
  alphaDo(seg(u,.26,.32),()=>{wt(bx,440,'空氣分離、壓縮與合成',20,EC,700);const k=ease(seg(u,.26,.4));box(bx,456,bw*(.8/10)*k,54,EC);if(k>.9)wt(bx+bw*(.8/10)+14,498,'0.8',28,'#fff',800,'left',COND);});
  alphaDo(seg(u,.38,.44),()=>{ln([bx,560,bx+bw,560],'rgba(227,236,238,.5)',2);tag(bx,590,'合計約 10 MWh',{bg:EC,fg:'#0e2a3b',size:28});wt(bx,672,'常見範圍 9–11 MWh／t 氨',20,'rgba(227,236,238,.9)',500);});
  card(800,160,740,600,{bg:'rgba(7,27,39,.75)'});wt(830,208,'綠氨的出路',22,EC,700);
  const U=[['肥料','最大宗用途，氨是氮肥原料',H2C,.56],['船舶燃料','低碳航運的候選燃料',CC,.64],['發電混燒','與煤或燃氣混燒降碳',HC,.72],['氫載體','運到遠方再裂解，裂解要耗能',PC,.8]];
  U.forEach(([a,b,col,t0],i)=>alphaDo(seg(u,t0,t0+.07),()=>{const y=250+i*120;card(830,y,680,100,{bg:'rgba(0,0,0,.3)'});tag(850,y+22,a,{bg:col,fg:'#0e2a3b',size:24});wt(1010,y+62,b,22,'rgba(227,236,238,.95)',500);}));
 }}
]};
