// KITS: marine
/* ================= EP34 連續作業與機艙待命：一次維修戰役的天候窗口 ================= */
const TA='#ff9d7a',TB='#f2c230',TC='#7dffc4',PB='#b37cff',SEAB='#58b8d0',WRN='#e8572a';
const TEAM=[['小組 A',TA,'A04'],['小組 B',PB,'A05'],['小組 C',TC,'A06']];
function clk(h){const tm=Math.round(h*60),hh=Math.floor(tm/60)%24,mm=tm%60;return (hh<10?'0':'')+hh+':'+(mm<10?'0':'')+mm;}
function iv(K,t){if(t<=K[0][0])return K[0][1];for(let i=0;i<K.length-1;i++){if(t<=K[i+1][0]){let f=(t-K[i][0])/(K[i+1][0]-K[i][0]);f=(1-Math.cos(Math.PI*f))/2;return lerp(K[i][1],K[i+1][1],f);}}return K[K.length-1][1];}
/* 預報（典型範例）：清晨版與中午更新版，時間軸為小時，24 以上代表隔天 */
const K06=[[6,.9],[9,.95],[12,1.0],[15,1.1],[18,1.3],[21,1.5],[24,1.8],[28,2.1],[34,1.9]];
const KNW=[[6,.9],[10,1.0],[12,1.1],[15,1.5],[18,2.1],[22,2.7],[25,2.6],[28,2.0],[31,1.35],[34,1.1]];
const WNW=[[6,8],[12,10],[15,13],[18,17],[22,20],[25,19],[28,15],[31,11],[34,9]];

/* ---------- 可變海況的側視世界 ---------- */
let SA=0,DK=0,RN=0;
function sY(x){return surf(x)+SA*(Math.sin(x*.011-TT*1.25)+.5*Math.sin(x*.027+TT*.8+1))*clamp((WATER_END-x)/200);}
function stormBase(dk,a,rain){SA=a;DK=dk;RN=rain||0;
  drawSky();box(VX0,SEA-2,VX1-VX0,60,'#d7e6ec');
  if(dk>0)alphaDo(dk,()=>{box(VX0,VY0,VX1-VX0,SEA+60-VY0,'rgba(38,48,58,.62)');const R=rng(4);
    for(let i=0;i<14;i++){const sp=12+R()*10,x=((R()*2600+TT*sp)%2600)-500,y=10+R()*190,s=.8+R()*1.2;
      ctx.beginPath();[[0,0,40],[40,-14,48],[86,-4,38],[-34,8,28]].forEach(([dx,dy,r])=>{ctx.moveTo(x+dx*s+r*s,y+dy*s);ctx.arc(x+dx*s,y+dy*s,r*s,0,TAU);});ctx.fillStyle='rgba(70,80,92,.85)';ctx.fill();}});
  const xe=Math.min(VX1,WATER_END+40);
  const g=ctx.createLinearGradient(0,SEA,0,780);g.addColorStop(0,dk>.5?'#2f6f8f':'#3b93bb');g.addColorStop(.45,'#1d6690');g.addColorStop(1,'#0b3858');
  ctx.beginPath();ctx.moveTo(VX0,sY(VX0));for(let x=VX0;x<=xe;x+=6)ctx.lineTo(x,sY(x));ctx.lineTo(xe,VY1+10);ctx.lineTo(VX0,VY1+10);ctx.closePath();ctx.fillStyle=g;ctx.fill();
  drawSoil();}
function stormEnd(){soilVeil(VX0,VX1,.24);
  const xe=Math.min(VX1,WATER_END);ctx.beginPath();ctx.moveTo(VX0,sY(VX0));for(let x=VX0;x<=xe;x+=6)ctx.lineTo(x,sY(x));ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=1.6;ctx.stroke();
  if(SA>2.5){const a=clamp((SA-2.5)/5);for(let x=Math.floor(VX0/6)*6;x<=xe;x+=6){const y=sY(x);if(y<sY(x-6)&&y<=sY(x+6))alphaDo(a,()=>{ln([x-14,y+1,x,y-2,x+12,y+2],'rgba(255,255,255,.95)',2.4);circ(x+6,y-3,2.5,'rgba(255,255,255,.8)');});}}}
function rainFx(){if(RN<=0)return;const R=rng(9);alphaDo(RN*.6,()=>{ctx.strokeStyle='rgba(220,232,240,.7)';ctx.lineWidth=1.2;ctx.beginPath();
  for(let i=0;i<260;i++){const x0=R()*2200-300,y0=R()*1200;const y=((y0+TT*620)%1200)-150,x=x0-((y0+TT*620)%1200)*.25+VX0*.0;if(x<VX0-40||x>VX1+40)continue;ctx.moveTo(x,y);ctx.lineTo(x-6,y+22);}ctx.stroke();});}
function ctvRide(x,flip,tk){const len=77,d=flip?-1:1,cx=x+d*len/2,wl=sY(cx),tilt=Math.atan((sY(cx+30)-sY(cx-30))/60)*(tk===undefined?.8:tk);
  ctx.save();ctx.translate(x,wl);ctx.rotate(tilt);if(flip)ctx.scale(-1,1);vCTV();ctx.restore();return wl;}
function turb34(cx,ang,cut){const yb=bedY(cx)+130;drawPile(cx,yb,Math.PI/2,yb-PILE_TOP,PILE_W);drawTP(cx,TP_BOT);
  for(let k=0;k<3;k++)drawTowerSec(cx,TP_TOP-k*HS,k);drawNacelle(cx,TW_TOP,cut||0,true);drawRotor(cx-44,TW_TOP-20,ang,3);}
function far34(x,s,ang){const h=150*s,hy=SEA-h;ln([x,SEA,x,hy],'rgba(235,240,243,.85)',3*s);
  for(let i=0;i<3;i++){const a=ang-i*TAU/3;ln([x,hy,x+Math.cos(a)*70*s,hy+Math.sin(a)*70*s],'rgba(245,247,248,.9)',2.2*s);}circ(x,hy,3*s,'#eef2f4');}
function port34(){const x0=1440,xe=VX1+30;if(xe<x0)return;
  box(x0,452,xe-x0,120,'#9aa3a8');box(x0,452,xe-x0,5,'#6f7a80');for(let x=x0+8;x<xe;x+=40)box(x,458,7,18,'#2b3137');
  superBlock(1478,386,64,66,5,'#e9edef');box(1474,380,72,7,'#6f7a80');mast(1530,380,16);
  box(1560,404,110,48,'#c7cfd3');poly([1556,404,1615,388,1674,404],'#8e9aa1');for(let i=0;i<3;i++)box(1572+i*32,426,22,26,'#5d6b74');}
const LAD=TX-33.5,PLAT=TP_TOP-3,CTVX=TX-114;
function tech(x,y,col,clip){person(x,y,col,1.1);if(clip)box(x-1.6,y-9,3.2,3,'#f2c230');}
/* 機艙內的人與燈光 */
function nacPeople(n,act,sit){const ax=TX,ay=TW_TOP;
  alphaDo(.35,()=>{const rg=ctx.createRadialGradient(ax+14,ay-22,2,ax+14,ay-22,40);rg.addColorStop(0,'rgba(255,214,140,.8)');rg.addColorStop(1,'rgba(255,214,140,0)');ctx.fillStyle=rg;ctx.fillRect(ax-26,ay-34,84,27);});
  const X=[ax-2,ax+16,ax+38,ax+50];for(let i=0;i<n;i++){const y=ay-8+(sit?2:0);person(X[i],y,TA,1.1);
   if(act){const a=TT*4+i*2;ln([X[i]+2,y-6,X[i]+2+5*Math.cos(a),y-6+3*Math.sin(a)],'#e9edef',1);}}}
function radio(x,y,a){if(a<=0)return;for(let k=0;k<3;k++){const p=(TT*.6+k/3)%1;alphaDo(a*(1-p),()=>{ctx.beginPath();ctx.arc(x,y,6+p*60,-Math.PI*.45,Math.PI*.05);ctx.strokeStyle='#7dffc4';ctx.lineWidth=1.6;ctx.stroke();});}}
/* 俯視風場 */
const MAPT=(()=>{const a=[];for(let r=0;r<3;r++)for(let c=0;c<6;c++)a.push({id:'A'+String(r*6+c+1).padStart(2,'0'),x:130+c*150+(r%2)*55,y:280+r*180});return a;})();
const mapPos=id=>MAPT.find(t=>t.id===id);
function ctvTop(x,y,ang,s){ctx.save();ctx.translate(x,y);ctx.rotate(ang);ctx.scale(s||1,s||1);poly([0,0,-10,-12,-60,-12,-60,12,-10,12],'#f2c230','rgba(0,0,0,.4)',1.5);box(-44,-8,22,16,'#e9edef');ctx.restore();}
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function hrLabels(c,hs){hs.forEach(h=>wt(c.X(h),c.py+c.ph+22,clk(h),16,'rgba(227,236,238,.75)',600,'center',COND));}
function hsCurve(c,K,f,col,dash,x0,x1){const P=[];const n=Math.max(2,Math.round(80*f));for(let i=0;i<=n;i++){const t=lerp(x0,lerp(x0,x1,f),i/n);P.push({x:c.X(t),y:c.Y(iv(K,t))});}if(dash)ctx.setLineDash([9,7]);pathLine(P,col,3.5);ctx.setLineDash([]);}
function limitLine(c,v,t,a){if(a<=0)return;alphaDo(a,()=>{ctx.setLineDash([8,6]);ln([c.px,c.Y(v),c.px+c.pw,c.Y(v)],WRN,2.2);ctx.setLineDash([]);wt(c.px+c.pw-8,c.Y(v)-10,t,17,'#ff8a60',700,'right');});}

const EP={no:34,slug:'offshore-wind',seriesName:'離岸風場開發系列',t:'連續作業中的天候變化與機艙待命',en:'Weather turns mid-campaign: waiting it out in the nacelle',
lede:'離岸運維常以「維修戰役」的方式進行：一艘人員運輸船載著幾個小組，連續幾天依序維修不同機組。這一集跟著一天的派工，從清晨送人登塔、預報更新、和浪高賽跑接回人員，到一個小組來不及撤離、在機艙裡度過風雨夜，隔天清晨才搭船回程。',
facts:[['約 1.5','m','人員運輸船船首頂靠登塔的典型示性波高上限'],['12','人','一艘人員運輸船常見的技術人員載客數'],['約 18','小時','國外案例：4 名技術人員因海況轉壞受困風機的時間'],['每座','風機','國外風場在每座風機備有緊急物資桶，存放冷凍乾燥食物與飲水'],['24','節','台中港運維人員運輸船的航速'],['35–60','km','彰化外海風場的離岸距離']],
note:'說明：本集為教育用途示意動畫，船舶、風機與海況比例經過壓縮，劇情為虛構的典型情境，不代表任何特定風場。人員運輸船登塔約 1.5 m 示性波高為業界常用典型值，與本系列第 15、26、33 集一致；每艘人員運輸船載約 12 名技術人員為常見規格；台中港運維人員運輸船 24 節取自台電與台中港務公司報導；彰化風場離岸約 35–60 km 取自開發商公開報導。受困 18 小時案例取自英國 Energy Institute 安全案例（技術人員未確認過夜物資、應變計畫未考慮惡劣天氣下吊運物資的困難）；風機內備有緊急物資桶（冷凍乾燥食物、飲水、睡袋等）參考 Vattenfall DanTysk 風場與風機製造商資料，實際內容依業主與製造商而異。預報曲線、時刻、工時、待命時數與 HUD 數值皆為典型範例；實際作業依業主程序、船長與運維主管判斷。',
base:u=>stormBase(0,0),end:()=>stormEnd(),
shots:[
/* 1 */{t:'三天的維修戰役',en:'A three-day maintenance campaign',dur:16,
 d:'離岸風場的定期維護，常以「維修戰役」的方式安排：同一段好天氣裡，連續幾天、一座接一座地完成多台機組的工作。這個例子是三天維修九座風機，今天是第二天，一艘人員運輸船載著三個小組，分別到 A04、A05、A06 進行齒輪箱、偏航系統與葉片螺栓的檢修。清晨六點的預報顯示，示性波高要到晚上九點左右才會接近 1.5 公尺的登塔上限，看起來是完整的一天。',
 s:[[0,'定期維護常排成連續幾天的維修戰役'],[.26,'今天是第二天，三個小組各負責一座風機'],[.52,'一艘船清晨送人，傍晚再一一接回'],[.76,'清晨的預報看來，窗口可以撐到晚上']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,1000,430,{title:'第 2 天的派工計畫（典型範例）',x0:6,x1:20,y0:0,y1:4,xt:[],yt:[],pl:170,pt:66,gx:7,gy:0});hrLabels(c,[6,8,10,12,14,16,18,20]);
  const rh=c.ph/4,ry=i=>c.py+(i+.5)*rh;
  wt(c.px-14,ry(0)+7,'人員運輸船',18,'#fff',700,'right');
  const CT=[[6,7.5,SEAB,'出港'],[7.5,8.5,'#7dc8dc',''],[8.5,16,'rgba(227,236,238,.25)','場內待命'],[16,17.5,'#7dc8dc',''],[17.5,19,SEAB,'返航']];
  CT.forEach(([a,b,col,t],i)=>{const k=seg(u,.04+i*.03,.08+i*.03);if(k<=0)return;alphaDo(k,()=>{box(c.X(a),ry(0)-18,c.X(b)-c.X(a),36,col);if(t)wt((c.X(a)+c.X(b))/2,ry(0)+6,t,16,'#13232e',700,'center');});});
  const JB=[['齒輪箱檢修',8,16.2],['偏航系統檢查',8.4,15.8],['葉片螺栓檢查',8.7,15.5]];
  TEAM.forEach(([n,col,id],i)=>{const y=ry(i+1),k=ease(seg(u,.24+i*.07,.34+i*.07));wt(c.px-14,y+7,n,18,col,700,'right');
   if(k>0){const [jn,a,b]=JB[i];box(c.X(a),y-18,(c.X(b)-c.X(a))*k,36,col);alphaDo(seg(u,.3+i*.07,.36+i*.07),()=>{wt(c.X(a)+10,y+7,id,17,'#13232e',800,'left',COND);wt(c.X(a)+58,y+6,jn,16,'#13232e',700);});}});
  card(1100,150,440,430,{bg:'rgba(7,27,39,.8)'});wt(1124,196,'九座風機、三天完成',20,'#f2c230',700);
  const D=[['第 1 天','A01–A03','已完成',TC],['第 2 天','A04–A06','今天',TB],['第 3 天','A07–A09','待排','rgba(227,236,238,.6)']];
  D.forEach(([d,ids,st,col],i)=>alphaDo(seg(u,.06+i*.06,.12+i*.06),()=>{const y=226+i*112;card(1124,y,392,92,{bg:'rgba(255,255,255,.04)',st:i===1?TB:'rgba(255,255,255,.14)'});
   wt(1146,y+38,d,19,'#fff',700);wt(1146,y+72,ids,22,col,700,'left',COND);tag(1494,y+46,st,{bg:col,fg:'#13232e',size:15,align:'right'});}));
  wt(1124,560,'每組 3–4 人，一船 12 人以內',16,'rgba(227,236,238,.8)',500);
  const f=chartBox(60,600,1000,200,{title:'06:00 發布的預報：示性波高（典型範例）',x0:6,x1:20,y0:0,y1:2,xt:[],yt:[0,1,2],pl:170,pt:52,pb:34,gx:7,gy:2});
  const fk=ease(seg(u,.6,.8));
  alphaDo(seg(u,.78,.86)*.25,()=>box(f.X(6),f.py,f.X(20)-f.X(6),f.ph,TC));
  hsCurve(f,K06,fk,SEAB,false,6,20);limitLine(f,1.5,'登塔上限 1.5 m',seg(u,.62,.68));
  card(1100,600,440,200,{bg:'rgba(7,27,39,.8)'});
  alphaDo(seg(u,.78,.86),()=>{wt(1320,672,'清晨判斷',19,'#f2c230',700,'center');wt(1320,722,'浪高低於上限至約 21:00',19,'#fff',600,'center');tag(1320,768,'出海',{bg:TC,fg:'#13232e',size:17,align:'center'});});
 }},

/* 2 */{t:'清晨出港：三個小組一起出發',en:'Dawn departure with three teams',dur:15,side:true,
 d:'清晨六點半，三個小組在運維港完成工具箱會議，確認今天的工作、風險與撤離方式，再把工具、備品與吊具裝上人員運輸船。除了工作物資，每個小組也要確認風機上的避難物資還在、未過期，必要時隨船補帶，因為一旦天氣轉壞，人員可能要在風機上待一整夜。最後由運維主管與船長確認海況後解纜出港，以約 24 節的航速前往一個多小時航程外的風場。',
 s:[[0,'三個小組在碼頭集合，召開工具箱會議'],[.26,'工具、備品與吊具裝上人員運輸船'],[.5,'出海前，也要確認風機上的避難物資'],[.76,'運維主管與船長確認後，解纜出港']],
 cam:u=>camMix({x:1360,y:420,s:2.1},{x:1120,y:430,s:1.35},ease(seg(u,.72,1))),
 draw(u){
  for(const [x,s,p] of [[300,.5,.4],[620,.42,1.7],[860,.38,2.6]])far34(x,s,TT*.9+p);
  port34();
  for(let i=0;i<4;i++)box(1690+i*24,432,20,20,['#e8572a','#1f7f99','#f2c230','#7dffc4'][i]);
  const xC=lerp(1436,1120,ease(seg(u,.8,1)));const wl=ctvRide(xC,true,.6);
  box(xC-60,wl-20,12,8,'#e8572a');box(xC-46,wl-20,10,8,'#1f7f99');box(xC-34,wl-20,10,8,'#7dffc4');
  for(let j=0;j<9;j++){const tm=Math.floor(j/3),col=TEAM[tm][1],s=clamp(u-.3-j*.025);
   let p;if(s<=0)p={x:1560+(j%3)*12+tm*36,y:452};else if(s<.2)p={x:lerp(1560+(j%3)*12+tm*36,1462+j*2,ease(seg(s,0,.16))),y:452};
   else p={x:xC-62+j*6,y:wl-12};if(u>.8)p={x:xC-62+j*6,y:wl-12};
   tech(p.x,p.y,col);}
  lab(1510,386,'監控中心',{dx:-30,dy:-50,a:band(u,.02,.3)});
  lab(1600,452,'工具箱會議',{dx:20,dy:50,a:band(u,.02,.28),minor:true});
  lab(1700,432,'工具與備品',{dx:-20,dy:-60,a:band(u,.24,.5)});
  lab(xC-40,wl-18,'人員運輸船（CTV）',{dx:-60,dy:-60,a:band(u,.04,.5),st:'s'});
  lab(1520,420,'確認避難物資',{dx:-80,dy:-80,a:band(u,.5,.74),st:'g'});
 },
 hud(u){hudPanel(250,150,'出海判斷（示例）',seg(u,.04,.1),w=>{
  hrow(52,'示性波高','0.9 m',w,TC);hrow(84,'登船人數','11 人',w);hrow(116,'決定',u<.74?'確認中':'出海',w,u<.74?TB:TC);});}},

/* 3 */{t:'依序送人登塔',en:'Dropping teams turbine by turbine',dur:16,
 d:'到了風場，人員運輸船依序把三個小組送上各自的風機：先到 A04 放下小組 A，再到 A05 與 A06。每次登塔約需十到二十分鐘，包括頂靠、人員登上爬梯、吊上工具與確認通訊。送完人後，船在場內待命，不必每次回港，這樣才能在小組完成工作時盡快接人，也能在天氣轉壞時立刻展開撤離。場內的船要隨時掌握每座風機上有多少人，這份名單是撤離時最重要的資料。',
 s:[[0,'船依序把三個小組送上各自的風機'],[.3,'每次登塔包括頂靠、爬梯、吊上工具'],[.56,'送完人後，船留在場內待命'],[.78,'每座風機上有誰，都記在人員名單上']],
 draw(u){
  diagBG();
  card(60,150,1000,650,{bg:'rgba(7,27,39,.8)'});wt(84,196,'風場俯視（示意）',20,'#f2c230',700);
  MAPT.forEach(t=>{const hi=t.id==='A04'||t.id==='A05'||t.id==='A06';circ(t.x,t.y,hi?10:7,hi?'#e9edef':'rgba(227,236,238,.5)');
   const a=TT*.6+t.x*.01;for(let i=0;i<3;i++){const b=a+i*TAU/3;ln([t.x,t.y,t.x+Math.cos(b)*18,t.y+Math.sin(b)*18],hi?'#fff':'rgba(227,236,238,.4)',1.6);}
   wt(t.x,t.y+34,t.id,15,hi?'#fff':'rgba(227,236,238,.55)',700,'center',COND);});
  arrow(1040,770,990,730,'rgba(227,236,238,.8)',3);wt(1036,792,'往運維港',15,'rgba(227,236,238,.85)',600,'right');
  const A=mapPos('A04'),B=mapPos('A05'),C=mapPos('A06');
  const P=[[1000,750],[A.x+26,A.y+30],[B.x+26,B.y+30],[C.x+26,C.y+30],[C.x-40,C.y+110]];
  const k=ease(seg(u,.04,.62));
  ctx.setLineDash([6,8]);const pp=[];P.forEach(p=>pp.push(p[0],p[1]));ln(pp,'rgba(242,194,48,.35)',2);ctx.setLineDash([]);
  const p=ptAt(P,k),q=ptAt(P,Math.min(1,k+.01));ctvTop(p[0],p[1],Math.atan2(q[1]-p[1],q[0]-p[0])+(k>=.999?0:0),1);
  const drops=[.28,.5,.72];
  TEAM.forEach(([n,col,id],i)=>{const t=mapPos(id);if(k>drops[i]-.02)alphaDo(seg(k,drops[i]-.02,drops[i]+.04),()=>{circ(t.x+22,t.y-22,13,col);wt(t.x+22,t.y-16,n.slice(-1),15,'#13232e',800,'center',COND);});});
  card(1100,150,440,650,{bg:'rgba(7,27,39,.8)'});wt(1124,196,'送人時間表（典型範例）',20,'#f2c230',700);
  const E=[[7.0,'出港',SEAB,.02],[7.67,'小組 A 登上 A04',TA,.2],[8.0,'小組 B 登上 A05',PB,.36],[8.33,'小組 C 登上 A06',TC,.52],[8.5,'船在場內待命','rgba(227,236,238,.85)',.62]];
  E.forEach(([h,t,col,t0],i)=>alphaDo(.15+.85*seg(u,t0,t0+.06),()=>{const y=250+i*80;wt(1124,y,clk(h),24,col,700,'left',COND);wt(1210,y,t,18,'#fff',600);if(i<4)ln([1150,y+14,1150,y+52],'rgba(255,255,255,.2)',2);}));
  alphaDo(seg(u,.78,.86),()=>{card(1124,656,392,124,{bg:'rgba(125,255,196,.08)',st:'rgba(125,255,196,.5)'});wt(1146,700,'人員名單',19,TC,700);wt(1146,740,'A04：3 人　A05：4 人　A06：4 人',17,'#fff',600);});
 }},

/* 4 */{t:'登塔：從船首到機艙',en:'From the bow to the nacelle',dur:15,side:true,
 d:'人員運輸船以船首的護舷頂住風機基礎的登塔架，靠推力讓船首貼緊不動，技術人員扣上安全繩，依序沿爬梯爬上轉接段平台。工具與備品用平台上的小吊車吊上來。進入塔架後，再搭乘塔內的維修昇降機往上，到約百公尺高的機艙。小組到位、與船和監控中心確認通訊後，船才退開，前往下一座風機。整個過程中，最危險的瞬間是從船跨上爬梯的那一步，所以浪高上限都是以這一步為準。',
 s:[[0,'船首頂住登塔架，技術人員扣上安全繩'],[.22,'沿爬梯爬上轉接段平台'],[.48,'進入塔架，搭維修昇降機上到機艙'],[.78,'確認通訊後，船退開前往下一座風機']],
 base:u=>stormBase(0,1.2),
 cam:u=>camMix({x:TX-60,y:430,s:2.3},{x:TX-30,y:330,s:1.15},ease(seg(u,.44,.72))),
 draw(u){
  for(const [x,s,p] of [[160,.55,.4],[1000,.45,1.7],[1240,.4,2.6]])far34(x,s,TT*.9+p);
  turb34(TX,.6);
  ln([LAD,PLAT,LAD,TP_BOT+22],'rgba(242,194,48,.85)',1);
  const cx=u<.8?CTVX:lerp(CTVX,TX-640,ease(seg(u,.8,1)));const wl=ctvRide(cx,false,.5);const dk=wl-12;
  const sl=seg(u,.44,.5)*(1-seg(u,.8,.86));if(sl>0)alphaDo(sl,()=>box(TX-4,TW_TOP+2,8,TP_TOP-TW_TOP-6,'#22313b'));
  const ly=lerp(TP_TOP-6,TW_TOP+14,ease(seg(u,.5,.76)));
  if(sl>0&&u>.5)alphaDo(sl,()=>{box(TX-4,ly-14,8,14,'#f2c230');circ(TX,ly-10,1.6,'#f0c9a0');});
  for(let j=0;j<3;j++){const s=u-j*.05;let p;
   if(s<.06)p={x:cx+56+j*6,y:dk};
   else if(s<.36)p=kf(s,[[.06,cx+56+j*6,dk],[.1,LAD,dk-2],[.3,LAD,PLAT],[.36,TX-12+j*4,PLAT]]);
   else if(s<.46)p={x:lerp(TX-12+j*4,TX,seg(s,.36,.46)),y:PLAT};else p=null;
   if(p)tech(p.x,p.y,TA,s>.1&&s<.3);}
  const hk=seg(u,.3,.44);if(hk>0&&hk<1){const hy=lerp(dk-8,PLAT-6,hk);ln([TX-24,PLAT-40,TX-24,hy],'#2b3035',1);box(TX-28,hy,8,6,'#1f7f99');}
  ln([TX-20,PLAT,TX-20,PLAT-42,TX-30,PLAT-42],'#f2c230',1.5);
  lab(cx+70,wl-6,'船首頂靠',{dx:-90,dy:40,a:band(u,0,.24),st:'s'});
  lab(LAD,PLAT+30,'爬梯',{dx:-90,dy:-30,a:band(u,.12,.4)});
  lab(TX-24,PLAT-40,'平台吊車',{dx:70,dy:-40,a:band(u,.3,.5),minor:true});
  lab(TX,(TW_TOP+TP_TOP)/2,'塔內維修昇降機',{dx:110,dy:0,a:band(u,.5,.78),st:'s'});
  lab(TX+10,TW_TOP-30,'機艙',{dx:90,dy:-30,a:band(u,.62,.9)});
  lab(cx+40,wl-26,'前往 A05',{dx:-30,dy:-50,a:band(u,.82,1),st:'s'});
 },
 hud(u){hudPanel(250,150,'A04 登塔（示例）',seg(u,.04,.1),w=>{
  hrow(52,'示性波高','1.0 m',w,TC);hrow(84,'時刻',clk(lerp(7.6,7.95,u)),w);hrow(116,'狀態',u<.44?'登塔中':u<.8?'上機艙':'船退開',w,TB);});}},

/* 5 */{t:'三座風機同時施工',en:'Three turbines at work',dur:15,side:true,
 d:'上午九點，三個小組都已在機艙內開工。施工前先讓風機停機、把葉片順槳，再插入轉子鎖定銷，確保主軸不會轉動，這是在機艙內工作的基本條件。小組 A 在 A04 更換齒輪箱的零件，工作途中齒輪箱是打開的狀態，必須完成到可以安全停下的步驟才能離開；小組 B 與 C 的檢查工作則可以隨時收尾。每個小組每隔一段時間向船與監控中心回報進度，運維主管也持續追蹤最新預報。',
 s:[[0,'三個小組都在機艙內開工'],[.24,'風機先停機，插入轉子鎖定銷'],[.5,'A04 的齒輪箱打開了，要做到安全停點才能離開'],[.76,'各組定時回報進度，岸上持續追蹤預報']],
 base:u=>stormBase(0,1.4),
 cam:u=>({x:TX+12,y:TW_TOP-24,s:3}),
 draw(u){
  turb34(TX,.6,1);nacPeople(3,true,false);
  const pin=seg(u,.24,.34);box(TX-30,TW_TOP-24,lerp(0,8,pin),4,'#e8572a');
  lab(TX-26,TW_TOP-22,'轉子鎖定銷',{dx:-80,dy:-50,st:'w',a:band(u,.22,.5)});
  lab(TX-2,TW_TOP-20,'齒輪箱打開中',{dx:-60,dy:70,st:'s',a:band(u,.48,.76)});
  lab(TX+16,TW_TOP-14,'小組 A（3 人）',{dx:40,dy:-80,a:band(u,0,.24)});
  radio(TX+52,TW_TOP-50,band(u,.74,1));
 },
 hud(u){hudPanel(260,182,'各組進度（示例）',seg(u,.04,.1),w=>{
  const h=lerp(9,11.5,u);hrow(48,'時刻',clk(h),w);
  const pr=[(h-8.2)/8,(h-8.6)/7.2,(h-8.9)/6.6];
  TEAM.forEach(([n,col,id],i)=>{const y=82+i*34;htext(14,y,id,14,col,700,COND);hbar(60,y-8,w-120,pr[i],col);htext(w-14,y,Math.round(clamp(pr[i])*100)+'%',15,'#fff',700,COND,'right');});});}},

/* 6 */{t:'中午的預報更新：窗口提早關閉',en:'Midday update: the window closes early',dur:16,
 d:'中午十二點的新預報改變了一切：一道鋒面比清晨預估提早約六小時到達，示性波高預計在下午三點左右就會升到 1.5 公尺的登塔上限，入夜後更可能達到約 2.7 公尺，風速超過 20 m/s。原本可以撐到晚上九點的窗口，突然縮短到下午三點。運維主管與船長立刻通知三個小組：停止開始新的步驟，盡快收尾，回報各自還需要多少時間才能安全離開。',
 s:[[0,'中午的新預報：鋒面提早約六小時到達'],[.3,'浪高約下午三點就達到登塔上限'],[.54,'窗口從晚上九點縮短到下午三點'],[.76,'立刻通知各組收尾，回報還需要的時間']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,1000,650,{title:'示性波高預報：06:00 與 12:00 版（典型範例）',x0:6,x1:34,y0:0,y1:3,xt:[],yt:[0,1,2,3],pt:66,gx:7,gy:3});hrLabels(c,[6,12,18,24,30]);
  wt(c.px-10,c.py-12,'m',15,'rgba(227,236,238,.7)',600,'right',COND);wt(c.X(27),c.py+c.ph+44,'隔天',15,'rgba(227,236,238,.7)',600,'center');
  const we=lerp(21,15,ease(seg(u,.5,.62)));
  alphaDo(seg(u,.04,.1)*.22,()=>box(c.X(6),c.py,c.X(we)-c.X(6),c.ph,TC));
  hsCurve(c,K06,ease(seg(u,.02,.2)),'rgba(227,236,238,.55)',true,6,34);
  hsCurve(c,KNW,ease(seg(u,.18,.42)),SEAB,false,6,34);
  limitLine(c,1.5,'登塔上限 1.5 m',seg(u,.2,.26));
  tag(c.X(28),c.Y(2.4),'06:00 預報',{bg:'rgba(227,236,238,.75)',fg:'#13232e',size:15,align:'center'});
  alphaDo(seg(u,.3,.36),()=>tag(c.X(19),c.Y(2.75),'12:00 更新',{bg:SEAB,fg:'#0e2a3b',size:15,align:'center'}));
  alphaDo(seg(u,.3,.4),()=>{circ(c.X(15),c.Y(1.5),9,WRN);circ(c.X(21),c.Y(1.5),7,'rgba(227,236,238,.6)');});
  alphaDo(seg(u,.56,.64),()=>{tag((c.X(6)+c.X(15))/2,c.py+30,'新的窗口：至 15:00',{bg:TC,fg:'#13232e',size:17,align:'center'});});
  card(1100,150,440,650,{bg:'rgba(7,27,39,.8)'});wt(1124,196,'12:00 更新預報',20,'#f2c230',700);
  const R=[['鋒面抵達','提早約 6 小時','#ff8a60',.06],['Hs 達 1.5 m','約 15:00',WRN,.3],['夜間最大 Hs','約 2.7 m','#ff8a60',.4],['最大風速','約 20 m/s','#ff8a60',.46]];
  R.forEach(([k,v,col,t0],i)=>alphaDo(seg(u,t0,t0+.06),()=>{const y=226+i*100;card(1124,y,392,84,{bg:'rgba(255,255,255,.04)',st:'rgba(255,255,255,.14)'});
   wt(1146,y+50,k,19,'#fff',700);wt(1494,y+52,v,24,col,700,'right',COND);}));
  alphaDo(seg(u,.76,.82),()=>{card(1124,640,392,140,{bg:'rgba(232,87,42,.1)',st:'rgba(232,87,42,.6)'});wt(1320,694,'通知各組',20,'#ff8a60',700,'center');wt(1320,738,'停止新步驟，回報收尾時間',18,'#fff',600,'center');});
 }},

/* 7 */{t:'和浪高賽跑：誰能先撤',en:'Racing the waves: who can leave in time',dur:16,
 d:'各組回報後，運維主管把收尾時間和浪高預報放在同一張圖上比對。小組 C 的螺栓檢查最快收尾，約 13:30 可以接回；小組 B 約 14:20。小組 A 的齒輪箱已經打開，必須把零件裝回、封好，讓風機處在安全狀態，最快也要到 15:30 才能下塔，這時浪高已超過登塔上限。在浪高超標時強行接人，比留在風機上更危險，因此決定：先接回 B、C 兩組，小組 A 留在 A04 待命。',
 s:[[0,'把各組收尾時間和浪高預報放在一起比對'],[.3,'小組 C 與 B 能在浪高超標前接回'],[.54,'小組 A 要做到安全停點，最快 15:30 才能離開'],[.76,'決定：先接回 B、C，小組 A 留在風機待命']],
 draw(u){
  diagBG();
  const g=chartBox(60,150,1000,330,{title:'收尾與接人時間（典型範例）',x0:12,x1:18,y0:0,y1:3,xt:[],yt:[],pl:150,pt:62,pb:20,gx:6,gy:0});
  const c=chartBox(60,500,1000,300,{title:'12:00 預報：示性波高',x0:12,x1:18,y0:0,y1:2.4,xt:[],yt:[0,1,2],pl:150,pt:52,gx:6,gy:2});hrLabels(c,[12,13,14,15,16,17,18]);
  wt(c.px-10,c.py-12,'m',15,'rgba(227,236,238,.7)',600,'right',COND);
  hsCurve(c,KNW,ease(seg(u,.04,.24)),SEAB,false,12,18);limitLine(c,1.5,'登塔上限 1.5 m',seg(u,.08,.14));
  const lx=c.X(15);alphaDo(seg(u,.12,.2),()=>{ctx.setLineDash([8,6]);ln([lx,g.py,lx,c.py+c.ph],WRN,2.4);ctx.setLineDash([]);});
  const RW=[[2,'小組 C',TC,13.1,13.5,true,.26],[1,'小組 B',PB,13.8,14.33,true,.34],[0,'小組 A',TA,15.3,15.8,false,.5]];
  const rh=g.ph/3;
  RW.forEach(([ti,n,col,ready,pick,ok,t0],i)=>{const y=g.py+(i+.5)*rh,k=ease(seg(u,t0,t0+.1));wt(g.px-14,y+7,n,18,col,700,'right');
   if(k<=0)return;box(g.X(12),y-16,(g.X(ready)-g.X(12))*k,32,col);
   alphaDo(seg(u,t0+.08,t0+.12),()=>{wt(g.X(12)+10,y+6,ti===0?'收尾：裝回齒輪箱零件':'收尾',16,'#13232e',700);
    ln([g.X(ready),y,g.X(pick),y],'rgba(227,236,238,.7)',2);circ(g.X(pick),y,11,ok?TC:WRN);
    if(ok)ln([g.X(pick)-5,y,g.X(pick)-1,y+5,g.X(pick)+6,y-5],'#13232e',2.5);else{ln([g.X(pick)-5,y-5,g.X(pick)+5,y+5],'#fff',2.5);ln([g.X(pick)+5,y-5,g.X(pick)-5,y+5],'#fff',2.5);}
    wt(g.X(pick)+20,y+6,clk(pick),17,ok?TC:'#ff8a60',700,'left',COND);});});
  card(1100,150,440,650,{bg:'rgba(7,27,39,.8)'});wt(1124,196,'決定',20,'#f2c230',700);
  alphaDo(seg(u,.56,.62),()=>{wt(1124,246,'為什麼小組 A 不撤',18,'#ff8a60',700);
   ['工作要做到安全停點才能離開','15:00 後浪高超過登塔上限','強行接人比留在風機更危險'].forEach((t,i)=>{circ(1134,284+i*40-6,5,'#ff8a60');wt(1150,284+i*40,t,16,'#fff',500);});});
  alphaDo(seg(u,.76,.82),()=>{card(1124,420,392,360,{bg:'rgba(125,255,196,.06)',st:'rgba(125,255,196,.5)'});wt(1146,462,'小組 A 留在 A04 待命',19,TC,700);
   ['確認風機上的避難物資','風機停機，轉子保持鎖定','與監控中心約定回報時間','船載 B、C 兩組返港'].forEach((t,i)=>{box(1146,494+i*66,22,22,'rgba(125,255,196,.2)','#7dffc4',1.5);ln([1150,506+i*66,1156,512+i*66,1165,499+i*66],'#7dffc4',2.5);wt(1180,512+i*66,t,17,'#fff',500);});});
 }},

/* 8 */{t:'浪高上升中接回人員',en:'Picking up crews as the sea builds',dur:16,side:true,
 d:'下午兩點過後，海面明顯變得混亂，浪花不斷打上基礎。人員運輸船先在 A06 接回小組 C，再來到 A05。船長以更大的推力讓船首頂住登塔架，看準船身起伏較小的時機，讓技術人員一個一個從爬梯跨回甲板，工具則用吊車放下。每多一個人回到船上，就向監控中心回報一次人數。接完小組 B，船回報「A04 仍有 3 人」，在浪高超過上限之前返航。',
 s:[[0,'午後浪高持續上升，浪花打上基礎'],[.26,'船首加大推力頂住，看準時機跨回甲板'],[.52,'每回到船上一個人，就回報一次人數'],[.78,'接完小組 B，船在浪高超標前返航']],
 base:u=>stormBase(seg(u,0,1)*.4,lerp(2.4,4.4,u)),
 cam:u=>camMix({x:TX-70,y:452,s:2.1},{x:TX+220,y:430,s:1.4},ease(seg(u,.74,1))),
 draw(u){
  for(const [x,s,p] of [[180,.55,.4],[1000,.45,1.7],[1200,.4,2.6]])far34(x,s,.6+p);
  turb34(TX,.6);
  ln([LAD,PLAT,LAD,TP_BOT+22],'rgba(242,194,48,.85)',1);
  const cx=u<.12?lerp(TX-420,CTVX,ease(seg(u,0,.12))):u<.74?CTVX:lerp(CTVX,TX+560,ease(seg(u,.74,1)));
  const wl=ctvRide(cx,false,.9);const dk=wl-12;
  const R=rng(7);for(let i=0;i<14;i++){const k=(TT*1.3+R())%1;circ(TX-30-R()*36-k*24,sY(TX-30)-6-k*44-R()*10,2+R()*3.5,`rgba(240,250,255,${.85*(1-k)})`);}
  for(let j=0;j<4;j++){const s=u-.16-j*.1;let p;
   if(s<0)p={x:TX-10+j*6,y:PLAT};
   else if(s<.22)p=kf(s,[[0,TX-10+j*6,PLAT],[.04,LAD,PLAT],[.16,LAD,PLAT+28],[.22,cx+40+j*7,dk]]);
   else p={x:cx+40+j*7,y:dk};tech(p.x,p.y,PB,s>.04&&s<.16);}
  lab(TX-40,sY(TX-40)-20,'浪花打上基礎',{dx:-110,dy:-50,st:'w',a:band(u,0,.3)});
  lab(cx+70,wl-6,'加大推力頂住',{dx:-100,dy:40,st:'s',a:band(u,.2,.5)});
  lab(LAD,PLAT+20,'一次一人跨回甲板',{dx:-140,dy:-40,st:'g',a:band(u,.3,.62)});
  lab(cx+40,wl-26,'返航',{dx:-30,dy:-50,st:'s',a:band(u,.78,1)});
 },
 hud(u){hudPanel(260,182,'A05 接人（示例）',seg(u,.04,.1),w=>{
  const h=lerp(1.25,1.45,u);const on=Math.min(8,4+Math.max(0,Math.floor((u-.16)/.1+.8)));
  hrow(50,'時刻',clk(lerp(14.1,14.5,u)),w);
  hrow(80,'示性波高',trf('{n} m',{n:h.toFixed(2)}),w,h<1.35?TB:'#ff8a60');hbar(14,90,w-28,h/1.5,h<1.35?TB:'#ff8a60');
  hrow(126,'船上人數',trf('{n} 人',{n:on}),w,TC);hrow(158,'A04 仍在塔上',trf('{n} 人',{n:3}),w,TA);});}},

/* 9 */{t:'在機艙裡等待風雨過去',en:'Waiting out the storm in the nacelle',dur:18,side:true,
 d:'傍晚鋒面抵達，風速超過每秒 20 公尺，示性波高升到 2.5 公尺以上，任何船都無法靠近。小組 A 已把齒輪箱裝回並完成安全停點，風機維持停機、轉子鎖定，三個人在機艙內待命。機艙有照明與遮蔽，比外部平台安全；若有雷電，就依程序停止所有外部與高處作業，留在指定的安全區。他們每隔約一小時以無線電向監控中心回報狀況，輪流休息、補充水分與保暖，等待預報中的回程窗口。',
 s:[[0,'鋒面抵達，風雨交加，浪高超過 2.5 m'],[.26,'船無法靠近，小組 A 留在機艙內待命'],[.5,'風機停機、轉子鎖定，機艙有照明與遮蔽'],[.74,'每隔約一小時，以無線電向監控中心回報']],
 base:u=>stormBase(lerp(.6,1,seg(u,0,.3)),lerp(8,13,seg(u,0,.4)),lerp(.5,1,seg(u,0,.3))),
 cam:u=>camMix({x:TX-40,y:420,s:1.15},{x:TX+12,y:TW_TOP-24,s:3},ease(seg(u,.24,.46))),
 draw(u){
  for(const [x,s] of [[180,.55],[1000,.45],[1200,.4]])far34(x,s,.9);
  turb34(TX,.6,seg(u,.36,.46));
  if(u>.36)alphaDo(seg(u,.36,.46),()=>nacPeople(3,false,true));
  radio(TX+52,TW_TOP-50,band(u,.7,1));
  lab(TX-60,sY(TX-60)-10,'浪高超過登塔上限',{dx:-140,dy:-60,st:'w',a:band(u,.02,.26)});
  lab(TX+16,TW_TOP-40,'小組 A 在機艙內待命',{dx:120,dy:-40,st:'s',a:band(u,.12,.4)});
  lab(TX-26,TW_TOP-22,'轉子鎖定',{dx:-80,dy:-50,st:'w',a:band(u,.48,.72)});
  lab(TX+16,TW_TOP-8,'照明與遮蔽',{dx:60,dy:60,a:band(u,.48,.72),minor:true});
  lab(TX+52,TW_TOP-50,'定時無線電回報',{dx:70,dy:-60,st:'g',a:band(u,.72,1)});
 },
 fx(u){rainFx();},
 hud(u){hudPanel(260,182,'A04 待命（示例）',seg(u,.04,.1),w=>{
  const h=lerp(15.5,23,u);hrow(50,'時刻',clk(h),w);
  hrow(82,'示性波高',trf('{n} m',{n:iv(KNW,h).toFixed(1)}),w,'#ff8a60');
  hrow(114,'風速',trf('{n} m/s',{n:Math.round(iv(WNW,h))}),w,'#ff8a60');
  hrow(146,'待命時間',trf('{n} 小時',{n:(h-15.5).toFixed(1)}),w,TB);
  hrow(172,'人員狀況','3 人良好',w,TC);});}},

/* 10 */{t:'風機上的避難物資與程序',en:'Refuge kits and procedures',dur:16,
 d:'為了這種情況，風機上會存放避難物資，國外風場常在每座風機放置緊急物資桶，內有冷凍乾燥食物、飲水、睡袋與保暖衣物、急救箱、照明與備用電池，內容依業主與風機製造商而異。英國曾有一個案例，4 名技術人員因海況轉壞受困風機約 18 小時，身邊卻沒有過夜物資；調查指出，出海前沒有確認物資，應變計畫也沒考慮在惡劣天氣下吊運物資的困難。因此出海前確認物資，是連續作業的必要步驟。',
 s:[[0,'風機上存放避難物資，以備人員受困'],[.3,'待命期間依程序回報、休息與保暖'],[.54,'國外曾有技術人員受困 18 小時，身邊沒有物資'],[.78,'出海前確認物資，是必要步驟']],
 draw(u){
  diagBG();
  card(60,150,740,650,{bg:'rgba(7,27,39,.8)'});wt(84,196,'風機上的避難物資（示例）',20,'#f2c230',700);
  const I=[['飲用水','#58b8d0'],['冷凍乾燥食物','#ff9d7a'],['睡袋與保暖衣物','#7dffc4'],['急救箱','#ff8a60'],['照明與備用電池','#f2c230'],['無線電與衛星電話','#7dc8dc']];
  I.forEach(([n,col],i)=>{const x=84+(i%2)*356,y=230+Math.floor(i/2)*180,k=seg(u,.04+i*.04,.1+i*.04);alphaDo(.15+.85*k,()=>{card(x,y,336,160,{bg:'rgba(255,255,255,.04)',st:'rgba(255,255,255,.14)'});
   const ix=x+60,iy=y+70;
   if(i===0){box(ix-12,iy-26,24,50,col);box(ix-6,iy-34,12,8,col);}
   else if(i===1){box(ix-22,iy-24,44,48,col);ln([ix-22,iy-12,ix+22,iy-12],'#13232e',2);}
   else if(i===2){rrp(ix-30,iy-18,60,40,14);ctx.fillStyle=col;ctx.fill();ln([ix-30,iy,ix+30,iy],'#13232e',2);}
   else if(i===3){box(ix-24,iy-20,48,40,'#e9edef');box(ix-4,iy-14,8,28,col);box(ix-14,iy-4,28,8,col);}
   else if(i===4){circ(ix,iy-4,16,col);box(ix-7,iy+12,14,14,'#8d989f');}
   else{box(ix-16,iy-16,32,40,col);ln([ix+8,iy-16,ix+16,iy-38],'#e9edef',2.5);circ(ix-4,iy+2,6,'#13232e');}
   wt(x+110,y+82,n,19,'#fff',700);});});
  card(840,150,700,360,{bg:'rgba(7,27,39,.8)'});wt(864,196,'待命期間的程序',20,'#f2c230',700);
  const S=['風機停機，轉子保持鎖定','約每小時向監控中心回報','輪流休息，注意保暖與補水','有傷病時，啟動直升機或救援程序'];
  S.forEach((t,i)=>alphaDo(.15+.85*seg(u,.28+i*.05,.34+i*.05),()=>{const y=256+i*64;circ(884,y-7,16,'rgba(242,194,48,.18)','#f2c230',1.5);wt(884,y,String(i+1),18,'#f2c230',800,'center',COND);wt(916,y,t,18,'#fff',500);}));
  alphaDo(seg(u,.52,.6),()=>{card(840,540,700,260,{bg:'rgba(232,87,42,.08)',st:'rgba(232,87,42,.6)'});wt(864,584,'國外案例的教訓',20,'#ff8a60',700);
   wt(864,628,'4 名技術人員受困風機約 18 小時，身邊沒有過夜物資',18,'#fff',600);
   wt(864,672,'出海前沒有確認物資的位置與數量',17,'rgba(227,236,238,.9)',500);
   wt(864,712,'應變計畫沒考慮在惡劣天氣下吊運物資的困難',17,'rgba(227,236,238,.9)',500);});
  alphaDo(seg(u,.78,.86),()=>tag(1190,770,'出海前：確認物資、名單與聯絡方式',{bg:'#f2c230',fg:'#13232e',size:17,align:'center'}));
 }},

/* 11 */{t:'等待回程窗口',en:'Waiting for the return window',dur:15,
 d:'小組 A 要回程，也需要一個天候窗口。依預報，浪高在午夜前後達到高峰，之後隨著鋒面通過逐漸下降，清晨六點半左右回到 1.5 公尺以下。不過浪高剛降到上限時，海況仍不穩定，所以要等預報與現場觀測都確認浪高持續下降，而且窗口夠長，能容納出港航行、接人和返航，才會讓船出港。夜裡十一點與清晨五點，監控中心與船長各確認一次預報，清晨六點船出港，七點多接回小組 A。',
 s:[[0,'回程也需要一個天候窗口'],[.28,'浪高在午夜前後到達高峰，之後逐漸下降'],[.52,'確認浪高持續下降、窗口夠長，才出港'],[.78,'清晨六點船出港，七點多接回小組 A']],
 draw(u){
  diagBG();
  const c=chartBox(60,150,1000,650,{title:'12:00 預報：當晚到隔天清晨（典型範例）',x0:15,x1:34,y0:0,y1:3,xt:[],yt:[0,1,2,3],pt:66,gx:6,gy:3});hrLabels(c,[15,18,21,24,27,30,33]);
  wt(c.px-10,c.py-12,'m',15,'rgba(227,236,238,.7)',600,'right',COND);
  alphaDo(seg(u,.04,.1)*.18,()=>box(c.X(15),c.py,c.X(30.6)-c.X(15),c.ph,WRN));
  alphaDo(seg(u,.04,.1),()=>wt((c.X(15)+c.X(30.6))/2,c.Y(.35),'無法接人',17,'#ff8a60',700,'center'));
  hsCurve(c,KNW,ease(seg(u,.04,.4)),SEAB,false,15,34);limitLine(c,1.5,'登塔上限 1.5 m',seg(u,.06,.12));
  alphaDo(seg(u,.28,.34),()=>{circ(c.X(22),c.Y(2.7),9,'#ff8a60');tag(c.X(22),c.Y(2.7)-34,'高峰 約 2.7 m',{bg:'#ff8a60',fg:'#13232e',size:15,align:'center'});});
  const wk=seg(u,.52,.6);alphaDo(wk*.28,()=>box(c.X(30.6),c.py,c.X(34)-c.X(30.6),c.ph,TC));
  alphaDo(wk,()=>tag((c.X(30.6)+c.X(34))/2,c.py+30,'回程窗口',{bg:TC,fg:'#13232e',size:16,align:'center'}));
  card(1100,150,440,650,{bg:'rgba(7,27,39,.8)'});wt(1124,196,'回程的確認（典型範例）',20,'#f2c230',700);
  const E=[[23,'預報確認：清晨浪高下降',SEAB,.3],[29,'監控中心與船長再確認',TB,.5],[30,'船出港',TC,.62],[31.33,'接回小組 A',TA,.76]];
  E.forEach(([h,t,col,t0],i)=>alphaDo(.15+.85*seg(u,t0,t0+.06),()=>{const y=262+i*96;wt(1124,y,clk(h),26,col,700,'left',COND);wt(1124,y+36,t,18,'#fff',600);}));
  alphaDo(seg(u,.56,.62),()=>wt(1320,760,'窗口要容納航行、接人與返航',17,'rgba(227,236,238,.85)',600,'center'));
 }},

/* 12 */{t:'清晨回程',en:'Heading home at dawn',dur:16,side:true,
 d:'清晨的海面還留著湧浪，但浪高已穩定低於上限。人員運輸船出港來到 A04，船首頂住登塔架，小組 A 搭昇降機下到平台，扣上安全繩，沿爬梯一個個回到船上。從前一天下午三點半開始，他們在風機上待命了約十六個小時，全員安全。回港後，運維主管重新排程：小組 A 未完成的測試、以及原本第三天的 A07 到 A09，排入下一個天候窗口。連續作業的計畫，本來就要預留這樣的彈性。',
 s:[[0,'清晨浪高穩定下降，船再次來到 A04'],[.26,'小組 A 沿爬梯一個個回到船上'],[.52,'待命約 16 小時，全員安全返航'],[.78,'未完成的工作，排入下一個天候窗口']],
 base:u=>{stormBase(lerp(.25,0,seg(u,0,.4)),lerp(2,1,seg(u,0,.5)));alphaDo(.25*(1-seg(u,.3,.8)),()=>box(VX0,VY0,VX1-VX0,SEA+40-VY0,'rgba(255,170,110,.5)'));},
 cam:u=>camMix({x:TX-70,y:440,s:2.1},{x:TX+240,y:430,s:1.35},ease(seg(u,.6,.95))),
 draw(u){
  for(const [x,s,p] of [[180,.55,.4],[1000,.45,1.7],[1200,.4,2.6]])far34(x,s,.6+p);
  turb34(TX,.6);
  ln([LAD,PLAT,LAD,TP_BOT+22],'rgba(242,194,48,.85)',1);
  const cx=u<.12?lerp(TX-420,CTVX,ease(seg(u,0,.12))):u<.62?CTVX:lerp(CTVX,TX+620,ease(seg(u,.62,1)));
  const wl=ctvRide(cx,false,.6);const dk=wl-12;
  for(let j=0;j<3;j++){const s=u-.16-j*.08;let p;
   if(s<0)p={x:TX-10+j*6,y:PLAT};
   else if(s<.2)p=kf(s,[[0,TX-10+j*6,PLAT],[.04,LAD,PLAT],[.15,LAD,PLAT+28],[.2,cx+44+j*7,dk]]);
   else p={x:cx+44+j*7,y:dk};tech(p.x,p.y,TA,s>.04&&s<.15);}
  lab(cx+70,wl-6,'船首頂靠',{dx:-90,dy:40,st:'s',a:band(u,0,.24)});
  lab(LAD,PLAT+20,'沿爬梯回到船上',{dx:-140,dy:-40,st:'g',a:band(u,.24,.52)});
  lab(cx+40,wl-26,'返回運維港',{dx:-30,dy:-50,st:'s',a:band(u,.66,1)});
 },
 hud(u){hudPanel(260,182,'回程（示例）',seg(u,.04,.1),w=>{
  hrow(50,'時刻',clk(lerp(31.1,31.6,u)),w);hrow(82,'示性波高','1.2 m',w,TC);
  hrow(114,'待命時間',trf('約 {n} 小時',{n:16}),w,TB);hrow(146,'人員','3 人安全',w,TC);
  hrow(172,'下一步',u<.7?'回港':'重新排程',w,TB);});}}
]};
