// KITS: land
/* 電網系列 第 1 集：電網如何平衡供需 */
const gyy=x=>groundY(x);
const PX1=800,PX2=1060;                                   // 兩座輸電鐵塔
const BTX=[590,670];                                      // 儲能貨櫃左緣
const CITY=(()=>{const r=rng(9),a=[];let x=1172;while(x<1560){const w=40+r()*44,h=80+r()*170;a.push({x,w,h,s:r()*1000|0});x+=w+6+r()*10;}return a;})();
/* 沿折線 P 取比例 f 的點 */
function ptAt(P,f){let L=0;const d=[];for(let i=1;i<P.length;i++){const s=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);d.push(s);L+=s;}
  let r=clamp(f)*L;for(let i=0;i<d.length;i++){if(r<=d[i]){const t=d[i]?r/d[i]:0;return [lerp(P[i][0],P[i+1][0],t),lerp(P[i][1],P[i+1][1],t)];}r-=d[i];}return P[P.length-1];}
function flowDots(P,n,col,a,sp){if(a<=0)return;for(let k=0;k<n;k++){const f=((TT*(sp||.3))+k/n)%1,p=ptAt(P,f);alphaDo(a,()=>circ(p[0],p[1],4.5,col));}}
function wire(x0,y0,x1,y1,col){ctx.strokeStyle=col||'#394650';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2,(y0+y1)/2+18,x1,y1);ctx.stroke();}
function pylon(x,y){ctx.strokeStyle='#5c6770';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-34,y);ctx.lineTo(x-6,y-230);ctx.lineTo(x+6,y-230);ctx.lineTo(x+34,y);
  for(let k=0;k<6;k++){const t=k/6,t2=(k+1)/6;ctx.moveTo(lerp(x-34,x-6,t),lerp(y,y-230,t));ctx.lineTo(lerp(x+34,x+6,t2),lerp(y,y-230,t2));ctx.moveTo(lerp(x+34,x+6,t),lerp(y,y-230,t));ctx.lineTo(lerp(x-34,x-6,t2),lerp(y,y-230,t2));}
  ctx.moveTo(x-60,y-200);ctx.lineTo(x+60,y-200);ctx.moveTo(x-46,y-170);ctx.lineTo(x+46,y-170);ctx.stroke();}
/* 燃氣複循環電廠：k 為出力比例（0–1），影響煙羽 */
function gasPlant(x,y,k){
  box(x,y-100,160,100,'#c9d1d6','rgba(0,0,0,.25)',1);poly([x-6,y-100,x+80,y-128,x+166,y-100],'#aeb8be');
  wins(x+14,y-80,6,24,14,20,'#5e6d76');
  box(x+160,y-130,60,130,'#b3bdc3','rgba(0,0,0,.25)',1);for(let i=0;i<4;i++)box(x+168,y-120+i*28,44,4,'#8d989f');
  box(x+186,y-240,22,110,'#8d989f');box(x+184,y-244,26,6,'#6f7a80');box(x+186,y-222,22,6,'#e8572a');
  for(let q=0;q<5;q++){const p=(TT*.35+q/5)%1;alphaDo((.2+.6*k)*(1-p),()=>circ(x+197+p*60+8*Math.sin(p*6+q),y-250-p*90,8+p*18*(.5+k),'rgba(245,245,245,.8)'));}
  box(x+226,y-60,50,60,'#dfe5e8','rgba(0,0,0,.25)',1);for(let i=0;i<3;i++)box(x+232+i*15,y-86,6,26,'#c9a38c');
}
function battSmall(x,y){box(x,y-38,70,38,'#e3e8ec','rgba(0,0,0,.3)',1);ctx.strokeStyle='rgba(0,0,0,.12)';ctx.beginPath();for(let i=1;i<9;i++){ctx.moveTo(x+i*7.8,y-35);ctx.lineTo(x+i*7.8,y-3);}ctx.stroke();box(x+6,y-30,16,5,'#2d8f5a');box(x-2,y-40,74,3,'#aeb8be');}
function dispatchCenter(x,y){box(x,y-110,130,110,'#dfe5e8','rgba(0,0,0,.3)',1);for(let r=0;r<3;r++)wins(x+12,y-96+r*30,5,22,14,16,'#3d6f8e');box(x+50,y-26,30,26,'#5e6d76');
  ln([x+110,y-110,x+110,y-176],'#5c6770',3);circ(x+110,y-180,6,'#e8572a');}
function substation(x,y){box(x,y-60,52,60,'#8d989f');for(let i=0;i<3;i++){box(x+8+i*14,y-86,6,26,'#c9a38c');}}
/* 城市：lit 0–1 表示夜間點燈比例 */
function city(lit){for(const b of CITY){const y=gyy(b.x+b.w/2);box(b.x,y-b.h,b.w,b.h+10,'#6f7f89','rgba(0,0,0,.25)',1);const r=rng(b.s);
  for(let yy=y-b.h+10;yy<y-12;yy+=16)for(let xx=b.x+6;xx<b.x+b.w-8;xx+=12){const on=r()<lit*.85;box(xx,yy,7,9,on?'#ffd98a':'#2c3e4a');}}}
/* 場景：燃氣電廠、光電、儲能、鐵塔、調度中心、城市 */
function scene(o){
  o=o||{};const k=o.k===undefined?.6:o.k;
  gasPlant(70,gyy(180),k);
  for(let i=0;i<5;i++){const x=350+i*46;solarPanel(x,gyy(x),42,22,{h:32,glint:o.glint});}
  BTX.forEach(x=>battSmall(x,gyy(x+35)));
  pylon(PX1,gyy(PX1));pylon(PX2,gyy(PX2));
  dispatchCenter(880,gyy(945));substation(1110,gyy(1136));
  city(o.lit||0);
  wire(346,gyy(346)-120,PX1-60,gyy(PX1)-200);wire(PX1+60,gyy(PX1)-200,PX2-60,gyy(PX2)-200);wire(PX2+60,gyy(PX2)-200,1136,gyy(1136)-86);
  wire(545,gyy(545)-40,PX1-46,gyy(PX1)-170,'rgba(57,70,80,.7)');wire(740,gyy(740)-30,PX1-46,gyy(PX1)-170,'rgba(57,70,80,.7)');
  wire(PX1+46,gyy(PX1)-170,PX2-46,gyy(PX2)-170,'rgba(57,70,80,.7)');
}
const PMAIN=()=>[[346,gyy(346)-120],[PX1,gyy(PX1)-200],[PX2,gyy(PX2)-200],[1136,gyy(1136)-86]];
const PSOL=()=>[[545,gyy(545)-40],[PX1-46,gyy(PX1)-170],[PX2-46,gyy(PX2)-170]];
const PBAT=()=>[[740,gyy(740)-30],[PX1-46,gyy(PX1)-170],[PX2-46,gyy(PX2)-170]];
/* 頻率事件曲線 */
const fHi=t=>{const s=t-1;return s<=0?60:60-.45*(1-Math.exp(-s/2.5))+.25*(1-Math.exp(-s/6));};
const fLo=t=>{const s=t-1;return s<=0?60:60-.7*(1-Math.exp(-s/1.1))+.35*(1-Math.exp(-s/3));};
const fEv=t=>{const D=.1*(1-Math.exp(-t/3)),O=.12*(t/5)*Math.exp(1-t/5),R=Math.exp(-Math.max(0,t-30)/90);return 60-(D+O)*R;};
const LX=Math.log10(601),xm=t=>Math.log10(1+t)/LX;
/* 典型夏季平日負載與光電（GW，示意） */
const LOADP=[[0,31],[3,28],[5,27.5],[7,30],[9,35],[11,38.5],[13,40],[14.5,40.5],[16,39.5],[18,38],[19.5,38.5],[21,37],[23,33],[24,31]];
const loadAt=h=>{const P=LOADP,n=P.length;for(let i=1;i<n;i++)if(h<=P[i][0]){const a=P[i-1],b=P[i],t=(h-a[0])/(b[0]-a[0]),y0=(P[i-2]||a)[1],y3=(P[i+1]||b)[1];
  return .5*((2*a[1])+(-y0+b[1])*t+(2*y0-5*a[1]+4*b[1]-y3)*t*t+(-y0+3*a[1]-3*b[1]+y3)*t*t*t);}return 31;};  // Catmull-Rom
const solarAt=h=>h>5.8&&h<18.4?11*Math.sin(Math.PI*(h-5.8)/12.6):0;
const netAt=h=>loadAt(h)-solarAt(h);

const EP={no:1,slug:'power-grid',seriesName:'電網系列',t:'電網如何平衡供需',en:'How the grid balances supply and demand',
lede:'電無法大量儲存在電線裡，發多少電就要同時用掉多少。這一集從台灣電網的 60 Hz 頻率談起，看轉動慣量、一次調頻與二次調頻如何在幾秒到幾分鐘內接力穩住電網，以及太陽光電增加之後，傍晚的「鴨子曲線」帶來什麼挑戰。',
facts:[['60','Hz','台灣電網的標準頻率；台電正常運轉範圍為 59.9–60.1 Hz'],
['59.5','Hz','台電系統安全運轉的頻率下限，再往下會由低頻電驛自動卸載'],
['約 4,100','萬瓩','台灣電網近年的夏季尖峰負載，約 41 GW'],
['5','%','調速機常見的速度調定率（示例）：頻率變化 5% 時，機組出力變化 100%'],
['1','秒','儲能參與台電調頻備轉（dReg）要求的反應時間'],
['約 15.7','GW','截至 2026 年 3 月底，台灣太陽光電累計裝置容量']],
note:'說明：本集為教育用途示意動畫，電廠、城市與設備比例經過調整。頻率範圍依台電「電力調度要點」（正常 59.9–60.1 Hz、電源不足時 59.8–60.2 Hz）與台電說明的安全運轉下限 59.5 Hz；頻率事件曲線、轉動慣量比較、調速機速度調定率 5% 與調度指令功率皆為典型範例；一日負載與光電曲線為依台電公開用電曲線形狀繪製的示意，並非特定日期資料；光電裝置容量引自經濟部能源署統計。實際數值依系統狀況與台電規範而定。',
base:()=>{landSky(GY,{sun:{x:1300,y:120},clouds:false});drawGround();},
shots:[
{t:'一張隨時平衡的網',en:'A network in constant balance',dur:12,side:true,
 d:'電網把發電廠、太陽光電、儲能與千萬用戶連在一起。電無法大量存在電線裡，每一秒發出來的電，都要同時被用掉。早上工廠開工、午後冷氣全開，用電不斷變化，發電端就得跟著增減。台灣電網近年夏季尖峰負載約 4,100 萬瓩（41 GW），而且是一個與其他國家不相連的獨立電網，所有的平衡都要靠自己完成。',
 s:[[0,'電廠、光電與儲能，透過輸電線送電到城市'],[.28,'每一秒發出的電，都要同時被用掉'],[.55,'用電增加，發電端就得跟著增加'],[.78,'台灣是獨立電網，平衡只能靠自己']],
 cam:u=>camMix({x:800,y:440,s:1.02},{x:800,y:445,s:1.08},ease(seg(u,.1,.6))),
 draw(u){
  const k=lerp(.55,.85,ease(seg(u,.55,.75)));
  scene({k,glint:true,lit:.15});
  flowDots(PMAIN(),10,'#f2c230',seg(u,.08,.16),.25);
  flowDots(PSOL(),5,'#7dffc4',seg(u,.12,.2),.3);
  lab(250,gyy(250)-130,'燃氣電廠',{dx:-30,dy:-90,st:'s',a:band(u,.04,.5)});
  lab(440,gyy(440)-40,'太陽光電',{dx:-20,dy:-110,a:band(u,.08,.5)});
  lab(630,gyy(630)-38,'儲能',{dx:10,dy:-80,a:band(u,.12,.5)});
  lab(PX2,gyy(PX2)-200,'輸電線路',{dx:30,dy:-50,a:band(u,.16,.5)});
  lab(1330,gyy(1330)-160,'城市用電',{dx:-20,dy:-70,st:'l',a:band(u,.2,1)});
  lab(250,gyy(250)-240,'增加出力',{dx:60,dy:-40,st:'g',a:band(u,.58,1)});
 },
 hud(u){hudPanel(240,150,'電網即時狀態（示例）',seg(u,.05,.1),w=>{const d=lerp(34.2,36.8,ease(seg(u,.5,.72))),g=lerp(34.2,36.8,ease(seg(u,.56,.78)));const f=60-(d-g)*.05;
  hrow(56,'用電',d.toFixed(1)+' GW',w,'#fff');hrow(88,'發電',g.toFixed(1)+' GW',w,'#f2c230');hrow(120,'頻率',f.toFixed(2)+' Hz',w,Math.abs(f-60)>.05?'#ff8a60':'#7dffc4');});}},

{t:'頻率：供需的溫度計',en:'Frequency: the thermometer of balance',dur:13,
 d:'電網的頻率就像供需的溫度計。台灣的交流電每秒正負交替 60 次，也就是 60 Hz。發電大於用電，發電機轉得更快，頻率上升；用電大於發電，發電機被拖慢，頻率下降。台電規定正常運轉範圍為 59.9 至 60.1 Hz，電源不足時放寬到 59.8 至 60.2 Hz；59.5 Hz 是安全運轉的下限，再往下就會由低頻電驛自動切斷部分用戶，避免全面停電。',
 s:[[0,'發電與用電平衡時，頻率維持 60 Hz'],[.3,'用電大於發電，頻率往下掉'],[.58,'發電大於用電，頻率往上升'],[.86,'調整發電，頻率回到 60 Hz']],
 draw(u){
  diagBG();
  const p1=ease(seg(u,.3,.42)),p2=ease(seg(u,.58,.7)),p3=ease(seg(u,.86,.95));
  const G=4+2*p2,L=4+p1+p3,tl=L-G,f=60-.15*tl,ang=tl*.1;
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'供給與需求的蹺蹺板',20,'#f2c230',700);
  poly([410,560,370,640,450,640],'#c9d1d6');
  ctx.save();ctx.translate(410,560);ctx.rotate(ang);box(-270,-8,540,12,'#c9d1d6');
  const stack=(x0,n,col)=>{for(let i=0;i<Math.ceil(n-.001);i++){const fr=clamp(n-i);alphaDo(fr,()=>box(x0,-10-34*(i+1),110,30,col,'rgba(255,255,255,.4)',1));}};
  stack(-260,G,'#f2c230');stack(150,L,'#7dc8dc');ctx.restore();
  wt(155,690,'發電（供給）',20,'#f2c230',700,'center');wt(665,690,'用電（需求）',20,'#7dc8dc',700,'center');
  const msg=tl>.5?['用電大於發電：頻率下降','#ff9d7a']:tl<-.5?['發電大於用電：頻率上升','#ff9d7a']:['供需平衡：60 Hz','#7dffc4'];
  alphaDo(seg(u,.04,.1),()=>tag(410,750,msg[0],{size:18,bg:msg[1],align:'center'}));
  /* 右：頻率計 */
  card(800,160,740,640,{bg:'rgba(7,27,39,.75)'});wt(824,200,'頻率計',20,'#f2c230',700);
  const cx=1010,cy=480,R=160,A0=Math.PI*5/6,SW=Math.PI*4/3,va=v=>A0+clamp((v-59.4)/1.2)*SW;
  const arc=(v0,v1,col,lw)=>{ctx.beginPath();ctx.arc(cx,cy,R,va(v0),va(v1));ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke();};
  arc(59.4,60.6,'rgba(255,255,255,.12)',22);arc(59.4,59.5,'#e8572a',22);arc(60.5,60.6,'#e8572a',22);arc(59.8,60.2,'rgba(242,194,48,.8)',22);arc(59.9,60.1,'#7dffc4',22);
  [59.5,60,60.5].forEach(v=>{const a=va(v);ln([cx+Math.cos(a)*(R-16),cy+Math.sin(a)*(R-16),cx+Math.cos(a)*(R-34),cy+Math.sin(a)*(R-34)],'#fff',2);wt(cx+Math.cos(a)*(R-58),cy+Math.sin(a)*(R-58)+6,String(v),17,'rgba(227,236,238,.9)',700,'center',COND);});
  const na=va(f);ln([cx,cy,cx+Math.cos(na)*(R-20),cy+Math.sin(na)*(R-20)],'#fff',4);circ(cx,cy,10,'#fff');
  wt(cx,cy+96,f.toFixed(2)+' Hz',40,Math.abs(f-60)>.1?'#ff9d7a':'#7dffc4',700,'center',COND);
  const LG=[['#7dffc4','59.9–60.1 Hz','正常運轉範圍'],['rgba(242,194,48,.8)','59.8–60.2 Hz','電源不足時的範圍'],['#e8572a','59.5 Hz','安全下限','再低即自動卸載']];
  LG.forEach(([c,v,t1,t2],i)=>alphaDo(seg(u,.12+i*.05,.18+i*.05),()=>{const y=330+i*110;box(1224,y-16,18,18,c);wt(1254,y,v,20,'#fff',700,'left',COND);wt(1254,y+28,t1,16,'rgba(227,236,238,.85)',500);if(t2)wt(1254,y+52,t2,16,'rgba(227,236,238,.85)',500);}));
 }},

{t:'轉動慣量：第一道緩衝',en:'Inertia: the first cushion',dur:13,
 d:'火力、水力與核能電廠的發電機是數十到數百公噸的旋轉機械，與電網同步轉動，2 極機組在 60 Hz 下每分鐘轉 3,600 圈。一部機組突然跳脫時，其他機組的轉子會自動釋放旋轉動能補上缺口，讓頻率不會瞬間崩落，這就是轉動慣量。慣量越大，頻率下降越慢，調度與控制系統越有時間反應。太陽光電與風機經變流器併網，本身不提供慣量，需要靠電網構建型變流器或儲能提供「合成慣量」。',
 s:[[0,'發電機轉子與電網同步旋轉，儲存大量動能'],[.3,'一部機組跳脫，轉子釋放動能補上缺口'],[.55,'慣量越小，頻率下降得越快、越深'],[.78,'變流器併網的電源，需要另外提供合成慣量']],
 draw(u){
  diagBG();
  card(60,160,700,640,{bg:'rgba(7,27,39,.75)'});wt(84,200,'旋轉中的發電機組',20,'#f2c230',700);
  const cx=410,cy=410,sl=u<.3?1:1-.06*ease(seg(u,.3,.6)),rot=TT*2.2*sl;
  circ(cx,cy,150,'#1c3144','#c9d1d6',3);circ(cx,cy,118,'#23405a');
  for(let i=0;i<6;i++){const a=rot+i*Math.PI/3;ln([cx+Math.cos(a)*30,cy+Math.sin(a)*30,cx+Math.cos(a)*140,cy+Math.sin(a)*140],'#7dc8dc',6);}
  circ(cx,cy,30,'#c9d1d6');
  for(let i=0;i<3;i++){const a=rot+i*TAU/3;alphaDo(.8,()=>circ(cx+Math.cos(a)*134,cy+Math.sin(a)*134,7,'#f2c230'));}
  alphaDo(seg(u,.04,.1),()=>{wt(cx,612,'E = ½ J ω²',30,'#fff',700,'center',COND);wt(cx,650,'轉子儲存的旋轉動能',17,'rgba(227,236,238,.85)',500,'center');});
  alphaDo(seg(u,.1,.16),()=>wt(cx,238,'60 Hz · 3,600 rpm（2 極）',18,'#7dffc4',700,'center',COND));
  alphaDo(seg(u,.32,.38)*(1-seg(u,.74,.78)),()=>tag(cx,700,'釋放動能，補上缺口',{size:17,bg:'#f2c230',align:'center'}));
  alphaDo(seg(u,.78,.84),()=>{tag(84,700,'同步機組：自帶慣量',{size:16,bg:'#7dffc4'});tag(84,752,'光電與風機：需合成慣量',{size:16,bg:'#dfe5e8'});});
  const C=chartBox(800,160,740,640,{title:'失去一部機組後的頻率（示意）',x0:0,x1:10,y0:59.3,y1:60.05,xt:[0,2,4,6,8,10],yt:[59.4,59.6,59.8,60],xl:'秒',yl:'Hz',pl:84,pt:60,pb:56,gx:5,gy:3});
  ctx.setLineDash([8,6]);ln([C.px,C.Y(59.5),C.px+C.pw,C.Y(59.5)],'#e8572a',2);ctx.setLineDash([]);
  wt(C.px+C.pw-8,C.Y(59.5)+24,'59.5 Hz 安全下限',16,'#ff9d7a',700,'right');
  const tE=10*seg(u,.3,.92);
  const curve=(fn,col,lw)=>{if(tE<=0)return;ctx.beginPath();for(let t=0;t<=tE;t+=.05){const x=C.X(t),y=C.Y(fn(t));t?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.stroke();};
  curve(fHi,'#7dffc4',3.5);
  alphaDo(seg(u,.55,.6),()=>curve(fLo,'#ff8a60',3.5));
  alphaDo(seg(u,.32,.38),()=>{ctx.setLineDash([4,5]);ln([C.X(1),C.py,C.X(1),C.py+C.ph],'rgba(255,255,255,.5)',1.5);ctx.setLineDash([]);wt(C.X(1)+10,C.py+24,'機組跳脫',16,'#fff',600);});
  alphaDo(seg(u,.45,.5),()=>wt(C.X(9.8),C.Y(fHi(9))-16,'慣量大：下降較慢',17,'#7dffc4',700,'right'));
  alphaDo(seg(u,.62,.68),()=>wt(C.X(9.8),C.Y(59.62)+34,'慣量小：下降較快、較深',17,'#ff9d7a',700,'right'));
  alphaDo(seg(u,.66,.72),()=>{ln([C.X(1),C.Y(60),C.X(2.1),C.Y(59.42)],'rgba(255,255,255,.7)',2);wt(C.X(2.25),C.Y(59.42)+4,'頻率變化率（RoCoF）',16,'#fff',600);});
 }},

{t:'一次調頻與二次調頻',en:'Primary and secondary frequency control',dur:14,
 d:'慣量只能爭取幾秒鐘，接下來由三道防線接手。一次調頻：每部機組的調速機感測到頻率下降，就依速度調定率自動增加出力，常見設定為 5%，也就是頻率變化 5% 時出力變化 100%；它能在數秒到數十秒內止住頻率下滑，但會停在略低於 60 Hz 的位置。二次調頻：中央調度中心的自動發電控制（AGC）計算缺口，在數分鐘內調整頻控機組出力，把頻率拉回 60 Hz。之後再由調度員重新安排機組與備轉容量。',
 s:[[0,'機組跳脫後，頻率在數秒內下滑'],[.22,'慣量先緩衝，爭取幾秒鐘'],[.42,'一次調頻：調速機自動增加出力，止住下滑'],[.66,'二次調頻：AGC 在數分鐘內拉回 60 Hz']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,1480,400,{title:'機組跳脫後，三道防線依序接手（示意）',x0:0,x1:1,y0:59.76,y1:60.04,xt:[],yt:[59.8,59.9,60],yl:'Hz',pl:92,pt:58,pb:50,gx:0,gy:3});
  box(C.px,C.Y(60.04),C.pw,C.Y(59.9)-C.Y(60.04),'rgba(125,255,196,.07)');
  [[0,'0'],[1,'1 秒'],[10,'10 秒'],[30,'30 秒'],[60,'1 分'],[300,'5 分'],[600,'10 分']].forEach(([t,s])=>{const x=C.X(xm(t));ln([x,C.py+C.ph,x,C.py+C.ph+6],'rgba(255,255,255,.5)',1.5);wt(x,C.py+C.ph+28,s,16,'rgba(227,236,238,.85)',600,'center',COND);});
  const sR=seg(u,.06,.9);
  if(sR>0){ctx.beginPath();for(let i=0;i<=400*sR;i++){const t=Math.pow(10,i/400*LX)-1,x=C.X(xm(t)),y=C.Y(fEv(t));i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#fff';ctx.lineWidth=3.5;ctx.stroke();}
  alphaDo(seg(u,.3,.36),()=>{const x=C.X(xm(6)),y=C.Y(fEv(6));circ(x,y,7,'#ff9d7a');wt(x+14,y+24,trf('最低點 {f} Hz',{f:fEv(6).toFixed(2)}),16,'#ff9d7a',700,'left');});
  alphaDo(seg(u,.56,.62),()=>{const x=C.X(xm(40)),y=C.Y(fEv(40));circ(x,y,7,'#f2c230');wt(x-14,y-14,'一次調頻穩住',16,'#f2c230',700,'right');});
  alphaDo(seg(u,.86,.9),()=>{const x=C.X(xm(560)),y=C.Y(fEv(560));circ(x,y,7,'#7dffc4');wt(x-10,y-16,'回到 60 Hz',16,'#7dffc4',700,'right');});
  const RW=[[0,6,'慣量響應','旋轉動能自然釋放','#7dc8dc',.2],[2,60,'一次調頻','調速機依頻差自動增加出力','#f2c230',.42],[30,600,'二次調頻（AGC）','調度中心自動拉回 60 Hz','#7dffc4',.66]];
  RW.forEach(([t0,t1,n,ds,c,a0],i)=>alphaDo(seg(u,a0,a0+.06),()=>{const x0=C.X(xm(t0)),x1=C.X(xm(t1)),y=596+i*70;
   rrp(x0,y,x1-x0,60,6);ctx.fillStyle='rgba(7,27,39,.8)';ctx.fill();ctx.strokeStyle=c;ctx.lineWidth=2;ctx.stroke();box(x0,y,6,60,c);
   wt(x0+18,y+26,n,18,c,700);wt(x0+18,y+50,ds,16,'rgba(227,236,238,.9)',500);}));
  alphaDo(seg(u,.2,.26),()=>wt(60,628,'時間',16,'rgba(227,236,238,.7)',600));
 }},

{t:'中央調度中心',en:'The central dispatch center',dur:12,side:true,
 d:'台電中央調度中心 24 小時監看全台的頻率、負載與每一部機組。它依用電預測事先排定機組，保留足夠的備轉容量；AGC 每隔幾秒送出指令，調整頻控機組出力。近年台電也透過電力交易平台採購輔助服務，讓電池儲能、抽蓄水力與需量反應參與調頻與備轉。儲能反應最快，1 秒內就能動作，燃氣機組則在數分鐘內升載接手。',
 s:[[0,'調度中心 24 小時監看頻率與負載'],[.3,'AGC 每隔幾秒送出調整指令'],[.52,'儲能 1 秒內放電，先頂住缺口'],[.72,'燃氣機組在數分鐘內升載接手']],
 cam:u=>camMix({x:800,y:440,s:1.02},{x:780,y:450,s:1.1},ease(seg(u,.05,.4))),
 draw(u){
  const k=lerp(.55,.95,ease(seg(u,.72,.95))),b=band(u,.52,.9);
  scene({k,glint:true,lit:.2});
  const sig=seg(u,.3,.36);
  if(sig>0){const ax=990,ay=gyy(945)-180;ctx.save();ctx.setLineDash([10,8]);ctx.lineDashOffset=-TT*40;
   alphaDo(sig,()=>{ctx.strokeStyle='#e8572a';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(ax,ay);ctx.quadraticCurveTo(600,ay-150,290,gyy(180)-250);ctx.stroke();
    ctx.beginPath();ctx.moveTo(ax,ay);ctx.quadraticCurveTo(820,ay-40,705,gyy(705)-50);ctx.stroke();});ctx.restore();ctx.setLineDash([]);}
  flowDots(PBAT(),5,'#f2c230',b,.45);
  flowDots(PMAIN(),10,'#f2c230',seg(u,.72,.8),.25+.15*k);
  lab(945,gyy(945)-110,'中央調度中心',{dx:30,dy:-120,st:'s',a:band(u,.02,1)});
  lab(990,gyy(945)-180,'AGC 指令',{dx:80,dy:-30,st:'w',a:band(u,.3,.6)});
  lab(670,gyy(670)-40,'儲能：放電',{dx:-30,dy:-120,st:'g',a:band(u,.52,1)});
  lab(250,gyy(250)-240,'燃氣機組：升載',{dx:40,dy:-40,st:'s',a:band(u,.72,1)});
 },
 hud(u){hudPanel(240,150,'調度資訊（示例）',seg(u,.05,.1),w=>{const r=ease(seg(u,.52,.95));const f=lerp(59.9,60,r),p=Math.round(300*ease(seg(u,.3,.5)));
  hrow(56,'系統頻率',f.toFixed(2)+' Hz',w,f<59.97?'#ff8a60':'#7dffc4');hrow(88,'AGC 指令','+'+p+' MW',w,'#f2c230');hrow(120,'備轉容量率','≥ 10%',w,'#7dffc4');});}},

{t:'一天的負載與鴨子曲線',en:'The daily load and the duck curve',dur:14,
 d:'用電一天之中起伏明顯：清晨最低，午後冷氣全開時達到高峰，晚上仍維持高檔。太陽光電中午發電最多，把其他電廠需要供應的「淨負載」壓低；太陽下山後光電歸零，淨負載在傍晚快速上升。畫成圖時，中午凹下像鴨肚、傍晚翹起像鴨頭，稱為鴨子曲線。電網必須在兩、三個小時內升載數百萬瓩，這需要燃氣機組、抽蓄水力與儲能一起接力。',
 s:[[0,'一天的用電：清晨最低，午後最高'],[.28,'太陽光電中午發電最多'],[.5,'扣掉光電後的淨負載，形狀像一隻鴨子'],[.74,'傍晚太陽下山，淨負載快速上升']],
 draw(u){
  diagBG();
  const C=chartBox(60,160,1060,640,{title:'夏季平日的負載與光電（示意）',x0:0,x1:24,y0:0,y1:45,xt:[0,6,12,18,24],yt:[0,10,20,30,40],xl:'時',yl:'GW',pl:76,pt:60,pb:56,gx:4,gy:4});
  const line=(fn,H,col,lw,dash)=>{if(H<=0)return;ctx.beginPath();for(let h=0;h<=H;h+=.1){const x=C.X(h),y=C.Y(fn(h));h?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=col;ctx.lineWidth=lw;if(dash)ctx.setLineDash(dash);ctx.stroke();ctx.setLineDash([]);};
  const s1=seg(u,.02,.25),s2=seg(u,.28,.46),s3=seg(u,.5,.7);
  if(s2>0){ctx.beginPath();ctx.moveTo(C.X(0),C.Y(0));for(let h=0;h<=24*s2;h+=.1)ctx.lineTo(C.X(h),C.Y(solarAt(h)));ctx.lineTo(C.X(24*s2),C.Y(0));ctx.closePath();ctx.fillStyle='rgba(242,194,48,.35)';ctx.fill();line(solarAt,24*s2,'#f2c230',2.5);}
  line(loadAt,24*s1,'rgba(227,236,238,.9)',3,s3>0?[8,6]:null);
  line(netAt,24*s3,'#ff8a60',4);
  alphaDo(band(u,.14,.7),()=>wt(C.X(14.5),C.Y(loadAt(14.5))-14,'總用電',17,'#fff',700,'center'));
  alphaDo(seg(u,.4,.46),()=>wt(C.X(12),C.Y(solarAt(12))-14,'太陽光電',17,'#f2c230',700,'center'));
  alphaDo(seg(u,.62,.68),()=>wt(C.X(12.5),C.Y(netAt(12.5))+32,'淨負載',17,'#ff9d7a',700,'center'));
  const rp=seg(u,.74,.8);
  alphaDo(rp,()=>{const a=netAt(16),b=netAt(19.5);box(C.X(16),C.py,C.X(19.5)-C.X(16),C.ph,'rgba(232,87,42,.12)');arrow(C.X(17.7),C.Y(a)+10,C.X(17.7),C.Y(b)+6,'#e8572a',3);
   tag(C.X(17.7),C.Y(b)-34,trf('約 {n} 小時升載 {g} GW',{n:'3.5',g:(b-a).toFixed(1)}),{size:16,bg:'#e8572a',align:'center',fg:'#fff'});});
  /* 右：說明卡 */
  card(1160,160,380,640,{bg:'rgba(7,27,39,.75)'});wt(1184,200,'為什麼像鴨子？',20,'#f2c230',700);
  const T=[['中午','光電大量發電','淨負載凹下＝鴨肚','#f2c230',.5],['傍晚','光電歸零、用電仍高','淨負載翹起＝鴨頭','#ff9d7a',.74],['對策','燃氣、抽蓄、儲能','快速升載接力','#7dffc4',.86]];
  T.forEach(([h,l1,l2,c,a0],i)=>alphaDo(seg(u,a0,a0+.06),()=>{const y=250+i*170;card(1184,y,332,146,{bg:'rgba(255,255,255,.04)',st:c});wt(1206,y+38,h,20,c,700);wt(1206,y+76,l1,17,'#fff',600);wt(1206,y+110,l2,17,'rgba(227,236,238,.85)',500);}));
 }},

{t:'傍晚的接力',en:'The evening relay',dur:13,side:true,
 d:'傍晚是電網最忙碌的時段。太陽光電出力在一、兩個小時內從數百萬瓩降到零，城市的燈光卻一盞盞亮起。調度中心讓燃氣機組逐步升載、抽蓄水力轉為發電，儲能把中午存下的電放出來，全程維持頻率在 60 Hz 附近。再生能源越多，電網越需要這種靈活的資源；下一集將介紹虛擬電廠與需量反應，看用戶端如何一起幫忙平衡供需。',
 s:[[0,'下午四點，光電仍在發電'],[.3,'太陽西下，光電出力快速減少'],[.55,'燃氣升載、儲能放電，一起補上缺口'],[.8,'城市亮燈，頻率仍穩在 60 Hz']],
 base:u=>{const k=seg(u,.25,.85);landSky(GY,{sun:{x:lerp(1100,1480,seg(u,0,.85)),y:lerp(200,600,ease(seg(u,.05,.85)))},dusk:k,clouds:false});drawGround();},
 cam:u=>({x:800,y:440,s:1.02}),
 draw(u){
  const h=lerp(16,20,seg(u,.02,.95)),pv=solarAt(h)/11,k=lerp(.55,1,ease(seg(u,.4,.8))),dk=seg(u,.25,.85);
  scene({k,glint:pv>.3,lit:ease(seg(u,.5,.95))});
  alphaDo(dk*.3,()=>box(VX0,VY0,VX1-VX0,VY1-VY0,'#0e1a2a'));
  flowDots(PSOL(),5,'#7dffc4',clamp(pv*1.5),.3);
  flowDots(PBAT(),5,'#f2c230',seg(u,.55,.62),.45);
  flowDots(PMAIN(),10,'#f2c230',1,.25+.15*k);
  lab(440,gyy(440)-40,'光電出力下降',{dx:-20,dy:-110,st:'w',a:band(u,.3,.62)});
  lab(250,gyy(250)-240,'燃氣升載',{dx:50,dy:-40,st:'s',a:band(u,.55,1)});
  lab(670,gyy(670)-40,'儲能放電',{dx:10,dy:-110,st:'g',a:band(u,.58,1)});
  lab(1330,gyy(1330)-160,'城市亮燈',{dx:-20,dy:-70,st:'l',a:band(u,.8,1)});
 },
 hud(u){hudPanel(240,182,'傍晚供電（示意）',seg(u,.05,.1),w=>{const h=lerp(16,20,seg(u,.02,.95)),s=solarAt(h),bt=2*ease(seg(u,.55,.75));
  hrow(56,'時間',trf('{h}:{m}',{h:Math.floor(h),m:String(Math.floor((h%1)*60)).padStart(2,'0')}),w,'#fff');hrow(86,'太陽光電',s.toFixed(1)+' GW',w,'#f2c230');hrow(116,'儲能',bt.toFixed(1)+' GW',w,'#7dffc4');hrow(146,'其他電廠',(loadAt(h)-s-bt).toFixed(1)+' GW',w,'#ff9d7a');hrow(172,'頻率','60.00 Hz',w,'#7dffc4');});}}
]};
