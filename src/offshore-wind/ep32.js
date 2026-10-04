// KITS: marine
/* ================= EP32 海上變電站的維護 ================= */
/* complete fixed-bottom turbine at cx */
function turb32(cx,ang){
  const yb=bedY(cx)+130;drawPile(cx,yb,Math.PI/2,yb-PILE_TOP,PILE_W);drawTP(cx,TP_BOT);
  for(let k=0;k<3;k++)drawTowerSec(cx,TP_TOP-k*HS,k);
  drawNacelle(cx,TW_TOP,0,true);drawRotor(cx-44,TW_TOP-20,ang,3);
}
function far32(x,s,ang){const h=150*s,hy=SEA-h;ln([x,SEA,x,hy],'rgba(235,240,243,.85)',3*s);
  for(let i=0;i<3;i++){const a=ang-i*TAU/3;ln([x,hy,x+Math.cos(a)*70*s,hy+Math.sin(a)*70*s],'rgba(245,247,248,.9)',2.2*s);}circ(x,hy,3*s,'#eef2f4');}
/* boat landing + ladder on the west jacket leg */
function landing32(){
  const x=1074;ln([x,SEA+26,x,SEA-20],'#f2c230',3);ln([x-6,SEA+26,x-6,SEA-20],'#f2c230',2);
  for(let y=SEA+22;y>SEA-20;y-=6)ln([x-6,y,x,y],'#c9a020',1);
  box(x-10,SEA-24,16,4,'#6f7c85');
}
/* liferaft station on a cantilever at the east deck edge */
function lsa32(a){alphaDo(a,()=>{
  box(1195,432,26,4,'#6f7c85');ln([1195,436,1210,450],'#6f7c85',1.4);
  for(const x of [1202,1214]){ctx.beginPath();ctx.ellipse(x,425,5,7,0,0,TAU);ctx.fillStyle='#f4f6f7';ctx.fill();ctx.strokeStyle='#8a979e';ctx.lineWidth=.8;ctx.stroke();box(x-5,424,10,1.4,'#e8572a');}
  ln([1221,436,1221,SEA+4],'#c9d1d5',1.2);for(let y=440;y<SEA;y+=5)ln([1218,y,1224,y],'#c9d1d5',.8);
  ring(1188,410,3.4,'#e8572a',2);box(1150,440,8,6,'#7dffc4');
});}
function oss32(){drawJacket(OX,bedOX,bedOX-SEA+20,true);drawTopside(OX,SEA-20,1);landing32();}
/* text wrapped to a width (after translation) */
function wrap32(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
/* export cable path OSS → landfall → onshore control centre */
const EXP32=(()=>{const P=[{x:OX+42,y:SEA-14},{x:OX+52,y:bedOX-15},{x:OX+80,y:bedY(OX+80)+2}];for(let x=OX+88;x<HDD_EXIT;x+=8)P.push({x,y:bedY(x)+2});for(let t=0;t<=1.0001;t+=.05)P.push(hddPt(t));return P;})();
function plen32(P){const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i].x-P[i-1].x,P[i].y-P[i-1].y));return L;}
const EXPL32=plen32(EXP32);
function ptAt32(P,L,d){const T=L[L.length-1];if(d<=0)return P[0];if(d>=T)return P[P.length-1];let i=1;while(L[i]<d)i++;const k=(d-L[i-1])/(L[i]-L[i-1]||1);return {x:lerp(P[i-1].x,P[i].x,k),y:lerp(P[i-1].y,P[i].y,k)};}
function data32(a,rev){alphaDo(a,()=>{const T=EXPL32[EXPL32.length-1];for(let i=0;i<14;i++){let d=(TT*90+i*T/14)%T;if(rev)d=T-d;const p=ptAt32(EXP32,EXPL32,d);circ(p.x,p.y,2.6,'#7dffc4');}});}
function seaScene32(){
  for(const [x,s,p] of [[180,.55,.4],[330,.42,1.1],[960,.4,1.7]])far32(x,s,TT*.9+p);
  turb32(TX,TT*.6);drawCable(EXP32);drawOnshore(1);drawHDD(1);oss32();
}
/* station technicians: [delay, colour] */
const CREW32=[[0,'#e8572a'],[.06,'#f2c230'],[.12,'#e8572a']];
/* DGA: acetylene trend */
const c2h232=m=>m<6?.3+.05*Math.sin(m*2.3):.3+.05*Math.sin(m*2.3)+(m-6)*(m-6)*.17;
/* GIS: SF6 density % of rated */
const sf632=m=>m<15?100-m*.36:m<16?lerp(100-15*.36,100,m-15):100-(m-16)*.36*.15;

const EP={no:32,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'海上變電站的維護',en:'Maintaining the offshore substation',
lede:'整座風場的電都要經過海上變電站升壓後才能送上岸，它一旦停機，所有風機的電都送不出去。這一集看這座平常沒有人的變電站如何被照顧：從陸上遠端監看變壓器油中氣體與 GIS 的 SF₆ 氣體，判斷設備內部的早期異常，再看技術人員定期登站要做哪些事，以及站上的消防與救生設備。',
facts:[['7','種氣體','變壓器油中氣體分析常分析的溶解氣體：H₂、CH₄、C₂H₆、C₂H₄、C₂H₂、CO、CO₂'],['約 23,500','倍','SF₆ 的全球暖化潛勢（GWP100，IPCC AR5），洩漏必須嚴格管控'],['2','段','SF₆ 密度監測的兩段門檻：先發警報要求補氣，再閉鎖開關操作'],['300–3,000','MHz','GIS 局部放電特高頻（UHF）偵測的常用頻段'],['1–4','次／年','無人值守海上變電站的定期登站維護次數（典型範例）']],
note:'說明：本集為教育用途示意動畫，尺寸與距離經過壓縮。油中氣體種類與故障對應（氫氣對應局部放電、甲烷與乙烯對應過熱、乙炔對應電弧、一氧化碳與二氧化碳對應絕緣紙劣化）依 IEC 60599 與 IEEE C57.104 的判讀原則；乙炔趨勢曲線與注意值為示例，實際門檻依變壓器型式與業主規範。SF₆ 密度監測採兩段門檻（警報、閉鎖）為 GIS 的一般做法，曲線中的百分比為示例；SF₆ 的 GWP 取自 IPCC 第五次評估報告。海上變電站的設計依 DNV-ST-0145 等規範，消防配置（變壓器水噴霧或泡沫、電氣室氣體滅火、防火隔間）、救生設備、登站浪高限制與登站頻率皆為典型範例，不代表特定風場。',
shots:[
/* 1 */{t:'無人值守的海上變電站',en:'An unmanned offshore substation',dur:13,side:true,
 d:'海上變電站把陣列海纜匯集來的電，經主變壓器升壓後由輸出海纜送上岸，是整座風場的咽喉。站上平常沒有人，所有設備的狀態都透過輸出海纜裡的光纖傳回陸上監控中心：變壓器的油溫與油中氣體、氣體絕緣開關設備（GIS）的 SF₆ 密度與局部放電、消防與備用電源的狀態。值班人員在岸上監看，必要時可以遠端切換開關。',
 s:[[0,'海上變電站把風場的電升壓後送上岸'],[.26,'站上平常無人，狀態經海纜內光纖傳回岸上'],[.52,'陸上監控中心看著變壓器與開關設備的數據'],[.76,'異常時先遠端處置，再安排人員登站']],
 cam:u=>camMix({x:800,y:440,s:1},{x:1110,y:405,s:2.2},ease(seg(u,.46,.68))),
 draw(u){
  seaScene32();lsa32(1);
  data32(seg(u,.2,.3));
  lab(OX,SEA-110,'海上變電站',{dx:-60,dy:-60,a:band(u,.03,.3),st:'s'});
  lab(1300,bedY(1300)+2,'輸出海纜（內含光纖）',{dx:-60,dy:60,a:band(u,.24,.46)});
  lab(1545,412,'陸上監控中心',{dx:-40,dy:-80,a:band(u,.3,.5),st:'g'});
  lab(OX-8,405,'主變壓器',{dx:-70,dy:-50,a:band(u,.62,.98),st:'s'});
  lab(OX+38,400,'GIS 開關設備',{dx:70,dy:-50,a:band(u,.66,.98)});
  lab(OX-87,353,'直升機甲板',{dx:-50,dy:-40,a:band(u,.72,.98),minor:true});
 },
 hud(u){hudPanel(240,156,'遠端監控（示例）',seg(u,.04,.1),w=>{
  hrow(52,'輸出功率',Math.round(460+30*Math.sin(TT*.3))+' MW',w,'#f2c230');
  hrow(78,'變壓器油溫',Math.round(58+2*Math.sin(TT*.2))+' °C',w);
  hrow(104,'SF₆ 密度','正常',w,'#7dffc4');
  hrow(130,'站上人員','0 人',w,'#7dffc4');});}},
/* 2 */{t:'變壓器油中氣體分析',en:'Dissolved gas analysis of transformer oil',dur:14,
 d:'主變壓器的線圈泡在絕緣油裡。內部一旦出現局部放電、過熱或電弧，油與絕緣紙會分解出特定的氣體並溶在油中，這就是油中氣體分析（DGA）的原理。氫氣多半來自局部放電，甲烷與乙烯代表過熱，乙炔代表電弧，一氧化碳與二氧化碳則指向絕緣紙劣化。線上監測器持續分析油樣，濃度的上升速度往往比單次數值更重要。',
 s:[[0,'線圈泡在絕緣油裡，故障會讓油分解出氣體'],[.26,'不同的氣體對應不同的故障型態'],[.5,'線上監測器發現乙炔持續上升'],[.74,'登站取油樣送實驗室，確認後安排處置']],
 draw(u){
  diagBG();
  card(60,150,700,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'油中氣體從哪來',20,'#fff',700);
  // transformer cutaway
  box(130,250,380,300,'#3a4650');box(140,260,360,280,'rgba(232,163,58,.26)');
  for(const x of [220,320,420]){box(x-6,214,12,36,'#8b6b4a');for(let k=0;k<4;k++)box(x-9,218+k*8,18,3,'#a0876a');}
  box(190,280,260,18,'#6b7780');box(190,502,260,18,'#6b7780');box(190,280,22,240,'#6b7780');box(428,280,22,240,'#6b7780');box(309,280,22,240,'#6b7780');
  box(238,306,58,188,'#c47a3a');box(344,306,58,188,'#c47a3a');
  for(let k=0;k<9;k++){ln([238,318+k*20,296,318+k*20],'rgba(0,0,0,.2)',1);ln([344,318+k*20,402,318+k*20],'rgba(0,0,0,.2)',1);}
  for(let k=0;k<6;k++)box(512,270+k*44,22,30,'#56626a');
  // hot spot + gas bubbles that dissolve
  const hs=seg(u,.06,.14);
  if(hs>0){const p=.5+.5*Math.sin(TT*6),g=ctx.createRadialGradient(290,420,2,290,420,30);g.addColorStop(0,`rgba(255,120,60,${.9*hs})`);g.addColorStop(1,'rgba(255,120,60,0)');ctx.fillStyle=g;ctx.fillRect(250,380,80,80);circ(290,420,4+p*2,'#ff9d7a');
   for(let i=0;i<10;i++){const q=(TT*.5+i/10)%1;circ(290+Math.sin(i*2.1+TT)*16+q*30*Math.sin(i),420-q*150,2+q*2,`rgba(255,240,210,${.8*(1-q)*hs})`);}}
  // online DGA monitor
  ln([500,300,580,300,580,340],'#8a99a3',4);ln([500,500,580,500,580,440],'#8a99a3',4);
  for(let i=0;i<5;i++){const q=(TT*.4+i/5)%1;const y=q<.5?lerp(500,440,q*2):0;if(q<.5)circ(580,y,2.4,'#e8a33a');}
  box(555,340,170,100,'#2b3137','#6b7780',1);box(567,352,146,44,'#0e2a3b');
  const bars=[.3,.25,.2,.35,.15+.6*seg(u,.46,.6)];bars.forEach((b,i)=>box(577+i*27,392-b*36,16,b*36,i===4&&u>.5?'#e8572a':'#7dffc4'));
  wt(640,470,'線上 DGA 監測器',16,'rgba(227,236,238,.85)',600,'center');
  wt(290,580,'線圈與絕緣紙泡在絕緣油中',15,'rgba(227,236,238,.75)',500,'center');
  alphaDo(band(u,.08,.4),()=>tag(290,370,'故障點',{bg:'#e8572a',fg:'#fff',size:14,align:'center'}));
  // gas → fault
  const G=[['H₂','氫氣','局部放電','#58b8d0'],['CH₄ C₂H₄','甲烷、乙烯','過熱','#f2c230'],['C₂H₂','乙炔','電弧','#e8572a'],['CO CO₂','一氧化碳、二氧化碳','絕緣紙劣化','#b37cff']];
  G.forEach((g,i)=>{const a=seg(u,.24+i*.05,.28+i*.05);if(a<=0)return;alphaDo(a,()=>{const x=84+(i%2)*340,y=612+Math.floor(i/2)*92;
   card(x,y,326,80,{bg:'rgba(255,255,255,.04)',st:g[3],r:6});
   wt(x+14,y+32,g[0],22,g[3],700,'left',COND);wrap32(x+130,y+31,g[1],186,15,'#fff',600,18);
   wt(x+14,y+64,'→',17,'rgba(227,236,238,.8)',700);wt(x+40,y+65,g[2],17,'#fff',700);});});
  // right: acetylene trend
  const c=chartBox(800,150,740,650,{x0:0,x1:12,y0:0,y1:10,xt:[0,2,4,6,8,10,12],yt:[0,2,4,6,8,10],yl:'乙炔（ppm）',pt:70,pb:60,pl:80,pr:30,gx:6,gy:5});
  wt(1516,190,'乙炔濃度趨勢（示例）',18,'#f2c230',700,'right');
  wt(c.px+c.pw,c.py+c.ph+48,'月',15,'rgba(227,236,238,.7)',500,'right');
  ctx.setLineDash([7,5]);ln([c.px,c.Y(2),c.px+c.pw,c.Y(2)],'#e8572a',2);ctx.setLineDash([]);
  tag(c.px+c.pw-8,c.Y(2)-16,'注意值（示例）',{bg:'#e8572a',fg:'#fff',size:14,align:'right'});
  const g=12*ease(seg(u,.12,.62)),P=[];for(let m=0;m<=g;m+=.1)P.push({x:c.X(m),y:c.Y(c2h232(m))});pathLine(P,'#ff9d7a',3);
  if(g>9.2)alphaDo(seg(u,.5,.54),()=>{const p=.5+.5*Math.sin(TT*6);ring(c.X(9.2),c.Y(2),8+p*4,'#e8572a',2);tag(c.X(9.2),c.Y(4.2),'線上監測發出警報',{bg:'#e8572a',fg:'#fff',size:14,align:'right'});});
  alphaDo(seg(u,.72,.78),()=>{tag(c.px+16,c.Y(9),'登站取油樣，送實驗室確認',{bg:'#7dffc4',size:15});});
  alphaDo(seg(u,.84,.9),()=>{tag(c.px+16,c.Y(7.8),'視結果安排停電檢修',{bg:'#7dffc4',size:15});});
 }},
/* 3 */{t:'GIS 的 SF₆ 氣體與局部放電',en:'SF₆ gas and partial discharge in the GIS',dur:14,
 d:'海上變電站空間有限，高壓開關多半採用氣體絕緣開關設備（GIS），把導體封在充滿 SF₆ 的金屬管內，靠氣體絕緣與滅弧。每個氣室裝有密度計，自動補償溫度造成的壓力變化；密度緩慢下降代表有洩漏，第一段門檻發出警報、要求補氣，第二段門檻則閉鎖開關操作。氣室內若有金屬微粒或絕緣缺陷，會產生局部放電，由特高頻（UHF）感測器捕捉。',
 s:[[0,'導體封在充滿 SF₆ 的金屬管內，靠氣體絕緣'],[.26,'密度計補償溫度，追蹤每個氣室的氣體量'],[.5,'密度降到警報值，登站檢漏並補氣'],[.74,'UHF 感測器捕捉內部局部放電的訊號']],
 draw(u){
  diagBG();
  card(60,150,700,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'氣室剖面',20,'#fff',700);
  // enclosure
  const y0=290,y1=430;
  rrp(110,y0,600,y1-y0,40);ctx.fillStyle='#56626a';ctx.fill();
  rrp(120,y0+10,580,y1-y0-20,32);ctx.fillStyle='rgba(125,200,220,.18)';ctx.fill();
  for(let i=0;i<26;i++){circ(140+((i*53+TT*12)%540),y0+20+((i*37)%100),1.6,'rgba(125,200,220,.55)');}
  box(110,352,600,16,'#c9d1d5');
  for(const x of [300,520]){poly([x-8,y0+4,x+8,y0+4,x+20,360,x+8,y1-4,x-8,y1-4,x-20,360],'#e8e2c8','#9a9070',1);box(x-14,y0-8,28,12,'#6b7780');box(x-14,y1-4,28,12,'#6b7780');}
  // density monitor gauge on compartment 2
  const GX=410,GY=250,dens=sf632(24*ease(seg(u,.3,.7)));
  ln([GX,y0,GX,GY+22],'#8a99a3',4);circ(GX,GY,26,'#e9edef','#6b7780',2);
  const ang=Math.PI*(.8+.4*(dens-90)/10)+Math.PI*.4;
  ctx.save();ctx.lineWidth=5;ctx.strokeStyle='#e8572a';ctx.beginPath();ctx.arc(GX,GY,20,Math.PI*1.0,Math.PI*1.3);ctx.stroke();ctx.strokeStyle='#7dffc4';ctx.beginPath();ctx.arc(GX,GY,20,Math.PI*1.45,Math.PI*2);ctx.stroke();ctx.restore();
  ln([GX,GY,GX+Math.cos(ang)*18,GY+Math.sin(ang)*18],'#13232e',2.4);circ(GX,GY,3,'#13232e');
  // leak bubbles at flange
  if(u>.3&&u<.62)for(let i=0;i<5;i++){const q=(TT*.7+i/5)%1;circ(530+Math.sin(i*2+TT*2)*4,y0-6-q*40,1.6+q*2,`rgba(200,230,240,${.7*(1-q)})`);}
  // PD particle + UHF sensor
  const US={x:300,y:y1+8};box(US.x-10,US.y,20,12,'#f2c230');
  const pd=seg(u,.72,.8);
  if(pd>0){const px=210,py=y1-20-Math.abs(Math.sin(TT*5))*30;circ(px,py,3,'#ff9d7a');
   for(let k=0;k<3;k++){const q=(TT*1.2+k/3)%1;alphaDo(pd*(1-q),()=>ring(px,py,6+q*90,'#ff9d7a',1.6));}}
  alphaDo(seg(u,.04,.1),()=>{wt(446,y0-52,'SF₆ 密度計',15,'rgba(227,236,238,.85)',600,'left');});
  alphaDo(seg(u,.06,.12),()=>{wt(150,y1+40,'導體',15,'rgba(227,236,238,.8)',600);wt(520,y1+40,'盆式絕緣子',15,'rgba(227,236,238,.8)',600,'center');});
  alphaDo(band(u,.72,1),()=>{wt(US.x+18,US.y+28,'UHF 感測器',15,'#f2c230',700);});
  // PD pulse strip
  card(84,540,652,236,{bg:'rgba(255,255,255,.04)',r:6});
  wt(104,572,'UHF 局部放電訊號',16,'#fff',700);
  ln([104,690,716,690],'rgba(227,236,238,.4)',1);
  const sw=ease(seg(u,.72,.94));ctx.beginPath();
  for(let x=0;x<=600*sw;x+=2){const ph=(x/600)*4*TAU,base=Math.sin(ph)*0;let v=(hn(Math.floor(x/2),3)-.5)*6;
   const inPh=Math.sin(ph)>.6||Math.sin(ph)<-.6;if(inPh&&hn(Math.floor(x/2),7)>.82)v-=40+hn(x,9)*50;const X=110+x,Y=690+v+base;x?ctx.lineTo(X,Y):ctx.moveTo(X,Y);}
  ctx.strokeStyle='#ff9d7a';ctx.lineWidth=1.4;ctx.stroke();
  if(u<.72)wt(410,700,'目前無局部放電',16,'#7dffc4',600,'center');
  else alphaDo(seg(u,.86,.9),()=>tag(716,600,'脈衝與工頻相位同步：疑似內部缺陷',{bg:'#ff9d7a',size:14,align:'right'}));
  // right: density trend
  const c=chartBox(800,150,740,650,{x0:0,x1:24,y0:88,y1:101,xt:[0,6,12,18,24],yt:[90,92,94,96,98,100],yl:'SF₆ 密度（額定 %）',pt:70,pb:60,pl:80,pr:30,gx:4,gy:6});
  wt(1516,190,'氣室密度變化（示例）',18,'#f2c230',700,'right');
  wt(c.px+c.pw,c.py+c.ph+48,'月',15,'rgba(227,236,238,.7)',500,'right');
  const TH=[[95,'第一段：警報、補氣','#e8a33a'],[92,'第二段：閉鎖操作','#e8572a']];
  TH.forEach(t=>{ctx.setLineDash([7,5]);ln([c.px,c.Y(t[0]),c.px+c.pw,c.Y(t[0])],t[2],2);ctx.setLineDash([]);tag(c.px+c.pw-8,c.Y(t[0])+16,t[1],{bg:t[2],fg:'#13232e',size:13,align:'right'});});
  const g=24*ease(seg(u,.12,.7)),P=[];for(let m=0;m<=g;m+=.1)P.push({x:c.X(m),y:c.Y(sf632(m))});pathLine(P,'#58b8d0',3);
  if(g>13.9)alphaDo(seg(u,.44,.48),()=>{ring(c.X(13.9),c.Y(95),9,'#e8a33a',2);tag(c.X(13.9),c.Y(97.6),'警報',{bg:'#e8a33a',size:14,align:'center'});});
  if(g>15.5)alphaDo(seg(u,.52,.56),()=>tag(c.X(16),c.Y(100)-22,'檢漏、修復並補氣',{bg:'#7dffc4',size:14,align:'left'}));
 }},
/* 4 */{t:'定期登站',en:'Scheduled visits to the platform',dur:13,side:true,
 d:'遠端監測看得到趨勢，但取油樣、檢漏補氣、測試保護電驛與消防設備，仍要人親自到站上。登站通常利用浪況較好的季節，以人員運輸船（CTV）頂靠基礎的登乘平台，技術人員確認船身穩定後跨上爬梯；也可以從運維母船（SOV）經動態補償步橋登站，或搭直升機降落在直升機甲板。上站前要先通報陸上監控中心，並把相關設備切換到現地控制。',
 s:[[0,'人員運輸船頂靠基礎的登乘平台'],[.3,'確認船身穩定後，技術人員依序跨上爬梯'],[.58,'爬上甲板，向陸上監控中心通報登站'],[.8,'也可以從運維母船步橋或搭直升機登站']],
 cam:u=>({x:1060,y:430,s:2.3}),
 draw(u){
  seaScene32();lsa32(1);
  const vx=lerp(700,991,ease(seg(u,0,.28)));
  const wl=vsl(vx,78,false,{tilt:.3,damp:.6},vCTV);
  const LX=1071,deckY=SEA-34;
  CREW32.forEach((c,i)=>{const t0=.32+c[0]*2.2;
   const k=seg(u,t0,t0+.2),k2=seg(u,t0+.2,t0+.3);
   let x,y;
   if(k<=0){x=vx+30-i*10;y=wl-12;}
   else if(k2<=0){x=LX-3;y=lerp(wl-12,deckY,ease(k));}
   else{x=lerp(LX-3,1100+i*14,ease(k2));y=deckY;}
   person(x,y,c[1],2.2);});
  if(u>.66)alphaDo(seg(u,.66,.7)*(.5+.5*Math.sin(TT*5)),()=>circ(OX+30,SEA-120,3,'#7dffc4'));
  lab(vx+40,wl-20,'人員運輸船（CTV）',{dx:-60,dy:-60,a:band(u,.04,.3)});
  lab(1074,SEA,'登乘平台與爬梯',{dx:-80,dy:50,a:band(u,.26,.56),st:'s'});
  lab(1100,deckY,'主甲板',{dx:60,dy:40,a:band(u,.6,.8),minor:true});
  lab(OX-87,353,'直升機甲板',{dx:-50,dy:-40,a:band(u,.8,1),st:'s'});
 },
 hud(u){hudPanel(240,156,'登站條件（示例）',seg(u,.04,.1),w=>{
  hrow(52,'浪高',(1.1+.08*Math.sin(TT*.6)).toFixed(1)+' m',w,'#7dffc4');
  hrow(78,'CTV 頂靠限值','1.5 m',w);
  const n=CREW32.filter(c=>u>.32+c[0]*2.2+.2).length;
  hrow(104,'站上人員',trf('{n} 人',{n}),w,n?'#f2c230':'rgba(227,236,238,.8)');
  hrow(130,'控制模式',u<.66?'遠端':'現地',w,u<.66?'rgba(227,236,238,.8)':'#f2c230');});}},
/* 5 */{t:'一次登站要做的事',en:'The work list for one visit',dur:13,
 d:'每次登站的時間與人力都很寶貴，工作會事先依狀態監測的結果與保養週期排好。常見項目包括：變壓器取油樣、檢查油位與冷卻器；GIS 檢漏、補氣與局部放電複測；保護電驛與 SCADA 通訊測試；柴油發電機試運轉與不斷電系統（UPS）電池檢查；消防偵測與滅火系統測試；救生筏、救生衣與逃生路線的檢查。完成後把設備切回遠端，才算結束。',
 s:[[0,'工作依監測結果與保養週期事先排好'],[.3,'變壓器、GIS、保護電驛逐項檢查與測試'],[.56,'柴油發電機、消防與救生設備也要測試'],[.8,'完成後切回遠端控制，恢復無人值守']],
 draw(u){
  diagBG();
  const T=[['主變壓器','取油樣、檢查油位與冷卻器','#f2c230'],['GIS 開關設備','檢漏、補氣、局部放電複測','#58b8d0'],['保護與控制','保護電驛測試、SCADA 通訊','#7dffc4'],['備用電源','柴油發電機試運轉、UPS 電池','#b37cff'],['消防系統','偵測器、水噴霧與氣體滅火測試','#e8572a'],['救生設備','救生筏、救生衣、逃生路線','#ff9d7a']];
  T.forEach((t,i)=>{const t0=.06+i*.1,a=seg(u,t0,t0+.06);if(a<=0)return;const x=60+(i%3)*500,y=170+Math.floor(i/3)*250,done=u>t0+.14;
   alphaDo(a,()=>{card(x,y,470,220,{bg:done?'rgba(125,255,196,.06)':'rgba(7,27,39,.8)',st:done?'rgba(125,255,196,.5)':'rgba(255,255,255,.16)'});
    box(x,y+14,6,46,t[2]);wt(x+26,y+50,t[0],26,'#fff',700);
    wrap32(x+26,y+110,t[1],400,22,'rgba(227,236,238,.88)',500,28);
    circ(x+430,y+180,16,done?'#7dffc4':'rgba(255,255,255,.14)');if(done)ln([x+422,y+180,x+428,y+187,x+439,y+173],'#0e2a3b',3);});});
  alphaDo(seg(u,.78,.84),()=>{card(60,690,1480,100,{bg:'rgba(242,194,48,.1)',st:'#f2c230'});
   wt(90,734,'登站頻率',18,'rgba(227,236,238,.85)',600);wt(90,772,'一年約 1–4 次（典型範例）',22,'#f2c230',700);
   const k=seg(u,.86,.96);wt(1510,752,u<.9?'控制模式：現地':'控制模式：遠端',22,k>.5?'#7dffc4':'#f2c230',700,'right');});
 }},
/* 6 */{t:'站上的消防系統',en:'Fire protection on the platform',dur:13,
 d:'海上變電站離岸數十公里，火災時救援船無法即時趕到，所以站上的消防設計要能自己偵測、自己滅火。主變壓器存有大量絕緣油，通常設在獨立的變壓器室，配置水噴霧或泡沫系統，底下有集油槽；GIS 室與控制室等電氣室則使用不導電的氣體滅火。各房間以防火牆分隔，火災被限制在單一房間內，不會延燒到整座平台。',
 s:[[0,'各房間都有煙、熱或火焰偵測器'],[.24,'變壓器室偵測到火焰，自動發出警報'],[.44,'水噴霧系統啟動，絕緣油流入集油槽'],[.7,'防火牆把火限制在單一房間，電氣室用氣體滅火']],
 draw(u){
  diagBG();
  // cutaway
  card(60,150,920,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'上部模組剖面（示意）',20,'#fff',700);
  box(100,240,840,10,'#6f7c85');box(100,700,840,12,'#6f7c85');
  const R=[[110,252,320,446,'主變壓器室'],[440,252,240,215,'GIS 室'],[440,477,240,221,'控制室'],[690,252,240,215,'臨時避難區'],[690,477,240,221,'柴油發電機室']];
  R.forEach(r=>{box(r[0],r[1],r[2],r[3],'rgba(255,255,255,.05)');wt(r[0]+r[2]/2,r[1]+r[3]-16,r[4],16,'rgba(227,236,238,.85)',600,'center');
   const det=r[4]==='主變壓器室'&&u>.24;circ(r[0]+r[2]/2,r[1]+12,6,det?'#e8572a':'#c9d1d5');if(det)ring(r[0]+r[2]/2,r[1]+12,10+4*Math.sin(TT*8),'#e8572a',1.6);});
  // fire walls
  const fw=seg(u,.7,.76);
  for(const L of [[435,250,435,700],[685,250,685,700],[440,472,940,472]])ln(L,fw>0?`rgba(232,87,42,${.35+.65*fw})`:'rgba(232,87,42,.35)',fw>0?8:5);
  // transformer
  box(180,440,180,170,'#3a4650');for(let k=0;k<7;k++)box(150,450+k*22,26,16,'#56626a');for(let k=0;k<7;k++)box(364,450+k*22,26,16,'#56626a');
  for(const x of [220,270,320]){box(x-6,404,12,36,'#8b6b4a');}
  box(150,616,260,36,'#2b3137');wt(280,640,'集油槽',14,'rgba(227,236,238,.75)',600,'center');
  // fire
  const fire=seg(u,.2,.26)*(1-seg(u,.5,.7));
  if(fire>0)alphaDo(fire,()=>{for(let i=0;i<7;i++){const x=200+i*24,h=40+25*Math.sin(TT*9+i*1.7);poly([x-12,612,x,612-h,x+12,612],i%2?'#e8572a':'#f2c230');}});
  // deluge
  const dl=seg(u,.42,.48)*(1-seg(u,.9,1));
  ln([140,300,400,300],'#c9d1d5',4);for(let x=160;x<=380;x+=44){box(x-4,300,8,10,'#c9d1d5');}
  if(dl>0)alphaDo(dl,()=>{for(let i=0;i<60;i++){const q=(TT*1.2+i/60)%1,x=160+(i%6)*44+(hn(i,1)-.5)*40*q;circ(x,312+q*290,1.8,'rgba(125,200,220,.85)');}});
  // oil drain
  if(u>.46)alphaDo(seg(u,.46,.5),()=>{for(let k=0;k<4;k++){const q=(TT*.8+k/4)%1;circ(270,610+q*10,2.2,'#e8a33a');}});
  // gas suppression cylinders
  alphaDo(seg(u,.72,.78),()=>{for(let k=0;k<3;k++){rrp(456+k*20,560,14,60,6);ctx.fillStyle='#e8572a';ctx.fill();}wt(560,600,'氣體滅火',15,'#fff',700,'left');});
  // right legend
  const K=[['偵測','煙、熱、火焰偵測器分布在每個房間','#c9d1d5',.04],['變壓器室','水噴霧或泡沫系統，加上集油槽','#58b8d0',.24],['電氣室','不導電的氣體滅火，保護設備','#e8572a',.5],['防火牆','把火限制在單一房間，阻止延燒','#f2c230',.7]];
  K.forEach((k,i)=>{const a=seg(u,k[3],k[3]+.06);if(a<=0)return;alphaDo(a,()=>{const y=150+i*166;
   card(1020,y,520,150,{bg:'rgba(7,27,39,.8)',st:k[2]});wt(1044,y+42,k[0],22,k[2],700);wrap32(1044,y+82,k[1],470,18,'#fff',500,26);});});
 }},
/* 7 */{t:'救生設備與回到無人值守',en:'Life-saving equipment and back to unmanned',dur:13,side:true,
 d:'人員在站上時，安全也要能自給自足。每次登站先做安全簡報，確認集合點、逃生路線與救生筏的位置；站上設有臨時避難區，儲備飲水、食物與通訊設備，天候突然轉壞、船無法接回時可以留宿等待。工作完成後，技術人員把設備切回遠端控制、向陸上監控中心回報，依序下爬梯回到船上，變電站再次回到無人值守。',
 s:[[0,'登站先確認集合點、逃生路線與救生筏'],[.28,'臨時避難區備有飲水、食物與通訊設備'],[.52,'工作完成，切回遠端控制並回報岸上'],[.76,'人員下船離站，變電站回到無人值守']],
 cam:u=>camMix({x:1130,y:420,s:2.4},{x:1000,y:440,s:1.5},ease(seg(u,.74,.96))),
 draw(u){
  seaScene32();lsa32(1);
  const LX=1071,deckY=SEA-34;
  const vx=lerp(991,700,ease(seg(u,.82,1)));
  const wl=vsl(vx,78,false,{tilt:.3,damp:.6},vCTV);
  CREW32.forEach((c,i)=>{const t0=.54+c[0]*1.6,k=seg(u,t0,t0+.08),k2=seg(u,t0+.08,t0+.2);
   if(u>.82)return;let x,y;
   if(k<=0){x=1150+i*14-(u<.28?0:20*seg(u,.28,.4));y=deckY;}
   else if(k2<=0){x=lerp(1150+i*14-20,LX-3,ease(k));y=deckY;}
   else{x=LX-3;y=lerp(deckY,wl-12,ease(k2));}
   person(x,y,c[1],2.2);});
  if(u<.52){const p=.5+.5*Math.sin(TT*4);circ(1154,436,3+p,'#7dffc4');}
  lab(1208,422,'救生筏',{dx:60,dy:-50,a:band(u,.03,.3),st:'s'});
  lab(1221,455,'逃生梯',{dx:60,dy:30,a:band(u,.06,.3),minor:true});
  lab(1154,443,'集合點',{dx:40,dy:50,a:band(u,.08,.3),st:'g'});
  lab(1160,395,'臨時避難區',{dx:60,dy:-60,a:band(u,.28,.52),st:'s'});
  lab(LX,SEA-10,'下爬梯回到船上',{dx:-90,dy:40,a:band(u,.6,.8)});
  data32(seg(u,.86,.92),true);
 },
 hud(u){hudPanel(240,130,'站上狀態（示例）',seg(u,.04,.1),w=>{
  const n=u<.82?CREW32.filter(c=>u<.54+c[0]*1.6+.2).length:0;
  hrow(52,'站上人員',trf('{n} 人',{n}),w,n?'#f2c230':'#7dffc4');
  hrow(78,'控制模式',u<.52?'現地':'遠端',w,u<.52?'#f2c230':'#7dffc4');
  hrow(104,'站況',u<.9?'維護中':'無人值守',w,u<.9?'#f2c230':'#7dffc4');});}}
]};
