// KITS: marine
/* ================= EP03 地質鑽探 ================= */
const PXM=36/7; // px per metre in soil
function qcAt(d){const n=nz(d*.9);if(d<36)return 8+7*(d/36)+n*1.6;if(d<92)return 2.5+n*.5;if(d<152)return 25+15*((d-92)/60)+n*3;return 42+(d-152)*1.6+n*2;}
function fsAt(d){const n=nz(d*.7+3);if(d<36)return .06+.03*(d/36)+n*.01;if(d<92)return .09+n*.01;if(d<152)return .2+.1*((d-92)/60)+n*.02;return .35+n*.03;}
function seabedFrame(x,y){box(x-36,y-16,72,16,'#e8572a');ln([x-34,y,x-40,y+6],'#394650',2);ln([x+34,y,x+40,y+6],'#394650',2);box(x-10,y-26,20,10,'#394650');}
function drillShip(x){return vsl(x,210,false,{damp:.35},vDrill);}
const DSX=TX-105;

const EP={no:3,slug:'offshore-wind',seriesName:'離岸風場開發系列',total:13,t:'地質鑽探',en:'Geotechnical investigation',
lede:'地球物理調查畫出了「面」，地質鑽探要確認的是每一個機位底下的「點」。這一集深入鑽探船、圓錐貫入試驗與岩心取樣，看土壤強度如何一路決定樁要多粗、要打多深。',
facts:[['2','cm/s','圓錐貫入試驗的標準貫入速率，連續記錄每一公分的土壤反應'],['10','cm²','標準錐頭的底面積，錐尖角度 60°'],['3','項讀數','錐尖阻力 qc、套筒摩擦 fs 與孔隙水壓 u₂，同時量測'],['40–80','m','常見的鑽探深度，需深於預定樁底'],['每一','機位','大型風場通常每個機位至少一孔 CPT 或鑽孔'],['±1–3','m','動態定位系統在作業時維持船位的典型精度']],
note:'說明：本集為教育用途示意動畫，地層厚度、讀數與樁尺寸為典型範例值，並非特定場址的設計資料。實際調查數量與深度依場址條件、認證機構與設計需求決定。',
shots:[
/* 1 */{t:'動態定位 DP',en:'Dynamic positioning',dur:11,
 d:'鑽探作業時船不能下錨，因為錨可能破壞海床，也無法快速轉移機位。鑽探船改用動態定位系統（DP）：衛星定位與感測器即時量測船位，電腦計算風、浪、海流造成的漂移，自動調整多具推進器的推力與方向，讓船在同一個點「原地懸停」數小時到數天。',
 s:[[0,'風、浪與海流不斷把船推離機位'],[.25,'衛星定位與電羅經即時回報船位與艏向'],[.5,'電腦自動分配多具推進器的推力，抵銷外力'],[.75,'船位保持在數公尺的監控圈內，才能開始鑽探']],
 draw(u){
  diagBG();const cx=760,cy=470;
  ctx.setLineDash([10,8]);ring(cx,cy,150,'rgba(242,194,48,.7)',2);ctx.setLineDash([]);ring(cx,cy,5,'#f2c230',2);
  wt(cx,cy+185,'監控圈（半徑約 3 m，圖中放大）',18,'#f2c230',600,'center');
  const k=seg(u,.45,.65),ox=(1-k)*(60*Math.sin(TT*.6))+k*8*Math.sin(TT*.8),oy=(1-k)*(40*Math.cos(TT*.5)+20)+k*6*Math.cos(TT*.9),hd=(1-k)*.12*Math.sin(TT*.4)+k*.02*Math.sin(TT);
  ctx.save();ctx.translate(cx+ox,cy+oy);ctx.rotate(-Math.PI/2+hd);
  ctx.beginPath();ctx.moveTo(-190,-38);ctx.lineTo(120,-38);ctx.quadraticCurveTo(200,-30,215,0);ctx.quadraticCurveTo(200,30,120,38);ctx.lineTo(-190,38);ctx.closePath();ctx.fillStyle='#e9eef0';ctx.fill();ctx.strokeStyle='#8a99a3';ctx.lineWidth=2;ctx.stroke();
  box(-150,-26,70,52,'#9d7b56');box(-20,-22,44,44,'#e8572a');box(40,-30,100,60,'#f4f6f7');ctx.strokeStyle='rgba(0,0,0,.2)';ctx.strokeRect(40,-30,100,60);circ(0,0,10,'#1c252c');
  const TH=[[-175,-24],[-175,24],[150,0],[90,-26],[90,26]];
  TH.forEach(([x,y],i)=>{circ(x,y,9,'#394650');if(u>.5){const a=Math.sin(TT*1.3+i)*.8+i,p=16+10*Math.sin(TT*2+i);ctx.save();ctx.translate(x,y);ctx.rotate(a);for(let j=1;j<4;j++)circ(-j*12,0,6-j*1.2,`rgba(200,235,250,${.5-j*.1})`);ctx.restore();}});
  ctx.restore();
  // forces
  alphaDo(seg(u,.02,.08),()=>{arrow(1450,330,1270,420,'#e3ecee',5);wt(1460,320,'風',22,'#e3ecee',700);arrow(360,700,520,610,'#58b8d0',5);wt(300,730,'海流',22,'#58b8d0',700);
   for(let i=0;i<3;i++){ctx.beginPath();for(let x=0;x<160;x+=4){const y=Math.sin(x*.08-TT*3)*6;x?ctx.lineTo(1150+x,700+i*26+y):ctx.moveTo(1150+x,700+i*26+y);}ctx.strokeStyle='rgba(125,200,220,.7)';ctx.lineWidth=2;ctx.stroke();}wt(1230,800,'波浪',22,'#7dc8dc',700,'center');});
  alphaDo(seg(u,.25,.3),()=>{for(const [x,y] of [[880,110],[1060,140]]){box(x-8,y-6,16,12,'#d5dde1');box(x-30,y-4,20,8,'#2f5f99');box(x+10,y-4,20,8,'#2f5f99');ctx.setLineDash([3,6]);ln([x,y+8,cx+ox,cy+oy],'rgba(255,255,255,.4)',1.2);ctx.setLineDash([]);}wt(970,80,'衛星定位（GNSS）',18,'#fff',600,'center');});
 },
 hud(u){hudPanel(230,150,'DP 控制台',seg(u,.28,.34),w=>{const k=seg(u,.45,.65),e=lerp(9.5,1.1,k)+.3*Math.sin(TT*2);hrow(54,'偏離機位',e.toFixed(1)+' m',w,e<3?'#7dffc4':'#e8572a');hrow(80,'艏向偏差',lerp(6,.4,k).toFixed(1)+'°',w);hrow(106,'推進器',u>.5?'自動 5 具':'待命',w);hrow(132,'狀態',k>=1?'可以作業':'修正中',w,k>=1?'#7dffc4':'#f2c230');});}},
/* 2 */{t:'下放海床框架',en:'Seabed frame',dur:11,side:true,
 d:'鑽探船中央有一個直通海面的開口，稱為「月池」。海床框架從月池下放到海床上，它是一個沉重的鋼架，壓住海床表層、提供推進 CPT 探桿所需的反力，並固定鑽桿的位置。為了抵消船隨波浪上下起伏的影響，鑽塔上的升沉補償器會讓鑽桿保持穩定。',
 s:[[0,'鑽探船定位在機位正上方'],[.22,'海床框架經船中央的月池下放'],[.55,'框架坐落海床，提供推進探桿的反力'],[.78,'升沉補償器抵消船體起伏，鑽桿保持穩定']],
 cam:()=>({x:TX+20,y:560,s:1.3}),
 draw(u){
  const x=lerp(-400,DSX,easeOut(seg(u,0,.2))),wl=drillShip(x);
  const fy=u<.22?wl-4:lerp(wl+10,bedTX,ease(seg(u,.22,.55)));
  if(u>=.22){ln([TX,wl-16,TX,fy-26],'#394650',2.4);seabedFrame(TX,fy);}
  lab(TX,wl-20,'月池',{dx:-90,dy:-40,a:band(u,.2,.5)});
  lab(TX,fy-8,'海床框架',{dx:90,dy:-40,a:band(u,.4,1)});
  lab(TX,wl-100,'升沉補償器',{dx:100,dy:-30,st:'s',a:band(u,.76,1)});
 },
 fx(u){if(u>.76){const w=wlAt(TX,.35);for(let i=0;i<2;i++){const y=w-80+Math.sin(TT*1.4)*6*(i?-1:1);}const y=wlAt(DSX+105,.35)-40;ln([TX-8,y-40,TX-8,y],'#f2c230',3);ln([TX+8,y-40,TX+8,y],'#f2c230',3);}}},
/* 3 */{t:'圓錐貫入試驗 CPT',en:'Cone penetration test',dur:15,side:true,
 d:'CPT 是離岸地質調查的主力。液壓系統把前端裝有錐頭的探桿，以每秒 2 公分的等速壓入海床，錐頭上的感測器每一公分就記錄一次讀數。砂層顆粒緊密、錐尖阻力高；黏土層軟弱、阻力低但摩擦比高。一條連續的阻力曲線，就能分辨出地層分界與每一層的強度。',
 s:[[0,'探桿以每秒 2 公分等速壓入海床'],[.12,'細砂層：錐尖阻力中等，隨深度逐漸增加'],[.34,'粉土質黏土：阻力驟降，摩擦比升高'],[.6,'緊密砂層：阻力大幅上升'],[.84,'接近岩盤／極緊密層，達到推進極限後停止']],
 cam:u=>({x:TX+110,y:bedTX+95,s:2.2}),
 draw(u){
  const d=158*seg(u,.04,.9);seabedFrame(TX,bedTX);
  ln([TX,SEA-40,TX,bedTX-26],'#394650',2.4);
  ctx.save();soilRegion();ctx.restore();
  box(TX-2.2,bedTX-16,4.4,d+14,'#8a99a3');poly([TX-2.6,bedTX+d-2,TX+2.6,bedTX+d-2,TX,bedTX+d+4],'#c9d1d5');
  box(TX-2.8,bedTX+d-10,5.6,5,'#5d6b74');
  const ph=(TT*2)%1;ring(TX,bedTX+d+2,3+ph*8,`rgba(242,194,48,${1-ph})`,1);
  LAY.forEach((L,i)=>{const y=layB(TX-60,i)+(i<3?(LAY[i].b-LAY[i].a)/2:30);tick(TX-24,y,L.n+'　'+L.m,'right');});
  lab(TX,bedTX+d+2,trf('錐頭深度 {d} m',{d:(d/PXM).toFixed(1)}),{dx:50,dy:0,st:'s'});
 },
 hud(u){hudPanel(290,330,'CPT 即時讀數',seg(u,.05,.1),(w)=>{
  const d=158*seg(u,.04,.9),x0=40,y0=58,cw=140,ch=240,X=q=>x0+q/70*cw,Y=dd=>y0+dd/160*ch,X2=f=>x0+cw+22+f/.5*70;
  ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=1;ctx.strokeRect(x0,y0,cw,ch);ctx.strokeRect(x0+cw+22,y0,70,ch);
  [0,36,92,152].forEach(b=>{ctx.fillStyle='rgba(255,255,255,.05)';ctx.fillRect(x0,Y(b),cw+92,1);});
  ctx.beginPath();for(let q=0;q<=d;q+=1){const x=X(Math.min(68,qcAt(q))),y=Y(q);q?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#f2c230';ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();for(let q=0;q<=d;q+=1){const x=X2(fsAt(q)),y=Y(q);q?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=2;ctx.stroke();
  htext(x0,y0-10,'錐尖阻力 qc（MPa）',11,'#f2c230',600);htext(x0+cw+22,y0-10,'摩擦 fs',11,'#7dffc4',600);
  for(const m of [0,10,20,30]){htext(x0-6,Y(m*PXM)+4,m+' m',11,'rgba(227,236,238,.7)',600,COND,'right');}
  htext(x0,y0+ch+22,`qc ${qcAt(d).toFixed(1)} MPa   fs ${(fsAt(d)*1000).toFixed(0)} kPa`,13,'#fff',700,FONT);
 });}},
/* 4 */{t:'錐頭裡的感測器',en:'Inside the cone',dur:13,
 d:'錐頭看似一支小小的金屬棒，內部卻塞滿精密感測器。錐尖承受的力換算成錐尖阻力 qc；後方的摩擦套筒量測土壤對側面的摩擦 fs；錐尖後方的透水石則量測孔隙水壓 u₂。摩擦比（fs ÷ qc）搭配阻力大小，就能在「土壤行為分類圖」上判斷每一公分屬於砂、粉土還是黏土。',
 s:[[0,'錐尖角度 60°、底面積 10 cm²，是國際標準尺寸'],[.25,'三組感測器同時量測 qc、fs 與孔隙水壓 u₂'],[.5,'計算摩擦比 Rf ＝ fs ÷ qc'],[.72,'把每一筆資料畫上分類圖，自動判別土壤種類']],
 draw(u){
  diagBG();const cx=330,top=130,bot=740,r=58;
  // rod
  const g=ctx.createLinearGradient(cx-r,0,cx+r,0);g.addColorStop(0,'#6b7780');g.addColorStop(.4,'#c9d1d5');g.addColorStop(1,'#5d6b74');
  ctx.fillStyle=g;ctx.fillRect(cx-r,top,r*2,bot-top);poly([cx-r,bot,cx+r,bot,cx,bot+100],g);
  const sl=[top+180,top+420];box(cx-r-2,sl[0],r*2+4,sl[1]-sl[0],'rgba(125,255,196,.35)');ctx.strokeStyle='#7dffc4';ctx.lineWidth=2;ctx.strokeRect(cx-r-2,sl[0],r*2+4,sl[1]-sl[0]);
  box(cx-r-2,bot-26,r*2+4,20,'rgba(125,200,255,.6)');
  const ck=seg(u,.2,.3);alphaDo(ck,()=>{box(cx-26,bot-100,52,40,'#f2c230');box(cx-26,sl[0]+60,52,40,'#7dffc4');box(cx-20,top+40,40,30,'#e8a33a');});
  ln([cx+r,bot+100,cx+r+160,bot+100],'rgba(255,255,255,.5)',1);
  alphaDo(seg(u,.02,.08),()=>{arrow(cx+r+30,bot+100,cx+r+30,bot+20,'#fff',2);wt(cx+r+44,bot+72,'60°',20,'#fff',700,'left',COND);wt(cx,bot+140,'直徑 35.7 mm（底面積 10 cm²）',18,'rgba(227,236,238,.8)',600,'center');});
  alphaDo(ck,()=>{
   const L=[[bot-80,'錐尖荷重元 → qc','#f2c230'],[sl[0]+80,'摩擦套筒（150 cm²）→ fs','#7dffc4'],[bot-16,'透水石 → 孔隙水壓 u₂','#8fd0ff'],[top+55,'傾斜儀：確認探桿垂直','#e8a33a']];
   L.forEach(([y,t,c])=>{ln([cx+r+4,y,cx+r+60,y],c,1.6);wt(cx+r+70,y+7,t,20,c,700);});});
  // SBT chart
  const c=chartBox(900,170,640,620,{title:'土壤行為分類圖',x0:0,x1:6,y0:0,y1:3,xt:[0,1,2,3,4,5,6],xl:'摩擦比 Rf（%）',yl:'錐尖阻力（對數）',pt:80,pl:60,gx:6,gy:3});
  alphaDo(seg(u,.5,.56),()=>{
   const zone=(pts,col,name,lx,ly)=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(c.X(p[0]),c.Y(p[1])):ctx.moveTo(c.X(p[0]),c.Y(p[1])));ctx.closePath();ctx.fillStyle=col;ctx.fill();wt(c.X(lx),c.Y(ly),name,19,'#fff',700,'center');};
   zone([[0,1.3],[2,3],[0,3]],'rgba(242,194,48,.28)','砂',.35,2.6);zone([[0,.6],[0,1.3],[2,3],[2.9,3]],'rgba(200,170,110,.25)','粉質砂',1.2,2.1);
   zone([[0,0],[1.3,0],[3.6,3],[2.9,3],[0,.6]],'rgba(164,135,106,.3)','粉土',1.5,.9);zone([[1.3,0],[6,0],[6,3],[3.6,3]],'rgba(109,104,98,.45)','黏土',4.6,1.2);
  });
  if(u>.7){const r2=rng(9),n=Math.floor(160*seg(u,.7,.95));for(let i=0;i<n;i++){const d=r2()*158,q=qcAt(d),f=fsAt(d),rf=clamp(f/q*100*(d>=36&&d<92?1.2:1),0,6);circ(c.X(rf),c.Y(clamp(Math.log10(q*10),0,3)),3.4,d<36?'#f2c230':d<92?'#c9a07a':d<152?'#ffd98a':'#bbb');}}
  alphaDo(band(u,.5,.72),()=>{card(900,110,640,48,{bg:'rgba(242,194,48,.14)',st:'rgba(242,194,48,.5)',r:10});wt(1220,143,'摩擦比 Rf ＝ fs ÷ qc × 100%',24,'#fff',700,'center');});
 }},
/* 5 */{t:'鑽孔取樣',en:'Borehole sampling',dur:12,side:true,
 d:'CPT 讀數要與真實的土壤對照。鑽探船在同一機位旁鑽孔，以旋轉鑽頭向下鑽進，每隔一段深度換上取樣管：軟弱土層用薄壁管壓入，保留原狀結構；堅硬地層則以岩心管鑽取岩心。樣本在甲板上立即描述、拍照、封存，再送往陸上實驗室。',
 s:[[0,'在 CPT 孔旁另鑽一孔，旋轉鑽頭向下鑽進'],[.3,'到達目標深度，換上取樣管壓入土層'],[.55,'取樣管收回甲板，推出土樣'],[.75,'依深度排入岩心箱，描述、拍照、封存送驗']],
 cam:u=>camMix({x:TX+30,y:600,s:1.25},{x:TX-10,y:420,s:1.9},ease(seg(u,.56,.66))),
 draw(u){
  const wl=drillShip(DSX),hx=TX+26;seabedFrame(TX,bedTX);
  const d=u<.3?140*seg(u,0,.3):u<.55?140+12*seg(u,.3,.4):152*(1-seg(u,.42,.55));
  ln([hx,wl-16,hx,bedTX+d],'#5d6b74',2.4);
  if(d>2){ctx.save();soilRegion();ctx.clip();box(hx-4,bedTX,8,Math.max(d,140*seg(u,0,.3)),'rgba(40,30,20,.35)');ctx.restore();}
  const rot=TT*12;box(hx-4,bedTX+d-4,8,6,u<.3?(Math.sin(rot)>0?'#c9d1d5':'#8a99a3'):'#e8a33a');
  if(u>.55){const k=seg(u,.6,.8),y=wl-18;for(let i=0;i<5;i++){const a=seg(u,.6+i*.04,.64+i*.04);box(TX-60+i*14,y-4,12,4,a>0?LAY[Math.min(3,Math.floor(i*.8))].c:'#6b7780');}}
  lab(hx,bedTX+d,u<.3?'旋轉鑽進':'取樣管',{dx:70,dy:20,st:'s',a:band(u,.05,.55)});
  lab(TX-30,wl-24,'甲板上推出土樣、裝箱',{dx:-60,dy:-50,a:seg(u,.6,.64)});
 },
 hud(u){hudPanel(260,220,'岩心箱（依深度排列）',seg(u,.72,.78),(w)=>{
  const segs=[[0,7,'#d9c393','細砂'],[7,18,'#a4876a','粉土質黏土'],[18,30,'#c4a678','緊密砂'],[30,34,'#6d6862','極緊密層']];
  for(let r=0;r<4;r++){const y=44+r*40;ctx.fillStyle='#5b4632';ctx.fillRect(14,y,w-28,30);const s=segs[r];ctx.fillStyle=s[2];ctx.fillRect(18,y+4,(w-36)*seg(u,.76+r*.04,.84+r*.04),22);
   htext(22,y+20,`${s[0]}–${s[1]} m  `+tr(s[3]),12,'#13232e',700);}
 });}},
/* 6 */{t:'從實驗室到樁的尺寸',en:'Lab testing to foundation design',dur:13,
 d:'實驗室以三軸試驗量測土壤受壓時的強度與勁度，並做粒徑分析、含水量與反覆載重試驗（模擬數十年風浪造成的疲勞）。這些參數與 CPT 資料結合成每一個機位的地盤模型，工程師再以「P-y 曲線」模擬樁在側向載重下的變形，最後決定單樁直徑、壁厚與入土深度。',
 s:[[0,'三軸試驗：施加圍壓與軸向荷重，量測強度與勁度'],[.25,'反覆載重試驗：模擬 25 年以上的風浪疲勞'],[.48,'建立地盤模型，以 P-y 曲線分析樁的側向變形'],[.72,'決定樁徑、壁厚與入土深度，每個機位各不相同']],
 draw(u){
  diagBG();
  // triaxial
  card(60,160,420,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'三軸試驗',20,'#f2c230',700);
  const cx=270,top=280,hh=280,k=seg(u,.05,.45),sq=k*18;
  box(cx-110,top-40,220,hh+100,'rgba(160,210,230,.12)');ctx.strokeStyle='rgba(160,210,230,.5)';ctx.strokeRect(cx-110,top-40,220,hh+100);
  const sw=60+sq*.8;poly([cx-60,top+sq,cx+60,top+sq,cx+sw,top+hh/2,cx+60,top+hh,cx-60,top+hh,cx-sw,top+hh/2],'#a4876a','#5b4632',1.4);
  box(cx-70,top-14+sq,140,14,'#8a99a3');box(cx-70,top+hh,140,14,'#8a99a3');
  arrow(cx,top-110+sq,cx,top-18+sq,'#f2c230',4);wt(cx+14,top-80,'軸向荷重',18,'#f2c230',700);
  for(const s of [-1,1])for(const y of [top+60,top+150,top+240])arrow(cx+s*170,y,cx+s*118,y,'#8fd0ff',3);
  wt(cx,top+hh+80,'圍壓：模擬土壤在海床下受到的壓力',16,'rgba(227,236,238,.75)',500,'center');
  // cyclic
  const c1=chartBox(520,160,480,300,{title:'反覆載重試驗',x0:0,x1:10,y0:-1.2,y1:1.2,pt:60,pl:30,gy:2,gx:5,xl:'循環次數'});
  const ck=seg(u,.25,.5);ctx.beginPath();for(let t=0;t<=10*ck;t+=.05){const y=c1.Y(Math.sin(t*TAU*1.2));t?ctx.lineTo(c1.X(t),y):ctx.moveTo(c1.X(t),y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=2.4;ctx.stroke();
  // p-y
  const c2=chartBox(520,490,480,310,{title:'P-y 曲線',x0:0,x1:10,y0:0,y1:10,pt:60,pl:30,gx:5,gy:4,xl:'樁側位移 y',yl:'土壤反力 P'});
  const pk=seg(u,.48,.66);[[.7,'#f2c230','緊密砂'],[.35,'#ffd98a','細砂'],[.14,'#c9a07a','黏土']].forEach(([s,col,n],i)=>{ctx.beginPath();for(let y=0;y<=10*pk;y+=.1){const P=9*(1-Math.exp(-s*y*(1+i*.3)))*(1-i*.25);y?ctx.lineTo(c2.X(y),c2.Y(P)):ctx.moveTo(c2.X(y),c2.Y(P));}ctx.strokeStyle=col;ctx.lineWidth=2.6;ctx.stroke();if(pk>.9)wt(c2.X(9.6),c2.Y(9*(1-Math.exp(-s*9.6*(1+i*.3)))*(1-i*.25))-8,n,17,col,700,'right');});
  // pile result
  card(1040,160,500,640,{bg:'rgba(7,27,39,.75)'});wt(1064,200,'設計成果（示例機位）',20,'#f2c230',700);
  const px=1180,gy=300,sc=6.6;
  LAY.forEach((L,i)=>{const a=i?[7,18,30][i-1]:0,b=[7,18,30,62][i];box(1064,gy+a*sc,160,(b-a)*sc,L.c);wt(1070,gy+a*sc+22,L.n,15,'#13232e',700);});
  ln([1064,gy,1230,gy],'#fff',2);wt(1066,gy-10,'海床',16,'#fff',600);
  const pa=seg(u,.72,.85),emb=36;
  alphaDo(pa,()=>{const pw=40;box(px+120-pw/2,gy-80,pw,(emb*sc+80)*easeOut(pa),'#8093a0');ctx.fillStyle='#f2c230';ctx.fillRect(px+120-pw/2,gy-80,pw,14);
   ln([px+170,gy,px+170,gy+emb*sc],'#f2c230',1.6);ln([px+162,gy,px+178,gy],'#f2c230',1.6);ln([px+162,gy+emb*sc,px+178,gy+emb*sc],'#f2c230',1.6);
   wt(px+184,gy+emb*sc/2,'入土',17,'#f2c230',700);wt(px+184,gy+emb*sc/2+26,'36 m',24,'#fff',700,'left',COND);
   wt(1064,740,'樁徑 10 m　壁厚 90–110 mm',20,'#fff',700);wt(1064,772,'樁長約 95 m，重約 1,800 公噸',18,'rgba(227,236,238,.8)',500);});
 }}
]};
