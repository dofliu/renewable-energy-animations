// KITS: marine
/* ================= EP02 地球物理調查 ================= */
const BOULD_X=860;
function svX(u,a,b){return lerp(-260,1700,seg(u,a||0,b||1));}
function towPt(vx,wl,len,depth){return {x:vx-len,y:Math.min(bedY(vx-len)-depth,wl+len*.9)};}
function drawTow(ax,ay,f,col){ctx.beginPath();ctx.moveTo(ax,ay);ctx.quadraticCurveTo(lerp(ax,f.x,.5),lerp(ay,f.y,.15)+30,f.x+14,f.y-2);ctx.strokeStyle=col||'rgba(20,24,28,.85)';ctx.lineWidth=1.3;ctx.stroke();}
function towfish(x,y,col){ctx.save();ctx.translate(x,y);rrp(-16,-4,34,8,4);ctx.fillStyle=col||'#f2c230';ctx.fill();poly([-16,0,-24,-7,-24,7],'#394650');ctx.restore();}
function boulders(){const r=rng(21);for(let i=0;i<7;i++){const x=BOULD_X+(r()-.5)*70,s=4+r()*6;const y=bedY(x);ctx.beginPath();ctx.ellipse(x,y-s*.5,s*1.3,s,0,Math.PI,0);ctx.fillStyle='#6d6862';ctx.fill();}}
function paleo(a){alphaDo(a,()=>{ctx.save();soilRegion();ctx.clip();ctx.beginPath();const x0=700,x1=960;ctx.moveTo(x0,layB(x0,1)+4);for(let x=x0;x<=x1;x+=6){const k=(x-x0)/(x1-x0);ctx.lineTo(x,layB(x,1)+4+62*Math.sin(k*Math.PI));}for(let x=x1;x>=x0;x-=6)ctx.lineTo(x,layB(x,1)+4);ctx.closePath();ctx.fillStyle='#8d7a5d';ctx.fill();ctx.strokeStyle='rgba(40,25,10,.4)';ctx.stroke();ctx.restore();});}
const depthCol=d=>{const k=clamp((d-34)/14);const c=[[230,90,60],[240,200,70],[90,200,150],[40,130,200],[30,60,140]];const i=Math.min(3,Math.floor(k*4)),t=k*4-i;const a=c[i],b=c[i+1];return `rgb(${lerp(a[0],b[0],t)|0},${lerp(a[1],b[1],t)|0},${lerp(a[2],b[2],t)|0})`;};
const bathy=(x,y)=>41+3*Math.sin(x*.045+y*.012)*.6+x*.006-y*.004+2.2*Math.sin(x*.012-y*.02);
/* site plan geometry for shots 1 & 6 */
const SITE={x:180,y:180,w:900,h:600};
const TURB=(()=>{const A=[];for(let r=0;r<4;r++)for(let c=0;c<5;c++)A.push({x:SITE.x+110+c*170+(r%2)*40,y:SITE.y+95+r*140});return A;})();

const EP={no:2,slug:'offshore-wind',seriesName:'離岸風場開發系列',total:13,t:'地球物理調查',en:'Geophysical survey',
lede:'在任何一支樁打下去之前，得先知道海床長什麼樣子、底下埋了什麼。這一集跟著調查船，看多音束測深、側掃聲納、磁力儀與底層剖面儀，如何用聲波與磁場一層層「看穿」海底。',
facts:[['256–512','道','多音束測深儀一次發射的音束數量，扇形掃過海床'],['3–5','倍水深','多音束單趟測線的覆蓋寬度，約為水深的 3 到 5 倍'],['< 0.5','m','側掃聲納可辨識的海床物體尺寸，足以看見岩塊與殘骸'],['1–5','nT','磁力儀可偵測的微小磁場變化，用來找出埋藏的金屬物'],['數十','m','底層剖面儀與高解析震測可看到海床下的地層深度'],['4–6','km/h','調查船施測時的航速，慢而穩定才能得到乾淨資料']],
note:'說明：本集為教育用途示意動畫，儀器外觀、音束數量與地層厚度均經簡化。測線間距、覆蓋寬度與偵測能力依儀器、水深與海況而異，實際調查規劃依各場址的技術規範執行。',
shots:[
/* 1 */{t:'規劃測線',en:'Survey line planning',dur:12,
 d:'調查從一張圖開始。依據預定的風機位置與海纜路由，規劃出平行的主測線，讓每一趟的掃描範圍彼此重疊，不留死角；再加上垂直方向的檢核測線，用來交叉驗證資料品質。調查船像割草機一樣來回航行，範圍可能涵蓋上百平方公里。',
 s:[[0,'依風機預定位置與海纜路由劃出調查範圍'],[.2,'平行主測線來回航行，相鄰測線的掃描範圍互相重疊'],[.6,'加上垂直方向的檢核測線，交叉比對資料品質'],[.82,'海纜路由另設走廊，一路延伸到登陸點']],
 draw(u){
  diagBG();const S=SITE;
  card(S.x,S.y,S.w,S.h,{bg:'rgba(31,127,153,.18)',st:'rgba(125,200,220,.5)',r:4});
  wt(S.x+16,S.y-16,'風場調查範圍（示例 約 100 km²）',18,'rgba(227,236,238,.8)',600);
  // corridor
  poly([S.x+S.w,S.y+S.h*.55,1500,560,1500,640,S.x+S.w,S.y+S.h*.55+60],'rgba(31,127,153,.18)','rgba(125,200,220,.4)',1.2);
  box(1500,420,80,380,'rgba(120,165,87,.5)');wt(1540,400,'陸地',18,'#cfe3c0',700,'center');
  TURB.forEach(t=>{circ(t.x,t.y,7,'#fff');});
  const nL=12,sp=S.w/nL,k=seg(u,.12,.62)*nL;ctx.lineWidth=2;
  let vx=0,vy=0;
  for(let i=0;i<nL;i++){const f=clamp(k-i);if(f<=0)break;const x=S.x+sp*(i+.5),y0=i%2?S.y+S.h:S.y,y1=i%2?S.y:S.y+S.h,ye=lerp(y0,y1,f);
    box(x-sp*.62,Math.min(y0,ye),sp*1.24,Math.abs(ye-y0),'rgba(242,194,48,.10)');ln([x,y0,x,ye],'#f2c230',2);vx=x;vy=ye;}
  if(u>.6){const k2=seg(u,.6,.8)*4;for(let j=0;j<4;j++){const f=clamp(k2-j);if(f<=0)break;const y=S.y+S.h*(j+.5)/4;ln([S.x,y,lerp(S.x,S.x+S.w,f),y],'#7dffc4',2);if(f<1){vx=lerp(S.x,S.x+S.w,f);vy=y;}}}
  if(u>.8){const f=seg(u,.8,.97);const P=[{x:S.x+S.w,y:S.y+S.h*.55+30},{x:1500,y:600}];const q=lerpPt(P[0],P[1],f);ln([P[0].x,P[0].y,q.x,q.y],'#ff9d7a',2.4);vx=q.x;vy=q.y;}
  if(u>.12){circ(vx,vy,9,'#e8572a','#fff',2);}
  // legend
  const L=[['#fff','預定風機位置'],['#f2c230','主測線'],['#7dffc4','檢核測線'],['#ff9d7a','海纜路由測線']];
  card(1120,180,380,190,{bg:'rgba(7,27,39,.8)'});L.forEach((l,i)=>{const y=222+i*38;ln([1144,y,1180,y],l[0],4);wt(1194,y+7,l[1],19,'#fff',500);});
  alphaDo(band(u,.25,.6),()=>{tag(S.x+sp*2.5,S.y+S.h+36,'掃描帶重疊 約 20–50%',{align:'center',size:18});});
 }},
/* 2 */{t:'多音束測深 MBES',en:'Multibeam echosounder',dur:13,
 d:'多音束測深儀裝在船底，每秒發出數次扇形聲波，一次就有數百道音束打到海床。儀器量測每道聲波來回的時間，配合海水聲速剖面與船的姿態、定位資料，換算出每個點的精確水深。一趟航行就能掃出一條寬度約為水深 3 到 5 倍的地形帶，拼起來就是整片海床的立體地圖，連沙波起伏都清清楚楚。',
 s:[[0,'從船尾方向看：換能器向下發出扇形聲波'],[.22,'數百道音束同時打到海床，量測每道聲波的來回時間'],[.45,'以聲速剖面、船體姿態與定位資料校正，換算成水深'],[.66,'一條條掃描帶拼接成高解析的海床地形圖']],
 draw(u){
  diagBG();
  const sy=250,cx=440,bed=x=>690+18*Math.sin((x-cx)*.03+TT*.0)+ (x-cx)*.05;
  // water column
  const g=ctx.createLinearGradient(0,sy,0,780);g.addColorStop(0,'rgba(59,147,187,.55)');g.addColorStop(1,'rgba(11,56,88,.7)');ctx.fillStyle=g;ctx.fillRect(40,sy,800,560);
  ctx.beginPath();ctx.moveTo(40,bed(40));for(let x=40;x<=840;x+=6)ctx.lineTo(x,bed(x));ctx.lineTo(840,810);ctx.lineTo(40,810);ctx.closePath();ctx.fillStyle='#b59a6a';ctx.fill();
  ln([40,sy,840,sy],'rgba(255,255,255,.8)',2);
  // vessel rear view
  const roll=Math.sin(TT*1.3)*.03;ctx.save();ctx.translate(cx,sy);ctx.rotate(roll);poly([-70,-30,70,-30,56,18,-56,18],'#f4f6f7','#8a99a3',1.4);box(-40,-80,80,50,'#f4f6f7');wins(-32,-72,6,11,6,6);box(-10,-110,20,30,'#dfe5e8');box(-8,18,16,10,'#2c5f8a');ctx.restore();
  const tx=cx,ty=sy+28,fan=seg(u,.05,.2);
  const hit=a=>{let t=0;const dx=Math.sin(a),dy=Math.cos(a);while(t<900){const x=tx+dx*t,y=ty+dy*t;if(y>=bed(x))return {x,y,t};t+=3;}return {x:tx+dx*t,y:ty+dy*t,t};};
  const N=33,ph=(TT*1.6)%1;const H=[];
  for(let i=0;i<N;i++){const a=roll+lerp(-1.13,1.13,i/(N-1))*fan;const p=hit(a);H.push(p);ln([tx,ty,p.x,p.y],'rgba(160,255,215,.18)',1);}
  if(fan>.2){ctx.beginPath();ctx.arc(tx,ty,ph*420,Math.PI/2-1.13,Math.PI/2+1.13);ctx.strokeStyle=`rgba(183,255,226,${.8*(1-ph)})`;ctx.lineWidth=2.4;ctx.stroke();}
  if(u>.2)H.forEach((p,i)=>circ(p.x,p.y,3.2,depthCol(34+(p.y-sy)/560*40*.35+ (p.y-640)/12)));
  alphaDo(seg(u,.2,.26),()=>{const a=H[0],b=H[N-1];ln([a.x,a.y+36,b.x,b.y+36],'#f2c230',1.6);ln([a.x,a.y+26,a.x,a.y+46],'#f2c230',1.6);ln([b.x,b.y+26,b.x,b.y+46],'#f2c230',1.6);});
  alphaDo(seg(u,.2,.26),()=>wt(cx,782,'覆蓋寬度 ≈ 水深 × 4',19,'#f2c230',700,'center'));
  alphaDo(band(u,.45,1),()=>{box(80,sy+30,10,300,'rgba(255,255,255,.2)');ln([85,sy+30,85,sy+330],'#7dffc4',2);wt(100,sy+60,'聲速剖面',17,'#7dffc4',600);wt(100,sy+84,'（溫度、鹽度會改變聲速）',15,'rgba(227,236,238,.7)',500);
    tag(cx+90,sy-90,'姿態感測器＋衛星定位',{size:16});});
  // map
  const mx=900,my=170,mw=640,mh=610;card(mx,my,mw,mh,{bg:'rgba(7,27,39,.8)'});wt(mx+20,my+34,'水深地形圖（上視）',20,'#f2c230',700);
  const px=mx+20,py=my+52,pw=mw-40,ph2=mh-120,cs=10,sw=16;const lines=4,p=seg(u,.22,.95)*lines;
  for(let l=0;l<lines;l++){const f=clamp(p-l);if(f<=0)break;const c0=l*sw*cs*.9;const rows=Math.floor(ph2/cs),nr=Math.floor(rows*f);
    for(let r=0;r<nr;r++){const rr=l%2?rows-1-r:r;for(let c=0;c<sw;c++){const x=px+c0+c*cs;if(x>px+pw-cs)continue;ctx.fillStyle=depthCol(bathy(x,py+rr*cs));ctx.fillRect(x,py+rr*cs,cs,cs);}}
    if(f<1){const rr=l%2?rows-1-nr:nr;circ(px+c0+sw*cs*.6,py+rr*cs,8,'#fff','#13232e',2);}}
  const lg=my+mh-44;for(let i=0;i<20;i++){ctx.fillStyle=depthCol(34+i*.7);ctx.fillRect(mx+60+i*14,lg,14,14);}wt(mx+54,lg+13,'淺',16,'#fff',600,'right');wt(mx+344,lg+13,'深',16,'#fff',600);wt(mx+mw-20,lg+13,'水深 34–48 m',16,'rgba(227,236,238,.8)',600,'right');
 }},
/* 3 */{t:'側掃聲納 SSS',en:'Side-scan sonar',dur:13,side:true,
 d:'側掃聲納裝在一條拖曳在船後方、貼近海床航行的「拖魚」上，向左右兩側斜射扇形聲波。凸出海床的物體會產生強烈回波，後方則留下沒有回聲的「聲影」，長度可以推算物體高度。畫面逐行累積，形成像黑白照片般的海床影像，沉船、岩塊、廢棄漁網、錨痕都無所遁形。',
 s:[[0,'調查船後方拖曳側掃聲納拖魚，距海床約 10–20 公尺'],[.2,'拖魚向兩側發射扇形聲波，逐行累積成海床影像'],[.45,'凸起物回波強烈，後方留下聲影：發現沉船殘骸'],[.72,'岩塊群與沉船位置被標記，列為設計時的避讓目標']],
 cam:u=>({x:clamp(svX(u,.02,.98)-160,260,1100),y:590,s:1.35}),
 draw(u){
  drawWreck(0);boulders();
  const vx=svX(u,.02,.98),wl=wlAt(vx+85,.7);const f=towPt(vx,wl,230,24);
  drawTow(vx+10,wl-44,f);towfish(f.x,f.y);
  vsl(vx,170,false,{damp:.7},vSurvey);
  const sa=seg(u,.12,.18);alphaDo(sa,()=>{for(let i=0;i<3;i++){const k=(TT*1.5+i/3)%1;ctx.beginPath();ctx.ellipse(f.x,f.y,20+k*80,6+k*22,0,0,TAU);ctx.strokeStyle=`rgba(183,255,226,${.7*(1-k)})`;ctx.lineWidth=1.6;ctx.stroke();}});
  const nearW=Math.abs(f.x-WRECK_X)<80,nearB=Math.abs(f.x-BOULD_X)<80,pastW=f.x>WRECK_X,pastB=f.x>BOULD_X;
  if(pastW)ring(WRECK_X,bedY(WRECK_X)-6,32+Math.sin(TT*6)*3,'rgba(232,87,42,.85)',2);
  if(pastB)ring(BOULD_X,bedY(BOULD_X)-5,44+Math.sin(TT*6)*3,'rgba(232,87,42,.85)',2);
  lab(f.x,f.y,'側掃聲納拖魚',{dx:-40,dy:-50,a:band(u,.04,.4)});
  lab(WRECK_X,bedY(WRECK_X)-12,'沉船殘骸',{dx:30,dy:-70,st:'w',a:pastW?1:0});
  lab(BOULD_X,bedY(BOULD_X)-8,'岩塊群',{dx:40,dy:-70,st:'w',a:pastB?1:0});
 },
 hud(u){hudPanel(250,330,'側掃聲納影像（瀑布圖）',seg(u,.16,.22),(w,h)=>{
  const vx=svX(u,.02,.98),fx=vx-230,x0=14,y0=40,iw=w-28,ih=270,rows=54,cols=40,rw=ih/rows,cw=iw/cols;
  for(let r=0;r<rows;r++){const ax=fx-r*9;for(let c=0;c<cols;c++){const s=(c-cols/2)/(cols/2),as=Math.abs(s);let v=as<.06?.05:.25+.35*hn(Math.round(ax/9),c)+.12*Math.sin(ax*.05+c*.4);
      const dW=Math.abs(ax-WRECK_X);if(dW<34&&s>.18&&s<.36)v=.95;if(dW<34&&s>=.36&&s<.62)v=.03;
      const dB=Math.abs(ax-BOULD_X);if(dB<40&&s<-.2&&s>-.5&&hn(Math.round(ax/7),c*3)>.55){v=.9;}if(dB<40&&s<=-.5&&s>-.62)v=.05;
      v*=clamp(1-as*.35);const g=Math.round(clamp(v)*235);ctx.fillStyle=`rgb(${g},${Math.round(g*.86)},${Math.round(g*.55)})`;ctx.fillRect(x0+c*cw,y0+r*rw,cw+.5,rw+.5);}}
  htext(x0,y0+ih+18,'左舷',11,'rgba(227,236,238,.7)');htext(x0+iw,y0+ih+18,'右舷',11,'rgba(227,236,238,.7)',500,FONT,'right');htext(x0+iw/2,y0+ih+18,'拖魚正下方',11,'rgba(227,236,238,.7)',500,FONT,'center');
 });}},
/* 4 */{t:'磁力儀搜尋未爆彈',en:'Magnetometer and UXO',dur:13,side:true,
 d:'台灣周邊海域曾是二戰時期的戰場，海床下可能埋有未爆彈（UXO）。磁力儀被拖曳到貼近海床的位置，偵測地球磁場的微小擾動：鐵製物體會讓讀數出現一個尖峰。調查人員把所有異常點列表，交由遙控無人潛水器（ROV）目視確認；確認是未爆彈後，由專業團隊移除，或在設計上劃出避讓區。',
 s:[[0,'磁力儀拖曳在海床上方數公尺，持續記錄磁場強度'],[.3,'經過埋藏的鐵製物體時，讀數出現明顯尖峰'],[.52,'標記磁力異常點，派遙控無人潛水器（ROV）下潛確認'],[.78,'確認為未爆彈：劃設避讓區，或由專業團隊移除']],
 cam:u=>({x:clamp(Math.min(svX(u,.02,.62),UXO_X+320)-150,300,900),y:600,s:1.4}),
 draw(u){
  drawUXO(u>.33?1:0,1);
  let vx=svX(u,.02,.62);vx=Math.min(vx,UXO_X+320);if(u>.84)vx=lerp(UXO_X+320,1700,easeIn(seg(u,.84,1)));
  const wl=wlAt(vx+85,.7),f=towPt(vx,wl,200,8);drawTow(vx+10,wl-44,f);towfish(f.x,f.y,'#e8572a');
  vsl(vx,170,false,{damp:.7},vSurvey);
  if(u>.52&&u<.86){const k=ease(seg(u,.52,.66)),rx=vx+80,ry=lerp(wl+10,bedY(UXO_X+30)-2,k),rxx=lerp(rx,UXO_X+34,k);ln([rx,wl,rxx,ry-20],'#f2c230',1.2);rov(rxx,ry,TT,false);
    if(k>=1){const L=(TT*2)%1;poly([rxx-12,ry-12,UXO_X-20,bedY(UXO_X)-4+L*0,UXO_X+10,bedY(UXO_X)],'rgba(255,240,180,.18)');}}
  if(u>.76){alphaDo(seg(u,.76,.8),()=>{ctx.setLineDash([6,5]);ring(UXO_X,bedY(UXO_X)-2,70,'#e8572a',2);ctx.setLineDash([]);});}
  lab(f.x,f.y,'磁力儀',{dx:-30,dy:-44,a:band(u,.04,.3)});
  lab(UXO_X,bedY(UXO_X)-4,'磁力異常點',{dx:-80,dy:-60,st:'w',a:band(u,.35,.76)});
  lab(UXO_X,bedY(UXO_X)-70,'避讓區',{dx:60,dy:-40,st:'w',a:seg(u,.78,.82)});
 },
 hud(u){hudPanel(260,200,'磁場強度（nT）',seg(u,.06,.12),(w)=>{
  const vx=Math.min(svX(u,.02,.62),UXO_X+320),fx=vx-200,x0=16,y0=40,cw=w-32,ch=120,xa=fx-500;
  ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=1;ctx.strokeRect(x0,y0,cw,ch);
  const val=x=>{const d=x-UXO_X;return 30*Math.exp(-d*d/900)*(1)-14*Math.exp(-Math.pow(d-26,2)/500)+2.2*hn(Math.round(x/6),3)-1.1;};
  ctx.beginPath();for(let i=0;i<=cw;i+=2){const x=xa+i/cw*500;if(x>fx)break;const y=y0+ch*.62-val(x)*2.4;i?ctx.lineTo(x0+i,y):ctx.moveTo(x0+i,y);}ctx.strokeStyle='#7dffc4';ctx.lineWidth=2;ctx.stroke();
  htext(x0+4,y0+ch+22,'背景值 約 44,000 nT，圖中顯示偏差量',11,'rgba(227,236,238,.7)');
  const pk=val(UXO_X);if(fx>UXO_X+10){const px=x0+(UXO_X-xa)/500*cw;if(px>x0){circ(px,y0+ch*.62-pk*2.4,5,'#e8572a');htext(px+8,y0+22,'+'+pk.toFixed(0)+' nT',15,'#e8572a',700,COND);}}
 });}},
/* 5 */{t:'看穿海床：淺層剖面',en:'Sub-bottom profiling',dur:13,side:true,
 d:'前面的儀器只看得到海床表面。底層剖面儀（SBP）與高解析震測（UHRS）發出頻率較低的聲波，能穿進海床下方數公尺到上百公尺；聲波每遇到一個性質不同的地層介面就反射一次，排列起來就是一張地層剖面圖。它能找出被泥沙掩埋的古河道、軟弱黏土層與淺層氣體，這些都會影響樁的設計與打樁難度。',
 s:[[0,'調查船以低頻聲波脈衝向下穿透海床'],[.22,'聲波在每一個地層介面反射，回波被記錄下來'],[.45,'回波排列成地層剖面圖，看見細砂、黏土與緊密砂層的分界'],[.68,'發現被掩埋的古河道：軟弱沉積物會影響基礎設計']],
 cam:u=>({x:clamp(svX(u,.03,.95)+60,400,1060),y:650,s:1.2}),
 draw(u){paleo(1);},
 fx(u){
  const vx=svX(u,.03,.95),wl=wlAt(vx+85,.7);vsl(vx,170,false,{damp:.7},vSurvey);
  const sx=vx+120,sy=wl+14,k=(TT*1.2)%1;
  ctx.save();ctx.beginPath();ctx.rect(sx-200,sy,400,420);ctx.clip();ctx.beginPath();ctx.arc(sx,sy,k*420,0,Math.PI);ctx.strokeStyle=`rgba(183,255,226,${.8*(1-k)})`;ctx.lineWidth=2.4;ctx.stroke();ctx.restore();
  for(let i=0;i<3;i++){const y=layB(sx,i+1);const inCh=sx>700&&sx<960&&i===0;const yy=inCh?layB(sx,1)+4+62*Math.sin((sx-700)/260*Math.PI):y;ln([sx-30,yy,sx+30,yy],`rgba(255,240,150,${.9-.2*i})`,2.2);}
  ln([sx,sy,sx,bedY(sx)],'rgba(183,255,226,.3)',1);
  lab(760,layB(830,1)+40,'被掩埋的古河道',{dx:-60,dy:80,st:'w',a:seg(u,.66,.72)*(vx>620?1:0)});
  lab(sx,sy,'底層剖面儀',{dx:60,dy:-80,a:band(u,.03,.3)});
 },
 hud(u){hudPanel(270,230,'地層剖面（SBP）',seg(u,.4,.46),(w)=>{
  const vx=svX(u,.03,.95),sx=vx+120,x0=14,y0=40,cw=w-28,ch=160,xa=0,xb=1300;
  ctx.fillStyle='#1b1e20';ctx.fillRect(x0,y0,cw,ch);
  const X=x=>x0+(x-xa)/(xb-xa)*cw,Y=d=>y0+10+d*.8;
  for(let i=0;i<4;i++){ctx.beginPath();let st=false;for(let x=xa;x<=Math.min(sx,xb);x+=10){let d=i===0?0:layB(x,i)-bedY(x);d+= bedY(x)-690;const y=Y(d);st?ctx.lineTo(X(x),y):ctx.moveTo(X(x),y);st=true;}ctx.strokeStyle=['#fff','#f2d98a','#e8b86a','#c9895a'][i];ctx.lineWidth=i?1.6:2.2;ctx.stroke();}
  if(sx>700){ctx.beginPath();let st=false;for(let x=700;x<=Math.min(sx,960);x+=8){const d=layB(x,1)+4+62*Math.sin((x-700)/260*Math.PI)-690;st?ctx.lineTo(X(x),Y(d)):ctx.moveTo(X(x),Y(d));st=true;}ctx.strokeStyle='#ff8a60';ctx.lineWidth=2;ctx.stroke();}
  htext(x0,y0+ch+20,'橫軸：航行距離　縱軸：海床下深度',11,'rgba(227,236,238,.7)');
 });}},
/* 6 */{t:'整合成海床風險圖',en:'Integrated hazard map',dur:12,
 d:'所有調查成果被整合進同一張地理資訊圖，並和後續的地質鑽探資料結合成「地盤模型」。設計團隊據此微調每一部風機的位置、讓海纜繞過沉船與未爆彈避讓區，也決定哪些機位需要額外鑽探。調查做得越完整，施工階段遇到意外、延誤與追加費用的風險就越低。',
 s:[[0,'把水深、影像、磁力與地層資料疊合在同一張圖上'],[.28,'標出沉船、未爆彈、岩塊群與古河道等風險區'],[.5,'落在古河道上的機位微調到較穩定的位置'],[.72,'海纜路由繞開沉船與避讓區，完成初步配置']],
 draw(u){
  diagBG();const S=SITE;
  for(let y=S.y;y<S.y+S.h;y+=20)for(let x=S.x;x<S.x+S.w;x+=20){ctx.fillStyle=depthCol(bathy(x*.7,y*.7));ctx.globalAlpha=.55;ctx.fillRect(x,y,20,20);}ctx.globalAlpha=1;
  ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1.4;ctx.strokeRect(S.x,S.y,S.w,S.h);
  const hz=seg(u,.25,.4);
  const ch=[[S.x+380,S.y],[S.x+470,S.y+200],[S.x+420,S.y+400],[S.x+520,S.y+S.h]];
  alphaDo(hz,()=>{ctx.beginPath();ctx.moveTo(ch[0][0],ch[0][1]);ctx.bezierCurveTo(ch[1][0],ch[1][1],ch[2][0],ch[2][1],ch[3][0],ch[3][1]);ctx.strokeStyle='rgba(141,122,93,.85)';ctx.lineWidth=46;ctx.stroke();ctx.strokeStyle='rgba(255,138,96,.9)';ctx.lineWidth=2;ctx.setLineDash([8,6]);ctx.stroke();ctx.setLineDash([]);
   tag(S.x+560,S.y+170,'古河道',{bg:'#8d7a5d',fg:'#fff',size:17});
   const W1={x:S.x+700,y:S.y+300},U1={x:S.x+250,y:S.y+470},B1={x:S.x+800,y:S.y+520};
   ring(W1.x,W1.y,30,'#e8572a',3);tag(W1.x+36,W1.y,'沉船',{bg:'#e8572a',fg:'#fff',size:17});
   ctx.setLineDash([6,5]);ring(U1.x,U1.y,44,'#e8572a',2.5);ctx.setLineDash([]);circ(U1.x,U1.y,6,'#e8572a');tag(U1.x+50,U1.y,'未爆彈避讓區',{bg:'#e8572a',fg:'#fff',size:17});
   const r=rng(3);for(let i=0;i<14;i++)circ(B1.x+(r()-.5)*70,B1.y+(r()-.5)*50,4,'#3d3a36');tag(B1.x-40,B1.y+48,'岩塊群',{bg:'#6d6862',fg:'#fff',size:17});});
  const mv=ease(seg(u,.5,.64));
  TURB.forEach((t,i)=>{let x=t.x,y=t.y;if(i===7){x=lerp(t.x,t.x+95,mv);if(mv>0&&mv<1||u>.5){ctx.setLineDash([4,4]);ring(t.x,t.y,10,'rgba(255,255,255,.6)',1.5);ctx.setLineDash([]);}}
    circ(x,y,9,i===7&&u>.5?'#f2c230':'#fff','#13232e',2);});
  if(u>.5)lab(TURB[7].x+95,TURB[7].y,'機位微調',{dx:40,dy:-50,st:'s',a:band(u,.52,1)});
  const ck=seg(u,.72,.9);if(ck>0){const W1={x:S.x+700,y:S.y+300};const P=[{x:TURB[8].x,y:TURB[8].y},{x:W1.x-10,y:W1.y-60},{x:W1.x+70,y:W1.y-40},{x:S.x+S.w,y:S.y+330}];
    pathLine(partial(P,ck),'#f2c230',4);ctx.setLineDash([6,6]);ln([TURB[8].x,TURB[8].y,S.x+S.w,S.y+300],'rgba(255,255,255,.35)',2);ctx.setLineDash([]);
    lab(W1.x+40,W1.y-50,'海纜繞過沉船',{dx:60,dy:-60,st:'s',a:seg(u,.84,.88)});}
  card(1120,180,380,300,{bg:'rgba(7,27,39,.8)'});wt(1144,220,'圖層',20,'#f2c230',700);
  [['水深地形（MBES）',.02],['海床物體（SSS）',.12],['磁力異常（MAG）',.18],['淺層地層（SBP）',.24],['風機位置與海纜',.5]].forEach((l,i)=>{const a=seg(u,l[1],l[1]+.04);circ(1152,256+i*44,7,a>0?'#7dffc4':'rgba(255,255,255,.2)');wt(1170,263+i*44,l[0],19,a>0?'#fff':'rgba(255,255,255,.4)',500);});
 }}
]};
