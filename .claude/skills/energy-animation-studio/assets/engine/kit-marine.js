/* ================= MARINE KIT: coastal cross-section world (sea left, land right) ================= */
/* ================= world geometry ================= */
const SEA=470,TX=640,OX=1120,COAST=1455;
const bedBase=x=>702+6*Math.sin(x*.013)+4*Math.sin(x*.031+1);
function bedY(x){
  if(x<1180) return bedBase(x);
  if(x<COAST){const k=(x-1180)/(COAST-1180);const s=k*k*(3-2*k);return lerp(bedBase(1180),SEA+6,s);}
  return Math.max(440,SEA+6-(x-COAST)*.5);
}
const wv=(x,t)=>SEA+2.4*Math.sin(x*.021-t*1.7)+1.5*Math.sin(x*.047+t*1.2);
const bedTX=bedY(TX),bedOX=bedY(OX);
const PILE_TOP=460,PILE_W=30,PILE_BOT=bedTX+130,PILE_L=PILE_BOT-PILE_TOP;
const TP_TOP=420,TP_BOT=478,TP_H=58;
const TW_TOP=185,HS=(TP_TOP-TW_TOP)/3;
const tw=y=>lerp(16,26,(y-TW_TOP)/(TP_TOP-TW_TOP));
const HUB={x:TX-44,y:TW_TOP-20},BR=165;
const JH=bedOX-440;
const LAY=[{a:0,b:36,c:'#d9c393',n:'細砂層',m:'0–7 m'},{a:36,b:92,c:'#a4876a',n:'粉土質黏土',m:'7–18 m'},{a:92,b:152,c:'#c4a678',n:'緊密砂層',m:'18–30 m'},{a:152,b:760,c:'#6d6862',n:'岩盤／極緊密層',m:'> 30 m'}];
const WRECK_X=250,UXO_X=560;
const HDD_EXIT=1350;

/* ================= environment ================= */
const WATER_END=COAST+12;
function surf(x){if(x>=WATER_END)return SEA+1;const k=clamp((WATER_END-x)/90);return SEA+(wv(x,TT)-SEA)*k;}
const CLOUDS=(()=>{const r=rng(11),a=[];for(let i=0;i<10;i++)a.push({x:r()*2600-500,y:30+r()*230,s:.55+r()*.9,sp:3+r()*6});return a;})();
function cloud(x,y,s,a){
  ctx.save();ctx.globalAlpha*=a;
  ctx.beginPath();
  [[0,0,26],[26,-12,31],[56,-5,25],[80,4,18],[-24,6,17],[40,8,20]].forEach(([dx,dy,r])=>{ctx.moveTo(x+dx*s+r*s,y+dy*s);ctx.arc(x+dx*s,y+dy*s,r*s,0,TAU);});
  ctx.fillStyle='rgba(255,255,255,.92)';ctx.fill();
  ctx.clip();ctx.fillStyle='rgba(170,195,215,.35)';ctx.fillRect(x-60*s,y+8*s,180*s,30*s);
  ctx.restore();
}
function drawSky(){
  const g=ctx.createLinearGradient(0,-120,0,SEA);
  g.addColorStop(0,'#4f8fc4');g.addColorStop(.55,'#9cc6df');g.addColorStop(1,'#e2eff2');
  ctx.fillStyle=g;ctx.fillRect(VX0,VY0,VX1-VX0,SEA+10-VY0);
  const sx=1290,sy=110,rg=ctx.createRadialGradient(sx,sy,10,sx,sy,230);
  rg.addColorStop(0,'rgba(255,248,222,.85)');rg.addColorStop(.25,'rgba(255,244,214,.35)');rg.addColorStop(1,'rgba(255,244,214,0)');
  ctx.fillStyle=rg;ctx.fillRect(sx-240,sy-240,480,480);circ(sx,sy,20,'#fff8e2');
  for(const c of CLOUDS){let x=((c.x+TT*c.sp+500)%2700+2700)%2700-500;if(x>VX1+50||x+120*c.s<VX0-50)continue;cloud(x,c.y,c.s,.95);}
  // distant mountains on the land side
  ctx.fillStyle='rgba(120,150,170,.55)';ctx.beginPath();ctx.moveTo(1260,SEA+2);
  for(let x=1260;x<=2200;x+=20){ctx.lineTo(x,SEA-12-38*clamp((x-1260)/400)-18*Math.sin(x*.013)-10*Math.sin(x*.041));}
  ctx.lineTo(2200,SEA+2);ctx.fill();
  const hz=ctx.createLinearGradient(0,SEA-70,0,SEA);hz.addColorStop(0,'rgba(255,255,255,0)');hz.addColorStop(1,'rgba(255,255,255,.4)');
  ctx.fillStyle=hz;ctx.fillRect(VX0,SEA-70,VX1-VX0,72);
}
function waterTop(x0,x1){ctx.moveTo(x0,surf(x0));for(let x=x0;x<=x1;x+=8)ctx.lineTo(x,surf(x));ctx.lineTo(x1,surf(x1));}
function drawWaterBack(){
  const xe=Math.min(VX1,WATER_END+40);if(xe<=VX0)return;
  const g=ctx.createLinearGradient(0,SEA,0,780);
  g.addColorStop(0,'#3b93bb');g.addColorStop(.45,'#1d6690');g.addColorStop(1,'#0b3858');
  ctx.beginPath();waterTop(VX0,xe);ctx.lineTo(xe,VY1+10);ctx.lineTo(VX0,VY1+10);ctx.closePath();ctx.fillStyle=g;ctx.fill();
}
function waterRegion(){
  const xe=Math.min(VX1,WATER_END);ctx.beginPath();waterTop(VX0,xe);
  for(let x=xe;x>=VX0;x-=8)ctx.lineTo(x,bedY(x));ctx.lineTo(VX0,bedY(VX0));ctx.closePath();
}
function soilRegion(){ctx.beginPath();ctx.moveTo(VX0,bedY(VX0));for(let x=VX0;x<=VX1;x+=6)ctx.lineTo(x,bedY(x));ctx.lineTo(VX1,bedY(VX1));ctx.lineTo(VX1,VY1+20);ctx.lineTo(VX0,VY1+20);ctx.closePath();}
const layB=(x,i)=>bedY(x)+LAY[i].a+(i?nz(x*.012+i*3.1)*5:0);
const SOILTEX=(()=>{const r=rng(5),a=[];for(let x=-600;x<2300;x+=5.5){const d=r()*330;a.push({x:x+r()*4,d,r:r(),q:r()});}return a;})();
function drawSoil(){
  for(let i=0;i<LAY.length;i++){
    ctx.beginPath();ctx.moveTo(VX0,layB(VX0,i));for(let x=VX0;x<=VX1;x+=8)ctx.lineTo(x,layB(x,i));
    ctx.lineTo(VX1,layB(VX1,i));ctx.lineTo(VX1,VY1+20);ctx.lineTo(VX0,VY1+20);ctx.closePath();ctx.fillStyle=LAY[i].c;ctx.fill();
  }
  for(const p of SOILTEX){
    if(p.x<VX0||p.x>VX1)continue;const b=bedY(p.x),y=b+p.d;if(y>VY1)continue;
    let li=0;for(let i=1;i<LAY.length;i++)if(y>layB(p.x,i))li=i;
    if(y<b+3)continue;
    if(li===0){ctx.fillStyle='rgba(120,95,50,.35)';ctx.fillRect(p.x,y,1.6,1.4);}
    else if(li===1){ctx.fillStyle='rgba(70,50,35,.28)';ctx.fillRect(p.x,y,5+p.r*5,1);}
    else if(li===2){ctx.fillStyle=p.q>.5?'rgba(110,85,50,.35)':'rgba(255,240,210,.35)';ctx.beginPath();ctx.arc(p.x,y,1+p.r*1.2,0,TAU);ctx.fill();}
    else{ctx.strokeStyle='rgba(30,30,30,.28)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(p.x,y);ctx.lineTo(p.x+4+p.r*6,y+(p.q-.5)*6);ctx.stroke();}
  }
  ctx.strokeStyle='rgba(40,25,10,.22)';ctx.lineWidth=1;
  for(let i=1;i<LAY.length;i++){ctx.beginPath();ctx.moveTo(VX0,layB(VX0,i));for(let x=VX0;x<=VX1;x+=8)ctx.lineTo(x,layB(x,i));ctx.stroke();}
  // seabed line
  ctx.beginPath();ctx.moveTo(VX0,bedY(VX0));for(let x=VX0;x<=VX1;x+=5)ctx.lineTo(x,bedY(x)+(x<WATER_END?Math.sin(x*.35)*.8:0));
  ctx.strokeStyle='#a98a58';ctx.lineWidth=2.2;ctx.stroke();
  // grass and beach on land
  const g0=Math.max(VX0,1500);
  if(VX1>g0){ctx.beginPath();ctx.moveTo(g0,bedY(g0));for(let x=g0;x<=VX1;x+=6)ctx.lineTo(x,bedY(x)-1.5);for(let x=VX1;x>=g0;x-=6)ctx.lineTo(x,bedY(x)+5);ctx.closePath();ctx.fillStyle='#78a557';ctx.fill();
    ctx.strokeStyle='#5c8a3f';ctx.lineWidth=1;ctx.beginPath();for(let x=g0;x<=VX1;x+=4){const y=bedY(x)-1;ctx.moveTo(x,y);ctx.lineTo(x+1,y-3-(x%3));}ctx.stroke();}
}
function tree(x,s){const y=bedY(x);box(x-1.2*s,y-9*s,2.4*s,9*s,'#6b4f35');circ(x,y-13*s,6*s,'#4f8a43');circ(x-3*s,y-10*s,4.5*s,'#5c9a4c');circ(x+3.5*s,y-11*s,4.5*s,'#467c3b');}
function drawWaterOver(){
  if(VX0>WATER_END)return;
  ctx.save();waterRegion();ctx.fillStyle='rgba(16,78,118,.17)';ctx.fill();ctx.clip();
  for(let i=0;i<6;i++){
    const x0=((i*310+TT*9)%1900)-200;
    const g=ctx.createLinearGradient(0,SEA,0,SEA+230);g.addColorStop(0,'rgba(220,245,255,.10)');g.addColorStop(1,'rgba(220,245,255,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x0,SEA);ctx.lineTo(x0+36,SEA);ctx.lineTo(x0+130,SEA+240);ctx.lineTo(x0+70,SEA+240);ctx.closePath();ctx.fill();
  }
  ctx.restore();
  const xe=Math.min(VX1,WATER_END);
  ctx.beginPath();waterTop(VX0,xe);ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1.6;ctx.stroke();
  ctx.save();ctx.translate(0,3.5);ctx.beginPath();waterTop(VX0,xe);ctx.strokeStyle='rgba(255,255,255,.18)';ctx.lineWidth=1;ctx.stroke();ctx.restore();
}
function soilVeil(x0,x1,a){ctx.save();soilRegion();ctx.clip();ctx.fillStyle=`rgba(120,95,62,${a||.38})`;ctx.fillRect(x0,VY0,x1-x0,VY1-VY0+30);ctx.restore();}

/* ================= vessels (local coords: stern x=0, bow +x, waterline y=0) ================= */
function hull(len,fb,dr,col,bot,stripe,bowRise){
  bowRise=bowRise===undefined?6:bowRise;
  ctx.beginPath();ctx.moveTo(-2,-fb);ctx.lineTo(len-22,-fb);ctx.lineTo(len,-fb-bowRise);
  ctx.bezierCurveTo(len-3,-fb*.2,len-10,dr*.6,len-32,dr);ctx.lineTo(12,dr);ctx.quadraticCurveTo(0,dr,0,dr*.2);ctx.closePath();
  ctx.fillStyle=col;ctx.fill();
  ctx.save();ctx.clip();
  ctx.fillStyle=bot||'#8e2f2a';ctx.fillRect(-6,1.5,len+12,dr+8);
  if(stripe){ctx.fillStyle=stripe;ctx.fillRect(-6,-fb*.5-1.5,len+12,3);}
  ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(-6,-fb,len+12,2);
  ctx.fillStyle='rgba(0,0,0,.14)';ctx.fillRect(-6,-fb*.25,len+12,fb*.25);
  ctx.restore();
}
function vsl(x,len,flip,o,fn){
  o=o||{};const d=flip?-1:1,cx=x+d*len/2,damp=o.damp===undefined?1:o.damp;
  const wl=SEA+(surf(cx)-SEA)*damp;
  const tilt=o.tilt?Math.atan((surf(cx+len*.4)-surf(cx-len*.4))/(len*.8))*o.tilt:0;
  ctx.save();if(o.a!==undefined)ctx.globalAlpha*=clamp(o.a);ctx.translate(x,wl);ctx.rotate(tilt);if(flip)ctx.scale(-1,1);fn(wl);ctx.restore();
  return wl;
}
const wlAt=(cx,damp)=>SEA+(surf(cx)-SEA)*(damp===undefined?1:damp);
function superBlock(x,y,w,h,rows,col){box(x,y,w,h,col||'#f4f6f7');ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=.8;ctx.strokeRect(x,y,w,h);for(let r=0;r<rows;r++)wins(x+4,y+4+r*10,Math.floor((w-6)/7),7,4,4.5);}
function mast(x,y,h){ln([x,y,x,y-h],'#4a5560',1.4);ln([x-5,y-h*.6,x+5,y-h*.6],'#4a5560',1.1);circ(x,y-h-1,1.6,'#f2c230');}

function vWorkboat(){
  hull(130,14,8,'#e8572a','#6d2a22','#fff');rail(2,78,-14,5);
  superBlock(80,-36,34,22,1);superBlock(84,-46,24,10,0);wins(87,-44,3,7,4,4);mast(96,-46,16);
}
function vSurvey(){
  hull(170,15,9,'#f4f6f7','#2c5f8a','#1f7f99');
  // gondola / drop keel
  poly([108,9,112,17,132,17,136,9],'#2c5f8a');
  superBlock(88,-40,64,25,2);superBlock(98,-52,44,12,0);wins(101,-50,6,7,4,4);mast(122,-52,20);circ(114,-60,3,'#fff','#8a99a3');
  // A-frame at stern
  ln([6,-15,10,-44,20,-15],'#e8572a',2.4);ln([10,-44,-4,-40],'#e8572a',2);
  box(22,-22,20,7,'#6b7780');circ(32,-24,5,'#4d5962');
}
function vDrill(){
  hull(210,16,11,'#e9eef0','#963027','#0e5a8a');
  // pipe rack
  for(let i=0;i<5;i++)box(18,-19-i*2.6,62,2.2,i%2?'#8b6b4a':'#9d7b56');
  // derrick over moonpool at 105
  const b=-16,h=92;ln([92,b,101,b-h,109,b-h,118,b],'#e8572a',2.2);
  ctx.strokeStyle='#e8572a';ctx.lineWidth=1;ctx.beginPath();
  for(let i=0;i<6;i++){const y0=b-i*h/6,y1=b-(i+1)*h/6,k0=i/6,k1=(i+1)/6;ctx.moveTo(lerp(92,101,k0),y0);ctx.lineTo(lerp(118,109,k1),y1);ctx.moveTo(lerp(118,109,k0),y0);ctx.lineTo(lerp(92,101,k1),y1);}
  ctx.stroke();box(98,b-h-6,14,6,'#394650');
  superBlock(150,-60,50,44,3);superBlock(146,-72,58,12,0);wins(150,-70,7,7.5,4,4);
  box(140,-80,74,4,'#6b7780');ctx.strokeStyle='#f2c230';ctx.lineWidth=1.2;ctx.strokeRect(140,-80,74,4);mast(170,-80,16);
}
function vResearch(){
  hull(150,14,9,'#2f7a5c','#1d3b30','#fff');
  superBlock(70,-38,52,24,2);superBlock(78,-50,38,12,0);wins(81,-48,5,7,4,4);
  rail(78,116,-50,5,'rgba(255,255,255,.8)');mast(108,-50,22);
  // stern crane
  ln([14,-14,14,-30],'#e9edef',3);
}
function vHLV(){
  hull(430,18,14,'#b3332b','#5b2320','#fff',8);
  // deck stuff
  box(2,-30,22,12,'#4d5962');
  box(60,-62,40,16,'#e9b21f');box(66,-48,28,30,'#e9edef');ctx.strokeStyle='rgba(0,0,0,.2)';ctx.strokeRect(66,-48,28,30);
  wins(70,-58,4,8,4,4,'#2a3a46');
  superBlock(350,-88,62,70,5);box(344,-100,74,12,'#f4f6f7');wins(348,-97,9,7.4,4,5);
  box(380,-106,60,4,'#6b7780');ctx.strokeStyle='#f2c230';ctx.lineWidth=1.2;ctx.strokeRect(380,-106,60,4);
  mast(372,-100,22);
}
function drawGripper(R,deck,open){
  const o=open*9;box(R-2,deck-10,TX+30-R,6,'#2b3137');
  box(TX-18-o-5,deck-26,6,30,'#e8572a');box(TX+18+o-1,deck-26,6,30,'#e8572a');
  box(TX+26,deck-14,6,14,'#2b3137');
}
function vBubble(){
  hull(100,11,7,'#2d6ea3','#1a3550','#fff');
  circ(26,-24,13,'#6b7780','#394650',1.5);ctx.strokeStyle='#1c252c';ctx.lineWidth=1;for(let r=4;r<12;r+=3){ctx.beginPath();ctx.arc(26,-24,r,0,TAU);ctx.stroke();}
  box(44,-24,14,13,'#e8572a');superBlock(62,-32,26,21,1);mast(76,-32,14);
}
function vGuard(){
  hull(80,9,5,'#f4f6f7','#2a3a46','#e8572a');superBlock(40,-24,26,15,1);mast(56,-24,12);person(48,-24,'#e8572a',.9);
}
function vCraneVessel(){
  hull(460,20,15,'#1f3d5c','#6a2622','#f2c230',8);
  superBlock(8,-92,50,72,6);box(4,-104,58,12,'#f4f6f7');wins(8,-101,7,7.4,4,5);
  box(-4,-110,46,4,'#6b7780');ctx.strokeStyle='#f2c230';ctx.lineWidth=1.2;ctx.strokeRect(-4,-110,46,4);mast(50,-104,20);
  box(402,-60,36,40,'#e9edef');box(394,-78,52,18,'#e8a33a');wins(400,-74,5,8,4,4,'#2a3a46');
}
function vCLV(){
  hull(250,16,11,'#2c3e50','#7a2a24','#e8572a');
  // carousel
  box(40,-46,110,30,'#3a4650');ctx.strokeStyle='#e8a33a';ctx.lineWidth=1.3;for(let y=-43;y<-18;y+=4){ctx.beginPath();ctx.moveTo(42,y);ctx.lineTo(148,y);ctx.stroke();}
  box(38,-50,114,4,'#20282e');box(92,-58,6,8,'#20282e');
  box(14,-26,18,10,'#6b7780');
  // chute at stern
  ctx.strokeStyle='#8a99a3';ctx.lineWidth=4;ctx.beginPath();ctx.arc(4,-12,10,-Math.PI/2,-Math.PI,true);ctx.stroke();
  superBlock(180,-60,56,44,3);box(176,-72,64,12,'#f4f6f7');wins(180,-69,8,7.4,4,5);mast(208,-72,18);
}
function vSmallWork(){
  hull(110,12,7,'#e8572a','#6d2a22','#fff');
  ln([2,-12,-6,-44,12,-12],'#f2c230',2.2);ln([-6,-44,-10,-42],'#f2c230',2);
  circ(30,-19,7,'#394650');superBlock(62,-34,32,22,1);mast(80,-34,14);
}
function vCTV(){
  ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(70,-12);ctx.lineTo(72,-4);ctx.lineTo(66,6);ctx.lineTo(6,6);ctx.lineTo(0,-2);ctx.closePath();ctx.fillStyle='#f2c230';ctx.fill();
  box(0,1,68,5,'#2a3a46');box(20,1,30,5,'rgba(0,0,0,.25)');
  box(70,-16,7,16,'#1c1c1c');
  superBlock(24,-28,34,16,1);box(28,-32,24,4,'#e9edef');mast(40,-32,10);
}
function vSOV(){
  hull(230,16,11,'#1f5f9e','#6a2622','#fff');
  superBlock(150,-66,70,50,4);box(146,-78,78,12,'#f4f6f7');wins(150,-75,10,7.4,4,5);mast(190,-78,18);
  box(112,-46,10,30,'#f2c230');box(20,-24,40,8,'#e9edef');
}
function wtivLeg(x,bot,col,a){
  const top=bot-420;ctx.save();ctx.globalAlpha*=a;
  ctx.strokeStyle=col;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(x-7,bot-6);ctx.lineTo(x-7,top);ctx.moveTo(x+7,bot-6);ctx.lineTo(x+7,top);ctx.stroke();
  ctx.lineWidth=1;ctx.beginPath();for(let y=bot-6;y>top;y-=14){ctx.moveTo(x-7,y);ctx.lineTo(x+7,y-7);ctx.lineTo(x-7,y-14);}ctx.stroke();
  poly([x-16,bot-6,x+16,bot-6,x+8,bot+4,x-8,bot+4],col);
  box(x-8,top-3,16,3,'#555');ctx.restore();
}
function drawWTIV(R,d,legBot){
  wtivLeg(R-440,legBot,'#d9b44a',.75);wtivLeg(R-40,legBot,'#d9b44a',.75);
  // hull
  box(R-482,d,482,32,'#e3e9ec');box(R-482,d+12,482,6,'#0e5a8a');box(R-482,d+24,482,8,'#7a2a24');
  poly([R-482,d,R-495,d+6,R-488,d+32,R-482,d+32],'#e3e9ec');
  ctx.strokeStyle='rgba(0,0,0,.2)';ctx.lineWidth=1;ctx.strokeRect(R-482,d,482,32);
  // accommodation
  superBlock(R-480,d-70,50,70,6);box(R-484,d-82,58,12,'#f4f6f7');wins(R-481,d-79,7,7.5,4,5);
  box(R-505,d-88,70,5,'#6b7780');ctx.strokeStyle='#f2c230';ctx.lineWidth=1.2;ctx.strokeRect(R-505,d-88,70,5);mast(R-440,d-82,18);
  // blade rack stands
  for(const sx of [R-282,R-392]){ln([sx,d,sx,d-46],'#4d5962',2);for(let k=0;k<3;k++)ln([sx-8,d-38+12*k+3,sx+8,d-38+12*k+3],'#4d5962',1.6);}
  // jacking houses + front legs
  for(const lx of [R-455,R-25]){box(lx-15,d-22,30,22,'#c4ced3');}
  wtivLeg(R-455,legBot,'#f2c230',1);wtivLeg(R-25,legBot,'#f2c230',1);
  box(R-44,d-40,38,14,'#f2c230');box(R-40,d-44,30,4,'#394650');
}

/* ================= structures ================= */
function drawPile(bx,by,ang,L,w){
  ctx.save();ctx.translate(bx,by);ctx.rotate(ang-Math.PI/2);
  const g=ctx.createLinearGradient(-w/2,0,w/2,0);g.addColorStop(0,'#3d4b55');g.addColorStop(.35,'#8093a0');g.addColorStop(1,'#33404a');
  ctx.beginPath();ctx.moveTo(-w/2,0);ctx.lineTo(-w/2,-L*.8);ctx.lineTo(-w*.43,-L);ctx.lineTo(w*.43,-L);ctx.lineTo(w/2,-L*.8);ctx.lineTo(w/2,0);ctx.closePath();ctx.fillStyle=g;ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,.2)';ctx.lineWidth=.8;ctx.beginPath();for(let k=1;k<10;k++){const y=-L*k/10;const hw=k>8?w*.45:w/2;ctx.moveTo(-hw,y);ctx.lineTo(hw,y);}ctx.stroke();
  box(-w*.46,-L-2,w*.92,3,'#252e35');
  ctx.fillStyle='#f2c230';ctx.fillRect(-w*.47,-L+3,w*.94,14);
  ctx.restore();
}
function drawHammer(x,yb,flash){
  if(flash>0){const rg=ctx.createRadialGradient(x,yb,2,x,yb,46);rg.addColorStop(0,`rgba(255,236,170,${.9*flash})`);rg.addColorStop(1,'rgba(255,200,80,0)');ctx.fillStyle=rg;ctx.fillRect(x-50,yb-50,100,100);}
  box(x-21,yb-26,42,34,'#3a4046');box(x-17,yb-100,34,74,'#e07b27');
  box(x-17,yb-100,34,6,'#2b2f33');box(x-17,yb-60,34,4,'#2b2f33');box(x-6,yb-110,12,10,'#2b2f33');
  ln([x+17,yb-80,x+24,yb-70,x+24,yb-40],'#222',1.4);
  ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(x-13,yb-94,6,32);
}
function drawTP(cx,yb,o){
  o=o||{};const top=yb-58;
  if(!o.bare){
    ctx.strokeStyle='#e8a33a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-30,top+2);ctx.lineTo(cx-30,yb+24);ctx.moveTo(cx-37,top+2);ctx.lineTo(cx-37,yb+24);ctx.stroke();
    ctx.lineWidth=1;ctx.beginPath();for(let y=top+6;y<yb+22;y+=5){ctx.moveTo(cx-37,y);ctx.lineTo(cx-30,y);}ctx.stroke();
    ln([cx-30,top+30,cx-17,top+30],'#c08a1c',1.4);ln([cx-30,yb+10,cx-17,yb+10],'#c08a1c',1.4);
  }
  const g=ctx.createLinearGradient(cx-17,0,cx+17,0);g.addColorStop(0,'#c9971a');g.addColorStop(.4,'#f7d24c');g.addColorStop(1,'#b3830c');
  ctx.fillStyle=g;ctx.fillRect(cx-17,top,34,58);box(cx-18,yb-4,36,4,'#a67b10');
  rrp(cx+3,top+16,9,15,2);ctx.fillStyle='#e8edf0';ctx.fill();
  if(!o.bare){
    box(cx-57,top-3,114,4,'#6f7a80');rail(cx-57,cx+57,top-3,8);
    ln([cx-57,top+1,cx-17,top+14],'#555',1.2);ln([cx+57,top+1,cx+17,top+14],'#555',1.2);
    ln([cx+46,top-3,cx+46,top-24,cx+32,top-28],'#e8572a',2);ln([cx+32,top-28,cx+32,top-20],'#333',.8);
  }
}
function drawTowerSec(cx,yb,k){
  const yt=yb-HS,wb=tw(TP_TOP-k*HS),wt=tw(TP_TOP-(k+1)*HS);
  const g=ctx.createLinearGradient(cx-wb/2,0,cx+wb/2,0);g.addColorStop(0,'#c3ccd1');g.addColorStop(.4,'#f8fafb');g.addColorStop(1,'#aeb8be');
  poly([cx-wb/2,yb,cx-wt/2,yt,cx+wt/2,yt,cx+wb/2,yb],g);
  box(cx-wt/2-1,yt,wt+2,2.2,'#8f9aa1');box(cx-wb/2-1,yb-2.2,wb+2,2.2,'#8f9aa1');
  if(k===0){rrp(cx-4,yb-24,8,15,2);ctx.fillStyle='#9aa5ab';ctx.fill();}
}
function drawNacelle(ax,ay,cut,light){
  box(ax-14,ay-4,28,4,'#8c979d');
  const g=ctx.createLinearGradient(0,ay-38,0,ay-3);g.addColorStop(0,'#fdfefe');g.addColorStop(1,'#c3ccd1');
  rrp(ax-30,ay-38,92,35,5);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='rgba(0,0,0,.15)';ctx.lineWidth=1;ctx.stroke();
  box(ax+30,ay-47,26,9,'#dfe5e8');ctx.strokeStyle='rgba(0,0,0,.2)';ctx.lineWidth=.7;ctx.beginPath();for(let x=ax+33;x<ax+55;x+=3){ctx.moveTo(x,ay-46);ctx.lineTo(x,ay-39);}ctx.stroke();
  rail(ax+2,ax+28,ay-38,6);
  if(cut>0){
    ctx.save();ctx.globalAlpha*=clamp(cut);
    rrp(ax-26,ay-34,84,27,3);ctx.fillStyle='#22313b';ctx.fill();
    circ(ax-20,ay-20,9,'#8c979d','#c9d1d5',1.5);circ(ax-20,ay-20,3.5,'#394650');
    box(ax-10,ay-32,16,24,'#b87333');ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=.8;ctx.beginPath();for(let x=ax-8;x<ax+6;x+=3){ctx.moveTo(x,ay-32);ctx.lineTo(x,ay-8);}ctx.stroke();
    box(ax+10,ay-31,8,22,'#2f6fb0');box(ax+20,ay-31,8,22,'#2f6fb0');ctx.fillStyle='#8fd0ff';ctx.fillRect(ax+12,ay-28,3,2);ctx.fillRect(ax+22,ay-28,3,2);
    box(ax+32,ay-30,20,21,'#6c777e');ctx.strokeStyle='#4a545a';ctx.beginPath();for(let x=ax+34;x<ax+52;x+=3){ctx.moveTo(x,ay-28);ctx.lineTo(x,ay-11);}ctx.stroke();
    box(ax-4,ay-10,8,4,'#e8a33a');circ(ax-8,ay-7,2,'#e8a33a');circ(ax+8,ay-7,2,'#e8a33a');
    ctx.restore();
  }
  ctx.beginPath();ctx.ellipse(ax-30,ay-20,28,16.5,0,Math.PI/2,Math.PI*1.5);ctx.closePath();
  const sg=ctx.createLinearGradient(0,ay-37,0,ay-3);sg.addColorStop(0,'#ffffff');sg.addColorStop(1,'#cfd7db');ctx.fillStyle=sg;ctx.fill();ctx.strokeStyle='rgba(0,0,0,.15)';ctx.stroke();
  circ(ax+52,ay-49,2.4,light?'#ff3b30':'#8a1a14');if(light){const rg=ctx.createRadialGradient(ax+52,ay-49,1,ax+52,ay-49,14);rg.addColorStop(0,'rgba(255,60,48,.6)');rg.addColorStop(1,'rgba(255,60,48,0)');ctx.fillStyle=rg;ctx.fillRect(ax+38,ay-63,28,28);}
}
function chord(s){if(s<.04)return 7;if(s<.22)return 7+6*ease((s-.04)/.18);return lerp(13,2.2,Math.pow((s-.22)/.78,.85));}
function drawBlade(cx,cy,a,R,col){
  const k=R/165;ctx.save();ctx.translate(cx,cy);ctx.rotate(a);
  ctx.beginPath();ctx.moveTo(0,-3.5*k);
  for(let i=0;i<=16;i++){const s=i/16;ctx.lineTo(s*R,-chord(s)*.36*k);}
  for(let i=16;i>=0;i--){const s=i/16;ctx.lineTo(s*R,chord(s)*.64*k);}
  ctx.closePath();ctx.fillStyle=col||'#f5f7f8';ctx.fill();ctx.strokeStyle='rgba(60,80,95,.4)';ctx.lineWidth=.8;ctx.stroke();
  ctx.fillStyle='rgba(120,135,145,.35)';ctx.fillRect(0,-3.6*k,R*.035,7.2*k);
  ctx.restore();
}
function drawRotor(hx,hy,a,n){for(let i=0;i<n;i++)drawBlade(hx,hy,a-i*TAU/3,BR);circ(hx,hy,8.5,'#f2f5f6','rgba(0,0,0,.25)',1);circ(hx,hy,3,'#c9d1d5');}
function jacketHW(y,yb,H){return lerp(55,40,(yb-y)/H);}
function drawJacket(cx,yb,H,jt){
  const yt=yb-H,L=y=>jacketHW(y,yb,H);
  ctx.strokeStyle='rgba(150,165,175,.55)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx-L(yb)+8,yb);ctx.lineTo(cx-L(yt)+8,yt);ctx.moveTo(cx+L(yb)-8,yb);ctx.lineTo(cx+L(yt)-8,yt);ctx.stroke();
  ctx.strokeStyle='#8595a0';ctx.lineWidth=2;ctx.beginPath();
  for(let i=0;i<4;i++){const y0=yb-H*i/4,y1=yb-H*(i+1)/4;ctx.moveTo(cx-L(y0),y0);ctx.lineTo(cx+L(y1),y1);ctx.moveTo(cx+L(y0),y0);ctx.lineTo(cx-L(y1),y1);ctx.moveTo(cx-L(y1),y1);ctx.lineTo(cx+L(y1),y1);}
  ctx.stroke();
  if(jt){ctx.strokeStyle='#5d6b74';ctx.lineWidth=2.4;ctx.beginPath();
    ctx.moveTo(cx-62,yb-15);ctx.quadraticCurveTo(cx-60,yb-30,cx-L(yb-40)-6,yb-40);ctx.lineTo(cx-L(yt+4)-6,yt+4);
    ctx.moveTo(cx+62,yb-15);ctx.quadraticCurveTo(cx+60,yb-30,cx+L(yb-40)+6,yb-40);ctx.lineTo(cx+L(yt+4)+6,yt+4);ctx.stroke();
    circ(cx-62,yb-15,3,'#5d6b74');circ(cx+62,yb-15,3,'#5d6b74');}
  const leg=(s)=>{ctx.strokeStyle='#2f3a42';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(cx+s*L(yb),yb);ctx.lineTo(cx+s*L(yt),yt);ctx.stroke();ctx.strokeStyle='#a5b3bb';ctx.lineWidth=4;ctx.stroke();
    ctx.strokeStyle='#f2c230';ctx.lineWidth=4.2;ctx.beginPath();ctx.moveTo(cx+s*L(yt+34),yt+34);ctx.lineTo(cx+s*L(yt),yt);ctx.stroke();};
  leg(-1);leg(1);
  for(const s of [-1,1]){const x=cx+s*(L(yb)+10.5);box(x-3.5,yb-26,7,26,'#6d7b84');box(cx+s*L(yb)-11,yb-2,22,4,'#55626a');}
  box(cx-L(yt)-3,yt-4,L(yt)*2+6,5,'#f2c230');
}
function drawPins(cx,yb,prog,flash){
  const off=44*(1-prog);
  for(const s of [-1,1]){const x=cx+s*(55+10.5);box(x-2.5,yb-26-off,5,70,'#9aa6ad');box(x-3,yb-27-off,6,2,'#394650');
    if(flash>0){const rg=ctx.createRadialGradient(x,yb-27-off,1,x,yb-27-off,16);rg.addColorStop(0,`rgba(255,230,160,${flash})`);rg.addColorStop(1,'rgba(255,230,160,0)');ctx.fillStyle=rg;ctx.fillRect(x-18,yb-45-off,36,36);}}
}
function drawTopside(cx,yb,det){
  box(cx-75,yb-14,150,14,'#6f7c85');ctx.strokeStyle='rgba(0,0,0,.25)';ctx.lineWidth=.8;ctx.beginPath();for(let x=cx-75;x<cx+75;x+=15){ctx.moveTo(x,yb-14);ctx.lineTo(x+15,yb);}ctx.stroke();
  box(cx-70,yb-80,134,66,'#e4e8ea');ctx.strokeStyle='rgba(0,0,0,.14)';ctx.strokeRect(cx-70,yb-80,134,66);ctx.beginPath();ctx.moveTo(cx-70,yb-47);ctx.lineTo(cx+64,yb-47);ctx.stroke();
  box(cx-34,yb-74,44,56,'#56626a');ctx.strokeStyle='#39434a';ctx.lineWidth=1;ctx.beginPath();for(let x=cx-32;x<cx+10;x+=3.5){ctx.moveTo(x,yb-70);ctx.lineTo(x,yb-22);}ctx.stroke();
  box(cx-26,yb-86,4,12,'#8b6b4a');box(cx-14,yb-86,4,12,'#8b6b4a');box(cx-2,yb-86,4,12,'#8b6b4a');
  box(cx+18,yb-74,40,24,'#cfd6da');wins(cx+21,yb-70,5,7.4,4,4);box(cx+18,yb-44,40,24,'#cfd6da');wins(cx+21,yb-40,5,7.4,4,4);
  box(cx-64,yb-74,24,52,'#cfd6da');wins(cx-61,yb-70,3,7,4,4);
  box(cx-75,yb-84,150,4,'#6f7c85');
  box(cx-122,yb-96,70,4,'#6f7c85');ctx.strokeStyle='#f2c230';ctx.lineWidth=1.4;ctx.strokeRect(cx-122,yb-96,70,4);
  ln([cx-122,yb-92,cx-70,yb-80],'#6f7c85',1.6);ln([cx-100,yb-92,cx-70,yb-66],'#6f7c85',1.2);
  if(det>0){ctx.save();ctx.globalAlpha*=det;ctx.fillStyle='#6fe07a';for(let x=cx-120;x<cx-54;x+=9){ctx.fillRect(x,yb-98,2,2);}ctx.restore();}
  box(cx+48,yb-98,10,14,'#e8a33a');ln([cx+53,yb-98,cx+86,yb-130],'#e8a33a',2.4);ln([cx+86,yb-130,cx+86,yb-110],'#333',.8);
  box(cx+30,yb-100,5,16,'#9aa5ab');circ(cx-60,yb-86,2,'#f2c230');
}
function drawOnshore(a){
  alphaDo(a,()=>{
    const g=440;ctx.strokeStyle='rgba(60,70,75,.6)';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(1526,g-8);ctx.lineTo(1600,g-8);for(let x=1526;x<=1600;x+=5){ctx.moveTo(x,g);ctx.lineTo(x,g-8);}ctx.stroke();
    superBlock(1532,g-26,26,26,1,'#dde3e6');box(1530,g-29,30,3,'#8a979e');
    box(1565,g-18,18,18,'#5d6b74');ctx.strokeStyle='#3e4a52';ctx.lineWidth=.8;ctx.beginPath();for(let x=1567;x<1582;x+=3){ctx.moveTo(x,g-16);ctx.lineTo(x,g-2);}ctx.stroke();
    for(const bx of [1568,1574,1580]){box(bx-1,g-28,2,10,'#c9b89a');circ(bx,g-28,1.6,'#a0876a');}
    ctx.strokeStyle='#6b7780';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(1588,g);ctx.lineTo(1588,g-40);ctx.moveTo(1598,g);ctx.lineTo(1598,g-40);ctx.moveTo(1585,g-40);ctx.lineTo(1601,g-40);
    for(let y=g;y>g-40;y-=8){ctx.moveTo(1588,y);ctx.lineTo(1598,y-8);}ctx.stroke();
  });
}
function drawPylon(){
  const x=1632,g=bedY(1632),top=g-120;
  ctx.strokeStyle='#5d6b74';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(x-11,g);ctx.lineTo(x-2.5,top);ctx.moveTo(x+11,g);ctx.lineTo(x+2.5,top);
  for(let k=0;k<8;k++){const y0=g-k*15,y1=g-(k+1)*15,w0=lerp(11,2.5,k/8),w1=lerp(11,2.5,(k+1)/8);ctx.moveTo(x-w0,y0);ctx.lineTo(x+w1,y1);ctx.moveTo(x+w0,y0);ctx.lineTo(x-w1,y1);}
  ctx.moveTo(x-20,top+14);ctx.lineTo(x+20,top+14);ctx.moveTo(x-16,top+36);ctx.lineTo(x+16,top+36);ctx.stroke();
  ctx.strokeStyle='rgba(40,50,55,.55)';ctx.lineWidth=.8;ctx.beginPath();
  for(const [dx,dy] of [[-20,14],[20,14],[-16,36],[16,36]]){ctx.moveTo(x+dx,top+dy+4);if(dx<0)ctx.quadraticCurveTo(x+dx-20,top+dy+30,1597,g-38);else ctx.quadraticCurveTo(x+dx+60,top+dy+26,x+dx+160,top+dy-6);}
  ctx.stroke();
}
function hddPt(t){
  if(t<.8){const q=t/.8,m=1-q,p0={x:1350,y:bedY(1350)},p1={x:1430,y:560},p2={x:1505,y:452};return {x:m*m*p0.x+2*m*q*p1.x+q*q*p2.x,y:m*m*p0.y+2*m*q*p1.y+q*q*p2.y};}
  const q=(t-.8)/.2;return {x:lerp(1505,1545,q),y:lerp(452,441,q)};
}
function drawHDD(a){alphaDo(a,()=>{ctx.beginPath();for(let i=0;i<=30;i++){const p=hddPt(i/30);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);}
  ctx.strokeStyle='rgba(50,45,40,.55)';ctx.lineWidth=6;ctx.stroke();ctx.strokeStyle='rgba(215,205,185,.9)';ctx.lineWidth=3.2;ctx.stroke();});}

/* ================= life ================= */
function dolphin(x,y,ang,s){
  ctx.save();ctx.translate(x,y);ctx.rotate(ang);if(Math.cos(ang)<0)ctx.scale(s,-s);else ctx.scale(s,s);
  ctx.beginPath();ctx.moveTo(23,0);ctx.quadraticCurveTo(19,-3,12,-4.5);ctx.quadraticCurveTo(0,-7.5,-14,-3.2);ctx.quadraticCurveTo(-20,-1.2,-24,-.3);ctx.lineTo(-24,1);ctx.quadraticCurveTo(-10,5.5,8,4.2);ctx.quadraticCurveTo(17,3,23,.8);ctx.closePath();
  ctx.fillStyle='#b8a0a6';ctx.fill();
  ctx.beginPath();ctx.ellipse(4,2.2,12,2.2,0,0,TAU);ctx.fillStyle='rgba(245,215,215,.75)';ctx.fill();
  poly([-1,-6.5,-9,-14,-10,-5],'#a88f96');poly([-23,0,-31,-6,-27,.3,-31,6],'#a88f96');poly([7,3,2,8.5,0,4],'#a88f96');
  circ(14,-1.6,.9,'#222');ctx.restore();
}
function fish(x,y,dir,s,col){ctx.save();ctx.translate(x,y);ctx.scale(dir*s,s);ctx.beginPath();ctx.ellipse(0,0,5,1.9,0,0,TAU);ctx.fillStyle=col||'rgba(200,225,235,.85)';ctx.fill();poly([-4,0,-8,-2.6,-8,2.6],col||'rgba(200,225,235,.85)');ctx.restore();}
function school(cx,cy,n,seed,t,sp,dir,col){const r=rng(seed);for(let i=0;i<n;i++){const ox=(r()-.5)*sp*2,oy=(r()-.5)*sp*.7,ph=r()*6;fish(cx+ox+Math.sin(t*1.3+ph)*6*dir,cy+oy+Math.sin(t*2+ph)*3,dir,.8+r()*.5,col);}}
function bird(x,y,s,t){const f=Math.sin(t*9)*5*s;ctx.strokeStyle='#2a3440';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(x-7*s,y-f);ctx.quadraticCurveTo(x-3*s,y-3*s-f*.4,x,y);ctx.quadraticCurveTo(x+3*s,y-3*s-f*.4,x+7*s,y-f);ctx.stroke();}
function rov(x,y,t,active){
  if(active){for(let i=0;i<14;i++){const k=((t*1.3+i/14)%1);circ(x-12-k*50,y-6-k*30+Math.sin(i*3)*6,3+k*9,`rgba(150,125,90,${.4*(1-k)})`);}}
  box(x-14,y-5,30,5,'#222');for(let i=0;i<5;i++)circ(x-11+i*6,y-2.5,2,'#555');
  box(x-12,y-19,26,14,'#f2c230');box(x-8,y-16,8,5,'#2a3a46');box(x+4,y-23,6,4,'#e8572a');
  if(active){box(x-17,y-8,4,20,'#555');}
}
function buoy(x,wl,t,a){
  alphaDo(a===undefined?1:a,()=>{
    ctx.save();ctx.translate(x,wl);ctx.rotate(Math.sin(t*1.6)*.05);
    poly([-20,-6,20,-6,14,10,-14,10],'#f2c230','#9c7a12',1);box(-4,10,8,10,'#9c7a12');
    ln([-12,-6,-3,-44,3,-44,12,-6],'#6b7780',1.6);box(-9,-28,18,13,'#f4f6f7');ctx.strokeStyle='#8a99a3';ctx.strokeRect(-9,-28,18,13);box(-6,-31,12,3,'#394650');
    poly([-22,-18,-10,-22,-10,-16,-22,-12],'#1f4a73');poly([22,-18,10,-22,10,-16,22,-12],'#1f4a73');
    ln([0,-44,0,-58],'#6b7780',1.2);circ(0,-59,2.2,Math.sin(t*4)>0?'#ffe35a':'#b59a2a');ln([4,-50,10,-52],'#6b7780',1);
    ctx.restore();
  });
}

/* ================= persistent scenery items ================= */
function drawWreck(hl){
  const x=WRECK_X,y=bedY(x);ctx.save();ctx.translate(x,y+3);ctx.rotate(-.12);
  poly([-34,0,-31,-9,18,-12,34,-4,30,3],'#5b4b3b','#3a2f25',1);poly([-20,-9,-15,-17,-1,-16,1,-10],'#4f4133');ln([-6,-12,-2,-27],'#4a3d30',2.2);
  ctx.restore();
  if(hl>0){ring(x,y-6,30+Math.sin(TT*6)*3,`rgba(232,87,42,${.8*hl})`,2);}
}
function drawUXO(hl,a){
  alphaDo(a,()=>{const x=UXO_X,y=bedY(x);ctx.save();ctx.translate(x,y-2);ctx.rotate(.35);rrp(-9,-3.2,15,6.4,3.2);ctx.fillStyle='#4c5a3f';ctx.fill();poly([-9,0,-13,-4,-13,4],'#3c4832');ctx.restore();
    if(hl>0){for(let i=0;i<3;i++){const k=(TT*1.2+i/3)%1;ring(x,y-3,6+k*34,`rgba(232,87,42,${hl*(1-k)})`,1.8);}}});
}
const FLS_X=380;
function wb0(u){if(u<.46)return {x:lerp(-320,400,easeOut(seg(u,0,.2))),a:1};return {x:lerp(400,1500,easeIn(seg(u,.46,.78))),a:1-seg(u,.66,.76)};}
function flsPos(){
  const c=SC,u=SU;
  if(c>0)return {x:FLS_X,y:wlAt(FLS_X,.9),free:true};
  const w=wb0(u),deck=wlAt(w.x+65,.8)-14;
  if(u<.2)return {x:w.x+34,y:deck-20};
  if(u<.36){const p=kf(u,[[.2,w.x+34,deck-20],[.25,w.x+34,deck-44],[.3,FLS_X,deck-44],[.36,FLS_X,wlAt(FLS_X,.9)]]);return {x:p.x,y:p.y};}
  return {x:FLS_X,y:wlAt(FLS_X,.9),free:true};
}
const flsAlpha=()=>SC<4?1:SC===4?1-seg(SU,0,.08):0;
function drawMooring(){
  const a=flsAlpha();if(a<=0)return;let p=1;if(SC===0){if(SU<.33)return;p=ease(seg(SU,.33,.45));}
  const b=flsPos(),top={x:b.x,y:b.y+20},cl={x:lerp(b.x,340,p),y:lerp(b.y+26,bedY(340)-4,p)};
  alphaDo(a,()=>{ctx.setLineDash([3,2.2]);ctx.beginPath();ctx.moveTo(top.x,top.y);ctx.quadraticCurveTo(lerp(top.x,cl.x,.3)+10,lerp(top.y,cl.y,.62),cl.x,cl.y);ctx.strokeStyle='#2b3035';ctx.lineWidth=1.7;ctx.stroke();ctx.setLineDash([]);box(cl.x-8,cl.y-4,16,9,'#4d5760');});
}
function drawFLS(){const a=flsAlpha();if(a<=0)return;const b=flsPos();buoy(b.x,b.y,b.free?TT:0,a);}
function windV(h){return 10.3*Math.pow(h/150,.11)+.35*Math.sin(TT*1.9+h*.07);}

/* default side-view background for shots with side:true */
function sideBase(){
  drawSky();drawWaterBack();drawSoil();
  for(const [x,s] of [[1476,.8],[1490,1],[1506,.9],[1612,.9],[1664,1.1],[1690,.8],[1720,1]])if(x>VX0-20&&x<VX1+20)tree(x,s);
  if(VX1>1600)drawPylon();
}
function sideEnd(){soilVeil(VX0,VX1,.24);drawWaterOver();}
