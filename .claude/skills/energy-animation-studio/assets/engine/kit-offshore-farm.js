const FARM_I18N={"en": [[900, "MW", "Installed capacity"], [3500, "GWh", "Annual generation"], [880, "k", "Homes supplied"], [1750, "kt", "CO₂ avoided a year"]], "ja": [[900, "MW", "設備容量"], [35, "億kWh", "年間発電量"], [88, "万世帯", "家庭の年間電力"], [175, "万トン", "年間 CO₂ 削減量"]]};
QA_KEEP.push('從一陣海風，到萬家燈火');
Object.assign(UI,{endMain:["從一陣海風，到萬家燈火", "From a sea breeze to city lights", "一陣の海風から、街の灯りへ"],endSub:["From a sea breeze to city lights", "從一陣海風，到萬家燈火", "From a sea breeze to city lights"]});
/* ================= CH12 farm ================= */
const mixc=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
const rgb=(c,a)=>`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${a===undefined?1:a})`;
function tri(d,s,n,k1,k2){return mixc(mixc(d,s,k1),n,k2);}
const FARM=(()=>{const r=rng(99),A=[];for(let row=0;row<6;row++)for(let col=0;col<10;col++){const Z=1.45+.9*row,X=(col-4.5)*1.05+(row%2?.5:0);A.push({X,Z,ph:r()*TAU,w:.85+r()*.2,row,col});}return A;})();
const STARS=(()=>{const r=rng(3),A=[];for(let i=0;i<120;i++)A.push({x:r()*1700-50,y:r()*300,s:r()*1.4+.3,p:r()*TAU});return A;})();
const CITY=(()=>{const r=rng(8),A=[];for(let i=0;i<70;i++){const t=r();A.push({t,o:r()*16,s:r()});}return A;})();
function shore(t){const m=1-t;return {x:m*m*1230+2*m*t*1380+t*t*1640,y:m*m*331+2*m*t*334+t*t*412};}
const proj=(X,Z)=>({x:800+X*620/Z,y:330+560/Z,q:1/Z});
function renderFarm(u){
  applyCam({x:800,y:405,s:1});
  const k1=ease(seg(u,.3,.5)),k2=ease(seg(u,.66,.82)),night=k2,dusk=k1*(1-k2);
  const top=tri([79,143,196],[48,64,118],[5,12,30],k1,k2),mid=tri([156,198,223],[214,122,100],[12,26,52],k1,k2),hor=tri([226,239,242],[250,190,118],[26,42,70],k1,k2);
  let g=ctx.createLinearGradient(0,-60,0,332);g.addColorStop(0,rgb(top));g.addColorStop(.6,rgb(mid));g.addColorStop(1,rgb(hor));ctx.fillStyle=g;ctx.fillRect(VX0,VY0,VX1-VX0,340-VY0);
  if(night>.5){const ma=clamp((night-.5)*2.5);circ(260,110,16,`rgba(250,244,220,${ma})`);circ(268,104,15,rgb(top));}
  if(night>0)for(const s of STARS){ctx.fillStyle=`rgba(255,255,255,${night*(.45+.4*Math.sin(TT*2+s.p))})`;ctx.fillRect(s.x,s.y,s.s,s.s);}
  const sx=lerp(1170,1060,seg(u,0,.66)),sy=lerp(120,352,ease(seg(u,.22,.66)));
  if(sy<345){const sc=tri([255,248,225],[255,170,90],[255,120,60],k1,k2);const rg=ctx.createRadialGradient(sx,sy,6,sx,sy,260);rg.addColorStop(0,rgb(sc,.8));rg.addColorStop(.3,rgb(sc,.25));rg.addColorStop(1,rgb(sc,0));ctx.fillStyle=rg;ctx.fillRect(sx-270,sy-270,540,540);
    ctx.save();ctx.beginPath();ctx.rect(VX0,VY0,VX1-VX0,331-VY0);ctx.clip();circ(sx,sy,lerp(20,26,k1),rgb(mixc([255,250,232],[255,196,120],k1)));ctx.restore();}
  for(const c of CLOUDS){const x=((c.x*.8+TT*c.sp*.6+500)%2700)-500;if(c.y>250)continue;const cc=tri([255,255,255],[245,170,150],[40,52,80],k1,k2);ctx.save();ctx.globalAlpha=.8;ctx.fillStyle=rgb(cc,.85);ctx.beginPath();ctx.ellipse(x,c.y*.8,70*c.s,12*c.s,0,0,TAU);ctx.ellipse(x+40*c.s,c.y*.8-6,46*c.s,10*c.s,0,0,TAU);ctx.fill();ctx.restore();}
  const mc=tri([128,156,176],[110,90,120],[14,24,42],k1,k2);ctx.fillStyle=rgb(mc);ctx.beginPath();ctx.moveTo(1100,332);for(let x=1100;x<=1720;x+=16)ctx.lineTo(x,330-40*clamp((x-1100)/260)-14*Math.sin(x*.02)-8*Math.sin(x*.057));ctx.lineTo(1720,332);ctx.fill();
  const s1=tri([70,140,176],[120,96,120],[16,30,52],k1,k2),s2=tri([22,92,132],[36,50,86],[4,12,26],k1,k2);
  g=ctx.createLinearGradient(0,330,0,900);g.addColorStop(0,rgb(s1));g.addColorStop(1,rgb(s2));ctx.fillStyle=g;ctx.fillRect(VX0,330,VX1-VX0,VY1-330);
  if(sy<360){const ga=.5*(1-night)*(.4+k1);for(let i=0;i<40;i++){const y=334+i*i*.35,w=(10+i*2.4)*(.7+.3*Math.sin(TT*3+i));ctx.fillStyle=`rgba(255,${lerp(240,180,k1)|0},${lerp(200,110,k1)|0},${ga*(1-i/40)})`;ctx.fillRect(sx-w/2+Math.sin(TT*2+i)*4,y,w,1.6);}}
  ctx.strokeStyle=`rgba(255,255,255,${.08*(1-night)})`;ctx.lineWidth=1;for(let i=0;i<26;i++){const y=340+Math.pow(i/26,1.6)*560,x=((i*173+TT*10)%1800)-100;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+30+i*3,y);ctx.stroke();}
  const lc=tri([104,140,96],[80,70,72],[10,18,30],k1,k2);ctx.fillStyle=rgb(lc);ctx.beginPath();ctx.moveTo(1230,331);for(let i=0;i<=20;i++){const p=shore(i/20);ctx.lineTo(p.x,p.y);}ctx.lineTo(1720,331);ctx.closePath();ctx.fill();
  const bl=tri([230,215,170],[200,150,120],[30,36,50],k1,k2);ctx.strokeStyle=rgb(bl);ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=20;i++){const p=shore(i/20);i?ctx.lineTo(p.x,p.y-1):ctx.moveTo(p.x,p.y-1);}ctx.stroke();
  const cl=seg(u,.52,.72);if(cl>0)for(const c of CITY){const p=shore(c.t);const y=p.y-3-c.o*(.3+c.t*.6);const rg=ctx.createRadialGradient(p.x,y,0,p.x,y,3+c.s*3);rg.addColorStop(0,`rgba(255,${200+c.s*40|0},120,${cl*.95})`);rg.addColorStop(1,'rgba(255,200,120,0)');ctx.fillStyle=rg;ctx.fillRect(p.x-6,y-6,12,12);}
  const ca=seg(u,.18,.26);
  const glow=(a,lw)=>`rgba(255,${lerp(206,220,night)|0},${lerp(70,110,night)|0},${a})`;
  const ossP=proj(.8,3.7),exEnd=shore(.6);
  if(ca>0){
    ctx.lineCap='round';
    for(let row=0;row<6;row++){const ts=FARM.filter(t=>t.row===row);ctx.beginPath();ts.forEach((t,i)=>{const p=proj(t.X,t.Z);i?ctx.lineTo(p.x,p.y+2):ctx.moveTo(p.x,p.y+2);});ctx.strokeStyle=glow(.18*ca*(1+night));ctx.lineWidth=5;ctx.stroke();ctx.strokeStyle=glow((.7+.3*night)*ca);ctx.lineWidth=1.2+.5*night;ctx.stroke();
      const m=ts[5],pm=proj(m.X,m.Z);ln([pm.x,pm.y+2,ossP.x,ossP.y+2],glow(.55*ca),1.1);}
    ln([ossP.x,ossP.y+2,exEnd.x,exEnd.y+1],glow(.9*ca),2);
    for(let i=0;i<24;i++){const k=((TT*.25+i/24)%1);circ(lerp(ossP.x,exEnd.x,k),lerp(ossP.y+2,exEnd.y+1,k),2.2,glow(ca));}
    for(let row=0;row<6;row++){const m=FARM[row*10+5],pm=proj(m.X,m.Z);for(let i=0;i<3;i++){const k=((TT*.35+i/3+row*.13)%1);circ(lerp(pm.x,ossP.x,k),lerp(pm.y+2,ossP.y+2,k),1.8,glow(ca));}}
    ctx.lineCap='butt';
  }
  const items=FARM.map(t=>({Z:t.Z,t}));items.push({Z:3.7,oss:true});items.sort((a,b)=>b.Z-a.Z);
  const tc=tri([240,244,245],[235,196,176],[70,82,98],k1,k2),blink=(T%1.6)<1?1:.12,lightOn=clamp(k1*1.3);
  for(const it of items){
    if(it.oss){const p=ossP,q=p.q;const wc=tri([206,214,218],[196,160,150],[46,56,70],k1,k2);
      ln([p.x-30*q,p.y,p.x-24*q,p.y-60*q],rgb(wc),3*q);ln([p.x+30*q,p.y,p.x+24*q,p.y-60*q],rgb(wc),3*q);
      box(p.x-44*q,p.y-110*q,88*q,50*q,rgb(wc));box(p.x-44*q,p.y-116*q,88*q,6*q,rgb(mixc(wc,[40,50,60],.4)));box(p.x-64*q,p.y-122*q,34*q,4*q,'#f2c230');
      if(night>0){for(let i=0;i<5;i++)circ(p.x-36*q+i*18*q,p.y-80*q,1.4,`rgba(255,230,160,${night})`);}
      continue;}
    const t=it.t,p=proj(t.X,t.Z),q=p.q;if(p.x<VX0-220*q||p.x>VX1+220*q)continue;
    const H=520*q,hx=p.x,hy=p.y-H;
    ctx.fillStyle=`rgba(255,255,255,${.08+.1*(1-night)})`;ctx.fillRect(p.x-5*q,p.y,10*q,70*q);
    ctx.fillStyle=`rgba(242,194,48,${.25*(1-night*.6)})`;ctx.fillRect(p.x-7*q,p.y,14*q,26*q);
    ctx.beginPath();ctx.ellipse(p.x,p.y+1,14*q,3*q,0,0,TAU);ctx.fillStyle=`rgba(255,255,255,${.5*(1-night*.7)})`;ctx.fill();
    box(p.x-8*q,p.y-40*q,16*q,40*q,rgb(tri([242,194,48],[230,160,60],[90,76,40],k1,k2)));
    poly([p.x-6*q,p.y-40*q,hx-3.2*q,hy,hx+3.2*q,hy,p.x+6*q,p.y-40*q],rgb(tc));
    box(hx-8*q,hy-8*q,16*q,13*q,rgb(tc));
    const a=t.ph+TT*.95*t.w;for(let i=0;i<3;i++)drawBlade(hx,hy,a-i*TAU/3,190*q,rgb(tc));circ(hx,hy,5*q,rgb(mixc(tc,[255,255,255],.3)));
    if(lightOn>0){const la=lightOn*blink;circ(hx,hy-9*q,Math.max(1,2.2*q),`rgba(255,50,40,${la})`);if(night>.1){const rg=ctx.createRadialGradient(hx,hy-9*q,0,hx,hy-9*q,26*q+4);rg.addColorStop(0,`rgba(255,60,50,${.55*la*night})`);rg.addColorStop(1,'rgba(255,60,50,0)');ctx.fillStyle=rg;ctx.fillRect(hx-30*q-4,hy-39*q-4,60*q+8,60*q+8);}}
    if(night>0)circ(p.x+9*q,p.y-30*q,Math.max(.8,1.6*q),`rgba(255,220,90,${night*(.6+.4*Math.sin(TT*3+t.ph))})`);
  }
  const vsx=lerp(470,640,u),vq=1/3.1,vy=330+560/3.1;
  ctx.save();ctx.translate(vsx,vy);ctx.scale(vq*1.2,vq*1.2);ctx.globalAlpha=1;hull(230,16,11,rgb(tri([31,95,158],[40,70,120],[14,24,40],k1,k2)),rgb(tri([106,38,34],[80,40,40],[20,20,26],k1,k2)),'#fff');superBlock(150,-66,70,50,4,rgb(tri([244,246,247],[235,200,190],[50,60,74],k1,k2)));box(112,-46,10,30,'#f2c230');
  if(night>0){for(let i=0;i<8;i++)circ(156+i*8,-50,3,`rgba(255,235,170,${night})`);circ(190,-96,4,`rgba(255,255,255,${night})`);}ctx.restore();
  const csx=lerp(1380,1200,u),cq=1/2.6,cy=330+560/2.6;
  ctx.save();ctx.translate(csx,cy);ctx.scale(-cq*1.3,cq*1.3);vCTV();if(night>0){circ(40,-34,3,`rgba(255,255,255,${night})`);}ctx.restore();
  ctx.strokeStyle=`rgba(255,255,255,${.4*(1-night)})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(csx+10,cy+2);ctx.lineTo(csx+60,cy+4);ctx.stroke();
  const ba=1-seg(u,.4,.55);if(ba>0)alphaDo(ba,()=>{const bx=lerp(1500,200,seg(u,.02,.55));for(let i=0;i<7;i++)bird(bx+Math.abs(i-3)*14,160+(i-3)*6,1.1,TT+i);});
  lab(ossP.x,ossP.y-110/3.7,'海上變電站',{dx:40,dy:-50,a:band(u,.2,.46)});
  lab(exEnd.x,exEnd.y,'輸出海纜登陸',{dx:-10,dy:44,a:band(u,.22,.46)});
}
function farmHUD(u){
  screenSpace();
  const k=HK(),cols=cssW<700?2:4,gap=8*k,cw=cols===4?Math.min(180*k,(cssW*.56-gap*3)/4):Math.min(150*k,(cssW*.48-gap)/2),chh=cw*.46,x0=cssW-14*k-(cw*cols+gap*(cols-1)),y0=cols===4?30*k:cssH*.14;
  const data=LANG==='zh'?[[900,'MW','裝置容量'],[35,'億度','年發電量'],[88,'萬戶','家庭年用電'],[175,'萬公噸','年減碳 CO₂']]:FARM_I18N[LANG];
  const nf=v=>LANG==='en'?v.toLocaleString('en-US'):String(v);
  data.forEach((d,i)=>{const t0=.1+i*.07,a=seg(u,t0,t0+.03);if(a<=0||!SHOWLAB)return;
    const cx=x0+(i%cols)*(cw+gap),cy=y0+Math.floor(i/cols)*(chh+gap);ctx.globalAlpha=a;
    rrp(cx,cy,cw,chh,8*k);ctx.fillStyle='rgba(7,27,39,.8)';ctx.fill();ctx.fillStyle='#f2c230';ctx.fillRect(cx,cy+chh*.2,3*k,chh*.6);
    const v=Math.round(d[0]*easeOut(seg(u,t0,t0+.12)));
    ctx.textBaseline='alphabetic';ctx.font=`700 ${chh*.5}px ${COND}`;ctx.fillStyle='#fff';ctx.fillText(nf(v),cx+12*k,cy+chh*.56);
    const vw=ctx.measureText(nf(v)).width;ctx.font=`700 ${chh*.2}px ${FONT}`;ctx.fillStyle='#f2c230';ctx.fillText(d[1],cx+14*k+vw,cy+chh*.56);
    ctx.font=`500 ${chh*.19}px ${FONT}`;ctx.fillStyle='rgba(227,236,238,.82)';ctx.fillText(d[2],cx+12*k,cy+chh*.86,cw-18*k);ctx.globalAlpha=1;});
  const ea=seg(u,.9,.95);
  if(ea>0){ctx.globalAlpha=ea;ctx.textAlign='center';ctx.textBaseline='middle';const fs=clamp(cssW/24,20,50);
    ctx.font=`900 ${fs}px ${FONT}`;ctx.fillStyle='rgba(0,0,0,.35)';const em=ui('endMain'),mw=cssW*.92;ctx.fillText(em,cssW/2+2,cssH*.44+2,mw);ctx.fillStyle='#fff';ctx.fillText(em,cssW/2,cssH*.44,mw);
    ctx.font=`500 ${fs*.42}px ${COND}`;ctx.fillStyle='rgba(255,255,255,.85)';ctx.fillText(ui('endSub'),cssW/2,cssH*.44+fs*.95,mw);
    ctx.textAlign='left';ctx.globalAlpha=1;}
}
