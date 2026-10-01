// KITS: marine
/* ================= EP20 海纜故障與維修 ================= */
/* complete fixed-bottom turbine at cx */
function turb20(cx,ang){
  const yb=bedY(cx)+130;drawPile(cx,yb,Math.PI/2,yb-PILE_TOP,PILE_W);drawTP(cx,TP_BOT);
  for(let k=0;k<3;k++)drawTowerSec(cx,TP_TOP-k*HS,k);
  drawNacelle(cx,TW_TOP,0,true);drawRotor(cx-44,TW_TOP-20,ang,3);
}
function far20(x,s,ang){const h=150*s,hy=SEA-h;ln([x,SEA,x,hy],'rgba(235,240,243,.85)',3*s);
  for(let i=0;i<3;i++){const a=ang-i*TAU/3;ln([x,hy,x+Math.cos(a)*70*s,hy+Math.sin(a)*70*s],'rgba(245,247,248,.9)',2.2*s);}circ(x,hy,3*s,'#eef2f4');}
function oss20(){drawJacket(OX,bedOX,bedOX-SEA+20,true);drawTopside(OX,SEA-20,0);}
/* text wrapped to a width (after translation) */
function wrap20(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
const bump20=(d,c,w)=>Math.exp(-Math.pow((d-c)/w,2));
/* fault location on the array cable */
const FX=830,FC=FX+20;
/* cable depth: buried 8 px under the seabed, k = how far the anchor has pulled it up */
const cabY20=(x,k)=>bedY(x)+8-k*24*bump20(x,FC,42);
function cablePts20(x0,x1,k,yf){const P=[];for(let x=x0;x<=x1;x+=5)P.push({x,y:(yf||cabY20)(x,k)});return P;}
/* full array cable: turbine CPS exit → OSS J-tube */
function arrayCable20(k,cut){
  const a=[{x:TX+16,y:bedY(TX)-20},{x:TX+34,y:bedY(TX+34)+2}];
  if(!cut){drawCable(a.concat(cablePts20(TX+40,OX-70,k)).concat([{x:OX-62,y:bedOX-15}]));return;}
  drawCable(a.concat(cablePts20(TX+40,cut[0],k)));drawCable(cablePts20(cut[1],OX-70,k).concat([{x:OX-62,y:bedOX-15}]));
}
/* a merchant ship (bow to the right) */
function vCargo20(){
  hull(260,18,12,'#2f4b5c','#7a2a24','#e9edef',7);
  const C=['#e8572a','#1f7f99','#f2c230','#7dc8dc','#e9edef'];
  for(let i=0;i<7;i++)for(let j=0;j<2;j++)box(70+i*24,-18-(j+1)*12,22,11,C[(i*3+j)%5]);
  superBlock(14,-62,40,44,4);box(10,-70,48,8,'#f4f6f7');mast(40,-70,16);
}
function anchor20(x,y){ln([x-20,y-16,x,y],'#2b3137',4);poly([x-6,y-10,x+10,y-4,x+2,y+3],'#2b3137');poly([x-8,y+2,x+12,y-2,x+4,y+5],'#3a4650');circ(x-20,y-16,3,'#2b3137');}
function chain20(x0,y0,x1,y1){ctx.save();ctx.setLineDash([4,2]);ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo(x0+(x1-x0)*.55,y1-6,x1,y1);ctx.strokeStyle='#2b3137';ctx.lineWidth=2.2;ctx.stroke();ctx.restore();}
function spark20(x,y,a,s){if(a<=0)return;alphaDo(a,()=>{const g=ctx.createRadialGradient(x,y,1,x,y,30*s);g.addColorStop(0,'rgba(255,240,180,.95)');g.addColorStop(1,'rgba(255,170,80,0)');ctx.fillStyle=g;ctx.fillRect(x-32*s,y-32*s,64*s,64*s);
  for(let i=0;i<8;i++){const an=i*TAU/8+TT*3,r=(10+8*Math.sin(TT*20+i))*s;ln([x,y,x+Math.cos(an)*r,y+Math.sin(an)*r],'rgba(255,230,140,.9)',1.4);}});}
/* rotor angle for shot 1: spins, then coasts to a stop after the trip at u=.56 */
function rotA1(u){const w=1.05*12,t=.56;return u<t?w*u:w*(t+(1-Math.exp(-(u-t)*8))/8);}
/* repair vessel on station for shots 4–5 (bow right, stern chute at x) */
const RVX=800;
/* rock-placement vessel with fall pipe at local x=110 */
function vRock20(){
  hull(240,18,12,'#5d6b74','#6a2622','#f2c230',6);
  for(let i=0;i<2;i++){box(24+i*52,-36,46,18,'#3a4650');for(let j=0;j<6;j++)circ(30+i*52+j*7,-38-Math.abs(Math.sin(j*1.7))*4,4,'#9aa3a8');}
  box(104,-78,12,60,'#e9b21f');box(98,-82,24,6,'#6f7a80');
  superBlock(170,-62,52,44,3);box(166,-72,60,10,'#f4f6f7');mast(196,-72,16);
}
/* TDR pulse bump on a horizontal line */
function pulse20(x,y,amp,col){const P=[];for(let d=-40;d<=40;d+=2)P.push({x:x+d,y:y-amp*bump20(d,0,12)});pathLine(P,col,3);}
const tdrV=d=>.62*bump20(d,0,.05)+.08*bump20(d,.62,.03)+.08*bump20(d,1.24,.03)+.7*bump20(d,1.8,.045)-.12*bump20(d,1.9,.06);
/* omega bight in plan view */
function omegaPts(J1,J2,dep,f){const P=[];const n=60;for(let i=0;i<=n*f;i++){const t=i/n,a=Math.PI*t;
  const x=lerp(J1.x,J2.x,t)-Math.sin(a*2)*40,y=J1.y+Math.sin(a)*dep;P.push({x,y});}return P;}

const EP={no:20,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'海纜故障與維修',en:'Subsea cable faults and repair',
lede:'海纜是離岸風場最脆弱、也最難修的一環。這一集從一次走錨意外開始，看海纜裡有哪些構造、為什麼會壞，工程師怎麼用電脈衝從變電站端算出故障位置，再派 ROV 下海確認、把海纜打撈上船、插入備用段做海上接頭，最後回填拋石、恢復送電。',
facts:[['75–80','%','離岸風電保險理賠成本中與海纜有關的比例（DNV）'],['150–170','m/μs','電脈衝在 XLPE 海纜中的傳播速度，用於 TDR 換算距離（典型）'],['2','個','插入一段備用海纜時需要的海上修理接頭'],['2.5–3','倍水深','修復後多出的海纜長度，排成 Ω 形迴圈（典型）'],['5–7','天','完成一個海上修理接頭所需的連續好天氣（典型）'],['4–6','週','從找到故障到恢復送電的修復期（典型）']],
note:'說明：本集為教育用途示意動畫，水平距離、水深與設備尺寸經過壓縮，作業時間大幅縮短。走錨情境、海纜編號、輸送功率、TDR 往返時間與故障距離、回收長度、埋設深度與拋石量皆為典型範例，並非特定案場資料。海纜理賠比例取自 DNV 公開文章；修復後多出的海纜長度約為水深 2.5 到 3 倍、每個接頭需數日好天氣、4 到 6 週的修復期，參考英國等地離岸風場海纜修復的公開案例與海事許可申請文件；66 kV 陣列海纜為台灣離岸風場常見規格。實際作業依海纜型式、水深與海況而定。',
shots:[
/* 1 */{t:'走錨意外：一條海纜跳脫',en:'An anchor drags across the cable',dur:12,side:true,
 d:'陣列海纜把一串風機的電力送到離岸變電站，台灣的離岸風場多採 66 kV 等級。海纜通常埋在海床下 1 到 2 公尺，但船舶在風場附近錨泊時若遇上強風，錨可能在海床上拖行，也就是「走錨」。一旦勾到海纜，鎧裝與絕緣受損，保護電驛隨即跳脫，整串風機停止送電。從這一刻開始，修復團隊要跟時間與天氣賽跑。',
 s:[[0,'風場附近一艘錨泊的船，在強風中開始走錨'],[.3,'船錨在海床上拖行，朝著埋設的海纜前進'],[.55,'船錨勾到海纜，絕緣受損，保護電驛跳脫'],[.78,'整串風機停止送電，修復團隊開始找故障點']],
 cam:u=>camMix({x:800,y:430,s:1},{x:820,y:560,s:1.6},ease(seg(u,.3,.5))),
 draw(u){
  for(const [x,s,p] of [[180,.55,.4],[1000,.42,1.7]])far20(x,s,u<.56?TT*.9+p:p);
  const ax=lerp(690,FC,ease(seg(u,.1,.6))),ay=bedY(ax)+3,k=clamp((ax-FX)/(FC-FX));
  const sx=ax-420,wl=vsl(sx,260,false,{damp:.6,tilt:.6},vCargo20);
  chain20(sx+255,wl-14,ax-20,ay-16);
  turb20(TX,rotA1(u));oss20();
  arrayCable20(k);
  anchor20(ax,ay);
  if(u>.54&&u<.7)spark20(FC,cabY20(FC,1),1-seg(u,.6,.7),1);
  if(u>.56)ring(FC,cabY20(FC,k),18+2*Math.sin(TT*6),'#e8572a',2.4);
  if(u>.6)alphaDo(.5+.5*Math.sin(TT*8),()=>circ(OX-50,SEA-98,4,'#e8572a'));
  lab(sx+150,wl-40,'錨泊船（走錨）',{dx:-30,dy:-60,a:band(u,.02,.3),st:'s'});
  lab(ax,ay,'船錨',{dx:-60,dy:50,a:band(u,.28,.54)});
  lab(TX+120,cabY20(TX+120,0),'陣列海纜 66 kV',{dx:-20,dy:60,a:band(u,.3,.56)});
  lab(FC,cabY20(FC,k),'海纜受損',{dx:50,dy:60,a:band(u,.56,1),st:'w'});
  lab(OX-50,SEA-98,'保護電驛跳脫',{dx:40,dy:-60,a:band(u,.6,1),st:'w'});
 },
 hud(u){hudPanel(230,150,'陣列海纜 A3（示例）',seg(u,.04,.1),w=>{const ok=u<.56,p=ok?60:Math.max(0,Math.round(60*(1-seg(u,.56,.6))));
  hrow(52,'電壓','66 kV',w);hrow(78,'串接風機','6 部',w);
  hrow(104,'輸送功率',trf('{n} MW',{n:p}),w,ok?'#7dffc4':'#ff9d7a');hbar(14,112,w-28,p/60,ok?'#7dffc4':'#ff9d7a');
  hrow(140,'狀態',ok?'正常':'保護跳脫',w,ok?'#7dffc4':'#e8572a');});}},
/* 2 */{t:'海纜裡有什麼？為什麼會壞',en:'Inside the cable and why it fails',dur:13,
 d:'三芯交流海纜的每一芯，由銅導體、交聯聚乙烯（XLPE）絕緣與金屬遮蔽組成；芯與芯之間夾著光纖單元，外圍再包覆鋼線鎧裝與外被，承受拉力與外力。根據 DNV 的資料，離岸風電保險理賠成本中約 75 到 80% 與海纜有關。常見原因包括錨害與漁具等第三方外力、施工時的拉傷或彎曲過度、海床沖刷造成的懸空磨耗，以及接頭與終端的製作缺陷。',
 s:[[0,'三芯海纜：導體、XLPE 絕緣、金屬遮蔽與光纖'],[.26,'外圍的鋼線鎧裝承受拉力，保護內部的電纜芯'],[.5,'錨害與漁具等第三方外力是常見原因'],[.74,'施工損傷、懸空磨耗與接頭缺陷也會造成故障']],
 draw(u){
  diagBG();
  card(60,150,760,650,{bg:'rgba(7,27,39,.78)'});wt(84,190,'三芯交流海纜剖面（示意）',20,'#f2c230',700);
  const cx=280,cy=480,a0=TT*.05,sc=ease(seg(u,0,.1));
  ctx.save();ctx.translate(cx,cy);ctx.scale(.6+.4*sc,.6+.4*sc);ctx.translate(-cx,-cy);
  circ(cx,cy,190,'#2b3137');ring(cx,cy,186,'#e8a33a',2);
  for(let i=0;i<64;i++){const a=a0+i*TAU/64;circ(cx+Math.cos(a)*170,cy+Math.sin(a)*170,7.5,'#9aa6ad','#5d6b74',1);}
  circ(cx,cy,158,'#3a4650');
  const core=i=>{const a=a0-Math.PI/2+i*TAU/3;return {x:cx+Math.cos(a)*76,y:cy+Math.sin(a)*76};};
  for(let i=0;i<3;i++){const p=core(i);circ(p.x,p.y,66,'#20282e');circ(p.x,p.y,60,'#7b8890');circ(p.x,p.y,55,'#e9edef');circ(p.x,p.y,30,'#d38a3a');
   for(let j=0;j<7;j++){const b=j*TAU/6;circ(p.x+(j?Math.cos(b)*17:0),p.y+(j?Math.sin(b)*17:0),8,'#e8a33a','#b8702a',1);}}
  const fa=a0-Math.PI/2+Math.PI/3,fp={x:cx+Math.cos(fa)*112,y:cy+Math.sin(fa)*112};
  circ(fp.x,fp.y,16,'#2b3137');circ(fp.x,fp.y,13,'#1f7f99');for(let j=0;j<4;j++)circ(fp.x-5+(j%2)*10,fp.y-5+Math.floor(j/2)*10,3.5,'#7dffc4');
  ctx.restore();
  const c0=core(0),c1=core(1);
  const L=[['導體（銅）',{x:c0.x+8,y:c0.y},270,.04],['XLPE 絕緣',{x:c0.x+44,y:c0.y-20},330,.08],['金屬遮蔽',{x:c1.x+40,y:c1.y-38},390,.12],
   ['光纖單元',fp,450,.16],['鋼線鎧裝',{x:cx+Math.cos(a0+.4)*170,y:cy+Math.sin(a0+.4)*170},560,.26],['外被',{x:cx+Math.cos(a0+.75)*188,y:cy+Math.sin(a0+.75)*188},630,.3]];
  L.forEach(([t,p,y,t0])=>{const a=seg(u,t0,t0+.05);if(a<=0)return;alphaDo(a,()=>{ln([p.x,p.y,520,y-6,540,y-6],'rgba(227,236,238,.6)',1.4);circ(p.x,p.y,4,'#f2c230');wt(548,y,t,18,'#fff',700);});});
  alphaDo(seg(u,.34,.4),()=>wrap20(84,740,'鎧裝承受敷設與打撈時的拉力，也是抵擋外力的第一道防線',700,16,'rgba(227,236,238,.85)',500,23));
  // causes
  wt(860,190,'常見的故障原因',21,'#fff',700);
  const K=[['錨害與漁具','船錨拖行、拖網勾掛，屬第三方外力','#e8572a',.48],['施工損傷','敷設時拉力過大或彎曲半徑過小','#f2c230',.6],
   ['懸空與磨耗','海床沖刷、沙波移動讓海纜裸露晃動','#f2c230',.68],['接頭與終端','製作缺陷或進水，絕緣逐漸劣化','#f2c230',.76]];
  K.forEach((k,i)=>{const a=seg(u,k[3],k[3]+.06);const y=214+i*124;alphaDo(Math.max(.18,a),()=>{
   card(860,y,680,108,{bg:i===0?'rgba(232,87,42,.12)':'rgba(7,27,39,.8)',st:i===0&&a>0?'rgba(232,87,42,.5)':undefined});
   circ(898,y+54,20,a>=1?k[2]:'rgba(255,255,255,.12)');wt(898,y+61,String(i+1),20,a>=1?'#0e2a3b':'#fff',700,'center',COND);
   wt(936,y+44,k[0],20,'#fff',700);wrap20(936,y+76,k[1],580,16,'rgba(227,236,238,.85)',500,21);});});
  alphaDo(seg(u,.08,.14),()=>{card(860,716,680,84,{bg:'rgba(232,87,42,.08)',st:'rgba(232,87,42,.45)'});
   wt(884,772,'75–80%',40,'#ff9d7a',700,'left',COND);wrap20(884+wtw('75–80%',40,700,COND)+18,752,'離岸風電保險理賠成本中與海纜有關的比例（DNV）',520,15,'rgba(227,236,238,.88)',500,21);});
 }},
/* 3 */{t:'找出故障點：時域反射法',en:'Locating the fault with TDR',dur:14,
 d:'海纜長達數公里，故障點埋在海床下看不見，第一步是從變電站端量測。時域反射法（TDR）對海纜送出一個電脈衝，脈衝遇到故障處的阻抗變化就會反射回來。脈衝在 XLPE 海纜中的傳播速度約每微秒 150 到 170 公尺，把往返時間乘上速度再除以二，就是故障距離。再比對海纜內光纖的量測資料，最後由 ROV 的追纜器在現場確認，可把範圍縮小到幾公尺內。',
 s:[[0,'從變電站端，對海纜送出一個電脈衝'],[.28,'脈衝在故障處反射，回到儀器的時間換算成距離'],[.5,'距離 = 傳播速度 × 往返時間 ÷ 2'],[.7,'再用光纖資料與 ROV 追纜器縮小到幾公尺內']],
 draw(u){
  diagBG();
  card(60,150,1480,190,{bg:'rgba(7,27,39,.78)'});
  const x0=260,x1=1440,ly=250,X=d=>lerp(x0,x1,d/3),xf=X(1.8);
  card(84,196,150,100,{bg:'rgba(242,194,48,.1)',st:'rgba(242,194,48,.5)'});wt(159,236,'TDR 儀器',17,'#f2c230',700,'center');
  box(110,252,98,26,'#0b1e2a');const sw=(TT*2)%1;ln([116,268,116+82*sw,268-8*Math.sin(sw*20)],'#7dffc4',1.6);
  wt(x0,190,'變電站端',16,'rgba(227,236,238,.85)',600,'left');wt(x1,190,'風機端',16,'rgba(227,236,238,.85)',600,'right');
  ln([x0,ly,x1,ly],'#121416',9);ln([x0,ly,x1,ly],'#e8a33a',2);
  [0,1,2,3].forEach(d=>{ln([X(d),ly+12,X(d),ly+20],'rgba(227,236,238,.6)',1.4);wt(X(d),ly+42,d+' km',15,'rgba(227,236,238,.75)',600,'center',COND);});
  const go=seg(u,.06,.28),back=seg(u,.28,.48);
  if(u>.06&&u<.28)pulse20(lerp(x0,xf,go),ly-6,34,'#f2c230');
  if(u>.28&&u<.48)pulse20(lerp(xf,x0,back),ly-6,26,'#ff9d7a');
  if(u>.27){ln([xf-12,ly-12,xf+12,ly+12],'#e8572a',4);ln([xf-12,ly+12,xf+12,ly-12],'#e8572a',4);wt(xf,ly-28,'故障點',17,'#ff9d7a',700,'center');}
  const tus=u<.06?0:Math.min(22.5,22.5*(u-.06)/(.48-.06));
  wt(1440,320,trf('往返時間 {t} μs',{t:tus.toFixed(1)}),17,'#f2c230',700,'right',COND);
  // waveform chart
  const c=chartBox(60,360,880,440,{title:'TDR 反射波形（示例）',x0:0,x1:3,y0:-.4,y1:1,xt:[0,.5,1,1.5,2,2.5,3],yt:[0,.5,1],xl:'距離（km）',pt:70,gx:6,gy:2});
  const f=ease(seg(u,.4,.62));if(f>0){const P=[];for(let d=0;d<=3*f;d+=.01)P.push({x:c.X(d),y:c.Y(tdrV(d))});pathLine(P,'#7dffc4',2.6);}
  alphaDo(seg(u,.42,.46),()=>wt(c.X(.08),c.Y(.82),'送出脈衝',16,'#f2c230',700,'left'));
  alphaDo(seg(u,.56,.6),()=>{ctx.setLineDash([6,5]);ln([c.X(1.8),c.Y(.72),c.X(1.8),c.Y(-.4)],'rgba(232,87,42,.85)',1.6);ctx.setLineDash([]);wt(c.X(1.86),c.Y(.82),'故障反射 1.8 km',16,'#ff9d7a',700,'left');});
  alphaDo(seg(u,.5,.56),()=>wt(c.X(.93),c.Y(.22),'既有接頭的小反射',14,'rgba(227,236,238,.75)',500,'center'));
  // formula + steps
  card(980,360,560,440,{bg:'rgba(7,27,39,.8)'});
  alphaDo(seg(u,.48,.54),()=>{wt(1004,400,'距離換算',19,'#fff',700);
   wt(1260,452,'d = v × t ÷ 2',34,'#f2c230',700,'center',COND);
   wt(1004,494,'v ≈ 160 m/μs（典型）',17,'rgba(227,236,238,.9)',600);wt(1004,522,'t = 22.5 μs',17,'rgba(227,236,238,.9)',600,'left',COND);
   alphaDo(seg(u,.56,.6),()=>wt(1516,522,'d = 1.8 km',26,'#7dffc4',700,'right',COND));});
  ln([1004,546,1516,546],'rgba(255,255,255,.15)',1.4);
  const ST=[['TDR 預定位','先縮小到數十公尺的範圍（典型）'],['光纖資料比對','溫度或振動異常的位置'],['ROV 追纜器','在現場確認到幾公尺內']];
  ST.forEach((s,i)=>{const a=seg(u,.68+i*.07,.73+i*.07);const y=586+i*72;alphaDo(Math.max(.2,a),()=>{
   circ(1022,y,16,a>=1?'#7dffc4':'rgba(255,255,255,.12)');wt(1022,y+6,String(i+1),17,a>=1?'#0e2a3b':'#fff',700,'center',COND);
   wt(1052,y+2,s[0],18,'#fff',700);wrap20(1052,y+28,s[1],460,15,'rgba(227,236,238,.8)',500,20);});});
 }},
/* 4 */{t:'ROV 下海：確認損傷',en:'ROV survey of the damage',dur:13,side:true,
 d:'得到預估位置後，工作船開到現場，以動態定位停在海纜路徑上方，放下遙控無人潛水器（ROV）。ROV 由臍帶纜供電並傳回影像，搭載追纜器感測海纜位置，沿著路徑在海床附近搜尋，用攝影機與聲納確認損傷的樣子與範圍。台灣西部離岸風場的水深多在 20 到 50 公尺，較淺處也可由潛水員協助，但海流強、能見度低，多以 ROV 為主。',
 s:[[0,'工作船開到預估位置，放下 ROV'],[.25,'ROV 沿著海纜路徑搜尋，追纜器感測海纜位置'],[.55,'在預估範圍內找到被錨勾起、外露的海纜'],[.78,'攝影與聲納記錄損傷範圍，作為修復計畫依據']],
 cam:u=>camMix({x:800,y:470,s:1.15},{x:900,y:610,s:1.7},ease(seg(u,.16,.34))),
 draw(u){
  turb20(TX,0);oss20();
  arrayCable20(1);
  const wl=vsl(RVX-20,170,false,{damp:.5},vSurvey);
  const R=kf(u,[[0,RVX+60,SEA+30],[.18,RVX+40,bedY(RVX)-46],[.3,FX-170,bedY(FX-170)-22],[.62,FC-30,bedY(FC-30)-22],[1,FC-24,bedY(FC-24)-24]]);
  const tp={x:RVX+60,y:wl+4};ctx.beginPath();ctx.moveTo(tp.x,tp.y);ctx.quadraticCurveTo(tp.x-40,(tp.y+R.y)/2+30,R.x,R.y-20);ctx.strokeStyle='#e8a33a';ctx.lineWidth=1.6;ctx.stroke();
  ln([tp.x,wl-20,tp.x,tp.y],'#6f7a80',2);
  const scan=u>.28&&u<.66;
  if(scan)alphaDo(.6,()=>poly([R.x,R.y,R.x-26,bedY(R.x-26)+14,R.x+26,bedY(R.x+26)+14],'rgba(125,255,196,.3)'));
  alphaDo(band(u,.22,.62),()=>{ctx.setLineDash([6,5]);const y=bedY(FC)+34;ln([FX-60,y,FC+60,y],'#f2c230',2);ln([FX-60,y-8,FX-60,y+8],'#f2c230',2);ln([FC+60,y-8,FC+60,y+8],'#f2c230',2);ctx.setLineDash([]);});
  rov(R.x,R.y,TT,u>.2);
  if(u>.6)alphaDo(seg(u,.6,.66),()=>{ring(FC,cabY20(FC,1),16,'#e8572a',2.4);
   alphaDo(.3+.2*Math.sin(TT*5),()=>poly([R.x+14,R.y-12,FC+10,cabY20(FC,1)-22,FC+10,cabY20(FC,1)+16],'rgba(255,248,222,.6)'));});
  lab(RVX+60,wl-30,'ROV 支援船',{dx:60,dy:-50,a:band(u,.02,.22),st:'s'});
  lab(tp.x-30,(tp.y+R.y)/2+20,'臍帶纜',{dx:-60,dy:-20,a:band(u,.08,.3),minor:true});
  lab(R.x,R.y-14,'ROV',{dx:-40,dy:-40,a:band(u,.2,.58),st:'s'});
  lab(R.x,bedY(R.x)+10,'追纜器感測',{dx:-50,dy:40,a:band(u,.3,.56)});
  lab(FC,bedY(FC)+34,'預估範圍',{dx:60,dy:30,a:band(u,.24,.56)});
  lab(FC,cabY20(FC,1),'海纜受損處',{dx:50,dy:-50,a:band(u,.62,1),st:'w'});
 },
 hud(u){hudPanel(230,150,'ROV 搜尋（示例）',seg(u,.04,.1),w=>{const R=kf(u,[[0,RVX+60,0],[.18,RVX+40,0],[.3,FX-170,0],[.62,FC-30,0],[1,FC-24,0]]);
  hrow(52,'水深','約 30 m',w);hrow(78,'能見度','約 1–2 m',w);
  hrow(104,'位置',trf('KP {n} km',{n:(1.8+(R.x-FC)*.0006).toFixed(2)}),w,'#f2c230');
  hrow(132,'狀態',u<.62?'搜尋中':'找到損傷',w,u<.62?'#7dffc4':'#e8572a');});}},
/* 5 */{t:'切斷與打撈',en:'Cutting and recovering the cable',dur:13,side:true,
 d:'海纜修理船抵達後，ROV 先用鑽石線鋸或液壓剪在損傷段兩側切斷海纜，再以打撈工具夾住斷端，由船尾的導纜槽把海纜拉上甲板。因為要從海床一路拉到甲板，回收長度至少是水深的好幾倍。上船的斷端先剝開檢查是否進水，封上端帽並做絕緣測試，確認健康後才能接上船上轉盤裡的備用海纜。開發商通常會預先備妥備用海纜與接頭，以縮短停電時間。',
 s:[[0,'海纜修理船抵達，ROV 在損傷段兩側切斷海纜'],[.3,'打撈工具夾住斷端，從船尾導纜槽拉上甲板'],[.6,'檢查斷端是否進水，封上端帽並做絕緣測試'],[.8,'船上轉盤裡備有預先準備的備用海纜']],
 cam:u=>camMix({x:900,y:610,s:1.7},{x:860,y:500,s:1.35},ease(seg(u,.26,.42))),
 draw(u){
  turb20(TX,0);oss20();
  const wl=vsl(RVX,250,false,{damp:.4},vCLV);
  const cut=u>.22,cl=FX-14,cr=FC+44;
  const lift=ease(seg(u,.32,.6)),tipS={x:cl,y:cabY20(cl,0)},tipE={x:RVX+6,y:wl-14};
  if(!cut)arrayCable20(1);
  else{
   // left end being recovered: lying part + rising catenary
   const xl=lerp(cl,cl-170,lift);
   drawCable([{x:TX+16,y:bedY(TX)-20},{x:TX+34,y:bedY(TX+34)+2}].concat(cablePts20(TX+40,xl,0)));
   if(lift>0){const tip={x:lerp(tipS.x,tipE.x,lift),y:lerp(tipS.y,tipE.y,lift)},c1={x:xl+60,y:cabY20(xl,0)},c2={x:tip.x-10,y:lerp(tip.y,tipS.y,.55)};
    const P=[];for(let i=0;i<=24;i++)P.push(bez({x:xl,y:cabY20(xl,0)},c1,c2,tip,i/24));drawCable(P);
    ln([tip.x,tip.y,RVX+4,wl-12],'#6f7a80',1.4);}
   else{drawCable(cablePts20(xl,cl,0));}
   // damaged section stays on the seabed for later recovery, right end lies
   drawCable(cablePts20(cl+12,cr-12,1));
   drawCable(cablePts20(cr,OX-70,0).concat([{x:OX-62,y:bedOX-15}]));
  }
  const R=kf(u,[[0,cl+8,bedY(cl)-20],[.24,cl+8,bedY(cl)-20],[.3,cr-8,bedY(cr)-20],[.36,cr-8,bedY(cr)-20],[.6,cl-100,bedY(cl-100)-40],[1,cl-120,bedY(cl-120)-50]]);
  rov(R.x,R.y,TT,u<.36);
  if(u>.06&&u<.22)spark20(cl,cabY20(cl,0),band(u,.06,.22),.6);
  if(u>.26&&u<.34)spark20(cr,cabY20(cr,0),band(u,.26,.34),.6);
  // end cap on deck
  if(u>.6)alphaDo(seg(u,.6,.66),()=>{box(RVX+14,wl-26,16,10,'#e8572a');ring(RVX+20,wl-22,14,'#7dffc4',1.8);});
  lab(RVX+190,wl-60,'海纜修理船',{dx:40,dy:-60,a:band(u,.36,.6),st:'s'});
  lab(cl,cabY20(cl,0),'ROV 切斷海纜',{dx:-60,dy:40,a:band(u,.04,.3),st:'s'});
  lab(lerp(tipS.x,tipE.x,lift*.6),lerp(tipS.y,tipE.y,lift*.6),'打撈的斷端',{dx:-70,dy:-30,a:band(u,.34,.6)});
  lab(RVX+4,wl-12,'船尾導纜槽',{dx:-70,dy:-50,a:band(u,.46,.62),minor:true});
  lab(RVX+20,wl-22,'端帽與絕緣測試',{dx:-60,dy:-60,a:band(u,.62,.82),st:'g'});
  lab(RVX+95,wl-46,'備用海纜轉盤',{dx:30,dy:-70,a:band(u,.8,1),st:'s'});
 },
 hud(u){hudPanel(230,150,'打撈作業（示例）',seg(u,.04,.1),w=>{const L=Math.round(90*ease(seg(u,.32,.6)));
  hrow(52,'水深','約 30 m',w);hrow(78,'回收長度',trf('{n} m',{n:L}),w,'#f2c230');hbar(14,86,w-28,L/90,'#f2c230');
  const st=u<.3?'切斷':u<.6?'打撈中':'測試合格';hrow(120,'斷端',st,w,u<.6?'#f2c230':'#7dffc4');});}},
/* 6 */{t:'海上接頭與 Ω 迴圈',en:'Repair joints and the omega bight',dur:15,
 d:'修復時要切掉受損段，再插入一段備用海纜，所以需要兩個海上修理接頭。第一個接頭在甲板上完成後，船一邊放出備用海纜一邊移到另一端，打撈第二個斷端再做第二個接頭。兩端都要拉上甲板作業，修好的海纜因此多出約水深 2.5 到 3 倍的長度，放回海床時排成側向的 Ω 形迴圈。每個接頭要剝線、壓接導體、重建絕緣與鎧裝，通常需要 5 到 7 天的連續好天氣（典型）。',
 s:[[0,'切掉受損段，插入一段備用海纜，需要兩個接頭'],[.3,'兩端都要拉上甲板，多出的海纜排成 Ω 形迴圈'],[.55,'每個接頭要壓接導體、重建絕緣與鎧裝'],[.78,'從定位到恢復送電，典型需要 4 到 6 週']],
 draw(u){
  diagBG();
  card(60,150,800,380,{bg:'rgba(7,27,39,.78)'});wt(84,190,'平面圖：修復後的海纜路徑（示意）',19,'#f2c230',700);
  const ry=280,J1={x:360,y:ry},J2={x:560,y:ry};
  // seabed texture in plan
  for(let i=0;i<30;i++){const r=rng(i+3);circ(90+r()*740,220+r()*290,1.5+r()*2,'rgba(181,154,106,.25)');}
  const cutA=seg(u,.04,.16);
  drawCablePlan20(100,J1.x,ry);drawCablePlan20(J2.x,830,ry);
  alphaDo(1-seg(u,.2,.3),()=>{ctx.setLineDash([8,6]);ln([J1.x,ry,J2.x,ry],'#e8572a',5);ctx.setLineDash([]);});
  alphaDo(band(u,.06,.3),()=>wt((J1.x+J2.x)/2,ry-24,'切除的受損段',16,'#ff9d7a',700,'center'));
  const of=ease(seg(u,.24,.46));if(of>0){const P=omegaPts(J1,J2,170,of);pathLine(P,'#121416',6);pathLine(P,'#7dffc4',2.2);}
  const jk=(J,a,t)=>{if(a<=0)return;alphaDo(a,()=>{rrp(J.x-16,J.y-9,32,18,4);ctx.fillStyle='#f2c230';ctx.fill();wt(J.x,J.y-20,t,15,'#f2c230',700,'center');});};
  jk(J1,seg(u,.22,.28),'接頭 1');jk(J2,seg(u,.44,.5),'接頭 2');
  alphaDo(seg(u,.06,.1),()=>wt(110,ry-20,'原海纜',15,'rgba(227,236,238,.8)',600));
  alphaDo(seg(u,.38,.44),()=>{wt(470,ry+150,'Ω 迴圈',20,'#7dffc4',700,'center');wt(470,ry+178,'備用海纜',15,'rgba(227,236,238,.85)',600,'center');});
  alphaDo(seg(u,.46,.52),()=>{card(600,350,240,160,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});
   wt(620,384,'多出的長度',16,'rgba(227,236,238,.85)',600);wt(620,424,'≈ 2.5–3 倍水深',22,'#7dffc4',700);
   wrap20(620,456,'水深 30 m → 約 75–90 m',205,15,'rgba(227,236,238,.85)',500,20);});
  // timeline
  card(60,550,800,250,{bg:'rgba(7,27,39,.78)'});wt(84,590,'修復時程（典型）',19,'#fff',700);
  const TL=['定位','動員船隊','打撈','接頭 1','接頭 2','回填測試'];
  TL.forEach((t,i)=>{const a=seg(u,.76+i*.025,.8+i*.025);const x=84+i*128;alphaDo(Math.max(.2,a),()=>{
   rrp(x,620,118,48,3);ctx.fillStyle=a>=1?(i>2&&i<5?'#f2c230':'#58b8d0'):'rgba(255,255,255,.1)';ctx.fill();wt(x+59,651,t,16,a>=1?'#0e2a3b':'#fff',700,'center');});});
  alphaDo(seg(u,.9,.95),()=>{wt(84,722,'約 4–6 週',36,'#f2c230',700,'left',COND);wrap20(84+wtw('約 4–6 週',36,700,COND)+20,712,'實際時間取決於船舶、備品與天候窗口',540,16,'rgba(227,236,238,.85)',500,22);
   wrap20(84,770,'每個接頭需要 5–7 天連續好天氣（典型）',760,15,'rgba(227,236,238,.75)',500,20);});
  // joint steps
  card(900,150,640,650,{bg:'rgba(7,27,39,.78)'});wt(924,190,'接頭怎麼做',21,'#fff',700);
  const R=[['剝除外被與鎧裝','露出三根電纜芯與光纖'],['壓接導體','以壓接套管連接銅導體'],['重建絕緣','裝上預製絕緣件與遮蔽層'],['熔接光纖','恢復監測與通訊'],['鎧裝錨定與外殼','鋼線固定在接頭外殼上'],['耐壓測試','確認絕緣合格才放回海床']];
  R.forEach((s,i)=>{const a=seg(u,.52+i*.035,.56+i*.035);const y=240+i*92;alphaDo(Math.max(.25,a),()=>{
   circ(944,y,18,a>=1?'#f2c230':'rgba(255,255,255,.12)');wt(944,y+7,String(i+1),19,a>=1?'#0e2a3b':'#fff',700,'center',COND);
   wt(978,y-2,s[0],19,'#fff',700);wt(978,y+26,s[1],15,'rgba(227,236,238,.8)',500);
   if(i<5)ln([944,y+22,944,y+70],'rgba(255,255,255,.2)',2);});});
 }},
/* 7 */{t:'回填保護與恢復送電',en:'Burial, rock protection and re-energising',dur:13,side:true,
 d:'第二個接頭完成後，海纜與 Ω 迴圈被放回海床，ROV 以高壓水刀沖開海床，讓海纜重新沉到 1 到 2 公尺深。接頭外殼較粗、不易埋深，常再以拋石船的落管把碎石精準堆在上方，或鋪上混凝土保護墊。最後進行耐壓與光纖測試，合格後重新送電，風機恢復發電。事後還會檢討原因，例如加強風場周邊的錨泊管理、縮短海纜調查的間隔。',
 s:[[0,'修好的海纜放回海床，ROV 以水刀沖埋回 1–2 公尺深'],[.32,'拋石船以落管把碎石堆在接頭上方'],[.6,'耐壓與光纖測試合格後，重新送電'],[.8,'風機恢復發電，並檢討錨泊與監測管理']],
 cam:u=>camMix({x:900,y:580,s:1.5},{x:800,y:450,s:1.05},ease(seg(u,.62,.8))),
 draw(u){
  const sp=seg(u,.72,1);turb20(TX,1.05*13*.28*sp*sp/2);oss20();
  for(const [x,s,p] of [[180,.55,.4],[1000,.42,1.7]])far20(x,s,TT*.9*sp+p);
  const jx=[FX-70,FC+70],tx=lerp(FX-200,FC+200,ease(seg(u,.04,.34)));
  const bur=x=>x<tx?1:0,yb=x=>bedY(x)+lerp(-3,8,bur(x));
  drawCable([{x:TX+16,y:bedY(TX)-20},{x:TX+34,y:bedY(TX+34)+2}].concat(cablePts20(TX+40,FX-200,0)).concat(cablePts20(FX-200,FC+200,0,yb)).concat(cablePts20(FC+200,OX-70,0)).concat([{x:OX-62,y:bedOX-15}]));
  jx.forEach(x=>{rrp(x-12,yb(x)-5,24,10,3);ctx.fillStyle='#f2c230';ctx.fill();});
  // jetting ROV with plume
  if(u<.38){const ry=bedY(tx)-14;rov(tx,ry,TT,true);alphaDo(.5,()=>{for(let i=0;i<10;i++){const k=(TT*1.2+i/10)%1;circ(tx-10-k*60,ry+4-k*40,3+k*12,`rgba(181,154,106,${.5*(1-k)})`);}});}
  // rock placement vessel + fall pipe
  const va=seg(u,.3,.4),vx=lerp(FX-200,FC-130,ease(seg(u,.28,.42)));
  let wl=SEA;if(va>0){wl=vsl(vx,240,false,{damp:.4,a:va},vRock20);
   const px=vx+110,pb=bedY(px)-46;alphaDo(va,()=>{ln([px,wl,px,pb],'#e9b21f',6);ln([px,wl,px,pb],'#6f7a80',2);rov(px+4,pb+14,TT,false);});
   const rk=seg(u,.42,.7);if(rk>0&&rk<1)for(let i=0;i<10;i++){const k=(TT*1.5+i/10)%1;circ(px+(i%3-1)*6+k*4,pb+16+k*28,3,'#9aa3a8');}}
  const bh=ease(seg(u,.42,.72));
  if(bh>0){ctx.beginPath();ctx.moveTo(FX-120,bedY(FX-120));for(let x=FX-120;x<=FC+120;x+=6){const k=Math.max(0,1-Math.pow((x-(FX+FC)/2)/140,2));ctx.lineTo(x,bedY(x)-22*bh*k);}ctx.lineTo(FC+120,bedY(FC+120));ctx.closePath();ctx.fillStyle='#8a949a';ctx.fill();
   const r=rng(9);for(let i=0;i<40;i++){const x=FX-100+r()*(FC-FX+200),k=Math.max(0,1-Math.pow((x-(FX+FC)/2)/140,2));if(k<=0)continue;circ(x,bedY(x)-r()*20*bh*k,2.4,'#b5bec3');}}
  // re-energised glow
  const g=seg(u,.64,.72);if(g>0)alphaDo(g*(.5+.3*Math.sin(TT*4)),()=>{pathLine([{x:TX+16,y:bedY(TX)-20}].concat(cablePts20(TX+40,OX-70,0,yb)).concat([{x:OX-62,y:bedOX-15}]),'#7dffc4',2);});
  lab(tx,bedY(tx)-24,'沖埋 ROV',{dx:-60,dy:-50,a:band(u,.02,.3),st:'s'});
  lab(jx[0],yb(jx[0]),'修理接頭',{dx:-50,dy:50,a:band(u,.06,.32)});
  lab(vx+60,wl-30,'拋石船',{dx:-50,dy:-50,a:band(u,.34,.62),st:'s'});
  lab(vx+110,(wl+bedY(vx+110))/2,'落管',{dx:50,dy:-20,a:band(u,.4,.62),minor:true});
  lab((FX+FC)/2,bedY((FX+FC)/2)-20,'拋石保護',{dx:60,dy:40,a:band(u,.5,.66)});
  lab(OX-50,SEA-98,'恢復送電',{dx:40,dy:-60,a:band(u,.7,1),st:'g'});
 },
 hud(u){hudPanel(230,150,'恢復作業（示例）',seg(u,.04,.1),w=>{
  hrow(52,'埋設深度',trf('{n} m',{n:(1.5*ease(seg(u,.04,.34))).toFixed(1)}),w);
  hrow(78,'拋石',trf('{n} t',{n:Math.round(1200*ease(seg(u,.42,.72)))}),w);
  const st=u<.36?'沖埋':u<.62?'拋石':u<.7?'耐壓測試':'恢復送電';hrow(104,'狀態',st,w,u<.7?'#f2c230':'#7dffc4');
  const p=Math.round(60*seg(u,.72,.95));hrow(132,'輸送功率',trf('{n} MW',{n:p}),w,'#7dffc4');});}}
]};
function drawCablePlan20(x0,x1,y){ln([x0,y,x1,y],'#121416',6);ln([x0,y,x1,y],'#e8a33a',2);}
