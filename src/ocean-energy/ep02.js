// KITS: land
/* 海洋能系列 第 2 集：潮流發電 */
const SURF=330,BED=800,TX=560,HY=610,CX=1340;          // 海面、海床、渦輪位置、輪轂高度、海岸
const PWR='#f2c230',WAV='#58b8d0',MAG='#b37cff';
function pl(P,col,lw){const a=[];P.forEach(p=>a.push(p[0],p[1]));ln(a,col,lw);}
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,sp,r){if(a<=0)return;for(let k=0;k<n;k++){const f=((TT*(sp||.3))+k/n)%1,p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4.5,col));}}
/* 水流線：ph 為累積位移（px），v 為目前流速（m/s，決定線長與透明度） */
function streaks(x0,x1,y0,y1,n,ph,v,seed,col){const R=rng(seed||3),W=x1-x0,L=10+Math.abs(v)*14,dir=v>=0?1:-1;
  for(let i=0;i<n;i++){const bx=R()*W,y=y0+R()*(y1-y0),sp=.7+R()*.6,x=x0+(((bx+ph*sp)%W)+W)%W;
   alphaDo(clamp(Math.abs(v)/2.5)*.7*(Math.min(x-x0,x1-x)>40?1:Math.min(x-x0,x1-x)/40),()=>ln([x,y,x-dir*L,y],col||'rgba(227,240,245,.75)',2));}}
/* 側視轉子：轉子平面垂直水流，看到的是葉片的投影 */
function rotorSide(x,y,R,ang,s){s=s||1;for(let k=0;k<3;k++){const a=ang+k*TAU/3,ty=y+R*Math.cos(a),tx=x-R*Math.sin(a)*.16;
  poly([x-7*s,y,x+7*s,y,tx+2.5*s,ty,tx-2.5*s,ty],'#e3e8ec','rgba(0,0,0,.35)',1);}
  ctx.beginPath();ctx.ellipse(x-6*s,y,14*s,16*s,0,0,TAU);ctx.fillStyle='#f2c230';ctx.fill();}
/* 海床式潮流渦輪：nac=false 只畫基座 */
function seabedTurbine(x,hy,bed,s,ang,o){o=o||{};const cx=x+45*s;
  ln([x-70*s,bed,cx,bed-50*s,x+150*s,bed],'#8d989f',8*s);ln([cx,bed-50*s,cx,bed],'#8d989f',8*s);
  [x-70*s,x+150*s,cx].forEach(px=>box(px-22*s,bed-16*s,44*s,16*s,'#6a747a','rgba(0,0,0,.35)',1));
  box(cx-11*s,hy+10*s,22*s,bed-50*s-hy-10*s,'#c9d1d6','rgba(0,0,0,.3)',1);
  if(o.nac!==false)nacelle(x,hy,s,ang);}
function nacelle(x,hy,s,ang){rrp(x-6*s,hy-18*s,112*s,36*s,14*s);ctx.fillStyle='#e3e8ec';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.2;ctx.stroke();
  box(x+20*s,hy-4*s,70*s,6*s,'#e8572a');rotorSide(x-14*s,hy,120*s,ang,s);}
const P_CAB=()=>[[TX+150,BED-6],[1000,BED-4],[CX,BED-6],[1400,600],[1450,SURF+10],[1480,SURF-22],[1560,SURF-30]];
function coast(){poly([CX,1000,CX,BED,1400,600,1450,SURF+10,1480,SURF-20,1800,SURF-30,1800,1000],'#8c7a5e');
  poly([1450,SURF+10,1480,SURF-20,1800,SURF-30,1800,SURF-14,1490,SURF-6],'#7a9a55');
  const x=1530,g=SURF-30;fence(x-10,x+120,g+2);box(x+14,g-50,74,46,'#8d989f','rgba(0,0,0,.3)',1);for(let i=0;i<3;i++){box(x+24+i*22,g-72,6,22,'#c9d1d6');circ(x+27+i*22,g-74,4,'#e3e8ec');}}
function island(){poly([60,SURF,110,SURF-26,180,SURF-44,260,SURF-38,330,SURF-20,400,SURF],'#6f8a72');}
function waterBody(){const g=ctx.createLinearGradient(0,SURF,0,BED);g.addColorStop(0,'#2a7fa0');g.addColorStop(1,'#123c55');
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(-200,1000);for(let x=-200;x<=1800;x+=10)ctx.lineTo(x,SURF+3*Math.sin(x*.03-TT*2)+2*Math.sin(x*.011+TT));ctx.lineTo(1800,1000);ctx.closePath();ctx.fill();
  box(-200,BED,2000,200,'#b59a6a');box(-200,BED,2000,8,'#9c845a');
  const R=rng(9);for(let i=0;i<40;i++){const x=R()*1600-100,y=BED+14+R()*160;circ(x,y,2+R()*3,'rgba(80,60,40,.35)');}}
function fishes(){for(let i=0;i<4;i++){const x=((TT*40+i*330)%1700)-50,y=430+50*Math.sin(i*2.1)+8*Math.sin(TT+i);poly([x,y,x-22,y-7,x-22,y+7],'rgba(10,40,60,.6)');poly([x-22,y,x-32,y-6,x-32,y+6],'rgba(10,40,60,.6)');}}
function channelScene(ph,v){landSky(SURF,{clouds:false});island();waterBody();streaks(-100,1340,SURF+30,BED-20,46,ph,v,4);fishes();pl(P_CAB(),'#1a1a1a',4);coast();}
/* 半日潮流速（m/s，正為漲潮流向） */
const tideV=h=>2.8*Math.sin(TAU*h/12.42);
const tPow=v=>{const a=Math.abs(v);return a<1?0:Math.min(1,(a*a*a-1)/(2.5*2.5*2.5-1));};
/* 安裝分鏡的流速與累積位移 */
const insV=u=>u<.3?lerp(2.4,.2,ease(u/.3)):u<.8?.2:lerp(.2,.9,seg(u,.8,1));
const insPh=u=>{let s=0;const n=40;for(let i=0;i<n;i++)s+=insV(u*i/n)*u/n;return s*13*60+TT*12;};
/* 台灣輪廓（經緯度） */
const TW=[[121.5,25.3],[121.9,25.12],[122.0,25.0],[121.85,24.6],[121.8,24.3],[121.6,23.9],[121.5,23.4],[121.3,22.9],[121.0,22.6],[120.85,21.92],[120.7,22.0],[120.6,22.3],[120.3,22.55],[120.15,22.9],[120.1,23.1],[120.15,23.5],[120.3,23.9],[120.6,24.3],[120.8,24.6],[121.0,24.9],[121.2,25.1],[121.4,25.25]];

const EP={no:2,slug:'ocean-energy',seriesName:'海洋能系列',t:'潮流發電',en:'Tidal stream power',
lede:'月球與太陽的引力讓海面每天漲落兩次，海水在海峽與水道間來回奔流。這一集從潮汐的成因談起，看潮流渦輪如何像水下風機一樣發電，為什麼海水的流速稍微增加、能量就大幅上升，比較海床固定式與浮動式兩種設計，再看安裝如何搶在平潮時段進行，以及台灣的潮流能潛力。',
facts:[['約 12.4','小時','半日潮的週期，一天約有兩次漲潮流與兩次退潮流'],
['約 830','倍','海水密度約 1,025 kg/m³，約為空氣的 830 倍'],
['8','倍','潮流功率與流速三次方成正比，流速加倍、功率變 8 倍'],
['6','MW','蘇格蘭 MeyGen 第一期：4 部 1.5 MW 海床式渦輪'],
['10.2','GWh','MeyGen 第一期 2023 年的淨發電量'],
['3.5','m/s','台灣北端富貴角外海實測的最大表層流速']],
note:'說明：本集為教育用途示意動畫，渦輪外觀、水深與流速比例經過壓縮調整。潮流功率 P = ½ρAv³ 為流體力學通用式（海水密度取 1,025 kg/m³）；月球引潮力約為太陽的 2.2 倍、半日潮週期約 12.42 小時、大小潮週期約 14.8 天為海洋學通用數值；MeyGen 第一期 4 部 1.5 MW、轉子直徑 18 m、高 22.5 m、約 1,500 噸、水深約 35 m、流速可達 5 m/s 與 2023 年淨發電 10.2 GWh 取自 SAE Renewables 公開資料與相關報導；Orbital O2 全長 72 m、2 部 1 MW、轉子直徑 20 m 取自 Orbital Marine Power 與 EMEC 公開資料；富貴角流速取自發表於期刊的實測研究；澎湖吼門水道潛能、2012 年澎湖跨海大橋試驗平台與基隆嶼至和平島間的全潛式機組測試取自國內大學研究與報導。每日流速曲線、出力、轉速與安裝時段等數值為典型範例。',
base:()=>channelScene(TT*60*2.4,2.4),
shots:[
{t:'海峽中的潮流渦輪',en:'A tidal turbine in the channel',dur:13,side:true,
 d:'潮流發電把海水流動的動能轉成電力，原理和風力發電很像：水流推動轉子葉片，帶動機艙裡的發電機。差別在於渦輪整座沉在水下，通常設在島嶼與陸地之間的狹窄水道，因為海水被擠進窄處，流速會明顯加快。以蘇格蘭 MeyGen 為例，渦輪安裝在約 35 m 深的海床上，轉子直徑 18 m，電力經海底電纜送到岸上變電站併網，海面上幾乎看不到設施。',
 s:[[0,'島嶼與陸地之間的水道，潮流來回奔流'],[.26,'整座渦輪沉在海床上，水流推動轉子'],[.52,'機艙內的發電機把轉動變成電力'],[.76,'電力經海底電纜送上岸併網']],
 cam:u=>camMix({x:800,y:470,s:1},{x:720,y:560,s:1.2},ease(seg(u,.1,.6))),
 draw(u){seabedTurbine(TX,HY,BED,1,TT*1.3);},
 fx(u){
  flowDots(P_CAB(),8,PWR,band(u,.74,1),.25,4);
  alphaDo(band(u,.02,.28),()=>{arrow(140,450,330,450,'#7dffc4',4);});
  lab(240,450,'潮流',{dx:0,dy:-60,st:'g',a:band(u,.02,.3)});
  lab(TX-14,HY-120,'轉子葉片',{dx:-110,dy:-50,st:'s',a:band(u,.24,.52)});
  lab(TX+45,BED-50,'海床基座',{dx:-150,dy:20,a:band(u,.26,.52)});
  lab(TX+60,HY,'發電機（機艙）',{dx:120,dy:-80,st:'s',a:band(u,.5,.76)});
  lab(1100,BED-4,'海底電纜',{dx:0,dy:-60,st:'s',a:band(u,.74,1)});
  lab(1560,SURF-80,'岸上變電站',{dx:-60,dy:-50,st:'g',a:band(u,.78,1),minor:true});
 },
 hud(u){hudPanel(240,150,'流況與出力（示例）',seg(u,.05,.1),w=>{const v=2.4+.15*Math.sin(TT*.7),p=1.5*tPow(v)*ease(seg(u,.48,.6));
  hrow(56,'流速',trf('{n} m/s',{n:v.toFixed(1)}),w,WAV);hrow(88,'轉速','12 rpm',w,'#fff');hrow(120,'輸出',trf('{n} MW',{n:p.toFixed(2)}),w,PWR);});}},

{t:'潮汐從哪裡來',en:'Where tides come from',dur:14,
 d:'潮汐來自月球與太陽的引潮力。月球把地球朝向它的一側海水拉近，背對的一側則因離心作用同樣隆起，形成兩個海水隆起。地球每天自轉一圈，海岸會經過兩次隆起，所以多數地方一天有兩次高潮、兩次低潮，週期約 12.4 小時。太陽的引潮力約為月球的一半；新月與滿月時日月成一直線，力量相加形成大潮，上下弦月時互相抵消成小潮，大小潮約每 14.8 天循環一次。',
 s:[[0,'月球的引力讓海水在兩側隆起'],[.26,'地球自轉，海岸一天經過兩次高潮'],[.5,'日月成一直線時形成大潮'],[.74,'日月成直角時形成小潮，約 14.8 天循環']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'月球、地球與兩個隆起',20,'#f2c230',700);
  const ex=330,ey=390,ma=0;
  ctx.save();ctx.translate(ex,ey);ctx.beginPath();ctx.ellipse(0,0,150,112,ma,0,TAU);ctx.fillStyle='rgba(88,184,208,.45)';ctx.fill();ctx.strokeStyle='#7dc8dc';ctx.lineWidth=2;ctx.stroke();ctx.restore();
  circ(ex,ey,96,'#2f5d46','rgba(255,255,255,.3)',1.5);circ(ex,ey,96,'rgba(31,127,153,.25)');
  /* 自轉中的海岸點 */
  const ra=TT*.9,px=ex+96*Math.cos(ra),py=ey+96*Math.sin(ra),tide=Math.abs(Math.cos(ra));
  const pa=seg(u,.24,.3);alphaDo(pa,()=>{circ(px,py,8,PWR);arrow(ex+60*Math.cos(ra-.5),ey+60*Math.sin(ra-.5),ex+60*Math.cos(ra-.1),ey+60*Math.sin(ra-.1),'rgba(227,236,238,.7)',2);
   wt(ex,ey+8,tide>.6?'高潮':tide<.4?'低潮':'',20,PWR,700,'center');});
  circ(690,ey,28,'#cfd6da','rgba(0,0,0,.3)',1);wt(690,ey+60,'月球',18,'#fff',700,'center');
  alphaDo(seg(u,.04,.12),()=>{arrow(500,ey,620,ey,'rgba(227,236,238,.8)',2.5);wt(560,ey-16,'引潮力',17,'rgba(227,236,238,.9)',600,'center');});
  wt(ex,ey+146,'兩個隆起',18,'#7dc8dc',700,'center');
  /* 底部：大潮與小潮 */
  const mini=(x,lab,col,a,perp)=>alphaDo(a,()=>{card(x,570,330,214,{bg:'rgba(7,27,39,.9)',st:col});wt(x+20,606,lab,19,col,700);
   const cy=690,sx=x+44,exx=x+180;circ(sx,cy,18,'#ffd36b');wt(sx,cy+44,'太陽',16,'#ffd36b',700,'center');
   ctx.save();ctx.translate(exx,cy);ctx.beginPath();if(perp)ctx.ellipse(0,0,46,40,0,0,TAU);else ctx.ellipse(0,0,60,34,0,0,TAU);ctx.fillStyle='rgba(88,184,208,.5)';ctx.fill();ctx.restore();circ(exx,cy,26,'#2f5d46');
   const mx=perp?exx:x+290,my=perp?cy-62:cy;circ(mx,my,10,'#cfd6da');});
  mini(80,'大潮：日月成一直線','#7dffc4',seg(u,.5,.56),false);
  mini(430,'小潮：日月成直角','#ff8a60',seg(u,.74,.8),true);
  /* 右：潮位圖 */
  card(820,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(844,196,'15 天的潮位變化（示意）',20,'#f2c230',700);
  const c=chartBox(840,220,680,520,{x0:0,x1:15,y0:-2,y1:2,xt:[0,3,6,9,12,15],yt:[-2,-1,0,1,2],xl:'天',yl:'潮位（m）'});
  const f=ease(seg(u,.06,.5)),P=[];for(let i=0;i<=900;i++){const d=15*i/900,h=1.3*(1+.46*Math.cos(TAU*d/14.77))*Math.cos(TAU*d*24/12.42)/1.46*1.4;P.push({x:c.X(d),y:c.Y(h)});}
  pathLine(partial(P,f),'#7dc8dc',1.6);
  alphaDo(seg(u,.5,.56),()=>{ring(c.X(.4),c.Y(1.75),14,'#7dffc4',2);wt(c.X(.6),c.Y(1.92),'大潮',17,'#7dffc4',700,'left');ring(c.X(14.6),c.Y(1.6),14,'#7dffc4',2);});
  alphaDo(seg(u,.74,.8),()=>{ring(c.X(7.4),c.Y(.75),14,'#ff8a60',2);wt(c.X(7.4),c.Y(1.3),'小潮',17,'#ff8a60',700,'center');
   ctx.setLineDash([6,6]);ln([c.X(0),c.Y(-1.95),c.X(14.77),c.Y(-1.95)],'rgba(242,194,48,.6)',1.5);ctx.setLineDash([]);wt(c.X(7.4),c.Y(-1.7),'約 14.8 天',17,PWR,700,'center',COND);});
 }},

{t:'漲潮流與退潮流',en:'Flood and ebb currents',dur:13,
 d:'潮位升降時，海水在水道中來回流動：漲潮時往一個方向流，退潮時反向，中間約有短暫的平潮，流速接近零。所以潮流渦輪的出力也是一天四次由低到高、再由高到低。機組在流速約 1 m/s 時開始發電，到額定流速後維持滿載。轉子必須能兩個方向都發電，有的機組讓機艙轉向，有的把葉片角度翻轉 180 度。潮流的時間和大小可以依天文計算提前多年預測，這是它和風、太陽最大的不同。',
 s:[[0,'漲潮流與退潮流，一天來回兩次'],[.26,'流速在平潮時接近零，再反向增加'],[.52,'流速超過約 1 m/s 開始發電，到額定後滿載'],[.76,'潮流可依天文計算提前多年預測']],
 draw(u){
  diagBG();
  const hr=lerp(0,25,u),v=tideV(hr);
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'水道剖面：流向反轉',20,'#f2c230',700);
  box(80,250,680,360,'rgba(29,102,144,.55)');box(80,610,680,40,'#b59a6a');
  /* 流線 */
  const R=rng(11);for(let i=0;i<22;i++){const bx=R()*680,y=270+R()*320,x=80+((bx+TT*v*90)%680+680)%680,L=10+Math.abs(v)*12;alphaDo(clamp(Math.abs(v)/2)*.8,()=>ln([x,y,x-Math.sign(v)*L,y],'rgba(227,240,245,.8)',2));}
  /* 渦輪：依流向轉身 */
  const flip=v<0?-1:1,ang=TT*1.4*tPow(v)+TT*.2;ctx.save();ctx.translate(420,450);ctx.scale(flip*.9,.9);
  box(34,20,18,170,'#c9d1d6');rrp(-6,-18,112,36,14);ctx.fillStyle='#e3e8ec';ctx.fill();rotorSide(-14,0,110,ang,.9);ctx.restore();
  const dir=Math.abs(v)<.5?'平潮':v>0?'漲潮流':'退潮流',dc=Math.abs(v)<.5?'rgba(227,236,238,.9)':v>0?'#7dffc4':'#7dc8dc';
  tag(420,290,dir,{bg:'rgba(7,27,39,.85)',fg:dc,size:20,align:'center'});
  if(Math.abs(v)>=.5)arrow(v>0?220:620,700,v>0?620:220,700,dc,4);
  wt(420,752,trf('流速 {n} m/s',{n:Math.abs(v).toFixed(1)}),22,dc,700,'center',COND);
  /* 右：流速與出力 */
  card(820,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(844,196,'一天的流速與出力（示例）',20,'#f2c230',700);
  const c=chartBox(840,220,680,500,{x0:0,x1:25,y0:-3,y1:3,xt:[0,6,12,18,24],yt:[-3,-2,-1,0,1,2,3],xl:'小時',yl:'m/s'});
  ln([c.X(0),c.Y(0),c.X(25),c.Y(0)],'rgba(255,255,255,.3)',1);
  const pa=seg(u,.5,.56);if(pa>0)alphaDo(pa*.8,()=>{ctx.beginPath();ctx.moveTo(c.X(0),c.Y(-3));for(let i=0;i<=250;i++){const h=hr*i/250;ctx.lineTo(c.X(h),c.Y(-3+2*tPow(tideV(h))));}ctx.lineTo(c.X(hr),c.Y(-3));ctx.closePath();ctx.fillStyle='rgba(242,194,48,.45)';ctx.fill();});
  const P=[];for(let i=0;i<=250;i++){const h=hr*i/250;P.push({x:c.X(h),y:c.Y(tideV(h))});}pathLine(P,'#7dc8dc',3);
  circ(c.X(hr),c.Y(v),7,'#fff');
  alphaDo(seg(u,.26,.32),()=>{[6.21,12.42,18.63].forEach(h=>{if(h<=hr)ring(c.X(h),c.Y(0),10,'rgba(227,236,238,.9)',2);});wt(c.X(6.21),c.Y(.35),'平潮',16,'rgba(227,236,238,.9)',700,'center');});
  alphaDo(pa,()=>{wt(c.X(24.6),c.Y(-2.55),'出力',17,PWR,700,'right');ctx.setLineDash([5,5]);ln([c.X(0),c.Y(1),c.X(25),c.Y(1)],'rgba(242,194,48,.5)',1.2);ctx.setLineDash([]);wt(c.X(24.6),c.Y(1.15),'約 1 m/s 開始發電',16,PWR,600,'right');});
  alphaDo(seg(u,.76,.82),()=>{card(870,740,620,48,{bg:'rgba(125,255,196,.12)',st:'rgba(125,255,196,.6)'});wt(1180,772,'潮汐表可提前多年預測發電量',19,'#7dffc4',700,'center');});
 }},

{t:'為什麼海水流得慢也有力',en:'Why slow water is powerful',dur:13,
 d:'流體的功率可寫成 P = ½ρAv³：ρ 是密度、A 是轉子掃掠面積、v 是流速。海水的密度約 1,025 kg/m³，約為空氣的 830 倍，所以每秒 2 到 3 m 的潮流，每平方公尺就帶有數千到上萬瓦的功率，同樣出力所需的轉子比風機小得多。功率又與流速的三次方成正比，流速加倍、功率變成 8 倍，因此選址最重視流速。轉子實際只能擷取其中約 35 到 45%。',
 s:[[0,'功率 P = ½ρAv³，密度與流速是關鍵'],[.26,'海水密度約為空氣的 830 倍'],[.5,'流速加倍，功率變成 8 倍'],[.76,'所以潮流渦輪要找流速最快的水道']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'海水與空氣的密度',20,'#f2c230',700);
  alphaDo(seg(u,.02,.08),()=>{card(90,220,660,70,{bg:'rgba(242,194,48,.12)',st:'rgba(242,194,48,.6)'});wt(420,267,'P = ½ ρ A v³',28,PWR,700,'center',COND);});
  const da=ease(seg(u,.24,.4));
  box(140,340,560,56,'rgba(255,255,255,.08)');box(140,340,560*da,56,'#58b8d0');wt(150,326,'海水 1,025 kg/m³',18,'#7dc8dc',700,'left');
  box(140,450,560,56,'rgba(255,255,255,.08)');box(140,450,Math.max(3,560*da/830),56,'#e3e8ec');wt(150,436,'空氣 1.2 kg/m³',18,'#fff',700,'left');
  alphaDo(seg(u,.32,.38),()=>wt(700,540,'約 830 倍',26,PWR,700,'right',COND));
  /* 轉子大小比較 */
  const ra=seg(u,.38,.46);alphaDo(ra,()=>{wt(84,600,'同樣出力，轉子小得多（示意）',18,'rgba(227,236,238,.9)',600);
   ring(230,710,36,'#7dc8dc',3);circ(230,710,5,'#7dc8dc');wt(300,716,'潮流渦輪',17,'#7dc8dc',700,'left');
   ring(560,710,82,'rgba(227,236,238,.6)',2);circ(560,710,5,'#fff');wt(652,716,'風機',17,'#fff',700,'left');});
  /* 右：功率密度曲線 */
  card(820,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(844,196,'每平方公尺的潮流功率',20,'#f2c230',700);
  const c=chartBox(840,220,680,520,{x0:0,x1:4,y0:0,y1:35,xt:[0,1,2,3,4],yt:[0,10,20,30],xl:'流速 v（m/s）',yl:'kW/m²'});
  const pd=v=>.5*1.025*v*v*v,f=ease(seg(u,.08,.5)),P=[];for(let i=0;i<=60;i++){const v=4*i/60;P.push({x:c.X(v),y:c.Y(pd(v))});}pathLine(partial(P,f),'#7dc8dc',3);
  const mk=(v,a,col)=>alphaDo(a,()=>{const x=c.X(v),y=c.Y(pd(v));circ(x,y,7,col);ln([x,y,x,c.Y(0)],col,1.5);wt(x-12,y-14,trf('{n} kW/m²',{n:pd(v).toFixed(1)}),18,col,700,'right',COND);});
  mk(1.5,seg(u,.5,.56),'#7dffc4');mk(3,seg(u,.56,.62),PWR);
  alphaDo(seg(u,.6,.66),()=>{card(c.X(.3),c.Y(30),300,80,{bg:'rgba(7,27,39,.92)',st:PWR});wt(c.X(.3)+150,c.Y(30)+34,'流速 1.5 → 3 m/s',18,'#fff',700,'center');wt(c.X(.3)+150,c.Y(30)+66,'功率 × 8',22,PWR,700,'center',COND);});
  alphaDo(seg(u,.76,.82),()=>wt(1510,770,'實際可擷取約 35–45%',17,'rgba(227,236,238,.85)',600,'right'));
 }},

{t:'海床固定式與浮動式',en:'Seabed-mounted vs floating',dur:14,
 d:'潮流渦輪主要有兩種固定方式。海床固定式把整座機組放在海底，以三腳架與壓艙塊靠重量站穩，不受海面風浪影響，也不妨礙船隻通行，但維修要用大型工作船把機艙吊上來。浮動式把轉子掛在浮體下方，以錨鏈固定在海床，可以利用接近海面、流速較快的水層，維修時把轉子腳架升出水面即可作業，但要承受風浪與颱風的負載。蘇格蘭的 MeyGen 與 Orbital O2 分別是兩種型式的代表。',
 s:[[0,'海床固定式：三腳架與壓艙塊靠重量站穩'],[.26,'不受風浪影響，但維修要吊起機艙'],[.5,'浮動式：轉子掛在浮體下方，以錨鏈固定'],[.76,'轉子腳架可升出水面，維修較方便']],
 draw(u){
  diagBG();
  const L=band(u,0,1),R=seg(u,.48,.54),hl=on=>on?'rgba(242,194,48,.7)':'rgba(255,255,255,.12)';
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)',st:hl(u<.5)});wt(84,196,'海床固定式',20,'#f2c230',700);
  card(820,150,720,650,{bg:'rgba(7,27,39,.75)',st:hl(u>=.5)});wt(844,196,'浮動式',20,'#f2c230',700);
  /* 左：水體 */
  box(80,240,680,300,'rgba(29,102,144,.5)');box(80,540,680,24,'#b59a6a');
  for(let i=0;i<10;i++){const x=80+((i*68+TT*80)%680);alphaDo(.5,()=>ln([x,300+i%4*60,x-20,300+i%4*60],'rgba(227,240,245,.8)',2));}
  seabedTurbine(330,400,540,.62,TT*1.2);
  alphaDo(seg(u,.02,.08),()=>{wt(560,330,'MeyGen AR1500',18,'#fff',700,'left',COND);wt(560,362,'1.5 MW・轉子 18 m',17,'rgba(227,236,238,.85)',600,'left');wt(560,392,'高 22.5 m・約 1,500 t',17,'rgba(227,236,238,.85)',600,'left');});
  /* 右：浮動式 */
  box(840,280,680,284,'rgba(29,102,144,.5)');  ctx.beginPath();ctx.moveTo(840,280);for(let x=840;x<=1520;x+=6)ctx.lineTo(x,280+4*Math.sin(x*.04-TT*2));ctx.strokeStyle='#7dc8dc';ctx.lineWidth=2;ctx.stroke();
  const fx0=1020,fy0=282+3*Math.sin(TT*1.2),up=seg(u,.76,.86);
  rrp(fx0,fy0-14,320,28,12);ctx.fillStyle='#e3b53a';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1.2;ctx.stroke();
  [fx0+30,fx0+290].forEach(lx=>{const ang=lerp(0,Math.PI*.5,ease(up))*(lx<fx0+160?1:-1);
   ctx.save();ctx.translate(lx,fy0);ctx.rotate(ang);box(-7,0,14,120,'#c9d1d6','rgba(0,0,0,.3)',1);ctx.translate(0,140);
   rrp(-10,-14,40,28,10);ctx.fillStyle='#e3e8ec';ctx.fill();rotorSide(-14,0,60,TT*1.5*(1-up),.6);ctx.restore();});
  alphaDo(L,()=>{ln([fx0+10,fy0+10,880,560],'#5c6770',2.5);ln([fx0+310,fy0+10,1490,560],'#5c6770',2.5);});
  box(840,560,680,24,'#b59a6a');
  alphaDo(R,()=>{wt(860,250,'Orbital O2',18,'#fff',700,'left',COND);wt(1500,250,'全長 72 m・2 × 1 MW・轉子 20 m',17,'rgba(227,236,238,.85)',600,'right');});
  alphaDo(R,()=>wt(880,540,'錨鏈',16,'rgba(227,236,238,.85)',600,'left'));
  /* 優缺點 */
  const pc=(x,y,good,bad,a1,a2)=>{alphaDo(a1,()=>{tag(x,y,'優點',{bg:'rgba(125,255,196,.2)',fg:'#7dffc4',size:16});wt(x+76,y+6,good,18,'#fff',600,'left');});
   alphaDo(a2,()=>{tag(x,y+60,'限制',{bg:'rgba(232,87,42,.2)',fg:'#ff8a60',size:16});wt(x+76,y+66,bad,18,'#fff',600,'left');});};
  pc(100,640,'不受風浪影響、不妨礙航行','維修需大型船吊起機艙',seg(u,.02,.08),seg(u,.26,.32));
  pc(860,640,'利用表層較快的流速','需承受風浪與颱風負載',seg(u,.5,.56),seg(u,.5,.56));
  alphaDo(seg(u,.76,.82),()=>wt(1500,740,'腳架升起，在水面上維修',17,'#7dffc4',700,'right'));
 }},

{t:'搶在平潮時安裝',en:'Installing at slack water',dur:13,side:true,
 d:'潮流渦輪設在流速最快的地方，安裝與維修卻需要水流平靜。工作船先以動態定位停在基座正上方，等潮流減慢；平潮時段通常只有數十分鐘到一兩個小時，船上的吊機要在這段時間內把機艙與轉子放到海床基座上，以導引機構對準並鎖固，再把機組電纜接上海底電纜。錯過平潮就得等下一次，大約六個多小時後。作業規劃會依潮汐表與天氣預報排定時程。',
 s:[[0,'工作船停在基座上方，等待潮流減慢'],[.3,'平潮時段開始，吊機放下機艙與轉子'],[.62,'機艙對準基座並鎖固'],[.82,'接上電纜，潮流再起前完成作業']],
 base:u=>channelScene(insPh(u),insV(u)),
 cam:u=>camMix({x:760,y:470,s:1.05},{x:700,y:520,s:1.15},ease(seg(u,.3,.7))),
 draw(u){
  const ny=lerp(SURF-10,HY,ease(seg(u,.3,.72))),bx=TX+45;
  seabedTurbine(TX,HY,BED,1,0,{nac:false});
  /* 工作船 */
  const vy=SURF+2*Math.sin(TT*1.3);poly([TX-260,vy-30,TX+300,vy-30,TX+270,vy+16,TX-230,vy+16],'#c74a2a','rgba(0,0,0,.35)',1.5);
  box(TX-230,vy-90,110,60,'#e3e8ec','rgba(0,0,0,.3)',1);box(TX-215,vy-80,80,16,'#1f7f99');
  ln([TX+250,vy-30,TX+250,vy-100,bx,vy-112],'#e9b21f',8);
  ln([bx,vy-112,bx,ny-24],'#2a3a46',2);box(bx-10,ny-30,20,10,'#e9b21f');
  ctx.save();ctx.beginPath();ctx.rect(-200,-200,2000,ny+400);ctx.clip();nacelle(TX,ny,1,.3);ctx.restore();
  const ca=seg(u,.82,.9);if(ca>0)alphaDo(ca,()=>ln([bx,BED-44,TX+150,BED-6],'#1a1a1a',4));
 },
 fx(u){
  lab(TX-180,SURF-60,'工作船（動態定位）',{dx:120,dy:-60,a:band(u,.02,.3)});
  lab(TX+45,BED-50,'海床基座',{dx:-150,dy:-30,a:band(u,.04,.3)});
  const ny=lerp(SURF-10,HY,ease(seg(u,.3,.72)));
  lab(TX+60,ny,'機艙與轉子',{dx:150,dy:-50,st:'s',a:band(u,.32,.62)});
  lab(TX+45,HY+30,'導引與鎖固',{dx:150,dy:20,st:'g',a:band(u,.62,.82)});
  lab(TX+120,BED-20,'電纜接頭',{dx:120,dy:-40,st:'s',a:band(u,.82,1)});
 },
 hud(u){hudPanel(240,150,'作業窗口（示例）',seg(u,.03,.08),w=>{const v=insV(u),ok=v<.5;
  hrow(56,'流速',trf('{n} m/s',{n:v.toFixed(1)}),w,ok?'#7dffc4':'#ff8a60');hbar(14,68,w-28,v/2.5,ok?'#7dffc4':'#ff8a60');
  hrow(104,'狀態',ok?'平潮：可作業':'等待',w,ok?'#7dffc4':'#fff');hrow(136,'窗口','約 1 小時',w,PWR);});}},

{t:'台灣的潮流能',en:'Tidal stream energy in Taiwan',dur:13,
 d:'台灣的潮流能資源集中在地形收窄、流速較快的海域。北端富貴角外海的實測研究顯示，表層最大流速可超過 3.5 m/s；基隆嶼與和平島之間也有強勁的潮流，國內大學曾在此測試全潛式潮流發電機組。澎湖的吼門水道與西嶼外海被評估為較具潛能的區域，2012 年也曾在澎湖跨海大橋下進行潮流發電平台試驗。國外則以蘇格蘭 MeyGen 最具規模，第一期 6 MW 在 2023 年淨發電 10.2 GWh。',
 s:[[0,'潮流能集中在地形收窄的海域'],[.24,'富貴角外海表層流速可超過 3.5 m/s'],[.5,'基隆與澎湖都曾進行潮流發電測試'],[.76,'蘇格蘭 MeyGen 已累積多年商轉經驗']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'潮流能較佳的海域（示意）',20,'#f2c230',700);
  const MX=l=>180+(l-119)*170,MY=a=>190+(25.6-a)*140;
  const pts=[];TW.forEach(([l,a])=>pts.push(MX(l),MY(a)));poly(pts,'rgba(122,154,85,.6)','rgba(227,236,238,.7)',2);
  circ(MX(119.6),MY(23.55),12,'rgba(122,154,85,.6)','rgba(227,236,238,.7)',1.5);circ(MX(119.45),MY(23.6),7,'rgba(122,154,85,.6)','rgba(227,236,238,.7)',1.5);
  const site=(l,a,t,col,t0,al,dx,dy)=>{const sa=seg(u,t0,t0+.06);if(sa<=0)return;const x=MX(l),y=MY(a),p=(TT*.8)%1;
   alphaDo(sa,()=>{alphaDo(1-p,()=>ring(x,y,8+16*p,col,2));circ(x,y,7,col);wt(x+(dx||0),y+(dy||0),t,17,col,700,al);});};
  site(121.53,25.3,'富貴角','#ff9d7a',.24,'right',-16,-10);
  site(121.8,25.16,'基隆嶼－和平島',PWR,.5,'center',0,34);
  site(119.55,23.66,'澎湖吼門水道',PWR,.56,'center',0,-20);
  site(119.6,23.53,'跨海大橋試驗',PWR,.6,'center',0,32);
  alphaDo(seg(u,.02,.1),()=>{for(let i=0;i<5;i++){const p=(TT*.4+i/5)%1;alphaDo(1-Math.abs(p-.5)*2,()=>arrow(MX(120.15),MY(24.8-p*.8),MX(120.15),MY(24.6-p*.8),'#7dc8dc',2.5));}wt(MX(120.0),MY(25.0),'台灣海峽潮流',16,'#7dc8dc',700,'center');});
  /* 右：數字卡 */
  const R=[['富貴角外海表層流速','> 3.5 m/s','期刊實測研究',.24,'#ff8a60'],['國內測試','基隆・澎湖','全潛式機組與試驗平台',.5,'#f2c230'],['MeyGen 第一期','6 MW','4 部 1.5 MW 海床式渦輪',.76,'#7dc8dc'],['MeyGen 2023 年淨發電','10.2 GWh','海床式潮流陣列的商轉實績',.86,'#7dffc4']];
  R.forEach(([t,v,s,t0,col],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=160+i*162;card(820,y,720,146,{bg:'rgba(7,27,39,.75)'});box(820,y,8,146,col);wt(850,y+44,t,19,'rgba(227,236,238,.9)',600);
   wt(850,y+106,v,40,col,700,'left',COND);wt(1510,y+106,s,17,'rgba(227,236,238,.8)',500,'right');}));
 }}
]};
