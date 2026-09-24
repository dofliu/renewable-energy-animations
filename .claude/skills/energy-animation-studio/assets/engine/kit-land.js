/* ================= LAND & OPEN-SEA KIT =================
   Generic backgrounds for topics that are not the offshore-wind coastal section:
   solar farms, onshore wind, storage, hydrogen, wave/tidal energy.
   World is 1600×900; GY is the default ground line. */
const GY=600;
const LCLOUDS=(()=>{const r=rng(17),a=[];for(let i=0;i<9;i++)a.push({x:r()*2400-400,y:40+r()*200,s:.5+r()*.8,sp:3+r()*5});return a;})();
function lcloud(x,y,s){ctx.beginPath();[[0,0,26],[26,-12,31],[56,-5,25],[80,4,18],[-24,6,17]].forEach(([dx,dy,r])=>{ctx.moveTo(x+dx*s+r*s,y+dy*s);ctx.arc(x+dx*s,y+dy*s,r*s,0,TAU);});ctx.fillStyle='rgba(255,255,255,.9)';ctx.fill();}
/* sky down to horizon hy; o.sun={x,y}; o.dusk 0..1 warms the colours */
function landSky(hy,o){
  hy=hy||GY;o=o||{};const k=o.dusk||0;
  const g=ctx.createLinearGradient(0,VY0,0,hy);
  g.addColorStop(0,k?`rgb(${lerp(79,60,k)|0},${lerp(143,70,k)|0},${lerp(196,130,k)|0})`:'#4f8fc4');
  g.addColorStop(.6,k?`rgb(${lerp(156,220,k)|0},${lerp(198,130,k)|0},${lerp(223,110,k)|0})`:'#9cc6df');
  g.addColorStop(1,k?`rgb(${lerp(226,250,k)|0},${lerp(239,190,k)|0},${lerp(242,120,k)|0})`:'#e2eff2');
  ctx.fillStyle=g;ctx.fillRect(VX0,VY0,VX1-VX0,hy-VY0+2);
  const sn=o.sun||{x:1280,y:120};const rg=ctx.createRadialGradient(sn.x,sn.y,8,sn.x,sn.y,220);rg.addColorStop(0,'rgba(255,248,222,.85)');rg.addColorStop(1,'rgba(255,244,214,0)');ctx.fillStyle=rg;ctx.fillRect(sn.x-230,sn.y-230,460,460);circ(sn.x,sn.y,20,'#fff8e2');
  if(o.clouds!==false)for(const c of LCLOUDS){const x=((c.x+TT*c.sp+400)%2400)-400;if(c.y>hy-40)continue;lcloud(x,c.y,c.s);}
}
const groundY=x=>GY+6*Math.sin(x*.004)+3*Math.sin(x*.013);
const LAND_LAY=[{d:0,c:'#7a9a55',n:'表土'},{d:16,c:'#a4876a',n:'黏土層'},{d:110,c:'#c4a678',n:'砂礫層'},{d:230,c:'#6d6862',n:'岩盤'}];
/* layered ground below groundY; o.layers overrides LAND_LAY; o.grass=false hides grass */
function drawGround(o){
  o=o||{};const Ls=o.layers||LAND_LAY;
  Ls.forEach((L,i)=>{ctx.beginPath();ctx.moveTo(VX0,groundY(VX0)+L.d);for(let x=VX0;x<=VX1;x+=8)ctx.lineTo(x,groundY(x)+L.d+(i?nz(x*.01+i)*4:0));ctx.lineTo(VX1,VY1+20);ctx.lineTo(VX0,VY1+20);ctx.closePath();ctx.fillStyle=L.c;ctx.fill();});
  if(o.grass!==false){ctx.strokeStyle='#5c8a3f';ctx.lineWidth=1;ctx.beginPath();for(let x=Math.floor(VX0);x<=VX1;x+=5){const y=groundY(x);ctx.moveTo(x,y);ctx.lineTo(x+1,y-3-(x%4));}ctx.stroke();}
}
function landBase(){landSky();drawGround();}
function landEnd(){}
/* open-sea swell for wave / tidal topics: o={y:mean level,A:amplitude,L:wavelength,sp:speed,bed:seabed y} */
function swellY(x,o){o=o||{};const A=o.A===undefined?18:o.A,L=o.L||260,sp=o.sp||1.2,y0=o.y||420;return y0+A*Math.sin(TAU*(x/L)-TT*sp)+A*.22*Math.sin(TAU*(x/(L*.43))-TT*sp*1.7);}
function drawSwell(o){
  o=o||{};const bed=o.bed||820;const g=ctx.createLinearGradient(0,(o.y||420)-40,0,bed);g.addColorStop(0,'#3b93bb');g.addColorStop(.5,'#1d6690');g.addColorStop(1,'#0b3858');
  ctx.beginPath();ctx.moveTo(VX0,swellY(VX0,o));for(let x=VX0;x<=VX1;x+=6)ctx.lineTo(x,swellY(x,o));ctx.lineTo(VX1,VY1+20);ctx.lineTo(VX0,VY1+20);ctx.closePath();ctx.fillStyle=g;ctx.fill();
  ctx.beginPath();ctx.moveTo(VX0,swellY(VX0,o));for(let x=VX0;x<=VX1;x+=6)ctx.lineTo(x,swellY(x,o));ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1.8;ctx.stroke();
  box(VX0,bed,VX1-VX0,VY1-bed+20,'#b59a6a');ln([VX0,bed,VX1,bed],'#a98a58',2);
}
function seaBase(){landSky(420,{});drawSwell();}
/* ---- objects ---- */
/* PV module on a post: base (x,y) on ground, panel width w, tilt in degrees facing right→left sun */
function solarPanel(x,y,w,tilt,o){
  o=o||{};const h=o.h||w*.45,a=-(tilt||20)*Math.PI/180;ln([x,y,x,y-h],'#8a99a3',Math.max(2,w*.05));
  ctx.save();ctx.translate(x,y-h);ctx.rotate(a);const t=w*.06;box(-w/2,-t,w,t,'#1f3f66');
  ctx.strokeStyle='rgba(160,200,240,.55)';ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<6;i++){ctx.moveTo(-w/2+w*i/6,-t);ctx.lineTo(-w/2+w*i/6,0);}ctx.stroke();
  box(-w/2,-t,w,1.5,'#9fc3e6');if(o.glint)box(-w/2+w*.2,-t,w*.25,1.5,'#fff');ctx.restore();
}
function pvRow(x0,y,n,gap,w,tilt){for(let i=0;i<n;i++)solarPanel(x0+i*gap,y,w,tilt);}
/* side-view truck; flip=true faces left */
function truck(x,y,flip,col,load){ctx.save();ctx.translate(x,y);if(flip)ctx.scale(-1,1);
  box(0,-34,90,26,col||'#e8572a');box(92,-40,34,32,'#f4f6f7');box(100,-36,18,12,'#2a3a46');box(0,-10,126,6,'#2b3137');
  if(load)load();for(const wx of [18,44,108])circ(wx,-3,8,'#222','#555',2);ctx.restore();}
function fence(x0,x1,y){ctx.strokeStyle='rgba(60,70,75,.7)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x0,y-18);ctx.lineTo(x1,y-18);ctx.moveTo(x0,y-9);ctx.lineTo(x1,y-9);for(let x=x0;x<=x1;x+=16){ctx.moveTo(x,y);ctx.lineTo(x,y-20);}ctx.stroke();}
function cabinet(x,y,w,h,col,name){box(x,y-h,w,h,col||'#dfe5e8');ctx.strokeStyle='rgba(0,0,0,.25)';ctx.strokeRect(x,y-h,w,h);ctx.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<3;i++)ctx.fillRect(x+w*.15,y-h+h*(.2+i*.22),w*.7,h*.08);}
/* pile-driving rig for ground-mounted PV or onshore foundations */
function pileRig(x,y,hammerY){box(x-40,y-18,80,18,'#e9b21f');for(const wx of [-26,0,26])circ(x+wx,y-2,7,'#222');ln([x+20,y-18,x+20,y-170],'#394650',4);box(x+10,hammerY-26,20,26,'#e07b27');}
