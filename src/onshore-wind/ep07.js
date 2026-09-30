// KITS: land
/* 陸域風電系列 第 7 集：雷擊與葉片防護 */
const gyy=x=>groundY(x);
const TX=640,HY=240,BL=200;                                  // 風機塔架位置、輪轂高度、側視葉片長度（世界座標）
const RAD=60,RMAX=15;                                        // 轉子半徑 60 m、額定轉速 15 rpm（典型範例）
/* 側視葉片 */
function bladeS(hx,hy,a,L){const c=Math.cos(a),s=Math.sin(a),dx=s*6,w=3;
  poly([hx-w,hy,hx+w,hy,hx+dx+w*.5,hy-c*L,hx+dx-w*.5,hy-c*L],'#f4f6f7','rgba(0,0,0,.35)',1);
  if(Math.abs(c)>.3)circ(hx+dx,hy-c*(L-3),2.6,'#8d989f');}
function tipOf(rot){return [TX-100+Math.sin(rot)*6,HY-Math.cos(rot)*BL];}
/* 側視風機（外殼關閉） */
function turbineSide(rot){const g=gyy(TX),hx=TX-100;
  poly([TX-18,g,TX-11,HY+36,TX+11,HY+36,TX+18,g],'#eef2f4','rgba(0,0,0,.3)',1);
  for(let i=0;i<3;i++){const a=rot+i*TAU/3;if(Math.cos(a)<0)bladeS(hx,HY,a,BL);}
  box(TX-8,HY+36,16,8,'#394650');
  rrp(TX-80,HY-32,260,68,8);ctx.fillStyle='#e3e8ec';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.stroke();
  poly([TX-80,HY-26,TX-112,HY-12,TX-118,HY,TX-112,HY+12,TX-80,HY+26],'#dfe5e8','rgba(0,0,0,.35)',1);
  for(let i=0;i<3;i++){const a=rot+i*TAU/3;if(Math.cos(a)>=0)bladeS(hx,HY,a,BL);}
  ln([TX+150,HY-32,TX+150,HY-58],'#6f7a80',2);circ(TX+150,HY-60,3,'#e8572a');}
/* 正視小風機（圖解用）；回傳頂端葉尖 */
function miniT(x,g,H,R,rot){const hy=g-H;
  poly([x-7,g,x-4,hy,x+4,hy,x+7,g],'#eef2f4','rgba(0,0,0,.35)',1);box(x-12,hy-8,24,14,'#dfe5e8','rgba(0,0,0,.35)',1);
  let top=[x,hy-R],best=-9;
  for(let i=0;i<3;i++){const a=rot+i*TAU/3,c=Math.cos(a),s=Math.sin(a),tx=x+s*R,ty=hy-c*R,nx=c*4,ny=s*4;
   poly([x-nx,hy-ny,x+nx,hy+ny,tx+nx*.3,ty+ny*.3,tx-nx*.3,ty-ny*.3],'#f4f6f7','rgba(0,0,0,.35)',1);if(-ty>best){best=-ty;top=[tx,ty];}}
  circ(x,hy,5,'#dfe5e8','#394650',1);return top;}
/* 雷雲、雨、閃電 */
function stormClouds(){const r=rng(21);for(let i=0;i<16;i++){const x=VX0-100+r()*(VX1-VX0+200)+nz(TT*.05+i)*20,y=-40+r()*70,s=50+r()*60;
  circ(x,y,s,i%2?'#26303a':'#2e3944');}}
function rain(a){if(a<=0)return;const r=rng(11);alphaDo(a,()=>{for(let i=0;i<140;i++){const x0=VX0-300+r()*(VX1-VX0+600),y=((r()*1000+TT*800)%1000)-100,x=x0+(y*.25);ln([x,y,x+6,y+24],'rgba(205,222,235,.45)',1.5);}});}
function boltPts(x0,y0,x1,y1,seed,n,amp){const r=rng(seed),P=[x0,y0];for(let i=1;i<n;i++){const k=i/n;P.push(lerp(x0,x1,k)+(r()-.5)*amp,lerp(y0,y1,k)+(r()-.5)*amp*.3);}P.push(x1,y1);return P;}
function bolt(P,a,w){if(a<=0)return;alphaDo(a*.35,()=>ln(P,'#b9c8ff',(w||3)*4));alphaDo(a,()=>ln(P,'#ffffff',w||3));}
function flick(u,a,b){return u>=a&&u<=b?(.55+.45*Math.abs(Math.sin(TT*47))):0;}
/* 沿折線的流動點 */
function along(P,f){let L=0;const S=[];for(let i=2;i<P.length;i+=2){const d=Math.hypot(P[i]-P[i-2],P[i+1]-P[i-1]);S.push(d);L+=d;}
  let t=((f%1)+1)%1*L;for(let i=0;i<S.length;i++){if(t<=S[i]){const k=t/S[i];return [lerp(P[i*2],P[i*2+2],k),lerp(P[i*2+1],P[i*2+3],k)];}t-=S[i];}return [P[P.length-2],P[P.length-1]];}
function flow(P,n,sp,col,r){for(let i=0;i<n;i++){const [x,y]=along(P,TT*sp+i/n);circ(x,y,r||4,col);}}
function tree(x,b){const g=gyy(x);ln([x,g,x+b*.3,g-40,x+b,g-72],'#5b4632',5);circ(x+b*1.1,g-84,24,'#3f6b45');circ(x+b*1.2-16,g-72,17,'#4a7a50');}
/* 葉片剖面（翼型），LE 朝 ang 方向 */
function airfoil(x,y,L,ang,col,st){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.beginPath();
  const T=s=>L*.15*5*(.2969*Math.sqrt(s)-.126*s-.3516*s*s+.2843*s*s*s-.1015*s*s*s*s);
  for(let i=0;i<=24;i++){const s=i/24;ctx.lineTo(L/2-s*L,-T(s)-L*.03*Math.sin(Math.PI*s));}
  for(let i=24;i>=0;i--){const s=i/24;ctx.lineTo(L/2-s*L,T(s)*.7-L*.03*Math.sin(Math.PI*s));}
  ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.strokeStyle=st||'#13232e';ctx.lineWidth=2;ctx.stroke();ctx.restore();}
/* 雷擊電流波形 10/350 μs（示意） */
const iw=t=>t<10?200*(1-Math.cos(Math.PI*t/10))/2:200*Math.exp(-(t-10)*Math.LN2/340);
/* 基礎、環形接地極、接地棒（剖面） */
function earthing(a){const g=gyy(TX),cy=g+64,rx=230,ry=18;
  ctx.save();ctx.setLineDash([7,5]);ctx.beginPath();ctx.ellipse(TX,cy,rx,ry,0,Math.PI,TAU);ctx.strokeStyle=`rgba(208,138,74,${(.8*a).toFixed(3)})`;ctx.lineWidth=3;ctx.stroke();ctx.restore();
  box(TX-30,g,60,44,'#9aa3a8','rgba(0,0,0,.4)',1);
  poly([TX-40,g+44,TX+40,g+44,TX+170,g+104,TX-170,g+104],'#9aa3a8','rgba(0,0,0,.4)',1);box(TX-170,g+104,340,30,'#8d989f','rgba(0,0,0,.4)',1);
  ctx.setLineDash([5,5]);ln([TX-160,g+122,TX+160,g+122],'rgba(40,50,60,.55)',1.5);ln([TX-20,g+6,TX-20,g+116],'rgba(40,50,60,.55)',1.5);ln([TX+20,g+6,TX+20,g+116],'rgba(40,50,60,.55)',1.5);ctx.setLineDash([]);
  alphaDo(a,()=>{ctx.beginPath();ctx.ellipse(TX,cy,rx,ry,0,0,Math.PI);ctx.strokeStyle='#d08a4a';ctx.lineWidth=3.5;ctx.stroke();
   [-rx,rx].forEach(d=>{ln([TX+d,cy,TX+d,cy+150],'#d08a4a',4);circ(TX+d,cy,4,'#d08a4a');});
   ln([TX+150,cy+13,TX+150,g+118],'#d08a4a',2.5);});}
function baseCab(){const g=gyy(TX),bx=TX+40;box(bx,g-46,70,46,'#dfe5e8','rgba(0,0,0,.3)',1);for(let i=0;i<3;i++)ln([bx+10,g-36+i*10,bx+60,g-36+i*10],'rgba(0,0,0,.2)',2);circ(bx+62,g-40,3,'#7dffc4');}

const EP={no:7,slug:'onshore-wind',seriesName:'陸域風電系列',t:'雷擊與葉片防護',en:'Lightning and blade protection',
lede:'風機是開闊地上最高的物體，雷雨時常被擊中；葉片前緣則每天承受雨滴與沙塵以高速撞擊。這一集看雷電流如何從葉尖的接閃器一路導入大地、接地與突波保護怎麼設計，以及前緣侵蝕、冬季雷與沿海鹽害的防護方法。',
facts:[['200','kA','IEC 61400-24 雷擊防護等級 LPL I 的設計峰值電流'],
['300','C','LPL I 的雷擊電荷量；電荷越大，接閃器燒蝕越嚴重'],
['4','%','日本 NEDO 在 27 部風機的觀測中，電荷量超過 300 C 的雷擊比例'],
['≤ 10','Ω','常見的接地電阻設計目標（實際依土壤電阻率設計）'],
['≈ 94','m/s','轉子半徑 60 m、每分鐘 15 轉時的葉尖速度（示例）'],
['數','%','前緣嚴重侵蝕造成的年發電量損失，研究多在幾個百分點']],
note:'說明：本集為教育用途示意動畫，風機、葉片與接地系統比例經過簡化，雷擊與侵蝕過程的時間已壓縮。LPL I 峰值電流 200 kA、電荷量 300 C、比能量 10 MJ/Ω 與 10/350 μs 波形依 IEC 61400-24 與 IEC 62305 的雷擊參數；日本海沿岸冬季上行雷電荷量大、NEDO 2008–2013 年觀測 27 部風機中約 4% 雷擊超過 300 C，引自公開研究文獻；前緣侵蝕可造成數個百分點的年發電量損失，引自 Wind Energy Science 等期刊研究。接地電阻 10 Ω 為常見設計目標而非固定規定；雷擊峰值 34 kA、電荷 12 C、量測接地電阻 4.6 Ω、轉子半徑 60 m、轉速 15 rpm、侵蝕年數與各階段皆為典型範例，並非特定機型或案場資料。',
base:()=>{landSky(GY,{sun:{x:1320,y:120},clouds:false});drawGround();},
shots:[
/* 1 ─────────────────────────────── 最高的那一點 */
{t:'開闊地上最高的一點',en:'The highest point around',dur:13,side:true,
 d:'陸域風機常立在海岸或丘陵的開闊處，葉尖最高點往往超過 100 公尺，是周圍數公里內最突出的物體，雷雨時很容易成為落雷點。結構越高，越容易從葉尖向上長出迎向雲層的放電通道，也就是上行先導。雷擊多半落在葉尖，因此葉片裝有金屬接閃器，把雷電流引進葉片內部的引下線，再經機艙與塔架導入地下的接地系統，而不是讓電流在葉片與設備中亂竄。',
 s:[[0,'雷雨雲接近開闊地上的風機'],[.18,'葉尖向上長出放電通道：上行先導'],[.3,'雷擊落在葉尖的接閃器'],[.55,'電流經葉片、機艙、塔架導入大地']],
 cam:u=>({x:760,y:400,s:1}),
 draw(u){
  box(VX0-20,-600,VX1-VX0+40,2000,'rgba(22,32,42,.45)');
  stormClouds();rain(.55);
  const fl=flick(u,.3,.36);if(fl>0)alphaDo(fl*.3,()=>box(VX0-20,-600,VX1-VX0+40,2000,'#dfe8ff'));
  [[230,0],[320,1],[1040,2],[1130,3],[1450,4]].forEach(([x,i])=>tree(x,10+4*Math.sin(TT*2.4+i)));
  const rot=(u-.3)*.9,[tx,ty]=tipOf(rot),g=gyy(TX);
  earthing(.9);
  turbineSide(rot);baseCab();
  /* 上行先導 */
  const lk=seg(u,.16,.3);if(lk>0&&u<.36){const P=boltPts(tx,ty,tx+20,ty-110*lk,5,6,26);alphaDo(.8,()=>ln(P,'#dfe8ff',2));}
  bolt(boltPts(tx+60,-60,tx,ty,9,12,70),fl,3.5);
  /* 電流路徑 */
  const pa=band(u,.34,.84),P=[tx,ty,TX-100,HY,TX-40,HY,TX,HY+40,TX,g,TX,g+60];
  if(pa>0){alphaDo(pa*.5,()=>ln(P,'#f2c230',6));alphaDo(pa,()=>flow(P,14,.9,'#f2c230',4.5));
   for(let i=0;i<3;i++){const k=((TT*.9+i/3)%1);alphaDo(pa*(1-k),()=>{ctx.beginPath();ctx.ellipse(TX,g+64,60+k*280,(60+k*280)*.35,0,0,Math.PI);ctx.strokeStyle='#f2c230';ctx.lineWidth=2;ctx.stroke();});}}
  lab(tx,ty-60,'上行先導',{dx:140,dy:-10,st:'l',a:band(u,.16,.3)});
  lab(tx,ty,'葉尖接閃器',{dx:150,dy:30,st:'s',a:band(u,.3,.56)});
  lab(TX-100,HY+30,'葉片內引下線',{dx:-150,dy:60,st:'s',a:band(u,.4,.66)});
  lab(TX+6,420,'經塔架向下',{dx:120,dy:0,st:'g',a:band(u,.5,.8)});
  lab(TX+230,g+64,'接地系統',{dx:120,dy:50,st:'g',a:band(u,.6,1)});
 },
 hud(u){hudPanel(250,182,'雷擊監測（示例）',seg(u,.04,.09),w=>{const hit=u>=.3;
  hrow(56,'峰值電流',hit?trf('{n} kA',{n:(34*ease(seg(u,.3,.33))).toFixed(0)}):'—',w,'#f2c230');
  hrow(88,'電荷量',hit?trf('{n} C',{n:(12*ease(seg(u,.3,.36))).toFixed(1)}):'—',w,'#f2c230');
  hrow(120,'本年雷擊次數',hit?'4':'3',w,'#fff');
  hrow(152,'狀態',u<.3?'運轉中':u<.7?'偵測到雷擊':'自動檢查',w,u<.3?'#7dffc4':'#ff9d7a');});}},

/* 2 ─────────────────────────────── 雷電流的路徑 */
{t:'雷電流的旅程',en:'The path of a lightning current',dur:14,
 d:'風機的雷擊防護系統要讓雷電流走一條事先安排好的低阻抗路徑。葉尖與葉身的金屬接閃器接住雷擊，電流沿著葉片內部的銅質引下線流向葉根。葉片會變槳、機艙會偏航，轉動的軸承不能讓大電流直接通過，否則滾珠與滾道會被電弧燒出凹痕，因此在變槳與偏航處用碳刷、滑動接點或火花間隙跨接。電流進入鋼製塔架後向下傳到基礎，最後由接地系統散入大地。',
 s:[[0,'接閃器在葉尖接住雷擊'],[.2,'引下線把電流帶到葉根'],[.4,'軸承處用碳刷與火花間隙跨接'],[.7,'經塔架與接地網散入大地']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'雷電流的路徑（示意）',20,'#f2c230',700);
  const g=740,hx=300,hy=400;
  /* 地面與接地 */
  box(62,g,696,58,'rgba(164,135,106,.35)');ln([62,g,758,g],'rgba(227,236,238,.5)',1.5);
  ctx.beginPath();ctx.ellipse(420,g+26,160,12,0,0,TAU);ctx.strokeStyle='#d08a4a';ctx.lineWidth=3;ctx.stroke();
  /* 塔架、機艙、輪轂、葉片 */
  poly([405,g,410,hy+30,430,hy+30,435,g],'#dfe5e8','#394650',1.2);
  rrp(330,hy-24,190,54,6);ctx.fillStyle='#c9d1d6';ctx.fill();ctx.strokeStyle='#394650';ctx.lineWidth=1.2;ctx.stroke();
  poly([330,hy-18,hx+4,hy-6,hx,hy+4,hx+4,hy+14,330,hy+22],'#dfe5e8','#394650',1.2);
  poly([hx-14,hy-8,hx+14,hy-8,hx+5,236,hx-5,236],'#f4f6f7','#394650',1.4);
  poly([hx-12,hy+16,hx+12,hy+16,hx+4,g-40,hx-4,g-40],'rgba(244,246,247,.35)','rgba(57,70,80,.5)',1);
  ctx.setLineDash([6,5]);ln([hx,244,hx,hy-10],'#d08a4a',2.5);ctx.setLineDash([]);
  [[hx,240],[hx+9,300],[hx-9,350]].forEach(([x,y])=>circ(x,y,5,'#9aa3a8','#13232e',1.2));
  /* 流動 */
  const P=[hx,240,hx,hy-10,hx+10,hy+4,380,hy+4,420,hy+32,420,g,420,g+14];
  const segs=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]],T0=[.03,.18,.38,.5,.62,.74];
  let cur=-1;T0.forEach((t,i)=>{if(u>=t)cur=i;});
  const L=[0,1,2,3,4,5,6].map(i=>[P[i*2],P[i*2+1]]);
  const reach=[1,1,3,4,5,6];      // 每一步點亮到路徑的第幾點
  if(cur>=0){const k=reach[cur];const Q=[];for(let i=0;i<=k;i++)Q.push(L[i][0],L[i][1]);alphaDo(.55,()=>ln(Q,'#f2c230',6));flow(Q,10,.8,'#f2c230',4);}
  if(u>=.74){for(let i=0;i<3;i++){const k=((TT*.8+i/3)%1);alphaDo(1-k,()=>{ctx.beginPath();ctx.ellipse(420,g+26,160+k*120,12+k*20,0,0,Math.PI);ctx.strokeStyle='#f2c230';ctx.lineWidth=2;ctx.stroke();});}}
  const BG=[[hx+26,238],[hx+26,320],[hx-26,hy+10],[452,hy+40],[452,590],[600,g+26]];
  BG.forEach(([x,y],i)=>alphaDo(u>=T0[i]?1:.3,()=>{circ(x,y,15,i===cur?'#f2c230':i<cur?'#7dffc4':'#16384c','#13232e',1.5);wt(x,y+6,String(i+1),16,'#13232e',800,'center',COND);}));
  /* 右：步驟 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'每一段怎麼過電',20,'#f2c230',700);
  const ST=['接閃器：葉尖與葉身的金屬接收點','引下線：葉片內部的銅纜','變槳軸承：碳刷或火花間隙跨接','偏航軸承：滑動接點導到塔架','塔架：鋼管本身就是導體','接地網：把電流散入大地'];
  ST.forEach((s,i)=>{const y=226+i*92,on=u>=T0[i];alphaDo(on?1:.35,()=>{
   const c=i<cur?'#7dffc4':i===cur?'#f2c230':'rgba(227,236,238,.6)';
   box(824,y,692,72,i===cur?'rgba(242,194,48,.12)':'rgba(255,255,255,.04)',c,i===cur?2.5:1);
   circ(862,y+36,20,i<cur?'#7dffc4':'#16384c',c,2);wt(862,y+43,String(i+1),20,i<cur?'#13232e':c,800,'center',COND);
   wt(900,y+43,s,19,'#fff',i===cur?700:600);});});
 }},

/* 3 ─────────────────────────────── 雷擊有多猛 */
{t:'雷擊有多猛',en:'How violent is a strike',dur:14,
 d:'國際標準 IEC 61400-24 以雷擊防護等級描述設計要承受的雷電，風機一般採用最高的 LPL I：峰值電流 200 kA、單次雷擊電荷量 300 C、比能量 10 MJ/Ω。電流在約 10 微秒內衝到峰值，數百微秒後才衰減到一半。如果葉片沒有可靠的導電路徑，雷擊可能穿透外殼，在中空葉片內部的空氣中起弧，瞬間加熱的空氣形成壓力波，把葉殼從接縫撐裂，甚至讓葉尖爆開。接閃器與引下線的任務，就是讓電流在外部金屬中通過。',
 s:[[0,'防護等級 LPL I：峰值 200 kA'],[.3,'約 10 微秒衝到峰值，再慢慢衰減'],[.5,'沒有導電路徑：葉片內部起弧'],[.72,'有接閃器與引下線：電流走金屬']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,700,420,{title:'雷擊電流波形 10/350 μs（示意）',x0:0,x1:800,y0:0,y1:220,xt:[0,200,400,600,800],yt:[0,100,200],xl:'時間 μs',yl:'電流 kA',pl:80,pt:80,pb:64,gx:4,gy:2});
  const tc=800*seg(u,.04,.44);
  if(tc>0){ctx.beginPath();for(let k=0;k<=200;k++){const t=tc*k/200;k?ctx.lineTo(C.X(t),C.Y(iw(t))):ctx.moveTo(C.X(t),C.Y(iw(t)));}ctx.strokeStyle='#f2c230';ctx.lineWidth=3.5;ctx.stroke();circ(C.X(tc),C.Y(iw(tc)),6,'#f2c230','#13232e',1.5);}
  alphaDo(seg(u,.1,.14),()=>{tag(C.X(10)+16,C.Y(200)+4,'峰值 200 kA',{size:16,bg:'#f2c230'});});
  alphaDo(seg(u,.3,.34),()=>{ctx.setLineDash([6,6]);ln([C.X(350),C.Y(100),C.X(350),C.py+C.ph],'#fff',1.5);ln([C.px,C.Y(100),C.X(350),C.Y(100)],'#fff',1.5);ctx.setLineDash([]);tag(C.X(350)+10,C.Y(100)-22,'350 μs 降到一半',{size:16,bg:'#7dffc4'});});
  const PR=[['200 kA','峰值電流'],['300 C','電荷量'],['10 MJ/Ω','比能量']];
  PR.forEach(([v,n],i)=>alphaDo(seg(u,.06+i*.06,.12+i*.06),()=>{const x=60+i*240;card(x,610,220,190,{bg:'rgba(7,27,39,.75)'});
   wt(x+110,690,v,36,'#f2c230',700,'center',COND);wt(x+110,740,n,18,'rgba(227,236,238,.85)',600,'center');}));
  wt(410,786,'IEC 61400-24　LPL I',15,'rgba(227,236,238,.55)',600,'center');
  /* 右：葉片剖面比較 */
  card(800,160,740,300,{bg:'rgba(7,27,39,.75)'});wt(824,200,'沒有導電路徑',20,'#ff9d7a',700);
  const k=ease(seg(u,.55,.64)),cx=1170,cy=330,d=12*k;
  ctx.save();ctx.beginPath();ctx.rect(800,160,740,cy-160);ctx.clip();ctx.translate(0,-d);airfoil(cx,cy,440,Math.PI,'#dfe5e8');ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(800,cy,740,130);ctx.clip();ctx.translate(0,d);airfoil(cx,cy,440,Math.PI,'#dfe5e8');ctx.restore();
  const af=flick(u,.48,.58)+(u>.58&&u<.66?.4:0);
  if(u>=.46){bolt(boltPts(cx-40,210,cx-40,cy-22,3,5,30),flick(u,.46,.5),3);bolt(boltPts(cx-60,cy+2,cx+140,cy+2,7,9,26),af,2.5);}
  if(k>0){alphaDo(k,()=>{[[-120,-1],[20,1],[160,-1]].forEach(([dx,s],i)=>{const r=rng(40+i);const x=cx+dx;ln([x,cy,x+10*s,cy-14*s,x+4*s,cy-26*s],'#e8572a',2.5);});});
   alphaDo(k,()=>tag(cx,432,'葉殼沿接縫撐裂',{size:16,bg:'#e8572a',align:'center'}));}
  card(800,490,740,310,{bg:'rgba(7,27,39,.75)'});wt(824,530,'有接閃器與引下線',20,'#7dffc4',700);
  const cy2=660;airfoil(cx,cy2,440,Math.PI,'#dfe5e8');
  circ(cx-30,cy2-10,9,'#d08a4a','#13232e',1.5);box(cx-36,cy2-50,12,34,'#9aa3a8','#13232e',1.2);
  if(u>=.7){bolt(boltPts(cx-30,540,cx-30,cy2-50,13,5,30),flick(u,.7,.76),3);
   const pa=band(u,.72,1);alphaDo(pa*(.5+.4*Math.sin(TT*10)),()=>circ(cx-30,cy2-10,16,'rgba(242,194,48,.5)'));
   alphaDo(seg(u,.78,.84),()=>tag(cx,768,'電流沿引下線流走，葉片完好',{size:16,bg:'#7dffc4',align:'center'}));}
  alphaDo(band(u,.7,1),()=>{wt(cx+90,cy2-58,'接閃器',16,'#fff',700);wt(cx+90,cy2+2,'引下線（剖面）',16,'#fff',700);
   ln([cx+84,cy2-64,cx-22,cy2-40],'rgba(255,255,255,.6)',1);ln([cx+84,cy2-4,cx-20,cy2-10],'rgba(255,255,255,.6)',1);});
 }},

/* 4 ─────────────────────────────── 接地與突波保護 */
{t:'接地與突波保護',en:'Earthing and surge protection',dur:14,side:true,
 d:'雷電流最後要散入大地。風機基礎的鋼筋與埋在基礎外圍的環形接地極連成一體，土壤電阻率高的地方再打入接地棒，設計上常以接地電阻 10 Ω 以下為目標，完工後實際量測確認。電流進入土壤時會形成電位梯度，人站在附近，兩腳之間可能出現跨步電壓，環形接地極能讓地表電位較平均。雷擊也會在電纜上感應出突波，所以塔底控制櫃的電源與通訊線路都裝有突波保護器（SPD），並把所有金屬做等電位連接。',
 s:[[0,'基礎鋼筋、環形接地極與接地棒連成一體'],[.3,'雷電流進入土壤，向四周擴散'],[.48,'地表電位梯度可能形成跨步電壓'],[.66,'控制櫃線路裝突波保護器（SPD）'],[.84,'完工量測接地電阻，確認達到設計值']],
 cam:u=>({x:TX+110,y:560,s:1.6}),
 draw(u){
  const g=gyy(TX);
  turbineSide(TT*.4);baseCab();
  earthing(1);
  /* 雷電流 */
  const pa=band(u,.28,.6);
  if(pa>0){const P=[TX,280,TX,g,TX,g+64];alphaDo(pa*.5,()=>ln(P,'#f2c230',6));alphaDo(pa,()=>flow(P,8,.9,'#f2c230',4));
   ctx.save();ctx.beginPath();ctx.rect(VX0,g+2,VX1-VX0,600);ctx.clip();
   for(let i=0;i<4;i++){const k=((TT*.6+i/4)%1),rx=240+k*420;alphaDo(pa*(1-k)*.9,()=>{ctx.beginPath();ctx.ellipse(TX,g+64,rx,rx*.42,0,0,TAU);ctx.strokeStyle='#f2c230';ctx.lineWidth=2.5;ctx.stroke();});}
   ctx.restore();}
  /* 跨步電壓 */
  const px=1010,ps=band(u,.44,.66);person(px,gyy(px),'#e8572a',2.4);
  if(ps>0)alphaDo(ps,()=>{circ(px-3,gyy(px)+2,4,'#ff9d7a');circ(px+3,gyy(px)+2,4,'#f2c230');});
  /* SPD 指示燈 */
  const sp=band(u,.64,.84);if(sp>0)alphaDo(sp*(.6+.4*Math.sin(TT*9)),()=>circ(TX+75,g-24,10,'rgba(125,255,196,.55)'));
  lab(TX-230,g+64,'環形接地極',{dx:-40,dy:-80,st:'s',a:band(u,.02,.3)});
  lab(TX+230,g+170,'接地棒',{dx:90,dy:30,st:'s',a:band(u,.06,.3)});
  lab(TX-100,g+118,'基礎鋼筋',{dx:-60,dy:60,st:'l',a:band(u,.1,.3)});
  lab(TX+420,g+120,'電流向四周擴散',{dx:60,dy:40,st:'s',a:band(u,.3,.5)});
  lab(px,gyy(px)-10,'跨步電壓',{dx:40,dy:-90,st:'w',a:band(u,.46,.66)});
  lab(TX+75,g-24,'突波保護器（SPD）',{dx:110,dy:-90,st:'g',a:band(u,.66,.9)});
  lab(TX+40,g-6,'等電位連接',{dx:-40,dy:-150,st:'g',a:band(u,.7,.9)});
 },
 hud(u){hudPanel(250,182,'接地與保護（示例）',seg(u,.03,.08),w=>{
  hrow(56,'設計目標','≤ 10 Ω',w,'#fff');
  hrow(88,'量測接地電阻',u<.84?'—':trf('{n} Ω',{n:(lerp(9,4.6,ease(seg(u,.84,.94)))).toFixed(1)}),w,'#7dffc4');
  hrow(120,'雷電流',u<.28||u>.62?'—':trf('{n} kA',{n:(34*Math.exp(-seg(u,.3,.62)*3)).toFixed(0)}),w,'#f2c230');
  hrow(152,'SPD 狀態',u<.64?'待命':u<.8?'動作，洩放突波':'正常',w,u<.64?'#fff':u<.8?'#ff9d7a':'#7dffc4');});}},

/* 5 ─────────────────────────────── 前緣侵蝕 */
{t:'葉片前緣侵蝕',en:'Leading-edge erosion',dur:14,
 d:'葉片的前緣是轉動時最先切開空氣的部位。以轉子半徑 60 m、每分鐘 15 轉為例，葉尖速度約 94 m/s，雨滴、冰雹與沙塵以這樣的速度反覆撞擊，數年後塗層出現麻點、剝落，嚴重時露出底下的玻璃纖維層板。前緣變粗糙後，氣流提早轉為紊流，升力下降、阻力上升，研究顯示年發電量可能因此減少數個百分點。常見的前緣保護（LEP）有彈性塗層、保護膠帶與預製護殼，巡檢時一併檢查修補。',
 s:[[0,'葉尖速度可達每秒 90 多公尺'],[.25,'雨滴與沙塵反覆撞擊葉片前緣'],[.45,'塗層麻點、剝落，最後露出層板'],[.72,'前緣保護：塗層、膠帶或護殼']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'前緣的特寫（示意）',20,'#f2c230',700);
  const yr=10*seg(u,.26,.66),cx=520,cy=400;
  ctx.save();ctx.beginPath();ctx.rect(62,220,696,380);ctx.clip();
  airfoil(cx,cy,760,Math.PI,'#dfe5e8');
  /* 塗層 */
  const r=rng(8),LEx=cx-380;
  ctx.beginPath();ctx.ellipse(LEx+56,cy-8,62,58,0,Math.PI*.5,Math.PI*1.5);ctx.strokeStyle='#7dc8dc';ctx.lineWidth=7;ctx.stroke();
  const np=Math.round(yr*9);for(let i=0;i<np;i++){const a=Math.PI*.62+r()*Math.PI*.76,rr=58+r()*4,x=LEx+56+Math.cos(a)*rr,y=cy-8+Math.sin(a)*rr*.95;circ(x,y,2+r()*2.5+(yr>5?1.5:0),yr>8&&i%3===0?'#b89a6a':'#5b6b74');}
  if(yr>8)alphaDo(seg(yr,8,10),()=>{ctx.beginPath();ctx.ellipse(LEx+56,cy-8,62,58,0,Math.PI*.85,Math.PI*1.15);ctx.strokeStyle='#c9b088';ctx.lineWidth=9;ctx.stroke();});
  /* 雨滴 */
  for(let i=0;i<22;i++){const y=250+((i*37)%320),x=62+((TT*900+i*97)%(LEx-62+30));if(Math.abs(y-cy)<150||x<LEx-20)ln([x-22,y,x,y],'rgba(125,200,220,.85)',2);}
  ctx.restore();
  wt(96,580,trf('運轉第 {n} 年',{n:yr.toFixed(0)}),22,'#fff',700,'left',COND);
  alphaDo(band(u,.05,.3),()=>tag(150,262,'雨滴高速撞擊',{size:16,bg:'#7dc8dc'}));
  const SG=[['塗層麻點',2],['塗層剝落',5],['層板外露',8]];
  SG.forEach(([n,t],i)=>{const on=yr>=t,x=84+i*222;alphaDo(on?1:.35,()=>{box(x,630,206,120,on?'rgba(232,87,42,.12)':'rgba(255,255,255,.04)',on?'#ff9d7a':'rgba(227,236,238,.4)',on?2:1);
   wt(x+103,676,String(i+1),24,on?'#ff9d7a':'rgba(227,236,238,.6)',800,'center',COND);wt(x+103,720,n,18,'#fff',700,'center');});});
  /* 右：沿葉展的速度 */
  const C=chartBox(800,160,740,360,{title:'沿葉片的相對速度（示例）',x0:0,x1:60,y0:0,y1:100,xt:[0,20,40,60],yt:[0,50,100],xl:'離輪轂距離 m',yl:'速度 m/s',pl:80,pt:80,pb:64,gx:3,gy:2});
  const rr=60*seg(u,.02,.22),vf=r=>r*TAU*RMAX/60;
  if(rr>0){ln([C.X(0),C.Y(0),C.X(rr),C.Y(vf(rr))],'#f2c230',3.5);circ(C.X(rr),C.Y(vf(rr)),7,'#f2c230','#13232e',1.5);
   wt(C.X(rr)-12,C.Y(vf(rr))-16,trf('{n} m/s',{n:vf(rr).toFixed(0)}),20,'#fff',700,'right',COND);}
  alphaDo(seg(u,.22,.26),()=>tag(C.X(60)-10,C.Y(30),'葉尖最容易侵蝕',{size:16,bg:'#e8572a',align:'right'}));
  card(800,550,740,250,{bg:'rgba(7,27,39,.75)'});wt(824,590,'前緣保護（LEP）',20,'#7dffc4',700);
  const LP=[['保護塗層','彈性塗料，可現場修補'],['保護膠帶','貼覆彈性膜，施工快'],['前緣護殼','預製硬殼，耐久性高']];
  LP.forEach(([n,s],i)=>alphaDo(seg(u,.72+i*.07,.77+i*.07),()=>{const x=824+i*236;box(x,612,220,110,'rgba(125,255,196,.08)','#7dffc4',1.5);
   wt(x+110,654,n,19,'#7dffc4',700,'center');wt(x+110,694,s,15,'#fff',600,'center');}));
  alphaDo(seg(u,.5,.55),()=>wt(1170,770,'前緣變粗糙：年發電量可能少數個百分點',17,'#ff9d7a',700,'center'));
 }},

/* 6 ─────────────────────────────── 冬季雷與鹽害 */
{t:'冬季雷與沿海鹽害',en:'Winter lightning and salt',dur:13,
 d:'環境不同，防護重點也不同。日本海沿岸冬季的雷雲低，風機葉尖常自己向上引發上行雷，電荷量特別大；日本 NEDO 在 27 部風機的觀測中，約 4% 的雷擊超過 300 C，接閃器因此要更耐燒蝕。台灣的雷擊則多集中在夏季午後雷陣雨與梅雨季。台灣西部沿海的風機另有鹽害問題：東北季風把海上的鹽霧吹上岸，塔架與機艙需要高防蝕等級的塗裝、機艙密封與除濕，並定期以無人機或繩索作業檢查接閃器與前緣。',
 s:[[0,'日本海沿岸冬季雷雲低，常見上行雷'],[.3,'上行雷電荷量大，接閃器容易燒蝕'],[.52,'台灣沿海：東北季風帶來鹽霧'],[.76,'防蝕塗裝、機艙除濕與定期巡檢']],
 draw(u){
  diagBG();
  /* 左：冬季雷 */
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'冬季雷（日本海沿岸）',20,'#f2c230',700);
  ctx.save();ctx.beginPath();ctx.rect(62,220,696,380);ctx.clip();
  box(62,220,696,380,'#1d2b36');
  const r=rng(6);for(let i=0;i<10;i++)circ(80+r()*660,250+r()*40,40+r()*40,'#34424e');
  const g1=560;box(62,g1,696,40,'#dfe5e8');
  for(let i=0;i<50;i++){const x=62+((r()*700+TT*14)%700),y=240+((r()*360+TT*40)%360);circ(x,y,1.8,'rgba(255,255,255,.7)');}
  const top=miniT(410,g1,190,110,TT*.8);
  const lk=seg(u,.06,.28),sb=[];
  if(lk>0){const P=boltPts(top[0],top[1],top[0]+30,lerp(top[1],290,lk),15,8,40);bolt(P,u<.3?.8:flick(u,.3,.5),2.5);
   [[-60,.4],[70,.6]].forEach(([dx,f],i)=>{if(lk>f){const q=along(P,f*.9);bolt(boltPts(q[0],q[1],q[0]+dx,q[1]-80*(lk-f),20+i,5,20),u<.3?.6:flick(u,.3,.5),1.6);}});}
  ctx.restore();
  lab(top[0],top[1],'葉尖引發上行雷',{dx:120,dy:30,st:'s',a:band(u,.1,.5)});
  const LR=[['上行雷多、電荷量大','#f2c230',.28],['NEDO 觀測：約 4% 超過 300 C','#f2c230',.36],['台灣雷擊多在夏季午後雷陣雨','#7dc8dc',.44]];
  LR.forEach(([s,c,t],i)=>alphaDo(seg(u,t,t+.05),()=>{const y=624+i*56;box(84,y,652,46,'rgba(255,255,255,.04)','rgba(255,255,255,.14)',1);box(84,y,6,46,c);wt(104,y+30,s,17,'#fff',600);}));
  /* 右：鹽害 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'沿海鹽害（台灣西部海岸）',20,'#f2c230',700);
  ctx.save();ctx.beginPath();ctx.rect(802,220,736,380);ctx.clip();
  box(802,220,736,380,'#6f9fbf');
  const g2=560;
  ctx.beginPath();ctx.moveTo(802,g2);for(let x=802;x<=1100;x+=6)ctx.lineTo(x,g2+4*Math.sin(x*.05+TT*2));ctx.lineTo(1100,600);ctx.lineTo(802,600);ctx.closePath();ctx.fillStyle='#1f7f99';ctx.fill();
  poly([1100,g2,1180,g2-6,1538,g2-6,1538,600,1100,600],'#d8c79c');
  const sa=seg(u,.46,.54);
  for(let i=0;i<60;i++){const ph=(r()+TT*.18)%1,x=820+ph*680,y=g2-20-r()*260+Math.sin(TT+i)*8;alphaDo(sa*(1-ph*.5)*.9,()=>circ(x,y,2.2,'#ffffff'));}
  miniT(1360,g2-6,190,110,TT*1.4);
  if(sa>0)alphaDo(sa,()=>{for(let i=0;i<3;i++){const y=300+i*60,x=860+((TT*80+i*60)%120);arrow(x,y,x+90,y,'rgba(255,255,255,.85)',2.5);}});
  ctx.restore();
  alphaDo(band(u,.5,.8),()=>tag(900,260,'東北季風挾帶鹽霧',{size:16,bg:'#fff'}));
  const MR=[['高防蝕等級塗裝（如 ISO 12944 C5）',.62],['機艙密封、正壓與除濕',.7],['無人機巡檢接閃器與前緣',.78]];
  MR.forEach(([s,t],i)=>alphaDo(seg(u,t,t+.05),()=>{const y=624+i*56;box(824,y,692,46,'rgba(125,255,196,.06)','rgba(125,255,196,.4)',1);box(824,y,6,46,'#7dffc4');wt(844,y+30,s,17,'#fff',600);}));
 }}
]};
