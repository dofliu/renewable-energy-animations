// KITS: land
/* 陸域風電系列 第 6 集：風機的控制與保護 */
const gyy=x=>groundY(x);
const TX=640,HY=240;                                       // 風機塔架位置與輪轂高度（世界座標）
const PW=3.6,VCI=3,VR=12,VCO=25,RMAX=15,TSR=8,RAD=60;      // 3.6 MW、切入／額定／切出風速、額定轉速、葉尖速比、轉子半徑（典型範例）
const DEG=Math.PI/180;
/* 運轉曲線（示例） */
const pOf=v=>v<VCI||v>VCO?0:v>=VR?PW:PW*(v*v*v-VCI*VCI*VCI)/(VR*VR*VR-VCI*VCI*VCI);
const rpmOf=v=>v>VCO?1:v<VCI?v*1.25:Math.min(RMAX,TSR*v/RAD*60/TAU);
const pitchOf=v=>v<=VR?0:v<=VCO?24*Math.pow((v-VR)/(VCO-VR),.7):lerp(24,90,ease(clamp((v-VCO)/1.5,0,1)));
const tqOf=v=>{const r=rpmOf(v);return r>0?pOf(v)/PW*RMAX/r*100:0;};
/* 轉速關鍵影格 [[秒,rpm],…] 的轉角（積分）與內插 */
function rotAt(t,K){const r0=K[0][1];if(t<=K[0][0])return r0*t*TAU/60;let a=r0*K[0][0];
  for(let i=1;i<K.length;i++){const [ta,ra]=K[i-1],[tb,rb]=K[i];if(t<=tb){const rt=ra+(rb-ra)*(t-ta)/(tb-ta);a+=(ra+rt)/2*(t-ta);return a*TAU/60;}a+=(ra+rb)/2*(tb-ta);}
  const L=K[K.length-1];return (a+L[1]*(t-L[0]))*TAU/60;}
function rpmAt(t,K){if(t<=K[0][0])return K[0][1];for(let i=1;i<K.length;i++){const [ta,ra]=K[i-1],[tb,rb]=K[i];if(t<=tb)return ra+(rb-ra)*(t-ta)/(tb-ta);}return K[K.length-1][1];}
/* 側視葉片：pitch 越大，側面看到的弦長越寬 */
function bladeS(hx,hy,a,L,p){const c=Math.cos(a),s=Math.sin(a),dx=s*6,w=3+6*(p||0)/90;
  poly([hx-w,hy,hx+w,hy,hx+dx+w*.5,hy-c*L,hx+dx-w*.5,hy-c*L],'#f4f6f7','rgba(0,0,0,.35)',1);}
/* 側視風機；cut：外殼透明度（0 看得到內部），rot：轉子角度，p：槳距角 */
function turbineSide(rot,cut,p){const g=gyy(TX);
  poly([TX-18,g,TX-11,HY+36,TX+11,HY+36,TX+18,g],'#eef2f4','rgba(0,0,0,.3)',1);
  const hx=TX-100;
  for(let i=0;i<3;i++){const a=rot+i*TAU/3;if(Math.cos(a)<0)bladeS(hx,HY,a,200,p);}
  box(TX-80,HY+26,260,10,'#8d989f');
  box(TX-100,HY-6,110,12,'#9aa3a8','rgba(0,0,0,.4)',1);
  for(let k=0;k<3;k++){const q=rot+k*TAU/3;if(Math.cos(q)>0)ln([TX-75,HY+5*Math.sin(q),TX+8,HY+5*Math.sin(q)],'rgba(0,0,0,.35)',1.5);}
  box(TX-64,HY-18,18,36,'#7dc8dc','rgba(0,0,0,.45)',1);
  box(TX+10,HY-26,75,54,'#6f7a80','rgba(0,0,0,.5)',1.5);
  box(TX+85,HY-3,26,6,'#9aa3a8');
  box(TX+90,HY-18,6,36,'#e8572a');
  box(TX+110,HY-22,60,44,'#58b8d0','rgba(0,0,0,.45)',1);
  for(let k=0;k<5;k++){const q=rot*12+k*TAU/5;if(Math.cos(q)>0)ln([TX+114,HY+18*Math.sin(q),TX+166,HY+18*Math.sin(q)],'rgba(0,0,0,.25)',2);}
  box(TX-8,HY+36,16,8,'#394650');                                      // 偏航軸承
  alphaDo(cut,()=>{rrp(TX-80,HY-32,260,68,8);ctx.fillStyle='#e3e8ec';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.stroke();});
  alphaDo(1-cut,()=>{rrp(TX-80,HY-32,260,68,8);ctx.strokeStyle='rgba(40,50,60,.7)';ctx.lineWidth=1.5;ctx.setLineDash([6,4]);ctx.stroke();ctx.setLineDash([]);});
  poly([TX-80,HY-26,TX-112,HY-12,TX-118,HY,TX-112,HY+12,TX-80,HY+26],'#dfe5e8','rgba(0,0,0,.35)',1);
  for(let i=0;i<3;i++){const a=rot+i*TAU/3;if(Math.cos(a)>=0)bladeS(hx,HY,a,200,p);}
  metMast(TX+150,HY-32);
  return {hx,hy:HY};}
/* 機艙頂的風速計（杯式）與風向計 */
function metMast(x,y){ln([x,y,x,y-26],'#6f7a80',2);ln([x-14,y-26,x+14,y-26],'#6f7a80',2);
  const cx=x+14,cy=y-36;ln([cx,y-26,cx,cy],'#6f7a80',1.5);
  for(let i=0;i<3;i++){const a=TT*6+i*TAU/3;ln([cx,cy,cx+Math.cos(a)*8,cy+Math.sin(a)*2],'#6f7a80',1);circ(cx+Math.cos(a)*8,cy+Math.sin(a)*2,2.6,'#dfe5e8','#394650',1);}
  const vx=x-14;ln([vx,y-26,vx,y-34],'#6f7a80',1.5);ln([vx-6,y-36,vx+10,y-36],'#6f7a80',1.5);poly([vx+6,y-36,vx+14,y-42,vx+14,y-30],'#dfe5e8','#394650',1);}
/* 風線 */
function windLines(y0,y1,n,sp,a,seed,len,col){if(a<=0)return;const r=rng(seed||3);ctx.lineCap='round';
  for(let i=0;i<n;i++){const y=y0+r()*(y1-y0),ph=r(),s=sp*(.7+.6*r()),L=(len||60)*(.6+.8*r());const x=VX0-200+((ph*2400+TT*s)%(VX1-VX0+400));
   alphaDo(a*(.25+.35*r()),()=>ln([x,y,x+L,y],col||'#ffffff',2));}ctx.lineCap='butt';}
/* 齒輪 */
function gearPath(x,y,r,Z,a){const th=Math.max(3,r*.08);
  for(let i=0;i<=Z*4;i++){const q=a+i*TAU/(Z*4),k=(i%4===1||i%4===2)?1:0,rr=r+(k?th:0)-th*.5,px=x+Math.cos(q)*rr,py=y+Math.sin(q)*rr;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.closePath();}
function gear(x,y,r,Z,a,fill){ctx.beginPath();gearPath(x,y,r,Z,a);ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle='#394650';ctx.lineWidth=1.5;ctx.stroke();circ(x,y,r*.25,'#394650');}
/* 葉片剖面（翼型）：LE 朝向角度 ang */
function airfoil(x,y,L,ang,col){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.beginPath();
  const T=s=>L*.15*5*(.2969*Math.sqrt(s)-.126*s-.3516*s*s+.2843*s*s*s-.1015*s*s*s*s);
  for(let i=0;i<=24;i++){const s=i/24;ctx.lineTo(L/2-s*L,-T(s)-L*.03*Math.sin(Math.PI*s));}
  for(let i=24;i>=0;i--){const s=i/24;ctx.lineTo(L/2-s*L,T(s)*.7-L*.03*Math.sin(Math.PI*s));}
  ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.strokeStyle='#13232e';ctx.lineWidth=2;ctx.stroke();ctx.restore();}
/* 沿折線的位置與流動點 */
function along(P,f){let L=0;const S=[];for(let i=2;i<P.length;i+=2){const d=Math.hypot(P[i]-P[i-2],P[i+1]-P[i-1]);S.push(d);L+=d;}
  let t=((f%1)+1)%1*L;for(let i=0;i<S.length;i++){if(t<=S[i]){const k=t/S[i];return [lerp(P[i*2],P[i*2+2],k),lerp(P[i*2+1],P[i*2+3],k)];}t-=S[i];}return [P[P.length-2],P[P.length-1]];}
function flow(P,n,sp,col,r){for(let i=0;i<n;i++){const [x,y]=along(P,TT*sp+i/n);circ(x,y,r||4,col);}}
/* 塔底控制櫃、遠端監控中心、路樹 */
function baseCab(){const g=gyy(TX),bx=TX+36;box(bx,g-46,70,46,'#dfe5e8','rgba(0,0,0,.3)',1);for(let i=0;i<3;i++)ln([bx+10,g-36+i*10,bx+60,g-36+i*10],'rgba(0,0,0,.2)',2);circ(bx+62,g-40,3,'#7dffc4');}
function ctrlRoom(x){const g=gyy(x);box(x-60,g-64,120,64,'#dfe5e8','rgba(0,0,0,.3)',1);poly([x-68,g-64,x,g-92,x+68,g-64],'#9aa3a8');
  for(let i=0;i<3;i++)box(x-44+i*32,g-48,22,18,'#16384c');ln([x+40,g-92,x+40,g-130],'#6f7a80',2);}
function tree(x,b){const g=gyy(x);ln([x,g,x+b*.3,g-40,x+b,g-72],'#5b4632',5);circ(x+b*1.1,g-84,24,'#3f6b45');circ(x+b*1.2-16,g-72,17,'#4a7a50');}
function rain(a){if(a<=0)return;const r=rng(11);alphaDo(a,()=>{for(let i=0;i<140;i++){const x0=VX0-300+r()*(VX1-VX0+600),y=((r()*1000+TT*800)%1000)-100,x=x0+(y*.45);ln([x,y,x+12,y+24],'rgba(205,222,235,.45)',1.5);}});}

const EP={no:6,slug:'onshore-wind',seriesName:'陸域風電系列',t:'風機的控制與保護',en:'Turbine control and protection',
lede:'風機多半無人看守，卻能自己起動、併網、追風、在颱風來時停機自保。這一集看控制器如何依風速切換轉矩與變槳控制、偏航系統怎麼對風，以及順槳與剎車組成的保護機制。',
facts:[['3','m/s','切入風速：風速持續高於此值，風機才起動併聯（示例）'],
['≈ 12','m/s','額定風速：以上改由變槳控制，功率維持額定（示例）'],
['25','m/s','切出風速：10 分鐘平均超過此值即順槳停機（典型值）'],
['≈ 90','°','順槳角度：葉片像風標一樣對著風，受力最小'],
['57','m/s','IEC 61400-1 第 4 版 T 級（颱風級）參考風速，10 分鐘平均、50 年回歸期'],
['2','套','獨立剎車：葉片變槳的氣動剎車與高速軸機械碟剎（常見設計）']],
note:'說明：本集為教育用途示意動畫，機艙與設備比例經過簡化，偏航與停機動作的時間已壓縮。切入 3 m/s、額定約 12 m/s、切出 25 m/s 為大型變槳變速風機的典型值（例如 NREL 5 MW 參考風機為 3、11.4、25 m/s）；區間 2 以發電機轉矩追蹤最佳葉尖速比、區間 3 以變槳維持額定功率，為變速變槳風機的一般控制架構；IEC 61400-1 第 4 版新增 T 級，參考風速 57 m/s；颱風時順槳空轉並維持偏航對風、氣動與機械兩套剎車為常見設計。額定 3.6 MW、轉子半徑 60 m、葉尖速比 8、偏航觸發約 8°、偏航速度約每秒 0.5°、各時間軸、轉速與槳距角數值皆為典型範例，並非特定機型或案場資料。',
base:()=>{landSky(GY,{sun:{x:1320,y:120},clouds:false});drawGround();},
shots:[
/* 1 ─────────────────────────────── 風機的大腦 */
{t:'風機的大腦',en:'The brain of a turbine',dur:13,side:true,
 d:'一部陸域風機大部分時間都在無人看守下自動運轉，靠的是機艙與塔底的控制系統。機艙頂端的風速計與風向計持續量測，控制器依據風況決定何時起動、葉片要轉到什麼角度、發電機要施加多少轉矩，以及機艙是否要轉向對風。轉速、溫度、振動等上百個訊號同時被監看，資料經由 SCADA 系統傳回遠端監控中心；一旦超出安全範圍，保護系統會自動讓風機停機。',
 s:[[0,'風機一直在量風、判斷、動作'],[.28,'機艙頂的風速計與風向計持續量測'],[.5,'控制器調整變槳、轉矩與偏航'],[.75,'運轉資料即時傳回遠端監控中心']],
 cam:u=>{const A={x:800,y:420,s:1},B={x:TX+10,y:HY+10,s:2.2};return u<.6?camMix(A,B,ease(seg(u,.24,.38))):camMix(B,A,ease(seg(u,.66,.78)));},
 draw(u){
  windLines(120,560,18,240,.9,5,60);
  turbineSide(TT*12*TAU/60,1,0);
  baseCab();ctrlRoom(1250);
  const g=gyy(TX);
  alphaDo(seg(u,.76,.82),()=>{ctx.setLineDash([8,6]);ln([TX+71,g-46,TX+71,g-80,1290,gyy(1250)-130],'#7dffc4',2);ctx.setLineDash([]);
   for(let i=0;i<3;i++){const k=((TT*.8+i/3)%1);alphaDo(1-k,()=>{ctx.beginPath();ctx.arc(1290,gyy(1250)-130,8+k*40,-2.4,-.7);ctx.strokeStyle='#7dffc4';ctx.lineWidth=2;ctx.stroke();});}});
  lab(TX+50,HY-32,'機艙',{dx:60,dy:-70,st:'l',a:band(u,.03,.22)});
  lab(TX+71,g-46,'塔底控制櫃',{dx:90,dy:-60,st:'l',a:band(u,.05,.24)});
  lab(TX+164,HY-68,'風速計',{dx:-100,dy:-70,st:'s',a:band(u,.36,.62)});
  lab(TX+136,HY-72,'風向計',{dx:-190,dy:-40,st:'s',a:band(u,.4,.62)});
  lab(TX-104,HY-10,'變槳系統（輪轂內）',{dx:-40,dy:110,st:'g',a:band(u,.46,.64)});
  lab(TX,HY+40,'偏航系統',{dx:90,dy:80,st:'g',a:band(u,.5,.64)});
  lab(TX+71,g-46,'主控制器（PLC）',{dx:90,dy:-70,st:'s',a:band(u,.8,1)});
  lab(1250,gyy(1250)-80,'SCADA 遠端監控',{dx:-20,dy:-90,st:'g',a:band(u,.82,1)});
 },
 hud(u){hudPanel(250,182,'風機狀態（示例）',seg(u,.05,.1),w=>{const v=9.2+.6*nz(TT*.5);
  hrow(56,'風速',trf('{n} m/s',{n:v.toFixed(1)}),w,'#fff');hrow(88,'運轉狀態','併網發電',w,'#7dffc4');
  hrow(120,'槳距角','0°',w,'#f2c230');hrow(152,'輸出功率',trf('{p} MW',{p:pOf(v).toFixed(2)}),w,'#f2c230');});}},

/* 2 ─────────────────────────────── 起動與併聯 */
{t:'從靜止到併聯',en:'From standstill to grid connection',dur:14,
 d:'風機從靜止到發電要經過一連串條件判斷。控制器先完成自我檢測，確認電網、油溫與各系統正常；接著確認風速在數分鐘內持續高於切入風速（示例 3 m/s），並讓機艙偏航對準風向。停機時葉片是順槳的，約 90°；起動時變槳系統把葉片轉到起動角度，讓轉子開始加速。當發電機轉速進入可併聯的範圍，變流器讓輸出與 60 Hz 電網同步，併聯開關才閉合，風機開始送電。',
 s:[[0,'併聯前先自我檢測、確認風況'],[.28,'偏航對風，葉片從順槳轉到起動角度'],[.46,'轉子加速到發電機的併聯轉速'],[.68,'併聯開關閉合，開始送電']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'起動程序（示例）',20,'#f2c230',700);
  const ST=['自我檢測：電網、油溫、各系統','風速 > 3 m/s 持續數分鐘','偏航：機艙對準風向','變槳：90° → 起動角度','轉子加速到併聯轉速','與 60 Hz 同步，併聯開關閉合'],T0=[.04,.16,.26,.34,.46,.66];
  let cur=-1;T0.forEach((t,i)=>{if(u>=t)cur=i;});
  ST.forEach((s,i)=>{const y=236+i*90,on=u>=T0[i],a=on?1:.35;alphaDo(a,()=>{
   const c=i<cur?'#7dffc4':i===cur?'#f2c230':'rgba(227,236,238,.6)';
   box(84,y,652,68,i===cur?'rgba(242,194,48,.12)':'rgba(255,255,255,.04)',c,i===cur?2.5:1);
   circ(122,y+34,20,i<cur?'#7dffc4':'#16384c',c,2);wt(122,y+42,i<cur?'✓':String(i+1),20,i<cur?'#13232e':c,800,'center',COND);
   wt(160,y+42,s,19,'#fff',i===cur?700:600);});
   if(i<5)alphaDo(a*.6,()=>ln([122,y+54,122,y+90],'rgba(227,236,238,.4)',2));});
  /* 右：時間圖 */
  const C=chartBox(800,160,740,640,{title:'起動過程的變化（示例）',x0:0,x1:120,y0:0,y1:110,xt:[0,30,60,90,120],yt:[0,50,100],xl:'時間 s',yl:'相對值 %',pl:80,pt:110,pb:70,gx:4,gy:2});
  const tc=120*seg(u,.1,.9);
  const S=[['槳距角','#f2c230',t=>t<35?100:t<60?lerp(100,4,ease((t-35)/25)):4],
   ['轉子轉速','#7dffc4',t=>t<38?2:t<85?lerp(2,100,easeOut((t-38)/47)):100],
   ['輸出功率','#ff9d7a',t=>t<85?0:lerp(0,38,easeOut(Math.min(1,(t-85)/30)))]];
  S.forEach(([n,c,f],i)=>{wt(C.px+160+i*170,C.py-18,n,16,c,700);box(C.px+140+i*170,C.py-26,14,4,c);
   if(tc>0){ctx.beginPath();for(let k=0;k<=80;k++){const t=tc*k/80;const x=C.X(t),y=C.Y(f(t));k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=c;ctx.lineWidth=3;ctx.stroke();circ(C.X(tc),C.Y(f(tc)),6,c,'#13232e',1.5);}});
  alphaDo(seg(u,.66,.7),()=>{ctx.setLineDash([7,6]);ln([C.X(85),C.py,C.X(85),C.py+C.ph],'#fff',2);ctx.setLineDash([]);tag(C.X(85),C.py+30,'併聯',{size:16,bg:'#7dffc4',align:'center'});});
  alphaDo(seg(u,.3,.36),()=>wt(C.X(47),C.Y(78),'葉片轉離順槳',16,'#f2c230',700,'center'));
 }},

/* 3 ─────────────────────────────── 運轉區間 */
{t:'四個運轉區間',en:'Four operating regions',dur:14,
 d:'風機依風速分成幾個運轉區間。低於切入風速時，風能太少，風機待機空轉。區間 2 從切入到額定風速，葉片維持在最佳角度，控制器調整發電機轉矩，讓轉速跟著風速變化，保持最佳葉尖速比（示例約 8），盡量接近最大功率係數。超過額定風速後進入區間 3，改由變槳控制：葉片轉大角度，減少吸收的風能，讓轉速與功率維持在額定值。風速超過切出風速（典型 25 m/s），風機順槳停機。',
 s:[[0,'風速低於 3 m/s：待機，不發電'],[.25,'區間 2：調整發電機轉矩，追最大效率'],[.5,'區間 3：葉片變槳，功率維持額定'],[.78,'超過 25 m/s：順槳停機保護']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,860,640,{title:'功率曲線與運轉區間（示例）',x0:0,x1:30,y0:0,y1:4.5,xt:[0,3,12,25,30],yt:[0,1,2,3,4],xl:'風速 m/s',yl:'功率 MW',pl:80,pt:70,pb:70,gx:6,gy:4});
  const v=28*seg(u,.06,.86);
  const RG=[[0,VCI,'區間 1','rgba(227,236,238,.06)','rgba(227,236,238,.8)'],[VCI,VR,'區間 2','rgba(125,255,196,.08)','#7dffc4'],[VR,VCO,'區間 3','rgba(242,194,48,.08)','#f2c230'],[VCO,30,'切出','rgba(232,87,42,.1)','#ff9d7a']];
  RG.forEach(([a,b,n,f,c])=>{box(C.X(a),C.py,C.X(b)-C.X(a),C.ph,f);wt((C.X(a)+C.X(b))/2,C.py+28,n,17,c,700,'center');});
  ctx.beginPath();for(let k=0;k<=280;k++){const x=v*k/280;const px=C.X(x),py=C.Y(pOf(x));k?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.strokeStyle='#f2c230';ctx.lineWidth=3.5;ctx.stroke();
  ctx.setLineDash([6,6]);ln([C.X(v),C.py+40,C.X(v),C.py+C.ph],'rgba(255,255,255,.5)',1.5);ctx.setLineDash([]);
  circ(C.X(v),C.Y(pOf(v)),8,'#7dffc4','#13232e',2);
  wt(C.X(v),C.Y(pOf(v))-18,trf('{n} m/s',{n:v.toFixed(1)}),18,'#fff',700,'center',COND);
  /* 右：控制器正在做什麼 */
  card(960,160,580,640,{bg:'rgba(7,27,39,.75)'});wt(984,200,'控制器正在做什麼',20,'#f2c230',700);
  const md=v<VCI?['待機空轉','#dfe5e8']:v<VR?['轉矩控制：追最大效率','#7dffc4']:v<=VCO?['變槳控制：維持額定','#f2c230']:['順槳停機','#e8572a'];
  tag(1250,248,md[0],{size:18,bg:md[1],align:'center'});
  const p=pitchOf(v),ay=390;
  ctx.setLineDash([6,6]);ln([1250,300,1250,480],'rgba(227,236,238,.4)',1.5);ctx.setLineDash([]);
  wt(1262,318,'旋轉平面',15,'rgba(227,236,238,.7)',600,'left');
  for(let i=0;i<3;i++){const y=350+i*40,x=1000+((TT*60+i*30)%60);arrow(x,y,x+70,y,'rgba(125,200,220,.8)',2.5);}
  wt(1030,480,'風',17,'#7dc8dc',700,'center');
  airfoil(1250,ay,170,-Math.PI/2-p*DEG,'#dfe5e8');
  arrow(1430,450,1430,330,'rgba(227,236,238,.6)',2);wt(1442,400,'旋轉方向',15,'rgba(227,236,238,.7)',600,'left');
  wt(1250,510,trf('槳距角 {n}°',{n:p.toFixed(0)}),22,'#f2c230',700,'center',COND);
  const R=[['轉子轉速',rpmOf(v)/RMAX,trf('{n} rpm',{n:rpmOf(v).toFixed(1)}),'#7dffc4'],['發電機轉矩',Math.min(1,tqOf(v)/100),trf('{n} %',{n:tqOf(v).toFixed(0)}),'#ff9d7a'],['槳距角',p/90,trf('{n}°',{n:p.toFixed(0)}),'#f2c230'],['輸出功率',pOf(v)/PW,trf('{p} MW',{p:pOf(v).toFixed(2)}),'#f2c230']];
  R.forEach(([n,f,s,c],i)=>{const y=560+i*58;wt(984,y+18,n,17,'rgba(227,236,238,.85)',600);box(1150,y+4,240,16,'rgba(255,255,255,.08)');box(1150,y+4,240*clamp(f,0,1),16,c);wt(1516,y+20,s,19,c,700,'right',COND);});
 }},

/* 4 ─────────────────────────────── 偏航對風 */
{t:'偏航：機艙跟著風轉',en:'Yawing into the wind',dur:14,
 d:'風向隨時在變，機艙要轉向對風，葉片才能完整吸收風能，也避免偏斜造成的額外負載。塔頂與機艙之間有一圈大型偏航軸承，外圍的齒環由數組偏航馬達驅動。控制器不會因風向小幅擺動就立即轉動，而是在偏航誤差持續超過設定值（示例約 8°）一段時間後才啟動，以每秒約半度的速度慢慢轉正，到位後由偏航剎車夾緊固定。機艙內的電纜向下垂入塔架，累計轉了幾圈後，風機會在低風時反向轉回解纜。',
 s:[[0,'風向改變，機艙與風向出現偏航誤差'],[.22,'誤差持續超過設定值，才決定轉動'],[.46,'偏航馬達帶動機艙，慢慢轉正'],[.8,'到位後偏航剎車夾緊固定']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'俯視：機艙與風向（示意）',20,'#f2c230',700);
  const phi=25*ease(seg(u,.08,.16)),th=25*ease(seg(u,.46,.82)),err=phi-th,cx=410,cy=530;
  ctx.save();ctx.beginPath();ctx.rect(62,270,696,528);ctx.clip();
  const dx=Math.cos(phi*DEG),dy=Math.sin(phi*DEG),r=rng(4);
  for(let i=0;i<13;i++){const o=-300+i*50,s=((TT*110+r()*700)%700)-350,x=cx+dx*s-dy*o,y=cy+dy*s+dx*o;alphaDo(.55,()=>arrow(x,y,x+dx*50,y+dy*50,'#7dc8dc',2.5));}
  ctx.restore();
  circ(cx,cy,22,'#9aa3a8','#394650',1.5);
  ctx.save();ctx.translate(cx,cy);ctx.rotate(th*DEG);
  rrp(-70,-28,210,56,6);ctx.fillStyle='#e3e8ec';ctx.fill();ctx.strokeStyle='#394650';ctx.lineWidth=1.5;ctx.stroke();
  box(40,-20,60,40,'#58b8d0','rgba(0,0,0,.4)',1);
  poly([-70,-22,-96,-12,-100,0,-96,12,-70,22],'#dfe5e8','#394650',1.5);
  poly([-92,-12,-84,-12,-88,-220,-94,-220],'#f4f6f7','#394650',1.2);poly([-92,12,-84,12,-88,220,-94,220],'#f4f6f7','#394650',1.2);
  ctx.setLineDash([8,6]);ln([-110,0,-330,0],'#f2c230',2);ctx.setLineDash([]);
  ctx.restore();
  /* 誤差角 */
  ctx.setLineDash([8,6]);ln([cx-dx*110,cy-dy*110,cx-dx*330,cy-dy*330],'#7dc8dc',2);ctx.setLineDash([]);
  if(Math.abs(err)>.5){ctx.beginPath();ctx.arc(cx,cy,300,Math.PI+th*DEG,Math.PI+phi*DEG);ctx.strokeStyle='#e8572a';ctx.lineWidth=4;ctx.stroke();}
  const ec=Math.abs(err)>8?'#ff9d7a':'#7dffc4';
  wt(84,254,trf('風向 {n}°',{n:phi.toFixed(0)}),20,'#7dc8dc',700,'left',COND);wt(290,254,trf('機艙 {n}°',{n:th.toFixed(0)}),20,'#f2c230',700,'left',COND);wt(496,254,trf('偏航誤差 {n}°',{n:err.toFixed(0)}),20,ec,700,'left',COND);
  const st=u<.1?['已對準風向','#7dffc4']:u<.46?['誤差 > 8°：持續觀察中','#ff9d7a']:u<.82?['偏航馬達啟動（畫面加速）','#f2c230']:['到位，偏航剎車夾緊','#7dffc4'];
  tag(410,768,st[0],{size:17,bg:st[1],align:'center'});
  /* 右：偏航系統 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'偏航系統（示意）',20,'#f2c230',700);
  const gx=1170,gy=420,GR=140,moving=u>=.46&&u<.82;
  alphaDo(.5,()=>{circ(gx,gy,GR+42,'rgba(242,194,48,.08)','rgba(242,194,48,.5)',1.5);});
  gear(gx,gy,GR,72,0,'#6f7a80');circ(gx,gy,GR-26,'#16384c','#394650',1.5);
  wt(gx,gy-6,'偏航齒環',18,'#fff',700,'center');wt(gx,gy+20,'固定在塔頂',15,'rgba(227,236,238,.75)',600,'center');
  for(let i=0;i<6;i++){const a=th*DEG*2+i*TAU/6+.26,R2=GR+17,px=gx+Math.cos(a)*R2,py=gy+Math.sin(a)*R2;gear(px,py,13,12,-th*DEG*2*GR/13,moving?'#f2c230':'#9aa3a8');}
  for(let i=0;i<4;i++){const a=th*DEG*2+i*TAU/4+.78,px=gx+Math.cos(a)*(GR+4),py=gy+Math.sin(a)*(GR+4);ctx.save();ctx.translate(px,py);ctx.rotate(a);box(-7,-9,14,18,moving?'#6f7a80':'#e8572a','#13232e',1);ctx.restore();}
  alphaDo(seg(u,.46,.52),()=>tag(gx+230,gy-150,'偏航馬達 × 6',{size:16,bg:'#f2c230',align:'center'}));
  alphaDo(seg(u,.2,.26),()=>tag(gx-230,gy-150,'偏航剎車',{size:16,bg:'#e8572a',align:'center'}));
  const RW=[['觸發','誤差持續超過約 8° 才轉（示例）',.24],['速度','約每秒 0.5°，到位後剎車夾緊（示例）',.5],['解纜','電纜累計扭轉數圈後反向轉回',.84]];
  RW.forEach(([h,s,t],i)=>alphaDo(seg(u,t,t+.06),()=>{const y=630+i*52;box(830,y,680,44,'rgba(255,255,255,.04)','rgba(255,255,255,.14)',1);wt(850,y+29,h,17,'#7dffc4',800);wt(930,y+29,s,17,'#fff',600);}));
 }},

/* 5 ─────────────────────────────── 切出與颱風 */
{t:'切出風速與颱風停機',en:'Cut-out and typhoon shutdown',dur:14,side:true,
 d:'風太大時，風機的任務從發電變成自保。10 分鐘平均風速超過切出風速（典型 25 m/s），或陣風超過設定值時，控制器讓三支葉片順槳到約 90°，轉子減速後進入慢速空轉，而不是用機械剎車硬鎖，以減少葉片與塔架的受力。颱風期間電網可能斷電，備用電源讓偏航系統持續把機艙對準風向，避免側風吹在整支葉片上。IEC 61400-1 第 4 版新增 T 級（颱風級），參考風速為 57 m/s，台灣選用機型時需一併評估。',
 s:[[0,'颱風接近，風速一路升高'],[.28,'超過切出風速 25 m/s：順槳停機'],[.5,'葉片順槳，轉子慢慢空轉，不硬鎖'],[.72,'備用電源讓機艙持續對準風向']],
 cam:u=>({x:700,y:420,s:1.02}),
 draw(u){
  const w=lerp(14,42,seg(u,.02,.72)),storm=seg(u,0,.5);
  box(VX0-20,-600,VX1-VX0+40,2000,`rgba(22,32,42,${(.2+.4*storm).toFixed(3)})`);
  rain(.3+.7*storm);
  windLines(80,580,20+Math.round(20*storm),300+400*storm,1,7,90,'#dfe8ee');
  const K=[[4.1,RMAX],[7,1.2]],t=u*14,cut=u>=.29;
  const p=cut?lerp(pitchOf(VCO),90,ease(seg(u,.29,.45))):pitchOf(w);
  [[260,0],[340,1],[1010,2],[1100,3],[1460,4]].forEach(([x,i])=>tree(x,6+22*storm+5*Math.sin(TT*3+i)));
  turbineSide(rotAt(t,K),1,p);baseCab();
  lab(TX-100,HY-100,trf('葉片順槳 {n}°',{n:p.toFixed(0)}),{dx:170,dy:-40,st:'s',a:band(u,.3,.62)});
  lab(TX-100,HY,'轉子空轉（不鎖死）',{dx:-150,dy:80,st:'g',a:band(u,.5,.74)});
  lab(TX+71,gyy(TX)-46,'備用電源',{dx:100,dy:-70,st:'s',a:band(u,.72,1)});
  lab(TX,HY+40,'偏航持續對風',{dx:120,dy:70,st:'g',a:band(u,.74,1)});
  lab(1100,gyy(1100)-120,'陣風與強降雨',{dx:0,dy:-90,st:'w',a:band(u,.06,.28)});
 },
 hud(u){hudPanel(250,182,'颱風停機（示例）',seg(u,.03,.08),w=>{const v=lerp(14,42,seg(u,.02,.72)),t=u*14,cut=u>=.29,r=rpmAt(t,[[4.1,RMAX],[7,1.2]]);
  const p=cut?lerp(pitchOf(VCO),90,ease(seg(u,.29,.45))):pitchOf(v);
  hrow(56,'平均風速',trf('{n} m/s',{n:v.toFixed(1)}),w,v>VCO?'#ff9d7a':'#fff');
  hrow(88,'運轉狀態',!cut?'額定發電':u<.45?'順槳停機中':'颱風空轉',w,!cut?'#7dffc4':'#ff9d7a');
  hrow(120,'轉子轉速',trf('{n} rpm',{n:r.toFixed(1)}),w,'#7dffc4');hrow(152,'槳距角',trf('{n}°',{n:p.toFixed(0)}),w,'#f2c230');});}},

/* 6 ─────────────────────────────── 剎車與安全鏈 */
{t:'兩套剎車與安全鏈',en:'Two brakes and a safety chain',dur:13,side:true,
 d:'風機至少有兩套能獨立讓轉子停下來的剎車。主要的是氣動剎車：三支葉片各有獨立的變槳驅動與備用電池或蓄壓器，即使失去電力也能順槳，通常單支葉片順槳就足以讓轉子減速。機械碟剎裝在高速軸上，主要在轉子已經變慢後把它完全停住，或作為停車剎車。維修人員進入輪轂前，還要插上轉子鎖定銷。超速、過度振動或按下緊急停止按鈕時，獨立於控制器的安全鏈會直接觸發停機。',
 s:[[0,'停機時，先用葉片變槳減速'],[.3,'每支葉片都有備用電源，斷電也能順槳'],[.5,'轉子變慢後，高速軸碟剎把它完全停住'],[.75,'進入輪轂維修前，插上轉子鎖定銷']],
 cam:u=>camMix({x:TX,y:HY,s:1.6},{x:615,y:205,s:2.3},ease(seg(u,.02,.2))),
 draw(u){
  windLines(100,500,16,240,.8,9,60);
  const K=[[.9,RMAX],[5.5,2],[7,.8],[7.6,0]],t=u*13,p=90*ease(seg(u,.07,.42));
  turbineSide(rotAt(t,K),0,p);
  /* 碟剎卡鉗 */
  const k=ease(seg(u,.5,.56)),d=lerp(5,0,k);
  box(TX+81-d,HY-26,8,14,'#394650');box(TX+97+d,HY-26,8,14,'#394650');box(TX+81-d,HY-32,24+2*d,6,'#6f7a80');
  if(k>0)alphaDo(k*(.5+.3*Math.sin(TT*8)),()=>circ(TX+93,HY-18,14,'rgba(232,87,42,.35)'));
  /* 轉子鎖定銷 */
  const lk=ease(seg(u,.76,.84));box(TX-78,HY-22,6,44,'#8d989f','rgba(0,0,0,.4)',1);
  box(TX-80,lerp(HY-62,HY-30,lk),10,22,'#f2c230','#13232e',1);
  lab(TX-100,HY-120,'三支葉片各自變槳',{dx:-60,dy:-40,st:'s',a:band(u,.04,.3)});
  lab(TX-106,HY,'備用電池／蓄壓器',{dx:-60,dy:80,st:'g',a:band(u,.3,.5)});
  lab(TX+93,HY-30,'高速軸碟剎',{dx:40,dy:-80,st:'w',a:band(u,.5,.74)});
  lab(TX-75,HY-40,'轉子鎖定銷',{dx:-30,dy:-90,st:'s',a:band(u,.76,1)});
 },
 hud(u){hudPanel(250,182,'停機程序（示例）',seg(u,.04,.09),w=>{const t=u*13,r=rpmAt(t,[[.9,RMAX],[5.5,2],[7,.8],[7.6,0]]),p=90*ease(seg(u,.07,.42));
  hrow(56,'轉子轉速',trf('{n} rpm',{n:r.toFixed(1)}),w,'#7dffc4');hrow(88,'槳距角',trf('{n}°',{n:p.toFixed(0)}),w,'#f2c230');
  hrow(120,'碟剎',u<.52?'鬆開':'夾緊',w,u<.52?'#fff':'#ff9d7a');hrow(152,'鎖定銷',u<.8?'未插入':'已插入',w,u<.8?'#fff':'#f2c230');});}}
]};
