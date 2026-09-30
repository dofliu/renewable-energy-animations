// KITS: marine
/* ================= EP19 港口與在地供應鏈 ================= */
const QX=860,QY=452,SBD=760;                                   // 碼頭岸壁、碼頭面、港池海床
/* text wrapped to a width (after translation) */
function wrap19(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
/* 港口側視背景：港池在左、碼頭與後線場地在右 */
function portBase(){
  drawSky();
  const xe=Math.min(VX1,QX);
  if(xe>VX0){const g=ctx.createLinearGradient(0,SEA,0,SBD);g.addColorStop(0,'#3b93bb');g.addColorStop(.5,'#1d6690');g.addColorStop(1,'#0b3858');
   ctx.beginPath();ctx.moveTo(VX0,wv(VX0,TT));for(let x=VX0;x<=xe;x+=8)ctx.lineTo(x,wv(x,TT));ctx.lineTo(xe,SBD+10);ctx.lineTo(VX0,SBD+10);ctx.closePath();ctx.fillStyle=g;ctx.fill();
   ctx.beginPath();ctx.moveTo(VX0,wv(VX0,TT));for(let x=VX0;x<=xe;x+=8)ctx.lineTo(x,wv(x,TT));ctx.strokeStyle='rgba(255,255,255,.75)';ctx.lineWidth=1.6;ctx.stroke();
   box(VX0,SBD,xe-VX0,VY1-SBD+20,'#b59a6a');ln([VX0,SBD,xe,SBD],'#a98a58',2);}
  /* 後線廠房 */
  for(const [x,w,h] of [[1180,170,70],[1370,210,92],[1600,240,80]]){box(x,QY-h,w,h,'#c7cfd3');poly([x-4,QY-h,x+w/2,QY-h-18,x+w+4,QY-h],'#8e9aa1');for(let i=0;i<Math.floor(w/40);i++)box(x+12+i*40,QY-h+16,24,12,'rgba(90,110,120,.45)');}
  /* 回填地盤與岸壁 */
  box(QX,QY+20,VX1-QX+40,VY1-QY,'#8f7c5c');
  const r=rng(19);for(let i=0;i<160;i++){const x=QX+r()*900,y=QY+24+r()*(SBD-QY);circ(x,y,1+r()*2,'rgba(60,45,30,.35)');}
  box(QX-26,QY,34,SBD-QY+12,'#9aa3a8');ln([QX-26,QY,QX-26,SBD+12],'rgba(0,0,0,.35)',2);
  for(let y=QY+40;y<SBD;y+=60)ln([QX-26,y,QX+8,y],'rgba(0,0,0,.18)',1.5);
  box(QX-26,QY,VX1-QX+66,20,'#c3c9cc');ln([QX-26,QY,VX1+40,QY],'#e3e8ea',2);
  for(let y=QY+26;y<SEA+30;y+=26)box(QX-34,y,8,18,'#2b3137');
  for(let x=QX+10;x<QX+160;x+=70)box(x,QY-6,8,6,'#2b3137');
}
/* 平躺的塔段 */
function towerLying(x,y,k){ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/2);drawTowerSec(0,0,k);ctx.restore();box(x+8,y+10,10,QY-y-10,'#4a5860');box(x+HS-18,y+10,10,QY-y-10,'#4a5860');}
/* 完整塔架（三段） */
function towerUp(cx,yb,n){for(let k=0;k<(n===undefined?3:n);k++)drawTowerSec(cx,yb-k*HS,k);}
/* 機艙＋輪轂放在支架上 */
function nacStand(ax,yb,s){ctx.save();ctx.translate(ax,yb);ctx.scale(s||1,s||1);box(-34,-10,70,10,'#4a5860');drawNacelle(0,-10,0,false);circ(-58,-30,8,'#f2f5f6','rgba(0,0,0,.25)',1);ctx.restore();}
/* 葉片儲放架 */
function bladeRack(x,yb,n,R){R=R||165;for(const fx of [x+14,x+R*.62])box(fx-5,yb-16*n-8,10,16*n+8,'#4a5860');for(let i=0;i<n;i++)drawBlade(x,yb-12-16*i,0,R);}
/* 自走式模組運輸車（SPMT） */
function spmt(x,y,w){box(x-w/2,y-16,w,9,'#e9b21f','rgba(0,0,0,.35)',1);box(x-w/2+4,y-7,w-8,3,'#394650');for(let wx=x-w/2+8;wx<x+w/2-4;wx+=13)circ(wx,y-3,4,'#222','#555',1);}
/* 履帶式起重機：回傳吊臂支點 */
function crawler(x,y){box(x-52,y-16,104,16,'#2b3137');for(let k=0;k<7;k++)circ(x-44+k*14.6,y-8,4,'#555');box(x-38,y-44,76,28,'#e9b21f','rgba(0,0,0,.35)',1);box(x+12,y-62,22,18,'#dfe5e8');box(x+15,y-58,14,9,'#2a3a46');box(x-50,y-38,16,22,'#6f7a80');return {x:x-24,y:y-40};}
/* 分鏡 3：塔段吊運路徑 */
const T3X=1060,T3S=[1180,1240],T3C=1500;
function path3(u,i){const a=i?.48:.08,b=i?.78:.38,x0=T3S[i],y0=QY-HS,y1=QY-(i+2)*HS,lift=y1-30;
  const k=seg(u,a,b);if(k<=0)return {x:x0,y:y0,st:0};if(k>=1)return {x:T3X,y:y1,st:2};
  if(k<.3)return {x:x0,y:lerp(y0,lift,ease(k/.3)),st:1};if(k<.7)return {x:lerp(x0,T3X,ease((k-.3)/.4)),y:lift,st:1};
  return {x:T3X,y:lerp(lift,y1,ease((k-.7)/.3)),st:1};}   // y：塔段頂端
/* 分鏡 5：安裝船裝船與出港 */
const R5=QX-8;
function wtiv5(u){const dn=ease(seg(u,.62,.72)),go=easeIn(seg(u,.74,1));
  const d=lerp(SEA-78,SEA-26,dn)+(dn>=1?wv(R5,TT)-SEA:0),leg=lerp(SBD,d+80,ease(seg(u,.62,.74)));return {R:R5-760*go,d,leg,go};}
const SLOT5=[-330,-290,-250,-210];
/* 分鏡 6：月可作業比例（示例） */
const WK6=[22,28,42,58,68,64,50,52,48,34,24,20];
/* 分鏡 7：台灣西部海岸簡圖 */
const MAP7=[[121.53,25.3],[121.9,25.13],[122.0,25.0],[121.85,24.6],[121.8,24.3],[121.6,23.9],[121.45,23.3],[121.2,22.8],[120.9,22.3],[120.85,21.9],[120.7,22.0],[120.6,22.4],[120.3,22.6],[120.15,23.0],[120.1,23.4],[120.25,23.85],[120.45,24.2],[120.75,24.6],[121.0,24.85],[121.2,25.05],[121.4,25.18]];
const MX=lon=>250+(lon-119.6)*142,MY=lat=>240+(25.4-lat)*155;

const EP={no:19,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'港口與在地供應鏈',en:'Ports and the local supply chain',
lede:'一座離岸風機的零件比大樓還大、比火車頭還重，海上安裝能不能順利，很大一部分在港口就決定了。這一集走進風電母港，看重件碼頭為什麼要特別強、預組裝場在岸上先做了什麼、安裝船怎麼裝船出港與等待天候窗口，再看台灣這幾年建立起來的在地供應鏈。',
facts:[['50','t/m²','台中港 #5A、#5B 重件碼頭的設計承載力（台灣港務公司）'],
['40','t/m²','台中港 #106 與新建 #37、#38 碼頭的設計承載力'],
['30','ha','台中港每個預組裝區可專用的零組件儲放用地'],
['4–7','組','自升式安裝船單趟可載運的風機組數，依船型與機組大小而定（示例）'],
['4,000','t','台船與 DEME 合資、在高雄建造的「綠鯨號」起重能力'],
['> 1.5','GW','高雄華新海纜廠可支應的離岸風電市場需求（報導值）']],
note:'說明：本集為教育用途示意動畫，碼頭、船舶與零組件的比例都經過簡化，作業時間已壓縮。台中港 #5A、#5B（50 t/m²）、#106 與 #37、#38（40 t/m²）的設計承載力與每區約 30 公頃的儲放用地取自台灣港務公司與媒體公開資訊；「綠鯨號」起重能力 4,000 t 取自 CDWE 與 DEME 公開資料；華新高雄海纜廠依 2025 年 12 月開幕報導。一般碼頭承載力、履帶吊車接地壓力、吊裝次數、單趟載運組數、各月可作業比例、風速與浪高作業上限、航次時程皆為典型範例，並非特定案場或船舶的資料。',
base:()=>portBase(),end:()=>{},
shots:[
/* 1 ─────────────────────────────── 風電母港 */
{t:'風電母港：零件在碼頭集結',en:'The marshalling harbour',dur:12,side:true,
 d:'離岸風機的零件從各地工廠運到港口，在碼頭後方的儲放場集結：完整的塔架直立排開，機艙放在支架上，八十多公尺長的葉片疊在儲放架上。這些零件單件就重達數百噸，必須用自走式模組運輸車（SPMT）緩慢移動，再由自升式安裝船停靠重件碼頭裝船。台中港是台灣主要的風電母港，#5A、#5B 重件碼頭的設計承載力達每平方公尺 50 公噸。',
 s:[[0,'風機零件在港口後方的儲放場集結'],[.25,'塔架直立排開，葉片疊在儲放架上'],[.5,'自走式模組運輸車把機艙慢慢移到碼頭邊'],[.76,'自升式安裝船停靠重件碼頭，準備裝船']],
 cam:u=>camMix({x:1180,y:370,s:1.45},{x:800,y:400,s:1},ease(seg(u,.3,.7))),
 draw(u){
  const W=drawWTIV;W(R5,SEA-78,SBD);crane(R5-25,SEA-122,340,R5-150,SEA-200,{col:'#e9b21f'});
  towerUp(960,QY);towerUp(1010,QY);
  nacStand(1110,QY,.9);nacStand(1205,QY,.9);
  bladeRack(1280,QY,3);
  towerLying(1500,QY-26,1);
  const sx=lerp(1560,1000,ease(seg(u,.42,.76)));spmt(sx,QY+20,130);nacStand(sx+4,QY+4,.9);
  [[920,0],[1070,1],[1250,2],[1450,3]].forEach(([x,i])=>person(x+8*Math.sin(TT*.7+i),QY,i%2?'#e8572a':'#f2c230',3));
  lab(1010,QY-HS*3,'完整塔架',{dx:-40,dy:-60,a:band(u,.04,.34),st:'l'});
  lab(1350,QY-40,'葉片儲放架',{dx:40,dy:-90,a:band(u,.24,.5),st:'l'});
  lab(sx,QY+10,'自走式模組運輸車（SPMT）',{dx:40,dy:70,a:band(u,.48,.76),st:'s'});
  lab(1160,QY-40,'機艙',{dx:10,dy:-110,a:band(u,.08,.34)});
  lab(R5-250,SEA-78,'自升式安裝船',{dx:-60,dy:-120,a:band(u,.74,1),st:'s'});
  lab(QX+30,QY+10,'重件碼頭',{dx:60,dy:80,a:band(u,.76,1),st:'w'});
 },
 hud(u){hudPanel(240,154,'台中港重件碼頭（公開資料）',seg(u,.04,.1),w=>{
  hrow(52,'#5A、#5B 承載力','50 t/m²',w,'#f2c230');hrow(78,'#106 承載力','40 t/m²',w);
  hrow(104,'#37、#38 承載力','40 t/m²',w);hrow(132,'每區儲放用地','約 30 ha',w,'#7dffc4');});}},

/* 2 ─────────────────────────────── 重件碼頭 */
{t:'重件碼頭為什麼要特別強',en:'Why heavy-load quays',dur:13,
 d:'一般碼頭主要承載貨櫃與散貨，設計承載力大約每平方公尺數公噸；風電零件卻集中在很小的面積上。大型履帶吊車吊起數百噸的機艙時，履帶下的接地壓力可達每平方公尺數十公噸，SPMT 與儲放架也把重量壓在局部地盤上。所以重件碼頭要加厚面版、改良後線地盤。安裝船若要在碼頭邊插腿頂升，前方的海床也要鋪設碎石墊，讓樁腿有穩固的支撐。',
 s:[[0,'風電零件的重量集中在很小的面積上'],[.24,'履帶吊車吊重時，接地壓力可達每平方公尺數十噸'],[.5,'碼頭前方的碎石墊，支撐安裝船的樁腿'],[.72,'重件碼頭的承載力，是一般碼頭的十倍以上']],
 draw(u){
  diagBG();
  card(60,160,960,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'重件碼頭剖面（示意）',20,'#f2c230',700);
  const WX=420,AY=420,SL=440,BD=700;
  ctx.save();rrp(61,161,958,638,14);ctx.clip();
  box(61,SL,WX-61,BD-SL,'rgba(59,147,187,.35)');ln([61,SL,WX,SL],'rgba(255,255,255,.7)',1.5);
  box(61,BD,WX-61,100,'rgba(181,154,106,.85)');
  box(WX,AY+24,600,380,'rgba(143,124,92,.85)');
  const gi=seg(u,.72,.8);if(gi>0)alphaDo(gi,()=>{for(let x=WX+40;x<1010;x+=46)ln([x,AY+40,x,AY+200],'rgba(242,194,48,.55)',3);wt(720,AY+230,'後線地盤改良',17,'#f2c230',700,'center');});
  box(WX-30,AY,40,BD-AY+20,'#9aa3a8');box(WX-30,AY,600,24,'#c3c9cc');
  ctx.restore();
  /* 履帶吊車與機艙 */
  const lk=ease(seg(u,.06,.3)),pv=crawler(760,AY),hy=lerp(AY-62,AY-200,lk);
  const tip=crane(pv.x,pv.y,330,560,hy,{col:'#e9b21f',w:10});
  ctx.save();ctx.translate(tip.x+20,tip.hy+56);ctx.scale(1.3,1.3);drawNacelle(0,0,0,false);ctx.restore();slings(tip.x,tip.hy,[tip.x-10,tip.hy+10,tip.x+50,tip.hy+10]);
  const pk=seg(u,.2,.34),np=Math.round(30*pk);
  if(pk>0){alphaDo(pk,()=>{for(let i=0;i<5;i++){const x=716+i*22,L=16+30*pk+4*Math.sin(TT*5+i);arrow(x,AY+26,x,AY+26+L,'#e8572a',3);}
   tag(760,AY+120,trf('接地壓力 約 {n} t/m²',{n:np}),{size:16,bg:'#e8572a',fg:'#fff',align:'center'});});}
  /* 樁腿與碎石墊 */
  const jp=seg(u,.46,.54);
  alphaDo(.35+.65*jp,()=>{wtivLeg(260,BD-4,'#f2c230',1);});
  alphaDo(jp,()=>{poly([180,BD,200,BD-14,320,BD-14,340,BD],'#9aa3a8','rgba(0,0,0,.3)',1);const r=rng(7);for(let i=0;i<24;i++)circ(190+r()*140,BD-3-r()*10,2+r()*2,'#6f7a80');
   for(let i=0;i<3;i++){const k=(TT*.8+i/3)%1;alphaDo(1-k,()=>arrow(260,BD-120+k*40,260,BD-80+k*40,'#f2c230',3));}
   wt(260,BD+40,'碎石墊',17,'#fff',700,'center');wt(260,BD-440,'安裝船樁腿',17,'#f2c230',700,'center');});
  alphaDo(1-seg(u,.44,.48),()=>{wt(240,BD-120,'港池',17,'rgba(227,236,238,.7)',600,'center');});
  wt(840,AY-10,'碼頭面版',16,'rgba(227,236,238,.85)',600);
  /* 右：承載力比較 */
  card(1060,160,480,640,{bg:'rgba(7,27,39,.75)'});wt(1084,200,'碼頭設計承載力',20,'#f2c230',700);wt(1084,228,'單位：t/m²',15,'rgba(227,236,238,.7)',500);
  const B=[['一般碼頭（示例）',3,'#58b8d0'],['台中港 #106',40,'#7dffc4'],['台中港 #37、#38',40,'#7dffc4'],['台中港 #5A、#5B',50,'#f2c230']];
  B.forEach(([n,v,c],i)=>{const k=ease(seg(u,.6+i*.04,.7+i*.04)),y=280+i*110;wt(1084,y,n,18,'#fff',700);
   box(1084,y+18,400,26,'rgba(255,255,255,.07)');box(1084,y+18,400*v/50*k,26,c);wt(1084+400*v/50*k+8,y+40,String(Math.round(v*k)),20,c,700,'left',COND);});
  alphaDo(seg(u,.8,.86),()=>{wrap19(1084,720,'重件碼頭約為一般碼頭的十倍以上',430,17,'rgba(227,236,238,.9)',600,24);});
 }},

/* 3 ─────────────────────────────── 預組裝 */
{t:'預組裝：在岸上先完成',en:'Pre-assembly on land',dur:13,side:true,
 d:'塔架從工廠出來時是好幾段鋼管，每段長二、三十公尺。預組裝場用大型履帶吊車把塔段一節節疊起來，以數百支高強度螺栓鎖緊法蘭，在岸上組成完整塔架；機艙也常在岸上先裝好輪轂。岸上作業不受浪況影響、工具與人力充足，每多完成一個接合，海上就少一次吊裝，也少一段等天氣的時間，這正是預組裝場存在的理由。',
 s:[[0,'塔架以數段鋼管的形式運到港口'],[.08,'履帶吊車把第二段塔段吊起，疊到底段上'],[.4,'工人鎖緊法蘭上的高強度螺栓'],[.5,'第三段吊上去，組成完整塔架'],[.82,'岸上多完成一個接合，海上就少一次吊裝']],
 cam:u=>({x:1200,y:320,s:1.5}),
 draw(u){
  towerUp(T3X,QY,1);
  const P=[path3(u,0),path3(u,1)];
  P.forEach((p,i)=>{if(p.st!==1)drawTowerSec(p.x,p.y+HS,i+1);});
  const act=P[1].st===1?P[1]:P[0];
  const hk=P[0].st===1?{x:P[0].x,y:P[0].y-26}:P[1].st===1?{x:P[1].x,y:P[1].y-26}:u<.08?{x:T3S[0],y:QY-HS-26}:u<.48?{x:lerp(T3X,T3S[1],ease(seg(u,.4,.48))),y:lerp(QY-HS*2-26,QY-HS-26,ease(seg(u,.4,.48)))}:{x:T3X,y:lerp(QY-HS*3-26,QY-HS*3-90,ease(seg(u,.8,.9)))};
  const pv=crawler(T3C,QY),tip=crane(pv.x,pv.y,560,hk.x,hk.y,{col:'#e9b21f',w:12});
  P.forEach((p,i)=>{if(p.st===1){drawTowerSec(p.x,p.y+HS,i+1);slings(tip.x,tip.hy,[p.x-10,p.y,p.x+10,p.y]);}});
  /* 鎖螺栓 */
  [[.38,.48,QY-HS],[.78,.88,QY-HS*2]].forEach(([a,b,y])=>{const k=band(u,a,b);if(k>0)alphaDo(k,()=>{for(let i=0;i<4;i++){const s=Math.sin(TT*9+i*1.7)>.3;circ(T3X-14+i*9,y,2.5,s?'#f2c230':'#8f9aa1');}box(T3X-36,y+2,72,4,'#6f7a80');person(T3X-26,y+2,'#e8572a',2.4);person(T3X+26,y+2,'#f2c230',2.4);});});
  nacStand(1340,QY,.9);
  person(1130,QY,'#f2c230',3);person(1290,QY,'#e8572a',3);
  alphaDo(seg(u,.86,.92),()=>{ln([T3X+34,QY,T3X+34,QY-HS*3],'#fff',1.5);ln([T3X+28,QY-HS*3,T3X+40,QY-HS*3],'#fff',1.5);wt(T3X+44,QY-HS*1.5,'完整塔架',17,'#fff',700);});
  lab(T3X,QY-HS/2,'底段塔架',{dx:-90,dy:-20,a:band(u,0,.12)});
  lab(act.x,act.y+HS/2,'塔段',{dx:-100,dy:-10,a:band(u,.1,.36),st:'s'});
  lab(T3X,QY-HS,'法蘭螺栓',{dx:-110,dy:30,a:band(u,.38,.5),st:'w'});
  lab(T3C,QY-30,'履帶式起重機',{dx:40,dy:-80,a:band(u,.52,.78),minor:true});
  lab(1340,QY-30,'機艙＋輪轂',{dx:10,dy:-80,a:band(u,.82,1),st:'g'});
 },
 hud(u){hudPanel(230,128,'塔架預組裝（示例）',seg(u,.04,.1),w=>{const n=1+(u>=.38?1:0)+(u>=.78?1:0);
  hrow(52,'已組塔段',trf('{n} / 3',{n}),w,'#f2c230');hbar(14,62,w-28,n/3,'#f2c230');
  hrow(96,'海上塔架吊裝',trf('{n} 次',{n:4-n}),w,'#7dffc4');});}},

/* 4 ─────────────────────────────── 岸上做越多 */
{t:'岸上做越多，海上越省',en:'More on land, less at sea',dur:12,
 d:'同樣一座風機，不同的組裝策略會讓海上吊裝次數差很多。如果塔段、機艙、輪轂與葉片全部逐件吊，每座要吊約八次；把塔架在岸上預組成一件、輪轂先裝在機艙上，就降到約五次。早期較小的機組甚至把機艙、輪轂和兩支葉片組成「兔耳式」一起吊。每次吊裝都要等風速夠低，吊得越少，安裝船在海上停留的時間就越短。',
 s:[[0,'同一座風機，組裝策略不同，吊裝次數就不同'],[.3,'塔架預組、輪轂先裝上機艙，每座約吊五次'],[.54,'較小機組曾把兩支葉片一起吊上，只吊三次'],[.76,'每段海上作業，都要等待合適的天候']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'每座風機的海上吊裝次數（典型）',20,'#f2c230',700);
  const RW=[['逐件吊裝',['塔段','塔段','塔段','機艙','輪轂','葉片','葉片','葉片'],'#ff9d7a',.04],
   ['塔架預組＋輪轂先裝',['塔架','機艙＋輪轂','葉片','葉片','葉片'],'#f2c230',.28],
   ['兔耳式（較小機組）',['塔架','機艙＋兩葉片','葉片'],'#7dffc4',.52]];
  RW.forEach(([n,L,c,t],i)=>{const y=260+i*170,a=seg(u,t,t+.04);if(a<=0)return;alphaDo(a,()=>{wt(84,y,n,19,'#fff',700);
   let x=84;L.forEach((b,j)=>{const k=seg(u,t+.02+j*.02,t+.05+j*.02);if(k<=0)return;const bw=Math.max(84,wtw(b,15,700)+24);alphaDo(k,()=>{card(x,y+22,bw,52,{bg:'rgba(255,255,255,.06)',st:c,r:3});wt(x+bw/2,y+55,b,15,c,700,'center');});x+=bw+10;});
   const cnt=Math.round(L.length*seg(u,t+.02,t+.05+L.length*.02));wt(1030,y+62,trf('{n} 次',{n:cnt}),34,c,700,'right',COND);});});
  /* 右：從工廠到海上 */
  card(1100,160,440,640,{bg:'rgba(7,27,39,.75)'});wt(1124,200,'從工廠到海上',20,'#f2c230',700);
  const ST=['零組件工廠','港口儲放','岸上預組裝','裝船','海上安裝'];
  ST.forEach((s,i)=>{const on=seg(u,.06+i*.12,.1+i*.12),y=250+i*104,sea=i===4;
   card(1150,y,340,64,{bg:on>0?(sea?'rgba(232,87,42,.18)':'rgba(242,194,48,.14)'):'rgba(255,255,255,.04)',st:on>0?(sea?'#e8572a':'#f2c230'):'rgba(255,255,255,.16)',r:3});
   wt(1320,y+40,s,19,on>0?'#fff':'rgba(227,236,238,.6)',700,'center');if(i<4)arrow(1320,y+68,1320,y+100,'rgba(227,236,238,.6)',2);});
  alphaDo(seg(u,.78,.84),()=>{tag(1320,774,'受天候限制',{size:15,bg:'#e8572a',fg:'#fff',align:'center'});});
 }},

/* 5 ─────────────────────────────── 裝船出港 */
{t:'裝船與出港',en:'Load-out and sail-away',dur:14,side:true,
 d:'自升式安裝船靠上重件碼頭後，先放下樁腿把船身頂出水面，讓船在裝船時不隨潮汐與波浪起伏。船上的主吊車把塔架、機艙與葉片一件件吊上甲板，固定在專用的支架上；一趟可載運的組數依船型與機組大小而定，大約四到七組。裝完後船身降回水面、收起樁腿，出港前往風場，一趟往返通常要一到兩週。',
 s:[[0,'安裝船頂升在碼頭邊，船身不隨潮汐起伏'],[.1,'主吊車把塔架一座座吊上甲板'],[.48,'機艙與葉片固定在甲板支架上'],[.62,'船身降回水面，收起樁腿'],[.76,'載著整批風機零件出港，前往風場']],
 cam:u=>camMix({x:700,y:360,s:1.2},{x:560,y:400,s:1},ease(seg(u,.7,.9))),
 draw(u){
  const S=wtiv5(u),n=Math.min(4,Math.floor(seg(u,.08,.56)*4+1e-6)),cyc=(seg(u,.08,.56)*4)%1;
  /* 碼頭上待裝的塔架 */
  for(let i=n+(u<.56?1:0);i<4;i++)towerUp(QX+60+i*48,QY);
  nacStand(1150,QY,.9);bladeRack(1230,QY,2);
  drawWTIV(S.R,S.d,S.leg);
  for(let i=0;i<4;i++){if(i<n){towerUp(S.R+SLOT5[i],S.d);}}
  /* 甲板上的葉片與機艙 */
  const nb=Math.min(4,Math.floor(seg(u,.3,.6)*4+1e-6));for(let i=0;i<nb;i++)drawBlade(S.R-400,S.d-44+i*9,0,120);
  const nn=Math.min(4,Math.floor(seg(u,.36,.6)*4+1e-6));for(let i=0;i<nn;i++){ctx.save();ctx.translate(S.R-140+(i%2)*56,S.d-(i>1?40:0));ctx.scale(.55,.55);drawNacelle(0,0,0,false);ctx.restore();}
  /* 吊運 */
  let hk={x:S.R-150,y:S.d-200},hang=null;
  if(u>.08&&u<.56&&n<4){const px=QX+60+n*48,dx=S.R+SLOT5[n],top=Math.min(QY,S.d)-HS*3-40;
   const x=cyc<.25?px:cyc<.7?lerp(px,dx,ease((cyc-.25)/.45)):dx,yb=cyc<.25?lerp(QY,top+HS*3,ease(cyc/.25)):cyc<.7?top+HS*3:lerp(top+HS*3,S.d,ease((cyc-.7)/.3));
   hk={x,y:yb-HS*3-22};hang={x,yb};}
  const tip=crane(S.R-25,S.d-44,460,hk.x,hk.y,{col:'#e9b21f'});
  if(hang){towerUp(hang.x,hang.yb);slings(tip.x,tip.hy,[hang.x-6,hang.yb-HS*3,hang.x+6,hang.yb-HS*3]);}
  if(S.go>0)alphaDo(.7,()=>{for(let i=0;i<6;i++){const k=(TT*1.6+i/6)%1;ln([S.R+10+k*90,SEA+2+i*.5,S.R+34+k*90,SEA+2+i*.5],`rgba(255,255,255,${.8*(1-k)})`,1.4);}});
  lab(S.R-240,S.d+10,'自升式安裝船',{dx:-40,dy:80,a:band(u,0,.2),st:'s'});
  lab(S.R-440,Math.min(SBD-60,S.d+120),'樁腿',{dx:-70,dy:20,a:band(u,.02,.2)});
  lab(tip.x,tip.y,'主吊車',{dx:60,dy:-40,a:band(u,.12,.36)});
  lab(S.R-360,S.d-2*HS,'甲板上的塔架',{dx:-90,dy:-40,a:band(u,.4,.6),st:'l'});
  lab(S.R-340,S.d-30,'葉片',{dx:-80,dy:-100,a:band(u,.5,.64),minor:true});
  lab(S.R-440,S.leg-40,'收起樁腿',{dx:-80,dy:-30,a:band(u,.64,.76),st:'w'});
 },
 hud(u){hudPanel(230,128,'裝船（示例）',seg(u,.04,.1),w=>{const n=Math.min(4,Math.floor(seg(u,.08,.56)*4+1e-6));
  hrow(52,'已裝組數',trf('{n} / 4 組',{n}),w,'#f2c230');hbar(14,62,w-28,n/4,'#f2c230');
  hrow(96,'狀態',u<.62?'頂升裝船':u<.74?'降船收腿':'出港',w,'#7dffc4');
  hrow(120,'單趟可載','4–7 組',w);});}},

/* 6 ─────────────────────────────── 作業窗口 */
{t:'作業窗口：等天氣的船隊',en:'Weather windows for installation',dur:13,
 d:'安裝船的每一個動作都有天候上限：插腿頂升時示性波高通常要低於約 1.5 到 2 公尺，吊裝葉片時輪轂高度的風速通常要低於約 10 到 12 m/s（典型）。台灣海峽冬季東北季風強勁，夏季又有颱風，能作業的日子集中在春末到初秋。一趟航次除了裝船、航行與逐座安裝，還要把等天氣的時間算進去，這也是在港口就把工作做完的另一個理由。',
 s:[[0,'每個海上動作都有風速與浪高的上限'],[.3,'東北季風與颱風，讓可作業的日子集中在春夏'],[.56,'一趟航次：裝船、航行、逐座安裝、返航'],[.8,'排程要把等天氣的時間算進去']],
 draw(u){
  diagBG();
  const c=chartBox(60,160,760,440,{title:'台灣海峽各月可作業比例（示例）',x0:.5,x1:12.5,y0:0,y1:100,xt:[1,2,3,4,5,6,7,8,9,10,11,12],yt:[0,25,50,75,100],xl:'月份',pt:80,gx:12,gy:4});
  wt(c.px-10,c.py-18,'%',15,'rgba(227,236,238,.7)',600,'right',COND);
  WK6.forEach((v,i)=>{const k=ease(seg(u,.04+i*.015,.1+i*.015));if(k<=0)return;const x=c.X(i+1),bw=c.pw/12*.62,y=c.Y(v*k);box(x-bw/2,y,bw,c.Y(0)-y,v>=45?'#7dffc4':'#58b8d0');});
  alphaDo(seg(u,.3,.36),()=>{wt(c.X(1.5),c.Y(92),'東北季風',16,'#ff9d7a',700,'center');wt(c.X(11.5),c.Y(92),'東北季風',16,'#ff9d7a',700,'center');wt(c.X(8),c.Y(92),'颱風季',16,'#ff9d7a',700,'center');
   ctx.setLineDash([6,5]);ln([c.X(6.5),c.Y(84),c.X(9.5),c.Y(84)],'#ff9d7a',2);ctx.setLineDash([]);});
  card(60,620,760,180,{bg:'rgba(7,27,39,.75)'});wt(84,656,'作業上限（典型）',19,'#f2c230',700);
  [['插腿頂升','示性波高 ≤ 約 1.5–2 m','#7dc8dc'],['吊裝葉片','輪轂高度風速 ≤ 約 10–12 m/s','#f2c230'],['吊裝塔架與機艙','風速上限依吊重與機型而定','rgba(227,236,238,.85)']]
   .forEach(([a,b,col],i)=>{const k=seg(u,.06+i*.06,.12+i*.06);alphaDo(k,()=>{wt(84,700+i*34,a,17,'#fff',700);wt(330,700+i*34,b,17,col,600);});});
  /* 右：一趟航次甘特圖 */
  const G=chartBox(860,160,680,640,{title:'一趟航次（示例，4 座）',x0:0,x1:12,y0:0,y1:8,xt:[0,2,4,6,8,10,12],yt:[],xl:'天',pl:150,pt:80,pb:120,gx:6,gy:8});
  const TK=[['裝船',0,1.5,'#58b8d0'],['航行',1.5,2,'#b37cff'],['安裝 1',2,3.2,'#f2c230'],['等天氣',3.2,5,'#e8572a'],['安裝 2',5,6.2,'#f2c230'],['安裝 3',6.2,7.4,'#f2c230'],['安裝 4',7.8,9,'#f2c230'],['返航',9,9.5,'#b37cff']];
  const gp=seg(u,.54,.84)*10;
  TK.forEach(([n,a,b,col],i)=>{const y=G.Y(7.5-i)-14;wt(G.px-14,y+20,n,16,'rgba(227,236,238,.9)',600,'right');
   const e=clamp((gp-a)/(b-a));if(e>0)box(G.X(a),y,(G.X(b)-G.X(a))*e,26,col);});
  alphaDo(seg(u,.86,.92),()=>{wt(G.px+G.pw/2,G.py+G.ph+76,'等天氣也要算進時程',17,'#ff9d7a',700,'center');});
 }},

/* 7 ─────────────────────────────── 在地供應鏈 */
{t:'台灣的在地供應鏈',en:"Taiwan's local supply chain",dur:13,
 d:'台灣在產業關聯政策推動下，沿著西部港口建立起離岸風電供應鏈。台中港是風電母港，周邊有葉片廠、機艙組裝廠、塔架與鑄件廠；台北港與高雄興達港設有水下基礎製造廠；台船與比利時 DEME 合資，在高雄建造起重能力 4,000 公噸的重件安裝船「綠鯨號」；華新在高雄港與丹麥 NKT 合作的海纜廠於 2025 年底開幕。港口、工廠與船隊串在一起，就是一條從陸上到海上的產業鏈。',
 s:[[0,'離岸風電供應鏈沿著西部港口展開'],[.2,'台中港：風電母港，葉片、機艙、塔架都在周邊'],[.44,'台北港與高雄：水下基礎製造'],[.62,'在高雄建造的重件安裝船與新建的海纜廠'],[.84,'港口、工廠與船隊，串成一條產業鏈']],
 draw(u){
  diagBG();
  card(60,160,620,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'主要港口與產業（示意）',20,'#f2c230',700);
  ctx.beginPath();MAP7.forEach(([lo,la],i)=>{const x=MX(lo),y=MY(la);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();
  ctx.fillStyle='rgba(125,200,220,.16)';ctx.fill();ctx.strokeStyle='rgba(227,236,238,.6)';ctx.lineWidth=2;ctx.stroke();
  wt(MX(119.75),MY(23.2),'台灣海峽',17,'rgba(125,200,220,.7)',600,'center');
  /* 彰化外海風場 */
  const r=rng(3);for(let i=0;i<26;i++){const x=MX(119.85+r()*.3),y=MY(23.85+r()*.4);circ(x,y,2.6,'rgba(242,194,48,.6)');}
  wt(MX(119.82),MY(24.3)-4,'彰化外海風場',15,'#f2c230',700,'right');
  const PT=[['台北港',121.37,25.15,.4],['台中港',120.5,24.28,.18],['高雄',120.28,22.62,.4]];
  PT.forEach(([n,lo,la,t])=>{const x=MX(lo),y=MY(la),a=seg(u,t,t+.05);const pk=a>0?1+.25*Math.sin(TT*4):1;
   circ(x,y,9*pk,a>0?'#e8572a':'rgba(227,236,238,.4)','#fff',1.5);wt(x+16,y+6,n,18,a>0?'#fff':'rgba(227,236,238,.6)',700);});
  /* 右：產業卡片 */
  const C=[['台中港',['風電母港與重件碼頭','葉片廠、機艙組裝廠','塔架、鑄件廠'],'#f2c230',.18],
   ['台北港／高雄興達港',['水下基礎（單樁、套管）製造'],'#7dffc4',.42],
   ['高雄',['綠鯨號：起重 4,000 t 的重件安裝船','華新與 NKT 合作的海纜廠（2025 年開幕）'],'#7dc8dc',.6]];
  let y=160;
  C.forEach(([n,L,col,t])=>{const h=64+L.length*34,a=seg(u,t,t+.06);alphaDo(.25+.75*a,()=>{card(720,y,820,h,{bg:'rgba(7,27,39,.8)',st:a>0?col:'rgba(255,255,255,.16)',r:3});
   wt(744,y+38,n,20,col,700);L.forEach((s,j)=>{circ(752,y+70+j*34,4,col);wt(768,y+76+j*34,s,17,'rgba(227,236,238,.92)',500);});});y+=h+20;});
  alphaDo(seg(u,.84,.9),()=>{card(720,y,820,Math.min(90,800-y),{bg:'rgba(242,194,48,.08)',st:'rgba(242,194,48,.45)',r:3});
   wrap19(744,y+36,'從國產化要求到區塊開發的產業關聯方案，港口是串起整條產業鏈的節點',780,17,'#fff',600,24);});
 }}
]};
