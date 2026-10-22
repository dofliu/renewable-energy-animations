// KITS: land
/* 太陽光電系列 第 8 集：變流器與最大功率追蹤 */
const ROWS=[140,330,520,710],CBX=880,INVX=990,TRX=1130,PYX=1330;   // 支架排、匯流箱、變流器、變壓器、電塔
const E_Y='#f2c230',E_G='#7dffc4',E_W='#e8572a',E_B='#58b8d0';
const DEG=Math.PI/180,TA=12*DEG,TW=170;
const VOC=1100,ISC=10,BB=70;     // 組串開路電壓 V、短路電流 A、曲線彎曲程度（示例）
const gy=x=>groundY(x);
const ivI=(V,k)=>{k=k===undefined?1:k;return Math.max(0,k*ISC*(1-Math.exp((V-VOC)/BB))/(1-Math.exp(-VOC/BB)));};
const ivP=(V,k)=>V*ivI(V,k)/1000;
function mpp(k){let bv=0,bp=0;for(let v=0;v<=VOC;v+=2){const p=ivP(v,k);if(p>bp){bp=p;bv=v;}}return [bv,bp];}
/* 擾動觀察法：每步 40 V，先朝高電壓走，功率下降就反向 */
const PO=(()=>{const a=[];let v=300,dir=1,pp=0;for(let i=0;i<48;i++){const p=ivP(v);a.push([v,p]);if(i>0&&p<pp)dir=-dir;pp=p;v+=dir*40;}return a;})();
/* 部分遮蔭：三段模組各有旁路二極體，g 是各段的日照比例 */
function shadeCurve(g){const pts=[];for(let i=0;i<=400;i++){const I=ISC*i/400;let V=0;g.forEach(gi=>{const m=gi*ISC;V+=I<m?Math.max(0,VOC/3+25*Math.log(1-I/m)):0;});pts.push([V,I*V/1000]);}return pts.reverse();}
const SH0=shadeCurve([1,1,1]),SH1=shadeCurve([1,1,.3]);
const GLOB=SH1.reduce((a,p)=>p[1]>a[1]?p:a,[0,0]),LOC=SH1.filter(p=>p[0]>850).reduce((a,p)=>p[1]>a[1]?p:a,[0,0]);
function drawPts(c,pts,col,lw,f,dash){const n=Math.floor((pts.length-1)*f);if(n<1)return;ctx.beginPath();for(let i=0;i<=n;i++){const x=c.X(pts[i][0]),y=c.Y(pts[i][1]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
 ctx.strokeStyle=col;ctx.lineWidth=lw;if(dash)ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);}
function drawFn(c,fn,col,lw,f,dash){const n=Math.floor(VOC*f);ctx.beginPath();for(let v=0;v<=n;v+=4){const x=c.X(v),y=c.Y(fn(v));v?ctx.lineTo(x,y):ctx.moveTo(x,y);}
 ctx.strokeStyle=col;ctx.lineWidth=lw;if(dash)ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);}
function partialPt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
 let r=f*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,sp,col,a){if(a<=0)return;for(let k=0;k<n;k++){const f=(TT*sp+k/n)%1,p=partialPt(P,f);alphaDo(a,()=>circ(p[0],p[1],4,col));}}
function tbl(cx,o){o=o||{};const y=gy(cx),cy=y-62,tn=Math.tan(TA);
 ln([cx-60,y,cx-60,cy+60*tn],'#8a99a3',5);ln([cx+60,y,cx+60,cy-60*tn],'#8a99a3',5);
 ctx.save();ctx.translate(cx,cy);ctx.rotate(-TA);box(-TW/2,-8,TW,8,'#1f3f66','rgba(0,0,0,.4)',1);
 ctx.strokeStyle='rgba(160,200,240,.5)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<6;i++){ctx.moveTo(-TW/2+TW*i/6,-8);ctx.lineTo(-TW/2+TW*i/6,0);}ctx.stroke();
 box(-TW/2,-8,TW,1.6,o.glint?'#fff':'#9fc3e6');ctx.restore();}
function inverterBox(x){const y=gy(x);box(x-30,y-80,60,80,'#dfe5e8','rgba(0,0,0,.3)',1);box(x-21,y-66,42,12,'#2b3137');circ(x+16,y-34,3.5,E_G);
 for(let i=0;i<3;i++)ln([x-21,y-42+i*8,x+4,y-42+i*8],'rgba(0,0,0,.25)',2);}
function combiner(x){const y=gy(x);box(x-18,y-56,36,56,'#8d989f','rgba(0,0,0,.3)',1);box(x-11,y-46,22,14,'#2b3137');ln([x-12,y-24,x+12,y-24],'rgba(0,0,0,.3)',2);}
function transformer(x){const y=gy(x);box(x-34,y-62,68,62,'#6f7d86','rgba(0,0,0,.35)',1);for(let i=0;i<5;i++)ln([x-28+i*14,y-56,x-28+i*14,y-8],'rgba(0,0,0,.28)',3);
 [-18,0,18].forEach(d=>{ln([x+d,y-62,x+d,y-76],'#dfe5e8',3);circ(x+d,y-78,4,'#dfe5e8');});}
function pylon(x){const y=gy(x),h=210;ln([x-32,y,x-7,y-h],'#9aa8b1',4);ln([x+32,y,x+7,y-h],'#9aa8b1',4);
 for(let i=0;i<6;i++){const t0=i/6,t1=(i+1)/6,xl0=lerp(x-32,x-7,t0),xr0=lerp(x+32,x+7,t0),xl1=lerp(x-32,x-7,t1),xr1=lerp(x+32,x+7,t1),y0=y-h*t0,y1=y-h*t1;ln([xl0,y0,xr1,y1,xr0,y0,xl1,y1],'rgba(154,168,177,.7)',2);}
 ln([x-60,y-h+10,x+60,y-h+10],'#9aa8b1',4);ln([x-46,y-h+60,x+46,y-h+60],'#9aa8b1',4);
 [-60,60,-46,46].forEach((d,i)=>circ(x+d,y-h+(i<2?10:60)+6,3,'#dfe5e8'));}
function sine(x0,x1,yc,A,cyc,phi,f,col,lw,dash){const n=Math.floor((x1-x0)*f);if(n<2)return;ctx.beginPath();for(let i=0;i<=n;i++){const x=x0+i,y=yc-A*Math.sin(cyc*2*Math.PI*i/(x1-x0)+phi);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
 ctx.strokeStyle=col;ctx.lineWidth=lw;if(dash)ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);}

const EP={no:8,slug:'solar-pv',seriesName:'太陽光電系列',t:'變流器與最大功率追蹤',en:'Inverters and maximum power point tracking',
lede:'太陽光電板輸出的是直流電，電網需要的是穩定的 60 Hz 交流電，中間靠變流器轉換。這一集看變流器如何追著最大功率點跑、遇到遮蔭怎麼辦、直流怎麼切成交流，以及為什麼模組容量常常比變流器大。',
facts:[['1,500','V','大型地面型案場常見的直流系統電壓上限（1500 Vdc 機種）'],
['15','路 MPPT','單機 320 kW 的 1500 Vdc 組串式變流器示例機種，各路獨立追蹤'],
['99','%','部分變流器標示的最高轉換效率（原廠規格，實際依負載而異）'],
['1.15–1.30','倍','直流容量與變流器交流容量的常見比值（示例）'],
['60','Hz','台灣電網頻率，變流器輸出必須同頻同相'],
['3','段','一片模組常見的旁路二極體分段數，遮蔭時讓電流繞過被遮的一段']],
note:'說明：本集為教育用途示意動畫，設備、人物與距離比例經過調整。1500 Vdc 與單機 320 kW、15 組 MPPT 為業界 1500 Vdc 組串式機種示例（新望 PrimeVOLT 新聞報導）；最高轉換效率 99% 為台達變流器原廠標示；MPPT 以擾動觀察法為例，是常見做法之一；直交流容量比 1.15–1.30 為單一業界說明的常見範圍；台灣電網頻率為 60 Hz。電流—電壓曲線、遮蔭後的雙峰曲線、追蹤步長、一天的功率與削峰量、轉換效率與各項數據皆為典型範例，實際依模組、變流器型號與併網規範而定。',
base:()=>{landSky(GY,{sun:{x:1060,y:120},clouds:false});drawGround();},
shots:[
{t:'從直流到電網',en:'From DC to the grid',dur:12,side:true,
 d:'太陽光電板產生的是直流電，電壓會隨日照與溫度起伏，而電網需要的是穩定的 60 Hz 交流電，中間的橋梁就是變流器。數片模組串成一組串，電流在匯流箱彙整後送進變流器。變流器同時做兩件事：把直流轉成交流，並隨時調整工作點，讓模組輸出盡可能接近最大功率。轉出來的交流電再經變壓器升壓，接上電網。',
 s:[[0,'模組產生直流電，電壓隨日照起伏'],[.28,'組串的電流在匯流箱彙整，送進變流器'],[.54,'變流器把直流轉成交流，並追蹤最大功率'],[.78,'交流電經變壓器升壓，併入電網']],
 cam:u=>camMix({x:800,y:450,s:1},{x:1080,y:480,s:1.3},ease(seg(u,.3,.5))),
 draw(u){
  ROWS.forEach(x=>tbl(x,{glint:Math.sin(TT*1.3+x)>.96}));
  const y=gy(INVX);
  ln([ROWS[0]+60,gy(ROWS[0])-20,CBX,gy(CBX)-20,INVX-30,gy(INVX)-20],'#2b3137',2.5);
  ln([INVX+30,y-30,TRX-34,gy(TRX)-30],'#2b3137',2.5);ln([TRX+18,gy(TRX)-78,PYX-60,gy(PYX)-200,PYX-60,gy(PYX)-200],'#2b3137',2);
  combiner(CBX);inverterBox(INVX);transformer(TRX);pylon(PYX);
  flowDots([[ROWS[0]+60,gy(ROWS[0])-20],[CBX,gy(CBX)-20],[INVX-30,y-20]],9,.3,E_Y,seg(u,.1,.2));
  flowDots([[INVX+30,y-30],[TRX-34,gy(TRX)-30]],4,.45,E_G,seg(u,.52,.6));
  flowDots([[TRX+18,gy(TRX)-78],[PYX-60,gy(PYX)-200]],5,.4,E_G,seg(u,.74,.82));
  lab(ROWS[1],gy(ROWS[1])-70,'模組組串',{dx:-20,dy:-90,st:'l',a:band(u,.04,.28)});
  lab(CBX,gy(CBX)-56,'匯流箱',{dx:-40,dy:-90,a:band(u,.24,.52),minor:true});
  lab(INVX,y-80,'變流器',{dx:-10,dy:-100,st:'s',a:band(u,.36,.76)});
  lab(TRX,gy(TRX)-78,'升壓變壓器',{dx:30,dy:-90,a:band(u,.62,1)});
  lab(PYX,gy(PYX)-210,'併入電網',{dx:-40,dy:-10,st:'g',a:band(u,.7,1),minor:true});
 },
 hud(u){hudPanel(250,150,'變流器數據（示例）',seg(u,.05,.1),w=>{const k=ease(seg(u,.1,.5));
  hrow(56,'直流輸入',trf('{n} V',{n:Math.round(820*k)}),w,'#f2c230');hrow(88,'輸出功率',trf('{n} kW',{n:Math.round(260*k)}),w,'#fff');hrow(120,'轉換效率',trf('{n} %',{n:(98.6*k).toFixed(1)}),w,'#7dffc4');});}},

{t:'最大功率點',en:'The maximum power point',dur:13,
 d:'每一串模組的輸出不是固定值，而是一條電流—電壓曲線。電壓很低時電流很大、功率卻小；電壓接近開路電壓時電流急降，功率也趨近於零。電壓與電流相乘的功率，在中間某一點最高，稱為最大功率點（MPP）。日照變強、溫度升高時，整條曲線都會移動，最大功率點也跟著改變，所以變流器不能只守著一個固定電壓。',
 s:[[0,'組串的輸出是一條電流—電壓曲線'],[.3,'電壓與電流相乘，就是功率'],[.52,'調整工作電壓，功率先升後降'],[.74,'中間有一點功率最高，就是最大功率點']],
 draw(u){
  diagBG();
  card(60,160,940,640,{bg:'rgba(7,27,39,.75)'});
  const c=chartBox(90,190,880,560,{title:'組串的電流與功率（示例）',x0:0,x1:1200,y0:0,y1:12,xt:[0,300,600,900,1200],yt:[0,3,6,9,12],xl:'V',yl:''});
  wt(c.X(1200)-8,c.Y(12)+24,'單位：A／kW',15,'rgba(227,236,238,.75)',600,'right');
  const mp=mpp(1),vm=mp[0];
  drawFn(c,v=>ivI(v),E_B,3.5,ease(seg(u,.02,.12)));
  drawFn(c,v=>ivP(v),E_Y,3.5,ease(seg(u,.2,.34)));
  alphaDo(seg(u,.08,.14),()=>wt(c.X(250),c.Y(10)-14,'電流 I',17,'#7dc8dc',700,'center'));
  alphaDo(seg(u,.3,.36),()=>wt(c.X(330),c.Y(3.3)-36,'功率 P ＝ V × I',17,E_Y,700,'center'));
  const vop=u<.56?lerp(150,1050,ease(seg(u,.38,.56))):lerp(1050,vm,ease(seg(u,.58,.7)));
  const on=seg(u,.36,.4);
  alphaDo(on,()=>{ctx.setLineDash([5,5]);ln([c.X(vop),c.Y(0),c.X(vop),c.Y(ivI(vop))],'rgba(255,255,255,.5)',1.5);ctx.setLineDash([]);
   circ(c.X(vop),c.Y(ivI(vop)),7,E_B,'#fff',2);circ(c.X(vop),c.Y(ivP(vop)),7,E_Y,'#fff',2);});
  const fin=seg(u,.7,.78);
  alphaDo(fin,()=>{ring(c.X(vm),c.Y(mp[1]),16+2*Math.sin(TT*5),E_G,3);tag(c.X(vm)-20,c.Y(mp[1])-58,'最大功率點',{size:17,bg:E_G,fg:'#13232e',align:'center'});});
  card(1040,160,500,640,{bg:'rgba(7,27,39,.75)'});wt(1064,200,'工作點（示例）',20,E_Y,700);
  const R=[['電壓',trf('{n} V',{n:Math.round(vop)}),'#fff'],['電流',trf('{n} A',{n:ivI(vop).toFixed(1)}),'#7dc8dc'],['功率',trf('{n} kW',{n:ivP(vop).toFixed(1)}),E_Y]];
  R.forEach(([a,b,col],i)=>{const y=270+i*92;wt(1064,y,a,20,'rgba(227,236,238,.85)',600);wt(1516,y+6,b,40,col,700,'right',COND);ln([1064,y+26,1516,y+26],'rgba(255,255,255,.15)',1);});
  const r=vop<.85*vm?['電壓偏低','電流大、電壓小，功率未到頂',E_B]:(vop<1.04*vm?['最大功率點附近','電壓與電流的乘積最大',E_G]:['電壓偏高','電流急降，功率快速下滑','#ff9d7a']);
  alphaDo(on,()=>{card(1064,520,452,250,{bg:'rgba(255,255,255,.04)',st:'rgba(255,255,255,.18)'});
   tag(1088,556,r[0],{size:20,bg:r[2],fg:'#13232e'});wt(1088,640,r[1],18,'#fff',600);
   alphaDo(seg(u,.72,.8),()=>{wt(1088,692,'日照或溫度改變，曲線與高點就會移動',16,'rgba(227,236,238,.85)',500);wt(1088,724,'變流器要持續找到新的高點',16,E_Y,700);});});
 }},

{t:'追蹤演算法',en:'Tracking the peak',dur:13,
 d:'最大功率追蹤（MPPT）最常見的做法是擾動觀察法：變流器把工作電壓調高一小步，量測功率，變大就朝同方向再走一步，變小就反向。這個動作每秒重複多次，工作點便在最大功率點附近小幅來回。當雲飄過、日照突然下降，曲線與高點跟著移動，追蹤點也會沿著新的曲線，再爬上新的高點，讓發電量盡量不被浪費。',
 s:[[0,'變流器從較低的電壓開始，一步一步試'],[.28,'功率變大就往同方向，變小就反向'],[.56,'到了高點附近，工作點小幅來回'],[.76,'雲飄過、日照下降，追蹤點跟著移到新高點']],
 draw(u){
  diagBG();
  card(60,160,940,640,{bg:'rgba(7,27,39,.75)'});
  const k=1-.45*ease(seg(u,.64,.74));
  const c=chartBox(90,190,880,560,{title:'功率—電壓曲線（示例）',x0:0,x1:1200,y0:0,y1:10,xt:[0,300,600,900,1200],yt:[0,2,4,6,8,10],xl:'V',yl:''});
  wt(c.X(1200)-8,c.Y(10)+24,'單位：kW',15,'rgba(227,236,238,.75)',600,'right');
  alphaDo(.4*seg(u,.64,.74),()=>drawFn(c,v=>ivP(v),'rgba(227,236,238,.7)',2.5,1,true));
  drawFn(c,v=>ivP(v,k),E_Y,3.5,ease(seg(u,.02,.12)));
  let vd,pd;
  if(u<.64){const idx=Math.min(PO.length-1,Math.floor(seg(u,.1,.62)*PO.length));
   for(let i=0;i<idx;i++)alphaDo(.5,()=>circ(c.X(PO[i][0]),c.Y(PO[i][1]),4,'rgba(125,255,196,.8)'));
   vd=PO[idx][0];pd=ivP(vd);}
  else{const m=mpp(k)[0],a=ease(seg(u,.72,.9));vd=lerp(PO[PO.length-1][0],m,a)+(a>.95?40*Math.sin(TT*3):0);pd=ivP(vd,k);}
  alphaDo(seg(u,.08,.12),()=>{circ(c.X(vd),c.Y(pd),9,E_G,'#fff',2);});
  alphaDo(seg(u,.08,.24),()=>wt(c.X(200),c.Y(ivP(200))-34,'目前工作點',16,E_G,700,'center'));
  alphaDo(seg(u,.66,.76),()=>tag(c.X(520),c.Y(8.6)+4,'日照變弱，曲線與高點下移',{size:16,bg:'rgba(255,255,255,.2)',fg:'#fff',align:'center'}));
  card(1040,160,500,640,{bg:'rgba(7,27,39,.75)'});wt(1064,200,'擾動觀察法',20,E_Y,700);
  const ST=[['調高電壓一小步','每次約 40 V（示例）'],['比較功率','變大還是變小'],['決定方向','變大續走，變小反向']];
  const act=u>.1&&u<.64?Math.floor(TT*1.5)%3:-1;
  ST.forEach(([a,b],i)=>{const y=260+i*130,on=i===act;alphaDo(seg(u,.04+i*.04,.1+i*.04)*(on?1:.6),()=>{
   tag(1064,y,String(i+1),{size:20,bg:on?E_Y:'rgba(255,255,255,.25)',fg:on?'#13232e':'#fff'});wt(1116,y+7,a,20,'#fff',700);wt(1116,y+44,b,16,'rgba(227,236,238,.8)',500);});});
  alphaDo(seg(u,.2,.26),()=>{card(1064,650,452,120,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.4)'});
   wt(1088,692,'目前功率',18,'rgba(227,236,238,.85)',600);wt(1492,700,trf('{n} kW',{n:pd.toFixed(1)}),38,E_G,700,'right',COND);wt(1088,740,'追蹤點每秒更新多次',16,'rgba(227,236,238,.8)',500);});
 }},

{t:'遮蔭與多路追蹤',en:'Shading and multiple trackers',dur:14,
 d:'部分遮蔭會讓情況變複雜。一片模組內有三顆旁路二極體，被遮住的那一段電流較小，旁路二極體讓電流繞過它，功率—電壓曲線就出現兩個高點：一個局部峰值、一個全域最大值。簡單的追蹤演算法若從高電壓端往下找，可能停在局部峰值，因此變流器會定期做全域掃描。組串式變流器每一路都有獨立的 MPPT，遮蔭只影響被遮的那一路；集中式則整片共用一個追蹤點。',
 s:[[0,'沒有遮蔭時，曲線只有一個高點'],[.26,'一段模組被遮住，曲線變成兩個高點'],[.5,'從高電壓端往下找，容易停在局部峰值'],[.7,'全域掃描找到真正的最大值；各路獨立追蹤更有利']],
 draw(u){
  diagBG();
  card(60,160,940,640,{bg:'rgba(7,27,39,.75)'});
  const c=chartBox(90,190,880,560,{title:'部分遮蔭的功率—電壓曲線（示例）',x0:0,x1:1200,y0:0,y1:10,xt:[0,300,600,900,1200],yt:[0,2,4,6,8,10],xl:'V',yl:''});
  wt(c.X(1200)-8,c.Y(10)+24,'單位：kW',15,'rgba(227,236,238,.75)',600,'right');
  const sh=ease(seg(u,.22,.32));
  drawPts(c,SH0,sh>0?'rgba(227,236,238,.45)':E_Y,sh>0?2.5:3.5,ease(seg(u,.02,.14)),sh>0);
  drawPts(c,SH1,E_Y,3.5,sh);
  alphaDo(seg(u,.2,.3),()=>{const x=c.X(560),y=c.Y(9.4);circ(x,y,16,'#efe9d8');circ(x+9,y-6,9,'#e2dccb');wt(x+34,y+6,'一段被遮住',16,'#fff',700);});
  /* 追蹤點：從高電壓端往下，停在局部峰值；之後全域掃描 */
  const dStart=1090,lv=LOC[0],gv=GLOB[0];
  const dn=seg(u,.38,.5),sc=seg(u,.58,.7),jp=seg(u,.72,.8);
  let vd=dStart;if(u>=.38)vd=lerp(dStart,lv,ease(dn));if(u>=.58)vd=u<.7?lerp(lv,gv,ease(sc)):gv;
  const pd=SH1.reduce((a,p)=>Math.abs(p[0]-vd)<Math.abs(a[0]-vd)?p:a,SH1[0])[1];
  alphaDo(seg(u,.36,.4),()=>circ(c.X(vd),c.Y(pd),9,E_G,'#fff',2));
  alphaDo(seg(u,.5,.58)*(1-seg(u,.7,.74)),()=>{ring(c.X(lv),c.Y(LOC[1]),18,E_W,3);tag(c.X(lv)-20,c.Y(LOC[1])-58,trf('局部峰值 {n} kW',{n:LOC[1].toFixed(1)}),{size:16,bg:E_W,fg:'#fff',align:'center'});});
  alphaDo(seg(u,.72,.8),()=>{ring(c.X(gv),c.Y(GLOB[1]),18,E_G,3);tag(c.X(gv)+10,c.Y(GLOB[1])-58,trf('全域最大 {n} kW',{n:GLOB[1].toFixed(1)}),{size:16,bg:E_G,fg:'#13232e',align:'center'});});
  alphaDo(band(u,.58,.72),()=>wt(c.X(300),c.Y(8),'全域掃描中…',18,E_G,700,'center'));
  /* 右：集中式 vs 組串式 */
  card(1040,160,500,640,{bg:'rgba(7,27,39,.75)'});
  const blk=(y0,title,sub,n,col)=>{const a=seg(u,y0==200?.6:.76,y0==200?.68:.84);alphaDo(.25+.75*a,()=>{
   wt(1064,y0,title,20,col,700);
   for(let i=0;i<n;i++){const x=1076+i*44,bad=i===2;box(x,y0+30,34,22,bad?'#6b4a3a':'#1f3f66','rgba(160,200,240,.4)',1);
    if(n===6){ln([x+17,y0+52,x+17,y0+78],bad?E_W:E_Y,2);}}
   if(y0==200){ln([1093,y0+78,1337,y0+78],E_Y,2);box(1150,y0+78,130,34,'#dfe5e8','rgba(0,0,0,.3)',1);wt(1215,y0+102,'MPPT × 1',16,'#13232e',700,'center',COND);}
   else{for(let i=0;i<6;i++){const x=1076+i*44;box(x-3,y0+78,40,30,'#dfe5e8','rgba(0,0,0,.3)',1);wt(x+17,y0+99,'MPPT',11,'#13232e',700,'center',COND);}}
   wt(1064,y0+144,sub[0],17,'#fff',600);wt(1064,y0+172,sub[1],16,'rgba(227,236,238,.85)',500);});};
  blk(200,'集中式',['整片共用一個追蹤點','一路被遮，整片都被拖累'],6,'#ff9d7a');
  blk(480,'組串式',['每一路各自追蹤','遮蔭只影響被遮的那一路'],6,E_G);
 }},

{t:'直流怎麼變成交流',en:'How DC becomes AC',dur:13,
 d:'變流器內部用高速開關元件，例如 IGBT 或 MOSFET，把直流電切成一連串寬窄不同的脈衝，這個方法稱為脈波寬度調變（PWM）。脈衝寬的地方平均電壓高、窄的地方平均電壓低，再經過電感與電容組成的濾波器，就平滑成接近正弦的交流電。併網之前，變流器還要用鎖相迴路量測電網的頻率與相位，台灣是 60 Hz，輸出必須同頻同相，才能順利送電。',
 s:[[0,'直流電進入變流器，先接上開關橋'],[.26,'開關高速切換，切出寬窄不同的脈衝'],[.5,'濾波器把脈衝平均成平滑的弦波'],[.74,'鎖定電網的頻率與相位，才能併網']],
 draw(u){
  diagBG();
  card(60,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'變流器內部（示意）',20,E_Y,700);
  const B=[['直流輸入'],['開關橋'],['濾波器'],['交流輸出']];
  B.forEach((b,i)=>{const x=90+i*180,a=seg(u,.02+i*.07,.08+i*.07);alphaDo(.3+.7*a,()=>{box(x,236,140,70,'rgba(255,255,255,.06)',i==1?E_Y:'rgba(255,255,255,.3)',2);wt(x+70,279,b[0],19,'#fff',700,'center');if(i<3)arrow(x+146,271,x+174,271,'rgba(255,255,255,.6)',2.5);});});
  /* 橋式電路 */
  const a2=seg(u,.1,.2),pos=Math.sin(TT*1.8)>0;
  alphaDo(a2,()=>{
   ln([230,400,640,400],'#ff9d7a',3);ln([230,700,640,700],'#7dc8dc',3);wt(214,408,'＋',22,'#ff9d7a',700,'right');wt(214,708,'－',22,'#7dc8dc',700,'right');
   const LX=330,RX=540,sw=(x,y,on)=>{box(x-26,y-26,52,52,on?E_G:'#394650','rgba(255,255,255,.4)',1.5);ln([x-12,y+10,x+12,y-10],on?'#13232e':'rgba(255,255,255,.5)',3);};
   ln([LX,400,LX,700],'rgba(255,255,255,.45)',2);ln([RX,400,RX,700],'rgba(255,255,255,.45)',2);ln([LX,550,RX,550],'rgba(255,255,255,.45)',2);
   const P=pos?[[LX,400],[LX,550],[RX,550],[RX,700]]:[[RX,400],[RX,550],[LX,550],[LX,700]];
   if(u>.24){pathLine(P,E_Y,4,[8,6]);const f=(TT*.5)%1,p=partialPt(P,f);circ(p[0],p[1],6,E_Y);}
   sw(LX,475,pos);sw(LX,625,!pos);sw(RX,475,!pos);sw(RX,625,pos);
   circ(435,550,22,'#1b2126','rgba(255,255,255,.7)',2);wt(435,558,'AC',16,'#fff',700,'center',COND);
   wt(435,760,pos?'正半週：左上、右下導通':'負半週：右上、左下導通',17,E_Y,700,'center');});
  /* 右：波形 */
  card(840,160,700,640,{bg:'rgba(7,27,39,.75)'});
  const X0=880,X1=1500,N=40,pw=(X1-X0)/N;
  wt(864,200,'開關切出的脈衝（PWM）',19,E_Y,700);
  const fp=ease(seg(u,.2,.46));ln([X0,320,X1,320],'rgba(255,255,255,.25)',1.2);
  for(let i=0;i<N*fp;i++){const ph=(i+.5)/N*4*Math.PI,s=Math.sin(ph),w=Math.max(1.5,Math.abs(s)*pw*.9);box(X0+i*pw+(pw-w)/2,s>0?260:320,w,60,E_Y);}
  alphaDo(seg(u,.46,.54),()=>arrow(1190,420,1190,462,'rgba(255,255,255,.7)',2.5));
  alphaDo(seg(u,.46,.54),()=>wt(1210,448,'濾波',16,'rgba(227,236,238,.85)',600));
  wt(864,500,'濾波後的交流電',19,E_G,700);
  const phi=(1-ease(seg(u,.62,.78)))*1.4;ln([X0,640,X1,640],'rgba(255,255,255,.25)',1.2);
  sine(X0,X1,640,80,2,0,ease(seg(u,.5,.64)),'rgba(255,255,255,.8)',2.5,true);
  alphaDo(seg(u,.58,.66),()=>sine(X0,X1,640,80,2,phi,1,E_G,3.5));
  alphaDo(seg(u,.54,.62),()=>wt(X1,548,'電網 60 Hz',16,'rgba(227,236,238,.85)',600,'right'));
  alphaDo(seg(u,.8,.88),()=>tag(1190,760,'同頻同相，才能併網',{size:18,bg:E_G,fg:'#13232e',align:'center'}));
 }},

{t:'超配、削峰與併網保護',en:'Oversizing, clipping and grid protection',dur:13,
 d:'光電場設計時，直流側的模組容量常比變流器的交流額定容量大一些，兩者的比值稱為直交流容量比。因為模組很少在標稱功率下運轉，超配能讓早晚與陰天多發一些電；代價是中午晴朗時超出額定的部分會被削去，稱為削峰。比值要抓多少，得比較多發的電與削掉的電。另外，電網停電時變流器必須立即停止送電（防孤島），電壓或頻率異常也會自動解聯。',
 s:[[0,'模組直流容量，常比變流器額定大一些'],[.28,'中午超出額定的部分，會被削掉'],[.52,'早晚與陰天，反而能多發一點電'],[.76,'電網停電或異常時，變流器立即停止送電']],
 draw(u){
  diagBG();
  card(60,160,1000,640,{bg:'rgba(7,27,39,.75)'});
  const c=chartBox(90,190,940,470,{title:'晴天一天的功率（示例）',x0:6,x1:18,y0:0,y1:12,xt:[6,9,12,15,18],yt:[0,3,6,9,12],xl:'時',yl:''});
  wt(c.X(18)-8,c.Y(12)+24,'單位：MW',15,'rgba(227,236,238,.75)',600,'right');
  const P=h=>10.8*Math.pow(Math.max(0,Math.sin((h-6)/12*Math.PI)),1.2),LIM=10;
  const f=ease(seg(u,.04,.26));
  const clipA=ease(seg(u,.28,.4));
  if(clipA>0){ctx.beginPath();let st=false;const pts=[];for(let h=6;h<=18;h+=.05){if(P(h)>LIM)pts.push(h);}
   if(pts.length){ctx.moveTo(c.X(pts[0]),c.Y(LIM));pts.forEach(h=>ctx.lineTo(c.X(h),c.Y(P(h))));ctx.lineTo(c.X(pts[pts.length-1]),c.Y(LIM));ctx.closePath();alphaDo(clipA,()=>{ctx.fillStyle='rgba(232,87,42,.55)';ctx.fill();});}}
  ctx.beginPath();for(let h=6;h<=6+12*f+1e-6;h+=.05){const x=c.X(h),y=c.Y(P(h));h===6?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=E_Y;ctx.lineWidth=3.5;ctx.stroke();
  alphaDo(seg(u,.16,.24),()=>{ctx.setLineDash([8,6]);ln([c.X(6),c.Y(LIM),c.X(18),c.Y(LIM)],E_W,2.2);ctx.setLineDash([]);wt(c.X(18)-6,c.Y(LIM)+24,'變流器額定 10 MW',16,'#ff9d7a',700,'right');});
  alphaDo(seg(u,.14,.2),()=>wt(c.X(6.5),c.Y(8.4),'模組可發的功率',16,E_Y,700,'left'));
  alphaDo(seg(u,.32,.4),()=>wt(c.X(12),c.Y(11.4)-6,'削峰：損失的電',16,'#ff9d7a',700,'center'));
  alphaDo(seg(u,.52,.6),()=>{[[7.4,'早上多發'],[16.6,'傍晚多發']].forEach(([h,t])=>{arrow(c.X(h),c.Y(P(h))-6,c.X(h),c.Y(P(h))-46,E_G,2.5);wt(c.X(h),c.Y(P(h))-58,t,16,E_G,700,'center');});});
  alphaDo(seg(u,.2,.3),()=>{card(90,690,940,90,{bg:'rgba(242,194,48,.1)',st:'rgba(242,194,48,.5)'});
   wt(114,732,'直交流容量比 ＝ 12 MW ÷ 10 MW',20,'#fff',700);wt(1006,738,'1.2',40,E_Y,700,'right',COND);wt(114,764,'常見約 1.15–1.30（示例）',16,'rgba(227,236,238,.85)',500);});
  card(1100,160,440,640,{bg:'rgba(7,27,39,.75)'});wt(1124,200,'併網保護',20,E_Y,700);
  const L=[['防孤島','電網停電，立即停止送電'],['電壓頻率保護','超出範圍就自動解聯'],['延遲復歸','電網穩定一段時間再併回']];
  L.forEach(([a,b],i)=>{const k=seg(u,.64+i*.08,.72+i*.08),y=270+i*130;alphaDo(.25+.75*k,()=>{
   box(1124,y-26,14,92,k>.5?E_G:'rgba(255,255,255,.3)');wt(1156,y+4,a,20,'#fff',700);wt(1156,y+42,b,16,'rgba(227,236,238,.85)',500);});});
 }}
]};
