// KITS: marine
/* ================= EP31 水下維修作業 ================= */
/* complete fixed-bottom turbine at cx (monopile + TP + tower + nacelle + rotor) */
function turb31(cx,ang){
  const yb=bedY(cx)+130;drawPile(cx,yb,Math.PI/2,yb-PILE_TOP,PILE_W);drawTP(cx,TP_BOT);
  for(let k=0;k<3;k++)drawTowerSec(cx,TP_TOP-k*HS,k);
  drawNacelle(cx,TW_TOP,0,true);drawRotor(cx-44,TW_TOP-20,ang,3);
}
function far31(x,s,ang){const h=150*s,hx=x,hy=SEA-h;ln([x,SEA,x,hy],'rgba(235,240,243,.85)',3*s);
  for(let i=0;i<3;i++){const a=ang-i*TAU/3;ln([hx,hy,hx+Math.cos(a)*70*s,hy+Math.sin(a)*70*s],'rgba(245,247,248,.9)',2.2*s);}circ(hx,hy,3*s,'#eef2f4');}
/* text wrapped to a width (after translation) */
function wrap31(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
const PB31=bedY(TX); // seabed at the monopile
/* marine growth on the pile between TP and seabed */
const MG31=(()=>{const r=rng(311),a=[];for(let i=0;i<220;i++){const face=r()<.45;a.push({y:TP_BOT+4+r()*(PB31-TP_BOT-8),f:face,o:face?r()*2-1:(r()<.5?-1:1),k:r(),r:2+r()*4});}return a;})();
function growth31(cx,hw){
  for(const g of MG31){const x=g.f?cx+g.o*hw*.8:cx+g.o*(hw+g.r*.35);
    if(g.k<.45){ctx.beginPath();ctx.ellipse(x,g.y,g.r*.55,g.r*1.1,g.o*.4,0,TAU);ctx.fillStyle='#33363e';ctx.fill();}
    else if(g.k<.78)circ(x,g.y,g.r*.65,'#cfc6b0','#8f8672',.6);
    else if(!g.f)ln([x,g.y,x+g.o*(4+g.r*1.4)+Math.sin(TT*1.5+g.y)*1.6,g.y-5-g.r*1.8],'#5f8a42',1.6);
    else circ(x,g.y,g.r*.5,'#5f8a42');}
}
/* work ROV, drawn facing right; face=-1 mirrors */
function wrov31(x,y,s,face,light){
  s=s||1;face=face||1;ctx.save();ctx.translate(x,y);ctx.scale(face*s,s);
  if(light>0)alphaDo(light,()=>{const g=ctx.createLinearGradient(24,0,150,0);g.addColorStop(0,'rgba(255,244,200,.5)');g.addColorStop(1,'rgba(255,244,200,0)');poly([24,-2,150,-44,150,48,24,8],g);});
  box(-26,-4,50,15,'#2b3137');box(-26,-19,50,15,'#f2c230');ln([-26,-12,24,-12],'rgba(0,0,0,.25)',1);
  box(-33,-15,7,9,'#555');box(-33,2,7,8,'#555');circ(22,4,4.2,'#394650');circ(23,4,1.7,'#7dffc4');
  ln([18,11,30,18,36,14],'#8a99a3',2.4);box(16,-25,4,6,'#e8572a');
  ctx.restore();
}
/* diver, drawn facing right */
function diver31(x,y,s,face){
  s=s||1;face=face||1;ctx.save();ctx.translate(x,y);ctx.scale(face*s,s);
  const k=Math.sin(TT*4)*4;
  ln([-14,1,-30,3+k*.4],'#1c1c1c',4.4);ln([-14,3,-30,7-k*.4],'#1c1c1c',4.4);
  poly([-30,1+k*.4,-42,-3+k,-42,7+k,-30,5+k*.4],'#f2c230');poly([-30,5-k*.4,-42,1-k,-42,11-k,-30,9-k*.4],'#f2c230');
  ctx.beginPath();ctx.ellipse(0,2,16,6,0,0,TAU);ctx.fillStyle='#1c1c1c';ctx.fill();
  box(-12,-9,20,5,'#e8572a');ln([10,4,24,10],'#1c1c1c',3.4);
  circ(19,-1,6,'#f2c230');box(20,-4,5,5,'#2a3a46');
  ctx.restore();
  for(let i=0;i<4;i++){const q=(TT*.8+i/4)%1;circ(x+face*14*s+Math.sin(i*2+TT*3)*3,y-8*s-q*60,1.5+q*2.5,`rgba(220,245,255,${.6*(1-q)})`);}
}
/* umbilical / cable with sag */
function sag31(x0,y0,x1,y1,col,lw,sg){ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2+20,Math.max(y0,y1)+(sg===undefined?30:sg),x1,y1);ctx.strokeStyle=col||'#f2c230';ctx.lineWidth=lw||1.4;ctx.stroke();}
function waterGrad31(){const g=ctx.createLinearGradient(0,SEA,0,780);g.addColorStop(0,'#3b93bb');g.addColorStop(.45,'#1d6690');g.addColorStop(1,'#0b3858');return g;}
/* scour pit around the pile: depth d (world units), redraw water inside it */
const pit31=(x,d)=>d*clamp(1-(Math.abs(x-TX)-PILE_W/2)/120);
function drawPit31(d){
  ctx.save();ctx.beginPath();ctx.moveTo(TX-150,bedY(TX-150));for(let x=TX-150;x<=TX+150;x+=3)ctx.lineTo(x,bedY(x)+pit31(x,d));
  for(let x=TX+150;x>=TX-150;x-=3)ctx.lineTo(x,bedY(x)-1);ctx.closePath();ctx.fillStyle=waterGrad31();ctx.fill();
  ctx.beginPath();for(let x=TX-150;x<=TX+150;x+=3){const y=bedY(x)+pit31(x,d);x===TX-150?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.strokeStyle='rgba(164,135,106,.9)';ctx.lineWidth=2;ctx.stroke();ctx.restore();
}
/* diving support vessel: A-frame + basket at stern (left), deck chamber, ROV hangar */
function vDSV(){
  hull(260,16,11,'#e9eef0','#6a2622','#e8572a');
  superBlock(184,-66,62,50,4);box(180,-78,70,12,'#f4f6f7');wins(184,-75,9,7.4,4,5);mast(216,-78,18);
  // deck decompression chamber
  ctx.beginPath();ctx.ellipse(126,-26,26,10,0,0,TAU);ctx.fillStyle='#d8dde0';ctx.fill();ctx.strokeStyle='#6b7780';ctx.lineWidth=1;ctx.stroke();
  circ(104,-26,4,'#394650');box(118,-18,16,2,'#6b7780');
  // ROV hangar
  box(56,-38,40,22,'#f2c230');box(60,-34,32,14,'#2a3a46');
  // A-frame
  ln([4,-16,-14,-70,26,-16],'#e8572a',2.6);ln([-14,-70,-20,-66],'#e8572a',2);
}
/* fall-pipe rock vessel: rock holds, inclined fall pipe launched from mid-deck */
function vFP(){
  hull(300,18,12,'#2c3e50','#7a2a24','#f2c230');
  for(let i=0;i<3;i++){const x=150+i*44;box(x,-40,38,22,'#4a5560');for(let j=0;j<7;j++)circ(x+4+j*5,-40+Math.sin(j*2+i)*1.5,3,'#9aa3a8');}
  superBlock(8,-70,52,52,4);box(4,-82,60,12,'#f4f6f7');wins(8,-79,8,7.4,4,5);mast(40,-82,18);
  // pipe tower over launch point
  ln([82,-18,92,-70,102,-18],'#f2c230',2.4);ln([92,-70,92,-18],'#f2c230',1.4);box(84,-30,16,12,'#6b7780');
}
/* sacrificial anode on stand-off (side view); rem 0–1 remaining */
function anode31(x,y,rem,flip){
  const d=flip?-1:1,w=4+5*rem;box(Math.min(x,x+d*6),y-2,6,4,'#6b7780');
  box(d>0?x+6:x-6-w,y-16,w,32,rem>.6?'#c9d1d5':'#8f9aa2','#5b666e',.8);
  if(rem<.6)for(let i=0;i<4;i++)circ(x+d*(6+w/2)+((i%2)-.5)*2,y-10+i*7,1,'#4d5962');
}
/* repair window rocks (fixed layout) */
const ROCK31=(()=>{const r=rng(317),f=[],a=[];
  for(let i=0;i<260;i++){const x=TX-145+r()*290;if(Math.abs(x-TX)<PILE_W/2+2)continue;const top=bedY(x),bot=top+pit31(x,22);if(bot-top<2)continue;f.push({x,y:lerp(bot-2,top+1,r()),r:1.6+r()*1.6,c:r()});}
  for(let i=0;i<120;i++){const x=TX-150+r()*300;if(Math.abs(x-TX)<PILE_W/2+4)continue;const h=12*clamp(1-Math.max(0,Math.abs(x-TX)-60)/90);if(h<1.5)continue;a.push({x,y:bedY(x)-r()*h,r:3.6+r()*3.4,c:r()});}
  f.sort((p,q)=>q.y-p.y);a.sort((p,q)=>q.y-p.y);return {f,a};})();
const POT31=[-0.7,-1.05];

const EP={no:31,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'水下維修作業',en:'Subsea repair works',
lede:'上一集的水下檢查找出了問題：陽極消耗得比預期快、海纜保護套懸空磨損、樁腳的淘刷坑越來越深。這一集看潛水支援船如何把這些發現變成維修工單，加裝犧牲陽極、修復海纜保護套，再用落管拋石船把淘刷坑填回去，並說明潛水員的作業窗口與減壓程序。',
facts:[['約 2,000','Ah/kg','鋁合金犧牲陽極的設計電化學容量（DNV-RP-B401）'],['−0.80','V','加裝陽極後，鋼材電位要回到這個門檻以下（相對 Ag/AgCl）'],['20–45','cm','拋石護甲層常見的石塊尺寸（典型範例）'],['約 20–25','分鐘','30 m 空氣潛水不需減壓停留的時間上限（美國海軍潛水表，典型）'],['5','分鐘','水面減壓：潛水員出水到進入加壓艙的時間上限']],
note:'說明：本集為教育用途示意動畫，尺寸與距離經過壓縮。鋁合金陽極容量與保護電位門檻依 DNV-RP-B401 等海水陰極保護規範；陽極可由潛水員或 ROV 以夾具加裝，國外已有風場以 ROV 加裝陽極架的案例。拋石以濾層與護甲層組成，護甲石 20–45 cm 為國外風場的實際範例，也有使用更大石塊的設計。不減壓時間與水面減壓（出水 5 分鐘內進艙、艙內加壓並呼吸純氧）依美國海軍潛水手冊的做法，實際依潛水承包商的程序與主管機關規定。維修工單、陽極所需電流與重量、懸空長度、拋石量、流速與浪高限制皆為典型範例，不代表特定風場。',
shots:[
/* 1 */{t:'潛水支援船抵達',en:'The dive support vessel arrives',dur:13,side:true,
 d:'水下檢查的結果會整理成維修工單，再依風險排定先後，把可以一起做的項目合併成一次出海。執行維修的通常是潛水支援船（DSV）：船尾有吊放潛水吊籠的 A 型架，甲板上放著加壓艙，還有一台可以搭配工具作業的工作級 ROV。潛水員透過臍帶取得呼吸空氣、通訊與保暖熱水，由吊籠送到海床附近，船上的潛水監督全程監看。',
 s:[[0,'檢查結果整理成維修工單，合併成一次出海'],[.3,'潛水支援船船尾有 A 型架與潛水吊籠'],[.55,'潛水員搭吊籠下水，由臍帶供氣與通訊'],[.78,'甲板加壓艙全程待命，以備減壓與急救']],
 cam:u=>camMix({x:800,y:430,s:1},{x:680,y:580,s:1.6},ease(seg(u,.42,.75))),
 draw(u){
  for(const [x,s,p] of [[180,.55,.4],[1050,.45,1.7],[1250,.4,2.6]])far31(x,s,TT*.9+p);
  turb31(TX,TT*.6);growth31(TX,PILE_W/2);
  const vx=lerp(1200,700,ease(seg(u,0,.3)));
  const wl=vsl(vx,260,false,{tilt:.5},vDSV);
  const ax=vx-14,ay=wl-70;
  const by=kf(u,[[0,0,wl-40],[.4,0,wl-40],[.5,0,wl+10],[.82,0,PB31-30],[1,0,PB31-30]]).y;
  ln([ax,ay,ax,by-22],'#c9d1d5',1.2);
  box(ax-12,by-22,24,2,'#f2c230');box(ax-12,by+2,24,3,'#f2c230');ln([ax-12,by-22,ax-12,by+2,ax+12,by+2,ax+12,by-22],'#f2c230',1.4);
  person(ax-3,by+1,'#1c1c1c',2.2);circ(ax-3,by-18,3.2,'#f2c230');
  if(u>.4)sag31(vx+40,wl-18,ax-3,by-14,'#f2c230',1.4,20);
  school(380,560,9,7,TT,40,1);school(1000,650,7,9,TT,30,-1);
  lab(vx+200,wl-70,'潛水支援船（DSV）',{dx:50,dy:-50,a:band(u,.06,.34)});
  lab(vx+126,wl-30,'甲板加壓艙',{dx:60,dy:-60,a:band(u,.78,1),st:'s'});
  lab(ax,ay,'A 型架',{dx:-70,dy:-40,a:band(u,.3,.52),minor:true});
  lab(ax+12,by-10,'潛水吊籠',{dx:80,dy:-10,a:band(u,.5,.8),st:'s'});
  lab(vx+40,wl+20,'臍帶（供氣、通訊、熱水）',{dx:90,dy:40,a:band(u,.58,.82),st:'g',minor:true});
 },
 hud(u){hudPanel(240,150,'本次維修工單（示例）',seg(u,.04,.1),w=>{
  hrow(52,'加裝陽極','2 組',w,'#f2c230');
  hrow(78,'海纜保護套','1 處',w,'#f2c230');
  hrow(104,'拋石補強','約 800 t',w,'#f2c230');
  hrow(130,'潛水員',u<.45?'準備中':'下水中',w,u<.45?'rgba(227,236,238,.8)':'#7dffc4');});}},
/* 2 */{t:'從檢查發現到維修方法',en:'From findings to repair methods',dur:13,
 d:'每一項檢查發現都要先判斷原因，再選維修方法與執行者。陽極剩餘量不足、電位接近 −0.80 V 門檻，代表保護電流快不夠了，要加裝新的陽極。海纜保護套懸空磨損，常是因為淘刷把它下方的砂帶走，所以要先修復保護套、補上支撐。淘刷坑若一年比一年深，就要拋石補強。精細的手工交給潛水員，重複的監看交給 ROV，大量拋石則由專用船完成。',
 s:[[0,'每項發現先判斷原因，再選方法與執行者'],[.22,'陽極不足：電位接近門檻，加裝新陽極'],[.46,'保護套懸空：淘刷帶走砂，修復並補支撐'],[.7,'淘刷加深：以落管拋石船填回石塊']],
 draw(u){
  diagBG();
  const H=[[60,'檢查發現'],[470,'原因判斷'],[880,'維修方法'],[1250,'執行者']];
  alphaDo(seg(u,0,.06),()=>H.forEach(h=>wt(h[0]+12,182,h[1],19,'rgba(227,236,238,.75)',700)));
  const R=[
   ['陽極剩餘約 55%，電位 −0.82 V','保護電流快不夠，接近門檻','加裝夾式陽極或陽極架','潛水員、ROV',.16],
   ['海纜保護套懸空、外層磨損','淘刷帶走下方的砂，失去支撐','修復夾套，下方補灌漿袋','潛水員',.4],
   ['淘刷坑深 4.2 m，持續加深','海流繞樁，保護層不足','拋石：先濾層，再護甲層','落管拋石船',.64]];
  R.forEach((r,i)=>{const y=210+i*176,on=u>=r[4]&&(i===2||u<R[i+1][4]);
   const W=[[60,380],[470,380],[880,340],[1250,290]];
   W.forEach((c,j)=>{const a=seg(u,r[4]+j*.04,r[4]+.04+j*.04);if(a<=0)return;alphaDo(a,()=>{
    card(c[0],y,c[1],150,{bg:on?'rgba(242,194,48,.12)':'rgba(7,27,39,.8)',st:on?'#f2c230':'rgba(255,255,255,.16)'});
    if(j===0)circ(c[0]+26,y+34,8,'#e8572a');
    wrap31(c[0]+(j===0?46:22),y+42,r[j],c[1]-(j===0?66:42),j===2?20:18,j===2?'#f2c230':j===3?'#7dffc4':'#fff',j===2?700:500,26);
    if(j<3)arrow(c[0]+c[1]+4,y+75,c[0]+c[1]+26,y+75,'rgba(227,236,238,.6)',2);});});});
  alphaDo(seg(u,.86,.92),()=>{box(60,756,1480,1,'rgba(255,255,255,.14)');wrap31(60,790,'依風險排序，能一起做的項目合併成一次出海',1480,18,'rgba(227,236,238,.85)',600,24);});
 }},
/* 3 */{t:'加裝犧牲陽極',en:'Retrofitting sacrificial anodes',dur:14,side:true,
 d:'原有陽極消耗得比設計快時，可以在不拆結構的情況下加裝新的陽極。常見做法有兩種：在既有陽極支架或樁身加上夾式陽極，或把一組陽極架放在樁旁的海床上，再以電纜和夾具接到鋼材。夾具要咬穿塗層與鏽層，確保電流導通良好。完成後重新量測電位，讀數回到 −0.80 V 以下且留有餘裕，才算修復完成。',
 s:[[0,'原有陽極已消耗，鋼材電位接近門檻'],[.22,'吊放陽極架到樁旁海床'],[.46,'潛水員以電纜與夾具把陽極架接到樁身'],[.72,'保護電流恢復，電位回到 −0.80 V 以下']],
 cam:u=>({x:TX+20,y:676,s:2.4}),
 draw(u){
  turb31(TX,TT*.6);growth31(TX,PILE_W/2);
  for(const y of [580,650])anode31(TX+PILE_W/2,y,.35,false);
  const SX=TX+150,sy=kf(u,[[0,0,520],[.2,0,520],[.4,0,PB31-2],[1,0,PB31-2]]).y;
  if(u<.5)alphaDo(1-seg(u,.42,.5),()=>ln([SX,440,SX,sy-34],'#c9d1d5',1.2));
  box(SX-36,sy-4,72,6,'#f2c230');for(let i=0;i<4;i++){const x=SX-28+i*18;box(x,sy-30,10,26,'#c9d1d5','#6b7780',.8);}ln([SX-36,sy-34,SX+36,sy-34],'#f2c230',2);
  const CL={x:TX+PILE_W/2,y:684};
  const D=kf(u,[[0,TX+230,620],[.3,TX+220,630],[.44,SX+10,sy-50],[.6,TX+44,CL.y-12],[.74,TX+60,CL.y-16],[1,TX+110,600]]);
  diver31(D.x,D.y,.85,-1);
  const cp=seg(u,.44,.6);
  if(cp>0){const ex=lerp(SX-20,CL.x+4,cp),ey=lerp(sy-20,CL.y,cp);sag31(SX-20,sy-20,ex,ey,'#e8572a',2,8);}
  if(u>.6){box(CL.x-2,CL.y-6,10,12,'#f2c230');circ(CL.x+3,CL.y,2,'#394650');}
  const cur=seg(u,.7,.8);if(cur>0)alphaDo(cur,()=>{for(let k=0;k<8;k++){const q=(TT*.6+k/8)%1;const x=lerp(SX-30,CL.x+8,q),y=lerp(sy-24,CL.y,q)-Math.sin(q*Math.PI)*14;circ(x,y,1.8,'#7dffc4');}});
  school(TX-200,620,6,4,TT,24,1);
  lab(TX+PILE_W/2+10,580,'原有陽極（已消耗）',{dx:90,dy:-40,a:band(u,.02,.26),st:'w'});
  lab(SX,sy-34,'陽極架',{dx:70,dy:-40,a:band(u,.22,.48),st:'s'});
  lab(CL.x+4,CL.y,'電纜與夾具',{dx:-110,dy:-40,a:band(u,.5,.74),st:'s'});
  lab((SX+CL.x)/2,CL.y-14,'保護電流',{dx:40,dy:-60,a:band(u,.76,1),st:'g'});
 },
 hud(u){hudPanel(240,130,'陰極保護（示例）',seg(u,.04,.1),w=>{
  const v=lerp(-0.82,-0.97,ease(seg(u,.72,.9))),ok=v<-0.85;
  hrow(52,'鋼材電位',v.toFixed(2)+' V',w,ok?'#7dffc4':'#e8572a');
  hbar(14,60,w-28,clamp((-v-0.7)/0.35),ok?'#7dffc4':'#e8572a');
  hrow(90,'門檻','−0.80 V',w);
  hrow(114,'陽極架',u<.6?'安裝中':'已連接',w,u<.6?'rgba(227,236,238,.8)':'#7dffc4');});}},
/* 4 */{t:'陽極要加多少',en:'Sizing the retrofit anodes',dur:13,
 d:'加裝多少陽極，要從需要的保護電流和想延長的年數倒推。陽極重量約等於平均電流乘以年數與每年 8,760 小時，再除以陽極可用比例與電化學容量。鋁合金陽極的設計容量約每公斤 2,000 安培小時。例如平均需要 15 安培、想延長 10 年，就需要約 730 公斤的陽極（示例）。加裝後電位會再往負的方向移動，保護年限跟著延長。',
 s:[[0,'陽極重量由保護電流與延長年數倒推'],[.3,'鋁合金陽極每公斤約可提供 2,000 安培小時'],[.55,'例如 15 A 延長 10 年，約需 730 kg（示例）'],[.75,'加裝後電位回升，保護年限跟著延長']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'陽極重量估算（示例）',20,'#fff',700);
  const f=seg(u,.04,.12);alphaDo(f,()=>{
   wt(420,280,'M = I × t × 8760 ÷ (u × ε)',30,'#f2c230',700,'center',COND);
   wrap31(84,326,'M 陽極重量　I 平均保護電流　t 年數　u 可用比例　ε 電化學容量',672,15,'rgba(227,236,238,.75)',500,22);});
  const V=[['I','平均保護電流','15','A',.2],['t','延長年數','10','年',.26],['u','可用比例','0.90','',.32],['ε','鋁合金陽極容量','2,000','Ah/kg',.38]];
  V.forEach((v,i)=>{const a=seg(u,v[4],v[4]+.05);if(a<=0)return;alphaDo(a,()=>{const y=402+i*62;
   card(84,y,672,52,{bg:'rgba(255,255,255,.04)',r:6});
   wt(106,y+35,v[0],24,'#f2c230',700,'left',COND);wt(150,y+33,v[1],17,'#fff',500);
   wt(732,y+36,v[2]+(v[3]?' '+tr(v[3]):''),24,'#fff',700,'right',COND);});});
  const r=seg(u,.55,.68);if(r>0)alphaDo(seg(u,.55,.58),()=>{box(84,664,672,1,'rgba(255,255,255,.14)');
   wt(106,712,'所需陽極重量',18,'rgba(227,236,238,.85)',600);
   wt(732,722,Math.round(730*ease(r))+' kg',44,'#7dffc4',700,'right',COND);
   wrap31(106,762,'約等於 4 支 180 kg 的陽極（示例）',640,15,'rgba(227,236,238,.75)',500,22);});
  // right: potential vs years
  card(820,150,720,650,{bg:'rgba(7,27,39,.8)'});
  const c=chartBox(820,150,720,650,{x0:0,x1:30,y0:POT31[1],y1:POT31[0],xt:[0,5,10,15,20,25,30],yt:[-0.7,-0.8,-0.9,-1.0],yl:'電位（V）',pt:70,pb:60,pl:80,pr:30,gx:6,gy:7});
  wt(1516,190,'電位隨年份變化（示例）',18,'#f2c230',700,'right');
  wt(c.px+c.pw,c.py+c.ph+48,'運轉年數',15,'rgba(227,236,238,.7)',500,'right');
  const old=y=>-1.0+0.19*Math.pow(y/14,1.6)*(y>14?1+(y-14)*.08:1);
  const nw=y=>y<12?old(y):-0.97+0.17*Math.pow((y-12)/18,1.8);
  ctx.setLineDash([7,5]);ln([c.px,c.Y(-0.8),c.px+c.pw,c.Y(-0.8)],'#e8572a',2);ctx.setLineDash([]);
  tag(c.px+c.pw-8,c.Y(-0.8)-16,'保護門檻 −0.80 V',{bg:'#e8572a',fg:'#fff',size:14,align:'right'});
  const g=ease(seg(u,.12,.4)),P=[];for(let y=0;y<=30*g;y+=.25)P.push({x:c.X(y),y:c.Y(Math.min(POT31[0],old(y)))});
  pathLine(P,u>.72?'rgba(255,157,122,.55)':'#ff9d7a',2.6,u>.72?[6,5]:undefined);
  if(u>.4)alphaDo(seg(u,.4,.46)*(1-seg(u,.72,.76)),()=>tag(c.X(22),c.Y(-0.72),'未加裝：約第 15 年失去保護',{bg:'#ff9d7a',size:13,align:'center'}));
  const h=ease(seg(u,.74,.92));if(h>0){const Q=[];for(let y=12;y<=12+18*h;y+=.25)Q.push({x:c.X(y),y:c.Y(nw(y))});pathLine(Q,'#7dffc4',3);
   alphaDo(seg(u,.74,.78),()=>{ln([c.X(12),c.Y(old(12)),c.X(12),c.Y(-0.97)],'#7dffc4',2);tag(c.X(12),c.Y(-1.02),'第 12 年加裝',{bg:'#7dffc4',size:13,align:'center'});});
   alphaDo(seg(u,.88,.94),()=>tag(c.X(25),c.Y(-0.9),'保護延長',{bg:'#7dffc4',size:13,align:'center'}));}
 }},
/* 5 */{t:'修復海纜保護套',en:'Repairing the cable protection',dur:13,side:true,
 d:'陣列海纜從海床進入樁身的這一段，外面套著海纜保護系統（CPS），防止海纜在入口處過度彎曲與磨損。淘刷把樁腳的砂帶走後，保護套就會懸空，隨海流擺動，跟樁身或石塊摩擦而磨穿外層。修復時潛水員先清除附著物、量測損傷，再裝上兩半合抱的修復夾套，並在懸空段下方放置灌漿袋，讓保護套重新得到支撐。',
 s:[[0,'海纜從海床進入樁身，外面套著保護系統'],[.22,'淘刷讓保護套懸空，隨海流擺動磨損'],[.45,'潛水員在磨損處裝上兩半合抱的修復夾套'],[.7,'在懸空段下方放置灌漿袋，補回支撐']],
 cam:u=>({x:TX-70,y:650,s:2.4}),
 draw(u){
  drawPit31(22);
  turb31(TX,TT*.6);growth31(TX,PILE_W/2);
  const EX=TX-PILE_W/2,EY=PB31-8;
  // grout bags under the free span
  const B=[[TX-104,.62],[TX-76,.7],[TX-48,.78]];
  const sup=seg(u,.62,.86);
  B.forEach(b=>{const a=seg(u,b[1],b[1]+.06);if(a<=0)return;const bot=bedY(b[0])+pit31(b[0],22),top=lerp(bot,PB31+4,1);
   alphaDo(a,()=>{for(let k=0;k<3;k++){const yy=bot-6-k*((bot-top)/3);ctx.beginPath();ctx.ellipse(b[0],lerp(bot-40,yy,ease(a)),13,5,0,0,TAU);ctx.fillStyle='#c9b98f';ctx.fill();ctx.strokeStyle='#8f8060';ctx.lineWidth=.8;ctx.stroke();}});});
  // CPS path: on seabed, then free span to the entry hole
  const sw=Math.sin(TT*1.6)*3*(1-sup);
  const P=[];for(let x=TX-260;x<=TX-140;x+=4)P.push({x,y:bedY(x)-3});
  for(let k=0;k<=24;k++){const t=k/24,x=lerp(TX-140,EX,t),y=lerp(bedY(TX-140)-3,EY,t)+Math.sin(t*Math.PI)*(10*(1-sup)+2)+Math.sin(t*Math.PI)*sw;P.push({x,y});}
  pathLine(P,'#2b3137',7);pathLine(P,'rgba(242,194,48,.55)',1.4);
  for(let k=0;k<5;k++){const q=P[P.length-1-k*2];box(q.x-3,q.y-5,5,10,'#e8a33a');}
  // worn spot
  const wi=P.length-17,W=P[wi];
  if(u<.55)alphaDo(band(u,.22,.5),()=>ring(W.x,W.y,9,'#e8572a',1.8));
  // repair clamshell
  const cs=ease(seg(u,.42,.56));if(cs>0){box(W.x-9,W.y-6-14*(1-cs),18,6,'#f2c230');box(W.x-9,W.y+14*(1-cs),18,6,'#f2c230');ln([W.x-9,W.y,W.x+9,W.y],'#8a6d10',1);}
  const D=kf(u,[[0,TX-260,600],[.2,TX-200,630],[.42,W.x-10,W.y-30],[.6,W.x-6,W.y-32],[.66,TX-120,PB31-34],[.86,TX-60,PB31-36],[1,TX-200,610]]);
  diver31(D.x,D.y,.85,1);
  school(TX+170,600,6,4,TT,24,-1);
  lab(TX-200,bedY(TX-200)-4,'海纜保護系統（CPS）',{dx:-40,dy:-80,a:band(u,.02,.28),st:'s'});
  lab(EX,EY,'纜線入口（J 型管）',{dx:-30,dy:-110,a:band(u,.06,.3),minor:true});
  lab(TX-90,PB31+12,'懸空段',{dx:60,dy:60,a:band(u,.22,.46),st:'w'});
  lab(W.x,W.y,'修復夾套',{dx:-70,dy:50,a:band(u,.5,.72),st:'s'});
  lab(TX-76,PB31+14,'灌漿袋支撐',{dx:80,dy:60,a:band(u,.74,1),st:'g'});
 },
 hud(u){hudPanel(230,130,'保護套狀態（示例）',seg(u,.04,.1),w=>{
  const L=lerp(3.5,0,ease(seg(u,.62,.86)));hrow(52,'懸空長度',L.toFixed(1)+' m',w,L>.5?'#e8572a':'#7dffc4');
  hrow(78,'外層磨損',u<.56?'待修復':'已包覆',w,u<.56?'#e8572a':'#7dffc4');
  hrow(106,'流速','0.8 kn',w);});}},
/* 6 */{t:'拋石補強淘刷坑',en:'Rock placement in the scour pit',dur:14,side:true,
 d:'淘刷坑接近設計值時，以落管拋石船把石塊填回樁腳。船以動態定位停在基礎旁，把傾斜落管伸到海床附近，石塊沿著管子落下，才不會被海流沖散，ROV 在出口旁監看位置。先鋪較細的碎石當濾層，防止底下的砂被吸出，再蓋上較大的石塊當護甲層，抵抗海流與波浪。完成後再以多波束聲納測量，確認拋石的範圍與厚度。',
 s:[[0,'落管拋石船以動態定位停在基礎旁'],[.25,'石塊沿著傾斜落管送到海床附近'],[.48,'先鋪細碎石當濾層，防止砂被吸出'],[.7,'再蓋上大石塊當護甲層，抵抗海流']],
 cam:u=>camMix({x:800,y:450,s:1},{x:TX-30,y:676,s:2.1},ease(seg(u,.26,.46))),
 draw(u){
  for(const [x,s,p] of [[1050,.45,1.7],[1250,.4,2.6]])far31(x,s,TT*.9+p);
  drawPit31(22);
  turb31(TX,TT*.6);growth31(TX,PILE_W/2);
  const vx=lerp(-120,190,ease(seg(u,0,.22)));
  const wl=vsl(vx,300,false,{tilt:.4},vFP);
  const P0={x:vx+92,y:wl-18},P1={x:TX-70,y:PB31-40};
  const pe=ease(seg(u,.16,.28)),PE={x:lerp(P0.x,P1.x,pe),y:lerp(P0.y,P1.y,pe)};
  if(pe>0){ln([P0.x,P0.y,PE.x,PE.y],'#6b7780',7);ln([P0.x,P0.y,PE.x,PE.y],'rgba(255,255,255,.18)',2);}
  // rocks
  const ff=seg(u,.3,.56),fa=seg(u,.56,.9);
  const nF=Math.floor(ROCK31.f.length*ff),nA=Math.floor(ROCK31.a.length*fa);
  for(let i=0;i<nF;i++){const r=ROCK31.f[i];circ(r.x,r.y,r.r,r.c<.5?'#8d9295':'#a3a7a8');}
  for(let i=0;i<nA;i++){const r=ROCK31.a[i];circ(r.x,r.y,r.r,r.c<.5?'#6f7577':'#878c8e','#4c5254',.6);}
  // falling stream
  if(pe>=1&&u<.9)for(let k=0;k<10;k++){const q=(TT*1.4+k/10)%1,s=u<.56?1.6:3.4;circ(P1.x+Math.sin(k*3.1)*8+q*10*Math.sin(k),P1.y+q*36,s,'#9aa3a8');}
  // ROV watching the outlet
  if(u>.3){const R={x:TX-150,y:PB31-46+Math.sin(TT)*2};wrov31(R.x,R.y,.7,1,.5);sag31(R.x-10,R.y-12,vx+60,wl-10,'#f2c230',1,40);}
  school(TX+200,620,6,4,TT,24,-1);
  lab(vx+170,wl-40,'落管拋石船',{dx:60,dy:-50,a:band(u,.08,.3)});
  lab((P0.x+P1.x)/2,(P0.y+P1.y)/2,'傾斜落管',{dx:-90,dy:30,a:band(u,.2,.42),st:'s'});
  lab(TX-60,PB31+10,'濾層（細碎石）',{dx:-110,dy:60,a:band(u,.4,.62)});
  lab(TX+60,PB31-6,'護甲層（大石塊）',{dx:90,dy:-60,a:band(u,.64,1),st:'s'});
  lab(TX-150,PB31-46,'ROV 監看',{dx:-50,dy:-60,a:band(u,.32,.5),minor:true});
 },
 hud(u){hudPanel(230,130,'拋石作業（示例）',seg(u,.04,.1),w=>{
  const t=Math.round(300*seg(u,.3,.56)+500*seg(u,.56,.9));hrow(52,'累計拋石',t+' t',w,'#f2c230');hbar(14,60,w-28,t/800,'#f2c230');
  hrow(90,'目前層別',u<.56?'濾層':'護甲層',w,u<.3?'rgba(227,236,238,.8)':'#7dffc4');
  hrow(116,'護甲石','20–45 cm',w);});}},
/* 7 */{t:'潛水作業窗口與減壓',en:'Dive windows and decompression',dur:13,
 d:'潛水員能工作多久，取決於深度與時間。空氣潛水在 30 公尺左右，不需減壓停留的時間只有約 20 到 25 分鐘，超過就必須減壓。海上常用水面減壓：潛水員上升出水後，5 分鐘內進入甲板加壓艙，在艙內加壓並呼吸純氧，把體內多餘的氮氣排出。每次下水前還要確認潮流、浪高、能見度，以及加壓艙與待命潛水員都已就緒。',
 s:[[0,'30 m 空氣潛水，不需減壓的時間只有約 20–25 分鐘'],[.28,'超過就要減壓，海上常用水面減壓'],[.5,'出水後 5 分鐘內進入加壓艙，呼吸純氧'],[.74,'下水前逐項確認流速、浪高與待命人員']],
 draw(u){
  diagBG();
  card(60,150,880,650,{bg:'rgba(7,27,39,.8)'});
  const c=chartBox(60,150,880,500,{x0:0,x1:80,y0:-35,y1:2,xt:[0,20,40,60,80],yt:[0,-10,-20,-30],yl:'深度（m）',pt:96,pb:56,pl:80,pr:30,gx:4,gy:4});
  wt(84,190,'水面減壓的潛水剖面（示例）',20,'#fff',700);
  wt(c.px+c.pw,c.py+c.ph+46,'時間（分鐘）',15,'rgba(227,236,238,.7)',500,'right');
  ln([c.px,c.Y(0),c.px+c.pw,c.Y(0)],'rgba(125,200,220,.6)',1.4);
  const prof=[[0,0],[3,-30],[33,-30],[37,0],[41,0],[42,-15],[72,-15],[76,0]];
  const g=80*ease(seg(u,.04,.7)),Pw=[],Pc=[];
  for(let i=0;i<prof.length-1;i++){const a=prof[i],b=prof[i+1];if(a[0]>g)break;const e=Math.min(b[0],g),t=(e-a[0])/(b[0]-a[0]),pt={x:c.X(e),y:c.Y(lerp(a[1],b[1],t))};
   const arr=i<4?Pw:Pc;if(!arr.length)arr.push({x:c.X(a[0]),y:c.Y(a[1])});arr.push(pt);}
  pathLine(Pw,'#58b8d0',3);pathLine(Pc,'#b37cff',3);
  if(g>3)alphaDo(band(u,.06,.36),()=>{box(c.X(3),c.Y(-30),c.X(33)-c.X(3),c.Y(-35)-c.Y(-30),'rgba(88,184,208,.18)');wt(c.X(18),c.Y(-30)-12,'海底作業 30 分鐘',15,'#58b8d0',700,'center');});
  if(g>3)alphaDo(seg(u,.1,.16),()=>{ctx.setLineDash([5,4]);ln([c.X(23),c.Y(-35),c.X(23),c.Y(2)],'#f2c230',1.6);ctx.setLineDash([]);tag(c.X(23),c.Y(-6),'不減壓上限約 23 分鐘',{bg:'#f2c230',size:13,align:'center'});});
  if(g>37)alphaDo(seg(u,.44,.5),()=>{box(c.X(37),c.Y(2),c.X(41)-c.X(37),c.Y(-35)-c.Y(2),'rgba(232,87,42,.2)');tag(c.X(39),c.Y(-24),'出水到入艙 ≤ 5 分鐘',{bg:'#e8572a',fg:'#fff',size:13,align:'center'});});
  if(g>45)alphaDo(seg(u,.52,.58),()=>wt(c.X(57),c.Y(-15)+30,'艙內加壓至約 15 m，呼吸純氧',15,'#b37cff',700,'center'));
  const L=[['水中','#58b8d0'],['加壓艙','#b37cff']];
  L.forEach((l,i)=>alphaDo(seg(u,.04,.1),()=>{const x=c.px+c.pw-250+i*130;ln([x,c.py+20,x+22,c.py+20],l[1],3);wt(x+28,c.py+25,l[0],14,'rgba(227,236,238,.9)',600);}));
  alphaDo(seg(u,.28,.34),()=>{box(84,680,832,1,'rgba(255,255,255,.14)');
   wrap31(84,716,'超過不減壓上限，就要在上升途中停留或進加壓艙減壓，否則體內氮氣形成氣泡，造成減壓病。',832,16,'rgba(227,236,238,.85)',500,24);});
  // right: pre-dive checklist
  card(980,150,560,650,{bg:'rgba(7,27,39,.8)'});wt(1004,190,'下水前確認（示例）',20,'#fff',700);
  const K=['潮流低於 1 kn（平潮前後）','浪高低於 1.5 m','能見度足夠作業','甲板加壓艙待命','待命潛水員與醫療聯絡'];
  K.forEach((k,i)=>{const t0=.72+i*.035,a=seg(u,.6+i*.02,.64+i*.02),ok=u>t0;if(a<=0)return;alphaDo(a,()=>{const y=226+i*86;
   card(1004,y,512,72,{bg:ok?'rgba(125,255,196,.08)':'rgba(255,255,255,.04)',st:ok?'#7dffc4':'rgba(255,255,255,.12)'});
   circ(1040,y+36,15,ok?'#7dffc4':'rgba(255,255,255,.18)');if(ok)ln([1032,y+36,1038,y+43,1049,y+29],'#0e2a3b',3);
   wrap31(1068,y+43,k,430,17,'#fff',500,22);});});
  if(u>.92)alphaDo(seg(u,.92,.96),()=>tag(1260,700,'可以下水',{bg:'#7dffc4',size:20,align:'center'}));
 }}
]};
