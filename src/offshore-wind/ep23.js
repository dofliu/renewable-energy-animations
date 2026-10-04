// KITS: land
/* 離岸風電系列 第 23 集：單樁與套管的製造 */
const FL=640;                                                  // 工廠地板線（世界座標）
/* 工廠內部（與第 18 集同一套廠房語彙） */
function hallBG(){const W0=VX0-40,W1=VX1+40;
  const g=ctx.createLinearGradient(0,-200,0,FL);g.addColorStop(0,'#26343d');g.addColorStop(1,'#3b4a53');ctx.fillStyle=g;ctx.fillRect(W0,-600,W1-W0,FL+600);
  for(let x=Math.floor(W0/120)*120;x<W1;x+=120){ln([x,60,x,FL],'rgba(255,255,255,.05)',2);box(x+12,84,96,34,'rgba(170,210,230,.16)');}
  ln([W0,54,W1,54],'#56646d',6);for(let x=Math.floor(W0/160)*160;x<W1;x+=160)ln([x,54,x+80,14,x+160,54],'#56646d',3);ln([W0,14,W1,14],'#56646d',4);
  for(let x=Math.floor(W0/480)*480+240;x<W1;x+=480)box(x-10,54,20,FL-54,'#4a5860');
  box(W0,150,W1-W0,12,'#6f7a80');ln([W0,162,W1,162],'rgba(0,0,0,.3)',2);
  box(W0,FL,W1-W0,700,'#59646a');ln([W0,FL+2,W1,FL+2],'rgba(0,0,0,.35)',3);
  ctx.setLineDash([30,20]);ln([W0,FL+70,W1,FL+70],'rgba(242,194,48,.45)',3);ctx.setLineDash([]);}
/* 天車：小車在 x，吊具到 hy */
function bridgeCrane(x,hy){box(x-44,142,88,26,'#f2c230','rgba(0,0,0,.4)',1);box(x-30,168,60,14,'#394650');
  ln([x-6,182,x-6,hy],'#222',1.5);ln([x+6,182,x+6,hy],'#222',1.5);box(x-12,hy,24,10,'#394650');}
/* 火花（固定亂數種子，隨 TT 跳動） */
function sparks(x,y,n,col){for(let i=0;i<n;i++){const r=rng(i*7+Math.floor(TT*20)),a=-Math.PI*(.1+.8*r()),L=10+30*r();ln([x,y,x+Math.cos(a)*L,y+Math.sin(a)*L+8*r()],col||'#f2c230',1.5);}
  circ(x,y,5+2*Math.sin(TT*30),'#fff7d0');}
/* 管段（側視）：cx 左端、cy 軸心、w 長、h 直徑；rot 表面標記相位 */
function can(x,cy,w,h,rot){const g=ctx.createLinearGradient(0,cy-h/2,0,cy+h/2);g.addColorStop(0,'#6f7a80');g.addColorStop(.3,'#b9c3c8');g.addColorStop(.55,'#8d989f');g.addColorStop(1,'#4a5860');
  ctx.fillStyle=g;ctx.fillRect(x,cy-h/2,w,h);ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1.2;ctx.strokeRect(x,cy-h/2,w,h);
  for(let k=0;k<3;k++){const a=rot+k*TAU/3;if(Math.cos(a)>0){const y=cy+h/2*Math.sin(a);ln([x+w*.3,y,x+w*.7,y],'rgba(0,0,0,.25)',2);}}}
/* 單樁（側視，左端較細的錐段）；col 為塗裝顏色函式 */
function monopile(x0,cy,L,colAt){const N=40;
  const R=s=>s<.28?56:s<.42?lerp(56,76,(s-.28)/.14):76;
  for(let i=0;i<N;i++){const s0=i/N,s1=(i+1)/N;const xa=x0+s0*L,xb=x0+s1*L;
   poly([xa,cy-R(s0),xb,cy-R(s1),xb,cy+R(s1),xa,cy+R(s0)],colAt((s0+s1)/2));}
  ctx.beginPath();for(let i=0;i<=N;i++){const s=i/N;i?ctx.lineTo(x0+s*L,cy-R(s)):ctx.moveTo(x0+s*L,cy-R(s));}for(let i=N;i>=0;i--){const s=i/N;ctx.lineTo(x0+s*L,cy+R(s));}ctx.closePath();
  ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1.5;ctx.stroke();
  for(let i=0;i<N;i++){const s=i/N,x=x0+s*L;alphaDo(.6,()=>ln([x,cy-R(s)+6,x,cy-R(s)+16],'rgba(255,255,255,.3)',1));}
  return R;}
/* 自走式模組運輸車 */
function spmt(x,w){box(x-w/2,GY-34,w,20,'#f2c230','rgba(0,0,0,.4)',1);for(let i=0;i<5;i++)circ(x-w/2+10+i*(w-20)/4,GY-8,7,'#222');}

const EP={no:23,slug:'offshore-wind',seriesName:'離岸風電系列',t:'單樁與套管的製造',en:'How monopiles and jackets are made',
lede:'離岸風機的水下基礎是用數公分到十幾公分厚的鋼板做出來的。這一集走進鋼構廠，看厚鋼板如何切割、捲成圓筒、一道道焊接，再以超音波檢查焊道，最後組裝成套管、噴砂塗裝並從碼頭出貨，也介紹台灣的在地鋼構廠。',
facts:[['8–11','m','大型單樁的直徑範圍，長度可達 120 m（產業資料）'],
['150','mm','單樁最大壁厚可達約 150 mm（產業資料）'],
['2,400','t','大型單樁的重量可達約 2,400 t（產業資料）'],
['≈ 70','t','直徑 9 m、壁厚 90 mm、長 3.5 m 的一節管段重量（示例）'],
['1,300','t','台北港鋼構廠生產的一座套管式基礎重量，高約 75 m（報導值）'],
['2','mm','套管焊接與尺寸控制的精度要求約在 2 mm 內（報導值）']],
note:'說明：本集為教育用途示意動畫，廠房、捲板機、焊道、管段與套管的比例都經過簡化，製程時間已壓縮。大型單樁直徑 8–11 m、長度可達 120 m、壁厚可達約 150 mm、重量可達約 2,400 t，依歐洲單樁製造商與產業媒體公開資料；以厚板捲成管段、縱縫與環縫以埋弧焊接合，為業界常見做法。中鋼開發 S355ML、S420ML、S460ML 等風電鋼板，興達海基（高雄）套管高約 80 m、超過 1,000 t、精度要求約 2 mm 內，世紀風電（台北港）一座套管式基礎約 1,300 t、高約 75 m，皆依媒體報導。板厚、管段尺寸與重量、焊道數、預熱與層間溫度、檢測比例、塗層系統與膜厚皆為典型範例，並非特定工廠或案場的資料。',
base:()=>hallBG(),
shots:[
/* 1 ─────────────────────────────── 從鋼板開始 */
{t:'從一片厚鋼板開始',en:'It starts with a thick steel plate',dur:12,side:true,
 d:'單樁與套管都是由厚鋼板做成的。離岸用的結構鋼板，例如 S355ML 或 S420ML，除了強度，還要求低溫韌性與良好的焊接性，台灣由中鋼供應。鋼板進廠後先核對爐號與材質證明，再送上數控切割機，依展開尺寸切出板料，同時在板邊切出焊接用的坡口。板料的長度約等於管段的圓周：要捲成直徑 9 m 的管，板長就接近 28 m。',
 s:[[0,'離岸基礎從一片片厚鋼板開始'],[.26,'板料送上數控切割機'],[.48,'依展開尺寸切割，同時開出焊接坡口'],[.8,'切好的板料送往捲板機']],
 cam:u=>({x:800,y:430,s:1}),
 draw(u){
  const TY=560,X0=560,X1=1200;
  /* 鋼板堆 */
  for(let i=0;i<6;i++)box(40,FL-14-i*15,400,14,i%2?'#6f7a80':'#7d888e','rgba(0,0,0,.4)',1);
  /* 輥道與切割台 */
  box(0,TY+8,1260,10,'#394650');for(let x=20;x<1260;x+=46)circ(x,TY+13,6,'#8d989f','#394650',1);
  for(let x=60;x<1260;x+=200)box(x-6,TY+18,12,FL-TY-18,'#4a5860');
  /* 板料：滑入、切割、送出 */
  const inn=ease(seg(u,.04,.24)),out=ease(seg(u,.82,.98)),px=lerp(-700,X0,inn)+out*700;
  box(px,TY-14,X1-X0,14,'#7d888e','rgba(0,0,0,.45)',1.2);
  const ct=seg(u,.3,.78),gx=lerp(X0+10,X1-10,ct);
  if(ct>0&&out<=0){box(X0,TY-14,gx-X0,4,'rgba(242,194,48,.35)');}
  /* 門型切割機 */
  const gxx=u<.3?X0+10:u<.8?gx:X1-10;
  box(gxx-70,TY-210,140,18,'#f2c230','rgba(0,0,0,.4)',1);box(gxx-70,TY-192,12,192,'#f2c230','rgba(0,0,0,.4)',1);box(gxx+58,TY-192,12,192,'#f2c230','rgba(0,0,0,.4)',1);
  box(gxx-12,TY-192,24,120,'#394650');ln([gxx,TY-72,gxx,TY-18],'#9aa3a8',5);
  if(ct>0&&ct<1)sparks(gxx,TY-14,9);
  /* 捲板機（右側） */
  box(1300,FL-150,220,150,'#394650','rgba(0,0,0,.4)',1);circ(1370,FL-90,26,'#8d989f','#222',2);circ(1450,FL-90,26,'#8d989f','#222',2);circ(1410,FL-130,30,'#b9c3c8','#222',2);
  /* 坡口剖面放大 */
  alphaDo(seg(u,.5,.56)*(1-seg(u,.86,.9)),()=>{card(560,190,460,150,{bg:'rgba(7,27,39,.82)'});wt(580,222,'板邊坡口（剖面放大）',17,'#f2c230',700);
   poly([600,250,800,250,836,286,836,296,800,330,600,330],'#8d989f','rgba(0,0,0,.4)',1);
   poly([1000,250,880,250,844,286,844,296,880,330,1000,330],'#8d989f','rgba(0,0,0,.4)',1);
   wt(840,244,'X 型坡口',15,'#7dffc4',700,'center');});
  [[180,0],[500,1],[1260,2]].forEach(([x,i])=>person(x+8*Math.sin(TT*.8+i),FL,i%2?'#e8572a':'#f2c230',4));
  lab(240,FL-90,'離岸結構鋼板',{dx:120,dy:-150,st:'l',a:band(u,.02,.28)});
  lab(gxx,TY-200,'數控切割機',{dx:-130,dy:-60,st:'s',a:band(u,.28,.55)});
  lab(gxx,TY-14,'切割＋開坡口',{dx:120,dy:120,st:'w',a:band(u,.4,.78)});
  lab(1410,FL-150,'捲板機',{dx:-80,dy:-110,st:'g',a:band(u,.8,1)});
 },
 hud(u){hudPanel(250,182,'板料（示例）',seg(u,.03,.08),w=>{
  hrow(56,'鋼板等級','S355ML',w,'#fff');hrow(88,'板厚','90 mm',w,'#7dc8dc');
  hrow(120,'板長','≈ 28 m (π × 9 m)',w,'#f2c230');
  hrow(152,'目前工序',u<.28?'進料':u<.8?'切割與開坡口':'送往捲板',w,'#7dffc4');});}},

/* 2 ─────────────────────────────── 捲板 */
{t:'把厚板捲成圓筒',en:'Rolling plate into a can',dur:14,
 d:'板料送進四輥捲板機：上輥與下輥夾住鋼板，兩側的側輥往上頂，鋼板來回滾動、一點一點彎成圓弧。板的兩端若直接捲，會留下一段捲不圓的直邊，所以通常先把兩端預彎。捲到兩端合攏後先點焊固定，再焊縱縫，就成為一節「管段」。以直徑 9 m、壁厚 90 mm、長 3.5 m 的管段為例，一節就重約 70 t，一支單樁要由數十節管段接起來。',
 s:[[0,'板的兩端先預彎，避免留下直邊'],[.12,'上下輥夾住鋼板，側輥往上頂'],[.4,'來回滾動，圓弧越捲越圓'],[.64,'兩端合攏，點焊固定'],[.8,'一節管段就重達數十噸']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'四輥捲板機（端視，示意）',20,'#f2c230',700);
  const x0=410,yb=640,Lp=1000,th=lerp(1.6,TAU*.985,ease(seg(u,.1,.62))),R=Lp/th,cy=yb-R;
  ctx.save();ctx.beginPath();ctx.rect(62,220,696,578);ctx.clip();
  /* 鋼板圓弧 */
  ctx.beginPath();for(let i=0;i<=80;i++){const a=Math.PI/2-th/2+th*i/80;const x=x0+R*Math.cos(a),y=cy+R*Math.sin(a);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
  ctx.strokeStyle='#394650';ctx.lineWidth=18;ctx.stroke();ctx.strokeStyle='#b9c3c8';ctx.lineWidth=12;ctx.stroke();
  /* 預彎的兩端 */
  alphaDo(band(u,0,.12),()=>{[-1,1].forEach(sg=>{const a=Math.PI/2+sg*th/2;circ(x0+R*Math.cos(a),cy+R*Math.sin(a),16,null,'#f2c230',3);});});
  /* 輥子 */
  const spin=TT*2*(u<.62?Math.sign(Math.sin(TT*.9))||1:0);
  const roll=(x,y,r,c)=>{circ(x,y,r,c,'#222',2);ctx.save();ctx.translate(x,y);ctx.rotate(spin);ln([-r*.7,0,r*.7,0],'#394650',3);ln([0,-r*.7,0,r*.7],'#394650',3);ctx.restore();};
  roll(x0,yb-9-50,50,'#b9c3c8');roll(x0,yb+9+46,46,'#8d989f');
  const sx=150;if(R>sx){const y=cy+Math.sqrt(R*R-sx*sx);[-1,1].forEach(sg=>roll(x0+sg*sx,y+9+34,34,'#8d989f'));}
  ctx.restore();
  /* 點焊 */
  const tk=seg(u,.64,.72);if(tk>0)alphaDo(tk,()=>{const y=cy-R;ring(x0,y,22,'#e8572a',3);sparks(x0,y,6,'#ff9d7a');});
  lab(x0,yb-59,'上輥',{dx:-150,dy:-40,st:'l',a:band(u,.12,.4)});
  lab(x0,yb+55,'下輥',{dx:-170,dy:20,st:'l',a:band(u,.12,.4)});
  if(R>sx)lab(x0+sx,cy+Math.sqrt(R*R-sx*sx)+43,'側輥往上頂',{dx:120,dy:-40,st:'s',a:band(u,.14,.5)});
  lab(x0,cy-R,'點焊固定',{dx:150,dy:-30,st:'w',a:band(u,.66,.9)});
  wt(84,780,'板厚 90 mm（線寬放大示意）',15,'rgba(227,236,238,.7)',600);
  /* 右：一節管段有多重 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'一節管段有多重（示例）',20,'#f2c230',700);
  const ap=ease(seg(u,.66,.76));
  alphaDo(.3+.7*ap,()=>{const cx=1170,ty=290,bh=180,rw=150,ry=36;
   box(cx-rw,ty,rw*2,bh,'#8d989f');ctx.beginPath();ctx.ellipse(cx,ty+bh,rw,ry,0,0,Math.PI);ctx.fillStyle='#6f7a80';ctx.fill();
   ctx.beginPath();ctx.ellipse(cx,ty,rw,ry,0,0,TAU);ctx.fillStyle='#394650';ctx.fill();ctx.strokeStyle='#b9c3c8';ctx.lineWidth=7;ctx.stroke();
   ln([cx-rw,ty,cx-rw,ty+bh],'rgba(0,0,0,.4)',1.5);ln([cx+rw,ty,cx+rw,ty+bh],'rgba(0,0,0,.4)',1.5);
   ln([cx,ty-ry+4,cx,ty+bh+ry-4],'#e8572a',2);
   ln([cx-rw,ty-ry-18,cx+rw,ty-ry-18],'#fff',1.5);wt(cx,ty-ry-26,'D = 9 m',18,'#fff',700,'center',COND);
   ln([cx+rw+18,ty,cx+rw+18,ty+bh],'#fff',1.5);wt(cx+rw+26,ty+bh/2+6,'L = 3.5 m',18,'#fff',700,'left',COND);
   wt(cx-rw-14,ty+bh/2+6,'縱縫',16,'#ff9d7a',700,'right');});
  const rows=[['直徑 D','9 m',.68],['壁厚 t','90 mm',.71],['節長 L','3.5 m',.74],['鋼的密度','7.85 t/m³',.77]];
  rows.forEach(([n,v,a],i)=>alphaDo(seg(u,a,a+.03),()=>{const y=572+i*36;wt(840,y,n,17,'rgba(227,236,238,.85)',600);wt(1120,y,v,19,'#7dc8dc',700,'left',COND);}));
  const mk=seg(u,.82,.92);
  alphaDo(seg(u,.8,.83),()=>{wt(840,736,'質量 ≈ π × D × t × L × 密度',17,'#fff',700);
   wt(1500,780,trf('≈ {n} t',{n:(70*mk).toFixed(0)}),34,'#f2c230',700,'right',COND);wt(840,780,'約 30 節接成一支單樁',16,'rgba(227,236,238,.75)',600);});
 }},

/* 3 ─────────────────────────────── 縱縫與環縫 */
{t:'縱縫與環縫焊接',en:'Longitudinal and circumferential welds',dur:13,side:true,
 d:'管段在滾輪架上慢慢轉動，焊接機頭由懸臂式焊接操作機送到焊縫上方。厚板焊接常用埋弧焊（SAW）：焊絲在一層顆粒狀焊劑底下燃弧，電弧被焊劑覆蓋，熔敷量大、焊道品質穩定，也常用雙絲或多絲同時焊接。每節管段先焊縱縫，再把一節節管段對齊組立，焊接兩節之間的環縫，接成數十公尺長的分段，最後把各分段再接成整支單樁。',
 s:[[0,'先焊好每一節管段的縱縫'],[.3,'下一節管段送上滾輪架對齊'],[.48,'管段轉動，埋弧焊沿環縫焊一圈'],[.8,'一節節接成數十公尺長的分段']],
 cam:u=>camMix({x:470,y:450,s:1.6},{x:800,y:430,s:1},ease(seg(u,.26,.36))),
 draw(u){
  const W=130,H=230,CY=FL-30-H/2,X0=300,N=6;
  /* 操作機 */
  box(1430,200,40,FL-200,'#f2c230','rgba(0,0,0,.4)',1);for(let y=220;y<FL;y+=40)ln([1430,y,1470,y+40],'rgba(0,0,0,.3)',1.5);
  /* 焊接位置 */
  const ls=seg(u,.04,.26);let jx=X0+W*.5,jy=CY-H/2;
  const J=i=>.3+(i-1)*.12;let act=-1;
  for(let i=1;i<N;i++){if(u>=J(i)&&u<J(i)+.12)act=i;}
  if(u<.28){jx=lerp(X0+8,X0+W-8,ls);}else if(act>0)jx=X0+act*W;else jx=X0+(N-1)*W;
  const bx=u<.28?jx:act>0?jx:X0+(N-1)*W;
  box(bx-20,282,1450-bx+20,22,'#f2c230','rgba(0,0,0,.4)',1);box(bx-14,304,28,40,'#394650');ln([bx,344,bx,jy-6],'#9aa3a8',4);
  /* 滾輪架 */
  for(let i=0;i<N;i++){const x=X0+i*W+W/2;box(x-40,FL-22,80,22,'#394650');circ(x-26,FL-26,12,'#8d989f','#222',1.5);circ(x+26,FL-26,12,'#8d989f','#222',1.5);}
  /* 管段 */
  const rot=u<.28?0:TT*1.5;
  for(let i=0;i<N;i++){let x=X0+i*W;if(i>0){const k=ease(seg(u,J(i),J(i)+.05));if(k<=0)continue;x=lerp(1700,X0+i*W,k);}can(x,CY,W,H,rot+i);}
  /* 縱縫 */
  ln([X0+4,CY-H/2+2,X0+lerp(4,W-4,ls),CY-H/2+2],'#c9d1d6',4);
  if(u>.04&&u<.26)sparks(jx,jy,8);
  /* 環縫 */
  for(let i=1;i<N;i++){const k=seg(u,J(i)+.05,J(i)+.12);if(k<=0)continue;const x=X0+i*W;
   ln([x,CY-H/2,x,CY-H/2+H*k],k<1?'#ff9d7a':'#c9d1d6',5);if(k<1)sparks(x,CY-H/2,8);}
  [[160,0],[1360,1]].forEach(([x,i])=>person(x+6*Math.sin(TT+i),FL,i?'#f2c230':'#e8572a',4));
  lab(X0+W/2,CY-H/2,'縱縫',{dx:-110,dy:-70,st:'w',a:band(u,.04,.26)});
  lab(bx,320,'埋弧焊機頭（SAW）',{dx:90,dy:-100,st:'s',a:band(u,.08,.26)+band(u,.4,.62)});
  lab(X0+W*2,CY-H/2,'環縫',{dx:-60,dy:-90,st:'w',a:band(u,.47,.7)});
  lab(X0+W*2.5,FL-26,'滾輪架帶動管段轉動',{dx:100,dy:110,st:'l',a:band(u,.36,.6)});
  lab(1450,500,'懸臂式焊接操作機',{dx:-40,dy:110,st:'l',a:band(u,.62,.84)});
  alphaDo(seg(u,.88,.94),()=>{const y=FL+40;ln([X0,y,X0+N*W,y],'#fff',1.5);ln([X0,y-10,X0,y+10],'#fff',1.5);ln([X0+N*W,y-10,X0+N*W,y+10],'#fff',1.5);wt(X0+N*W/2,y-8,'6 節管段＝約 21 m 的分段（示例）',19,'#fff',700,'center');});
 },
 hud(u){const J=i=>.3+(i-1)*.12;let n=1;for(let i=1;i<6;i++)if(u>=J(i)+.12)n=i+1;
  hudPanel(250,182,'管段焊接（示例）',seg(u,.03,.08),w=>{
  hrow(56,'焊接方式','埋弧焊（SAW）',w,'#fff');
  hrow(88,'目前焊縫',u<.28?'縱縫':'環縫',w,'#ff9d7a');
  hrow(120,'已接節數',trf('{n}/6',{n}),w,'#f2c230');
  hrow(152,'分段長度',trf('{n} m',{n:(n*3.5).toFixed(1)}),w,'#7dffc4');});}},

/* 4 ─────────────────────────────── 多道焊與溫度 */
{t:'厚板焊接：一道一道填滿',en:'Thick-plate welding, pass by pass',dur:13,
 d:'90 mm 厚的鋼板沒辦法一次焊透。板邊開成 X 型坡口後，先從一側由根部往外一層層堆焊，接著到背面把焊根刨除乾淨，再從另一側焊滿，整條焊縫要數十道焊道。厚板散熱快，焊接前要先預熱，避免冷卻太快產生氫致裂紋；焊接過程中每一道之間的層間溫度也不能太高，否則熱影響區的韌性會下降。焊接程序與焊工都要事先依規範評定合格。',
 s:[[0,'X 型坡口，從根部開始焊第一道'],[.24,'一層一層往外堆焊'],[.42,'背面刨除焊根，再從另一側焊滿'],[.7,'預熱與層間溫度要控制在範圍內']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'X 型坡口多道焊（剖面示意）',20,'#f2c230',700);
  const C=410,TOP=330,BOT=630,MID=480;
  poly([80,TOP,C-80,TOP,C-6,MID-10,C-6,MID+10,C-80,BOT,80,BOT],'#6f7a80','rgba(0,0,0,.45)',1.5);
  poly([740,TOP,C+80,TOP,C+6,MID-10,C+6,MID+10,C+80,BOT,740,BOT],'#6f7a80','rgba(0,0,0,.45)',1.5);
  /* 焊道列表 */
  const B=[];const rowsN=7,dh=(MID-TOP)/rowsN;
  [-1,1].forEach(sd=>{for(let r=0;r<rowsN;r++){const y=MID+sd*(r+.5)*dh,w=12+(r+.5)/rowsN*148,n=Math.max(1,Math.round(w/30));for(let i=0;i<n;i++)B.push([C-w/2+(i+.5)*w/n,y,w/n/2+3,dh/2+2,sd]);}});
  const half=B.filter(b=>b[4]<0).length,fill=seg(u,.06,.4),fill2=seg(u,.5,.84);
  const nd=Math.floor(fill*half)+(fill2>0?Math.floor(fill2*(B.length-half)):0);
  const gouge=seg(u,.42,.5);
  const welding=(fill>0&&fill<1)||(fill2>0&&fill2<1);
  B.forEach((b,i)=>{if(i>nd||(i===nd&&!welding))return;const cur=i===nd;
   ctx.beginPath();ctx.ellipse(b[0],b[1],b[2],b[3],0,0,TAU);ctx.fillStyle=cur?'#f2c230':'#c9b38a';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1;ctx.stroke();});
  if(gouge>0&&gouge<1)alphaDo(1,()=>{box(C-14,MID+2,28,30*gouge,'rgba(232,87,42,.7)');sparks(C,MID+30*gouge,6,'#ff9d7a');});
  alphaDo(band(u,.42,.52),()=>tag(C,700,'背面清根（刨除焊根）',{size:16,bg:'#e8572a',align:'center'}));
  wt(C,300,'正面',16,'rgba(227,236,238,.8)',700,'center');wt(C,672,'背面',16,'rgba(227,236,238,.8)',700,'center');
  ln([100,TOP,100,BOT],'#fff',1.5);ln([92,TOP,108,TOP],'#fff',1.5);ln([92,BOT,108,BOT],'#fff',1.5);wt(112,MID+6,'90 mm',17,'#fff',700,'left',COND);
  wt(84,770,trf('已完成焊道 {n}／{m}',{n:Math.min(nd,B.length),m:B.length}),19,'#f2c230',700);
  /* 右：溫度管理 */
  const K=chartBox(800,160,740,640,{title:'預熱與層間溫度（示例）',x0:0,x1:10,y0:0,y1:300,xt:[0,2,4,6,8,10],yt:[0,100,200,300],xl:'時間 h',yl:'°C',pl:70,pt:120,pb:70,gx:5,gy:3});
  ctx.setLineDash([10,8]);ln([K.X(0),K.Y(100),K.X(10),K.Y(100)],'#7dffc4',2);ln([K.X(0),K.Y(250),K.X(10),K.Y(250)],'#e8572a',2);ctx.setLineDash([]);
  wt(K.X(10)-6,K.Y(100)+24,'預熱下限 100 °C',16,'#7dffc4',700,'right');wt(K.X(10)-6,K.Y(250)-10,'層間溫度上限 250 °C',16,'#ff9d7a',700,'right');
  const Tf=h=>h<1?lerp(25,130,h):130+90*Math.exp(-((h*3)%1)*4);
  const tc=10*seg(u,.08,.96);
  if(tc>0){ctx.beginPath();for(let k=0;k<=200;k++){const h=tc*k/200;k?ctx.lineTo(K.X(h),K.Y(Tf(h))):ctx.moveTo(K.X(h),K.Y(Tf(h)));}ctx.strokeStyle='#f2c230';ctx.lineWidth=2.5;ctx.stroke();
   circ(K.X(tc),K.Y(Tf(tc)),6,'#f2c230','#13232e',1.5);
   wt(K.X(tc),K.Y(Tf(tc))-16,trf('{n} °C',{n:Tf(tc).toFixed(0)}),17,'#fff',700,'center',COND);}
  alphaDo(seg(u,.08,.14)*(1-seg(u,.3,.34)),()=>wt(K.X(.6)+10,K.Y(40),'先預熱',16,'#7dffc4',700));
  alphaDo(seg(u,.36,.42),()=>wt(K.X(1.2),K.Y(285),'每一道焊接都讓溫度上升',16,'rgba(227,236,238,.8)',600));
 }},

/* 5 ─────────────────────────────── 超音波探傷 */
{t:'超音波找出看不見的缺陷',en:'Ultrasonic testing of welds',dur:13,
 d:'焊縫內部可能藏著氣孔、夾渣、未熔合或裂紋，從外面看不出來。相位陣列超音波（PAUT）探頭貼在鋼板表面，以不同角度發射扇形聲束；聲波碰到缺陷會反射回來，螢幕上就出現一個回波。依回波的位置與高度，可以判斷缺陷的深度和大小。除了超音波，還有目視檢查、檢查表面裂紋的磁粒檢測，以及圓度與直度量測。發現超出允收標準的缺陷，就刨除重焊，再檢一次。',
 s:[[0,'探頭貼著表面，聲束斜向射入焊道'],[.3,'聲波碰到缺陷，反射出回波'],[.55,'從回波位置判斷缺陷深度'],[.76,'不合格就刨除重焊，再檢一次']],
 draw(u){
  diagBG();
  card(60,160,800,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'相位陣列超音波（PAUT，示意）',20,'#f2c230',700);
  const T0=300,T1=520,WX=480,DF=[488,452];
  box(100,T0,720,T1-T0,'#6f7a80','rgba(0,0,0,.45)',1.5);
  poly([WX-70,T0,WX+70,T0,WX+8,(T0+T1)/2,WX+70,T1,WX-70,T1,WX-8,(T0+T1)/2],'#8d8a7c');
  const found=seg(u,.28,.32),fixed=seg(u,.82,.9);
  alphaDo(1-fixed,()=>{ctx.beginPath();ctx.ellipse(DF[0],DF[1],16,5,-.9,0,TAU);ctx.fillStyle=found>0?'#e8572a':'rgba(0,0,0,.35)';ctx.fill();});
  if(found>0)alphaDo(found*(1-fixed),()=>ring(DF[0],DF[1],26+3*Math.sin(TT*5),'#f2c230',2.5));
  const px=lerp(150,300,ease(seg(u,.04,.3)))+(u>.32&&u<.8?6*Math.sin(TT*1.5):0);
  box(px-30,T0-36,60,36,'#f2c230','rgba(0,0,0,.4)',1.5);ln([px,T0-36,px,T0-60,px-40,T0-80],'#394650',3);
  let hit=0;
  for(let a=40;a<=70;a+=3){const r=a*Math.PI/180,ex=px+(T1-T0)*Math.tan(r);
   const dx=ex-px,dy=T1-T0,t=clamp(((DF[0]-px)*dx+(DF[1]-T0)*dy)/(dx*dx+dy*dy),0,1),d=Math.hypot(px+dx*t-DF[0],T0+dy*t-DF[1]);
   const h=d<14&&fixed<1?1:0;hit=Math.max(hit,h);
   ctx.save();ctx.beginPath();ctx.rect(100,T0,720,T1-T0);ctx.clip();ln([px,T0,ex,T1],h?'rgba(242,194,48,.85)':'rgba(125,200,220,.35)',h?2.5:1.5);ctx.restore();}
  hit*=found>0?1:0;
  /* A 掃描 */
  box(100,580,720,190,'rgba(0,0,0,.25)','rgba(255,255,255,.14)',1);wt(112,606,'A 掃描回波',15,'rgba(227,236,238,.8)',600);
  const dpos=.5,amp=hit*(fixed<1?1:0);
  ctx.beginPath();for(let i=0;i<=300;i++){const s=i/300,x=110+s*700;let v=6*nz(s*40+TT*3)+(s<.06?120*Math.exp(-Math.pow((s-.03)/.012,2)):0)+amp*130*Math.exp(-Math.pow((s-dpos)/.012,2));
   const y=760-Math.abs(v);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=2;ctx.stroke();
  if(amp>0)alphaDo(seg(u,.5,.56),()=>{wt(110+dpos*700,620,'缺陷回波',16,'#f2c230',700,'center');ln([110+dpos*700,628,110+dpos*700,640],'#f2c230',1.5);wt(800,606,'深度約 50 mm（示例）',16,'#f2c230',700,'right');});
  lab(px,T0-36,'探頭',{dx:-80,dy:-60,st:'s',a:band(u,.02,.3)});
  lab(DF[0],DF[1],'未熔合',{dx:160,dy:-120,st:'w',a:band(u,.32,.8)});
  lab(WX,T1,'焊道',{dx:140,dy:30,st:'l',a:band(u,.04,.3)});
  /* 右：檢測項目 */
  card(900,160,640,640,{bg:'rgba(7,27,39,.75)'});wt(924,200,'焊縫與管段的檢查（示例）',20,'#f2c230',700);
  const CK=[['目視檢查（VT）','外觀與焊道形狀',.06],['磁粒檢測（MT）','表面與近表面裂紋',.14],['超音波（UT／PAUT）','焊縫內部缺陷',.22],['尺寸量測','圓度、直度與長度',.6]];
  CK.forEach(([a,b,t],i)=>alphaDo(seg(u,t,t+.04),()=>{const y=236+i*90;box(924,y,592,76,'rgba(255,255,255,.04)','rgba(255,255,255,.14)',1);
   circ(952,y+38,13,'#7dffc4');wt(952,y+45,'✓',16,'#13232e',800,'center');wt(980,y+32,a,18,'#fff',700);wt(980,y+60,b,16,'rgba(227,236,238,.8)',600);}));
  const FS=['發現缺陷','刨除','重焊','再檢'];
  FS.forEach((f,i)=>{const k=seg(u,.74+i*.05,.78+i*.05);alphaDo(k,()=>{const x=984+i*144;tag(x+40,640,f,{size:16,bg:i===3?'#7dffc4':i===0?'#e8572a':'#f2c230',align:'center'});if(i<3)arrow(x+90,634,x+128,634,'rgba(227,236,238,.7)',2);});});
  alphaDo(seg(u,.9,.96),()=>wt(1220,730,'檢測紀錄隨每節管段保存，可追溯',17,'#7dffc4',700,'center'));
 }},

/* 6 ─────────────────────────────── 套管組裝 */
{t:'套管：在組裝塔裡一層層長高',en:'Assembling a jacket',dur:13,side:true,
 d:'套管式基礎由四支主腳柱和一層層 X 型斜撐組成。主腳柱與斜撐也是由鋼板捲管焊成，斜撐與腳柱交會的「節點」形狀最複雜：圓管與圓管相貫，焊縫是一條立體曲線，也是疲勞最集中的地方，常用加厚的節點管並嚴格檢測。台灣的鋼構廠在組裝塔內把套管直立組裝，由下往上一層層吊裝定位、焊接；一座高約 75 m 的套管重約 1,300 t，尺寸精度要控制在約 2 mm 內。',
 s:[[0,'主腳柱與 X 型斜撐一層層吊裝'],[.3,'在組裝塔內直立組裝、逐層焊接'],[.6,'節點是管與管相貫的立體焊縫'],[.84,'一座套管高約 75 m、重約 1,300 t']],
 base:()=>{landSky(GY,{sun:{x:300,y:140},clouds:false});drawGround();},
 cam:u=>({x:800,y:420,s:1}),
 draw(u){
  const yl=[600,470,360,260,170],XL=y=>lerp(620,720,(600-y)/430),XR=y=>lerp(1040,940,(600-y)/430);
  /* 組裝塔 */
  alphaDo(.55,()=>{[560,1100].forEach(x=>{ln([x,GY,x,110],'#9aa3a8',5);});for(let y=GY;y>110;y-=70){ln([560,y,1100,y],'rgba(154,163,168,.6)',2);ln([560,y,600,y-70],'rgba(154,163,168,.5)',1.5);ln([1100,y,1060,y-70],'rgba(154,163,168,.5)',1.5);}
   ln([560,110,1100,110],'#9aa3a8',6);});
  /* 履帶吊機 */
  const lv=Math.min(3,Math.floor(seg(u,.06,.86)*4)),k=seg(u,.06+lv*.2,.26+lv*.2),drop=ease(seg(k,0,.7));
  const tipX=830,tipY=50;
  box(200,GY-50,180,40,'#394650');box(230,GY-110,120,60,'#f2c230','rgba(0,0,0,.4)',1);for(let i=0;i<5;i++)circ(214+i*38,GY-14,12,'#222');
  ln([300,GY-100,tipX,tipY],'#f2c230',10);ln([300,GY-100,tipX,tipY],'rgba(0,0,0,.35)',1);ln([260,GY-110,tipX,tipY],'#222',1.2);
  /* 已完成的層 */
  const bay=(i,dy,a)=>alphaDo(a,()=>{const y0=yl[i]+dy,y1=yl[i+1]+dy;const xl0=XL(yl[i]),xl1=XL(yl[i+1]),xr0=XR(yl[i]),xr1=XR(yl[i+1]);
   ln([xl0,y0,xr1,y1],'#c9d1d6',7);ln([xr0,y0,xl1,y1],'#c9d1d6',7);ln([xl1,y1,xr1,y1],'#c9d1d6',6);
   ln([xl0,y0,xl1,y1],'#e3e8ec',14);ln([xr0,y0,xr1,y1],'#e3e8ec',14);
   [[xl1,y1],[xr1,y1],[(xl0+xr1)/2,(y0+y1)/2]].forEach(([x,y])=>circ(x,y,8,'#b9c3c8','#394650',1.5));});
  for(let i=0;i<4;i++){if(i<lv)bay(i,0,1);else if(i===lv){const dy=(1-drop)*-160;bay(i,dy,Math.min(1,k*4));
    const hx=(XL(yl[i+1])+XR(yl[i+1]))/2,hy=yl[i+1]+dy-60;ln([tipX,tipY,hx,hy],'#222',1.5);box(hx-10,hy,20,10,'#394650');slings(hx,hy+10,[XL(yl[i+1]),yl[i+1]+dy,XR(yl[i+1]),yl[i+1]+dy]);
    if(drop>=1&&k<1){sparks(XL(yl[i]),yl[i],5);sparks(XR(yl[i]),yl[i],5);}}}
  if(u<.06){ln([tipX,tipY,tipX,300],'#222',1.5);}
  /* 底部樁套筒 */
  [620,1040].forEach(x=>box(x-14,GY-26,28,26,'#8d989f','rgba(0,0,0,.4)',1));
  [[480,0],[1150,1],[1200,2]].forEach(([x,i])=>person(x+5*Math.sin(TT+i),GY,i%2?'#e8572a':'#f2c230',3.5));
  /* 節點放大 */
  alphaDo(seg(u,.56,.62),()=>{card(1150,380,390,300,{bg:'rgba(7,27,39,.85)'});wt(1170,412,'節點（管對管相貫）',17,'#f2c230',700);
   const nx=1250,ny=560;box(nx-26,430,52,230,'#b9c3c8','rgba(0,0,0,.4)',1);box(nx-30,500,60,110,'#e3e8ec','rgba(0,0,0,.4)',1);
   ctx.save();ctx.translate(nx+26,ny);ctx.rotate(-.6);box(0,-18,200,36,'#c9d1d6','rgba(0,0,0,.4)',1);ctx.restore();
   ctx.save();ctx.translate(nx+26,ny);ctx.rotate(.6);box(0,-18,200,36,'#c9d1d6','rgba(0,0,0,.4)',1);ctx.restore();
   const gl=.6+.4*Math.sin(TT*5);alphaDo(gl,()=>{ctx.beginPath();ctx.ellipse(nx+30,ny-14,8,24,0,0,TAU);ctx.strokeStyle='#e8572a';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();ctx.ellipse(nx+30,ny+14,8,24,0,0,TAU);ctx.stroke();});
   wt(1390,650,'加厚節點管',15,'rgba(227,236,238,.85)',600,'center');});
  lab(XL(400),400,'主腳柱',{dx:-130,dy:-40,st:'l',a:band(u,.04,.3)});
  lab((XL(470)+XR(360))/2,415,'X 型斜撐',{dx:-180,dy:110,st:'s',a:band(u,.08,.32)});
  lab(1100,240,'組裝塔',{dx:-30,dy:-90,st:'l',a:band(u,.3,.56)});
  lab(1040,GY-26,'樁套筒',{dx:60,dy:-70,st:'g',a:band(u,.3,.56)});
  lab(tipX,tipY,'履帶吊機',{dx:120,dy:30,st:'l',a:band(u,.04,.28)});
  alphaDo(seg(u,.86,.92),()=>{const x=520;ln([x,GY,x,yl[4]],'#fff',1.5);ln([x-10,GY,x+10,GY],'#fff',1.5);ln([x-10,yl[4],x+10,yl[4]],'#fff',1.5);wt(x-12,(GY+yl[4])/2,'約 75 m',19,'#fff',700,'right');});
 },
 hud(u){const lv=Math.min(4,Math.floor(seg(u,.06,.86)*4)+(u>=.86?1:0));
  hudPanel(250,182,'套管式基礎（報導值）',seg(u,.03,.08),w=>{
  hrow(56,'高度','約 75 m',w,'#fff');hrow(88,'重量','約 1,300 t',w,'#fff');
  hrow(120,'組裝進度',trf('第 {n}／4 層',{n:Math.max(1,Math.min(4,lv))}),w,'#f2c230');
  hrow(152,'尺寸精度','約 2 mm 內',w,'#7dffc4');});}},

/* 7 ─────────────────────────────── 塗裝與出貨 */
{t:'噴砂塗裝與碼頭出貨',en:'Blasting, coating and load-out',dur:13,side:true,
 d:'焊接與檢測完成後，鋼構進入塗裝廠。先以鋼砂噴砂除去鏽皮與油污，達到 Sa 2½ 等級的近白金屬面，表面也被打出細小的粗糙度，讓塗料抓得牢。接著依海洋環境的腐蝕等級塗上多層塗料，常見是富鋅環氧底漆、環氧中塗與聚氨酯面漆，浪花飛濺的區段要更厚。完工的基礎由自走式模組運輸車滾裝上駁船出海。台灣由中鋼供應風電鋼板，興達海基與世紀風電等鋼構廠在港區生產套管等水下基礎。',
 s:[[0,'噴砂除鏽，露出乾淨的金屬面'],[.3,'塗上多層防蝕塗料'],[.56,'自走式運輸車把基礎載往碼頭'],[.82,'滾裝上駁船，運往風場']],
 base:()=>{landSky(GY,{sun:{x:1250,y:120},clouds:false});drawGround();},
 cam:u=>({x:800,y:430,s:1}),
 draw(u){
  const QX=1200,L=620,cy=GY-34-80;
  /* 海與駁船 */
  box(QX,GY+4,VX1-QX+40,400,'#2b6f88');for(let i=0;i<5;i++){const y=GY+24+i*26;ln([QX,y+3*Math.sin(TT+i),VX1+40,y+3*Math.sin(TT*1.2+i)],'rgba(255,255,255,.18)',2);}
  box(QX-20,GY-4,24,60,'#8d989f');
  const by=GY+2+2*Math.sin(TT*1.1);box(QX+8,by-2,VX1-QX+60,14,'#6f7a80');poly([QX+8,by+12,VX1+60,by+12,VX1+60,by+50,QX+30,by+50],'#394650');
  /* 塗裝廠 */
  alphaDo(.9,()=>{box(40,GY-280,800,16,'#9aa3a8');[50,440,820].forEach(x=>box(x,GY-264,14,264,'#8d989f'));poly([30,GY-280,440,GY-330,850,GY-280],'#6f7a80');});
  /* 單樁顏色：噴砂、塗裝 */
  const bl=seg(u,.04,.28),co=seg(u,.3,.52),mv=ease(seg(u,.56,.96)),x0=120+mv*1060;
  const colAt=s=>s<co?(s<.22?'#f2c230':'#4f5d66'):s<bl?'#c9d1d6':'#8a5a44';
  /* 支架或運輸車 */
  if(mv<=0){[200,400,600].forEach(x=>box(x-20,GY-34,40,34,'#394650'));}
  else{spmt(x0+L*.25,140);spmt(x0+L*.72,140);}
  monopile(x0,cy,L,colAt);
  if(bl>0&&bl<1){const fx=120+bl*L;person(fx+30,GY,'#f2c230',4);for(let i=0;i<10;i++){const r=rng(i*5+Math.floor(TT*24));ln([fx+24,GY-44,fx+4-20*r(),cy-60+120*r()],'rgba(227,236,238,.5)',1.2);}}
  if(co>0&&co<1){const fx=120+co*L;person(fx+30,GY,'#e8572a',4);alphaDo(.5,()=>{poly([fx+24,GY-44,fx,cy-50,fx,cy+50],'rgba(125,200,220,.4)');});}
  /* 塗層系統 */
  alphaDo(seg(u,.32,.38)*(1-seg(u,.54,.58)),()=>{card(880,170,340,190,{bg:'rgba(7,27,39,.85)'});wt(900,200,'塗層系統（示例）',17,'#f2c230',700);
   const Ls=[['聚氨酯面漆','#f2c230'],['環氧中塗','#9aa3a8'],['富鋅環氧底漆','#7dc8dc']];
   Ls.forEach(([n,c],i)=>{box(900,218+i*30,90,24,c,'rgba(0,0,0,.4)',1);wt(1004,236+i*30,n,15,'#fff',600);});
   box(900,308,90,14,'#8d989f');wt(1004,322,'鋼材（噴砂 Sa 2½）',15,'rgba(227,236,238,.8)',600);
   wt(900,350,'總膜厚約 350 μm',15,'#7dffc4',700);});
  lab(120+Math.max(.1,Math.min(bl,.9))*L,cy-70,'噴砂除鏽',{dx:-60,dy:-120,st:'w',a:band(u,.06,.28)});
  lab(120+.12*L,cy-56,'飛濺區加厚塗層',{dx:20,dy:-140,st:'s',a:band(u,.4,.56)});
  lab(x0+L*.72,GY-24,'自走式模組運輸車（SPMT）',{dx:-60,dy:90,st:'s',a:band(u,.6,.84)});
  lab(QX-8,GY+10,'重件碼頭',{dx:-90,dy:60,st:'g',a:band(u,.58,.82)});
  lab(QX+200,by+30,'駁船',{dx:40,dy:110,st:'l',a:band(u,.82,1)});
  lab(440,GY-300,'塗裝廠',{dx:-60,dy:-60,st:'l',a:band(u,.02,.2)});
 },
 hud(u){hudPanel(250,182,'出廠（示例）',seg(u,.03,.08),w=>{
  hrow(56,'表面處理','噴砂 Sa 2½',w,'#fff');hrow(88,'塗裝依據','ISO 12944',w,'#7dc8dc');
  hrow(120,'塗層','3 層',w,'#f2c230');
  hrow(152,'目前工序',u<.3?'噴砂':u<.54?'塗裝':u<.8?'運往碼頭':'滾裝上船',w,'#7dffc4');});}}
]};
