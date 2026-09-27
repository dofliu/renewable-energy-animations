// KITS: land
/* 氫能系列 第 2 集：燃料電池 */
const gyy=x=>groundY(x);
const SUN={x:1180,y:120};
const H2C='#7dffc4',O2C='#b37cff',WC='#58b8d0',EC='#f2c230',HC='#ff8a60';   // 氫氣、氧氣、水、電、熱
const DSP=400;                                     // 加氫機位置
/* 沿折線 P（[[x,y],…]）取比例 f 的點 */
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,sp,r){if(a<=0)return;for(let k=0;k<n;k++){const f=((TT*(sp||.3))+k/n)%1,p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4.5,col));}}
function pl(P,col,lw){const a=[];P.forEach(p=>a.push(p[0],p[1]));ln(a,col,lw);}
/* 道路 */
function road(){ctx.beginPath();for(let x=-400;x<=2000;x+=20)ctx.lineTo(x,gyy(x)-2);for(let x=2000;x>=-400;x-=20)ctx.lineTo(x,gyy(x)+16);ctx.closePath();ctx.fillStyle='#3d4448';ctx.fill();
  ctx.setLineDash([26,22]);ctx.beginPath();for(let x=-400;x<=2000;x+=20)ctx.lineTo(x,gyy(x)+8);ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);}
/* 遠景建築 */
function skyline(){const R=rng(21);for(let i=0;i<14;i++){const x=640+i*72+R()*20,h=60+R()*120,w=46+R()*24;box(x,gyy(x)-h-2,w,h,'rgba(120,140,150,.35)');}}
/* 加氫站 */
function station(){const g=gyy(DSP);
  box(230,g-210,360,16,'#e3e8ec','rgba(0,0,0,.25)',1);box(230,g-196,360,6,'#1f7f99');
  box(250,g-194,12,194,'#aeb8be');box(558,g-194,12,194,'#aeb8be');
  box(DSP-22,g-96,44,96,'#f4f6f7','rgba(0,0,0,.3)',1);box(DSP-16,g-86,32,20,'#2a3a46');box(DSP-22,g-110,44,14,'#1f7f99');
  wt(DSP,g-99,'H₂',11,'#fff',700,'center',COND);
  box(120,g-80,70,80,'#dfe5e8','rgba(0,0,0,.25)',1);for(let r=0;r<3;r++){rrp(126,g-74+r*22,58,16,8);ctx.fillStyle='#c9d1d6';ctx.fill();}}
/* 燃料電池車：x 為車中心，s 為縮放，cut 0–1 為剖面透明度 */
function fcev(x,s,cut){const g=gyy(x);ctx.save();ctx.translate(x,g);ctx.scale(s,s);cut=cut||0;
  const body=[-140,-26,-142,-50,-122,-62,-74,-67,-42,-98,38,-100,82,-68,128,-60,142,-44,140,-26];
  alphaDo(1-cut*.82,()=>{poly(body,'#dfe6ea','rgba(0,0,0,.35)',1.2);poly([-62,-69,-36,-93,-2,-94,-2,-69],'#2a3a46');poly([4,-69,4,-94,34,-93,70,-69],'#2a3a46');
   ln([-138,-40,138,-40],'rgba(31,127,153,.7)',2);box(128,-54,12,6,'#f2c230');box(-142,-52,6,8,'#e8572a');});
  if(cut>0){alphaDo(cut,()=>{poly(body,'rgba(14,42,59,.55)','rgba(255,255,255,.6)',1.2);
    rrp(-40,-44,100,15,7);ctx.fillStyle='#c9d1d6';ctx.fill();circ(-72,-40,13,'#c9d1d6','rgba(0,0,0,.3)',1);
    box(72,-60,54,26,'#e3d27a','rgba(0,0,0,.35)',1);for(let i=0;i<10;i++)ln([76+i*5,-58,76+i*5,-36],'rgba(0,0,0,.35)',1);
    box(-132,-66,30,16,'#1f7f99','rgba(255,255,255,.4)',1);box(-104,-38,22,14,'#8d989f','rgba(255,255,255,.4)',1);
    box(40,-62,20,12,'#5c6770','rgba(255,255,255,.4)',1);});}
  for(const wx of [-90,90]){circ(wx,-20,20,'#1d2226');circ(wx,-20,9,'#aeb8be');}
  ctx.restore();}
/* 車上座標 → 世界座標 */
const CP=(x,s,lx,ly)=>[x+lx*s,gyy(x)+ly*s];
/* 固定式燃料電池場景 */
const FCX=620,BLX=980,TKX=840;
function building(lit){const g=gyy(BLX+150);box(BLX,g-310,300,310,'#cfd8dc','rgba(0,0,0,.25)',1);box(BLX,g-322,300,12,'#aeb8be');
  for(let r=0;r<7;r++)for(let c=0;c<6;c++)box(BLX+18+c*47,g-296+r*40,30,24,lit?'rgba(242,194,48,.75)':'#2a3a46');
  box(BLX+124,g-50,52,50,'#2a3a46');}
function fcCabinet(x){const g=gyy(x+75);box(x,g-120,150,120,'#e3e8ec','rgba(0,0,0,.3)',1);box(x,g-120,150,14,'#1f7f99');
  for(let i=0;i<5;i++)ln([x+14,g-90+i*14,x+70,g-90+i*14],'rgba(0,0,0,.25)',2);box(x+88,g-94,48,60,'#e3d27a','rgba(0,0,0,.3)',1);box(x-4,g-4,158,4,'#6a747a');}
function hwTank(x){const g=gyy(x);rrp(x,g-160,64,156,26);ctx.fillStyle='#dfe5e8';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.stroke();box(x-4,g-4,72,4,'#6a747a');}
function pole(x,h){const g=gyy(x);box(x-3,g-h,6,h,'#6a5a48');box(x-22,g-h+8,44,4,'#6a5a48');}
const FUEL=()=>[[120,gyy(120)-26],[FCX,gyy(FCX)-26]];
const ELEC=()=>[[FCX+150,gyy(FCX)-70],[BLX,gyy(FCX)-70]];
const HEAT1=()=>[[FCX+150,gyy(FCX)-30],[TKX,gyy(FCX)-30]];
const HEAT2=()=>[[TKX+64,gyy(TKX)-130],[BLX,gyy(TKX)-130]];
const GRID=()=>[[1640,gyy(1500)-236],[1500,gyy(1500)-236],[1380,gyy(1380)-236],[BLX+300,gyy(1280)-250]];

const EP={no:2,slug:'hydrogen',seriesName:'氫能系列',t:'燃料電池',en:'How a fuel cell works',
lede:'燃料電池把氫氣和空氣中的氧氣送進一片薄膜的兩側，不經燃燒就直接產生電，排出的只有水和熱。這一集拆開質子交換膜燃料電池，看陽極與陰極各發生什麼反應、單電池如何疊成電堆，再走進燃料電池車與大樓旁的固定式發電機組。',
facts:[['1.23','V','氫氧反應的理論電壓；運轉中的單電池約 0.6–0.8 V'],
['330','片','第二代 Toyota Mirai 電堆的單電池數，最大輸出 128 kW'],
['60–80','°C','質子交換膜燃料電池的典型運轉溫度'],
['約 5.6','kg','Mirai 車上三支 700 bar 高壓氣瓶的儲氫量'],
['約 60','%','燃料電池以純氫發電可達的電效率（示例）'],
['5–7','萬元/kW','經濟部定置型燃料電池發電系統的設置補助額度']],
note:'說明：本集為教育用途示意動畫，設備外觀與比例經過調整。1.23 V 為 25°C 標準狀態的熱力學值；單電池運轉電壓、運轉溫度與電效率為美國能源部（DOE）燃料電池技術資料與文獻常見範圍的典型範例；電堆單電池數、輸出與儲氫量取自 Toyota 公布的第二代 Mirai 技術規格；定置型燃料電池補助額度取自經濟部能源署「經濟部定置型燃料電池發電系統設置補助要點」；SOFC 能源效率參考工研院公開資料。加氫量、發電功率、熱電比例與汽油引擎效率為示意情境，實際數值依機型與運轉條件而定。',
base:()=>{landSky(GY,{sun:SUN,clouds:true});drawGround();},
shots:[
{t:'加氫三分鐘',en:'Refuelling a fuel cell car',dur:12,side:true,
 d:'燃料電池車開進加氫站，加氫機把約 700 巴的高壓氫氣灌進車上的氣瓶，加滿約需 3 到 5 分鐘，和加油的時間差不多。車子本身其實是一輛電動車：它不在車上燃燒氫氣，而是用燃料電池把氫和空氣中的氧結合，產生電力推動馬達，排氣管排出的只有水。以第二代 Toyota Mirai 為例，三支氣瓶共可存約 5.6 公斤氫氣。',
 s:[[0,'燃料電池車開進加氫站'],[.22,'加氫機灌入約 700 巴的高壓氫氣'],[.52,'加滿約 3 到 5 分鐘，和加油差不多'],[.76,'上路後，排氣管排出的只有水']],
 cam:u=>camMix({x:700,y:470,s:1.35},{x:820,y:480,s:1.15},ease(seg(u,.72,.98))),
 draw(u){
  skyline();road();station();
  const x=u<.2?lerp(-220,520,easeOut(seg(u,0,.2))):lerp(520,1500,easeIn(seg(u,.74,1)));
  fcev(x,1,0);
  const port=CP(x,1,-126,-50),g=gyy(DSP),hk=band(u,.2,.72);
  if(hk>0)alphaDo(hk,()=>{ctx.beginPath();ctx.moveTo(DSP+22,g-60);ctx.quadraticCurveTo((DSP+port[0])/2+20,g-10,port[0],port[1]);ctx.strokeStyle='#1d2226';ctx.lineWidth=4;ctx.stroke();});
  if(hk>.5)flowDots([[DSP+22,g-60],[(DSP+port[0])/2+20,g-26],port],3,H2C,1,.7,3.5);
  if(u>.78)for(let k=0;k<6;k++){const f=((TT*.9)+k/6)%1,p=CP(x,1,-146-f*30,-26+f*26);alphaDo(1-f,()=>circ(p[0],p[1],3.2,WC));}
  lab(DSP,g-96,'加氫機',{dx:-40,dy:-120,st:'s',a:band(u,.06,.5)});
  lab(155,g-80,'儲氫槽',{dx:-10,dy:-70,a:band(u,.24,.6)});
  lab(port[0],port[1],'加氫口',{dx:40,dy:-120,st:'g',a:band(u,.24,.6)});
  const ex=CP(x,1,-150,-24);lab(ex[0],ex[1],'只排出水',{dx:-40,dy:-110,st:'g',a:band(u,.8,1)});
 },
 hud(u){hudPanel(240,160,'加氫（示例）',seg(u,.05,.1),w=>{const k=ease(seg(u,.24,.7)),m=lerp(.8,5.6,k),p=lerp(120,700,k);
  hrow(56,'車載氫氣',m.toFixed(1)+' kg',w,H2C);hbar(14,68,w-28,m/5.6,H2C);hrow(106,'氣瓶壓力',Math.round(p)+' bar',w,EC);hrow(138,'狀態',u<.2?'進站':u<.72?'加氫中':'行駛',w,'#fff');});}},

{t:'電解的反方向',en:'Electrolysis in reverse',dur:13,
 d:'上一集的電解槽用電把水拆成氫和氧；燃料電池做的是相反的事，讓氫和氧重新結合成水，同時放出電和熱。反應式是 H₂ + ½O₂ → H₂O，理論電壓同樣是 1.23 伏特。電解時要施加高於 1.23 伏特的電壓才拆得開，燃料電池輸出時則低於 1.23 伏特，實際約 0.7 伏特。和引擎或火力發電不同，燃料電池不經過燃燒、熱與轉動這些步驟，化學能直接變成電，因此少了中間的轉換損失。',
 s:[[0,'電解：用電把水拆成氫和氧'],[.25,'燃料電池：氫和氧結合，產生電、水和熱'],[.5,'電解要高於 1.23 V，燃料電池輸出約 0.7 V'],[.72,'不經燃燒，化學能直接變成電']],
 draw(u){
  diagBG();
  const a1=seg(u,.02,.08),a2=seg(u,.24,.3);
  alphaDo(a1,()=>{card(60,160,720,400,{bg:'rgba(7,27,39,.75)'});wt(84,204,'電解（上一集）',22,'rgba(227,236,238,.85)',700);});
  alphaDo(a2,()=>{card(820,160,720,400,{bg:'rgba(7,27,39,.75)',st:'rgba(242,194,48,.55)'});wt(844,204,'燃料電池',22,EC,700);});
  const L=[['電','#f2c230'],['水 H₂O','#58b8d0'],['H₂ + O₂','#7dffc4']],R=[['H₂ + O₂','#7dffc4'],['燃料電池','#e3d27a'],['電 + 水 + 熱','#f2c230']];
  const drawRow=(x0,items,t0,col)=>{let xx=x0;items.forEach(([t,bg],i)=>{const w=wtw(t,22,700)+24.2;alphaDo(seg(u,t0+i*.05,t0+i*.05+.05),()=>{tag(xx,330,t,{bg,size:22});if(i<items.length-1)arrow(xx+w+8,330,xx+w+46,330,col,3);});xx+=w+56;});};
  drawRow(100,L,.04,'rgba(227,236,238,.8)');drawRow(860,R,.26,EC);
  alphaDo(seg(u,.1,.16),()=>wt(420,420,'輸入電能，產出氫和氧',19,'rgba(227,236,238,.85)',500,'center'));
  alphaDo(seg(u,.36,.42),()=>wt(1180,420,'輸出電能，只排出水',19,'rgba(227,236,238,.85)',500,'center'));
  alphaDo(seg(u,.48,.54),()=>{tag(420,500,'施加電壓 > 1.23 V',{bg:'rgba(255,138,96,.9)',size:20,align:'center'});tag(1180,500,'輸出電壓 < 1.23 V（約 0.7 V）',{bg:'rgba(125,255,196,.9)',size:20,align:'center'});});
  /* 下：轉換步驟比較 */
  alphaDo(seg(u,.66,.72),()=>{card(60,590,1480,210,{bg:'rgba(7,27,39,.75)'});
   wt(90,668,'引擎、火力發電',20,'rgba(227,236,238,.85)',700);wt(90,752,'燃料電池',20,EC,700);
   let xx=420;['化學能','熱','轉動','電'].forEach((t,i)=>{const w=tag(xx,660,t,{bg:i===3?'#f2c230':'rgba(227,236,238,.75)',size:20});if(i<3)arrow(xx+w+8,660,xx+w+44,660,'rgba(227,236,238,.7)',2.5);xx+=w+56;});
   alphaDo(seg(u,.74,.8),()=>{const w=tag(420,748,'化學能',{bg:'#7dffc4',size:20});arrow(420+w+8,748,420+w+44,748,EC,2.5);tag(420+w+56,748,'電',{bg:'#f2c230',size:20});
    wt(1500,756,'少了中間的轉換損失',19,'#7dffc4',600,'right');});});
 }},

{t:'薄膜兩側的反應',en:'Inside the membrane electrode assembly',dur:15,
 d:'質子交換膜燃料電池（PEMFC）的核心是一片只有數十微米厚的高分子膜，兩側塗上含鉑的觸媒層。氫氣從陽極側的流道進來，在觸媒上分解成氫離子和電子：氫離子可以穿過膜，電子卻過不去，只能經由外部電路繞到陰極，這股電子流就是我們使用的電。在陰極，氧氣、穿過膜的氫離子和繞回來的電子結合成水。膜要保持濕潤才導得動氫離子，所以運轉溫度通常在 60 到 80°C。',
 s:[[0,'氫氣從陽極流道進入，空氣從陰極進入'],[.25,'觸媒把氫分解成氫離子和電子'],[.48,'氫離子穿過膜，電子經外部電路點亮燈泡'],[.72,'在陰極，氧、氫離子和電子結合成水']],
 draw(u){
  diagBG();
  const y0=250,y1=640,M0=740,M1=860;
  const LY=[[535,635,'#8d989f'],[635,715,'#5c6770'],[715,740,'#2b3137'],[M0,M1,'#e3d27a'],[860,885,'#2b3137'],[885,965,'#5c6770'],[965,1065,'#8d989f']];
  LY.forEach(([a,b,c])=>box(a,y0,b-a,y1-y0,c));
  for(let i=0;i<6;i++){box(560,y0+30+i*70,50,36,'rgba(125,255,196,.18)');box(990,y0+30+i*70,50,36,'rgba(179,124,255,.2)');}
  wt(585,y0-14,'陽極 −',19,'#7dc8dc',700,'center');wt(1015,y0-14,'陰極 +',19,'#ff9d7a',700,'center');
  /* 外部電路 */
  const ea=seg(u,.46,.52),lit=ea*(.8+.2*Math.sin(TT*6));
  ln([585,y0-40,585,190,1015,190,1015,y0-40],'#c9d1d6',3);
  circ(800,190,24,lit>0?`rgba(242,194,48,${.25+.75*lit})`:'#2a3a46','#c9d1d6',2);
  if(lit>0)alphaDo(lit*.35,()=>circ(800,190,46,'rgba(242,194,48,.4)'));
  const eP=[[585,y0-40],[585,190],[1015,190],[1015,y0-40]];
  flowDots(eP,8,'#7dc8dc',ea,.25,5);
  /* 氫氣進、分解 */
  const R=rng(7);
  for(let k=0;k<7;k++){const f=((TT*.22)+k/7)%1,yy=lerp(y0+20,y1-20,(k*.37+R()*.2)%1);
   const x=lerp(560,727,f);
   if(f<.8)alphaDo(seg(u,.02,.08),()=>{circ(x-5,yy,6,H2C);circ(x+5,yy,6,H2C);});
   else alphaDo(seg(u,.24,.3),()=>{circ(x,yy-10,4,'#7dc8dc');circ(x,yy+10,4,'#7dc8dc');});}
  /* 氫離子穿膜 */
  for(let k=0;k<8;k++){const f=((TT*.3)+k/8)%1,yy=y0+30+((k*53)%(y1-y0-60)),x=lerp(730,875,f);
   alphaDo(seg(u,.3,.36)*(f<.95?1:0),()=>{circ(x,yy,9,EC);wt(x,yy+1,'H⁺',11,'#0e2a3b',700,'center',COND,'middle');});}
  /* 氧氣進 */
  for(let k=0;k<6;k++){const f=((TT*.2)+k/6)%1,yy=y0+40+((k*71)%(y1-y0-80)),x=lerp(1040,880,f);
   alphaDo(seg(u,.02,.08)*(f<.9?1:0),()=>{circ(x-6,yy,7,O2C);circ(x+6,yy,7,O2C);});}
  /* 水排出 */
  for(let k=0;k<5;k++){const f=((TT*.25)+k/5)%1,x=lerp(900,1015,f*.5),yy=lerp(y0+80,y1+60,f);
   alphaDo(seg(u,.72,.78)*(1-f*.5),()=>circ(x+20*Math.sin(k),yy,6,WC));}
  alphaDo(seg(u,.72,.78),()=>{arrow(1015,y1+10,1015,y1+60,WC,3);wt(1040,y1+52,'H₂O',19,WC,700,'left',COND);});
  alphaDo(seg(u,.02,.08),()=>{arrow(470,y0+60,540,y0+60,H2C,3);wt(460,y0+66,'H₂',22,H2C,700,'right',COND);arrow(1130,y0+60,1070,y0+60,O2C,3);wt(1140,y0+66,'O₂（空氣）',20,O2C,700,'left');});
  /* 反應式 */
  alphaDo(seg(u,.25,.31),()=>{card(60,470,400,150,{bg:'rgba(7,27,39,.8)'});wt(84,510,'陽極反應',19,'#7dc8dc',700);wt(84,572,'H₂ → 2H⁺ + 2e⁻',30,'#fff',700,'left',COND);});
  alphaDo(seg(u,.72,.78),()=>{card(1110,470,430,150,{bg:'rgba(7,27,39,.8)'});wt(1134,510,'陰極反應',19,'#ff9d7a',700);wt(1134,572,'½O₂ + 2H⁺ + 2e⁻ → H₂O',26,'#fff',700,'left',COND);});
  lab(585,y0+300,'雙極板（流道）',{dx:-150,dy:40,a:band(u,.06,.4),minor:true});
  lab(727,y0+100,'觸媒層（鉑）',{dx:-260,dy:-60,a:band(u,.2,.46)});
  lab(800,y1,'質子交換膜',{dx:0,dy:34,st:'s',a:band(u,.1,1)});
  lab(800,190,'外部電路',{dx:170,dy:-20,st:'s',a:band(u,.5,.8)});
 }},

{t:'從單電池到電堆',en:'From a single cell to a stack',dur:14,
 d:'一片單電池在運轉時只有約 0.7 伏特，電壓太低，所以要把幾百片單電池用雙極板串起來疊成電堆，電壓就相加。第二代 Toyota Mirai 的電堆有 330 片單電池，最大輸出 128 kW。右邊的極化曲線說明電流愈大、電壓愈低：小電流時觸媒反應要克服活化損失，中段主要是膜與接觸的電阻損失，電流太大時氣體來不及送到觸媒，電壓急速下降。設計時通常讓單電池在 0.6 到 0.8 伏特之間運轉，兼顧功率與效率。',
 s:[[0,'一片單電池只有約 0.7 V'],[.22,'幾百片串聯疊成電堆，電壓相加'],[.48,'電流愈大，電壓愈低：這是極化曲線'],[.74,'通常在 0.6–0.8 V 之間運轉，兼顧功率與效率']],
 draw(u){
  diagBG();
  card(60,160,720,640,{bg:'rgba(7,27,39,.75)'});wt(84,204,'電堆（示意）',22,EC,700);
  const n=u<.2?1:Math.round(lerp(1,330,ease(seg(u,.2,.44)))),vis=Math.min(26,Math.max(1,Math.round(n/12.7)));
  box(150,280,26,380,'#8d989f');box(150+26+vis*8,280,26,380,'#8d989f');
  for(let i=0;i<vis;i++){const x=176+i*8;box(x,300,6,340,'#e3d27a');box(x+6,300,3,340,'#5c6770');}
  const sx=176+vis*8+26;
  ln([163,280,163,250],'#7dc8dc',3);ln([sx-13,280,sx-13,250],'#ff9d7a',3);
  wt(163,238,'−',24,'#7dc8dc',700,'center');wt(sx-13,238,'+',24,'#ff9d7a',700,'center');
  wt(560,340,trf('{n} 片',{n}),40,'#fff',700,'center',COND);wt(560,372,'單電池',17,'rgba(227,236,238,.8)',500,'center');
  wt(560,470,trf('約 {v} V',{v:Math.round(n*.7)}),40,EC,700,'center',COND);wt(560,502,'電堆電壓',17,'rgba(227,236,238,.8)',500,'center');
  alphaDo(seg(u,.4,.46),()=>{wt(560,600,'128 kW',40,H2C,700,'center',COND);wt(560,632,'最大輸出（Mirai）',17,'rgba(227,236,238,.8)',500,'center');});
  wt(120,730,'每片 × 0.7 V',19,'rgba(227,236,238,.85)',600);
  /* 極化曲線 */
  const c=chartBox(820,160,720,640,{title:'極化曲線（單電池，示例）',x0:0,x1:2,y0:0,y1:1.4,xt:[0,0.5,1,1.5,2],yt:[0,0.4,0.8,1.2],xl:'A/cm²',yl:'V',pt:70,pb:60,pl:64,gx:4,gy:7});
  const V=i=>.98-.045*Math.log(1+i*200)-.12*i-.08*Math.pow(i/2,6);
  alphaDo(seg(u,.46,.5),()=>{ctx.setLineDash([6,5]);ln([c.px,c.Y(1.23),c.px+c.pw,c.Y(1.23)],'#7dffc4',2);ctx.setLineDash([]);wt(c.px+c.pw-8,c.Y(1.23)-10,'理論 1.23 V',17,'#7dffc4',700,'right');});
  const k=ease(seg(u,.48,.7));if(k>0){ctx.beginPath();for(let j=0;j<=80*k;j++){const i=j/40;j?ctx.lineTo(c.X(i),c.Y(V(i))):ctx.moveTo(c.X(i),c.Y(V(i)));}ctx.strokeStyle=EC;ctx.lineWidth=3.5;ctx.stroke();}
  const zones=[[.03,'活化損失',.56],[.8,'電阻損失',.62],[1.78,'質傳損失',.68]];
  zones.forEach(([i,t,t0])=>alphaDo(seg(u,t0,t0+.05),()=>{const yy=c.Y(V(i));wt(c.X(i)+(i>1.5?-14:14),i>1.5?yy-60:yy-26,t,17,HC,700,i>1.5?'right':'left');}));
  alphaDo(seg(u,.74,.8),()=>{box(c.px,c.Y(.8),c.pw,c.Y(.6)-c.Y(.8),'rgba(125,255,196,.12)');circ(c.X(.6),c.Y(V(.6)),8,'#fff',EC,3);wt(c.X(.6)+16,c.Y(V(.6))+30,'常用運轉區 0.6–0.8 V',17,'#7dffc4',700,'left');});
 }},

{t:'燃料電池車裡有什麼',en:'Inside a fuel cell car',dur:13,side:true,
 d:'打開燃料電池車，可以看到幾個主要部件。碳纖維纏繞的高壓氣瓶放在車身中段與後座下方，氫氣經減壓後送進前方的燃料電池堆；空氣壓縮機把空氣送到陰極。電堆產生的直流電經升壓轉換器提高電壓，驅動馬達。車上另有一顆小型驅動電池，起步加速時協助供電，煞車時回收動能，讓電堆能在較有效率的區間運轉。反應產生的水以水蒸氣和少量液態水從車尾排出。',
 s:[[0,'打開車身：高壓氣瓶、電堆、電池與馬達'],[.26,'氫氣從氣瓶送進前方的燃料電池堆'],[.5,'電堆發電，驅動馬達，電池輔助加速'],[.76,'反應產生的水從車尾排出']],
 cam:u=>camMix({x:800,y:480,s:1.1},{x:800,y:gyy(800)-110,s:2.4},ease(seg(u,.02,.22))),
 draw(u){
  skyline();road();
  const S=1.9,x=800,cut=ease(seg(u,.1,.26));
  fcev(x,S,cut);
  if(cut>.5){
   flowDots([CP(x,S,-72,-40),CP(x,S,-72,-50),CP(x,S,70,-50)],5,H2C,seg(u,.26,.32),.45,3.2);
   flowDots([CP(x,S,72,-44),CP(x,S,50,-50),CP(x,S,-82,-50),CP(x,S,-100,-34)],6,EC,seg(u,.5,.56),.5,3.2);
   flowDots([CP(x,S,-117,-58),CP(x,S,-117,-46),CP(x,S,-104,-32)],3,EC,seg(u,.56,.62),.6,3);
   for(let k=0;k<6;k++){const f=((TT*.9)+k/6)%1,p=CP(x,S,-146-f*30,-26+f*24);alphaDo(seg(u,.76,.82)*(1-f),()=>circ(p[0],p[1],4,WC));}
  }
  const P=(lx,ly)=>CP(x,S,lx,ly);
  let p=P(10,-40);lab(p[0],p[1],'高壓氫氣瓶',{dx:-10,dy:110,st:'g',a:band(u,.2,.5)});
  p=P(99,-60);lab(p[0],p[1],'燃料電池堆',{dx:70,dy:150,st:'s',a:band(u,.2,1)});
  p=P(50,-62);lab(p[0],p[1],'升壓轉換器',{dx:-30,dy:-150,a:band(u,.5,.76),minor:true});
  p=P(-117,-66);lab(p[0],p[1],'驅動電池',{dx:-60,dy:-100,a:band(u,.5,1)});
  p=P(-93,-31);lab(p[0],p[1],'馬達',{dx:-110,dy:60,a:band(u,.5,.76)});
  p=P(-150,-22);lab(p[0],p[1],'水',{dx:-60,dy:40,st:'g',a:band(u,.78,1)});
 },
 hud(u){hudPanel(240,160,'行駛中（示例）',seg(u,.05,.1),w=>{const k=ease(seg(u,.5,.7));
  hrow(56,'電堆輸出',Math.round(lerp(8,62,k))+' kW',w,EC);hrow(88,'電池輔助',u>.55&&u<.8?'放電':'待命',w,'#7dc8dc');hrow(120,'車速',Math.round(lerp(30,80,k))+' km/h',w,'#fff');hrow(148,'排放','只有水',w,H2C);});}},

{t:'大樓旁的燃料電池',en:'Stationary fuel cells',dur:12,side:true,
 d:'燃料電池也可以放在地面上當發電機組，稱為定置型燃料電池。它可以直接用氫氣，也可以先把天然氣或沼氣重組成含氫的氣體再發電。機組就近設在工廠、醫院或大樓旁，發電的同時把反應熱回收成熱水，稱為熱電合併，總能源效率可達八成以上。停電時它能持續供電，適合當基地台、機房與醫院的備援電力。經濟部能源署對定置型燃料電池提供每 kW 新臺幣 5 到 7 萬元的設置補助。',
 s:[[0,'燃料電池機組設在大樓旁'],[.26,'發電送進大樓，反應熱回收成熱水'],[.5,'熱電合併，總效率可達八成以上'],[.74,'電網停電時，機組持續供電']],
 cam:u=>camMix({x:880,y:400,s:1.08},{x:920,y:400,s:1.02},ease(seg(u,.2,.9))),
 draw(u){
  const out=seg(u,.74,.8);
  pole(1500,250);pole(1380,250);
  const gp=GRID();if(out<.5)pl(gp,'rgba(40,50,58,.8)',2);else{ctx.setLineDash([8,8]);pl(gp,'#e8572a',2);ctx.setLineDash([]);}
  building(true);
  pl(FUEL(),'#8d989f',6);box(260,gyy(260)-40,26,28,'#dfe5e8','rgba(0,0,0,.3)',1);
  fcCabinet(FCX);hwTank(TKX);
  pl(ELEC(),'rgba(40,50,58,.8)',3);pl(HEAT1(),'#c96a4a',4);pl(HEAT2(),'#c96a4a',4);
  flowDots(FUEL(),6,H2C,band(u,.02,1),.25,5);
  flowDots(ELEC(),4,EC,band(u,.24,1),.45,5);
  flowDots(HEAT1(),2,HC,band(u,.3,1),.4,5);flowDots(HEAT2(),3,HC,band(u,.34,1),.35,5);
  if(out<.5)flowDots(gp,5,EC,band(u,0,.74),.3,4);
  lab(FCX+75,gyy(FCX)-120,'燃料電池機組',{dx:-40,dy:-110,st:'s',a:band(u,.02,1)});
  lab(200,gyy(200)-26,'氫氣或天然氣',{dx:0,dy:-90,st:'g',a:band(u,.04,.4)});
  lab(TKX+32,gyy(TKX)-160,'熱水儲槽',{dx:20,dy:-70,a:band(u,.28,.72)});
  lab(1440,gyy(1440)-240,'電網停電',{dx:0,dy:-60,st:'w',a:band(u,.76,1)});
 },
 hud(u){hudPanel(240,160,'熱電合併（示例）',seg(u,.05,.1),w=>{const e=Math.round(50*ease(seg(u,.1,.3))),h=Math.round(35*ease(seg(u,.3,.5)));
  hrow(56,'電效率',trf('約 {n}%',{n:e}),w,EC);hrow(88,'熱回收',trf('約 {n}%',{n:h}),w,HC);hrow(120,'總效率',trf('約 {n}%',{n:e+h}),w,H2C);hrow(150,'電網',u>.76?'停電':'正常',w,u>.76?'#ff9d7a':'#fff');});}},

{t:'效率與兩種燃料電池',en:'Efficiency and fuel cell types',dur:12,
 d:'同樣 100 份燃料的能量，汽油引擎通常只有約三成變成動力；燃料電池以純氫發電，電效率可達約五到六成，若再把熱回收利用，總效率可達八成以上。常見的燃料電池還有不同種類：質子交換膜燃料電池（PEMFC）在 60 到 80°C 運轉，啟動快、體積小，適合車輛與備援電力；固態氧化物燃料電池（SOFC）在 600 到 1000°C 運轉，可以直接使用天然氣或沼氣，適合固定式發電與熱電合併。',
 s:[[0,'同樣 100 份燃料，能量去了哪裡'],[.3,'燃料電池發電約五到六成，回收熱後可達八成以上'],[.55,'PEMFC：低溫、啟動快，適合車輛'],[.76,'SOFC：高溫、可用天然氣，適合固定式發電']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,900,640,{title:'每 100 份燃料能量的去向（示例）',x0:0,x1:100,y0:0,y1:3,xt:[0,25,50,75,100],yt:[],xl:'%',pt:70,pb:64,pl:210,gx:4,gy:0});
  const B=[['汽油引擎','車用（示例）',[[30,'動力',EC],[70,'損失','rgba(141,152,159,.55)']],.04],
   ['燃料電池','僅發電',[[55,'電力',EC],[45,'損失','rgba(141,152,159,.55)']],.28],
   ['燃料電池','熱電合併',[[50,'電力',EC],[35,'熱利用',HC],[15,'損失','rgba(141,152,159,.55)']],.4]];
  B.forEach(([n,s,parts,t0],i)=>{const y=c.Y(2.5-i),h=86,k=ease(seg(u,t0,t0+.12));if(k<=0)return;
   alphaDo(seg(u,t0,t0+.04),()=>{wt(c.px-20,y-6,n,22,i?H2C:'rgba(227,236,238,.9)',700,'right');wt(c.px-20,y+22,s,16,'rgba(227,236,238,.8)',500,'right');});
   let v0=0;parts.forEach(([v,t,col])=>{const x0=c.X(v0*k),x1=c.X((v0+v)*k);box(x0,y-h/2,Math.max(0,x1-x0-2),h,col);
    if(k>.95&&v>=15)wt((x0+x1)/2,y+7,trf('{t} {n}%',{t:tr(t),n:v}),v>=30?19:16,'#0e2a3b',700,'center');v0+=v;});});
  const C=[['質子交換膜（PEMFC）',['運轉溫度約 60–80°C','啟動快、體積小','車輛、堆高機、備援電力'],'#f2c230',.55],
   ['固態氧化物（SOFC）',['運轉溫度約 600–1000°C','可直接用天然氣、沼氣','固定式發電、熱電合併'],'#ff8a60',.76]];
  C.forEach(([t,L,col,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=160+i*330;card(1000,y,540,310,{bg:'rgba(7,27,39,.75)'});box(1000,y,8,310,col);
   wt(1032,y+50,t,22,col,700);L.forEach((s,j)=>wt(1032,y+120+j*58,s,19,j===2?'#7dffc4':'#fff',600));}));
 }}
]};
