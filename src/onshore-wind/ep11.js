// KITS: land
/* 陸域風電系列 第 11 集：塔架結構與共振 */
const gyy=x=>groundY(x);
/* 正視的葉片與風機（沿用第 3、10、16 集） */
function bladeF(cx,cy,a,L,w){w=w===undefined?1:w;ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
  const k=Math.max(.18,w);poly([8,-5*k,8+L*.2,-10*k,8+L,-1.5*k,8+L,1.5*k,8+L*.2,8*k,8,5*k],'#f4f6f7','rgba(0,0,0,.35)',1);ctx.restore();}
function turbine(x,gy,H,R,rot){const hy=gy-H,w0=Math.max(4,R*.09),w1=Math.max(2.5,R*.05);
  poly([x-w0,gy,x-w1,hy+R*.06,x+w1,hy+R*.06,x+w0,gy],'#eef2f4','rgba(0,0,0,.3)',1);nacRotor(x,hy,R,rot);return {x,y:hy};}
function nacRotor(x,hy,R,rot){box(x-R*.11,hy-R*.08,R*.24,R*.14,'#e3e8ec','rgba(0,0,0,.3)',1);
  for(let i=0;i<3;i++)bladeF(x,hy,rot+i*TAU/3-Math.PI/2,R);circ(x,hy,Math.max(3,R*.07),'#dfe5e8','rgba(0,0,0,.4)',1);}
function windLines(y0,y1,n,sp,a,seed,len){if(a<=0)return;const r=rng(seed||3);ctx.lineCap='round';
  for(let i=0;i<n;i++){const y=y0+r()*(y1-y0),ph=r(),s=sp*(.7+.6*r()),L=(len||60)*(.6+.8*r());const x=VX0-200+((ph*2400+TT*s)%(VX1-VX0+400));
   alphaDo(a*(.25+.35*r()),()=>ln([x,y,x+L,y],'#ffffff',2));}ctx.lineCap='butt';}
/* 鋼管塔：F 為各段頂端的高度比例；回傳法蘭高度 */
function sTower(x,gy,H,wb,wtp,F,col){const top=gy-H,hw=y=>lerp(wb,wtp,(gy-y)/H)/2;
  poly([x-hw(gy),gy,x-hw(top),top,x+hw(top),top,x+hw(gy),gy],col||'#eef2f4','rgba(0,0,0,.3)',1);
  poly([x+hw(gy)*.35,gy,x+hw(top)*.35,top,x+hw(top),top,x+hw(gy),gy],'rgba(0,0,0,.07)');
  const fy=F.slice(0,-1).map(f=>gy-H*f);fy.forEach(y=>ln([x-hw(y)-1,y,x+hw(y)+1,y],'#8a99a3',2.5));
  return {top,hw,fy};}
/* 卡片內的一列 */
function rowK(x,y,label,val,col,w){wt(x,y,label,18,'rgba(227,236,238,.85)',600);wt(x+w,y,val,22,col,700,'right',COND);}
function bullets(x,y,L,u,k0,dk,gap){L.forEach(([t,col],i)=>alphaDo(seg(u,k0+i*dk,k0+i*dk+.05),()=>{circ(x,y+i*gap-6,5,col==='#fff'?'#f2c230':col);wt(x+18,y+i*gap,t,18,col,600);}));}
const fmtK=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,',');
const STC=['#ff9d7a','#f2c230','#7dffc4','#7dc8dc'];
/* 示例：107 m 鋼管塔分 4 段（長 m、下端直徑、上端直徑 m、壁厚 mm、重量 t） */
const SECS=[[20,4.3,4.3,45,95],[26,4.3,4.0,30,80],[29,4.0,3.5,22,59],[32,3.5,3.0,16,41]];
const SECF=[20/107,46/107,75/107,1];
/* 示例：轉速 7–13 rpm 的 1P、3P 頻帶與 10% 餘裕 */
const P1=[7/60,13/60],P3=[21/60,39/60],WIN=[P1[1]*1.1,P3[0]*.9];
/* 法蘭螺栓：預力 1,030 kN、外力分擔比 0.1（示例） */
const FP=1030,PHI=.1;
const boltF=(F,p)=>F<p/(1-PHI)?p+PHI*F:F;

const EP={no:11,slug:'onshore-wind',seriesName:'陸域風電系列',t:'塔架結構與共振',en:'Tower structure and resonance',
lede:'一座百米高的塔架，要撐起數百噸的機艙與轉子，承受風、颱風與地震。這一集看鋼管塔為什麼要分段、法蘭螺栓如何靠預力把各段鎖成一體、混凝土混合塔如何蓋得更高，以及塔架的自然頻率為什麼必須避開轉子的 1P 與 3P 頻率。',
facts:[['110','m','陸域風機輪轂高度示例，以 4 段鋼管塔組成'],
['4.3','m','鋼管塔底部直徑常受道路運輸限高限制在約 4.3–4.5 m（示例）'],
['M48','10.9 級','塔架法蘭常用的高強度螺栓規格（示例）'],
['1,030','kN','一支 M48 10.9 級螺栓的設計預力：0.7 × 抗拉強度 × 應力面積'],
['10','%','塔架自然頻率與 1P、3P 頻帶之間常保留的最小距離'],
['500','小時','運轉初期全數複查螺栓預力的時間點，之後每年抽檢約 10%（示例）']],
note:'說明：本集為教育用途示意動畫，風機、塔架、法蘭與螺栓的比例經過調整，塔架寬度與擺動幅度放大顯示。塔架分段長度、直徑、壁厚與重量為 110 m 輪轂高度鋼管塔的典型範例，並非特定機型資料；運輸限制依道路、橋梁與彎道條件而定。螺栓設計預力依 Eurocode 3（EN 1993-1-8）Fp,C = 0.7 fub As 計算（M48 應力面積 1,473 mm²、10.9 級抗拉強度 1,000 MPa），伸長量以夾緊長度約 340 mm 估算；螺栓受力圖採簡化的接合圖，外力分擔比 0.1 與外力範圍為示例。1P／3P 頻帶以轉速 7–13 rpm 計算，10% 頻率餘裕為業界文獻常見做法；混合塔輪轂高度約 160 m 引自國際已完成案例，混凝土段與鋼管段高度為示例。運轉初期約 500 小時全數複查、之後每年抽檢約 10% 為業界文獻常見說法，實際依各製造商手冊與 IEC 61400 系列標準、主管機關規定而定。',
base:()=>{landSky(GY,{sun:{x:1260,y:140},clouds:false});drawGround();},
shots:[
/* 1 ─────────────────────────────── 風機的骨幹 */
{t:'風機的骨幹',en:'The backbone of a turbine',dur:13,side:true,
 d:'塔架是風機最高、也最重的單一構件。以輪轂高度 110 公尺的陸域風機為例，塔架由 4 段鋼管組成，總重約 300 公噸，頂端要撐住機艙與轉子的重量，還要承受風推在轉子上的推力。推力乘上百米的力臂，在塔底形成最大的彎矩，所以塔架下粗上細、下厚上薄。在台灣，塔架設計還必須檢核颱風的極端風速與地震載重，再透過底法蘭與錨栓，把所有力量傳進基礎。',
 s:[[0,'百米高的塔架，撐起機艙與整組轉子'],[.26,'4 段鋼管以法蘭接合，下粗上細'],[.5,'風的推力乘上百米力臂，塔底彎矩最大'],[.74,'底法蘭與錨栓把所有力量傳進基礎']],
 cam:u=>camMix({x:800,y:450,s:1},{x:720,y:520,s:2.6},ease(seg(u,.66,.86))),
 draw(u){
  turbine(150,gyy(150),190,90,TT*1.1+.4);turbine(1380,gyy(1380),170,80,TT*1.2+1.9);
  const X=700,G=gyy(X),PX=3.4,H=107*PX,rot=TT*1.0+.3;
  windLines(120,560,10,150,.5,5,50);
  box(X-30,G-6,60,12,'#b9c0c4','rgba(0,0,0,.3)',1);
  const T=sTower(X,G,H,30,17,SECF);
  /* 塔門與人 */
  box(X-5,G-22,10,16,'#5b6a73');person(X+30,G-1,'#e8572a',1.2);
  nacRotor(X,T.top-6,197,rot);
  /* 輪轂高度標示 */
  alphaDo(band(u,.04,.3),()=>{const x=X-250;ln([x,G,x,T.top-6],'rgba(242,194,48,.85)',1.5);ln([x-10,G,x+10,G],'#f2c230',2);ln([x-10,T.top-6,x+10,T.top-6],'#f2c230',2);
   wt(x-14,(G+T.top)/2,'輪轂高度 110 m',18,'#f2c230',700,'right');});
  /* 法蘭 */
  T.fy.forEach((y,i)=>alphaDo(band(u,.26+i*.03,.52),()=>{ring(X,y,16,STC[i],3);}));
  lab(X+T.hw(T.fy[1]),T.fy[1],'法蘭接合處',{dx:130,dy:-30,st:'s',a:band(u,.3,.52)});
  lab(X+T.hw(G-H*.1),G-H*.1,'第 1 段：最粗最厚',{dx:150,dy:30,a:band(u,.32,.52)});
  /* 載重 */
  alphaDo(band(u,.5,.7),()=>{arrow(X-120,T.top-6,X-30,T.top-6,'#7dc8dc',4);tag(X-130,T.top-6,'風推力',{size:15,bg:'#7dc8dc',align:'right'});
   arrow(X+60,T.top-30,X+60,T.top+40,'#ff9d7a',4);tag(X+70,T.top+60,'機艙與轉子重量',{size:15,bg:'#ff9d7a'});
   ctx.beginPath();ctx.arc(X,G-20,60,Math.PI*1.1,Math.PI*1.9);ctx.strokeStyle='#e8572a';ctx.lineWidth=4;ctx.stroke();
   const e=Math.PI*1.9;arrow(X+60*Math.cos(e-.2),G-20+60*Math.sin(e-.2),X+60*Math.cos(e),G-20+60*Math.sin(e),'#e8572a',4);});
  lab(X,G-60,'底部彎矩最大',{dx:-150,dy:-50,st:'w',a:band(u,.52,.7)});
  /* 塔底特寫 */
  lab(X,G-14,'塔門',{dx:-90,dy:-40,st:'l',a:band(u,.78,1)});
  lab(X+20,G-2,'底法蘭與基礎錨栓',{dx:110,dy:-60,st:'s',a:band(u,.8,1)});
 },
 hud(u){hudPanel(250,182,'塔架概要（示例）',seg(u,.06,.12),w=>{
  hrow(56,'輪轂高度','110 m',w,'#f2c230');hrow(88,'塔架分段','4 段',w,'#fff');
  hrow(120,'底部直徑','4.3 m',w,'#7dffc4');hrow(152,'塔架重量','≈ 300 t',w,'#fff');});}},

/* 2 ─────────────────────────────── 鋼管塔分段 */
{t:'鋼管塔為什麼要分段',en:'Why steel towers come in sections',dur:14,
 d:'鋼管塔是用厚鋼板捲成圓筒、一節節焊接起來，再在兩端焊上法蘭。整座塔不可能一次運到山邊或海岸的風場，要拆成幾段，每段的長度、重量和直徑都受道路條件限制：底部直徑常在 4.3–4.5 公尺左右，再大就過不了陸橋與隧道的限高。彎矩越往下越大，所以底段壁厚最厚、重量最重，往上逐段變細變薄。以 110 公尺輪轂高度為例，4 段合計約 300 公噸。',
 s:[[0,'鋼板捲成筒節，焊成一段段塔筒'],[.28,'越往下彎矩越大，壁厚越厚、重量越重'],[.52,'每段都要裝上拖車，通過陸橋與彎道'],[.76,'底部直徑受限高約束，常在 4.3–4.5 m']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'4 段鋼管塔（示例，輪轂 110 m）',20,'#f2c230',700);
  const cx=210,K=4.4,DW=20;let y=764;
  SECS.forEach(([L,d0,d1,t,m],i)=>{const a=seg(u,.04+i*.07,.1+i*.07);const h=L*K,yt=y-h,lift=(1-ease(a))*30;
   if(a>0)alphaDo(a,()=>{const y0=y-lift,y1=yt-lift;
    poly([cx-d0*DW/2,y0,cx-d1*DW/2,y1,cx+d1*DW/2,y1,cx+d0*DW/2,y0],'#e3e8ec','rgba(0,0,0,.4)',1);
    poly([cx+d0*DW/2*.3,y0,cx+d1*DW/2*.3,y1,cx+d1*DW/2,y1,cx+d0*DW/2,y0],'rgba(0,0,0,.1)');
    box(cx-d0*DW/2-5,y0-5,d0*DW+10,5,'#8a99a3');box(cx-d1*DW/2-5,y1,d1*DW+10,5,'#8a99a3');
    const thk=t/45;box(cx+d0*DW/2+14,y0-h*.5-2,8+10*thk,4,STC[i]);
    const ty=(y0+y1)/2;wt(330,ty-14,trf('第 {n} 段',{n:i+1}),19,STC[i],700);
    wt(330,ty+12,trf('長 {l} m，直徑 {a}–{b} m',{l:L,a:d0.toFixed(1),b:d1.toFixed(1)}),16,'#fff',600);
    alphaDo(seg(u,.28,.34),()=>wt(330,ty+36,trf('壁厚 {t} mm，約 {m} t',{t,m}),16,'rgba(227,236,238,.85)',600));});
   y=yt-14;});
  /* 右上：運輸 */
  card(800,160,740,330,{bg:'rgba(7,27,39,.75)'});wt(824,200,'道路運輸的限制（示意）',20,'#f2c230',700);
  ctx.save();rrp(802,214,736,274,12);ctx.clip();
  const RY=440;box(802,RY,736,48,'#3a444b');ctx.setLineDash([24,18]);ln([802,RY+24,1538,RY+24],'rgba(255,255,255,.5)',2);ctx.setLineDash([]);
  const BX=1180;box(BX-20,280,240,26,'#9aa3a8','rgba(0,0,0,.4)',1);box(BX,306,26,RY-306,'#7f888d');box(BX+180,306,26,RY-306,'#7f888d');
  const tx=lerp(700,1640,seg(u,.5,.98)),D=110;
  box(tx-260,RY-34,300,14,'#394650');for(const wx of [-240,-200,-60,-20,10])circ(tx+wx,RY-12,10,'#222');
  box(tx+40,RY-70,70,50,'#e8572a','rgba(0,0,0,.4)',1);box(tx+90,RY-62,16,20,'#a8d8e8');circ(tx+60,RY-12,10,'#222');circ(tx+95,RY-12,10,'#222');
  box(tx-270,RY-34-D,290,D,'#e3e8ec','rgba(0,0,0,.4)',1);box(tx-270,RY-34-D,290,D*.25,'rgba(0,0,0,.08)');
  ctx.restore();
  alphaDo(seg(u,.54,.6),()=>{ln([BX+232,306,BX+232,RY],'#f2c230',2);wt(BX+242,RY-60,'限高',17,'#f2c230',700);
   tag(830,248,'塔筒直徑 ≈ 4.3 m',{size:16,bg:'#f2c230'});});
  /* 右下：重點 */
  card(800,510,740,290,{bg:'rgba(7,27,39,.75)'});wt(824,550,'分段的取捨',20,'#f2c230',700);
  bullets(836,600,[['每段長約 20–35 m，單段重量約 100 t 以內','#fff'],['底部直徑受限高約束，約 4.3–4.5 m','#7dffc4'],['下段承受彎矩最大，壁厚最厚','#ff9d7a'],['4 段合計約 300 t（含法蘭）','#fff']],u,.3,.12,50);
 }},

/* 3 ─────────────────────────────── 法蘭與預力 */
{t:'法蘭螺栓與預力',en:'Flange bolts and preload',dur:15,
 d:'塔架各段之間靠法蘭接合：兩圈厚鋼環面對面，用一整圈高強度螺栓鎖緊，例如 M48、10.9 級的螺栓一圈上百支。關鍵不是「鎖住」，而是預力：每支螺栓被拉長約 1 公釐，產生約 1,030 kN 的夾緊力，把兩片法蘭壓成一體。風造成的拉力大多先由法蘭面的壓力抵消，螺栓本身的受力只小幅變化。一旦預力流失，法蘭面會在拉力下張開，外力直接落到螺栓上，應力變化放大好幾倍，螺栓就可能疲勞斷裂。',
 s:[[0,'兩片法蘭面對面，用整圈高強度螺栓鎖緊'],[.24,'螺栓被拉長約 1 mm，產生約 1,030 kN 預力'],[.48,'風的拉力來回變化，螺栓受力幾乎不變'],[.72,'預力流失，法蘭張開，螺栓應力變化放大']],
 draw(u){
  diagBG();
  const pre=ease(seg(u,.18,.4)),loose=ease(seg(u,.72,.8)),P=FP*pre*(1-.5*loose);
  const ext=u>.46?seg(u,.46,.52)*(450+250*Math.sin(TT*3)):0,Fb=boltF(ext,P),gap=pre>0?Math.max(0,ext-P/(1-PHI))*.035:0;
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'L 型法蘭接合（剖面示意）',20,'#f2c230',700);
  const WX=520,FY=480,BX=400,st=pre*7;
  /* 下法蘭與塔壁 */
  box(290,FY,252,40,'#b9c0c4','rgba(0,0,0,.5)',1.5);box(WX,FY+40,22,120,'#b9c0c4','rgba(0,0,0,.5)',1.5);
  /* 上法蘭與塔壁（張開時抬起） */
  ctx.save();ctx.translate(WX+22,FY);ctx.rotate(-gap*.004);ctx.translate(-(WX+22),-FY-gap*.3);
  box(290,FY-40,252,40,'#cfd6db','rgba(0,0,0,.5)',1.5);box(WX,FY-210,22,170,'#cfd6db','rgba(0,0,0,.5)',1.5);ctx.restore();
  wt(WX-10,330,'塔壁',16,'rgba(227,236,238,.8)',600,'right');wt(300,FY-52,'法蘭',16,'rgba(227,236,238,.8)',600);
  /* 螺栓 */
  const bc=loose>.5&&u>.74?'#ff9d7a':(pre>.98?'#7dffc4':'#e9eef1');
  box(BX-12,FY-62,24,164+st,bc,'rgba(0,0,0,.5)',1);
  box(BX-30,FY-70,60,26,'#8a99a3','rgba(0,0,0,.5)',1.5);box(BX-34,FY-44,68,4,'#5b6a73');
  box(BX-30,FY+44+st,60,28,'#8a99a3','rgba(0,0,0,.5)',1.5);box(BX-34,FY+40+st,68,4,'#5b6a73');
  /* 夾緊力 */
  alphaDo(pre*(1-loose*.6),()=>{const L=20+40*pre;arrow(BX-80,FY-40-L,BX-80,FY-44,'#7dffc4',3);arrow(BX-80,FY+40+L,BX-80,FY+44,'#7dffc4',3);
   arrow(BX+80,FY-40-L,BX+80,FY-44,'#7dffc4',3);arrow(BX+80,FY+40+L,BX+80,FY+44,'#7dffc4',3);
   wt(BX-96,FY-60-L,'夾緊力',16,'#7dffc4',700,'right');});
  /* 外力 */
  if(ext>0){const L=ext/14;arrow(WX+11,FY-210,WX+11,FY-210-L,'#ff9d7a',4);arrow(WX+11,FY+160,WX+11,FY+160+L*.6,'#ff9d7a',4);wt(WX+36,FY-200-L,'風造成的拉力',16,'#ff9d7a',700);}
  alphaDo(loose*seg(u,.76,.8),()=>tag(300,FY+80,'法蘭張開',{size:15,bg:'#e8572a',fg:'#fff'}));
  rowK(90,700,'螺栓預力',trf('{v} kN',{v:fmtK(P)}),'#7dffc4',640);rowK(90,746,'螺栓受力',trf('{v} kN',{v:fmtK(u>.46?Fb:P)}),bc==='#ff9d7a'?'#ff9d7a':'#f2c230',640);
  /* 右上：受力圖 */
  const C=chartBox(800,160,740,370,{title:'螺栓受力與外力（示例）',x0:0,x1:1200,y0:0,y1:1400,xt:[0,400,800,1200],yt:[0,500,1000],xl:'每支螺栓分擔的外力（kN）',yl:'kN',pl:76,pt:64,pb:58,gx:3,gy:4});
  const curve=(p,col,g)=>{ctx.beginPath();for(let F=0;F<=1200*g;F+=10){const y=C.Y(boltF(F,p));F?ctx.lineTo(C.X(F),y):ctx.moveTo(C.X(F),y);}ctx.strokeStyle=col;ctx.lineWidth=3.5;ctx.stroke();};
  alphaDo(seg(u,.46,.52),()=>{box(C.X(200),C.py,C.X(700)-C.X(200),C.ph,'rgba(255,157,122,.12)');wt((C.X(200)+C.X(700))/2,C.py+24,'運轉時的外力範圍',15,'#ff9d7a',700,'center');});
  curve(FP,'#7dffc4',ease(seg(u,.06,.24)));alphaDo(seg(u,.2,.26),()=>wt(C.X(60),C.Y(FP)-14,'預力完整',16,'#7dffc4',700));
  curve(FP*.5,'#ff9d7a',ease(seg(u,.72,.84)));alphaDo(seg(u,.8,.86),()=>wt(C.X(60),C.Y(FP*.5)-14,'預力剩一半',16,'#ff9d7a',700));
  if(u>.5){circ(C.X(ext),C.Y(boltF(ext,FP)),7,'#7dffc4','#13232e',2);}
  if(loose>0)alphaDo(loose,()=>circ(C.X(ext),C.Y(boltF(ext,FP*.5)),7,'#ff9d7a','#13232e',2));
  /* 右下：重點 */
  card(800,550,740,250,{bg:'rgba(7,27,39,.75)'});wt(824,590,'預力的原理',20,'#f2c230',700);
  bullets(836,636,[['常用 M48、10.9 級高強度螺栓（示例）','#fff'],['預力 = 0.7 × 抗拉強度 × 應力面積 ≈ 1,030 kN','#7dffc4'],['預力完整：外力多由法蘭面承擔','#fff'],['預力流失：應力變化放大，螺栓疲勞','#ff9d7a']],u,.3,.14,44);
 }},

/* 4 ─────────────────────────────── 混凝土混合塔 */
{t:'更高的塔：混凝土混合塔',en:'Taller towers: concrete–steel hybrids',dur:14,side:true,
 d:'風速隨高度增加，輪轂越高，發電量通常越多。但鋼管塔受限於運輸直徑，要再加高就得把壁厚加到不合理。混凝土混合塔的做法是：下段用預鑄混凝土環片一圈圈疊起，直徑可以放大，再以貫穿塔身的後拉預力鋼腱，把環片緊緊壓在基礎上；上段再接回一般的鋼管塔。國際上已有輪轂高度約 160 公尺的混合塔運轉中，混凝土也讓塔架更重、更剛，自然頻率的調整空間更大。',
 s:[[0,'下段用預鑄混凝土環片，一圈圈疊上去'],[.36,'預力鋼腱貫穿塔身，把環片壓在基礎上'],[.56,'轉接段之上，再接回鋼管塔'],[.8,'同一台風機，輪轂從 110 m 拉高到約 160 m']],
 draw(u){
  const PX=2.6,XS=430,XH=1000,G1=gyy(XS),G2=gyy(XH),rot=TT*1.0+.3;
  windLines(120,560,8,150,.45,7,50);
  /* 鋼管塔 110 m */
  const T1=sTower(XS,G1,107*PX,24,14,SECF);nacRotor(XS,T1.top-4,156,rot+.6);
  /* 混合塔 */
  const NR=10,RH=10*PX,hwC=k=>lerp(30,17,k/NR),kr=seg(u,.04,.48)*NR,nd=Math.floor(kr),fr=kr-nd;
  for(let i=0;i<Math.min(NR,nd+1);i++){let y0=G2-i*RH;if(i===nd){if(nd>=NR)break;y0-=(1-ease(fr))*120;}
   const a=hwC(i),b=hwC(i+1);poly([XH-a,y0,XH-b,y0-RH,XH+b,y0-RH,XH+a,y0],'#b9bfc2','rgba(0,0,0,.35)',1);
   poly([XH+a*.35,y0,XH+b*.35,y0-RH,XH+b,y0-RH,XH+a,y0],'rgba(0,0,0,.08)');}
  const CT=G2-NR*RH;
  /* 預力鋼腱 */
  const tg=ease(seg(u,.5,.58));if(tg>0){[-.55,.55].forEach(s=>{ctx.setLineDash([8,6]);ln([XH+s*30,G2,lerp(XH+s*30,XH+s*17,tg),lerp(G2,CT,tg)],'#f2c230',2.5);ctx.setLineDash([]);});}
  /* 轉接段與上段鋼管 */
  const ad=seg(u,.56,.6);if(ad>0)alphaDo(ad,()=>box(XH-19,CT-8,38,8,'#8a99a3','rgba(0,0,0,.4)',1));
  const SH=[29*PX,29*PX];let sy=CT-8,hook=null;
  SH.forEach((h,i)=>{const g=seg(u,.6+i*.07,.66+i*.07);if(g<=0)return;const dy=(1-ease(g))*90,w0=lerp(13,10,i/2),w1=lerp(10,7,(i+1)/2);
   poly([XH-w0,sy-dy,XH-w1,sy-h-dy,XH+w1,sy-h-dy,XH+w0,sy-dy],'#eef2f4','rgba(0,0,0,.3)',1);ln([XH-w0,sy-dy,XH+w0,sy-dy],'#8a99a3',2.5);
   if(g<1)hook={x:XH,y:sy-h-dy};sy-=h;});
  const HY=sy-4,na=seg(u,.74,.8);if(na>0)alphaDo(na,()=>nacRotor(XH,HY,156,u>.8?rot:-.1));
  /* 吊機 */
  if(!hook&&u<.5&&nd<NR)hook={x:XH,y:G2-nd*RH-(1-ease(fr))*120-RH};
  const ca=1-seg(u,.74,.8);if(ca>0)alphaDo(ca,()=>{box(XH+150,G2-26,90,20,'#e9b21f','rgba(0,0,0,.4)',1);box(XH+130,G2-10,130,10,'#394650');
   const h=hook||{x:XH,y:HY-30};crane(XH+180,G2-28,560,h.x,h.y,{col:'#e9b21f'});});
  /* 標註 */
  lab(XH+hwC(4),G2-4*RH,'預鑄混凝土環片',{dx:150,dy:20,st:'l',a:band(u,.1,.48)});
  lab(XH+10,G2-6*RH,'後拉預力鋼腱',{dx:160,dy:10,st:'s',a:band(u,.52,.74)});
  lab(XH+19,CT-4,'轉接段',{dx:150,dy:-10,a:band(u,.58,.78)});
  lab(XH-10,CT-60,'上段鋼管塔',{dx:-150,dy:-20,a:band(u,.66,.82)});
  /* 高度比較 */
  alphaDo(seg(u,.82,.88),()=>{ctx.setLineDash([6,6]);ln([XS-200,T1.top-4,XH+60,T1.top-4],'rgba(255,255,255,.6)',1.5);ln([XS-200,HY,XH+60,HY],'rgba(242,194,48,.8)',1.5);ctx.setLineDash([]);
   wt(XS-210,T1.top+2,'110 m',20,'#fff',700,'right',COND);wt(XS-210,HY+6,'約 160 m',20,'#f2c230',700,'right',COND);});
  alphaDo(seg(u,.8,.86),()=>{tag(XS,G1+46,'鋼管塔',{size:16,bg:'rgba(7,27,39,.85)',fg:'#fff',align:'center'});tag(XH,G2+46,'混凝土混合塔',{size:16,bg:'rgba(7,27,39,.85)',fg:'#f2c230',align:'center'});});
 },
 hud(u){hudPanel(250,150,'混合塔（示例）',seg(u,.06,.12),w=>{
  hrow(56,'混凝土段','0–100 m',w,'#fff');hrow(88,'鋼管段','100–158 m',w,'#7dffc4');hrow(120,'輪轂高度','≈ 160 m',w,'#f2c230');});}},

/* 5 ─────────────────────────────── 1P 與 3P */
{t:'避開 1P 與 3P：塔架的共振',en:'Avoiding 1P and 3P: tower resonance',dur:15,
 d:'塔架像一根插在地上的長竿，有自己的自然頻率。轉子每轉一圈，質量或氣動的些微不平衡就推塔架一次，稱為 1P；三支葉片每掠過塔前一次，塔架就受到一次擾動，頻率是 3P。以轉速每分鐘 7–13 轉為例，1P 約 0.12–0.22 Hz，3P 約 0.35–0.65 Hz。若塔架的自然頻率落在這兩個頻帶裡，就會共振，擺幅放大、疲勞加速。大多數風機採「軟－剛」設計，讓頻率夾在兩者之間，並各留約 10% 的餘裕。',
 s:[[0,'轉一圈推塔一次是 1P，葉片掠過塔前三次是 3P'],[.26,'轉速 7–13 rpm，1P 與 3P 各成一個頻帶'],[.5,'自然頻率落進頻帶，擺幅放大，形成共振'],[.76,'軟－剛設計：夾在兩個頻帶之間，各留 10% 餘裕']],
 draw(u){
  diagBG();
  const fm=kf(u,[[0,.28],[.5,.28],[.54,.17],[.6,.17],[.66,.47],[.72,.47],[.8,.28],[1,.28]]).x;
  const show=seg(u,.5,.54),inB=(fm>=P1[0]&&fm<=P1[1])||(fm>=P3[0]&&fm<=P3[1]),res=show*(inB?1:0);
  /* 左：塔架擺動 */
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'塔架的擺動（示意）',20,'#f2c230',700);
  const BX=410,BY=640,H=300,rot=TT*1.4,A=lerp(4,30,res),sw=Math.sin(TT*TAU*.7)*A;
  box(BX-60,BY,120,14,'#9aa3a8');
  const P=[];for(let k=0;k<=12;k++){const z=k/12;P.push([BX+sw*z*z,BY-H*z,lerp(16,9,z)]);}
  ctx.beginPath();P.forEach(([x,y,w],i)=>i?ctx.lineTo(x-w,y):ctx.moveTo(x-w,y));for(let i=P.length-1;i>=0;i--)ctx.lineTo(P[i][0]+P[i][2],P[i][1]);
  ctx.closePath();ctx.fillStyle=res>.5?'#ffd2c2':'#eef2f4';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1;ctx.stroke();
  const hx=BX+sw,hy=BY-H-10;
  /* 葉片掠過塔前：3P 閃光 */
  const bp=((rot%(TAU/3))+TAU/3)%(TAU/3),fl=Math.max(0,1-Math.min(bp,TAU/3-bp)/.35);
  alphaDo(fl*seg(u,.04,.1),()=>{ring(hx,hy+70,22,'#f2c230',4);});
  nacRotor(hx,hy,130,rot);
  alphaDo(seg(u,.04,.1),()=>{const a=rot-Math.PI/2;circ(hx+Math.cos(a)*100,hy+Math.sin(a)*100,8,'#ff9d7a','#13232e',2);});
  rowK(90,706,'1P：轉一圈一次','0.12–0.22 Hz',STC[0],640);rowK(90,750,'3P：葉片掠過塔前','0.35–0.65 Hz',STC[1],640);
  alphaDo(res,()=>tag(BX+60,BY-H+40,'共振',{size:18,bg:'#e8572a',fg:'#fff'}));
  /* 右上：頻率圖 */
  const C=chartBox(800,160,740,350,{title:'激振頻帶與塔架自然頻率（示例）',x0:0,x1:.8,y0:0,y1:1,xt:[0,.2,.4,.6,.8],yt:[],xl:'頻率（Hz）',pl:40,pt:64,pb:58,gx:4,gy:0});
  const bandB=(a,b,col,g)=>{if(g>0)alphaDo(g,()=>box(C.X(a),C.py,C.X(b)-C.X(a),C.ph,col));};
  const g1=seg(u,.26,.34),g2=seg(u,.32,.4);
  bandB(P1[0],P1[1],'rgba(232,87,42,.35)',g1);bandB(P3[0],P3[1],'rgba(242,194,48,.3)',g2);
  alphaDo(g1,()=>wt(C.X((P1[0]+P1[1])/2),C.py+30,'1P',22,'#ff9d7a',700,'center',COND));
  alphaDo(g2,()=>wt(C.X((P3[0]+P3[1])/2),C.py+30,'3P',22,'#f2c230',700,'center',COND));
  const gw=seg(u,.76,.82);bandB(P1[1],WIN[0],'rgba(255,255,255,.1)',gw);bandB(WIN[1],P3[0],'rgba(255,255,255,.1)',gw);
  bandB(WIN[0],WIN[1],'rgba(125,255,196,.3)',gw);
  alphaDo(gw,()=>{wt(C.X((WIN[0]+WIN[1])/2),C.py+C.ph-46,'軟－剛',18,'#7dffc4',700,'center');wt(C.X((WIN[0]+WIN[1])/2),C.py+C.ph-22,'10% 餘裕',14,'rgba(227,236,238,.85)',600,'center');});
  if(show>0)alphaDo(show,()=>{const x=C.X(fm);ln([x,C.py+50,x,C.py+C.ph-62],inB?'#e8572a':'#7dffc4',3);
   tag(x+8,C.py+C.ph*.48,trf('塔架 f₁ = {f} Hz',{f:fm.toFixed(2)}),{size:15,bg:inB?'#e8572a':'#7dffc4',fg:inB?'#fff':'#13232e'});});
  /* 右下：設計區間 */
  card(800,530,740,270,{bg:'rgba(7,27,39,.75)'});wt(824,570,'三種設計區間',20,'#f2c230',700);
  bullets(836,616,[['軟－軟：低於 1P，塔輕但易受擾動','#ff9d7a'],['軟－剛：介於 1P 與 3P 之間，最常見','#7dffc4'],['剛－剛：高於 3P，塔又粗又重','#ff9d7a'],['塔越高頻率越低，可設定跳過特定轉速','#fff']],u,.3,.12,46);
 }},

/* 6 ─────────────────────────────── 預力施作與檢查 */
{t:'預力怎麼上、怎麼查',en:'Applying and checking preload',dur:14,side:true,
 d:'大直徑的塔架螺栓多用液壓拉伸器施作：拉伸器套在螺栓末端，以油壓把螺栓直接拉長，再把螺帽轉緊、洩壓，預力就留在螺栓裡，比單純施加扭力更準確。驗收或檢查時，可用超音波量測螺栓長度：音波在螺栓兩端來回的時間，會隨伸長而變長，換算出約 1.1 公釐的伸長即對應設計預力。風機運轉初期約 500 小時要全數複查，之後每年抽檢約 10%，也就是第 16 集年度定檢裡的螺栓工作。',
 s:[[0,'液壓拉伸器套上螺栓，以油壓直接拉長'],[.28,'拉到設計值後轉緊螺帽、洩壓，預力留在螺栓裡'],[.52,'超音波量測回波時間，換算螺栓伸長量'],[.76,'運轉初期全數複查，之後每年抽檢約一成']],
 draw(u){
  const G=gyy(750),L0=560,R0=950,W=26;
  /* 基礎 */
  box(460,G,600,320,'#a9b0b4','rgba(0,0,0,.35)',1.5);box(460,G,600,6,'#8a9196');
  /* 塔壁剖面與內部 */
  const TY=170;box(L0+W,TY,R0-L0-2*W,G-TY,'#26343d');
  box(L0,TY,W,G-24-TY,'#cfd6db','rgba(0,0,0,.4)',1);box(R0-W,TY,W,G-24-TY,'#cfd6db','rgba(0,0,0,.4)',1);
  {const zz=[];for(let x=L0;x<=R0;x+=26)zz.push(x,TY-((x-L0)/26%2?8:0));ln(zz,'rgba(227,236,238,.7)',2);}
  for(let y=G-60;y>TY;y-=46)ln([R0-W-46,y,R0-W-14,y],'#8a99a3',3);ln([R0-W-46,G,R0-W-46,TY],'#8a99a3',3);ln([R0-W-14,G,R0-W-14,TY],'#8a99a3',3);
  /* T 型底法蘭與錨栓 */
  const bolts=[];[[L0,1],[R0-W,-1]].forEach(([x])=>{box(x-70,G-24,W+140,24,'#b9c0c4','rgba(0,0,0,.5)',1.5);
   [x-40,x+W+40].forEach(bx=>{bolts.push(bx);ctx.setLineDash([10,6]);ln([bx,G,bx,G+250],'rgba(60,70,75,.7)',10);ctx.setLineDash([]);
    box(bx-5,G-58,10,36,'#e9eef1','rgba(0,0,0,.5)',1);box(bx-16,G-40,32,16,'#8a99a3','rgba(0,0,0,.5)',1);});});
  ln([430,G+250,1080,G+250],'rgba(60,70,75,.5)',6);
  const B=bolts[1];
  /* 拉伸器與油壓泵 */
  const ta=1-seg(u,.46,.52),pre=ease(seg(u,.08,.3)),st=pre*4;
  if(ta>0)alphaDo(ta,()=>{box(B-24,G-110-st,48,70,'#e9b21f','rgba(0,0,0,.5)',1.5);box(B-28,G-118-st,56,10,'#c99a1a');
   ctx.beginPath();ctx.moveTo(B+24,G-90-st);ctx.bezierCurveTo(B+120,G-90,B+60,G-30,720,G-30);ctx.strokeStyle='#222';ctx.lineWidth=4;ctx.stroke();
   box(700,G-50,70,44,'#e8572a','rgba(0,0,0,.4)',1);box(712,G-42,30,14,'#a8d8e8');});
  /* 超音波探頭與量測儀 */
  const ua=seg(u,.5,.56);if(ua>0)alphaDo(ua,()=>{box(B-8,G-72,16,14,'#7dffc4','rgba(0,0,0,.5)',1);
   ctx.beginPath();ctx.moveTo(B,G-72);ctx.bezierCurveTo(B,G-160,760,G-200,800,G-150);ctx.strokeStyle='#222';ctx.lineWidth=3;ctx.stroke();
   box(788,G-150,40,30,'#394650','rgba(0,0,0,.5)',1);box(792,G-146,32,18,'#7dffc4');});
  person(820,G,'#e8572a',9);
  if(pre>0&&ta>0)alphaDo(seg(u,.08,.12)*ta,()=>{const p=bolts[1];ln([p,G-56,p,G+100],'#7dffc4',3);});
  lab(B,G-110,'液壓拉伸器',{dx:-60,dy:-80,st:'s',a:band(u,.04,.46)});
  lab(735,G-40,'油壓泵',{dx:-20,dy:-150,a:band(u,.1,.46)});
  lab(L0-40,G+120,'基礎錨栓',{dx:-120,dy:20,st:'l',a:band(u,.04,.4)});
  lab(B,G-66,'超音波探頭',{dx:-40,dy:-90,st:'g',a:band(u,.54,.8)});
  /* 右：超音波與檢查時程 */
  const cA=seg(u,.52,.58);if(cA>0)alphaDo(cA,()=>{card(990,330,550,260,{bg:'rgba(7,27,39,.88)'});wt(1010,368,'超音波量測螺栓伸長（示意）',19,'#f2c230',700);
   const x0=1010,x1=1520,y0=490;ln([x0,y0,x1,y0],'rgba(255,255,255,.3)',1);
   const pulse=(x,col,a)=>{ctx.beginPath();for(let k=-30;k<=30;k++){const y=y0-a*Math.exp(-k*k/90)*Math.cos(k*.9);k>-30?ctx.lineTo(x+k,y):ctx.moveTo(x+k,y);}ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.stroke();};
   pulse(x0+40,'#7dc8dc',50);const e0=1360,e1=e0+36*ease(seg(u,.6,.7));
   alphaDo(.6,()=>pulse(e0,'rgba(227,236,238,.6)',34));pulse(e1,'#7dffc4',34);
   wt(x0+40,y0+40,'發射',15,'#7dc8dc',700,'center');wt(e0-6,y0-52,'鎖緊前',14,'rgba(227,236,238,.85)',600,'right');wt(e1+34,y0-52,'鎖緊後',14,'#7dffc4',700);
   wt(1010,566,trf('伸長 {d} mm → 預力 {p} kN',{d:(1.1*ease(seg(u,.6,.7))).toFixed(2),p:fmtK(FP*ease(seg(u,.6,.7)))}),18,'#fff',700);});
  const cB=seg(u,.74,.8);if(cB>0)alphaDo(cB,()=>{card(990,610,550,190,{bg:'rgba(7,27,39,.88)'});wt(1010,648,'檢查時程（示例）',19,'#f2c230',700);
   [['安裝時','全數拉伸至設計預力','#fff'],['約 500 小時','全數複查','#7dffc4'],['之後每年','抽檢約 10%（第 16 集）','#f2c230']].forEach(([a,b,col],i)=>alphaDo(seg(u,.78+i*.05,.82+i*.05),()=>{
    wt(1010,690+i*36,a,17,'rgba(227,236,238,.85)',600);wt(1516,690+i*36,b,17,col,700,'right');}));});
 },
 hud(u){hudPanel(250,150,'螺栓預力（示例）',seg(u,.04,.1),w=>{const pre=ease(seg(u,.08,.3));
  hrow(56,'目標預力','1,030 kN',w,'#f2c230');hrow(88,'目前預力',trf('{v} kN',{v:fmtK(FP*pre)}),w,pre>.99?'#7dffc4':'#fff');
  hrow(120,'伸長量',trf('{v} mm',{v:(1.1*pre).toFixed(2)}),w,'#fff');});}}
]};
