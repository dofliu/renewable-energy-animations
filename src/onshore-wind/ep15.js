// KITS: land
/* 陸域風電系列 第 15 集：噪音與光影閃爍 */
const gyy=x=>groundY(x);
/* 正視的葉片與風機（沿用第 14 集） */
function bladeF(cx,cy,a,L,w){w=w===undefined?1:w;ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
  const k=Math.max(.18,w);poly([8,-5*k,8+L*.2,-10*k,8+L,-1.5*k,8+L,1.5*k,8+L*.2,8*k,8,5*k],'#f4f6f7','rgba(0,0,0,.35)',1);ctx.restore();}
function turbine(x,gy,H,R,rot){const hy=gy-H,w0=Math.max(4,R*.09),w1=Math.max(2.5,R*.05);
  poly([x-w0,gy,x-w1,hy+R*.06,x+w1,hy+R*.06,x+w0,gy],'#eef2f4','rgba(0,0,0,.3)',1);
  box(x-R*.11,hy-R*.08,R*.24,R*.14,'#e3e8ec','rgba(0,0,0,.3)',1);
  for(let i=0;i<3;i++)bladeF(x,hy,rot+i*TAU/3-Math.PI/2,R);circ(x,hy,Math.max(3,R*.07),'#dfe5e8','rgba(0,0,0,.4)',1);return {x,y:hy};}
function windLines(y0,y1,n,sp,a,seed,len){if(a<=0)return;const r=rng(seed||3);ctx.lineCap='round';
  for(let i=0;i<n;i++){const y=y0+r()*(y1-y0),ph=r(),s=sp*(.7+.6*r()),L=(len||60)*(.6+.8*r());const x=VX0-200+((ph*2400+TT*s)%(VX1-VX0+400));
   alphaDo(a*(.25+.35*r()),()=>ln([x,y,x+L,y],'#ffffff',2));}ctx.lineCap='butt';}
function bullets(x,y,L,u,k0,dk,gap){L.forEach(([t,col],i)=>alphaDo(seg(u,k0+i*dk,k0+i*dk+.05),()=>{circ(x,y+i*gap-6,5,col==='#fff'?'#f2c230':col);wt(x+18,y+i*gap,t,18,col,600);}));}
/* 住宅：lit 0–1 為窗戶亮度 */
function house(x,g,s,lit){box(x-30*s,g-36*s,60*s,36*s,'#d8d2c4','rgba(0,0,0,.4)',1);poly([x-36*s,g-36*s,x,g-62*s,x+36*s,g-36*s],'#b4553f','rgba(0,0,0,.4)',1);
  box(x-21*s,g-28*s,17*s,15*s,`rgba(255,214,110,${(.2+.8*lit).toFixed(2)})`,'rgba(0,0,0,.45)',1);box(x+6*s,g-26*s,13*s,26*s,'#7b5a45','rgba(0,0,0,.4)',1);}
/* 聲壓級（僅幾何擴散）：Lw = 105 dB(A) */
const LW=105,Lp=r=>LW-20*Math.log10(r)-11;
/* A 加權（標準值，x = log10 f） */
const AWT=[[1,-70.4],[1.301,-50.5],[1.5,-39.4],[1.699,-30.2],[2,-19.1],[2.301,-10.9],[2.699,-3.2],[3,0],[3.301,1.2],[3.602,1],[4,-2.5]];
function aw(x){for(let i=1;i<AWT.length;i++)if(x<=AWT[i][0]){const k=(x-AWT[i-1][0])/(AWT[i][0]-AWT[i-1][0]);return lerp(AWT[i-1][1],AWT[i][1],k);}return AWT[AWT.length-1][1];}
const rawSpec=x=>58-9*(x-1.3)+10*Math.exp(-((x-2.9)*(x-2.9))/.2);
function curve(C,x0,x1,fn,col,lw){ctx.beginPath();for(let x=x0;x<=x1+1e-6;x+=.01){const y=C.Y(Math.max(1,fn(x)));x>x0?ctx.lineTo(C.X(x),y):ctx.moveTo(C.X(x),y);}ctx.strokeStyle=col;ctx.lineWidth=lw||3;ctx.stroke();}
const RPM_W=1.5708;   /* 15 rpm = 1.571 rad/s */

const EP={no:15,slug:'onshore-wind',seriesName:'陸域風電系列',t:'噪音與光影閃爍',en:'Noise and shadow flicker',
lede:'風機離住家近，居民最先感受到的是聲音與影子。這一集看噪音從哪裡來、隨距離怎麼衰減、為什麼低頻特別受關注，再看太陽低斜時葉片影子如何在住宅窗上閃爍、怎麼估算時數，最後是減噪與停機排程這些常見的對策。',
facts:[['105','dB(A)','2 MW 級機組常見的聲功率級，依機型與風速而定（示例）'],
['−6','dB','距離每加倍，球面擴散使聲壓級下降的量（僅幾何擴散）'],
['20–200','Hz','台灣另列管制的低頻噪音頻帶，以 1/3 八音度頻帶量測'],
['500','m','陸域風機與建築物相距 500 m 內須辦理環評（依經濟部公開說明）'],
['30','h／年','德國指引的光影閃爍最嚴情境年上限，另限單日 30 分鐘'],
['0.75','Hz','15 rpm、三葉片機組的光影閃爍頻率，遠低於常被引用的 3 Hz']],
note:'說明：本集為教育用途示意動畫，風機、住宅、頻譜與影子經過簡化，並非特定機型或案場。聲功率級 105 dB(A)、示例管制線（日間 50、夜間 40 dB(A)）、隔音量、減噪量、每月閃爍時數與發電損失皆為典型範例；距離衰減僅計幾何擴散，實際還需計入空氣吸收、地面與地形、風向。台灣各管制區類別的低頻與環境音量標準請以環境部現行公告為準；國內未見專門的光影閃爍法定時數，評估時常參考德國指引（最嚴情境 30 小時／年、30 分鐘／日，實際情境 8 小時／年）。',
base:()=>{landSky(GY,{sun:{x:1260,y:140},clouds:false});drawGround();},
shots:[
/* 1 ─────────────────────────────── 噪音從哪裡來 */
{t:'風機的噪音從哪裡來',en:'Where turbine noise comes from',dur:13,side:true,
 d:'風機的聲音有兩類來源。最主要的是氣動噪音：氣流流過葉片，在尾緣與葉尖產生湍流，聽起來像規律的「咻、咻」聲，轉速越高、葉尖速度越大就越明顯。其次是機械噪音，來自齒輪箱、發電機與冷卻風扇，現代機組多半已用隔音罩與減振座壓低。製造商會依 IEC 61400-11 量測聲功率級，2 MW 級機組常見約 105 dB(A)，並隨風速改變；這個數字描述的是音源本身，不是住家聽到的音量。',
 s:[[0,'風吹過葉片，尾緣與葉尖產生氣動噪音'],[.3,'齒輪箱、發電機與風扇另有機械噪音'],[.55,'聲音向四面八方擴散，距離越遠越小'],[.8,'聲功率級描述音源本身，不是住家聽到的音量']],
 draw(u){
  const X=560,G=gyy(X),rot=TT*RPM_W+.4,hx=1330,GH=gyy(hx);
  windLines(120,560,9,150,.45,5,50);
  const T=turbine(X,G,320,150,rot);
  const ag=seg(u,.06,.16);
  for(let k=0;k<4;k++){const ph=(TT*.5+k/4)%1,re=rot-RPM_W*ph/.5,a=re-Math.PI/2,tx=X+Math.cos(a)*158,ty=T.y+Math.sin(a)*158;
   alphaDo(ag*(1-ph)*.6,()=>ring(tx,ty,10+ph*560,'#f2c230',3));}
  const mg=seg(u,.28,.4);
  for(let k=0;k<3;k++){const ph=(TT*.5+k/3)%1;alphaDo(mg*(1-ph)*.65,()=>ring(X+10,T.y,10+ph*260,'#ff8a60',3));}
  house(hx,GH,2.2,1);
  const ba=seg(u,.52,.62);
  alphaDo(ba,()=>{const y=G+40;ln([X,y,hx,y],'rgba(255,255,255,.7)',2);arrow(X+14,y,X,y,'rgba(255,255,255,.7)',2);arrow(hx-14,y,hx,y,'rgba(255,255,255,.7)',2);tag((X+hx)/2,y-10,'住宅距離約 500 m（示例）',{size:16,bg:'#f2c230',align:'center'});});
  lab(X,T.y,'葉片氣動噪音：主要來源',{dx:220,dy:-130,st:'s',a:band(u,.04,.34)});
  lab(X,T.y,'機械噪音：齒輪箱、發電機',{dx:-210,dy:-70,st:'w',a:band(u,.28,.54),minor:true});
  lab(hx,GH-60,'住宅',{dx:-30,dy:-90,st:'l',a:band(u,.5,1)});
 },
 hud(u){hudPanel(250,150,'風機噪音（示例）',seg(u,.04,.12),w=>{
  hrow(56,'聲功率級','約 105 dB(A)',w,'#f2c230');hrow(88,'主要來源','氣動噪音',w,'#7dc8dc');hrow(120,'量測方法','IEC 61400-11',w,'#7dffc4');});}},

/* 2 ─────────────────────────────── 距離衰減 */
{t:'噪音如何隨距離衰減',en:'How noise fades with distance',dur:14,
 d:'聲音從風機向四周擴散，等於攤在越來越大的球面上，所以距離每加倍，聲壓級約少 6 dB。以 105 dB(A) 的聲功率級、只計幾何擴散來估算：100 公尺約 54 dB(A)，200 公尺約 48，400 公尺約 42，800 公尺約 36。若拿示例管制線日間 50、夜間 40 dB(A) 來看，約在 160 公尺與 500 公尺處降到限值以下。實際還要計入空氣吸收、地面、地形與風向，順風時會比計算值更大聲，所以要靠量測與模擬驗證。',
 s:[[0,'聲音攤在越來越大的球面上，距離加倍少 6 dB'],[.3,'以 105 dB(A) 估算：100 公尺約 54，400 公尺約 42'],[.58,'對照示例管制線：日間約 160 公尺、夜間約 500 公尺達標'],[.82,'實際還受空氣吸收、地面、地形與風向影響']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,860,640,{title:'噪音隨距離衰減（示例）',x0:0,x1:1000,y0:30,y1:70,xt:[0,200,400,600,800,1000],yt:[30,40,50,60,70],xl:'距離 (m)',yl:'dB(A)',pl:60,pt:64,pb:58,gx:5,gy:4});
  const g=ease(seg(u,.06,.5)),rmax=40+960*g;
  ctx.beginPath();for(let r=40;r<=rmax;r+=4){const y=C.Y(Lp(r));r>40?ctx.lineTo(C.X(r),y):ctx.moveTo(C.X(r),y);}ctx.strokeStyle='#f2c230';ctx.lineWidth=4;ctx.stroke();
  ctx.setLineDash([8,6]);[[50,'示例管制線：日間 50 dB(A)',-10],[40,'示例管制線：夜間 40 dB(A)',26]].forEach(([v,n,dy],i)=>alphaDo(seg(u,.46+i*.04,.54+i*.04),()=>{ln([C.px,C.Y(v),C.px+C.pw,C.Y(v)],'#e8572a',2);}));
  ctx.setLineDash([]);
  alphaDo(seg(u,.46,.54),()=>wt(C.px+C.pw-10,C.Y(50)-10,'示例管制線：日間 50 dB(A)',16,'#ff9d7a',700,'right'));
  alphaDo(seg(u,.5,.58),()=>wt(C.px+C.pw-10,C.Y(40)+26,'示例管制線：夜間 40 dB(A)',16,'#ff9d7a',700,'right'));
  [[158,50,'約 160 m',.54],[501,40,'約 500 m',.6]].forEach(([r,v,n,k])=>alphaDo(seg(u,k,k+.06),()=>{circ(C.X(r),C.Y(v),9,'#7dffc4','#13232e',2);ring(C.X(r),C.Y(v),16+3*Math.sin(TT*6),'#7dffc4',2);
   ln([C.X(r),C.Y(v)+12,C.X(r),C.py+C.ph],'rgba(125,255,196,.6)',1.5);tag(C.X(r),C.Y(v)-34,n,{size:16,bg:'#7dffc4',align:'center'});}));
  alphaDo(seg(u,.8,.88),()=>wt(C.px+12,C.py+C.ph+40,'僅計幾何擴散，未計空氣吸收與地面',15,'rgba(227,236,238,.8)',600));
  /* 球面擴散 */
  card(960,160,580,300,{bg:'rgba(7,27,39,.75)'});wt(984,198,'球面擴散：距離加倍，聲壓級少 6 dB',20,'#f2c230',700);
  const cx=1060,cy=340;
  [30,60,120].forEach((R,i)=>alphaDo(seg(u,.04+i*.06,.1+i*.06),()=>{ring(cx,cy,R,'rgba(125,200,220,.85)',3);wt(cx+R*.72+6,cy-R*.72+4,['r','2r','4r'][i],17,'#7dc8dc',700,'left',COND);}));
  circ(cx,cy,7,'#f2c230');
  alphaDo(seg(u,.2,.3),()=>{wt(1250,300,'距離每加倍',20,'rgba(227,236,238,.92)',600);wt(1250,334,'面積 ×4',22,'#fff',700);wt(1250,384,'−6 dB',44,'#f2c230',800,'left',COND);});
  /* 距離與聲壓級 */
  card(960,480,580,320,{bg:'rgba(7,27,39,.75)'});wt(984,518,'105 dB(A) 音源的估算值',20,'#f2c230',700);
  [[100,'#7dffc4'],[200,'#7dffc4'],[400,'#f2c230'],[800,'#f2c230']].forEach(([r,col],i)=>alphaDo(seg(u,.3+i*.07,.38+i*.07),()=>{
   const y=566+i*40;wt(990,y,trf('{r} m',{r:r}),20,'rgba(227,236,238,.92)',600,'left',COND);
   rrp(1090,y-18,Math.max(10,(Lp(r)-30)*8),22,5);ctx.fillStyle=col;ctx.fill();wt(1540-24,y,trf('{v} dB(A)',{v:Math.round(Lp(r))}),22,'#fff',700,'right',COND);}));
  bullets(996,740,[['順風、逆溫的夜間，實際聲音會比計算更大','#fff'],['要靠現場量測與模擬驗證','#f2c230']],u,.78,.08,32);
 }},

/* 3 ─────────────────────────────── 低頻與調幅 */
{t:'低頻噪音與規律的「咻咻」聲',en:'Low-frequency noise and the rhythmic swish',dur:14,
 d:'A 加權是依人耳靈敏度修正的量法，會把低頻壓低很多：50 Hz 約減 30 dB，所以只看 dB(A) 容易低估低頻。低頻在空氣中衰減得慢，穿過牆與窗時也損失較少，因此居民在室內夜裡仍可能感到悶響或壓迫感。台灣另外針對 20 至 200 Hz 的低頻噪音訂有管制，以 1/3 八音度頻帶量測。另一個特徵是調幅：葉片每經過塔架前一次，音量就起伏一次，規律的起伏比穩定的噪音更容易被注意到。',
 s:[[0,'風機噪音在低頻能量最高，高頻較少'],[.26,'A 加權把低頻壓低很多：50 Hz 約減 30 dB'],[.5,'低頻穿牆能力強，室內仍可能感到悶響'],[.76,'葉片通過的規律起伏（調幅）更容易被注意']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,860,420,{title:'風機噪音頻譜與 A 加權（示意）',x0:1,x1:4,y0:0,y1:70,yt:[0,20,40,60],yl:'dB',pl:60,pt:64,pb:58,gx:3,gy:7});
  [[1,'10'],[2,'100'],[3,'1 k'],[4,'10 k Hz']].forEach(([x,n])=>wt(C.X(x),C.py+C.ph+22,n,16,'rgba(227,236,238,.75)',600,'center',COND));
  const bx0=C.X(Math.log10(20)),bx1=C.X(Math.log10(200)),ba=seg(u,.04,.12);
  alphaDo(ba*.9,()=>{box(bx0,C.py,bx1-bx0,C.ph,'rgba(232,87,42,.22)');wt((bx0+bx1)/2,C.py+26,'20–200 Hz',17,'#ff9d7a',700,'center',COND);});
  curve(C,1,1+3*ease(seg(u,.06,.36)),rawSpec,'#7dc8dc',3.5);
  const g2=ease(seg(u,.3,.56));if(g2>0)curve(C,1,1+3*g2,x=>rawSpec(x)+aw(x),'#f2c230',3.5);
  alphaDo(seg(u,.06,.14),()=>{box(C.px+C.pw-290,C.py+8,12,12,'#7dc8dc');wt(C.px+C.pw-270,C.py+20,'原始聲壓級',15,'#7dc8dc',700);});
  alphaDo(seg(u,.34,.42),()=>{box(C.px+C.pw-290,C.py+30,12,12,'#f2c230');wt(C.px+C.pw-270,C.py+42,'A 加權後',15,'#f2c230',700);});
  alphaDo(seg(u,.5,.58),()=>{const x=Math.log10(50),y1=C.Y(rawSpec(x)),y2=C.Y(rawSpec(x)+aw(x));arrow(C.X(x),y1,C.X(x),y2-6,'#fff',2.5);tag(C.X(x)+34,(y1+y2)/2,'50 Hz 約 −30 dB',{size:15,bg:'#ff9d7a',align:'left'});});
  /* 調幅 */
  card(60,600,860,200,{bg:'rgba(7,27,39,.75)'});wt(84,638,'調幅：每片葉片經過，音量起伏一次',20,'#f2c230',700);
  const ag=seg(u,.6,.7),cy=730;alphaDo(ag,()=>{ctx.beginPath();for(let x=90;x<=890;x+=2){const t=(x-90)/200+TT*.6,env=1+.55*Math.sin(TAU*.75*t),v=env*(.62*Math.sin(TAU*9*t)+.38*Math.sin(TAU*14.3*t+1));x>90?ctx.lineTo(x,cy-v*30):ctx.moveTo(x,cy-v*30);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=2;ctx.stroke();
   ctx.beginPath();for(let x=90;x<=890;x+=4){const t=(x-90)/200+TT*.6,env=1+.55*Math.sin(TAU*.75*t);x>90?ctx.lineTo(x,cy-env*42):ctx.moveTo(x,cy-env*42);}ctx.strokeStyle='rgba(242,194,48,.8)';ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.stroke();ctx.setLineDash([]);});
  alphaDo(seg(u,.72,.8),()=>wt(896,638,'通過頻率 = 3 × 15 rpm ÷ 60 = 0.75 Hz',17,'#fff',700,'right',COND));
  /* 室內隔音 */
  card(960,160,580,640,{bg:'rgba(7,27,39,.75)'});wt(984,198,'為什麼低頻特別受關注',20,'#f2c230',700);
  bullets(996,248,[['低頻在空氣中衰減慢','#fff'],['穿牆穿窗的損失也較少','#fff'],['夜裡室內仍可能感到悶響','#ff9d7a']],u,.34,.08,38);
  alphaDo(seg(u,.5,.58),()=>{wt(984,396,'住宅外牆與窗的隔音量（示例）',19,'rgba(227,236,238,.92)',600);});
  [['20–200 Hz 低頻',10,'#ff9d7a'],['1 kHz 以上高頻',30,'#7dffc4']].forEach(([n,v,col],i)=>alphaDo(seg(u,.52+i*.07,.6+i*.07),()=>{const y=450+i*76;wt(996,y,n,18,col,700);
   rrp(996,y+14,Math.max(10,v*12*ease(seg(u,.54+i*.07,.66+i*.07))),24,5);ctx.fillStyle=col;ctx.fill();wt(1380+60,y+34,trf('約 {v} dB',{v:v}),20,'#fff',700,'right',COND);}));
  bullets(996,640,[['台灣另列 20–200 Hz 低頻管制','#f2c230'],['以 1/3 八音度頻帶量測','#fff'],['調幅聲比穩定噪音更容易被注意','#fff']],u,.76,.07,40);
 }},

/* 4 ─────────────────────────────── 光影閃爍成因 */
{t:'光影閃爍：低斜陽光下的影子',en:'Shadow flicker: shadows in low sunlight',dur:14,side:true,
 d:'光影閃爍發生在太陽低斜、風機位於太陽與住宅之間的時候。旋轉的葉片會遮住一部分陽光，影子掃過住宅窗戶，室內光線就隨葉片通過而忽明忽暗。太陽越低，影子越長：以輪轂高度約 80 公尺估算，太陽高度角 10 度時，輪轂的影子可延伸約 450 公尺。影子掃過的範圍是一整條帶狀區域，只有住宅剛好位在帶內、又是晴天且風機運轉時，才會看到閃爍。',
 s:[[0,'太陽高，影子短，落在風機附近'],[.3,'太陽漸漸降低，影子被拉長'],[.56,'住宅進入影子帶，窗戶光線隨葉片忽明忽暗'],[.82,'太陽越低，影子帶越長，影響的距離越遠']],
 draw(u){
  const X=300,G=gyy(X),S=2.2,Hh=176,R=110,rot=TT*RPM_W+.4,hx=1180,GH=gyy(hx);
  const adeg=lerp(30,9,ease(seg(u,.1,.9))),al=adeg*Math.PI/180,ca=Math.cos(al),sa=Math.sin(al),ta=Math.tan(al);
  const T=turbine(X,G,Hh,R,rot);
  /* 太陽與光線 */
  const sx=X-ca*240,sy=T.y-sa*240;
  const sg=ctx.createRadialGradient(sx,sy,4,sx,sy,60);sg.addColorStop(0,'rgba(255,240,160,.95)');sg.addColorStop(1,'rgba(255,240,160,0)');ctx.fillStyle=sg;ctx.fillRect(sx-60,sy-60,120,120);circ(sx,sy,15,'#ffe9a0');
  const xa=X+(G-(T.y+R))/ta,xb=X+(G-(T.y-R))/ta;
  [[T.y-R,xb],[T.y+R,xa]].forEach(([py,xe])=>{ln([X-ca*240,py-sa*240,X,py],'rgba(255,255,255,.4)',1.5);ctx.setLineDash([5,5]);ln([X,py,xe,G],'rgba(20,30,40,.55)',1.5);ctx.setLineDash([]);});
  const zx1=Math.min(xa,VX1+10),zx0=Math.min(xb,VX1+10);
  alphaDo(.5+.2*Math.sin(TT*3),()=>box(Math.min(zx1,zx0),G-4,Math.abs(zx0-zx1),12,'#e8572a'));
  /* 住宅與閃爍 */
  const inZ=clamp((hx-xa)/40,0,1)*clamp((xb-hx)/40,0,1),fl=.5+.5*Math.cos(3*rot);
  house(hx,GH,2.2,1-inZ*(1-fl));
  if(inZ>0)alphaDo(inZ*.5,()=>{for(let k=1;k<=2;k++)ring(hx-30,GH-48,16+k*10+6*fl,'#ffd66e',2);});
  lab(X,T.y,'輪轂高度約 80 m',{dx:120,dy:-120,st:'l',a:band(u,.02,.3)});
  lab(Math.min(zx0,zx1)+20,G+2,'影子帶（葉片掃過的範圍）',{dx:-40,dy:80,st:'w',a:band(u,.24,.7),minor:true});
  lab(hx,GH-60,'住宅',{dx:40,dy:-110,st:'l',a:band(u,.2,.52)});
  lab(hx-30,GH-48,'窗戶忽明忽暗',{dx:-60,dy:-150,st:'s',a:inZ*band(u,.5,1)});
 },
 hud(u){const adeg=lerp(30,9,ease(seg(u,.1,.9))),dd=80/Math.tan(adeg*Math.PI/180);
  hudPanel(250,150,'太陽與影子（計算）',seg(u,.02,.1),w=>{
  hrow(56,'太陽高度角',trf('{a}°',{a:Math.round(adeg)}),w,'#f2c230');hrow(88,'輪轂影子距離',trf('{d} m',{d:Math.round(dd)}),w,'#7dc8dc');hrow(120,'閃爍頻率','0.75 Hz',w,'#7dffc4');});}},

/* 5 ─────────────────────────────── 閃爍時數 */
{t:'閃爍時數怎麼算',en:'How shadow-flicker hours are calculated',dur:15,
 d:'評估光影閃爍，是把全年每分鐘的太陽位置、風機與住宅座標算一遍，找出葉片影子落在窗上的時段。條件包括太陽高度角高於約 3 度、葉片遮住至少兩成陽光。德國指引在最嚴情境（全年無雲、風機一直運轉）限制每年 30 小時、每天 30 分鐘，實際情境則是每年 8 小時。示例中某住宅的理論值為 34 小時，扣掉雲量與風況後約 12 小時，仍高於 8 小時，因此需要加裝停機控制，才能降到限值以下。',
 s:[[0,'影子越長，影響的距離越遠；太陽高度角低於約 3 度就看不見'],[.28,'逐月計算葉片影子落在窗上的時數'],[.5,'德國指引：最嚴情境每年 30 小時，實際情境 8 小時'],[.74,'超標時，用停機控制把實際閃爍壓到限值內']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,700,400,{title:'輪轂影子距離與太陽高度角',x0:0,x1:30,y0:0,y1:1000,xt:[0,5,10,15,20,25,30],yt:[0,250,500,750,1000],xl:'太陽高度角 (°)',yl:'m',pl:70,pt:64,pb:58,gx:6,gy:4});
  const g=ease(seg(u,.04,.3)),amax=30-(30-4.6)*(1-g)*0;
  ctx.beginPath();let first=true;for(let a=Math.max(4.6,30-25.4*g);a<=30;a+=.2){const y=C.Y(Math.min(1000,80/Math.tan(a*Math.PI/180)));first?(ctx.moveTo(C.X(a),y),first=false):ctx.lineTo(C.X(a),y);}ctx.strokeStyle='#f2c230';ctx.lineWidth=4;ctx.stroke();
  [[5,'914 m'],[10,'454 m'],[20,'220 m'],[30,'139 m']].forEach(([a,n],i)=>alphaDo(seg(u,.14+i*.05,.2+i*.05),()=>{const y=C.Y(80/Math.tan(a*Math.PI/180));circ(C.X(a),y,7,'#7dffc4','#13232e',2);wt(C.X(a)+(a>25?-14:14),y-12,n,18,'#7dffc4',700,a>25?'right':'left',COND);}));
  card(60,580,700,220,{bg:'rgba(7,27,39,.75)'});wt(84,618,'閃爍出現的條件',20,'#f2c230',700);
  bullets(96,658,[['太陽高度角高於約 3°，葉片遮住 ≥ 20% 陽光','#fff'],['晴天、風機運轉、窗戶朝向風機','#fff'],['閃爍頻率 = 3 片 × 15 rpm ÷ 60 = 0.75 Hz','#7dc8dc'],['低於常被引用的 3 Hz 門檻','#7dffc4']],u,.18,.07,34);
  /* 每月 */
  const MV=[4,3,2,1,2,3,2,2,3,5,4,3];
  const D=chartBox(800,160,740,330,{title:'示例：某住宅每月的理論閃爍時數',x0:0,x1:12,y0:0,y1:6,yt:[0,2,4,6],yl:'h',pl:60,pt:64,pb:50,gx:12,gy:3});
  let tot=0;MV.forEach((v,i)=>{const k=ease(seg(u,.28+i*.012,.4+i*.012));tot+=v*k;const bw=D.pw/12*.64,x=D.X(i)+D.pw/12*.18,h=D.ph*v/6*k;box(x,D.py+D.ph-h,bw,h,'#ff9d7a');wt(D.X(i)+D.pw/24,D.py+D.ph+22,String(i+1),15,'rgba(227,236,238,.75)',600,'center',COND);});
  wt(D.px+D.pw-6,D.py+30,trf('累計 {n} h',{n:Math.round(tot)}),26,'#fff',700,'right',COND);
  /* 與指引比較 */
  card(800,510,740,290,{bg:'rgba(7,27,39,.75)'});wt(824,544,'與德國指引比較（示例）',20,'#f2c230',700);
  wt(824,568,'最嚴情境 ≤ 30 h／年、≤ 30 分／日；實際情境 ≤ 8 h／年',15,'rgba(227,236,238,.85)',600);
  const bx=840,BW=560,sc=v=>bx+BW*v/40;
  alphaDo(seg(u,.46,.54),()=>{ctx.setLineDash([6,5]);ln([sc(8),590,sc(8),772],'#e8572a',2);ln([sc(30),590,sc(30),772],'#e8572a',2);ctx.setLineDash([]);wt(sc(8),586,'8 h',15,'#ff9d7a',700,'center',COND);wt(sc(30),586,'30 h',15,'#ff9d7a',700,'center',COND);});
  [['理論最嚴情境（無雲、全年運轉）',34,'#ff9d7a'],['實際情境（計入雲量與風況）',12,'#f2c230'],['加裝停機控制後',7,'#7dffc4']].forEach(([n,v,col],i)=>{const k=ease(seg(u,.5+i*.1,.64+i*.1)),y=622+i*62;if(k<=0)return;
   wt(bx,y,n,16,'rgba(227,236,238,.92)',600);rrp(bx,y+8,Math.max(6,(sc(v)-bx)*k),20,4);ctx.fillStyle=col;ctx.fill();alphaDo(seg(k,.8,1),()=>wt(sc(v)+10,y+25,trf('{v} h',{v:v}),20,'#fff',700,'left',COND));});
 }},

/* 6 ─────────────────────────────── 對策 */
{t:'減噪對策與停機排程',en:'Noise measures and shutdown scheduling',dur:15,
 d:'噪音可以從葉片、運轉與選址三方面處理：鋸齒尾緣讓尾緣氣流更平順，約可降低 2 至 3 dB(A)；降噪運轉模式降低轉速並調整槳角，約降 2 至 4 dB(A)，發電量略減；夜間或特定風向限轉，則按住宅位置與時段排程守住管制值；選址時多留一倍距離，約少 6 dB。光影閃爍則先算出會閃爍的時段，再由光感測器確認有日照，才讓該部機組短暫停機，一年的發電損失通常很小。各項成效要靠量測驗證，並與社區持續溝通。',
 s:[[0,'鋸齒尾緣、降噪模式與限轉，各降幾個 dB'],[.28,'選址多留一倍距離，約少 6 dB'],[.52,'先預算會閃爍的時段，找出住宅受影響的日期與時刻'],[.78,'光感測器確認有日照才短暫停機，年損失很小']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,198,'噪音對策（示例）',20,'#f2c230',700);
  const M=[['鋸齒尾緣葉片','讓尾緣氣流更平順，需改裝或原廠設計','約 −2～3 dB(A)','#7dffc4'],
   ['降噪運轉模式','降低轉速、調整槳角，發電量略減','約 −2～4 dB(A)','#7dffc4'],
   ['夜間或特定風向限轉','依住宅位置與時段排程，守住管制值','以排程控管','#f2c230'],
   ['退縮距離與配置','選址時拉開與住宅的距離','距離加倍 −6 dB','#7dc8dc']];
  M.forEach(([a,b,c,col],i)=>{const y=222+i*140,g=seg(u,.02+i*.07,.1+i*.07);alphaDo(g,()=>{rrp(80,y,660,124,10);ctx.fillStyle='rgba(255,255,255,.06)';ctx.fill();rrp(80,y,8,124,4);ctx.fillStyle=col;ctx.fill();
   wt(108,y+44,a,24,col,700);wt(108,y+84,b,17,'rgba(227,236,238,.92)',600);tag(720,y+30,c,{size:16,bg:col,align:'right'});});});
  /* 閃爍時段 */
  const H=chartBox(800,160,740,420,{title:'示例：預測會閃爍的時段（住宅在風機西側）',x0:0,x1:12,y0:0,y1:5,pl:80,pt:64,pb:70,gx:12,gy:5});
  const sunset=m=>18+.65*Math.sin(TAU*(m-3)/12);
  const cw=H.pw/12,chh=H.ph/5,g=seg(u,.44,.7);
  for(let m=1;m<=12;m++){wt(H.X(m-1)+cw/2,H.py+H.ph+22,String(m),15,'rgba(227,236,238,.75)',600,'center',COND);
   for(let r=0;r<5;r++){const h=15+r,lo=sunset(m)-1.5,hi=sunset(m)-.15,on=(h+1>lo&&h<hi),k=ease(clamp(g*14-(m-1)*1.1,0,1));if(!on||k<=0)continue;
    alphaDo(k,()=>box(H.X(m-1)+3,H.py+(4-r)*chh+3,cw-6,chh-6,'#e8572a'));}}
  for(let r=0;r<5;r++)wt(H.px-10,H.py+(4-r)*chh+chh/2+5,trf('{h} 時',{h:15+r}),15,'rgba(227,236,238,.75)',600,'right',COND);
  wt(H.px+H.pw,H.py+H.ph+52,'月',15,'rgba(227,236,238,.7)',500,'right');
  alphaDo(seg(u,.7,.78),()=>{box(H.px,H.py+H.ph+44,16,12,'#e8572a');wt(H.px+24,H.py+H.ph+56,'預測閃爍：該時段停機',15,'#ff9d7a',700);});
  card(800,600,740,200,{bg:'rgba(7,27,39,.75)'});wt(824,638,'停機排程怎麼運作',20,'#f2c230',700);
  bullets(836,684,[['預先計算：太陽位置、風機與住宅座標','#fff'],['現場光感測器確認有日照，才下停機指令','#fff'],['只在必要時段停機：年損失通常 < 0.5%（示例）','#7dffc4']],u,.6,.07,38);
 }}
]};
