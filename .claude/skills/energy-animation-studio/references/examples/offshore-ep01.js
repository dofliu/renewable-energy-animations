// KITS: marine
/* ================= EP01 風況量測 ================= */
const FX=420,HK1=1.35;
const windV1=h=>10.3*Math.pow(Math.max(h,5)/150,.11)+.3*Math.sin(TT*1.9+h*.07);
const hY=h=>SEA-h*HK1;
function flsTop(){return {x:FX,y:wlAt(FX,.9)-31};}
function mooring(x,wl,p){
  const top={x,y:wl+20},an={x:lerp(x,x-70,p),y:lerp(wl+26,bedY(x-70)-4,p)};
  ctx.setLineDash([3,2.2]);ctx.beginPath();ctx.moveTo(top.x,top.y);ctx.quadraticCurveTo(lerp(top.x,an.x,.3)+10,lerp(top.y,an.y,.62),an.x,an.y);ctx.strokeStyle='#2b3035';ctx.lineWidth=1.7;ctx.stroke();ctx.setLineDash([]);
  box(an.x-9,an.y-5,18,10,'#4d5760');
}
function beamCone(ox,oy,topY,ta,a){
  const hw0=(oy-topY)*Math.tan(ta);alphaDo(a,()=>{poly([ox,oy,ox-hw0,topY,ox+hw0,topY],'rgba(120,255,200,.08)');
  ln([ox,oy,ox-hw0,topY],'rgba(140,255,210,.35)',1);ln([ox,oy,ox+hw0,topY],'rgba(140,255,210,.35)',1);
  const sa=Math.sin(TT*2.4)*ta;ln([ox,oy,ox+Math.tan(sa)*(oy-topY),topY],'rgba(160,255,215,.9)',1.4);});
}
function windStreaks(a,y0,y1){alphaDo(a,()=>{for(let i=0;i<24;i++){const y=lerp(y0,y1,i/23),v=windV1((SEA-y)/HK1),x=((i*97+TT*v*16)%1900)-150;ln([x,y,x+26+v,y],'rgba(255,255,255,.33)',1.2);}});}
/* statistics used in shots 6-7 */
const WB_C=10,WB_K=2.1;
const wbPdf=v=>(WB_K/WB_C)*Math.pow(v/WB_C,WB_K-1)*Math.exp(-Math.pow(v/WB_C,WB_K));
const wbBin=v=>Math.exp(-Math.pow(v/WB_C,WB_K))-Math.exp(-Math.pow((v+1)/WB_C,WB_K));
const PC=v=>v<3||v>25?0:v>=11?15:15*(v*v*v-27)/(1331-27);
const BINS=[...Array(30)].map((_,v)=>({v,p:wbBin(v),e:PC(v+.5)*wbBin(v)*8.76}));
const AEPG=BINS.reduce((s,b)=>s+b.e,0);
const LOSS=[['尾流損失',.07],['可用率',.03],['電氣損失',.02],['其他（降載、電網限制等）',.015]];
const AEPN=LOSS.reduce((s,l)=>s*(1-l[1]),AEPG);
const MON=[11.5,10.8,9.6,7.8,6.4,6.0,5.8,6.2,8.2,11.2,12.0,12.1];
const ROSE=[.07,.21,.17,.08,.04,.025,.02,.025,.04,.07,.06,.04,.03,.025,.03,.045];

const EP={no:1,slug:'offshore-wind',seriesName:'離岸風場開發系列',total:13,t:'風況量測',en:'Wind resource assessment',
lede:'風場值不值得蓋，取決於風。這一集拆解浮動式光達如何用雷射量風、如何在海上連續量測一整年，以及這些數據最後怎麼變成年發電量與融資依據。',
facts:[['12','個月以上','測風期至少涵蓋完整四季，實務上常量測 1–2 年，再以長期氣象資料校正'],['1.55','μm','光達使用的人眼安全紅外雷射波長'],['20–300','m','浮動式光達可量測的高度範圍，涵蓋整個風機掃掠面'],['10','分鐘','風資料以 10 分鐘平均值統計，是業界標準'],['8.9','m/s','本集範例：輪轂高度年平均風速（韋伯 A=10、k=2.1）'],[Math.round(AEPN/131.4*100)+'','%','本集範例：扣除各項損失後的單機容量因數']],
note:'說明：本集為教育用途的示意動畫，高度與距離比例經過調整。風速、韋伯參數、功率曲線與各項損失比例均為典型範例值，實際數值依各場址量測結果、機型與顧問報告而定。',
shots:[
/* 1 */{t:'佈放浮動式光達',en:'Deploying the floating LiDAR',dur:12,side:true,
 d:'浮動式光達系統（FLS）是一座裝著光達的黃色浮標，上面還有太陽能板、小型風機與備用電源，讓它能在海上獨立運作一年以上。工作船把浮標運到預定場址，以吊臂放入海中，再用錨鍊與沉錘固定在海床上。它的成本與施工難度都遠低於在海上蓋一座固定式測風塔。',
 s:[[0,'工作船載著浮動式光達駛向預定場址'],[.28,'吊臂把浮標吊離甲板，緩緩放入海中'],[.55,'錨鍊與沉錘落到海床，把浮標定位在場址中心'],[.8,'佈放完成，工作船返港，浮標開始自主運作']],
 cam:()=>({x:440,y:520,s:1.45}),
 draw(u){
  let w=lerp(-320,FX-60,easeOut(seg(u,0,.26)));if(u>.8)w=lerp(FX-60,1300,easeIn(seg(u,.8,1)));
  const wl=wlAt(w+65,.8),deck=wl-14,bwl=wlAt(FX,.9);
  vsl(w,130,false,{damp:.8},vWorkboat);
  let b;if(u<.3)b={x:w+34,y:deck-20,f:0};else if(u<.52){const p=kf(u,[[.3,w+34,deck-20],[.36,w+34,deck-62],[.44,FX,deck-62],[.52,FX,bwl]]);b={x:p.x,y:p.y,f:0};}else b={x:FX,y:bwl,f:1};
  const stow={x:w+62,y:deck-26};let hk=stow;
  if(u>=.27&&u<.3)hk=lerpPt(stow,{x:w+34,y:deck-66},ease(seg(u,.27,.3)));else if(u>=.3&&u<.54)hk={x:b.x,y:b.y-46};else if(u>=.54&&u<.62)hk=lerpPt({x:FX,y:bwl-46},stow,ease(seg(u,.54,.62)));
  crane(w+14,deck-12,100,hk.x,hk.y,{solid:true,w:4,col:'#f2c230'});
  if(u>=.53)mooring(FX,bwl,ease(seg(u,.53,.68)));
  buoy(b.x,b.y,b.f?TT:0,1);
  lab(w+97,deck-46,'工作船',{dy:-40,a:band(u,.05,.5)});
  lab(b.x+18,b.y-20,'浮動式光達 FLS',{dx:80,dy:-40,a:seg(u,.4,.45)});
  lab(FX-70,bedY(FX-70)-6,'沉錘與錨鍊',{dx:90,dy:-24,a:seg(u,.66,.7)});
  lab(FX-16,bwl-24,'太陽能板＋小型風機供電',{dx:-100,dy:-60,a:band(u,.72,1),minor:true});
 },
 hud(u){hudPanel(230,150,'典型浮標規格',seg(u,.6,.66),w=>{hrow(52,'浮體直徑','約 2.5 m',w);hrow(78,'量測高度','20–300 m',w);hrow(104,'自主運作','12 個月以上',w);hrow(130,'適用水深','約 20–200 m',w);});}},
/* 2 */{t:'光達怎麼量風',en:'Doppler principle',dur:14,
 d:'光達（LiDAR）向空中發射紅外雷射，空氣中肉眼看不見的微粒（灰塵、鹽粒、水氣）會把一小部分光反射回來。因為這些微粒隨風移動，回波的頻率會稍微改變，這就是都卜勒效應，和救護車經過時警笛聲調改變是同一個原理。頻率的偏移量與「沿著光束方向」的風速成正比，量到頻移就能算出風速。',
 s:[[0,'光達向上發射人眼安全的紅外雷射（波長約 1.55 μm）'],[.24,'空氣中的微粒隨風移動，把一小部分光散射回來'],[.48,'回波頻率產生都卜勒偏移，偏移量與沿光束方向的風速成正比'],[.76,'一道光只量得到沿光束的分量，所以需要多個方向的光束']],
 draw(u){
  diagBG();
  const ox=360,oy=790,ang=28*Math.PI/180,dx=Math.sin(ang),dy=-Math.cos(ang),L=680,ex=ox+dx*L,ey=oy+dy*L;
  const beamA=seg(u,.02,.1);
  // particles
  const r=rng(7),vpx=70;
  for(let i=0;i<150;i++){const x0=r()*1100,y=150+r()*620,x=((x0+TT*vpx)%1000)+20;const px=x-ox,py=y-oy,t=px*dx+py*dy,d=Math.abs(px*dy-py*dx);
    const on=beamA>0&&t>0&&t<L*beamA&&d<16&&u>.2;circ(x,y,on?3.4:2,on?'#b7ffe2':'rgba(210,225,235,.35)');
    if(on&&u>.24){ring(x,y,6+((TT*3+i)%1)*10,'rgba(183,255,226,.35)',1);}}
  // wind arrows
  alphaDo(seg(u,.2,.26),()=>{for(const y of [260,470,680]){arrow(90,y,230,y,'rgba(242,194,48,.8)',3);}wt(90,235,'風',22,'#f2c230',700);});
  // beam and waves
  const cur=L*beamA;ln([ox,oy,ox+dx*cur,oy+dy*cur],'rgba(255,90,74,.25)',10);
  const wave=(off,lam,ph,col,amp,t0,t1)=>{ctx.beginPath();const nx=-dy,ny=dx;for(let t=t0;t<=t1;t+=3){const s=Math.sin((t/lam+ph)*TAU)*amp;const x=ox+dx*t+nx*(s+off),y=oy+dy*t+ny*(s+off);t===t0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=2.4;ctx.stroke();};
  wave(-8,34,-TT*2,'#ff6a55',7,0,cur);
  if(u>.3){const k=seg(u,.3,.4);wave(10,27,TT*2.6,'#7dffc4',6,0,cur*k);}
  box(ox-40,oy-8,80,50,'#f2c230');box(ox-26,oy-22,52,16,'#394650');circ(ox,oy-22,8,'#1c252c');
  wt(ox,oy+76,'光達',22,'#fff',700,'center');
  alphaDo(seg(u,.32,.38),()=>{wt(ex+18,ey+60,'發射光 f₀',20,'#ff8a78',700);wt(ex+18,ey+90,'回波 f₀＋Δf',20,'#7dffc4',700);});
  // right panel
  alphaDo(seg(u,.46,.52),()=>{
   card(960,170,580,620,{bg:'rgba(7,27,39,.8)'});
   wt(990,216,'都卜勒頻移',22,'#f2c230',700);
   wt(990,300,'Δf ＝ 2 × vᵣ ÷ λ',44,'#fff',700,'left',COND);
   const V=10+1.5*Math.sin(TT*.9),vr=V*Math.sin(ang),df=2*vr/1.55;
   wt(990,350,'vᵣ：沿光束方向的風速　λ：雷射波長 1.55 μm',17,'rgba(227,236,238,.8)');
   hrowW(990,400,'水平風速',V.toFixed(1)+' m/s');hrowW(990,436,'沿光束分量 vᵣ',vr.toFixed(2)+' m/s');hrowW(990,472,'頻率偏移 Δf',df.toFixed(2)+' MHz','#7dffc4');
   const c=chartBox(990,500,520,270,{x0:-2,x1:10,y0:0,y1:1.1,xt:[0,2,4,6,8,10],xl:'頻率偏移（MHz）',pl:30,pt:26,pb:52,gy:2,gx:6});
   const pk=(m,col,a)=>{ctx.beginPath();for(let f=-2;f<=10;f+=.05){const y=Math.exp(-Math.pow((f-m)/.35,2));f===-2?ctx.moveTo(c.X(f),c.Y(y)):ctx.lineTo(c.X(f),c.Y(y));}ctx.strokeStyle=col;ctx.lineWidth=3;ctx.globalAlpha*=a;ctx.stroke();ctx.globalAlpha/=a;};
   pk(0,'#ff8a78',1);pk(df*seg(u,.5,.62),'#7dffc4',1);
  });
  alphaDo(band(u,.76,1),()=>{tag(690,150,'只量得到沿光束的分量',{bg:'#e8572a',fg:'#fff',size:20});});
 }},
/* 3 */{t:'錐形掃描還原風向量',en:'Conical scanning',dur:14,
 d:'為了得到完整的風速與風向，光達把光束以固定傾角依序射向四個方位（加上一道垂直光束），在每個高度上掃出一個圓錐截面。不同方位量到的沿光束風速，會隨方位角呈現一條正弦曲線：曲線的振幅代表水平風速，峰值所在的方位就是風的來向。',
 s:[[0,'光束以約 28° 傾角輪流射向北、東、南、西四個方位'],[.3,'每個方位得到一個沿光束風速，順風方向為正、逆風為負'],[.55,'把四個點畫在方位角圖上，擬合成一條正弦曲線'],[.78,'振幅換算為水平風速，相位換算為風向；垂直光束則量上下氣流']],
 draw(u){
  diagBG();
  const ox=420,oy=800,cy=290,rx=210,ry=52,ang=28*Math.PI/180,phi=23*Math.PI/180,V=10.2;
  // cone outline
  ctx.strokeStyle='rgba(140,255,210,.35)';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(ox,oy-40);ctx.lineTo(ox-rx,cy);ctx.moveTo(ox,oy-40);ctx.lineTo(ox+rx,cy);ctx.stroke();
  ctx.beginPath();ctx.ellipse(ox,cy,rx,ry,0,0,TAU);ctx.fillStyle='rgba(120,255,200,.07)';ctx.fill();ctx.stroke();
  // compass labels on ellipse
  const az=[['北',0],['東',90],['南',180],['西',270]];
  const pt=th=>({x:ox+rx*Math.sin(th),y:cy-ry*Math.cos(th)});
  az.forEach(([n,d])=>{const p=pt(d*Math.PI/180);wt(p.x+(Math.sin(d*Math.PI/180)*26),p.y-Math.cos(d*Math.PI/180)*22+6,n,20,'rgba(227,236,238,.7)',700,'center');});
  // wind arrow across ellipse (blowing from NNE toward SSW): screen direction
  const wd={x:-Math.sin(phi),y:Math.cos(phi)};alphaDo(seg(u,.05,.12),()=>{arrow(ox-wd.x*150,cy-wd.y*36-0,ox+wd.x*150,cy+wd.y*36,'#f2c230',4);wt(ox+170,cy-90,'風從北北東吹來',20,'#f2c230',700);});
  const step=Math.min(3,Math.floor(seg(u,.06,.56)*4));const cyc=(TT*1.1)%4|0;const active=u<.56?step:cyc;
  const vr=d=>V*Math.sin(ang)*Math.cos(d*Math.PI/180-phi);
  for(let i=0;i<4;i++){const p=pt(az[i][1]*Math.PI/180);const on=i===active;
    if(i<=step||u>=.56){ln([ox,oy-40,p.x,p.y],on?'rgba(160,255,215,.95)':'rgba(160,255,215,.25)',on?3:1.4);circ(p.x,p.y,on?7:4,on?'#b7ffe2':'rgba(183,255,226,.5)');}}
  ln([ox,oy-40,ox,cy-120],'rgba(160,255,215,'+(u>.78?.8:.15)+')',2);
  box(ox-40,oy-40,80,50,'#f2c230');box(ox-26,oy-54,52,16,'#394650');
  wt(ox,oy+50,'浮動式光達',20,'#fff',700,'center');
  // chart
  const c=chartBox(820,200,720,440,{x0:0,x1:360,y0:-6,y1:6,xt:[0,90,180,270,360],yt:[-5,0,5],xl:'光束方位角（度）',yl:'沿光束風速 vᵣ（m/s）',title:'方位角－風速曲線',pt:70,pl:70});
  ln([c.px,c.Y(0),c.px+c.pw,c.Y(0)],'rgba(255,255,255,.35)',1);
  if(u>.55){const k=seg(u,.55,.72);ctx.beginPath();for(let d=0;d<=360*k;d+=4){const x=c.X(d),y=c.Y(vr(d));d?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=3;ctx.stroke();}
  for(let i=0;i<4;i++){if(i>step&&u<.56)continue;const d=az[i][1],x=c.X(d),y=c.Y(vr(d));circ(x,y,8,'#f2c230','#13232e',2);wt(x,y+(vr(d)>0?-18:34),tr(az[i][0])+' '+vr(d).toFixed(1),18,'#fff',700,'center',FONT);}
  if(u>.72){const a=seg(u,.72,.78);alphaDo(a,()=>{const pk=c.X(23),py=c.Y(vr(23));ln([pk,py,pk,c.Y(0)],'#f2c230',1.6);
    card(820,670,720,120,{bg:'rgba(242,194,48,.12)',st:'rgba(242,194,48,.5)'});
    wt(850,718,'振幅 ÷ sin 28° ＝ 水平風速',22,'#fff',700);wt(1510,718,V.toFixed(1)+' m/s',30,'#f2c230',700,'right',COND);
    wt(850,764,'曲線峰值的方位 ＝ 風向',22,'#fff',700);wt(1510,764,'23°（北北東）',26,'#f2c230',700,'right');});}
 }},
/* 4 */{t:'多高度剖面與風切',en:'Profiles and wind shear',dur:13,side:true,
 d:'光達以「距離閘門」同時量測十多個高度的風，從海面附近到 250 公尺以上，完整涵蓋風機葉片的掃掠範圍。越往高處風越強，這種隨高度變化的現象稱為風切，常以冪次律描述。浮標會隨浪晃動，因此系統內建陀螺儀與 GPS，即時修正姿態造成的誤差。',
 s:[[0,'光達同時在多個高度設定量測閘門'],[.25,'越高風越強：風速隨高度的變化稱為風切'],[.5,'15 MW 風機的葉片掃掠範圍約 32–268 公尺，全部都要量到'],[.74,'陀螺儀與 GPS 修正浮標晃動，確保每個高度的量測都正確']],
 cam:()=>({x:620,y:300,s:1.12}),
 draw(u){const wl=wlAt(FX,.9);mooring(FX,wl,1);buoy(FX,wl,TT,1);},
 fx(u){
  const o=flsTop(),top=hY(270);windStreaks(.8,hY(260),SEA-10);
  beamCone(o.x,o.y,top,.24,seg(u,0,.08));
  alphaDo(seg(u,.5,.56),()=>{box(VX0,hY(268),VX1-VX0,hY(32)-hY(268),'rgba(242,194,48,.08)');ln([VX0,hY(268),VX1,hY(268)],'rgba(242,194,48,.5)',1);ln([VX0,hY(32),VX1,hY(32)],'rgba(242,194,48,.5)',1);
    ctx.setLineDash([8,6]);ln([VX0,hY(150),VX1,hY(150)],'rgba(242,194,48,.8)',1.4);ctx.setLineDash([]);
    lab(1040,hY(150),'輪轂高度 150 m',{dx:0,dy:0,st:'s'});lab(1040,hY(268),'葉尖最高 268 m',{dx:0,dy:0,minor:true});lab(1040,hY(32),'葉尖最低 32 m',{dx:0,dy:0,minor:true});});
  const HS=[40,60,80,100,120,150,180,200,250],pts=[];
  HS.forEach((h,i)=>{const a=seg(u,.02+i*.02,.06+i*.02),y=hY(h),hw=(o.y-y)*Math.tan(.24),v=windV1(h),L=v*14;
    alphaDo(a,()=>{ctx.setLineDash([4,5]);ln([o.x-hw-10,y,o.x+hw,y],'rgba(255,255,255,.4)',1);ctx.setLineDash([]);circ(o.x,y,2.4,'#b7ffe2');tick(o.x-hw-18,y,h+' m','right');
      if(u>.22){const k=seg(u,.22+i*.01,.3+i*.01);arrowR(o.x+hw+14,y,L*k,'#f2c230');pts.push({x:o.x+hw+14+L*k+8,y});}});});
  if(pts.length>2&&u>.3)pathLine(pts,'rgba(125,255,196,.85)',2,[6,4]);
  if(u>.3)lab(o.x+190,hY(210),'風速剖面',{dx:60,dy:-30,a:band(u,.32,.5),st:'g'});
  lab(o.x,o.y+10,'陀螺儀＋GPS 運動補償',{dx:-110,dy:60,a:band(u,.74,1),st:'s'});
 },
 hud(u){hudPanel(236,196,'各高度 10 分鐘平均',seg(u,.24,.3),w=>{let y=50;for(const h of [250,200,150,100,60,40]){const v=windV1(h);htext(14,y+4,h+' m',14,'rgba(227,236,238,.8)',600,COND);hbar(62,y-3,100,v/13,h===150?'#7dffc4':'#f2c230');htext(w-14,y+5,v.toFixed(1)+' m/s',16,'#fff',700,COND,'right');y+=23;}htext(14,y+10,'風切指數 α ≈ 0.11',12,'rgba(227,236,238,.8)');});}},
/* 5 */{t:'與測風塔比對驗證',en:'Validation against a met mast',dur:12,side:true,
 d:'浮動式光達是間接量測，必須先證明它準。常見做法是把光達布放在既有的海上測風塔旁，比對數個月的 10 分鐘平均風速與風向。測風塔在各高度裝有杯式風速計與風向計，是公認的量測基準；兩者的迴歸斜率與相關係數達到國際驗證準則後，光達的數據才被融資銀行與認證機構接受。',
 s:[[0,'把光達布放在海上測風塔附近'],[.22,'測風塔在各高度裝有杯式風速計與風向計，作為基準'],[.45,'逐一比對兩者的 10 分鐘平均值'],[.72,'迴歸斜率接近 1、相關係數夠高，光達即通過驗證']],
 cam:()=>({x:700,y:390,s:1.02}),
 draw(u){
  const MX=940,top=hY(160),bot=SEA+8,bx=bedY(MX);
  drawJacket(MX,bx,bx-SEA+20,false);
  ctx.strokeStyle='#c9d1d5';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(MX-12,bot-18);ctx.lineTo(MX-4,top);ctx.moveTo(MX+12,bot-18);ctx.lineTo(MX+4,top);
  for(let y=bot-18;y>top;y-=16){const w0=lerp(4,12,(y-top)/(bot-18-top)),w1=lerp(4,12,(y-16-top)/(bot-18-top));ctx.moveTo(MX-w0,y);ctx.lineTo(MX+w1,y-16);ctx.moveTo(MX+w0,y);ctx.lineTo(MX-w1,y-16);}ctx.stroke();
  box(MX-40,bot-24,80,6,'#6f7a80');
  for(const h of [40,80,120,160]){const y=hY(h);ln([MX,y,MX-40,y],'#8a99a3',1.6);const a=TT*windV1(h)*1.1;for(let k=0;k<3;k++){const q=a+k*TAU/3;circ(MX-40+Math.cos(q)*7,y-6+Math.sin(q)*2,2.4,'#e3e9ec');}ln([MX-40,y,MX-40,y-6],'#8a99a3',1);
    ln([MX,y,MX+34,y],'#8a99a3',1.6);poly([MX+34,y-8,MX+46,y-4,MX+34,y],'#e3e9ec');}
  circ(MX,top-3,3,'#e8572a');
  const wl=wlAt(FX,.9);mooring(FX,wl,1);buoy(FX,wl,TT,1);
  lab(MX-40,hY(120)-6,'杯式風速計',{dx:-80,dy:-40,a:band(u,.22,.6)});
  lab(MX+40,hY(80)-4,'風向計',{dx:80,dy:-30,a:band(u,.22,.6)});
  lab(MX,top,'海上測風塔（基準）',{dx:60,dy:-30,a:seg(u,.05,.1)});
  lab(FX,wl-50,'待驗證的浮動式光達',{dx:-40,dy:-60,a:seg(u,.05,.1)});
 },
 fx(u){windStreaks(.6,hY(170),SEA-12);const o=flsTop();beamCone(o.x,o.y,hY(170),.2,.8);
  alphaDo(band(u,.45,1),()=>{for(const h of [40,80,120,160]){ctx.setLineDash([3,6]);ln([o.x+30,hY(h),940-40,hY(h)],'rgba(242,194,48,.6)',1.2);ctx.setLineDash([]);}});},
 hud(u){hudPanel(250,250,'10 分鐘平均風速比對',seg(u,.42,.48),w=>{
  const x0=44,y0=214,S=170;ln([x0,y0-S,x0,y0,x0+S,y0],'rgba(255,255,255,.5)',1);ln([x0,y0,x0+S,y0-S],'rgba(255,255,255,.25)',1);
  const r=rng(4),n=Math.floor(90*seg(u,.45,.9));for(let i=0;i<n;i++){const v=2+r()*16,e=(r()-.5)*1.1;circ(x0+v/19*S,y0-(v*1.005+e)/19*S,2,'rgba(125,255,196,.8)');}
  htext(x0+S/2,y0+22,'測風塔（m/s）',11,'rgba(227,236,238,.7)',500,FONT,'center');
  ctx.save();ctx.translate(18,y0-S/2);ctx.rotate(-Math.PI/2);htext(0,0,'光達（m/s）',11,'rgba(227,236,238,.7)',500,FONT,'center');ctx.restore();
  if(u>.72){htext(w-14,60,'斜率 1.005',15,'#7dffc4',700,COND,'right');htext(w-14,80,'R² ＝ 0.99',15,'#7dffc4',700,COND,'right');}
 });}},
/* 6 */{t:'一整年的風',en:'Twelve months of data',dur:14,
 d:'連續量測一年後，資料被整理成三種關鍵圖表。風花圖顯示風從哪裡來：台灣海峽冬季東北季風強勁，風向集中在北北東。月平均風速呈現明顯季節性，秋冬強、夏季弱。風速出現頻率則以韋伯分布描述，它的形狀參數與尺度參數，是後續計算發電量的輸入。',
 s:[[0,'每 10 分鐘一筆，一年累積超過五萬筆資料'],[.25,'風花圖：風向集中在北北東，反映東北季風'],[.5,'月平均風速：10 月到隔年 2 月最強，夏季偏弱'],[.74,'風速頻率擬合成韋伯分布（A＝10 m/s、k＝2.1）']],
 draw(u){
  diagBG();const prog=seg(u,.04,.8);
  const day=Math.max(1,Math.round(365*prog));wt(1540,120,trf('第 {d} 天　資料 {n} 筆',{d:day,n:Math.round(day*144).toLocaleString()}),22,'rgba(227,236,238,.85)',600,'right');
  // rose
  card(60,160,480,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'風花圖（輪轂高度）',20,'#f2c230',700);
  const rc={x:300,y:500};for(const r of [60,120,180])ring(rc.x,rc.y,r,'rgba(255,255,255,.12)',1);
  [['北',0],['東',90],['南',180],['西',270]].forEach(([n,d])=>{const a=d*Math.PI/180;wt(rc.x+Math.sin(a)*208,rc.y-Math.cos(a)*208+7,n,20,'rgba(227,236,238,.75)',700,'center');});
  const rk=seg(u,.05,.55);ROSE.forEach((f,i)=>{const a0=(i*22.5-10)*Math.PI/180,a1=(i*22.5+10)*Math.PI/180,R=f/.21*180*rk;
    ctx.beginPath();ctx.moveTo(rc.x,rc.y);ctx.arc(rc.x,rc.y,Math.max(1,R),a0-Math.PI/2,a1-Math.PI/2);ctx.closePath();ctx.fillStyle=i===1||i===2?'#f2c230':'rgba(125,200,220,.75)';ctx.fill();});
  wt(300,760,'扇形長度＝該方向出現的比例',16,'rgba(227,236,238,.65)',500,'center');
  // monthly
  const m=chartBox(580,160,460,640,{title:'月平均風速',x0:0,x1:12,y0:0,y1:14,yt:[0,4,8,12],yl:'m/s',pt:80,pl:56,gx:12,gy:7});
  const nm=Math.floor(12*seg(u,.2,.75)+.001);for(let i=0;i<12;i++){const k=clamp(12*seg(u,.2,.75)-i);if(k<=0)continue;const x=m.X(i+.15),w=m.pw/12*.7,v=MON[i]*easeOut(k);
    box(x,m.Y(v),w,m.Y(0)-m.Y(v),v>9?'#f2c230':'rgba(125,200,220,.85)');wt(x+w/2,m.Y(0)+22,String(i+1),15,'rgba(227,236,238,.75)',600,'center',COND);}
  wt(m.px+m.pw,m.py+m.ph+44,'月份',16,'rgba(227,236,238,.7)',500,'right');
  // weibull
  const wb=chartBox(1080,160,460,640,{title:'風速出現頻率',x0:0,x1:26,y0:0,y1:.1,xt:[0,5,10,15,20,25],xl:'風速（m/s）',pt:80,pl:30,gx:5});
  const wk=seg(u,.3,.8);BINS.slice(0,26).forEach(b=>{const h=b.p*clamp(wk*1.4-b.v/40);box(wb.X(b.v)+1,wb.Y(h),wb.pw/26-2,wb.Y(0)-wb.Y(h),'rgba(125,200,220,.8)');});
  if(u>.72){alphaDo(seg(u,.72,.78),()=>{ctx.beginPath();for(let v=0;v<=26;v+=.2){const y=wb.Y(wbPdf(v));v?ctx.lineTo(wb.X(v+.5),y):ctx.moveTo(wb.X(v+.5),y);}ctx.strokeStyle='#f2c230';ctx.lineWidth=3;ctx.stroke();
    wt(wb.px+wb.pw-4,wb.py+30,'韋伯分布',20,'#f2c230',700,'right');wt(wb.px+wb.pw-4,wb.py+58,'A＝10 m/s　k＝2.1',18,'#fff',600,'right');wt(wb.px+wb.pw-4,wb.py+86,'年平均 8.9 m/s',18,'#fff',600,'right');});}
 }},
/* 7 */{t:'從風速到年發電量',en:'From wind to energy yield',dur:15,
 d:'把風速頻率套進風機的功率曲線，就能算出每個風速區間一年可以發多少電，加總即為總發電量。接著扣除風機彼此遮擋的尾流損失、停機維修造成的可用率損失、電纜與變壓器的電氣損失等，得到淨發電量 P50（有一半機率會超過的值）。銀行融資時更看重保守的 P90：有九成把握能達到的發電量。',
 s:[[0,'功率曲線：3 m/s 開始發電，約 11 m/s 達額定 15 MW，25 m/s 停機保護'],[.25,'每個風速的功率 × 該風速一年出現的時數 ＝ 該區間的發電量'],[.48,'加總得到總發電量，再依序扣除各項損失'],[.76,'得到淨發電量 P50 與融資採用的保守值 P90']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,760,650,{title:'功率曲線 × 風速頻率',x0:0,x1:28,y0:0,y1:16,xt:[0,5,10,15,20,25],yt:[0,5,10,15],xl:'風速（m/s）',yl:'功率（MW）',pt:86,pl:64,gx:7});
  const pk=seg(u,.02,.2);ctx.beginPath();for(let v=0;v<=28*pk;v+=.1){const y=c.Y(PC(v));v?ctx.lineTo(c.X(v),y):ctx.moveTo(c.X(v),y);}ctx.strokeStyle='#fff';ctx.lineWidth=3.2;ctx.stroke();
  alphaDo(band(u,.12,.3),()=>{lab(c.X(3),c.Y(0),'切入 3 m/s',{dx:0,dy:-50,st:'l'});lab(c.X(11),c.Y(15),'額定 11 m/s',{dx:-20,dy:-40,st:'l'});lab(c.X(25),c.Y(15),'切出 25 m/s',{dx:0,dy:-40,st:'w'});});
  const ek=seg(u,.25,.48);const emax=Math.max(...BINS.map(b=>b.e));
  BINS.slice(0,26).forEach(b=>{const k=clamp(ek*30-b.v);if(k<=0)return;const h=b.e/emax*12*easeOut(k);box(c.X(b.v)+2,c.Y(h),c.pw/28-4,c.Y(0)-c.Y(h),'rgba(242,194,48,.55)');});
  alphaDo(seg(u,.3,.36),()=>wt(c.px+c.pw-6,c.py+260,'黃色柱：各風速區間的年發電量',18,'#f2c230',600,'right'));
  // waterfall
  alphaDo(seg(u,.46,.5),()=>{
   const x0=880,y0=180,w=660,h=620;card(x0,y0,w,h,{bg:'rgba(7,27,39,.75)'});wt(x0+24,y0+40,'單機年發電量（GWh）',20,'#f2c230',700);
   const bx=x0+230,bw=w-270,sc=bw/AEPG;let cur=AEPG,y=y0+84;const rows=[['總發電量',AEPG,0]];LOSS.forEach(l=>{rows.push([l[0],cur*l[1],1]);cur*=1-l[1];});rows.push(['淨發電量 P50',AEPN,2]);rows.push(['保守值 P90',AEPN*.9,3]);
   let run=AEPG;rows.forEach((r,i)=>{const k=seg(u,.48+i*.045,.52+i*.045);if(k<=0){y+=66;return;}
     alphaDo(k,()=>{wt(x0+24,y+26,r[0],19,'#fff',600);let xs,wd,col;
      if(r[2]===0){xs=bx;wd=r[1]*sc;col='rgba(125,200,220,.85)';}else if(r[2]===1){run-=r[1];xs=bx+run*sc;wd=r[1]*sc;col='#e8572a';}else if(r[2]===2){xs=bx;wd=r[1]*sc;col='#7dffc4';}else{xs=bx;wd=r[1]*sc;col='#f2c230';}
      box(xs,y+6,Math.max(3,wd*easeOut(k)),30,col);
      wt(x0+w-24,y+60,(r[2]===1?'−':'')+r[1].toFixed(1)+(r[2]===1?' ('+(LOSS[i-1][1]*100).toFixed(1)+'%)':''),17,'rgba(227,236,238,.85)',600,'right',FONT);});y+=66;});
   alphaDo(seg(u,.82,.88),()=>{wt(x0+24,y0+h-26,trf('淨容量因數 約 {c}%，60 部即約 {t} TWh／年',{c:(AEPN/131.4*100).toFixed(0),t:(AEPN*60/1000).toFixed(1)}),19,'#fff',700);});
  });
 }}
]};
function hrowW(x,y,l,v,col){wt(x,y,l,19,'rgba(227,236,238,.8)',500);wt(x+520,y,v,26,col||'#fff',700,'right',COND);}
