// KITS: marine
/* ================= EP29 葉片巡檢與缺陷分級 ================= */
const A29=Math.PI/2; // rotor locked in Y position: one blade pointing straight down
/* complete fixed-bottom turbine at cx (monopile + TP + tower + nacelle + rotor) */
function turb29(cx,ang){
  const yb=bedY(cx)+130;drawPile(cx,yb,Math.PI/2,yb-PILE_TOP,PILE_W);drawTP(cx,TP_BOT);
  for(let k=0;k<3;k++)drawTowerSec(cx,TP_TOP-k*HS,k);
  drawNacelle(cx,TW_TOP,0,true);drawRotor(cx-44,TW_TOP-20,ang,3);
}
function far29(x,s,ang){const h=150*s,hx=x,hy=SEA-h;ln([x,SEA,x,hy],'rgba(235,240,243,.85)',3*s);
  for(let i=0;i<3;i++){const a=ang-i*TAU/3;ln([hx,hy,hx+Math.cos(a)*70*s,hy+Math.sin(a)*70*s],'rgba(245,247,248,.9)',2.2*s);}circ(hx,hy,3*s,'#eef2f4');}
/* text wrapped to a width (after translation) */
function wrap29(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
function drone29(x,y,s){
  s=s||1;const spin=TT*40;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  box(-9,-3,18,6,'#2b3137');ln([-16,-6,16,-6],'#2b3137',1.6);
  for(const k of [-1,1]){ctx.beginPath();ctx.ellipse(k*16,-8,10*Math.abs(Math.cos(spin+k)),1.6,0,0,TAU);ctx.fillStyle='rgba(40,50,60,.55)';ctx.fill();}
  circ(0,5,3,'#394650');circ(6,-3,1.4,Math.sin(TT*8)>0?'#7dffc4':'#2a6d56');ctx.restore();
}
/* rotor angle in shot 1: decelerates to the locked Y position */
const ang29=u=>A29-6*Math.pow(1-seg(u,0,.4),2);
/* airfoil (leading edge at x, chord c) */
function thk29(s,t){return 5*t*(.2969*Math.sqrt(s)-.126*s-.3516*s*s+.2843*s*s*s-.1015*s*s*s*s);}
function foil29(x,y,c,t){const P=[];for(let i=0;i<=40;i++){const s=Math.pow(i/40,2);P.push([x+s*c,y-thk29(s,t)*c]);}
  for(let i=40;i>=0;i--){const s=Math.pow(i/40,2);P.push([x+s*c,y+thk29(s,t)*c*.55]);}return P;}
/* blade planform half-height at fraction s from root (0) to tip (1) */
const plan29=s=>s<.22?lerp(.55,1,Math.sin(s/.22*Math.PI/2)):lerp(1,.08,Math.pow((s-.22)/.78,.85));
function bladePlan(x0,x1,yc,H,col,st){
  const P=[];for(let i=0;i<=40;i++){const s=i/40;P.push(x0+s*(x1-x0),yc-plan29(s)*H*.42);}
  for(let i=40;i>=0;i--){const s=i/40;P.push(x0+s*(x1-x0),yc+plan29(s)*H*.58);}
  poly(P,col,st,1.4);
}
/* severity colours (grade 1–5) */
const SEV=['#7dffc4','#7dc8dc','#f2c230','#ff9d7a','#e8572a'];
/* tiles in shot 3: [defect type, grade, label] */
const TILE29=[['le',3,'前緣侵蝕'],['dirt',0,'污漬（排除）'],['burn',4,'雷擊燒痕'],['crack',4,'後緣裂紋'],['ok',0,'無異常'],['peel',2,'塗層剝落']];
function tile29(x,y,w,h,k,i){
  card(x,y,w,h,{bg:'#4f7d98',r:4,st:'rgba(255,255,255,.3)'});
  ctx.save();rrp(x,y,w,h,4);ctx.clip();
  const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'#7fb0cc');g.addColorStop(1,'#a9cbdc');box(x,y,w,h,g);
  const r=rng(30+i);const yt=y+h*.28+r()*20,yb=y+h*.78;
  poly([x,yt,x+w,yt+14,x+w,yb+8,x,yb],'#eef2f4');ln([x,yt,x+w,yt+14],'rgba(60,80,95,.5)',1.2);
  const cx=x+w*.5;
  if(k==='le')for(let j=0;j<18;j++)circ(x+20+r()*(w-40),yt+3+r()*10,1.5+r()*3,'#8a99a3');
  if(k==='dirt')for(let j=0;j<5;j++)circ(cx-30+r()*60,yt+40+r()*30,6+r()*8,'rgba(120,110,90,.35)');
  if(k==='burn'){circ(cx,yt+38,13,'#2b2622');circ(cx,yt+38,20,'rgba(60,50,45,.35)');circ(cx+4,yt+36,4,'#7a6a5c');}
  if(k==='crack'){ln([x+30,yb-4,x+70,yb-14,x+110,yb-10,x+150,yb-22,x+190,yb-18],'#394650',2);}
  if(k==='peel'){poly([cx-34,yt+30,cx+10,yt+24,cx+30,yt+44,cx-6,yt+62,cx-40,yt+52],'#b8c3c9');ln([cx-34,yt+30,cx+10,yt+24,cx+30,yt+44],'#8a99a3',1);}
  ctx.restore();
}
/* crawler robot inside the blade (shot 4) */
function crawler29(x,y,lit){
  if(lit>0)alphaDo(lit,()=>{const g=ctx.createLinearGradient(x,0,x+200,0);g.addColorStop(0,'rgba(255,240,180,.45)');g.addColorStop(1,'rgba(255,240,180,0)');poly([x+18,y-18,x+200,y-60,x+200,y+30,x+18,y-4],g);});
  box(x-24,y-6,48,10,'#222');for(let i=0;i<5;i++)circ(x-19+i*9.5,y-1,3.4,'#555');
  box(x-20,y-20,40,15,'#f2c230');box(x-4,y-36,4,16,'#394650');circ(x-2,y-40,6,'#2b3137');circ(x+1,y-40,2.2,'#7dffc4');
  box(x+14,y-17,8,8,'#fff');
  const a=TT*4;ln([x-2,y-40,x-2+Math.cos(a)*30,y-40+Math.sin(a)*30],'rgba(125,255,196,.6)',1.4);
}
/* lightning bolt from p to q */
function bolt29(x0,y0,x1,y1,a){if(a<=0)return;const r=rng(Math.floor(TT*8)),P=[x0,y0];
  for(let i=1;i<8;i++){const t=i/8;P.push(lerp(x0,x1,t)+(r()-.5)*40,lerp(y0,y1,t));}P.push(x1,y1);
  alphaDo(a,()=>{ln(P,'rgba(255,240,170,.35)',9);ln(P,'#fff6c8',3);});}

const EP={no:29,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'葉片巡檢與缺陷分級',en:'Blade inspection and damage grading',
lede:'離岸風機的葉片長達百公尺，每年都要仔細檢查一次。這一集看無人機如何沿著自動航線拍下每支葉片、軟體怎麼從上千張照片中找出缺陷，再跟著爬行機器人進到葉片內部，認識雷擊與裂紋的樣子，最後把缺陷分成 5 級，決定繼續運轉、排程修補還是立即停機。',
facts:[['5','級','葉片缺陷常用的嚴重度分級，從外觀瑕疵到危急'],['4','趟','每支葉片的典型拍攝航線：前緣、後緣與兩側葉面'],['30','分鐘內','自動航線無人機巡檢一部風機的典型時間'],['約 1','mm/像素','近拍影像的典型解析度，可看出細小裂紋'],['約 90','%','內部爬行機器人可檢視的葉片內部範圍（設備商資料）'],['1–12','個月','第 4–5 級缺陷應完成修補或停機的期限（典型）']],
note:'說明：本集為教育用途示意動畫，尺寸與距離經過壓縮。航線趟數、拍攝距離、巡檢時間與影像解析度取自無人機服務商公開資料的典型值；爬行機器人的檢視範圍取自設備商說明；防雷系統檢查依 IEC 61400-24 的原則示意，電阻讀數為示例；缺陷 5 級分類參考 EPRI 與 IEA Wind Task 46 的架構，各級處理期限為典型範例，實際依風機製造商與業主的規範而定。照片張數與缺陷數量為示例，不代表特定風場。',
shots:[
/* 1 */{t:'巡檢日：停機、鎖定、起飛',en:'Inspection day',dur:13,side:true,
 d:'葉片巡檢通常每年至少一次，也會在雷擊或異常振動後加做。人員運輸船（CTV）載著無人機小組抵達風機，風機先停機、轉子轉到「Y 字」位置並鎖定，讓一支葉片垂直朝下，另外兩支對稱朝上，無人機才能沿著固定航線逐支拍攝。現今台灣離岸風機的葉片長約 80 到 110 公尺，以往需要繩索技術人員垂降檢查一整天，改用無人機後，大幅縮短停機時間。',
 s:[[0,'巡檢日，人員運輸船載著無人機小組抵達風機'],[.28,'風機停機，轉子轉到 Y 字位置並鎖定'],[.52,'無人機從船上起飛，飛向輪轂'],[.76,'一支葉片朝下，另外兩支對稱朝上，方便沿線拍攝']],
 base:()=>{drawSky();drawWaterBack();drawSoil();},
 cam:u=>camMix({x:800,y:420,s:1},{x:660,y:330,s:1.5},ease(seg(u,.3,.62))),
 draw(u){
  for(const [x,s,p] of [[180,.55,.4],[960,.45,1.7],[1150,.4,2.6]])far29(x,s,TT*.9+p);
  turb29(TX,ang29(u));
  const cx=lerp(1080,TX+100,ease(seg(u,0,.3)));
  const wl=vsl(cx,77,true,{tilt:.8},vCTV);
  if(u<.3)alphaDo(.7,()=>{for(let i=0;i<5;i++){const k=(TT*2+i/5)%1;ln([cx+4+k*80,wl+2+i*.6,cx+24+k*80,wl+2+i*.6],`rgba(255,255,255,${.8*(1-k)})`,1.4);}});
  const D=kf(u,[[0,cx+40,wl-16],[.5,cx+40,wl-16],[.66,cx+20,HUB.y+150],[.82,HUB.x+60,HUB.y+40],[1,HUB.x+40,HUB.y+90]]);
  if(u>.35)drone29(D.x,D.y);
  if(u>.42)alphaDo(seg(u,.42,.48),()=>{ring(HUB.x,HUB.y,15,'#f2c230',2.4);});
  lab(cx+30,wl-20,'人員運輸船（CTV）',{dx:60,dy:-50,a:band(u,.06,.36)});
  lab(HUB.x,HUB.y,'轉子減速停機',{dx:-90,dy:-40,a:band(u,.12,.4)});
  lab(HUB.x,HUB.y,'轉子鎖定（Y 字位置）',{dx:-100,dy:-40,a:band(u,.44,.74),st:'s'});
  lab(D.x,D.y,'巡檢無人機',{dx:70,dy:-30,a:band(u,.52,1),st:'s'});
  lab(HUB.x-3,HUB.y+BR*.6,'葉片長約 80–110 m',{dx:-110,dy:0,a:band(u,.76,1)});
 },
 hud(u){hudPanel(230,150,'巡檢準備（示例）',seg(u,.04,.1),w=>{const k=1-seg(u,0,.4);
  hrow(52,'風速','7 m/s',w);
  hrow(78,'轉子轉速',(10*k).toFixed(1)+' rpm',w,'#f2c230');hbar(14,86,w-28,k,'#f2c230');
  hrow(118,'轉子',u<.4?'減速中':'已鎖定',w,u<.4?'#ff9d7a':'#7dffc4');
  hrow(142,'無人機',u<.5?'待命':'飛行中',w,u<.5?'rgba(227,236,238,.8)':'#7dffc4');});}},
/* 2 */{t:'自動航線：每支葉片拍四趟',en:'Automated flight paths',dur:14,
 d:'無人機依葉片的位置與長度自動規劃航線，以衛星定位與雷射測距和葉片保持約 3 到 4 公尺的固定距離。每支葉片通常拍四趟：前緣、後緣、迎風的壓力面與背風的吸力面，相鄰照片互相重疊，才能拼出完整的葉片表面。近拍解析度約每像素 1 毫米，看得出細小裂紋。每支葉片約需 5 到 10 分鐘，整部風機可在 30 分鐘內完成（典型）。',
 s:[[0,'航線依葉片位置自動規劃，與葉片保持固定距離'],[.28,'每支葉片拍四趟：前緣、後緣與兩側葉面'],[.56,'近拍解析度約每像素 1 毫米，看得出細小裂紋'],[.78,'每支葉片約 5–10 分鐘，整部風機 30 分鐘內完成']],
 draw(u){
  diagBG();
  card(60,150,760,650,{bg:'rgba(7,27,39,.78)'});wt(84,190,'自動航線（示意）',21,'#fff',700);
  const RC={x:440,y:400},R=205;
  ln([RC.x,RC.y,RC.x,790],'rgba(200,210,215,.55)',16);
  for(let i=0;i<3;i++)drawBlade(RC.x,RC.y,A29-i*TAU/3,R,'#eef2f4');circ(RC.x,RC.y,11,'#f2f5f6');
  // flight path: 4 passes per blade (two offsets each side)
  const P=[];
  for(let i=0;i<3;i++){const a=A29-i*TAU/3,d={x:Math.cos(a),y:Math.sin(a)},n={x:-d.y,y:d.x};
   const pt=(s,o)=>({x:RC.x+d.x*s+n.x*o,y:RC.y+d.y*s+n.y*o});
   P.push(pt(40,30),pt(R+14,30),pt(R+14,-30),pt(40,-30),pt(40,-52),pt(R+28,-52),pt(R+28,52),pt(40,52));}
  const f=ease(seg(u,.06,.92)),Q=partial(P,f);
  ctx.setLineDash([6,5]);pathLine(Q,'rgba(125,255,196,.85)',2);ctx.setLineDash([]);
  const e=Q[Q.length-1];drone29(e.x,e.y,.9);
  alphaDo(seg(u,.1,.16),()=>{wt(84,770,'與葉片保持約 3–4 m 的固定距離',16,'rgba(227,236,238,.85)',500);});
  // right: four views around the section
  card(860,150,680,650,{bg:'rgba(7,27,39,.78)'});wt(884,190,'每支葉片拍四趟',21,'#fff',700);
  const LX=1060,LY=380,CH=300,FP=foil29(LX,LY,CH,.2);poly(FP.flat(),'#eef2f4','rgba(60,80,95,.6)',1);
  const V=[['前緣',LX-80,LY-2,LX+2,LY,'right'],['後緣',LX+CH+80,LY+2,LX+CH-2,LY+1,'left'],['吸力面',LX+CH*.35,LY-110,LX+CH*.35,LY-thk29(.35,.2)*CH,'center'],['壓力面',LX+CH*.35,LY+100,LX+CH*.35,LY+thk29(.35,.2)*CH*.55,'center']];
  V.forEach((v,i)=>{const a=seg(u,.28+i*.06,.32+i*.06);if(a<=0)return;alphaDo(a,()=>{
   const on=u<.28+(i+1)*.06+.04;
   const dx=v[3]-v[1],dy=v[4]-v[2],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L;
   poly([v[1],v[2],v[3]+nx*28,v[4]+ny*28,v[3]-nx*28,v[4]-ny*28],on?'rgba(125,255,196,.32)':'rgba(125,255,196,.12)');
   drone29(v[1],v[2],.9);
   const ty=i===2?v[2]-24:i===3?v[2]+40:v[2]+46;
   wt(i<2?v[1]:v[1],ty,v[0],18,on?'#f2c230':'#fff',700,'center');});});
  alphaDo(seg(u,.18,.24),()=>wt(LX+CH/2,LY+thk29(.5,.2)*CH*.55+16,'葉片剖面',14,'rgba(227,236,238,.7)',500,'center'));
  const ST=[['影像解析度','約 1 mm/像素',.56],['每支葉片','約 5–10 分鐘',.78],['整部風機','30 分鐘內',.82]];
  ST.forEach((s,i)=>{const a=seg(u,s[2],s[2]+.05);alphaDo(a,()=>{const y=596+i*64;
   box(884,y,632,1,'rgba(255,255,255,.14)');wt(884,y+42,s[0],18,'rgba(227,236,238,.85)',600);wt(1516,y+44,s[1],30,i?'#7dffc4':'#f2c230',700,'right',COND);});});
 }},
/* 3 */{t:'從上千張照片找出缺陷',en:'Finding defects in the images',dur:13,
 d:'一部風機的巡檢會留下數百到上千張照片。影像先依葉片編號與位置自動排序、拼接，再由軟體逐張比對，框出可能的缺陷：前緣侵蝕、塗層剝落、雷擊燒痕、裂紋等。軟體也會誤把污漬、鳥糞當成缺陷，所以最後由葉片工程師逐一確認，記下每處缺陷的葉片編號、距葉根距離、所在面別與尺寸，並和歷年的照片比對，看它是否正在擴大。',
 s:[[0,'照片依葉片編號與位置排序，拼成完整的葉片表面'],[.25,'軟體逐張比對，框出可能的缺陷'],[.5,'污漬與鳥糞會被誤判，由工程師逐一確認'],[.74,'每處缺陷記下位置與尺寸，和歷年照片比對']],
 draw(u){
  diagBG();
  const TW=232,TH=196,G=17;
  TILE29.forEach((t,i)=>{const x=60+i*(TW+G),y=160,a=seg(u,.02+i*.03,.06+i*.03);if(a<=0)return;alphaDo(a,()=>{
   tile29(x,y,TW,TH,t[0],i);wt(x+10,y+22,trf('葉片 {b}－{n} m',{b:'B',n:12+i*14}),14,'#13232e',700);
   const sc=60+ease(seg(u,.24,.5))*1480,hit=sc>x+TW*.5;
   if(hit&&t[0]!=='ok'){const real=t[1]>0&&!(t[0]==='dirt');const col=t[0]==='dirt'?(u>.52?'rgba(227,236,238,.6)':'#f2c230'):SEV[t[1]-1];
    ctx.setLineDash(t[0]==='dirt'&&u>.52?[5,4]:[]);ctx.strokeStyle=col;ctx.lineWidth=2.4;ctx.strokeRect(x+40,y+60,TW-80,TH-90);ctx.setLineDash([]);
    if(t[0]!=='dirt'||u>.52)wt(x+TW/2,y+TH+30,t[2],17,t[0]==='dirt'?'rgba(227,236,238,.75)':col,700,'center');}
   if(hit&&t[0]==='ok')wt(x+TW/2,y+TH+30,t[2],17,'rgba(227,236,238,.6)',600,'center');});});
  const sc=60+ease(seg(u,.24,.5))*1480;
  if(u>.24&&u<.52)alphaDo(.8,()=>{ln([sc,152,sc,364],'#7dffc4',2.4);});
  // blade map
  const a2=seg(u,.6,.66);if(a2>0)alphaDo(a2,()=>{
   card(60,430,1060,370,{bg:'rgba(7,27,39,.8)'});wt(84,470,'缺陷位置圖（葉片 B，示例）',19,'#f2c230',700);
   const X0=150,X1=1060,YC=600;bladePlan(X0,X1,YC,150,'#eef2f4','rgba(60,80,95,.6)');
   wt(X0-8,YC+6,'葉根',15,'rgba(227,236,238,.8)',600,'right');wt(X1+8,YC+6,'葉尖',15,'rgba(227,236,238,.8)',600,'left');
   for(let m=0;m<=100;m+=20){const x=lerp(X0,X1,m/100);ln([x,700,x,708],'rgba(255,255,255,.5)',1.2);wt(x,730,String(m),15,'rgba(227,236,238,.75)',600,'center',COND);}
   wt(X1,762,'距葉根距離（m）',15,'rgba(227,236,238,.75)',500,'right');
   const MK=[[.88,-1,3],[.7,0,4],[.46,1,4],[.32,-.3,2],[.95,-1,2]];
   MK.forEach((m,i)=>{const b=seg(u,.66+i*.03,.7+i*.03);if(b<=0)return;const x=lerp(X0,X1,m[0]),hh=plan29(m[0])*150,y=YC+m[1]*(m[1]<0?hh*.42:hh*.58)*.8;
    alphaDo(b,()=>{circ(x,y,9,SEV[m[2]-1],'#0e2a3b',2);wt(x,y-16,String(m[2]),15,SEV[m[2]-1],700,'center',COND);});});});
  // funnel counts
  const a3=seg(u,.3,.36);if(a3>0)alphaDo(a3,()=>{card(1160,430,380,370,{bg:'rgba(7,27,39,.8)'});wt(1184,470,'一部風機的巡檢（示例）',18,'#fff',700);
   const F=[['照片',Math.round(1200*ease(seg(u,.3,.42))),'#58b8d0',.3],['疑似缺陷',Math.round(46*ease(seg(u,.42,.5))),'#f2c230',.42],['確認缺陷',Math.round(12*ease(seg(u,.54,.62))),'#ff9d7a',.54]];
   F.forEach((f,i)=>{const b=seg(u,f[3],f[3]+.04);if(b<=0)return;const y=510+i*96;alphaDo(b,()=>{
    box(1184,y,230*(1-i*.25),56,f[2]);wt(1198,y+36,f[0],17,'#0e2a3b',700);wt(1516,y+42,String(f[1]),34,f[2],700,'right',COND);});});});
 }},
/* 4 */{t:'進到葉片裡面：爬行機器人',en:'Inside the blade: crawler robots',dur:13,
 d:'無人機只看得到外表，葉片內部的黏著線與腹板則要從葉根人孔進去檢查。葉片由上下兩片殼體黏合而成，中間以腹板支撐，主樑帽承受主要的彎曲力。人員能進入的空間有限，越往葉尖越窄，因此改由爬行機器人代勞：它拖著纜線前進，用 LED 補光、360 度攝影機與 3D 光達掃描，可檢視約九成的內部空間，找出黏著線脫膠、腹板裂紋與積水。',
 s:[[0,'葉片內部的黏著線與腹板，從外面看不到'],[.24,'爬行機器人從葉根人孔進入，拖著纜線前進'],[.5,'補光、攝影與 3D 光達掃描，找出黏著線脫膠'],[.76,'越往葉尖越窄，機器人可檢視約九成的內部空間']],
 draw(u){
  diagBG();
  const X0=110,X1=1520,YC=380,H=380,hU=s=>plan29(s)*H*.42,hL=s=>plan29(s)*H*.58,sx=x=>(x-X0)/(X1-X0);
  wt(X1,190,'葉片剖開示意（由葉根往葉尖）',18,'rgba(227,236,238,.8)',600,'right');
  // outer shell (cut-away)
  bladePlan(X0,X1,YC,H,'rgba(238,242,244,.16)','rgba(238,242,244,.85)');
  const P=[];for(let i=0;i<=40;i++){const s=i/40;P.push(X0+s*(X1-X0),YC-hU(s)*.86);}for(let i=40;i>=0;i--){const s=i/40;P.push(X0+s*(X1-X0),YC+hL(s)*.86);}poly(P,'rgba(14,32,45,.92)');
  // shear webs and spar cap band
  const web=k=>{const Q=[];for(let i=2;i<=38;i++){const s=i/40;Q.push(X0+s*(X1-X0),YC+k*plan29(s)*H*.12);}ln(Q,'rgba(242,194,48,.7)',3);};
  web(-1);web(1);
  // bondlines
  const bl=(k,f)=>{const Q=[];for(let i=1;i<=39;i++){const s=i/40;Q.push(X0+s*(X1-X0),YC+(k<0?-hU(s):hL(s))*f);}ctx.setLineDash([4,5]);ln(Q,'rgba(125,200,220,.7)',1.6);ctx.setLineDash([]);};
  bl(-1,.86);bl(1,.86);
  circ(X0+18,YC,26,'#0e2a3b','rgba(238,242,244,.85)',2);
  // crawler
  const cx=lerp(X0+30,X0+.62*(X1-X0),ease(seg(u,.22,.86))),cy=YC+plan29(sx(cx))*H*.08+4;
  ctx.setLineDash([3,4]);ln([X0+18,YC,cx-24,cy-2],'rgba(242,194,48,.8)',1.4);ctx.setLineDash([]);
  if(u>.2)crawler29(cx,cy,seg(u,.4,.48));
  // findings appear once the crawler passes
  const FD=[[.28,1,'後緣黏著線脫膠','w'],[.44,0,'腹板黏著裂紋','w'],[.16,1,'積水與碎屑','n']];
  FD.forEach(f=>{const x=X0+f[0]*(X1-X0);if(cx<x-60)return;const y=f[1]?YC+hL(f[0])*.86-4:YC-plan29(f[0])*H*.12;
   alphaDo(seg(u,.5,.56),()=>{ring(x,y,14,f[3]==='w'?'#e8572a':'#f2c230',2.4);wt(x,f[1]?y-24:y-28,f[2],16,f[3]==='w'?'#ff9d7a':'#f2c230',700,'center');});});
  alphaDo(band(u,.04,.36),()=>{wt(X0+.3*(X1-X0),YC-plan29(.3)*H*.12-16,'腹板',16,'#f2c230',700,'center');
   wt(X0+.72*(X1-X0),YC-hU(.72)*.86-14,'黏著線',16,'#7dc8dc',700,'center');wt(X0+18,YC+60,'葉根人孔',16,'#fff',700,'center');});
  // inset: cross-section
  alphaDo(seg(u,.06,.12),()=>{card(60,600,620,200,{bg:'rgba(7,27,39,.85)'});wt(84,636,'葉片剖面構造',18,'#fff',700);
   const LX=200,LY=720,CH=360,FP=foil29(LX,LY,CH,.22);poly(FP.flat(),'#eef2f4','rgba(60,80,95,.6)',1);
   const FI=foil29(LX+8,LY,CH-18,.18);poly(FI.flat(),'#163246');
   const w1=LX+CH*.24,w2=LX+CH*.46;
   box(w1-6,LY-thk29(.24,.22)*CH,w2-w1+12,8,'#2b3137');box(w1-6,LY+thk29(.24,.22)*CH*.55-8,w2-w1+12,8,'#2b3137');
   ln([w1,LY-thk29(.24,.22)*CH+6,w1,LY+thk29(.24,.22)*CH*.55-6],'#f2c230',3);ln([w2,LY-thk29(.46,.22)*CH+6,w2,LY+thk29(.46,.22)*CH*.55-6],'#f2c230',3);
   circ(LX+2,LY,4,'#7dc8dc');circ(LX+CH-2,LY,4,'#7dc8dc');
   wt(LX-14,LY+5,'前緣',14,'#7dc8dc',600,'right');wt(LX+CH+12,LY+5,'後緣',14,'#7dc8dc',600,'left');
   wt((w1+w2)/2,LY-thk29(.3,.22)*CH-10,'主樑帽',14,'rgba(227,236,238,.9)',600,'center');
   wt((w1+w2)/2+6,LY+thk29(.3,.22)*CH*.55+22,'腹板',14,'#f2c230',600,'center');});
  alphaDo(seg(u,.62,.68),()=>{card(720,600,820,200,{bg:'rgba(7,27,39,.85)'});wt(744,636,'爬行機器人',18,'#fff',700);
   const T=['LED 補光','360° 攝影機','3D 光達','拖纜供電與傳輸'];
   T.forEach((t,i)=>{const x=744+(i%2)*260,y=676+Math.floor(i/2)*36;circ(x+4,y-6,4,'#7dffc4');wt(x+18,y,t,16,'rgba(227,236,238,.9)',500);});
   wt(1516,700,'約 90%',40,'#7dffc4',700,'right',COND);wt(1516,736,'可檢視的內部範圍',15,'rgba(227,236,238,.8)',500,'right');});
 }},
/* 5 */{t:'雷擊點與裂紋辨識',en:'Lightning strikes and cracks',dur:14,
 d:'台灣海峽冬季也有雷擊，葉片是風機最高的部分，最容易被打中。葉尖附近裝有金屬接收器，雷電流經葉片內的引下線，再經機艙、塔架導入大地。巡檢時要找接收器周圍的燒痕，並以四線式低電阻量測確認接收器到葉根的導通，讀數超過製造商限值就代表引下線可能斷裂。裂紋則要分辨型態：後緣開裂、橫向裂紋與雷擊脫層，位置越靠近葉根與主樑越危險。',
 s:[[0,'葉片是風機最高的部分，雷擊多落在葉尖'],[.22,'雷電流經接收器與引下線，導入大地'],[.42,'以四線式低電阻量測，確認接收器到葉根的導通'],[.66,'裂紋要分辨型態，越靠近葉根與主樑越危險']],
 draw(u){
  diagBG();
  card(60,150,900,650,{bg:'rgba(7,27,39,.78)'});wt(84,190,'防雷系統（示意）',21,'#fff',700);
  const X0=150,X1=900,YC=330;bladePlan(X0,X1,YC,110,'#eef2f4','rgba(60,80,95,.6)');
  const RC=[[X1-8,YC],[X0+.72*(X1-X0),YC-plan29(.72)*110*.42],[X0+.5*(X1-X0),YC+plan29(.5)*110*.58]];
  // down conductor
  const cur=seg(u,.14,.4);
  ln([X1-8,YC,X0+20,YC],cur>0&&cur<1?'#f2c230':'#58b8d0',3);ln([RC[1][0],RC[1][1],RC[1][0],YC],'#58b8d0',2);ln([RC[2][0],RC[2][1],RC[2][0],YC],'#58b8d0',2);
  RC.forEach(p=>circ(p[0],p[1],5.5,'#c9d1d5','#394650',1.4));
  ln([X0+20,YC,X0-40,YC,X0-40,560],cur>0?'#f2c230':'#58b8d0',3);
  for(let i=0;i<3;i++)ln([X0-40-18+i*6,560+i*8,X0-40+18-i*6,560+i*8],'#58b8d0',2.4);
  if(cur>0&&cur<1)for(let i=0;i<6;i++){const k=(cur*3+i/6)%1,x=lerp(X1-8,X0-40,k);circ(x,YC,4,'#fff6c8');}
  bolt29(X1+30,160,X1-8,YC-4,band(u,.06,.16,.01));
  alphaDo(seg(u,.16,.2),()=>{circ(X1-14,YC-6,9,'rgba(43,38,34,.85)');});
  wt(X0-14,580,'經機艙、塔架入地',15,'rgba(227,236,238,.8)',600,'left');
  alphaDo(band(u,.08,.4),()=>{wt(X1-8,YC+52,'接收器',16,'#f2c230',700,'center');wt(X0+.32*(X1-X0),YC-10,'引下線',16,'#7dc8dc',700,'center');});
  alphaDo(seg(u,.16,.22),()=>wt(X1-20,YC-40,'燒痕',16,'#ff9d7a',700,'right'));
  // 4-wire measurement
  const m=seg(u,.42,.48);if(m>0)alphaDo(m,()=>{
   const MX=400,MY=480;card(MX,MY,340,150,{bg:'#13232e',st:'#7dffc4'});
   ln([MX+340,MY+40,X1-8,MY+40,X1-8,YC+8],'#e8572a',1.6);ln([MX+340,MY+56,X1-20,MY+56,X1-20,YC+8],'#58b8d0',1.6);
   ln([MX,MY+40,X0+30,MY+40,X0+30,YC+8],'#e8572a',1.6);ln([MX,MY+56,X0+44,MY+56,X0+44,YC+8],'#58b8d0',1.6);
   const r=Math.round(24*ease(seg(u,.48,.58)));
   wt(MX+170,MY+44,'低電阻計（四線式）',15,'rgba(227,236,238,.8)',600,'center');
   wt(MX+170,MY+112,trf('{n} mΩ',{n:r}),44,'#7dffc4',700,'center',COND);
   alphaDo(seg(u,.58,.62),()=>wt(MX+170,MY+140,'低於限值：導通正常（示例）',14,'#7dffc4',600,'center'));});
  alphaDo(seg(u,.5,.56),()=>wrap29(84,700,'讀數超過製造商限值，代表引下線可能斷裂或接頭鬆脫，下一次雷擊可能燒穿葉片。',850,16,'rgba(227,236,238,.85)',500,24));
  // right: crack types
  wt(1000,190,'常見裂紋與損傷',21,'#fff',700);
  const K=[['後緣開裂','後緣黏著線受反覆彎曲而裂開，可能沿長度方向延伸',.66,'te'],['橫向裂紋','靠近葉根或最大弦長處，與葉片長度方向垂直',.72,'tr'],['雷擊脫層','強大電流使積層燒穿、分層，常見於接收器附近',.78,'lt']];
  K.forEach((k,i)=>{const a=seg(u,k[2],k[2]+.06);if(a<=0)return;const y=226+i*192;alphaDo(a,()=>{
   card(1000,y,540,176,{bg:'rgba(232,87,42,.07)',st:'rgba(232,87,42,.4)'});
   box(1022,y+30,120,120,'#a9cbdc');poly([1022,y+62,1142,y+56,1142,y+150,1022,y+150],'#eef2f4');
   if(k[3]==='te')ln([1030,y+136,1060,y+128,1090,y+132,1132,y+120],'#394650',2.2);
   if(k[3]==='tr')ln([1084,y+60,1080,y+90,1086,y+118,1082,y+148],'#394650',2.2);
   if(k[3]==='lt'){circ(1100,y+90,14,'#2b2622');poly([1060,y+80,1088,y+74,1092,y+106,1064,y+112],'rgba(184,195,201,.9)');}
   wt(1164,y+46,k[0],20,'#ff9d7a',700);wrap29(1164,y+82,k[1],350,16,'rgba(227,236,238,.88)',500,23);});});
 }},
/* 6 */{t:'缺陷分成 5 級',en:'Five damage categories',dur:15,
 d:'確認後的每一處缺陷都要評定嚴重度。業界常用 1 到 5 級的分類：第 1、2 級是外觀瑕疵與輕微損傷，記錄後在下次巡檢追蹤；第 3 級已傷到積層，要排入維修計畫；第 4 級傷及結構，須在數週到數月內修補並密集追蹤；第 5 級有斷裂風險，必須立即停機。分級不只看大小，也看位置與深度：同樣長度的裂紋，出現在葉根或主樑上，比在葉尖嚴重得多。',
 s:[[0,'每處確認的缺陷都要評定 1 到 5 級的嚴重度'],[.25,'第 1、2 級記錄追蹤，第 3 級排入維修計畫'],[.5,'第 4 級須在數週到數月內修補，第 5 級立即停機'],[.74,'同樣大小的裂紋，在葉根比在葉尖嚴重得多']],
 draw(u){
  diagBG();
  const R=[['外觀瑕疵','污漬、細微刮痕','記錄，下次巡檢再看'],['輕微','塗層初期侵蝕、表面細紋','6–12 個月內複查'],['中度','侵蝕傷到積層、小面積燒痕','排入維修計畫，約 6–12 個月內修補'],['嚴重','結構層損傷、後緣開裂','1–6 個月內修補，每月追蹤'],['危急','大面積裂紋、穿孔，有斷裂風險','立即停機']];
  const Y0=168,RH=104;
  alphaDo(seg(u,.02,.06),()=>{wt(1080,Y0+8,'處理期限（典型）',16,'rgba(227,236,238,.75)',600);wt(460,Y0+8,'典型例子',16,'rgba(227,236,238,.75)',600);});
  R.forEach((r,i)=>{const a=seg(u,.04+i*.07,.1+i*.07);if(a<=0)return;const y=Y0+24+i*RH,col=SEV[i],hi=(i<2&&u>.25&&u<.38)||(i===2&&u>.38&&u<.5)||(i>2&&u>.5&&u<.74);
   alphaDo(a,()=>{card(60,y,1480,RH-12,{bg:hi?'rgba(255,255,255,.1)':'rgba(7,27,39,.8)',st:hi?col:'rgba(255,255,255,.16)'});
    box(60,y,12,RH-12,col);
    wt(150,y+60,String(i+1),46,col,700,'center',COND);
    wt(220,y+44,trf('第 {n} 級',{n:i+1}),16,'rgba(227,236,238,.7)',600);wt(220,y+72,r[0],22,col,700);
    wrap29(460,y+56,r[1],570,18,'#fff',500,24);
    wrap29(1080,y+46,r[2],440,18,i>2?col:'rgba(227,236,238,.92)',700,24);});});
  alphaDo(seg(u,.74,.8),()=>{const y=Y0+24+5*RH+6;card(60,y,1480,800-y,{bg:'rgba(242,194,48,.08)',st:'rgba(242,194,48,.45)'});
   wt(84,y+38,'分級看三件事：',18,'#f2c230',700);
   const T=['位置（葉根、主樑、葉尖）','大小','深度（塗層、積層、結構）'];let x=84+wtw('分級看三件事：',18,700)+20;
   T.forEach((t,i)=>{const b=seg(u,.76+i*.04,.8+i*.04);alphaDo(b,()=>{const w=tag(x,y+32,t,{bg:'rgba(255,255,255,.12)',fg:'#fff',size:17});x+=w+(i<2?44:0);if(i<2)wt(x-22,y+38,'×',20,'#f2c230',700,'center');});});});
 }},
/* 7 */{t:'依分級行動',en:'From grading to action',dur:12,side:true,
 d:'分級結果直接決定下一步。第 5 級缺陷要立即停機，避免葉片在運轉中斷裂；第 4 級把握最近的天候窗口，派繩索技術人員或吊籃平台到位修補；第 1 到 3 級記錄位置與尺寸，排入夏季的維修季或下次巡檢。修補完成後再以無人機拍攝同一位置，影像存入資料庫，和歷年紀錄比對擴大速度，讓下一次的分級更準確。',
 s:[[0,'第 5 級缺陷立即停機，避免葉片在運轉中斷裂'],[.25,'第 4 級把握天候窗口，派繩索技術人員修補'],[.55,'第 1–3 級記錄位置，排入維修季或下次巡檢'],[.78,'修補後再次拍攝，和歷年影像比對']],
 cam:u=>camMix({x:700,y:360,s:1.2},{x:610,y:300,s:1.7},ease(seg(u,.12,.32))),
 draw(u){
  for(const [x,s,p] of [[180,.55,.4],[1000,.45,1.7],[1200,.4,2.6]])far29(x,s,TT*.9+p);
  turb29(TX,A29);
  vsl(TX+100,77,true,{tilt:.8},vCTV);
  const bx=HUB.x-3,dy=HUB.y+BR*.74;
  // repaired / defect spot
  const rep=seg(u,.5,.7);
  alphaDo(1,()=>{ring(bx,dy,9,rep<1?'#ff9d7a':'#7dffc4',2.2);});
  // rope access technicians
  const ty=lerp(HUB.y+14,dy-6,ease(seg(u,.26,.48)));
  if(u>.24){for(const ox of [10,18])ln([HUB.x+ox,HUB.y+6,HUB.x+ox,ty+2],'#e3d9b8',1);person(HUB.x+12,ty+10,'#e8572a',1.4);
   if(u>.3)person(HUB.x+20,Math.max(HUB.y+24,ty-14)+10,'#f2c230',1.4);}
  if(rep>0&&rep<1)for(let i=0;i<5;i++){const k=(TT*1.5+i/5)%1;circ(bx+6+k*14,dy+6+k*10,1.4,'rgba(220,220,220,.7)');}
  const D=kf(u,[[0,TX+120,SEA-30],[.74,TX+120,SEA-30],[.86,bx+40,dy+6],[1,bx+40,dy-6]]);
  if(u>.72)drone29(D.x,D.y,.9);
  lab(HUB.x,HUB.y,'第 5 級：立即停機',{dx:-110,dy:-40,a:band(u,.02,.24),st:'w'});
  lab(bx,dy,'第 4 級：後緣開裂',{dx:-100,dy:20,a:band(u,.1,.5),st:'w'});
  lab(HUB.x+14,ty+4,'繩索技術人員',{dx:80,dy:-20,a:band(u,.3,.62),st:'s'});
  lab(bx,dy,'修補完成',{dx:-100,dy:20,a:band(u,.7,1),st:'g'});
  lab(D.x,D.y,'再次拍攝比對',{dx:70,dy:30,a:band(u,.8,1),st:'g'});
 },
 hud(u){hudPanel(240,176,'本機巡檢結果（示例）',seg(u,.04,.1),w=>{
  hrow(52,'第 1–2 級',trf('{n} 處',{n:7}),w);
  hrow(76,'第 3 級',trf('{n} 處',{n:3}),w,'#f2c230');
  hrow(100,'第 4 級',trf('{n} 處',{n:u<.7?1:0}),w,'#ff9d7a');
  hrow(124,'第 5 級',trf('{n} 處',{n:0}),w,'#e8572a');
  const p=seg(u,.5,.7);hrow(152,'修補進度',Math.round(p*100)+'%',w,'#7dffc4');hbar(14,160,w-28,p,'#7dffc4');});}}
]};
