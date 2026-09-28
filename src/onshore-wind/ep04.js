// KITS: land
/* 陸域風電系列 第 4 集：風場選址與風資源評估 */
const gyy=x=>groundY(x);
/* 正視的葉片與風機（取自第 2、3 集） */
function bladeF(cx,cy,a,L,w){w=w===undefined?1:w;ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
  const k=Math.max(.18,w);poly([8,-5*k,8+L*.2,-10*k,8+L,-1.5*k,8+L,1.5*k,8+L*.2,8*k,8,5*k],'#f4f6f7','rgba(0,0,0,.35)',1);ctx.restore();}
function turbine(x,gy,H,R,rot,o){o=o||{};const hy=gy-H,w0=Math.max(4,R*.09),w1=Math.max(2.5,R*.05);
  poly([x-w0,gy,x-w1,hy+R*.06,x+w1,hy+R*.06,x+w0,gy],o.tc||'#eef2f4','rgba(0,0,0,.3)',1);
  box(x-R*.1,hy-R*.08,R*.2,R*.13,'#e3e8ec','rgba(0,0,0,.3)',1);
  for(let i=0;i<3;i++)bladeF(x,hy,rot+i*TAU/3-Math.PI/2,R,o.w);
  circ(x,hy,Math.max(3,R*.07),'#dfe5e8','rgba(0,0,0,.4)',1);return {x,y:hy};}
/* 風線：y 範圍內，速度 sp 可為函式 sp(y) */
function windLines(y0,y1,n,sp,a,seed,len,col){if(a<=0)return;const r=rng(seed||3);ctx.lineCap='round';
  for(let i=0;i<n;i++){const y=y0+r()*(y1-y0),ph=r(),s=(typeof sp==='function'?sp(y):sp)*(.8+.4*r()),L=(len||60)*(.6+.8*r());const x=VX0-200+((ph*2400+TT*s)%(VX1-VX0+400));
   alphaDo(a*(.3+.35*r()),()=>ln([x,y,x+L*s/200,y],col||'#ffffff',2));}ctx.lineCap='butt';}
/* 杯式風速計（頂視旋轉的三杯） */
function cupAnemo(x,y,sp){ln([x,y,x,y+8],'#394650',2);const a=TT*sp;for(let i=0;i<3;i++){const q=a+i*TAU/3;ln([x,y,x+Math.cos(q)*9,y+Math.sin(q)*3],'#394650',1.5);circ(x+Math.cos(q)*9,y+Math.sin(q)*3,2.6,'#e8572a');}}
/* 簡易房屋（頂視） */
function roofs(cx,cy,n,seed){const r=rng(seed);for(let i=0;i<n;i++){const x=cx+(r()-.5)*90,y=cy+(r()-.5)*70;box(x-7,y-6,14,12,'#e9dcc7','rgba(0,0,0,.4)',1);ln([x-7,y,x+7,y],'rgba(168,88,62,.9)',2);}}
/* 樹（側視） */
function tree(x,y,s){box(x-2*s,y-14*s,4*s,14*s,'#6f5a44');circ(x,y-22*s,11*s,'#4f7a3a');circ(x-6*s,y-16*s,8*s,'#5c8a3f');circ(x+6*s,y-17*s,8*s,'#5c8a3f');}

/* 分鏡 1 尺度：每公尺 2.6 px */
const PXM=2.6,HUB=110,ROT=68,MAST=80;
const vz=(z,a,vr)=>vr*Math.pow(Math.max(z,1)/HUB,a);          // 冪次律風切
/* 分鏡 2：韋伯分布（k=2，平均約 7 m/s，示意） */
const WBk=2,WBc=7.9;const wb=v=>(WBk/WBc)*Math.pow(v/WBc,WBk-1)*Math.exp(-Math.pow(v/WBc,WBk));
/* 分鏡 4：山丘地形 */
const HX=560,hillY=x=>GY-150*Math.exp(-Math.pow((x-HX)/230,2))+4*Math.sin(x*.013);
/* 分鏡 6：地圖上的限制圖層（頂視，0.25 px/m） */
const VIL=[[600,330,9,5],[960,640,11,8],[1330,470,8,12]];
const CAND=[[430,250],[430,370],[430,470],[760,470],[760,610],[1090,280],[1090,380],[760,720],[1060,420],[1500,590]];
const inBuf=(x,y)=>VIL.some(([vx,vy])=>Math.hypot(x-vx,y-vy)<125);

const EP={no:4,slug:'onshore-wind',seriesName:'陸域風電系列',t:'風場選址與風資源評估',en:'Choosing a site and assessing the wind',
lede:'風機的發電量與風速的三次方成正比，選址時差一點風速，二十年下來就差很多電。這一集從測風塔與光達開始，看地表粗糙度、地形與尾流如何改變風，以及住宅距離、生態與雷達等限制如何決定風機能放在哪裡。',
facts:[['7–8','m/s','台灣風力資源最豐富地區的年平均風速（能源署）'],
['2/3','輪轂高度','測風塔高度建議至少達風機輪轂高度的三分之二（MEASNET 指引）'],
['≥ 1','年','現地測風的典型期間，再與長期氣象資料比對修正'],
['+33','%','風速增加 10%，風能約增加 33%：功率與風速的三次方成正比'],
['5–9','D','主風向上前後風機的典型間距，D 為轉子直徑（示例）'],
['500','m','風機基座距最近建築物 500 公尺以下須實施環評（環評認定標準第 29 條）']],
note:'說明：本集為教育用途示意動畫，風機、測風塔、地形與地圖比例經過調整。台灣風力資源最豐富地區年平均風速可達 7–8 m/s 引自經濟部能源署；測風塔高度至少達輪轂高度三分之二為 MEASNET 風資源評估指引的建議；風機基座中心與最近建築物邊界直線距離 500 公尺以下須實施環評，引自「開發行為應實施環境影響評估細目及範圍認定標準」第 29 條。風切指數、地表粗糙度長度、韋伯分布、尾流風速、風機間距、限制圖層與可開發面積、發電量損失與 P50／P90 分布皆為典型範例，並非特定案場資料；實際評估依 IEC 61400 系列標準、各機型與主管機關規定進行。',
base:()=>{landSky(GY,{sun:{x:1320,y:120},clouds:true});drawGround();},
shots:[
/* 1 ─────────────────────────────── 測風塔與光達 */
{t:'先量一年的風',en:'Measuring the wind for a year',dur:13,side:true,
 d:'決定蓋風場之前，要先知道這裡的風有多強、多穩定。開發商會在候選場址豎起測風塔，在不同高度裝上杯式風速計與風向計，量出風速怎麼隨高度增加。測風塔最好至少達到預定輪轂高度的三分之二；現代風機輪轂常在 100 公尺以上，因此也常搭配地面光達（LiDAR），以雷射量測輪轂與葉尖高度的風。現地量測通常至少一年，涵蓋完整的季風循環，再和附近氣象站的長期資料比對修正。',
 s:[[0,'候選場址上，先豎起一座測風塔'],[.25,'不同高度的風速計，量出風怎麼隨高度變強'],[.48,'地面光達以雷射，量到輪轂與葉尖的高度'],[.74,'至少量測一年，涵蓋完整的季風循環']],
 cam:u=>camMix({x:800,y:450,s:1},{x:780,y:430,s:1.05},ease(seg(u,.1,.8))),
 draw(u){
  /* 遠方防風林 */
  for(let i=0;i<9;i++)tree(1330+i*34,gyy(1330+i*34)+2,1.1+.2*Math.sin(i*2.1));
  /* 風線：越高越快 */
  windLines(90,560,26,y=>120+320*Math.pow(Math.max(5,(GY-y)/PXM)/HUB,.16),.9,4,70);
  /* 預定風機（虛線輪廓） */
  const TXg=1060,hy=GY-HUB*PXM,R=ROT*PXM;
  alphaDo(.55+.45*band(u,.05,.3),()=>{ctx.setLineDash([9,7]);ln([TXg,gyy(TXg),TXg,hy],'rgba(255,255,255,.85)',2.5);
   ctx.beginPath();ctx.arc(TXg,hy,R,0,TAU);ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);circ(TXg,hy,6,'rgba(255,255,255,.85)');});
  tick(TXg+10,hy,trf('輪轂 {h} m',{h:HUB}),'right');
  /* 測風塔：從地面逐段升起 */
  const MX=420,g0=gyy(MX),mh=MAST*PXM*ease(seg(u,0,.22)),top=g0-mh;
  if(mh>2){ln([MX-6,g0,MX-4,top],'#c9d1d6',2.5);ln([MX+6,g0,MX+4,top],'#c9d1d6',2.5);
   ctx.beginPath();for(let y=g0,k=0;y>top;y-=14,k++){ctx.moveTo(MX-5,y);ctx.lineTo(MX+5,y-14<top?top:y-14);}ctx.strokeStyle='rgba(201,209,214,.8)';ctx.lineWidth=1.2;ctx.stroke();
   [[-150,1],[150,1],[-95,.6],[95,.6]].forEach(([dx,f])=>ln([MX,g0-mh*f,MX+dx,gyy(MX+dx)],'rgba(60,70,80,.45)',1));
   [40,60,80].forEach((z,i)=>{const y=g0-z*PXM;if(y<top-1)return;ln([MX,y,MX+34,y],'#9aa3a8',2);cupAnemo(MX+34,y-8,4+i*1.5);});
   if(mh>=MAST*PXM-1){ln([MX,top,MX-26,top],'#9aa3a8',2);poly([MX-26,top-8,MX-40,top-2,MX-26,top+2],'#e8572a');}
   box(MX-12,g0-30,24,26,'#dfe5e8','rgba(0,0,0,.4)',1);box(MX-8,g0-26,16,6,'#7dffc4');}
  [40,60,80].forEach(z=>{if(mh>=z*PXM-1)tick(MX-10,g0-z*PXM,z+' m','left');});
  /* 光達 */
  const LX=760,lg=gyy(LX),kl=seg(u,.44,.5);
  box(LX-22,lg-26,44,26,'#dfe5e8','rgba(0,0,0,.4)',1);box(LX-14,lg-32,28,6,'#394650');
  if(kl>0)alphaDo(kl,()=>{for(const s of [-1,1]){ctx.setLineDash([5,7]);ln([LX,lg-32,LX+s*72,hy-R*.9],'rgba(125,255,196,.7)',1.8);ctx.setLineDash([]);}
   const H=[40,70,100,130,160];H.forEach((z,i)=>{const y=lg-32-z*PXM*.98,w=72*(z*PXM)/(lg-32-(hy-R*.9));const p=(TT*.8+i*.2)%1;
    ln([LX-w,y,LX+w,y],'rgba(125,255,196,.35)',1.5);circ(LX-w,y,3.5,'#7dffc4');circ(LX+w,y,3.5,'#7dffc4');alphaDo(1-p,()=>circ(LX,y,2+3*p,'#7dffc4'));});});
  /* 量測天數 */
  const kd=seg(u,.74,.78);if(kd>0)alphaDo(kd,()=>{const d=Math.round(365*ease(seg(u,.76,.98)));card(480,650,380,90,{bg:'rgba(7,27,39,.85)'});
   wt(500,684,'現地量測',17,'#f2c230',700);wt(840,690,trf('{d} 天',{d}),30,'#fff',700,'right',COND);
   box(500,712,340,10,'rgba(255,255,255,.12)');box(500,712,340*d/365,10,'#7dffc4');});
  lab(MX,top,'測風塔',{dx:-60,dy:-60,st:'l',a:band(u,.12,.4)});
  lab(MX+34,g0-60*PXM-8,'杯式風速計',{dx:90,dy:-40,a:band(u,.24,.48)});
  lab(LX,lg-20,'地面光達（LiDAR）',{dx:80,dy:40,st:'g',a:band(u,.48,.74)});
  lab(TXg,hy-R,'葉尖最高處',{dx:-90,dy:-30,a:band(u,.52,.74),minor:true});
 },
 hud(u){hudPanel(250,150,'各高度風速（示例）',seg(u,.05,.1),w=>{const n=k=>nz(TT*.4+k)*.25;
  hrow(56,'130 m',trf('{v} m/s',{v:(vz(130,.16,7.6)+n(1)).toFixed(1)}),w,u>.48?'#7dffc4':'rgba(227,236,238,.4)');
  hrow(88,'80 m',trf('{v} m/s',{v:(vz(80,.16,7.6)+n(2)).toFixed(1)}),w,'#f2c230');
  hrow(120,'40 m',trf('{v} m/s',{v:(vz(40,.16,7.6)+n(3)).toFixed(1)}),w,'#fff');});}},

/* 2 ─────────────────────────────── 三次方 */
{t:'風速差一點，發電差很多',en:'A little more wind, a lot more power',dur:13,
 d:'風帶來的功率等於二分之一乘上空氣密度、掃掠面積與風速的三次方。風速是三次方，所以風速增加 10%，風能就增加約 33%；年平均 6 m/s 與 7 m/s 的場址，風能相差近六成。但只看平均風速並不夠，風速一年到頭都在變化，常用韋伯分布描述各風速出現的時間比例。把時間比例乘上風速的三次方就會發現，大部分的能量其實來自比平均值更強、但出現時間較少的風。',
 s:[[0,'風的功率，與風速的三次方成正比'],[.28,'平均風速 7 m/s 比 6 m/s，風能多了近六成'],[.52,'一年之中，每種風速出現的時間不同'],[.76,'大部分的能量，來自比平均更強的風']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'風的功率',20,'#f2c230',700);
  alphaDo(seg(u,0,.06),()=>{wt(410,275,'P = ½ ρ A v³',44,'#fff',700,'center',COND);
   wt(410,318,'ρ 空氣密度，A 掃掠面積，v 風速',17,'rgba(227,236,238,.85)',600,'center');});
  const VS=[5,6,7,8],base=Math.pow(6,3);
  VS.forEach((v,i)=>{const g=ease(seg(u,.1+i*.05,.2+i*.05)),r=Math.pow(v,3)/base,x=130+i*150,h=r*170*g,by=700;
   box(x,by-h,90,h,v===7?'#f2c230':v===6?'#7dc8dc':'rgba(125,200,220,.45)');
   wt(x+45,by+28,v+' m/s',20,'rgba(227,236,238,.9)',700,'center',COND);
   if(g>.9)wt(x+45,by-h-12,Math.round(r*100)+'%',20,v===7?'#f2c230':'#fff',700,'center',COND);});
  ln([110,700,720,700],'rgba(255,255,255,.4)',1.5);
  alphaDo(seg(u,.1,.16),()=>wt(84,380,'相對風能（以 6 m/s 為 100%）',16,'rgba(227,236,238,.85)',600));
  alphaDo(seg(u,.3,.36),()=>tag(410,760,'風速 +10% → 風能約 +33%',{size:18,bg:'#f2c230',align:'center'}));
  /* 右：韋伯分布與能量 */
  const C=chartBox(800,160,740,640,{title:'一年的風速分布（示例）',x0:0,x1:25,y0:0,y1:1,xt:[0,5,10,15,20,25],yt:[],xl:'風速 m/s',yl:'比例',pl:70,pt:70,pb:70,gx:5,gy:4});
  const kb=seg(u,.5,.66),mx=.2;
  for(let v=0;v<24;v++){const f=wb(v+.5)/0.095;if(v/24>kb)break;box(C.X(v)+3,C.Y(f*.62),C.X(1)-C.X(0)-6,C.Y(0)-C.Y(f*.62),'rgba(125,200,220,.55)');}
  alphaDo(seg(u,.5,.56),()=>{box(C.px+24,C.py+22,16,16,'rgba(125,200,220,.75)');wt(C.px+48,C.py+36,'出現時間',16,'#7dc8dc',700);});
  const ke=seg(u,.72,.86);if(ke>0){const E=v=>wb(v)*v*v*v/115;ctx.beginPath();for(let v=0;v<=25*ke;v+=.1){const x=C.X(v),y=C.Y(E(v)*.9);v?ctx.lineTo(x,y):ctx.moveTo(x,y);}
   ctx.strokeStyle='#f2c230';ctx.lineWidth=3.5;ctx.stroke();}
  alphaDo(seg(u,.72,.78),()=>{ln([C.px+24,C.py+62,C.px+40,C.py+62],'#f2c230',3.5);wt(C.px+48,C.py+68,'帶來的能量',16,'#f2c230',700);});
  alphaDo(seg(u,.56,.62),()=>{ctx.setLineDash([6,6]);ln([C.X(7),C.Y(0),C.X(7),C.Y(.95)],'#fff',2);ctx.setLineDash([]);wt(C.X(7)+10,C.Y(.8),'平均 7 m/s',16,'#fff',700,'left');});
  alphaDo(seg(u,.86,.92),()=>tag(C.X(16.5),C.Y(.5),'能量集中在較強的風',{size:17,bg:'#f2c230',align:'center'}));
 }},

/* 3 ─────────────────────────────── 粗糙度與風切 */
{t:'地表粗糙度與風切',en:'Surface roughness and wind shear',dur:13,
 d:'風吹過地表會被摩擦減速，越接近地面越慢，這種風速隨高度改變的現象稱為風切。地表越粗糙，減速越明顯：海面與開闊的沙灘最平滑，農田與零星房屋次之，防風林、村落與城鎮最粗糙。工程上以粗糙度長度或風切指數描述，平坦開闊的陸地常用約 1/7（0.14）的風切指數。同樣的高空風，在粗糙地表上方輪轂高度的風速明顯較低，葉片上下緣的風速差也更大，增加葉片的疲勞載重。',
 s:[[0,'風貼近地面時被摩擦減速'],[.3,'地表越粗糙，輪轂高度的風越弱'],[.56,'海面、農田、防風林與村落，粗糙度各不相同'],[.8,'風切大，葉片上下的受力差也大']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,700,640,{title:'風速隨高度變化（示例）',x0:0,x1:10,y0:0,y1:200,xt:[0,2,4,6,8,10],yt:[0,50,100,150,200],xl:'風速 m/s',yl:'高度 m',pl:80,pt:70,pb:70,gx:5,gy:4});
  alphaDo(seg(u,.1,.14),()=>wt(C.X(.3),C.Y(62)-30,'輪轂高度的風速',16,'rgba(227,236,238,.85)',600));
  alphaDo(seg(u,.02,.08),()=>{box(C.px,C.Y(HUB+ROT),C.pw,C.Y(HUB-ROT)-C.Y(HUB+ROT),'rgba(242,194,48,.08)');ctx.setLineDash([6,6]);ln([C.px,C.Y(HUB),C.px+C.pw,C.Y(HUB)],'rgba(242,194,48,.7)',1.5);ctx.setLineDash([]);
   wt(C.px+10,C.Y(HUB+ROT)+22,'葉片掃掠範圍',15,'#f2c230',700);wt(C.px+10,C.Y(HUB)-8,trf('輪轂 {h} m',{h:HUB}),15,'#f2c230',700);});
  const PR=[[.11,'海面','#7dc8dc'],[.16,'農田','#7dffc4'],[.3,'村落與防風林','#ff9d7a']];
  PR.forEach(([a,t,c],i)=>{const k=seg(u,.1+i*.14,.24+i*.14);if(k<=0)return;const vr=8.8*Math.pow(HUB/200,a);
   ctx.beginPath();for(let z=2;z<=2+198*k;z+=2){const x=C.X(vz(z,a,vr)),y=C.Y(z);z===2?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=c;ctx.lineWidth=3;ctx.stroke();
   for(let z=20;z<=2+198*k;z+=30){const x=C.X(vz(z,a,vr));alphaDo(.35,()=>arrow(C.X(0)+4,C.Y(z),x,C.Y(z),c,1));}
   if(k>.98){const v=vz(HUB,a,vr);circ(C.X(v),C.Y(HUB),6,c,'#13232e',1.5);wt(C.X(.3),C.Y(62)+i*30,tr(t)+(LANG==='en'?': ':'：')+v.toFixed(1)+' m/s',17,c,700,'left');}});
  /* 右：粗糙度長度 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'常見地表的粗糙度長度 z₀（示例）',20,'#f2c230',700);
  const RG=[['海面、開闊水域','0.0002 m','#7dc8dc'],['沙灘與開闊草地','0.03 m','#7dc8dc'],['農田與零星房屋','0.1 m','#7dffc4'],['防風林與村落','0.5 m','#ff9d7a'],['城鎮','1 m 以上','#ff9d7a']];
  RG.forEach(([t,v,c],i)=>alphaDo(seg(u,.5+i*.05,.55+i*.05),()=>{const y=240+i*96,ix=880,iy=y+58;
   box(830,y,680,82,'rgba(255,255,255,.04)','rgba(255,255,255,.14)',1);box(830,y,6,82,c);
   if(i===0){ctx.beginPath();for(let x=-34;x<=34;x+=2)ctx.lineTo(ix+x,iy-10+3*Math.sin(x*.3+TT*2));ctx.strokeStyle=c;ctx.lineWidth=2.5;ctx.stroke();}
   else if(i===1){for(let k=-4;k<=4;k++)ln([ix+k*8,iy-8,ix+k*8+2,iy-18],c,2);ln([ix-36,iy-8,ix+36,iy-8],c,2);}
   else if(i===2){ln([ix-36,iy-8,ix+36,iy-8],c,2);for(let k=-3;k<=1;k++)ln([ix+k*8,iy-8,ix+k*8,iy-14],c,2);box(ix+16,iy-26,16,18,c);}
   else if(i===3){for(let k=-2;k<=2;k++)circ(ix+k*14,iy-22,8,c);ln([ix-36,iy-8,ix+36,iy-8],c,2);}
   else{[[-30,26],[-12,40],[6,30],[22,46]].forEach(([dx,h])=>box(ix+dx,iy-8-h,14,h,c));}
   wt(950,y+50,t,20,'#fff',700);wt(1480,y+52,v,26,c,700,'right',COND);}));
  alphaDo(seg(u,.8,.86),()=>tag(1170,745,'平坦開闊陸地：風切指數約 1/7',{size:17,bg:'#f2c230',align:'center'}));
 }},

/* 4 ─────────────────────────────── 地形與障礙物 */
{t:'地形與障礙物',en:'Terrain and obstacles',dur:13,side:true,
 base:()=>{landSky(GY,{sun:{x:1320,y:120},clouds:true});
  ctx.beginPath();ctx.moveTo(VX0,hillY(VX0));for(let x=VX0;x<=VX1;x+=6)ctx.lineTo(x,hillY(x));ctx.lineTo(VX1,VY1+20);ctx.lineTo(VX0,VY1+20);ctx.closePath();ctx.fillStyle='#7a9a55';ctx.fill();
  ctx.beginPath();ctx.moveTo(VX0,hillY(VX0)+18);for(let x=VX0;x<=VX1;x+=8)ctx.lineTo(x,hillY(x)+18+nz(x*.01)*4);ctx.lineTo(VX1,VY1+20);ctx.lineTo(VX0,VY1+20);ctx.closePath();ctx.fillStyle='#a4876a';ctx.fill();
  ctx.beginPath();ctx.moveTo(VX0,hillY(VX0)+120);for(let x=VX0;x<=VX1;x+=8)ctx.lineTo(x,hillY(x)+120+nz(x*.01+2)*4);ctx.lineTo(VX1,VY1+20);ctx.lineTo(VX0,VY1+20);ctx.closePath();ctx.fillStyle='#c4a678';ctx.fill();},
 d:'風場的地形會重新塑造風。平緩的山丘或台地讓氣流在頂端被壓縮加速，山脊上的風速可比平地高出一成以上，但坡度太陡時，背風面會出現分離與亂流。建築物與防風林則像一道牆，下風處數倍於其高度的範圍內都是低速而紊亂的氣流，會降低發電量並加重疲勞載重。台灣西部沿海地勢平坦，常見的障礙物是木麻黃防風林、魚塭堤岸與聚落，評估時要以數值模型模擬這些地形與障礙物的影響。',
 s:[[0,'風從海面吹來，越過平緩的山丘'],[.28,'氣流在丘頂被壓縮，風速變快'],[.52,'防風林與房屋後方，是一片低速亂流'],[.76,'風機放在丘頂受益，放在障礙物後方吃虧']],
 draw(u){
  /* 流線：丘頂收斂 */
  const kf0=seg(u,.02,.1);
  for(let j=0;j<6;j++){const h0=40+j*55;alphaDo(kf0*(.9-j*.1),()=>{ctx.beginPath();
    for(let x=VX0;x<=1000;x+=8){const bump=(GY-hillY(x))*(1-j*.14);const y=GY-h0-Math.max(0,bump)*.95+(j*.14)*0;x===VX0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1.6;ctx.stroke();});
   /* 移動粒子，速度與流線間距成反比 */
   for(let k=0;k<3;k++){const r=rng(j*7+k);let p=(r()+TT*.12)%1;const x=lerp(VX0,1000,p);const bump=(GY-hillY(x))*(1-j*.14);const y=GY-h0-Math.max(0,bump)*.95;
    alphaDo(kf0,()=>circ(x,y,3.2,j<3?'#f2c230':'#fff'));}}
  /* 丘頂加速示意 */
  const ka=band(u,.28,.56);if(ka>0)alphaDo(ka,()=>{arrow(HX-80,hillY(HX)-36,HX+90,hillY(HX)-36,'#f2c230',5);arrow(160,GY-40,260,GY-40,'rgba(255,255,255,.9)',3);});
  /* 障礙物：防風林與房屋 */
  for(let i=0;i<8;i++)tree(1000+i*20,hillY(1000+i*20)+2,1.8);
  const HXx=1180;box(HXx,hillY(HXx+30)-46,60,46,'#e9dcc7','rgba(0,0,0,.3)',1);poly([HXx-5,hillY(HXx+30)-46,HXx+30,hillY(HXx+30)-70,HXx+65,hillY(HXx+30)-46],'#a8583e');
  /* 亂流區 */
  const kt=seg(u,.5,.58);if(kt>0)alphaDo(kt,()=>{ctx.beginPath();ctx.moveTo(1150,GY-58);ctx.bezierCurveTo(1300,GY-110,1500,GY-90,1640,GY-30);ctx.lineTo(1640,GY);ctx.lineTo(1150,GY);ctx.closePath();ctx.fillStyle='rgba(232,87,42,.16)';ctx.fill();
   for(let i=0;i<9;i++){const cx=1200+i*48+10*Math.sin(TT+i),cy=GY-26-18*Math.sin(i*1.7),r=10+6*Math.sin(i*2.3);ctx.beginPath();ctx.arc(cx,cy,r,TT*3+i,TT*3+i+4.2);ctx.strokeStyle='rgba(232,87,42,.8)';ctx.lineWidth=2;ctx.stroke();}});
  /* 風機比較 */
  const kw=ease(seg(u,.74,.84));
  if(kw>0)alphaDo(kw,()=>{const T1=turbine(HX,hillY(HX),150,80,TT*1.8);const T2=turbine(1420,gyy(1420),150,80,TT*.7);
   circ(T1.x,T1.y-110,16,'#7dffc4');ln([T1.x-7,T1.y-110,T1.x-2,T1.y-104,T1.x+8,T1.y-116],'#13232e',3);
   circ(T2.x,T2.y-110,16,'#e8572a');ln([T2.x-6,T2.y-116,T2.x+6,T2.y-104],'#fff',3);ln([T2.x+6,T2.y-116,T2.x-6,T2.y-104],'#fff',3);});
  lab(HX,hillY(HX),'丘頂加速',{dx:-120,dy:-120,st:'s',a:band(u,.3,.56)});
  lab(1070,hillY(1070)-40,'防風林',{dx:-40,dy:-80,st:'l',a:band(u,.48,.72)});
  lab(1380,GY-50,'下風處亂流',{dx:40,dy:-120,st:'w',a:band(u,.54,.76)});
  lab(HX+40,hillY(HX)-150,'風速較高',{dx:120,dy:-30,st:'g',a:band(u,.8,1)});
  lab(1420,gyy(1420)-150,'風弱且紊亂',{dx:-60,dy:-70,st:'w',a:band(u,.8,1)});
 }},

/* 5 ─────────────────────────────── 尾流與排列 */
{t:'尾流與風機排列',en:'Wakes and turbine layout',dur:14,
 d:'風機從風中取走能量，身後會留下一道風速較低、亂流較強的尾流，要往下游數倍轉子直徑的距離才慢慢恢復。因此風機不能排得太密：與主風向垂直的方向常相隔 3–5 倍轉子直徑，主風向上的前後間距常拉開到 5–9 倍。台灣西部沿海秋冬以東北季風為主，排列時會讓風機列與主風向垂直。即使如此，整個風場因尾流而損失的發電量，常見仍在 5–15% 之間。',
 s:[[0,'風機取走能量，身後留下一道尾流'],[.3,'尾流中的風較慢，也較紊亂'],[.52,'前後拉開 5–9 倍直徑，左右 3–5 倍'],[.78,'風場的尾流損失，常見在 5–15%']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'風場排列（頂視示意）',20,'#f2c230',700);
  const D=24,dx=7*D,dy=4*D,x0=200,y0=380,COLS=3,ROWS=4;
  /* 風向箭頭 */
  for(let i=0;i<4;i++){const y=320+i*96,p=(TT*.6+i*.25)%1;alphaDo(.4+.6*(1-p),()=>arrow(84+p*30,y,124+p*30,y,'#fff',2.5));}
  wt(100,290,'主風向',16,'#fff',700,'center');
  /* 尾流 */
  const kw=seg(u,.06,.3);
  for(let c=0;c<COLS;c++)for(let r=0;r<3;r++){const x=x0+c*dx,y=y0+r*dy-50;
   if(kw>0){const L=(c<COLS-1?dx*1.9:dx*1.3)*kw;ctx.beginPath();ctx.moveTo(x+4,y-D/2);ctx.lineTo(x+L,y-D/2-L*.08);ctx.lineTo(x+L,y+D/2+L*.08);ctx.lineTo(x+4,y+D/2);ctx.closePath();
    const g=ctx.createLinearGradient(x,0,x+L,0);g.addColorStop(0,'rgba(232,87,42,.45)');g.addColorStop(1,'rgba(232,87,42,0)');ctx.fillStyle=g;ctx.fill();
    for(let k=0;k<3;k++){const p=(TT*.5+k/3+c*.2+r*.1)%1;alphaDo(kw*(1-p),()=>{ctx.beginPath();ctx.arc(x+10+p*L*.9,y+Math.sin(TT*3+k+r)*4,4+4*p,0,TAU);ctx.strokeStyle='rgba(255,157,122,.7)';ctx.lineWidth=1.5;ctx.stroke();});}}}
  for(let c=0;c<COLS;c++)for(let r=0;r<3;r++){const x=x0+c*dx,y=y0+r*dy-50;box(x-4,y-5,10,10,'#dfe5e8');
   ln([x,y-D/2,x,y+D/2],'#fff',4);circ(x,y,3,'#394650');}
  /* 尺寸標註 */
  alphaDo(seg(u,.5,.56),()=>{const yy=y0+2*dy-50+62;ln([x0,yy,x0+dx,yy],'#f2c230',2);ln([x0,yy-8,x0,yy+8],'#f2c230',2);ln([x0+dx,yy-8,x0+dx,yy+8],'#f2c230',2);
   wt(x0+dx/2,yy+30,'前後 5–9 D',18,'#f2c230',700,'center');
   const xx=x0+2*dx+44;ln([xx,y0-50,xx,y0-50+dy],'#7dffc4',2);ln([xx-8,y0-50,xx+8,y0-50],'#7dffc4',2);ln([xx-8,y0-50+dy,xx+8,y0-50+dy],'#7dffc4',2);
   wt(xx+14,y0-50+dy/2+6,'左右 3–5 D',18,'#7dffc4',700,'left');});
  alphaDo(seg(u,.56,.62),()=>{wt(410,720,'D：轉子直徑，例如 136 m',17,'rgba(227,236,238,.85)',600,'center');
   tag(410,760,'風機列與東北季風垂直',{size:17,bg:'#dfe5e8',align:'center'});});
  /* 右：尾流中的風速 */
  const C=chartBox(800,160,740,640,{title:'下游風機感受到的風速（示例）',x0:2,x1:11,y0:60,y1:100,xt:[3,5,7,9,11],yt:[60,70,80,90,100],xl:'下游距離（倍轉子直徑）',yl:'%',pl:70,pt:70,pb:70,gx:4,gy:4});
  const wk=x=>100*(1-.553/Math.pow(1+.15*x,2));
  const kc=seg(u,.28,.5);if(kc>0){ctx.beginPath();for(let x=2;x<=2+9*kc;x+=.05){const X=C.X(x),Y=C.Y(wk(x));x===2?ctx.moveTo(X,Y):ctx.lineTo(X,Y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=3;ctx.stroke();}
  alphaDo(seg(u,.28,.34),()=>{ctx.setLineDash([6,6]);ln([C.px,C.Y(100),C.px+C.pw,C.Y(100)],'rgba(255,255,255,.6)',1.5);ctx.setLineDash([]);wt(C.px+C.pw-10,C.Y(100)+22,'未受擾動的風',15,'rgba(227,236,238,.85)',600,'right');});
  alphaDo(seg(u,.6,.66),()=>{const v=wk(7);circ(C.X(7),C.Y(v),7,'#f2c230','#13232e',1.5);ln([C.X(7),C.Y(v),C.X(7),C.Y(74.5)],'rgba(242,194,48,.5)',1.5);
   tag(C.X(7),C.Y(72),trf('7 D：風速 {v}%',{v:Math.round(v)}),{size:17,bg:'#f2c230',align:'center'});
   wt(C.X(7),C.Y(72)+44,trf('三次方：發電約少 {p}%',{p:Math.round(100-Math.pow(v/100,3)*100)}),17,'#ff9d7a',700,'center');});
  alphaDo(seg(u,.8,.86),()=>tag(C.X(6.5),C.Y(94)+34,'整個風場尾流損失常見 5–15%',{size:17,bg:'#ff9d7a',align:'center'}));
 }},

/* 6 ─────────────────────────────── 限制圖層 */
{t:'哪裡能蓋：層層篩選',en:'Where turbines can go',dur:14,
 d:'風好的地方不一定能蓋。選址時會把各種限制畫成圖層逐一疊上：聚落與住家要保持距離，風機基座距最近建築物 500 公尺以下就必須實施環境影響評估，還要符合低頻噪音管制；濕地與保護區、候鳥遷徙路線要避開；機場、氣象與軍事雷達附近有高度與干擾限制。再考慮超長葉片的運輸道路與併網變電所的距離，最後剩下的區域才依尾流間距排出風機位置。',
 s:[[0,'風場範圍內，先標出聚落與住家'],[.22,'以 500 公尺畫出與住家的距離'],[.44,'避開濕地保護區與候鳥路線'],[.62,'雷達與航空限高也要排除'],[.8,'剩下的空間，才排得出風機位置']],
 draw(u){
  diagBG();
  const MX0=60,MY0=160,MW=1480,MH=640;
  ctx.save();rrp(MX0,MY0,MW,MH,4);ctx.clip();
  box(MX0,MY0,MW,MH,'#b8c79a');
  /* 海與海岸 */
  const cst=y=>250+26*Math.sin(y*.012)+14*Math.sin(y*.031);
  ctx.beginPath();ctx.moveTo(MX0,MY0);for(let y=MY0;y<=MY0+MH;y+=8)ctx.lineTo(cst(y),y);ctx.lineTo(MX0,MY0+MH);ctx.closePath();ctx.fillStyle='#4f8fb4';ctx.fill();
  ctx.beginPath();for(let y=MY0;y<=MY0+MH;y+=8)ctx.lineTo(cst(y)+14,y);ctx.strokeStyle='#e6dcb4';ctx.lineWidth=16;ctx.stroke();
  for(let i=0;i<6;i++){const y=MY0+60+i*100,p=(TT*.3+i*.2)%1;alphaDo(.5,()=>ln([100+p*60,y,130+p*60,y],'rgba(255,255,255,.7)',2));}
  /* 田埂格線 */
  ctx.strokeStyle='rgba(90,120,60,.25)';ctx.lineWidth=1;ctx.beginPath();for(let x=320;x<MX0+MW;x+=70){ctx.moveTo(x,MY0);ctx.lineTo(x+20,MY0+MH);}for(let y=MY0+50;y<MY0+MH;y+=60){ctx.moveTo(300,y);ctx.lineTo(MX0+MW,y+10);}ctx.stroke();
  /* 道路與變電所 */
  ln([300,560,700,540,1000,520,1540,560],'#e9e2d0',8);ln([300,560,700,540,1000,520,1540,560],'rgba(120,110,90,.6)',1);
  box(1470,690,46,40,'#dfe5e8','#394650',2);ln([1474,694,1512,726],'#394650',1.5);ln([1512,694,1474,726],'#394650',1.5);
  /* 聚落 */
  VIL.forEach(([x,y,n,s])=>roofs(x,y,n,s));
  /* 圖層 1：住家距離 */
  const k1=seg(u,.22,.3);if(k1>0)alphaDo(k1,()=>VIL.forEach(([x,y])=>{ctx.beginPath();ctx.arc(x,y,125,0,TAU);ctx.fillStyle='rgba(232,87,42,.28)';ctx.fill();ctx.setLineDash([8,6]);ctx.strokeStyle='#e8572a';ctx.lineWidth=2.5;ctx.stroke();ctx.setLineDash([]);}));
  /* 圖層 2：濕地與候鳥路線 */
  const k2=seg(u,.44,.52);if(k2>0)alphaDo(k2,()=>{poly([280,600,420,590,500,680,470,800,280,800],'rgba(88,184,208,.55)','#58b8d0',2.5);
   ctx.beginPath();for(let y=MY0;y<=MY0+MH;y+=8)ctx.lineTo(cst(y)+60,y);ctx.strokeStyle='rgba(179,124,255,.35)';ctx.lineWidth=70;ctx.stroke();
   for(let i=0;i<4;i++){const p=(TT*.08+i*.25)%1,y=MY0+MH-p*MH;const x=cst(y)+60;ln([x-8,y+6,x,y,x+8,y+6],'#fff',2);}});
  /* 圖層 3：雷達 */
  const k3=seg(u,.62,.7);if(k3>0)alphaDo(k3,()=>{const rx=1230,ry=760;ctx.beginPath();ctx.arc(rx,ry,165,0,TAU);ctx.fillStyle='rgba(179,124,255,.25)';ctx.fill();ctx.strokeStyle='#b37cff';ctx.lineWidth=2.5;ctx.stroke();
   const a=TT*1.5;ln([rx,ry,rx+Math.cos(a)*160,ry+Math.sin(a)*160],'rgba(255,255,255,.7)',2);circ(rx,ry,8,'#fff','#394650',2);});
  /* 候選風機 */
  const k4=seg(u,.78,.9);
  CAND.forEach(([x,y],i)=>{const a=seg(k4,i/CAND.length*.8,i/CAND.length*.8+.2);if(a<=0)return;alphaDo(a,()=>{circ(x,y,13,'#13232e','#f2c230',3);ln([x,y-9,x,y+9],'#f2c230',3);});});
  ctx.restore();
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.5;rrp(MX0,MY0,MW,MH,4);ctx.stroke();
  /* 比例尺與圖名 */
  box(1080,210,125,6,'#13232e');wt(1142,238,'500 m',16,'#13232e',700,'center',COND);
  wt(MX0+20,MY0+200,'台灣海峽',18,'rgba(255,255,255,.85)',700);
  tag(360,202,'沿海風場規劃範圍（示意）',{size:16,bg:'#dfe5e8'});
  alphaDo(band(u,.02,.3),()=>{tag(600,420,'聚落',{size:16,bg:'#dfe5e8',align:'center'});tag(960,730,'聚落',{size:16,bg:'#dfe5e8',align:'center'});});
  alphaDo(band(u,.26,.5),()=>tag(600,470,'距住家 500 m',{size:16,bg:'#e8572a',align:'center'}));
  alphaDo(band(u,.48,.72),()=>{tag(560,760,'濕地保護區',{size:16,bg:'#58b8d0',align:'center'});tag(420,300,'候鳥路線',{size:16,bg:'#b37cff',align:'center'});});
  alphaDo(band(u,.64,.84),()=>tag(1230,630,'雷達干擾與限高',{size:16,bg:'#b37cff',align:'center'}));
  alphaDo(band(u,.7,1),()=>{tag(1100,500,'葉片運輸道路',{size:16,bg:'#dfe5e8',align:'center'});tag(1470,670,'變電所',{size:16,bg:'#dfe5e8',align:'center'});});
  alphaDo(seg(u,.86,.92),()=>tag(800,640,'候選風機位置',{size:17,bg:'#f2c230',align:'center'}));
 },
 hud(u){const A=u<.26?100:u<.48?lerp(100,74,ease(seg(u,.26,.34))):u<.66?lerp(74,58,ease(seg(u,.48,.56))):lerp(58,49,ease(seg(u,.66,.74)));
  hudPanel(250,120,'篩選結果（示例）',seg(u,.05,.1),w=>{hrow(56,'可開發面積',Math.round(A)+'%',w,'#7dffc4');
   hrow(88,'候選風機',trf('{n} 部',{n:Math.round(CAND.length*seg(u,.78,.9))}),w,'#f2c230');});}},

/* 7 ─────────────────────────────── 發電量評估 */
{t:'從測風到年發電量',en:'From wind data to annual energy',dur:13,
 d:'最後把所有資料串起來：一年的現地量測先與附近氣象站十年以上的長期資料比對，修正成長期平均（MCP 方法）；再用風場流場模型把測風點的風推算到每一個機位，套上機型的功率曲線，扣掉尾流、可用率、電氣與其他損失，得到淨年發電量。因為風每年都不同，評估結果以機率表示：P50 是一半的年份會超過的發電量，P90 則有九成機率會超過，銀行融資通常以 P90 為依據。',
 s:[[0,'現地一年的資料，與長期氣象資料比對修正'],[.28,'以模型推算每個機位的風，套上功率曲線'],[.52,'扣掉尾流、可用率與電氣損失，得到淨發電量'],[.76,'以 P50 與 P90 表示發電量的不確定性']],
 draw(u){
  diagBG();
  const ST=['現地測風','長期修正','流場模型','功率曲線','扣除損失','年發電量'];
  ST.forEach((t,i)=>{const x=80+i*245,on=u>=.02+i*.06,cur=on&&(i===ST.length-1||u<.08+i*.06);
   box(x,170,210,70,on?'#16384c':'rgba(255,255,255,.04)',on?'#f2c230':'rgba(255,255,255,.25)',2);
   wt(x+105,213,t,20,on?'#f2c230':'rgba(227,236,238,.6)',800,'center');
   if(i<ST.length-1)arrow(x+212,205,x+242,205,on?'#f2c230':'rgba(255,255,255,.3)',2.5);});
  /* 左：損失瀑布 */
  const C=chartBox(60,280,700,520,{title:'年發電量的損失（示例）',x0:0,x1:6,y0:0,y1:110,xt:[],yt:[0,25,50,75,100],yl:'%',pl:70,pt:64,pb:70,gx:1,gy:4});
  const WF=[['總發電量',100,0,'#7dc8dc'],['尾流',-8,100,'#ff9d7a'],['可用率',-3,92,'#ff9d7a'],['電氣損失',-2,89,'#ff9d7a'],['其他',-2,87,'#ff9d7a'],['淨發電量',85,0,'#7dffc4']];
  WF.forEach(([t,v,b,c],i)=>{const k=ease(seg(u,.3+i*.04,.36+i*.04));if(k<=0)return;const x=C.X(i+.18),w=C.X(.64)-C.X(0);
   const y0=v>0?0:b+v,y1=v>0?v:b;const top=C.Y(lerp(v>0?0:b,y1,1)),hh=(C.Y(y0)-C.Y(y1))*k;
   box(x,v>0?C.Y(0)-hh:C.Y(b),w,hh,c);
   wt(x+w/2,(v>0?C.Y(v):C.Y(b))-10,(v>0?'':'−')+Math.abs(v)+'%',17,c,700,'center',COND);
   wt(x+w/2,C.Y(0)+26,t,15,'rgba(227,236,238,.9)',700,'center');});
  /* 右：P50 / P90 */
  const D=chartBox(800,280,740,520,{title:'淨年發電量的機率分布（示例）',x0:60,x1:110,y0:0,y1:1.1,xt:[60,70,80,90,100,110],yt:[],xl:'淨年發電量（相對值）',pl:50,pt:64,pb:70,gx:5,gy:2});
  const mu=85,sg=7.5,pdf=x=>Math.exp(-.5*Math.pow((x-mu)/sg,2));
  const kd=seg(u,.58,.7);if(kd>0){ctx.beginPath();ctx.moveTo(D.X(60),D.Y(0));for(let x=60;x<=60+50*kd;x+=.25)ctx.lineTo(D.X(x),D.Y(pdf(x)));ctx.lineTo(D.X(60+50*kd),D.Y(0));ctx.closePath();ctx.fillStyle='rgba(125,200,220,.3)';ctx.fill();
   ctx.beginPath();for(let x=60;x<=60+50*kd;x+=.25){const X=D.X(x),Y=D.Y(pdf(x));x===60?ctx.moveTo(X,Y):ctx.lineTo(X,Y);}ctx.strokeStyle='#7dc8dc';ctx.lineWidth=3;ctx.stroke();}
  const p90=mu-1.2816*sg;
  alphaDo(seg(u,.7,.74),()=>{ln([D.X(mu),D.Y(0),D.X(mu),D.Y(1.02)],'#7dffc4',2.5);tag(D.X(mu),D.Y(1.02)-2,'P50',{size:17,bg:'#7dffc4',align:'center'});});
  alphaDo(seg(u,.74,.78),()=>{ln([D.X(p90),D.Y(0),D.X(p90),D.Y(.72)],'#f2c230',2.5);tag(D.X(p90),D.Y(.72)-2,'P90',{size:17,bg:'#f2c230',align:'center'});
   wt(D.X(103),D.Y(.72),'P50：一半年份會超過',16,'#7dffc4',700,'center');wt(D.X(103),D.Y(.72)+28,'P90：九成機率會超過',16,'#f2c230',700,'center');});
  alphaDo(seg(u,.84,.9),()=>tag(D.X(94),D.Y(.3),'融資常以 P90 為依據',{size:16,bg:'#dfe5e8',align:'center'}));
 }}
]};
