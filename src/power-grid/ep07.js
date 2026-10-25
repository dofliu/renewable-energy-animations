// KITS: land
/* 電網系列 第 7 集：配電網電壓與太陽光電反送 */
/* 電壓以額定值的百分比表示，低壓額定 220 V；饋線與負載曲線皆為典型範例 */
const FX=x=>x*(2-x);
const vAt=(x,a)=>101+a*FX(x);
const PCT=v=>v.toFixed(1)+'%';
const VOLT=v=>trf('{n} V',{n:Math.round(v*2.2)});
const VHI=105,VLO=95;
const hh7=h=>String(Math.floor(h)).padStart(2,'0')+':'+String(Math.floor((h%1)*60)).padStart(2,'0');
const pv7=h=>h<6||h>18?0:Math.pow(Math.sin(Math.PI*(h-6)/12),1.5);
const LK7=[[0,2.4],[6,2.6],[10,3.2],[13,3.4],[18,3.6],[20,3.6],[24,2.4]];
function ld7(h){for(let i=0;i<LK7.length-1;i++){const a=LK7[i],b=LK7[i+1];if(h<=b[0])return lerp(a[1],b[1],(h-a[0])/(b[0]-a[0]));}return 2.4;}
const vEnd=(h,s)=>101-ld7(h)*s+8*pv7(h);
/* Volt-Var 曲線：102% 以下不動作，到 105% 吸收 44% 額定視在功率 */
const QMAX=44;
function vvQ(v){return -QMAX*clamp((v-102)/3,0,1);}

function poleB(x,gy,h){ln([x,gy,x,gy-h],'#6b5a48',5);ln([x-24,gy-h+14,x+24,gy-h+14],'#6b5a48',4);return [x,gy-h+14];}
function houseB(x,gy,pv,sun){
  box(x,gy-62,96,62,'#e8e0d2','rgba(0,0,0,.3)',1);
  poly([x-8,gy-62,x+48,gy-104,x+104,gy-62],'#b5654a','rgba(0,0,0,.3)',1);
  box(x+14,gy-44,18,18,'#7aa8c4');box(x+40,gy-38,16,38,'#7a5a42');box(x+66,gy-44,18,18,'#7aa8c4');
  if(pv){poly([x+50,gy-101,x+99,gy-65,x+90,gy-59,x+43,gy-93],sun?'#2a58a0':'#1f3f66','#9fc3e6',1.2);if(sun)ln([x+58,gy-92,x+70,gy-83],'#fff',2);}
}
function subB(x,gy){
  fence(x-10,x+180,gy);
  box(x+14,gy-84,76,84,'#8d989f','rgba(0,0,0,.35)',1.4);
  for(let i=0;i<5;i++)ln([x+22+i*14,gy-80,x+22+i*14,gy-20],'rgba(0,0,0,.25)',2);
  ln([x+30,gy-84,x+30,gy-108],'#e3e8ec',4);ln([x+74,gy-84,x+74,gy-108],'#e3e8ec',4);
  box(x+108,gy-56,50,56,'#aeb8be','rgba(0,0,0,.35)',1.2);
  return [x+52,gy-110];
}
function bessD(x,gy,on){
  for(let i=0;i<2;i++){box(x+i*58,gy-62,50,62,'#e3e8ec','rgba(0,0,0,.35)',1.2);box(x+i*58+6,gy-52,38,6,on?'#7dffc4':'#7a8790');box(x+i*58+6,gy-40,38,6,on?'#7dffc4':'#7a8790');}
}
function ptAlong(P,t){const k=clamp(t,0,.9999)*(P.length-1),j=Math.floor(k);return [lerp(P[j][0],P[j+1][0],k-j),lerp(P[j][1],P[j+1][1],k-j)];}
function flowDots(P,dir,col,n,r,a){
  alphaDo(a,()=>{for(let i=0;i<n;i++){let t=(TT*.2*dir+i/n)%1;if(t<0)t+=1;const q=ptAlong(P,t);circ(q[0],q[1],r,col);}});
}
const GYS=600,POLE_X=[330,560,790,1020,1250,1480];
function feederScene(pvOn,sun){
  const gy=GYS,sp=subB(30,gy);
  const P=[sp,...POLE_X.map(x=>poleB(x,gy,150))];
  ln(P.flat(),'rgba(30,40,46,.85)',1.8);
  [400,630,860,1090,1320].forEach(x=>houseB(x,gy,pvOn,sun));
  return P;
}

const EP={no:7,slug:'power-grid',seriesName:'電網系列',t:'配電網電壓與太陽光電反送',en:'Distribution voltage and PV back-feed',
lede:'電流沿著配電線送到用戶時，電壓會一路慢慢下降；但屋頂光電在中午把電送回線路，電壓反而被推高，饋線末端最明顯。這一集看電壓為什麼會升高、一天與假日的電壓曲線、智慧變流器如何吸收無功功率壓住電壓，以及台電對併網電壓與容量的規定。',
facts:[['±3','%','發電設備造成的責任分界點電壓變動率，須在高低各 3% 以內（台電併聯技術要點 2009 年版）'],
['0.9','滯後～超前','太陽光電設備應具備功率因數 0.9 滯後至 0.9 超前的運轉能力（高壓系統以下）'],
['<100','瓩','發電設備總容量未滿 100 瓩，得併接低壓系統；100 瓩以上改接高壓以上系統'],
['5,000 / 10,000','瓩','11.4 kV 饋線與 22.8 kV 饋線可併接的最大躉售電力上限'],
['88–110','%','22.8 kV 以下併接者，電壓在額定值 88% 到 110% 之間應能持續運轉'],
['44','%','功率因數 0.9 時，逆變器最多可吸收約 44% 額定視在功率的無功（計算值）']],
note:'說明：本集為教育用途示意動畫，設備與饋線比例經過調整。併接電壓等級與容量上限（低壓未滿 100 瓩、11.4 kV 饋線 5,000 瓩、22.8 kV 饋線 10,000 瓩）、責任分界點電壓變動率高低各 3%、太陽光電功率因數 0.9 滯後至 0.9 超前、22.8 kV 以下 88% 至 110% 持續運轉，整理自台電「再生能源發電系統併聯技術要點」（2009 年版內容與公開轉載），後續修正版本的數值可能不同，正式依據請以台電現行公告為準。春節期間電壓偏高主因為負載偏低，引自台電對媒體的說明。饋線末端電壓曲線、電壓允許帶（示意 105% 與 95%）、一天與假日的電壓曲線、Volt-Var 曲線設定（102% 起動作、105% 吸收 44%）、分接頭與儲能降低的幅度皆為典型範例，並非台灣任何實際饋線的量測。44% 為 sin(arccos 0.9) 的計算值。',
base:()=>{landSky(GY,{sun:{x:1300,y:120},clouds:false});drawGround();},
shots:[
{t:'饋線末端的電壓',en:'Voltage at the end of the feeder',dur:14,side:true,
 d:'變電所把電壓降到配電等級後，經電線桿上的饋線送到一戶戶用戶。電流流過線路時，線路電阻會消耗一小部分電壓，所以離變電所越遠，電壓越低，饋線末端是全線電壓最低的地方。調度與電力公司會把變電所送出的電壓調得稍高，替沿線壓降預留空間。可是屋頂太陽光電出力時，電流會從用戶端反送回線路，原本向下的壓降變成向上的電壓抬升，末端電壓反而可能超過上限。這就是光電越裝越多之後，配電網必須重新面對的新問題。',
 s:[[0,'光電未發電時，電流從變電所流向用戶'],[.3,'離變電所越遠，電壓越低'],[.55,'中午屋頂光電發電，電流開始反向送回'],[.8,'末端電壓被抬高，甚至超過上限']],
 draw(u){
  const sunOn=u>.42,k=seg(u,.42,.6);
  const P=feederScene(true,sunOn);
  flowDots(P,1,'#f2c230',9,3.6,1-k);
  flowDots(P,-1,'#7dffc4',9,3.6,k);
  lab(130,GYS-110,'配電變電所',{dx:0,dy:-120,st:'s',a:band(u,.02,.4)});
  lab(1130,GYS-150,'饋線末端',{dx:-100,dy:-50,st:'w',a:band(u,.28,.5)});
  lab(1100,GYS-98,'屋頂光電',{dx:0,dy:-130,st:'g',a:band(u,.5,.9)});
 },
 hud(u){
  const v=lerp(97.5,105.5,ease(seg(u,.42,.82))),rev=u>.5;
  hudPanel(280,152,'饋線末端（示例）',seg(u,.05,.1),w=>{hrow(56,'電流方向',rev?'反送變電所':'流向用戶',w,rev?'#7dffc4':'#f2c230');hrow(88,'末端電壓',PCT(v),w,v>VHI?'#e8572a':'#fff');hrow(120,'換算電壓',VOLT(v),w,v>VHI?'#e8572a':'#fff');});}},

{t:'電壓為什麼會升高',en:'Why voltage rises',dur:14,
 d:'沿著饋線量電壓，可以畫出一條電壓分布曲線。假設變電所送出約 101% 額定電壓：只有用電時，電流向下游流，線路電阻造成壓降，末端約剩 97.5%。屋頂光電中午大量發電時，用戶端不再只吸收電力，還把多餘的有功功率往上游送，壓降反過來變成電壓抬升，末端被推到約 105.5%，超過示意的上限 105%。電壓變化量可以用簡化算式估計：與線路電阻、電抗和流過的功率成正比。饋線越長、電阻越大，影響就越明顯。',
 s:[[0,'變電所送出約 101% 額定電壓'],[.3,'只有用電時，電壓沿線下降到約 97.5%'],[.58,'光電反送，電壓沿線上升到約 105.5%'],[.82,'末端超過上限，需要處理']],
 draw(u){
  diagBG();
  const C=chartBox(60,150,960,650,{title:'饋線電壓分布（典型範例，額定電壓百分比）',x0:0,x1:4,y0:94,y1:108,xt:[0,1,2,3,4],yt:[94,96,98,100,102,104,106,108],xl:'距離變電所（km，示例）',pl:84,pt:60,pb:56,gx:4,gy:7});
  box(C.px,C.Y(VHI),C.pw,C.Y(VLO)-C.Y(VHI),'rgba(125,255,196,.08)');
  ctx.setLineDash([8,6]);ln([C.px,C.Y(VHI),C.px+C.pw,C.Y(VHI)],'rgba(232,87,42,.85)',1.6);ln([C.px,C.Y(VLO),C.px+C.pw,C.Y(VLO)],'rgba(232,87,42,.85)',1.6);ctx.setLineDash([]);
  wt(C.px+C.pw-10,C.Y(VHI)-10,'上限 105%（示意）',16,'#ff9d7a',700,'right');wt(C.px+C.pw-10,C.Y(VLO)+24,'下限 95%（示意）',16,'#ff9d7a',700,'right');
  const dr=(a,f,col)=>{if(f<=0)return;ctx.beginPath();for(let x=0;x<=4*f+1e-6;x+=.05)ctx.lineTo(C.X(x),C.Y(vAt(x/4,a)));ctx.strokeStyle=col;ctx.lineWidth=3.6;ctx.stroke();};
  dr(-3.5,ease(seg(u,.1,.42)),'#f2c230');dr(4.5,ease(seg(u,.44,.76)),'#7dffc4');
  circ(C.X(0),C.Y(101),6,'#fff');
  wt(C.px+16,C.py+34,'只有用電',17,'#f2c230',700);wt(C.px+16,C.py+60,'中午光電反送',17,'#7dffc4',700);
  alphaDo(seg(u,.36,.46),()=>tag(C.X(3.6),C.Y(97.5)+34,'末端 97.5%',{size:16,bg:'#f2c230',align:'center'}));
  alphaDo(seg(u,.72,.82),()=>tag(C.X(3.6),C.Y(105.5)-34,'末端 105.5%',{size:16,bg:'#e8572a',align:'center'}));
  const cx=1060;
  card(cx,150,480,300,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});wt(cx+24,192,'電壓變化的簡化算式',22,'#f2c230',700);
  wt(cx+24,252,'ΔV ≈ (R·P + X·Q) ÷ V',26,'#fff',700,'left',COND);
  ['P：沿線流動的有功功率','Q：無功功率','R、X：線路電阻與電抗'].forEach((t,i)=>{wt(cx+24,306+i*38,t,19,'rgba(227,236,238,.92)',500);});
  card(cx,470,480,330,{bg:'rgba(7,27,39,.75)',st:'#7dc8dc'});wt(cx+24,512,'電壓怎麼變',22,'#7dc8dc',700);
  alphaDo(seg(u,.3,.4),()=>['用電時電流向下游，電壓沿線下降','光電反送時方向反轉，電壓沿線上升','饋線越長、電阻越大，變化越明顯'].forEach((t,i)=>{circ(cx+34,566+i*58,3.5,'#7dc8dc');wt(cx+52,572+i*58,t,19,'rgba(227,236,238,.92)',500);}));
 }},

{t:'一天與假日的電壓曲線',en:'Voltage over a day and a holiday',dur:14,
 d:'把一天的饋線末端電壓畫出來，會看到兩個起伏。晚上光電不發電，用電高，電壓被往下拉；中午光電出力最大，電壓被往上推。平日中午用電比較多，能抵消一部分反送；假日與連假用電大幅下降，光電的反送幾乎沒有對手，電壓更容易飆高。示例曲線中，平日中午末端約 105.6%，剛好碰到上限；假日則升到約 107%，明顯超標。台電曾說明，春節期間電壓偏高的主因是用電負載偏低，所以調度會事先調降送出電壓，把電壓控制在標準範圍內。',
 s:[[0,'夜間光電不發電，電壓偏低'],[.3,'中午光電出力最大，電壓被推高'],[.6,'假日用電少，電壓升得更高'],[.85,'超過上限的時段，就是要處理的範圍']],
 draw(u){
  diagBG();
  const C=chartBox(60,150,960,650,{title:'饋線末端電壓（典型範例，額定電壓百分比）',x0:0,x1:24,y0:94,y1:108,xt:[0,4,8,12,16,20,24],yt:[94,96,98,100,102,104,106,108],xl:'時',pl:84,pt:60,pb:56,gx:6,gy:7});
  const th=24*ease(seg(u,.06,.9));
  ctx.setLineDash([8,6]);ln([C.px,C.Y(VHI),C.px+C.pw,C.Y(VHI)],'rgba(232,87,42,.85)',1.6);ctx.setLineDash([]);
  wt(C.px+C.pw-10,C.Y(VHI)-10,'上限 105%（示意）',16,'#ff9d7a',700,'right');
  const over=(s)=>{for(let h=0;h<th;h+=.25){const h2=Math.min(th,h+.25),a=vEnd(h,s),b=vEnd(h2,s);if(a>VHI||b>VHI){ctx.beginPath();ctx.moveTo(C.X(h),C.Y(VHI));ctx.lineTo(C.X(h),C.Y(Math.max(a,VHI)));ctx.lineTo(C.X(h2),C.Y(Math.max(b,VHI)));ctx.lineTo(C.X(h2),C.Y(VHI));ctx.closePath();ctx.fillStyle='rgba(232,87,42,.45)';ctx.fill();}}};
  over(1);over(.55);
  const dr=(s,col)=>{ctx.beginPath();for(let h=0;h<=th;h+=.25)ctx.lineTo(C.X(h),C.Y(vEnd(h,s)));if(th>0){ctx.strokeStyle=col;ctx.lineWidth=3.4;ctx.stroke();}};
  dr(1,'#f2c230');dr(.55,'#b37cff');
  const hc=Math.min(23.9,th);ln([C.X(hc),C.py,C.X(hc),C.py+C.ph],'rgba(255,255,255,.4)',1.4);
  wt(C.px+16,C.py+34,'平日',17,'#f2c230',700);wt(C.px+16,C.py+60,'假日（用電約 55%）',17,'#b37cff',700);
  alphaDo(seg(u,.3,.4)*(1-seg(u,.55,.62)),()=>tag(C.X(8.6),C.Y(107),'中午光電推高電壓',{size:16,bg:'#7dffc4',align:'center'}));
  alphaDo(seg(u,.62,.72),()=>tag(C.X(18.4),C.Y(106.4),'假日更高',{size:16,bg:'#b37cff',fg:'#13232e',align:'center'}));
  alphaDo(seg(u,.82,.9),()=>tag(C.X(19.2),C.Y(97.2)+34,'傍晚用電高，電壓最低',{size:16,bg:'#58b8d0',align:'center'}));
  const cx=1060,v1=vEnd(hc,1),v2=vEnd(hc,.55);
  card(cx,150,480,300,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});
  wt(cx+24,192,'此刻（示例）',22,'#f2c230',700);wt(cx+456,192,hh7(hc),30,'#fff',700,'right',COND);
  hrowW(cx+24,246,'平日',PCT(v1),432,v1>VHI?'#e8572a':'#f2c230');
  hrowW(cx+24,296,'假日',PCT(v2),432,v2>VHI?'#e8572a':'#b37cff');
  wt(cx+24,372,'上限（示意）',20,'rgba(227,236,238,.9)',600);wt(cx+456,378,'105%',32,'#ff9d7a',700,'right',COND);
  wt(cx+24,424,'換算 220 V 系統約 231 V',18,'rgba(227,236,238,.75)',500);
  card(cx,470,480,330,{bg:'rgba(7,27,39,.75)',st:'#7dc8dc'});wt(cx+24,512,'為什麼中午偏高',22,'#7dc8dc',700);
  ['中午光電出力最大，反送最多','假日與連假用電少，抵消不了','春節電壓偏高主因是負載低（台電說明）'].forEach((t,i)=>{circ(cx+34,566+i*58,3.5,'#7dc8dc');wt(cx+52,572+i*58,t,19,'rgba(227,236,238,.92)',500);});
 }},

{t:'智慧變流器：吸收無功壓電壓',en:'Smart inverter: absorbing reactive power',dur:14,
 d:'光電變流器除了輸出有功功率，也能調整無功功率。電壓偏高時，讓變流器吸收無功功率，就能把併接點電壓往下壓，這種控制叫電壓－無功（Volt-Var）。典型範例的設定是：電壓在 102% 以下不動作，超過後隨電壓升高逐步吸收無功，到 105% 吸收約 44% 的額定視在功率，剛好對應功率因數 0.9。代價是變流器容量有限，吸收無功就會擠壓有功輸出，吸收 34% 時，有功上限約為 94%。台電要求太陽光電具備功率因數 0.9 滯後到 0.9 超前的運轉能力。',
 s:[[0,'電壓升高，沒有調控時一路升到約 105.5%'],[.35,'設定曲線：102% 以下不動作'],[.55,'電壓超過 102%，變流器開始吸收無功'],[.8,'電壓被壓回約 104.3%，有功輸出略減']],
 draw(u){
  diagBG();
  const C=chartBox(60,150,700,650,{title:'Volt-Var 曲線（典型範例）',x0:100,x1:107,y0:-50,y1:10,xt:[100,101,102,103,104,105,106,107],yt:[-50,-40,-30,-20,-10,0,10],xl:'併接點電壓（%）',pl:84,pt:60,pb:56,gx:7,gy:6});
  wt(C.px+16,C.py+C.ph-18,'無功（% 視在功率，負為吸收）',16,'rgba(227,236,238,.85)',600);
  const k=ease(seg(u,.28,.5));
  ctx.beginPath();[[100,0],[102,0],[105,-QMAX],[107,-QMAX]].forEach((p,i)=>{const x=C.X(p[0]),y=C.Y(p[1]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});
  ctx.strokeStyle='#7dffc4';ctx.lineWidth=3.6;ctx.globalAlpha=.25+.75*k;ctx.stroke();ctx.globalAlpha=1;
  const v=u<.5?lerp(101,105.5,ease(seg(u,.06,.4))):lerp(105.5,104.3,ease(seg(u,.55,.78)));
  const q=u<.5?0:vvQ(v);
  const qd=u<.5?0:-vvQ(v)/100;
  alphaDo(1,()=>{circ(C.X(v),C.Y(q),9,u<.5?(v>VHI?'#e8572a':'#f2c230'):'#7dffc4','#fff',2.5);});
  alphaDo(seg(u,.3,.42),()=>tag(C.X(101),C.Y(0)-30,'死區：不動作',{size:16,bg:'#58b8d0',align:'center'}));
  alphaDo(seg(u,.52,.62),()=>tag(C.X(104.2),C.Y(-18)-34,'開始吸收無功',{size:16,bg:'#7dffc4',align:'center'}));
  const cx=800;
  card(cx,150,740,330,{bg:'rgba(7,27,39,.75)',st:'#f2c230'});wt(cx+24,192,'功率三角形（視在功率 S = 100%）',22,'#f2c230',700);
  const ox=cx+90,oy=430,S=230,ph=Math.asin(clamp(qd,0,.44)),Pw=S*Math.cos(ph),Qh=S*Math.sin(ph);
  ctx.setLineDash([6,6]);ctx.beginPath();ctx.arc(ox,oy,S,-Math.PI/2,0);ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1.4;ctx.stroke();ctx.setLineDash([]);
  ln([ox,oy,ox+Pw,oy],'#f2c230',4);ln([ox+Pw,oy,ox+Pw,oy-Qh],'#7dffc4',4);ln([ox,oy,ox+Pw,oy-Qh],'#fff',3);
  wt(ox+Pw/2,oy+30,'有功 P',18,'#f2c230',700,'center');
  alphaDo(seg(u,.5,.6),()=>wt(ox+Pw+14,oy-Qh/2+6,'無功 Q',18,'#7dffc4',700,'left'));
  wt(cx+420,282,'無功吸收',20,'rgba(227,236,238,.9)',600);wt(cx+700,290,Math.round(qd*100)+'%',48,'#7dffc4',800,'right',COND);
  wt(cx+420,360,'有功上限',20,'rgba(227,236,238,.9)',600);wt(cx+700,368,Math.round(Math.cos(ph)*100)+'%',48,'#f2c230',800,'right',COND);
  wt(cx+420,420,'併接點電壓',20,'rgba(227,236,238,.9)',600);wt(cx+700,424,PCT(v),32,v>VHI?'#e8572a':'#fff',700,'right',COND);
  card(cx,500,740,300,{bg:'rgba(7,27,39,.75)',st:'#7dc8dc'});wt(cx+24,542,'重點',22,'#7dc8dc',700);
  alphaDo(seg(u,.3,.4),()=>['吸收無功：不用多花電費，直接壓低電壓','代價：變流器容量有限，會擠壓有功輸出','功率因數 0.9 時，無功最多約 44%'].forEach((t,i)=>{circ(cx+34,596+i*54,3.5,'#7dc8dc');wt(cx+52,602+i*54,t,20,'rgba(227,236,238,.92)',500);}));
 }},

{t:'三招把電壓壓回來',en:'Three ways to bring voltage back',dur:14,side:true,
 d:'光電造成的電壓偏高，可以分層處理。第一層是變流器本身的電壓－無功控制，讓末端電壓從約 105.5% 降到 104.3%。第二層在變電所，主變壓器的有載分接頭可以把送出電壓從 101% 調低到 100%，整條饋線的電壓一起下移約 1 個百分點。第三層是在饋線上加裝儲能，把中午多餘的光電存起來，或在電壓仍偏高時由變流器降低有功輸出，再壓下約 1 個百分點，末端降到約 102.3%。三種方法各有成本，通常搭配使用。',
 s:[[0,'末端電壓偏高，約 105.5%'],[.25,'第一招：變流器吸收無功'],[.5,'第二招：變電所調降分接頭'],[.75,'第三招：儲能吸收，電壓回到約 102%']],
 draw(u){
  const P=feederScene(true,true);
  const bs=u>.7;
  flowDots(P,-1,'#7dffc4',9,3.6,1);
  bessD(1380,GYS,bs);ln([P[6][0],P[6][1],1405,GYS-62],'rgba(30,40,46,.85)',1.8);
  lab(630,GYS-98,'變流器 Volt-Var',{dx:0,dy:-150,st:'g',a:band(u,.22,.52)});
  lab(130,GYS-110,'分接頭調降',{dx:0,dy:-120,st:'s',a:band(u,.46,.78)});
  lab(1400,GYS-62,'儲能吸收',{dx:-30,dy:-110,st:'g',a:band(u,.68,.96)});
 },
 hud(u){
  const v=105.5-1.2*ease(seg(u,.2,.32))-1.0*ease(seg(u,.46,.58))-1.0*ease(seg(u,.7,.82));
  const tap=u>.52?'100.0%':'101.0%';
  hudPanel(280,152,'饋線末端（示例）',seg(u,.03,.08),w=>{hrow(56,'送出電壓',tap,w,u>.52?'#f2c230':'#fff');hrow(88,'末端電壓',PCT(v),w,v>VHI?'#e8572a':'#7dffc4');hrow(120,'換算電壓',VOLT(v),w,v>VHI?'#e8572a':'#7dffc4');});}},

{t:'併網規定：電壓、功率因數、容量',en:'Interconnection rules',dur:13,
 d:'台電的再生能源發電系統併聯技術要點，替上述問題設下了門檻。併接電壓依發電設備總容量決定：未滿 100 瓩可接低壓系統；100 瓩以上改接高壓以上系統，11.4 kV 饋線的最大躉售電力不得超過 5,000 瓩，22.8 kV 饋線不得超過 10,000 瓩。2009 年版要求發電設備在責任分界點造成的電壓變動率，須在高低各 3% 以內；太陽光電應具備功率因數 0.9 滯後到 0.9 超前的運轉能力；22.8 kV 以下者，電壓在額定值 88% 到 110% 間應能持續運轉。實際數值請以台電現行公告為準。',
 s:[[0,'發電設備容量不同，併接的電壓等級也不同'],[.3,'高壓饋線有躉售電力的容量上限'],[.58,'併接點電壓變動率，須在高低各 3% 以內'],[.82,'光電要能調整功率因數，也要在電壓範圍內持續運轉']],
 draw(u){
  diagBG();
  card(60,150,700,650,{bg:'rgba(7,27,39,.75)'});wt(84,190,'併接電壓等級與容量上限（瓩）',20,'#f2c230',700);
  const R=[['低壓系統','未滿 100 瓩',100,'#7dffc4',.08],['11.4 kV 饋線','最大 5,000 瓩',5000,'#f2c230',.28],['22.8 kV 饋線','最大 10,000 瓩',10000,'#b37cff',.46]];
  R.forEach(([n,t,v,c,a0],i)=>{const y=250+i*170,k=ease(seg(u,a0,a0+.14));
    wt(100,y,n,24,'#fff',700);
    box(100,y+20,600,40,'rgba(255,255,255,.06)');
    box(100,y+20,Math.max(8,600*v/10000)*k,40,c);
    alphaDo(seg(u,a0+.1,a0+.2),()=>wt(100,y+100,t,32,c,800,'left',COND));});
  const cx=800;
  [['責任分界點電壓變動率','高低各 3% 以內','#f2c230',.5],['太陽光電功率因數','0.9 滯後 ～ 0.9 超前','#7dffc4',.64],['持續運轉電壓範圍','額定值 88% ～ 110%（22.8 kV 以下）','#58b8d0',.78],['高壓併接保護','遙控跳脫與防孤島保護','#b37cff',.9]].forEach(([n,t,c,a0],i)=>alphaDo(seg(u,a0-.1,a0),()=>{
    const y=150+i*166;card(cx,y,740,150,{bg:'rgba(7,27,39,.75)',st:c});wt(cx+24,y+46,n,24,c,700);wt(cx+24,y+98,t,26,'rgba(227,236,238,.95)',700);}));
 }}
]};
function hrowW(x,y,label,val,w,col){wt(x,y,label,20,'rgba(227,236,238,.9)',600);wt(x+w,y+4,val,28,col,700,'right',COND);}
