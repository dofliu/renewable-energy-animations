// KITS: land
/* 太陽光電系列 第 1 集：太陽光電場施工流程（地面型） */
const ANG=12*Math.PI/180,HALF=92,EMB=72;               // 1 m ≈ 40 px；樁入土約 1.8 m
const ROWS=[230,460,690,920,1150,1380];
const gy=x=>groundY(x);
function tg(cx){const dx=HALF*Math.cos(ANG),dy=HALF*Math.sin(ANG),y0=gy(cx)-40;return {x0:cx-dx,y0,x1:cx+dx,y1:y0-2*dy};}
const lineY=(g,x)=>g.y0+(x-g.x0)*(g.y1-g.y0)/(g.x1-g.x0);
const PILES=[];ROWS.forEach((cx,r)=>{const g=tg(cx);[g.x0+28,g.x1-28].forEach(x=>PILES.push({x,top:lineY(g,x)+9,r}));});
function drawPile(p,f,cut){
  const g0=gy(p.x),L=g0-p.top+EMB,top=g0+EMB*f-L;
  if(cut&&f>0)alphaDo(.7,()=>box(p.x-4,g0,8,EMB*f,'#5d6a73'));
  const yb=Math.min(g0,top+L);box(p.x-4,top,8,yb-top,'#9aa7b0');ln([p.x-4,top,p.x-4,yb],'#6f7c85',1.5);ln([p.x+4,top,p.x+4,yb],'#6f7c85',1.5);
  return top;
}
function drawRack(g,f){if(f<=0)return;alphaDo(f,()=>{ln([g.x0-4,g.y0+6,g.x1+4,g.y1+6],'#b8c2c8',5);
  for(const t of [.12,.5,.88]){const x=lerp(g.x0,g.x1,t),y=lerp(g.y0,g.y1,t)+2;box(x-4,y-3,8,6,'#d6dde1');}});}
function drawMod(g,k,i,glint){if(k<=0)return;ctx.save();ctx.globalAlpha*=clamp(k);ctx.translate(g.x0,g.y0-(1-k)*40);ctx.rotate(-ANG);
  const s0=i*92+1;box(s0,-8,90,8,'#1f3f66');ctx.strokeStyle='rgba(160,200,240,.5)';ctx.lineWidth=1;ctx.beginPath();for(let j=1;j<6;j++){ctx.moveTo(s0+j*15,-8);ctx.lineTo(s0+j*15,0);}ctx.stroke();
  box(s0,-8,90,1.6,'#9fc3e6');if(glint)box(s0+20+((TT*30)%50),-8,18,1.6,'#fff');circ(s0,-8,2.2,'#c9d1d6');circ(s0+90,-8,2.2,'#c9d1d6');ctx.restore();}
function drawTable(cx,rack,m0,m1,glint){const g=tg(cx);drawRack(g,rack);drawMod(g,m0,0,glint);drawMod(g,m1,1,glint);}
function excavator(x,t){const y=gy(x);box(x-58,y-16,116,16,'#2f3438');for(const wx of [-46,-16,16,46])circ(x+wx,y-8,6,'#555');
  box(x-44,y-44,92,28,'#e9b21f');box(x+4,y-78,38,34,'#e9b21f');box(x+10,y-72,22,18,'#2a3a46');
  const px=x-30,py=y-44,ex=x-95,ey=y-112+10*Math.sin(t*2.2),bx=x-138,by=y-24+18*Math.sin(t*2.2+1);
  ln([px,py,ex,ey],'#e0a81c',9);ln([ex,ey,bx,by],'#e0a81c',7);poly([bx-14,by-6,bx+6,by-10,bx+2,by+12,bx-16,by+8],'#3b3f43');}
function mound(x){return Math.max(0,20+16*Math.sin(x*.021)+12*nz(x*.013+3));}
function stake(x,a){alphaDo(a,()=>{const y=gy(x);ln([x,y,x,y-26],'#8a6a44',2.5);poly([x,y-26,x+12,y-22,x,y-18],'#ff7a1a');});}
function surveyor(x){const y=gy(x);person(x,y,'#ff7a1a',6);ln([x+9,y,x+9,y-66],'#dfe5e8',2);circ(x+9,y-68,5,'#f2c230');}

const EP={no:1,slug:'solar-pv',seriesName:'太陽光電系列',t:'太陽光電場施工流程',en:'Building a solar farm',
lede:'一座地面型太陽光電場，從一片空地到開始送電要經過哪些工序？這一集跟著工程團隊整地放樣、打樁、組裝支架與模組，再看直流如何串成組串、經變流器與升壓站併入台電電網。',
facts:[['1.5–3','m','地面型光電鋼樁常見的入土深度，依地質調查與拉拔試驗決定'],
['10–15','°','台灣地面型光電常見的模組傾角，兼顧發電量、排水與抗風'],
['1,500','V','直流系統電壓上限，決定一串最多能串接幾片模組'],
['約 26','片','每一串的模組數示例（單片開路電壓約 50 V）'],
['22.8 → 161','kV','大型案場在升壓站把集電電壓升到輸電電壓後併網'],
['1–1.5','公頃','每 MW 地面型光電大約需要的土地面積']],
note:'說明：本集為教育用途示意動畫，高度與距離比例經過調整。樁長、傾角、串列片數、電壓等級與用地面積為典型範例，實際依地質調查、結構計算、設備規格與台電併聯審查結果而定。',
base:()=>{landSky(GY,{sun:{x:300,y:130}});drawGround();},
shots:[
{t:'整地與放樣',en:'Site preparation and setting out',dur:12,side:true,
 d:'取得施工許可後，工程從整地開始。挖土機把高低起伏的地面整平，並依水土保持計畫挖設排水溝，讓大雨時的逕流有路可走。接著測量人員以衛星定位（GNSS RTK）依設計圖逐點放樣，在每一支樁的位置插上標樁，誤差控制在公分等級。最後沿著案場邊界架設施工圍籬，管制人車進出。',
 s:[[0,'挖土機把起伏的地面整平'],[.3,'整平後的場地，為打樁做準備'],[.5,'測量人員以 GNSS 逐點放樣，標出每一支樁的位置'],[.8,'挖設排水溝、架設施工圍籬']],
 cam:u=>({x:800,y:545,s:1.25}),
 draw(u){
  const exX=lerp(1480,120,easeOut(seg(u,.02,.48)));
  ctx.beginPath();ctx.moveTo(VX0,gy(VX0));for(let x=VX0;x<=VX1;x+=6){const h=x<exX-150?mound(x):x<exX-60?mound(x)*seg(exX-60-x,90,0):0;ctx.lineTo(x,gy(x)-h);}ctx.lineTo(VX1,gy(VX1));ctx.closePath();ctx.fillStyle='#9b7b58';ctx.fill();
  const da=seg(u,.78,.9);if(da>0)alphaDo(da,()=>{const y=gy(90);poly([55,y,125,y,112,y+22,68,y+22],'#6b5540');box(70,y+12,40,8,'#4f8fc4');});
  PILES.forEach((p,i)=>{const sx=lerp(150,1480,seg(u,.5,.8));stake(p.x,p.x<sx?1:0);});
  const sa=band(u,.48,.84);if(sa>0)alphaDo(sa,()=>surveyor(lerp(150,1480,seg(u,.5,.8))));
  const fa=seg(u,.84,.94);if(fa>0)alphaDo(fa,()=>fence(20,1580,GY+6));
  if(u<.52)excavator(exX,TT);
  lab(exX-80,gy(exX)-90,'挖土機整地',{dx:40,dy:-70,a:band(u,.04,.46)});
  lab(1200,gy(1200),'整平後的場地',{dx:0,dy:-80,st:'g',a:band(u,.28,.5)});
  lab(lerp(150,1480,seg(u,.5,.8))+9,gy(900)-68,'GNSS RTK 放樣',{dx:40,dy:-60,st:'s',a:band(u,.52,.8)});
  lab(PILES[4].x,gy(PILES[4].x)-24,'標樁：每一支樁的位置',{dx:-30,dy:-90,a:band(u,.62,.84)});
  lab(90,gy(90)+10,'排水溝',{dx:60,dy:-80,st:'l',a:band(u,.8,1)});
  lab(1300,GY-12,'施工圍籬',{dx:30,dy:-70,a:band(u,.86,1)});
 },
 hud(u){hudPanel(230,120,'整地與放樣',seg(u,.05,.1),w=>{hrow(56,'整地進度',Math.round(100*seg(u,.02,.48))+'%',w);hrow(88,'放樣點',Math.round(12*seg(u,.5,.8))+' / 12',w,'#f2c230');});}},

{t:'打樁：鋼樁基礎',en:'Driving the steel piles',dur:14,side:true,
 d:'地面型光電多半不用混凝土基礎，而是以打樁機把熱浸鍍鋅的 H 型鋼或 C 型鋼樁直接打進地面。打樁機沿著放樣點逐支施打，入土深度常在 1.5 到 3 公尺，依地質調查結果決定；石塊多的地層需先引孔。每一支樁打完要量測頂部高程、位置與垂直度，因為上面的支架要靠它們對齊，誤差太大就裝不上去。',
 s:[[0,'打樁機移到第一個標樁位置'],[.2,'液壓錘把鍍鋅鋼樁打入地面'],[.5,'剖面：鋼樁入土約 1.8 公尺'],[.75,'逐支量測頂部高程與垂直度']],
 cam:u=>camMix({x:560,y:520,s:1.45},{x:800,y:500,s:1.05},ease(seg(u,.55,.9))),
 draw(u){
  const ca=seg(u,.4,.5);if(ca>0)alphaDo(ca*.35,()=>box(VX0,GY+10,VX1-VX0,EMB+30,'#3a2c20'));
  const n=PILES.length,span=.84/n;let rigX=PILES[0].x-20,hy=0,cur=-1;
  PILES.forEach((p,i)=>{const t=(u-.06)/span-i;const f=t<.2?0:seg(t,.2,.9);if(t<0)return;const top=drawPile(p,f,ca>0);
    if(t>=0&&t<1){cur=i;const prev=i?PILES[i-1].x-20:p.x-140;rigX=lerp(prev,p.x-20,ease(seg(t,0,.2)));hy=f>0&&f<1?top-4*Math.abs(Math.sin(TT*14)):top;}});
  if(u<.06)rigX=lerp(PILES[0].x-160,PILES[0].x-20,ease(seg(u,0,.06)));
  if(cur<0&&u>=.06){rigX=PILES[n-1].x-20+lerp(0,160,seg(u,.9,1));}
  pileRig(rigX,gy(rigX),hy||gy(rigX)-110);
  lab(rigX+20,gy(rigX)-170,'打樁機',{dx:50,dy:-40,a:band(u,.03,.4)});
  lab(PILES[1].x,PILES[1].top,'熱浸鍍鋅鋼樁',{dx:-40,dy:-80,st:'s',a:band(u,.2,.5)});
  lab(PILES[2].x,gy(PILES[2].x)+EMB,'入土約 1.8 m',{dx:60,dy:30,st:'l',a:band(u,.48,.75)});
  tick(PILES[0].x-10,gy(PILES[0].x)+EMB/2,'地下','right');
  lab(PILES[5].x,PILES[5].top,'量測高程與垂直度',{dx:30,dy:-90,st:'g',a:band(u,.72,1)});
 },
 hud(u){hudPanel(230,150,'打樁紀錄',seg(u,.08,.13),w=>{const k=Math.min(12,Math.floor(Math.max(0,(u-.06)/(.84/12))));hrow(56,'已完成',trf('{k} / 12 支',{k}),w);hrow(88,'入土深度','1.8 m',w);hrow(120,'垂直度偏差','0.4°',w,'#7dffc4');});}},

{t:'基樁為什麼怕「拔」',en:'Why piles are tested for uplift',dur:13,
 d:'太陽能板像一面斜放的大板子，颱風吹過時，板下的氣流會產生向上的「上拔力」，同時還有側向推力。鋼樁靠著與土壤之間的摩擦與側向土壓抵抗這些力。因此施工前會在現場做拉拔試驗：用千斤頂把樁往上拉，記錄載重與位移，確認在設計載重的倍數下，位移仍在容許範圍內，才決定整區的樁長。',
 s:[[0,'颱風時，板下氣流產生向上的上拔力'],[.25,'加上側向風力，都由鋼樁傳給土壤'],[.45,'土壤摩擦力抵抗上拔'],[.6,'現場拉拔試驗：記錄載重與上拔位移'],[.85,'達到試驗載重、位移仍在容許值內：合格']],
 draw(u){
  diagBG();
  card(70,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(94,200,'作用在樁上的力',20,'#f2c230',700);
  const G=560,px=420;box(90,G,660,220,'#5a4633');ln([90,G,750,G],'#8fbf6a',3);
  box(px-6,G-150,12,150+130,'#9aa7b0');ctx.save();ctx.translate(px,G-150);ctx.rotate(-ANG);box(-190,-10,380,10,'#1f3f66');box(-190,-10,380,2,'#9fc3e6');ctx.restore();
  const a1=seg(u,.03,.2),a2=seg(u,.22,.38),a3=seg(u,.42,.56);
  alphaDo(a1,()=>{for(let i=0;i<4;i++){const y=G-110+i*12;arrow(120,y+30,260,y-10,'rgba(125,200,255,.8)',2.5);}arrow(px,G-160,px,G-260,'#e8572a',6);wt(px+16,G-236,'上拔力（風吸力）',19,'#ffb199',700);});
  alphaDo(a2,()=>{arrow(px-150,G-60,px-14,G-60,'#f2c230',5);wt(px-150,G-78,'側向風力',18,'#f2c230',700);});
  alphaDo(a3,()=>{for(let i=0;i<4;i++){const y=G+30+i*28;arrow(px-26,y,px-26,y+22,'#7dffc4',3);arrow(px+26,y,px+26,y+22,'#7dffc4',3);}wt(px+44,G+80,'土壤摩擦阻抗',18,'#7dffc4',700);wt(px+44,G+106,'入土深度決定阻抗大小',15,'rgba(227,236,238,.75)',500);});
  const c=chartBox(840,160,690,640,{title:'拉拔試驗：載重與上拔位移（示例）',x0:0,x1:30,y0:0,y1:25,xt:[0,10,20,30],yt:[0,5,10,15,20,25],xl:'拉拔載重（kN）',yl:'位移（mm）',pt:70});
  const lmax=24*seg(u,.58,.84);
  if(lmax>0){ctx.beginPath();for(let L=0;L<=lmax;L+=.25){const d=.28*L+.0009*L*L*L;L?ctx.lineTo(c.X(L),c.Y(d)):ctx.moveTo(c.X(L),c.Y(d));}ctx.strokeStyle='#7dffc4';ctx.lineWidth=3;ctx.stroke();
   const d=.28*lmax+.0009*lmax**3;circ(c.X(lmax),c.Y(d),6,'#7dffc4');}
  alphaDo(seg(u,.6,.66),()=>{ctx.setLineDash([8,6]);ln([c.X(12),c.py,c.X(12),c.py+c.ph],'#f2c230',2);ln([c.px,c.Y(20),c.px+c.pw,c.Y(20)],'#e8572a',2);ctx.setLineDash([]);
   wt(c.X(12)+8,c.py+24,'設計上拔力 12 kN',16,'#f2c230',700);wt(c.px+c.pw-8,c.Y(20)-10,'容許位移 20 mm',16,'#ffb199',700,'right');});
  alphaDo(seg(u,.8,.86),()=>{wt(c.X(24)-8,c.py+56,'試驗載重＝2 倍',16,'#7dffc4',700,'right');});
  alphaDo(seg(u,.86,.92),()=>tag(c.px+20,c.py+c.ph-40,'位移在容許值內：合格',{bg:'#1f7f5c',fg:'#fff',size:18}));
 }},

{t:'支架與模組安裝',en:'Racking and module installation',dur:14,side:true,
 d:'樁位確認後，工班在樁頂鎖上斜樑，再橫向架設檁條，形成固定傾角的支架。台灣常見傾角約 10 到 15 度，面向南方；角度太大會增加受風面積，太小則不利雨水沖刷灰塵。接著兩人一組把模組抬上支架，以直立兩排（2P）的方式排列，再用壓塊鎖在檁條上。每片模組的背面有接線盒與快速接頭，裝好後就能開始配線。',
 s:[[0,'樁頂鎖上斜樑與檁條，組成固定傾角的支架'],[.35,'模組以直立兩排（2P）排列，傾角約 12°'],[.6,'兩人一組把模組抬上支架，壓塊鎖固'],[.85,'一排排完成，準備配線']],
 cam:u=>camMix({x:520,y:530,s:1.6},{x:800,y:500,s:1.05},ease(seg(u,.6,.95))),
 draw(u){
  PILES.forEach(p=>drawPile(p,1,false));
  ROWS.forEach((cx,i)=>{const r=seg(u,.02+i*.07,.1+i*.07),m0=seg(u,.3+i*.09,.36+i*.09),m1=seg(u,.34+i*.09,.4+i*.09);drawTable(cx,r,m0,m1,false);});
  const ci=clamp(Math.floor((u-.3)/.09),0,5),cx=ROWS[ci],g=tg(cx);
  if(u>.28&&u<.9){person(g.x0-18,gy(g.x0-18),'#f2c230',6);person(g.x1+18,gy(g.x1+18),'#ff7a1a',6);}
  const g1=tg(ROWS[1]);
  lab((g1.x0+g1.x1)/2,(g1.y0+g1.y1)/2+6,'斜樑與檁條',{dx:-60,dy:-90,a:band(u,.1,.34)});
  const g0=tg(ROWS[0]);tick(g0.x1+12,g0.y1-6,'傾角約 12°','left');
  lab(g0.x0+40,lineY(g0,g0.x0+40)-8,'模組直立兩排（2P）',{dx:-20,dy:-100,st:'s',a:band(u,.34,.6)});
  lab(g0.x1-2,lineY(g0,g0.x1-2)-8,'壓塊固定',{dx:40,dy:-60,st:'l',a:band(u,.5,.75)});
  lab(g.x0-18,gy(g.x0)-40,'兩人一組抬運模組',{dx:-40,dy:-120,a:band(u,.58,.85)});
 },
 hud(u){hudPanel(230,120,'本區安裝進度',seg(u,.05,.1),w=>{hrow(56,'支架',trf('{k} / 6 排',{k:Math.round(6*seg(u,.02,.47))}),w);let m=0;ROWS.forEach((c,i)=>{m+=Math.round(seg(u,.3+i*.09,.36+i*.09))+Math.round(seg(u,.34+i*.09,.4+i*.09));});hrow(88,'模組',trf('{k} / 12 片',{k:m}),w,'#f2c230');});}},

{t:'組串：直流怎麼串',en:'Stringing the DC side',dur:13,
 d:'一片模組的電壓只有數十伏特，要把許多片串聯成一「串」，電壓才夠讓變流器有效率地工作。串接的片數有上限：模組在低溫時電壓會升高，整串的開路電壓必須低於系統上限 1,500 V。以單片開路電壓約 50 V 為例，一串約可接 26 片。多串模組再並聯接到組串式變流器，由它追蹤最大功率點，把直流轉成交流。',
 s:[[0,'模組一片接一片串聯，電壓逐片相加'],[.3,'26 片約 1,300 V；低溫時電壓再升高'],[.5,'整串電壓必須低於系統上限 1,500 V'],[.7,'多串並聯接到組串式變流器，直流轉成交流']],
 draw(u){
  diagBG();
  const N=26,k=seg(u,.02,.42),lit=Math.floor(N*k+.001);
  wt(80,200,'一串模組（串聯）',20,'#f2c230',700);
  for(let i=0;i<N;i++){const x=80+i*54;box(x,226,46,62,i<lit?'#2b5f99':'#1a3350');ctx.strokeStyle='rgba(160,200,240,.5)';ctx.lineWidth=1;ctx.strokeRect(x,226,46,62);if(i<N-1)ln([x+46,257,x+54,257],i<lit-1?'#f2c230':'rgba(255,255,255,.25)',2);}
  wt(80,330,trf('{n} 片 × 約 50 V ＝ {v} V',{n:lit,v:(lit*50).toLocaleString('en-US')}),22,'#fff',700);
  const c=chartBox(70,380,780,420,{title:'串接片數與整串開路電壓',x0:0,x1:30,y0:0,y1:1600,xt:[0,10,20,30],yt:[0,500,1000,1500],xl:'串接片數',yl:'V',pt:66});
  ln([c.px,c.Y(1500),c.px+c.pw,c.Y(1500)],'#e8572a',2.5);wt(c.px+10,c.Y(1500)-10,'系統上限 1,500 V',16,'#ffb199',700);
  ln([c.X(0),c.Y(0),c.X(lit),c.Y(lit*50)],'#7dffc4',3);circ(c.X(lit),c.Y(lit*50),5,'#7dffc4');
  alphaDo(seg(u,.3,.4),()=>{ctx.setLineDash([7,6]);ln([c.X(0),c.Y(0),c.X(26),c.Y(1390)],'#f2c230',2);ctx.setLineDash([]);wt(c.X(26)-6,c.Y(1390)-14,'低溫時約 1,390 V',16,'#f2c230',700,'right');});
  card(900,380,630,420,{bg:'rgba(7,27,39,.75)'});wt(924,418,'多串並聯 → 組串式變流器',20,'#f2c230',700);
  const a=seg(u,.62,.74);
  alphaDo(a,()=>{for(let j=0;j<4;j++){const y=480+j*70;box(930,y-16,150,32,'#2b5f99');wt(1005,y,trf('第 {n} 串',{n:j+1}),16,'#fff',700,'center',FONT,'middle');ln([1080,y,1240,590],'#f2c230',2.5);
     const f=((TT*.6+j*.25)%1);circ(lerp(1080,1240,f),lerp(y,590,f),4,'#fff');}
   rrp(1240,540,150,100,12);ctx.fillStyle='#dfe5e8';ctx.fill();wt(1315,580,'變流器',18,'#13232e',700,'center');wt(1315,610,'DC → AC',16,'#13232e',600,'center',COND);
   arrow(1390,590,1500,590,'#7dffc4',4);wt(1445,570,'交流',16,'#7dffc4',700,'center');
   wt(924,760,'MPPT：隨日照調整工作點，取得最大功率',16,'rgba(227,236,238,.8)',500);});
 }},

{t:'變流器、升壓與併網',en:'From inverter to the grid',dur:13,
 d:'變流器輸出的低壓交流電，先在場內的箱式變電站升到 22.8 kV，再由集電線路匯集到升壓站。小型案場可以直接併入台電的 22.8 kV 饋線；大型案場則自建或共用升壓站，把電壓升到 161 kV 或 69 kV 後併入輸電網。電壓越高，同樣的功率所需電流越小，線路損失也越低。',
 s:[[0,'模組串列的直流電進入組串式變流器'],[.25,'箱式變電站把低壓交流升到 22.8 kV'],[.5,'集電線路匯集各區的電力到升壓站'],[.72,'升壓到 161 kV，併入台電輸電網']],
 draw(u){
  diagBG();
  const Y=420,N=[[140,'模組串列','1,500 V 以下 DC'],[400,'組串式變流器','約 800 V AC'],[660,'箱式變電站','0.8 → 22.8 kV'],[930,'22.8 kV 集電線路','地下電纜'],[1200,'升壓站','22.8 → 161 kV'],[1460,'台電電網','161 kV']];
  N.forEach((n,i)=>{const a=seg(u,.02+i*.14,.08+i*.14);if(a<=0)return;alphaDo(a,()=>{
    if(i){const x0=N[i-1][0]+70,x1=n[0]-70;ln([x0,Y,x1,Y],i<2?'#f2c230':'#7dffc4',4);for(let k=0;k<3;k++){const f=((TT*.5+k/3)%1);circ(lerp(x0,x1,f),Y,5,'#fff');}}
    rrp(n[0]-70,Y-50,140,100,14);ctx.fillStyle=i===5?'#1f7f5c':'rgba(255,255,255,.1)';ctx.fill();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.5;ctx.stroke();
    wt(n[0],Y-80,n[1],18,'#fff',700,'center');wt(n[0],Y+8,n[2],16,i<1?'#f2c230':'#7dffc4',700,'center',COND,'middle');});});
  alphaDo(seg(u,.02,.1),()=>wt(140,Y+90,'直流',16,'#f2c230',700,'center'));
  alphaDo(seg(u,.16,.24),()=>wt(400,Y+90,'直流 → 交流',16,'rgba(227,236,238,.8)',600,'center'));
  const b=seg(u,.78,.88);
  alphaDo(b,()=>{card(140,590,1320,190,{bg:'rgba(7,27,39,.75)'});wt(170,632,'兩種併網方式',20,'#f2c230',700);
   tag(170,690,'小型案場',{size:18});wt(310,696,'直接併入台電 22.8 kV 饋線',18,'#fff',500);
   tag(170,746,'大型案場',{size:18,bg:'#7dffc4'});wt(310,752,'自建或共用升壓站，升到 161 kV 或 69 kV 併入輸電網',18,'#fff',500);});
 }},

{t:'竣工查驗與併聯運轉',en:'Commissioning and first power',dur:13,side:true,
 d:'設備全部裝好後，先由電機技師與施工團隊做竣工檢查：量測每一串的開路電壓與絕緣電阻、確認模組與支架確實接地，並以 I-V 曲線量測找出異常的組串。接著向台電申請併聯試運轉，保護電驛與通訊都確認正常後正式送電；最後向能源署辦理設備登記，案場才進入商轉，開始二十年的發電與維運。',
 s:[[0,'竣工檢查：開路電壓、絕緣電阻與接地'],[.3,'I-V 曲線量測，找出異常組串'],[.55,'台電併聯試運轉，正式送電'],[.8,'辦理設備登記後進入商轉']],
 base:u=>{landSky(GY,{sun:{x:lerp(260,1500,u),y:130+180*seg(u,.6,1)},dusk:.75*seg(u,.65,1)});drawGround();},
 cam:u=>({x:820,y:525,s:1.12}),
 draw(u){
  PILES.forEach(p=>drawPile(p,1,false));
  ROWS.forEach(cx=>drawTable(cx,1,1,1,u>.55));
  [0,2,4].forEach(i=>{const g=tg(ROWS[i]),x=g.x1-28;box(x+5,gy(x)-40,20,26,'#dfe5e8');});
  const bx=1455;cabinet(bx-40,gy(bx),80,62,'#dfe5e8');ln([bx+40,gy(bx)-40,1600,gy(bx)-120],'rgba(40,50,56,.7)',2);
  if(u<.52){const x=lerp(300,1100,seg(u,.02,.5));person(x,gy(x),'#f2c230',6);box(x+5,gy(x)-40,8,10,'#e3ecee');}
  lab(tg(ROWS[1]).x1-10,gy(ROWS[1])-40,'組串式變流器',{dx:40,dy:-90,a:band(u,.03,.3)});
  lab(lerp(300,1100,seg(u,.02,.5)),gy(700)-44,'I-V 曲線量測',{dx:-20,dy:-110,st:'s',a:band(u,.28,.52)});
  lab(bx,gy(bx)-62,'箱式變電站',{dx:-60,dy:-80,a:band(u,.45,.8)});
  lab(1560,gy(1560)-100,'併入台電電網',{dx:-30,dy:-70,st:'g',a:band(u,.58,.85)});
  lab(800,gy(800)-60,'設備登記完成，進入商轉',{dx:0,dy:-150,st:'g',a:band(u,.82,1)});
 },
 hud(u){hudPanel(240,150,'案場即時狀態',seg(u,.05,.1),w=>{const on=u>.55,p=on?10*clamp(Math.sin(Math.PI*lerp(.35,1.02,seg(u,.55,1)))):0;
  hrow(56,'絕緣電阻',u>.1?'> 1 MΩ':'—',w);hrow(88,'併聯狀態',on?'併聯中':'待併聯',w,on?'#7dffc4':'#f2c230');hrow(120,'發電功率（示例）',p.toFixed(1)+' MW',w,'#f2c230');});}}
]};
