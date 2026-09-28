// KITS: marine
/* ================= EP14 浮動式離岸風電 ================= */
/* Floaters and turbines are drawn in a common local scale: PXM local px per metre, waterline at y=0. */
const PXM=2.2;
let WAMP=4,BEDF=x=>700,SHORE=1e9;
const sm14=(a,b,t)=>{t=clamp(t);return lerp(a,b,t*t*(3-2*t));};
function tb14(T,x){if(x<=T[0][0])return T[0][1];for(let i=1;i<T.length;i++)if(x<=T[i][0])return sm14(T[i-1][1],T[i][1],(x-T[i-1][0])/(T[i][0]-T[i-1][0]));return T[T.length-1][1];}
function sw(x){const k=clamp((SHORE-x)/90);return SEA+k*WAMP*(.72*Math.sin(x*.0105-TT*1.25)+.28*Math.sin(x*.027+TT*1.8+1));}
/* keep the top-left chapter card area clear of clouds and streaks */
function offCard(x,y){const p=toScreen(x,y);return (p.y<cssH*.27)?clamp((p.x-cssW*.33)/(cssW*.06)):1;}
const CL14=[[760,86,.8,4],[1060,150,.6,3],[1400,64,.9,5],[560,196,.55,3.5],[250,120,.7,3]];
function sky14(){
  const g=ctx.createLinearGradient(0,-120,0,SEA);g.addColorStop(0,'#4f8fc4');g.addColorStop(.55,'#9cc6df');g.addColorStop(1,'#e2eff2');
  ctx.fillStyle=g;ctx.fillRect(VX0,VY0,VX1-VX0,SEA+10-VY0);
  const sx=1290,sy=110,rg=ctx.createRadialGradient(sx,sy,10,sx,sy,230);
  rg.addColorStop(0,'rgba(255,248,222,.85)');rg.addColorStop(.25,'rgba(255,244,214,.35)');rg.addColorStop(1,'rgba(255,244,214,0)');
  ctx.fillStyle=rg;ctx.fillRect(sx-240,sy-240,480,480);circ(sx,sy,20,'#fff8e2');
  for(const c of CL14){const x=c[0]+40*Math.sin(TT*.03*c[3]+c[0]);const a=offCard(x-40*c[2],c[1]-30*c[2]);if(a>0)cloud(x,c[1],c[2],.92*a);}
  const hz=ctx.createLinearGradient(0,SEA-70,0,SEA);hz.addColorStop(0,'rgba(255,255,255,0)');hz.addColorStop(1,'rgba(255,255,255,.4)');
  ctx.fillStyle=hz;ctx.fillRect(VX0,SEA-70,VX1-VX0,72);
}
function surf14(x0,x1){ctx.moveTo(x0,sw(x0));for(let x=x0;x<=x1;x+=8)ctx.lineTo(x,sw(x));ctx.lineTo(x1,sw(x1));}
function water14(){
  const xe=Math.min(VX1,SHORE+10);if(xe<=VX0)return;
  const g=ctx.createLinearGradient(0,SEA,0,900);g.addColorStop(0,'#3b93bb');g.addColorStop(.4,'#1d6690');g.addColorStop(1,'#082c47');
  ctx.beginPath();surf14(VX0,xe);ctx.lineTo(xe,VY1+10);ctx.lineTo(VX0,VY1+10);ctx.closePath();ctx.fillStyle=g;ctx.fill();
}
function soilPath(off){ctx.beginPath();ctx.moveTo(VX0,BEDF(VX0)+off);for(let x=VX0;x<=VX1;x+=8)ctx.lineTo(x,BEDF(x)+off+(off?nz(x*.012+off)*4:0));ctx.lineTo(VX1,BEDF(VX1)+off);ctx.lineTo(VX1,VY1+30);ctx.lineTo(VX0,VY1+30);ctx.closePath();}
function soil14(){
  soilPath(0);ctx.fillStyle='#d9c393';ctx.fill();soilPath(24);ctx.fillStyle='#a4876a';ctx.fill();soilPath(80);ctx.fillStyle='#8a7560';ctx.fill();
  ctx.beginPath();ctx.moveTo(VX0,BEDF(VX0));for(let x=VX0;x<=VX1;x+=5)ctx.lineTo(x,BEDF(x));ctx.strokeStyle='#a98a58';ctx.lineWidth=2.2;ctx.stroke();
  if(SHORE<VX1){const g0=Math.max(VX0,SHORE+20);ctx.beginPath();ctx.moveTo(g0,BEDF(g0));for(let x=g0;x<=VX1;x+=6)ctx.lineTo(x,BEDF(x)-1.5);for(let x=VX1;x>=g0;x-=6)ctx.lineTo(x,BEDF(x)+5);ctx.closePath();ctx.fillStyle='#78a557';ctx.fill();}
}
function region14(){const xe=Math.min(VX1,SHORE);ctx.beginPath();surf14(VX0,xe);for(let x=xe;x>=VX0;x-=8)ctx.lineTo(x,BEDF(x));ctx.lineTo(VX0,BEDF(VX0));ctx.closePath();}
function B14(bed,amp,shore){return u=>{BEDF=bed;WAMP=typeof amp==='function'?amp(u):amp;SHORE=shore||1e9;sky14();water14();soil14();};}
function E14(){
  if(VX0>SHORE)return;
  ctx.save();region14();ctx.fillStyle='rgba(16,78,118,.2)';ctx.fill();ctx.clip();
  for(let i=0;i<7;i++){const x0=((i*310+TT*9)%2100)-300;const g=ctx.createLinearGradient(0,SEA,0,SEA+260);g.addColorStop(0,'rgba(220,245,255,.10)');g.addColorStop(1,'rgba(220,245,255,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x0,SEA);ctx.lineTo(x0+36,SEA);ctx.lineTo(x0+130,SEA+260);ctx.lineTo(x0+70,SEA+260);ctx.closePath();ctx.fill();}
  ctx.restore();
  const xe=Math.min(VX1,SHORE);ctx.beginPath();surf14(VX0,xe);ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1.6;ctx.stroke();
}
function streaks14(a,y0,y1){alphaDo(a,()=>{for(let i=0;i<14;i++){const y=lerp(y0,y1,i/13),x=((i*173+TT*140)%2000)-200;const k=offCard(x,y);if(k>0)ln([x,y,x+34,y],`rgba(255,255,255,${.4*k})`,1.3);}});}

/* ---------- floaters (local coords, waterline y=0, 1 m = PXM px) ---------- */
function FT(x,y,a,s){const c=Math.cos(a),n=Math.sin(a);return {x,y,a,s,p:(lx,ly)=>({x:x+s*(lx*c-ly*n),y:y+s*(lx*n+ly*c)})};}
function inT(T,fn){ctx.save();ctx.translate(T.x,T.y);ctx.rotate(T.a);ctx.scale(T.s,T.s);fn();ctx.restore();}
function hg(x0,x1,c0,c1,c2){const g=ctx.createLinearGradient(x0,0,x1,0);g.addColorStop(0,c0);g.addColorStop(.4,c1);g.addColorStop(1,c2);return g;}
const YL=['#c9971a','#f7d24c','#b3830c'];
function turb14(ang,light,blades){
  const H=250;poly([-13,0,-8,-H,8,-H,13,0],hg(-13,13,'#c3ccd1','#f8fafb','#aeb8be'));box(-14,-3,28,3,'#8f9aa1');
  drawNacelle(0,-H,0,light);
  const B=blades||[ang,ang-TAU/3,ang-2*TAU/3];for(const a of B)drawBlade(-44,-H-20,a,BR);
  circ(-44,-H-20,8.5,'#f2f5f6','rgba(0,0,0,.25)',1);circ(-44,-H-20,3,'#c9d1d5');
}
function semi14(){
  box(-100,32,200,9,'#8c6f22');
  ln([-100,-14,0,-6],'#b58a1e',5);ln([100,-14,0,-6],'#b58a1e',5);ln([-100,20,0,24],'#a07c1c',4);ln([100,20,0,24],'#a07c1c',4);
  for(const cx of [-100,100]){box(cx-15,-24,30,68,hg(cx-15,cx+15,...YL));box(cx-24,44,48,5,'#6e5718');box(cx-18,-27,36,4,'#6f7a80');}
  box(-11,-24,22,62,hg(-11,11,...YL));box(-14,-27,28,4,'#6f7a80');
}
function spar14(){
  poly([-10,-24,10,-24,10,24,16,56,16,172,-16,172,-16,56,-10,24],hg(-16,16,...YL));
  box(-16,118,32,54,'#6b5a3a');ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=1;ctx.beginPath();for(let y=124;y<172;y+=8){ctx.moveTo(-16,y);ctx.lineTo(16,y);}ctx.stroke();
  box(-13,-27,26,4,'#6f7a80');
}
function tlp14(){
  box(-110,40,220,12,hg(-110,110,...YL));box(-112,48,12,8,'#6e5718');box(100,48,12,8,'#6e5718');
  ln([-104,42,-14,0],'#b58a1e',4);ln([104,42,14,0],'#b58a1e',4);
  box(-15,-24,30,70,hg(-15,15,...YL));box(-18,-27,36,4,'#6f7a80');
}
/* whole unit: hull + turbine; ts = turbine scale relative to hull */
function unit14(T,hull,ts,ang,blades){inT(T,()=>{hull();ctx.translate(0,-24);if(ts!==1)ctx.scale(ts,ts);turb14(ang,true,blades);});}
/* catenary chain: part rests on seabed from the anchor A to the touchdown point, then rises to the fairlead F */
function chain14(F,A,susp,a,lw){
  alphaDo(a===undefined?1:a,()=>{const d=Math.sign(A.x-F.x),tx=F.x+d*Math.min(susp,Math.abs(A.x-F.x)-4),ty=BEDF(tx);
  ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(tx,ty);ctx.quadraticCurveTo(lerp(tx,F.x,.6),ty,F.x,F.y);
  ctx.setLineDash([4,2.4]);ctx.strokeStyle='#23282c';ctx.lineWidth=lw||2.2;ctx.stroke();ctx.setLineDash([]);});
}
function rope14(F,A,col,lw){ctx.beginPath();ctx.moveTo(F.x,F.y);ctx.quadraticCurveTo((F.x+A.x)/2,(F.y+A.y)/2+6,A.x,A.y);ctx.strokeStyle=col||'#e3d9b8';ctx.lineWidth=lw||2.6;ctx.stroke();}
function dragA(x,y,k){k=k||1;poly([x-26*k,y+2*k,x+6*k,y+2*k,x+14*k,y+14*k,x-18*k,y+10*k],'#4d5760');ln([x+4*k,y+4*k,x+30*k,y-8*k],'#4d5760',3*k);return {x:x+30*k,y:y-8*k};}
function suctionA(x,y,k){k=k||1;box(x-14*k,y-8*k,28*k,36*k,'#6b7780');box(x-16*k,y-11*k,32*k,5*k,'#4d5760');ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=1;ctx.strokeRect(x-14*k,y-8*k,28*k,36*k);return {x,y:y-11*k};}
function pileA(x,y,k){k=k||1;box(x-6*k,y-6*k,12*k,56*k,'#6b7780');box(x-8*k,y-9*k,16*k,4*k,'#4d5760');return {x,y:y-9*k};}
/* smooth curve through points (Catmull-Rom) */
function crv(P,n){const o=[];for(let i=0;i<P.length-1;i++){const p0=P[Math.max(0,i-1)],p1=P[i],p2=P[i+1],p3=P[Math.min(P.length-1,i+2)];
  for(let k=0;k<n;k++){const t=k/n,t2=t*t,t3=t2*t;o.push({x:.5*(2*p1.x+(-p0.x+p2.x)*t+(2*p0.x-5*p1.x+4*p2.x-p3.x)*t2+(-p0.x+3*p1.x-3*p2.x+p3.x)*t3),y:.5*(2*p1.y+(-p0.y+p2.y)*t+(2*p0.y-5*p1.y+4*p2.y-p3.y)*t2+(-p0.y+3*p1.y-3*p2.y+p3.y)*t3)});}}
  o.push(P[P.length-1]);return o;}
/* text wrapped to a width (after translation) */
function wrap14(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
function gb14(p,l,col){circ(p.x,p.y,6,col,'#13232e',1.5);wt(p.x+10,p.y+6,l,17,col,700,'left',COND);}

/* ---------- scene helpers ---------- */
const D1=[[-500,265],[150,250],[520,115],[720,62],[930,50],[1240,30],[1560,16],[1700,4],[1760,-8],[2500,-34]];
const bed1=x=>SEA+tb14(D1,x)*1.1+(x<1700?2*Math.sin(x*.023):0);
const bedDeep=x=>SEA+176+5*Math.sin(x*.009)+3*Math.sin(x*.031+2);
const bed6=x=>SEA+tb14([[-500,232],[250,222],[800,95],[1100,44],[1250,44]],x)+2*Math.sin(x*.02);
const cam1=u=>camMix({x:1060,y:460,s:1.12},{x:700,y:475,s:1},ease(seg(u,.26,.72)));
function sway(x,span,k){return Math.atan((sw(x+span)-sw(x-span))/(2*span))*k;}
const deg=r=>r*180/Math.PI;
/* shot 3/5 semi-sub state */
function semiState(X0,s,surge,mean){const x=X0+surge,hv=(sw(x)-SEA)*.45,a=mean*Math.PI/180+sway(x,90,.55);return {x,hv,a,T:FT(x,SEA+hv,a,s)};}
const bedTLP=566;

const EP={no:14,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'浮動式離岸風電',en:'Floating offshore wind',
lede:'近岸淺水區逐漸開發完畢，更深的海域要用不打樁、浮在海面上的風機。這一集比較半潛式、單柱式與張力腳平台三種浮台如何保持穩定，拆解錨繫系統與動態海纜，再看浮台如何在港內組裝、拖到外海，以及全球案例與台灣的下一步。',
facts:[['60','m 以上','水深超過約 60 公尺，浮動式開始比固定式基礎更具成本優勢'],['78','m','Hywind Scotland 單柱式浮台的吃水深度'],['3','種','主要浮台型式：半潛式、單柱式、張力腳平台'],['88','MW','Hywind Tampen：11 部 8 MW 風機，2022 年完工'],['90','GW','台灣水深 60 公尺以上海域的浮動式風電潛能估計'],['6–12','座','能源署示範計畫草案中，每案設置的浮台數量']],
note:'說明：本集為教育用途示意動畫，水平距離經過壓縮，浮台、水深與風機大致以同一比例繪製，部分圖解中的風機縮小表示。適用水深、吃水、錨繫與海纜配置為典型範例；各國案例數據取自開發商公開資料（年份為完工或安裝年）。台灣潛能估計取自能源署再生能源資訊網，示範計畫內容取自 2026 年公布的草案報導，實際以主管機關公告為準。',
shots:[
/* 1 */{t:'水深變深之後',en:'When the water gets deeper',dur:12,side:true,
 d:'固定式基礎直接立在海床上：水深 20 到 50 公尺多用單樁，較深處改用套管式。水深再增加，基礎要更長、更重，鋼材與施工成本快速上升，一般認為超過約 60 公尺後，浮動式開始具有成本優勢。浮動式風機不打樁，而是把風機裝在會浮的浮台上，再以錨繫系統固定位置，讓水深上百公尺的海域也能開發。',
 s:[[0,'近岸水深 20–50 公尺：單樁與套管式基礎直接立在海床上'],[.3,'越往外海越深，基礎的鋼材與施工成本快速上升'],[.55,'水深超過約 60 公尺，改用浮在海面上的浮台'],[.78,'浮台以錨繫固定位置，水深上百公尺也能設置']],
 base:B14(bed1,3.5,1725),end:E14,cam:cam1,
 draw(u){
  const ang=TT*1.05;
  // monopile 30 m
  {const x=1240,b=bed1(x);box(x-7,SEA-10,14,b-SEA+34,hg(x-7,x+7,'#3d4b55','#8093a0','#33404a'));box(x-8,SEA-22,16,14,hg(x-8,x+8,...YL));ctx.save();ctx.translate(x,SEA-22);ctx.scale(.5,.5);turb14(ang+.7,true);ctx.restore();}
  // jacket 50 m
  {const x=930,b=bed1(x),top=SEA-12;ctx.strokeStyle='#8f9aa1';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(x-28,b+4);ctx.lineTo(x-13,top);ctx.moveTo(x+28,b+4);ctx.lineTo(x+13,top);
   const n=4;for(let i=0;i<n;i++){const y0=lerp(b,top,i/n),y1=lerp(b,top,(i+1)/n),w0=lerp(28,13,i/n),w1=lerp(28,13,(i+1)/n);ctx.moveTo(x-w0,y0);ctx.lineTo(x+w1,y1);ctx.moveTo(x+w0,y0);ctx.lineTo(x-w1,y1);ctx.moveTo(x-w1,y1);ctx.lineTo(x+w1,y1);}ctx.stroke();
   box(x-9,top-12,18,12,hg(x-9,x+9,...YL));box(x-20,top-14,40,3,'#6f7a80');ctx.save();ctx.translate(x,top-14);ctx.scale(.5,.5);turb14(ang+2.1,true);ctx.restore();}
  // semi-sub 115 m
  const S=semiState(520,.5,0,1.5);chain14(S.T.p(-115,26),{x:360,y:bed1(360)},150,1,1.8);chain14(S.T.p(115,26),{x:690,y:bed1(690)},90,1,1.8);
  dragA(360,bed1(360),.6);dragA(690,bed1(690),-.6);unit14(S.T,semi14,1,ang+1.3);
  // spar 250 m
  const px=150,ph=(sw(px)-SEA)*.25,pT=FT(px,SEA+ph,1.5*Math.PI/180+sway(px,60,.2),.5);
  chain14(pT.p(-16,70),{x:-70,y:bed1(-70)},120,1,1.8);chain14(pT.p(16,70),{x:330,y:bed1(330)},110,1,1.8);unit14(pT,spar14,1,ang+.3);
  // divider fixed / floating at ~60 m
  alphaDo(seg(u,.5,.58),()=>{ctx.setLineDash([6,5]);ln([720,232,720,bed1(720)],'rgba(255,255,255,.75)',1.5);ctx.setLineDash([]);
   wt(706,224,'← 浮動式',18,'#fff',700,'right');wt(734,224,'固定式 →',18,'#fff',700,'left');});
  for(const [x,d] of [[1240,30],[930,50],[520,115],[150,250]])tick(x+16,bed1(x)-10,d+' m','left');
  lab(1240,(SEA+bed1(1240))/2,'單樁基礎',{dx:60,dy:40,a:band(u,.02,.4)});
  lab(930,(SEA+bed1(930))/2+6,'套管式基礎',{dx:-80,dy:50,a:band(u,.08,.46)});
  lab(S.T.p(100,40).x,S.T.p(100,40).y,'半潛式浮台',{dx:60,dy:60,a:band(u,.46,.86),st:'s'});
  lab(pT.p(0,150).x,pT.p(0,150).y,'單柱式浮台',{dx:60,dy:40,a:band(u,.66,1),st:'s'});
  lab(690,bed1(690)-4,'錨碇',{dx:40,dy:-40,a:band(u,.6,.9)});
 },
 hud(u){hudPanel(236,152,'基礎型式與水深（典型）',seg(u,.04,.1),w=>{hrow(52,'單樁','約 20–50 m',w);hrow(78,'套管式','約 30–60 m',w);hrow(104,'浮動式','約 60 m 以上',w,'#7dffc4');
  const d=Math.round(tb14(D1,cam1(u).x));hrow(136,'畫面中央水深',d+' m',w,'#f2c230');});}},
/* 2 */{t:'三種浮台怎麼保持穩定',en:'Three ways to stay upright',dur:15,
 d:'浮在水面的平台要撐起百公尺高的風機，最重要的是傾斜後能自己扶正。半潛式靠分得很開的立柱，提供寬廣的水線面積；單柱式把大量壓艙物放在細長圓柱的底部，讓重心低於浮心；張力腳平台則讓浮力大於重量，再以垂直繃緊的張力腱拉住平台。三種原理不同，也決定了吃水深度、組裝港口與適用水深。',
 s:[[0,'浮台要撐起百公尺高的風機，傾斜後必須能自己扶正'],[.26,'半潛式：立柱分得很開，下沉的一側浮力增加，把平台推回'],[.52,'單柱式：壓艙物讓重心低於浮心，像不倒翁一樣回正'],[.76,'張力腳平台：多出來的浮力由繃緊的張力腱拉住，幾乎不動']],
 draw(u){
  diagBG();
  const K=[
   {t:'半潛式',f:semi14,amp:6,h:'穩定來源：寬廣的水線面積',b:'三根立柱分得很開；平台傾斜時，下沉一側的立柱排開更多海水，浮力把平台推回。',r:'吃水約 15–20 m，可在港內組裝整機再拖出',col:'#7dffc4'},
   {t:'單柱式（Spar）',f:spar14,amp:6,h:'穩定來源：重心低於浮心',b:'細長圓柱的底部裝滿壓艙物，重心壓得很低，像不倒翁一樣自己回正。',r:'吃水約 80 m，需要深水港與深水海域',col:'#f2c230'},
   {t:'張力腳平台（TLP）',f:tlp14,amp:.8,h:'穩定來源：繃緊的張力腱',b:'平台浮力大於重量，多出來的浮力由垂直的張力腱拉住，幾乎不起伏也不傾斜。',r:'平台最輕，但錨碇要承受很大的上拔力',col:'#b37cff'}];
  alphaDo(seg(u,.02,.08),()=>wt(1540,128,'G＝重心　B＝浮心',17,'rgba(227,236,238,.85)',600,'right'));
  K.forEach((k,i)=>{const x=60+i*520,cx=x+220,wl=350,a=seg(u,.02+i*.25,.1+i*.25);if(a<=0)return;
   alphaDo(a,()=>{
    card(x,150,440,620,{bg:'rgba(7,27,39,.78)'});wt(x+24,190,k.t,22,'#fff',700);
    ctx.save();rrp(x+1,150,438,618,14);ctx.clip();
    box(x+1,wl,438,bedTLP-wl,'rgba(59,147,187,.32)');box(x+1,bedTLP,438,14,'rgba(181,154,106,.75)');
    const th=k.amp*Math.PI/180*Math.sin(TT*1.2+i*1.7),T=FT(cx,wl+(i===2?0:2*Math.sin(TT*1.1+i)),th,1);
    if(i===2){for(const s of [-1,1]){const p=T.p(s*104,54);ln([p.x,p.y,cx+s*104,bedTLP],'#e3e9ec',2.4);box(cx+s*104-9,bedTLP,18,10,'#4d5760');
      const my=(p.y+bedTLP)/2+20;arrow(cx+s*104+10,my-24,cx+s*104+10,my+16,'#b37cff',2.4);}
      wt(cx+116,530,'張力腱',15,'#e3e9ec',700);}
    unit14(T,k.f,.28,TT*1.1);
    box(x+1,wl,438,bedTLP-wl,'rgba(16,78,118,.22)');ln([x+1,wl,x+439,wl],'rgba(255,255,255,.75)',1.5);
    const fa=seg(u,.06+i*.25,.14+i*.25);alphaDo(fa,()=>{
     if(i===0){const d=deg(th);for(const s of [-1,1]){const p=T.p(s*100,54),L=40+s*d*6;arrow(p.x,p.y+L,p.x,p.y+2,'#7dffc4',3);}
       const p=T.p(100,54);wt(p.x+14,p.y+34,'浮力',15,'#7dffc4',700);gb14(T.p(0,-4),'G','#f2c230');gb14(T.p(0,22),'B','#7dffc4');}
     if(i===1){const G=T.p(0,142),B=T.p(0,78);arrow(G.x,G.y,G.x,G.y+44,'#f2c230',3);arrow(B.x,B.y,B.x,B.y-44,'#7dffc4',3);gb14(G,'G','#f2c230');gb14(B,'B','#7dffc4');
       wt(G.x-22,G.y+40,'重力',15,'#f2c230',700,'right');wt(B.x-22,B.y-26,'浮力',15,'#7dffc4',700,'right');}
     if(i===2){for(const s of [-1,1]){const p=T.p(s*60,54);arrow(p.x,p.y+44,p.x,p.y+2,'#7dffc4',3);}wt(cx,478,'浮力 ＞ 重量',16,'#7dffc4',700,'center');gb14(T.p(0,-4),'G','#f2c230');gb14(T.p(0,24),'B','#7dffc4');}
    });
    ctx.restore();
    wt(x+24,614,k.h,18,k.col,700);
    const n=wrap14(x+24,644,k.b,392,15,'rgba(227,236,238,.9)',500,22);
    wrap14(x+24,644+n*22+12,k.r,392,15,'rgba(227,236,238,.7)',500,21);
   });});
 }},
/* 3 */{t:'半潛式浮台隨浪起伏',en:'A semi-submersible in the swell',dur:12,side:true,
 d:'半潛式浮台是目前商業案例最多的型式之一。三根立柱以撐桿連成三角形，吃水約 15 至 20 公尺，底部的垂盪板增加周圍被帶動的海水質量，減少上下起伏。浮台會隨浪產生縱搖與起伏，強風時也會平均傾斜數度，因此風機控制器要配合平台運動調整葉片角度，避免搖晃被放大。',
 s:[[0,'半潛式浮台隨著湧浪起伏，風機照常發電'],[.25,'三根立柱提供寬廣的水線面積，傾斜時自動扶正'],[.48,'底部的垂盪板帶動周圍海水，抑制上下起伏'],[.74,'風機控制器配合平台運動調整葉片角度，減少搖晃']],
 base:B14(bedDeep,6.5),end:E14,
 cam:u=>{const W={x:600,y:400,s:1.05},C={x:640,y:520,s:1.5};return u<.6?camMix(W,C,ease(seg(u,.42,.54))):camMix(C,W,ease(seg(u,.7,.8)));},
 draw(u){
  const S=semiState(720,.8,10*Math.sin(TT*.4),3),T=S.T;
  const FL=T.p(-115,26),FR=T.p(115,26),AL={x:250,y:bedDeep(250)},AR={x:1200,y:bedDeep(1200)};
  chain14(FL,AL,210+((FL.x-AL.x)-378)*2.5,1,2.4);chain14(FR,AR,210+((AR.x-FR.x)-388)*2.5,1,2.4);
  dragA(AL.x,AL.y,.8);dragA(AR.x,AR.y,-.8);
  unit14(T,semi14,1,TT*1.05);
  lab(T.p(-100,0).x,T.p(-100,0).y,'水線面',{dx:-80,dy:-50,a:band(u,.25,.5)});
  lab(T.p(100,-10).x,T.p(100,-10).y,'立柱',{dx:70,dy:-50,a:band(u,.25,.5)});
  lab(T.p(124,47).x,T.p(124,47).y,'垂盪板',{dx:70,dy:40,a:band(u,.5,.72),st:'s'});
  lab(FL.x,FL.y,'導纜器',{dx:-70,dy:40,a:band(u,.5,.72)});
  const m=T.p(-230,120);lab(m.x,m.y,'錨鍊',{dx:-60,dy:30,a:band(u,.52,.72)});
  lab(T.p(0,-24-250).x,T.p(0,-24-250).y,'控制器調整葉片角度',{dx:80,dy:-10,a:band(u,.8,1),st:'s'});
 },
 fx(u){streaks14(.8,110,400);
  if(u>.48&&u<.74){const T=semiState(720,.8,10*Math.sin(TT*.4),3).T;alphaDo(band(u,.5,.72),()=>{for(const s of [-1,1]){const p=T.p(s*100,52);for(let i=0;i<3;i++){const k=(TT*.8+i/3)%1;ctx.beginPath();ctx.ellipse(p.x,p.y+4,18+k*26,4+k*6,0,0,TAU);ctx.strokeStyle=`rgba(200,240,255,${.5*(1-k)})`;ctx.lineWidth=1.4;ctx.stroke();}}});}},
 hud(u){hudPanel(230,150,'平台運動',seg(u,.04,.1),w=>{const S=semiState(720,.8,10*Math.sin(TT*.4),3);
  hrow(52,'縱搖角',deg(S.a).toFixed(1)+'°',w,'#f2c230');hbar(14,60,w-28,clamp(deg(S.a)/8),'#f2c230');
  hrow(94,'起伏',(-S.hv/(.8*PXM)).toFixed(1)+' m',w);hrow(120,'風速','12.5 m/s',w);hrow(142,'輸出功率',(14.7+.25*Math.sin(TT*.9)).toFixed(1)+' MW',w,'#7dffc4');});}},
/* 4 */{t:'錨繫系統：把浮台留在原地',en:'Mooring systems',dur:14,
 d:'錨繫系統負責讓浮台待在原地。懸鏈式使用沉重的錨鍊，一部分平躺在海床上，平台被推離時，更多鏈條被提起，靠鏈條重量產生回復力，但錨點距離遠、佔用海床範圍大。緊繃式改用聚酯等合成纖維纜斜向繃緊，靠纜繩彈性伸長回復，佔地較小。錨碇則依受力方向選用拖曳錨、吸力錨或打入樁。',
 s:[[0,'懸鏈式：沉重的錨鍊躺在海床上，靠自重拉住平台'],[.28,'平台被推離時，更多鏈條被提起，產生回復力'],[.5,'緊繃式：合成纖維纜斜向繃緊，靠彈性伸長回復'],[.74,'錨碇依纜繩受力方向選用：拖曳錨、吸力錨或打入樁']],
 draw(u){
  diagBG();const wl=250,bd=510,dx=26*Math.sin(TT*.8);
  const panel=(i,x,ttl,sub,go)=>{const a=seg(u,i?.46:.02,i?.54:.1);if(a<=0)return;alphaDo(a,()=>{
    card(x,150,720,420,{bg:'rgba(7,27,39,.78)'});ctx.save();rrp(x+1,150,718,418,14);ctx.clip();
    box(x+1,wl,718,bd-wl,'rgba(59,147,187,.3)');box(x+1,bd,718,60,'rgba(181,154,106,.8)');ln([x+1,wl,x+719,wl],'rgba(255,255,255,.75)',1.5);
    go();ctx.restore();wt(x+24,190,ttl,22,'#fff',700);wt(x+24,220,sub,16,'rgba(227,236,238,.82)',500);});};
  BEDF=()=>bd;
  panel(0,60,'懸鏈式錨繫','靠錨鍊自重產生回復力',()=>{
   const T=FT(600+dx,wl+1.5*Math.sin(TT*1.2),0,.45),F=T.p(-115,26),A={x:130,y:bd};
   const susp=clamp(250+dx*5,120,400);chain14(F,A,susp,1,3);dragA(A.x-30,bd,1);
   unit14(T,semi14,.4,TT);
   if(u>.28){const k=band(u,.28,1);alphaDo(k,()=>{const tx=F.x-susp;circ(tx,bd,4,'#f2c230');wt(tx,bd-12,'觸底點',14,'#f2c230',700,'center');
     if(Math.abs(dx)>5)arrow(600+dx,318,600+dx-dx*2.4,318,'#7dffc4',3);wt(600,300,'回復力',14,'#7dffc4',700,'center');});}
   ln([A.x,bd+22,600,bd+22],'#fff',1.2);ln([A.x,bd+16,A.x,bd+28],'#fff',1.2);ln([600,bd+16,600,bd+28],'#fff',1.2);
   wt((A.x+600)/2,bd+46,'錨點距離遠，佔用海床範圍大',15,'#fff',600,'center');
   const tn=clamp(.45+dx/60);wt(84,286,'纜繩張力',14,'rgba(227,236,238,.85)',600);box(84,294,200,7,'rgba(255,255,255,.14)');box(84,294,200*tn,7,'#f2c230');
  });
  panel(1,820,'緊繃式錨繫','靠合成纖維纜的彈性伸長回復',()=>{
   const T=FT(1360+dx,wl+1.5*Math.sin(TT*1.2+1),0,.45),F=T.p(-115,26),A={x:1080,y:bd-11};
   rope14(F,A,'#e3d9b8',3);suctionA(1080,bd,1.1);
   unit14(T,semi14,.4,TT+1);
   ln([A.x,bd+22,1360,bd+22],'#fff',1.2);ln([A.x,bd+16,A.x,bd+28],'#fff',1.2);ln([1360,bd+16,1360,bd+28],'#fff',1.2);
   wt((A.x+1360)/2,bd+46,'錨點較近，佔地較小',15,'#fff',600,'center');
   const tn=clamp(.5+dx/40);wt(844,286,'纜繩張力',14,'rgba(227,236,238,.85)',600);box(844,294,200,7,'rgba(255,255,255,.14)');box(844,294,200*tn,7,'#f2c230');
   wt(1170,360,'合成纖維纜',15,'#e3d9b8',700,'right');
  });
  const AC=[['拖曳嵌入錨','拖行時像犁一樣嵌入海床，承受水平拉力，常搭配懸鏈式錨鍊。',dragA],['吸力錨','筒體放上海床後抽出內部海水，靠內外壓差壓入土中，可承受水平與垂直拉力。',suctionA],['打入樁','以打樁錘把鋼管樁打入海床，抗拔能力強，適合緊繃式與張力腳平台。',pileA]];
  AC.forEach((c,i)=>{const a=seg(u,.72+i*.06,.78+i*.06);if(a<=0)return;const x=60+i*505;alphaDo(a,()=>{
   card(x,596,470,204,{bg:'rgba(7,27,39,.78)'});box(x+16,640,130,40,'rgba(59,147,187,.3)');box(x+16,680,130,100,'rgba(181,154,106,.8)');
   const p=c[2](x+(i===0?86:81),680,1.3);ln([p.x,p.y,p.x+(i===0?40:0),p.y-40],i===0?'#23282c':'#e3d9b8',2.4);
   if(i===1)for(let j=0;j<3;j++){const k=(TT*.9+j/3)%1;alphaDo(1-k,()=>arrow(x+81,660-k*30,x+81,648-k*30,'#7dc8dc',2));}
   wt(x+166,634,c[0],19,'#f2c230',700);wrap14(x+166,664,c[1],284,15,'rgba(227,236,238,.88)',500,22);});});
 }},
/* 5 */{t:'動態海纜：跟著浮台動的電纜',en:'Dynamic cables',dur:14,side:true,
 d:'固定式風機的海纜沿著基礎固定，浮動式風機的海纜卻必須跟著浮台一起移動，稱為動態海纜。常見的「緩波形」配置在海纜中段加裝一串浮力模組，讓海纜在水中拱起，平台漂移時由拱形伸縮吸收位移，觸底點保持穩定。出口處的彎曲限制器避免海纜過度彎折，觸底後則轉為靜態海纜，埋設在海床下連到下一部風機或變電站。',
 s:[[0,'海纜從浮台底部垂下，隨平台一起移動'],[.22,'出口處的彎曲限制器避免海纜折彎與疲勞'],[.42,'中段綁上一串浮力模組，讓海纜形成「緩波形」拱起'],[.62,'平台漂移時，拱形伸縮吸收位移，觸底點保持穩定'],[.84,'觸底之後轉為靜態海纜，埋設在海床下']],
 base:B14(bedDeep,u=>lerp(4,7,band(u,.55,.9,.08))),end:E14,cam:u=>({x:680,y:480,s:1.0}),
 draw(u){
  const amp=lerp(14,44,band(u,.55,.9,.08)),S=semiState(900,.8,amp*Math.sin(TT*.6),2),T=S.T,off=S.x-900;
  const FR=T.p(115,26),AR={x:1560,y:bedDeep(1560)},FL=T.p(-115,26),AL={x:150,y:bedDeep(150)};
  chain14(FL,AL,300,.45,2);chain14(FR,AR,260+off*2.2,1,2.4);
  const H=T.p(-100,49),B=bedDeep(400),TD=400;
  const P=[H,{x:H.x-30,y:H.y+46},{x:H.x-150-off*.25,y:612+off*.12},{x:lerp(H.x,TD,.6)+off*.1,y:556+off*.5},{x:TD+90,y:622+off*.1},{x:TD,y:B-2},{x:TD-80,y:bedDeep(TD-80)}];
  const C=crv(P,12);
  // static buried section
  const st=[];for(let x=TD-80;x>=VX0-20;x-=10)st.push({x,y:bedDeep(x)+(x<TD-120?9:4)});
  ctx.save();ctx.globalAlpha*=.8;drawCable([{x:TD-80,y:bedDeep(TD-80)}].concat(st));ctx.restore();
  drawCable(C);
  pathLine(C.slice(0,6),'#6b7780',9);pathLine(C.slice(0,4),'#8a99a3',11);
  const hx=P[3].x;C.forEach((p,i)=>{if(i%2===0&&Math.abs(p.x-hx)<78){rrp(p.x-5,p.y-7,10,14,4);ctx.fillStyle='#f2c230';ctx.fill();ctx.strokeStyle='#9c7a12';ctx.lineWidth=1;ctx.stroke();}});
  dragA(AR.x,AR.y,-.8);
  unit14(T,semi14,1,TT*1.05);
  lab(H.x,H.y,'懸掛點',{dx:60,dy:40,a:band(u,.02,.24)});
  lab(C[3].x,C[3].y,'彎曲限制器',{dx:80,dy:30,a:band(u,.2,.44),st:'s'});
  lab(hx,P[3].y-8,'浮力模組',{dx:0,dy:-60,a:band(u,.42,.8),st:'s'});
  lab(TD,B-2,'觸底點',{dx:-40,dy:-60,a:band(u,.62,.9)});
  lab(250,bedDeep(250)+9,'靜態海纜（埋設）',{dx:30,dy:44,a:band(u,.82,1)});
  lab(FR.x,FR.y,'錨鍊',{dx:70,dy:40,a:band(u,.04,.3),minor:true});
 },
 hud(u){hudPanel(230,150,'動態海纜監測',seg(u,.04,.1),w=>{const amp=lerp(14,44,band(u,.55,.9,.08)),S=semiState(900,.8,amp*Math.sin(TT*.6),2),off=(S.x-900)/(.8*PXM);
  hrow(52,'平台偏移',(off>=0?'+':'')+off.toFixed(1)+' m',w,'#f2c230');hbar(14,60,w-28,.5+off/60,'#f2c230');
  const hump=(bedDeep(700)-(556+(S.x-900)*.5))/(.8*PXM);hrow(94,'拱形離海床高度',hump.toFixed(0)+' m',w);
  hrow(120,'觸底點位移','約 0 m',w,'#7dffc4');hrow(142,'彎曲半徑','容許範圍內',w,'#7dffc4');});}},
/* 6 */{t:'港內組裝與拖航',en:'Port assembly and tow-out',dur:14,side:true,
 d:'浮動式風機的一大特點，是整部風機可以在港內完成組裝。浮台在深水碼頭邊繫泊，陸上大型吊機依序吊裝塔架、機艙與葉片，完成測試後，再由數艘拖船以濕式拖航的方式拖到風場，連接事先鋪設好的錨鍊與動態海纜。這能減少海上大型吊裝作業，但港口需要足夠的水深、承載力與碼頭長度。',
 s:[[0,'浮台繫泊在深水碼頭邊，陸上吊機把最後一支葉片裝上輪轂'],[.3,'整部風機在港內完成組裝與測試，不需要海上大型吊裝船'],[.45,'拖船把浮台連同風機拖出港，以濕式拖航前往風場'],[.76,'抵達後連接預先鋪設的錨鍊與動態海纜，就能併網發電']],
 base:B14(bed6,u=>lerp(1.6,5,seg(u,.42,.8)),1200),end:E14,
 cam:u=>camMix({x:1180,y:350,s:1.3},{x:520,y:440,s:1.1},ease(seg(u,.4,.8))),
 draw(u){
  const s=.6,xF=u<.42?1060:lerp(1060,380,ease(seg(u,.42,.82))),hv=(sw(xF)-SEA)*.45,T=FT(xF,SEA+hv,sway(xF,90,.4),s);
  // pre-laid moorings at the site
  const AL={x:40,y:bed6(40)},AR={x:720,y:bed6(720)},hk=seg(u,.84,.96);
  if(VX0<900){for(const [A,sgn] of [[AL,-1],[AR,1]]){dragA(A.x,A.y,-sgn*.8);
    if(hk<=0){const e={x:380+sgn*190,y:bed6(380+sgn*190)};ln([A.x,A.y,e.x,e.y],'#23282c',2);ln([e.x,e.y,e.x,SEA],'rgba(40,45,50,.6)',1);box(e.x-5,SEA-8,10,9,'#e8572a');}
    else{const F=T.p(sgn*115,26),Fe=lerpPt({x:380+sgn*190,y:SEA},F,ease(seg(hk,0,.5)));chain14(Fe,A,lerp(160,120,hk),1,2);}}}
  // quay and crane
  box(1200,SEA-24,Math.max(0,VX1-1200)+40,VY1-SEA+60,'#9aa3a8');box(1200,SEA-24,Math.max(0,VX1-1200)+40,6,'#6f7a80');
  for(let x=1212;x<VX1;x+=46)box(x,SEA-18,8,22,'#2b3137');
  const hub=T.p(-44,-24-250-20);
  let R;if(u<.06)R={x:1560,y:SEA-40};else if(u<.34)R=kf(u,[[.06,1560,SEA-40],[.14,1560,190],[.26,hub.x,190],[.34,hub.x,hub.y]]);else R=null;
  const px=1262,py=SEA-62;box(1226,SEA-48,90,24,'#e9b21f');box(1220,SEA-30,102,8,'#2b3137');box(1268,SEA-72,40,26,'#e9b21f');
  const hook=R?{x:R.x-34,y:R.y-44}:{x:1150,y:300};
  crane(px,py,390,hook.x,hook.y,{col:'#e9b21f'});
  if(R){slings(hook.x,hook.y,[R.x-60,R.y-4,R.x-8,R.y-4]);drawBlade(R.x,R.y,Math.PI,BR*s);}
  if(u<.1){box(1480,SEA-34,8,10,'#4d5762');box(1550,SEA-34,8,10,'#4d5762');}
  // tugs
  if(u>.4){const x1=xF-300,y1=sw(x1-40)-4;ctx.save();ctx.translate(x1,sw(x1-40));ctx.scale(-.6,.6);vWorkboat();ctx.restore();
    const F=T.p(-115,-6);ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo((x1+F.x)/2,SEA+10,F.x,F.y);ctx.strokeStyle='#23282c';ctx.lineWidth=1.6;ctx.stroke();
    const x2=xF+170,e=seg(u,.42,.5);ctx.save();ctx.globalAlpha*=e;ctx.translate(x2+78*.6,sw(x2));ctx.scale(-.5,.5);vWorkboat();ctx.restore();
    lab(x1-40,y1-24,'拖船',{dy:-50,a:band(u,.46,.8)});
    lab((x1+F.x)/2,SEA+4,'濕式拖航',{dx:0,dy:60,a:band(u,.52,.8),st:'s'});}
  unit14(T,semi14,1,0,u<.34?[Math.PI/3,-Math.PI/3]:[Math.PI,Math.PI/3,-Math.PI/3]);
  lab(1300,SEA-60,'碼頭吊機',{dx:60,dy:-50,a:band(u,.02,.34)});
  if(R)lab(R.x-50,R.y,'單支葉片吊裝',{dx:-40,dy:-40,a:band(u,.08,.34),st:'s'});
  lab(T.p(60,40).x,T.p(60,40).y,'半潛式浮台',{dx:-60,dy:60,a:band(u,.02,.4)});
  lab(380+190,SEA-4,'預鋪錨繫的浮標',{dx:40,dy:-50,a:band(u,.7,.86)});
  lab(T.p(115,26).x,T.p(115,26).y,'連接錨鍊',{dx:60,dy:50,a:seg(u,.88,.92),st:'g'});
 },
 hud(u){hudPanel(230,150,'拖航作業（示例）',seg(u,.04,.1),w=>{
  hrow(52,'港內組裝',u<.34?'吊裝葉片':'完成',w,u<.34?'#f2c230':'#7dffc4');
  hrow(78,'拖航距離',Math.round(60*ease(seg(u,.42,.82)))+' km',w);hrow(104,'拖航航速','約 3–5 節',w);
  hrow(132,'錨繫連接',u<.84?'待命':u<.96?'進行中':'完成',w,u<.84?'#fff':u<.96?'#f2c230':'#7dffc4');});}},
/* 7 */{t:'世界案例與台灣的下一步',en:'Projects worldwide and Taiwan\'s next step',dur:13,
 d:'2016 年日本五島的混合式單柱風機開始商轉，隔年英國 Hywind Scotland 成為第一座浮動式風場；之後葡萄牙、蘇格蘭、挪威與法國陸續完成半潛式、單柱式與張力腳平台風場。台灣水深 60 公尺以上的海域潛能估計約 90 GW，能源署已提出浮動式示範計畫草案，規劃 2 至 3 案、每案 6 至 12 座浮台，原則於 2032 年底前完工併聯。',
 s:[[0,'2016 年起，浮動式風電從示範機走向小型商轉風場'],[.3,'三種浮台都已有實績，單一風場規模已接近 100 MW'],[.56,'台灣水深 60 公尺以上的海域，估計有約 90 GW 潛能'],[.78,'浮動式示範計畫草案規劃 2032 年底前完工併聯']],
 draw(u){
  diagBG();
  const P=[['2016','五島「はえんかぜ」','混合式單柱','2 MW','日本','#f2c230'],['2017','Hywind Scotland','單柱式','30 MW','英國','#f2c230'],['2020','WindFloat Atlantic','半潛式','25 MW','葡萄牙','#7dffc4'],
   ['2021','Kincardine','半潛式','50 MW','英國','#7dffc4'],['2022','Hywind Tampen','單柱式（混凝土）','88 MW','挪威','#f2c230'],['2023','Provence Grand Large','張力腳平台','25 MW','法國','#b37cff']];
  const k=seg(u,.02,.1);ln([70,250,70+1450*k,250],'rgba(255,255,255,.5)',2);
  P.forEach((p,i)=>{const a=seg(u,.04+i*.07,.1+i*.07);if(a<=0)return;const x=70+i*244,cx=x+115;alphaDo(a,()=>{
   circ(cx,250,7,p[5],'#0e2a3b',2);wt(cx,232,p[0],24,'#fff',700,'center',COND);
   card(x,272,230,250,{bg:'rgba(7,27,39,.8)'});
   wrap14(x+16,306,p[1],198,17,'#fff',700,22);
   wt(x+16,364,p[2],16,p[5],700);
   wt(x+16,430,p[3],42,p[5],700,'left',COND);
   wt(x+16,496,p[4],16,'rgba(227,236,238,.8)',500);});});
  const b=seg(u,.54,.62);if(b<=0)return;alphaDo(b,()=>{
   card(70,556,1450,244,{bg:'rgba(242,194,48,.08)',st:'rgba(242,194,48,.45)'});
   wt(100,598,'台灣的下一步',22,'#f2c230',700);
   wt(100,690,'90',76,'#f2c230',700,'left',COND);wt(100+wtw('90',76,700,COND)+10,690,'GW',30,'#f2c230',700,'left',COND);
   wrap14(100,726,'水深 60 公尺以上海域的浮動式風電潛能估計（能源署再生能源資訊網）',380,15,'rgba(227,236,238,.85)',500,21);
   wrap14(540,598,'台灣海峽近岸多在 50 公尺以內，往外海水深快速增加',950,17,'rgba(227,236,238,.9)',500,22);
   const ST=[['2026','公布浮動式示範計畫草案','2–3 案、每案 6–12 座浮台'],['2027','示範計畫選商',''],['2032','原則於年底前完工併聯','示範風場商轉']];
   ST.forEach((s,i)=>{const a=seg(u,.64+i*.08,.7+i*.08);if(a<=0)return;const x=540+i*330;alphaDo(a,()=>{
    card(x,622,290,152,{bg:'rgba(7,27,39,.8)'});wt(x+18,662,s[0],30,'#f2c230',700,'left',COND);
    const n=wrap14(x+18,696,s[1],254,17,'#fff',700,22);if(s[2])wrap14(x+18,696+n*22+6,s[2],254,15,'rgba(227,236,238,.8)',500,20);
    if(i<2)arrowR(x+294,698,20,'#f2c230');});});
  });
 }}
]};
