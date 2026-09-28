// KITS: land
/* 地熱系列 第 2 集：地熱鑽井 */
const gyy=x=>groundY(x);
const SUN={x:1180,y:120};
const DEG=Math.PI/180;
const WX=760;                                   // 井場中心
const HOT='#ff8a60',COOL='#58b8d0',MUD='#7dc8dc',PWR='#f2c230',CEM='#c9d1d6',STEEL='#8d989f';
const GEO_LAY=[{d:0,c:'#7a9a55'},{d:14,c:'#a4876a'},{d:60,c:'#8a7a6a'},{d:150,c:'#6d6862'},{d:190,c:'#7a4b3a'},{d:330,c:'#8e3b22'}];
const DPX=m=>m*.17;                             // 場景深度比例：2,000 m ≈ 340 px
const PXM=2000/340;
/* 沿折線 P（[[x,y],…]）取比例 f 的點 */
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,sp,r){if(a<=0)return;for(let k=0;k<n;k++){const f=((TT*(sp||.3))+k/n)%1,p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],r||4.5,col));}}
function pl(P,col,lw){const a=[];P.forEach(p=>a.push(p[0],p[1]));ln(a,col,lw);}
const toA=P=>P.map(p=>[p.x,p.y]);
/* 遠山與整集背景（不放雲，避免擋住章節卡） */
function hills(){poly([-200,GY,-60,430,120,380,300,440,420,400,560,470,700,430,880,480,1000,440,1180,410,1320,450,1500,400,1700,460,1800,GY],'#8fae9a');
  poly([-200,GY,0,500,200,470,380,520,600,480,820,530,1060,490,1300,520,1560,480,1800,GY],'#7c9f7c');}
function geoBase(){landSky(GY,{sun:SUN,clouds:false});hills();drawGround({layers:GEO_LAY});
  const g=gyy(WX);box(WX-380,g-3,800,5,'#b9b3a6');}   // 碎石井場
/* 鑽機：井架、游車與頂部驅動、鑽台、防噴器、鑽桿架、泥漿系統 */
function rig(x,o){o=o||{};const g=gyy(x),F=g-64,T=g-340,hy=o.hy===undefined?F-200:o.hy;
  // 發電機
  box(x-470,g-40,90,40,'#5c6770','rgba(0,0,0,.3)',1);box(x-462,g-32,30,10,'#2a3a46');box(x-420,g-52,8,12,'#44535c');
  // 鑽桿架
  box(x-340,g-10,150,6,'#6a747a');for(let i=0;i<4;i++)ln([x-336,g-14-i*6,x-194,g-14-i*6],'#aeb8be',4);
  ln([x-190,g-10,x-90,F+2],'#8d989f',4);
  // 泥漿系統（泥漿泵→立管；返出管→振動篩→泥漿池）
  if(o.mud!==false){ln([x+390,g-34,x+390,g-60,x+40,g-60],'#44535c',3);
   box(x+140,g-42,210,42,'#8d989f','rgba(0,0,0,.3)',1);for(let i=1;i<4;i++)ln([x+140+i*52,g-42,x+140+i*52,g],'rgba(0,0,0,.25)',1);
   box(x+144,g-40,202,6,'#6f8e9a');
   box(x+104,g-66,56,22,'#6a747a','rgba(0,0,0,.3)',1);ln([x+108,g-44,x+116,g-40],'#44535c',3);
   ln([x+18,g-40,x+104,g-56],'#44535c',5);
   box(x+366,g-34,64,34,'#1f7f99','rgba(0,0,0,.3)',1);circ(x+398,g-17,9,'#58b8d0');
   if(o.cool){box(x+450,g-90,70,90,'#c9d1d6','rgba(0,0,0,.3)',1);for(let i=0;i<3;i++){const p=(TT*.5+i/3)%1;alphaDo(o.cool*(1-p),()=>circ(x+485+6*Math.sin(p*5+i),g-100-p*60,12+p*12,'rgba(255,255,255,.5)'));}}}
  // 鑽台底座
  for(const dx of [-84,-34,26,76])box(x+dx,F+8,8,g-F-8,'#6a747a');
  ln([x-80,F+10,x-30,g,x-34,F+10,x+30,g],'rgba(80,90,96,.8)',1.5);ln([x+30,F+10,x+80,g,x+34,F+10],'rgba(80,90,96,.8)',1.5);
  // 防噴器
  box(x-15,g-52,30,46,'#e8572a','rgba(0,0,0,.35)',1);box(x-19,g-38,38,8,'#b8431f');box(x-19,g-22,38,8,'#b8431f');
  box(x-90,F,180,10,'#5c6770');
  // 值班房
  box(x-176,F-46,78,46,'#dfe5e8','rgba(0,0,0,.3)',1);box(x-166,F-36,24,14,'#2a3a46');box(x-136,F-36,24,14,'#2a3a46');
  // 井架
  ctx.strokeStyle='#e9b21f';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x-46,F);ctx.lineTo(x-12,T);ctx.moveTo(x+46,F);ctx.lineTo(x+12,T);ctx.stroke();
  ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<10;i++){const y0=F-(F-T)*i/10,y1=F-(F-T)*(i+1)/10,w0=lerp(46,12,i/10),w1=lerp(46,12,(i+1)/10);
   ctx.moveTo(x-w0,y0);ctx.lineTo(x+w1,y1);ctx.moveTo(x+w0,y0);ctx.lineTo(x-w1,y1);ctx.moveTo(x-w1,y1);ctx.lineTo(x+w1,y1);}ctx.stroke();
  box(x-22,T-12,44,12,'#6a747a');box(x-34,T+96,22,4,'#6a747a');
  // 大鉤鋼索、游車、頂部驅動
  ln([x-4,T,x-4,hy-22],'#44535c',1.5);ln([x+4,T,x+4,hy-22],'#44535c',1.5);
  box(x-11,hy-24,22,18,'#5c6770');box(x-14,hy-6,28,30,STEEL,'rgba(0,0,0,.35)',1);
  ln([x,hy+24,x,g-52],'#aeb8be',4);
  // 立管與水龍帶
  ln([x+40,g-60,x+40,F-200],'#44535c',3);ctx.beginPath();ctx.moveTo(x+40,F-200);ctx.quadraticCurveTo(x+70,hy-20,x+14,hy+4);ctx.strokeStyle='#2b3137';ctx.lineWidth=3;ctx.stroke();
}
/* 地下的井：dm 為鑽頭深度（m） */
function wellUG(x,dm,o){o=o||{};const g=gyy(x),yb=g+DPX(dm);if(dm<=0)return yb;
  const cs=Math.min(yb-g,DPX(o.cas||0));if(cs>0)box(x-9,g,18,cs,'#aeb8be');
  box(x-5,g,10,yb-g,'#1d2328');
  if(o.pipe!==false){ln([x,g,x,yb-8],'#aeb8be',3);poly([x-7,yb-9,x+7,yb-9,x+4,yb-2,x,yb+2,x-4,yb-2],'#f2c230');}
  return yb;}
/* 定向井軌跡：dir=±1，theta 井斜角（度），R 造斜半徑（px） */
function devPath(x,dir,theta,R){const g=gyy(x),k=g+DPX(500),end=g+DPX(2000),th=theta*DEG,P=[{x,y:g},{x,y:k}];
  if(!dir){P.push({x,y:end});return P;}
  for(let i=1;i<=14;i++){const a=th*i/14;P.push({x:x+dir*R*(1-Math.cos(a)),y:k+R*Math.sin(a)});}
  const L=P[P.length-1];P.push({x:L.x+dir*(end-L.y)*Math.tan(th),y:end});return P;}
function pathLen(P){let L=0;for(let i=1;i<P.length;i++)L+=Math.hypot(P[i].x-P[i-1].x,P[i].y-P[i-1].y);return L;}
/* 由量測深度（px）換算井斜角、垂深、水平位移 */
function devState(md,theta,R){const k=DPX(500),th=theta*DEG;if(md<=k)return {a:0,tvd:md,hd:0};
  const arc=R*th;if(md<=k+arc){const a=(md-k)/R;return {a,tvd:k+R*Math.sin(a),hd:R*(1-Math.cos(a))};}
  const s=md-k-arc;return {a:th,tvd:k+R*Math.sin(th)+s*Math.cos(th),hd:R*(1-Math.cos(th))+s*Math.sin(th)};}
function fractures(cx,a,hl){alphaDo(a,()=>{ctx.setLineDash([10,6]);[[-44,0],[-6,14],[30,-8]].forEach(([dx,dy])=>ln([cx+dx-40,780+dy,cx+dx+26,1000+dy],hl?'rgba(255,138,96,.95)':'rgba(255,157,122,.55)',hl?3:2));ctx.setLineDash([]);});}
/* 井口：套管頭、主閥、側翼閥 */
function bigWellhead(x,o){o=o||{};const g=gyy(x);
  box(x-30,g-14,60,14,'#6a747a','rgba(0,0,0,.3)',1);
  box(x-17,g-58,34,44,STEEL,'rgba(0,0,0,.3)',1);ring(x-30,g-36,9,'#1f7f99',3);
  box(x-22,g-64,44,6,'#6a747a');
  box(x-17,g-108,34,44,STEEL,'rgba(0,0,0,.3)',1);ring(x-30,g-86,9,'#1f7f99',3);
  box(x-20,g-150,40,42,'#aeb8be','rgba(0,0,0,.3)',1);
  box(x+20,g-140,26,22,'#aeb8be','rgba(0,0,0,.3)',1);box(x+46,g-148,26,38,STEEL,'rgba(0,0,0,.3)',1);ring(x+59,g-158,9,'#1f7f99',3);
  box(x-14,g-176,28,26,STEEL,'rgba(0,0,0,.3)',1);
  if(o.vent){box(x-8,g-240,16,64,'#aeb8be','rgba(0,0,0,.3)',1);}
}
function plume(x,y,a,s){if(a<=0)return;for(let i=0;i<7;i++){const p=(TT*.45+i/7)%1;alphaDo(a*(1-p)*.9,()=>circ(x+14*Math.sin(p*4+i)*s,y-p*200*s,(12+p*40)*s,'rgba(255,255,255,.6)'));}}
function silencer(x){const g=gyy(x);box(x-38,g-190,76,190,'#c9d1d6','rgba(0,0,0,.3)',1);box(x-44,g-196,88,8,'#aeb8be');box(x-46,g-6,92,6,'#6a747a');
  for(let i=1;i<4;i++)ln([x-38,g-190+i*46,x+38,g-190+i*46],'rgba(0,0,0,.15)',1);}
function weirBox(x){const g=gyy(x);box(x,g-32,90,32,'#8d989f','rgba(0,0,0,.3)',1);box(x+4,g-26,82,10,'#58b8d0');poly([x+60,g-32,x+72,g-18,x+84,g-32],'#6a747a');}
/* 圖解：套管深度刻度（非線性） */
const CY=m=>236+544*Math.sqrt(m/2000);
const CAS=[ // [名稱, 管徑, 孔徑 in, 管徑 in, 上端 m, 下深 m, 作用, 顏色]
 ['導管','20"',26,20,0,50,'防止表土崩塌','#aeb8be'],
 ['表層套管','13-3/8"',17.5,13.375,0,300,'隔絕淺層地下水','#7dc8dc'],
 ['生產套管','9-5/8"',12.25,9.625,0,1000,'承受高溫高壓','#f2c230'],
 ['割縫襯管','7"',8.5,7,950,2000,'儲集層段，讓熱水流入','#ff8a60']];

const EP={no:2,slug:'geothermal',seriesName:'地熱系列',t:'地熱鑽井',en:'Drilling a geothermal well',
lede:'地熱電廠的熱水，要靠一口口深井從地下兩千公尺上下取出來。這一集走上鑽井平台，看鑽機如何旋轉鑽進、泥漿如何帶出岩屑並冷卻鑽頭、套管與水泥如何層層保護井壁、定向鑽井怎麼從同一井場鑽向不同裂隙，以及完井後怎麼用流量測試判斷一口井的產能。',
facts:[['近 4,000','m','員山 1 號井：台灣第一口深層地熱探測井的鑽井深度'],
['約 150','°C','員山 1 號井井底實測溫度'],
['約 90','°C/km','員山井 3,500 m 以下的地溫梯度，顯示下方有上湧熱源'],
['15','口','1976 年起中油在宜蘭清水、土場鑽的地熱井，深 902–3,000 m'],
['4 + 1','口','東部地區地熱鑽井計畫：宜蘭 4 口淺井與 1 口深層探勘井'],
['4','層','典型地熱井的套管層數：導管、表層、生產套管與割縫襯管（示例）']],
note:'說明：本集為教育用途示意動畫，鑽機、井徑與深度比例經過壓縮，套管圖採非線性深度刻度。員山 1 號井鑽深近 4,000 m、井底實測約 150°C、3,500 m 以下每公里升溫約 90°C，以及完鑽後轉為光纖監測井，依中央研究院新聞稿與媒體報導；1976 年起中油在清水、土場鑽 15 口深 902–3,000 m 的地熱井、最高約 230°C，依蘭陽博物館與能源教育資源資料；宜蘭 4 口淺井與 1 口深層探勘井依經濟部能源署「東部地區地熱鑽井計畫」；冬山第二口深層井依能源署地熱單一服務窗口轉載報導。井架高度、鑽桿長度、鑽井工期、套管尺寸與下深、造斜點與井斜角、唇壓、流量、焓值與測試天數皆為文獻常見範圍的典型範例，實際數值依各井設計而定。',
base:()=>geoBase(),
shots:[
{t:'鑽井平台與鑽機',en:'The drilling rig',dur:13,side:true,
 d:'地熱井的鑽法與石油井相近。先整出一塊平坦的井場，架起鑽機：高約 40 公尺的井架吊著游車與頂部驅動，帶動鑽桿與鑽頭旋轉鑽進；每根鑽桿約 9 公尺，鑽深一段就在鑽台接上新的一根。井場旁有鑽桿架、發電機、泥漿池與泥漿泵，鑽台下方裝著防噴器。一口約 2,000 公尺的地熱井，常要鑽上一到兩個月（示例）。',
 s:[[0,'整平井場，架起高約 40 m 的鑽機井架'],[.28,'頂部驅動帶著鑽桿與鑽頭旋轉鑽進'],[.52,'每鑽深一段，就在鑽台接上一根新鑽桿'],[.76,'鑽頭一路向下，穿過一層層地層']],
 cam:u=>camMix({x:800,y:450,s:1},{x:800,y:560,s:1},ease(seg(u,.3,.5))),
 draw(u){
  const k=seg(u,.3,.95),dm=2000*ease(k),cyc=(k*9)%1,g=gyy(WX),F=g-64,hy=u<.3?F-200:lerp(F-250,F-40,cyc);
  const yb=wellUG(WX,dm,{cas:300});
  flowDots([[WX,g],[WX,yb]],6,MUD,seg(u,.3,.36)*(dm>30?1:0),.5,2.5);
  rig(WX,{hy});
  lab(WX-24,g-250,'井架',{dx:-110,dy:-20,st:'s',a:band(u,.02,.3)});
  lab(WX+80,F,'鑽台',{dx:90,dy:-60,a:band(u,.04,.3)});
  lab(WX-265,g-30,'鑽桿架',{dx:-30,dy:-80,a:band(u,.06,.3)});
  lab(WX+245,g-42,'泥漿池',{dx:40,dy:-80,a:band(u,.08,.34)});
  lab(WX+14,hy+10,'頂部驅動',{dx:110,dy:-30,st:'s',a:band(u,.3,.55)});
  lab(WX,yb,'鑽頭',{dx:90,dy:0,st:'s',a:band(u,.5,1)});
  lab(WX-300,g+DPX(1150),'蓋層',{dx:0,dy:-40,a:band(u,.76,1),minor:true});
  lab(WX-300,g+DPX(1990),'地熱儲集層',{dx:-40,dy:-40,st:'w',a:band(u,.82,1)});
 },
 hud(u){hudPanel(240,150,'鑽井進度（示例）',seg(u,.05,.1),w=>{const dm=2000*ease(seg(u,.3,.95));
  hrow(56,'鑽頭深度',Math.round(dm)+' m',w,PWR);hrow(88,'鑽桿',trf('{n} 根',{n:Math.ceil(dm/9.5)}),w,'#fff');hrow(120,'井架高度','約 40 m',w,'#7dffc4');});}},

{t:'旋轉鑽進與泥漿循環',en:'Rotary drilling and mud',dur:13,
 d:'鑽頭旋轉時，靠鑽壓把岩石磨碎或壓碎。鑽井泥漿由泥漿泵打進鑽桿內部，從鑽頭的噴嘴噴出，再沿著鑽桿與井壁之間的環空上返，把岩屑帶回地面。泥漿同時冷卻鑽頭、以自身重量平衡地層壓力，並在井壁形成泥餅防止崩塌。回到地面的泥漿經振動篩分離岩屑；地熱井的泥漿回流溫度高，常再經冷卻塔降溫後重複使用。',
 s:[[0,'頂部驅動帶動鑽桿，鑽頭磨碎岩石'],[.25,'泥漿由鑽桿內往下，從鑽頭噴出'],[.5,'泥漿沿環空上返，把岩屑帶回地面'],[.75,'振動篩分離岩屑，泥漿冷卻後再循環']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'泥漿循環（示意）',20,'#f2c230',700);
  const X=330,S=320;
  box(80,S,680,470,'rgba(122,75,58,.35)');ln([80,S,760,S],'rgba(227,236,238,.6)',2);
  const R=rng(5);for(let i=0;i<16;i++){const x=90+R()*660,y=S+30+R()*420;if(Math.abs(x-X)<70)continue;ln([x,y,x+14+R()*18,y+6+R()*10],'rgba(0,0,0,.3)',2);}
  box(X-44,S,88,440,'#1d2328');ln([X-44,S,X-44,S+440],'rgba(227,236,238,.5)',2);ln([X+44,S,X+44,S+440],'rgba(227,236,238,.5)',2);
  box(X-12,238,24,480,'#aeb8be');box(X-7,238,14,480,'#44535c');
  const rot=TT*6;poly([X-38,718,X+38,718,X+30,752,X,768,X-30,752],'#f2c230','rgba(0,0,0,.4)',1.5);
  for(let i=0;i<3;i++){const px=X-24+i*24+6*Math.sin(rot+i*2);circ(px,742,5,'#b98f16');}
  box(X-22,198,44,40,STEEL,'rgba(0,0,0,.35)',1);
  /* 地面設備 */
  const PX=560,PY=S-6;box(470,PY-48,210,48,'#8d989f','rgba(0,0,0,.3)',1);box(474,PY-40,202,8,'#6f8e9a');
  box(420,PY-78,70,24,'#6a747a','rgba(0,0,0,.3)',1);
  circ(710,PY-24,22,'#1f7f99','rgba(0,0,0,.3)',1);ln([710,PY-24,710+14*Math.cos(TT*5),PY-24+14*Math.sin(TT*5)],'#fff',3);
  const Pdown=[[710,PY-46],[710,170],[X,170],[X,238],[X,718]],Pup=[[X+28,740],[X+28,S+10],[X+60,S-16],[420,PY-66]],Pret=[[490,PY-54],[600,PY-40],[690,PY-30]];
  pl([[710,PY-46],[710,170],[X,170],[X,198]],'rgba(141,152,159,.9)',6);pl([[X+44,S-4],[X+60,S-16],[420,PY-66]],'rgba(141,152,159,.9)',6);
  const a1=seg(u,.25,.3),a2=seg(u,.5,.55),a3=seg(u,.75,.8);
  flowDots(Pdown,14,MUD,a1,.25,5);
  if(a1>0)for(let i=0;i<6;i++){const p=(TT*1.4+i/6)%1;alphaDo(a1*(1-p),()=>{circ(X-20-p*16,768+p*6,3,MUD);circ(X+20+p*16,768+p*6,3,MUD);});}
  flowDots([[X-28,760],[X-28,S+10]],7,HOT,a2,.22,4.5);flowDots(Pup,8,HOT,a2,.22,4.5);
  if(a2>0){const R2=rng(9);for(let i=0;i<9;i++){const p=(TT*.22+R2())%1,y=lerp(760,S+10,p),x=X+(i%2?1:-1)*(22+R2()*14);alphaDo(a2,()=>box(x-3,y-3,6,6,'#b0a898'));}}
  flowDots(Pret,4,MUD,a3,.4,4.5);
  if(a3>0)for(let i=0;i<5;i++){const R3=rng(20+i);box(424+R3()*50,PY-10-R3()*6,7,5,'#b0a898');}
  wt(X-30,224,'頂部驅動',17,'rgba(227,236,238,.9)',700,'right');
  wt(710,PY+22,'泥漿泵',17,a1>0?'#7dc8dc':'rgba(227,236,238,.9)',700,'center');
  wt(575,PY-60,'泥漿池',17,'rgba(227,236,238,.9)',700,'center');
  wt(420,PY-88,'振動篩',17,a3>0?'#f2c230':'rgba(227,236,238,.9)',700,'center');
  alphaDo(a1,()=>{wt(X-60,480,'鑽桿（往下）',17,MUD,700,'right');});
  alphaDo(a2,()=>{wt(X+60,560,'環空（上返）',17,HOT,700,'left');wt(X+60,590,'帶著岩屑',16,'rgba(227,236,238,.85)',500,'left');});
  wt(X+60,748,'鑽頭',17,'#f2c230',700,'left');
  /* 右：泥漿的任務 */
  card(820,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(844,196,'泥漿的四個任務',20,'#f2c230',700);
  const T=[['帶出岩屑','沿環空把岩屑送回地面',.5,HOT],['冷卻鑽頭','高溫井常加裝泥漿冷卻塔',.62,MUD],['平衡地層壓力','泥漿重量壓住地層流體',.28,'#f2c230'],['穩定井壁','在井壁形成一層泥餅',.4,'#7dffc4']];
  T.forEach(([h,b,t0,col],i)=>{const y=226+i*140,on=seg(u,t0,t0+.06);card(844,y,672,120,{bg:on?'rgba(255,255,255,.07)':'rgba(255,255,255,.03)',st:on?col:'rgba(255,255,255,.12)'});
   box(844,y,8,120,on?col:'rgba(255,255,255,.15)');wt(876,y+50,h,21,on?col:'rgba(227,236,238,.6)',700);alphaDo(.35+.65*on,()=>wt(876,y+90,b,17,'rgba(227,236,238,.9)',500));});
 }},

{t:'套管與固井',en:'Casing and cementing',dur:14,
 d:'井愈鑽愈深，要分段下入鋼製套管，像望遠鏡一樣由粗到細。先下導管防止表土崩塌，再下表層套管隔絕淺層地下水，接著是承受高溫高壓的生產套管；儲集層段則放入開了縫的割縫襯管，讓熱水流進井內。每下一層套管，就把水泥從套管內泵下，經底部返到環空，一路填滿到地表。地熱井的套管通常全段固井，受熱膨脹時才不會變形。',
 s:[[0,'由粗到細，分段下入鋼製套管'],[.2,'表層套管隔絕淺層地下水'],[.4,'水泥從底部返到環空，一路填到地表'],[.72,'儲集層段放入割縫襯管，讓熱水流入']],
 draw(u){
  diagBG();
  card(60,150,500,650,{bg:'rgba(7,27,39,.75)'});
  const X=330,KP=4.4;
  box(210,CY(0),340,CY(2000)-CY(0),'rgba(122,75,58,.35)');ln([200,CY(0),550,CY(0)],'rgba(227,236,238,.7)',2);
  [0,50,300,1000,2000].forEach(m=>{ln([200,CY(m),210,CY(m)],'rgba(227,236,238,.7)',1.5);wt(194,CY(m)+6,m.toLocaleString('en-US')+' m',16,'rgba(227,236,238,.85)',600,'right',COND);});
  wt(84,196,'套管配置（示例）',20,'#f2c230',700);
  // 各段時間：[下套管開始, 下套管結束, 固井結束]
  const TM=[[.03,.1,.16],[.18,.26,.33],[.38,.48,.6],[.7,.84,.84]];
  const hw=i=>CAS[i][2]*KP,cw=i=>CAS[i][3]*KP;
  // 裸孔（依鑽進）
  CAS.forEach((c,i)=>{const top=i?CAS[i-1][5]:0,k=ease(seg(u,TM[i][0]-.03,TM[i][0]));if(k<=0)return;const y0=CY(i===3?1000:top),y1=lerp(y0,CY(c[5]),k);box(X-hw(i),y0,hw(i)*2,y1-y0,'#1d2328');});
  CAS.forEach((c,i)=>{const [t0,t1,t2]=TM[i],k=ease(seg(u,t0,t1));if(k<=0)return;
   const yTop=CY(c[4]),yShoe=CY(c[5]),yb=lerp(yTop,yShoe,k);
   if(i<3){const ck=ease(seg(u,t1,t2));if(ck>0){const yc=lerp(yShoe,yTop,ck),prevShoe=i?CY(CAS[i-1][5]):yTop,pin=i?cw(i-1)-3:hw(i);
     const y1=Math.max(yc,prevShoe);if(yShoe>y1)box(X-hw(i),y1,hw(i)*2,yShoe-y1,CEM);if(yc<prevShoe)box(X-pin,yc,pin*2,prevShoe-yc,CEM);}}
   box(X-cw(i),yTop,cw(i)*2,yb-yTop,'#1d2328');
   if(i<3){box(X-cw(i),yTop,4,yb-yTop,c[7]);box(X+cw(i)-4,yTop,4,yb-yTop,c[7]);}
   else{ctx.setLineDash([10,6]);ln([X-cw(i)+2,yTop,X-cw(i)+2,yb],c[7],4);ln([X+cw(i)-2,yTop,X+cw(i)-2,yb],c[7],4);ctx.setLineDash([]);box(X-cw(i)-4,yTop,cw(i)*2+8,6,'#aeb8be');}
   // 固井流動
   if(i<3){const ca=band(u,t1,t2);if(ca>0){flowDots([[X,yTop],[X,yShoe-4]],6,CEM,ca,.5,3.5);
     const pin=i?cw(i-1)-3:hw(i),mx=(cw(i)+pin)/2+(i?0:4);flowDots([[X-mx,yShoe],[X-mx,yTop]],6,'#ffffff',ca,.4,3);flowDots([[X+mx,yShoe],[X+mx,yTop]],6,'#ffffff',ca,.4,3);}}
  });
  const la=seg(u,.72,.8);if(la>0){for(let i=0;i<6;i++){const p=(TT*.4+i/6)%1,y=lerp(CY(1950),CY(1100),p);alphaDo(la,()=>{circ(X-cw(3)-10+p*6,y,4,HOT);circ(X+cw(3)+10-p*6,y,4,HOT);});}}
  alphaDo(seg(u,.4,.46)*(1-seg(u,.66,.7)),()=>{tag(X+96,CY(650),'水泥',{bg:'#c9d1d6',fg:'#13232e',size:16,align:'left'});ln([X+96,CY(650),X+cw(2)+6,CY(650)],'#c9d1d6',2);});
  wt(544,778,'深度刻度非線性',14,'rgba(227,236,238,.6)',500,'right');
  /* 右：套管表 */
  card(600,150,940,650,{bg:'rgba(7,27,39,.75)'});wt(624,196,'由粗到細的套管',20,'#f2c230',700);
  const CX=[624,856,976,1146];['套管','管徑','下深（示例）','作用'].forEach((h,j)=>wt(CX[j],246,h,16,'rgba(227,236,238,.65)',600));
  ln([620,262,1520,262],'rgba(255,255,255,.15)',1);
  const dep=['約 50 m','約 300 m','約 1,000 m','1,000–2,000 m'];
  CAS.forEach((c,i)=>{const y=312+i*72,k=seg(u,TM[i][0],TM[i][0]+.05),on=u>=TM[i][0]&&u<(i<3?TM[i+1][0]:1.01);
   alphaDo(.25+.75*k,()=>{if(on)box(612,y-40,916,60,'rgba(242,194,48,.08)');box(612,y-40,5,60,c[7]);
    wt(CX[0]+10,y,c[0],19,on?'#f2c230':'#fff',700);wt(CX[1],y,c[1],22,c[7],700,'left',COND);wt(CX[2],y,dep[i],18,'#fff',600,'left',COND);wt(CX[3],y,c[6],17,'rgba(227,236,238,.9)',500);});});
  const ca2=seg(u,.4,.48);
  alphaDo(ca2,()=>{card(624,610,892,166,{bg:'rgba(201,209,214,.08)',st:'rgba(201,209,214,.45)'});
   wt(648,652,'固井',20,'#c9d1d6',700);
   wt(648,690,'水泥由套管內泵入，從底部返到環空，一路填到地表',17,'#fff',500);
   wt(648,722,'地熱井多全段固井，套管受熱膨脹時才不會變形',17,'rgba(227,236,238,.85)',500);
   wt(648,754,'固井也封住各地層，防止熱水竄入淺層地下水',17,'rgba(227,236,238,.85)',500);});
 }},

{t:'定向鑽井',en:'Directional drilling',dur:13,side:true,
 d:'地熱儲集層的熱水多沿著斷層與裂隙流動，直井不一定碰得到。定向鑽井先垂直鑽到造斜點（KOP），再用井下泥漿馬達與隨鑽量測（MWD）控制方向，讓井身逐漸傾斜，斜穿更多裂隙帶。同一個井場可以朝不同方向鑽出多口井，井口集中，減少整地與道路，也方便日後集中管線。本例在 500 公尺處造斜，井斜 30°（示例）。',
 s:[[0,'同一井場，先鑽一口直井'],[.25,'到了造斜點，井身開始傾斜'],[.48,'泥漿馬達與隨鑽量測控制方向'],[.72,'斜井穿過更多裂隙帶，熱水較多']],
 cam:u=>({x:800,y:560,s:1}),
 draw(u){
  const g=gyy(WX),TH=30,RR=200;
  const W0=devPath(WX,0,0,0),W1=devPath(WX+16,1,TH,RR),W2=devPath(WX-16,-1,TH,RR);
  const e1=W1[W1.length-1],e2=W2[W2.length-1];
  const fh=band(u,.72,1);fractures(e1.x,1,fh>0);fractures(e2.x,1,fh>0);
  const f0=ease(seg(u,.02,.22)),f1=ease(seg(u,.24,.62)),f2=ease(seg(u,.62,.86));
  const dw=(P,f)=>{if(f<=0)return null;const Q=partial(P,f);pathLine(Q,'#aeb8be',11);pathLine(Q,'#1d2328',6);return Q[Q.length-1];};
  const b0=dw(W0,f0),b1=dw(W1,f1),b2=dw(W2,f2);
  [[b0,f0],[b1,f1],[b2,f2]].forEach(([b,f])=>{if(b&&f<1)circ(b.x,b.y,6,'#f2c230');});
  const ha=seg(u,.86,.94);if(ha>0){flowDots(toA(W1).reverse(),7,HOT,ha,.25,4);flowDots(toA(W2).reverse(),7,HOT,ha,.25,4);flowDots(toA(W0).reverse(),3,HOT,ha,.25,4);}
  for(const dx of [-16,0,16])box(WX+dx-5,g-8,10,8,'#6a747a');
  rig(WX,{hy:gyy(WX)-64-140});
  lab(WX,g+DPX(1400),'直井',{dx:-80,dy:-10,a:band(u,.04,.3)});
  lab(WX+16,g+DPX(500),'造斜點（KOP）',{dx:130,dy:-30,st:'s',a:band(u,.26,.55)});
  if(b1)lab(b1.x,b1.y,'泥漿馬達＋MWD',{dx:150,dy:-50,a:band(u,.46,.66)});
  lab(e1.x+40,900,'斷層裂隙帶',{dx:120,dy:-20,st:'w',a:band(u,.72,1)});
  lab(WX-200,g-4,'同一井場多口井',{dx:-80,dy:-90,st:'g',a:band(u,.66,1)});
 },
 hud(u){hudPanel(240,180,'定向井（示例）',seg(u,.05,.1),w=>{const W1=devPath(WX+16,1,30,200),md=pathLen(W1)*ease(seg(u,.24,.62)),st=devState(md,30,200);
  hrow(56,'井斜角',Math.round(st.a/DEG)+'°',w,PWR);hrow(88,'垂直深度',Math.round(st.tvd*PXM)+' m',w,'#fff');hrow(120,'水平位移',Math.round(st.hd*PXM)+' m',w,'#7dffc4');hrow(152,'量測深度',Math.round(md*PXM)+' m',w,'#fff');});}},

{t:'井控與高溫挑戰',en:'Well control in hot wells',dur:13,
 d:'地熱井溫度高，井內熱水一旦減壓，就可能閃化成蒸氣，體積急遽膨脹，把泥漿推出井口，稱為井涌，失控就成為井噴。鑽台下方的防噴器（BOP）組可在短時間內關閉：環形防噴器包住鑽桿，閘板封住井筒，再經節流管線慢慢釋壓。高溫也會讓泥漿變質、水泥強度下降，因此要冷卻泥漿、使用耐高溫水泥；遇到裂隙吸走泥漿，則改用充氣泥漿鑽進。',
 s:[[0,'壓力一降，高溫熱水就可能閃化成蒸氣'],[.2,'地層流體湧入井內，稱為井涌'],[.42,'防噴器關閉閘板，經節流管線控制壓力'],[.64,'冷卻泥漿、耐高溫水泥，對付高溫'],[.8,'裂隙吸走泥漿時，改用充氣泥漿鑽進']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(84,196,'防噴器組（BOP）',20,'#f2c230',700);
  const X=300,shut=ease(seg(u,.44,.52)),kick=seg(u,.2,.26),on=(t0,t1)=>u>=t0&&u<t1;
  // 套管與井筒
  box(X-40,680,80,110,'#1d2328');box(X-44,680,6,110,STEEL);box(X+38,680,6,110,STEEL);
  // 套管頭、四通、閘板、環形
  box(X-80,650,160,30,'#6a747a','rgba(0,0,0,.35)',1);
  box(X-60,590,120,60,STEEL,'rgba(0,0,0,.35)',1);box(X-30,590,60,60,'#1d2328');
  const ramBox=(y,col)=>{box(X-96,y,192,56,col,'rgba(0,0,0,.35)',1);box(X-30,y+8,60,40,'#1d2328');};
  ramBox(460,'#e8572a');ramBox(524,'#e8572a');
  const gap=lerp(84,10,shut);box(X-86,532,86-gap,24,'#aeb8be');box(X+gap,532,86-gap,24,'#aeb8be');
  box(X-86,468,14,24,'#c9d1d6');box(X+72,468,14,24,'#c9d1d6');
  poly([X-70,450,X-70,400,X-40,370,X+40,370,X+70,400,X+70,450],'#e8572a','rgba(0,0,0,.35)',1);box(X-26,380,52,70,'#1d2328');
  const an=lerp(26,10,shut);box(X-26,396,26-an,40,'#5c6770');box(X+an,396,26-an,40,'#5c6770');
  box(X-24,300,48,70,STEEL);box(X-18,300,36,70,'#1d2328');
  // 鑽桿
  box(X-8,230,16,560,'#aeb8be');
  // 壓井、節流管線
  ln([X-60,620,110,620],'#8d989f',6);
  ln([X+60,620,660,620,660,650],'#8d989f',6);box(610,650,100,50,'#6a747a','rgba(0,0,0,.35)',1);for(let i=0;i<3;i++)circ(632+i*28,675,8,'#1f7f99');
  // 井涌氣泡
  if(kick>0){for(let i=0;i<14;i++){const p=(TT*.45+i/14)%1,top=shut>.9?600:lerp(600,300,1-shut);const y=lerp(790,top,p),x=X+(i%2?1:-1)*(16+(i*7)%14);
    alphaDo(kick*(1-p*.5),()=>circ(x,y,4+p*3,'rgba(255,138,96,.9)','#fff',1));}}
  flowDots([[X+60,620],[660,620],[660,650]],5,HOT,seg(u,.52,.58),.4,5);
  // 標籤
  const cc=(a)=>a?'#f2c230':'rgba(227,236,238,.9)';
  wt(X+84,410,'環形防噴器',17,cc(on(.42,.64)),700,'left');
  wt(X+110,494,'盲板／剪切閘板',17,'rgba(227,236,238,.9)',700,'left');
  wt(X+110,558,'管柱閘板',17,cc(on(.42,.64)),700,'left');
  wt(84,606,'壓井管線',16,'rgba(227,236,238,.85)',600,'left');
  wt(500,606,'節流管線',16,cc(on(.52,.7)),600,'center');wt(660,730,'節流管匯',16,cc(on(.52,.7)),600,'center');
  wt(X+60,720,'套管頭',16,'rgba(227,236,238,.85)',600,'left');
  wt(X+20,262,'鑽桿',16,'rgba(227,236,238,.85)',600,'left');
  alphaDo(band(u,.2,.44),()=>tag(560,340,'井涌',{bg:'#e8572a',fg:'#fff',size:18,align:'center'}));
  alphaDo(seg(u,.52,.58),()=>tag(560,340,'井已關閉',{bg:'#7dffc4',fg:'#0e2a3b',size:18,align:'center'}));
  /* 右：高溫挑戰 */
  card(820,150,720,650,{bg:'rgba(7,27,39,.75)'});wt(844,196,'高溫地熱井的挑戰',20,'#f2c230',700);
  const T=[['閃化與井涌','熱水減壓沸騰，體積暴增','#e8572a',.2],['泥漿冷卻','地面冷卻塔降低回流泥漿溫度',MUD,.64],['耐高溫材料','耐熱水泥、套管熱膨脹設計','#f2c230',.7],['泥漿漏失','裂隙吸走泥漿，改用充氣泥漿','#7dffc4',.8]];
  T.forEach(([h,b,col,t0],i)=>{const y=226+i*140,k=seg(u,t0,t0+.06);if(k<=0)return;alphaDo(k,()=>{card(844,y,672,120,{bg:'rgba(255,255,255,.05)',st:col});box(844,y,8,120,col);
   wt(876,y+50,h,21,col,700);wt(876,y+90,b,17,'rgba(227,236,238,.9)',500);});});
 }},

{t:'井口設備與流量測試',en:'Wellhead and flow test',dur:13,side:true,
 d:'完井後鑽機移走，井口裝上主閥與側翼閥，控制熱水流出。先讓井垂直排放，把殘留的泥漿與岩屑沖乾淨；再把流體接到消音器，也就是大氣壓分離器：量測排放管末端的唇壓，並用堰箱量測分離出的熱水，就能推算總流量與焓值，判斷這口井能供應多少熱。測試常持續數週（示例），並觀察流量與溫度是否穩定。',
 s:[[0,'鑽機移走，井口裝上主閥與側翼閥'],[.25,'先垂直排放，把井內泥漿與岩屑沖乾淨'],[.5,'改接消音器，量測排放管末端的唇壓'],[.75,'堰箱量水，推算總流量與焓值']],
 cam:u=>camMix({x:800,y:560,s:1},{x:900,y:600,s:1.15},ease(seg(u,.02,.2))),
 draw(u){
  const g=gyy(WX),SX=1080,sg=gyy(SX),yL=g+DPX(1000),yE=g+DPX(2000);
  box(WX-12,g,24,DPX(300),'#aeb8be');box(WX-8,g,16,yE-g,'#8d989f');box(WX-5,g,10,yE-g,'#1d2328');
  ctx.setLineDash([8,5]);ln([WX-7,yL,WX-7,yE],HOT,3);ln([WX+7,yL,WX+7,yE],HOT,3);ctx.setLineDash([]);
  const vd=band(u,.25,.5),hd=seg(u,.5,.56),fa=Math.max(vd,hd);
  flowDots([[WX,yE],[WX,g]],8,HOT,fa,.35,3.5);
  if(fa>0)for(let i=0;i<6;i++){const p=(TT*.5+i/6)%1;alphaDo(fa*(1-p),()=>{circ(WX-16-p*10,yE-10-p*120,3.5,HOT);circ(WX+16+p*10,yE-10-p*120,3.5,HOT);});}
  bigWellhead(WX,{vent:vd>0});
  // 排放管、消音器、堰箱
  const pa=seg(u,.4,.5);alphaDo(pa,()=>{ln([WX+72,g-130,SX-60,g-130,SX-38,sg-120],'#8d989f',8);silencer(SX);weirBox(SX+56);
   circ(SX-76,g-148,10,'#dfe5e8','#44535c',2);ln([SX-76,g-148,SX-76+7*Math.cos(-.8-hd*1.4),g-148+7*Math.sin(-.8-hd*1.4)],'#e8572a',2);ln([SX-76,g-138,SX-76,g-134],'#44535c',2);});
  plume(WX,g-244,vd,.75);
  plume(SX,sg-206,hd,1.1);
  flowDots([[WX+72,g-130],[SX-60,g-130],[SX-38,sg-120]],6,'#ffffff',hd,.6,4);
  flowDots([[SX+40,sg-10],[SX+130,sg-10]],4,COOL,seg(u,.72,.78),.4,3.5);
  lab(WX-17,g-86,'主閥',{dx:-100,dy:-40,st:'s',a:band(u,.02,.26)});
  lab(WX+59,g-128,'側翼閥',{dx:70,dy:-70,a:band(u,.04,.26)});
  lab(WX,yL+20,'割縫襯管',{dx:-110,dy:-10,a:band(u,.06,.3)});
  lab(WX-8,g-236,'垂直排放',{dx:-130,dy:50,st:'w',a:band(u,.28,.5)});
  lab(SX-76,g-148,'唇壓量測',{dx:-40,dy:-80,st:'s',a:band(u,.52,.78)});
  lab(SX-38,sg-100,'消音器',{dx:-90,dy:40,a:band(u,.54,.8)});
  lab(SX+100,sg-26,'堰箱量水',{dx:30,dy:60,st:'g',a:band(u,.74,1)});
 },
 hud(u){hudPanel(240,180,'流量測試（示例）',seg(u,.05,.1),w=>{const k=ease(seg(u,.52,.8)),day=Math.max(1,Math.round(30*seg(u,.5,.98)));
  hrow(56,'測試',u<.5?'—':trf('第 {n} 天',{n:day}),w,'#fff');hrow(88,'唇壓',u<.52?'—':(2.4*k).toFixed(1)+' bar',w,PWR);
  hrow(120,'總流量',u<.52?'—':Math.round(60*k)+' t/h',w,COOL);hrow(152,'焓值',u<.76?'—':Math.round(630*ease(seg(u,.76,.9)))+' kJ/kg',w,HOT);});}},

{t:'從探勘井到生產井',en:'From exploration to production',dur:12,
 d:'地熱開發先做地表調查，綜合地質、溫泉化學與地球物理資料選定井位，再鑽探勘井確認溫度與地層，經流量測試證明產能後，才鑽生產井與回注井並興建電廠。台灣自 1976 年起在宜蘭清水、土場鑽過 15 口地熱井；中研院與中油合作的員山 1 號井鑽到近 4,000 公尺，井底實測約 150°C，完成後轉為光纖監測井，冬山的第二口深層井也接續開鑽。',
 s:[[0,'一口地熱井，從地表探勘開始'],[.26,'探勘井與流量測試，確認值得開發'],[.46,'再鑽生產井與回注井，接上電廠'],[.62,'台灣已鑽到近 4,000 m 的深層地熱'],[.8,'完鑽的井也能轉為監測井，持續量測']],
 draw(u){
  diagBG();
  const ST=[['地表探勘','地質與地球物理'],['探勘井','確認溫度與地層'],['流量測試','量測流量與焓值'],['生產井與回注井','同一井場多口井'],['地熱電廠','發電並持續監測']];
  const cur=u<.13?0:u<.26?1:u<.38?2:u<.5?3:4;
  ST.forEach(([h,b],i)=>{const x=60+i*296,t0=i*.12+.01,k=seg(u,t0,t0+.06);alphaDo(.25+.75*k,()=>{const on=i===cur&&u<.62;
   card(x,176,276,138,{bg:on?'rgba(242,194,48,.12)':'rgba(7,27,39,.75)',st:on?'#f2c230':'rgba(255,255,255,.16)'});
   wt(x+20,214,trf('步驟 {n}',{n:i+1}),16,'rgba(227,236,238,.65)',600,'left',COND);wt(x+20,254,h,19,on?'#f2c230':'#fff',700);wt(x+20,290,b,16,'rgba(227,236,238,.85)',500);
   if(i<4)arrow(x+280,245,x+292,245,'rgba(242,194,48,.8)',2.5);});});
  /* 左下：台灣的地熱鑽井 */
  alphaDo(seg(u,.54,.6),()=>{card(60,350,720,450,{bg:'rgba(7,27,39,.75)'});wt(84,396,'台灣的地熱鑽井',20,'#f2c230',700);
   const L=[['1976 年起','中油在清水、土場鑽 15 口地熱井','深 902–3,000 m，最高約 230°C','#ff8a60',.56],['2024–2025','員山 1 號井：第一口深層探測井','鑽到近 4,000 m，井底約 150°C','#f2c230',.64],['接續開鑽','冬山：第二口深層地熱井','目標約 4,000 m','#7dffc4',.7]];
   L.forEach(([dt,a,b,col,t0],i)=>alphaDo(seg(u,t0,t0+.05),()=>{const y=460+i*112;box(84,y-30,6,84,col);wt(106,y,dt,22,col,700,'left',COND);wt(106,y+32,a,18,'#fff',700);wt(106,y+60,b,16,'rgba(227,236,238,.85)',500);}));});
  /* 右下：井的角色 */
  alphaDo(seg(u,.78,.84),()=>{card(820,350,720,450,{bg:'rgba(7,27,39,.75)'});wt(844,396,'一口井的不同角色',20,'#f2c230',700);
   const R=[['探勘井','確認溫度、地層與流量','#ff9d7a'],['生產井','把熱水送到地面電廠','#ff8a60'],['回注井','把降溫的地熱水送回地下','#58b8d0'],['監測井','光纖量測地溫與微震','#7dffc4']];
   R.forEach(([h,b,col],i)=>{const y=460+i*84;circ(856,y-7,8,col);wt(878,y,h,19,col,700);wt(1030,y,b,17,'rgba(227,236,238,.9)',500);});});
 }}
]};
