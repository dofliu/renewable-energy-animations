// KITS: land
/* 氫能系列 第 7 集：氫的顏色與碳足跡 */
const gyy=x=>groundY(x);
const SUN={x:1180,y:120};
const H2C='#7dffc4',WC='#58b8d0',EC='#f2c230',HC='#ff8a60',CC='#7dc8dc',PC='#b37cff';
const KWH=52; /* 電解每公斤氫約耗電 kWh（示例） */
function pipeDots(P,n,col,sp,r){const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));const T=L[L.length-1];
  for(let k=0;k<n;k++){const d=(((TT*sp)+k/n)%1)*T;let i=1;while(i<L.length-1&&L[i]<d)i++;const f=(d-L[i-1])/(L[i]-L[i-1]);circ(lerp(P[i-1][0],P[i][0],f),lerp(P[i-1][1],P[i][1],f),r||5,col);}}
function smoke(x,y,n,col,k,spread){for(let i=0;i<n;i++){const f=((TT*.22)+i/n)%1;alphaDo((1-f)*.55*k,()=>circ(x+Math.sin(i*2.1+f*4)*18*f+f*(spread||50),y-f*230,8+f*20,col));}}
function tank(x,y,w,h,fill){rrp(x,y-h,w,h,h/2);ctx.fillStyle='#10354a';ctx.fill();rrp(x,y-h,w,h,h/2);ctx.strokeStyle='#aeb8be';ctx.lineWidth=5;ctx.stroke();
  if(fill>0){ctx.save();rrp(x,y-h,w,h,h/2);ctx.clip();ctx.fillStyle='rgba(125,255,196,.35)';ctx.fillRect(x,y-h*fill,w,h*fill);ctx.restore();}}
/* 天然氣重組廠：x 為重組爐左緣 */
function reformer(x,flame){const g=gyy(x);
  box(x,g-150,170,150,'#7d8a92','rgba(0,0,0,.35)',1.5);box(x+14,g-130,142,40,'#5d6a72');
  for(let i=0;i<4;i++){const fh=14+Math.sin(TT*9+i*2)*5;alphaDo(flame,()=>poly([x+30+i*34,g-92,x+42+i*34,g-92-fh*1.7,x+54+i*34,g-92],'#ff8a3a'));}
  box(x+190,g-300,36,300,'#9aa6ad','rgba(0,0,0,.35)',1.5);box(x+186,g-306,44,10,'#6c777e');
  box(x+170,g-60,20,12,'#6c777e');}

const EP={no:7,slug:'hydrogen',seriesName:'氫能系列',t:'氫的顏色與碳足跡',en:'Hydrogen colours and carbon footprint',
lede:'氫氣本身燃燒只產生水，但製造它的方式差很多：灰氫來自天然氣，藍氫加上碳捕捉，綠氫由再生能源電解水。顏色只是簡稱，真正該看的是每公斤氫的碳排放。這一集走過三條製程，再用一張圖看出關鍵：電解用的電從哪裡來，決定了綠氫是不是真的綠。',
facts:[['約 10','kg CO₂e／kg H₂','天然氣重組（灰氫）的典型碳排，各文獻約 8–12'],
['約 90','%','碳捕捉的典型捕捉率；其餘排放與上游甲烷洩漏仍要計入'],
['約 52','kWh／kg','電解水每公斤氫的耗電，常見範圍約 50–55（示例）'],
['0.467','kg CO₂e／度','台電 114 年度電力排碳係數，能源署 2026 年公布'],
['約 24','kg CO₂e／kg H₂','以台灣電網電力電解的推估，高於灰氫'],
['3.4','kg CO₂e／kg H₂','歐盟再生氫的減碳門檻，約比化石基準低 70%']],
note:'說明：本集為教育用途示意動畫，設備外觀與比例經過調整。灰氫約 10 kg CO₂e／kg H₂（文獻範圍約 8–13）、藍氫約 1–4、電解耗電約 50–55 kWh／kg 為各研究與產業文獻常見的典型範例，實際依製程、捕捉率、上游甲烷洩漏與系統邊界而定。台電電力排碳係數 0.467 kg CO₂e／度為經濟部能源署 2026 年 6 月公布的 114 年度數值；24 kg 為 0.467 × 52 的估算，僅計電力，不含設備製造。光電與離岸風電的生命週期排放（約 0.045 與 0.012 kg CO₂e／度）為文獻典型值。歐盟門檻 3.4 kg（28.2 g CO₂e／MJ，相對化石基準 94 g／MJ 減 70%）與額外性、時間、地理相關規定出自歐盟授權規章 2023/1184 與 2023/1185，此處為簡化說明，省略過渡期與豁免。',
base:()=>{landSky(GY,{sun:SUN,clouds:true});drawGround();},
shots:[
{t:'灰氫：天然氣重組',en:'Grey hydrogen from natural gas',dur:13,side:true,
 d:'今天全世界大部分的氫，是用天然氣製造的。天然氣的主要成分是甲烷，在重組爐裡與高溫水蒸氣反應，先得到氫氣與一氧化碳，再經水煤氣轉換，整體可寫成 CH₄ ＋ 2H₂O → 4H₂ ＋ CO₂。每製造 1 公斤氫，反應本身就釋出約 5.5 公斤二氧化碳，加上爐子燃燒燃料的排放，總計約 8 到 12 公斤，一般取約 10。這種氫被稱為灰氫，價格便宜，卻等於把碳排放搬到了煙囪。',
 s:[[0,'天然氣送進重組爐，與高溫水蒸氣反應'],[.3,'產出氫氣，同時產生二氧化碳'],[.55,'每 1 公斤氫約排出 10 公斤二氧化碳'],[.8,'二氧化碳從煙囪排入大氣，稱為灰氫']],
 draw(u){
  const g=gyy(300),X=420;
  ln([-60,g-28,X,g-28],'#c9a23a',12);pipeDots([[-60,g-28],[X,g-28]],7,'#fff3b0',.18,5);
  reformer(X,seg(u,.05,.12));
  const hl=seg(u,.22,.3);
  if(hl>0){ln([X+170,g-30,1050,g-30],'#7dffc4',8);alphaDo(hl,()=>pipeDots([[X+170,g-30],[1050,g-30]],6,H2C,.2,4));}
  tank(1050,g,260,100,seg(u,.25,.7)*.8);wt(1180,g-52,'H₂',34,'#fff',700,'center',COND);
  smoke(X+208,g-306,12,'rgba(170,175,180,1)',seg(u,.3,.4),60);
  alphaDo(band(u,.04,.5),()=>tag(560,g-340,'CH₄ ＋ 2H₂O → 4H₂ ＋ CO₂',{bg:EC,fg:'#0e2a3b',size:24}));
  lab(120,g-28,'天然氣管線',{dx:0,dy:-110,a:band(u,0,.5)});
  lab(X+85,g-100,'蒸氣重組爐',{dx:-30,dy:-130,st:'s',a:band(u,.04,.6)});
  lab(1180,g-100,'氫氣儲槽',{dx:30,dy:-120,st:'g',a:band(u,.3,1)});
  lab(X+208,g-310,'二氧化碳排入大氣',{dx:280,dy:-20,st:'w',a:band(u,.5,1)});
 },
 hud(u){hudPanel(270,128,'每公斤氫的碳排（示例）',seg(u,.05,.1),w=>{const v=lerp(0,10,ease(seg(u,.3,.75)));
  hrow(56,'CO₂e',trf('{n} kg',{n:v.toFixed(1)}),w,HC);hbar(14,68,w-28,v/12,HC);hrow(106,'文獻範圍','8–12',w,EC);});}},

{t:'藍氫：加上碳捕捉',en:'Blue hydrogen with carbon capture',dur:13,side:true,
 d:'藍氫的製程和灰氫一樣，只是在煙道氣與製程氣中加裝碳捕捉設備，用化學溶劑吸收二氧化碳，壓縮後以管線送到地下深處，注入被不透水蓋層封住的砂岩儲集層永久封存。典型捕捉率約 90%，所以碳排大致從約 10 降到約 1 到 4 公斤，實際依捕捉率與上游天然氣的甲烷洩漏而定。它不是零排放：沒被捕捉的部分、天然氣開採運輸的逸散，都還在帳上。',
 s:[[0,'同樣的天然氣重組，煙道加裝碳捕捉塔'],[.3,'溶劑吸收二氧化碳，壓縮後送入管線'],[.58,'注入蓋層下的砂岩，地下永久封存'],[.82,'捕捉率約 90%，但仍不是零排放']],
 draw(u){
  const g=gyy(300),X=120;
  ln([-60,g-28,X,g-28],'#c9a23a',12);pipeDots([[-60,g-28],[X,g-28]],5,'#fff3b0',.18,5);
  reformer(X,1);
  ln([X+170,g-30,700,g-30],'#7dffc4',8);pipeDots([[X+170,g-30],[700,g-30]],5,H2C,.2,4);
  tank(700,g,200,90,.7);wt(800,g-46,'H₂',30,'#fff',700,'center',COND);
  /* 捕捉塔 */
  box(380,g-250,70,250,'#aab6bd','rgba(0,0,0,.4)',1.5);box(374,g-256,82,10,'#6c777e');
  for(let i=0;i<4;i++)ln([392,g-210+i*50,438,g-210+i*50],'rgba(0,0,0,.25)',3);
  ln([X+208,g-306,X+208,g-330,415,g-330,415,g-256],'#8a949a',8);
  const cap=seg(u,.1,.2);
  smoke(X+208,g-306,0,'#aaa',0);
  alphaDo(cap,()=>pipeDots([[X+208,g-330],[415,g-330],[415,g-256]],4,'rgba(190,195,200,1)',.25,6));
  smoke(430,g-256,8,'rgba(170,175,180,1)',.18*(1-cap)+.12,30);
  /* 地下管線與儲集層 */
  const P=[[415,g-8],[415,g+34],[1180,g+34],[1180,g+110]];
  const pf=seg(u,.28,.55);
  if(pf>0){ln(P.map(p=>p).flat(),'#8a949a',9);alphaDo(pf,()=>pipeDots(P,6,'rgba(210,214,218,1)',.18,5));}
  box(940,g+112,500,26,'#4b5258');box(940,g+138,500,60,'#b08d5c');
  const R=rng(5);for(let i=0;i<40;i++)circ(950+R()*480,g+144+R()*48,2.5,'rgba(255,235,190,.5)');
  const inj=seg(u,.5,.8);
  if(inj>0)for(let i=0;i<14;i++){const f=(TT*.3+i/14)%1;alphaDo(inj*.9,()=>circ(1180+(i%7-3)*50*f,g+112+f*70,5,'#d8dcdf'));}
  lab(415,g-256,'碳捕捉塔',{dx:-10,dy:-110,st:'s',a:band(u,.08,.6)});
  lab(800,g+34,'二氧化碳管線',{dx:-30,dy:-120,a:band(u,.3,.7)});
  lab(1180,g+128,'封存砂岩層',{dx:40,dy:-140,st:'g',a:band(u,.5,1)});
  lab(1180,g+112,'不透水蓋層',{dx:200,dy:-60,a:band(u,.62,1),minor:true});
 },
 hud(u){hudPanel(270,128,'每公斤氫的碳排（示例）',seg(u,.05,.1),w=>{const v=lerp(10,2.5,ease(seg(u,.3,.7)));
  hrow(56,'CO₂e',trf('{n} kg',{n:v.toFixed(1)}),w,v>5?HC:H2C);hbar(14,68,w-28,v/12,v>5?HC:H2C);hrow(106,'捕捉率','約 90%',w,EC);});}},

{t:'綠氫：再生電力電解水',en:'Green hydrogen from renewable power',dur:13,side:true,
 d:'綠氫用電把水分解成氫與氧，電來自太陽光電或風力。電解槽運轉時不排放二氧化碳，氧氣可以直接排出或利用。代價是耗電量大：每公斤氫約需 50 到 55 度電，換算起來相當於一戶家庭好幾天的用電。所以綠氫的碳排幾乎全由電力決定，電力若來自光電約 2 公斤上下，若來自離岸風電不到 1 公斤。電的來源，才是綠氫能不能叫綠的關鍵。',
 s:[[0,'太陽光電的直流電送進電解槽'],[.3,'水被分解成氫氣與氧氣，氧氣直接排出'],[.55,'每公斤氫約耗電 52 度，用電量很大'],[.8,'運轉不排碳，碳排由電力來源決定']],
 draw(u){
  const g=gyy(300);
  for(let i=0;i<5;i++)solarPanel(110+i*92,gyy(110+i*92),84,24,{h:46,glint:true});
  const gl=seg(u,.05,.12);
  const P=[[330,g-40],[330,g-8],[700,g-8],[700,g-60]];
  ln(P.flat(),'#f2c230',5);alphaDo(gl,()=>pipeDots(P,8,'#fff3b0',.25,4));
  /* 電解槽貨櫃 */
  box(660,g-170,260,170,'#dfe5e8','rgba(0,0,0,.3)',1.5);box(660,g-170,260,16,'#1f7f99');
  wt(790,g-84,'電解槽',26,'#0e2a3b',700,'center');wt(790,g-50,'H₂O → H₂ ＋ ½O₂',17,'#0e2a3b',700,'center',COND);
  const ev=seg(u,.28,.36);
  ln([920,g-100,1060,g-100],H2C,8);if(ev>0)alphaDo(ev,()=>pipeDots([[920,g-100],[1060,g-100]],5,H2C,.25,4));
  tank(1060,g,250,96,seg(u,.3,.7)*.8);wt(1185,g-48,'H₂',32,'#fff',700,'center',COND);
  if(ev>0)for(let i=0;i<6;i++){const f=(TT*.3+i/6)%1;alphaDo(ev*(1-f),()=>circ(880+Math.sin(i*3)*10*f,g-175-f*120,5,'#b37cff'));}
  lab(300,gyy(300)-90,'太陽光電',{dx:-20,dy:-150,st:'s',a:band(u,0,.55)});
  lab(790,g-170,'電解槽',{dx:-40,dy:-110,st:'s',a:band(u,.15,.6)});
  lab(880,g-230,'氧氣排出',{dx:90,dy:-60,a:band(u,.3,.7)});
  lab(1185,g-100,'氫氣儲槽',{dx:30,dy:-120,st:'g',a:band(u,.4,1)});
 },
 hud(u){hudPanel(270,128,'每公斤氫（示例）',seg(u,.05,.1),w=>{const v=lerp(0,KWH,ease(seg(u,.3,.7)));
  hrow(56,'耗電',trf('{n} kWh',{n:Math.round(v)}),w,EC);hbar(14,68,w-28,v/60,EC);hrow(106,'運轉排放','0',w,H2C);});}},

{t:'電從哪來，碳就從哪來',en:'The grid decides the carbon',dur:14,
 d:'把耗電量乘上電力的排碳係數，就得到電解氫的碳排。以每公斤氫耗電 52 度計：台電 114 年度的排碳係數是每度 0.467 公斤，算出來約 24 公斤，比灰氫的約 10 公斤還高；光電約 0.045、離岸風電約 0.012 公斤，只有約 2 與 0.6 公斤。電力係數低於約 0.19，才贏過灰氫；低於約 0.065，才達到歐盟 3.4 公斤的門檻。用電網電力電解，不等於綠氫。',
 s:[[0,'電解氫的碳排，等於耗電量乘上電力排碳係數'],[.3,'離岸風電與光電的電，換算只有 0.6 與 2 公斤'],[.58,'台灣電網每度 0.467 公斤，換算約 24 公斤'],[.82,'係數須低於約 0.065，才達到歐盟 3.4 公斤門檻']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,900,600,{title:'電解氫的碳排與電力排碳係數（耗電 52 kWh／kg）',x0:0,x1:.5,y0:0,y1:30,xt:[0,.1,.2,.3,.4,.5],yt:[0,10,20,30],xl:'電力排碳係數（kg CO₂e／度）',yl:'kg CO₂e／kg H₂',pl:90,pb:76,pt:70,gx:5,gy:3});
  const k=ease(seg(u,.04,.3));
  ctx.beginPath();ctx.moveTo(c.X(0),c.Y(0));ctx.lineTo(c.X(.5*k),c.Y(KWH*.5*k));ctx.strokeStyle=EC;ctx.lineWidth=4;ctx.stroke();
  alphaDo(seg(u,.1,.16),()=>{ctx.setLineDash([10,8]);ln([c.px,c.Y(10),c.px+c.pw,c.Y(10)],HC,2.5);ctx.setLineDash([]);wt(c.px+c.pw-8,c.Y(10)-10,'灰氫約 10',18,HC,700,'right');});
  alphaDo(seg(u,.16,.22),()=>{ctx.setLineDash([10,8]);ln([c.px,c.Y(3.4),c.px+c.pw,c.Y(3.4)],H2C,2.5);ctx.setLineDash([]);wt(c.px+c.pw-8,c.Y(3.4)-10,'歐盟門檻 3.4',18,H2C,700,'right');});
  const pts=[['離岸風電',.012,.32,PC,.02,17],['光電',.045,.34,CC,.07,24],['台灣電網',.467,.58,HC,0,0]];
  pts.forEach(([n,x,t0,col,lx,ly])=>alphaDo(seg(u,t0,t0+.06),()=>{const px=c.X(x),py=c.Y(KWH*x),v=trf('{n} kg',{n:(KWH*x).toFixed(1)});
   if(ly){const tx=c.X(lx),ty=c.Y(ly);ln([px,py,tx+14,ty+34],col,2);wt(tx,ty,n,20,col,700,'left');wt(tx,ty+26,v,22,'#fff',700,'left',COND);}
   else{wt(px-14,py+36,n,20,col,700,'right');wt(px-14,py+62,v,22,'#fff',700,'right',COND);}
   circ(px,py,10,col,'#fff',2);}));
  alphaDo(seg(u,.78,.84),()=>{[[10/KWH,HC],[3.4/KWH,H2C]].forEach(([x,col])=>{ln([c.X(x),c.Y(0),c.X(x),c.Y(KWH*x)],col,2);circ(c.X(x),c.Y(0),6,col);});
   wt(c.X(10/KWH)+8,c.Y(0)-14,'0.19',18,HC,700,'left',COND);wt(c.X(3.4/KWH)+8,c.Y(0)-40,'0.065',18,H2C,700,'left',COND);});
  card(1000,160,540,600,{bg:'rgba(7,27,39,.75)'});wt(1030,208,'三個重點',22,EC,700);
  [['乘法','碳排 ＝ 耗電量 × 排碳係數',.04],['用電網電','台灣電網約 24 kg，高於灰氫',.5],['要夠綠','係數低於約 0.065 才達歐盟門檻',.76]].forEach(([a,b,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=290+i*160;tag(1030,y-30,a,{bg:[EC,HC,H2C][i],fg:'#0e2a3b',size:22});wt(1030,y+34,b,19,'rgba(227,236,238,.92)',500);}));
 }},

{t:'怎樣才算綠氫',en:'What counts as green',dur:13,
 d:'既然電力決定一切，各國開始用數字與規則來定義。歐盟規定再生氫的全生命週期排放，須比化石基準的每百萬焦耳 94 克二氧化碳當量低 70%，也就是 28.2 克，換算約每公斤氫 3.4 公斤。另有三條電力規則：額外性，電要來自新增的再生電源；時間相關，起初以月為單位對應，2030 年起須逐小時；地理相關，電源與電解槽要在同一區域。灰氫與藍氫則以排放強度分級管理。',
 s:[[0,'歐盟以排放強度定義：比化石基準低 70%'],[.3,'相當每公斤氫不超過約 3.4 公斤二氧化碳當量'],[.55,'電力還要符合額外性、時間與地理三條規則'],[.8,'不是買了綠電憑證，就自動算綠氫']],
 draw(u){
  diagBG();
  card(60,160,760,600,{bg:'rgba(7,27,39,.75)'});wt(90,208,'排放強度門檻（g CO₂e／MJ）',22,EC,700);
  const bx=110,bw=640;
  alphaDo(seg(u,.04,.1),()=>{wt(bx,300,'化石基準',20,HC,700);const k=ease(seg(u,.04,.2));box(bx,316,bw*k,54,HC);if(k>.9)wt(bx+bw+0,306,'',1,'#fff');wt(bx+bw*k-12,352,'94',30,'#0e2a3b',800,'right',COND);});
  alphaDo(seg(u,.28,.34),()=>{wt(bx,460,'再生氫門檻',20,H2C,700);const k=ease(seg(u,.28,.44));box(bx,476,bw*(28.2/94)*k,54,H2C);wt(bx+bw*(28.2/94)*k+14,516,'28.2',30,'#fff',800,'left',COND);
   ln([bx+bw,380,bx+bw,470],'rgba(227,236,238,.5)',2);});
  alphaDo(seg(u,.4,.46),()=>{tag(bx+bw/2,395,'減少 70%',{bg:EC,fg:'#0e2a3b',size:26,align:'center'});wt(bx,600,'換算約 3.4 kg CO₂e／kg H₂',26,'#fff',700,'left');wt(bx,644,'（28.2 g／MJ × 120 MJ／kg）',18,'rgba(227,236,238,.85)',500);});
  const R=[['額外性','電要來自新增的再生電源',.52,'#b37cff'],['時間相關','先以月對應；2030 年起逐小時',.64,EC],['地理相關','電源與電解槽在同一區域',.76,CC]];
  alphaDo(seg(u,.5,.54),()=>{card(860,160,680,600,{bg:'rgba(7,27,39,.75)'});wt(890,208,'電力的三條規則（歐盟）',22,EC,700);});
  R.forEach(([a,b,t0,col],i)=>alphaDo(seg(u,t0,t0+.07),()=>{const y=270+i*150;box(890,y,10,110,col);tag(920,y,a,{bg:col,fg:'#0e2a3b',size:24});wt(920,y+76,b,20,'rgba(227,236,238,.92)',500);}));
  alphaDo(seg(u,.84,.9),()=>wt(1200,730,'綠電憑證不等於綠氫',22,HC,700,'center'));
 }},

{t:'看數字，不看顏色',en:'Read the number, not the colour',dur:13,
 d:'把幾條路線放在同一張圖上：灰氫約 10 公斤；藍氫約 1 到 4 公斤，視捕捉率與甲烷洩漏而定；用光電電解約 2 公斤，用離岸風電不到 1 公斤；用台灣電網電解則約 24 公斤。顏色只是方便溝通的簡稱，每公斤氫的碳排才是真正的比較基礎。因此要減碳，先要有大量低碳電力；氫最適合用在電氣化困難的地方，例如煉油、化工與重型運輸，並要求每批氫都有可追溯的排放數字。',
 s:[[0,'灰氫約 10 公斤，藍氫約 1 到 4 公斤'],[.3,'用光電與離岸風電電解，約 2 與 0.6 公斤'],[.58,'用台灣電網電解，約 24 公斤，反而最高'],[.82,'氫要先有低碳電力，並提供可追溯的排放數字']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,1480,560,{title:'每公斤氫的碳排放（kg CO₂e／kg H₂，典型範例）',x0:0,x1:26,y0:0,y1:5.6,xt:[0,5,10,15,20,25],yt:[],xl:'',pt:70,pb:50,pl:280,gx:5,gy:0});
  const rows=[['灰氫（天然氣）',10,HC,.04],['藍氫（加碳捕捉）',2.5,CC,.14],['綠氫（光電）',2.3,EC,.3],['綠氫（離岸風電）',.6,PC,.4],['電網電解（台灣）',24.3,'#e8572a',.56]];
  rows.forEach(([n,v,col,t0],i)=>{const y=c.Y(4.5-i),h=58,k=ease(seg(u,t0,t0+.14));
   alphaDo(seg(u,t0,t0+.04),()=>wt(c.px-18,y+8,n,23,'rgba(227,236,238,.95)',700,'right'));
   if(k>0){const x1=c.X(v*k);box(c.X(0),y-h/2,Math.max(3,x1-c.X(0)),h,col);if(k>.9)wt(x1+14,y+10,trf('約 {n}',{n:v<3?v.toFixed(1):Math.round(v)}),28,'#fff',700,'left',COND);}});
  alphaDo(seg(u,.22,.28),()=>{ctx.setLineDash([10,8]);ln([c.X(3.4),c.py,c.X(3.4),c.py+c.ph],H2C,2.5);ctx.setLineDash([]);wt(c.X(3.4)+10,c.py+24,'歐盟門檻 3.4',18,H2C,700,'left');});
 }}
]};
