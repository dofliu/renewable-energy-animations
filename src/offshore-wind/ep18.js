// KITS: land
/* 離岸風電系列 第 18 集：風機葉片的製造 */
const gyy=x=>groundY(x);
const FL=640;                                                  // 工廠地板線（世界座標）
/* 葉片平面形：s 0→1 從葉根到葉尖的相對弦長（示意） */
const chordAt=s=>s<.04?.42:s<.2?lerp(.42,1,ease((s-.04)/.16)):lerp(1,.16,Math.pow((s-.2)/.8,.85));
/* 平面形（前緣在上、後緣在下）；bend(s) 為垂直位移，用於測試時的彎曲 */
function bladePath(x0,y0,L,C,bend){const N=64;bend=bend||(()=>0);ctx.beginPath();
  for(let i=0;i<=N;i++){const s=i/N,c=chordAt(s)*C;const x=x0+s*L,y=y0-c*.35+bend(s);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
  for(let i=N;i>=0;i--){const s=i/N,c=chordAt(s)*C;ctx.lineTo(x0+s*L,y0+c*.65+bend(s));}ctx.closePath();}
function blade(x0,y0,L,C,fill,bend){bladePath(x0,y0,L,C,bend);ctx.fillStyle=fill||'#eef2f4';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1.5;ctx.stroke();
  const r=chordAt(0)*C;box(x0-4,y0-r*.35+(bend?bend(0):0),6,r,'#9aa3a8');}
/* 翼型半厚度（NACA 四位數公式）與中弧線 */
const yt=(s,t)=>5*t*(.2969*Math.sqrt(s)-.126*s-.3516*s*s+.2843*s*s*s-.1015*s*s*s*s);
const yc=s=>.025*Math.sin(Math.PI*s);
/* 工廠內部 */
function hallBG(){const W0=VX0-40,W1=VX1+40;
  const g=ctx.createLinearGradient(0,-200,0,FL);g.addColorStop(0,'#26343d');g.addColorStop(1,'#3b4a53');ctx.fillStyle=g;ctx.fillRect(W0,-600,W1-W0,FL+600);
  for(let x=Math.floor(W0/120)*120;x<W1;x+=120){ln([x,60,x,FL],'rgba(255,255,255,.05)',2);box(x+12,84,96,34,'rgba(170,210,230,.16)');}
  ln([W0,54,W1,54],'#56646d',6);for(let x=Math.floor(W0/160)*160;x<W1;x+=160)ln([x,54,x+80,14,x+160,54],'#56646d',3);ln([W0,14,W1,14],'#56646d',4);
  for(let x=Math.floor(W0/480)*480+240;x<W1;x+=480)box(x-10,54,20,FL-54,'#4a5860');
  box(W0,150,W1-W0,12,'#6f7a80');ln([W0,162,W1,162],'rgba(0,0,0,.3)',2);
  box(W0,FL,W1-W0,700,'#59646a');ln([W0,FL+2,W1,FL+2],'rgba(0,0,0,.35)',3);
  ctx.setLineDash([30,20]);ln([W0,FL+70,W1,FL+70],'rgba(242,194,48,.45)',3);ctx.setLineDash([]);}
/* 天車（橋式起重機）：小車在 x，吊鉤到 hy */
function bridgeCrane(x,hy){box(x-44,142,88,26,'#f2c230','rgba(0,0,0,.4)',1);box(x-30,168,60,14,'#394650');
  ln([x-6,182,x-6,hy],'#222',1.5);ln([x+6,182,x+6,hy],'#222',1.5);box(x-12,hy,24,10,'#394650');}
/* 厚板條（碳纖維拉擠板）的斜紋 */
function hatch(x,y,w,h,col,sp){ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();for(let k=-h;k<w;k+=sp||8)ln([x+k,y+h,x+k+h,y],col,1);ctx.restore();}

/* 合模分鏡：半翼型模具（端視） */
const MC=380,MT=.26,MY=500,PIV=800;
function halfShell(cx,up,flip){ // up：吸力面（較深）；flip：前緣在右
  const P=[];for(let i=0;i<=40;i++){const s=i/40,h=MC*(yt(s,MT)+(up?yc(s):-yc(s)));P.push(cx+(flip?1:-1)*(MC/2-s*MC),MY+h);}return P;}
function mouldHalf(cx,up,flip,sh){const P=halfShell(cx,up,flip);
  const x0=cx-MC/2-40,x1=cx+MC/2+40;
  ctx.beginPath();ctx.moveTo(x0,MY);for(let i=0;i<P.length;i+=2)ctx.lineTo(P[i],P[i+1]);ctx.lineTo(x1,MY);ctx.lineTo(x1,MY+MC*.2+36);ctx.lineTo(x0,MY+MC*.2+36);ctx.closePath();
  ctx.fillStyle='#6f7a80';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1.5;ctx.stroke();
  for(let k=0;k<5;k++)ln([x0+20+k*(x1-x0-40)/4,MY+MC*.2+36,x0+20+k*(x1-x0-40)/4,MY+MC*.2+14],'rgba(0,0,0,.25)',2);
  if(sh>0){ctx.save();ctx.globalAlpha*=sh;ctx.beginPath();for(let i=0;i<P.length;i+=2)i?ctx.lineTo(P[i],P[i+1]-6):ctx.moveTo(P[i],P[i+1]-6);
   ctx.strokeStyle='#e9edf0';ctx.lineWidth=10;ctx.stroke();ctx.strokeStyle='#d9b36c';ctx.lineWidth=3.5;ctx.stroke();ctx.restore();}
  box(x0,MY-6,x1-x0,6,'#8d989f');}

const EP={no:18,slug:'offshore-wind',seriesName:'離岸風電系列',t:'風機葉片的製造',en:'How turbine blades are made',
lede:'一支離岸風機葉片長達八十多公尺，卻主要是由玻璃纖維布、樹脂與輕質芯材一層層做出來的。這一集走進葉片工廠，看葉片的剖面結構、玻纖與碳纖的分工、真空灌注與加熱固化，以及合模、檢測與台灣的在地生產。',
facts:[['85','m','台中港葉片廠為 Vestas V174-9.5 MW 生產的葉片長度（報導值）'],
['35','t','單支 85 m 葉片的重量（報導值）'],
['108','m','西門子歌美颯 B108 一體成型葉片，整支一次灌注、沒有黏合縫'],
['≈ 3','倍','碳纖維複材的拉伸剛性約為玻纖複材的 3 倍，用於長葉片主樑（示例）'],
['≈ 0.05','bar','真空袋內的絕對壓力，大氣壓力把布層壓實（示例）'],
['數百萬','次','全尺寸疲勞測試的載重循環次數，依 IEC 61400-23（示例）']],
note:'說明：本集為教育用途示意動畫，工廠、模具、剖面與測試台的比例都經過簡化，製程時間已壓縮。天力離岸風電台中港廠為 Vestas V174-9.5 MW 生產 85 m、約 35 t 的葉片，依媒體報導；西門子歌美颯 B108 為 108 m 一體成型（IntegralBlade）葉片，依其官方資料；葉片以玻纖布、樹脂與芯材鋪層、真空灌注後加熱固化，主樑可用碳纖維拉擠板，為業界常見做法；全尺寸靜態與疲勞測試依 IEC 61400-23。玻纖與碳纖複材的剛性、密度與價格比、真空度、固化溫度與時間、鋪層順序、測試循環次數皆為典型範例，並非特定機型或工廠的資料。',
base:()=>hallBG(),
shots:[
/* 1 ─────────────────────────────── 葉片工廠 */
{t:'走進葉片工廠',en:'Inside a blade factory',dur:12,side:true,
 d:'離岸風機葉片是在長度接近百公尺的廠房裡，用一對巨大的模具做出來的：一半是壓力面，一半是吸力面。工人與天車沿著模具，把一捲捲玻璃纖維布依設計的方向與層數鋪進模具，根部最厚、往葉尖逐漸變薄。接著放入輕質芯材與主樑，再蓋上真空袋膜準備灌注樹脂。一支 85 m 的葉片，從鋪層到脫模通常需要數天，模具的使用排程決定了工廠的產能。',
 s:[[0,'葉片在長近百公尺的模具裡成形'],[.25,'天車沿著模具把玻纖布一層層鋪上'],[.55,'主樑條與芯材依設計位置放入'],[.8,'最後蓋上真空袋膜，準備灌注']],
 cam:u=>camMix({x:800,y:430,s:1},{x:560,y:470,s:1.5},ease(seg(u,.5,.64))),
 draw(u){
  const X0=210,L=1240,C=200,Y=520,xf=X0+(L+20)*ease(seg(u,.08,.52));
  /* 模具支架 */
  for(let k=0;k<9;k++){const x=X0+30+k*(L-40)/8;box(x-8,Y+30,16,FL-Y-30,'#4a5860');}
  box(X0-20,Y+24,L+40,14,'#394650');
  /* 模具（俯視壓扁的平面形） */
  ctx.save();ctx.translate(0,Y);ctx.scale(1,.34);ctx.translate(0,-Y);
  bladePath(X0-24,Y,L+44,C+80);ctx.fillStyle='#6f7a80';ctx.fill();ctx.strokeStyle='#9aa3a8';ctx.lineWidth=5;ctx.stroke();
  bladePath(X0,Y,L,C);ctx.fillStyle='#2b353c';ctx.fill();
  ctx.save();bladePath(X0,Y,L,C);ctx.clip();
  box(X0-10,Y-200,xf-X0+10,400,'#e3e8ec');for(let x=X0;x<xf;x+=14)ln([x,Y-200,x,Y+200],'rgba(0,0,0,.08)',2);
  const cp=seg(u,.55,.72);if(cp>0)box(X0+L*.12,Y-C*.16,L*.78*cp,C*.28,'#394650');
  if(cp>0)hatch(X0+L*.12,Y-C*.16,L*.78*cp,C*.28,'rgba(255,255,255,.18)',10);
  const bg=seg(u,.78,.92);if(bg>0)alphaDo(.55,()=>{box(X0-10,Y-200,(L+20)*bg,400,'rgba(125,200,220,.5)');for(let x=X0;x<X0+(L+20)*bg;x+=60)ln([x,Y-200,x+40,Y+200],'rgba(255,255,255,.4)',3);});
  ctx.restore();ctx.restore();
  /* 天車與布捲 */
  const cx=u<.52?Math.min(xf,X0+L):lerp(X0+L,X0+L*.5,ease(seg(u,.55,.7))),hy=u<.52?430:lerp(430,300,seg(u,.52,.58));
  bridgeCrane(cx,hy);
  if(u<.56){ctx.save();ctx.translate(cx,hy+30);ctx.rotate(TT*3);circ(0,0,22,'#e3e8ec','#394650',1.5);for(let k=0;k<3;k++){const a=k*TAU/3;ln([0,0,Math.cos(a)*18,Math.sin(a)*18],'#9aa3a8',2);}ctx.restore();
   ln([cx-8,hy+50,cx-30,Y-8],'rgba(227,232,236,.8)',6);}
  else{box(cx-60,hy+10,120,10,'#394650');alphaDo(1-seg(u,.72,.76),()=>{box(cx-70,hy+20,140,12,'#394650');hatch(cx-70,hy+20,140,12,'rgba(255,255,255,.2)',6);});}
  /* 工人 */
  [[X0+120,0],[X0+420,1],[X0+700,2],[X0+980,3]].forEach(([x,i])=>{const px=x+10*Math.sin(TT*.8+i);person(px,FL,i%2?'#e8572a':'#f2c230',4);});
  /* 尺寸線 */
  alphaDo(band(u,.04,.3),()=>{const y=FL+40;ln([X0,y,X0+L,y],'#fff',1.5);ln([X0,y-10,X0,y+10],'#fff',1.5);ln([X0+L,y-10,X0+L,y+10],'#fff',1.5);wt(X0+L/2,y-8,'葉片長約 85 m',20,'#fff',700,'center');});
  lab(X0+L*.45,Y+6,'葉片模具（吸力面）',{dx:-80,dy:-150,st:'l',a:band(u,.03,.26)});
  lab(X0,Y,'葉根',{dx:-40,dy:-100,st:'n',a:band(u,.06,.3)});
  lab(cx,hy+30,'玻纖布捲',{dx:80,dy:-90,st:'s',a:band(u,.28,.52)});
  lab(X0+L*.4,Y,'碳纖維主樑條',{dx:60,dy:-120,st:'s',a:band(u,.6,.8)});
  lab(X0+L*.3,Y-10,'真空袋膜',{dx:-60,dy:-120,st:'g',a:band(u,.82,1)});
 },
 hud(u){hudPanel(250,182,'葉片工廠（示例）',seg(u,.03,.08),w=>{const p=seg(u,.08,.52);
  hrow(56,'葉片長度','85 m',w,'#fff');hrow(88,'模具','2 半（壓力面／吸力面）',w,'#7dc8dc');
  hrow(120,'鋪層進度',trf('{n} %',{n:(p*100).toFixed(0)}),w,'#f2c230');
  hrow(152,'目前工序',u<.52?'鋪玻纖布':u<.78?'放主樑條':'蓋真空袋',w,'#7dffc4');});}},

/* 2 ─────────────────────────────── 剖面結構 */
{t:'葉片裡面長什麼樣',en:'What is inside a blade',dur:14,
 d:'把葉片橫切開來，會看到它是中空的。外殼是三明治結構：內外兩層玻纖積層，中間夾著發泡材或巴沙木芯材，既輕又不易凹陷。真正承受風力彎曲的是上下兩條厚實的主樑，長葉片常用碳纖維製作；主樑之間由一到兩片剪力腹板連接，組成像工字梁或箱形梁的骨架。上殼與下殼在前緣、後緣和腹板頂端用結構膠黏合。葉片受風時，一側主樑受壓、另一側受拉，腹板承受剪力。',
 s:[[0,'橫切開來，葉片是中空的殼'],[.22,'外殼：玻纖皮夾著輕質芯材'],[.4,'上下主樑承受彎曲，腹板把兩者連起來'],[.62,'前緣與後緣用結構膠黏合'],[.8,'受風時一側受壓、一側受拉']],
 draw(u){
  diagBG();
  card(60,160,960,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'葉片中段剖面（示意）',20,'#f2c230',700);
  const LE=130,CH=820,CY=450,T=.25,U=s=>CY-CH*(yt(s,T)+yc(s)),D=s=>CY+CH*(yt(s,T)-yc(s)),X=s=>LE+s*CH,N=80;
  const sh=ease(seg(u,.04,.2));
  alphaDo(sh,()=>{ctx.beginPath();for(let i=0;i<=N;i++){const s=i/N;i?ctx.lineTo(X(s),U(s)):ctx.moveTo(X(s),U(s));}for(let i=N;i>=0;i--){const s=i/N;ctx.lineTo(X(s),D(s));}ctx.closePath();
   ctx.fillStyle='#16384c';ctx.fill();ctx.strokeStyle='#e3e8ec';ctx.lineWidth=18;ctx.stroke();ctx.strokeStyle='#d9b36c';ctx.lineWidth=7;ctx.stroke();});
  const cp=ease(seg(u,.36,.46)),s0=.2,s1=.44;
  if(cp>0){[1,-1].forEach(sg=>{const F=sg>0?U:D;ctx.beginPath();for(let i=0;i<=20;i++){const s=lerp(s0,s1,i/20);i?ctx.lineTo(X(s),F(s)-sg*9):ctx.moveTo(X(s),F(s)-sg*9);}
   for(let i=20;i>=0;i--){const s=lerp(s0,s1,i/20);ctx.lineTo(X(s),F(s)+sg*(9+22*cp));}ctx.closePath();ctx.fillStyle='#394650';ctx.fill();ctx.strokeStyle='#7dc8dc';ctx.lineWidth=2;ctx.stroke();});}
  const wb=ease(seg(u,.44,.54));
  [.25,.39].forEach(s=>{if(wb<=0)return;const y0=U(s)+31,y1=D(s)-31,ym=(y0+y1)/2,hh=(y1-y0)/2*wb;box(X(s)-7,ym-hh,14,hh*2,'#e3e8ec','#394650',1);box(X(s)-2,ym-hh,4,hh*2,'#d9b36c');});
  const gl=seg(u,.6,.66);
  if(gl>0){const pk=.6+.4*Math.sin(TT*6);alphaDo(gl*pk,()=>{circ(X(0)+4,CY,11,'#e8572a');circ(X(1)-10,(U(1)+D(1))/2,9,'#e8572a');[.25,.39].forEach(s=>{box(X(s)-12,U(s)+27,24,6,'#e8572a');box(X(s)-12,D(s)-33,24,6,'#e8572a');});});}
  lab(X(.7),U(.7),'外殼：玻纖＋芯材',{dx:40,dy:-80,st:'l',a:band(u,.18,.4)});
  lab(X(.32),U(.32),'主樑（上）',{dx:280,dy:-40,st:'s',a:band(u,.4,.62)});
  lab(X(.32),D(.32),'主樑（下）',{dx:280,dy:40,st:'s',a:band(u,.4,.62)});
  lab(X(.39),CY,'剪力腹板',{dx:170,dy:0,st:'g',a:band(u,.46,.62)});
  lab(X(0)+4,CY,'前緣黏合',{dx:-10,dy:-110,st:'w',a:band(u,.62,.82)});
  lab(X(1)-10,(U(1)+D(1))/2,'後緣黏合',{dx:-20,dy:100,st:'w',a:band(u,.62,.82)});
  /* 三明治放大 */
  alphaDo(seg(u,.2,.26),()=>{const x=110,y=640;wt(x,y,'三明治外殼',17,'#fff',700);
   box(x,y+14,300,12,'#e3e8ec');box(x,y+26,300,40,'#d9b36c');box(x,y+66,300,12,'#e3e8ec');for(let i=0;i<12;i++)ln([x+i*25,y+26,x+i*25,y+66],'rgba(0,0,0,.18)',1);
   wt(x+320,y+26,'玻纖積層',16,'rgba(227,236,238,.85)',600);wt(x+320,y+52,'發泡／巴沙木芯材',16,'#d9b36c',600);wt(x+320,y+78,'玻纖積層',16,'rgba(227,236,238,.85)',600);});
  /* 右：梁的比喻 */
  card(1060,160,480,640,{bg:'rgba(7,27,39,.75)'});wt(1084,200,'主樑＋腹板＝一根梁',20,'#f2c230',700);
  const bd=70*ease(seg(u,.78,.9))+(u>.9?4*Math.sin(TT*4):0),bx0=1110,bL=390,by=430,by_=x=>by+bd*Math.pow((x-bx0)/bL,2);
  box(1090,330,20,200,'#6f7a80');for(let i=0;i<7;i++)ln([1090,340+i*28,1080,352+i*28],'#6f7a80',2);
  ctx.beginPath();for(let i=0;i<=30;i++){const x=bx0+bL*i/30;i?ctx.lineTo(x,by_(x)-26):ctx.moveTo(x,by_(x)-26);}for(let i=30;i>=0;i--){const x=bx0+bL*i/30;ctx.lineTo(x,by_(x)+26);}ctx.closePath();ctx.fillStyle='rgba(227,236,238,.18)';ctx.fill();
  ctx.beginPath();for(let i=0;i<=30;i++){const x=bx0+bL*i/30;i?ctx.lineTo(x,by_(x)-22):ctx.moveTo(x,by_(x)-22);}ctx.strokeStyle='#7dc8dc';ctx.lineWidth=9;ctx.stroke();
  ctx.beginPath();for(let i=0;i<=30;i++){const x=bx0+bL*i/30;i?ctx.lineTo(x,by_(x)+22):ctx.moveTo(x,by_(x)+22);}ctx.strokeStyle='#ff9d7a';ctx.lineWidth=9;ctx.stroke();
  const ex=bx0+bL;arrow(ex-10,by_(ex)-120,ex-10,by_(ex)-34,'#f2c230',3);wt(ex-20,by_(ex)-130,'風的推力',16,'#f2c230',700,'right');
  alphaDo(seg(u,.8,.86),()=>{wt(1084,600,'上主樑：受壓',18,'#7dc8dc',700);wt(1084,640,'下主樑：受拉',18,'#ff9d7a',700);wt(1084,680,'腹板：承受剪力',18,'#e3e8ec',700);wt(1084,740,'材料集中在離中心最遠處',17,'rgba(227,236,238,.8)',600);});
  alphaDo(1-seg(u,.76,.8),()=>{wt(1300,620,'骨架在殼體之內',18,'rgba(227,236,238,.8)',600,'center');});
 }},

/* 3 ─────────────────────────────── 玻纖與碳纖 */
{t:'玻纖與碳纖的分工',en:'Glass fibre and carbon fibre',dur:13,
 d:'葉片大部分的重量是玻璃纖維複材：價格低、韌性好，用在外殼、腹板與根部。葉片越長，自重與葉尖變形越大，葉尖若彎得太多，運轉時可能掃到塔架。碳纖維複材的拉伸剛性約為玻纖的三倍、密度更低，但每公斤價格高出許多，所以只用在最需要剛性的主樑。常見做法是先把碳纖維以拉擠成型做成數公釐厚的長板條，再一片片疊進模具，纖維排列整齊、品質穩定。',
 s:[[0,'外殼與腹板用便宜、耐用的玻纖'],[.3,'碳纖更輕更剛，但價格高出許多'],[.55,'碳纖先拉擠成厚度一致的長板條'],[.8,'板條疊起來，成為葉片的主樑']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'單向複材的比較（示例）',20,'#f2c230',700);
  wt(300,248,'玻纖複材',18,'#dfe5e8',700,'center');wt(560,248,'碳纖複材',18,'#7dc8dc',700,'center');
  const R=[['拉伸剛性','45 GPa','150 GPa',45/160,150/160,.06],['密度','1.95 g/cm³','1.6 g/cm³',1.95/2.2,1.6/2.2,.16],['每公斤價格','1','約 10 倍',.09,.9,.26]];
  R.forEach(([n,a,b,fa,fb,t],i)=>{const k=ease(seg(u,t,t+.1)),y=290+i*130;wt(84,y+18,n,18,'#fff',700);
   box(180,y+34,240,24,'rgba(255,255,255,.07)');box(180,y+34,240*fa*k,24,'#dfe5e8');wt(180,y+84,a,19,'#dfe5e8',700,'left',COND);
   box(440,y+34,240,24,'rgba(255,255,255,.07)');box(440,y+34,240*fb*k,24,'#7dc8dc');wt(440,y+84,b,19,'#7dc8dc',700,'left',COND);});
  alphaDo(seg(u,.36,.42),()=>{box(84,690,652,84,'rgba(255,255,255,.04)','rgba(255,255,255,.14)',1);
   wt(104,724,'玻纖：外殼、腹板、葉根',17,'#dfe5e8',700);wt(104,756,'碳纖：主樑，限制葉尖變形、避免掃塔',17,'#7dc8dc',700);});
  /* 右：拉擠成型 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'碳纖維拉擠板（示意）',20,'#f2c230',700);
  const ly=400,on=seg(u,.46,.52);
  alphaDo(.35+.65*on,()=>{
   for(let i=0;i<5;i++){const y=280+i*60;circ(870,y,20,'#394650','#9aa3a8',1.5);ctx.save();ctx.translate(870,y);ctx.rotate(TT*2);ln([-14,0,14,0],'#7dc8dc',2);ctx.restore();ln([890,y,1000,ly-10+i*5],'rgba(125,200,220,.55)',1.5);}
   box(990,ly-40,110,70,'#16384c','#9aa3a8',1.5);box(996,ly-6,98,30,'rgba(242,194,48,.45)');
   ln([1000,ly+2,1130,ly+2],'#394650',8);
   const gl=.6+.4*Math.sin(TT*5);box(1130,ly-28,120,60,'#6f7a80','#394650',1.5);alphaDo(gl,()=>box(1134,ly-24,112,52,'rgba(232,87,42,.35)'));
   const sp=90,off=(TT*sp)%120;ctx.save();ctx.beginPath();ctx.rect(1250,ly-20,280,40);ctx.clip();box(1250,ly-4,280,12,'#394650');for(let x=1250-120+off;x<1530;x+=120)hatch(x,ly-4,60,12,'rgba(255,255,255,.22)',6);ctx.restore();
   circ(1275,ly+22,10,'#9aa3a8','#394650',1);circ(1275,ly-18,10,'#9aa3a8','#394650',1);
   wt(870,560,'碳纖維紗架',16,'rgba(227,236,238,.85)',600,'center');wt(1045,470,'樹脂含浸',16,'rgba(227,236,238,.85)',600,'center');
   wt(1190,470,'加熱模具',16,'#ff9d7a',600,'center');wt(1400,450,'拉擠板',16,'#7dc8dc',600,'center');});
  alphaDo(seg(u,.56,.62),()=>tag(1170,258,'厚約 5 mm、寬約 10–20 cm（示例）',{size:16,bg:'#7dc8dc',align:'center'}));
  /* 板條疊成主樑 */
  const st=seg(u,.76,.96),n=Math.floor(st*8);
  alphaDo(seg(u,.74,.78),()=>{wt(1170,560,'疊成主樑',18,'#f2c230',700,'center');
   for(let i=0;i<8;i++){const y=740-i*16,a=i<n?1:i===n?(st*8-n):0;alphaDo(a,()=>{box(990,y-lerp(40,0,a)*0,360,13,'#394650','#7dc8dc',1);hatch(990,y,360,13,'rgba(255,255,255,.2)',8);});}
   wt(1370,740,trf('{n} 層',{n:Math.min(8,n+ (st>=1?0:1))}),19,'#7dc8dc',700,'left',COND);});
 }},

/* 4 ─────────────────────────────── 真空灌注與固化 */
{t:'真空灌注與加熱固化',en:'Vacuum infusion and curing',dur:15,
 d:'乾的纖維布、芯材與主樑都鋪好之後，上面依序蓋上脫模布、導流網和真空袋膜，四周用密封膠條封住。真空泵把袋內抽到接近真空，外面的大氣壓力把整疊材料壓實。接著打開樹脂進料管，樹脂沿著導流網向前推進，再往下滲透每一層布，直到流動前緣到達出料口。灌注完成後，模具內建的加熱系統把溫度升到約 70 °C（示例）並保溫數小時，讓環氧樹脂交聯固化，變成堅硬的複合材料。',
 s:[[0,'依序疊上布層、芯材、主樑與輔助層'],[.26,'封上真空袋，把袋內空氣抽掉'],[.4,'樹脂被吸入，流動前緣慢慢往前'],[.74,'模具加熱，樹脂固化成堅硬的殼']],
 draw(u){
  diagBG();
  card(60,160,960,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'鋪層剖面（示意，厚度放大）',20,'#f2c230',700);
  const X0=110,X1=770,W=X1-X0;
  const Ls=[['加熱模具',640,60,'#6f7a80',0],['外層玻纖布',610,30,'#e3e8ec',.04],['芯材＋碳纖主樑',556,54,'#d9b36c',.09],['內層玻纖布',536,20,'#e3e8ec',.14],['脫模布',530,6,'#b37cff',.18],['導流網',522,8,'#7dffc4',.21],['真空袋膜',514,8,'#7dc8dc',.24]];
  const vac=ease(seg(u,.28,.36)),xf=lerp(X0,X1,easeOut(seg(u,.4,.72))),cure=seg(u,.74,.98);
  Ls.forEach(([n,y,h,c,t],i)=>{const k=i===0?1:ease(seg(u,t,t+.04));if(k<=0)return;const dy=(1-k)*-60;
   alphaDo(k,()=>{if(i===2){box(X0,y+dy,W,h,c);box(X0+W*.36,y+dy,W*.3,h,'#394650');hatch(X0+W*.36,y+dy,W*.3,h,'rgba(255,255,255,.2)',8);}
    else if(i===5){for(let x=X0;x<X1;x+=12)ln([x,y+dy,x+12,y+dy+h],c,1.5);}
    else if(i===6){const sg=(1-vac)*10;ctx.beginPath();for(let x=X0;x<=X1;x+=10){const yy=y+dy+sg*Math.sin(x*.05)-sg;x===X0?ctx.moveTo(x,yy):ctx.lineTo(x,yy);}ctx.strokeStyle=c;ctx.lineWidth=4;ctx.stroke();}
    else box(X0,y+dy,W,h,c,'rgba(0,0,0,.3)',1);
    if(i===0){for(let x=X0+30;x<X1;x+=60){const gl=cure>0?.4+.6*cure*(.7+.3*Math.sin(TT*4+x)):0;circ(x,y+34,9,gl>0?`rgba(232,87,42,${gl.toFixed(2)})`:'#4a5860','#394650',1);}}
    const ly=y+h/2+dy,LY=[670,625,588,562,538,514,490][i]+dy;ln([X1+6,ly,X1+30,LY],'rgba(227,236,238,.5)',1);wt(X1+38,LY+6,n,16,i===2?'#d9b36c':c==='#6f7a80'?'rgba(227,236,238,.85)':c,600);});});
  /* 樹脂流動 */
  if(xf>X0){ctx.save();ctx.beginPath();ctx.moveTo(X0,518);for(let y=518;y<=640;y+=8)ctx.lineTo(xf-(y-518)*.45+4*Math.sin(y*.2+TT*3),y);ctx.lineTo(X0,640);ctx.closePath();
   ctx.fillStyle=`rgba(242,194,48,${(.45-.2*cure).toFixed(2)})`;ctx.fill();ctx.restore();
   if(u<.74)for(let i=0;i<6;i++){const x=X0+((TT*60+i*110)%(Math.max(1,xf-X0)));circ(x,526,3,'#f2c230');}}
  /* 進料與抽氣 */
  alphaDo(seg(u,.26,.3),()=>{ln([X0+30,514,X0+30,420,X0-10,420],'#f2c230',6);wt(X0+40,410,'樹脂進料',16,'#f2c230',700);
   ln([X1-30,514,X1-30,420,X1+20,420],'#7dc8dc',6);wt(X1-40,410,'抽真空',16,'#7dc8dc',700,'right');
   if(vac>0)for(let i=0;i<3;i++){const k=(TT*.9+i/3)%1;alphaDo(1-k,()=>arrow(X1-30,500-k*60,X1-30,470-k*60,'#7dc8dc',2));}});
  alphaDo(seg(u,.42,.46)*(1-seg(u,.72,.76)),()=>{ln([xf,500,xf,480],'#fff',1.5);tag(xf,468,'流動前緣',{size:15,bg:'#f2c230',align:'center'});});
  alphaDo(seg(u,.3,.34),()=>{for(let i=0;i<7;i++){const x=X0+60+i*95;arrow(x,300,x,350,'rgba(227,236,238,.5)',2);}wt(440,285,'大氣壓力把布層壓實',17,'rgba(227,236,238,.85)',600,'center');});
  const rows=[['袋內壓力',trf('{n} bar',{n:lerp(1,.05,vac).toFixed(2)}),'#7dc8dc'],['灌注進度',trf('{n} %',{n:((xf-X0)/W*100).toFixed(0)}),'#f2c230']];
  rows.forEach(([n,v,c],i)=>{const y=700+i*44;wt(110,y+20,n,18,'rgba(227,236,238,.85)',600);wt(420,y+20,v,22,c,700,'right',COND);});
  /* 右：固化曲線 */
  const C=chartBox(1060,160,480,640,{title:'固化過程（示例）',x0:0,x1:10,y0:0,y1:100,xt:[0,2,4,6,8,10],yt:[0,25,50,75,100],xl:'時間 h',yl:'°C／%',pl:64,pt:110,pb:70,gx:5,gy:4});
  const Tf=h=>h<1?25:h<3?lerp(25,70,(h-1)/2):h<8?70:lerp(70,35,(h-8)/2),Cf=h=>100/(1+Math.exp(-(h-4.2)*1.3));
  wt(C.px+10,C.py-18,'模具溫度',16,'#ff9d7a',700);wt(C.px+180,C.py-18,'固化程度',16,'#7dffc4',700);
  const tc=10*cure;
  if(tc>0){[[Tf,'#ff9d7a'],[Cf,'#7dffc4']].forEach(([f,c])=>{ctx.beginPath();for(let k=0;k<=80;k++){const h=tc*k/80;k?ctx.lineTo(C.X(h),C.Y(f(h))):ctx.moveTo(C.X(h),C.Y(f(h)));}ctx.strokeStyle=c;ctx.lineWidth=3;ctx.stroke();circ(C.X(tc),C.Y(f(tc)),6,c,'#13232e',1.5);});
   wt(C.X(5.5),C.Y(70)-14,trf('約 {n} °C',{n:70}),17,'#ff9d7a',700,'center',COND);}
  else wt(1300,480,'灌注完成後開始加熱',17,'rgba(227,236,238,.7)',600,'center');
 }},

/* 5 ─────────────────────────────── 合模黏合 */
{t:'合模：兩半殼黏成一支',en:'Closing the mould',dur:13,side:true,
 d:'兩半殼體各自在模具裡固化後，先把預製好的剪力腹板吊進壓力面殼體，定位在主樑上方。接著在前緣、後緣與腹板頂端塗上一道道結構膠，吸力面的模具由液壓翻轉機構整個翻過來，精準蓋在另一半上。合模後再次加熱讓黏合劑固化，才開模把葉片吊出，進入修邊、打磨與塗裝。也有廠商採用一體成型技術，把整支葉片在同一個封閉模具內一次灌注，省去黏合縫。',
 s:[[0,'兩半殼體各自固化完成'],[.1,'剪力腹板吊進壓力面殼體'],[.36,'前緣、後緣與腹板頂端塗上結構膠'],[.5,'吸力面模具整個翻轉過來'],[.82,'合模加熱，黏合劑固化']],
 cam:u=>({x:800,y:430,s:1.05}),
 draw(u){
  const L0=PIV-280,R0=PIV+280,ang=-Math.PI*ease(seg(u,.5,.8));
  /* 支架 */
  [L0-190,L0+190,R0-190,R0+190].forEach(x=>box(x-10,MY+MC*.2+36,20,FL-MY-MC*.2-36,'#4a5860'));
  box(PIV-14,MY+20,28,FL-MY-20,'#394650');
  mouldHalf(L0,false,false,1);
  /* 腹板吊入 */
  const Pd=s=>MY+MC*(yt(s,MT)-yc(s)),Pu=s=>MY-MC*(yt(s,MT)+yc(s)),WX=s=>L0-MC/2+s*MC;
  const drop=ease(seg(u,.1,.32)),WS=[.3,.46];
  const hx=u<.36?WX(.38):lerp(WX(.38),PIV+420,ease(seg(u,.36,.46)));
  WS.forEach(s=>{const top=Pu(s)+8,bot=Pd(s)-8,off=(1-drop)*-260;box(WX(s)-6,top+off,12,bot-top,'#e3e8ec','#394650',1);box(WX(s)-2,top+off,4,bot-top,'#d9b36c');});
  const hy=u<.36?Pu(.38)-40+(1-drop)*-260:lerp(Pu(.38)-40,200,ease(seg(u,.36,.46)));
  bridgeCrane(hx,hy);
  if(u<.36){box(WX(.3)-10,hy+10,WX(.46)-WX(.3)+20,8,'#394650');slings(hx,hy+10,[WX(.3),Pu(.3)+8+(1-drop)*-260,WX(.46),Pu(.46)+8+(1-drop)*-260]);}
  /* 結構膠 */
  const gl=seg(u,.36,.46);
  if(gl>0&&u<.86){const n=Math.floor(gl*12);alphaDo(.9,()=>{circ(L0-MC/2+4,MY-2,8,'#e8572a');if(gl>.4)circ(L0+MC/2-6,MY-2,7,'#e8572a');WS.forEach((s,i)=>{if(n>4+i*3)box(WX(s)-10,Pu(s)+2,20,7,'#e8572a');});});}
  /* 翻轉的吸力面模具 */
  ctx.save();ctx.translate(PIV,MY);ctx.rotate(ang);ctx.translate(-PIV,-MY);
  mouldHalf(R0,true,true,1);
  box(PIV,MY+10,R0-MC/2-40-PIV,16,'#394650');
  ctx.restore();
  circ(PIV,MY+18,16,'#8d989f','#394650',2);
  const ht=seg(u,.84,.98);if(ht>0)alphaDo(ht*(.5+.3*Math.sin(TT*4)),()=>{for(let i=0;i<6;i++){const x=L0-160+i*64;ln([x,MY+MC*.2+46,x+10,MY+MC*.2+60],'#e8572a',3);}});
  [[160,0],[1330,1],[1420,2]].forEach(([x,i])=>person(x+6*Math.sin(TT+i),FL,i?'#f2c230':'#e8572a',4));
  lab(L0-100,Pd(.2)-6,'壓力面殼體',{dx:-90,dy:-170,st:'l',a:band(u,.02,.2)});
  lab(R0+100,MY+MC*(yt(.2,MT)+yc(.2))-6,'吸力面殼體',{dx:60,dy:-190,st:'l',a:band(u,.02,.2)});
  lab(WX(.46),(Pu(.46)+Pd(.46))/2,'剪力腹板',{dx:130,dy:-120,st:'g',a:band(u,.2,.4)});
  lab(L0-MC/2+4,MY-2,'結構膠',{dx:-60,dy:-120,st:'w',a:band(u,.38,.54)});
  lab(PIV,MY+18,'液壓翻轉機構',{dx:120,dy:90,st:'s',a:band(u,.5,.8)});
  lab(L0,MY+MC*.2+40,'加熱固化黏合劑',{dx:-40,dy:100,st:'w',a:band(u,.84,1)});
 },
 hud(u){hudPanel(250,150,'合模（示例）',seg(u,.03,.08),w=>{
  hrow(56,'目前工序',u<.36?'吊入腹板':u<.5?'塗結構膠':u<.82?'翻轉合模':'加熱固化',w,'#7dffc4');
  hrow(88,'翻轉角度',trf('{n}°',{n:(180*ease(seg(u,.5,.8))).toFixed(0)}),w,'#f2c230');
  hrow(120,'黏合面','前緣／後緣／腹板',w,'#ff9d7a');});}},

/* 6 ─────────────────────────────── 檢測與測試 */
{t:'檢測與全尺寸測試',en:'Inspection and full-scale testing',dur:14,
 d:'每支葉片出廠前都要檢查：量測外形尺寸與重量，並以超音波掃描主樑與黏合線，找出乾點、氣孔、纖維皺褶或黏合不足，標記後修補。三支葉片還要配重，讓重量與重心一致，轉子才不會失衡。新設計的葉片另外要依 IEC 61400-23 做全尺寸測試：先施加設計極限載重的靜態測試，再以共振方式來回擺動數百萬次，模擬二十多年運轉累積的疲勞。',
 s:[[0,'超音波掃描主樑與黏合線'],[.3,'找到缺陷就標記修補，三支一組配重'],[.52,'新葉片型式要做全尺寸靜態測試'],[.74,'疲勞測試來回擺動數百萬次']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'出廠檢測（示意）',20,'#f2c230',700);
  const px=lerp(110,700,seg(u,.04,.34));
  box(100,300,610,50,'#e3e8ec','rgba(0,0,0,.3)',1);box(100,318,610,14,'#394650');
  box(px-14,262,28,38,'#9aa3a8','#394650',1.5);ln([px,262,px,240],'#394650',2);
  alphaDo(.5+.5*Math.sin(TT*10),()=>{ctx.setLineDash([4,4]);ln([px,300,px,350],'#7dffc4',2);ctx.setLineDash([]);});
  wt(100,250,'超音波探頭',16,'rgba(227,236,238,.85)',600);
  /* C 掃描圖 */
  wt(100,392,'掃描結果（C-scan）',16,'rgba(227,236,238,.85)',600);
  const r=rng(8);for(let i=0;i<30;i++)for(let j=0;j<5;j++){const x=100+i*20.3,y=404+j*20;const d=Math.hypot((x-455)/40,(y-444)/24)<1;const v=r();if(x>px)continue;
   box(x,y,19,19,d?'#e8572a':v<.5?'rgba(125,255,196,.55)':'rgba(125,255,196,.35)');}
  alphaDo(seg(u,.28,.32),()=>{ring(465,444,40,'#f2c230',3);tag(465,540,'乾點 → 標記修補',{size:16,bg:'#e8572a',align:'center'});});
  const CK=[['外形尺寸與重量量測',.36],['超音波掃描主樑與黏合線',.4],['三支一組配重，平衡重心',.44]];
  CK.forEach(([t,a],i)=>alphaDo(seg(u,a,a+.04),()=>{const y=600+i*56;box(84,y,652,46,'rgba(255,255,255,.04)','rgba(255,255,255,.14)',1);circ(108,y+23,12,'#7dffc4');wt(108,y+30,'✓',16,'#13232e',800,'center');wt(134,y+30,t,17,'#fff',600);}));
  /* 右：全尺寸測試台 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'全尺寸測試：IEC 61400-23（示意）',20,'#f2c230',700);
  const stat=ease(seg(u,.52,.66))*(1-ease(seg(u,.7,.74))),fat=seg(u,.74,.98),osc=fat>0?42*Math.sin(TT*5)*Math.min(1,fat*8):0;
  const d=110*stat+osc,bx=860,bL=640,by=380;
  box(826,300,40,300,'#6f7a80','#394650',1.5);box(810,600,80,20,'#394650');
  blade(bx,by,bL,110,'#eef2f4',s=>d*s*s);
  if(stat>.01){[.45,.7,.9].forEach(s=>{const x=bx+bL*s,y=by+chordAt(s)*110*.65+d*s*s;ln([x,y,x,720],'#dfe5e8',1.5);});box(bx+bL*.4,720,bL*.56,14,'#394650');}
  if(fat>0){const s=.55,x=bx+bL*s,y=by+d*s*s;box(x-24,y-40,48,24,'#f2c230','#13232e',1);ctx.save();ctx.translate(x,y-28);ctx.rotate(TT*5);ln([-14,0,14,0],'#13232e',3);ctx.restore();}
  alphaDo(seg(u,.52,.56)*(1-seg(u,.7,.74)),()=>{tag(1180,270,'靜態測試：施加極限載重',{size:16,bg:'#f2c230',align:'center'});wt(1500,by+d+30,trf('葉尖位移 {n} m',{n:(stat*14).toFixed(1)}),18,'#f2c230',700,'right',COND);});
  alphaDo(seg(u,.74,.78),()=>{tag(1180,270,'疲勞測試：共振來回擺動',{size:16,bg:'#7dffc4',align:'center'});
   wt(1500,760,trf('{n} 百萬次',{n:(fat*2).toFixed(2)}),26,'#7dffc4',700,'right',COND);wt(1500,786,'循環次數（示例）',15,'rgba(227,236,238,.7)',600,'right');});
  alphaDo(seg(u,.74,.78),()=>wt(bx+bL*.55+34,by-44,'激振器',16,'#f2c230',700));
  alphaDo(1-seg(u,.48,.52),()=>wt(1170,700,'新葉片型式設計完成後進行',17,'rgba(227,236,238,.7)',600,'center'));
 }},

/* 7 ─────────────────────────────── 在地化生產 */
{t:'在台中港生產葉片',en:'Making blades at Taichung Port',dur:12,side:true,
 d:'葉片又長又重，工廠最好就蓋在港邊。台中港的葉片廠為 Vestas V174-9.5 MW 風機生產 85 m、約 35 t 的葉片，報導指出這是 Vestas 在歐洲以外唯一的離岸葉片工廠。成品葉片由多軸自走式模組運輸車（SPMT）從廠房運到儲放區，再到重件碼頭裝船。在地生產縮短運輸距離，也帶動複材、樹脂與檢測人才的供應鏈；但產能與人力需要穩定的訂單支撐，隨著風機大型化，模具與廠房也要跟著升級。',
 s:[[0,'葉片工廠就設在港區碼頭旁'],[.3,'自走式運輸車把葉片送到碼頭'],[.6,'在重件碼頭吊上船，運往風場'],[.82,'在地生產帶動複材與檢測供應鏈']],
 base:()=>{landSky(GY,{sun:{x:1200,y:130},clouds:false});drawGround();},
 cam:u=>({x:800,y:430,s:1.02}),
 draw(u){
  const QX=1260;
  box(QX,GY+4,VX1-QX+40,400,'#2b6f88');for(let i=0;i<5;i++){const y=GY+20+i*26;ln([QX,y+3*Math.sin(TT+i),VX1+40,y+3*Math.sin(TT*1.2+i)],'rgba(255,255,255,.18)',2);}
  box(QX-20,GY-4,24,60,'#8d989f');
  /* 船 */
  const sx=1440;poly([sx-150,GY+10,sx+200,GY+10,sx+180,GY+50,sx-130,GY+50],'#394650');box(sx-150,GY-6,350,16,'#6f7a80');box(sx+140,GY-70,50,64,'#dfe5e8','rgba(0,0,0,.3)',1);
  for(let k=0;k<2;k++)blade(1290,GY-16-k*14,420,28,'#eef2f4');
  /* 廠房 */
  box(40,GY-230,480,230,'#dfe5e8','rgba(0,0,0,.3)',1);poly([30,GY-230,280,GY-290,530,GY-230],'#9aa3a8');box(360,GY-170,150,170,'#394650');
  for(let i=0;i<5;i++)box(70+i*56,GY-200,40,24,'#16384c');
  /* 碼頭吊機 */
  const CT=1170,JY=GY-270;box(CT-12,JY,24,GY-JY,'#f2c230','rgba(0,0,0,.4)',1);for(let y=JY+20;y<GY-10;y+=40)ln([CT-12,y,CT+12,y+40],'rgba(0,0,0,.3)',1.5);
  box(CT-140,JY-14,700,14,'#f2c230','rgba(0,0,0,.4)',1);box(CT-150,JY-4,60,40,'#394650');
  /* SPMT 運輸與吊上船 */
  const bl=420,tk=ease(seg(u,.58,.8)),bx=u<.58?lerp(380,820,ease(seg(u,.1,.55))):lerp(820,1290,tk),by=u<.58?GY-46:lerp(GY-46,GY-44,tk)-150*Math.sin(Math.PI*tk);
  const hkx=bx+bl*.4;ln([hkx,JY,hkx,by-40],'#222',2);box(hkx-10,JY,20,10,'#394650');
  if(u>=.56){slings(hkx,by-40,[bx+bl*.2,by-6,bx+bl*.6,by-4]);}
  blade(bx,by,bl,34,'#eef2f4');
  const tx=u<.58?bx:820;[[tx+10,90],[tx+bl*.62,70]].forEach(([x,w])=>{box(x-w/2,GY-40,w,22,'#f2c230','rgba(0,0,0,.4)',1);for(let i=0;i<4;i++)circ(x-w/2+10+i*(w-20)/3,GY-8,7,'#222');if(u<.58)box(x-8,GY-52,16,12,'#394650');});
  [[600,0],[700,1],[1120,2]].forEach(([x,i])=>person(x+5*Math.sin(TT+i),gyy(x),i%2?'#e8572a':'#f2c230',3.5));
  lab(280,GY-230,'葉片工廠',{dx:40,dy:-80,st:'l',a:band(u,.02,.3)});
  lab(tx+bl*.62,GY-29,'自走式模組運輸車（SPMT）',{dx:-40,dy:-150,st:'s',a:band(u,.12,.55)});
  lab(CT,JY+60,'碼頭吊機',{dx:-110,dy:-40,st:'l',a:band(u,.56,.8)});
  lab(QX-8,GY+20,'重件碼頭',{dx:-60,dy:90,st:'g',a:band(u,.6,.9)});
  lab(1440,GY+30,'葉片運輸船',{dx:0,dy:100,st:'l',a:band(u,.8,1)});
 },
 hud(u){hudPanel(250,182,'台中港葉片廠（報導值）',seg(u,.03,.08),w=>{
  hrow(56,'葉片長度','85 m',w,'#fff');hrow(88,'單支重量','約 35 t',w,'#fff');
  hrow(120,'對應機型','V174-9.5 MW',w,'#7dc8dc');hrow(152,'運輸方式','SPMT → 船',w,'#7dffc4');});}}
]};
