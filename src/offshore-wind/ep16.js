// KITS: marine
/* ================= EP16 套管式基礎 ================= */
const JH16=250,PL16=230,JX16=78;
const PT16=Math.min(bedY(TX-JX16),bedY(TX+JX16))-12;   // pile head level (stick-up above seabed)
const R16=TX+110,CP16=R16+80;   // heavy-lift vessel on the right, crane pedestal near the stern
const hlvDeck16=R=>wlAt(R+215,.35)-18;
/* text wrapped to a width (after translation) */
function wrap16(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
/* jacket in side view: two front legs, faint rear leg, X-braces, nodes, anodes, boat landing */
function jk16(cx,yb,o){
  o=o||{};const H=JH16,yt=yb-H,L=y=>lerp(JX16,34,(yb-y)/H),N=4;
  if(o.pins!==false)for(const s of [-1,1])box(cx+s*JX16-4,yb-2,8,42,'#9aa6ad');
  ln([cx,yb+4,cx,yt],'rgba(150,165,175,.5)',5);
  ctx.strokeStyle='#8595a0';ctx.lineWidth=3;ctx.beginPath();
  for(let i=0;i<N;i++){const y0=yb-H*i/N,y1=yb-H*(i+1)/N;ctx.moveTo(cx-L(y0),y0);ctx.lineTo(cx+L(y1),y1);ctx.moveTo(cx+L(y0),y0);ctx.lineTo(cx-L(y1),y1);ctx.moveTo(cx-L(y1),y1);ctx.lineTo(cx+L(y1),y1);}
  ctx.stroke();
  for(const s of [-1,1]){ln([cx+s*L(yb),yb,cx+s*L(yt),yt],'#2f3a42',9);ln([cx+s*L(yb),yb,cx+s*L(yt),yt],'#b7c3ca',6);}
  // sacrificial anodes
  for(let i=0;i<3;i++){const y=yb-30-i*62;for(const s of [-1,1])box(cx+s*(L(y)+6)-3,y-8,6,16,'#6d7b84');}
  // nodes
  for(let i=0;i<=N;i++){const y=yb-H*i/N;for(const s of [-1,1])circ(cx+s*L(y),y,o.hl?6:4.5,o.hl?'#f2c230':'#8595a0');}
  // boat landing on the right leg around the waterline
  const bx=cx+L(SEA)+14;ln([bx,SEA-36,bx,SEA+40],'#f2c230',3.4);ln([bx+7,SEA-36,bx+7,SEA+40],'#f2c230',3.4);
  ln([cx+L(SEA-36),SEA-36,bx,SEA-36],'#c08a1c',2);ln([cx+L(SEA+30),SEA+30,bx,SEA+30],'#c08a1c',2);
  box(cx-L(yt)-6,yt-5,L(yt)*2+12,6,'#f2c230');
}
/* transition piece + platform on top of the jacket, then the turbine */
function jkTop16(cx,yt,full){
  const g=ctx.createLinearGradient(cx-24,0,cx+24,0);g.addColorStop(0,'#c9971a');g.addColorStop(.4,'#f7d24c');g.addColorStop(1,'#b3830c');
  ctx.fillStyle=g;ctx.fillRect(cx-24,yt-24,48,20);box(cx-60,yt-27,120,4,'#6f7a80');rail(cx-60,cx+60,yt-27,8);
  if(full){for(let k=0;k<3;k++)drawTowerSec(cx,yt-27-k*HS,k);}
}
function pile16(x,top,a){alphaDo(a===undefined?1:a,()=>drawPile(x,top+PL16,Math.PI/2,PL16,16));}
/* pre-piling template on the seabed */
function template16(dy,a){alphaDo(a,()=>{const y=bedY(TX)-12+dy;
  box(TX-120,y-4,240,10,'#e8a33a');box(TX-138,y+2,40,6,'#8a6a2a');box(TX+98,y+2,40,6,'#8a6a2a');
  for(const s of [-1,1]){ctx.strokeStyle='#394650';ctx.lineWidth=3;ctx.strokeRect(TX+s*JX16-13,y-34,26,40);}
  ln([TX-110,y-4,TX-JX16,y-34],'#e8a33a',2.4);ln([TX+110,y-4,TX+JX16,y-34],'#e8a33a',2.4);});}
/* pile sequence for shot 3 */
const PS16=[{x:TX-JX16,a:.12,b:.5},{x:TX+JX16,a:.54,b:.86}];
const BL16=48;
function pileAt16(u,P){
  if(u<P.a)return null;const w=P.b-P.a,b0=SEA-20,b1=bedY(P.x)+20,b2=PT16+PL16;
  if(u<P.a+w*.42){const bot=lerp(b0,b1,ease(seg(u,P.a,P.a+w*.35)));return {top:bot-PL16,ham:0,fl:0,pd:0,lift:true,a:seg(u,P.a,P.a+.03)};}
  const bv=BL16*seg(u,P.a+w*.42,P.b),f=Math.floor(bv),fr=bv-f,pd=Math.min(1,(f+easeOut(Math.min(1,fr*5)))/BL16);
  return {top:lerp(b1,b2,pd)-PL16,ham:seg(u,P.a+w*.35,P.a+w*.42)*(1-seg(u,P.b,P.b+.03)),fl:u<P.b?Math.max(0,1-fr*3.5):0,pd,lift:false,a:1};
}
function hookT16(u,i){const P=PS16[i],s=pileAt16(Math.max(u,P.a),P);return s.lift?{x:P.x,y:s.top-8}:{x:P.x,y:s.top-118};}
function hook16(u){
  const stow={x:TX+150,y:260};
  if(u<PS16[0].a)return lerpPt(stow,hookT16(PS16[0].a,0),ease(seg(u,0,PS16[0].a)));
  if(u<=PS16[0].b)return hookT16(u,0);
  if(u<PS16[1].a)return lerpPt(hookT16(PS16[0].b,0),hookT16(PS16[1].a,1),ease(seg(u,PS16[0].b,PS16[1].a)));
  if(u<=PS16[1].b)return hookT16(u,1);
  const tp={x:TX,y:bedY(TX)-12-150};
  if(u<.92)return lerpPt(hookT16(PS16[1].b,1),tp,ease(seg(u,PS16[1].b,.92)));
  return {x:TX,y:tp.y-180*ease(seg(u,.92,1))};
}
/* shot 5: jacket lowering */
function jkY16(u){return lerp(SEA-10,PT16,ease(seg(u,.12,.62)));}
/* shot 6 geometry */
const GC16=440,GTOP16=300,GBOT16=700;

const EP={no:16,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'套管式基礎',en:'Jacket foundations',
lede:'台灣海峽的地層較鬆軟，又有颱風與地震，許多離岸風場選用像海中鐵塔一樣的套管式基礎。這一集比較套管與單樁，拆解套管的構造，再看預打樁、插樁與灌漿連接如何把上千公噸的鋼結構牢牢固定在海床上。',
facts:[['1,200','t 以上','大彰化 1 & 2a 台灣製套管的單座重量（沃旭）'],['約 80','m','同一批套管的高度，約 27 層樓'],['約 4','m','大彰化 1 & 2a 基樁直徑，長約 80–90 m、重約 400 t'],['3–4','支','每座套管的基樁數；大彰化為三腳，台電離岸二期為四腳'],['111','座','大彰化 1 & 2a 風場的套管基礎數量'],['< 50','m','台灣目前劃設固定式離岸風場的水深範圍']],
note:'說明：本集為教育用途示意動畫，尺寸、水深與樁長經過壓縮，地層為示意。套管重量、高度、數量與基樁規格取自沃旭能源公開資訊；台電離岸二期的四腳套管取自台電計畫網站；台灣海峽地質與水深背景取自環境資訊中心與國科會科技大觀園的說明。各基礎型式的適用水深、灌漿料強度、錘擊數與貫入深度為典型範例，實際依各風場的設計與地質調查而定。',
shots:[
/* 1 */{t:'單樁與套管：兩種固定式基礎',en:'Monopile or jacket',dur:14,
 d:'固定式離岸風機的基礎主要有兩種。單樁是一根直徑約 8 到 10 公尺的大鋼管，構造簡單、安裝快，歐洲北海大量採用。套管式（Jacket）則是由鋼管焊成的立體桁架，以三到四支基樁固定在海床，重量較輕、剛性高，適合較深的水域。台灣海峽地層較鬆軟，又要承受颱風與地震，彰化外海許多風場都採用套管式基礎。',
 s:[[0,'單樁是一根大直徑鋼管，構造簡單、安裝快'],[.3,'套管是鋼管焊成的桁架，以三到四支基樁固定'],[.58,'兩者適用的水深範圍不同'],[.8,'台灣海峽地層鬆軟又有颱風地震，常選用套管式']],
 draw(u){
  diagBG();
  const mini=(x0,kind,a)=>alphaDo(a,()=>{const sw=260,sl=260,bd=440;
   box(x0,sl,sw,bd-sl,'rgba(59,147,187,.3)');ln([x0,sl,x0+sw,sl],'rgba(255,255,255,.75)',1.5);
   box(x0,bd,sw,90,'rgba(181,154,106,.8)');ln([x0,bd,x0+sw,bd],'#a98a58',2);
   const cx=x0+sw/2;
   if(kind===0){const g=ctx.createLinearGradient(cx-20,0,cx+20,0);g.addColorStop(0,'#3d4b55');g.addColorStop(.4,'#8093a0');g.addColorStop(1,'#33404a');ctx.fillStyle=g;ctx.fillRect(cx-20,228,40,290);box(cx-22,214,44,16,'#f2c230');}
   else{const yb=bd-4,yt=236,L=y=>lerp(62,26,(yb-y)/(yb-yt));
    ctx.strokeStyle='#8595a0';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<3;i++){const y0=lerp(yb,yt,i/3),y1=lerp(yb,yt,(i+1)/3);ctx.moveTo(cx-L(y0),y0);ctx.lineTo(cx+L(y1),y1);ctx.moveTo(cx+L(y0),y0);ctx.lineTo(cx-L(y1),y1);ctx.moveTo(cx-L(y1),y1);ctx.lineTo(cx+L(y1),y1);}ctx.stroke();
    for(const s of [-1,1]){ln([cx+s*L(yb),yb,cx+s*L(yt),yt],'#b7c3ca',5);box(cx+s*L(yb)-4,yb,8,86,'#8093a0');}
    box(cx-30,yt-18,60,16,'#f2c230');}});
  const K=[['單樁（Monopile）',['一根大直徑鋼管，直徑約 8–10 m','構造簡單，製造與安裝快','水深變深、地層鬆軟時，樁要更粗更重'],.02,'#58b8d0'],
   ['套管式（Jacket）',['鋼管焊成的桁架，以 3–4 支基樁固定','重量輕、剛性高，適合較深水域','節點多，製造與焊接檢驗較費工'],.28,'#f2c230']];
  K.forEach((k,i)=>{const a=seg(u,k[2],k[2]+.06);if(a<=0)return;const x=60+i*760;alphaDo(a,()=>{
   card(x,150,720,410,{bg:'rgba(7,27,39,.8)',st:i?'rgba(242,194,48,.5)':undefined});wt(x+24,192,k[0],22,k[3],700);});
   mini(x+24,i,a);
   k[1].forEach((t,j)=>{const b=seg(u,k[2]+.04+j*.04,k[2]+.08+j*.04);alphaDo(b,()=>{circ(x+318,258+j*96,5,k[3]);wrap16(x+334,264+j*96,t,360,18,'#fff',600,25);});});});
  // depth range chart
  const b=seg(u,.56,.62);if(b<=0)return;alphaDo(b,()=>{
   card(60,584,1480,216,{bg:'rgba(7,27,39,.8)'});wt(84,622,'適用水深（典型）',20,'#f2c230',700);
   const X=m=>360+m/70*1130;
   for(let m=0;m<=70;m+=10){ln([X(m),640,X(m),758],'rgba(255,255,255,.1)',1);wt(X(m),782,m+' m',15,'rgba(227,236,238,.7)',600,'center',COND);}
   const R=[['單樁',0,40,'#58b8d0'],['套管式',20,60,'#f2c230'],['浮動式',50,70,'#b37cff']];
   R.forEach((r,i)=>{const k=ease(seg(u,.6+i*.05,.68+i*.05));const y=648+i*38;wt(84,y+22,r[0],18,'#fff',700);
    box(X(r[1]),y,(X(r[2])-X(r[1]))*k,26,r[3]);});
   alphaDo(seg(u,.8,.86),()=>{ctx.setLineDash([7,5]);ln([X(50),600,X(50),760],'#7dffc4',2);ctx.setLineDash([]);
    wt(X(50)-12,622,'台灣固定式風場 < 50 m',17,'#7dffc4',700,'right');});});
 }},
/* 2 */{t:'套管的構造：海中的鐵塔',en:'Anatomy of a jacket',dur:13,side:true,
 d:'套管由四根或三根主腳柱與層層 X 型斜撐組成，桿件交會的地方稱為節點，是焊接最複雜、也最需要檢驗疲勞的位置。頂部接轉接段與工作平台，靠近水面設有靠船設施，腳柱上掛著犧牲陽極防止海水腐蝕。大彰化 1 & 2a 的台灣製套管高約 80 公尺、重超過 1,200 公噸，由上千個組件焊接而成。',
 s:[[0,'套管由主腳柱與層層 X 型斜撐組成'],[.28,'桿件交會的節點是焊接與疲勞檢驗的重點'],[.55,'靠近水面有靠船設施，腳柱掛著犧牲陽極'],[.78,'三到四支基樁把整座套管固定在海床']],
 cam:u=>camMix({x:760,y:430,s:1.05},{x:700,y:540,s:1.6},ease(seg(u,.06,.26))),
 draw(u){
  for(const x of [TX-JX16,TX+JX16])pile16(x,PT16);
  jk16(TX,PT16,{hl:u>.28&&u<.55});jkTop16(TX,PT16-JH16,true);
  drawNacelle(TX,TW_TOP,0,true);drawRotor(TX-44,TW_TOP-20,TT*1.05,3);
  const L=y=>lerp(JX16,34,(PT16-y)/JH16),yN=PT16-JH16*2/4;
  lab(TX-L(560),560,'主腳柱',{dx:-80,dy:-30,a:band(u,.04,.3),st:'s'});
  lab(TX-20,PT16-JH16*1.5/4+6,'X 型斜撐',{dx:-120,dy:40,a:band(u,.1,.3)});
  lab(TX+L(yN),yN,'節點',{dx:90,dy:-20,a:band(u,.3,.56),st:'s'});
  lab(TX-L(PT16-JH16/4),PT16-JH16/4,'焊接疲勞檢驗',{dx:-90,dy:30,a:band(u,.34,.56),minor:true});
  lab(TX+L(SEA)+18,SEA+10,'靠船設施',{dx:90,dy:-10,a:band(u,.56,.8)});
  lab(TX-L(PT16-92)-6,PT16-92,'犧牲陽極',{dx:-90,dy:-10,a:band(u,.58,.8)});
  lab(TX,PT16-JH16-20,'轉接段與工作平台',{dx:110,dy:-30,a:band(u,.56,.8)});
  lab(TX+JX16,PT16+90,'基樁',{dx:90,dy:10,a:band(u,.78,1),st:'s'});
  lab(TX,PT16-2,'樁頂與腳柱連接',{dx:-60,dy:70,a:band(u,.8,1),minor:true});
 },
 hud(u){hudPanel(230,150,'套管規格（大彰化 1 & 2a）',seg(u,.04,.1),w=>{
  hrow(52,'高度','約 80 m',w,'#f2c230');hrow(78,'重量','1,200 t 以上',w);hrow(104,'腳柱','3 支',w);hrow(130,'組件','上千個',w);});}},
/* 3 */{t:'預打樁：先把樁打進海床',en:'Pre-piling',dur:15,side:true,
 d:'台灣的套管多採「預打樁」工法：先把預打樁定位框架放到海床上，框架上的樁套筒決定每支樁的位置與間距。重件吊裝船把基樁垂直吊入套筒，液壓錘隨樁沉入水中，一錘一錘把樁打到設計深度，再移到下一個套筒。三支樁都完成後，把框架吊起移往下一個機位。大彰化 1 & 2a 的基樁直徑約 4 公尺、長約 80 到 90 公尺。',
 s:[[0,'預打樁定位框架放在海床，決定每支樁的位置'],[.14,'重件吊裝船把基樁垂直吊入樁套筒'],[.3,'液壓錘隨樁沉入水中，把樁打到設計深度'],[.56,'移到下一個套筒，重複吊樁與打樁'],[.88,'三支樁完成後，吊起框架移往下一個機位']],
 cam:u=>({x:700,y:450,s:1.12}),
 draw(u){
  const deck=hlvDeck16(R16);vsl(R16,430,false,{damp:.35},vHLV);
  const lift=u>.92?-180*ease(seg(u,.92,1)):0;
  template16(lift,1-seg(u,.97,1));
  alphaDo(.55*seg(u,.86,.9),()=>pile16(TX,PT16));
  let ham=null;
  PS16.forEach(P=>{const s=pileAt16(u,P);if(!s)return;pile16(P.x,s.top,s.a);if(s.ham>0)ham={x:P.x,y:s.top,a:s.ham,fl:s.fl};});
  if(ham)alphaDo(ham.a,()=>drawHammer(ham.x,ham.y,ham.fl));
  const hk=hook16(u);crane(CP16,deck-30,360,hk.x,hk.y,{col:'#e9b21f'});
  if(u>.9){const ty=bedY(TX)-12+lift;slings(hk.x,hk.y,[TX-110,ty-4,TX+110,ty-4]);}
  const p0=pileAt16(u,PS16[0]);
  lab(R16+250,deck-10,'重件吊裝船',{dx:40,dy:60,a:band(u,0,.16)});
  lab(TX-110,bedY(TX)-16,'預打樁定位框架',{dx:-100,dy:-60,a:band(u,.02,.2),st:'s'});
  if(p0)lab(TX-JX16,p0.top+60,'基樁',{dx:-90,dy:-20,a:band(u,.16,.34)});
  if(ham)lab(ham.x,ham.y-60,'液壓錘',{dx:-90,dy:-30,a:band(u,.32,.5)*ham.a,st:'s'});
  lab(TX+JX16,bedY(TX+JX16)-40,'樁套筒',{dx:90,dy:-40,a:band(u,.34,.54)});
  lab(TX,PT16,'第三支樁（後方）',{dx:100,dy:60,a:band(u,.88,1)});
 },
 hud(u){hudPanel(230,150,'預打樁（示例）',seg(u,.04,.1),w=>{
  let i=0,pd=0,bl=0;PS16.forEach((P,k)=>{const s=pileAt16(u,P);if(s){i=k+1;pd=s.pd;}});
  const done=u>.88?3:(i?i-1:0)+(pd>=1?1:0);
  hrow(52,'目前基樁',(u>.88?3:Math.max(1,i))+' / 3',w);
  hrow(78,'貫入深度',Math.round(pd*75)+' m',w,'#f2c230');hbar(14,86,w-28,pd,'#f2c230');
  bl=Math.round(pd*2400);hrow(118,'錘擊數',bl.toLocaleString('en-US'),w);
  hrow(142,'已完成',trf('{n} 支',{n:done}),w,'#7dffc4');});}},
/* 4 */{t:'打多深？台灣海峽的地質與水深',en:'Seabed and water depth in the Taiwan Strait',dur:14,
 d:'彰化外海的風場水深約 30 到 50 公尺，海床表層是十幾到二十公尺的鬆散砂泥沉積層，承載力有限。為了抵抗颱風的極端風浪，以及地震時表層砂土可能液化而失去支撐，基樁必須穿過鬆軟的表層，把摩擦力與端承力交給更深處較緊密的地層。大彰化 1 & 2a 的基樁長約 80 到 90 公尺，基樁加上套管的總長可超過 160 公尺。',
 s:[[0,'彰化外海水深約 30–50 公尺，表層是鬆散砂泥'],[.25,'基樁穿過鬆軟表層，打進較緊密的地層'],[.55,'地震時，鬆散砂層可能液化而失去支撐'],[.78,'因此樁要更長，基樁加套管總長可超過 160 公尺']],
 draw(u){
  diagBG();
  card(60,150,820,650,{bg:'rgba(7,27,39,.78)'});
  const Y=d=>196+(40-d)*3.28,X0=150,X1=860;
  ctx.save();rrp(61,151,818,648,14);ctx.clip();
  box(X0,Y(0),X1-X0,Y(-45)-Y(0),'rgba(59,147,187,.32)');ln([X0,Y(0),X1,Y(0)],'rgba(255,255,255,.75)',1.5);
  const LY=[[-45,-63,'#d9c393','鬆散砂泥沉積層'],[-63,-100,'#a4876a','粉土與砂互層'],[-100,-160,'#c4a678','較緊密砂層']];
  const shake=band(u,.55,.8)*Math.sin(TT*30)*2.2;
  LY.forEach((l,i)=>{const a=seg(u,.02+i*.04,.08+i*.04);alphaDo(a,()=>{box(X0+(i?0:shake),Y(l[0]),X1-X0,Y(l[1])-Y(l[0]),l[2]);});});
  alphaDo(band(u,.55,.8),()=>{for(let i=0;i<24;i++){const x=X0+20+i*29,y=Y(-50)+(i%3)*14;circ(x+Math.sin(TT*20+i)*3,y,2.2,'rgba(88,184,208,.9)');}});
  ln([X0,Y(-45),X1,Y(-45)],'#a98a58',2);
  // jacket + piles
  const cx=400,yb=Y(-43),yt=Y(35),L=y=>lerp(70,30,(yb-y)/(yb-yt));
  alphaDo(seg(u,.1,.16),()=>{ctx.strokeStyle='#8595a0';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<4;i++){const y0=lerp(yb,yt,i/4),y1=lerp(yb,yt,(i+1)/4);ctx.moveTo(cx-L(y0),y0);ctx.lineTo(cx+L(y1),y1);ctx.moveTo(cx+L(y0),y0);ctx.lineTo(cx-L(y1),y1);ctx.moveTo(cx-L(y1),y1);ctx.lineTo(cx+L(y1),y1);}ctx.stroke();
   for(const s of [-1,1])ln([cx+s*L(yb),yb,cx+s*L(yt),yt],'#b7c3ca',5);box(cx-36,yt-14,72,12,'#f2c230');});
  const pf=ease(seg(u,.22,.46)),tip=lerp(-45,-128,pf);
  if(pf>0)for(const s of [-1,1]){const g=ctx.createLinearGradient(cx+s*70-6,0,cx+s*70+6,0);g.addColorStop(0,'#3d4b55');g.addColorStop(.4,'#8093a0');g.addColorStop(1,'#33404a');ctx.fillStyle=g;ctx.fillRect(cx+s*70-6,yb,12,Y(tip)-yb);}
  ctx.restore();
  // axis
  for(let d=40;d>=-160;d-=20){if(d<-150)continue;wt(X0-12,Y(d)+5,(d>0?'+':'')+d+' m',14,'rgba(227,236,238,.65)',600,'right',COND);ln([X0-6,Y(d),X0,Y(d)],'rgba(255,255,255,.4)',1);}
  wt(84,184,'地層與基樁（示意）',19,'#f2c230',700);
  alphaDo(seg(u,.02,.1),()=>{LY.forEach(l=>wt(856,(Y(l[0])+Y(l[1]))/2+6,l[3],16,'#13232e',700,'right'));});
  const dim=(x,d0,d1,t,col,a)=>alphaDo(a,()=>{ln([x,Y(d0),x,Y(d1)],col,2);ln([x-6,Y(d0),x+6,Y(d0)],col,2);ln([x-6,Y(d1),x+6,Y(d1)],col,2);wt(x+12,(Y(d0)+Y(d1))/2+6,t,16,col,700);});
  dim(530,0,-45,'水深 30–50 m','#fff',seg(u,.04,.1));
  dim(530,-45,-128,'樁長 約 80–90 m','#f2c230',seg(u,.44,.5));
  alphaDo(seg(u,.14,.2),()=>{ln([290,Y(-43),290,Y(35)],'#7dc8dc',2);wt(282,Y(20),'套管',16,'#7dc8dc',700,'right');wt(282,Y(20)+22,'約 80 m',16,'#7dc8dc',700,'right',COND);});
  alphaDo(band(u,.56,.8),()=>wt(856,Y(-45)-12,'地震時可能液化',16,'#ff9d7a',700,'right'));
  // right cards
  alphaDo(seg(u,.26,.32),()=>{card(920,150,620,300,{bg:'rgba(7,27,39,.8)'});wt(944,192,'基樁規格（大彰化 1 & 2a）',20,'#fff',700);
   [['直徑','約 4 m'],['長度','約 80–90 m'],['重量','約 400 t'],['每座套管','3 支']].forEach((r,i)=>{const y=246+i*52;wt(944,y,r[0],18,'rgba(227,236,238,.85)',600);wt(1516,y,r[1],26,'#f2c230',700,'right',COND);if(i<3)ln([944,y+16,1516,y+16],'rgba(255,255,255,.1)',1);});});
  alphaDo(seg(u,.56,.62),()=>{card(920,470,620,330,{bg:'rgba(232,87,42,.08)',st:'rgba(232,87,42,.45)'});wt(944,512,'台灣海峽的挑戰',20,'#ff9d7a',700);
   ['表層沉積鬆軟，承載力要靠深層','颱風帶來極端的風浪載重','地震時鬆散砂層可能液化','所以樁要打得更深、更長'].forEach((t,i)=>{const a=seg(u,.58+i*.06,.64+i*.06);alphaDo(a,()=>{circ(952,556+i*62,5,i===3?'#7dffc4':'#ff9d7a');wrap16(968,562+i*62,t,550,18,i===3?'#7dffc4':'#fff',600,24);});});});
 }},
/* 5 */{t:'套管下放與插樁',en:'Lowering and stabbing the jacket',dur:14,side:true,
 d:'基樁打好後，運輸駁船把套管載到機位，重件吊裝船以吊索吊起整座套管，緩緩放入海中。腳柱底端延伸出較細的插樁，要對準預先打好、突出海床數公尺的樁頂。水下攝影機與遙控無人潛水器（ROV）監看對位，插樁全部插入樁內後，套管的重量由基樁承接，吊索放鬆，接著進行灌漿。',
 s:[[0,'重件吊裝船以吊索吊起整座套管'],[.16,'套管緩緩放入海中，逐步下降'],[.44,'遙控潛水器（ROV）監看插樁與樁頂對位'],[.66,'插樁全部插入基樁，重量交給基樁承接'],[.84,'吊索放鬆，接著準備灌漿']],
 cam:u=>camMix({x:700,y:420,s:1.08},{x:640,y:560,s:1.5},ease(seg(u,.4,.6))),
 draw(u){
  const deck=hlvDeck16(R16);vsl(R16,430,false,{damp:.35},vHLV);
  const yb=jkY16(u),yt=yb-JH16;
  jk16(TX,yb,{});
  for(const x of [TX-JX16,TX+JX16])pile16(x,PT16);
  const slack=seg(u,.8,.95),hk={x:TX,y:yt-70+slack*40};
  crane(CP16,deck-30,360,hk.x,hk.y,{col:'#e9b21f'});
  if(slack<1){ctx.save();ctx.globalAlpha*=1-slack*.6;slings(hk.x,hk.y,[TX-40,yt-4,TX+40,yt-4]);ctx.restore();}
  const rx=lerp(TX-300,TX-150,ease(seg(u,.36,.5))),ry=PT16-26;
  if(u>.34)rov(rx,ry,TT,u<.8);
  alphaDo(band(u,.44,.7),()=>{ctx.setLineDash([4,4]);ln([rx+14,ry-12,TX-JX16-4,PT16-6],'rgba(125,255,196,.8)',1.4);ctx.setLineDash([]);});
  const gap=Math.max(0,(PT16-yb)/(PT16-(SEA-30))*55);
  lab(TX,yt,'套管（1,200 t 以上）',{dx:120,dy:-40,a:band(u,.02,.3),st:'s'});
  lab(hk.x,hk.y,'吊索',{dx:-80,dy:-20,a:band(u,.04,.26),minor:true});
  lab(TX-JX16,yb+30,'插樁',{dx:-90,dy:10,a:band(u,.4,.72),st:'s'});
  lab(TX+JX16,PT16+20,'預先打好的基樁',{dx:150,dy:-10,a:band(u,.3,.62)});
  lab(rx,ry-20,'遙控潛水器（ROV）',{dx:-60,dy:-50,a:band(u,.44,.7)});
  lab(TX+JX16,PT16,'插入完成',{dx:80,dy:40,a:band(u,.7,1),st:'g'});
 },
 hud(u){hudPanel(230,150,'套管下放（示例）',seg(u,.04,.1),w=>{const yb=jkY16(u),gap=Math.max(0,(PT16-yb)/(PT16-(SEA-30))*55);
  hrow(52,'吊重','1,200 t 以上',w);
  hrow(78,'距樁頂',gap.toFixed(1)+' m',w,'#f2c230');hbar(14,86,w-28,1-gap/55,'#f2c230');
  hrow(118,'水平偏差',(gap>1?(gap*.6).toFixed(0):'0')+' cm',w,gap>1?'#fff':'#7dffc4');
  hrow(142,'插樁',u>.66?'3 / 3 到位':'對位中',w,u>.66?'#7dffc4':'#fff');});}},
/* 6 */{t:'灌漿連接：把套管鎖在樁上',en:'The grouted connection',dur:15,
 d:'插樁與基樁之間留有一圈環狀間隙。灌漿時先以密封圈封住底部，再從套管上的灌漿管把高強度灌漿料由底部往上泵送，灌漿料逐漸上升填滿整個間隙，直到從樁頂溢出，確認沒有空隙。樁壁與插樁表面焊有一圈圈的剪力榫，讓硬化後的灌漿層能把風浪載重從腳柱傳到基樁，再傳進海床。灌漿料需要養護，強度足夠後才能安裝轉接段與風機。',
 s:[[0,'插樁與基樁之間留有一圈環狀間隙'],[.22,'底部密封後，灌漿料由下往上泵送'],[.5,'灌漿料填滿間隙，從樁頂溢出確認無空隙'],[.76,'剪力榫讓載重經灌漿層傳到基樁與海床']],
 draw(u){
  diagBG();
  card(60,150,780,650,{bg:'rgba(7,27,39,.78)'});
  const cx=GC16,Ro=150,Tw=22,Ri=100,Tp=18,SB=340;
  ctx.save();rrp(61,151,778,648,14);ctx.clip();
  box(61,200,778,SB-200,'rgba(59,147,187,.28)');
  box(61,SB,778,460,'rgba(181,154,106,.75)');ln([61,SB,839,SB],'#a98a58',2);
  // grout level
  const gp=ease(seg(u,.24,.56)),gy=lerp(GBOT16,GTOP16,gp);
  if(gp>0)for(const s of [-1,1])box(s<0?cx-Ro:cx+Ri,gy,Ro-Ri,GBOT16-gy,'#b9c0c4');
  // pile walls
  const pg=(x)=>{const g=ctx.createLinearGradient(x,0,x+Tw,0);g.addColorStop(0,'#3d4b55');g.addColorStop(.4,'#8093a0');g.addColorStop(1,'#33404a');return g;};
  ctx.fillStyle=pg(cx-Ro-Tw);ctx.fillRect(cx-Ro-Tw,GTOP16,Tw,500);ctx.fillStyle=pg(cx+Ro);ctx.fillRect(cx+Ro,GTOP16,Tw,500);
  // pin (jacket leg)
  box(cx-Ri-Tp,190,Tp,GBOT16-190,'#a5b3bb');box(cx+Ri,190,Tp,GBOT16-190,'#a5b3bb');box(cx-Ri,GBOT16-6,Ri*2,6,'#8595a0');
  // shear keys
  alphaDo(Math.max(.5,band(u,.74,1)),()=>{for(let y=GTOP16+60;y<GBOT16-20;y+=56){for(const s of [-1,1]){
   circ(cx+s*Ro,y,5,band(u,.74,1)>.5?'#f2c230':'#6d7b84');circ(cx+s*Ri,y+28,5,band(u,.74,1)>.5?'#f2c230':'#6d7b84');}}});
  // seals
  alphaDo(seg(u,.18,.24),()=>{for(const s of [-1,1])box(s<0?cx-Ro:cx+Ri,GBOT16-4,Ro-Ri,12,'#2b3137');});
  // grout line along the left annulus
  alphaDo(seg(u,.2,.26),()=>{ln([cx-Ri-Tp-40,180,cx-Ri-Tp-40,GBOT16-14,cx-Ri-Tp-10,GBOT16-14],'#e8a33a',4);
   if(u>.24&&u<.6)for(let i=0;i<6;i++){const k=(TT*.8+i/6)%1,y=lerp(190,GBOT16-14,k);circ(cx-Ri-Tp-40,y,3,'#fff');}});
  // overflow
  alphaDo(seg(u,.54,.6),()=>{for(const s of [-1,1]){const x=s<0?cx-Ro-Tw-6:cx+Ro+Tw+6;for(let i=0;i<4;i++){const k=(TT*.5+i/4)%1;circ(x+s*k*16,GTOP16+k*38,4-k*2,'rgba(185,192,196,.9)');}}});
  // load path arrows
  alphaDo(seg(u,.8,.86),()=>{const k=(TT*.9)%1;for(const s of [-1,1]){arrow(cx+s*(Ri+Tp/2),200,cx+s*(Ri+Tp/2),260,'#f2c230',3);
   arrow(cx+s*(Ri+10),440+k*60,cx+s*(Ro-10),460+k*60,'#f2c230',2.5);arrow(cx+s*(Ro+Tw+8),560,cx+s*(Ro+Tw+60),600,'#f2c230',2.5);}});
  ctx.restore();
  wt(84,190,'灌漿連接剖面（間隙已放大）',19,'#f2c230',700);
  wt(cx,236,'腳柱（插樁）',16,'#fff',700,'center');
  alphaDo(band(u,.02,.24),()=>{wt(cx-Ro-Tw-12,GTOP16+120,'基樁',17,'#fff',700,'right');wt(cx,GTOP16+200,'環狀間隙',17,'#7dffc4',700,'center');
   arrow(cx-44,GTOP16+194,cx-Ri+10,GTOP16+194,'#7dffc4',2);arrow(cx+44,GTOP16+194,cx+Ri-10,GTOP16+194,'#7dffc4',2);});
  alphaDo(band(u,.2,.5),()=>{wt(cx-Ri-Tp-50,250,'灌漿管',16,'#e8a33a',700,'right');wt(cx,GBOT16-20,'底部密封',16,'#fff',700,'center');});
  alphaDo(band(u,.52,.78),()=>wt(cx,GTOP16-20,'樁頂溢流確認',17,'#7dffc4',700,'center'));
  alphaDo(band(u,.76,1),()=>{wt(cx,GTOP16+120,'剪力榫',17,'#f2c230',700,'center');wt(cx,GBOT16+50,'載重傳入海床',17,'#f2c230',700,'center');});
  // steps
  card(880,150,660,430,{bg:'rgba(7,27,39,.78)'});wt(904,190,'灌漿步驟',21,'#fff',700);
  const ST=[['插樁到位','確認位置與垂直度',.02],['底部密封','封住間隙底端',.18],['由下往上灌漿','高強度灌漿料泵送',.26],['溢流確認','樁頂冒出灌漿料',.54],['養護','強度足夠再裝轉接段',.66]];
  ST.forEach((s,i)=>{const a=seg(u,s[2],s[2]+.06);const y=240+i*72;alphaDo(Math.max(.25,a),()=>{
   circ(924,y,17,a>=1?'#f2c230':'rgba(255,255,255,.12)');wt(924,y+7,String(i+1),18,a>=1?'#0e2a3b':'#fff',700,'center',COND);
   wt(956,y-2,s[0],19,'#fff',700);wt(956,y+24,s[1],15,'rgba(227,236,238,.8)',500);
   if(i<4)ln([924,y+20,924,y+52],'rgba(255,255,255,.2)',2);});});
  alphaDo(seg(u,.6,.66),()=>{card(880,600,660,200,{bg:'rgba(242,194,48,.07)',st:'rgba(242,194,48,.4)'});
   wt(904,640,'灌漿料抗壓強度（典型）',18,'rgba(227,236,238,.9)',600);
   wt(904,706,'100+',54,'#f2c230',700,'left',COND);wt(904+wtw('100+',54,700,COND)+10,706,'MPa',26,'#f2c230',700,'left',COND);
   wrap16(1130,676,'約為一般結構混凝土的 3–4 倍',380,17,'#fff',600,24);
   wrap16(904,760,'硬化前避免擾動，養護期間要注意海況',600,15,'rgba(227,236,238,.8)',500,21);});
 }}
]};
