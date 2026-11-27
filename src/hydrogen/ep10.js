// KITS: land
/* 氫能系列 第 10 集：固態氧化物電解（SOEC）與高溫電解 */
const g10=x=>groundY(x);
const H2C10='#7dffc4',STC10='#ff8a60',ELC10='#f2c230',O2C10='#58b8d0';
function dots10(P,n,col,sp,r){const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));const T=L[L.length-1];
  for(let k=0;k<n;k++){const d=((((TT*sp)+k/n)%1)+1)%1*T;let i=1;while(i<L.length-1&&L[i]<d)i++;const f=(d-L[i-1])/(L[i]-L[i-1]);circ(lerp(P[i-1][0],P[i][0],f),lerp(P[i-1][1],P[i][1],f),r||5,col);}}
function pipe10(P,col,w){const a=[];P.forEach(p=>a.push(p[0],p[1]));ln(a,'#5c6770',w+6);ln(a,col||'#8a949a',w);}
/* 工廠（餘熱蒸汽來源） */
function factory10(x,y){box(x,y-150,230,150,'#b9c2c7','rgba(0,0,0,.3)',2);poly([x,y-150,x+60,y-190,x+60,y-150,x+120,y-190,x+120,y-150,x+180,y-190,x+180,y-150],'#9aa6ad','rgba(0,0,0,.3)',2);
  box(x+190,y-270,26,120,'#8a949a','rgba(0,0,0,.3)',2);for(let i=0;i<4;i++)box(x+18+i*42,y-110,26,30,'rgba(40,60,70,.55)');box(x+90,y-60,50,60,'#6a747a');
  for(let k=0;k<4;k++){const p=(TT*.25+k/4)%1;alphaDo(.5*(1-p),()=>circ(x+203+p*40,y-280-p*90,14+p*26,'rgba(255,255,255,.9)'));}}
/* SOEC 模組貨櫃：熱盒內的電堆會發橘光；mode 0 電解、1 燃料電池 */
function soec10(x,y,w,h,heat){box(x,y-h,w,h,'#dfe5e8','rgba(0,0,0,.3)',2);for(let i=1;i<6;i++)ln([x+i*w/6,y-h+6,x+i*w/6,y-6],'rgba(0,0,0,.12)',2);
  const wx=x+w*.18,ww=w*.64,wy=y-h*.78,wh=h*.56;box(wx,wy,ww,wh,'#2a1a14','rgba(0,0,0,.5)',2);
  const k=clamp(heat,0,1),gl=ctx.createLinearGradient(0,wy,0,wy+wh);gl.addColorStop(0,`rgba(255,${(150-60*k)|0},60,${.25+.6*k})`);gl.addColorStop(1,`rgba(232,87,42,${.2+.5*k})`);ctx.fillStyle=gl;ctx.fillRect(wx+4,wy+4,ww-8,wh-8);
  const n=4;for(let i=0;i<n;i++){const sx=wx+14+i*(ww-28)/n;for(let j=0;j<7;j++)box(sx,wy+10+j*(wh-20)/7,(ww-28)/n-12,(wh-20)/7-4,j%2?'#c9b48a':'#e8e2d0');}}
function tank10(x,y,w,h,fill){rrp(x,y-h,w,h,h/2);ctx.fillStyle='#eef2f3';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=2;ctx.stroke();
  if(fill!==undefined){box(x+20,y-h/2-6,w-40,12,'rgba(0,0,0,.15)');box(x+20,y-h/2-6,(w-40)*clamp(fill,0,1),12,H2C10);}
  box(x+20,y-8,14,8,'#8a949a');box(x+w-34,y-8,14,8,'#8a949a');}
function trafo10(x,y){box(x,y-80,90,80,'#8a949a','rgba(0,0,0,.35)',2);for(let i=0;i<5;i++)box(x+8+i*16,y-74,8,60,'#6a747a');for(const dx of [20,45,70])box(x+dx-4,y-112,8,32,'#c8b48a');}
function pylon10(x,y){ctx.strokeStyle='#5c6770';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-30,y);ctx.lineTo(x-6,y-220);ctx.lineTo(x+6,y-220);ctx.lineTo(x+30,y);ctx.moveTo(x-40,y-180);ctx.lineTo(x+40,y-180);ctx.moveTo(x-34,y-140);ctx.lineTo(x+34,y-140);for(let k=0;k<5;k++){const a=y-k*44,b=y-(k+1)*44;ctx.moveTo(x-30+k*4.8,a);ctx.lineTo(x+30-(k+1)*4.8,b);}ctx.stroke();}
function house10(x,y,lit){box(x,y-90,120,90,'#d8cbb4','rgba(0,0,0,.3)',2);poly([x-10,y-90,x+60,y-140,x+130,y-90],'#a0574a','rgba(0,0,0,.3)',2);
  for(const dx of [16,72])box(x+dx,y-70,32,28,lit?'#ffd36b':'rgba(40,60,70,.55)');box(x+50,y-40,22,40,'#6a5240');}
/* 理論電壓：E_rev 與熱中性電壓 E_tn（°C） */
const Erev10=T=>T<100?1.229-.00045*(T-25):1.17-.000278*(T-100);
const Etn10=T=>T<100?1.48:1.254+.000038*(T-100);
const ttemp10=u=>lerp(650,750,ease(seg(u,.04,.34)));
const EP={no:10,slug:'hydrogen',seriesName:'氫能系列',t:'固態氧化物電解（SOEC）與高溫電解',en:'Solid oxide electrolysis: making hydrogen hot',
lede:'把水加熱成 700–850 °C 的水蒸氣再電解，拆開水分子所需的能量有一部分可以改由熱能提供，每公斤氫的耗電因此比鹼性與 PEM 電解少。這一集看高溫電解的熱力學、陶瓷電池片如何傳導氧離子、耗電與效率比較、同一套電堆可逆發電，以及陶瓷電堆的劣化與熱循環問題。',
facts:[['700–850','°C','SOEC 典型運轉溫度，以水蒸氣為原料'],['1.29','V','水蒸氣電解的熱中性電壓；液態水電解為 1.48 V'],['37–40','kWh/kg','SOEC 系統每公斤氫的耗電（另需蒸汽熱能）；鹼性與 PEM 約 50–55'],['84','%','德國 GrInHy 計畫的 SOEC 電解效率（LHV），鹼性或 PEM 約 60%'],['0.5','%/1000 h','歐盟 2030 年 SOEC 電堆劣化率目標'],['500','MW/年','Topsoe 於 2025 年在丹麥 Herning 啟用的 SOEC 電堆工廠年產能']],
note:'說明：本集為教育用途示意動畫，電池片結構、貨櫃配置與曲線經過簡化。理論電壓曲線依水的生成焓與吉布斯自由能估算（25 °C 液態水 ΔH 約 285.8 kJ/mol、ΔG 約 237 kJ/mol；900 °C 水蒸氣 ΔG 約 183 kJ/mol），1.29 V 與 1.48 V 熱中性電壓引自德國 DLR 論文。SOEC 系統耗電 37.5 kWh/kg 為 Bloom Energy 公布的試運轉數據，鹼性與 PEM 50–55 kWh/kg 為業者與分析文章常見範圍；84% 電解效率與 30 kW 燃料電池模式效率大於 45%（LHV）引自歐盟 GrInHy 計畫資料，來回效率約四成為據此估算。歐盟 2030 年劣化率目標 0.5%/1000 h、早期電池片約 1.5–1.9%/1000 h 引自研究與產業報導；Topsoe Herning 工廠於 2025 年 10 月啟用、年產能 500 MW 引自歐洲氫能組織與產業媒體。廠區配置、1 MW 模組、產氫量、蒸汽熱能約 8 kWh/kg、升溫速率與電壓劣化曲線為典型範例。台灣目前未查得商轉中的 SOEC 製氫案場，相關研究以學研單位與企業測試平台為主。',
base:()=>{landSky(GY,{sun:{x:760,y:110},clouds:true});drawGround();},
shots:[
{t:'用熱幫忙的電解',en:'Electrolysis with a heat assist',dur:13,side:true,
 d:'固態氧化物電解（SOEC）是在 700 到 850 °C 下電解水蒸氣。高溫讓水分子比較容易被拆開，所需的一部分能量可以由熱能提供，電力需求因此下降。理想的場址旁邊有現成的熱源，例如煉鋼廠、化工廠的餘熱蒸汽，或地熱與核能。畫面中的模組以 1 MW 為例，電堆先升溫到運轉溫度，再通入蒸汽與電力，每小時約產出 25 公斤氫，送進儲槽供工廠使用。',
 s:[[0,'工業區旁的高溫電解模組，接上工廠餘熱蒸汽'],[.25,'電堆在 700–850 °C 運轉，水以蒸汽形式進入'],[.52,'電力加上熱能，一起把水分子拆開'],[.76,'產出的氫氣送往儲槽，供工廠使用']],
 draw(u){
  const gF=g10(80),gS=g10(700),gT=g10(1090);
  factory10(70,gF);
  pipe10([[300,gF-60],[540,gF-60]],'#c97a5a',8);
  soec10(540,gS,320,150,seg(u,.04,.34));
  pipe10([[860,gS-40],[1000,gS-40]],'#9ec9b6',6);
  tank10(1000,gT,180,86,.15+.6*seg(u,.4,1));
  trafo10(1240,g10(1240));pylon10(1450,g10(1450));
  ctx.strokeStyle='rgba(40,48,54,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(1286,g10(1240)-112);ctx.quadraticCurveTo(1370,g10(1370)-170,1444,g10(1450)-218);ctx.moveTo(1456,g10(1450)-218);ctx.quadraticCurveTo(1540,g10(1520)-190,1610,g10(1600)-200);ctx.stroke();
  ln([1250,g10(1240)-80,1250,gS-190,820,gS-190,820,gS-150],'#e8572a',3);
  const on=seg(u,.3,.36);
  if(on>0){alphaDo(on,()=>{dots10([[300,gF-60],[540,gF-60]],6,STC10,.5,5);dots10([[1250,g10(1240)-80],[1250,gS-190],[820,gS-190],[820,gS-150]],7,ELC10,.45,4);});}
  alphaDo(seg(u,.5,.56),()=>dots10([[860,gS-40],[1000,gS-40]],4,H2C10,.6,5));
 },
 fx(u){const gF=g10(80),gS=g10(700);
  lab(420,gF-60,'工廠餘熱蒸汽',{dx:0,dy:-120,st:'w',a:band(u,.04,.45)});
  lab(700,gS-120,'SOEC 電解模組',{dx:0,dy:-150,st:'s',a:band(u,.2,.62)});
  lab(1000,gS-190,'再生電力',{dx:0,dy:-90,st:'n',a:band(u,.45,.8)});
  lab(1090,g10(1090)-86,'氫氣儲槽',{dx:60,dy:-110,st:'g',a:band(u,.7,.98)});},
 hud(u){hudPanel(300,180,'高溫電解模組',seg(u,.03,.08),w=>{const T=ttemp10(u),hk=seg(u,.36,.5);
  hrow(46,'電堆溫度',trf('{n} °C',{n:Math.round(T)}),w,'#ff8a60');hbar(16,58,w-32,(T-600)/200,'#ff8a60');
  hrow(96,'電力',trf('{n} MW',{n:(hk*1).toFixed(1)}),w,'#f2c230');
  hrow(130,'產氫',trf('{n} kg/h',{n:Math.round(25*hk)}),w,'#7dffc4');
  htext(16,166,u<.36?'升溫中':'運轉中：蒸汽 + 電力',14,'rgba(227,236,238,.75)',600);});}},

{t:'熱能取代部分電能',en:'Heat replaces part of the electricity',dur:14,
 d:'拆開一莫耳水需要的總能量是反應焓 ΔH，其中必須用電提供的是吉布斯自由能 ΔG，其餘的 TΔS 可以用熱提供。溫度越高，ΔG 越小：理論電解電壓從 25 °C 的 1.23 V，降到 800 °C 約 0.98 V。另一條線是熱中性電壓，電池在這個電壓運轉時，內阻產生的熱剛好補足反應吸收的熱；液態水約 1.48 V，水蒸氣約 1.29 V。SOEC 通常在 1.29 V 附近運轉，水在進入電堆前已經用外部熱能汽化，這就是它省電的來源。',
 s:[[0,'總能量 ΔH = 電能 ΔG + 熱能 TΔS'],[.28,'溫度越高，必須用電的部分越少'],[.55,'800 °C 時，理論電壓約 0.98 V'],[.78,'熱中性電壓 1.29 V：內阻發熱剛好補足反應吸熱']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,880,650,{title:'電解的理論電壓與溫度',x0:0,x1:1000,y0:.8,y1:1.6,xt:[0,200,400,600,800,1000],yt:[.8,1,1.2,1.4,1.6],xl:'溫度（°C）',yl:'電壓（V）',pl:84,pt:70,pb:64,gx:5,gy:4});
  const t=lerp(25,1000,seg(u,.05,.5));
  const curve=(fn,col,lw,a)=>{ctx.beginPath();let f=1;for(let T=25;T<=t;T+=5){const X=c.X(T),Y=c.Y(fn(T));if(f){ctx.moveTo(X,Y);f=0;}else if(T>=100&&T<105&&fn===Etn10){ctx.lineTo(X,c.Y(Etn10(99)));ctx.lineTo(X,Y);}else ctx.lineTo(X,Y);}ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke();};
  alphaDo(seg(u,.3,.4),()=>{ctx.fillStyle='rgba(255,138,96,.18)';ctx.beginPath();ctx.moveTo(c.X(100),c.Y(Etn10(100)));for(let T=100;T<=1000;T+=10)ctx.lineTo(c.X(T),c.Y(Etn10(T)));for(let T=1000;T>=100;T-=10)ctx.lineTo(c.X(T),c.Y(Erev10(T)));ctx.fill();
   ctx.fillStyle='rgba(88,184,208,.16)';ctx.beginPath();ctx.moveTo(c.X(100),c.Y(.8));for(let T=100;T<=1000;T+=10)ctx.lineTo(c.X(T),c.Y(Erev10(T)));ctx.lineTo(c.X(1000),c.Y(.8));ctx.fill();
   wt(c.X(560),c.Y(1.17),'熱能 TΔS',20,'#ff8a60',700,'center');wt(c.X(560),c.Y(.88),'電能 ΔG',20,'#7dc8dc',700,'center');});
  curve(Etn10,'#ff8a60',3.5);curve(Erev10,'#58b8d0',4);
  alphaDo(seg(u,.12,.2),()=>{wt(c.X(40),c.Y(1.48)-12,'液態水 1.48 V',17,'#ff8a60',700);wt(c.X(140),c.Y(1.229)-4,'1.23 V',18,'#7dc8dc',700,'left',COND);});
  alphaDo(seg(u,.55,.62),()=>{ln([c.X(800),c.Y(.8),c.X(800),c.Y(1.6)],'rgba(255,255,255,.35)',1.5);circ(c.X(800),c.Y(Erev10(800)),8,'#58b8d0','#13232e',2);circ(c.X(800),c.Y(Etn10(800)),8,'#ff8a60','#13232e',2);
   wt(c.X(800)-12,c.Y(Erev10(800))-14,'0.98 V',20,'#fff',700,'right',COND);wt(c.X(800)-12,c.Y(Etn10(800))-14,'1.29 V',20,'#fff',700,'right',COND);});
  card(980,150,560,190,{bg:'rgba(7,27,39,.78)'});wt(1010,198,'水的分解',21,'#f2c230',700);wt(1260,262,'ΔH = ΔG + TΔS',40,'#fff',700,'center',COND);wt(1010,316,'總能量 = 電能 + 熱能',18,'rgba(227,236,238,.85)',600);
  alphaDo(seg(u,.28,.36),()=>{card(980,365,560,190,{bg:'rgba(7,27,39,.78)'});wt(1010,412,'理論電壓',21,'#f2c230',700);
   wt(1010,462,'25 °C 液態水',18,'#fff',600);wt(1510,462,'1.23 V',26,'#fff',700,'right',COND);wt(1010,512,'800 °C 水蒸氣',18,'#fff',600);wt(1510,512,'0.98 V',26,'#7dffc4',700,'right',COND);});
  alphaDo(seg(u,.78,.86),()=>{card(980,580,560,220,{bg:'rgba(7,27,39,.78)',st:'#ff8a60'});wt(1010,628,'熱中性電壓',21,'#ff8a60',700);
   wt(1010,676,'液態水 1.48 V',18,'#fff',600);wt(1260,676,'→',18,'#fff',700,'center');wt(1300,676,'水蒸氣 1.29 V',18,'#7dffc4',600);
   wt(1010,724,'內阻發熱 = 反應吸熱',18,'rgba(227,236,238,.85)',600);wt(1010,766,'汽化熱改由外部熱源提供',18,'rgba(227,236,238,.85)',600);});
 }},

{t:'剖開陶瓷電池片',en:'Inside a ceramic cell',dur:14,
 d:'SOEC 電池片由三層陶瓷組成。水蒸氣進入燃料極，通常是鎳與氧化釔安定氧化鋯（Ni-YSZ）的多孔材料，在這裡得到電子，分解成氫氣與氧離子。中間的電解質是緻密的氧化鋯（YSZ），只讓氧離子通過，而且要在高溫下才有足夠的離子導電度，這是 SOEC 必須在 700 °C 以上運轉的原因。氧離子到達空氣極後放出電子，結合成氧氣排出。許多電池片與金屬連接板疊成電堆，裝在保溫的熱盒裡。',
 s:[[0,'水蒸氣進入多孔的燃料極'],[.25,'得到電子，分解成氫氣與氧離子'],[.5,'氧離子穿過緻密的氧化鋯電解質'],[.75,'電池片與連接板疊成電堆，裝進高溫熱盒']],
 draw(u){
  diagBG();
  card(60,150,860,650,{bg:'rgba(7,27,39,.75)'});wt(90,196,'電池片剖面（電解模式）',21,'#f2c230',700);
  const X0=110,X1=870,hl=u<.25?1:u<.5?2:u<.75?3:0;
  box(X0,222,X1-X0,16,'#8a949a');box(X0,592,X1-X0,16,'#8a949a');
  box(X0,238,X1-X0,92,'rgba(255,138,96,.08)');box(X0,500,X1-X0,92,'rgba(88,184,208,.08)');
  box(X0,330,X1-X0,70,'#4b5359',hl===1||hl===2?'#f2c230':'rgba(0,0,0,.4)',hl===1||hl===2?3:1.5);
  box(X0,400,X1-X0,30,'#e8e2d0',hl===3?'#f2c230':'rgba(0,0,0,.4)',hl===3?3:1.5);
  box(X0,430,X1-X0,70,'#3d4a6a','rgba(0,0,0,.4)',1.5);
  const r=rng(10);for(let i=0;i<70;i++){circ(X0+8+r()*(X1-X0-16),336+r()*58,3+r()*3,'rgba(255,255,255,.18)');circ(X0+8+r()*(X1-X0-16),436+r()*58,3+r()*3,'rgba(255,255,255,.14)');}
  wt(X0+12,360,'燃料極 Ni-YSZ',17,'#fff',700);wt(X0+12,421,'電解質 YSZ',16,'#13232e',700);wt(X0+12,472,'空氣極 LSCF',17,'#fff',700);
  for(let k=0;k<5;k++){const p=((TT*.18+k/5)%1);const x=lerp(X0+20,X1-20,p),y=270+12*Math.sin(p*9+k);
   const mol=p<.5;if(mol){circ(x,y,11,'#ff8a60');circ(x+12,y-8,6,'#fff');circ(x-12,y-8,6,'#fff');}else{circ(x-7,y,8,'#7dffc4');circ(x+7,y,8,'#7dffc4');}}
  wt(X0+12,256,'H₂O',18,'#ff8a60',700,'left',COND);wt(X1-12,256,'H₂',18,'#7dffc4',700,'right',COND);
  alphaDo(seg(u,.25,.32),()=>{for(let k=0;k<6;k++){const p=((TT*.4+k/6)%1);const x=X0+90+k*120,y=lerp(340,560,p);circ(x,y,9,'#58b8d0');wt(x+14,y+5,'O²⁻',14,'#fff',700,'left',COND);}});
  alphaDo(seg(u,.5,.56),()=>{for(let k=0;k<3;k++){const p=((TT*.15+k/3)%1);const x=lerp(X0+40,X1-40,p);circ(x-7,548,8,'#7dc8dc');circ(x+7,548,8,'#7dc8dc');}wt(X1-12,580,'O₂',18,'#7dc8dc',700,'right',COND);});
  alphaDo(seg(u,.2,.28),()=>{card(90,630,800,150,{bg:'rgba(14,42,59,.9)'});
   wt(120,680,'燃料極：H₂O + 2e⁻ → H₂ + O²⁻',22,'#fff',700,'left',COND);wt(120,736,'空氣極：O²⁻ → ½O₂ + 2e⁻',22,'#fff',700,'left',COND);});
  card(960,150,580,650,{bg:'rgba(7,27,39,.75)'});wt(990,196,'電堆與熱盒',21,'#f2c230',700);
  const a=seg(u,.72,.8),hb=ctx.createLinearGradient(0,240,0,640);hb.addColorStop(0,'rgba(255,138,96,.35)');hb.addColorStop(1,'rgba(232,87,42,.18)');
  alphaDo(.35+.65*a,()=>{rrp(1010,230,480,430,6);ctx.fillStyle=hb;ctx.fill();ctx.strokeStyle='#ff8a60';ctx.lineWidth=3;ctx.stroke();});
  for(let i=0;i<10;i++){const y=270+i*36;box(1110,y,280,10,'#8a949a');box(1110,y+10,280,20,i%2?'#c9b48a':'#e8e2d0');}box(1110,630,280,10,'#8a949a');
  alphaDo(seg(u,.75,.8),()=>{tag(1250,700,'700–850 °C',{size:22,bg:'#c0392b',fg:'#fff',align:'center'});});
  alphaDo(seg(u,.8,.86),()=>{wt(1250,760,'陶瓷電池片 + 金屬連接板',18,'#fff',600,'center');});
 }},

{t:'耗電比較',en:'Electricity use compared',dur:13,
 d:'比較每生產 1 公斤氫的耗電。鹼性與 PEM 電解在系統層級常見約 50 到 55 kWh；SOEC 業者公布的試運轉數據約 37.5 kWh，另外需要把水加熱成蒸汽的熱能。以氫的低位熱值 33.3 kWh/kg 計算，歐盟 GrInHy 計畫的 SOEC 電解效率達 84%，而鹼性或 PEM 約 60%。省下的電需要用熱來換，所以 SOEC 最適合有便宜蒸汽的地方，例如煉鋼、化工與合成燃料工廠。它的升溫與降溫都慢，較適合穩定運轉，不擅長快速追隨風光變化。',
 s:[[0,'每公斤氫的耗電：鹼性與 PEM 約 50–55 kWh'],[.3,'SOEC 約 37.5 kWh，另需蒸汽熱能'],[.55,'電解效率 84%，鹼性或 PEM 約 60%'],[.78,'適合有餘熱蒸汽、能穩定運轉的工廠']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,880,650,{title:'每公斤氫的能量需求（系統層級）',x0:0,x1:3,y0:0,y1:60,xt:[],yt:[0,20,40,60],yl:'kWh/kg',pl:84,pt:70,pb:64,gx:3,gy:3});
  const B=[['鹼性',52,0,'#58b8d0',.05],['PEM',52,0,'#58b8d0',.12],['SOEC',37.5,8,'#7dffc4',.3]];
  B.forEach((b,i)=>{const k=easeOut(seg(u,b[4],b[4]+.14)),x=c.X(i+.5),bw=130;
   box(x-bw/2,c.Y(b[1]*k),bw,c.Y(0)-c.Y(b[1]*k),b[3]);
   wt(x,c.Y(0)+36,b[0],22,'#fff',700,'center');
   alphaDo(k,()=>i<2?wt(x,c.Y(b[1])-12,'50–55',24,'#fff',700,'center',COND):wt(x,c.Y(b[1])+32,'37.5',24,'#13232e',700,'center',COND));
   if(b[2]){const kh=seg(u,.42,.5);box(x-bw/2,c.Y(b[1]+b[2]*kh),bw,c.Y(b[1])-c.Y(b[1]+b[2]*kh),'#ff8a60');alphaDo(kh,()=>wt(x+bw/2+10,c.Y(b[1]+4),'+ 蒸汽熱能',17,'#ff8a60',700));}});
  alphaDo(seg(u,.5,.56),()=>{ctx.setLineDash([8,6]);ln([c.X(0),c.Y(33.3),c.X(3),c.Y(33.3)],'#fff',2);ctx.setLineDash([]);tag(c.X(0)+12,c.Y(33.3)-16,'氫的低位熱值 33.3',{size:16,bg:'#0e2a3b',fg:'#7dffc4'});});
  alphaDo(seg(u,.55,.62),()=>{card(980,150,560,300,{bg:'rgba(7,27,39,.78)'});wt(1010,198,'電解效率（LHV）',21,'#f2c230',700);
   const k=seg(u,.57,.72);wt(1010,262,'SOEC',20,'#fff',700);box(1200,240,280*k*.84,30,'#7dffc4');wt(1210+280*k*.84,264,'84%',22,'#fff',700,'left',COND);
   wt(1010,332,'鹼性／PEM',20,'#fff',700);box(1200,310,280*k*.6,30,'#58b8d0');wt(1210+280*k*.6,334,'約 60%',22,'#fff',700,'left',COND);
   wt(1010,410,'GrInHy 計畫資料',15,'rgba(227,236,238,.6)',500);});
  alphaDo(seg(u,.78,.86),()=>{card(980,480,560,320,{bg:'rgba(7,27,39,.78)',st:'#7dffc4'});wt(1010,528,'適合的場址',21,'#7dffc4',700);
   ['煉鋼、化工廠的餘熱蒸汽','合成燃料、氨與甲醇工廠','地熱或核能的高溫蒸汽'].forEach((s,i)=>{circ(1022,580+i*50,6,'#7dffc4');wt(1040,587+i*50,s,18,'#fff',600);});
   wt(1010,760,'升降溫慢，宜穩定運轉',18,'#ff9d7a',700);});
 }},

{t:'可逆運轉：電解也能發電',en:'Reversible operation',dur:14,side:true,
 base:u=>{const n=seg(u,.42,.58);landSky(GY,{sun:{x:lerp(700,1300,seg(u,0,.5)),y:lerp(150,560,seg(u,.2,.55))},dusk:n,clouds:true});
  alphaDo(n*.6,()=>box(VX0,VY0,VX1-VX0,GY-VY0+20,'#0b1a2a'));
  alphaDo(n*.8,()=>{const r=rng(4);for(let i=0;i<40;i++)circ(r()*1600,40+r()*300,1.4,'#fff');});
  drawGround();alphaDo(n*.45,()=>box(VX0,GY-10,VX1-VX0,VY1-GY+30,'#0b1a2a'));},
 d:'固態氧化物電池可以反過來運轉：通入氫氣與空氣，它就成為固態氧化物燃料電池（SOFC），把氫變回電，這種雙向系統稱為可逆式固態氧化物電池（rSOC）。白天太陽光電過剩時電解產氫，晚上再用同一套電堆發電，省下另買一台燃料電池的成本。德國鋼廠的 GrInHy 示範系統電解時輸入 150 kW、發電時輸出 30 kW，燃料電池模式效率大於 45%。一來一回的來回效率約四成，比電池儲能低，但氫可以存放數天到數週。',
 s:[[0,'白天光電過剩，同一套電堆做電解產氫'],[.25,'氫氣存進儲槽，等待用電需求'],[.5,'入夜後切換為燃料電池，把氫變回電'],[.76,'一來一回效率約四成，但氫能存放數天以上']],
 draw(u){
  const night=u>.5;
  for(let i=0;i<4;i++){const x=80+i*110;solarPanel(x,g10(x),90,22);}
  soec10(600,g10(720),260,140,1);
  const fill=u<.5?lerp(.15,.85,seg(u,.05,.48)):lerp(.85,.45,seg(u,.55,.98));
  tank10(950,g10(1040),180,86,fill);
  house10(1250,g10(1310),night);house10(1420,g10(1480),night);
  ln([500,g10(500)-30,600,g10(600)-30],'#e8572a',3);
  pipe10([[860,g10(860)-40],[950,g10(950)-40]],'#9ec9b6',6);
  ln([860,g10(860)-110,1230,g10(860)-110,1230,g10(1310)-60,1250,g10(1310)-60],'#e8572a',3);
  if(u>.05&&u<.45){dots10([[500,g10(500)-30],[600,g10(600)-30]],3,ELC10,.6,4);dots10([[860,g10(860)-40],[950,g10(950)-40]],3,H2C10,.5,5);}
  if(u>.55&&u<.95){dots10([[950,g10(950)-40],[860,g10(860)-40]],3,H2C10,.5,5);dots10([[860,g10(860)-110],[1230,g10(860)-110],[1230,g10(1310)-60],[1250,g10(1310)-60]],6,ELC10,.5,4);}
 },
 fx(u){const y=g10(730)-140;
  alphaDo(band(u,.06,.46),()=>tag(730,y-40,'電解模式 SOEC',{size:20,bg:'#2d8f5a',fg:'#fff',align:'center'}));
  alphaDo(band(u,.56,.97),()=>tag(730,y-40,'燃料電池模式 SOFC',{size:20,bg:'#c0392b',fg:'#fff',align:'center'}));
  lab(260,g10(260)-40,'太陽光電',{dx:0,dy:-120,st:'s',a:band(u,.04,.4)});
  lab(1040,g10(1040)-86,'氫氣儲槽',{dx:0,dy:-110,st:'g',a:band(u,.25,.5)});
  lab(1370,g10(1370)-110,'夜間用電',{dx:0,dy:-90,st:'n',a:band(u,.6,.95)});},
 hud(u){hudPanel(300,170,'rSOC 運轉狀態',seg(u,.03,.08),w=>{const el=u<.5,run=el?seg(u,.05,.1)*(1-seg(u,.44,.48)):seg(u,.55,.6)*(1-seg(u,.94,.98));
  hrow(46,'模式',el?'電解':'發電',w,el?'#7dffc4':'#f2c230');
  hrow(86,'電力',el?trf('輸入 {n} kW',{n:Math.round(150*run)}):trf('輸出 {n} kW',{n:Math.round(30*run)}),w,'#f2c230');
  const fill=u<.5?lerp(.15,.85,seg(u,.05,.48)):lerp(.85,.45,seg(u,.55,.98));
  hrow(126,'儲槽',trf('{n}%',{n:Math.round(fill*100)}),w,'#7dffc4');hbar(16,140,w-32,fill,'#7dffc4');});}},

{t:'劣化與熱循環',en:'Degradation and thermal cycling',dur:14,
 d:'SOEC 的主要挑戰是壽命。在固定電流下，電池片的電壓會隨時間逐漸升高，代表耗電增加；原因包括燃料極的鎳顆粒在高溫下粗化、空氣極與電解質介面脫層，以及金屬連接板的鉻揮發毒化電極。早期研究的電池片劣化約每千小時 1.5% 到 2%，歐盟訂下 2030 年電堆每千小時 0.5% 的目標。陶瓷各層的熱膨脹係數不同，每次升降溫都可能累積應力與微裂紋，所以升溫要慢、盡量少停機，必要時以熱待機維持溫度。',
 s:[[0,'固定電流下，電池電壓隨時間逐漸升高'],[.3,'早期約每千小時 1.5–2%，歐盟目標 0.5%'],[.55,'鎳顆粒粗化、介面脫層、鉻毒化'],[.78,'熱膨脹不同，升降溫要慢、少停機']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,860,650,{title:'電池電壓隨運轉時間上升（典型範例）',x0:0,x1:20000,y0:1.2,y1:1.8,xt:[0,5000,10000,15000,20000],yt:[1.2,1.4,1.6,1.8],xl:'運轉時間（小時）',yl:'電壓（V）',pl:84,pt:70,pb:64,gx:4,gy:3});
  const t=lerp(0,20000,seg(u,.05,.5));
  const v1=h=>1.29*(1+.016*h/1000),v2=h=>1.29*(1+.005*h/1000);
  const dr=(fn,col,lw)=>{ctx.beginPath();for(let h=0;h<=t;h+=200){h===0?ctx.moveTo(c.X(h),c.Y(fn(h))):ctx.lineTo(c.X(h),c.Y(fn(h)));}ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke();};
  dr(v1,'#ff9d7a',4);alphaDo(seg(u,.3,.36),()=>dr(v2,'#7dffc4',4));
  alphaDo(seg(u,.2,.28),()=>wt(c.X(10500),c.Y(v1(10500))-20,'每千小時 1.6%',18,'#ff9d7a',700,'right'));
  alphaDo(seg(u,.36,.44),()=>wt(c.X(19500),c.Y(v2(19500))+34,'歐盟目標 0.5%',18,'#7dffc4',700,'right'));
  const items=[['鎳顆粒粗化','燃料極反應面積減少','#ff9d7a'],['介面脫層','氧氣累積使空氣極剝離','#ff9d7a'],['鉻毒化','連接板揮發的鉻沉積在電極','#ff9d7a']];
  items.forEach((a,i)=>alphaDo(seg(u,.55+i*.06,.61+i*.06),()=>{const y=150+i*128;card(960,y,580,112,{bg:'rgba(7,27,39,.78)'});box(960,y,6,112,a[2]);wt(990,y+46,a[0],22,a[2],700);wt(990,y+88,a[1],17,'#fff',600);}));
  alphaDo(seg(u,.78,.86),()=>{const y=540;card(960,y,580,260,{bg:'rgba(7,27,39,.78)',st:'#f2c230'});wt(990,y+46,'熱循環',22,'#f2c230',700);
   const bend=6*Math.sin(TT*2);ctx.save();ctx.beginPath();ctx.moveTo(1000,y+90);ctx.quadraticCurveTo(1150,y+90+bend,1300,y+90);ctx.lineTo(1300,y+108);ctx.quadraticCurveTo(1150,y+108+bend,1000,y+108);ctx.closePath();ctx.fillStyle='#4b5359';ctx.fill();
   ctx.beginPath();ctx.moveTo(1000,y+108);ctx.quadraticCurveTo(1150,y+108-bend,1300,y+108);ctx.lineTo(1300,y+120);ctx.quadraticCurveTo(1150,y+120-bend,1000,y+120);ctx.closePath();ctx.fillStyle='#e8e2d0';ctx.fill();ctx.restore();
   ln([1150,y+92,1158,y+104,1150,y+116],'#e8572a',2.5);wt(1320,y+112,'微裂紋',17,'#e8572a',700);
   wt(990,y+170,'各層熱膨脹係數不同',18,'#fff',600);wt(990,y+214,'緩慢升溫、少停機、熱待機',18,'#7dffc4',700);});
 }}
]};
