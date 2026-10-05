// KITS: marine
/* ================= EP26 人員登塔與海上安全 ================= */
/* complete fixed-bottom turbine at cx (monopile + TP + tower + nacelle + rotor) */
function turb26(cx,ang){
  const yb=bedY(cx)+130;drawPile(cx,yb,Math.PI/2,yb-PILE_TOP,PILE_W);drawTP(cx,TP_BOT);
  for(let k=0;k<3;k++)drawTowerSec(cx,TP_TOP-k*HS,k);
  drawNacelle(cx,TW_TOP,0,true);drawRotor(cx-44,TW_TOP-20,ang,3);
}
function far26(x,s,ang){const h=150*s,hx=x,hy=SEA-h;ln([x,SEA,x,hy],'rgba(235,240,243,.85)',3*s);
  for(let i=0;i<3;i++){const a=ang-i*TAU/3;ln([hx,hy,hx+Math.cos(a)*70*s,hy+Math.sin(a)*70*s],'rgba(245,247,248,.9)',2.2*s);}circ(hx,hy,3*s,'#eef2f4');}
/* text wrapped to a width (after translation) */
function wrap26(x,y,t,maxW,size,col,weight,lh,align){
  t=tr(t);const cjk=LANG!=='en'&&CJK_RE.test(t),parts=cjk?[...t]:t.split(' ');let line='',n=0;
  const out=s=>{wt(x,y+n*lh,s,size,col,weight,align);n++;};
  for(const w of parts){const test=line?(cjk?line+w:line+' '+w):w;if(line&&wtw(test,size,weight)>maxW){if(cjk&&/^[，。、）」：；,.]$/.test(w)){out(test);line='';continue;}out(line);line=w;}else line=test;}
  if(line)out(line);return n;
}
const LAD26=TX-33.5;          // boat landing ladder (drawTP) x
const PLAT26=TP_TOP-3;        // work platform deck y
const CTVX26=TX-114;          // CTV stern x when its bow fender touches the landing
/* technician with a small fall-arrest slider when on the ladder */
function tech26(x,y,col,s,slider){person(x,y,col||'#e8572a',s||1.1);if(slider)box(x-1.6,y-9,3.2,3,'#f2c230');}
/* helicopter, nose to the left; (x,y) is the cabin centre */
function heli26(x,y,s){
  s=s||1;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
  ln([14,-2,58,-8],'#c43d22',4);poly([54,-8,62,-20,64,-8],'#c43d22');
  ctx.beginPath();ctx.ellipse(66,-10,7,7*Math.abs(Math.sin(TT*30)),0,0,TAU);ctx.strokeStyle='rgba(40,50,60,.5)';ctx.lineWidth=1.2;ctx.stroke();
  ctx.beginPath();ctx.ellipse(0,0,24,11,0,0,TAU);ctx.fillStyle='#e8572a';ctx.fill();
  ctx.beginPath();ctx.ellipse(-12,-2,10,7,0,Math.PI,Math.PI*1.9);ctx.lineTo(-12,-2);ctx.closePath();ctx.fillStyle='#8fd0ff';ctx.fill();
  box(-4,-6,10,9,'#2b3137');                                     // open side door
  box(4,-15,10,4,'#394650');ln([12,-13,18,-9],'#394650',2);       // hoist arm
  ln([-14,10,-14,16],'#394650',1.2);ln([12,10,12,16],'#394650',1.2);ln([-22,16,20,16],'#394650',1.6);
  box(-3,-15,6,4,'#394650');
  const w=56*Math.abs(Math.cos(TT*24));ctx.beginPath();ctx.ellipse(0,-16,56,2.2,0,0,TAU);ctx.fillStyle='rgba(40,50,60,.22)';ctx.fill();
  ln([-w,-16,w,-16],'rgba(40,50,60,.75)',1.6);
  ctx.restore();
}
/* required thrust (% of max) vs Hs – typical example */
const TRQ26=h=>100*Math.pow(h/1.62,1.8);

const EP={no:26,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'人員登塔與海上安全',en:'Turbine access and offshore safety',
lede:'離岸風機的維修，第一步是把人安全地送上去。這一集從出海前的訓練與裝備開始，看人員運輸船怎麼用船首頂住風機、技術人員如何看準時機跨上爬梯，為什麼浪高 1.5 公尺左右就是分界；再看防墜系統、運維母船的動態補償步橋與直升機吊掛三種登塔方式，以及萬一落水或受傷時的應變。',
facts:[['5','個模組','GWO 基本安全訓練（離岸）：急救、人工搬運、消防、高處作業、海上求生'],['24','個月','GWO 訓練證書的效期，到期前須完成複訓'],['約 1.5','m','人員運輸船船首頂靠、跨步登塔的典型示性波高上限'],['約 3','m','動態補償步橋可作業的示性波高（設備商資料）'],['100','%','爬梯與轉換點全程連續掛鉤，任何時刻至少一個掛點'],['12–24','名','一艘人員運輸船典型載運的技術人員數']],
note:'說明：本集為教育用途示意動畫，船舶、風機與人員的比例經過壓縮。GWO 基本安全訓練的模組與 24 個月效期依 Global Wind Organisation 公開標準；台灣已有多處經 GWO 認證的訓練中心。人員運輸船跨步登塔約 1.5 m 示性波高、動態補償步橋約 3 m 示性波高為業界常用的典型值與設備商資料，實際上限依船型、波浪週期與方向、風場業主規定而定。推力與浪高的關係曲線、HUD 中的浪高、風速、推力與人數皆為典型範例；直升機吊掛在部分歐洲風場使用，台灣目前以船舶登塔為主。緊急應變流程為原則示意，實際依各風場的緊急應變計畫與職業安全衛生法規執行，不代表特定風場。',
shots:[
/* 1 */{t:'出海前：訓練與裝備',en:'Before going offshore',dur:13,
 d:'要登上離岸風機，技術人員必須先完成全球風能組織（GWO）的基本安全訓練。離岸版共有五個模組：急救、人工搬運、消防意識、高處作業與海上求生，證書效期 24 個月，到期前要複訓。台灣已有多處經 GWO 認證的訓練中心。出海時的個人防護裝備包括安全帽、附個人定位信標（PLB）的自動充氣救生衣、全身式安全吊帶與雙鉤緩衝繩，冬季還要穿浸水保溫衣。',
 s:[[0,'登上風機前，要先完成 GWO 基本安全訓練'],[.3,'離岸版五個模組，包括海上求生與高處作業'],[.55,'證書效期 24 個月，到期前必須複訓'],[.74,'出海時穿戴救生衣、安全吊帶與定位信標']],
 draw(u){
  diagBG();
  card(60,150,700,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'GWO 基本安全訓練（離岸）',21,'#fff',700);
  const M=[['海上求生','落水、救生筏、從船登上風機'],['高處作業','安全吊帶、防墜、高處救援'],['急救','傷患處置、心肺復甦'],['消防意識','初期滅火、緊急撤離'],['人工搬運','正確搬抬，避免受傷']];
  M.forEach((m,i)=>{const a=seg(u,.06+i*.05,.1+i*.05);if(a<=0)return;const y=214+i*88,hi=u>.3&&u<.55&&i<2;alphaDo(a,()=>{
   card(84,y,652,74,{bg:hi?'rgba(242,194,48,.1)':'rgba(255,255,255,.04)',st:hi?'#f2c230':'rgba(255,255,255,.12)',r:6});
   circ(122,y+37,18,hi?'#f2c230':'#58b8d0');wt(122,y+44,String(i+1),20,'#0e2a3b',700,'center',COND);
   wt(156,y+33,m[0],20,'#fff',700);wrap26(156,y+60,m[1],560,15,'rgba(227,236,238,.8)',500,20);});});
  const v=seg(u,.55,.6);if(v>0)alphaDo(v,()=>{box(84,664,652,1,'rgba(255,255,255,.14)');
   wt(84,712,'證書效期',18,'rgba(227,236,238,.85)',600);wt(736,722,trf('{n} 個月',{n:Math.round(24*ease(seg(u,.55,.66)))}),44,'#f2c230',700,'right',COND);
   wt(84,760,'到期前完成複訓，才能繼續出海',16,'rgba(227,236,238,.75)',500);});
  // right: PPE figure
  card(800,150,740,650,{bg:'rgba(7,27,39,.8)'});wt(824,190,'個人防護裝備',21,'#fff',700);
  const P=seg(u,.06,.14);if(P>0)alphaDo(P,()=>{
   const X=1000,Y=470;
   // legs, body
   box(X-26,Y+90,22,170,'#2a3a46');box(X+4,Y+90,22,170,'#2a3a46');box(X-30,Y+250,30,18,'#1c1c1c');box(X+2,Y+250,30,18,'#1c1c1c');
   rrp(X-40,Y-40,80,140,10);ctx.fillStyle='#1f4f6e';ctx.fill();
   box(X-62,Y-30,22,110,'#1f4f6e');box(X+40,Y-30,22,110,'#1f4f6e');circ(X-51,Y+86,10,'#f0c9a0');circ(X+51,Y+86,10,'#f0c9a0');
   circ(X,Y-72,30,'#f0c9a0');
   // helmet
   ctx.beginPath();ctx.arc(X,Y-80,33,Math.PI,0);ctx.closePath();ctx.fillStyle='#fff';ctx.fill();box(X-38,Y-82,76,6,'#e3ecee');
   // life jacket
   const lj=seg(u,.74,.8);
   rrp(X-44,Y-44,30,92,8);ctx.fillStyle='#e8572a';ctx.fill();rrp(X+14,Y-44,30,92,8);ctx.fillStyle='#e8572a';ctx.fill();
   box(X+18,Y-10,12,16,'#f2c230');
   // harness
   ln([X-30,Y-40,X-20,Y+60,X+20,Y+60,X+30,Y-40],'#f2c230',5);ln([X-36,Y+100,X,Y+82,X+36,Y+100],'#f2c230',5);ln([X-28,Y+20,X+28,Y+20],'#f2c230',4);
   circ(X,Y+20,7,'#c9d1d5','#394650',2);
   // twin lanyard
   ln([X,Y+20,X-70,Y-90],'#58b8d0',3);ln([X,Y+20,X+80,Y-80],'#58b8d0',3);box(X-78,Y-104,14,16,'#c9d1d5');box(X+74,Y-94,14,16,'#c9d1d5');
   const L=[['安全帽',Y-90],['救生衣（自動充氣）',Y-30],['個人定位信標（PLB）',Y-2],['全身式安全吊帶',Y+60],['雙鉤緩衝繩',Y+130],['浸水保溫衣（冬季）',Y+200]];
   const PT=[[X+30,Y-92],[X+44,Y-30],[X+30,Y-2],[X+20,Y+60],[X+80,Y-80],[X+26,Y+170]];
   L.forEach((l,i)=>{const b=seg(u,.16+i*.03,.2+i*.03)*(i===1||i===2?1:1);if(b<=0)return;const hi=lj>0&&(i===1||i===2||i===3);alphaDo(b,()=>{
    ln([PT[i][0],PT[i][1],1150,l[1]],'rgba(255,255,255,.55)',1.2);circ(PT[i][0],PT[i][1],3.5,'#fff');
    wrap26(1160,l[1]+6,l[0],360,18,hi?'#f2c230':'#fff',700,22);});});
   alphaDo(seg(u,.8,.86),()=>tag(1170,762,'冬季海水仍會讓人失溫',{bg:'rgba(232,87,42,.9)',fg:'#fff',size:15}));
  });
 }},
/* 2 */{t:'船首頂靠，看準時機跨步',en:'Bow push-on and step-over',dur:14,side:true,
 d:'人員運輸船（CTV）是雙體高速船，船首裝有厚實的橡膠護舷。抵達風機後，船長把船首頂在轉接段的靠船設施上，引擎持續向前推，讓護舷與鋼管之間的摩擦力撐住船首，不隨浪上下滑動。技術人員先在船上把防墜滑塊扣上爬梯的防墜軌道，等船首穩定、甲板與第一階對齊時跨過去，一路往上爬到工作平台。整個過程由船長與登塔人員以無線電確認。',
 s:[[0,'人員運輸船抵達風機，靠向轉接段的靠船設施'],[.26,'船首護舷頂住鋼管，引擎持續向前推'],[.46,'先把防墜滑塊扣上軌道，看準時機跨步'],[.7,'沿爬梯爬上工作平台，再進入塔內']],
 cam:u=>camMix({x:TX-170,y:410,s:1.25},{x:TX-70,y:452,s:2.4},ease(seg(u,.12,.4))),
 draw(u){
  for(const [x,s,p] of [[180,.55,.4],[1000,.45,1.7],[1200,.4,2.6]])far26(x,s,TT*.9+p);
  turb26(TX,TT*.5);
  // fall-arrest rail on the ladder
  ln([LAD26,PLAT26,LAD26,TP_BOT+22],'rgba(242,194,48,.85)',1);
  const cx=lerp(TX-560,CTVX26,easeOut(seg(u,0,.26)));
  const wl=vsl(cx,77,false,{tilt:.4},vCTV);
  if(u<.28)alphaDo(.7,()=>{for(let i=0;i<5;i++){const k=(TT*2+i/5)%1;ln([cx-4-k*70,wl+2+i*.6,cx-20-k*70,wl+2+i*.6],`rgba(255,255,255,${.8*(1-k)})`,1.4);}});
  const push=seg(u,.26,.32);
  if(push>0){alphaDo(push*.8,()=>{for(let i=0;i<6;i++){const k=(TT*1.6+i/6)%1;circ(cx-3-k*26,wl+4+k*3,2+k*4,`rgba(235,248,255,${.6*(1-k)})`);}});
   alphaDo(band(u,.28,.46)*.9,()=>{ctx.strokeStyle='#7dffc4';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(TX-40,wl-8,10+3*Math.sin(TT*5),-.9,.9);ctx.stroke();});}
  // technicians: first one steps over and climbs, second follows
  const dk=wl-12;
  for(let j=0;j<2;j++){const s=u-j*.14;
   const p=s<.36?{x:cx+20+j*10,y:dk}:
    kf(s,[[.36,CTVX26+20+j*10,dk],[.46,TX-48,dk],[.5,LAD26,dk-4],[.78,LAD26,PLAT26],[.86,TX-8+j*10,PLAT26]]);
   const onL=s>.48&&s<.79;tech26(p.x,p.y,j?'#f2c230':'#e8572a',1.1,onL);}
  lab(cx+40,wl-26,'人員運輸船（CTV）',{dx:-40,dy:-50,a:band(u,.04,.3)});
  lab(TX-38,wl-8,'船首護舷頂住鋼管',{dx:-110,dy:40,a:band(u,.3,.5),st:'s'});
  lab(LAD26,TP_BOT+4,'靠船設施與爬梯',{dx:-120,dy:0,a:band(u,.12,.32)});
  lab(LAD26,dk-20,'扣上防墜軌道',{dx:-110,dy:-30,a:band(u,.48,.68),st:'g'});
  lab(TX+10,PLAT26,'工作平台',{dx:90,dy:-30,a:band(u,.74,1)});
 },
 hud(u){hudPanel(240,150,'登塔條件（示例）',seg(u,.04,.1),w=>{
  hrow(52,'示性波高','1.2 m',w,'#7dffc4');
  hrow(78,'跨步上限','約 1.5 m',w);
  const t=u<.26?lerp(30,10,seg(u,.1,.26)):lerp(10,60,ease(seg(u,.26,.34)));
  hrow(104,'向前推力',Math.round(t)+'%',w,'#f2c230');hbar(14,112,w-28,t/100,'#f2c230');
  const st=u<.26?'進場':u<.46?'頂靠穩定':u<.8?'登塔中':'完成';
  hrow(142,'狀態',st,w,u<.26?'rgba(227,236,238,.8)':'#7dffc4');});}},
/* 3 */{t:'為什麼是 1.5 公尺',en:'Why 1.5 metres',dur:13,
 d:'船首能不能穩住，是推力和波浪在拔河。引擎的推力把護舷壓在鋼管上，產生的摩擦力最大約等於摩擦係數乘以壓力；波浪把船首往上抬、往下拉的力，只要比這個摩擦力小，船首就不會滑動。浪越大，需要的推力越大，到了示性波高約 1.5 公尺附近，所需推力就接近引擎的上限，船首開始上下滑動，技術人員就不能跨步。實際上限還要看船型、波浪週期與方向。',
 s:[[0,'推力把護舷壓在鋼管上，產生摩擦力'],[.28,'波浪的上下力小於摩擦力，船首就不會滑動'],[.52,'浪越大，需要的推力越大'],[.74,'約 1.5 m 時接近引擎上限，船首開始滑動']],
 draw(u){
  diagBG();
  card(60,150,720,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'船首頂靠的受力（示意）',21,'#fff',700);
  const big=seg(u,.74,.8),dy=big*18*Math.sin(TT*3.2)+1.5*Math.sin(TT*1.7),WY=600;
  ctx.save();rrp(60,150,720,650,14);ctx.clip();
  // landing tubes and TP
  box(640,250,140,560,'#c9971a');box(604,300,10,500,'#e8a33a');box(622,300,10,500,'#e8a33a');for(let y=320;y<800;y+=28)ln([604,y,632,y],'#c08a1c',2);
  // sea
  const P=[60,WY];for(let x=60;x<=780;x+=10)P.push(x,WY+(4+big*10)*Math.sin(x*.03-TT*2));P.push(780,800,60,800);poly(P,'rgba(88,184,208,.35)');
  // CTV bow
  const by=WY-40+dy;
  poly([80,by,560,by,598,by-14,590,by+40,540,by+80,80,by+80],'#4d5962','rgba(255,255,255,.3)',1);box(80,by+66,470,14,'#2a3a46');
  box(560,by-24,40,52,'#1c1c1c');
  superBlock(200,by-60,160,60,2);
  ctx.restore();
  // forces
  const f1=seg(u,.04,.12);if(f1>0)alphaDo(f1,()=>{arrow(150,by+24,470,by+24,'#f2c230',6);wt(300,by+54,'推力 T',20,'#f2c230',700,'center');
   arrow(604,by+2,520,by+2,'rgba(255,255,255,.9)',4);wt(540,by-34,'壓力 N',17,'#fff',700,'right');});
  const fr=seg(u,.12,.2);if(fr>0)alphaDo(fr,()=>{const L=big>0?50:58;arrow(612,by-20,612,by-20-L,'#7dffc4',5);wt(626,by-50,'摩擦力',17,'#7dffc4',700);});
  const wv=seg(u,.28,.34);if(wv>0)alphaDo(wv,()=>{const L=34+big*60+6*Math.sin(TT*2);arrow(420,WY+150,420,WY+150-L-30,'#58b8d0',5);wt(436,WY+140,'波浪上下力',17,'#7dc8dc',700);});
  alphaDo(seg(u,.16,.22),()=>{card(84,214,440,92,{bg:'rgba(255,255,255,.05)',r:6});
   wt(104,252,'摩擦力上限 ＝ μ × N',22,'#7dffc4',700);wrap26(104,286,'μ：橡膠護舷與鋼管的摩擦係數',400,15,'rgba(227,236,238,.8)',500,20);});
  if(u>.34){const ok=big<.5;alphaDo(seg(u,.34,.4),()=>tag(84,336,ok?'波浪力 ＜ 摩擦力：船首穩定':'波浪力 ＞ 摩擦力：船首滑動',{bg:ok?'#7dffc4':'#e8572a',fg:ok?'#13232e':'#fff',size:16}));}
  // right: required thrust vs Hs
  const c=chartBox(820,150,720,650,{x0:0,x1:2.5,y0:0,y1:140,xt:[0,.5,1,1.5,2,2.5],yt:[0,50,100],xl:'示性波高 Hs（m）',yl:'所需推力（%）',pt:110,pb:70,pl:70,pr:30,gx:5,gy:7});
  wt(844,190,'所需推力與浪高（典型範例）',20,'#fff',700);
  alphaDo(seg(u,.5,.56),()=>{ctx.setLineDash([8,6]);ln([c.px,c.Y(100),c.px+c.pw,c.Y(100)],'#e8572a',2.2);ctx.setLineDash([]);wt(c.px+12,c.Y(100)-10,'引擎推力上限',16,'#ff9d7a',700);});
  const g=ease(seg(u,.52,.78)),Q=[];for(let h=0;h<=2.5*g;h+=.02){const v=TRQ26(h);if(v>140)break;Q.push({x:c.X(h),y:c.Y(v)});}
  pathLine(Q,'#f2c230',3.4);
  if(g>.2){const h=Math.min(2.5*g,1.5);circ(c.X(h),c.Y(TRQ26(h)),8,'#f2c230','#0e2a3b',2);}
  alphaDo(seg(u,.74,.8),()=>{box(c.X(1.5),c.py,c.X(2.5)-c.X(1.5),c.ph,'rgba(232,87,42,.14)');
   ctx.setLineDash([5,5]);ln([c.X(1.5),c.py,c.X(1.5),c.py+c.ph],'#e8572a',2);ctx.setLineDash([]);
   tag(c.X(1.5)-8,c.Y(30),'約 1.5 m',{bg:'#e8572a',fg:'#fff',size:16,align:'right'});
   wt((c.X(1.5)+c.X(2.5))/2,c.Y(125),'不能跨步',18,'#ff9d7a',700,'center');});
 }},
/* 4 */{t:'爬梯與防墜',en:'Ladder climbing and fall arrest',dur:13,
 d:'從船跨上爬梯的那一刻起，技術人員就一直掛在防墜系統上。爬梯中央有一條剛性軌道，吊帶胸前的防墜滑塊沿著軌道上下滑動，一旦失足下墜，滑塊會在很短的距離內鎖住。到了平台轉換處，使用雙鉤緩衝繩：先把一個鉤子掛上新的掛點，再解開另一個，任何時刻都至少有一個掛點，稱為百分之百連續掛鉤。進入塔內後，大型風機多有升降機可以搭到機艙。',
 s:[[0,'吊帶上的防墜滑塊扣在爬梯中央的軌道上'],[.3,'一旦失足，滑塊在很短的距離內鎖住'],[.55,'平台轉換處使用雙鉤：先掛新點，再解舊點'],[.78,'任何時刻至少一個掛點：百分之百連續掛鉤']],
 draw(u){
  diagBG();
  card(60,150,700,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'防墜系統（示意）',21,'#fff',700);
  const LX=330,RX=420,MX=375,PY=300;
  // platform and rail
  box(250,PY,420,14,'#6f7a80');ln([250,PY,250,PY-70,670,PY-70],'#c9d1d5',3);ln([250,PY-36,670,PY-36],'#c9d1d5',2);
  circ(560,PY-70,8,'#f2c230');wt(560,PY-84,'掛點',15,'#f2c230',700,'center');
  // ladder
  ln([LX,PY,LX,790],'#e8a33a',5);ln([RX,PY,RX,790],'#e8a33a',5);for(let y=PY+30;y<790;y+=32)ln([LX,y,RX,y],'#c08a1c',4);
  ln([MX,PY-20,MX,790],'#394650',7);ln([MX,PY-20,MX,790],'rgba(242,194,48,.7)',2);
  // climber position: climb, slip, arrest, climb, transfer
  const slip=seg(u,.32,.36),c1=ease(seg(u,.04,.3)),c2=ease(seg(u,.46,.62));
  let fy=lerp(760,560,c1)+slip*24;fy-=(584-PY)*c2;
  const tr2=seg(u,.64,.76),fx=lerp(MX+6,470,ease(tr2));
  const S=7;person(fx,fy,'#e8572a',S);
  // harness chest point and slider
  const chx=fx,chy=fy-S*5.6;
  if(u<.64){box(MX-9,chy-10,18,20,'#f2c230');ln([MX+9,chy,chx,chy],'#58b8d0',2.4);}
  // arrest flash
  if(u>.34&&u<.46)alphaDo(band(u,.34,.46),()=>{ring(MX,chy,22,'#7dffc4',3);tag(MX+70,chy-16,'滑塊鎖止',{bg:'#7dffc4',size:16});
   arrow(MX+80,chy+8,MX+80,chy+40,'#e8572a',3);wt(MX+94,chy+30,'短距離停住',15,'#ff9d7a',700);});
  // twin lanyard: new anchor first, then release the rail
  if(u>.58)alphaDo(seg(u,.58,.62),()=>ln([chx,chy,560,PY-70],'#7dc8dc',2.6));
  alphaDo(band(u,.58,.9),()=>tag(570,PY+44,'雙鉤：先掛新點',{bg:'#58b8d0',size:15,align:'center'}));
  // right: rules
  card(800,150,740,650,{bg:'rgba(7,27,39,.8)'});wt(824,190,'爬梯的安全規則',21,'#fff',700);
  const R=[['離船前先扣上','防墜滑塊扣上軌道後，才跨上爬梯',.04],['防墜滑塊','失足時在短距離內鎖住，吊帶分散衝擊',.3],['雙鉤緩衝繩','轉換處先掛新點，再解開舊點',.55],['塔內升降機','大型風機多有升降機，減少體力消耗',.82]];
  R.forEach((r,i)=>{const a=seg(u,r[2],r[2]+.05);if(a<=0)return;const y=218+i*104;alphaDo(a,()=>{
   card(824,y,692,90,{bg:'rgba(255,255,255,.04)',st:'rgba(255,255,255,.12)',r:6});
   circ(862,y+45,18,i===3?'#58b8d0':'#7dffc4');wt(862,y+52,String(i+1),20,'#0e2a3b',700,'center',COND);
   wt(896,y+38,r[0],20,'#fff',700);wrap26(896,y+68,r[1],600,15,'rgba(227,236,238,.8)',500,20);});});
  alphaDo(seg(u,.78,.84),()=>{box(824,640,692,1,'rgba(255,255,255,.14)');
   wt(824,730,'100%',64,'#7dffc4',700,'left',COND);wrap26(1000,706,'連續掛鉤：任何時刻至少一個掛點',500,19,'#fff',700,26);});
 }},
/* 5 */{t:'動態補償步橋',en:'Motion-compensated gangway',dur:14,
 d:'浪高超過人員運輸船的上限時，可以改由運維母船（SOV）上的動態補償步橋登塔。母船以動態定位停在風機旁，步橋底座下的感測器每秒量測多次船身的起伏、縱搖與橫搖，液壓或電動機構即時調整步橋的伸縮、俯仰與旋轉，讓步橋端點貼在風機平台上幾乎不動。人員像走在平地上一樣走過去，可作業的示性波高約 3 公尺，大約是跨步登塔的兩倍。',
 s:[[0,'沒有補償時，步橋端點跟著船身上下晃動'],[.3,'補償開啟：感測器量測船身的起伏與搖擺'],[.52,'步橋即時伸縮、俯仰與旋轉，端點幾乎不動'],[.76,'可作業的示性波高約 3 m，約是跨步登塔的兩倍']],
 draw(u){
  diagBG();
  card(60,150,700,650,{bg:'rgba(7,27,39,.8)'});wt(84,190,'步橋補償（示意）',21,'#fff',700);
  const comp=seg(u,.3,.36),hv=26*Math.sin(TT*1.4),pr=.035*Math.sin(TT*1.4+1.1),WY=560;
  ctx.save();rrp(60,150,700,650,14);ctx.clip();
  // turbine TP on the right
  box(620,250,120,560,'#c9971a');box(580,380,180,12,'#6f7a80');ln([580,380,580,350,740,350],'#c9d1d5',2.4);
  const TIP={x:590,y:378};
  // sea
  const P=[60,WY];for(let x=60;x<=760;x+=10)P.push(x,WY+8*Math.sin(x*.025-TT*1.4));P.push(760,800,60,800);poly(P,'rgba(88,184,208,.32)');
  // ship (rotated about its centre)
  const SX=250,SY=WY+hv;
  ctx.save();ctx.translate(SX,SY);ctx.rotate(pr);
  poly([-180,-40,170,-40,200,-56,190,10,160,40,-180,40],'#1f5f9e','rgba(0,0,0,.25)',1);box(-180,20,350,20,'#6a2622');
  superBlock(-170,-130,110,90,4);box(70,-70,30,30,'#e9b21f');
  ctx.restore();
  const bx=SX+Math.cos(pr)*85-Math.sin(pr)*(-70),by=SY+Math.sin(pr)*85+Math.cos(pr)*(-70);
  // uncompensated tip: rigidly attached to ship
  const free={x:bx+(TIP.x-SX-85),y:by+(TIP.y-(WY-70))};
  const tip={x:lerp(free.x,TIP.x,comp),y:lerp(free.y,TIP.y,comp)};
  ln([bx,by,tip.x,tip.y],'#8f9aa1',9);ln([bx,by-12,tip.x,tip.y-12],'#e9b21f',2.4);
  for(let i=1;i<8;i++){const p=lerpPt({x:bx,y:by},tip,i/8);ln([p.x,p.y-1,p.x,p.y-12],'#e9b21f',1.6);}
  circ(bx,by,9,'#394650');
  ctx.restore();
  // tip highlight
  ring(tip.x,tip.y,14,comp>.5?'#7dffc4':'#e8572a',3);
  if(u<.32)alphaDo(band(u,.06,.3),()=>tag(tip.x-20,tip.y-56,'端點跟著晃動',{bg:'#e8572a',fg:'#fff',size:16,align:'right'}));
  alphaDo(band(u,.38,1),()=>tag(tip.x-20,tip.y-56,'端點固定在平台',{bg:'#7dffc4',size:16,align:'right'}));
  // walking technicians
  const wk=seg(u,.6,.92);if(wk>0)for(let j=0;j<2;j++){const f=clamp(wk*1.4-j*.35);if(f<=0||f>=1)continue;const p=lerpPt({x:bx,y:by},tip,f);person(p.x,p.y-1,j?'#f2c230':'#e8572a',3);}
  alphaDo(seg(u,.3,.36),()=>{wt(84,770,'感測器量測船身起伏與搖擺',16,'rgba(227,236,238,.85)',500);});
  // right: time chart
  const c=chartBox(800,150,740,430,{x0:0,x1:20,y0:-2,y1:2,xt:[0,5,10,15,20],yt:[-2,-1,0,1,2],xl:'時間（秒）',yl:'垂直位移（m）',pt:96,pb:66,pl:70,pr:30,gx:4,gy:4});
  wt(824,190,'船身與步橋端點的起伏（示例）',20,'#fff',700);
  alphaDo(seg(u,.04,.1),()=>{const L=[['船身','#ff9d7a'],['步橋端點','#7dffc4']];L.forEach((l,i)=>{const x=c.px+c.pw-300+i*140;ln([x,c.py-30,x+22,c.py-30],l[1],3);wt(x+28,c.py-25,l[0],15,'rgba(227,236,238,.9)',600);});});
  const g=seg(u,.04,.96),A=[],B=[];
  for(let t=0;t<=20*g;t+=.1){const h=1.5*Math.sin(t*.9)+.3*Math.sin(t*2.1);A.push({x:c.X(t),y:c.Y(h)});
   const k=seg(t/20,.3,.36);B.push({x:c.X(t),y:c.Y(lerp(h,.05*Math.sin(t*3),k))});}
  pathLine(A,'#ff9d7a',3);pathLine(B,'#7dffc4',3.4);
  // bottom: compensation axes + limit
  card(800,610,740,190,{bg:'rgba(7,27,39,.8)'});
  const T=['伸縮','俯仰','旋轉'];T.forEach((t,i)=>{const a=seg(u,.52+i*.04,.56+i*.04);alphaDo(a,()=>tag(830+i*150,656,t,{bg:'#58b8d0',size:17}));});
  alphaDo(seg(u,.52,.56),()=>wt(1290,662,'即時調整',17,'rgba(227,236,238,.8)',600));
  alphaDo(seg(u,.76,.82),()=>{wt(830,742,'可作業示性波高',18,'rgba(227,236,238,.85)',600);wt(1516,756,'約 3 m',48,'#7dffc4',700,'right',COND);
   wt(830,776,'跨步登塔約 1.5 m',15,'rgba(227,236,238,.65)',500);});
 }},
/* 6 */{t:'直升機吊掛到機艙',en:'Helicopter hoisting to the nacelle',dur:13,side:true,
 d:'當浪太大、船舶無法靠近時，部分歐洲風場會用直升機把技術人員直接吊掛到機艙頂部的吊掛平台。風機先停機，轉子鎖定在一支葉片朝下的位置，讓出上方空間；直升機在機艙上方懸停，由吊掛手操作絞車，把技術人員一個個垂降到平台上。它不受浪高限制，但受風速、能見度與夜間飛行的條件限制，載人少、成本高，多用於緊急搶修。台灣目前以船舶登塔為主。',
 s:[[0,'風浪太大時，部分風場改用直升機登塔'],[.24,'風機停機，轉子鎖定讓出機艙上方空間'],[.44,'直升機懸停，吊掛手以絞車垂降技術人員'],[.76,'不受浪高限制，但受風速與能見度限制']],
 cam:u=>camMix({x:TX+40,y:300,s:1.3},{x:TX+20,y:170,s:2.1},ease(seg(u,.08,.36))),
 draw(u){
  for(const [x,s,p] of [[180,.55,.4],[1000,.45,1.7],[1200,.4,2.6]])far26(x,s,TT*.9+p);
  // rotor slows to a locked Y position
  const ang=Math.PI/2-5*Math.pow(1-seg(u,0,.3),2);
  turb26(TX,ang);
  // hoist platform marking on the nacelle roof
  const RY=TW_TOP-38;
  alphaDo(seg(u,.24,.3),()=>{ctx.strokeStyle='#f2c230';ctx.lineWidth=2;ctx.strokeRect(TX+1,RY-8,28,8);});
  const hx=lerp(TX+420,TX+15,easeOut(seg(u,.06,.4)))+2*Math.sin(TT*1.3),hy=lerp(40,RY-70,easeOut(seg(u,.06,.4)))+1.5*Math.sin(TT*1.9);
  const out=seg(u,.9,1);
  const HX=hx+out*200,HY=hy-out*80;
  // hoist cable and technicians
  const hk={x:HX+18,y:HY-9};
  const d1=ease(seg(u,.44,.62)),d2=ease(seg(u,.66,.84));
  const p1y=lerp(hk.y+16,RY,d1),p2y=lerp(hk.y+16,RY,d2);
  if(u>.42&&u<.9){const cy=u<.64?p1y-12:u<.86?p2y-12:hk.y+6;ln([hk.x,hk.y,hk.x,cy],'#394650',1);}
  if(u>.42){const x1=u<.64?hk.x:TX+8;person(x1,u<.64?p1y:RY,'#e8572a',1.1);}
  if(u>.64){const x2=u<.86?hk.x:TX+18;person(x2,u<.86?p2y:RY,'#f2c230',1.1);}
  heli26(HX,HY,1);
  // downwash
  if(u>.3&&u<.92)alphaDo(.5,()=>{for(let i=0;i<6;i++){const k=(TT*1.8+i/6)%1;ln([HX-40+i*16,HY+20+k*50,HX-44+i*16,HY+28+k*50],`rgba(255,255,255,${.6*(1-k)})`,1);}});
  lab(HX,HY,'直升機',{dx:70,dy:-30,a:band(u,.08,.4)});
  lab(TX-44,TW_TOP-20,'轉子鎖定',{dx:-90,dy:-40,a:band(u,.22,.46),st:'s'});
  lab(TX+15,RY-4,'吊掛平台',{dx:-100,dy:30,a:band(u,.28,.56),st:'s'});
  lab(hk.x,(hk.y+p1y)/2,'絞車垂降',{dx:80,dy:20,a:band(u,.46,.7),st:'g'});
 },
 hud(u){hudPanel(240,150,'吊掛條件（示例）',seg(u,.04,.1),w=>{
  hrow(52,'示性波高','3.2 m',w,'#ff9d7a');
  hrow(78,'船舶登塔','不可',w,'#ff9d7a');
  hrow(104,'風速','11 m/s',w,'#7dffc4');
  const n=(u>.62?1:0)+(u>.84?1:0);
  hrow(130,'已吊降',trf('{n} 人',{n}),w,'#f2c230');});}},
/* 7 */{t:'萬一出事：緊急應變',en:'When something goes wrong',dur:13,
 d:'安全不只靠登塔的那一刻。每次作業前要取得工作許可、確認天候預報並測試無線電；作業中任何人發現危險都可以喊停，這叫停工權。如果有人落水，救生衣會自動充氣，個人定位信標發出警報與位置，由船上的救援艇或吊網把人撈起。如果有人在機艙受傷或發生火災，同伴使用救援下降器從機艙垂降，或由塔內撤離，再以船舶或直升機後送就醫。這些情境都要定期演練。',
 s:[[0,'作業前：工作許可、天候確認、通訊測試'],[.26,'有人落水：救生衣充氣，定位信標發出警報'],[.5,'機艙受傷或火災：以救援下降器撤離'],[.74,'任何人都可以喊停，所有情境定期演練']],
 draw(u){
  diagBG();
  // top: pre-work checks
  card(60,150,1480,130,{bg:'rgba(7,27,39,.8)'});wt(84,190,'每次登塔前',19,'#f2c230',700);
  const C=['工作許可','天候預報','無線電測試','人員點名'];
  C.forEach((c,i)=>{const a=seg(u,.03+i*.04,.07+i*.04);if(a<=0)return;alphaDo(a,()=>{const x=84+i*360;
   circ(x+16,240,14,'#7dffc4');ln([x+9,240,x+14,246,x+24,234],'#0e2a3b',3);wt(x+42,247,c,19,'#fff',700);});});
  const S=[
   {t:'人員落水',col:'#58b8d0',a:.26,steps:['救生衣自動充氣','定位信標發出警報與位置','救援艇或吊網撈起']},
   {t:'機艙受傷或火災',col:'#ff9d7a',a:.5,steps:['同伴急救與通報','救援下降器垂降或塔內撤離','船舶或直升機後送']},
   {t:'天候轉壞',col:'#f2c230',a:.7,steps:['持續監看浪高與風速','超過上限前提早撤離','任何人都可以喊停']}];
  S.forEach((s,i)=>{const a=seg(u,s.a,s.a+.05);if(a<=0)return;const x=60+i*500;alphaDo(a,()=>{
   card(x,310,480,400,{bg:'rgba(7,27,39,.8)',st:s.col});box(x+24,330,6,36,s.col);wt(x+42,358,s.t,22,s.col,800);
   s.steps.forEach((st,j)=>{const b=seg(u,s.a+.03+j*.04,s.a+.07+j*.04);if(b<=0)return;alphaDo(b,()=>{const y=400+j*100;
    card(x+24,y,432,78,{bg:'rgba(255,255,255,.05)',r:6});wt(x+56,y+48,String(j+1),26,s.col,700,'center',COND);
    wrap26(x+84,y+46,st,350,18,'#fff',600,24);
    if(j<2)arrow(x+240,y+80,x+240,y+98,'rgba(227,236,238,.6)',2);});});});});
  alphaDo(seg(u,.82,.88),()=>{card(60,730,1480,70,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.5)'});
   wt(800,774,'停工權：任何人發現危險都可以喊停　所有情境定期演練',20,'#7dffc4',700,'center');});
 }}
]};
