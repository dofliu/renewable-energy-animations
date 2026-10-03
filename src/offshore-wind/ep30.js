// KITS: marine
/* ================= EP30 水下結構檢查 ================= */
/* complete fixed-bottom turbine at cx (monopile + TP + tower + nacelle + rotor) */
function turb30(cx,ang){
  const yb=bedY(cx)+130;drawPile(cx,yb,Math.PI/2,yb-PILE_TOP,PILE_W);drawTP(cx,TP_BOT);
  for(let k=0;k<3;k++)drawTowerSec(cx,TP_TOP-k*HS,k);
  drawNacelle(cx,TW_TOP,0,true);drawRotor(cx-44,TW_TOP-20,ang,3);
}
function far30(x,s,ang){const h=150*s,hx=x,hy=SEA-h;ln([x,SEA,x,hy],'rgba(235,240,243,.85)',3*s);
  for(let i=0;i<3;i++){const a=ang-i*TAU/3;ln([hx,hy,hx+Math.cos(a)*70*s,hy+Math.sin(a)*70*s],'rgba(245,247,248,.9)',2.2*s);}circ(hx,hy,3*s,'#eef2f4');}
/* text wrapped to a width (after translation) */
function wrap30(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
const PB30=bedY(TX); // seabed at the monopile
/* marine growth: side tufts and face patches on the pile between TP and seabed */
const MG30=(()=>{const r=rng(301),a=[];for(let i=0;i<300;i++){const face=r()<.45;a.push({y:TP_BOT+4+r()*(PB30-TP_BOT-8),f:face,o:face?r()*2-1:(r()<.5?-1:1),k:r(),r:2+r()*4});}return a;})();
function growth30(cx,hw,cut){
  for(const g of MG30){const rem=cut?cut(g.y):1;if(rem<=.02)continue;
   const x=g.f?cx+g.o*hw*.8:cx+g.o*(hw+g.r*.35);
   alphaDo(rem,()=>{
    if(g.k<.45){ctx.beginPath();ctx.ellipse(x,g.y,g.r*.55,g.r*1.1,g.o*.4,0,TAU);ctx.fillStyle='#33363e';ctx.fill();}
    else if(g.k<.78)circ(x,g.y,g.r*.65,'#cfc6b0','#8f8672',.6);
    else if(!g.f)ln([x,g.y,x+g.o*(4+g.r*1.4)+Math.sin(TT*1.5+g.y)*1.6,g.y-5-g.r*1.8],'#5f8a42',1.6);
    else circ(x,g.y,g.r*.5,'#5f8a42');});}
}
/* inspection ROV, drawn facing right; face=-1 mirrors */
function irov30(x,y,s,face,light,brush){
  s=s||1;face=face||1;ctx.save();ctx.translate(x,y);ctx.scale(face*s,s);
  if(light>0)alphaDo(light,()=>{const g=ctx.createLinearGradient(24,0,150,0);g.addColorStop(0,'rgba(255,244,200,.5)');g.addColorStop(1,'rgba(255,244,200,0)');poly([24,-2,150,-44,150,48,24,8],g);});
  box(-26,-4,50,15,'#2b3137');box(-26,-19,50,15,'#f2c230');ln([-26,-12,24,-12],'rgba(0,0,0,.25)',1);
  box(-33,-15,7,9,'#555');box(-33,2,7,8,'#555');circ(22,4,4.2,'#394650');circ(23,4,1.7,'#7dffc4');
  box(16,-25,4,6,'#e8572a');
  if(brush){ln([18,11,34,16],'#8a99a3',3);const a=TT*12;circ(38,16,8,'#3d4b55');for(let i=0;i<4;i++){const b=a+i*Math.PI/2;ln([38,16,38+Math.cos(b)*9,16+Math.sin(b)*9],'#c9d1d5',1.4);}}
  ctx.restore();
}
/* diver, drawn facing right */
function diver30(x,y,s,face){
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
/* yellow tether from p to q with sag */
function tether30(x0,y0,x1,y1){ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2+30,Math.max(y0,y1)+30,x1,y1);ctx.strokeStyle='#f2c230';ctx.lineWidth=1.4;ctx.stroke();}
/* water gradient for redrawing water inside a scour pit */
function waterGrad30(){const g=ctx.createLinearGradient(0,SEA,0,780);g.addColorStop(0,'#3b93bb');g.addColorStop(.45,'#1d6690');g.addColorStop(1,'#0b3858');return g;}
const POT30=[-0.6,-1.2]; // potential scale (V vs Ag/AgCl)

const EP={no:30,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'水下結構檢查',en:'Subsea structure inspection',
lede:'風機的基礎有一大半泡在海裡，看不到的部分更要定期檢查。這一集看潛水員與遙控水下載具（ROV）如何分工，先清掉附著在樁上的海生物，再量測陰極保護電位、近觀檢查焊道，最後用多波束聲納測量基礎周圍的海床，看海流有沒有把樁腳的砂掏空。',
facts:[['−0.80','V','保護電位門檻（相對 Ag/AgCl 參考電極），比它更負才算受到保護'],['約 −1.05','V','鋁合金犧牲陽極在海水中的典型電位'],['1.3','倍樁徑','缺少現場資料時，設計常用的淘刷深度估計（DNV）'],['約 50','m','空氣潛水的典型深度上限，更深改用 ROV 或飽和潛水'],['約 100','mm','海生物附著厚度的設計假設（典型範例）'],['1','年','淘刷測深與陰極保護量測的常見週期（典型）']],
note:'說明：本集為教育用途示意動畫，尺寸與距離經過壓縮。保護電位門檻 −0.80 V（Ag/AgCl）與鋁合金陽極電位依 DNV-RP-B401、EN 12495 等海水陰極保護規範；過度保護上限 −1.10 V 為高強度鋼常用的典型值。淘刷深度 1.3 倍樁徑為 DNV 在缺少現場資料時建議的設計估計；空氣潛水深度上限為商業潛水的一般做法。海生物厚度、潮流流速、潛水與 ROV 的作業流速上限、電位讀數、淘刷量測結果與檢查週期皆為典型範例，實際依風場設計、主管機關要求與業主的檢查計畫而定，不代表特定風場。',
shots:[
/* 1 */{t:'檢查船抵達，ROV 下水',en:'Going below the waterline',dur:13,side:true,
 d:'單樁基礎從轉接段以下就泡在海裡，台灣海峽的風場水深約 30 到 50 公尺，看不到的部分占了整個基礎的一大半。水下檢查通常每年安排一次，也會在颱風或異常監測數據後加做。檢查作業船抵達風機旁，先確認潮流、風浪與能見度，再放下遙控水下載具（ROV）。ROV 拖著臍帶纜下潛，由船上的操作員以攝影機與聲納引導，逐段沿著樁身往下看。',
 s:[[0,'檢查作業船抵達風機旁，先確認潮流與能見度'],[.3,'遙控水下載具（ROV）拖著臍帶纜下水'],[.55,'操作員以攝影機與聲納引導 ROV 靠近樁身'],[.78,'水面下的樁身長滿海生物，要逐段檢查']],
 cam:u=>camMix({x:800,y:430,s:1},{x:760,y:580,s:1.7},ease(seg(u,.38,.72))),
 draw(u){
  for(const [x,s,p] of [[180,.55,.4],[1000,.45,1.7],[1200,.4,2.6]])far30(x,s,TT*.9+p);
  turb30(TX,TT*.6);
  growth30(TX,PILE_W/2);
  const vx=lerp(1240,760,ease(seg(u,0,.3)));
  const wl=vsl(vx,230,false,{tilt:.6},vSOV);
  const L={x:vx+30,y:wl+6};
  const R=kf(u,[[0,L.x,wl-30],[.3,L.x,wl-30],[.36,L.x,wl+14],[.52,L.x-10,580],[.72,TX+70,600],[1,TX+62,640]]);
  if(u>.3){tether30(L.x,wl-8,R.x+14,R.y-18);irov30(R.x,R.y,1,-1,seg(u,.6,.68));}
  school(380,560,9,7,TT,40,1);school(900,650,7,9,TT,30,-1);
  lab(vx+120,wl-60,'檢查作業船',{dx:60,dy:-50,a:band(u,.06,.34)});
  lab(R.x,R.y-10,'ROV（遙控水下載具）',{dx:80,dy:-30,a:band(u,.34,.7),st:'s'});
  lab(TX,520,'單樁基礎',{dx:-110,dy:-20,a:band(u,.5,.78)});
  lab(TX-PILE_W/2,630,'海生物附著',{dx:-110,dy:20,a:band(u,.74,1),st:'w'});
 },
 hud(u){hudPanel(230,150,'作業條件（示例）',seg(u,.04,.1),w=>{
  hrow(52,'水深','35 m',w);
  const v=lerp(1.4,.6,ease(seg(u,0,.4)));hrow(78,'潮流',v.toFixed(1)+' kn',w,v<1?'#7dffc4':'#f2c230');hbar(14,86,w-28,v/2.5,v<1?'#7dffc4':'#f2c230');
  hrow(118,'能見度','3–5 m',w);
  hrow(142,'ROV',u<.32?'待命':'下潛中',w,u<.32?'rgba(227,236,238,.8)':'#7dffc4');});}},
/* 2 */{t:'潛水員與 ROV 分工',en:'Divers and ROVs',dur:13,
 d:'水下檢查由潛水員與 ROV 分工。潛水員的雙手靈活，適合清除海生物、手持儀器量測與狹窄處的細部檢查，但空氣潛水一般只在約 50 公尺以內，還要計算減壓時間。ROV 不受減壓限制，可以連續工作數小時，搭載聲納與量測探棒，但精細手工不如人。台灣海峽潮流強，潛水員只能在平潮前後流速變小的窗口下水，ROV 可接受的流速較高，作業時間也比較長。',
 s:[[0,'潛水員雙手靈活，適合細部清除與量測'],[.25,'ROV 不受減壓限制，可連續工作數小時'],[.5,'台灣海峽潮流強，流速隨漲退潮變化'],[.74,'潛水員只能在平潮前後的短窗口下水']],
 draw(u){
  diagBG();
  const C=[[60,'潛水員',[['g','雙手作業靈活，適合清除與手持量測'],['g','可進入狹窄或複雜的結構間'],['w','空氣潛水約 50 m 以內，須計算減壓'],['w','只能在平潮前後的短窗口下水']],.02],
           [820,'ROV（遙控水下載具）',[['g','可連續作業數小時，不受減壓限制'],['g','搭載聲納、攝影機與量測探棒'],['w','強流中不易定位'],['w','精細手工作業不如潛水員']],.22]];
  C.forEach((c,ci)=>{const a=seg(u,c[3],c[3]+.06);if(a<=0)return;alphaDo(a,()=>{
   const x=c[0],hi=ci?(u>.22&&u<.48):(u<.22);
   card(x,150,720,400,{bg:'rgba(7,27,39,.8)',st:hi?'#f2c230':'rgba(255,255,255,.16)'});
   wt(x+24,192,c[1],22,'#f2c230',700);
   card(x+24,220,230,300,{bg:'rgba(29,102,144,.35)',st:false,r:6});
   for(let i=0;i<5;i++){const q=(TT*.3+i/5)%1;circ(x+60+i*40,500-q*270,2,`rgba(220,245,255,${.4*(1-q)})`);}
   if(ci)irov30(x+130,380,2.4,1,0);else diver30(x+150,370,2.6,1);
   c[2].forEach((t,i)=>{const b=seg(u,c[3]+.04+i*.04,c[3]+.08+i*.04);alphaDo(b,()=>{const y=246+i*74;
    circ(x+284,y-6,6,t[0]==='g'?'#7dffc4':'#e8572a');
    wrap30(x+302,y,t[1],390,18,t[0]==='g'?'#fff':'#ff9d7a',500,25);});});
  });});
  // tidal current chart
  const a=seg(u,.46,.52);if(a<=0)return;alphaDo(a,()=>{
   const c=chartBox(60,580,1480,220,{x0:0,x1:24,y0:0,y1:3,xt:[0,6,12,18,24],yt:[0,1,2,3],yl:'流速（kn）',pt:60,pb:56,gx:4,gy:3});
   wt(1520,612,'潮流與作業窗口（示例）',18,'#f2c230',700,'right');
   wt(c.px+c.pw,c.py+c.ph+46,'時間（h）',15,'rgba(227,236,238,.7)',500,'right');
   const v=t=>.15+2.3*Math.abs(Math.sin(TAU*t/12.42+.4));
   // diver windows where v<1
   if(u>.74)alphaDo(seg(u,.74,.8),()=>{let on=null;for(let t=0;t<=24.01;t+=.05){const ok=v(t)<1;if(ok&&on===null)on=t;if((!ok||t>=24)&&on!==null){box(c.X(on),c.py,c.X(t)-c.X(on),c.ph,'rgba(125,255,196,.16)');on=null;}}});
   const f=ease(seg(u,.52,.74)),P=[];for(let t=0;t<=24*f;t+=.1)P.push({x:c.X(t),y:c.Y(v(t))});pathLine(P,'#58b8d0',3);
   ctx.setLineDash([7,5]);ln([c.px,c.Y(1),c.px+c.pw,c.Y(1)],'#e8572a',2);ln([c.px,c.Y(2.5),c.px+c.pw,c.Y(2.5)],'#f2c230',1.6);ctx.setLineDash([]);
   tag(c.px+c.pw-8,c.Y(1)-16,'潛水作業上限',{bg:'#e8572a',fg:'#fff',size:14,align:'right'});
   tag(c.px+c.pw-8,c.Y(2.5)-16,'ROV 作業上限',{bg:'#f2c230',size:14,align:'right'});
   if(u>.78)alphaDo(seg(u,.78,.84),()=>tag(c.X(6.2),c.py+c.ph-20,'平潮窗口',{bg:'#7dffc4',size:14,align:'center'}));
  });
 }},
/* 3 */{t:'清除海生物附著',en:'Removing marine growth',dur:13,side:true,
 d:'台灣海域水溫高，貽貝、藤壺與藻類長得很快，幾年內就能在樁身覆上一層厚殼。附著物會增加樁的直徑與表面粗糙度，讓波浪與海流的力量變大，設計時常假設約 100 毫米的厚度（典型範例）。它也會蓋住焊道與陽極，所以檢查前要先量測附著厚度，再用旋轉刷或高壓水刀把要檢查的位置清到露出金屬面。清除只做必要的範圍，以免破壞塗層。',
 s:[[0,'樁身覆滿貽貝、藤壺與藻類'],[.22,'潛水員先量測附著厚度，記錄在檢查表'],[.45,'ROV 以旋轉刷清除要檢查的區段'],[.76,'露出金屬面與焊道，準備近觀檢查']],
 cam:u=>({x:TX-30,y:625,s:2.5}),
 draw(u){
  turb30(TX,TT*.6);
  const p=ease(seg(u,.42,.82)),c0=548,c1=c0+p*96;
  growth30(TX,PILE_W/2,y=>y>c0&&y<c1?0:1);
  alphaDo(seg(u,.7,.8),()=>{ln([TX-PILE_W/2,600,TX+PILE_W/2,600],'#c9d1d5',2.4);ln([TX-PILE_W/2,602.5,TX+PILE_W/2,602.5],'rgba(60,70,80,.6)',1);});
  if(p>0&&p<1)for(let i=0;i<10;i++){const q=(TT*1.2+i/10)%1;circ(TX+20+q*40,c1+(i%3-1)*6-q*20,1.4,`rgba(180,170,140,${.7*(1-q)})`);}
  const D=kf(u,[[0,TX-90,520],[.12,TX-46,556],[.4,TX-46,560],[.5,TX-100,500],[1,TX-130,490]]);
  diver30(D.x,D.y,.9,1);
  if(u>.14&&u<.42)alphaDo(seg(u,.14,.18),()=>{box(TX-PILE_W/2-14,566,14,2,'#f2c230');ln([TX-PILE_W/2-14,562,TX-PILE_W/2-14,570],'#f2c230',1.2);});
  const R=kf(u,[[0,TX+120,520],[.4,TX+48,546],[.82,TX+48,c0+96],[1,TX+80,640]]);
  tether30(TX+200,440,R.x+10,R.y-18);irov30(R.x,R.y,.8,-1,.5,u>.4&&u<.84);
  school(TX-180,650,6,4,TT,24,1);
  lab(TX+PILE_W/2,520,'貽貝與藤壺',{dx:70,dy:-30,a:band(u,.02,.3),minor:true});
  lab(TX-PILE_W/2-3,610,'藻類',{dx:-60,dy:30,a:band(u,.02,.3),minor:true});
  lab(TX-PILE_W/2-7,566,'附著厚度量測',{dx:-80,dy:-40,a:band(u,.2,.44),st:'s'});
  lab(R.x-30,R.y+12,'ROV 旋轉刷清除',{dx:80,dy:40,a:band(u,.44,.76),st:'s'});
  lab(TX-PILE_W/2,600,'露出金屬面與焊道',{dx:-120,dy:40,a:band(u,.78,1),st:'g'});
 },
 hud(u){hudPanel(230,130,'附著與清除（示例）',seg(u,.04,.1),w=>{
  const t=Math.round(85*ease(seg(u,.18,.34)));hrow(52,'附著厚度',t+' mm',w,'#f2c230');
  hrow(78,'設計假設','100 mm',w);
  const p=seg(u,.42,.82);hrow(106,'清除進度',Math.round(p*100)+'%',w,'#7dffc4');hbar(14,114,w-28,p,'#7dffc4');});}},
/* 4 */{t:'量測陰極保護電位',en:'Measuring cathodic protection',dur:14,
 d:'海水中的鋼材會慢慢腐蝕，所以樁上裝了鋁合金犧牲陽極，讓陽極代替鋼材被消耗。檢查時 ROV 把附有 Ag/AgCl 參考電極的探棒貼在鋼材上，讀出鋼材對海水的電位。比 −0.80 V 更負代表受到保護；不夠負表示陽極不足或失效；比約 −1.10 V 還負則是過度保護，高強度鋼可能產生氫脆。每個陽極也要目視估計剩餘量，推算還能用多少年。',
 s:[[0,'樁上的鋁合金陽極代替鋼材被消耗'],[.24,'ROV 以參考電極探棒貼近鋼材讀取電位'],[.5,'比 −0.80 V 更負，代表鋼材受到保護'],[.75,'目視估計陽極剩餘量，推算剩餘壽命']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'犧牲陽極與電位量測（示意）',20,'#fff',700);
  const PX=300,PT=230,PBm=760;
  box(84,PT,672,PBm-PT,'rgba(29,102,144,.22)');
  wt(96,PT+20,'海面',14,'rgba(227,236,238,.7)',500);
  box(84,PBm,672,22,'#a4876a');wt(96,PBm+17,'海床',14,'#13232e',600);
  const pg=ctx.createLinearGradient(PX-36,0,PX+36,0);pg.addColorStop(0,'#3d4b55');pg.addColorStop(.4,'#8093a0');pg.addColorStop(1,'#33404a');box(PX-36,PT-20,72,PBm-PT+42,pg);
  const AN=[360,500,640];
  // protective current from anodes to steel
  const cur=seg(u,.06,.2);
  AN.forEach((y,i)=>{box(PX+36,y-26,12,52,'#8a99a3');box(PX+48,y-30,26,60,'#c9d1d5','#6b7780',1.2);
   if(cur>0)alphaDo(cur,()=>{for(let k=0;k<5;k++){const q=(TT*.5+k/5)%1,a=-1.2+q*2.4;const ex=PX+61+Math.cos(a*.9)*60*(.4+Math.sin(q*Math.PI)),ey=y+Math.sin(a)*90*q;circ(ex,ey,2.6,'#7dffc4');}});});
  alphaDo(band(u,.04,.3),()=>{wt(PX+90,AN[0]-36,'鋁合金陽極',16,'#c9d1d5',700);wt(PX+90,AN[1]+60,'保護電流',16,'#7dffc4',700);});
  // ROV with probe moving along the pile
  const ry=kf(u,[[0,560,300],[.24,560,300],[.36,560,430],[.6,560,430],[.72,560,700],[1,560,700]]);
  if(u>.18)alphaDo(seg(u,.18,.24),()=>{const pr=seg(u,.28,.34)-seg(u,.6,.64)+seg(u,.74,.8);const tipX=lerp(PX+120,PX+37,clamp(pr));
   ln([ry.x-40,ry.y+10,tipX,ry.y+10],'#c9d1d5',3);circ(tipX,ry.y+10,5,'#f2c230');irov30(ry.x,ry.y,1.2,-1,0);
   tether30(ry.x+30,ry.y-20,740,PT);
   alphaDo(band(u,.26,.5),()=>wt(ry.x,ry.y-40,'Ag/AgCl 參考電極',15,'#f2c230',700,'center'));});
  // reading box
  const rd=u<.6?-0.95:-1.02,vis=seg(u,.32,.38);
  alphaDo(vis,()=>{card(92,630,164,100,{bg:'#13232e',st:'#7dffc4'});const v=lerp(-0.6,rd,ease(seg(u,.32,.42)));
   wt(174,660,'讀數',14,'rgba(227,236,238,.75)',600,'center');wt(174,710,v.toFixed(2)+' V',34,'#7dffc4',700,'center',COND);});
  // right: potential scale
  card(820,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(844,190,'電位判讀（相對 Ag/AgCl）',20,'#fff',700);
  const SX=880,ST=230,SB=600,Y=v=>lerp(ST,SB,(v-POT30[0])/(POT30[1]-POT30[0]));
  const Z=[[-0.6,-0.8,'#e8572a','保護不足','腐蝕風險，檢查陽極',.4],[-0.8,-1.1,'#7dffc4','保護範圍','鋼材受到保護',.48],[-1.1,-1.2,'#b37cff','過度保護','高強度鋼可能氫脆',.56]];
  Z.forEach(z=>{const a=seg(u,z[5],z[5]+.05);alphaDo(.25+.75*a,()=>{box(SX,Y(z[0]),36,Y(z[1])-Y(z[0]),z[2]);});
   alphaDo(a,()=>{const ym=(Y(z[0])+Y(z[1]))/2;wt(SX+60,ym-4,z[3],19,z[2],700);wt(SX+60,ym+22,z[4],15,'rgba(227,236,238,.85)',500);});});
  for(const v of [-0.6,-0.8,-1.0,-1.1,-1.2])wt(SX-10,Y(v)+5,v.toFixed(2),15,'rgba(227,236,238,.75)',600,'right',COND);
  alphaDo(seg(u,.5,.56),()=>{ctx.setLineDash([5,4]);ln([SX-4,Y(-1.05),1300,Y(-1.05)],'rgba(201,209,213,.8)',1.4);ctx.setLineDash([]);wt(1310,Y(-1.05)+5,'陽極約 −1.05 V',15,'#c9d1d5',600);});
  if(vis>0){const v=lerp(-0.6,rd,ease(seg(u,.32,.42)));alphaDo(vis,()=>{poly([SX+40,Y(v),SX+54,Y(v)-8,SX+54,Y(v)+8],'#fff');poly([SX-4,Y(v),SX-18,Y(v)-8,SX-18,Y(v)+8],'#fff');});}
  // anode depletion
  const b=seg(u,.74,.8);if(b>0)alphaDo(b,()=>{box(844,630,672,1,'rgba(255,255,255,.14)');wt(844,664,'陽極剩餘量（目視估計，示例）',18,'#f2c230',700);
   const A=[['新品',1],['5 年後',.7],['本次',.55]];
   A.forEach((q,i)=>{const x=860+i*200;box(x,690,150,26,'rgba(201,209,213,.18)','rgba(201,209,213,.5)',1);box(x,690,150*q[1]*ease(seg(u,.78+i*.03,.86+i*.03)),26,'#c9d1d5');
    wt(x,740,q[0],15,'rgba(227,236,238,.85)',600);wt(x+150,740,Math.round(q[1]*100)+'%',18,i===2?'#7dffc4':'#fff',700,'right',COND);});
   wrap30(844,778,'依消耗速度推算陽極剩餘壽命',660,15,'rgba(227,236,238,.8)',500,22);});
 }},
/* 5 */{t:'焊道近觀檢查',en:'Close visual inspection of welds',dur:13,
 d:'單樁由多段鋼管環焊接成，焊道與附屬構件的焊接處是應力集中的地方。風與波浪讓結構在 25 年間承受上億次反覆荷載（示例），疲勞裂紋多從焊趾開始。清出金屬面後，先以攝影機近觀目視（CVI），再用交流電磁場檢測（ACFM）沿焊道掃描：探頭在海水中不必磨掉塗層，經過裂紋時磁場訊號會出現明顯的凹陷與峰谷，就能標出裂紋位置與長度。',
 s:[[0,'焊道是應力集中處，疲勞裂紋多從焊趾開始'],[.25,'清出金屬面後，先以攝影機近觀目視'],[.48,'ACFM 探頭沿焊道掃描，不必磨掉塗層'],[.72,'經過裂紋時，磁場訊號出現凹陷與峰谷']],
 draw(u){
  diagBG();
  card(60,150,880,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'環焊道近觀（示意）',20,'#fff',700);
  const X0=84,X1=916,WY=360;
  const sg=ctx.createLinearGradient(0,220,0,500);sg.addColorStop(0,'#6f818c');sg.addColorStop(.5,'#8a9ba5');sg.addColorStop(1,'#66777f');box(X0,220,X1-X0,280,sg);
  box(X0,WY-34,X1-X0,68,'rgba(170,140,100,.18)');
  box(X0,WY-18,X1-X0,36,'#9aa7ae');for(let x=X0+4;x<X1;x+=11){ctx.beginPath();ctx.ellipse(x,WY,6,16,0,-Math.PI/2,Math.PI/2);ctx.strokeStyle='rgba(60,70,80,.45)';ctx.lineWidth=1.1;ctx.stroke();}
  alphaDo(band(u,.04,.3),()=>{wt(X1-16,WY-44,'熱影響區',15,'#e3d9b8',600,'right');wt(X1-16,WY+6,'焊道',16,'#13232e',700,'right');wt(X1-16,WY+66,'焊趾',15,'#f2c230',700,'right');ln([X1-60,WY+52,X1-60,WY+20],'#f2c230',1.4);});
  // crack at weld toe
  const CX0=440,CX1=540,CY=WY+19;
  const vis=seg(u,.28,.34);alphaDo(.25+.75*vis,()=>ln([CX0,CY,CX0+20,CY+2,CX0+45,CY-1,CX0+70,CY+2,CX1,CY],'#1c1f24',2));
  // CVI camera frame
  alphaDo(band(u,.24,.46),()=>{ctx.setLineDash([6,4]);ctx.strokeStyle='#f2c230';ctx.lineWidth=2;ctx.strokeRect(CX0-50,CY-60,CX1-CX0+100,110);ctx.setLineDash([]);
   wt(CX0-50,CY-70,'近觀目視（CVI）',16,'#f2c230',700);});
  // ACFM probe scanning along the toe
  const sp=ease(seg(u,.48,.84)),PXp=lerp(X0+40,X1-40,sp);
  if(u>.46){box(PXp-12,CY+6,24,30,'#e8572a');box(PXp-4,CY+36,8,40,'#394650');circ(PXp,CY+4,4,'#fff');}
  // ACFM signal chart
  const c=chartBox(84,530,832,250,{x0:0,x1:1,y0:-1,y1:1,pl:30,pr:20,pt:48,pb:24,gx:8,gy:4});
  wt(108,562,'ACFM 訊號（示意）',17,'#f2c230',700);
  const xs=x=>(x-(X0+40))/(X1-X0-80),c0=xs(CX0),c1=xs(CX1);
  const bx=s=>.35-.75*Math.exp(-Math.pow((s-(c0+c1)/2)/((c1-c0)/2.2),6))+.02*Math.sin(s*90);
  const bz=s=>.7*(Math.exp(-Math.pow((s-c0)/.03,2))-Math.exp(-Math.pow((s-c1)/.03,2)))-.45+.02*Math.sin(s*70);
  const P1=[],P2=[];for(let s=0;s<=sp;s+=.004){P1.push({x:c.X(s),y:c.Y(bx(s))});P2.push({x:c.X(s),y:c.Y(bz(s))});}
  pathLine(P1,'#58b8d0',2.4);pathLine(P2,'#b37cff',2.4);
  wt(880,600,'Bx',15,'#58b8d0',700,'right',COND);wt(880,724,'Bz',15,'#b37cff',700,'right',COND);
  if(sp>c1+.02)alphaDo(seg(u,.72,.76),()=>{box(c.X(c0),c.py,c.X(c1)-c.X(c0),c.ph,'rgba(232,87,42,.18)');
   tag((c.X(c0)+c.X(c1))/2,c.py+14,'裂紋指示',{bg:'#e8572a',fg:'#fff',size:14,align:'center'});
   ring((CX0+CX1)/2,CY,62,'#e8572a',2.2);});
  // right: steps
  card(980,150,560,650,{bg:'rgba(7,27,39,.8)'});wt(1004,190,'檢查步驟',20,'#fff',700);
  const S=[['清除到金屬面','只清必要範圍',0],['近觀目視（CVI）','攝影機加比例尺',.24],['ACFM 掃描','沿焊趾找裂紋',.46],['記錄與比對','位置、長度和歷年資料比較',.76]];
  S.forEach((s,i)=>{const on=u>=s[2]&&(i===3||u<S[i+1][2]),done=i<3&&u>=S[i+1][2],y=230+i*104;
   card(1004,y,512,88,{bg:on?'rgba(242,194,48,.14)':'rgba(255,255,255,.04)',st:on?'#f2c230':'rgba(255,255,255,.12)'});
   circ(1044,y+44,20,done?'#7dffc4':on?'#f2c230':'rgba(255,255,255,.18)');wt(1044,y+52,String(i+1),22,'#0e2a3b',700,'center',COND);
   wt(1080,y+38,s[0],19,on?'#f2c230':'#fff',700);wt(1080,y+68,s[1],15,'rgba(227,236,238,.8)',500);});
  alphaDo(seg(u,.06,.12),()=>{box(1004,660,512,1,'rgba(255,255,255,.14)');
   wt(1004,700,'25 年反覆荷載（示例）',16,'rgba(227,236,238,.85)',600);wt(1516,708,'上億次',30,'#f2c230',700,'right');
   wrap30(1004,746,'波浪週期約 7 秒，25 年約 1 億次以上',512,15,'rgba(227,236,238,.75)',500,22);});
 }},
/* 6 */{t:'測量基礎淘刷',en:'Measuring seabed scour',dur:14,side:true,
 d:'海流繞過樁身時會加速並形成漩渦，把樁腳附近的砂帶走，形成淘刷坑。淘刷越深，樁埋在土裡的長度就越短，基礎的勁度與自然頻率也會跟著改變。檢查船以多波束聲納（MBES）掃過基礎周圍，畫出海床地形，再和施工後與前次的測量比較。缺少現場資料時，設計常以 1.3 倍樁徑估計淘刷深度；若接近設計值，就要排入拋石補強，這是下一集的主題。',
 s:[[0,'海流繞過樁身加速，把樁腳的砂帶走'],[.25,'多波束聲納掃過基礎周圍，畫出海床地形'],[.52,'和施工後與前次的測量比較淘刷深度'],[.76,'接近設計值時，就要排入拋石補強']],
 cam:u=>({x:800,y:450,s:1}),
 draw(u){
  for(const [x,s,p] of [[180,.55,.4],[1240,.42,2.6]])far30(x,s,TT*.9+p);
  // scour pit (redraw water below the seabed near the pile)
  const dep=lerp(10,22,ease(seg(u,.02,.3))),pit=x=>dep*clamp(1-(Math.abs(x-TX)-PILE_W/2)/120);
  ctx.save();ctx.beginPath();ctx.moveTo(TX-150,bedY(TX-150));for(let x=TX-150;x<=TX+150;x+=4)ctx.lineTo(x,bedY(x)+pit(x));
  for(let x=TX+150;x>=TX-150;x-=4)ctx.lineTo(x,bedY(x)-1);ctx.closePath();ctx.fillStyle=waterGrad30();ctx.fill();ctx.restore();
  turb30(TX,TT*.6);growth30(TX,PILE_W/2);
  // current eddies around the pile
  alphaDo(band(u,0,.3),()=>{for(let i=0;i<6;i++){const q=(TT*.6+i/6)%1,x=TX-200+q*360,y=PB30-24+Math.sin(q*TAU+i)*5;
   if(Math.abs(x-TX)<PILE_W)continue;ln([x,y,x+22,y],`rgba(220,245,255,${.6*Math.sin(q*Math.PI)})`,1.6);}
   for(let i=0;i<2;i++){const a=TT*3+i*Math.PI;ring(TX+PILE_W/2+14+i*24,PB30-8+i*3,7,'rgba(220,245,255,.45)',1.2);circ(TX+PILE_W/2+14+i*24+Math.cos(a)*7,PB30-8+i*3+Math.sin(a)*7,1.6,'#fff');}});
  // survey vessel with multibeam fan
  const wl=vsl(700,110,false,{tilt:.6},vSmallWork);
  const SX=760,sw=seg(u,.22,.62);
  if(sw>0&&sw<1)alphaDo(Math.min(1,seg(u,.22,.26)*1)*(1-seg(u,.6,.62)),()=>{const sx=lerp(TX-200,TX+200,(Math.sin(TT*1.4)+1)/2);
   const g=ctx.createLinearGradient(0,wl,0,PB30);g.addColorStop(0,'rgba(125,255,196,.05)');g.addColorStop(1,'rgba(125,255,196,.28)');
   poly([SX,wl+8,sx-130,bedY(sx-130)+pit(sx-130),sx+130,bedY(sx+130)+pit(sx+130)],g);
   for(let x=sx-130;x<=sx+130;x+=10)circ(x,bedY(x)+pit(x),1.6,'#7dffc4');});
  // survey points left on the seabed
  if(u>.3)alphaDo(seg(u,.3,.4)*(1-seg(u,.9,1)*.5),()=>{for(let x=TX-200;x<=TX+200;x+=8){if(Math.abs(x-TX)<PILE_W/2+1)continue;circ(x,bedY(x)+pit(x),1.3,'#7dffc4');}});
  lab(TX+PILE_W/2+40,PB30+dep*.6,'淘刷坑',{dx:90,dy:40,a:band(u,.08,.5),st:'w'});
  lab(TX-60,PB30-30,'海流繞樁加速',{dx:-100,dy:-40,a:band(u,.02,.26)});
  lab(SX,wl+4,'多波束聲納（MBES）',{dx:80,dy:-70,a:band(u,.24,.6),st:'g'});
  // inset: scour profile chart
  const a=seg(u,.46,.52);if(a>0)alphaDo(a,()=>{
   const c=chartBox(960,140,580,300,{x0:-30,x1:30,y0:-12,y1:1,xt:[-30,-15,0,15,30],yt:[0,-4,-8,-12],yl:'深度（m）',pt:48,pb:44,pl:60,gx:4,gy:4});
   wt(1520,170,'淘刷剖面（示例）',18,'#f2c230',700,'right');
   const D=8,prof=(x,d)=>{const r=Math.abs(x);return r<D/2?null:-d*clamp(1-(r-D/2)/14);};
   const line=(d,col,lw,f)=>{const P=[];for(let x=-30;x<=30*(2*f-1)+.01;x+=.25){const v=prof(x,d);if(v===null){if(P.length)pathLine(P,col,lw);P.length=0;continue;}P.push({x:c.X(x),y:c.Y(v)});}pathLine(P,col,lw);};
   line(0,'rgba(227,236,238,.6)',1.6,1);
   line(2.6,'#58b8d0',2,seg(u,.52,.6));
   line(4.2,'#ff9d7a',2.6,seg(u,.6,.72));
   box(c.X(-D/2),c.py,c.X(D/2)-c.X(-D/2),c.ph,'rgba(128,147,160,.85)');wt(c.X(0),c.py+20,'樁',15,'#13232e',700,'center');
   alphaDo(seg(u,.74,.8),()=>{ctx.setLineDash([7,5]);ln([c.px,c.Y(-10.4),c.px+c.pw,c.Y(-10.4)],'#e8572a',2);ctx.setLineDash([]);
    tag(c.px+c.pw-8,c.Y(-10.4)-16,'設計淘刷 1.3D ≈ 10.4 m',{bg:'#e8572a',fg:'#fff',size:13,align:'right'});});
   const L=[['施工後','rgba(227,236,238,.6)',.5],['前次','#58b8d0',.52],['本次','#ff9d7a',.6]];
   L.forEach((l,i)=>alphaDo(seg(u,l[2],l[2]+.04),()=>{const x=c.px+14+i*120;ln([x,c.py+c.ph-16,x+22,c.py+c.ph-16],l[1],3);wt(x+28,c.py+c.ph-11,l[0],14,'rgba(227,236,238,.9)',600);}));
   alphaDo(seg(u,.64,.7),()=>{card(960,456,580,96,{bg:'rgba(7,27,39,.86)'});
    wt(984,494,'本次最大淘刷深度',16,'rgba(227,236,238,.85)',600);wt(1516,500,'4.2 m',34,'#ff9d7a',700,'right',COND);
    wt(984,530,'樁徑 8 m（示例），約 0.5D',15,'rgba(227,236,238,.75)',500);});
  });
 }}
]};
