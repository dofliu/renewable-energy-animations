// KITS: land
/* 電網系列 第 2 集：虛擬電廠與需量反應 */
const gyy=x=>groundY(x);
const CLX=800,CLY=222;                                    // 聚合平台雲端
/* 各資源：中心 x、頂端高度 */
const RES={fac:[180,150],mall:[415,160],bat:[595,58],ev:[775,72],home:[1020,112],agg:[1262,150],tpc:[1462,176]};
const rTop=k=>{const r=RES[k];return [r[0],gyy(r[0])-r[1]];};
function factory(x,y,k){                                  // k：製程運轉比例 0–1
  box(x,y-110,240,110,'#c9d1d6','rgba(0,0,0,.25)',1);
  for(let i=0;i<4;i++)poly([x+i*60,y-110,x+i*60+60,y-110,x+i*60+60,y-150],'#aeb8be','rgba(0,0,0,.2)',1);
  for(let i=0;i<8;i++)box(x+14+i*28,y-90,18,22,i/8<k?'#ffd98a':'#5e6d76');
  box(x+100,y-42,40,42,'#5e6d76');
  for(let i=0;i<3;i++){const p=(TT*(.3+.6*k)+i/3)%1;alphaDo(k*.8,()=>circ(x+30+p*180,y-58,3,'#f2c230'));}
}
function mall(x,y,lit,ac){
  box(x,y-150,170,150,'#dfe5e8','rgba(0,0,0,.3)',1);box(x,y-150,170,22,'#1f7f99');
  for(let r=0;r<3;r++)for(let c=0;c<5;c++)box(x+12+c*32,y-116+r*34,22,22,r*5+c<lit*15?'#ffd98a':'#3d6f8e');
  box(x+60,y-30,50,30,'#5e6d76');
  for(let i=0;i<2;i++){box(x+20+i*80,y-166,46,16,'#aeb8be');const a=TT*6*ac;ln([x+43+i*80+9*Math.cos(a),y-158,x+43+i*80-9*Math.cos(a),y-158],'#5e6d76',2);}
  box(x+178,y-34,46,34,'#8d989f','rgba(0,0,0,.3)',1);box(x+184,y-26,14,8,'#e8572a');
}
function battery(x,y,glow){for(let j=0;j<2;j++){const bx=x+j*66;box(bx,y-50,60,50,'#e3e8ec','rgba(0,0,0,.3)',1);ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<6;i++){ctx.moveTo(bx+i*10,y-46);ctx.lineTo(bx+i*10,y-4);}ctx.stroke();box(bx+6,y-42,14,5,glow?'#7dffc4':'#2d8f5a');box(bx-2,y-53,64,4,'#aeb8be');}}
function car(x,y,col){poly([x,y-12,x+6,y-26,x+20,y-36,x+52,y-36,x+64,y-24,x+74,y-20,x+74,y-12],col,'rgba(0,0,0,.3)',1);box(x+24,y-33,24,10,'#bfe3f0');circ(x+16,y-10,8,'#2c3e4a');circ(x+58,y-10,8,'#2c3e4a');}
function evStation(x,y,on){
  box(x,y-76,170,6,'#8d989f');ln([x+6,y-70,x+6,y],'#8d989f',4);ln([x+164,y-70,x+164,y],'#8d989f',4);
  for(let j=0;j<2;j++){const px=x+20+j*80;box(px,y-50,14,50,'#dfe5e8','rgba(0,0,0,.3)',1);box(px+3,y-44,8,6,on?'#7dffc4':'#ff9d7a');car(px+18,y,j?'#7ea9cc':'#c9d1d6');
    ctx.strokeStyle='#2c3e4a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px+14,y-30);ctx.quadraticCurveTo(px+22,y-14,px+26,y-24);ctx.stroke();}
}
function house(x,y,lit){box(x,y-58,80,58,'#e8dccb','rgba(0,0,0,.25)',1);poly([x-8,y-58,x+40,y-98,x+88,y-58],'#9b6b55');
  ctx.save();ctx.beginPath();ctx.moveTo(x+44,y-94);ctx.lineTo(x+82,y-63);ctx.lineTo(x+70,y-63);ctx.lineTo(x+38,y-89);ctx.closePath();ctx.fillStyle='#2b4f6e';ctx.fill();ctx.restore();
  box(x+12,y-42,18,16,lit?'#ffd98a':'#3d6f8e');box(x+50,y-42,18,16,lit?'#ffd98a':'#3d6f8e');box(x+34,y-26,14,26,'#6b4e3d');}
function aggOffice(x,y){box(x,y-110,110,110,'#dfe5e8','rgba(0,0,0,.3)',1);for(let r=0;r<3;r++)wins(x+12,y-96+r*30,4,24,14,16,'#3d6f8e');box(x+40,y-26,30,26,'#5e6d76');ln([x+90,y-110,x+90,y-150],'#5c6770',3);circ(x+90,y-152,5,'#7dffc4');}
function dispatchCenter(x,y){box(x,y-110,140,110,'#dfe5e8','rgba(0,0,0,.3)',1);for(let r=0;r<3;r++)wins(x+12,y-96+r*30,5,24,14,16,'#3d6f8e');box(x+55,y-26,30,26,'#5e6d76');ln([x+120,y-110,x+120,y-176],'#5c6770',3);circ(x+120,y-180,6,'#e8572a');}
function cloudIcon(a){alphaDo(a,()=>{ctx.fillStyle='rgba(14,42,59,.88)';ctx.strokeStyle='#7dffc4';ctx.lineWidth=2;ctx.beginPath();
  [[-62,8,30],[-24,-10,40],[22,-6,36],[60,10,28]].forEach(([dx,dy,r])=>{ctx.moveTo(CLX+dx+r,CLY+dy);ctx.arc(CLX+dx,CLY+dy,r,0,TAU);});ctx.fill();
  ctx.beginPath();ctx.arc(CLX-62,CLY+8,30,Math.PI*.5,Math.PI*1.5);ctx.arc(CLX-24,CLY-10,40,Math.PI*1.1,Math.PI*1.75);ctx.arc(CLX+22,CLY-6,36,Math.PI*1.3,Math.PI*1.95);ctx.arc(CLX+60,CLY+10,28,Math.PI*1.5,Math.PI*.5);ctx.closePath();ctx.stroke();
  wt(CLX,CLY+14,'聚合平台',20,'#7dffc4',700,'center');});}
/* 雲端到資源的通訊線 */
function sigLine(k,a,col){if(a<=0)return;const [x,y]=rTop(k);ctx.save();ctx.setLineDash([8,7]);ctx.lineDashOffset=-TT*36;
  alphaDo(a,()=>{ctx.strokeStyle=col||'rgba(125,255,196,.85)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(CLX,CLY+36);ctx.quadraticCurveTo((CLX+x)/2,CLY+60,x,y-8);ctx.stroke();});ctx.restore();ctx.setLineDash([]);}
function scene(o){
  o=o||{};
  factory(60,gyy(180),o.fk===undefined?1:o.fk);
  mall(330,gyy(415),o.lit||0,o.ac===undefined?1:o.ac);
  battery(530,gyy(595),o.bg);
  evStation(690,gyy(775),o.ev===undefined?true:o.ev);
  [890,980,1070].forEach(x=>house(x,gyy(x+40),(o.lit||0)>.3));
  aggOffice(1207,gyy(1262));
  dispatchCenter(1392,gyy(1462));
}
/* 典型夏季平日負載（GW，示意，與第 1 集相同形狀） */
const LOADP=[[0,31],[3,28],[5,27.5],[7,30],[9,35],[11,38.5],[13,40],[14.5,40.5],[16,39.5],[18,38],[19.5,38.5],[21,37],[23,33],[24,31]];
const loadAt=h=>{const P=LOADP,n=P.length;for(let i=1;i<n;i++)if(h<=P[i][0]){const a=P[i-1],b=P[i],t=(h-a[0])/(b[0]-a[0]),y0=(P[i-2]||a)[1],y3=(P[i+1]||b)[1];
  return .5*((2*a[1])+(-y0+b[1])*t+(2*y0-5*a[1]+4*b[1]-y3)*t*t+(-y0+3*a[1]-3*b[1]+y3)*t*t*t);}return 31;};
const drAt=h=>1.2*clamp((h-17.5)*2)*clamp((21.5-h)*2);
const gs=(h,c,w)=>Math.exp(-((h-c)*(h-c))/(2*w*w));
const evRaw=h=>.08+.85*gs(h,20,1.6);
const evSmart=h=>.08+.32*gs(h,13,2)+.42*Math.max(gs(h,2,1.6),gs(h,26,1.6));
const batP=h=>(h>=10&&h<14)?-4:(h>=17&&h<21)?4:0;

const EP={no:2,slug:'power-grid',seriesName:'電網系列',t:'虛擬電廠與需量反應',en:'Virtual power plants and demand response',
lede:'平衡電網不一定要蓋新電廠。工廠、商場、儲能、充電站與家戶的用電與設備，經過聚合商整合後，可以像一座電廠一樣接受調度。這一集看虛擬電廠如何運作、需量反應怎麼進行，以及儲能與電動車如何參與台電的電力交易平台。',
facts:[['2021','年','台電電力交易平台於 11 月正式啟用，開放儲能、需量反應與自用發電設備參與輔助服務'],
['1','秒','調頻備轉（dReg）要求的反應時間，由頻率自動控制充放電'],
['10','分鐘','即時備轉的反應時間，並需維持至少 1 小時'],
['30','分鐘','補充備轉的反應時間，並需維持至少 2 小時'],
['1','MW','參與交易的最低容量；未達門檻的小型資源可聚合後參與'],
['117','萬瓩','台電公布 2023 年最高負載日，需量競價措施抑低的尖峰負載']],
note:'說明：本集為教育用途示意動畫，建築與設備比例經過調整。電力交易平台啟用時間、調頻備轉 1 秒、即時備轉 10 分鐘（維持 1 小時）、補充備轉 30 分鐘（維持 2 小時）與 1 MW 參與門檻，依台電電力交易平台公開說明與產業報導整理；需量競價抑低量引自台電公布的 2023 年資料。虛擬電廠各資源容量、一日負載與抑低曲線、電動車充電負載與儲能充放電排程皆為典型範例，並非特定案場資料；實際規格與報酬依台電最新規範而定。',
base:()=>{landSky(GY,{sun:{x:1300,y:120},clouds:false});drawGround();},
shots:[
{t:'散落各處的小電廠',en:'Small power plants everywhere',dur:13,side:true,
 d:'電網上除了大型電廠，還有大量分散的資源：工廠可以暫停部分製程，商場可以調整空調，儲能系統可以隨時充放電，電動車充電站可以延後充電，家戶屋頂也有太陽光電。每一個資源單獨看都很小，多半不到 1 MW，難以直接參與電網調度；但數量龐大，加起來的調節能力相當可觀。關鍵在於如何把它們連起來、一起指揮。',
 s:[[0,'工廠、商場、儲能、充電站與家戶分散各處'],[.3,'每一個資源都能調整用電或放電'],[.55,'單一資源太小，難以直接參與調度'],[.78,'連上聚合平台，就能一起接受指揮']],
 cam:u=>camMix({x:800,y:440,s:1.02},{x:800,y:445,s:1.06},ease(seg(u,.1,.6))),
 draw(u){
  scene({bg:false});
  const c=seg(u,.78,.88);cloudIcon(c);
  ['fac','mall','bat','ev','home','agg'].forEach((k,i)=>sigLine(k,c*seg(u,.8+i*.02,.86+i*.02)));
  lab(180,gyy(180)-130,'工廠',{dx:-20,dy:-90,st:'s',a:band(u,.04,.55)});
  lab(415,gyy(415)-150,'商場',{dx:20,dy:-60,a:band(u,.08,.55)});
  lab(595,gyy(595)-50,'儲能系統',{dx:-10,dy:-110,st:'g',a:band(u,.12,.55)});
  lab(775,gyy(775)-76,'充電站',{dx:20,dy:-90,a:band(u,.16,.55)});
  lab(1030,gyy(1030)-96,'家戶屋頂光電',{dx:10,dy:-80,a:band(u,.2,.55)});
  lab(1262,gyy(1262)-110,'聚合商',{dx:-10,dy:-70,st:'g',a:band(u,.82,1)});
 },
 hud(u){hudPanel(240,150,'分散式資源（示例）',seg(u,.05,.1),w=>{const n=Math.round(lerp(0,1200,ease(seg(u,.1,.6))));
  hrow(56,'資源數量',n.toLocaleString('en-US'),w,'#fff');hrow(88,'單一容量','< 1 MW',w,'#ff9d7a');hrow(120,'聚合後',u>.78?'10 MW':'—',w,'#7dffc4');});}},

{t:'什麼是虛擬電廠',en:'What is a virtual power plant',dur:13,
 d:'虛擬電廠（VPP）沒有煙囪也沒有汽機，它是一套軟體與通訊系統。聚合商在每個資源裝設智慧電表與控制器，即時量測用電與出力，預測當下能調整多少容量，再把電網的調度指令拆分給各個資源執行。對調度中心來說，上千個小資源合起來就像一部可以升降出力的機組。台電電力交易平台的參與門檻為 1 MW，小型資源可以聚合後一起投標。',
 s:[[0,'虛擬電廠是一套軟體與通訊系統'],[.3,'把各個資源的可調容量加總起來'],[.6,'合計超過 1 MW，就能參與電力交易'],[.8,'對調度中心來說，就像一部機組']],
 draw(u){
  diagBG();
  const R=[['工廠製程降載',3,'#f2c230'],['商場空調調整',1.5,'#7dc8dc'],['儲能系統',4,'#7dffc4'],['電動車充電站',.8,'#b37cff'],['換電站',.5,'#ff9d7a'],['家戶與小型光電',.2,'#dfe5e8']];
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'分散的資源與可調容量（示例）',20,'#f2c230',700);
  R.forEach(([n,v,c],i)=>alphaDo(seg(u,.03+i*.035,.08+i*.035),()=>{const y=268+i*84;box(84,y-18,10,22,c);wt(106,y,n,18,'#fff',600);
   box(360,y-16,v*72*ease(seg(u,.05+i*.035,.14+i*.035)),18,c);wt(370+v*72,y,v.toFixed(1)+' MW',17,'rgba(227,236,238,.9)',700,'left',COND);}));
  alphaDo(seg(u,.3,.36),()=>{ln([84,762,736,762],'rgba(255,255,255,.2)',1);wt(84,752-30,'每個資源都裝有智慧電表與控制器',16,'rgba(227,236,238,.8)',500);});
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'聚合成一座虛擬電廠',20,'#f2c230',700);
  const B0=760,SC=44,bx=880;let acc=0;
  ln([bx-20,B0,bx+160,B0],'rgba(255,255,255,.5)',2);
  R.forEach(([n,v,c],i)=>{const k=ease(seg(u,.3+i*.04,.36+i*.04));if(k<=0){return;}const h=v*SC,y=B0-(acc+v)*SC;
   alphaDo(k,()=>box(bx,y-(1-k)*60,140,h,c,'rgba(7,27,39,.9)',1.5));acc+=v*k;});
  alphaDo(seg(u,.52,.58),()=>{ctx.setLineDash([8,6]);ln([bx-20,B0-SC,bx+190,B0-SC],'#e8572a',2);ctx.setLineDash([]);wt(bx+198,B0-SC+6,'1 MW 參與門檻',16,'#ff9d7a',700);});
  wt(bx+70,B0-acc*SC-16,acc.toFixed(1)+' MW',26,'#fff',700,'center',COND);
  const ST=[['即時量測','智慧電表回傳數據','#7dc8dc',.6],['預測可調容量','估計能升降多少','#f2c230',.67],['分配調度指令','拆給各資源執行','#7dffc4',.74]];
  ST.forEach(([a,b,c],i)=>alphaDo(seg(u,ST[i][3],ST[i][3]+.05),()=>{const y=280+i*120;card(1130,y,380,96,{bg:'rgba(255,255,255,.04)',st:c});wt(1152,y+38,(i+1)+'. '+tr(a),19,c,700);wt(1152,y+72,b,16,'rgba(227,236,238,.85)',500);}));
  alphaDo(seg(u,.82,.88),()=>tag(1320,700,'像一部可升降出力的機組',{size:17,bg:'#7dffc4',align:'center'}));
 }},

{t:'需量反應：少用也是一種發電',en:'Demand response: using less is also supply',dur:13,
 d:'需量反應是請用戶在電網吃緊時少用電，效果等同多發一份電。台電的做法包括「計畫性減少用電」，以電價優惠鼓勵用戶把用電移到離峰；以及「需量競價」，由用戶提出願意抑低的容量與價格，台電依價格高低擇優採用。執行時以用戶平常的用電基準線比較實際用電，計算抑低量並給付回饋金。台電公布 2023 年最高負載日，需量競價抑低了約 117 萬瓩。',
 s:[[0,'傍晚尖峰，電網備轉容量吃緊'],[.3,'台電發布通知，用戶在指定時段降低用電'],[.55,'尖峰被削減，等同多了一部機組'],[.78,'依基準線計算抑低量，給付回饋金']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,1000,640,{title:'夏季平日負載與需量反應（示意）',x0:12,x1:24,y0:30,y1:42,xt:[12,15,18,21,24],yt:[30,34,38,42],xl:'時',yl:'GW',pl:76,pt:60,pb:56,gx:4,gy:3});
  const line=(fn,H,col,lw,dash)=>{if(H<=12)return;ctx.beginPath();for(let h=12;h<=H;h+=.05){const x=C.X(h),y=C.Y(fn(h));h>12?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=lw;if(dash)ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);};
  const s1=seg(u,.02,.25),w=seg(u,.3,.36),s2=seg(u,.4,.62);
  alphaDo(w,()=>{box(C.X(17.5),C.py,C.X(21.5)-C.X(17.5),C.ph,'rgba(242,194,48,.1)');wt((C.X(17.5)+C.X(21.5))/2,C.py+26,'需量反應時段',16,'#f2c230',700,'center');});
  line(loadAt,12+12*s1,s2>0?'rgba(227,236,238,.75)':'rgba(227,236,238,.95)',3,s2>0?[8,6]:null);
  if(s2>0){const H=12+12*s2;ctx.beginPath();for(let h=17.5;h<=Math.min(H,21.5);h+=.05)(h>17.5?ctx.lineTo:ctx.moveTo).call(ctx,C.X(h),C.Y(loadAt(h)));for(let h=Math.min(H,21.5);h>=17.5;h-=.05)ctx.lineTo(C.X(h),C.Y(loadAt(h)-drAt(h)));ctx.closePath();ctx.fillStyle='rgba(125,255,196,.3)';ctx.fill();
   line(h=>loadAt(h)-drAt(h),H,'#7dffc4',3.5);}
  alphaDo(band(u,.12,.4),()=>wt(C.X(14.5),C.Y(loadAt(14.5))-16,'總用電',17,'#fff',700,'center'));
  alphaDo(seg(u,.4,.46),()=>wt(C.X(15),C.Y(loadAt(15))-16,'基準線（原本的用電）',17,'rgba(227,236,238,.9)',700,'center'));
  alphaDo(seg(u,.56,.62),()=>{const x=C.X(19.5);arrow(x,C.Y(loadAt(19.5))+4,x,C.Y(loadAt(19.5)-1.2)+4,'#7dffc4',3);tag(x,C.Y(loadAt(19.5)-1.2)+42,'尖峰抑低 約 1.2 GW',{size:16,bg:'#7dffc4',align:'center'});});
  card(1100,160,440,640,{bg:'rgba(7,27,39,.75)'});wt(1124,200,'需量反應怎麼進行',20,'#f2c230',700);
  const T=[['台電發布需求','前一天或當天通知','#7dc8dc',.3],['用戶降低用電','製程調整、空調、自用發電','#f2c230',.42],['與基準線比較','計算實際抑低量','#7dffc4',.7],['取得回饋金','依抑低量與得標價格','#7dffc4',.8]];
  T.forEach(([a,b,c,a0],i)=>alphaDo(seg(u,a0,a0+.06),()=>{const y=232+i*138;card(1124,y,392,116,{bg:'rgba(255,255,255,.04)',st:c});box(1124,y,6,116,c);wt(1146,y+44,a,19,c,700);wt(1146,y+84,b,16,'rgba(227,236,238,.88)',500);}));
 }},

{t:'電力交易平台的備轉服務',en:'Reserve services on the trading platform',dur:14,
 d:'台電電力交易平台於 2021 年啟用，以日前市場採購輔助服務。依反應速度分成幾種：調頻備轉（dReg）要在 1 秒內依頻率自動充放電，主要由電池儲能提供；即時備轉要在 10 分鐘內補上缺口，並維持至少 1 小時；補充備轉要在 30 分鐘內反應，維持至少 2 小時。需量反應、自用發電機與聚合後的虛擬電廠，都可依自己的能力選擇投標的項目，像接力賽一樣分工。',
 s:[[0,'輔助服務依反應速度分成幾種'],[.25,'調頻備轉：1 秒內自動充放電'],[.5,'即時備轉：10 分鐘內補上缺口'],[.72,'補充備轉：30 分鐘內反應，撐得更久']],
 draw(u){
  diagBG();
  const SV=[['調頻備轉（dReg）','1 秒','依頻率自動充放電','主要：電池儲能','#7dffc4',.2],['即時備轉','10 分鐘','維持至少 1 小時','需量反應、自用發電機','#f2c230',.45],['補充備轉','30 分鐘','維持至少 2 小時','需量反應、自用發電機','#7dc8dc',.68]];
  SV.forEach(([n,t,a,b,c,a0],i)=>alphaDo(seg(u,a0,a0+.06),()=>{const x=60+i*500;card(x,160,480,300,{bg:'rgba(7,27,39,.8)',st:c});box(x,160,480,6,c);
   wt(x+24,206,n,20,c,700);wt(x+24,286,t,46,'#fff',700,'left',COND);wt(x+24,318,'反應時間',16,'rgba(227,236,238,.75)',500);wt(x+24,366,a,18,'#fff',600);wt(x+24,410,b,17,'rgba(227,236,238,.85)',500);}));
  /* 下：對數時間軸 */
  card(60,490,1480,310,{bg:'rgba(7,27,39,.75)'});wt(84,530,'缺口出現後，誰先接手（對數時間軸）',19,'#f2c230',700);
  alphaDo(seg(u,.04,.1),()=>tag(1516,522,'參與門檻：≥ 1 MW，可聚合',{size:15,bg:'#dfe5e8',align:'right'}));
  const L0=Math.log10(.5),L1=Math.log10(4*3600),X=t=>140+(Math.log10(t)-L0)/(L1-L0)*1340,AY=760;
  ln([X(.5),AY,X(14400),AY],'rgba(255,255,255,.6)',2);
  [[1,'1 秒'],[10,'10 秒'],[60,'1 分'],[600,'10 分'],[1800,'30 分'],[3600,'1 小時'],[7200,'2 小時'],[14400,'4 小時']].forEach(([t,s])=>{ln([X(t),AY,X(t),AY+7],'rgba(255,255,255,.6)',1.5);wt(X(t),AY+30,s,15,'rgba(227,236,238,.85)',600,'center',COND);});
  const BR=[[1,14400,'持續依頻率調節','#7dffc4',.25,0],[600,600+3600,'維持 ≥ 1 小時','#f2c230',.5,1],[1800,1800+7200,'維持 ≥ 2 小時','#7dc8dc',.74,2]];
  BR.forEach(([t0,t1,s,c,a0,i])=>{const k=ease(seg(u,a0,a0+.12));if(k<=0)return;const y=572+i*56,x0=X(t0),x1=lerp(x0,X(t1),k);
   circ(x0,y+16,8,c);alphaDo(.55,()=>{rrp(x0,y+4,x1-x0,24,4);ctx.fillStyle=c;ctx.fill();});
   alphaDo(seg(u,a0+.06,a0+.1),()=>wt(x0+14,y-4,s,16,c,700,'left'));});
 }},

{t:'一道調度指令',en:'One dispatch order',dur:13,side:true,
 d:'當電網出現缺口，台電調度中心向得標的聚合商送出指令，例如「10 分鐘內抑低 10 MW」。聚合平台依各資源當下的狀況分配任務：儲能立刻放電，工廠暫停部分產線，商場把空調溫度調高一度，充電站暫緩充電。各資源的反應以秒到分鐘計，平台即時回報合計響應量，直到達成指令；事件結束後再依序恢復，避免反彈造成新的尖峰。',
 s:[[0,'調度中心送出指令：10 分鐘內抑低 10 MW'],[.25,'聚合平台把任務拆給各個資源'],[.45,'儲能放電、工廠降載、充電暫緩'],[.75,'合計響應達到 10 MW，回報調度中心']],
 cam:u=>camMix({x:800,y:440,s:1.02},{x:800,y:430,s:1.04},ease(seg(u,.05,.4))),
 draw(u){
  const r=k=>ease(seg(u,.45+k*.05,.6+k*.05));
  scene({fk:1-.6*r(1),ac:1-.7*r(2),ev:r(3)<.5,bg:r(0)>.2});
  cloudIcon(1);
  const s0=seg(u,.02,.1);
  if(s0>0){const [x,y]=rTop('tpc');ctx.save();ctx.setLineDash([10,8]);ctx.lineDashOffset=-TT*40;alphaDo(s0,()=>{ctx.strokeStyle='#e8572a';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x+20,y-6);ctx.quadraticCurveTo(1150,CLY-80,CLX+80,CLY);ctx.stroke();});ctx.restore();ctx.setLineDash([]);}
  ['fac','mall','bat','ev','home'].forEach((k,i)=>sigLine(k,seg(u,.25+i*.03,.3+i*.03)));
  const MW=[['fac',3],['mall',1.5],['bat',4],['ev',.8],['home',.7]];
  MW.forEach(([k,v],i)=>{const kk=[1,2,0,3,4][i];const a=seg(u,.48+kk*.05,.54+kk*.05);if(a<=0)return;const [x,y]=rTop(k);alphaDo(a,()=>tag(x,y-30,'−'+(v*r(kk)).toFixed(1)+' MW',{size:15,bg:'#7dffc4',align:'center'}));});
  lab(1462,gyy(1462)-110,'台電調度中心',{dx:-20,dy:-160,st:'w',a:band(u,.02,.4)});
  lab(CLX,CLY+36,'聚合平台分派',{dx:-160,dy:30,st:'g',a:band(u,.25,.45)});
  lab(595,gyy(595)-50,'儲能放電',{dx:-60,dy:-150,st:'g',a:band(u,.6,1)});
  lab(775,gyy(775)-50,'充電暫緩',{dx:60,dy:-150,a:band(u,.66,1)});
 },
 hud(u){hudPanel(240,150,'調度事件（示例）',seg(u,.05,.1),w=>{const r=k=>ease(seg(u,.45+k*.05,.6+k*.05));const tot=4*r(0)+3*r(1)+1.5*r(2)+.8*r(3)+.7*r(4);
  hrow(56,'調度指令','−10.0 MW',w,'#ff9d7a');hrow(88,'合計響應',(-tot).toFixed(1)+' MW',w,tot>9.95?'#7dffc4':'#f2c230');hrow(120,'狀態',tot>9.95?'達成':(u>.25?'執行中':'待命'),w,tot>9.95?'#7dffc4':'#fff');});}},

{t:'儲能與電動車的角色',en:'The role of storage and EVs',dur:13,
 d:'儲能與電動車是最靈活的虛擬電廠資源。電動車若一下班回家就充電，充電負載會疊在傍晚尖峰上；透過智慧充電，把充電移到中午光電多的時段或深夜離峰，不影響隔天出門，卻能削減尖峰。電池儲能則可以中午吸收多餘的光電、傍晚放電支援尖峰，台電的「電能移轉複合動態調節備轉（E-dReg）」就是這種用法，同時兼顧調頻與移轉電能。',
 s:[[0,'下班後同時充電，疊在傍晚尖峰上'],[.3,'智慧充電把充電移到中午與深夜'],[.55,'儲能中午充電，吸收多餘的光電'],[.78,'傍晚放電，支援用電尖峰']],
 draw(u){
  diagBG();
  const A=chartBox(60,160,720,640,{title:'社區電動車充電負載（示意）',x0:0,x1:24,y0:0,y1:1,xt:[0,6,12,18,24],yt:[0,.5,1],xl:'時',yl:'MW',pl:70,pt:60,pb:56,gx:4,gy:2});
  const line=(C,fn,H,col,lw,dash)=>{if(H<=0)return;ctx.beginPath();for(let h=0;h<=H;h+=.1){const x=C.X(h),y=C.Y(fn(h));h?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=lw;if(dash)ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);};
  const s1=seg(u,.02,.22),s2=seg(u,.3,.5);
  alphaDo(.6,()=>box(A.X(17),A.py,A.X(21)-A.X(17),A.ph,'rgba(232,87,42,.1)'));
  alphaDo(seg(u,.02,.06),()=>wt(A.X(19),A.py+A.ph-14,'傍晚尖峰',15,'#ff9d7a',700,'center'));
  line(A,evRaw,24*s1,'#ff8a60',3.5,s2>0?[8,6]:null);
  line(A,evSmart,24*s2,'#7dffc4',3.5);
  alphaDo(band(u,.14,1),()=>wt(A.X(20)-20,A.Y(.93)-6,'下班即充電',16,'#ff9d7a',700,'right'));
  alphaDo(seg(u,.44,.5),()=>{wt(A.X(13),A.Y(evSmart(13))-16,'中午充電',16,'#7dffc4',700,'center');wt(A.X(3),A.Y(evSmart(2))-16,'深夜充電',16,'#7dffc4',700,'left');});
  const B=chartBox(820,160,720,640,{title:'儲能一天的充放電排程（示意）',x0:0,x1:24,y0:-5,y1:5,xt:[0,6,12,18,24],yt:[-4,0,4],xl:'時',yl:'MW',pl:70,pt:60,pb:56,gx:4,gy:2});
  ln([B.px,B.Y(0),B.px+B.pw,B.Y(0)],'rgba(255,255,255,.5)',1.5);
  const s3=seg(u,.55,.72),s4=seg(u,.78,.92);
  for(let h=0;h<24;h++){const p=batP(h);if(!p)continue;const k=p<0?clamp(s3*4-(h-10)):clamp(s4*4-(h-17));if(k<=0)continue;const x=B.X(h)+3,w=B.X(h+1)-B.X(h)-6;
   alphaDo(k,()=>{if(p<0)box(x,B.Y(0),w,B.Y(p)-B.Y(0),'#7dc8dc');else box(x,B.Y(p),w,B.Y(0)-B.Y(p),'#7dffc4');});}
  alphaDo(seg(u,.62,.68),()=>wt(B.X(12),B.Y(-4)+30,'中午充電：吸收光電',16,'#7dc8dc',700,'center'));
  alphaDo(seg(u,.86,.92),()=>wt(B.X(19),B.Y(4)-14,'傍晚放電：支援尖峰',16,'#7dffc4',700,'center'));
  const soc=Math.round(10+80*ease(s3)-80*ease(s4));
  alphaDo(seg(u,.55,.6),()=>tag(B.px+12,B.py+24,trf('電量 {n}%',{n:soc}),{size:16,bg:'#dfe5e8'}));
 }},

{t:'傍晚的虛擬電廠',en:'The virtual power plant at dusk',dur:12,side:true,
 d:'太陽下山、城市亮燈的傍晚，正是虛擬電廠最能發揮的時段。儲能放出中午存下的電，工廠與商場在約定時段降低用電，電動車把充電延後到深夜，這些分散的調整加起來，減輕了燃氣機組快速升載的壓力，也減少為了短暫尖峰而興建的備用電廠。再生能源越多，電網越需要這種來自用戶端的彈性；電網的平衡，不再只是發電廠的工作。',
 s:[[0,'傍晚，光電出力減少，用電仍在高峰'],[.3,'儲能放電，工廠與商場降低用電'],[.55,'電動車延後充電，避開尖峰'],[.8,'分散的彈性，一起守住電網平衡']],
 base:u=>{const k=seg(u,.05,.7);landSky(GY,{sun:{x:lerp(1180,1480,seg(u,0,.8)),y:lerp(260,620,ease(seg(u,0,.8)))},dusk:k,clouds:false});drawGround();},
 cam:u=>({x:800,y:440,s:1.02}),
 draw(u){
  const dk=seg(u,.05,.7),r=ease(seg(u,.3,.5));
  scene({fk:1-.6*r,ac:1-.7*r,ev:u<.55,bg:u>.3,lit:ease(seg(u,.2,.8))});
  alphaDo(dk*.3,()=>box(VX0,VY0,VX1-VX0,VY1-VY0,'#0e1a2a'));
  cloudIcon(1);
  ['fac','mall','bat','ev','home'].forEach(k=>sigLine(k,.7));
  lab(595,gyy(595)-50,'儲能放電',{dx:-60,dy:-150,st:'g',a:band(u,.3,1)});
  lab(180,gyy(180)-130,'工廠降載',{dx:-20,dy:-90,st:'s',a:band(u,.34,1)});
  lab(775,gyy(775)-50,'延後充電',{dx:60,dy:-150,a:band(u,.55,1)});
  lab(1020,gyy(1020)-60,'家戶亮燈',{dx:30,dy:-120,st:'l',a:band(u,.8,1)});
 },
 hud(u){hudPanel(240,182,'傍晚供需（示意）',seg(u,.05,.1),w=>{const h=lerp(17,19.5,seg(u,.02,.95)),r=ease(seg(u,.3,.6));
  hrow(56,'時間',trf('{h}:{m}',{h:Math.floor(h),m:String(Math.floor((h%1)*60)).padStart(2,'0')}),w,'#fff');hrow(86,'系統負載',loadAt(h).toFixed(1)+' GW',w,'#fff');hrow(116,'虛擬電廠',(1.2*r).toFixed(1)+' GW',w,'#7dffc4');hrow(146,'燃氣升載',(3.4-1.2*r).toFixed(1)+' GW',w,'#f2c230');hrow(172,'頻率','60.00 Hz',w,'#7dffc4');});}}
]};
