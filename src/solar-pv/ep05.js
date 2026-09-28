// KITS: land
/* 太陽光電系列 第 5 集：水面型浮動式光電 */
const WL0=480,A0=330,A1=1170,UW=60;                       // 水面高度、浮台陣列左右端、每單元寬
const E_Y='#f2c230',E_G='#7dffc4',E_W='#e8572a';
const DEG=Math.PI/180;
/* 水庫底部剖面：左岸、平坦庫底、右岸 */
function botY(x){if(x<160)return 440;if(x<420)return lerp(440,800,(x-160)/260);if(x<1280)return 800+6*Math.sin(x*.02);if(x<1520)return lerp(800,440,(x-1280)/240);return 440;}
function resBase(o){o=o||{};const wl=o.wl||WL0;
 landSky(440,{sun:{x:1260,y:120},clouds:o.clouds});
 ctx.beginPath();ctx.moveTo(VX0,wl);for(let x=VX0;x<=VX1;x+=20)ctx.lineTo(x,396+14*Math.sin(x*.006)+8*Math.sin(x*.017));ctx.lineTo(VX1,wl);ctx.closePath();ctx.fillStyle='#7f9c73';ctx.fill();
 const g=ctx.createLinearGradient(0,wl,0,820);g.addColorStop(0,'#4f9ab0');g.addColorStop(1,'#1c4d63');
 ctx.beginPath();ctx.moveTo(VX0,wl);for(let x=VX0;x<=VX1;x+=8)ctx.lineTo(x,wl+1.5*Math.sin(x*.05-TT*2));ctx.lineTo(VX1,VY1+20);ctx.lineTo(VX0,VY1+20);ctx.closePath();ctx.fillStyle=g;ctx.fill();
 ln([VX0,wl,VX1,wl],'rgba(255,255,255,.45)',1.4);
 ctx.beginPath();ctx.moveTo(VX0,botY(VX0));for(let x=VX0;x<=VX1;x+=8)ctx.lineTo(x,botY(x));ctx.lineTo(VX1,VY1+20);ctx.lineTo(VX0,VY1+20);ctx.closePath();ctx.fillStyle='#8a7458';ctx.fill();
 ctx.beginPath();ctx.moveTo(VX0,botY(VX0));for(let x=VX0;x<=VX1;x+=8)ctx.lineTo(x,botY(x));ctx.strokeStyle='#6b5a45';ctx.lineWidth=3;ctx.stroke();
 box(VX0,436,160-VX0,6,'#7a9a55');box(1520,436,VX1-1520,6,'#7a9a55');
}
/* 單一浮台單元：主浮體＋模組＋走道浮體 */
function floatUnit(x,wl,o){o=o||{};const y=wl+1.6*Math.sin(TT*1.6+x*.03);
 rrp(x-26,y-8,52,16,5);ctx.fillStyle='#e3e8ea';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.stroke();
 box(x+26,y-4,8,8,'#c2cacd');
 ln([x-20,y-8,x-20,y-18],'#8a99a3',3);
 ctx.save();ctx.translate(x-2,y-14);ctx.rotate(10*DEG);box(-24,-5,48,5,'#1f3f66');box(-24,-5,48,1.4,Math.sin(TT*1.3+x)>.95?'#fff':'#9fc3e6');ctx.restore();
 return y;}
function floatArray(a,n,wl,dx){const N=Math.round((A1-A0)/UW)+1;if(n===undefined)n=N;dx=dx||0;alphaDo(a===undefined?1:a,()=>{for(let i=0;i<n;i++)floatUnit(A0+i*UW+dx,wl||WL0);});}
function anchorBlock(x,y){box(x-18,y-16,36,16,'#8d9296','rgba(0,0,0,.35)',1);ln([x,y-16,x,y-22],'#555',3);}
function moor(x0,y0,x1,y1,col,sag){ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2,(y0+y1)/2+(sag===undefined?24:sag),x1,y1);ctx.strokeStyle=col||'#e6d9a8';ctx.lineWidth=2;ctx.stroke();}
const ANC=[[A0,250],[A0+6*UW,650],[A1,1250]];                   // [浮台繫點, 錨碇塊位置]
function moorings(a,dx,wl){wl=wl||WL0;dx=dx||0;alphaDo(a===undefined?1:a,()=>{
 ANC.forEach(([p,xa])=>{anchorBlock(xa,botY(xa));moor(p+dx,wl+8,xa,botY(xa)-22);});
 moor(A1+26+dx,wl-2,1540,432,'#e6d9a8',10);box(1532,420,14,18,'#4a555c');});}
const CAB=[[1110,492],[1150,790],[1290,786],[1520,436],[1556,436]];
function cable(a){alphaDo(a===undefined?1:a,()=>{pathLine(CAB,'#2b3137',4);
 box(1546,388,40,50,'#dfe5e8','rgba(0,0,0,.3)',1);box(1552,398,28,8,'#2b3137');circ(1578,426,3,E_G);});}
function partialPt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
 let r=f*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,sp,col,a){if(a<=0)return;for(let k=0;k<n;k++){const f=(TT*sp+k/n)%1,p=partialPt(P,f);alphaDo(a,()=>circ(p[0],p[1],4,col));}}
function workboat(x,wl){const y=wl+1.5*Math.sin(TT*1.8);poly([x-70,y-14,x+70,y-14,x+56,y+8,x-60,y+8],'#e9b21f','rgba(0,0,0,.35)',1);box(x+10,y-40,40,26,'#dfe5e8');box(x+16,y-34,12,8,'#5a7b92');
 ln([x-30,y-14,x-30,y-70,x-70,y-86],'#394650',4);return [x-70,y-86];}
/* 圖解用的迷你浮台 */
function miniFloat(x,y,w){rrp(x-w/2,y-5,w,10,3);ctx.fillStyle='#e3e8ea';ctx.fill();ctx.save();ctx.translate(x,y-10);ctx.rotate(10*DEG);box(-w/2+2,-4,w-4,4,'#1f3f66');box(-w/2+2,-4,w-4,1.2,'#9fc3e6');ctx.restore();}
function spring(x0,y0,x1,y1,n){const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,px=-uy,py=ux;ctx.beginPath();ctx.moveTo(x0,y0);
 for(let i=1;i<n;i++){const t=i/n,s=(i%2?1:-1)*7;ctx.lineTo(x0+dx*t+px*s,y0+dy*t+py*s);}ctx.lineTo(x1,y1);ctx.strokeStyle=E_Y;ctx.lineWidth=2.2;ctx.stroke();}

const EP={no:5,slug:'solar-pv',seriesName:'太陽光電系列',t:'水面型浮動式光電',en:'Floating solar on water',
lede:'水庫、滯洪池與近岸水域的水面，也能架起太陽光電。模組裝在會浮的浮台上，靠錨碇與繫纜固定位置。這一集看浮台怎麼組成、錨碇如何因應水位升降與颱風，以及水面帶來的冷卻效果。',
facts:[['9.99','MW','阿公店水庫：全台第一座水庫水面型光電，2019 年全數併聯'],
['181','MW','彰濱崙尾東水面型光電：約 176 公頃、約 57 萬片模組'],
['約 2.5','億度','彰濱崙尾東案場首年預估發電量'],
['5–12','°','浮動式模組常見傾角，比地面型低，以減少風力'],
['−0.35','%/°C','典型模組溫度係數：溫度每降 1 °C 約多發 0.35%（示例）'],
['3','m','水位變化超過約 3 m 時，常改用可收放或配重式繫纜（設計建議）']],
note:'說明：本集為教育用途示意動畫，浮台、錨碇與水深比例經過調整。阿公店水庫 9.99 MW 與運轉後水質監測依經濟部水利署新聞稿；彰濱崙尾東 181 MW、約 176 公頃、約 57 萬片模組與首年約 2.5 億度依開發商公開資料與媒體報導；浮動式系統由浮台、支撐結構、錨碇系統、水下電纜與光電系統組成。傾角 5–12°、水位差約 3 m 以上改用可收放繫纜為業界設計指引的典型值；案場容量 10 MWp、浮體浮力、溫差 6 °C、溫度係數 −0.35 %/°C 與設計風速皆為典型範例，實際數值依設備、地點與法規而定。',
base:()=>resBase({clouds:false}),
shots:[
{t:'水面上的光電場',en:'A solar farm that floats',dur:13,side:true,
 d:'水面型光電把模組裝在會浮的浮台上，設置在水庫、滯洪池、埤塘或近岸水域。它不占用陸地，也不必整地打樁。一座浮動式系統由五個部分組成：浮台、支撐結構、錨碇系統、水下電纜與光電模組。浮台用錨碇塊與繫纜固定在原位，產生的直流電經水下電纜送到岸上的變流器。以 10 MWp 為例，約需 20 公頃水面，一年可發約 1,200 萬度電（示例）。',
 s:[[0,'水庫的水面，也能設置太陽光電'],[.26,'模組裝在會浮的浮台上，一片片接成陣列'],[.52,'錨碇塊與繫纜把浮台固定在原位'],[.76,'電力經水下電纜送到岸上的變流器']],
 cam:u=>camMix(camMix({x:800,y:450,s:1},{x:800,y:540,s:1.3},ease(seg(u,.46,.6))),{x:800,y:450,s:1},ease(seg(u,.68,.8))),
 draw(u){
  const k=ease(seg(u,.2,.46));floatArray(1,Math.ceil(15*k));
  const m=seg(u,.48,.58);moorings(m);cable(seg(u,.7,.8));
  flowDots(CAB,6,.4,E_Y,seg(u,.78,.86));
  lab(800,WL0+70,'水庫水面',{dx:-60,dy:80,st:'l',a:band(u,.04,.26)});
  lab(A0+4*UW,WL0-16,'浮台陣列',{dx:-40,dy:-80,st:'s',a:band(u,.3,.54)});
  lab(650,botY(650)-12,'錨碇塊',{dx:-60,dy:-60,a:band(u,.52,.78)});
  lab(1320,478,'岸錨繫纜',{dx:-30,dy:90,a:band(u,.56,.8),minor:true});
  lab(1220,788,'水下電纜',{dx:-40,dy:-60,a:band(u,.74,1)});
  lab(1566,420,'岸上變流器',{dx:-90,dy:90,st:'g',a:band(u,.8,1)});
 },
 hud(u){hudPanel(250,150,'案場概況（示例）',seg(u,.05,.1),w=>{const k=ease(seg(u,.2,.46));
  hrow(56,'裝置容量',(10*k).toFixed(1)+' MWp',w,'#f2c230');hrow(88,'占用水面',trf('約 {n} ha',{n:Math.round(20*k)}),w,'#fff');hrow(120,'年發電量',trf('約 {n} 萬度',{n:Math.round(1200*k),g:(12*k).toFixed(1)}),w,'#7dffc4');});}},

{t:'浮台的構造',en:'Inside a float unit',dur:13,
 d:'浮台多用高密度聚乙烯（HDPE）吹塑成中空浮體，添加抗紫外線配方，長期曬在陽光下也不易脆化。每片模組坐在一個主浮體上，以支撐架墊出傾角；主浮體之間用走道浮體連接，讓維運人員可以走進陣列。浮體之間以連接耳和插銷相扣，組成可隨水面起伏的整片浮台。設計時浮力要遠大於模組、支架與人員的重量，保留足夠的安全係數。',
 s:[[0,'把一個浮台單元拆開來看'],[.24,'主浮體承載模組，支撐架墊出傾角'],[.48,'走道浮體讓維運人員走進陣列'],[.72,'浮力要遠大於重量，保留安全係數']],
 draw(u){
  diagBG();
  card(60,160,820,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'浮台單元（分解）',20,'#f2c230',700);
  const sp=ease(seg(u,.08,.3))*(1-ease(seg(u,.62,.74)));
  const cx=470,by=560;
  /* 主浮體 */
  alphaDo(seg(u,.04,.1),()=>{rrp(cx-190,by-40,380,80,14);ctx.fillStyle='#e3e8ea';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1.5;ctx.stroke();
   ln([cx-150,by-20,cx+150,by-20],'rgba(0,0,0,.12)',2);ln([cx-150,by+10,cx+150,by+10],'rgba(0,0,0,.12)',2);});
  /* 走道浮體 */
  alphaDo(seg(u,.4,.46),()=>{const o=50*sp;rrp(cx+200+o,by-24,120,48,10);ctx.fillStyle='#c2cacd';ctx.fill();
   for(let x=cx+212+o;x<cx+310+o;x+=16)ln([x,by-24,x+8,by+24],'rgba(0,0,0,.15)',2);
   circ(cx+196+o/2,by,8,'#8a99a3');});
  /* 支撐架與模組 */
  const my=by-40-120*sp;
  alphaDo(seg(u,.22,.28),()=>{ln([cx-150,by-40-60*sp,cx-150,my-40],'#8a99a3',6);ln([cx+130,by-40-60*sp,cx+130,my-2],'#8a99a3',6);});
  alphaDo(seg(u,.18,.24),()=>{ctx.save();ctx.translate(cx,my-26-60*sp);ctx.rotate(8*DEG);box(-200,-14,400,14,'#1f3f66','rgba(0,0,0,.4)',1);
   ctx.strokeStyle='rgba(160,200,240,.5)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<10;i++){ctx.moveTo(-200+40*i,-14);ctx.lineTo(-200+40*i,0);}ctx.stroke();box(-200,-14,400,2,'#9fc3e6');ctx.restore();});
  /* 水面 */
  box(84,by+14,772,6,'rgba(88,184,208,.5)');wt(100,by+50,'水面',16,'#7dc8dc',600);
  alphaDo(band(u,.1,.54),()=>{wt(cx-190,by+96,'主浮體（HDPE）',18,'#fff',600);wt(cx+215,by-190,'光電模組',18,'#f2c230',700);});
  alphaDo(band(u,.26,.56),()=>wt(cx-330,by-130,'支撐架',18,'#fff',600));
  alphaDo(band(u,.42,.62),()=>{wt(cx+200,by+96,'走道浮體',18,'#fff',600);wt(cx+160,by+130,'連接耳＋插銷',16,'rgba(227,236,238,.8)',500);});
  alphaDo(seg(u,.66,.74),()=>{wt(84,760,'組裝完成後，隨水面起伏',17,'#7dffc4',600);});
  /* 右：浮力與重量 */
  card(920,160,620,640,{bg:'rgba(7,27,39,.75)'});wt(944,200,'浮力夠不夠（示例）',20,'#f2c230',700);
  const B=[['模組','28 kg',28,'#58b8d0'],['浮體與支架','20 kg',20,'#58b8d0'],['維運人員','75 kg',75,'#b37cff'],['可提供浮力','250 kg',250,E_G]];
  const bx=1110,bw=380;
  B.forEach(([n,v,val,c],i)=>{const k=ease(seg(u,.62+i*.05,.7+i*.05)),y=280+i*84;
   wt(944,y+22,n,18,'#fff',600);box(bx,y,bw,30,'rgba(255,255,255,.1)');box(bx,y,bw*val/250*k,30,c);
   alphaDo(k,()=>wt(bx+bw,y+62,v,17,c===E_G?E_G:'rgba(227,236,238,.85)',700,'right',COND));});
  alphaDo(seg(u,.86,.92),()=>{card(944,650,572,120,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});
   wt(968,698,'浮力 ÷ 總重',19,'#fff',700);wt(1490,700,'≈ 2',30,E_G,700,'right',COND);
   wt(968,742,'即使有人走上去，仍有一倍以上的餘裕',16,'rgba(227,236,238,.85)',500);});
 }},

{t:'錨碇：讓浮台待在原位',en:'Anchoring the array',dur:13,side:true,
 d:'浮台不能任由風和水流推著走，否則會撞上岸邊或擠壓電纜。常見做法是在水底放置混凝土錨碇塊，再以繫纜或錨鏈連到浮台外圍；靠近岸邊的區段則可用岸錨，把繫纜綁在岸上的固定樁。錨碇塊通常由工作船吊放到預定位置，數量與方位依風向、水深與底質計算。彰濱崙尾東案場便是先在陸上組好浮台，再拖到錨碇塊的位置固定。',
 s:[[0,'工作船把混凝土錨碇塊吊放到水底'],[.32,'在陸上組好的浮台，拖到錨碇的位置'],[.54,'繫纜連到浮台外圍，靠岸側用岸錨固定'],[.76,'風吹來時，繫纜拉住浮台不漂移']],
 cam:u=>camMix({x:700,y:600,s:1.45},{x:800,y:520,s:1.2},ease(seg(u,.5,.64))),
 draw(u){
  const push=6*ease(seg(u,.74,.86))+2*Math.sin(TT*1.2)*seg(u,.74,.86);
  const tw=ease(seg(u,.36,.52)),adx=push+260*(1-tw);
  if(u>.34)floatArray(seg(u,.34,.4),undefined,WL0,adx);if(u>.5)cable(seg(u,.5,.56));
  [ANC[0],ANC[2]].forEach(([p,xa])=>anchorBlock(xa,botY(xa)));
  const ml=seg(u,.5,.6);if(ml>0)alphaDo(ml,()=>ANC.forEach(([p,xa])=>moor(p+push,WL0+8,xa,botY(xa)-22)));
  /* 吊放中的錨碇塊 */
  const bxp=lerp(260,720,ease(seg(u,0,.12)))-900*ease(seg(u,.3,.44));
  const xa=ANC[1][1],drop=ease(seg(u,.12,.3));
  if(bxp>-200){const hk=workboat(bxp,WL0),hx=hk[0],by=lerp(WL0+10,botY(xa),drop);
   if(u<.3){ln([hx,hk[1],hx,by-22],'#dfe5e8',1.5);anchorBlock(hx,by);}
   lab(hx,by-8,'混凝土錨碇塊',{dx:80,dy:-40,st:'s',a:band(u,.04,.28)});}
  if(u>=.3)anchorBlock(xa,botY(xa));
  const sh=seg(u,.58,.66);if(sh>0)alphaDo(sh,()=>{moor(A1+26+push,WL0-2,1540,432,'#e6d9a8',10);box(1532,420,14,18,'#4a555c');});
  alphaDo(seg(u,.72,.8)*(1-seg(u,.96,1)),()=>{for(let i=0;i<3;i++){const y=WL0-70-i*26,o=(TT*120+i*60)%200;arrow(60+o,y,160+o,y,'rgba(255,255,255,.85)',2.5);}});
  lab(A0+4*UW,WL0-14,'在陸上組好的浮台',{dx:0,dy:-90,st:'l',a:band(u,.38,.56)});
  lab(xa+10,botY(xa)-60,'繫纜',{dx:70,dy:-40,a:band(u,.54,.74)});
  lab(1539,428,'岸錨',{dx:-40,dy:-70,st:'l',a:band(u,.6,.8)});
  lab(150,WL0-96,'季風',{dx:30,dy:-50,st:'w',a:band(u,.74,1)});
  lab(A0+push,WL0+8,'外圍繫點',{dx:-60,dy:60,st:'g',a:band(u,.8,1),minor:true});
 },
 hud(u){hudPanel(250,150,'錨碇狀態（示例）',seg(u,.05,.1),w=>{const wd=seg(u,.74,.86);
  hrow(56,'錨碇點',u>.64?'4 / 4':(u>.3?'3 / 4':'2 / 4'),w,'#fff');hrow(88,'風速',(3+9*wd).toFixed(0)+' m/s',w,'#f2c230');
  hrow(120,'浮台位移',(2+10*wd).toFixed(0)+' cm',w,'#7dffc4');});}},

{t:'水位會升降',en:'When the water level changes',dur:14,
 d:'水庫在枯水期與豐水期的水位可相差好幾公尺，滯洪池在大雨時更會迅速漲水、雨後再排空。繫纜若綁得太緊，水位上升時會把浮台往下拉；綁得太鬆，低水位時浮台又會四處漂移，甚至擱淺在池邊。因此繫纜要預留長度，並串接彈性元件吸收變化；水位差超過約 3 公尺的場址，常改用可收放或配重式繫纜。低水位時，陣列也要停在夠深的位置，避免浮體擱淺。',
 s:[[0,'水位下降時，浮台跟著水面一起下降'],[.3,'繫纜上的彈性元件伸縮，保持張力'],[.55,'大雨後水位迅速上升，浮台隨之浮起'],[.76,'水位差大時，改用可收放的繫纜']],
 draw(u){
  diagBG();
  card(60,160,940,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'剖面：滯洪池的水位變化（示意）',20,'#f2c230',700);
  const HI=330,LO=560,lv=u<.5?ease(seg(u,.06,.44)):1-ease(seg(u,.54,.8)),wy=lerp(HI,LO,lv);
  const bot=x=>x<200?lerp(290,700,(x-100)/100):x<860?700:lerp(700,290,(x-860)/100);
  ctx.beginPath();ctx.moveTo(100,wy);ctx.lineTo(960,wy);ctx.lineTo(960,760);ctx.lineTo(100,760);ctx.closePath();ctx.fillStyle='rgba(88,184,208,.35)';ctx.fill();
  ctx.beginPath();ctx.moveTo(90,290);for(let x=100;x<=960;x+=10)ctx.lineTo(x,Math.max(290,Math.min(700,bot(x))));ctx.lineTo(970,290);ctx.lineTo(970,770);ctx.lineTo(90,770);ctx.closePath();ctx.fillStyle='#6b5a45';ctx.fill();
  ctx.setLineDash([6,5]);ln([200,HI,860,HI],'rgba(255,255,255,.5)',1.5);ln([200,LO,860,LO],'rgba(255,255,255,.5)',1.5);ctx.setLineDash([]);
  wt(210,HI-10,'高水位',16,'rgba(227,236,238,.8)',600);wt(210,LO-10,'低水位',16,'rgba(227,236,238,.8)',600);
  ln([200,wy,860,wy],'rgba(255,255,255,.7)',1.5);
  for(let x=380;x<=680;x+=50)miniFloat(x,wy+Math.sin(TT*1.6+x*.03),44);
  [[360,250],[700,810]].forEach(([p,xa])=>{box(xa-16,684,32,16,'#8d9296');const sx=lerp(p,xa,.55),sy=lerp(wy+6,684,.55);
   ln([p,wy+6,sx,sy],'#e6d9a8',2);spring(sx,sy,xa,684,12);});
  const d=Math.abs(lv)*3;
  alphaDo(seg(u,.3,.38)*(1-seg(u,.5,.54)),()=>tag(620,630,'彈性元件伸長',{size:16,bg:E_Y,fg:'#13232e'}));
  alphaDo(seg(u,.56,.62),()=>tag(620,630,'彈性元件收回',{size:16,bg:E_Y,fg:'#13232e'}));
  /* 水位尺 */
  ln([900,HI,900,LO],'rgba(255,255,255,.6)',2);ln([888,HI,912,HI],'#fff',2);ln([888,LO,912,LO],'#fff',2);
  circ(900,wy,7,E_Y);wt(900,HI-30,trf('水位差 {n} m',{n:d.toFixed(1)}),18,E_Y,700,'center',COND);
  /* 右：設計對策 */
  card(1040,160,500,640,{bg:'rgba(7,27,39,.75)'});wt(1064,200,'設計對策',20,'#f2c230',700);
  const IT=[['繫纜預留長度','跟得上最高與最低水位'],['串接彈性元件','吸收水位與波浪的變化'],['可收放或配重式繫纜','水位差約 3 m 以上時採用'],['避開淺水區','低水位時浮體不擱淺']];
  IT.forEach(([a,b],i)=>{const k=seg(u,.2+i*.16,.26+i*.16),y=270+i*130;alphaDo(.25+.75*k,()=>{
   tag(1064,y,String(i+1),{size:17,bg:k>.5?E_Y:'rgba(255,255,255,.25)',fg:k>.5?'#13232e':'#fff'});
   wt(1110,y+7,a,19,'#fff',700);wt(1110,y+43,b,16,'rgba(227,236,238,.8)',500);});});
 }},

{t:'抗風與颱風',en:'Standing up to wind and typhoons',dur:13,
 d:'水面開闊、沒有遮擋，風速通常比陸地大，颱風季更是設計的關鍵。浮動式模組的傾角多在 5 到 12 度，比地面型低，迎風面積小，作用在浮台與繫纜上的風力也隨之下降。大型案場會把陣列切成數個島塊，島塊之間留出間隙，避免力量一路累積到單一繫點；迎風側的錨碇點加密，颱風來臨前再逐一檢查繫纜、插銷與螺栓。',
 s:[[0,'水面開闊，風速通常比陸地更大'],[.26,'傾角壓低到 5–12 度，迎風面積變小'],[.52,'陣列切成島塊，力量不會集中在一處'],[.76,'迎風側加密錨碇，颱風前逐一檢查']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'傾角與風力（示意）',20,'#f2c230',700);
  const R=[[340,'地面型 約 20°',20,1],[600,'浮動式 5–12°',10,.5]];
  R.forEach(([y,t,ang,f],i)=>{const k=seg(u,.2+i*.1,.3+i*.1);
   alphaDo(.3+.7*(i?k:1),()=>{wt(84,y-80,t,18,i?E_G:'#fff',700);
    ctx.save();ctx.translate(420,y);ctx.rotate(-ang*DEG);box(-150,-10,300,10,'#1f3f66');box(-150,-10,300,2,'#9fc3e6');ctx.restore();
    ln([290,y+50,550,y+50],'rgba(255,255,255,.3)',2);
    for(let j=0;j<4;j++){const o=(TT*140+j*40)%160;alphaDo(Math.min(1,(160-o)/60),()=>arrow(110+o*.6,y-30+j*18,180+o*.6,y-30+j*18,'rgba(125,200,220,.9)',2));}
    const L=260*f*(i?k:1);box(420,y+80,L,20,i?E_G:'#ff8a60');wt(410,y+97,'相對風力',16,'rgba(227,236,238,.8)',600,'right');});});
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'俯視：島塊與錨碇（示意）',20,'#f2c230',700);
  const isl=ease(seg(u,.5,.62)),gap=24*isl,X0=960,Y0=300,W=420,H=300;
  for(let r=0;r<2;r++)for(let c=0;c<3;c++){const w=(W-2*gap)/3,h=(H-gap)/2,x=X0+c*(w+gap),y=Y0+r*(h+gap);box(x,y,w,h,'rgba(31,63,102,.92)','rgba(160,200,240,.5)',1);
   ctx.strokeStyle='rgba(160,200,240,.25)';ctx.lineWidth=1;ctx.beginPath();for(let yy=y+14;yy<y+h;yy+=14){ctx.moveTo(x,yy);ctx.lineTo(x+w,yy);}ctx.stroke();}
  const an=seg(u,.72,.8);
  for(let i=0;i<5;i++){const y=Y0+20+i*(H-40)/4;ln([X0,y,X0-80,y],E_W,2);box(X0-92,y-6,12,12,E_W);}
  alphaDo(an,()=>{for(let i=0;i<4;i++){const y=Y0+50+i*(H-100)/3;ln([X0,y,X0-110,y+(i<2?-16:16)],E_W,2);box(X0-122,y+(i<2?-22:10),12,12,E_W);}});
  [[X0+W,Y0+60],[X0+W,Y0+H-60]].forEach(([x,y])=>{ln([x,y,x+60,y],'#e6d9a8',2);box(x+60,y-6,12,12,'#8d9296');});
  for(let j=0;j<3;j++){const o=(TT*100+j*50)%120;arrow(836+o*.5,Y0+80+j*70,876+o*.5,Y0+80+j*70,'rgba(125,200,220,.9)',2.5);}
  wt(846,Y0+H+44,'迎風側',17,'#ff9d7a',700);
  alphaDo(seg(u,.52,.6),()=>wt(X0+W/2,Y0+H+44,'島塊之間留間隙',17,'#fff',600,'center'));
  alphaDo(seg(u,.8,.88),()=>{card(824,700,692,80,{bg:'rgba(232,87,42,.12)',st:'rgba(232,87,42,.5)'});
   wt(848,748,'颱風前：檢查繫纜、插銷與螺栓',19,'#fff',700);});
 }},

{t:'水面帶來的冷卻',en:'Cooling from the water',dur:13,
 d:'太陽電池的溫度越高，發電效率越低。典型矽晶模組的溫度係數約每度 −0.35%，也就是溫度每降低 1 °C，發電約多 0.35%。水面的蒸發與較涼的空氣能讓模組降溫，示例中午間溫度比地面型低約 6 °C，發電約可多 2%。對水體來說，模組遮蔭可減少蒸發、抑制藻類增生；阿公店水庫運轉一年的監測顯示水質沒有異常，但仍需持續監測溶氧與水溫。',
 s:[[0,'白天模組受熱，溫度越高發電越少'],[.3,'水面上的模組，午間溫度較低'],[.55,'溫度低 6 °C，發電約可多 2%'],[.76,'遮蔭減少蒸發，水質仍需持續監測']],
 draw(u){
  diagBG();
  card(60,160,880,640,{bg:'rgba(7,27,39,.75)'});
  const c=chartBox(90,180,820,590,{title:'模組溫度（示例：晴天）',x0:6,x1:18,y0:20,y1:70,xt:[6,9,12,15,18],yt:[20,30,40,50,60,70],xl:'時',yl:'°C'});
  const T=(h,a,b)=>a+b*Math.pow(Math.max(0,Math.sin((h-6)/12*Math.PI)),1.3);
  const draw1=(a,b,col,f)=>{ctx.beginPath();for(let h=6;h<=6+12*f;h+=.1){const x=c.X(h),y=c.Y(T(h,a,b));h===6?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=3.5;ctx.stroke();};
  const f1=ease(seg(u,.04,.3)),f2=ease(seg(u,.3,.54));
  draw1(28,34,'#ff8a60',f1);if(f2>0)draw1(27,29,'#7dc8dc',f2);
  alphaDo(seg(u,.2,.3),()=>{wt(c.X(8.2),c.Y(53),'地面型',17,'#ff9d7a',700,'center');});
  alphaDo(seg(u,.46,.54),()=>{wt(c.X(15.8),c.Y(33),'水面型',17,'#7dc8dc',700,'center');
   arrow(c.X(12),c.Y(62)+4,c.X(12),c.Y(56)-4,E_Y,2.5);wt(c.X(12)-12,c.Y(59)+6,'約 6 °C',17,E_Y,700,'right',COND);});
  card(980,160,560,300,{bg:'rgba(7,27,39,.75)'});wt(1004,200,'溫度與發電（示例）',20,'#f2c230',700);
  const k=seg(u,.54,.62);
  alphaDo(.3+.7*k,()=>{wt(1004,262,'溫度係數',18,'#fff',600);wt(1516,262,'−0.35 %/°C',22,'#fff',700,'right',COND);
   wt(1004,310,'午間溫差',18,'#fff',600);wt(1516,310,'6 °C',22,'#fff',700,'right',COND);
   ln([1004,336,1516,336],'rgba(255,255,255,.25)',1.5);
   wt(1004,388,'發電約可多',19,'#fff',700);wt(1516,392,trf('{n} %',{n:(2.1*ease(seg(u,.58,.7))).toFixed(1)}),34,E_G,700,'right',COND);
   wt(1004,430,'6 × 0.35 ≈ 2.1',16,'rgba(227,236,238,.75)',600,'left',COND);});
  card(980,490,560,310,{bg:'rgba(7,27,39,.75)'});wt(1004,530,'對水體的影響',20,'#f2c230',700);
  const IT=[['遮蔭減少水分蒸發','g'],['抑制藻類增生','g'],['持續監測溶氧與水溫','w']];
  IT.forEach(([t,s],i)=>{const kk=seg(u,.74+i*.05,.8+i*.05),y=592+i*62;alphaDo(kk,()=>{circ(1022,y-6,9,s==='g'?E_G:E_Y);wt(1046,y,t,19,'#fff',600);});});
  alphaDo(seg(u,.9,.95),()=>wt(1004,778,'阿公店水庫：運轉一年水質無異常',16,'rgba(227,236,238,.85)',500));
 }},

{t:'水庫、滯洪池與近岸水域',en:'Reservoirs, detention ponds and coastal waters',dur:13,
 d:'台灣的水面型光電主要出現在三類場址。水庫以供水為優先，阿公店水庫是全台第一座水庫水面型光電，2019 年全數併聯 9.99 MW。滯洪池平時水淺，大雨時要保留滯洪容量，錨碇必須適應劇烈的水位變化。彰濱工業區崙尾東的近岸水域則設置了 181 MW、約 176 公頃的大型案場，要面對潮汐、東北季風與颱風。無論哪一種，原本的水利功能都要優先。',
 s:[[0,'水面型光電在台灣主要有三類場址'],[.26,'水庫：以供水為優先，兼顧水質'],[.5,'滯洪池：保留滯洪容量，適應水位變化'],[.74,'近岸水域：面對潮汐、季風與颱風']],
 draw(u){
  diagBG();
  const a1=seg(u,.2,.3),a2=seg(u,.44,.54),a3=seg(u,.68,.78);
  const C=[[60,a1,'水庫'],[570,a2,'滯洪池'],[1080,a3,'近岸水域']];
  C.forEach(([x,a,t])=>{alphaDo(.35+.65*a,()=>{card(x,160,460,560,{bg:'rgba(7,27,39,.75)',st:a>.5?'rgba(242,194,48,.6)':'rgba(255,255,255,.16)'});wt(x+24,200,t,20,'#f2c230',700);});});
  const pic=(x,a,fn)=>alphaDo(.35+.65*a,()=>{ctx.save();ctx.beginPath();ctx.rect(x+20,230,420,190);ctx.clip();fn();ctx.restore();});
  pic(60,a1,()=>{box(80,230,420,190,'#9cc6df');poly([80,300,200,250,330,290,500,260,500,420,80,420],'#7f9c73');box(80,330,330,90,'#4f9ab0');poly([410,300,450,300,470,420,400,420],'#b0b6b8');
   for(let x=120;x<=360;x+=34)miniFloat(x,334+Math.sin(TT*1.6+x*.03),28);});
  pic(570,a2,()=>{box(590,230,420,190,'#9cc6df');box(590,330,420,90,'#7a9a55');const wy=360+12*Math.sin(TT*.8);poly([620,340,980,340,950,412,650,412],'#6b5a45');
   box(636,wy,328,412-wy,'#4f9ab0');for(let x=670;x<=930;x+=34)miniFloat(x,wy+Math.sin(TT*1.6+x*.03),28);box(980,340,24,50,'#8d9296');});
  pic(1080,a3,()=>{box(1100,230,420,190,'#9cc6df');const sw=x=>350+5*Math.sin(x*.04-TT*1.4);ctx.beginPath();ctx.moveTo(1100,sw(1100));for(let x=1100;x<=1520;x+=6)ctx.lineTo(x,sw(x));ctx.lineTo(1520,420);ctx.lineTo(1100,420);ctx.closePath();ctx.fillStyle='#3b93bb';ctx.fill();
   box(1460,300,60,120,'#b0b6b8');for(let x=1130;x<=1430;x+=34)miniFloat(x,sw(x),28);for(let j=0;j<2;j++){const o=(TT*80+j*60)%120;arrow(1110+o,270+j*22,1150+o,270+j*22,'rgba(255,255,255,.8)',2);}});
  const T=[[60,a1,['阿公店水庫 9.99 MW','全台第一座水庫水面型光電','2019 年全數併聯'],'需兼顧供水與水質'],
   [570,a2,['屏東、台南等地滯洪池','水位隨降雨大幅變化','保留原本的滯洪容量'],'錨碇需適應水位差'],
   [1080,a3,['彰濱崙尾東 181 MW','約 176 公頃、57 萬片模組','首年預估約 2.5 億度'],'面對潮汐、季風與颱風']];
  T.forEach(([x,a,L,g])=>alphaDo(.35+.65*a,()=>{L.forEach((t,i)=>wt(x+24,478+i*40,t,i?17:19,i?'#fff':E_G,i?500:700));wt(x+24,680,g,16,'rgba(227,236,238,.75)',500);}));
  alphaDo(seg(u,.86,.92),()=>{card(60,740,1480,60,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});wt(800,778,'共同原則：原本的水利功能優先，光電是附加的價值',19,'#fff',700,'center');});
 }}
]};
